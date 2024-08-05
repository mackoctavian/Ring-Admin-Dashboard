'use server';

import {handleError, saasDatabaseCheck} from "@/lib/utils/actions-service";

import { Query } from "node-appwrite";
import { parseStringify } from "../utils";

const {
    //SAAS Settings
  PRODUCT_UNITS_COLLECTION: UNITS_COLLECTION_ID,
} = process.env;

export const list = async ( ) => {
  const { database, databaseId, collectionId } = await saasDatabaseCheck(UNITS_COLLECTION_ID)

  try {
    const items = await database.listDocuments(
      databaseId,
      collectionId,
      [Query.orderAsc("name")]
    );

    if (items.documents.length == 0) return null

    return parseStringify(items.documents);

  }catch (error: any){
    handleError(error, "Error listing units:")
  }
};

export const getItem = async (id: string) => {
  if (!id) return null;
  const { database, databaseId, collectionId } = await saasDatabaseCheck(UNITS_COLLECTION_ID)

  try{
    const item = await database.listDocuments(
      databaseId,
      collectionId,
      [Query.equal('$id', id)]
    )

    if( item.documents.length == 0 ) return null;

    return parseStringify(item.documents[0]);
  }catch (error: any){
    handleError(error, "Error getting unit item:")
  }
}