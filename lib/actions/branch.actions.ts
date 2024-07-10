'use server';

const env = process.env.NODE_ENV
import * as Sentry from "@sentry/nextjs";
import { ID, Query, AppwriteException } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { Branch, Business, User } from "@/types";
import { getStatusMessage, HttpStatusCode } from '../status-handler'; 
import { getBusinessId, getCurrentBusiness } from "./business.actions";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'

const {
    APPWRITE_DATABASE: DATABASE_ID,
    BRANCHES_COLLECTION: BRANCH_COLLECTION_ID,
  } = process.env;

const checkRequirements = async (collectionId: string | undefined) => {
  if (!DATABASE_ID || !collectionId) throw new Error('Check requirements failed: Database ID or Collection ID is missing');

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

export const createDefaultBranch = async (business: Business) => {
  if (!business ) return null;
  try {
    //Create connection directly, redirect loop when using checkRequirements
    if (!DATABASE_ID || !BRANCH_COLLECTION_ID) {  throw Error('Default branch failed: Database ID or Collection ID is missing') }

    const { database } = await createAdminClient();
    if (!database) throw new Error('Database client could not be initiated');

    const newItem = await database.createDocument(
      DATABASE_ID!,
      BRANCH_COLLECTION_ID!,
      ID.unique(),
      {
        name: 'Main branch',
        email: business.email,
        phoneNumber: business.phoneNumber,
        address: business.address,
        daysOpen: JSON.stringify([
          { label: "Monday", value: "Monday" },
          { label: "Tuesday", value: "Tuesday" },
          { label: "Wednesday", value: "Wednesday" },
          { label: "Thursday", value: "Thursday" },
          { label: "Friday", value: "Friday" },
        ]),
        staffCount: 1,
        city: business.city,
        openingTime: "09:00",
        closingTime: "17:00",
        business: business,
        businessId: business.$id,
        canDelete: false,
        status: true,
      }
    )

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

export const getCurrentBranch = async () => {
  try {
    const { database } = await checkRequirements(BRANCH_COLLECTION_ID);

    const item = await database.listDocuments(
      DATABASE_ID!,
      BRANCH_COLLECTION_ID!,
    )
    
    if (item.documents.length === 0) {
      return null;
    }

    //TODO: Currently picking the first branch, this will be updated to allow multiple branches
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

export const createItem = async (item: Branch) => {
  if (!item ) return null;
  try {
      const { database } = await checkRequirements(BRANCH_COLLECTION_ID);
      const currentBusiness: Business = await getCurrentBusiness();

      const daysOpen = item.daysOpen.map(option => ({
        ...option
      }));

      item.daysOpen = JSON.stringify(daysOpen)

      //create branch
      const createdBranch = await database.createDocument(
        DATABASE_ID!,
        BRANCH_COLLECTION_ID!,
        ID.unique(),
        {
          ...item,
          business: currentBusiness,
          businessId: currentBusiness.$id,
        }
      );
    } catch (error: any) {
      let errorMessage = 'Something went wrong with your request, please try again later.';
      if (error instanceof AppwriteException) {
        errorMessage = getStatusMessage(error.code as HttpStatusCode);
      }
  
      if(env == "development"){ console.error(error); }
  
      Sentry.captureException(error);
      throw Error(errorMessage);
    }

    revalidatePath('/branches')
    redirect('/branches')
}

  export const list = async ( ) => {
    try {
      const { database, businessId } = await checkRequirements(BRANCH_COLLECTION_ID);

      const items = await database.listDocuments(
        DATABASE_ID!,
        BRANCH_COLLECTION_ID!,
        [Query.equal('businessId', [businessId])]
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

  export const getItems = async (
    q?: string,
    status?: boolean | null,
    limit?: number | null, 
    offset?: number | 1,
  ) => {
    const { database, businessId } = await checkRequirements(BRANCH_COLLECTION_ID);
    try {
       const queries = [];

       queries.push(Query.equal('businessId', [businessId]));
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
         DATABASE_ID!,
         BRANCH_COLLECTION_ID!,
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
    if (!id ) return null;
    const { database } = await checkRequirements(BRANCH_COLLECTION_ID);

    try {
      const item = await database.listDocuments(
        DATABASE_ID!,
        BRANCH_COLLECTION_ID!,
        [Query.equal('$id', id)]
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

  export const deleteItem = async ({ $id }: Branch) => {
    if (!$id ) return null;
    const { database } = await checkRequirements(BRANCH_COLLECTION_ID)

    try {

      const item = await database.deleteDocument(
        DATABASE_ID!,
        BRANCH_COLLECTION_ID!,
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

export const updateItem = async (id: string, data: Branch) => {
  if (!id || !data ) return null;
  const { database } = await checkRequirements(BRANCH_COLLECTION_ID);

  const daysOpen = data.daysOpen.map(option => ({
    ...option,
    branchId:id,
  }));

  data.daysOpen = JSON.stringify(daysOpen)
  
  try {
    await database.updateDocument(
      DATABASE_ID!,
      BRANCH_COLLECTION_ID!,
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

  revalidatePath('/branches')
  redirect('/branches')
}