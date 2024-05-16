import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import BreadCrumb from "@/components/layout/breadcrumb";
import { getCategory } from '@/lib/actions/category.actions';
import { Category } from "@/types";
import CategoryForm from "@/components/forms/CategoryForm";

const breadcrumbItems = [{ title: "Categories", link: "/categories" }, { title: "New", link: "" } ];

const CategoryPage = async ({ params }: { params: { id: string } }) => {
    let item: Category | null = null;

    if (params.id && params.id !== "new") {
        try {
            item = await getCategory(params.id);
        } catch (error) {
            throw new Error("Error loading data" + error);
        }
    }

    return (
        <>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <BreadCrumb items={breadcrumbItems} />

                <div className="flex items-start justify-between">
                    <Heading title={params.id ? `Edit category` : `Create category`} description={params.id ? "Edit your category" : "Add new category to your business"} />
                </div>
                <Separator />

                <CategoryForm item={item} />
            </div>
        </>
    );
};

export default CategoryPage;
