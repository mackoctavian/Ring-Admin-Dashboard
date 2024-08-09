import BreadCrumb from "@/components/layout/breadcrumb";
import { getItem } from '@/lib/actions/category.actions';
import { Category } from "@/types";
import CategoryForm from "@/components/forms/CategoryForm";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {notFound} from "next/navigation";

export default async function CategoryPage({ params }: { params: { id: string } }) {
    const isNewItem = params.id === "new";
    let item: Category | null = null;

    if (!isNewItem) {
        try {
            item = await getItem(params.id);
            if (!item) notFound();
        } catch (error) {
            console.error("Error loading data:", error);
            throw new Error("Failed to load category data");
        }
    }

    const breadcrumbItems = [{ title: "Categories", link: "/dashboard/categories" }, { title: isNewItem ? "New" : item?.name || "Edit", link: "" }];

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between mb-2">
                <div className="relative flex-1 md:max-w-md">
                    <BreadCrumb items={breadcrumbItems}/>
                </div>
            </div>

            <CategoryCard isNewItem={isNewItem} item={item} />
        </div>
    );
}

const CategoryCard = ({ isNewItem, item }: { isNewItem: boolean; item: Category | null }) => (
    <Card>
        <CardHeader>
            <CardTitle>{isNewItem ? "Create category" : "Edit category"}</CardTitle>
            <CardDescription>
                {isNewItem ? "Add new category to your business" : "Edit your category"}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <CategoryForm item={item} />
        </CardContent>
    </Card>
);
