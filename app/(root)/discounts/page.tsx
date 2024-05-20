import BreadCrumb from "@/components/layout/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Discount } from "@/types";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";

import { columns } from "@/components/layout/tables/discounts-table/columns";
import { getItems } from "@/lib/actions/discount.actions";
import { DiscountsTable } from "@/components/layout/tables/discounts-table/discounts-table";

const breadcrumbItems = [{ title: "Discounts", link: "/discounts" }];

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

  const data : Discount[] = await getItems(q?.toString(), null, null, offset);
  const total = data? data.length : 0;
  const pageCount = Math.ceil(total / pageLimit);

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
            <Heading title={`Discounts`} total={total.toString()} description="Manage discounts" />

            <Link href={"/discounts/new"} className={cn(buttonVariants({ variant: "default" }))} >
                <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
        </div>
        <Separator />

        <DiscountsTable
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
