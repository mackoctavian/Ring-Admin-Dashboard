'use client'

import React, { useState, useEffect } from 'react';
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Service, Discount, Category } from "@/types";
import { createService, updateService } from "@/lib/actions/service.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button"
import { Textarea } from "@/components/ui/textarea"
import CategorySelector from "@/components/layout/category-selector"
import DiscountSelector from "../layout/discount-selector"
import TimeSelector from "../layout/time-selector";
import { CategoryType, ServiceSchema } from "@/types/data-schemas"
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
  
const ServiceForm = ({ item }: { item?: Service | null }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast()
    const [selectedDiscount, setSelectedDiscount] = useState<Discount | undefined>(
        item ? item.discount : undefined
    );
    const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(
        item ? item.category : undefined
    );
    
    const form = useForm<z.infer<typeof ServiceSchema>>({
        resolver: zodResolver(ServiceSchema),
        defaultValues: item ? { ...item, discount: item.discount, category: item.category } : {
            allowDiscount: true,
            allowWalkin: true,
            status: true,
        },
    });

    const onInvalid = (errors : any ) => {
        console.error("Creating service failed: ", JSON.stringify(errors));
        toast({
            variant: "warning",
            title: "Uh oh! Something went wrong.", 
            description: "There was an issue submitting your form please try later"
        });
    }

    const onSubmit = async (data: z.infer<typeof ServiceSchema>) => {
        setIsLoading(true);
    
        try {
            if (item) {
                await updateService(item.$id!, data);
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

    useEffect(() => {
        if (item) {
            setSelectedDiscount(item.discount);
        }
    }, [item]);

    useEffect(() => {
        if (item) {
            setSelectedCategory(item.category);
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
                        name="category"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Service category</FormLabel>
                            <CategorySelector 
                            type={CategoryType.SERVICE}
                            value={selectedCategory}
                            onChange={(cat) => { setSelectedCategory(cat); field.onChange(cat); }}
                            />
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
                                            min="1"
                                            placeholder="Enter service price"
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
                        name="allowDiscount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Allow discount at counter *</FormLabel>
                                <Select onValueChange={(value) => field.onChange(value === "true")} defaultValue={String(field.value)}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Enable discounts at counter" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="true">Discounts ALLOWED at counter</SelectItem>
                                        <SelectItem value="false">Discounts NOT allowed at counter</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
               
                    <FormField
                        control={form.control}
                        name="discount"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Service discount</FormLabel>
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
                        name="offeringStartTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Offering start time</FormLabel>
                                <FormControl>
                                    <TimeSelector onChange={field.onChange} value={field.value} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                    <FormField
                        control={form.control}
                        name="offeringEndTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Offering end time</FormLabel>
                                <FormControl>
                                    <TimeSelector {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                    <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Average duration (mins)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="1"
                                            placeholder="Average service duration"
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
                        name="concurrentCustomers"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Maximum concurrent customers</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="1"
                                            placeholder="Maximum customers"
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
                        name="allowWalkin"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Allow walk in's *</FormLabel>
                                <Select onValueChange={(value) => field.onChange(value === "true")} defaultValue={String(field.value)}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Allow customer walk in's" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="true">Walk in ALLOWED</SelectItem>
                                        <SelectItem value="false">Walk in NOT allowed</SelectItem>
                                    </SelectContent>
                                </Select>
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