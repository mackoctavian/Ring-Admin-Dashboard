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
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input";
import { Discount } from "@/types";
import { createItem, updateItem } from "@/lib/actions/discount.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button";
import React, { useEffect } from 'react';
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "@radix-ui/react-icons"
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
    
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { DiscountSchema, DiscountType } from "@/types/data-schemas";
    
    const DiscountForm = ({ item }: { item?: Discount | null }) => {
        const router = useRouter();
        const [isLoading, setIsLoading] = useState(false)
        const { toast } = useToast()

        const form = useForm<z.infer<typeof DiscountSchema>>({
            resolver: zodResolver(DiscountSchema),
            defaultValues: item ? item : {
            type: DiscountType.PERCENTAGE,
            status: false,
            },
        });

        const onInvalid = (errors : any ) => {
            toast({
                variant: "warning",
                title: "Uh oh! Something went wrong.", 
                description: "There was an issue submitting your form please try later"
            });
            console.error(JSON.stringify(errors))
        }
        
    const onSubmit = async (data: z.infer<typeof DiscountSchema>) => {
        setIsLoading(true);
    
        try {
            if (item) {
                await updateItem(item.$id, data);
                toast({
                    variant: "default",
                    title: "Success", 
                    description: "Discount updated succesfully!"
                });
            } else {
                await createItem(data);
                toast({
                    variant: "default",
                    title: "Success", 
                    description: "Discount created succesfully!"
                });
            }
            
            // Redirect to the list page after submission
            router.push("/discounts");
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
                            <FormLabel>Discount name</FormLabel>
                            <FormControl>
                                <Input
                                placeholder="Discount name (eg. Easter season discount)"
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
                        name="code"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Discount code</FormLabel>
                            <FormControl>
                                <Input
                                placeholder="Discount code (eg. DSC001)"
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
                            <FormLabel>Discount type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select discount type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value={DiscountType.PERCENTAGE}>Percentage</SelectItem>
                                    <SelectItem value={DiscountType.AMOUNT}>Amount</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Discount value</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Discount value"
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
                        name="redemptionStartDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col mt-2">
                                <FormLabel>Redemption start date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant={"outline"} className={cn( "font-normal", !field.value && "text-muted-foreground" )}>
                                            {field.value ? ( format(field.value, "PPP") ) : (
                                                <span>Select redemption start date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={ (date) => date < new Date() }
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="redemptionEndDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col mt-2">
                                <FormLabel>Redemption end date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant={"outline"} className={cn( "font-normal", !field.value && "text-muted-foreground" )}>
                                            {field.value ? ( format(field.value, "PPP") ) : (
                                                <span>Select redemption end date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={ (date) => date < new Date() }
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="redemptionLimit"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Redemption limit</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Maximum number of redemptions"
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
                        <FormLabel>Discount description</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Short description of the discount"
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
                            item ? "Update discount" : "Create discount"
                        )}
                    </Button> 
                </div>
            </form>
        </Form>
        );
    };
  
export default DiscountForm;