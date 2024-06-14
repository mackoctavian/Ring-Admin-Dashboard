import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import BreadCrumb from "@/components/layout/breadcrumb";
import { getItem } from '@/lib/actions/modifier.actions';
import { Modifier } from "@/types";
import ModifierForm from "@/components/forms/ModifierForm";
import { notFound } from 'next/navigation'

const breadcrumbItems = [{ title: "Modifiers", link: "/modifiers" }, { title: "New", link: "" } ];

const ModifierPage = async ({ params }: { params: { id: string } }) => {
    let item: Modifier | null = null;
    let newItem = true;

    if (params.id && params.id !== "new") {
        newItem = false;
        item = await getItem(params.id)
        if( !item ) notFound()
    }
    
    return (
        <>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <BreadCrumb items={breadcrumbItems} />

                <div className="flex items-start justify-between">
                    <Heading title={!newItem ? `Edit modifier` : `Create modifier`} description={!newItem ? "Edit your modifier" : "Add new modifier to your business"} />
                </div>
                <Separator />

                <ModifierForm modifier={item} />
            </div>
        </>
    );
};

export default ModifierPage;
