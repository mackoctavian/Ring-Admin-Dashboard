import { getCurrentBusiness } from '@/lib/actions/business.actions';
import {Business} from "@/types";
import {notFound} from "next/navigation";
import BreadCrumb from "@/components/layout/breadcrumb";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import BusinessSettingsForm from "@/components/forms/BusinessForm";

export default async function BusinessSettingsPage() {
    let item: Business;

    try {
        item = await getCurrentBusiness();
        if (!item) notFound();
    } catch (error) {
        throw new Error("Failed to load business data");
    }

    const breadcrumbItems = [{ title: "Business details", link: "/dashboard/settings/business" },{ title: item.name, link: ""}];

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between mb-2">
                <div className="relative flex-1 md:max-w-md">
                    <BreadCrumb items={breadcrumbItems}/>
                </div>
            </div>

            <BusinessCard item={item} />
        </div>
    );
}

const BusinessCard = ({ item }: { item: Business }) => (
    <Card>
        <CardHeader>
            <CardTitle>Edit business details</CardTitle>
            <CardDescription>Update your business details</CardDescription>
        </CardHeader>
        <CardContent>
            <BusinessSettingsForm item={item} />
        </CardContent>
    </Card>
);