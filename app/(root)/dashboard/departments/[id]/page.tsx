import BreadCrumb from "@/components/layout/breadcrumb";
import { getItem } from '@/lib/actions/department.actions';
import {Department} from "@/types";
import DepartmentForm from "@/components/forms/DepartmentForm";
import {notFound} from "next/navigation";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default async function DepartmentPage({ params }: { params: { id: string } }) {
    const isNewItem = params.id === "new";
    let item: Department | null = null;

    if (!isNewItem) {
        try {
            item = await getItem(params.id);
            if (!item) notFound();
        } catch (error) {
            console.error("Error loading data:", error);
            throw new Error("Failed to load department data");
        }
    }

    const breadcrumbItems = [{ title: "Departments", link: "/dashboard/departments" }, { title: isNewItem ? "New" : item?.name || "Edit", link: "" }];

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between mb-2">
                <div className="relative flex-1 md:max-w-md">
                    <BreadCrumb items={breadcrumbItems}/>
                </div>
            </div>

            <DepartmentCard isNewItem={isNewItem} item={item} />
        </div>
    );
}

const DepartmentCard = ({ isNewItem, item }: { isNewItem: boolean; item: Department | null }) => (
    <Card>
        <CardHeader>
            <CardTitle>{isNewItem ? "Create department" : "Edit department"}</CardTitle>
            <CardDescription>
                {isNewItem ? "Add new department to your business" : "Edit your department"}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <DepartmentForm item={item} />
        </CardContent>
    </Card>
);

