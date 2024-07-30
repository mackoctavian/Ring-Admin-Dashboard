'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch"
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { Category } from "@/types";
import { CategoryType, CategorySchema } from "@/types/data-schemas";
import { createItem, updateItem } from "@/lib/actions/category.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button";
import CategorySelector from "@/components/layout/category-selector";
import { SubmitButton } from "../ui/submit-button";

 const CategoryForm = ({ item }: { item?: Category | null }) => {
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof CategorySchema>>({
        resolver: zodResolver(CategorySchema),
        defaultValues: item ? { ...item, parent: item.parent } : {
            type: CategoryType.PRODUCT,
            description: '',
            status: false,
        },
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
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category name</FormLabel>
                            <FormControl>
                                <Input
                                placeholder="Category name (eg. Hair Products)"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Category type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value={CategoryType.PRODUCT}>Product</SelectItem>
                                    <SelectItem value={CategoryType.SERVICE}>Service</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        
                    <FormField
                        control={form.control}
                        name="parent"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Parent category</FormLabel>
                                <CategorySelector {...field} />
                                <FormMessage />
                            </FormItem>
                            )}
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
                <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Category description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Short description of the category"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
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