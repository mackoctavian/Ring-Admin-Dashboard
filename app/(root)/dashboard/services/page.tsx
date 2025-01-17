import BreadCrumb from "@/components/layout/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Service } from "@/types";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";

import { columns } from "@/components/layout/tables/services-table/columns";
import { getItems } from "@/lib/actions/service.actions";
import { ServicesTable } from "@/components/layout/tables/services-table/services-table";
import NoItems from "@/components/layout/no-items";

const breadcrumbItems = [{ title: "Services", link: "/services" }];

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

  const data : Service[] = await getItems();
  const total = data? data.length : 0;
  const pageCount = Math.ceil(total / pageLimit);


  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
            <Heading title={`Services`} total={total.toString()} description="Manage services" />

            <Link href={"/dashboard/services/new"} className={cn(buttonVariants({ variant: "default" }))} >
                <Plus className="mr-2 h-4 w-4" /> Add Service
            </Link>
        </div>
        <Separator />

      {total > 0 || q != null ? (
          <ServicesTable
              searchKey="name"
              pageNo={page}
              columns={columns}
              total={total}
              data={data}
              pageCount={pageCount}
          />
      ) : (
          <NoItems newItemUrl={`/dashboard/services/new`} itemName={`service`} />
      )}


      </div>
    </>
  );
}
