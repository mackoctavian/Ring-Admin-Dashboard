'use server';

import { ID, Query, AppwriteException } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { DiscountDto, Discount } from "@/types";
import { getStatusMessage, HttpStatusCode } from '../status-handler'; 

const {
    APPWRITE_DATABASE: DATABASE_ID,
    DISCOUNTS_COLLECTION: DISCOUNTS_COLLECTION_ID
  } = process.env;


  export const createItem = async (item: DiscountDto) => {
    try {
      if (!DATABASE_ID || !DISCOUNTS_COLLECTION_ID) {
        throw Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();
  
      const newItem = await database.createDocument(
        DATABASE_ID!,
        DISCOUNTS_COLLECTION_ID!,
        ID.unique(),
        {
          ...item,
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
      if (!DATABASE_ID || !DISCOUNTS_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();

      const items = await database.listDocuments(
        DATABASE_ID,
        DISCOUNTS_COLLECTION_ID,
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
    if (!DATABASE_ID || !DISCOUNTS_COLLECTION_ID) {
      throw new Error('Database ID or Collection ID is missing');
    }
  
    try {
      const { database } = await createAdminClient();
  
      const queries = [];

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
        DISCOUNTS_COLLECTION_ID,
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
      if (!DATABASE_ID || !DISCOUNTS_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      if (!id) {
        throw new Error('Document ID is missing');
      }

      const { database } = await createAdminClient();
  
      const item = await database.listDocuments(
        DATABASE_ID!,
        DISCOUNTS_COLLECTION_ID!,
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

  export const deleteItem = async ({ $id }: Discount) => {
    try {
      if (!DATABASE_ID || !DISCOUNTS_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();
  
      const item = await database.deleteDocument(
        DATABASE_ID!,
        DISCOUNTS_COLLECTION_ID!,
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

  export const updateItem = async (id: string, data: DiscountDto) => {  
    try {
      if (!DATABASE_ID || !DISCOUNTS_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();
  
      const item = await database.updateDocument(
        DATABASE_ID!,
        DISCOUNTS_COLLECTION_ID!,
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