'use server';

import {databaseCheck, deleteFile, handleError, shouldReplaceImage, uploadFile} from "@/lib/utils/actions-service";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import {Product} from "@/types";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'

const {
    PRODUCTS_COLLECTION: PRODUCTS_COLLECTION_ID,
    PRODUCT_VARIANTS_COLLECTION: PRODUCTS_VARIANTS_COLLECTION_ID
} = process.env;

export const createItem = async ({ image, variants, ...productData }: Product) => {
    try {
        const { database, databaseId, businessId, collectionId } = await databaseCheck(PRODUCTS_COLLECTION_ID, { needsBusinessId: true });

        // Upload image first if it exists
        const imageData = image ? await uploadFile(image) : null;

        // Create product with image data in a single operation
        const product = await database.createDocument(
            databaseId,
            collectionId,
            ID.unique(),
            {
                ...productData,
                businessId,
                canDelete: true,
                image: imageData?.imageUrl,
                imageId: imageData?.imageId
            }
        );

        // Create variants if they exist
        if (variants && variants.length > 0) {
            await Promise.all(variants.map(variant =>
                database.createDocument(
                    databaseId,
                    PRODUCTS_VARIANTS_COLLECTION_ID!,
                    ID.unique(),
                    {
                        ...variant,
                        product: product.$id,
                        productId: product.$id
                    }
                )
            ));
        }

    } catch (error) {
        handleError(error, 'Error creating product');
    }

    revalidatePath('/dashboard/products');
    redirect('/dashboard/products');
}

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

export const updateItem = async (id: string, { image, variants, ...productData }: Product, oldImage: string, oldImageId: string) => {
    if (!id || !productData) throw new Error("Invalid input data")

    try {
        const { database, databaseId, collectionId } = await databaseCheck(PRODUCTS_COLLECTION_ID);

        const updateVariants = variants.map(variant =>
            variant.$id
                ? database.updateDocument(databaseId, PRODUCTS_VARIANTS_COLLECTION_ID!, variant.$id, {
                    ...variant,
                    product: productData.$id,
                    productId: productData.$id
                })
                : database.createDocument(databaseId, PRODUCTS_VARIANTS_COLLECTION_ID!, ID.unique(), {
                    ...variant,
                    product: productData.$id,
                    productId: productData.$id
                })
        );

        let imageUrl: string | null = oldImage;
        let imageId: string | null = oldImageId;

        if (image) {
            const shouldUploadNewImage = await shouldReplaceImage(oldImageId, image);

            console.log("should upload image",shouldUploadNewImage);

            if (shouldUploadNewImage) {
                const uploadResult = await uploadFile(image);
                imageUrl = uploadResult.imageUrl;
                imageId = uploadResult.imageId;
            }
        } else if (!image && oldImage) {
            imageUrl = null;
            imageId = null;
        }

        const [updatedProduct, ...updatedVariants] = await Promise.all([
            database.updateDocument(databaseId, collectionId, id, {
                ...productData,
                image: imageUrl,
                imageId: imageId,
            }),
            ...updateVariants
        ]);
        
        if (imageUrl !== oldImage && oldImage) {
            // TODO: Implement deleteImage function
            await deleteFile(oldImageId);
        }

    } catch (error) {
        handleError(error, "Error updating product");
        throw error;
    }

    revalidatePath('/dashboard/products');
    redirect('/dashboard/products');
};
