import BreadCrumb from "@/components/layout/breadcrumb";
import { getItem } from '@/lib/actions/staff.actions';
import {Staff} from "@/types";
import StaffForm from "@/components/forms/StaffForm";
import {notFound} from "next/navigation";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default async function StaffPage({ params }: { params: { id: string } }) {
    const isNewItem = params.id === "new";
    let item: Staff | null = null;

    if (!isNewItem) {
        try {
            item = await getItem(params.id);
            if (!item) notFound();
        } catch (error) {
            console.error("Error loading data:", error);
            throw new Error("Failed to load staff data");
        }
    }

    const breadcrumbItems = [{ title: "Staff", link: "/dashboard/staff" }, { title: isNewItem ? "New" : item?.name || "Edit", link: "" }];

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between mb-2">
                <div className="relative flex-1 md:max-w-md">
                    <BreadCrumb items={breadcrumbItems}/>
                </div>
            </div>

            <StaffCard isNewItem={isNewItem} item={item} />
        </div>
    );
}

const StaffCard = ({ isNewItem, item }: { isNewItem: boolean; item: Staff | null }) => (
    <Card>
        <CardHeader>
            <CardTitle>{isNewItem ? "Add staff" : "Edit staff"}</CardTitle>
            <CardDescription>
                {isNewItem ? "Add new staff to business" : "Update staff details"}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <StaffForm item={item} />
        </CardContent>
    </Card>
)