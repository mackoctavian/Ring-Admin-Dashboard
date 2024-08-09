import BreadCrumb from "@/components/layout/breadcrumb";
import StockForm from "@/components/forms/StockForm";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default async function StockPage() {

    const breadcrumbItems = [{ title: "Stock", link: "/dashboard/stock" }, { title: "New", link: "" }];

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between mb-2">
                <div className="relative flex-1 md:max-w-md">
                    <BreadCrumb items={breadcrumbItems}/>
                </div>
            </div>

            <StockCard />
        </div>
    );
}

const StockCard = () => (
    <Card>
        <CardHeader>
            <CardTitle>Record stock intake</CardTitle>
            <CardDescription>Record stock delivery from supplier</CardDescription>
        </CardHeader>
        <CardContent>
            <StockForm />
        </CardContent>
    </Card>
);