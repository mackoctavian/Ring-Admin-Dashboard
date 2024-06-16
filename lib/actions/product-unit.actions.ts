'use server';

const env = process.env.NODE_ENV
import * as Sentry from "@sentry/nextjs"
import { Query, AppwriteException } from "node-appwrite";
import { createSaaSAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { ProductUnit } from "@/types";
import { getStatusMessage, HttpStatusCode } from '../status-handler'; 
import { auth } from "@clerk/nextjs/server";
import { getBusinessId } from "./business.actions";

const {
    //SAAS Settings
  APPWRITE_SAAS_DATABASE: SAAS_DATABASE_ID,
  PRODUCT_UNITS_COLLECTION: UNITS_COLLECTION_ID,
} = process.env;

const checkRequirements = async (collectionId: string | undefined) => {
  if (!SAAS_DATABASE_ID || !collectionId) throw new Error('Database ID or Collection ID is missing');

  const { database } = await createSaaSAdminClient();
  if (!database) throw new Error('Database client could not be initiated');

  const { userId } = auth();
  if (!userId) {
    throw new Error('You must be signed in to use this feature');
  }
  
  const businessId = await getBusinessId();
  if( !businessId ) throw new Error('Business ID could not be initiated');

  return { database, userId, businessId };
}

export const list = async ( ) => {
  const { database } = await checkRequirements(UNITS_COLLECTION_ID);

  try {
    const items = await database.listDocuments(
      SAAS_DATABASE_ID!,
      UNITS_COLLECTION_ID!,
      [Query.orderAsc("name")]
    );

    return parseStringify(items.documents);

  }catch (error: any){
    let errorMessage = 'Something went wrong with your request, please try again later.';
    if (error instanceof AppwriteException) {
      errorMessage = getStatusMessage(error.code as HttpStatusCode);
    }

    if(env == "development"){ console.error(error); }

    Sentry.captureException(error);
    throw Error(errorMessage);
  }
};

export const getItem = async (id: string) => {
  const { database } = await checkRequirements(UNITS_COLLECTION_ID);

  try{
    if (!id) throw new Error('Document ID is missing')

    const item = await database.listDocuments(
      SAAS_DATABASE_ID!,
      UNITS_COLLECTION_ID!,
      [Query.equal('$id', id)]
    )

    return parseStringify(item.documents[0]);
  }catch (error: any){
    let errorMessage = 'Something went wrong with your request, please try again later.';
    if (error instanceof AppwriteException) {
      errorMessage = getStatusMessage(error.code as HttpStatusCode);
    }

    if(env == "development"){ console.error(error); }

    Sentry.captureException(error);
    throw Error(errorMessage);
  }
}