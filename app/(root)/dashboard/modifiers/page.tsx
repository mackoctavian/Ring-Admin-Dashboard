import BreadCrumb from "@/components/layout/breadcrumb";
import { columns } from "@/components/layout/tables/modifiers-table/columns";
import { ModifiersTable } from "@/components/layout/tables/modifiers-table/modifiers-table";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Modifier } from "@/types";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";

import { getItems } from "@/lib/actions/modifier.actions";
import NoItems from "@/components/layout/no-items";

const breadcrumbItems = [{ title: "Modifiers", link: "/modifiers" }];

type ParamsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function Page({ searchParams }: ParamsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const q = searchParams.search?.toString() || null;  
  const offset = (page - 1) * pageLimit;


  const data : Modifier[] = await getItems(q?.toString(), null, pageLimit, offset);
  const total = data? data.length : 0;
  const pageCount = Math.ceil(total / pageLimit);


  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
            <Heading title={`Modifiers`} total={total.toString()} description="Manage modifiers" />

            <Link href={"/dashboard/modifiers/new"} className={cn(buttonVariants({ variant: "default" }))} >
                <Plus className="mr-2 h-4 w-4" /> Add Modifier
            </Link>
        </div>
        <Separator />

          {total > 0 || q != null ? (
              <ModifiersTable
                  searchKey="name"
                  pageNo={page}
                  columns={columns}
                  total={total}
                  data={data}
                  pageCount={pageCount}
              />
          ) : (
              <NoItems newItemUrl={`/dashboard/modifiers/new`} itemName={`modifier`} />
          )}
      </div>
    </>
  );
}
