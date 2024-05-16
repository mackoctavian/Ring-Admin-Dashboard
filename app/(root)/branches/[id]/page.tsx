import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import BreadCrumb from "@/components/layout/breadcrumb";
import { getBranch } from '@/lib/actions/branch.actions';
import { Branch } from "@/types";
import BranchForm from "@/components/forms/BranchForm";

const breadcrumbItems = [{ title: "Branches", link: "/branches" }, { title: "New", link: "" } ];

const BranchPage = async ({ params }: { params: { id: string } }) => {
    let item: Branch | null = null;

    if (params.id && params.id !== "new") {
        try {
            item = await getBranch(params.id);
        } catch (error) {
            throw new Error("Error loading data" + error);
        }
    }

    return (
        <>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <BreadCrumb items={breadcrumbItems} />

                <div className="flex items-start justify-between">
                    <Heading title={params.id ? `Edit branch` : `Create branch`} description={params.id ? "Edit your branch" : "Add new branch to your business"} />
                </div>
                <Separator />

                <BranchForm item={item} />
            </div>
        </>
    );
};

export default BranchPage;
