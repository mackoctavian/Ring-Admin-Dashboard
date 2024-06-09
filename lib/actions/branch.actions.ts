'use server';

const env = process.env.NODE_ENV
import * as Sentry from "@sentry/nextjs";
import { ID, Query, AppwriteException } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { Branch, Business, User } from "@/types";
import { getStatusMessage, HttpStatusCode } from '../status-handler'; 
import { getBusinessId, getCurrentBusiness } from "./business.actions";

const {
    APPWRITE_DATABASE: DATABASE_ID,
    BRANCHES_COLLECTION: BRANCH_COLLECTION_ID,
  } = process.env;


export const createDefaultBranch = async (business: Business) => {
  try {
    if (!DATABASE_ID || !BRANCH_COLLECTION_ID) {
      throw Error('Database ID or Collection ID is missing');
    }

    const { database } = await createAdminClient();

    const newItem = await database.createDocument(
      DATABASE_ID!,
      BRANCH_COLLECTION_ID!,
      ID.unique(),
      {
        name: 'Main branch',
        email: business.email,
        phoneNumber: business.phoneNumber,
        address: business.address,
        daysOpen: [
          { label: "Monday", value: "Monday" },
          { label: "Tuesday", value: "Tuesday" },
          { label: "Wednesday", value: "Wednesday" },
          { label: "Thursday", value: "Thursday" },
          { label: "Friday", value: "Friday" },
          { label: "Saturday", value: "Saturday" },
        ],
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
    if (!DATABASE_ID || !BRANCH_COLLECTION_ID) {
      throw new Error('Database ID or Collection ID is missing');
    }

    const { database } = await createAdminClient();

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
  try {
      if (!DATABASE_ID || !BRANCH_COLLECTION_ID) {
        throw Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();
      const currentBusiness: Business = await getCurrentBusiness();

      const newItem = await database.createDocument(
        DATABASE_ID,
        BRANCH_COLLECTION_ID,
        ID.unique(),
        {
          ...item,
          business: currentBusiness,
          businessId: currentBusiness.$id,
        }
      );

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

  export const list = async ( ) => {
    try {
      if (!DATABASE_ID || !BRANCH_COLLECTION_ID) throw new Error('Database ID or Collection ID is missing');

      const { database } = await createAdminClient();
      if( !database ) throw new Error('Database could not be initiated');

      const businessId = await getBusinessId();
      if( !businessId ) throw new Error('Business ID could not be initiated');

      const items = await database.listDocuments(
        DATABASE_ID,
        BRANCH_COLLECTION_ID,
        [Query.equal('businessId', businessId!)]
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
    if (!DATABASE_ID || !BRANCH_COLLECTION_ID) {
      throw new Error('Database ID or Collection ID is missing');
    }
  
    try {
      const { database } = await createAdminClient();
      const queries = [];

      const businessId = await getBusinessId();
      if( !businessId ) throw new Error('Business ID could not be initiated');

      queries.push(Query.equal('businessId', businessId));
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
        DATABASE_ID,
        BRANCH_COLLECTION_ID,
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
    try {
      if (!DATABASE_ID || !BRANCH_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      if (!id) {
        throw new Error('Document ID is missing');
      }

      const { database } = await createAdminClient();
  
      const item = await database.listDocuments(
        DATABASE_ID!,
        BRANCH_COLLECTION_ID!,
        [Query.equal('$id', id)]
      )
  
      return parseStringify(item.documents[0]);
    } catch (error: any) {
      let errorMessage = 'Something went wrong with your request, please try again later.';
      if (error instanceof AppwriteException) {
        errorMessage = getStatusMessage(error.code as HttpStatusCode);
      }
      throw Error(errorMessage);
    }
  }

  export const deleteItem = async ({ $id }: Branch) => {
    try {
      if (!DATABASE_ID || !BRANCH_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();
  
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
      throw Error(errorMessage);
    }
  }

  export const updateItem = async (id: string, data: Branch) => {  
    try {
      if (!DATABASE_ID || !BRANCH_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();
  
      const item = await database.updateDocument(
        DATABASE_ID!,
        BRANCH_COLLECTION_ID!,
        id,
        data);
  
      return parseStringify(item);
    } catch (error: any) {
      let errorMessage = 'Something went wrong with your request, please try again later.';
      if (error instanceof AppwriteException) {
        errorMessage = getStatusMessage(error.code as HttpStatusCode);
      }
      throw Error(errorMessage);
    }
  }