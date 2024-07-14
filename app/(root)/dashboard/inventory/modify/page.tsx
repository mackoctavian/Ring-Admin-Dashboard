import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import BreadCrumb from "@/components/layout/breadcrumb";
import ModifyInvenvtoryForm from "@/components/forms/ModifyInventoryForm";

const breadcrumbItems = [{ title: "Stock", link: "/stock" }, { title: "Modify", link: "" } ];

const ModifyInventoryPage = async () => {
    return (
        <>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <BreadCrumb items={breadcrumbItems} />

                <div className="flex items-start justify-between">
                    <Heading title={`Modify stock values`} description={`Modify values for stock items`} />
                </div>
                <Separator />

                <ModifyInvenvtoryForm />
            </div>
        </>
    );
};

export default ModifyInventoryPage;
