import BreadCrumb from "@/components/layout/breadcrumb";
import { getItem } from '@/lib/actions/device.actions';
import {Device} from "@/types";
import DeviceForm from "@/components/forms/DeviceForm";
import { notFound } from 'next/navigation'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

export default async function DevicePage({ params }: { params: { id: string } }) {
    const isNewItem = params.id === "new";
    let item: Device | null = null;

    if (!isNewItem) {
        try {
            item = await getItem(params.id);
            if (!item) notFound();
        } catch (error) {
            throw new Error("Failed to load device data");
        }
    }

    const breadcrumbItems = [{ title: "Devices", link: "/dashboard/settings/devices" }, { title: isNewItem ? "New" : item?.name || "Edit", link: "" }];

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between mb-2">
                <div className="relative flex-1 md:max-w-md">
                    <BreadCrumb items={breadcrumbItems}/>
                </div>
            </div>

            <DeviceCard isNewItem={isNewItem} item={item} />
        </div>
    );
}

const DeviceCard = ({ isNewItem, item }: { isNewItem: boolean; item: Device | null }) => (
    <Card>
        <CardHeader>
            <CardTitle>{isNewItem ? "Create device" : "Edit device details"}</CardTitle>
            <CardDescription>
                {isNewItem ? "Add new device to your business" : "Edit your device"}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <DeviceForm item={item} />
        </CardContent>
    </Card>
)