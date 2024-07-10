'use server';

const env = process.env.NODE_ENV

import { ID, Query, AppwriteException } from "node-appwrite"
import * as Sentry from "@sentry/nextjs"
import { createAdminClient, createSessionClient } from "../appwrite"
import { parseStringify } from "../utils"
import { SignInParams , SignUpParams, User } from "@/types"
import { auth } from "@clerk/nextjs/server"
import { getStatusMessage, HttpStatusCode } from '../status-handler'; 

const { 
  APPWRITE_DATABASE: DATABASE_ID, 
  USER_COLLECTION: USER_COLLECTION_ID,
 } = process.env;


export const getLoggedInUser = async () => {
  const { userId } = auth();
  if (!userId) throw new Error('Unauthorized access: User does not have privileges.')
  
  try {
    const { database } = await createAdminClient();
    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    );

    if( user.documents.length < 1 ){
      return null;
    }

    return parseStringify(user.documents[0]);
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


export const createUser = async (user: User) => {
  const { userId } = auth();
  if (!userId) { throw Error("User not authorized to perform this action") }
  
  try {
    const { database } = await createAdminClient();
    
    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...user
      }
    );
  
    return parseStringify(newUser);

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