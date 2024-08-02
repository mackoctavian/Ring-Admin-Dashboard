'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch"
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "@/components/ui/separator"
import {Form} from "@/components/ui/form";
import { Branch } from "@/types";
import { createItem, updateItem } from "@/lib/actions/branch.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button";
import TimeSelector from "../layout/time-selector";
import DaysSelector from "../layout/days-selector";
import { BranchSchema } from "@/types/data-schemas";
import {SubmitButton} from "@/components/ui/submit-button";
import CustomFormField, {FormFieldType} from "@/components/ui/custom-input";

const BranchForm = ({ item }: { item?: Branch | null }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof BranchSchema>>({
        resolver: zodResolver(BranchSchema),
        //handle nullable inputs
        defaultValues: item ? { ...item, address: item.address ?? '' }: {}
    });

    const onInvalid = (errors: any) => {
        toast({
            variant: "warning",
            title: "Data validation failed!",
            description: "Please make sure all the fields marked with * are filled correctly.",
        });
    };

    const onSubmit = async (data: z.infer<typeof BranchSchema>) => {
        setIsLoading(true);
        try {
            if (item) {
                //@ts-ignore
                await updateItem(item.$id!, data);
                toast({
                    variant: "success",
                    title: "Success",
                    description: "Branch details have been updated successfully!",
                });
            } else {
                //@ts-ignore
                await createItem(data);
                toast({
                    variant: "success",
                    title: "Success",
                    description: "Branch has been created successfully!",
                });
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: error.message || "There was an issue submitting your form, please try later",
            });
        } finally {
            setIsLoading(false);
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
                    label="Branch name *"
                    placeholder="Enter branch full name (eg. Msasani Branch)"
                />

                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="email"
                    label="Branch email address *"
                    placeholder="Enter branch email address"
                    type="email"
                />

                <CustomFormField
                    fieldType={FormFieldType.PHONE_INPUT}
                    control={form.control}
                    name="phoneNumber"
                    label="Branch phone number *"
                    placeholder="Enter branch phone number"
                />

                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="city"
                    label="Branch location (city) *"
                    placeholder="Enter branch location"
                />

                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name={`address`}
                    label="Branch address"
                    placeholder="Enter branch address"
                />

                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="staffCount"
                    label="Number of staff *"
                    placeholder="Enter number of staff"
                    type="number"
                />

                <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="daysOpen"
                    label="Branch open days *"
                    renderSkeleton={(field) => (
                        <DaysSelector value={field.value} onChange={field.onChange} />
                    )}
                />

                <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="openingTime"
                    label="Branch opening time *"
                    renderSkeleton={(field) => (
                        <TimeSelector value={field.value} onChange={field.onChange} />
                    )}
                />

                <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="closingTime"
                    label="Branch closing time *"
                    renderSkeleton={(field) => (
                        <TimeSelector value={field.value} onChange={field.onChange} />
                    )}
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
                <SubmitButton label={item ? "Update branch details" : "Create branch"} loading={isLoading} />
            </div>
        </form>
    </Form>
    );
};

export default BranchForm;