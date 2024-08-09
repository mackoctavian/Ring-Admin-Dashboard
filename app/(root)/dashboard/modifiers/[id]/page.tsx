import BreadCrumb from "@/components/layout/breadcrumb";
import {getItem} from '@/lib/actions/modifier.actions';
import {Modifier} from "@/types";
import ModifierForm from "@/components/forms/ModifierForm";
import { notFound } from 'next/navigation'
import {handleError} from "@/lib/utils/actions-service";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default async function ModifierPage({ params }: { params: { id: string } }) {
    const isNewItem = params.id === "new";
    let item: Modifier | undefined = undefined;

    if (!isNewItem) {
        try {
            item = await getItem(params.id);
        } catch (error) {
            throw new Error("Failed to load modifiers");
        }

        if (!item) notFound()
    }

    const breadcrumbItems = [{ title: "Modifiers", link: "/dashboard/modifiers" }, { title: isNewItem ? "New" : item?.name || "Edit", link: "" }];

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between mb-2">
                <div className="relative flex-1 md:max-w-md">
                    <BreadCrumb items={breadcrumbItems}/>
                </div>
            </div>

            <ModifierCard isNewItem={isNewItem} item={item} />
        </div>
    );
}

const ModifierCard = ({ isNewItem, item }: { isNewItem: boolean; item: Modifier | undefined }) => (
    <Card key={`modifier-card`} x-chunk={`modifier-card`}>
        <CardHeader>
            <CardTitle>{isNewItem ? "Create modifier" : "Edit modifier"}</CardTitle>
            <CardDescription>
                {isNewItem ? "Add new modifiers / extras to your business" : "Edit your modifier / extra"}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <ModifierForm modifier={item} />
        </CardContent>
    </Card>
);
