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

 const CategoryForm = ({ item }: { item?: Category | null }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const [selectedParent, setSelectedParent] = useState<Category | undefined>(
        item ? item.parent : undefined
    );
    const [selectedDiscount, setSelectedDiscount] = useState<Discount | undefined>(
        item ? item.discount : undefined
    );
    
    const form = useForm<z.infer<typeof CategorySchema>>({
        resolver: zodResolver(CategorySchema),
        defaultValues: item ? { ...item, parent: item.parent, discount: item.discount } : {
            type: CategoryType.PRODUCT,
            description: '',
            childrenCount: 0,
            status: false,
        },
    });

    const onInvalid = (errors : any ) => {
        toast({
            variant: "warning",
            title: "Uh oh! Something went wrong.", 
            description: "There was an issue submitting your form please try later"
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
                    description: "Product category updated succesfully!"
                });
            } else {
                await createItem(data);
                toast({
                    variant: "success",
                    title: "Success", 
                    description: "Product category created succesfully!"
                });
            }
            
            // Redirect to the list page after submission
            router.push("/categories");
            router.refresh();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.", 
                description: error.message || "There was an issue submitting your form, please try later"
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

    useEffect(() => {
        if (item) {
          setSelectedDiscount(item.discount);
        }
    }, [item]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product category name</FormLabel>
                            <FormControl>
                                <Input
                                placeholder="Product category name (eg. Hair Products)"
                                className="input-class"
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
                        name="discount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Discount</FormLabel>
                                <DiscountSelector
                                value={selectedDiscount}
                                onChange={(disc) => { setSelectedDiscount(disc); field.onChange(disc); }}
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
                                    className="input-class"
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
                            <FormLabel className="inline-flex items-center mb-5 cursor-pointer">Status</FormLabel>
                            <FormControl>
                                <Switch
                                    id="status"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
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

                    <Button type="submit">
                        {isLoading ? (
                            <>
                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> &nbsp; Processing...
                            </>
                            ) : (
                            item ? "Update category" : "Save category"
                        )}
                    </Button> 
                </div>
            </form>
        </Form>
        );
    };
  
export default CategoryForm;