'use server';

const env = process.env.NODE_ENV
import * as Sentry from "@sentry/nextjs";
import { ID, Query, AppwriteException } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { Stock } from "@/types";
import { CategoryType } from "@/types/data-schemas";
import { getStatusMessage, HttpStatusCode } from '../status-handler'; 
import { InventoryStatus } from "@/types/data-schemas";
import { getBusinessId } from "./business.actions";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'

const {
    APPWRITE_DATABASE: DATABASE_ID,
    INVENTORY_VARIANTS_COLLECTION: INVENTORY_COLLECTION_ID,
    STOCK_COLLECTION: STOCK_COLLECTION_ID,
    ALARM_QUANTITY = 3
} = process.env;

const checkRequirements = async (collectionId: string | undefined) => {
  if (!DATABASE_ID || !collectionId) throw new Error('Database ID or Collection ID is missing');

  const { database } = await createAdminClient();
  if (!database) throw new Error('Database client could not be initiated');

  const { userId } = auth();
  if (!userId) {
    throw new Error('You must be signed in to use this feature');
  }

  const businessId = await getBusinessId();
  if( !businessId ) throw new Error('Business ID could not be initiated');

  return { database, userId, businessId };
};

export const createItem = async (items: Stock[]) => {
  const { database, businessId } = await checkRequirements(STOCK_COLLECTION_ID)
  const alarmQuantity = ALARM_QUANTITY || 10;

  try {
    for (const item of items) {
      // Ensure quantities and values are parsed correctly and are numbers
      const newQuantity = item.quantity || 0;
      const newValue = item.value || 0;

      const currentQuantity = parseInt(item.item.quantity) || 0;
      const currentActualQuantity = parseInt(item.item.actualQuantity) || 0;

      const currentValue = parseFloat(item.item.value) || 0;
      const currentActualValue = parseFloat(item.item.actualValue) || 0;

      // Increase item quantity
      if (currentActualQuantity < 0) {
          // This means usage had previously exceeded items in stock, so reduce the negative first
          item.item.actualQuantity = currentActualQuantity + newQuantity;
          if (item.item.actualQuantity >= 0) {
              item.item.quantity = item.item.actualQuantity;
          } else {
              item.item.quantity = 0;
          }
      } else {
          // Increase quantity, value, and actual quantity
          item.item.actualQuantity = currentActualQuantity + newQuantity;
          item.item.quantity = currentQuantity + newQuantity;
      }

      // Update value
      if (currentActualValue < 0) {
          // Determine value per item and reduce negative value first
          const valuePerItem = newValue / newQuantity;
          item.item.actualValue = currentActualValue + newValue;

          if (item.item.actualValue >= 0) {
              item.item.value = item.item.actualValue;
          } else {
              item.item.value = 0;
          }
      } else {
          item.item.actualValue = currentActualValue + newValue;
          item.item.value = currentValue + newValue;
      }

      // If actual quantity is still less than zero after the update, then leave quantity as is
      if (item.item.actualQuantity < 0) {
          item.item.quantity = 0;
      } else {
          item.item.quantity = item.item.actualQuantity;
      }

      // If actual value is still less than zero after the update, then leave value as is
      if (item.item.actualValue < 0) {
          item.item.value = 0;
      } else {
          item.item.value = item.item.actualValue;
      }

      // Update stock status
      if (item.item.quantity === 0) {
          item.item.status = InventoryStatus.OUT_OF_STOCK;
      } else if (item.item.quantity <= item.item.lowQuantity) {
          item.item.status = InventoryStatus.LOW_STOCK;
      } else if (item.item.quantity <= item.item.lowQuantity + alarmQuantity) {
          item.item.status = InventoryStatus.ALARM;
      } else {
          item.item.status = InventoryStatus.IN_STOCK;
      }

        await database.createDocument(
          DATABASE_ID!,
          STOCK_COLLECTION_ID!,
          ID.unique(),
          {
            ...item,
            businessId: businessId,
          }
        )
    }
   } catch (error: any) {
      let errorMessage = 'Something went wrong with your request, please try again later.';
      if (error instanceof AppwriteException) {
        errorMessage = getStatusMessage(error.code as HttpStatusCode);
      }

      if(env == "development"){ console.error(error); }

      Sentry.captureException(error);
      throw Error(errorMessage);
  }

    revalidatePath('/stock')
    redirect('/stock')
}

// List items
export const list = async ( ) => {
  const { database, businessId } = await checkRequirements(STOCK_COLLECTION_ID)

    try {
      const items = await database.listDocuments(
        DATABASE_ID!,
        STOCK_COLLECTION_ID!,
        [Query.equal('businessId', businessId)],
      );

      return parseStringify(items.documents);

    } catch (error: any) {
      let errorMessage = 'Something went wrong with your request, please try again later.';
      if (error instanceof AppwriteException) {
        errorMessage = getStatusMessage(error.code as HttpStatusCode);
      }

      if(env == "development"){ console.error(error); }

      Sentry.captureException(error);
      throw Error(errorMessage);
    }
}

//Get paginated items
export const getItems = async (
    q?: string,
    parent?: string | null | 'NOT_EMPTY',
    type?: CategoryType | null,
    status?: boolean | null,
    limit?: number | null, 
    offset?: number | 1,
  ) => {
    const { database, businessId } = await checkRequirements(STOCK_COLLECTION_ID)

    try {
      const queries = [];
      queries.push(Query.equal('businessId', businessId));
      queries.push(Query.orderDesc("$createdAt"));

      if ( limit ) {
        queries.push(Query.limit(limit));
        queries.push(Query.offset(offset!));
      }

      if (q) {
        //queries.push(Query.search('item.name', q));
      }

      if (status) {
        queries.push(Query.equal('status', status));
      }

      const items = await database.listDocuments(
        DATABASE_ID!,
        STOCK_COLLECTION_ID!,
        queries
      );

      if (items.documents.length === 0) {
        return [];
      }

      return parseStringify(items.documents);
    } catch (error: any) {
      let errorMessage = 'Something went wrong with your request, please try again later.';
      if (error instanceof AppwriteException) {
        errorMessage = getStatusMessage(error.code as HttpStatusCode);
      }

      if(env == "development"){ console.error(error); }

      Sentry.captureException(error);

      throw Error(errorMessage);
    }
  }

  export const getItem = async (id: string) => {
      const { database, businessId } = await checkRequirements(STOCK_COLLECTION_ID)

      try {
        const item = await database.listDocuments(
          DATABASE_ID!,
          STOCK_COLLECTION_ID!,
          [
            Query.equal('$id', id),
            Query.equal('businessId', businessId)
          ]
        )

        if ( item.total < 1 ) return null;

        return parseStringify(item.documents[0]);
      } catch (error: any) {
        let errorMessage = 'Something went wrong with your request, please try again later.';
        if (error instanceof AppwriteException) {
          errorMessage = getStatusMessage(error.code as HttpStatusCode);
        }

        if(env == "development"){ console.error(error); }

        Sentry.captureException(error);
        throw Error(errorMessage);
      }
  }

export const deleteItem = async ({ $id }: Stock) => {
    if (!$id) return null;
    const { database } = await checkRequirements(STOCK_COLLECTION_ID)

    try {
      const item = await database.deleteDocument(
        DATABASE_ID!,
        STOCK_COLLECTION_ID!,
        $id);

      return parseStringify(item);
    } catch (error: any) {
      let errorMessage = 'Something went wrong with your request, please try again later.';
      if (error instanceof AppwriteException) {
        errorMessage = getStatusMessage(error.code as HttpStatusCode);
      }

      if(env == "development"){ console.error(error); }

      Sentry.captureException(error);
      throw Error(errorMessage);
    }
}

export const updateItem = async (id: string, data: Stock) => {
  if (!id || !data) return null;
  const { database } = await checkRequirements(STOCK_COLLECTION_ID)

  try {
    await database.updateDocument(
      DATABASE_ID!,
      STOCK_COLLECTION_ID!,
      id,
      data);

  } catch (error: any) {
    let errorMessage = 'Something went wrong with your request, please try again later.';
      if (error instanceof AppwriteException) {
        errorMessage = getStatusMessage(error.code as HttpStatusCode);
      }

      if(env == "development"){ console.error(error); }

      Sentry.captureException(error);
      throw Error(errorMessage);
  }

  revalidatePath('/stock')
  redirect('/stock')
}