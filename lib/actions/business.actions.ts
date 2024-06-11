'use server';

const env = process.env.NODE_ENV
import * as Sentry from "@sentry/nextjs";
import { ID, Query, AppwriteException } from "node-appwrite";
import { getStatusMessage, HttpStatusCode } from '../status-handler'; 
import { createAdminClient, createSaaSAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { Business, User, SubscriptionDetails, Branch } from "@/types";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { Gender, SubscriptionStatus } from "@/types/data-schemas";
import { addDays } from 'date-fns';
import { createDefaultBranch } from "@/lib/actions/branch.actions"
import { createDefaultDepartment } from "@/lib/actions/department.actions" 
import { metadata } from "@/app/layout";

const { 
  APPWRITE_DATABASE: DATABASE_ID, 
  BUSINESS_COLLECTION: BUSINESS_COLLECTION_ID,
  BUSINESS_CATEGORY_COLLECTION: BUSINESS_CATEGORY_COLLECTION_ID,

  //USER COLLECTION
  USER_COLLECTION: USER_COLLECTION_ID,

  //SAAS Settings
  APPWRITE_SAAS_DATABASE: SAAS_DATABASE_ID,
  SUBSRIBERS_COLLECTION: SUBSCRIBERS_COLLECTION_ID,
  TRIAL_DAYS: TRIAL_DAYS,
  SUBSCRIPTION_COST: SUBSCRIPTION_COST
 } = process.env;

 export const getCurrentBusiness = async () => {
  try {
    const { userId } = auth();
    if (!userId) { throw Error("User not found") }

    const { database } = await createAdminClient();
    const business = await database.listDocuments(
      DATABASE_ID!,
      BUSINESS_COLLECTION_ID!,
      [Query.equal('authId', [userId])]
    );

    //TODO: allow multiple businesses
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

export const getBusinessId = async () => {
    try{
      const businessData = await getCurrentBusiness();
      const businessId = businessData.$id;
      if (!businessId) throw new Error('Could not find the current business');

      return businessId;
    }catch{
      return null;
    }
}

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

    const item = await database.listDocuments(
      SAAS_DATABASE_ID!,
      SUBSCRIBERS_COLLECTION_ID!,
      [Query.equal('businessId', sessionClaims?.metadata.businessId as string)]
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
    const { database } = await createAdminClient();

    const user = await currentUser();
    if (!user) { throw Error("Current user could not be loaded") }

    const newBusinessOwner = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
        phoneNumber: user.phoneNumbers.length > 0 ? user.phoneNumbers[0].phoneNumber : item.phoneNumber,
        image: user.imageUrl,
        gender: Gender.UNDISCLOSED,
        points: 0,
        status: true,
        userId: user.id,
        isOwner: true,
      });

      const newBusiness = await database.createDocument(
        DATABASE_ID!,
        BUSINESS_COLLECTION_ID!,
        ID.unique(),
        {
          ...item,
          branches: [],
          authId: user.id,
          user: newBusinessOwner,
        });

      const newBranch = await createDefaultBranch(parseStringify(newBusiness));
     
      createDefaultDepartment(newBranch);

      initTrial(newBusiness.$id, parseStringify(newBusinessOwner));

      //Create organization on Clerk
      await clerkClient.users.updateUser(user.id, {
        publicMetadata: {
          onboardingComplete: true,
          businessId: newBusiness.$id,
        },
      })

      const organization = await clerkClient.organizations.createOrganization({ 
        name: item.name, 
        createdBy: user.id,
        privateMetadata: {
          businessId: newBusiness.$id,
        },
        publicMetadata: {
          businessId: newBusiness.$id,
        },
       })

      const organizationLogo = { file: formData.get('file') as File, uploaderUserId: user.id, };
      clerkClient.organizations.updateOrganizationLogo( organization.id, organizationLogo );
    
    return parseStringify(newBusinessOwner);
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

export const initTrial = async (businessId: string, data : User) => {
  try{
    const { database } = await createSaaSAdminClient();  

    const trialEndDate = addDays(new Date(), parseInt(TRIAL_DAYS!, 10));
    const subscriptionCost = parseFloat(SUBSCRIPTION_COST!);

   await database.createDocument(
      SAAS_DATABASE_ID!,
      SUBSCRIBERS_COLLECTION_ID!,
      ID.unique(),
      {
        businessId: businessId,
        email: data.email,
        name: data.name,
        phoneNumber: data.phoneNumber,
        nextDue: trialEndDate,
        monthlyFee: subscriptionCost,
        status: SubscriptionStatus.TRIAL,
        owner: data.userId,
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
}



export const updateItem = async (id: string, data: Business ) => {  
  try {
    if (!DATABASE_ID || !BUSINESS_COLLECTION_ID) {
      throw new Error('Database ID or Collection ID is missing');
    }

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