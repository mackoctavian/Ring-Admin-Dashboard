'use server';

import {databaseCheck} from "@/lib/utils/actions-service";

const env = process.env.NODE_ENV;

import * as Sentry from "@sentry/nextjs";
import {AppwriteException, ID, InputFile, Query} from "node-appwrite";
import {getStatusMessage, HttpStatusCode} from '../status-handler';
import {createAdminClient, createSaaSAdminClient, createStorageClient} from "../appwrite";
import {parseStringify} from "../utils";
import {Business, RegisterBusinessParams, SubscriptionDetails, User} from "@/types";
import {auth, clerkClient, currentUser} from "@clerk/nextjs/server";
import {Gender, SubscriptionStatus} from "@/types/data-schemas";
import {addDays} from 'date-fns';
import {createDefaultBranch} from "@/lib/actions/branch.actions"
import {createDefaultDepartment} from "@/lib/actions/department.actions"
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation'

const {
    APPWRITE_ENDPOINT,
    APPWRITE_PROJECT,
    APPWRITE_DATABASE: DATABASE_ID,
    BUSINESS_COLLECTION: BUSINESS_COLLECTION_ID,
    BUSINESS_CATEGORY_COLLECTION: BUSINESS_CATEGORY_COLLECTION_ID,
    USER_COLLECTION: USER_COLLECTION_ID,
    APPWRITE_SAAS_DATABASE: SAAS_DATABASE_ID,
    SUBSRIBERS_COLLECTION: SUBSCRIBERS_COLLECTION_ID,
    APPWRITE_BUCKET: APPWRITE_BUCKET,
    TRIAL_DAYS,
    SUBSCRIPTION_COST
} = process.env;

const handleError = (error: any) => {
    let errorMessage = 'Something went wrong with your request, please try again later.'
    if (error instanceof AppwriteException) { errorMessage = getStatusMessage(error.code as HttpStatusCode) }

    if (env === "development") { console.error(error) } else { Sentry.captureException(error) }

    throw Error(errorMessage);
}

const checkRequirements = async () => {
    if (!DATABASE_ID || !BUSINESS_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
    }

    const { database } = await createAdminClient();
    if (!database) throw new Error('Database client could not be initiated');

    const { userId } = auth();
    if (!userId) {
        throw new Error('You must be signed in to use this feature');
    }

    // const businessId = await getBusinessId();
    // if (!businessId) throw new Error('Business ID could not be initiated');

    return { database, userId };
}

export const getCurrentBusiness = async () => {
    try {
        const { database, businessId, databaseId, collectionId } = await databaseCheck(BUSINESS_COLLECTION_ID);
        //const businessId = await getBusinessId();
        //const { database } = await checkRequirements();
        const item = await database.getDocument(
            databaseId,
            collectionId,
            businessId
        );

        return parseStringify(item);
    } catch (error) {
        handleError(error);
    }
}

export const getBusinessId = async () => {
    try {
        let { orgId, userId, sessionClaims } = auth();
        if (!userId) { throw Error("User not found") }

        if (sessionClaims?.metadata?.businessId) return sessionClaims.metadata.businessId as string;

        if (!orgId && sessionClaims?.membership) orgId = Object.keys(sessionClaims.membership)[0];
        if (!orgId) return null;

        const { database } = await createAdminClient();
        const item = await database.listDocuments(
            DATABASE_ID!,
            BUSINESS_COLLECTION_ID!,
            [Query.equal('orgId', [orgId!])]
        );

        if (item.total < 1) return null;

        const business: Business = parseStringify(item.documents[0]);
        const businessId = business.$id;

        await clerkClient.users.updateUser(userId, {
            publicMetadata: { businessId },
            privateMetadata: { businessId },
        });

        return businessId;
    } catch (error) {
        handleError(error);
    }
}

export const getBusiness = async () => {
    try {
        const { database, userId } = await checkRequirements();
        const business = await database.listDocuments(
            DATABASE_ID!,
            BUSINESS_COLLECTION_ID!,
            [Query.equal('authId', [userId])]
        );

        if ( business.total < 1 ) return null;

        return parseStringify(business.documents[0]);
    } catch (error) {
        handleError(error);
    }
}

export const getSubscription = async () => {
    try {
        const businessId = await getBusinessId();
        if (!SAAS_DATABASE_ID || !SUBSCRIBERS_COLLECTION_ID) {
            throw new Error('SaaS Database ID or Subscribers Collection ID is missing');
        }

        const { database } = await createSaaSAdminClient();
        const item = await database.listDocuments(
            SAAS_DATABASE_ID,
            SUBSCRIBERS_COLLECTION_ID,
            [Query.equal('businessId', businessId as string)]
        );

        if (item.total < 1) return null

        return parseStringify(item.documents[0]) as SubscriptionDetails;
    } catch (error) {
        handleError(error);
    }
}

export const getBusinessInfo = async ({ user }: { user: string }) => {
    try {
        const { database } = await createAdminClient();
        const business = await database.listDocuments(
            DATABASE_ID!,
            BUSINESS_COLLECTION_ID!,
            [Query.equal('userId', [user])]
        );
        return parseStringify(business.documents[0]);
    } catch (error) {
        handleError(error);
    }
}

export const getBusinessTypes = async () => {
    try {
        const { database } = await createAdminClient();
        const data = await database.listDocuments(
            DATABASE_ID!,
            BUSINESS_CATEGORY_COLLECTION_ID!,
    [ Query.orderAsc("name") ]
        );
        return parseStringify(data.documents);
    } catch (error) {
        handleError(error);
    }
}

export const uploadFile = async (file: FormData) => {
    const { storage } = await createStorageClient();
    let uploadedFile;

    try{
        const inputFile =
            file &&
            await InputFile.fromBlob(
                file?.get("blobFile") as Blob,
                file?.get("fileName") as string
            );

        uploadedFile = await storage.createFile(
            APPWRITE_BUCKET!,
            ID.unique(),
            inputFile
        );

        return uploadedFile?.$id ? `${APPWRITE_ENDPOINT}/storage/buckets/${APPWRITE_BUCKET}/files/${uploadedFile.$id}/view??project=${APPWRITE_PROJECT}` : null;
    } catch (error) {
        console.error(error);
        //Fail gracefully if logo failed to upload
        return null;
    }
}

export const initTrial = async (businessId: string, data: User) => {
    try {
        const { database } = await createSaaSAdminClient();
        const trialEndDate = addDays(new Date(), parseInt(TRIAL_DAYS!, 10));
        const subscriptionCost = parseFloat(SUBSCRIPTION_COST!);

        await database.createDocument(
            SAAS_DATABASE_ID!,
            SUBSCRIBERS_COLLECTION_ID!,
            ID.unique(),
            {
                businessId,
                email: data.email,
                name: data.name,
                phoneNumber: data.phoneNumber,
                nextDue: trialEndDate,
                monthlyFee: subscriptionCost,
                status: SubscriptionStatus.TRIAL,
                owner: data.userId,
            }
        );
    } catch (error) {
        handleError(error);
    }
}

export const registerBusiness = async ({ logo, ...business }: RegisterBusinessParams)=> {
    let logoUrl;

    try {
        const generatedSlug = business.name.toLowerCase().replace(/\s+/g, '-');

        const { database } = await createAdminClient();
        const user = await currentUser();
        if (!user) { return { error: "User data could not be loaded" }; }

        const clerkOrganization = await clerkClient.organizations.createOrganization({
            name: business.name,
            createdBy: user.id,
        });

        // Persist business owner details
        const newBusinessOwner = await database.createDocument(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            ID.unique(),
            {
                email: user.primaryEmailAddress?.emailAddress.trim(),
                name: business.firstName.trim() + " " + business.lastName.trim(),
                firstName: business.firstName.trim(),
                lastName: business.lastName.trim(),
                phoneNumber: user.phoneNumbers.length > 0 ? user.phoneNumbers[0].phoneNumber : business.phoneNumber,
                image: user.imageUrl,
                gender: Gender.UNDISCLOSED,
                points: 0,
                status: true,
                userId: user.id,
                orgId: clerkOrganization.id,
                isOwner: true,
                termsConsent: business.termsConsent,
            }
        )

        // Upload logo if present
        if ( logo ) {
            logoUrl = await uploadFile(logo)

            //Only do this if logo was uploaded, else fail gracefully and proceed with business registration
            if( logoUrl ){
                //Prepare image for clerk organization
                const logoBlob = logo?.get("blobFile") as Blob;

                //Prepare image for clerk organization, do not await for this
                clerkClient.organizations.updateOrganizationLogo(
                    clerkOrganization.id,
                    {
                        uploaderUserId: user.id,
                        file: logoBlob
                    }
                )
            }
        }

        // Persist business details
        const { firstName, lastName, termsConsent, ...createBusinessObj } = business;
        const newBusiness = await database.createDocument(
            DATABASE_ID!,
            BUSINESS_COLLECTION_ID!,
            ID.unique(),
            {
                ...createBusinessObj,
                logo: logoUrl,
                slug: generatedSlug,
                branches: [],
                authId: user.id,
                orgId: clerkOrganization.id,
                users: [newBusinessOwner],
            }
        )

        initTrial(newBusiness.$id, parseStringify(newBusinessOwner));

        await clerkClient.users.updateUser(user.id, {
            firstName: business.firstName,
            lastName: business.lastName,
            publicMetadata: {
                fullName: business.firstName.trim() + business.lastName.trim(),
                firstName: business.firstName.trim(),
                lastName: business.lastName.trim(),
                onboardingComplete: true,
                businessId: newBusiness.$id,
                invite: false,
                organizationId: clerkOrganization.id,
            },
        })

        const newBranch = await createDefaultBranch(parseStringify(newBusiness))
        createDefaultDepartment(newBranch)
    } catch (error) {
        handleError(error);
    }

    revalidatePath("/business-registration")
    redirect('/dashboard')
}

export const updateItem = async (id: string, data: Business) => {
    try {
        const { database } = await createAdminClient();
        const item = await database.updateDocument(
            DATABASE_ID!,
            BUSINESS_COLLECTION_ID!,
            id,
            data
        );
        return parseStringify(item);
    } catch (error) {
        handleError(error);
    }
};