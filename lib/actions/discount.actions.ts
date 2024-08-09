'use server';

import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import { DiscountDto, Discount } from "@/types";
import {databaseCheck, handleError} from "@/lib/utils/actions-service";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

const {
  DISCOUNTS_COLLECTION: DISCOUNTS_COLLECTION_ID,
} = process.env;

export const createItem = async (item: DiscountDto) => {
  if( !item ) return null;

  const { database, databaseId, collectionId } = await databaseCheck(DISCOUNTS_COLLECTION_ID);

  try {
    await database.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      {
        ...item,
      }
    )
  } catch (error: any) {
    handleError(error, "Error creating discount item");
  }

  revalidatePath('/dashboard/discounts')
  redirect('/dashboard/discounts')
}

export const list = async ( ) => {
  const { database, databaseId, collectionId } = await databaseCheck(DISCOUNTS_COLLECTION_ID);

  try {
    const items = await database.listDocuments(
      databaseId,
      collectionId,
    );

    if (items.length === 0) return null;

    return parseStringify(items.documents);
  }catch (error: any){
    handleError(error, "Error listing discounts");
  }
}

export const getItems = async (
  q?: string,
  status?: boolean | null,
  limit?: number | null, 
  offset?: number | 1,
) => {
  const { database, databaseId, collectionId } = await databaseCheck(DISCOUNTS_COLLECTION_ID);

  try {
    const queries = [];
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

    if (items.documents.length === 0) return null

    return parseStringify(items.documents);
  } catch (error: any) {
    handleError(error, "Error getting discount items");
  }
}

export const getItem = async (id: string) => {
  if( !id ) return null;

  const { database, databaseId, collectionId } = await databaseCheck(DISCOUNTS_COLLECTION_ID);

  try {
    const item = await database.listDocuments(
      databaseId,
      collectionId,
      [Query.equal('$id', id)]
    )

    if ( item.total == 0 ) return null;

    return parseStringify(item.documents[0]);
  } catch (error: any) {
    handleError(error, 'Error getting discount item');
  }
}

export const deleteItem = async ({ $id }: Discount) => {
  if( !$id ) return null;

  const { database, databaseId, collectionId } = await databaseCheck(DISCOUNTS_COLLECTION_ID);

  try {
    await database.deleteDocument(
      databaseId,
      collectionId,
      $id);

  } catch (error: any) {
    handleError(error, 'Error deleting discount')
  }

  revalidatePath('/dashboard/discounts')
  redirect('/dashboard/discounts')
}

export const updateItem = async (id: string, data: DiscountDto) => {
  if( !id || !data ) return null;
  const { database, databaseId, collectionId } = await databaseCheck(DISCOUNTS_COLLECTION_ID);

  try {
    await database.updateDocument(
      databaseId,
      collectionId,
      id,
      data);
  } catch (error: any) {
    handleError(error, 'Error updating discount item')
  }

  revalidatePath('/dashboard/discounts')
  redirect('/dashboard/discounts')
}