'use server';

import * as Sentry from "@sentry/nextjs";
import { ID, Query, AppwriteException } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { Branch, Business } from "@/types";
import { getStatusMessage, HttpStatusCode } from '../status-handler';
import { getBusinessId } from "./business.actions";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'
import {databaseCheck, handleError} from "@/lib/utils/actions-service";

const env = process.env.NODE_ENV;
const DATABASE_ID = process.env.APPWRITE_DATABASE;
const BRANCH_COLLECTION_ID = process.env.BRANCHES_COLLECTION;

const checkRequirements = async () => {
    if (!DATABASE_ID || !BRANCH_COLLECTION_ID) {
        throw new Error('Check requirements failed: Database ID or Collection ID is missing');
    }

    const { database } = await createAdminClient();
    if (!database) throw new Error('Database client could not be initiated');

    const { userId } = auth();
    if (!userId) {
        throw new Error('You must be signed in to use this feature');
    }

    const businessId = await getBusinessId();
    if (!businessId) throw new Error('Business ID could not be initiated');

    return { database, userId, businessId };
};

export const createDefaultBranch = async (business: Business) => {
    if (!business) return null
    try {
        const { database } = await createAdminClient()

        const newItem = await database.createDocument(
            DATABASE_ID!,
            BRANCH_COLLECTION_ID!,
            ID.unique(),
            {
                name: 'Main branch',
                email: business.email,
                phoneNumber: business.phoneNumber,
                address: business.address,
                daysOpen: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
                staffCount: 1,
                city: business.city,
                openingTime: "09:00",
                closingTime: "17:00",
                business,
                businessId: business.$id,
                canDelete: false,
                status: true,
            }
        );

        return parseStringify(newItem);
    } catch (error) {
        handleError(error);
    }
};

export const getCurrentBranch = async () => {
    try {
        const { database } = await checkRequirements();

        const item = await database.listDocuments(
            DATABASE_ID!,
            BRANCH_COLLECTION_ID!,
            [Query.limit(1)]
        );

        return item.documents.length ? parseStringify(item.documents[0]) : null;
    } catch (error) {
        handleError(error);
    }
};

export const createItem = async (item: Branch) => {
    if (!item) return null;
    try {
        const { database, businessId, databaseId, collectionId } = await databaseCheck(BRANCH_COLLECTION_ID, { needsBusinessId: true });

        await database.createDocument(
            databaseId,
            collectionId,
            ID.unique(),
            {
                ...item,
                business: businessId,
                businessId: businessId,
            }
        );
    } catch (error) {
        handleError(error);
    }

    revalidatePath('/dashboard/branches');
    redirect('/dashboard/branches');
}

export const list = async () => {
    try {
        const { database, businessId } = await checkRequirements();

        const items = await database.listDocuments(
            DATABASE_ID!,
            BRANCH_COLLECTION_ID!,
            [Query.equal('businessId', [businessId])]
        );

        return parseStringify(items.documents);
    } catch (error) {
        handleError(error);
    }
};

export const getItems = async (
    q?: string,
    status?: boolean | null,
    limit?: number | null,
    offset: number = 1,
) => {
    try {
        const { database, businessId } = await checkRequirements();
        const queries = [
            Query.equal('businessId', [businessId]),
            Query.orderDesc("$createdAt")
        ];

        if (limit) {
            queries.push(Query.limit(limit), Query.offset(offset));
        }

        if (q) {
            queries.push(Query.search('name', q));
        }

        if (status !== undefined && status !== null) {
            queries.push(Query.equal('status', status));
        }

        const items = await database.listDocuments(
            DATABASE_ID!,
            BRANCH_COLLECTION_ID!,
            queries
        );

        return parseStringify(items.documents);
    } catch (error) {
        handleError(error);
    }
};

export const getItem = async (id: string) => {
    if (!id) return null;
    try {
        const { database } = await checkRequirements();

        const item = await database.getDocument(
            DATABASE_ID!,
            BRANCH_COLLECTION_ID!,
            id
        );

        return parseStringify(item);
    } catch (error) {
        handleError(error);
    }
};

export const deleteItem = async ({ $id }: Branch) => {
    if (!$id) return null;
    try {
        const { database } = await checkRequirements();

        await database.deleteDocument(
            DATABASE_ID!,
            BRANCH_COLLECTION_ID!,
            $id
        )
    } catch (error) {
        handleError(error);
    }

    revalidatePath('/dashboard/branches');
    redirect('/dashboard/branches');
};

export const updateItem = async (id: string, data: Branch) => {
    if (!id || !data) return null;
    try {
        const { database } = await checkRequirements();

        await database.updateDocument(
            DATABASE_ID!,
            BRANCH_COLLECTION_ID!,
            id,
            data
        )
    } catch (error) {
        handleError(error);
    }

    revalidatePath('/dashboard/branches');
    redirect('/dashboard/branches');
}