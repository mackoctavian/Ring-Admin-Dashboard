import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import BreadCrumb from "@/components/layout/breadcrumb";
import { getItem } from '@/lib/actions/inventory.actions';
import { Inventory } from "@/types";
import InvenvtoryForm from "@/components/forms/InventoryForm";

const breadcrumbItems = [{ title: "Categories", link: "/categories" }, { title: "New", link: "" } ];

const InventoryPage = async ({ params }: { params: { id: string } }) => {
    let item: Inventory | null = null;
    let newItem = true;

    if (params.id && params.id !== "new") {
        try {
            item = await getItem(params.id);
            newItem = false;
        } catch (error) {
            throw new Error("Error loading data" + error);
        }
    }

    return (
        <>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <BreadCrumb items={breadcrumbItems} />

                <div className="flex items-start justify-between">
                    <Heading title={!newItem ? `Edit inventory` : `Create inventory`} description={!newItem ? "Edit your inventory" : "Add new inventory to your business"} />
                </div>
                <Separator />

                <InvenvtoryForm item={item} />
            </div>
        </>
    );
};

export default InventoryPage;
