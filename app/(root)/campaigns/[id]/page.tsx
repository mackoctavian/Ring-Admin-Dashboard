import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import BreadCrumb from "@/components/layout/breadcrumb";
import { getItem } from '@/lib/actions/campaign.actions';
import { Campaign } from "@/types";
import CampaignForm from "@/components/forms/CampaignForm";
import { Suspense } from "react";
import LoadingPage from "@/app/loading";

const breadcrumbItems = [{ title: "Campaign", link: "/campaigns" }, { title: "New campaign", link: "" } ];

const CampaignPage = async ({ params }: { params: { id: string } }) => {
    let item: Campaign | null = null;
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
                    <Heading title={!newItem ? `Re-send message` : `Broadcast message`} description={!newItem ? "Re-send message" : "Broadcast this message"} />
                </div>
                <Separator />

                <Suspense fallback={<LoadingPage />}>
                    <CampaignForm item={item} />
                </Suspense>
            </div>
        </>
    );
};

export default CampaignPage;
