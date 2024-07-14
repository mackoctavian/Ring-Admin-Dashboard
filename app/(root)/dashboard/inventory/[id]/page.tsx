import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import BreadCrumb from "@/components/layout/breadcrumb";
import { getItem } from '@/lib/actions/inventory.actions';
import { Inventory } from "@/types";
import InvenvtoryForm from "@/components/forms/InventoryForm";
import { notFound } from 'next/navigation'

const breadcrumbItems = [{ title: "Stock", link: "/stock" }];

const InventoryPage = async ({ params }: { params: { id: string } }) => {
    let item: Inventory | null = null;
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
                    <Heading title={!newItem ? `Edit stock item` : `Create stock item`} description={!newItem ? "Edit your stock item" : "Add new stock items to your business"} />
                </div>
                <Separator />

                <InvenvtoryForm item={item} />
            </div>
        </>
    );
};

export default InventoryPage;
