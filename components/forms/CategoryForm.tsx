'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch"
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "@/components/ui/separator"
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select"
import { Category } from "@/types";
import {CategoryType, CategorySchema, ModifierType} from "@/types/data-schemas";
import { createItem, updateItem } from "@/lib/actions/category.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button";
import CategorySelector from "@/components/layout/category-selector";
import { SubmitButton } from "../ui/submit-button";
import CustomFormField, {FormFieldType} from "@/components/ui/custom-input";

 const CategoryForm = ({ item }: { item?: Category | null }) => {
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof CategorySchema>>({
        resolver: zodResolver(CategorySchema),
        //handle nullable inputs & objects
        //@ts-ignore
        defaultValues: item ? { ...item, parent: item.parent.$id ?? '', description: '' }: {}
    });

    const onInvalid = (errors : any ) => {
        toast({
            variant: "warning",
            title: "Data validation failed!",
            description: "Please make sure all the fields marked with * are filled correctly."
        });
    }

    const onSubmit = async (data: z.infer<typeof CategorySchema>) => {
        setIsLoading(true);

        try {
            if (item) {
                //@ts-ignore
                await updateItem(item.$id, data);
                toast({
                    variant: "success",
                    title: "Success",
                    description: "Category details updated successfully!"
                });
            } else {
                //@ts-ignore
                await createItem(data);
                toast({
                    variant: "success",
                    title: "Success",
                    description: "Category created successfully!"
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
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="name"
                        label="Category name *"
                        placeholder="Category name (eg. Pizza)"
                    />

                    <CustomFormField
                        fieldType={FormFieldType.SELECT}
                        control={form.control}
                        name="type"
                        label="Category type *"
                        placeholder="Select category type">
                        <SelectItem value={CategoryType.PRODUCT}>Product</SelectItem>
                        <SelectItem value={CategoryType.SERVICE}>Service</SelectItem>
                    </CustomFormField>

                    <CustomFormField
                        fieldType={FormFieldType.SKELETON}
                        control={form.control}
                        name="parent"
                        label="Parent category"
                        renderSkeleton={(field) => (
                            <CategorySelector value={field.value} onChange={field.onChange} />
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

                <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="description"
                    label="Category description"
                    placeholder="Short description of the category"
                />

                <div className="flex h-5 items-center space-x-4">
                    <CancelButton />
                    <Separator orientation="vertical" />
                    <SubmitButton label={item ? "Update category" : "Save category"} loading={isLoading} />
                </div>
            </form>
        </Form>
        );
    };

export default CategoryForm;