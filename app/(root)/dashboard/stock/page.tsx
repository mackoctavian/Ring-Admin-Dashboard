import BreadCrumb from "@/components/layout/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Stock } from "@/types";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";

import { columns } from "@/components/layout/tables/stock-table/columns";
import { getItems } from "@/lib/actions/stock.actions";
import { StockTable } from "@/components/layout/tables/stock-table/stock-table";
import {StaffTable} from "@/components/layout/tables/staff-table/staff-table";
import NoItems from "@/components/layout/no-items";

const breadcrumbItems = [{ title: "Stock", link: "/stock" }];

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

  const data : Stock[] = await getItems(q?.toString(), '', null, null, null, offset);
  const total = data? data.length : 0;
  const pageCount = Math.ceil(total / pageLimit);

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
            <Heading title={`Stock intake`} description="Manage stock intake" />

            <Link href={"/dashboard/stock/new"} className={cn(buttonVariants({ variant: "default" }))} >
                <Plus className="mr-2 h-4 w-4" /> Record stock intake
            </Link>
        </div>
        <Separator />

      {total > 0 || q != null ? (
          <StockTable
              searchKey="item"
              pageNo={page}
              columns={columns}
              total={total}
              data={data}
              pageCount={pageCount}
          />
      ) : (
          <NoItems newItemUrl={`/dashboard/stock/new`} itemName={`stock`} />
      )}

      </div>
    </>
  );
}
