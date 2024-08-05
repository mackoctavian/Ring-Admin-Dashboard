import BreadCrumb from "@/components/layout/breadcrumb";
import { getItem } from '@/lib/actions/supplier.actions';
import {Supplier} from "@/types";
import SupplierForm from "@/components/forms/SupplierForm";
import { notFound } from 'next/navigation'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default async function SupplierPage({ params }: { params: { id: string } }) {
    const isNewItem = params.id === "new";
    let item: Supplier | null = null;

    if (!isNewItem) {
        try {
            item = await getItem(params.id);
        } catch (error) {
            throw new Error("Failed to load supplier data");
        }

        if (!item) notFound()
    }

    const breadcrumbItems = [
        { title: "Suppliers", link: "/dashboard/suppliers" },
        { title: isNewItem ? "New" : item?.name || "Edit", link: "" }
    ];

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between mb-2">
                <div className="relative flex-1 md:max-w-md">
                    <BreadCrumb items={breadcrumbItems}/>
                </div>
            </div>

            <SupplierCard isNewItem={isNewItem} item={item} />
        </div>
    );
}

const SupplierCard = ({ isNewItem, item }: { isNewItem: boolean; item: Supplier | null }) => (
    <Card>
        <CardHeader>
            <CardTitle>{isNewItem ? "Create supplier" : "Edit supplier"}</CardTitle>
            <CardDescription>
                {isNewItem ? "Add new supplier to your business" : "Edit your supplier"}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <SupplierForm item={item} />
        </CardContent>
    </Card>
);