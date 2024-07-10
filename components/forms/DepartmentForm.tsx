'use client'

import * as z from "zod";
import React, { useState, useEffect } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Department, Branch } from "@/types"
import { createItem, updateItem } from "@/lib/actions/department.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button"
import { DepartmentSchema } from "@/types/data-schemas"
import BranchSelector from "../layout/branch-selector"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";


const DepartmentForm = ({ item }: { item?: Department | null }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast()

    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(item?.branch ?? null);
    useEffect(() => {
        if (item && item.branch) {
        setSelectedBranch(item.branch);
        } else {
        setSelectedBranch(null);
        }
    }, [item]);
    
    const form = useForm<z.infer<typeof DepartmentSchema>>({
        resolver: zodResolver(DepartmentSchema),
        defaultValues: item ? item : {
        status: false,
        },
    });

    const onInvalid = (errors : any ) => {
        console.error("Creating department failed: ", JSON.stringify(errors));
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
                await updateItem(item!.$id!, data);
                toast({
                    variant: "success",
                    title: "Success", 
                    description: "Department details updated succesfully!"
                });
            } else {
                await createItem(data);
                toast({
                    variant: "success",
                    title: "Success", 
                    description: "Department created succesfully!"
                });
            }
            
            // Redirect to the list page after submission
            router.push("/departments");
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

return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
            <div className="grid grid-cols-3 gap-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Department name *</FormLabel>
                        <FormControl>
                            <Input
                            placeholder="Department full name (eg. Pizza department)"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
            
                <FormField
                    control={form.control}
                    name="shortName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Short name *</FormLabel>
                            <FormControl>
                                <Input
                                placeholder="Department short name (eg. HR)"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="branch"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Branch *</FormLabel>
                            <FormControl>
                                <BranchSelector
                                    value={selectedBranch}
                                    onChange={(branch) => { setSelectedBranch(branch); field.onChange(branch); }}
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

    
            <div className="flex h-5 items-center space-x-4">
                <CancelButton />
            
                <Separator orientation="vertical" />

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> &nbsp; Processing...
                        </>
                        ) : (
                        item ? "Update department" : "Save department"
                    )}
                </Button> 
            </div>
        </form>
    </Form>
    );
};
  
export default DepartmentForm;