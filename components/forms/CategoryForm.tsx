'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";
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
import { Category, Discount } from "@/types";
import { CategoryType, CategorySchema } from "@/types/data-schemas";
import { createItem, updateItem } from "@/lib/actions/category.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button";
import ParentCategorySelector from "@/components/layout/parent-category-selector";
import DiscountSelector from "../layout/discount-selector";
import { SubmitButton } from "../ui/submit-button";

 const CategoryForm = ({ item }: { item?: Category | null }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const [selectedParent, setSelectedParent] = useState<Category | undefined>(
        item ? item.parent : undefined
    );
    
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
        console.error(JSON.stringify(errors));
    }

    const nameValue = form.watch('name');
    useEffect(() => {
        if (nameValue) {
            const generatedSlug = nameValue.toLowerCase().replace(/\s+/g, '-');
            form.setValue('slug', generatedSlug);
        }
    }, [nameValue, form.setValue]);
        
        
    const onSubmit = async (data: z.infer<typeof CategorySchema>) => {
        setIsLoading(true);
    
        try {
            if (item) {
                await updateItem(item.$id, data);
                toast({
                    variant: "success",
                    title: "Success", 
                    description: "Category details updated succesfully!"
                });
            } else {
                await createItem(data);
                toast({
                    variant: "success",
                    title: "Success", 
                    description: "Category created succesfully!"
                });
            }
            
            // Redirect to the list page after submission
            router.push("/categories");
            router.refresh();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.", 
                description: "There was an issue submitting your form, please try later"
            });
        } finally {
        //delay loading
        setTimeout(() => {
            setIsLoading(false);
            }, 1000); 
        }
    };

    useEffect(() => {
        if (item) {
          setSelectedParent(item.parent);
        }
      }, [item]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product category name</FormLabel>
                            <FormControl>
                                <Input
                                placeholder="Product category name (eg. Hair Products)"
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
                            <FormLabel>Product category type</FormLabel>
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
                                <ParentCategorySelector
                                type={ form.watch("type") }
                                value={selectedParent}
                                onChange={(cat) => { setSelectedParent(cat); field.onChange(cat); }}
                                />
                                <FormMessage />
                            </FormItem>
                            )}
                    />

                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem className="hidden">
                                <FormLabel>Slug ( Auto-Generated )</FormLabel>
                                <FormControl>
                                    <Input
                                    placeholder="Category identifier"
                                    disabled
                                    {...field}
                                    />
                                </FormControl>
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