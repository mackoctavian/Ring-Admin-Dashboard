'use server';

import {databaseCheck, handleError} from "@/lib/utils/actions-service"
import { ID, Query } from "node-appwrite"
import { parseStringify } from "../utils"
import {Expense, ExpenseDto, ExpensePayment} from "@/types"
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ExpenseStatus } from '@/types/data-schemas'

const {
    EXPENSES_COLLECTION: EXPENSES_COLLECTION_ID,
    EXPENSE_PAYMENTS_COLLECTION: EXPENSE_PAYMENTS_COLLECTION_ID,
  } = process.env;

const updateExpenseStatus = (balance: number, amount: number) => {
  if (balance === 0) {
    return ExpenseStatus.PAID;
  } else if (balance < amount) {
    return ExpenseStatus.PARTIAL;
  } else {
    return ExpenseStatus.UNPAID;
  }
}

export const createItem = async (item: ExpenseDto) => {
  const { database, businessId, databaseId, collectionId } = await databaseCheck(EXPENSES_COLLECTION_ID, {needsBusinessId: true})

  try {
      await database.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        {
          ...item,
          businessId,
          balance: item.amount
        }
      )
  } catch (error: any) {
    handleError(error, "Error recording expense")
  }

  revalidatePath('/dashboard/expenses')
  redirect('/dashboard/expenses')
}

export const list = async ( status?: string ) => {
  const { database, businessId, databaseId, collectionId } = await databaseCheck(EXPENSES_COLLECTION_ID, {needsBusinessId: true})
  const queries = [];
  queries.push(Query.equal("businessId", businessId!));
  queries.push(Query.orderDesc("$createdAt"));

  if( status === "INCOMPLETE"){
    queries.push(Query.notEqual("status", [ExpenseStatus.PAID]));
  }else if( status === "COMPLETE"){
    queries.push(Query.equal("status", [ExpenseStatus.PAID]));
  }

  try {
    const items = await database.listDocuments(
      databaseId,
      collectionId,
      queries
    )

    if( items.documents.length == 0 ) return null

    return parseStringify(items.documents);

    } catch (error: any) {
      handleError(error, "Error listing expenses");
    }
}

export const getItems = async (
    q?: string,
    status?: boolean | null,
    limit?: number | null, 
    offset?: number | 1,
  ) => {
  const { database, businessId, databaseId, collectionId } = await databaseCheck(EXPENSES_COLLECTION_ID, {needsBusinessId: true})

    try {
      const queries = [];
      queries.push(Query.equal("businessId", businessId!));
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
      )

      if ( items.documents.length == 0 ) return null
  
      return parseStringify(items.documents);
    } catch (error: any) {
      handleError(error, "Error listing expenses");
    }
}

export const getItem = async (id: string) => {
  if (!id) return null;
  const { database, businessId, databaseId, collectionId } = await databaseCheck(EXPENSES_COLLECTION_ID, {needsBusinessId: true})
  try {
    const item = await database.listDocuments(
      databaseId,
      collectionId,
      [
        Query.equal('$id', id),
        Query.equal('businessId', businessId!),
      ]
    )

    if ( item.total == 0 ) return null;

    return parseStringify(item.documents[0]);
  } catch (error: any) {
    handleError(error, "Error getting expense data")
  }
}

export const deleteItem = async ({ $id }: Expense) => {
  if (!$id) return null;
  const { database, databaseId, collectionId } = await databaseCheck(EXPENSES_COLLECTION_ID)

  try {
    const item = await database.deleteDocument(
      databaseId,
      collectionId,
      $id);
  } catch (error: any) {
    handleError(error, "Error deleting expense")
  }

  revalidatePath('/dashboard/expenses')
  redirect('/dashboard/expenses')
}

export const updateItem = async (id: string, data: ExpenseDto) => {
  if (!id || !data) return null;
  const { database, databaseId, collectionId } = await databaseCheck(EXPENSES_COLLECTION_ID)

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
        databaseId,
        collectionId,
        id,
        data);
    } catch (error: any) {
      handleError(error, "Error updating expense")
    }

    revalidatePath('/dashboard/expenses')
    redirect('/dashboard/expenses')
}

export const recordPayment = async (data: ExpensePayment) => {
  const { database, businessId, databaseId, collectionId } = await databaseCheck(EXPENSE_PAYMENTS_COLLECTION_ID, {needsBusinessId: true})

  const expenseData = await getItem(data.expense)
  if ( !expenseData ) return null;

  const {$databaseId, $collectionId, ...expense} = expenseData;

  // Update the expense balance
  expense.balance = expense.balance - data.amount;

  // Update the expense status
  expense.status = updateExpenseStatus(expense.balance, expense.amount);

  try {
      await database.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        {
          ...data,
          businessId,
        }
      )

    await database.updateDocument(
        databaseId,
        EXPENSES_COLLECTION_ID!,
        expense.$id,
        expense);

  } catch (error: any) {
    handleError(error, "Error recording payment")
  }

  revalidatePath('/dashboard/expenses')
  redirect('/dashboard/expenses')
}


