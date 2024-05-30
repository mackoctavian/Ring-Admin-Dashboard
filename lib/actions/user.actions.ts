'use server';

import { ID, Query, AppwriteException } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";
//import { revalidatePath } from "next/cache";
import { SignInParams , SignUpParams } from "@/types"
import { getStatusMessage, HttpStatusCode } from '../status-handler'; 

const { APPWRITE_DATABASE: DATABASE_ID, USER_COLLECTION: USER_COLLECTION_ID } = process.env;

export const getUserInfo = async ({ userId }) => {
  try {
    const { database } = await createAdminClient();
    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    );
    return parseStringify(user.documents[0]);
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching user information');
  }
};

export const signIn = async ({ email, password }: SignInParams) => {

  console.info(email);
  console.info(password);

  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email.trim(), password.trim());

    cookies().set("qroo-pos-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const user = await getUserInfo({ userId: session.userId }) 
    return parseStringify(user);
  } catch (error : any ) {
    let errorMessage = 'Something went wrong with your request, please try again later.';
    if (error instanceof AppwriteException) {
      errorMessage = getStatusMessage(error.code as HttpStatusCode);
    }
    console.error(JSON.stringify(error));
    throw Error(errorMessage);
    
  }
}


export const signUp = async ({ password, ...userData }) => {
  const { email, firstName, lastName, phoneNumber } = userData;
  try {
    const { account, database } = await createAdminClient();
    const newUserAccount = await account.create(
      ID.unique(), 
      email, 
      password, 
      `${firstName} ${lastName}`
    );

    if (!newUserAccount) throw new Error('Error creating user');

    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        points: 0,
        status: true,
        userId: newUserAccount.$id,
      }
    );

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("qroo-pos-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUser);
  } catch (error) {
    let errorMessage = 'Something went wrong with your request, please try again later.';
    if (error instanceof AppwriteException) {
      errorMessage = getStatusMessage(error.code as HttpStatusCode);
    }
    console.error(JSON.stringify(error));
    throw new Error(errorMessage);
  }
};

export const getLoggedInUser = async () => {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();
    const user = await getUserInfo({ userId: result.$id });
    return parseStringify(user);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();
    cookies().delete('qroo-pos-session');
    await account.deleteSession('current');
  } catch (error) {
    console.error(error);
    return null;
  }
};