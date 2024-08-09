'use server';

import { parseStringify } from "../utils";
import {databaseCheck, handleError} from "@/lib/utils/actions-service";

const {
  COUNTRIES_COLLECTION: COUNTRIES_COLLECTION_ID,
} = process.env;

export const getCountries = async () => {
    const { database, databaseId, collectionId } = await databaseCheck(COUNTRIES_COLLECTION_ID);

    try {
        const countries = await database.listDocuments(
            databaseId,
            collectionId
        );

        if (countries.length == 0) return countries;

        return parseStringify(countries.documents);
    } catch (error: any) {
        handleError(error, "Error getting countries");
    }
}
