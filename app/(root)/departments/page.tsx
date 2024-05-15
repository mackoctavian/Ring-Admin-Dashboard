import BreadCrumb from "@/components/layout/breadcrumb";
import { columns } from "@/components/layout/tables/units-table/columns";
import { UnitsTable } from "@/components/layout/tables/units-table/units-table";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Department } from "@/types";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";

import { getDepartments } from "@/lib/actions/department.actions";

const breadcrumbItems = [{ title: "Departments", link: "/departments" }];

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

  const data : Department[] = await getDepartments();
  const total = data? data.length : 0;
  const pageCount = Math.ceil(total / pageLimit);


  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
            <Heading title={`Departments (${total})`} description="Manage departments" />

            <Link href={"/departments/new"} className={cn(buttonVariants({ variant: "default" }))} >
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
