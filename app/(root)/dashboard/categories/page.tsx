import BreadCrumb from "@/components/layout/breadcrumb";
import {buttonVariants} from "@/components/ui/button";
import { Category } from "@/types";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react"
import Link from "next/link";
import { columns } from "@/components/layout/tables/categories-table/columns";
import { getItems } from "@/lib/actions/category.actions";
import NoItems from "@/components/layout/no-items";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { DataTable } from "@/components/layout/tables/data-table";

const breadcrumbItems = [{ title: "Categories", link: "dashboard/categories" }];

type ParamsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function Page({ searchParams }: ParamsProps) {
  const page = Number(searchParams.page) || 1;
  const pageLimit = Number(searchParams.limit) || 5;
  const q = searchParams.search || null;  
  const offset = (page - 1) * pageLimit;

  const data : Category[] = await getItems(q?.toString(), '', null, null, null, offset);
  const total = data? data.length : 0;
  const pageCount = Math.ceil(total / pageLimit);

  return (
    <>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">

            <div className="flex items-center justify-between mb-2">
                <div className="relative flex-1 md:max-w-md">
                    <BreadCrumb items={breadcrumbItems}/>
                </div>

                <div className="flex items-center space-x-2">
                    <Link href={`/dashboard/categories/new`}
                          className={cn(buttonVariants({variant: "default"}), "gap-1 size-md flex items-center dark:text-white")}>
                        <Plus className="h-3.5 w-3.5"/>
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap"> Add Category </span>
                    </Link>
                </div>
            </div>

            {total > 0 || q != null ? (
                <Card x-chunk="data-table">
                    <CardHeader>
                        <CardTitle>Categories</CardTitle>
                        <CardDescription>
                            Manage your product and service categories.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            searchKey="name"
                            pageNo={page}
                            columns={columns}
                            total={total}
                            data={data}
                            pageCount={pageCount}
                        />
                    </CardContent>
                </Card>
            ) : (<NoItems newItemUrl={`/dashboard/categories/new`} itemName={`category`}/>)}
        </div>
    </>
  );
}
