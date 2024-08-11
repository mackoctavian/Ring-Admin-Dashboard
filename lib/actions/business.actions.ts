'use server';

import {databaseCheck, handleError, saasDatabaseCheck, uploadFile} from "@/lib/utils/actions-service";
import {ID, Query} from "node-appwrite";
import {createAdminClient} from "../appwrite";
import {parseStringify} from "../utils";
import {Business, RegisterBusinessParams, SubscriptionDetails, User} from "@/types";
import {auth, clerkClient, currentUser} from "@clerk/nextjs/server";
import {Gender, SubscriptionStatus} from "@/types/data-schemas";
import {addDays} from 'date-fns';
import {createDefaultBranch} from "@/lib/actions/branch.actions"
import {createDefaultDepartment} from "@/lib/actions/department.actions"
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation'

import * as Sentry from "@sentry/nextjs";

const {
    APPWRITE_DATABASE: DATABASE_ID,
    BUSINESS_COLLECTION: BUSINESS_COLLECTION_ID,
    BUSINESS_TYPE_COLLECTION: BUSINESS_TYPE_COLLECTION_ID,
    USER_COLLECTION: USER_COLLECTION_ID,
    SUBSRIBERS_COLLECTION: SUBSCRIBERS_COLLECTION_ID,
    APPWRITE_BUCKET: APPWRITE_BUCKET,
    TRIAL_DAYS,
    SUBSCRIPTION_COST
} = process.env;

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

        if (item.total == 0) return null;

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
    const { database, databaseId, userId, collectionId } = await databaseCheck(BUSINESS_COLLECTION_ID, { needsUserId: true });

    try {
        const business = await database.listDocuments(
            databaseId!,
            collectionId!,
            [Query.equal('authId', [userId!])]
        )

        if ( business.total == 0 ) return null;

        return parseStringify(business.documents[0]);
    } catch (error) {
        handleError(error);
    }
}

export const getSubscription = async () => {
    const { database, businessId, databaseId, collectionId } = await saasDatabaseCheck(SUBSCRIBERS_COLLECTION_ID, { needsBusinessId: true });

    try {
        const item = await database.listDocuments(
            databaseId,
            collectionId,
            [Query.equal('businessId', businessId!)]
        );

        if (item.total == 0) return null

        return parseStringify(item.documents[0]) as SubscriptionDetails;
    } catch (error) {
        handleError(error);
    }
}

export const getBusinessTypes = async () => {
    const { database, databaseId, collectionId } = await saasDatabaseCheck(BUSINESS_TYPE_COLLECTION_ID);

    try {
        const data = await database.listDocuments(
            databaseId,
            collectionId,
    [ Query.orderAsc("name") ]
        )

        if ( data.total == 0 ) return null;

        return parseStringify(data.documents);
    } catch (error) {
        handleError(error);
    }
}

export const initTrial = async (businessId: string, data: User) => {
    const { database, databaseId, collectionId } = await saasDatabaseCheck(SUBSCRIBERS_COLLECTION_ID);

    try {
        const trialEndDate = addDays(new Date(), parseInt(TRIAL_DAYS!, 10));
        const subscriptionCost = parseFloat(SUBSCRIPTION_COST!);

        await database.createDocument(
            databaseId,
            collectionId,
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

export const registerBusiness = async ({ logo, ...business }: RegisterBusinessParams) => {
    const { database, databaseId, collectionId } = await databaseCheck(USER_COLLECTION_ID);

    try {
        return await Sentry.withServerActionInstrumentation(
            "Business Registration", // The name you want to associate this Server Action with in Sentry
            { recordResponse: true },
            async () => {
                const user = await currentUser();
                if (!user) throw new Error("User data could not be loaded");

                const generatedSlug = business.name.toLowerCase().replace(/\s+/g, '-');
                const fullName = `${business.firstName.trim()} ${business.lastName.trim()}`;

                const [clerkOrganization, logoData] = await Promise.all([
                    clerkClient.organizations.createOrganization({
                        name: business.name,
                        createdBy: user.id,
                    }),
                    logo ? uploadFile(logo) : Promise.resolve(null)
                ]);

                await Promise.all([
                    clerkClient.users.updateUser(user.id, {
                        firstName: business.firstName,
                        lastName: business.lastName
                    }),
                    logoData?.imageUrl && clerkClient.organizations.updateOrganizationLogo(
                        clerkOrganization.id,
                        {
                            uploaderUserId: user.id,
                            file: logo?.get("blobFile") as Blob
                        }
                    )
                ]);

                const newBusinessOwner = await database.createDocument(
                    databaseId,
                    collectionId,
                    ID.unique(),
                    {
                        email: user.primaryEmailAddress?.emailAddress.trim(),
                        name: fullName,
                        firstName: business.firstName.trim(),
                        lastName: business.lastName.trim(),
                        phoneNumber: user.phoneNumbers[0]?.phoneNumber || business.phoneNumber,
                        image: user.imageUrl,
                        gender: Gender.UNDISCLOSED,
                        points: 0,
                        status: true,
                        userId: user.id,
                        orgId: clerkOrganization.id,
                        isOwner: true,
                        termsConsent: business.termsConsent,
                    }
                );

                const { firstName, lastName, termsConsent, ...createBusinessObj } = business;
                const newBusiness = await database.createDocument(
                    databaseId,
                    BUSINESS_COLLECTION_ID!,
                    ID.unique(),
                    {
                        ...createBusinessObj,
                        logo: logoData?.imageUrl,
                        slug: generatedSlug,
                        branches: [],
                        authId: user.id,
                        orgId: clerkOrganization.id,
                        users: [newBusinessOwner.$id],
                    }
                );

                await Promise.all([
                    initTrial(newBusiness.$id, parseStringify(newBusinessOwner)),
                    clerkClient.users.updateUser(user.id, {
                        publicMetadata: {
                            fullName,
                            firstName: business.firstName.trim(),
                            lastName: business.lastName.trim(),
                            onboardingComplete: true,
                            businessId: newBusiness.$id,
                            invite: false,
                            organizationId: clerkOrganization.id,
                        },
                    }),

                    // Create default branch and department
                    createDefaultBranch(parseStringify(newBusiness)).then(createDefaultDepartment)
                ]);
            }
        );
    } catch (error) {
        handleError(error);
    }

    //revalidatePath("/business-registration");
    redirect('/dashboard');
};

export const updateItem = async (id: string, data: Business) => {
    if( !id || !data) return null;
    const { database, databaseId, collectionId } = await databaseCheck(BUSINESS_COLLECTION_ID);

    try {
        await database.updateDocument(
            databaseId,
            collectionId,
            id,
            data
        )
    } catch (error) {
        handleError(error);
    }

    revalidatePath("/dashboard/settings/business");
}