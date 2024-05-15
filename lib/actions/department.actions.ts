'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { DepartmentDto, Department } from "@/types";

const {
    APPWRITE_DATABASE: DATABASE_ID,
    DEPARTMENTS_COLLECTION: DEPARTMENT_COLLECTION_ID
  } = process.env;


  export const createDepartment = async (department: DepartmentDto) => {
    try {
      if (!DATABASE_ID || !DEPARTMENT_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();
  
      const newDepartment = await database.createDocument(
        DATABASE_ID!,
        DEPARTMENT_COLLECTION_ID!,
        ID.unique(),
        {
          ...department,
        }
      )
  
      return parseStringify(newDepartment);
    } catch (error) {
      console.error(error);
    }
  }

  export const getDepartments = async () => {
    try {
      if (!DATABASE_ID || !DEPARTMENT_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();

      const departments = await database.listDocuments(
        DATABASE_ID,
        DEPARTMENT_COLLECTION_ID
      );

      return parseStringify(departments.documents);

    }catch (error: any){
      console.error(error);
    }
  };

  export const getDepartment = async (id: string) => {
    try {
      if (!DATABASE_ID || !DEPARTMENT_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      if (!id) {
        throw new Error('Document ID is missing');
      }

      const { database } = await createAdminClient();
  
      const department = await database.listDocuments(
        DATABASE_ID!,
        DEPARTMENT_COLLECTION_ID!,
        [Query.equal('$id', id)]
      )
  
      return parseStringify(department.documents[0]);
    } catch (error) {
      console.log(error)
    }
  }

  export const deleteDepartment = async ({ $id }: Department) => {
    try {
      if (!DATABASE_ID || !DEPARTMENT_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();
  
      const department = await database.deleteDocument(
        DATABASE_ID!,
        DEPARTMENT_COLLECTION_ID!,
        $id);
  
      return parseStringify(department);
    } catch (error) {
      console.log(error)
    }
  }

  export const updateDepartment = async (id: string, data: DepartmentDto) => {  
    try {
      if (!DATABASE_ID || !DEPARTMENT_COLLECTION_ID) {
        throw new Error('Database ID or Collection ID is missing');
      }

      const { database } = await createAdminClient();
  
      const department = await database.updateDocument(
        DATABASE_ID!,
        DEPARTMENT_COLLECTION_ID!,
        id,
        data);
  
      return parseStringify(department);
    } catch (error) {
      console.log(error)
    }
  }