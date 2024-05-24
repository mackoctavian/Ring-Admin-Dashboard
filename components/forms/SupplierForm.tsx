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

const SupplierForm = ({ item }: { item?: Supplier | null }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast()

    const form = useForm<z.infer<typeof SupplierSchema>>({
        resolver: zodResolver(SupplierSchema),
        defaultValues: item ? item : {
            status: false,
        },
    });

    const onInvalid = (errors : any ) => {
        console.error("Creating vendor failed: ", JSON.stringify(errors));
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.", 
            description: "There was an issue submitting your form please try later"
        });
    }

    const onSubmit = async (data: z.infer<typeof SupplierSchema>) => {
        setIsLoading(true);
    
        try {
            if (item) {
                await updateItem(item.$id, data);
                toast({
                    variant: "default",
                    title: "Success", 
                    description: "Supplier details updated succesfully!"
                });
            } else {
                await createItem(data);
                toast({
                    variant: "default",
                    title: "Success", 
                    description: "Supplier details created succesfully!"
                });
            }
            
            // Redirect to the list page after submission
            router.push("/suppliers");
            router.refresh();
            setIsLoading(false);
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Business name</FormLabel>
                        <FormControl>
                            <Input
                            placeholder="Enter business name"
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
                name="contactPersonName"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Contact person</FormLabel>
                        <FormControl>
                            <Input
                            placeholder="Enter contact person's full name"
                            className="input-class"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Supplier email address</FormLabel>
                        <FormControl>
                            <Input
                            type="email"
                            placeholder="Enter supplier's email address"
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
                name="phoneNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Supplier phone number</FormLabel>
                        <FormControl>
                            <Input
                            type="tel"
                            placeholder="Enter supplier's phone number"
                            className="input-class"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>

                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Supplier address</FormLabel>
                            <FormControl>
                                <Input
                                placeholder="Enter supplier's address"
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
        

            <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Status</FormLabel>
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

    
            <div className="flex h-5 items-center space-x-4">
                <CancelButton />
            
                <Separator orientation="vertical" />

                <Button type="submit">
                    {isLoading ? (
                        <>
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> &nbsp; Processing...
                        </>
                        ) : (
                        item ? "Update supplier" : "Save supplier"
                    )}
                </Button> 
            </div>
        </form>
    </Form>
    );
};
  
export default SupplierForm;