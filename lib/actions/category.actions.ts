'use server';

import {databaseCheck, handleError} from "@/lib/utils/actions-service";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import { Category } from "@/types";
import { CategoryType } from "@/types/data-schemas";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'

const {
    CATEGORIES_COLLECTION: CATEGORY_COLLECTION_ID
} = process.env;

export const createItem = async (item: Category): Promise<void> => {
  const { database, businessId, databaseId, collectionId } = await databaseCheck(CATEGORY_COLLECTION_ID);

  const itemSlug = item.name.toLowerCase().replace(/\s+/g, '-');

  try {
    if (item.parent) {
      const parent = await getItem(item.parent);

      if (parent) {
        item.slug = `${parent.slug}.${itemSlug}`;
        item.parentName = parent.name;
        item.parent = parent.$id;
        parent.childrenCount++;

        // Update parent document
        await database.updateDocument(
            databaseId,
            collectionId,
            parent.$id,
            { childrenCount: parent.childrenCount }
        );
      } else {
        item.slug = itemSlug;
        item.parentName = '';
      }
    } else {
      item.slug = itemSlug;
      item.parentName = '';
    }

    await database.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        {
          ...item,
          businessId,
          childrenCount: 0,
        }
    );
  } catch (error) {
    handleError(error)
  }

  revalidatePath('/dashboard/categories');
  redirect('/dashboard/categories');
}

export const list = async () => {
  const { database, businessId, databaseId, collectionId } = await databaseCheck(CATEGORY_COLLECTION_ID);

  try {
    const items = await database.listDocuments(
        databaseId,
        collectionId,
        [
            Query.equal('businessId', businessId!),
            Query.orderAsc("name")
        ]
    )

    if (items.documents.length < 0) return null

    return parseStringify(items.documents);

  } catch (error: any) {
    handleError(error)
  }
}

export const getItems = async (
    q?: string,
    parent?: string | null | 'IS_PARENT' | 'IS_CHILD',
    type?: CategoryType | null,
    status?: boolean | null,
    limit?: number | null, 
    offset?: number | 1,
  ) => {
    const { database, businessId, databaseId, collectionId } = await databaseCheck(CATEGORY_COLLECTION_ID);

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
        databaseId,
        collectionId,
        queries
      );

      if( items.documents.length < 0 ) return null

    return parseStringify(items.documents);
  } catch (error: any) {
      handleError(error)
  }
}

export const getItem = async (id: string) => {
  if (!id) return null;
  const { database, businessId, databaseId, collectionId } = await databaseCheck(CATEGORY_COLLECTION_ID)

  try {
    const item = await database.listDocuments(
      databaseId,
      collectionId,
      [
        Query.equal('$id', id),
        Query.equal('businessId', businessId),
      ]
    )

    if ( item.total < 1 ) return null;

    return parseStringify(item.documents[0]);
  } catch (error: any) {
    handleError(error)
  }
}

export const deleteItem = async ({ $id }: Category) => {
  if (!$id) return null;
  const { database, businessId, databaseId, collectionId } = await databaseCheck(CATEGORY_COLLECTION_ID)

  try {
    await database.deleteDocument(
      databaseId,
      collectionId,
      $id);
  } catch (error: any) {
    handleError(error)
  }

  revalidatePath('/dashboard/categories')
  redirect('/dashboard/categories')
}

export const updateItem = async (id: string, data: Category): Promise<void> => {
  const { database, databaseId, collectionId } = await databaseCheck(CATEGORY_COLLECTION_ID);

  try {
    // Fetch the current item
    const currentItem = await getItem(id);
    if (!currentItem) {
      throw new Error('Item not found');
    }

    // Update slug if name has changed
    if (data.name !== currentItem.name) {
       const newSlug = data.name.toLowerCase().replace(/\s+/g, '-');
       data.slug = currentItem.parent
           ? `${(currentItem.slug || '').split('.').slice(0, -1).join('.')}/${newSlug}`
           : newSlug;
    }

    // Handle parent changes
    if (data.parent !== currentItem.parent) {
      // Decrement old parent's childrenCount
      if (currentItem.parent) {
        const oldParent = await getItem(currentItem.parent);
        if (oldParent) {
          await database.updateDocument(
              databaseId,
              collectionId,
              oldParent.$id,
              { childrenCount: (oldParent.childrenCount || 0) - 1 }
          );
        }
      }

      // Increment new parent's childrenCount and update slug
      if (data.parent) {
        const newParent = await getItem(data.parent);
        if (newParent) {
          await database.updateDocument(
              databaseId,
              collectionId,
              newParent.$id,
              { childrenCount: (newParent.childrenCount || 0) + 1 }
          );
          data.slug = `${newParent.slug || ''}/${(data.slug || '').split('/').pop() || ''}`.replace(/^\/+|\/+$/g, '');
          data.parentName = newParent.name || '';
        }
      } else {
        data.parentName = '';
      }
    }

    // Update the item
    await database.updateDocument(
        databaseId,
        collectionId,
        id,
        data
    );
  } catch (error) {
    handleError(error);
  }

  revalidatePath('/dashboard/categories');
  redirect('/dashboard/categories');
}