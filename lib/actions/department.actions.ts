'use server';

import {databaseCheck, handleError} from "@/lib/utils/actions-service";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import { Department, Branch } from "@/types";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

const {
    DEPARTMENTS_COLLECTION: DEPARTMENT_COLLECTION_ID
} = process.env;

export const createDefaultDepartment = async (branch: Branch) => {
  const { database, databaseId, collectionId } = await databaseCheck(DEPARTMENT_COLLECTION_ID);
  try {
    const newItem = await database.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      {
        branch: branch,
        name: 'Main department',
        shortName: 'Main',
        businessId: branch.businessId, 
        branchId: branch.$id,
        status: true,
        canDelete: false,
      }
    )

    return parseStringify(newItem);
  } catch (error: any) {
    handleError(error, "Error creating main branch")
  }
}


export const createItem = async (item: Department) => {
  const { database, businessId, databaseId, collectionId } = await databaseCheck(DEPARTMENT_COLLECTION_ID);
  try {
    await database.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      {
        ...item,
        branchId: item.branch,
        businessId: businessId,
      }
    )
  } catch (error: any) {
    handleError(error, "Error creating department")
  }

  revalidatePath('/dashboard/departments')
  redirect('/dashboard/departments')
}

export const list = async ( ) => {
  const { database, businessId, databaseId, collectionId } = await databaseCheck(DEPARTMENT_COLLECTION_ID);
  try {
    const items = await database.listDocuments(
      databaseId,
      collectionId,
        [
        Query.equal('businessId', businessId),
        Query.orderAsc('name')
      ]
    );

    if (items.documents.length == 0) return null

    return parseStringify(items.documents);

  }catch (error: any){
    handleError(error, "Error listing departments:")
  }
}

export const getItems = async (
  q?: string,
  status?: boolean | null,
  limit?: number | null, 
  offset?: number | 1,
) => {

  const { database, businessId, databaseId, collectionId } = await databaseCheck(DEPARTMENT_COLLECTION_ID);

  try {
    const queries = [];
    queries.push(Query.equal('businessId', businessId));
    queries.push(Query.orderDesc("$createdAt"));

    if ( limit ) {
      queries.push(Query.limit(limit));
      queries.push(Query.offset(offset!));
    }

    if (q) {
      queries.push(Query.search('name', q));
    }

    if (status) {
      queries.push(Query.equal('status', status));
    }

    const items = await database.listDocuments(
      databaseId,
      collectionId,
      queries
    );

    if (items.documents.length == 0) return null

    return parseStringify(items.documents);
  } catch (error: any) {
    handleError(error, "Error getting departments:")
  }
}

export const getItem = async (id: string) => {
  if (!id) return null;
  const { database, databaseId, collectionId } = await databaseCheck(DEPARTMENT_COLLECTION_ID);

  try {
    const item = await database.listDocuments(
      databaseId,
      collectionId,
      [Query.equal('$id', id)]
    )

    if ( item.total == 0 ) return null;

    return parseStringify(item.documents[0]);
  } catch (error: any) {
    handleError(error, "Error getting department:")
  }
}

export const deleteItem = async ({ $id }: Department) => {
  if (!$id) return null;
  const { database, databaseId, collectionId } = await databaseCheck(DEPARTMENT_COLLECTION_ID);

  try {
    await database.deleteDocument(
      databaseId,
      collectionId,
      $id);
  } catch (error: any) {
    handleError(error, "Error getting department:")
  }

  revalidatePath('/dashboard/departments')
  redirect('/dashboard/departments')
}

export const updateItem = async (id: string, data: Department) => {
  if (!id || !data) return null;
  const { database, databaseId, collectionId } = await databaseCheck(DEPARTMENT_COLLECTION_ID);

  try {
    await database.updateDocument(
      databaseId,
      collectionId,
      id,
      data);
  } catch (error: any) {
    handleError(error, "Error updating department:")
  }

  revalidatePath('/dashboard/departments')
  redirect('/dashboard/departments')
}