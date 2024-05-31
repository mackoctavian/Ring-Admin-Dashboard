'use client'

import React, { useEffect, useState } from 'react';
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductUnit } from "@/types";
import { InventorySchema, InventoryStatus } from "@/types/data-schemas";
import { createItem, updateItem } from "@/lib/actions/inventory.actions";
import { useToast } from "@/components/ui/use-toast";
import CancelButton from "../layout/cancel-button";
import { capitalizeFirstLetter } from "@/lib/utils"
import UnitSelector from "../layout/unit-selector";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const InventoryForm = ({ item, units }: { item?: ProductUnit, units: ProductUnit[] }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const isEditMode = Boolean(item);

  const form = useForm<z.infer<typeof InventorySchema>>({
    resolver: zodResolver(InventorySchema),
    defaultValues: item
      ? item
      : {
          variants: [{ 
            quantity: 0, 
            startingQuantity: 0, 
            lowQuantity: 1, 
            status: InventoryStatus.OUT_OF_STOCK, 
            fullName: '', // Add fullName to the default values
          }],
        },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const onInvalid = (errors: any) => {
    toast({
      variant: "warning",
      title: "Uh oh! Something went wrong.",
      description: "There was an issue submitting your form please try later",
    });
    console.error("Creating inventory failed: ", JSON.stringify(errors));
  };

  const onSubmit = async (data: z.infer<typeof InventorySchema>) => {
    setIsLoading(true);

    try {
      // Update the status, full name, and quantity of each variant based on the form values
      data.variants = data.variants.map(variant => {
        if (variant.startingQuantity === 0) {
          variant.status = InventoryStatus.OUT_OF_STOCK;
        } else if (variant.startingQuantity <= variant.lowQuantity) {
          variant.status = InventoryStatus.LOW_STOCK;
        } else {
          variant.status = InventoryStatus.IN_STOCK;
        }

        variant.fullName = capitalizeFirstLetter(`${data.title} ${data.unit?.name ?? ''} ${variant.name ?? ''}`.trim());
        variant.quantity = variant.startingQuantity; // Set quantity to startingQuantity

        return variant;
      });

      if (isEditMode && item?.$id) {
        await updateItem(item.$id, data);
        toast({
          variant: "success",
          title: "Success",
          description: "Inventory item updated successfully!",
        });
      } else {
        await createItem(data);
        toast({
          variant: "success",
          title: "Success",
          description: "Inventory item created successfully!",
        });
      }

      router.push("/inventory");
      router.refresh();
      setIsLoading(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message || "There was an issue submitting your form, please try later",
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  // Update variant status, full name, and quantity whenever startingQuantity, lowQuantity, or unit changes
  useEffect(() => {
    fields.forEach((field, index) => {
      const startingQuantity = form.watch(`variants.${index}.startingQuantity`);
      const lowQuantity = form.watch(`variants.${index}.lowQuantity`);
      const variantName = form.watch(`variants.${index}.name`);
      const itemName = form.watch(`title`);
      const itemUnit = form.watch(`unit`);

      let status;
      if (startingQuantity === 0) {
        status = InventoryStatus.OUT_OF_STOCK;
      } else if (startingQuantity <= lowQuantity) {
        status = InventoryStatus.LOW_STOCK;
      } else {
        status = InventoryStatus.IN_STOCK;
      }

      const fullName = `${itemName} ${itemUnit?.name ?? ''} ${variantName ?? ''}`.trim();

      if (status !== field.status || fullName !== field.fullName || startingQuantity !== field.quantity) {
        update(index, { ...field, status, fullName, quantity: startingQuantity });
      }
    });
  }, [fields, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inventory item name</FormLabel>
                  <FormControl>
                    <Input placeholder="Inventory item name" className="input-class" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <UnitSelector
                    value={field.value}
                    units={units}
                    onChange={(unit) => field.onChange(unit)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 border p-4 rounded-md">
            <FormField
              control={form.control}
              name={`variants.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant name</FormLabel>
                  <FormControl>
                    <Input placeholder="Variant name" className="input-class" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`variants.${index}.startingQuantity`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Starting quantity</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" placeholder="Starting quantity" className="input-class" {...field} readOnly={isEditMode} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`variants.${index}.lowQuantity`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Low quantity level</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" placeholder="Low quantity level" className="input-class" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`variants.${index}.itemsPerUnit`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Items per unit</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" placeholder="Items per unit" className="input-class" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`variants.${index}.image`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input type='file' placeholder="Variant image" className="input-class" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`variants.${index}.barcodeId`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bar code id</FormLabel>
                  <FormControl>
                    <Input placeholder="Variant barcode" className="input-class" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              variant="destructive"
              type="button"
              onClick={() => fields.length > 1 && remove(index)}
              disabled={fields.length === 1}>
              Remove Item
            </Button>
          </div>
        ))}

        <Button type="button" onClick={() => append({ 
          name: '',
          quantity: 0, 
          startingQuantity: 0, 
          lowQuantity: 1, 
          status: InventoryStatus.OUT_OF_STOCK, 
          fullName: '', 
        })}>
          Add Item
        </Button>

        <div className="flex h-5 items-center space-x-4">
          <CancelButton />

          <Separator orientation="vertical" />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> &nbsp; Processing...
              </>
            ) : (
              item ? "Update inventory" : "Save inventory"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InventoryForm;