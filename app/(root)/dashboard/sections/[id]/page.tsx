import BreadCrumb from "@/components/layout/breadcrumb";
import { getItem } from '@/lib/actions/section.actions';
import {Section} from "@/types";
import SectionForm from "@/components/forms/SectionForm";
import {notFound} from "next/navigation";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default async function SectionPage({ params }: { params: { id: string } }) {
    const isNewItem = params.id === "new";
    let item: Section | null = null;

    if (!isNewItem) {
        try {
            item = await getItem(params.id);
            if (!item) notFound();
        } catch (error) {
            throw new Error("Failed to load spaces data");
        }
    }

    const breadcrumbItems = [{ title: "Spaces", link: "/dashboard/sections" }, { title: isNewItem ? "New" : item?.name || "Edit", link: "" }];

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between mb-2">
                <div className="relative flex-1 md:max-w-md">
                    <BreadCrumb items={breadcrumbItems}/>
                </div>
            </div>

            <SpaceCard isNewItem={isNewItem} item={item} />
        </div>
    );
}

const SpaceCard = ({ isNewItem, item }: { isNewItem: boolean; item: Section | null }) => (
    <Card>
        <CardHeader>
            <CardTitle>{isNewItem ? "Add space / section" : "Edit space / section details"}</CardTitle>
            <CardDescription>
                {isNewItem ? "Add spaces, sections and rooms within your business" : "Edit your spaces / section details"}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <SectionForm item={item} />
        </CardContent>
    </Card>
)