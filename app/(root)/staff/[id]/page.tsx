import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import BreadCrumb from "@/components/layout/breadcrumb";
import { getItem } from '@/lib/actions/staff.actions';
import { Staff } from "@/types";
import StaffForm from "@/components/forms/StaffForm";

const breadcrumbItems = [{ title: "Staff", link: "/staff" }, { title: "New", link: "" } ];

const StaffPage = async ({ params }: { params: { id: string } }) => {
    let item: Staff | null = null;
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
                    <Heading title={!newItem ? `Edit staff` : `Create staff`} description={!newItem ? "Edit employee details" : "Add new employee to your business"} />
                </div>
                <Separator />

                <StaffForm item={item} />
            </div>
        </>
    );
};

export default StaffPage;
