import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import BreadCrumb from "@/components/layout/breadcrumb";
import { getItem } from '@/lib/actions/product.actions';
import { Product } from "@/types";
import ProductForm from "@/components/forms/ProductForm";

const breadcrumbItems = [{ title: "Product", link: "/product" }, { title: "New", link: "" } ];

const ProductPage = async ({ params }: { params: { id: string } }) => {
    let item: Product | null = null;
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
                    <Heading title={!newItem ? `Edit product` : `Create product`} description={!newItem ? "Edit product details" : "Add new product to your business"} />
                </div>
                <Separator />

                <ProductForm item={item} />
            </div>
        </>
    );
};

export default ProductPage;
