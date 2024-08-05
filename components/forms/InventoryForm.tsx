'use client'

import React, { useState, useMemo, useCallback  } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {Inventory} from "@/types";
import { InventorySchema, UpdateInventorySchema, InventoryStatus } from "@/types/data-schemas";
import { createItem, updateItem } from "@/lib/actions/inventory.actions";
import { useToast } from "@/components/ui/use-toast";
import CancelButton from "../layout/cancel-button";
import { Button } from "@/components/ui/button"
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
import CustomFormField, {FormFieldType} from "@/components/ui/custom-input";
import {PlusCircle} from "lucide-react";

const InventoryForm = ({ item }: { item?: Inventory | null }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const isEditMode = Boolean(item);

  const schema = useMemo(() => isEditMode ? UpdateInventorySchema : InventorySchema, [isEditMode]);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: item || {
      variants: [{}],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const onInvalid = useCallback((errors: any) => {
    toast({
      variant: "warning",
      title: "Uh oh! Something went wrong.",
      description: "There was an issue submitting your form, please try later",
    });
    console.error(JSON.stringify(errors))
  }, [toast]);

  const onSubmit = useCallback(async (data) => {
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
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was an issue submitting your form, please try later",
      });
    } finally {
        setIsLoading(false);
    }
  }, [isEditMode, item, toast]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
        <StockItemDetails control={form.control} />
        <VariantForm
          fields={fields}
          control={form.control}
          append={append}
          remove={remove}
          isEditMode={isEditMode}
        />
        <div className="flex h-5 items-center space-x-4">
          <CancelButton />
          <Separator orientation="vertical" />
          <SubmitButton label={item ? "Update inventory" : "Save inventory"} loading={isLoading} />
        </div>
      </form>
    </Form>
  );
};

const StockItemDetails = ({ control }) => (
  <Card>
    <CardHeader>
      <CardTitle>Stock item details</CardTitle>
      <CardDescription>Details used to identify your stock item</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={control}
              name="title"
              label="Stock item name *"
              placeholder="Enter stock item name"
          />

          <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={control}
              name="packaging"
              label="Stock item packaging *"
              renderSkeleton={(field) => (
                  <PackagingSelector value={field.value} onChange={field.onChange} />
              )}
          />
      </div>
    </CardContent>
  </Card>
);

const VariantForm = ({ fields, control, append, remove, isEditMode }) => (
  <Card>
    <CardHeader>
      <CardTitle>Stock item variants</CardTitle>
      <CardDescription>Variants of the stock item</CardDescription>
    </CardHeader>
    <CardContent>
      {fields.map((field, index) => (
        <VariantField
          key={field.id}
          control={control}
          index={index}
          remove={remove}
          fieldsLength={fields.length}
        />
      ))}
    </CardContent>
    <CardFooter className="justify-center border-t p-4">
      <Button type="button" size="sm" variant="ghost" className="gap-1"
              onClick={() => append({
                  status: InventoryStatus.OUT_OF_STOCK,
                  startingQuantity: 0,
                  fullName: '',
                  unit: '',
                  quantity: 0,
                  value: 0
              })}>
          <PlusCircle className="h-3.5 w-3.5"/>
          Add stock variant
      </Button>
    </CardFooter>
  </Card>
);

const VariantField = ({ control, index, remove, fieldsLength }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-md">
        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={control}
            name={`variants.${index}.name`}
            label="Variant name *"
            placeholder="Stock item variant name"
        />

          <FormField
            control={control}
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

        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={control}
            name={`variants.${index}.startingQuantity`}
            label="Starting stock quantity *"
            placeholder="Enter starting stock quantity *"
            type="number"
        />

        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={control}
            name={`variants.${index}.startingValue`}
            label="Starting stock value *"
            placeholder="Enter starting stock value"
            type="number"
        />

        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={control}
            name={`variants.${index}.lowQuantity`}
            label="Low quantity stock level (for alerts) *"
            placeholder="Enter low quantity stock level"
            type="number"
        />

        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={control}
            name={`variants.${index}.itemsPerPackage`}
            label="Number of items per package *"
            placeholder="Number of items in package"
            type="number"
        />

        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={control}
            name={`variants.${index}.volume`}
            label="Volume of single item in package"
            placeholder="Volume of item in package"
            type="number"
        />

        <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={control}
            name={`variants.${index}.unit`}
            label="Unit volume per item"
            renderSkeleton={(field) => (
                <UnitSelector value={field.value} onChange={field.onChange} />
            )}
        />

        <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={control}
            name={`variants.${index}.barcodeId`}
            label="Barcode id"
            placeholder="Enter variant barcode"
        />

        <Button
            variant="destructive"
            type="button"
            className='mt-8'
            onClick={() => fieldsLength > 1 && remove(index)}
            disabled={fieldsLength === 1}>
                Remove variant
        </Button>
    </div>
    <Separator className="my-10" />
  </>
);

export default InventoryForm;
