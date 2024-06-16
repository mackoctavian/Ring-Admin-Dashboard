'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react';
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
import { updateItem } from "@/lib/actions/inventory.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button";
import { SubmitButton } from "../ui/submit-button";
import { InventoryModificationSchema } from "@/types/data-schemas"
import InventorySelector from "@/components/layout/inventory-selector"

 const ModifyInventoryForm = () => {
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof InventoryModificationSchema>>({
        resolver: zodResolver(InventoryModificationSchema),
        defaultValues: {},
    });

    const onInvalid = (errors : any ) => {
        toast({
            variant: "warning",
            title: "Data validation failed!", 
            description: "Please make sure all the fields marked with * are filled correctly."
        });
    }

    const onSubmit = async (data: z.infer<typeof InventoryModificationSchema>) => {
        setIsLoading(true);
    
        try {
            await updateItem(data);
            toast({
                variant: "success",
                title: "Success", 
                description: "Stock items updated succesfully!"
            })
        } catch (error: any) {
            console.log(error)
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

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="item"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Stock item *</FormLabel>
                            <FormControl>
                                <InventorySelector {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Updated quantity *</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Updated stock quantity"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                
                    <FormField
                        control={form.control}
                        name="reason"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Reason *</FormLabel>
                            <Select onValueChange={field.onChange}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select update reason" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Recount">Recount</SelectItem>
                                    <SelectItem value="Damage">Damage</SelectItem>
                                    <SelectItem value="Expired">Expired</SelectItem>
                                    <SelectItem value="Theft">Theft</SelectItem>
                                    <SelectItem value="Internal use">Items used by staff</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                </div>
                <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Any other information regarding this modification"
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
                    <SubmitButton label={"Record stock item modification"} loading={isLoading} />
                </div>
            </form>
        </Form>
        );
    };
  
export default ModifyInventoryForm;