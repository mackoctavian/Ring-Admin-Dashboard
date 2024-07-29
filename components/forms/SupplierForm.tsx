'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch"
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "@/components/ui/separator"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Supplier } from "@/types";
import { createItem, updateItem } from "@/lib/actions/supplier.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button";
import { SupplierSchema } from "@/types/data-schemas";
import BranchSelector from "../layout/branch-multiselector";
import { SubmitButton } from "@/components/ui/submit-button"
import CustomFormField, {FormFieldType} from "@/components/ui/custom-input";

const SupplierForm = ({ item }: { item?: Supplier }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast()

    const form = useForm<z.infer<typeof SupplierSchema>>({
        resolver: zodResolver(SupplierSchema),
        defaultValues: item ? item : {
            status: false,
            description: ''
        },
    });

    const onInvalid = (errors : any ) => {
        toast({
            variant: "warning",
            title: "Data validation failed!", 
            description: "Please make sure all the fields marked with * are filled correctly."
        });
    }

    const onSubmit = async (values: z.infer<typeof SupplierSchema>) => {
        setIsLoading(true);

        try {
            const supplierData = {
                name: values.name,
                contactPersonName: values.contactPersonName,
                phoneNumber: values.phoneNumber,
                branch: values.branch,
                email: values.email || undefined,
                address: values.address || undefined,
                status: values.status,
                description: values.description || undefined
            };

            if (item && item.$id) {
                await updateItem(item.$id, supplierData);
                toast({
                    variant: "success",
                    title: "Success",
                    description: "Supplier details updated successfully!"
                });
            } else {
                await createItem(supplierData);
                toast({
                    variant: "success",
                    title: "Success",
                    description: "Supplier created successfully!"
                });
            }
            form.reset(supplierData);
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
                    label="Business name *"
                    placeholder="Enter supplier's business name"
                />
                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name={`contactPersonName`}
                    label="Contact person *"
                    placeholder="Enter contact person's full name"
                />
                <CustomFormField
                    fieldType={FormFieldType.PHONE_INPUT}
                    control={form.control}
                    name={`phoneNumber`}
                    label="Phone number *"
                    placeholder="Enter supplier's phone number"
                    type="tel"
                />
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
                    name={`email`}
                    label="Email address"
                    placeholder="Enter supplier's email address"
                    type="email"
                />
                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name={`address`}
                    label="Address"
                    placeholder="Enter supplier's address"
                />
                
                <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Status *</FormLabel>
                        <FormControl>
                            <div className="mt-2">
                                <Switch
                                    id="status"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </div>
                        </FormControl>
                    </FormItem>
                )}
            />
            </div>
            <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name={`description`}
                label="Notes"
                placeholder="Short notes about the supplier"
            />
    
            <div className="flex h-5 items-center space-x-4">
                <CancelButton />
                <Separator orientation="vertical" />
                <SubmitButton label={item ? "Update supplier" : "Save supplier"} loading={isLoading} />
            </div>
        </form>
    </Form>
    );
};
  
export default SupplierForm;