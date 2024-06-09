'use server';

import { ID, Query, AppwriteException } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { Staff } from "@/types";
import { getStatusMessage, HttpStatusCode } from '../status-handler'; 
import { getBusinessId } from "./business.actions";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'

const {
    APPWRITE_DATABASE: DATABASE_ID,
    STAFF_COLLECTION: STAFF_COLLECTION_ID
} = process.env;

const transformRelationships = (data: any) => {
  return {
    ...data,
    department: data.department
  };
};

  export const createItem = async (item: Staff) => {
    try {
      if (!DATABASE_ID || !STAFF_COLLECTION_ID) {
        throw Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();

      const businessId = await getBusinessId();
      if( !businessId ) throw new Error('Business ID could not be initiated');
  
      await database.createDocument(
        DATABASE_ID!,
        STAFF_COLLECTION_ID!,
        ID.unique(),
        {
          ...item,
          businessId: businessId,
        }
      )
    } catch (error: any) {
      console.error(parseStringify(error));
      
      let errorMessage = 'Something went wrong with your request, please try again later.';
      if (error instanceof AppwriteException) {
        errorMessage = getStatusMessage(error.code as HttpStatusCode);
      }
      throw Error(errorMessage);
    }

    revalidatePath('/staff')
  }

  export const list = async ( ) => {
    try {
      if (!DATABASE_ID || !STAFF_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();
      const businessId = await getBusinessId();
      if( !businessId ) throw new Error('Business ID could not be initiated');

      const items = await database.listDocuments(
        DATABASE_ID,
        STAFF_COLLECTION_ID,
        [Query.equal('businessId', businessId!)]
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
    if (!DATABASE_ID || !STAFF_COLLECTION_ID) {
      throw new Error('Database ID or Collection ID is missing');
    }
  
    try {
      const { database } = await createAdminClient();
  
      const queries = [];
      const businessId = await getBusinessId();
      if( !businessId ) throw new Error('Business ID could not be initiated');

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
        STAFF_COLLECTION_ID,
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
      if (!DATABASE_ID || !STAFF_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      if (!id) {
        throw new Error('Document ID is missing');
      }

      const { database } = await createAdminClient();
  
      const item = await database.listDocuments(
        DATABASE_ID!,
        STAFF_COLLECTION_ID!,
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

  export const deleteItem = async ({ $id }: Staff) => {
    try {
      if (!DATABASE_ID || !STAFF_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();
  
      const item = await database.deleteDocument(
        DATABASE_ID!,
        STAFF_COLLECTION_ID!,
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

  export const updateItem = async (id: string, data: Staff) => {  
    console.error(data);
    try {
      if (!DATABASE_ID || !STAFF_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const transformedData = transformRelationships(data);

      const { database } = await createAdminClient();

      await database.updateDocument(
        DATABASE_ID!,
        STAFF_COLLECTION_ID!,
        id,
        transformedData,
      );
  
      revalidatePath('/staff');
    } catch (error: any) {
      let errorMessage = 'Something went wrong with your request, please try again later.';
      if (error instanceof AppwriteException) {
        errorMessage = getStatusMessage(error.code as HttpStatusCode);
      }
      console.error(parseStringify(error));

      throw Error(errorMessage);
    }
  }