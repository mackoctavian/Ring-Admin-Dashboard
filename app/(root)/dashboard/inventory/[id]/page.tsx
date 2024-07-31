import BreadCrumb from "@/components/layout/breadcrumb";
import { getItem } from '@/lib/actions/inventory.actions';
import {Inventory} from "@/types";
import InventoryForm from "@/components/forms/InventoryForm";
import { notFound } from 'next/navigation'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default async function InventoryPage({ params }: { params: { id: string } }) {
    const isNewItem = params.id === "new";
    let item: Inventory | null = null;

    if (!isNewItem) {
        try {
            item = await getItem(params.id);
            if (!item) notFound();
        } catch (error) {
            console.error("Error loading data:", error);
            throw new Error("Failed to load stock item data");
        }
    }

    const breadcrumbItems = [{ title: "Stock", link: "/dashboard/stock" }, { title: isNewItem ? "New" : item?.title || "Edit", link: "" }];

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between mb-2">
                <div className="relative flex-1 md:max-w-md">
                    <BreadCrumb items={breadcrumbItems}/>
                </div>
            </div>

            <StockCard isNewItem={isNewItem} item={item} />
        </div>
    );
}

const StockCard = ({ isNewItem, item }: { isNewItem: boolean; item: Inventory | null }) => (
    <Card>
        <CardHeader>
            <CardTitle>{isNewItem ? "Create stock item" : "Edit stock item"}</CardTitle>
            <CardDescription>
                {isNewItem ? "Add new stock item to your business" : "Edit stock item"}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <InventoryForm item={item} />
        </CardContent>
    </Card>
)