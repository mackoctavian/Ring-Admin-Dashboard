'use server';

const env = process.env.NODE_ENV
import * as Sentry from "@sentry/nextjs";
import { ID, Query, AppwriteException } from "node-appwrite";
import { getStatusMessage, HttpStatusCode } from '../status-handler'; 
import { createAdminClient, createSaaSAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { Business, User, SubscriptionDetails } from "@/types";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { Gender, SubscriptionStatus } from "@/types/data-schemas";
import { addDays } from 'date-fns';
import { createDefaultBranch } from "@/lib/actions/branch.actions"
import { createDefaultDepartment } from "@/lib/actions/department.actions" 

import { BusinessRegistrationSchema } from "@/types/data-schemas";
import { useClerk } from "@clerk/nextjs";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'

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

 const checkRequirements = async (collectionId: string | undefined) => {
  if (!DATABASE_ID || !collectionId) throw new Error('Database ID or Collection ID is missing');

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

export const getCurrentBusiness = async () => {
  const { database, businessId } = await checkRequirements(BUSINESS_COLLECTION_ID);
  try {
      const response = await database.listDocuments(
        DATABASE_ID!,
        BUSINESS_COLLECTION_ID!,
        [Query.equal('$id', [businessId!])]
      );
      return parseStringify(response.documents[0]);
  } catch (error) {
      let errorMessage = 'Something went wrong with your request, please try again later.';
      if (error instanceof AppwriteException) {
        errorMessage = getStatusMessage(error.code as HttpStatusCode);
      }

      if(env == "development"){ console.error(error); }

      Sentry.captureException(error);
      throw Error(errorMessage);
  }
}

export const getBusinessId = async () => {
    try{
      let { orgId, userId, sessionClaims } = auth();
      if (!userId) { throw Error("User not found") }

      //If business Id is available on session data, use that
      if ( sessionClaims?.metadata?.businessId ) return sessionClaims.metadata.businessId as string;

      //If org Id is available on session data, use that to fetch business id
      if (!orgId && sessionClaims?.membership) orgId = Object.keys(sessionClaims.membership)[0]

      // TODO: Log out user and redirect to sign in page instead of returning null
      if ( !orgId ) return null;

      //Create connection directly, redirect loop when using checkRequirements
      if (!DATABASE_ID || !BUSINESS_COLLECTION_ID) {  throw Error('Fetch business id failed: Database ID or Collection ID is missing') }

      const { database } = await createAdminClient();
      if (!database) throw new Error('Database client could not be initiated');

      const item = await database.listDocuments(
        DATABASE_ID!,
        BUSINESS_COLLECTION_ID!,
        [Query.equal('orgId', [orgId!])]
      );

      // TODO: Log out user and redirect to sign in page instead of returning null
      if ( item.total < 1 ) return null;

      const business: Business = parseStringify(item.documents[0]);
      const businessId = business.$id;

      //Update session metadata since you reached here means its missing
      await clerkClient.users.updateUser(userId, {
        publicMetadata: {
          businessId: businessId,
        },
        privateMetadata: {
          businessId: businessId,
        },
      });

      return businessId
    } catch (error: any) {
      console.error(error)

      let errorMessage = 'Something went wrong with your request, please try again later.';
      if (error instanceof AppwriteException) {
        errorMessage = getStatusMessage(error.code as HttpStatusCode);
      }

      if(env == "development"){ console.error(error); }

      Sentry.captureException(error);
      throw Error(errorMessage);
    }
}
export const getBusiness = async () => {
  const { database, businessId, userId } = await checkRequirements(BUSINESS_COLLECTION_ID);

  try {
    const user = await database.listDocuments(
      DATABASE_ID!,
      BUSINESS_COLLECTION_ID!,
      [Query.equal('owner', [userId])]
    );
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

 export const getSubscriptionStatus = async () => {

  try {
    //default to expired status
    let status = SubscriptionStatus.EXPIRED;
    const businessId = await getBusinessId();

     if (!DATABASE_ID || !SUBSCRIBERS_COLLECTION_ID) {
       throw new Error('Database ID or Collection ID is missing');
     }

     const { database } = await createSaaSAdminClient();

     const item = await database.listDocuments(
       SAAS_DATABASE_ID!,
       SUBSCRIBERS_COLLECTION_ID!,
       [Query.equal('businessId', businessId as string)]
     )

     if ( item.total < 1 ) return status;

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

export const registerBusiness = async (data: Business) => {
  let redirectPath: string | null = null

  //Validate
  const validate = BusinessRegistrationSchema.omit({logo: true}).safeParse(data);
  if (!validate.success) {
    console.error("Validation eror", validate.error.flatten());
    return { error: "Data validation failed" }
  }

  const item = validate.data as Business;

  const businessName = data.name;
  const generatedSlug = businessName.toLowerCase().replace(/\s+/g, '-');

  try{
    const { database } = await createAdminClient();

    const user = await currentUser();
    if (!user) { return { error: "User data could not be loaded" } }

    //Create organization on Clerk
    const clerkOrganization = await clerkClient.organizations.createOrganization({
      name: item.name,
      createdBy: user.id
     })

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
        orgId: clerkOrganization.id,
        isOwner: true,
      });

      const newBusiness = await database.createDocument(
        DATABASE_ID!,
        BUSINESS_COLLECTION_ID!,
        ID.unique(),
        {
          ...item,
          slug: generatedSlug,
          branches: [],
          authId: user.id,
          orgId: clerkOrganization.id,
          users: [newBusinessOwner],
        });

      const newBranch = await createDefaultBranch(parseStringify(newBusiness));
     
      createDefaultDepartment(newBranch);

      initTrial(newBusiness.$id, parseStringify(newBusinessOwner));

      await clerkClient.users.updateUser(user.id, {
        publicMetadata: {
          onboardingComplete: true,
          businessId: newBusiness.$id,
          invite: false,
          organizationId: clerkOrganization.id,
        },
      })



      //const organizationLogo = { file: item.logo as File, uploaderUserId: user.id, };
      //clerkClient.organizations.updateOrganizationLogo( organization.id, organizationLogo );

    //return parseStringify(newBusinessOwner);
    //Dont revalidate, as its a new user
    //revalidatePath('/');
    redirectPath = `/`
  } catch (error: any) {
    let errorMessage = 'Something went wrong with your request, please try again later.';
    if (error instanceof AppwriteException) {
      errorMessage = getStatusMessage(error.code as HttpStatusCode);
    }

    if(env == "development"){ console.error(error); }

    Sentry.captureException(error);
    throw Error(errorMessage);
  }finally {
    //redirect same path, if succesfull then path will take you home
    console.log("Redirect to homepage")
    revalidatePath("/")
    redirect('/')
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