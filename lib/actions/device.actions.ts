'use server';

import {databaseCheck, handleError} from "@/lib/utils/actions-service";

import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import { Device } from "@/types";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'

const {
    DEVICES_COLLECTION: DEVICES_COLLECTION_ID,
  } = process.env;

export const createItem = async (item: Device) => {
  const { database, businessId, databaseId, collectionId } = await databaseCheck(DEVICES_COLLECTION_ID);

  try {
    await database.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      {
        ...item,
        businessId,
        branch: item.branchId,
        lastSync: new Date(),
        status: false,
        forceSync: true
      }
    )
  } catch (error: any) {
    handleError(error, "Error registering device");
  }
  revalidatePath('/dashboard/settings/devices')
  redirect('/dashboard/settings/devices')
}

export const list = async ( ) => {
  const { database, businessId, databaseId, collectionId } = await databaseCheck(DEVICES_COLLECTION_ID);

  try {
    const items = await database.listDocuments(
      databaseId,
      collectionId,
      [
        Query.orderAsc("$createdAt"),
        Query.equal('businessId', businessId)
      ]
    )

    if (items.documents.length == 0) return null

    return parseStringify(items.documents);

  }catch (error: any){
    handleError(error, "Error listing devices");
  }
}

export const getItems = async (
    q?: string,
    status?: boolean | null,
    limit?: number | null, 
    offset?: number | 1,
  ) => {

  const { database, businessId, databaseId, collectionId } = await databaseCheck(DEVICES_COLLECTION_ID);
    try {
       const queries = [];

       queries.push(Query.equal('businessId', [businessId]));
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
  
       if(items.documents.length == 0) return null
  
       return parseStringify(items.documents);
    } catch (error: any) {
      handleError(error, "Error getting devices");
    }
  }

  export const getItem = async (id: string) => {
    if (!id) return null;
    const { database, businessId, databaseId, collectionId } = await databaseCheck(DEVICES_COLLECTION_ID);

    try {
      const item = await database.listDocuments(
        databaseId,
        collectionId,
        [Query.equal('$id', id)]
      )
    
      if( item.documents.length == 0 ) return null;
      
      return parseStringify(item.documents[0]);
    } catch (error: any) {
      handleError(error, "Error getting device details");
    }
  }

  export const deleteItem = async ({ $id }: Device) => {
    if (!$id) return null;
    const { database, businessId, databaseId, collectionId } = await databaseCheck(DEVICES_COLLECTION_ID);

    try {
      await database.deleteDocument(
        databaseId,
        collectionId,
        $id);
  
    } catch (error: any) {
      handleError(error, "Error deleting device");
    }

    revalidatePath('/dashboard/settings/devices')
    redirect('/dashboard/settings/devices')
  }

export const updateItem = async (id: string, data: Device) => {
  if (!id || !data ) return null;
  const { database, businessId, databaseId, collectionId } = await databaseCheck(DEVICES_COLLECTION_ID);

  try {
    await database.updateDocument(
      databaseId,
      collectionId,
      id,
      data);

  } catch (error: any) {
    handleError(error, "Error updating device");
  }

  revalidatePath('/dashboard/settings/devices')
  redirect('/dashboard/settings/devices')
}