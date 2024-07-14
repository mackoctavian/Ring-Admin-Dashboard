import BreadCrumb from "@/components/layout/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Expense } from "@/types";
import { cn } from "@/lib/utils";
import { Plus, ReceiptText } from "lucide-react";
import Link from "next/link";

import { columns } from "@/components/layout/tables/expenses-table/columns";
import { getItems } from "@/lib/actions/expense.actions";
import { ExpensesTable } from "@/components/layout/tables/expenses-table/expenses-table";

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

  const data : Expense[] = await getItems(q?.toString(), null, null, offset);
  const total = data? data.length : 0;
  const pageCount = Math.ceil(total / pageLimit);

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title={`Expenses`} total={total.toString()} description="Manage expenses" />

          <div className="ml-auto flex space-x-4">
            <Link href="/expenses/new" className={cn(buttonVariants({ variant: "default" }))} >
                <Plus className="mr-2 h-4 w-4" /> Record expense
            </Link>

            <Link href="/expenses/repayment" className={cn(buttonVariants({ variant: "outline" }))} >
                <ReceiptText className="mr-2 h-4 w-4" /> Record payment
            </Link>
          </div>
        </div>
        <Separator />

        <ExpensesTable
          searchKey="name"
          pageNo={page}
          columns={columns}
          total={total}
          data={data}
          pageCount={pageCount}
        />
      </div>
    </>
  );
}
