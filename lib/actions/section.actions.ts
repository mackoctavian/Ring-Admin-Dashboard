'use server';

import {databaseCheck, handleError} from "@/lib/utils/actions-service";

import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import { Section } from "@/types";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'

const {
  SECTIONS_COLLECTION: SECTIONS_COLLECTION_ID
} = process.env;

export const createItem = async (item: Section) => {
  const { database, businessId, databaseId, collectionId } = await databaseCheck(SECTIONS_COLLECTION_ID, {needsBusinessId: true});

  try {
    await database.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      {
        ...item,
        businessId: businessId,
        branchId: item.branch,
      }
    )
  } catch (error: any) {
    handleError(error, "Error creating space / section");
  }

  revalidatePath('/dashboard/sections')
  redirect('/dashboard/sections')
}

export const list = async ( ) => {
  const { database, businessId, databaseId, collectionId } = await databaseCheck(SECTIONS_COLLECTION_ID, {needsBusinessId: true});

  try {
    const items = await database.listDocuments(
      databaseId,
      collectionId,
      [Query.equal('businessId', businessId!)]
    )

    if ( items.total == 0 ) return null;

    return parseStringify(items.documents);
  }catch (error: any){
    handleError(error, "Error listing space / sections");
  }
};

export const getItems = async (
  q?: string,
  status?: boolean | null,
  limit?: number | null, 
  offset?: number | 1,
) => {
  const { database, businessId, databaseId, collectionId } = await databaseCheck(SECTIONS_COLLECTION_ID, {needsBusinessId: true});

  try {
    const queries = [];
    queries.push(Query.equal('businessId', businessId!));
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
      databaseId,
      collectionId,
      queries
    );

    if ( items.total == 0 ) return null;

    return parseStringify(items.documents);
  }catch (error: any){
    handleError(error, "Error getting spaces / sections");
  }
}

export const getItem = async (id: string) => {
  if (!id) return null;
  const { database, databaseId, collectionId } = await databaseCheck(SECTIONS_COLLECTION_ID);

  try {
    const item = await database.listDocuments(
      databaseId,
      collectionId,
      [Query.equal('$id', id)]
    )

    if ( item.total == 0 ) return null;

    return parseStringify(item.documents[0]);
  } catch (error: any) {
    handleError(error, "Error getting space / section");
  }
}

export const deleteItem = async ({ $id }: Section) => {
  if (!$id) return null;
  const { database, databaseId, collectionId } = await databaseCheck(SECTIONS_COLLECTION_ID);

  try {
    await database.deleteDocument(
      databaseId,
      collectionId,
      $id);
  } catch (error: any) {
    handleError(error, "Error deleting space / section");
  }

  revalidatePath('/dashboard/sections')
  redirect('/dashboard/sections')
}

export const updateItem = async (id: string, data: Section) => {
  if (!id || !data) return null;
  const { database, databaseId, collectionId } = await databaseCheck(SECTIONS_COLLECTION_ID);

  try {
    await database.updateDocument(
      databaseId,
      collectionId,
      id,
      data);
  } catch (error: any) {
    handleError(error, "Error updating space / section");
  }

  revalidatePath('/dashboard/sections')
  redirect('/dashboard/sections')
}