'use server';

import {databaseCheck, handleError} from "@/lib/utils/actions-service";

import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import {Modifier} from "@/types";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'

const {
    MODIFIERS_COLLECTION: MODIFIERS_COLLECTION_ID,
} = process.env;

export const createItem = async (item: Modifier): Promise<void> => {
  const { database, businessId, databaseId, collectionId } = await databaseCheck(MODIFIERS_COLLECTION_ID);

  try {
    await database.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      {
        ...item,
        businessId: businessId
      }
    );
  } catch (error: any) {
    handleError(error, "Error creating modifier")
  }

  revalidatePath('/dashboard/modifiers')
  redirect('/dashboard/modifiers')
}

export const list = async () => {
  const { database, businessId, databaseId, collectionId } = await databaseCheck(MODIFIERS_COLLECTION_ID);

  try {
    const items = await database.listDocuments(
      databaseId,
      collectionId,
      [
        Query.orderAsc("name"),
        Query.equal('businessId', businessId!)
      ]
    )

    if (items.documents.length < 0) return null

    return parseStringify(items.documents);
  } catch (error: any) {
    handleError(error, "Error listing modifiers")
  }
}

export const getItems = async (q?: string, status?: boolean | null, limit?: number | null, offset?: number | 1) => {
  const { database, businessId, databaseId, collectionId } = await databaseCheck(MODIFIERS_COLLECTION_ID);

    try {
      const queries = [];
      queries.push(Query.equal("businessId", businessId));
      queries.push(Query.orderDesc("$createdAt"));

      if (limit) {
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
        databaseId,
        collectionId,
        queries
      );
  
      if (items.documents.length === 0) return null
  
      return parseStringify(items.documents);
    } catch (error: any) {
      handleError(error, "Error getting modifiers")
    }
}

export const getItem = async (id: string) => {
  if (!id) return null;
  const { database, businessId, databaseId, collectionId } = await databaseCheck(MODIFIERS_COLLECTION_ID);

  try {
    const item = await database.listDocuments(
      databaseId,
      collectionId,
      [Query.equal('$id', id)]
    )
    if ( item.total < 1 ) return null;
    
    return parseStringify(item.documents[0]);
  } catch (error: any) {
    handleError(error, "Error getting modifier item")
  }
}

export const deleteItem = async ({ $id }: Modifier) => {
  if (!$id) throw new Error('Modifier id is missing')
  const { database, businessId, databaseId, collectionId } = await databaseCheck(MODIFIERS_COLLECTION_ID);

  try {
    const item = await database.deleteDocument(
      databaseId,
      collectionId,
      $id
    )
  } catch (error: any) {
    handleError(error, "Error deleting modifier")
  }

  revalidatePath('/dashboard/modifiers')
  redirect('/dashboard/modifiers')
}

export const updateItem = async (id: string, data: Modifier) => {
  if (!id) throw new Error('Modifier id is missing')
  const { database, businessId, databaseId, collectionId } = await databaseCheck(MODIFIERS_COLLECTION_ID);

  try {
  
    await database.updateDocument(
      databaseId,
      collectionId,
      id,
      data
    );

  } catch (error: any) {
    handleError(error, "Error updating modifier")
  }

  revalidatePath('/dashboard/modifiers')
  redirect('/dashboard/modifiers')
}