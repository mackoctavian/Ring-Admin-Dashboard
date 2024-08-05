'use server';

import {databaseCheck, handleError} from "@/lib/utils/actions-service";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import { Staff, User } from "@/types";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createUser } from "./user.actions"
const {
    STAFF_COLLECTION: STAFF_COLLECTION_ID,
    SITE_URL: SITE_URL
} = process.env;

export const createItem = async (item: Staff) => {
  const { database, businessId, userId, databaseId, collectionId } = await databaseCheck(STAFF_COLLECTION_ID, { needsBusinessId: true, needsUserId: true });

    try {
      //Send invite to user
      if ( item.dashboardAccess ) {
        const { orgId } = auth()

        if( orgId && item.email ){
          const user = {
            firstName: item.firstName,
            lastName: item.lastName,
            email: item.email,
            name: item.firstName +" "+ item.lastName,
            phoneNumber: item.phoneNumber,
            image: item.image,
            city: undefined,
            country: item.nationality,
            gender: item.gender,
            dateOfBirth: item.dateOfBirth,
            points: 0,
            status: true,
            userId: 'invitee',
            orgId: orgId,
            business: [businessId],
            isOwner: false,
            termsConsent: true
          }

          //@ts-ignore
          await createUser(user);

          try{
            clerkClient.users.getUser(userId!).then((user) => {
              clerkClient.users.getOrganizationMembershipList({ userId: user.id} ).then((organization) => {
                //TODO: Allow multiple organizations
                const invitation = {
                  organizationId: organization.data[0].organization.id,
                  inviterUserId: user.id,
                  emailAddress: item.email!,
                  role: 'org:member',
                  redirectUrl: SITE_URL
                };

                clerkClient.organizations.createOrganizationInvitation(invitation);
              })
            })
          }catch(e){
            item.dashboardAccess = false;
            console.error('Organization ID could not be initiated ,disabled dashboard access');
          }

        }
      }

      await database.createDocument(
          databaseId,
          collectionId,
          ID.unique(),
          {
            ...item,
            businessId: businessId,
          }
      )
      
    } catch (error: any) {
      handleError(error, "Error adding staff member");
    }

    revalidatePath('/dashboard/staff')
    redirect('/dashboard/staff')
  }

export const list = async ( ) => {
  const { database, businessId, databaseId, collectionId } = await databaseCheck(STAFF_COLLECTION_ID, { needsBusinessId: true });

  try {
    const items = await database.listDocuments(
      databaseId,
      collectionId,
      [Query.equal('businessId', businessId!)]
    )

    if( items.documents.length == 0) return null;

    return parseStringify(items.documents);

  }catch (error: any){
    handleError(error, "Error listing staff members");
  }
}

  export const getItems = async (
    q?: string,
    status?: boolean | null,
    limit?: number | null, 
    offset?: number | 1,
  ) => {
    const { database, businessId, databaseId, collectionId } = await databaseCheck(STAFF_COLLECTION_ID, { needsBusinessId: true });
  
    try {
      
      const queries = [];

      queries.push(Query.equal('businessId', businessId!));
      queries.push(Query.orderDesc("$createdAt"));
      queries.push(Query.orderAsc("firstName"));

      if ( limit ) {
        queries.push(Query.limit(limit));
        queries.push(Query.offset(offset!));
      }
  
      if (q) {
        queries.push(Query.search('firstName', q));
        queries.push(Query.search('lastName', q));
      }
  
      if (status) {
        queries.push(Query.equal('status', status));
      }
  
      const items = await database.listDocuments(
        databaseId,
        collectionId,
        queries
      );
  
      if (items.documents.length === 0) return null;

      return parseStringify(items.documents);
    } catch (error: any) {
      handleError(error, "Error getting staff members");
    }
  }

  export const getItem = async (id: string) => {
    if (!id) return null;
    const { database, databaseId, collectionId } = await databaseCheck(STAFF_COLLECTION_ID);

    try {
      const item = await database.listDocuments(
        databaseId,
        collectionId,
        [Query.equal('$id', id)]
      )

      if ( item.documents.length == 0 ) return null;
  
      return parseStringify(item.documents[0]);
    } catch (error: any) {
      handleError(error, "Error getting staff item");
    }
  }

  export const deleteItem = async ({ $id }: Staff) => {
    if (!$id) return null;
    const { database, databaseId, collectionId } = await databaseCheck(STAFF_COLLECTION_ID);

    try {
      const item = await database.deleteDocument(
        databaseId,
        collectionId,
        $id);
    } catch (error: any) {
      handleError(error, "Error deleting staff member");
    }
  }

  export const updateItem = async (id: string, data: Staff) => {
    if (!id || !data) return null;
    const { database, databaseId,businessId, collectionId } = await databaseCheck(STAFF_COLLECTION_ID, { needsBusinessId: true });

    try {
      const { userId } = auth();
      if (!userId) return null;

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
                redirectUrl: SITE_URL,
                publicMetadata: {
                  onboardingComplete: true,
                  businessId: data.businessId,
                  invite: true,
                  organizationId: organization.data[0].organization.id,
                },
              };

              //@ts-ignore
              const invitationRespone = clerkClient.organizations.createOrganizationInvitation(invitation);

              invitationRespone.then((response) => {
                const userDetails: User = { 
                  firstName: data.firstName,
                  lastName: data.lastName,
                  email: data.email!,
                  phoneNumber: data.phoneNumber,
                  dateOfBirth: data.dateOfBirth,
                  gender: data.gender,
                  country: data.nationality,
                  status: true,
                  points:0, 
                  isOwner: false, 
                  business: businessId!,
                  userId: response.id,
                  name: data.firstName + ' '+data.lastName,
                  orgId: organization.data[0].organization.id,
                  termsConsent: true
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
        databaseId,
        collectionId,
        id,
        data,
      );
    } catch (error: any) {
      handleError(error, "Error updating staff member");
    }

    revalidatePath('/dashboard/staff')
    redirect('/dashboard/staff')
  }