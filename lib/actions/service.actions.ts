'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { Service, ServiceDto } from "@/types";

const {
    APPWRITE_DATABASE: DATABASE_ID,
    SERVICES_COLLECTION: SERVICE_COLLECTION_ID
  } = process.env;

  export const createService = async (service: ServiceDto) => {
    try {
      if (!DATABASE_ID || !SERVICE_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();
  
      const item = await database.createDocument(
        DATABASE_ID!,
        SERVICE_COLLECTION_ID!,
        ID.unique(),
        {
          ...service,
        }
      )
  
      return parseStringify(item);
    } catch (error) {
      console.error(error);
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

  export const updateService = async (id: string, data: ServiceDto) => {  
    try {
      if (!DATABASE_ID || !SERVICE_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
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