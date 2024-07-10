'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Supplier } from "@/types";
import { createItem, updateItem } from "@/lib/actions/supplier.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button";
import { Textarea } from "@/components/ui/textarea"
import { SupplierSchema } from "@/types/data-schemas";
import BranchSelector from "../layout/branch-multiselector";
import { SubmitButton } from "@/components/ui/submit-button"

const SupplierForm = ({ item }: { item?: Supplier | null }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast()

    const form = useForm<z.infer<typeof SupplierSchema>>({
        resolver: zodResolver(SupplierSchema),
        defaultValues: item ? item : {
            status: false,
            description: '', //Required to avoid undefined error
        },
    });

    const onInvalid = (errors : any ) => {
        toast({
            variant: "warning",
            title: "Data validation failed!", 
            description: "Please make sure all the fields marked with * are filled correctly."
        });
    }

    const onSubmit = async (data: z.infer<typeof SupplierSchema>) => {
        setIsLoading(true);
    
        try {
            if (item) {
                await updateItem(item.$id!, data);
                toast({
                    variant: "success",
                    title: "Success", 
                    description: "You have succesfully updated the supplier details!"
                });
            } else {
                await createItem(data);
                toast({
                    variant: "success",
                    title: "Success", 
                    description: "Supplier created succesfully"
                });
            }
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Business name *</FormLabel>
                        <FormControl>
                            <Input
                            placeholder="Enter business name"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                control={form.control}
                name="contactPersonName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Contact person *</FormLabel>
                        <FormControl>
                            <Input
                            placeholder="Enter contact person's full name"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Phone number *</FormLabel>
                        <FormControl>
                            <Input
                            type="tel"
                            placeholder="Enter supplier's phone number"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email address</FormLabel>
                        <FormControl>
                            <Input
                            type="email"
                            placeholder="Enter supplier's email address"
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
                                <BranchSelector {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                />

                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input
                                placeholder="Enter supplier's address"
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
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder="Short notes about the supplier"
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
                <SubmitButton label={item ? "Update supplier" : "Save supplier"} loading={isLoading} />
            </div>
        </form>
    </Form>
    );
};
  
export default SupplierForm;