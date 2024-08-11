'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "@/components/ui/separator"
import {Form} from "@/components/ui/form";
import {SelectItem} from "@/components/ui/select"
import { modifyStockItem } from "@/lib/actions/inventory.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button";
import { SubmitButton } from "../ui/submit-button";
import { InventoryModificationSchema } from "@/types/data-schemas"
import InventorySelector from "@/components/layout/inventory-selector"
import CustomFormField, {FormFieldType} from "@/components/ui/custom-input";

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

        const inventoryData = {
            item: data.item,
            quantity: data.quantity,
            value: data.value,
            reason: data.reason,
            notes: data.notes,
        };

        try {
            //@ts-ignore
            await modifyStockItem(inventoryData);
            toast({
                variant: "success",
                title: "Success", 
                description: "Stock items updated successfully!"
            })
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.", 
                description: "There was an issue submitting your form, please try later"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                    <CustomFormField
                        fieldType={FormFieldType.SKELETON}
                        control={form.control}
                        name="item"
                        label="Stock item *"
                        renderSkeleton={(field) => (
                            <InventorySelector value={field.value} onChange={field.onChange} />
                        )}
                    />

                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="quantity"
                        label="Updated stock quantity *"
                        placeholder="Updated stock quantity"
                        type="number"
                    />

                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="value"
                        label="Updated stock value *"
                        placeholder="Updated stock value"
                        type="number"
                    />

                    <CustomFormField
                        fieldType={FormFieldType.SELECT}
                        control={form.control}
                        name="reason"
                        label="Stock update reason *"
                        placeholder="Select stock update reason">
                            <SelectItem key="Recount" value="Recount">Recount</SelectItem>
                            <SelectItem key="Damage" value="Damage">Damage</SelectItem>
                            <SelectItem key="Expired" value="Expired">Expired</SelectItem>
                            <SelectItem key="Theft" value="Theft">Theft</SelectItem>
                            <SelectItem key="Internal use" value="Internal use">Items used by staff</SelectItem>
                    </CustomFormField>
                </div>

                <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="notes"
                    label="Notes"
                    placeholder="Any other information regarding this modification"
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