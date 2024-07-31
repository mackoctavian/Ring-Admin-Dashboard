'use server';

import {databaseCheck, handleError} from "@/lib/utils/actions-service";

import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import { Customer } from "@/types";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'

const {
    CUSTOMERS_COLLECTION: CUSTOMER_COLLECTION_ID
  } = process.env;

export const createItem = async (item: Customer) => {
  const { database, businessId, databaseId, collectionId } = await databaseCheck(CUSTOMER_COLLECTION_ID)

  try {
    await database.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      {
        ...item,
        lastVisitDate: new Date(),
        businessId: businessId,
        points: 0,
        totalSpend: 0,
        totalVisits: 1,
      }
    )
  } catch (error: any) {
    handleError(error, "Error creating customer:");
  }

  revalidatePath('/dashboard/customers')
  redirect('/dashboard/customers')
}

export const list = async ( ) => {
    const { database, businessId, databaseId, collectionId } = await databaseCheck(CUSTOMER_COLLECTION_ID)
    try {
      const items = await database.listDocuments(
        databaseId,
        collectionId,
        [Query.equal('businessId', businessId)]
      )

      if ( items.total == 0 ) return null;

      return parseStringify(items.documents);
    }catch (error: any){
      handleError(error, "Error listing customers:");
    }
}

export const getItems = async (
  q?: string,
  status?: boolean | null,
  limit?: number | null,
  offset?: number | 1,
) => {
    const { database, businessId, databaseId, collectionId } = await databaseCheck(CUSTOMER_COLLECTION_ID)
    try {
      const queries = []
      queries.push(Query.equal('businessId', businessId))
      queries.push(Query.orderAsc("name"))

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
      handleError(error, "Error getting customer data:");
    }
}

export const getItem = async (id: string) => {
  if (!id) return null;
  const { database, businessId, databaseId, collectionId } = await databaseCheck(CUSTOMER_COLLECTION_ID)

  try {
    const item = await database.listDocuments(
      databaseId,
      collectionId,
      [Query.equal('$id', id)]
    )

    if ( item.total == 0) return null

    return parseStringify(item.documents[0]);
  } catch (error: any) {
    handleError(error, "Error getting customer:");
  }
}

export const deleteItem = async ({ $id }: Customer) => {
  if (!$id) return null;
  const { database, businessId, databaseId, collectionId } = await databaseCheck(CUSTOMER_COLLECTION_ID)
  try {
    await database.deleteDocument(
      databaseId,
      collectionId,
      $id);
  } catch (error: any) {
    handleError(error, "Error deleting customer:");
  }

  revalidatePath('/dashboard/customers')
  redirect('/dashboard/customers')
}

export const updateItem = async (id: string, data: Customer) => {
  if (!id || !data) return null;
  const { database, businessId, databaseId, collectionId } = await databaseCheck(CUSTOMER_COLLECTION_ID)

    try {
      await database.updateDocument(
        databaseId,
        collectionId,
        id,
        data);
    } catch (error: any) {
      handleError(error, "Error updating customer:");
    }

    revalidatePath('/dashboard/customers')
    redirect('/dashboard/customers')
}