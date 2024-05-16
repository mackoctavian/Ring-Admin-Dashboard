import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import BreadCrumb from "@/components/layout/breadcrumb";
import { getVendor } from '@/lib/actions/vendor.actions';
import { Vendor } from "@/types";
import VendorForm from "@/components/forms/VendorForm";

const breadcrumbItems = [{ title: "Vendors", link: "/vendors" }, { title: "New", link: "" } ];

const VendorPage = async ({ params }: { params: { id: string } }) => {
    let item: Vendor | null = null;

    if (params.id && params.id !== "new") {
        try {
            item = await getVendor(params.id);
        } catch (error) {
            throw new Error("Error loading data" + error);
        }
    }

    return (
        <>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <BreadCrumb items={breadcrumbItems} />

                <div className="flex items-start justify-between">
                    <Heading title={params.id ? `Edit vendor` : `Create vendor`} description={params.id ? "Edit your vendor" : "Add new vendor to your business"} />
                </div>
                <Separator />

                <VendorForm item={item} />
            </div>
        </>
    );
};

export default VendorPage;
