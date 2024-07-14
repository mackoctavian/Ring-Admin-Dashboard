import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import BreadCrumb from "@/components/layout/breadcrumb";
import { getItem } from '@/lib/actions/section.actions';
import { Section } from "@/types";
import SectionForm from "@/components/forms/SectionForm";

const breadcrumbItems = [{ title: "Sections & spaces", link: "/sections" }, { title: "New", link: "" } ];

const SectionPage = async ({ params }: { params: { id: string } }) => {
    let item: Section | null = null;
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
                    <Heading title={!newItem ? `Edit section / space` : `Create section / space`} description={!newItem ? "Edit your section / space" : "Add new section / space to your business"} />
                </div>
                <Separator />

                <SectionForm item={item} />
            </div>
        </>
    );
};

export default SectionPage;
