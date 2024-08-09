import BreadCrumb from "@/components/layout/breadcrumb";
import { getItem } from '@/lib/actions/product.actions';
import {Product} from "@/types";
import ProductForm from "@/components/forms/ProductForm";
import {notFound} from "next/navigation";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default async function ProductPage({ params }: { params: { id: string } }) {
    const isNewItem = params.id === "new";
    let item: Product | null = null;

    if (!isNewItem) {
        try {
            item = await getItem(params.id);
        } catch (error) {
            throw new Error("Failed to load product data");
        }

        if (!item) notFound()
    }

    const breadcrumbItems = [{ title: "Product", link: "/dashboard/product" }, { title: isNewItem ? "New" : item?.name || "Edit", link: "" }];

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between mb-2">
                <div className="relative flex-1 md:max-w-md">
                    <BreadCrumb items={breadcrumbItems}/>
                </div>
            </div>

            <ProductCard isNewItem={isNewItem} item={item} />
        </div>
    );
}

const ProductCard = ({ isNewItem, item }: { isNewItem: boolean; item: Product | null }) => (
    <Card>
        <CardHeader>
            <CardTitle>{isNewItem ? "Add product" : "Edit product"}</CardTitle>
            <CardDescription>
                {isNewItem ? "Add new product to business" : "Update product details"}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <ProductForm item={item} />
        </CardContent>
    </Card>
)