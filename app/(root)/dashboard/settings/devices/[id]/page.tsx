import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import BreadCrumb from "@/components/layout/breadcrumb";
import { getItem } from '@/lib/actions/device.actions';
import { Device } from "@/types";
import DeviceForm from "@/components/forms/DeviceForm";
import { notFound } from 'next/navigation'

const breadcrumbItems = [{ title: "Devices", link: "/settings/devices" }, { title: "New", link: "" } ];

const DevicePage = async ({ params }: { params: { id: string } }) => {
    let item: Device | null = null;
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
                    <Heading title={!newItem ? `Edit device` : `Register new device`} description={!newItem ? "Update your device details" : "Register your device to the system"} />
                </div>
                <Separator />

                <DeviceForm item={item} />
            </div>
        </>
    );
};

export default DevicePage;
