import BreadCrumb from "@/components/layout/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Campaign } from "@/types";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";

import { columns } from "@/components/layout/tables/campaigns-table/columns";
import { getItems } from "@/lib/actions/campaign.actions";
import { CampaignsTable } from "@/components/layout/tables/campaigns-table/campaigns-table";
import NoItems from "@/components/layout/no-items";

const breadcrumbItems = [{ title: "Campaigns", link: "/campaigns" }];

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

  const data : Campaign[] = await getItems(q?.toString(), null, pageLimit, offset);
  const total = data? data.length : 0;
  const pageCount = Math.ceil(total / pageLimit);


  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
            <Heading title={`Campaigns`} total={total.toString()} description="Manage campaigns" />

            <Link href={"/dashboard/campaigns/new"} className={cn(buttonVariants({ variant: "default" }))} >
                <Plus className="mr-2 h-4 w-4" /> Create new campaign
            </Link>
        </div>
        <Separator />

          {total > 0 || q != null ? (
              <CampaignsTable
                  searchKey="title"
                  pageNo={page}
                  columns={columns}
                  total={total}
                  data={data}
                  pageCount={pageCount}
              />
          ) : (
              <NoItems newItemUrl={`/dashboard/campaigns/new`} itemName={`campaign`} />
          )}
      </div>
    </>
  );
}
