'use server';

const env = process.env.NODE_ENV
import * as Sentry from "@sentry/nextjs";
import { ID, Query, AppwriteException } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { Category } from "@/types";
import { CategoryType } from "@/types/data-schemas";
import { getStatusMessage, HttpStatusCode } from '../status-handler'; 
import { getBusinessId } from "./business.actions";

const {
    APPWRITE_DATABASE: DATABASE_ID,
    CATEGORIES_COLLECTION: CATEGORY_COLLECTION_ID
  } = process.env;

  const cleanCategoryData = (item: any) => {
    const { $databaseId, $collectionId, $id, $createdAt, $updatedAt, $permissions, ...cleanedItem } = item;
    return cleanedItem;
  };


  export const createItem = async (item: Category) => {
    try {
      if (!DATABASE_ID || !CATEGORY_COLLECTION_ID) {
        throw Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();
      const businessId = await getBusinessId();
      if( !businessId ) throw new Error('Business ID could not be initiated');

      const newItem = await database.createDocument(
        DATABASE_ID!,
        CATEGORY_COLLECTION_ID!,
        ID.unique(),
        {
          ...item,
          businessId: businessId,
          childrenCount: 0,
        }
      )

      //increment parent child count
      if ( item.parent ) {
        const parent : Category = await getItem(item.parent);
        parent.childrenCount = (parent.childrenCount || 0) + 1;
        await updateItem(item.parent, cleanCategoryData(parent));
      }
  
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
  }

export const list = async ( ) => {
  try {
    if (!DATABASE_ID || !CATEGORY_COLLECTION_ID) {
      throw new Error('Database ID or Collection ID is missing');
    }

    const { database } = await createAdminClient();
    const businessId = await getBusinessId();
    if( !businessId ) throw new Error('Business ID could not be initiated');

    const items = await database.listDocuments(
      DATABASE_ID,
      CATEGORY_COLLECTION_ID,
      [Query.equal('businessId', businessId!)]
    );

    return parseStringify(items.documents);

  }catch (error: any){
    console.error(error);
  }
};

  export const getItems = async (
    q?: string,
    parent?: string | null | 'IS_PARENT' | 'IS_CHILD',
    type?: CategoryType | null,
    status?: boolean | null,
    limit?: number | null, 
    offset?: number | 1,
  ) => {
    if (!DATABASE_ID || !CATEGORY_COLLECTION_ID) {
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


      //This is a parent element
      if ( parent === 'IS_PARENT'){
        queries.push( Query.greaterThan('childrenCount', 0) );
      }

      //This is a child element
      if ( parent === 'IS_CHILD'){
        queries.push( Query.equal('childrenCount', 0) );
      }

      //Select * with specific type
      if (type) {
        queries.push(Query.search('type', type));
      }

 
      if (q) {
        queries.push(Query.search('name', q));
      }
  
      if (status) {
        queries.push(Query.equal('status', status));
      }
        
      const items = await database.listDocuments(
        DATABASE_ID,
        CATEGORY_COLLECTION_ID,
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
  try {
    if (!DATABASE_ID || !CATEGORY_COLLECTION_ID) {
      throw new Error('Database ID or Collection ID is missing');
    }

    if (!id) {
      throw new Error('Document ID is missing');
    }

    const { database } = await createAdminClient();

    const item = await database.listDocuments(
      DATABASE_ID!,
      CATEGORY_COLLECTION_ID!,
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

export const deleteItem = async ({ $id }: Category) => {
  try {
    if (!DATABASE_ID || !CATEGORY_COLLECTION_ID) {
      throw new Error('Database ID or Collection ID is missing');
    }

    const { database } = await createAdminClient();

    const item = await database.deleteDocument(
      DATABASE_ID!,
      CATEGORY_COLLECTION_ID!,
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

export const updateItem = async (id: string, data: Category ) => {  
  try {
    if (!DATABASE_ID || !CATEGORY_COLLECTION_ID) {
      throw new Error('Database ID or Collection ID is missing');
    }

    const { database } = await createAdminClient();

    const item = await database.updateDocument(
      DATABASE_ID!,
      CATEGORY_COLLECTION_ID!,
      id,
      data);

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