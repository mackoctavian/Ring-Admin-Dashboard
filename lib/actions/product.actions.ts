'use server';

import {databaseCheck, handleError} from "@/lib/utils/actions-service";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import { Product } from "@/types";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'

const {
    PRODUCTS_COLLECTION: PRODUCTS_COLLECTION_ID,
    PRODUCT_VARIANTS_COLLECTION: PRODUCTS_VARIANTS_COLLECTION_ID
} = process.env;
  
export const createItem = async (item: Product) => {
  const { database, databaseId,businessId, collectionId } = await databaseCheck(PRODUCTS_COLLECTION_ID, {needsBusinessId: true})
  const { variants, ...productData } = item;

    try {
      const product = await database.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        {
          ...productData,
          businessId: businessId,
          canDelete: true
        }
      )

      //Create variants
      for (const variant of variants) {
        await database.createDocument(
          databaseId,
          PRODUCTS_VARIANTS_COLLECTION_ID!,
          ID.unique(),
          {
            ...variant,
            product: product.$id,
            productId: product.$id
          }
        )
      }
    } catch (error: any) {
      handleError(error, 'Error creating product');
    }

  revalidatePath('/dashboard/products')
  redirect('/dashboard/products')
};

export const list = async ( ) => {
  const { database, databaseId,businessId, collectionId } = await databaseCheck(PRODUCTS_COLLECTION_ID, {needsBusinessId: true})

    try {
      const items = await database.listDocuments(
        databaseId,
        collectionId,
        [Query.equal('businessId', businessId!)]
      );

      if ( items.total == 0 ) return null;

      return parseStringify(items.documents);

    }catch (error: any){
      handleError(error, "Error listing products");
    }
};


export const getItems = async (
    q?: string,
    status?: string | null,
    limit?: number | null, 
    offset?: number | 1,
  ) => {
  const { database, databaseId,businessId, collectionId } = await databaseCheck(PRODUCTS_COLLECTION_ID, {needsBusinessId: true})

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
  
      if (items.documents.length === 0) return null;
  
      return parseStringify(items.documents);
    }catch (error: any){
      handleError(error, "Error listing products");
    }
};

export const getItem = async (id: string) => {
    if (!id) return null;
    const { database, databaseId, collectionId } = await databaseCheck(PRODUCTS_COLLECTION_ID)

    try {
      const item = await database.listDocuments(
        databaseId,
        collectionId,
        [Query.equal('$id', id)]
      )

      if ( item.total == 0 ) return null;

      return parseStringify(item.documents[0]);
    } catch (error: any) {
      handleError(error, "Error getting product");
    }
};

export const deleteItem = async ({ $id }: Product) => {
  if (!$id) return null;
  const { database, databaseId, collectionId } = await databaseCheck(PRODUCTS_COLLECTION_ID)

  try {
      await database.deleteDocument(
        databaseId,
        collectionId,
        $id);
    } catch (error: any) {
      handleError(error, "Error deleting product");
    }

    revalidatePath('/dashboard/products')
    redirect('/dashboard/products')
}

export const updateItem = async (id: string, data: Product) => {
    if (!id || !data) return null;
    const { database, databaseId, collectionId } = await databaseCheck(PRODUCTS_COLLECTION_ID)
    const { variants, ...productData } = data;

    console.log("Product data", productData);

    try {
        //Update variants
        for (const variant of variants) {
            if ( variant.$id ){
                //update variant
                await database.updateDocument(
                    databaseId,
                    PRODUCTS_VARIANTS_COLLECTION_ID!,
                    variant.$id,
                    {
                        ...variant,
                        product: data.$id,
                        productId: data.$id
                    }
                )
            }else{
                //create variant
                await database.createDocument(
                    databaseId,
                    PRODUCTS_VARIANTS_COLLECTION_ID!,
                    ID.unique(),
                    {
                        ...variant,
                        product: data.$id,
                        productId: data.$id
                    }
                )
            }
        }

        await database.updateDocument(
            databaseId,
            collectionId,
            id,
            productData
        )

        throw("no update");
    } catch (error: any) {
      handleError(error, "Error updating product");
    }
    revalidatePath('/dashboard/products')
    redirect('/dashboard/products')
}