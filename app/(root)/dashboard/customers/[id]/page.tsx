import BreadCrumb from "@/components/layout/breadcrumb";
import { getItem } from '@/lib/actions/customer.actions';
import {Customer} from "@/types";
import CustomerForm from "@/components/forms/CustomerForm";
import { notFound } from 'next/navigation'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";


export default async function CustomerPage({ params }: { params: { id: string } }) {
    const isNewItem = params.id === "new";
    let item: Customer | null = null;

    if (!isNewItem) {
        try {
            item = await getItem(params.id);
            if (!item) notFound();
        } catch (error) {
            console.error("Error loading data:", error);
            throw new Error("Failed to load customer data");
        }
    }

    const breadcrumbItems = [{ title: "Customers", link: "/dashboard/customers" }, { title: isNewItem ? "New" : item?.name || "Edit", link: "" }];

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between mb-2">
                <div className="relative flex-1 md:max-w-md">
                    <BreadCrumb items={breadcrumbItems}/>
                </div>
            </div>

            <CustomerCard isNewItem={isNewItem} item={item} />
        </div>
    );
}

const CustomerCard = ({ isNewItem, item }: { isNewItem: boolean; item: Customer | null }) => (
    <Card>
        <CardHeader>
            <CardTitle>{isNewItem ? "Create customer" : "Edit customer"}</CardTitle>
            <CardDescription>
                {isNewItem ? "Add new customer to your business" : "Edit customer details"}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <CustomerForm item={item} />
        </CardContent>
    </Card>
);