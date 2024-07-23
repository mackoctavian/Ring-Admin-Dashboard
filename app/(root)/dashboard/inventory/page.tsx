import BreadCrumb from "@/components/layout/breadcrumb";
import { buttonVariants } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { InventoryVariant } from "@/types";
import { cn } from "@/lib/utils";
import { Plus, Pencil } from "lucide-react";
import Link from "next/link";
import { columns } from "@/components/layout/tables/inventory-table/columns";
import { getVariantItems } from "@/lib/actions/inventory.actions";
import { InventoryTable } from "@/components/layout/tables/inventory-table/inventory-table";
import NoItems from "@/components/layout/no-items";

const breadcrumbItems = [{ title: "Stock", link: "/inventory" }];

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

  const data : InventoryVariant[] = await getVariantItems(q?.toString(), null, null, offset);
  const total = data? data.length : 0;
  const pageCount = Math.ceil(total / pageLimit);

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading title="Stock" total={total.toString()} description="Manage stock" />

          <div className="ml-auto flex space-x-4">
            <Link href="/dashboard/inventory/new" className={cn(buttonVariants({ variant: "default" }))} >
                <Plus className="mr-2 h-4 w-4" /> Add stock item
            </Link>

            <Link href="/dashboard/inventory/modify" className={cn(buttonVariants({ variant: "outline" }))} >
                <Pencil className="mr-2 h-4 w-4" /> Modify stock values
            </Link>
          </div>
        </div>
        <Separator />

        {total > 0 || q != null ? (
            <InventoryTable
                searchKey="fullName"
                pageNo={page}
                columns={columns}
                total={total}
                data={data}
                pageCount={pageCount}
            />
        ) : (
            <NoItems newItemUrl={`/dashboard/inventory/new`} itemName={`stock item`} />
        )}
      </div>
    </>
  );
}
