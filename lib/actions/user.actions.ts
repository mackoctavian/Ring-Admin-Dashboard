'use server';

import {databaseCheck, handleError} from "@/lib/utils/actions-service";
import { ID, Query } from "node-appwrite"
import { parseStringify } from "../utils"
import { User } from "@/types"
import { auth } from "@clerk/nextjs/server"

const { 
  USER_COLLECTION: USER_COLLECTION_ID,
 } = process.env;


export const getLoggedInUser = async () => {
  const { database, databaseId, userId, collectionId } = await databaseCheck(USER_COLLECTION_ID, {needsUserId: true});

  try {
    const user = await database.listDocuments(
      databaseId,
      collectionId,
      [Query.equal('userId', [userId!])]
    );

    if( user.documents.length == 0) return null;

    return parseStringify(user.documents[0]);
  } catch (error: any) {
    handleError(error, "Error getting logged in user");
  }
}


export const createUser = async (user: User) => {
  const { userId } = auth();
  if (!userId) { throw Error("User not authorized to perform this action") }

  const { database, databaseId, collectionId } = await databaseCheck(USER_COLLECTION_ID);

  try {
    const newUser = await database.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      {
        ...user
      }
    );
  
    return parseStringify(newUser);

  } catch (error: any) {
    handleError(error, "Error creating user");
  }
}