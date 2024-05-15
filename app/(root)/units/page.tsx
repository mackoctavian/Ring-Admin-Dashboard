import BreadCrumb from "@/components/layout/breadcrumb";
import { columns } from "@/components/layout/tables/units-table/columns";
import { UnitsTable } from "@/components/layout/tables/units-table/units-table";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ProductUnit } from "@/types";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";

import { getProductUnits } from "@/lib/actions/business.actions";

const breadcrumbItems = [{ title: "Units", link: "/dashboard/units" }];

type ParamsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function Page({ searchParams }: ParamsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 10;
  const country = searchParams.search || null;
  const offset = (page - 1) * pageLimit;

  const data : ProductUnit[] = await getProductUnits();
  const total = data.length;
  const pageCount = Math.ceil(total / pageLimit);


  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
            <Heading title={`Product Units (${total})`} description="Manage product units" />

            <Link href={"/units/new"} className={cn(buttonVariants({ variant: "default" }))} >
                <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
        </div>
        <Separator />

        <UnitsTable
          searchKey="name"
          pageNo={page}
          columns={columns}
          totalUsers={total}
          data={data}
          pageCount={pageCount}
        />
      </div>
    </>
  );
}
