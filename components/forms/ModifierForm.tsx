'use client'

import * as z from "zod";
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch"
import { useForm, useFieldArray } from "react-hook-form";
import { Separator } from "@/components/ui/separator"
import {Modifier} from "@/types"
import { createItem, updateItem } from "@/lib/actions/modifier.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button"
import {ModifierSchema, ModifierType, POSItemStatus} from "@/types/data-schemas"
import InventorySelector from "@/components/layout/inventory-selector"
import UnitSelector from "@/components/layout/unit-selector"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import { SubmitButton } from "../ui/submit-button";
import {SelectItem,} from "@/components/ui/select"
import { Button } from "../ui/button";
import {PlusCircle} from "lucide-react";
import CustomFormField, {FormFieldType} from "@/components/ui/custom-input";
import Spacer from "@/components/ui/Spacer";
import CurrencySelector from "@/components/layout/currency-selector";

const ModifierForm = ({ modifier }: { modifier?: Modifier }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof ModifierSchema>>({
        resolver: zodResolver(ModifierSchema),
        defaultValues: modifier ? modifier : {
            status: POSItemStatus.DRAFT,
            allowMultiple: false,
            optional: true,
            currency: "TZS",
            modifierItems: [
                { price: 0, inventoryItem: undefined, quantity: 0, unit: null }
            ]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "modifierItems",
    });

    const onInvalid = (errors: any) => {
        toast({
            variant: "warning",
            title: "Data validation failed!",
            description: "Please make sure all the fields marked with * are filled correctly."
        });
    };

    const onSubmit = async (values: z.infer<typeof ModifierSchema>) => {
        setIsLoading(true);

        try {
            const modifierData = {
                name: values.name,
                type: values.type,
                status: values.status,
                allowMultiple: values.allowMultiple,
                optional: values.optional,
                currency: values.currency,
                modifierItems: values.modifierItems.map(item => ({
                    name: item.name,
                    price: item.price,
                    inventoryItem: item.inventoryItem || undefined,
                    quantity: item.quantity,
                    unit: item.unit
                }))
            };

            if (modifier && modifier.$id) {
                await updateItem(modifier.$id, modifierData);
                toast({
                    variant: "success",
                    title: "Success",
                    description: "Modifier details updated successfully!"
                });
            } else {
                await createItem(modifierData);
                toast({
                    variant: "success",
                    title: "Success",
                    description: "Modifier created successfully!"
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error saving modifier",
                description: error instanceof Error ? error.message : "An unexpected error occurred",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
                <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                    {/* Left Column */}
                    <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Modifier details</CardTitle>
                                <CardDescription>
                                    Details used to identify your modifier item
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    <CustomFormField
                                        fieldType={FormFieldType.INPUT}
                                        control={form.control}
                                        name="name"
                                        label="Modifier title *"
                                        placeholder="Modifier title ( eg. Extra milk )"
                                    />
                                    <CustomFormField
                                        fieldType={FormFieldType.SELECT}
                                        control={form.control}
                                        name="type"
                                        label="Modifier type *"
                                        placeholder="Select modifier type">
                                        <SelectItem value={ModifierType.LIST}>
                                            Choose an option from a list of modifiers
                                        </SelectItem>
                                        <SelectItem disabled value={ModifierType.TEXT}>
                                            Modify item by typing into a text box
                                        </SelectItem>
                                    </CustomFormField>

                                    <CustomFormField
                                        fieldType={FormFieldType.SKELETON}
                                        control={form.control}
                                        name="currency"
                                        label="Currency *"
                                        renderSkeleton={(field) => (
                                            <CurrencySelector value={field.value} onChange={field.onChange}/>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Modifier items</CardTitle>
                                <CardDescription>
                                    Items in the modifier
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {fields.map((field, index) => (
                                    <div key={field.id}
                                         className="grid grid-cols-1 lg:grid-cols-3 gap-4 rounded-md mb-4">
                                        <CustomFormField
                                            fieldType={FormFieldType.INPUT}
                                            control={form.control}
                                            name={`modifierItems.${index}.name`}
                                            label="Modifier item name *"
                                            placeholder="Modifier item name eg. ( Low fat milk )"
                                        />
                                        <CustomFormField
                                            fieldType={FormFieldType.INPUT}
                                            control={form.control}
                                            name={`modifierItems.${index}.price`}
                                            label="Modifier item price *"
                                            placeholder="Modifier item price"
                                            type="number"
                                        />

                                        <CustomFormField
                                            fieldType={FormFieldType.SKELETON}
                                            control={form.control}
                                            name={`modifierItems.${index}.inventoryItem`}
                                            label="Stock item"
                                            renderSkeleton={(field) => (
                                                <InventorySelector value={field.value} onChange={field.onChange}/>
                                            )}
                                        />
                                        <CustomFormField
                                            fieldType={FormFieldType.INPUT}
                                            control={form.control}
                                            name={`modifierItems.${index}.quantity`}
                                            type="number"
                                            label="Stock item quantity used"
                                            placeholder="Quantity of stock item used per sale"
                                        />
                                        <CustomFormField
                                            fieldType={FormFieldType.SKELETON}
                                            control={form.control}
                                            name={`modifierItems.${index}.unit`}
                                            label="Stock quantity unit"
                                            renderSkeleton={(field) => (
                                                <UnitSelector value={field.value} onChange={field.onChange}/>
                                            )}
                                        />
                                        <Button
                                            variant="destructive"
                                            type="button"
                                            className="mt-8"
                                            onClick={() => fields.length > 1 && remove(index)}
                                            disabled={fields.length === 1}>
                                            Remove Item
                                        </Button>

                                        <Spacer axis='vertical' size={32} />
                                    </div>
                                ))}
                            </CardContent>
                            <CardFooter className="justify-center border-t p-4">
                                <Button type="button" size="sm" variant="ghost" className="gap-1"
                                        onClick={() => append({
                                            name: '',
                                            quantity: 0,
                                            price: 0,
                                            inventoryItem: undefined
                                        })}>
                                    <PlusCircle className="h-3.5 w-3.5"/>
                                    Add modifier item
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                    {/* Right Column */}
                    <div className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Modifier options</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="allowMultiple"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Allow multiple items? *</FormLabel>
                                                <FormDescription>Only one item on the modifier can be
                                                    selected</FormDescription>
                                                <FormControl>
                                                    <div className="mt-2">
                                                        <Switch
                                                            id="allowMultiple"
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </div>
                                                </FormControl>

                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="optional"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Is the modifier optional ? *</FormLabel>
                                                <FormDescription>Customers will be required to make a selection. The
                                                    first modifier in your set will be the default
                                                    selection.</FormDescription>
                                                <FormControl>
                                                    <div className="mt-2">
                                                        <Switch
                                                            id="optional"
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage/>

                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Modifier status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CustomFormField
                                    fieldType={FormFieldType.SELECT}
                                    control={form.control}
                                    name="status"
                                    label="Modifier status *"
                                    placeholder="Select modifier status">
                                    <SelectItem value={POSItemStatus.DRAFT}>{POSItemStatus.DRAFT}</SelectItem>
                                    <SelectItem value={POSItemStatus.ACTIVE}>{POSItemStatus.ACTIVE}</SelectItem>
                                    <SelectItem value={POSItemStatus.ARCHIVED}>{POSItemStatus.ARCHIVED}</SelectItem>
                                </CustomFormField>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div className="flex h-5 items-center space-x-4">
                    <CancelButton/>
                    <Separator orientation="vertical"/>
                    <SubmitButton loading={isLoading} label={modifier ? "Update modifier" : "Save modifier"}/>
                </div>
            </form>
        </Form>
    );
};

export default ModifierForm;