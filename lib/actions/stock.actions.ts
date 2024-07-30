'use server';

import {databaseCheck, handleError} from "@/lib/utils/actions-service";

import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import { Stock } from "@/types";
import { CategoryType } from "@/types/data-schemas";
import { InventoryStatus } from "@/types/data-schemas";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'
import {getInventoryVariant} from "@/lib/actions/inventory.actions";

const {
    STOCK_COLLECTION: STOCK_COLLECTION_ID,
    ALARM_QUANTITY = 3
} = process.env;

export const createItem = async (items: Stock[]) => {
    const { database, businessId, databaseId, collectionId } = await databaseCheck(STOCK_COLLECTION_ID);
    const alarmQuantity = ALARM_QUANTITY || 10;

  try {
    for (const item of items) {
      // Ensure quantities and values are parsed correctly and are numbers
      const newQuantity = item.quantity || 0;
      const newValue = item.value || 0;

      const inventoryItem = await getInventoryVariant(item.item);

      const currentQuantity = parseInt(inventoryItem.quantity) || 0;
      const currentActualQuantity = parseInt(inventoryItem.actualQuantity) || 0;

      const currentValue = parseFloat(inventoryItem.value) || 0;
      const currentActualValue = parseFloat(inventoryItem.actualValue) || 0;

      // Increase item quantity
      if (currentActualQuantity < 0) {
          // This means usage had previously exceeded items in stock, so reduce the negative first
          inventoryItem.actualQuantity = currentActualQuantity + newQuantity;
          if (inventoryItem.actualQuantity >= 0) {
              inventoryItem.quantity = inventoryItem.actualQuantity;
          } else {
              inventoryItem.quantity = 0;
          }
      } else {
          // Increase quantity, value, and actual quantity
          inventoryItem.actualQuantity = currentActualQuantity + newQuantity;
          inventoryItem.quantity = currentQuantity + newQuantity;
      }

      // Update value
      if (currentActualValue < 0) {
          // Determine value per item and reduce negative value first
          const valuePerItem = newValue / newQuantity;
          inventoryItem.actualValue = currentActualValue + newValue;

          if (inventoryItem.actualValue >= 0) {
              inventoryItem.value = inventoryItem.actualValue;
          } else {
              inventoryItem.value = 0;
          }
      } else {
          inventoryItem.actualValue = currentActualValue + newValue;
          inventoryItem.value = currentValue + newValue;
      }

      // If actual quantity is still less than zero after the update, then leave quantity as is
      if (inventoryItem.actualQuantity < 0) {
          inventoryItem.quantity = 0;
      } else {
          inventoryItem.quantity = inventoryItem.actualQuantity;
      }

      // If actual value is still less than zero after the update, then leave value as is
      if (inventoryItem.actualValue < 0) {
          inventoryItem.value = 0;
      } else {
          inventoryItem.value = inventoryItem.actualValue;
      }

      // Update stock status
      if (inventoryItem.quantity === 0) {
          inventoryItem.status = InventoryStatus.OUT_OF_STOCK;
      } else if (inventoryItem.quantity <= inventoryItem.lowQuantity) {
          inventoryItem.status = InventoryStatus.LOW_STOCK;
      } else if (inventoryItem.quantity <= inventoryItem.lowQuantity + alarmQuantity) {
          inventoryItem.status = InventoryStatus.ALARM;
      } else {
          inventoryItem.status = InventoryStatus.IN_STOCK;
      }

        await database.createDocument(
          databaseId,
          collectionId,
          ID.unique(),
          {
            ...item,
            businessId: businessId,
          }
        )
    }
   } catch (error: any) {
      handleError(error, "Error recording stock intake")
  }

    revalidatePath('/dashboard/stock')
    redirect('/dashboard/stock')
}

// List items
export const list = async ( ) => {
    const { database, businessId, databaseId, collectionId } = await databaseCheck(STOCK_COLLECTION_ID);

    try {
      const items = await database.listDocuments(
        databaseId,
        collectionId,
        [Query.equal('businessId', businessId)],
      );

      if (items.documents.length == 0) return null

      return parseStringify(items.documents);

    } catch (error: any) {
      handleError(error, "Error listing stock intake:")
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
    const { database, businessId, databaseId, collectionId } = await databaseCheck(STOCK_COLLECTION_ID);

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
        databaseId,
        collectionId,
        queries
      );

      if( items.documents.length == 0 ) return null

      return parseStringify(items.documents);
    } catch (error: any) {
      handleError(error, "Error getting stock intake data")
    }
  }

export const getItem = async (id: string) => {
    if (!id) return null;
    const { database, businessId, databaseId, collectionId } = await databaseCheck(STOCK_COLLECTION_ID);
    try {
        const item = await database.listDocuments(
          databaseId,
          collectionId,
          [
            Query.equal('$id', id),
            Query.equal('businessId', businessId)
          ]
        )

        if ( item.total < 1 ) return null;

        return parseStringify(item.documents[0]);
    } catch (error: any) {
        handleError(error, "Error getting stock intake item")
    }
}