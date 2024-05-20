'use client'

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";
import { TimePicker } from "@/components/ui/time-picker";

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
import { Service } from "@/types";
import { createService, updateService } from "@/lib/actions/service.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button"
import { Textarea } from "@/components/ui/textarea"
import ProductCategorySelector from "@/components/layout/product-category-selector"

    const formSchema = z.object({
        name: z.string(),
        description: z.string().optional(),
        category: z.any(),
        endTime: z.string().optional(),
        startTime: z.string().optional(),
        price: z.number(),
        duration: z.string().optional(),
        status: z.boolean(),
        allowDiscount: z.boolean(),
    });
  
    const ServiceForm = ({ item }: { item?: Service | null }) => {
        const router = useRouter();
        const [isLoading, setIsLoading] = useState(false);
        const { toast } = useToast()

        const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: item ? item : {
                status: false,
                allowDiscount: false,
            },
        });

        const onInvalid = (errors : any ) => {
            console.error("Creating service failed: ", JSON.stringify(errors));
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.", 
                description: "There was an issue submitting your form please try later"
            });
        }

        const onSubmit = async (data: z.infer<typeof formSchema>) => {
            setIsLoading(true);
        
            try {
                if (item) {
                    await updateService(item.$id, data);
                    toast({
                        variant: "default",
                        title: "Success", 
                        description: "Service updated succesfully!"
                    });
                } else {
                    await createService(data);
                    toast({
                        variant: "default",
                        title: "Success", 
                        description: "Service created succesfully!"
                    });
                }
                
                // Redirect to the list page after submission
                router.push("/services");
                router.refresh();
                setIsLoading(false);
            } catch (error) {
                console.error("Creating service failed: ", error);
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.", 
                    description: "There was an issue submitting your form please try later"
                });
                setIsLoading(false);
            }
        };

    return (        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Service name</FormLabel>
                            <FormControl>
                                <Input
                                placeholder="Enter service name"
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
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                                <Input
                                type="number"
                                placeholder="Enter service price"
                                className="input-class"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Service category</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <ProductCategorySelector />
                                        </Select>
                                    </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="allowDiscount"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Allow discount?</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Allow discount on service?" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    <SelectItem value="false">No</SelectItem>
                                    <SelectItem value="true">Yes</SelectItem>
                                    </SelectContent>
                                </Select>
                            <FormMessage />
                            </FormItem>
                            )}
                        />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    
                    <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Offering start time</FormLabel>
                            <FormControl>
                                {/* <TimePicker {...field} /> */}
                                <Input
                                placeholder="Select start time"
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
                    name="endTime"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Offering end time</FormLabel>
                            <FormControl>
                                {/* <TimePicker {...field} /> */}
                                <Input
                                placeholder="Select start time"
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
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Enter service description"
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
                            item ? "Update service" : "Save service"
                        )}
                    </Button> 
                </div>
            </form>
        </Form>
        );
    };
  
export default ServiceForm;