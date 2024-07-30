import { buttonVariants } from "@/components/ui/button"
import {Expense, ExpensePayment} from "@/types"
import { cn } from "@/lib/utils"
import { Plus, ReceiptText } from "lucide-react"
import Link from "next/link"

import { columns as expensesColumn } from "@/components/layout/tables/expenses-table/columns"
import { columns as paymentsColumn } from "@/components/layout/tables/payments-table/columns"
import { getItems as getExpenseItems } from "@/lib/actions/expense.actions"
import { getItems as getPaymentItems } from "@/lib/actions/payments.actions"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import NoItems from "@/components/layout/no-items";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {DataTable} from "@/components/layout/tables/data-table";

const breadcrumbItems = [{ title: "Expenses", link: "dashboard/expenses" }]

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
              <div className="flex items-center justify-between mb-2">
                <div className="relative flex-1 md:max-w-md">
                  {/*<BreadCrumb items={breadcrumbItems}/>*/}

                  <div className="flex items-center">
                    <TabsList>
                      <TabsTrigger value="expenses">Expenses</TabsTrigger>
                      <TabsTrigger value="payments">Payments</TabsTrigger>
                    </TabsList>
                  </div>
                </div>



                <div className="flex items-center space-x-2">
                  <Link href={`/dashboard/expenses/new`}
                        className={cn(buttonVariants({variant: "default"}), "gap-1 size-md flex items-center dark:text-white")}>
                    <Plus className="h-3.5 w-3.5"/>
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap"> Record expense </span>
                  </Link>
                </div>
              </div>

              {totalExpenses > 0 || q != null ? (
                  <Card x-chunk="data-table">
                    <CardHeader>
                      <CardTitle>Expenses</CardTitle>
                      <CardDescription>
                      Manage your business expenses.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DataTable
                          searchKey="name"
                          pageNo={page}
                          columns={expensesColumn}
                          total={totalExpenses}
                          data={expenseData}
                          pageCount={expensesPageCount}
                      />
                    </CardContent>
                  </Card>
              ) : (<NoItems newItemUrl={`/dashboard/expenses/new`} itemName={`expense`}/>)}
            </div>

          </TabsContent>
          <TabsContent value="payments">

            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="relative flex-1 md:max-w-md">
                  {/*<BreadCrumb items={breadcrumbItems}/>*/}

                  <div className="flex items-center">
                    <TabsList>
                      <TabsTrigger value="expenses">Expenses</TabsTrigger>
                      <TabsTrigger value="payments">Payments</TabsTrigger>
                    </TabsList>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Link href={`/dashboard/expenses/repayment`}
                        className={cn(buttonVariants({variant: "default"}), "gap-1 size-md flex items-center dark:text-white")}>
                    <ReceiptText className="h-3.5 w-3.5"/>
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap"> Record payment </span>
                  </Link>
                </div>
              </div>

              {totalPayments > 0 || q != null ? (
                  <Card x-chunk="data-table">
                    <CardHeader>
                      <CardTitle>Payments</CardTitle>
                      <CardDescription>
                        Manage payments.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DataTable
                          searchKey="name"
                          pageNo={page}
                          columns={paymentsColumn}
                          total={totalPayments}
                          data={paymentData}
                          pageCount={paymentPageCount}
                      />
                    </CardContent>
                  </Card>
              ) : (<NoItems newItemUrl={`/dashboard/expenses/repayment`} itemName={`payment`}/>)}
            </div>

          </TabsContent>
        </Tabs>
      </>
  );
}
