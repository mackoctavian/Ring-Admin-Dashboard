'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch"
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "@/components/ui/separator"
import { Section } from "@/types";
import { createItem, updateItem } from "@/lib/actions/section.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button";
import { SubmitButton } from "@/components/ui/submit-button";
import {CategoryType, SectionSchema, SectionType} from "@/types/data-schemas";
import {SelectItem} from "@/components/ui/select"
import {Form} from "@/components/ui/form";
import BranchSelector from "../layout/branch-selector";
import CustomFormField, {FormFieldType} from "@/components/ui/custom-input";
  
const SectionForm = ({ item }: { item?: Section | null }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast()

    const form = useForm<z.infer<typeof SectionSchema>>({
        resolver: zodResolver(SectionSchema),
        //handle nullable inputs
        //@ts-ignore
        defaultValues: item ? { ...item, description: item.description ?? '', branch: item.branch.$id ?? '', type: item.type ?? '' }: {}
    });

    const onInvalid = (errors : any ) => {
        toast({
            variant: "warning",
            title: "Data validation failed!", 
            description: "Please make sure all the fields marked with * are filled correctly."
        });
    }

    const onSubmit = async (data: z.infer<typeof SectionSchema>) => {
        setIsLoading(true);
    
        try {
            if (item) {
                //@ts-ignore
                await updateItem(item!.$id, data);
                toast({
                    variant: "success",
                    title: "Success", 
                    description: "Space / section updated successfully!"
                });
            } else {
                //@ts-ignore
                await createItem(data);
                toast({
                    variant: "success",
                    title: "Success", 
                    description: "Space / section created successfully!"
                });
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.", 
                description: error.message || "There was an issue submitting your form, please try later"
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
                    name={`name`}
                    label="Section / space name *"
                    placeholder="Enter section name ( eg. Room 01 / Table 01 )"
                />

                <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="type"
                    label="Type *"
                    placeholder="Select section / space type">
                        <SelectItem value={SectionType.ROOM}>Room</SelectItem>
                        <SelectItem value={SectionType.SEAT}>Seat</SelectItem>
                        <SelectItem value={SectionType.TABLE}>Table</SelectItem>
                </CustomFormField>

                <CustomFormField
                    fieldType={FormFieldType.CUSTOM_SELECTOR}
                    control={form.control}
                    name={`branch`}
                    label="Branch *"
                    renderSkeleton={(field) => (
                        <BranchSelector value={field.value} onChange={field.onChange}/>
                    )}
                />

                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name={`noOfCustomers`}
                    label="Number of customers *"
                    type="number"
                    placeholder="Enter number of customers *"
                    description="Number of customers the section can service at a time"
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

            <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name={`description`}
                label="Extra space / section details"
                placeholder="Any extra details about the space / section"
            />
    
            <div className="flex h-5 items-center space-x-4">
                <CancelButton />
                <Separator orientation="vertical" />
                <SubmitButton loading={isLoading} label={item ? "Update space / section" : "Save space / section"} />
            </div>
        </form>
    </Form>
    );
};
  
export default SectionForm;