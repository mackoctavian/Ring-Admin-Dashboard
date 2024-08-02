import BreadCrumb from "@/components/layout/breadcrumb";
import { getItem } from '@/lib/actions/branch.actions';
import {Branch} from "@/types";
import BranchForm from "@/components/forms/BranchForm";
import {notFound} from "next/navigation";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default async function BranchPage({ params }: { params: { id: string } }) {
    const isNewItem = params.id === "new";
    let item: Branch | null = null;

    if (!isNewItem) {
        try {
            item = await getItem(params.id);
            if (!item) notFound();
        } catch (error) {
            throw new Error("Failed to load branch data");
        }
    }

    const breadcrumbItems = [{ title: "Branches", link: "/dashboard/branches" }, { title: isNewItem ? "New" : item?.name || "Edit", link: "" }];

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between mb-2">
                <div className="relative flex-1 md:max-w-md">
                    <BreadCrumb items={breadcrumbItems}/>
                </div>
            </div>

            <BranchCard isNewItem={isNewItem} item={item} />
        </div>
    );
}

const BranchCard = ({ isNewItem, item }: { isNewItem: boolean; item: Branch | null }) => (
    <Card>
        <CardHeader>
            <CardTitle>{isNewItem ? "Create branch" : "Edit branch"}</CardTitle>
            <CardDescription>
                {isNewItem ? "Create new branch" : "Edit branch details"}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <BranchForm item={item} />
        </CardContent>
    </Card>
)