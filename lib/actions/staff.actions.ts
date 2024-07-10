'use server';

const env = process.env.NODE_ENV
import * as Sentry from "@sentry/nextjs";
import { ID, Query, AppwriteException } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { Staff, User, Business } from "@/types";
import { getStatusMessage, HttpStatusCode } from '../status-handler'; 
import { getBusinessId, getCurrentBusiness } from "./business.actions";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'

import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { createUser } from "./user.actions"
const {
    APPWRITE_DATABASE: DATABASE_ID,
    STAFF_COLLECTION: STAFF_COLLECTION_ID,
    SITE_URL: SITE_URL
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

  export const createItem = async (item: Staff) => {
    const { database, userId } = await checkRequirements(STAFF_COLLECTION_ID);

    try {
      if(item.dashboardAccess){
        const { orgId } = auth()
        //TODO: Create user but do not send invite and fail gracefully
        if( !orgId ){
          item.dashboardAccess = false;
          console.error('Organization ID could not be initiated ,disabled dashboard access');
        };
      }

      const businessId = await getBusinessId();
      if( !businessId ) throw new Error('Business ID could not be initiated');
  
      await database.createDocument(
        DATABASE_ID!,
        STAFF_COLLECTION_ID!,
        ID.unique(),
        {
          ...item,
          businessId: businessId,
        }
      )

      //Send invite to user
      if ( item.dashboardAccess ) {
        const business: Business = await getCurrentBusiness();

        const user: User = { ...item, points:0, isOwner: false, businesses: [business], userId: 'invitee'  }
        await createUser(user);
        
        try{
          clerkClient.users.getUser(userId).then((user) => {
            clerkClient.users.getOrganizationMembershipList({ userId: user.id} ).then((organization) => {
              //TODO: Allow multiple organizations
              const invitation = {
                organizationId: organization.data[0].organization.id,
                inviterUserId: user.id,
                emailAddress: item.email,
                role: 'org:member',
                //redirectUrl: 'https://qroopos-git-dev-qroo-solutions.vercel.app'
              };
  
              clerkClient.organizations.createOrganizationInvitation(invitation);
            })
          })
        }catch(e){
          console.error('Error giving user dashboard access', e)
        }
      }
      
    } catch (error: any) {
      let errorMessage = 'Something went wrong with your request, please try again later.';
      if (error instanceof AppwriteException) {
        errorMessage = getStatusMessage(error.code as HttpStatusCode);
      }

      if(env == "development"){ console.error(error); }

      Sentry.captureException(error);
      throw Error(errorMessage);
    }

    revalidatePath('/staff')
    redirect('/staff')
  }

  export const list = async ( ) => {
    const { database } = await checkRequirements(STAFF_COLLECTION_ID);

    try {
      const businessId = await getBusinessId();
      if( !businessId ) throw new Error('Business ID could not be initiated');

      const items = await database.listDocuments(
        DATABASE_ID!,
        STAFF_COLLECTION_ID!,
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
    const { database } = await checkRequirements(STAFF_COLLECTION_ID);
  
    try {
      
      const queries = [];
      const businessId = await getBusinessId();
      if( !businessId ) throw new Error('Business ID could not be initiated');

      queries.push(Query.equal('businessId', businessId));
      queries.push(Query.orderDesc("$createdAt"));
      queries.push(Query.orderAsc("name"));

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
        STAFF_COLLECTION_ID!,
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
    const { database } = await checkRequirements(STAFF_COLLECTION_ID);

    try {
      if (!id) throw new Error('Document ID is missing')
  
      const item = await database.listDocuments(
        DATABASE_ID!,
        STAFF_COLLECTION_ID!,
        [Query.equal('$id', id)]
      )
  
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

  export const deleteItem = async ({ $id }: Staff) => {
    const { database } = await checkRequirements(STAFF_COLLECTION_ID);

    try {
      const item = await database.deleteDocument(
        DATABASE_ID!,
        STAFF_COLLECTION_ID!,
        $id);
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

  export const updateItem = async (id: string, data: Staff) => {  
    const { database, userId } = await checkRequirements(STAFF_COLLECTION_ID);

    try {
      const business: Business = await getCurrentBusiness();

      if ( data.dashboardAccess ) {
        try{
          clerkClient.users.getUser(userId).then((user) => {
            clerkClient.users.getOrganizationMembershipList({ userId: user.id} ).then((organization) => {
              //TODO: Allow multiple organizations
              const invitation = {
                organizationId: organization.data[0].organization.id,
                inviterUserId: user.id,
                emailAddress: data.email,
                role: 'org:member',
                //redirectUrl: 'https://qroopos-git-dev-qroo-solutions.vercel.app',
                publicMetadata: {
                  onboardingComplete: true,
                  businessId: data.businessId,
                  invite: true,
                  organizationId: organization.data[0].organization.id,
                },
              };
  
              const invitationRespone = clerkClient.organizations.createOrganizationInvitation(invitation);

              invitationRespone.then((response) => {
                const userDetails: User = { 
                  name: data.name,
                  email: data.email, 
                  phoneNumber: data.phoneNumber,
                  dateOfBirth: data.dateOfBirth,
                  gender: data.gender,
                  country: data.nationality,
                  status: true,
                  points:0, 
                  isOwner: false, 
                  businesses: [business], 
                  userId: response.id  
                }
                createUser(userDetails);
              })
            })
          })
        }catch(e){
          console.error('Error giving user dashboard access', e)
        }
      }

      await database.updateDocument(
        DATABASE_ID!,
        STAFF_COLLECTION_ID!,
        id,
        data,
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

    revalidatePath('/staff')
    redirect('/staff')
  }