'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { Branch, BranchDto } from "@/types";

const {
    APPWRITE_DATABASE: DATABASE_ID,
    BRANCHES_COLLECTION: BRANCH_COLLECTION_ID
  } = process.env;

  export const createBranch = async (branch: BranchDto) => {
    try {
      if (!DATABASE_ID || !BRANCH_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();
  
      const newBranch = await database.createDocument(
        DATABASE_ID!,
        BRANCH_COLLECTION_ID!,
        ID.unique(),
        {
          ...branch,
        }
      )
  
      return parseStringify(newBranch);
    } catch (error) {
      console.error(error);
    }
  }

  export const getBranches = async () => {
    try {
      if (!DATABASE_ID || !BRANCH_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();

      const branches = await database.listDocuments(
        DATABASE_ID,
        BRANCH_COLLECTION_ID,
      );

      return parseStringify(branches.documents);

    }catch (error: any){
      console.error(error);
    }
  };

  export const getBranch = async (id: string) => {
    try {
      if (!DATABASE_ID || !BRANCH_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      if (!id) {
        throw new Error('Document ID is missing');
      }

      const { database } = await createAdminClient();
  
      const branch = await database.listDocuments(
        DATABASE_ID!,
        BRANCH_COLLECTION_ID!,
        [Query.equal('$id', id)]
      )
  
      return parseStringify(branch.documents[0]);
    } catch (error) {
      console.log(error)
    }
  }

  export const deleteBranch = async ({ $id }: Branch) => {
    try {
      if (!DATABASE_ID || !BRANCH_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();
  
      const branch = await database.deleteDocument(
        DATABASE_ID!,
        BRANCH_COLLECTION_ID!,
        $id);
  
      return parseStringify(branch);
    } catch (error) {
      console.log(error)
    }
  }

  export const updateBranch = async (id: string, data: BranchDto) => {  
    try {
      if (!DATABASE_ID || !BRANCH_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();
  
      const branch = await database.updateDocument(
        DATABASE_ID!,
        BRANCH_COLLECTION_ID!,
        id,
        data);
  
      return parseStringify(branch);
    } catch (error) {
      console.log(error)
    }
  }