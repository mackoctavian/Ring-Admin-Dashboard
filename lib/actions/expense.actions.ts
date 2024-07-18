'use server';

const env = process.env.NODE_ENV
import * as Sentry from "@sentry/nextjs"
import { ID, Query, AppwriteException } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { Expense, ExpensePayment } from "@/types";
import { getStatusMessage, HttpStatusCode } from '../status-handler'; 
import { auth } from "@clerk/nextjs/server";
import { getBusinessId } from "./business.actions";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'
import { ExpenseStatus } from '@/types/data-schemas'

const {
    APPWRITE_DATABASE: DATABASE_ID,
    EXPENSES_COLLECTION: EXPENSES_COLLECTION_ID,
    EXPENSE_PAYMENTS_COLLECTION: EXPENSE_PAYMENTS_COLLECTION_ID,
  } = process.env;

const checkRequirements = async (collectionId: string | undefined) => {
  if (!DATABASE_ID || !collectionId) throw new Error('Database ID or Collection ID is missing');

  const { database } = await createAdminClient();
  if (!database) throw new Error('Database client could not be initiated');

  const { userId } = auth();
  if (!userId) {
    throw new Error('You must be signed in to use this feature');
  }

  const businessId = await getBusinessId();
  if( !businessId ) throw new Error('Business ID could not be initiated');

  return { database, userId, businessId };
};

const updateExpenseStatus = (balance: number, amount: number) => {
  if (balance === 0) {
    return ExpenseStatus.PAID;
  } else if (balance < amount) {
    return ExpenseStatus.PARTIAL;
  } else {
    return ExpenseStatus.UNPAID;
  }
}

export const createItem = async (item: Expense) => {
  const { database, businessId } = await checkRequirements(EXPENSES_COLLECTION_ID);

    try {
      await database.createDocument(
        DATABASE_ID!,
        EXPENSES_COLLECTION_ID!,
        ID.unique(),
        {
          ...item,
          businessId,
          balance: item.amount
        }
      )
    } catch (error: any) {
      let errorMessage = 'Something went wrong with your request, please try again later.';
      if (error instanceof AppwriteException) {
        errorMessage = getStatusMessage(error.code as HttpStatusCode);
      }

      if(env == "development"){ console.error(error); }

      Sentry.captureException(error);
      throw Error(errorMessage);
    }

    revalidatePath('/expenses')
    redirect('/expenses')
};


export const list = async ( status?: string ) => {
    const { database, businessId } = await checkRequirements(EXPENSES_COLLECTION_ID);

    console.log("Status received", status)


    const queries = [];
    queries.push(Query.equal("businessId", businessId));
    queries.push(Query.orderDesc("$createdAt"));

    if( status === "INCOMPLETE"){
      queries.push(Query.notEqual("status", [ExpenseStatus.PAID]));
    }else if( status === "COMPLETE"){
      queries.push(Query.equal("status", [ExpenseStatus.PAID]));
    }

    try {
      const items = await database.listDocuments(
        DATABASE_ID!,
        EXPENSES_COLLECTION_ID!,
        queries
      );

      return parseStringify(items.documents);

    } catch (error: any) {
      let errorMessage = 'Something went wrong with your request, please try again later.';
      if (error instanceof AppwriteException) {
        errorMessage = getStatusMessage(error.code as HttpStatusCode);
      }

      if(env == "development"){ console.error(error); }

      Sentry.captureException(error);
      throw Error(errorMessage);
    }
};


export const getItems = async (
    q?: string,
    status?: boolean | null,
    limit?: number | null, 
    offset?: number | 1,
  ) => {
    const { database, businessId } = await checkRequirements(EXPENSES_COLLECTION_ID);

    try {
      const queries = [];
      queries.push(Query.equal("businessId", businessId));
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
        DATABASE_ID!,
        EXPENSES_COLLECTION_ID!,
        queries
      );
  
      if (items.documents.length === 0) {
        return [];
      }
  
      return parseStringify(items.documents);
    } catch (error: any) {
      let errorMessage = 'Something went wrong with your request, please try again later.';
      if (error instanceof AppwriteException) {
        errorMessage = getStatusMessage(error.code as HttpStatusCode);
      }

      if(env == "development"){ console.error(error); }

      Sentry.captureException(error);
      throw Error(errorMessage);
    }
};


export const getItem = async (id: string) => {
  if (!id) return null;
  const { database, businessId } = await checkRequirements(EXPENSES_COLLECTION_ID);

    try {
      const item = await database.listDocuments(
        DATABASE_ID!,
        EXPENSES_COLLECTION_ID!,
        [
          Query.equal('$id', id),
          Query.equal('businessId', businessId),
        ]
      )

      if ( item.total < 1 ) return null;
  
      return parseStringify(item.documents[0]);
    } catch (error: any) {
      let errorMessage = 'Something went wrong with your request, please try again later.';
      if (error instanceof AppwriteException) {
        errorMessage = getStatusMessage(error.code as HttpStatusCode);
      }

      if(env == "development"){ console.error(error); }

      Sentry.captureException(error);
      throw Error(errorMessage);
    }
  };


export const deleteItem = async ({ $id }: Expense) => {
  if (!$id) return null;
  const { database, businessId } = await checkRequirements(EXPENSES_COLLECTION_ID);

    try {
      const item = await database.deleteDocument(
        DATABASE_ID!,
        EXPENSES_COLLECTION_ID!,
        $id);
    } catch (error: any) {
      let errorMessage = 'Something went wrong with your request, please try again later.';
      if (error instanceof AppwriteException) {
        errorMessage = getStatusMessage(error.code as HttpStatusCode);
      }

      if(env == "development"){ console.error(error); }

      Sentry.captureException(error);
      throw Error(errorMessage);
    }

    revalidatePath('/expenses')
    redirect('/expenses')
};


export const updateItem = async (id: string, data: Expense) => {
  if (!id || !data) return null;
  const { database, businessId } = await checkRequirements(EXPENSES_COLLECTION_ID);

  const itemBeforeUpdate = await getItem(id)
  if ( !itemBeforeUpdate ) throw new Error("Could not update expense");

  // Get paid amount before update
  const paidAmount = parseInt(itemBeforeUpdate.amount, 10) - parseInt(itemBeforeUpdate.balance, 10)

  // Update the expense balance
  data.balance = data.amount - paidAmount;
  if( data.balance < 0 ) data.balance = 0

  // Update the expense status
  data.status = updateExpenseStatus(data.balance, data.amount);

    try {
      await database.updateDocument(
        DATABASE_ID!,
        EXPENSES_COLLECTION_ID!,
        id,
        data);
    } catch (error: any) {
      let errorMessage = 'Something went wrong with your request, please try again later.';
      if (error instanceof AppwriteException) {
        errorMessage = getStatusMessage(error.code as HttpStatusCode);
      }

      if(env == "development"){ console.error(error); }

      Sentry.captureException(error);
      throw Error(errorMessage);
    }

    revalidatePath('/expenses')
    redirect('/expenses')
};


export const recordPayment = async (data: ExpensePayment) => {
  const { database, businessId } = await checkRequirements(EXPENSE_PAYMENTS_COLLECTION_ID);

  // Update the expense balance
  data.expense.balance = data.expense.balance - data.amount;

  // Update the expense status
  data.expense.status = updateExpenseStatus(data.expense.balance, data.expense.amount);

  try {
      await database.createDocument(
        DATABASE_ID!,
        EXPENSE_PAYMENTS_COLLECTION_ID!,
        ID.unique(),
        {
          ...data,
          businessId,
        }
      )
    } catch (error: any) {
      let errorMessage = 'Something went wrong with your request, please try again later.';
      if (error instanceof AppwriteException) {
        errorMessage = getStatusMessage(error.code as HttpStatusCode);
      }

      if(env == "development"){ console.error(error); }

      Sentry.captureException(error);
      throw Error(errorMessage);
    }

  revalidatePath('/expenses')
  redirect('/expenses')
};


