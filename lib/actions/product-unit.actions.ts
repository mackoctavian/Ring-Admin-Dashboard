'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { ProductUnitDto, ProductUnit } from "@/types";

const {
    APPWRITE_DATABASE: DATABASE_ID,
    PRODUCT_UNITS_COLLECTION: PRODUCT_UNITS_ID
  } = process.env;


  export const createProductUnit = async (productUnit: ProductUnitDto) => {
    try {
      if (!DATABASE_ID || !PRODUCT_UNITS_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();
  
      const newProductUnit = await database.createDocument(
        DATABASE_ID!,
        PRODUCT_UNITS_ID!,
        ID.unique(),
        {
          ...productUnit,
        }
      )
  
      return parseStringify(newProductUnit);
    } catch (error) {
      console.error(error);
    }
  }

  export const getProductUnits = async () => {
    try {
      if (!DATABASE_ID || !PRODUCT_UNITS_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();

      const productUnits = await database.listDocuments(
        DATABASE_ID,
        PRODUCT_UNITS_ID
      );

      return parseStringify(productUnits.documents);

    }catch (error: any){
      console.error(error);
    }
  };

  export const getProductUnit = async (id: string) => {
    try {
      if (!DATABASE_ID || !PRODUCT_UNITS_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      if (!id) {
        throw new Error('Document ID is missing');
      }

      const { database } = await createAdminClient();
  
      const productUnit = await database.listDocuments(
        DATABASE_ID!,
        PRODUCT_UNITS_ID!,
        [Query.equal('$id', id)]
      )
  
      return parseStringify(productUnit.documents[0]);
    } catch (error) {
      console.log(error)
    }
  }

  export const deleteProductUnit = async ({ $id }: ProductUnit) => {
    try {
      if (!DATABASE_ID || !PRODUCT_UNITS_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();
  
      const productUnit = await database.deleteDocument(
        DATABASE_ID!,
        PRODUCT_UNITS_ID!,
        $id);
  
      return parseStringify(productUnit);
    } catch (error) {
      console.log(error)
    }
  }

  export const updateProductUnit = async (id: string, data: ProductUnitDto) => {  
    try {
      if (!DATABASE_ID || !PRODUCT_UNITS_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();
  
      const productUnit = await database.updateDocument(
        DATABASE_ID!,
        PRODUCT_UNITS_ID!,
        id,
        data);
  
      return parseStringify(productUnit);
    } catch (error) {
      console.log(error)
    }
  }