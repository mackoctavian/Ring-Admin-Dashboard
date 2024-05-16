'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { Category, CategoryDto } from "@/types";

const {
    APPWRITE_DATABASE: DATABASE_ID,
    CATEGORIES_COLLECTION: CATEGORY_COLLECTION_ID
  } = process.env;

  export const createCategory = async (category: CategoryDto) => {
    try {
      if (!DATABASE_ID || !CATEGORY_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();
  
      const newCategory = await database.createDocument(
        DATABASE_ID!,
        CATEGORY_COLLECTION_ID!,
        ID.unique(),
        {
          ...category,
        }
      )
  
      return parseStringify(newCategory);
    } catch (error) {
      console.error(error);
    }
  }

  export const getCategories = async () => {
    try {
      if (!DATABASE_ID || !CATEGORY_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();

      const categories = await database.listDocuments(
        DATABASE_ID,
        CATEGORY_COLLECTION_ID,
      );

      return parseStringify(categories.documents);

    }catch (error: any){
      console.error(error);
    }
  };

  export const getCategory = async (id: string) => {
    try {
      if (!DATABASE_ID || !CATEGORY_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      if (!id) {
        throw new Error('Document ID is missing');
      }

      const { database } = await createAdminClient();
  
      const category = await database.listDocuments(
        DATABASE_ID!,
        CATEGORY_COLLECTION_ID!,
        [Query.equal('$id', id)]
      )
  
      return parseStringify(category.documents[0]);
    } catch (error) {
      console.log(error)
    }
  }

  export const deleteCategory = async ({ $id }: Category) => {
    try {
      if (!DATABASE_ID || !CATEGORY_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();
  
      const category = await database.deleteDocument(
        DATABASE_ID!,
        CATEGORY_COLLECTION_ID!,
        $id);
  
      return parseStringify(category);
    } catch (error) {
      console.log(error)
    }
  }

  export const updateCategory = async (id: string, data: CategoryDto) => {  
    try {
      if (!DATABASE_ID || !CATEGORY_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();
  
      const category = await database.updateDocument(
        DATABASE_ID!,
        CATEGORY_COLLECTION_ID!,
        id,
        data);
  
      return parseStringify(category);
    } catch (error) {
      console.log(error)
    }
  }