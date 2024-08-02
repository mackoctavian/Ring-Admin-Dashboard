'use client'

import * as z from "zod";
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch"
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator"
import { Department } from "@/types"
import { createItem, updateItem } from "@/lib/actions/department.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button"
import { DepartmentSchema } from "@/types/data-schemas"
import BranchSelector from "../layout/branch-selector"
import { Form } from "@/components/ui/form";
import CustomFormField, {FormFieldType} from "@/components/ui/custom-input";
import {SubmitButton} from "@/components/ui/submit-button";

const DepartmentForm = ({ item }: { item?: Department | null }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast()

    const form = useForm<z.infer<typeof DepartmentSchema>>({
        resolver: zodResolver(DepartmentSchema),
        //handle nullable inputs & objects
        //@ts-ignore
        defaultValues: item ? { ...item, branch: item.branch.$id ?? '' }: {}
    });

    const onInvalid = (errors : any ) => {
        toast({
            variant: "warning",
            title: "Data validation failed!", 
            description: "Please make sure all the fields marked with * are filled correctly."
        });
    }
    
    const onSubmit = async (data: z.infer<typeof DepartmentSchema>) => {
        setIsLoading(true);
    
        try {
            if (item) {
                //@ts-ignore
                await updateItem(item!.$id!, data);
                toast({
                    variant: "success",
                    title: "Success", 
                    description: "Department details updated successfully!"
                });
            } else {
                //@ts-ignore
                await createItem(data);
                toast({
                    variant: "success",
                    title: "Success", 
                    description: "Department created successfully!"
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="name"
                    label="Department name *"
                    placeholder="Department full name (eg. Pizza department)"
                />

                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="shortName"
                    label="Short name *"
                    placeholder="Department short name (eg. Pizza)"
                />

                <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="branch"
                    label="Branch *"
                    renderSkeleton={(field) => (
                        <BranchSelector value={field.value} onChange={field.onChange}/>
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
            <CancelButton/>
            <Separator orientation="vertical"/>
            <SubmitButton loading={isLoading} label={item ? "Update department" : "Save department"}/>
            </div>
        </form>
    </Form>
    );
};
  
export default DepartmentForm;