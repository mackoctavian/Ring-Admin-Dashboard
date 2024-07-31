import BreadCrumb from "@/components/layout/breadcrumb";
import { getItem } from '@/lib/actions/campaign.actions';
import {Campaign} from "@/types";
import CampaignForm from "@/components/forms/CampaignForm";
import {notFound} from "next/navigation";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default async function CampaignPage({ params }: { params: { id: string } }) {
    const isNewItem = params.id === "new";
    let item: Campaign | null = null;

    if (!isNewItem) {
        try {
            item = await getItem(params.id);
            if (!item) notFound();
        } catch (error) {
            console.error("Error loading data:", error);
            throw new Error("Failed to load campaign data");
        }
    }

    const breadcrumbItems = [{ title: "Campaigns", link: "/dashboard/campaigns" }, { title: isNewItem ? "New" : item?.title || "Edit", link: "" }];

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between mb-2">
                <div className="relative flex-1 md:max-w-md">
                    <BreadCrumb items={breadcrumbItems}/>
                </div>
            </div>

            <CampaignCard isNewItem={isNewItem} item={item} />
        </div>
    );
}

const CampaignCard = ({ isNewItem, item }: { isNewItem: boolean; item: Campaign | null }) => (
    <Card>
        <CardHeader>
            <CardTitle>{isNewItem ? "Create campaign" : "Edit campaign"}</CardTitle>
            <CardDescription>
                {isNewItem ? "Schedule a new campaign" : "Edit campaign"}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <CampaignForm item={item} />
        </CardContent>
    </Card>
)