'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { Vendor, VendorDto } from "@/types";

const {
    APPWRITE_DATABASE: DATABASE_ID,
    VENDORS_COLLECTION: VENDOR_COLLECTION_ID
  } = process.env;

  export const createVendor = async (vendor: VendorDto) => {
    try {
      if (!DATABASE_ID || !VENDOR_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();
  
      const newItem = await database.createDocument(
        DATABASE_ID!,
        VENDOR_COLLECTION_ID!,
        ID.unique(),
        {
          ...vendor,
        }
      )
  
      return parseStringify(newItem);
    } catch (error) {
      console.error(error);
    }
  }

  export const getVendors = async () => {
    try {
      if (!DATABASE_ID || !VENDOR_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();

      const items = await database.listDocuments(
        DATABASE_ID,
        VENDOR_COLLECTION_ID,
      );

      return parseStringify(items.documents);

    }catch (error: any){
      console.error(error);
    }
  };

  export const getVendor = async (id: string) => {
    try {
      if (!DATABASE_ID || !VENDOR_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      if (!id) {
        throw new Error('Document ID is missing');
      }

      const { database } = await createAdminClient();
  
      const item = await database.listDocuments(
        DATABASE_ID!,
        VENDOR_COLLECTION_ID!,
        [Query.equal('$id', id)]
      )
  
      return parseStringify(item.documents[0]);
    } catch (error) {
      console.log(error)
    }
  }

  export const deleteVendor = async ({ $id }: Vendor) => {
    try {
      if (!DATABASE_ID || !VENDOR_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();
  
      const item = await database.deleteDocument(
        DATABASE_ID!,
        VENDOR_COLLECTION_ID!,
        $id);
  
      return parseStringify(item);
    } catch (error) {
      console.log(error)
    }
  }

  export const updateVendor = async (id: string, data: VendorDto) => {  
    try {
      if (!DATABASE_ID || !VENDOR_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();
  
      const item = await database.updateDocument(
        DATABASE_ID!,
        VENDOR_COLLECTION_ID!,
        id,
        data);
  
      return parseStringify(item);
    } catch (error) {
      console.log(error)
    }
  }