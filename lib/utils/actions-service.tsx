import {UploadResult} from "@/types";

const env = process.env.NODE_ENV

import * as Sentry from "@sentry/nextjs"
import {createAdminClient, createSaaSAdminClient, createStorageClient} from "@/lib/appwrite"
import {auth} from "@clerk/nextjs/server"
import {getBusinessId} from "@/lib/actions/business.actions"
import {AppwriteException, ID, InputFile} from "node-appwrite"
import {getStatusMessage, HttpStatusCode} from "@/lib/status-handler"

const {
    APPWRITE_ENDPOINT,
    APPWRITE_PROJECT,
    APPWRITE_BUCKET,
    APPWRITE_DATABASE: DATABASE_ID,
    APPWRITE_SAAS_DATABASE: SAAS_DATABASE_ID
} = process.env;

export const databaseCheck = async (
    collectionId: string | undefined,
    options: {
        needsDatabase?: boolean;
        needsUserId?: boolean;
        needsBusinessId?: boolean;
    } = {}
) => {
    const result: {
        database?: any;
        userId?: string;
        businessId?: string;
        databaseId?: string;
        collectionId?: string;
    } = {};

    if (!DATABASE_ID || !collectionId) {
        throw new Error('Database ID or Collection ID is missing');
    }

    result.databaseId = DATABASE_ID;
    result.collectionId = collectionId;

    //force return database data
    const { database } = await createAdminClient();
    if (!database) throw new Error('Database client could not be initiated');
    result.database = database;

    if (options.needsUserId) {
        const { userId } = auth();
        if (!userId) throw new Error('You must be signed in to use this feature');
        result.userId = userId;
    }

    if (options.needsBusinessId) {
        const businessId = await getBusinessId();
        if (!businessId) throw new Error('Business ID could not be initiated');
        result.businessId = businessId;
    }

    return result;
}

export const saasDatabaseCheck = async (
    collectionId: string | undefined,
    options: {
        needsDatabase?: boolean;
        needsUserId?: boolean;
        needsBusinessId?: boolean;
    } = {}
) => {
    const result: {
        database?: any;
        userId?: string;
        businessId?: string;
        databaseId?: string;
        collectionId?: string;
    } = {};

    if (!SAAS_DATABASE_ID || !collectionId) {
        throw new Error('Database ID or Collection ID is missing');
    }

    //force return database id and collection
    result.databaseId = SAAS_DATABASE_ID;
    result.collectionId = collectionId;

    //force return database
    const { database } = await createSaaSAdminClient();
    if (!database) throw new Error('Database client could not be initiated');
    result.database = database;

    if (options.needsUserId) {
        const { userId } = auth();
        if (!userId) throw new Error('You must be signed in to use this feature');
        result.userId = userId;
    }

    if (options.needsBusinessId) {
        const businessId = await getBusinessId();
        if (!businessId) throw new Error('Business ID could not be initiated');
        result.businessId = businessId;
    }

    return result;
}

export const handleError = (error: any, message?: string) => {
    let errorMessage = 'Something went wrong with your request, please try again later.'
    if (error instanceof AppwriteException) { errorMessage = getStatusMessage(error.code as HttpStatusCode) }

    if (env === "development") {
        throw new Error(message + ' ' + error )
    } else {
        Sentry.captureException(message + ' ' + error )
        throw new Error(errorMessage)
    }
}

export const uploadFile = async (file: FormData): Promise<UploadResult> => {
    const { storage } = await createStorageClient();

    try {
        if (!file || !file.get("blobFile") || !file.get("fileName")) {
            throw new Error("Invalid file data");
        }

        const inputFile = await InputFile.fromBlob(
            file.get("blobFile") as Blob,
            file.get("fileName") as string
        );

        const uploadedFile = await storage.createFile(
            APPWRITE_BUCKET!,
            ID.unique(),
            inputFile
        );

        if (!uploadedFile.$id) {
            throw new Error("File upload failed");
        }

        return {
            imageUrl: `${APPWRITE_ENDPOINT}/storage/buckets/${APPWRITE_BUCKET}/files/${uploadedFile.$id}/view?project=${APPWRITE_PROJECT}`,
            imageId: uploadedFile.$id
        };
    } catch (error) {
        console.error('Error uploading file:', error);
        return { imageUrl: null, imageId: null };
    }
};

export const deleteFile = async (fileId: string) => {
    const { storage } = await createStorageClient();

    try{
        await storage.deleteFile(
            APPWRITE_BUCKET!,
            fileId
        )
    } catch (error) {
        console.error('Error deleting file:', error);
        //Fail gracefully if logo failed to upload
        return null;
    }
}

export const shouldReplaceImage = async (oldImageId: string, newImageFile: FormData) => {
    if (!oldImageId || !newImageFile) return true;
    const { storage } = await createStorageClient();
    const imageBlob = newImageFile.get("blobFile") as Blob;

    try {
        const oldImage = await storage.getFile(APPWRITE_BUCKET!, oldImageId);

        const oldImageSize = oldImage.sizeOriginal;

        // Compare sizes only if both are non-zero
        const sizesDiffer = (oldImageSize > 1 && imageBlob.size > 1) && (oldImageSize !== imageBlob.size);
        console.log("sizesDiffer:", sizesDiffer);

        return sizesDiffer;
    } catch (error) {
        console.error("Error in shouldReplaceImage:", error);
        return true;
    }
};