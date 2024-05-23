'use server';

import { ID, Query, AppwriteException } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { Service, ServiceDto } from "@/types";
import { getStatusMessage, HttpStatusCode } from '../status-handler'; 

const {
    APPWRITE_DATABASE: DATABASE_ID,
    SERVICES_COLLECTION: SERVICE_COLLECTION_ID
  } = process.env;

  export const createService = async (service: Service) => {
    try {
      if (!DATABASE_ID || !SERVICE_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();
  
      const newItem = await database.createDocument(
        DATABASE_ID!,
        SERVICE_COLLECTION_ID!,
        ID.unique(),
        {
          ...service,
        }
      )
  
      return parseStringify(newItem);
    } catch (error: any) {
      let errorMessage = 'Something went wrong with your request, please try again later.';
      if (error instanceof AppwriteException) {
        errorMessage = getStatusMessage(error.code as HttpStatusCode);
      }
      throw Error(JSON.stringify(error));
    }
  }

  export const getServices = async () => {
    try {
      if (!DATABASE_ID || !SERVICE_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();

      const items = await database.listDocuments(
        DATABASE_ID,
        SERVICE_COLLECTION_ID,
      );

      return parseStringify(items.documents);

    }catch (error: any){
      console.error(error);
    }
  };

  export const getService = async (id: string) => {
    try {
      if (!DATABASE_ID || !SERVICE_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      if (!id) {
        throw new Error('Document ID is missing');
      }

      const { database } = await createAdminClient();
  
      const item = await database.listDocuments(
        DATABASE_ID!,
        SERVICE_COLLECTION_ID!,
        [Query.equal('$id', id)]
      )
  
      return parseStringify(item.documents[0]);
    } catch (error) {
      console.log(error)
    }
  }

  export const deleteService = async ({ $id }: Service) => {
    try {
      if (!DATABASE_ID || !SERVICE_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      if ( !$id ){
        throw new Error('Document ID is missing');
      }

      const { database } = await createAdminClient();
  
      const item = await database.deleteDocument(
        DATABASE_ID!,
        SERVICE_COLLECTION_ID!,
        $id);
  
      return parseStringify(item);
    } catch (error) {
      console.log(error)
    }
  }

  export const updateService = async (id: string, data: Service) => {  
    try {
      if (!DATABASE_ID || !SERVICE_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      if ( !id ){
        throw new Error('Document ID is missing');
      }

      const { database } = await createAdminClient();
  
      const item = await database.updateDocument(
        DATABASE_ID!,
        SERVICE_COLLECTION_ID!,
        id,
        data);
  
      return parseStringify(item);
    } catch (error) {
      console.log(error)
    }
  }