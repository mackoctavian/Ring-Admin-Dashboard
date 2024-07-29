const env = process.env.NODE_ENV

import * as Sentry from "@sentry/nextjs"
import {createAdminClient} from "@/lib/appwrite"
import {auth} from "@clerk/nextjs/server"
import {getBusinessId} from "@/lib/actions/business.actions"
import {AppwriteException} from "node-appwrite"
import {getStatusMessage, HttpStatusCode} from "@/lib/status-handler"

const {
    APPWRITE_DATABASE: DATABASE_ID,
    APPWRITE_SAAS_DATABASE: SAAS_DATABASE_ID
} = process.env;

export const databaseCheck = async (collectionId: string | undefined) => {
    if (!DATABASE_ID || !collectionId) throw new Error('Database ID or Collection ID is missing')
    const databaseId = DATABASE_ID

    const { database } = await createAdminClient()
    if (!database) throw new Error('Database client could not be initiated')

    const { userId } = auth()
    if (!userId) throw new Error('You must be signed in to use this feature')

    const businessId = await getBusinessId()
    if( !businessId ) throw new Error('Business ID could not be initiated')

    return { database, userId, businessId, databaseId, collectionId }
}

export const saasDatabaseCheck = async (collectionId: string | undefined) => {
    if (!SAAS_DATABASE_ID || !collectionId) throw new Error('Database ID or Collection ID is missing');

    const { database } = await createAdminClient();
    if (!database) throw new Error('Database client could not be initiated');

    const { userId } = auth();
    if (!userId) {
        throw new Error('You must be signed in to use this feature');
    }

    const businessId = await getBusinessId();
    if( !businessId ) throw new Error('Business ID could not be initiated');

    return { database, userId, businessId };
}

export const handleError = (error: any, message?: string) => {
    let errorMessage = 'Something went wrong with your request, please try again later.'
    if (error instanceof AppwriteException) { errorMessage = getStatusMessage(error.code as HttpStatusCode) }

    if (env === "development") { console.error(error) } else { Sentry.captureException(error) }

    throw Error(errorMessage);
}