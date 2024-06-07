'use server';

import { auth } from '@clerk/nextjs/server';
import { ID, Query, AppwriteException } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { Section, Business } from "@/types";
import { getStatusMessage, HttpStatusCode } from '../status-handler'; 
import { getCurrentBusiness } from "./business.actions";

const {
  APPWRITE_DATABASE: DATABASE_ID,
  SECTIONS_COLLECTION: SECTIONS_COLLECTION_ID
} = process.env;

export const createItem = async (item: Section) => {
  try {
    if (!DATABASE_ID || !SECTIONS_COLLECTION_ID) {
      throw Error('Database ID or Collection ID is missing');
    }

    const { database } = await createAdminClient();

    const newItem = await database.createDocument(
      DATABASE_ID!,
      SECTIONS_COLLECTION_ID!,
      ID.unique(),
      {
        ...item,
        businessId: item.branch.business.$id,
        branchId: item.branch.$id,
      }
    )

    return parseStringify(newItem);
  } catch (error: any) {
    let errorMessage = 'Something went wrong with your request, please try again later.';
    if (error instanceof AppwriteException) {
      errorMessage = getStatusMessage(error.code as HttpStatusCode);
    }
    throw Error(errorMessage);
  }
}

export const list = async ( ) => {
  try {
    if (!DATABASE_ID || !SECTIONS_COLLECTION_ID) throw new Error('Database ID or Collection ID is missing')
    const { database } = await createAdminClient();

    const businessData = await getCurrentBusiness();
    const businessId = businessData.$id;
    if (!businessId) throw new Error('Could not find the current business');

    const items = await database.listDocuments(
      DATABASE_ID,
      SECTIONS_COLLECTION_ID,
      [Query.equal('businessId', businessId)]
    );

    return parseStringify(items.documents);

  }catch (error: any){
    console.error(error);
  }
};

export const getItems = async (
  q?: string,
  status?: boolean | null,
  limit?: number | null, 
  offset?: number | 1,
) => {
  if (!DATABASE_ID || !SECTIONS_COLLECTION_ID) {
    throw new Error('Database ID or Collection ID is missing');
  }

  try {
    const { database } = await createAdminClient();

    const queries = [];

    const businessData = await getCurrentBusiness();
    const businessId = businessData.$id;
    if (!businessId) throw new Error('Could not find the current business');

    queries.push(Query.equal('businessId', businessId));
    queries.push(Query.orderDesc("$createdAt"));

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
      SECTIONS_COLLECTION_ID,
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
    throw Error(errorMessage);
  }
}

export const getItem = async (id: string) => {
  try {
    if (!DATABASE_ID || !SECTIONS_COLLECTION_ID) {
      throw new Error('Database ID or Collection ID is missing');
    }

    if (!id) {
      throw new Error('Document ID is missing');
    }

    const { database } = await createAdminClient();

    const item = await database.listDocuments(
      DATABASE_ID!,
      SECTIONS_COLLECTION_ID!,
      [Query.equal('$id', id)]
    )

    return parseStringify(item.documents[0]);
  } catch (error: any) {
    let errorMessage = 'Something went wrong with your request, please try again later.';
    if (error instanceof AppwriteException) {
      errorMessage = getStatusMessage(error.code as HttpStatusCode);
    }
    throw Error(errorMessage);
  }
}

export const deleteItem = async ({ $id }: Section) => {
  try {
    if (!DATABASE_ID || !SECTIONS_COLLECTION_ID) {
      throw new Error('Database ID or Collection ID is missing');
    }

    const { database } = await createAdminClient();

    const item = await database.deleteDocument(
      DATABASE_ID!,
      SECTIONS_COLLECTION_ID!,
      $id);

    return parseStringify(item);
  } catch (error: any) {
    let errorMessage = 'Something went wrong with your request, please try again later.';
    if (error instanceof AppwriteException) {
      errorMessage = getStatusMessage(error.code as HttpStatusCode);
    }
    throw Error(errorMessage);
  }
}

export const updateItem = async (id: string, data: Section) => {  
  try {
    if (!DATABASE_ID || !SECTIONS_COLLECTION_ID) {
      throw new Error('Database ID or Collection ID is missing');
    }

    const { database } = await createAdminClient();

    const item = await database.updateDocument(
      DATABASE_ID!,
      SECTIONS_COLLECTION_ID!,
      id,
      data);

    return parseStringify(item);
  } catch (error: any) {
    let errorMessage = 'Something went wrong with your request, please try again later.';
    if (error instanceof AppwriteException) {
      errorMessage = getStatusMessage(error.code as HttpStatusCode);
    }
    throw Error(errorMessage);
  }
}