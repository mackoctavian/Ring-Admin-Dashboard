'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch"
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "@/components/ui/separator"
import {Form} from "@/components/ui/form";
import { Device } from "@/types";
import { createItem, updateItem } from "@/lib/actions/device.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button";
import { DeviceSchema } from "@/types/data-schemas";
import BranchSelector from "../layout/branch-selector";
import { SubmitButton } from "@/components/ui/submit-button"
import CustomFormField, {FormFieldType} from "@/components/ui/custom-input";

const DeviceForm = ({ item }: { item?: Device | null }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast()

    const form = useForm<z.infer<typeof DeviceSchema>>({
        resolver: zodResolver(DeviceSchema),
        //@ts-ignore
        defaultValues: item ? { ...item, status: true }: {}
    });

    const onInvalid = (errors : any ) => {
        toast({
            variant: "warning",
            title: "Data validation failed!", 
            description: "Please make sure all the fields marked with * are filled correctly."
        });
    }

    const onSubmit = async (data: z.infer<typeof DeviceSchema>) => {
        setIsLoading(true);
    
        try {
            if (item) {
                //@ts-ignore
                await updateItem(item.$id!, data);
                toast({
                    variant: "success",
                    title: "Success", 
                    description: "You have successfully updated the device details!"
                });
            } else {
                //@ts-ignore
                await createItem(data);
                toast({
                    variant: "success",
                    title: "Success", 
                    description: "Device registered successfully"
                });
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.", 
                description: "There was an issue submitting your form, please try later"
            });
        } finally {
            setIsLoading(false);
            form.reset();
        }
    };

return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="name"
                    label="Enter a device name ( identifier ) *"
                    placeholder="Enter device name (eg. Msasani Branch Cashier Device)"
                />

                <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="branchId"
                    label="Device branch *"
                    renderSkeleton={(field) => (
                        <BranchSelector value={field.value} onChange={field.onChange}/>
                    )}
                />

                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="code"
                    label="Device activation code *"
                    placeholder="Enter device activation code"
                    type="number"
                    description="Enter device activation code displayed on your device"
                />

                <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="status"
                    label="Status *"
                    renderSkeleton={(field) => (
                        <div className="mt-2">
                            <Switch
                                id="status"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </div>
                    )}
                />
            </div>
    
            <div className="flex h-5 items-center space-x-4">
                <CancelButton />
                <Separator orientation="vertical" />
                <SubmitButton label={item ? "Update device details" : "Register device"} loading={isLoading} />
            </div>
        </form>
    </Form>
    );
};
  
export default DeviceForm;