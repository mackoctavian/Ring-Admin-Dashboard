import BreadCrumb from "@/components/layout/breadcrumb"
import { buttonVariants } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import {Expense, ExpensePayment} from "@/types"
import { cn } from "@/lib/utils"
import { Plus, ReceiptText } from "lucide-react"
import Link from "next/link"

import { columns as expensesColumn } from "@/components/layout/tables/expenses-table/columns"
import { columns as paymentsColumn } from "@/components/layout/tables/payments-table/columns"
import { getItems as getExpenseItems } from "@/lib/actions/expense.actions"
import { getItems as getPaymentItems } from "@/lib/actions/payments.actions"
import { ExpensesTable } from "@/components/layout/tables/expenses-table/expenses-table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {PaymentsTable} from "@/components/layout/tables/payments-table/payments-table"
import NoItems from "@/components/layout/no-items";

const breadcrumbItems = [{ title: "Expenses", link: "/expenses" }];

type ParamsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function Page({ searchParams }: ParamsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const q = searchParams.search || null;  
  const offset = (page - 1) * pageLimit;

  const expenseData : Expense[] = await getExpenseItems(q?.toString(), null, null, offset);
  const totalExpenses = expenseData? expenseData.length : 0;
  const expensesPageCount = Math.ceil(totalExpenses / pageLimit);


  const paymentData : ExpensePayment[] = await getPaymentItems(q?.toString(), null, null, offset);
  const totalPayments = paymentData? paymentData.length : 0;
  const paymentPageCount = Math.ceil(totalPayments / pageLimit);

  return (
      <>
        <Tabs defaultValue="expenses">
          <TabsContent value="expenses">
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
              <BreadCrumb items={breadcrumbItems}/>

              <div className="flex items-start justify-between">
                <Heading title={`Expenses`} total={totalExpenses.toString()} description="Manage expenses"/>

                <div className="ml-auto flex space-x-4">
                  <Link href="/dashboard/expenses/new" className={cn(buttonVariants({variant: "outline"}))}>
                    <Plus className="mr-2 h-4 w-4"/> Record expense
                  </Link>
                </div>
              </div>

              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="expenses">Expenses</TabsTrigger>
                  <TabsTrigger value="payments">Payments</TabsTrigger>
                </TabsList>
              </div>

              <Separator/>
              {totalExpenses > 0 || q != null ? (
                  <ExpensesTable
                      searchKey="name"
                      pageNo={page}
                      columns={expensesColumn}
                      total={totalExpenses}
                      data={expenseData}
                      pageCount={expensesPageCount}
                  />
              ) : (
                  <NoItems newItemUrl={`/dashboard/expenses/new`} itemName={`expense`} />
              )}

            </div>
          </TabsContent>
          <TabsContent value="payments">
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
              <BreadCrumb items={breadcrumbItems}/>

              <div className="flex items-start justify-between">
                <Heading title={`Payments`} total={totalPayments.toString()} description="Manage payments"/>

                <div className="ml-auto flex space-x-4">
                  <Link href="/dashboard/expenses/repayment" className={cn(buttonVariants({variant: "outline"}))}>
                    <ReceiptText className="mr-2 h-4 w-4"/> Record payment
                  </Link>
                </div>
              </div>

              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="expenses">Expenses</TabsTrigger>
                  <TabsTrigger value="payments">Payments</TabsTrigger>
                </TabsList>
              </div>

              <Separator/>

              {totalPayments > 0 || q != null ? (
                <PaymentsTable
                    searchKey="name"
                    pageNo={page}
                    columns={paymentsColumn}
                    total={totalPayments}
                    data={paymentData}
                    pageCount={paymentPageCount}
                />
              ) : (
                  <NoItems newItemUrl={`/dashboard/expenses/repayment`} itemName={`payment`} />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </>
  );
}
