'use server';

import {databaseCheck, handleError} from "@/lib/utils/actions-service";

import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import { Supplier } from "@/types";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'

const {
    VENDORS_COLLECTION: VENDOR_COLLECTION_ID
} = process.env;

export const createItem = async (item: Supplier) => {
  if (!item ) throw new Error('Supplier details required')
  const { database, businessId, databaseId, collectionId } = await databaseCheck(VENDOR_COLLECTION_ID, {needsBusinessId: true});

    try {
      await database.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        {
          ...item,
          businessId: businessId
        }
      )
    } catch (error: any) {
      handleError(error, "Error creating supplier:")
    }

    revalidatePath('/dashboard/suppliers')
    redirect('/dashboard/suppliers')
}

export const list = async ( ) => {
  const { database, businessId, databaseId, collectionId } = await databaseCheck(VENDOR_COLLECTION_ID, {needsBusinessId: true});

  try {
      const items = await database.listDocuments(
        databaseId,
        collectionId,
        [Query.equal('businessId', businessId!)]
      )

      if (items.documents.length == 0) return null

      return parseStringify(items.documents);
    } catch (error: any) {
      handleError(error, "Error listing suppliers:")
    }
}

export const getItems = async (
    q?: string,
    status?: boolean | null,
    limit?: number | null, 
    offset?: number | 1,
  ) => {
    const { database, businessId, databaseId, collectionId } = await databaseCheck(VENDOR_COLLECTION_ID, {needsBusinessId: true});
  
    try {
      const queries = [];
      
      queries.push(Query.equal('businessId', businessId!));
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
        databaseId,
        collectionId,
        queries
      );
  
      if (items.documents.length === 0) return null
  
      return parseStringify(items.documents);
    } catch (error: any) {
      handleError(error, "Error getting suppliers:")
    }
}

export const getItem = async (id: string) => {
  if (!id) return null;
  const { database, databaseId, collectionId } = await databaseCheck(VENDOR_COLLECTION_ID);

    try {
      const item = await database.listDocuments(
        databaseId,
        collectionId,
        [Query.equal('$id', id)]
      )

      if ( item.total == 0 ) return null;
  
      return parseStringify(item.documents[0]);
    } catch (error: any) {
      handleError(error, "Error getting supplier:")
    }
}

export const deleteItem = async (id : string) => {
  if (!id ) throw new Error('Supplier details required')
  const { database, databaseId, collectionId } = await databaseCheck(VENDOR_COLLECTION_ID);

    try {
      await database.deleteDocument(
        databaseId,
        collectionId,
        id)

    } catch (error: any) {
      handleError(error, "Error deleting supplier:")
    }

    revalidatePath('/dashboard/suppliers')
    redirect('/dashboard/suppliers')
}

export const updateItem = async (id: string, data: Supplier) => {
  if (!id || !data) throw new Error('Supplier details required')
  const { database, databaseId, collectionId } = await databaseCheck(VENDOR_COLLECTION_ID);
  try {
    await database.updateDocument(
      databaseId,
      collectionId,
      id,
      data);
  } catch (error: any) {
      handleError(error, "Error updating supplier:")
  }

  revalidatePath('/dashboard/suppliers')
  redirect('/dashboard/suppliers')
}