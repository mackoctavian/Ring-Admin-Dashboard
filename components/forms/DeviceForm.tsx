'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "@/components/ui/separator"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Device } from "@/types";
import { createItem, updateItem } from "@/lib/actions/device.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button";
import { Textarea } from "@/components/ui/textarea"
import { DeviceSchema } from "@/types/data-schemas";
import BranchSelector from "../layout/branch-selector";
import { SubmitButton } from "@/components/ui/submit-button"

const DeviceForm = ({ item }: { item?: Device | null }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast()

    const form = useForm<z.infer<typeof DeviceSchema>>({
        resolver: zodResolver(DeviceSchema),
        defaultValues: item ? item : {
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
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Device name *</FormLabel>
                        <FormControl>
                            <Input
                            placeholder="Enter a device name ( identifier )"
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
                                placeholder="Select branch"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Activation code *</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Enter device activation code"
                                    {...field}
                                    disabled={item}
                                    />
                            </FormControl>
                            <FormDescription>
                                Enter code shown on your device
                            </FormDescription>
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
                                    disabled={!item}
                                />
                            </div>
                        </FormControl>
                        <FormDescription>
                            Device status will update once connected
                        </FormDescription>
                    </FormItem>
                )}
            />
            </div>
    
            <div className="flex h-5 items-center space-x-4">
                <CancelButton />
                <Separator orientation="vertical" />
                <SubmitButton label={item ? "Update device details" : "Register device"} loading={isLoading} />
            </div>
        </form>
    </Form>
    );
};
  
export default DeviceForm;