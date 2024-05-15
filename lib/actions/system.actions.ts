'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { parseStringify } from "../utils";
import { revalidatePath } from "next/cache";


const {
  APPWRITE_DATABASE: DATABASE_ID,
  COUNTRIES_COLLECTION: COUNTRIES_COLLECTION_ID,
} = process.env;

export const getCountries = async () => {
    try {
        if (!DATABASE_ID || !COUNTRIES_COLLECTION_ID) {
            throw new Error('Database ID or Collection ID is missing');
        }

        const { database } = await createAdminClient();

        const countries = await database.listDocuments(
            DATABASE_ID,
            COUNTRIES_COLLECTION_ID
        );

        return parseStringify(countries.documents);
    } catch (error: any) {
        throw new Error(`Error fetching countries: ${(error as Error).message}`);
    }
}
