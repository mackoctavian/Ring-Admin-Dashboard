import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import BreadCrumb from "@/components/layout/breadcrumb";
import { getItem } from '@/lib/actions/stock.actions';
import { Stock } from "@/types";
import StockForm from "@/components/forms/StockForm";
import { notFound } from 'next/navigation'

const breadcrumbItems = [{ title: "Stock", link: "/stock" }, { title: "New", link: "" } ];

const StockPage = async ({ params }: { params: { id: string } }) => {
    let item: Stock | null = null;
    let newItem = true;

    if (params.id && params.id !== "new") {
        newItem = false;
        item = await getItem(params.id)
        if( !item ) notFound()
    }

    return (
        <>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <BreadCrumb items={breadcrumbItems} />

                <div className="flex items-start justify-between">
                    <Heading title={!newItem ? `Edit stock item` : `Record stock intake`} description={!newItem ? "Edit your stock items" : "Add new stock items to your business"} />
                </div>
                <Separator />

                <StockForm item={item} />
            </div>
        </>
    );
};

export default StockPage;
