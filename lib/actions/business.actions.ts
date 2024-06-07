'use server';

const env = process.env.NODE_ENV
import * as Sentry from "@sentry/nextjs";
import { ID, Query, AppwriteException } from "node-appwrite";
import { getStatusMessage, HttpStatusCode } from '../status-handler'; 
import { createStorageClient, createAdminClient, createSaaSAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { Business, User, SubscriptionDetails } from "@/types";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { Gender, SubscriptionStatus } from "@/types/data-schemas";
import { addDays } from 'date-fns';
import { createUser } from "@/lib/actions/user.actions"
import { createDefaultBranch } from "@/lib/actions/branch.actions"
import { createDefaultDepartment } from "@/lib/actions/department.actions" 

const { 
  APPWRITE_DATABASE: DATABASE_ID, 
  BUSINESS_COLLECTION: BUSINESS_COLLECTION_ID,
  BUSINESS_CATEGORY_COLLECTION: BUSINESS_CATEGORY_COLLECTION_ID,

  //SAAS Settings
  APPWRITE_SAAS_DATABASE: SAAS_DATABASE_ID,
  SUBSRIBERS_COLLECTION: SUBSCRIBERS_COLLECTION_ID,
  TRIAL_DAYS: TRIAL_DAYS,
  SUBSCRIPTION_COST: SUBSCRIPTION_COST
 } = process.env;

export const getBusiness = async () => {
  try {
    const { userId } = auth();
    if (!userId) { throw Error("User not found") }

    const { database } = await createAdminClient();
    const user = await database.listDocuments(
      DATABASE_ID!,
      BUSINESS_COLLECTION_ID!,
      [Query.equal('owner', [userId])]
    );
    return parseStringify(user.documents[0]);
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching user information');
  }
}

 export const getSubscriptionStatus = async () => {
  try {
    //default to expired status
    let status = SubscriptionStatus.EXPIRED;
    const { userId, sessionClaims } = auth()
    if (!userId && !sessionClaims?.businessId) { throw new Error("User details not found") }

    if (!DATABASE_ID || !SUBSCRIBERS_COLLECTION_ID) {
      throw new Error('Database ID or Collection ID is missing');
    }

    const { database } = await createSaaSAdminClient();

    console.error("Business ID: ", sessionClaims?.metadata.businessId);

    const item = await database.listDocuments(
      SAAS_DATABASE_ID!,
      SUBSCRIBERS_COLLECTION_ID!,
      [Query.equal('business', sessionClaims?.metadata.businessId as string)]
    )

    const subscription = parseStringify(item.documents[0]) as SubscriptionDetails;
    status = subscription.status

    return status;
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

export const getBusinessInfo = async ({ user }) => {
  try {
    const { database } = await createAdminClient();
    const business = await database.listDocuments(
      DATABASE_ID!,
      BUSINESS_COLLECTION_ID!,
      [Query.equal('userId', [user])]
    );
    return parseStringify(user.documents[0]);
  } catch (error) {
    let errorMessage = 'Something went wrong with your request, please try again later.';
    if (error instanceof AppwriteException) {
      errorMessage = getStatusMessage(error.code as HttpStatusCode);
    }
    Sentry.captureException(error);
    throw new Error(errorMessage);
  }
};


export const getBusinessTypes = async () => {
  try {
    const { database } = await createAdminClient();
    const data = await database.listDocuments(
      DATABASE_ID!,
      BUSINESS_CATEGORY_COLLECTION_ID!
    );
    return parseStringify(data.documents);
  } catch (error: any) {
    let errorMessage = 'Something went wrong with your request, please try again later.';
    if (error instanceof AppwriteException) {
      errorMessage = getStatusMessage(error.code as HttpStatusCode);
    }
    Sentry.captureException(error);
    throw Error(errorMessage);
  }
}

export const registerBusiness = async (item: Business) => {
  try{
    let newBusiness = null;

    const { database } = await createAdminClient();
    const { email, name, phoneNumber } = item;

    const { userId } = auth();
    if (!userId) { throw Error("User not found") }

    const user = await currentUser();
    
    if( user ){
        
      newBusiness = await database.createDocument(
        DATABASE_ID!,
        BUSINESS_COLLECTION_ID!,
        ID.unique(),
        {
          ...item,
          owner: userId,
        }
      );

      // Create the main branch
      const newBranch = await createDefaultBranch( parseStringify(newBusiness) )

      // Create the main department
      const newDepartment = await createDefaultDepartment( parseStringify(newBranch) )

      const newUser: User = {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
        phoneNumber: user.primaryPhoneNumber,
        image: user.imageUrl,
        gender: Gender.UNDISCLOSED,
        points: 0,
        status: true,
        userId: userId,
        business: newBusiness,
        isOwner: true
      }

      //Store kyc data
      await createUser(newUser)

      //Init trial period
      const trialData = {business: newBusiness.$id, email: email, name: name, phoneNumber: phoneNumber }
      initTrial(trialData)

      // Complete user registration
      const res = await clerkClient.users.updateUser(userId, {
        publicMetadata: {
          onboardingComplete: true,
          businessId: newBusiness.$id,
        },
      })
      return { message: res.publicMetadata }
    }

    return parseStringify(newBusiness);
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

export const initTrial = async (data) => {
  try{
    const { userId } = auth();
    if (!userId) { throw Error("User not found") }

    const { database } = await createSaaSAdminClient();  

    const trialEndDate = addDays(new Date(), parseInt(TRIAL_DAYS!, 10));
    const subscriptionCost = parseFloat(SUBSCRIPTION_COST!);

    const startTrial = await database.createDocument(
      SAAS_DATABASE_ID!,
      SUBSCRIBERS_COLLECTION_ID!,
      ID.unique(),
      {
        ...data,
        nextDue: trialEndDate,
        monthlyFee: subscriptionCost,
        status: SubscriptionStatus.TRIAL,
        owner: userId,
      }
    );
  
    return parseStringify(startTrial);
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

export const getCurrentBusiness = async () => {
  try {
    const { userId } = auth();
    if (!userId) { throw Error("User not found") }

    const { database } = await createAdminClient();
    const business = await database.listDocuments(
      DATABASE_ID!,
      BUSINESS_COLLECTION_ID!,
      [Query.equal('owner', [userId])]
    );

    return parseStringify(business.documents[0]);
  } catch (error) {
    let errorMessage = 'Something went wrong with your request, please try again later.';
    if (error instanceof AppwriteException) {
      errorMessage = getStatusMessage(error.code as HttpStatusCode);
    }
    Sentry.captureException(error);
    throw new Error(errorMessage);
  }
};

export const updateItem = async (id: string, data: Business ) => {  
  try {
    if (!DATABASE_ID || !BUSINESS_COLLECTION_ID) {
      throw new Error('Database ID or Collection ID is missing');
    }

    console.log("DATA ON CONtroLLER: ", JSON.stringify(data, null, 2) )

    const { database } = await createAdminClient();

    const item = await database.updateDocument(
      DATABASE_ID!,
      BUSINESS_COLLECTION_ID!,
      id,
      data);

    return parseStringify(item);
  } catch (error) {
    let errorMessage = 'Something went wrong with your request, please try again later.';
    if (error instanceof AppwriteException) {
      errorMessage = getStatusMessage(error.code as HttpStatusCode);
    }
    Sentry.captureException(error);
    throw new Error(errorMessage);
  }
}