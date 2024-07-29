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
import { Service, Discount, Category, ServiceInventoryItemUsage, InventoryVariant } from "@/types";
import { createService, getItem, updateService } from "@/lib/actions/service.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button"
import { Textarea } from "@/components/ui/textarea"
import CategorySelector from "@/components/layout/category-selector"
import DiscountSelector from "../layout/discount-selector"
import TimeSelector from "../layout/time-selector";
import { CategoryType, ServiceSchema, ServiceInventoryUsageSchema } from "@/types/data-schemas"
import { Label } from "@/components/ui/label"
import InventorySelector from '../layout/inventory-selector';

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
    const { toast } = useToast();
    const [selectedDiscount, setSelectedDiscount] = useState<Discount | undefined>(
        item ? item.discount : undefined
    );
    const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(
        item ? item.category : undefined
    );

    let defaultService = null; // Default service is null by default

    if (item) {
        defaultService = item; // If editing form, set defaultService to the current item
    }

    const form = useForm<z.infer<typeof ServiceSchema>>({
        resolver: zodResolver(ServiceSchema),
        defaultValues: item ? { ...item, discount: item.discount, category: item.category } : {
            allowDiscount: true,
            allowWalkin: true,
            status: true,
        },
    });

    // const [usageItems, setUsageItems] = useState<ServiceInventoryItemUsage[]>([
    //     ...(form.getValues("inventoryItems") || []),
    //     { item: null, amountUsed: 0, service: defaultService }
    // ]);

    const [usageItems, setUsageItems] = useState<ServiceInventoryItemUsage[]>(form.getValues("inventoryItems") || []);

    useEffect(() => {
        form.setValue('inventoryItems', usageItems);
    }, [usageItems, form]);

    const addUsageItem = () => {
        setUsageItems([...usageItems, { item: null, amountUsed: 0, service: null }]);
    };

    const removeUsageItem = (index: number) => {
        const updatedUsage = [...usageItems];
        updatedUsage.splice(index, 1);
        setUsageItems(updatedUsage);
        form.setValue('inventoryItems', updatedUsage);
    };

    const handleUsageItemChange = (index: number, updatedItem: InventoryVariant) => {
        const updatedUsage = [...usageItems];
        updatedUsage[index] = { ...updatedUsage[index], item: updatedItem };
        setUsageItems(updatedUsage);
        form.setValue('inventoryItems', updatedUsage);
    };

    const handleAmountUsedChange = (index: number, amountUsed: number) => {
        const updatedUsage = [...usageItems];
        updatedUsage[index] = { ...updatedUsage[index], amountUsed };
        setUsageItems(updatedUsage);
        form.setValue('inventoryItems', updatedUsage);
    };

    const onInvalid = (errors: any) => {
        console.error("Error validating: ", JSON.stringify(errors));
        toast({
            variant: "warning",
            title: "Uh oh! Something went wrong.",
            description: "There was an issue submitting your form. Please try later."
        });
    };

    const onSubmit = async (data: z.infer<typeof ServiceSchema>) => {
        setIsLoading(true);

        try {
            if (item) {
                await updateService(item.$id!, data);
                toast({
                    variant: "success",
                    title: "Success",
                    description: "Service updated successfully!"
                });
            } else {
                await createService(data);
                toast({
                    variant: "success",
                    title: "Success",
                    description: "Service created successfully!"
                });
            }

            // Redirect to the list page after submission
            router.push("/services");
            router.refresh();
        } catch (error) {
            console.error("Creating service failed: ", error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was an issue submitting your form. Please try later."
            });
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 2000); 
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
                                <FormLabel>Service category *</FormLabel>
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
                                    <TimeSelector onChange={field.onChange} value={field.value} />
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
                                <FormLabel>Allow walk in&lsquo;s *</FormLabel>
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

                <div className="mb-10">
                    <Label>Inventory usage:</Label>
                    <Separator className='mb-5' />
                    {usageItems.map((usageItem, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                            <FormField
                                control={form.control}
                                name={`inventoryItems.${index}.item`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <InventorySelector
                                                value={usageItem.item}
                                                onChange={(item) => handleUsageItemChange(index, item)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`inventoryItems.${index}.amountUsed`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="any"
                                                min={0}
                                                placeholder="Amount used"
                                                {...field}
                                                onChange={(e) => handleAmountUsedChange(
                                                    index,
                                                    parseFloat(e.target.value) || 0
                                                )}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="button" variant="destructive" size="sm" onClick={() => removeUsageItem(index)}>
                                Remove Item
                            </Button>
                        </div>
                    ))}
                    <Button type="button" onClick={addUsageItem}>Add Usage Item</Button>
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
                            item ? "Update service" : "Save service"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default ServiceForm;