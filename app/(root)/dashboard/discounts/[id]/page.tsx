import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import BreadCrumb from "@/components/layout/breadcrumb";
import { getItem } from '@/lib/actions/discount.actions';
import { Discount } from "@/types";
import DiscountForm from "@/components/forms/DiscountForm";

const breadcrumbItems = [{ title: "Discounts", link: "/discounts" }, { title: "New", link: "" } ];

const DiscountPage = async ({ params }: { params: { id: string } }) => {
    let item: Discount | null = null;
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
                    <Heading title={!newItem ? `Edit discount` : `Create discount`} description={!newItem ? "Edit discount" : "Add new discount to your business"} />
                </div>
                <Separator />

                <DiscountForm item={item} />
                
            </div>
        </>
    );
};

export default DiscountPage;
