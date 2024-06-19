'use client'

import React, { useEffect, useState } from 'react';
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ProductUnit } from "@/types";
import { InventorySchema, UpdateInventorySchema, InventoryStatus } from "@/types/data-schemas";
import { createItem, updateItem } from "@/lib/actions/inventory.actions";
import { useToast } from "@/components/ui/use-toast";
import CancelButton from "../layout/cancel-button";
import { Button } from "@/components/ui/button"
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
import PackagingSelector from '../layout/packaging-selector';
import { SubmitButton } from '../ui/submit-button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


const InventoryForm = ({ item, units }: { item?: ProductUnit, units: ProductUnit[] }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const isEditMode = Boolean(item);

  const schema = isEditMode ? UpdateInventorySchema : InventorySchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: item
      ? item
      : {
          variants: [{ 
            status: InventoryStatus.OUT_OF_STOCK, 
            fullName: '',
            unit: '',
            quantity: 0,
            value: 0,
          }],
        },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const onInvalid = (errors: any) => {
    console.log("Validation errors", errors);
    toast({
      variant: "warning",
      title: "Uh oh! Something went wrong.",
      description: "There was an issue submitting your form please try later",
    });
  };

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsLoading(true);

    try {
      if (isEditMode && item?.$id) {

        await updateItem(item.$id, data);
        toast({
          variant: "success",
          title: "Success",
          description: "Stock item updated successfully!",
        });
      } else {
        await createItem(data);
        toast({
          variant: "success",
          title: "Success",
          description: "Stock item created successfully!",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was an issue submitting your form, please try later",
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">


        <Card>
          <CardHeader>
            <CardTitle>Stock item details</CardTitle>
            <CardDescription>
              Details used to identify your stock item
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock item name</FormLabel>
                    <FormControl>
                      <Input placeholder="Stock item name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="packaging"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Packaging</FormLabel>
                    <PackagingSelector {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle>Stock item variants</CardTitle>
            <CardDescription>
              Variants of the stock item
            </CardDescription>
          </CardHeader>
          <CardContent>
            {fields.map((field, index) => (
              <>
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 pt-4 bo-rder  roun-ded-md">
                  <FormField
                    control={form.control}
                    name={`variants.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Variant name</FormLabel>
                        <FormControl>
                          <Input placeholder="Stock variant name" {...field} />
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
                          <Input type='file' placeholder="Variant image" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`variants.${index}.startingQuantity`}
                    disabled={isEditMode}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Starting quantity</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" placeholder="Starting quantity" {...field} readOnly={isEditMode} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`variants.${index}.startingValue`}
                    disabled={isEditMode}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Starting stock value</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" placeholder="Starting stock value" {...field} readOnly={isEditMode} />
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
                          <Input type="number" min="1" placeholder="Low quantity level" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`variants.${index}.itemsPerPackage`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Items in package</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" placeholder="Items in package" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`variants.${index}.volume`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit volume</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="Unit volume" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`variants.${index}.unit`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit per item</FormLabel>
                        <FormControl>
                          <UnitSelector {...field} />
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
                          <Input placeholder="Variant barcode" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    variant="destructive"
                    type="button"
                    className='mt-8'
                    onClick={() => fields.length > 1 && remove(index)}
                    disabled={fields.length === 1}>
                    Remove variant
                  </Button>
                </div>

                <Separator className="my-10" />
                </>
              ))}
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="button" onClick={() => append({
                status: InventoryStatus.OUT_OF_STOCK,
                startingQuantity: 0,
                fullName: '',
                unit: '',
                quantity: 0,
                value: 0
              })}>
                Add Variant
            </Button>
          </CardFooter>
        </Card>


        <div className="flex h-5 items-center space-x-4">
          <CancelButton />
          <Separator orientation="vertical" />
          <SubmitButton label={item ? "Update inventory" : "Save inventory"} loading={isLoading} />
        </div>
      </form>
    </Form>
  );
};

export default InventoryForm;