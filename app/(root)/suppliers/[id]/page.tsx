import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import BreadCrumb from "@/components/layout/breadcrumb";
import { getItem } from '@/lib/actions/supplier.actions';
import { Supplier } from "@/types";
import SupplierForm from "@/components/forms/SupplierForm";

const breadcrumbItems = [{ title: "Suppliers", link: "/suppliers" }, { title: "New", link: "" } ];

const SupplierPage = async ({ params }: { params: { id: string } }) => {
    let item: Supplier | null = null;
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
                    <Heading title={!newItem ? `Edit supplier` : `Create supplier`} description={!newItem ? "Edit your supplier" : "Add new supplier to your business"} />
                </div>
                <Separator />

                <SupplierForm item={item} />
            </div>
        </>
    );
};

export default SupplierPage;
