import BreadCrumb from "@/components/layout/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Section } from "@/types";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";

import { columns } from "@/components/layout/tables/sections-table/columns";
import { getItems } from "@/lib/actions/section.actions";
import { SectionsTable } from "@/components/layout/tables/sections-table/sections-table";

const breadcrumbItems = [{ title: "Spaces & Sections", link: "/sections" }];

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

  const data : Section[] = await getItems(q?.toString(), null, pageLimit, offset);
  const total = data? data.length : 0;
  const pageCount = Math.ceil(total / pageLimit);


  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
            <Heading title={`Spaces & sections`} total={total.toString()} description="Manage rooms, spaces and sections" />

            <Link href={"/sections/new"} className={cn(buttonVariants({ variant: "default" }))} >
                <Plus className="mr-2 h-4 w-4" /> Add Space / Section
            </Link>
        </div>
        <Separator />

        <SectionsTable
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
