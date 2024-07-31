import BreadCrumb from "@/components/layout/breadcrumb";
import ModifyInvenvtoryForm from "@/components/forms/ModifyInventoryForm";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default async function ModifyInventoryPage() {
    const breadcrumbItems = [{ title: "Stock", link: "/dashboard/stock" }, { title: "Modify", link: "" }];

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between mb-2">
                <div className="relative flex-1 md:max-w-md">
                    <BreadCrumb items={breadcrumbItems}/>
                </div>
            </div>

            <ModifyCard />
        </div>
    );
}

const ModifyCard = () => (
    <Card>
        <CardHeader>
            <CardTitle>Modify stock values</CardTitle>
            <CardDescription>Modify values for stock items</CardDescription>
        </CardHeader>
        <CardContent>
            <ModifyInvenvtoryForm />
        </CardContent>
    </Card>
);
