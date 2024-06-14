'use server';

const env = process.env.NODE_ENV
import * as Sentry from "@sentry/nextjs";
import { ID, Query, AppwriteException } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { Supplier } from "@/types";
import { getStatusMessage, HttpStatusCode } from '../status-handler'; 
import { getBusinessId } from "./business.actions";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'

const {
    APPWRITE_DATABASE: DATABASE_ID,
    VENDORS_COLLECTION: VENDOR_COLLECTION_ID
} = process.env;

const checkRequirements = async (collectionId: string | undefined) => {
  if (!DATABASE_ID || !collectionId) throw new Error('Check requirements failed: Database ID or Collection ID is missing');

  const { database } = await createAdminClient();
  if (!database) throw new Error('Database client could not be initiated');

  const { userId } = auth();
  if (!userId) {
    throw new Error('You must be signed in to use this feature');
  }

  const businessId = await getBusinessId();
  if( !businessId ) throw new Error('Business ID could not be initiated');

  return { database, userId, businessId };
}

export const createItem = async (item: Supplier) => {
  const { database, businessId } = await checkRequirements(VENDOR_COLLECTION_ID);

    try {
      const newItem = await database.createDocument(
        DATABASE_ID!,
        VENDOR_COLLECTION_ID!,
        ID.unique(),
        {
          ...item,
          businessId: businessId
        }
      )
  
      return parseStringify(newItem);
    } catch (error: any) {
      let errorMessage = 'Something went wrong with your request, please try again later.';
      if (error instanceof AppwriteException) {
        errorMessage = getStatusMessage(error.code as HttpStatusCode);
      }

      if(env == "development"){ console.error(error); }

      Sentry.captureException(error);
      throw Error(errorMessage);
    }

    revalidatePath('/suppliers')
    redirect('/suppliers')
  }

export const list = async ( ) => {
  const { database, businessId } = await checkRequirements(VENDOR_COLLECTION_ID);
    try {
      const items = await database.listDocuments(
        DATABASE_ID,
        VENDOR_COLLECTION_ID,
        [Query.equal('businessId', businessId!)]
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

  export const getItems = async (
    q?: string,
    status?: boolean | null,
    limit?: number | null, 
    offset?: number | 1,
  ) => {
    const { database, businessId } = await checkRequirements(VENDOR_COLLECTION_ID);
  
    try {
      const queries = [];
      
      queries.push(Query.equal('businessId', businessId));
      queries.push(Query.orderDesc("$createdAt"));
      queries.push(Query.orderAsc("name"));

      if ( limit ) {
        queries.push(Query.limit(limit));
        queries.push(Query.offset(offset!));
      }
  
      if (q) {
        queries.push(Query.search('name', q));
      }
  
      if (status) {
        queries.push(Query.equal('status', status));
      }
  
      const items = await database.listDocuments(
        DATABASE_ID,
        VENDOR_COLLECTION_ID,
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
  const { database, businessId } = await checkRequirements(VENDOR_COLLECTION_ID);

    try {
      const item = await database.listDocuments(
        DATABASE_ID!,
        VENDOR_COLLECTION_ID!,
        [Query.equal('$id', id)]
      )
  
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

export const deleteItem = async ({ $id }: Supplier) => {
    const { database, businessId } = await checkRequirements(VENDOR_COLLECTION_ID);

    try {
      const item = await database.deleteDocument(
        DATABASE_ID!,
        VENDOR_COLLECTION_ID!,
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

export const updateItem = async (id: string, data: Supplier) => {
  const { database, businessId } = await checkRequirements(VENDOR_COLLECTION_ID);
  try {
    const item = await database.updateDocument(
      DATABASE_ID!,
      VENDOR_COLLECTION_ID!,
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
  revalidatePath('/suppliers')
  redirect('/suppliers')
}