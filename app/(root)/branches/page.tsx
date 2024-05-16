import BreadCrumb from "@/components/layout/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Branch } from "@/types";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";

import { columns } from "@/components/layout/tables/branches-table/columns";
import { getBranches } from "@/lib/actions/branch.actions";
import { BranchesTable } from "@/components/layout/tables/branches-table/branches-table";

const breadcrumbItems = [{ title: "Branches", link: "/branches" }];

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

  const data : Branch[] = await getBranches();
  const total = data? data.length : 0;
  const pageCount = Math.ceil(total / pageLimit);


  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
            <Heading title={`Branches (${total})`} description="Manage branches" />

            <Link href={"/branches/new"} className={cn(buttonVariants({ variant: "default" }))} >
                <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
        </div>
        <Separator />

        <BranchesTable
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
