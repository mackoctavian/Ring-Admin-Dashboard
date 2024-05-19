import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import BreadCrumb from "@/components/layout/breadcrumb";
import { getItem } from '@/lib/actions/product-unit.actions';
import { ProductUnit } from "@/types";
import ProductUnitForm from "@/components/forms/ProductUnitForm";

const breadcrumbItems = [{ title: "Units", link: "/units" }, { title: "New", link: "" } ];

const ProductUnitPage = async ({ params }: { params: { unitid: string } }) => {
    let item: ProductUnit | null = null;
    let newItem = true;

    if (params.unitid && params.unitid !== "new") {
        try {
            item = await getItem(params.unitid);
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
                    <Heading title={!newItem ? `Edit product unit` : `Create product unit`} description={!newItem ? "Edit your product unit" : "Add new product unit to your business"} />
                </div>
                <Separator />

                <ProductUnitForm item={item} />
            </div>
        </>
    );
};

export default ProductUnitPage;
