'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { PaymentType, PaymentTypeDto } from "@/types";

const {
    APPWRITE_DATABASE: DATABASE_ID,
    PAYMENT_TYPE_COLLECTION: PAYMENT_TYPE_COLLECTION_ID
  } = process.env;

  export const createPaymentType = async (data: PaymentTypeDto) => {
    try {
      if (!DATABASE_ID || !PAYMENT_TYPE_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();
  
      const item = await database.createDocument(
        DATABASE_ID!,
        PAYMENT_TYPE_COLLECTION_ID!,
        ID.unique(),
        {
          ...data,
        }
      )
  
      return parseStringify(item);
    } catch (error) {
      console.error(error);
    }
  }

  export const getPaymentTypes = async ( limit: number, offset: number, q: string ) => {
    try {
      if (!DATABASE_ID || !PAYMENT_TYPE_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();

      const data = await database.listDocuments(
        DATABASE_ID,
        PAYMENT_TYPE_COLLECTION_ID,
        [
          Query.limit(limit),
          Query.offset(offset)
        ]
      );

      return parseStringify(data.documents);

    }catch (error: any){
      console.error(error);
    }
  };

  export const getPaymentType = async (id: string) => {
    try {
      if (!DATABASE_ID || !PAYMENT_TYPE_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      if (!id) {
        throw new Error('Document ID is missing');
      }

      const { database } = await createAdminClient();
  
      const data = await database.listDocuments(
        DATABASE_ID!,
        PAYMENT_TYPE_COLLECTION_ID!,
        [Query.equal('$id', id)]
      )
  
      return parseStringify(data.documents[0]);
    } catch (error) {
      console.log(error)
    }
  }

  export const deletePaymentType = async ({ $id }: PaymentType) => {
    try {
      if (!DATABASE_ID || !PAYMENT_TYPE_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();
  
      const data = await database.deleteDocument(
        DATABASE_ID!,
        PAYMENT_TYPE_COLLECTION_ID!,
        $id);
  
      return parseStringify(data);
    } catch (error) {
      console.log(error)
    }
  }

  export const updatePaymentType = async (id: string, data: PaymentTypeDto) => {  
    try {
      if (!DATABASE_ID || !PAYMENT_TYPE_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();
  
      const updatedDocument = await database.updateDocument(
        DATABASE_ID!,
        PAYMENT_TYPE_COLLECTION_ID!,
        id,
        data);
  
      return parseStringify(updatedDocument);
    } catch (error) {
      console.log(error)
    }
  }