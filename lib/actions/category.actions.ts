'use server';

const env = process.env.NODE_ENV
import * as Sentry from "@sentry/nextjs";
import { ID, Query, AppwriteException } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { Category } from "@/types";
import { CategoryType } from "@/types/data-schemas";
import { getStatusMessage, HttpStatusCode } from '../status-handler'; 
import { auth } from "@clerk/nextjs/server";
import { getBusinessId } from "./business.actions";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'

const {
    APPWRITE_DATABASE: DATABASE_ID,
    CATEGORIES_COLLECTION: CATEGORY_COLLECTION_ID
  } = process.env;

  const cleanCategoryData = (item: any) => {
    const { $databaseId, $collectionId, $id, $createdAt, $updatedAt, $permissions, ...cleanedItem } = item;
    return cleanedItem;
  };

const checkRequirements = async (collectionId: string | undefined) => {
  if (!DATABASE_ID || !collectionId) throw new Error('Database ID or Collection ID is missing');

  const { database } = await createAdminClient();
  if (!database) throw new Error('Database client could not be initiated');

  const { userId } = auth();
  if (!userId) {
    throw new Error('You must be signed in to use this feature');
  }

  const businessId = await getBusinessId();
  if( !businessId ) throw new Error('Business ID could not be initiated');

  return { database, userId, businessId };
};


export const createItem = async (item: Category) => {
  const { database, businessId } = await checkRequirements(CATEGORY_COLLECTION_ID);

  const itemSlug = item.name.toLowerCase().replace(/\s+/g, '-');

  item.slug = item?.parent?.slug ? `${item.parent.slug}.${itemSlug}` : itemSlug;
  item.parentName = item?.parent?.name ? item.parent.name : '';
  item.parent = item?.parent?.$id ? item.parent.$id : null;

  try {
    await database.createDocument(
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
  } catch (error: any) {
    let errorMessage = 'Something went wrong with your request, please try again later.';
    if (error instanceof AppwriteException) {
      errorMessage = getStatusMessage(error.code as HttpStatusCode);
    }

    if(env == "development"){ console.error(error); }

    Sentry.captureException(error);
    throw Error(errorMessage);
  }

  revalidatePath('/dashboard/categories')
  redirect('/dashboard/categories')
}

export const list = async ( ) => {
  const { database, businessId } = await checkRequirements(CATEGORY_COLLECTION_ID);

  try {
    const items = await database.listDocuments(
      DATABASE_ID!,
      CATEGORY_COLLECTION_ID!,
      [Query.equal('businessId', businessId!)]
    );

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
};

  export const getItems = async (
    q?: string,
    parent?: string | null | 'IS_PARENT' | 'IS_CHILD',
    type?: CategoryType | null,
    status?: boolean | null,
    limit?: number | null, 
    offset?: number | 1,
  ) => {
    const { database, businessId } = await checkRequirements(CATEGORY_COLLECTION_ID);

    try {
      const queries = [];
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
        DATABASE_ID!,
        CATEGORY_COLLECTION_ID!,
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
  if (!id) return null;
  const { database, businessId } = await checkRequirements(CATEGORY_COLLECTION_ID);

  try {
    const item = await database.listDocuments(
      DATABASE_ID!,
      CATEGORY_COLLECTION_ID!,
      [
        Query.equal('$id', id),
        Query.equal('businessId', businessId),
      ]
    )

    if ( item.total < 1 ) return null;

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
  if (!$id) return null;
  const { database, businessId } = await checkRequirements(CATEGORY_COLLECTION_ID);

  try {
    await database.deleteDocument(
      DATABASE_ID!,
      CATEGORY_COLLECTION_ID!,
      $id);
  } catch (error: any) {
    let errorMessage = 'Something went wrong with your request, please try again later.';
    if (error instanceof AppwriteException) {
      errorMessage = getStatusMessage(error.code as HttpStatusCode);
    }

    if(env == "development"){ console.error(error); }

    Sentry.captureException(error);
    throw Error(errorMessage);
  }

  revalidatePath('/dashboard/categories')
  redirect('/dashboard/categories')
};

export const updateItem = async (id: string, data: Category ) => {
  if (!id || !data) return null;
  const { database, businessId } = await checkRequirements(CATEGORY_COLLECTION_ID);

  const itemSlug = data.name.toLowerCase().replace(/\s+/g, '-');

  data.slug = data?.parent?.slug ? `${data.parent.slug}.${itemSlug}` : itemSlug;
  data.parentName = data?.parent?.name ? data.parent.name : '';
  data.parent = data?.parent?.$id ? data.parent.$id : null;

  try {
    await database.updateDocument(
      DATABASE_ID!,
      CATEGORY_COLLECTION_ID!,
      id,
      data);

  } catch (error: any) {
    let errorMessage = 'Something went wrong with your request, please try again later.';
    if (error instanceof AppwriteException) {
      errorMessage = getStatusMessage(error.code as HttpStatusCode);
    }

    if(env == "development"){ console.error(error); }

    Sentry.captureException(error);
    throw Error(errorMessage);
  }
  revalidatePath('/dashboard/categories')
  redirect('/dashboard/categories')
};