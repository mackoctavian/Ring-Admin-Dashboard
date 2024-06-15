import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import BreadCrumb from "@/components/layout/breadcrumb";
import { getItem } from '@/lib/actions/customer.actions';
import { Customer } from "@/types";
import CustomerForm from "@/components/forms/CustomerForm";
import { notFound } from 'next/navigation'

const breadcrumbItems = [{ title: "Customer", link: "/customer" }, { title: "New", link: "" } ];

const CustomerPage = async ({ params }: { params: { id: string } }) => {
    let item: Customer | null = null;
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
                    <Heading title={!newItem ? `Edit customer` : `Create customer`} description={!newItem ? "Edit customer details" : "Add new customer to your business"} />
                </div>
                <Separator />

                <CustomerForm item={item} />
            </div>
        </>
    );
};

export default CustomerPage;
