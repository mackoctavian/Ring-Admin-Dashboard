import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import BreadCrumb from "@/components/layout/breadcrumb";
import { getItem } from '@/lib/actions/department.actions';
import { Department } from "@/types";
import DepartmentForm from "@/components/forms/DepartmentForm";

const breadcrumbItems = [{ title: "Departments", link: "/departments" }, { title: "New", link: "" } ];

const DepartmentPage = async ({ params }: { params: { id: string } }) => {
    let item: Department | null = null;
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
                    <Heading title={!newItem ? `Edit department` : `Create department`} description={!newItem ? "Edit your department" : "Add new department to your business"} />
                </div>
                <Separator />

                <DepartmentForm item={item} />
            </div>
        </>
    );
};

export default DepartmentPage;
