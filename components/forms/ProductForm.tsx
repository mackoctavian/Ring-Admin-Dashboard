'use client'

import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch"
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons"
import { PlusCircle } from "lucide-react"
import { useForm} from 'react-hook-form';
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";
import {Product, ProductVariant} from "@/types";
import { createItem, updateItem } from "@/lib/actions/product.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button";
import ModifierSelector from "../layout/modifier-multiselector";
import {ProductSchema, POSItemStatus} from "@/types/data-schemas"
import CategorySelector from "@/components/layout/category-multiselector"
import InventorySelector from "@/components/layout/inventory-selector"
import {
    Form,
    FormControl
} from "@/components/ui/form";
import {SelectItem} from "@/components/ui/select"
import { SubmitButton } from '../ui/submit-button';
import UnitSelector from '../layout/unit-selector';
import BranchSelector from '../layout/branch-multiselector';
import DepartmentSelector from '../layout/department-multiselector';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import CustomFormField, {FormFieldType} from "@/components/ui/custom-input";
import {FileUploader} from "@/components/ui/custom-file-uploader";

const ProductForm = ({ item }: { item?: Product | null }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast()

  console.log(item);

  const form = useForm({
    resolver: zodResolver(ProductSchema),
    defaultValues: item ? { ...item, description: ''}: {}
  });

  const { handleSubmit, setValue, getValues } = form;

  const onInvalid = (errors: any) => {
    console.log(errors)
    toast({
      variant: 'warning',
      title: 'Uh oh! Something went wrong.',
      description: 'There was an issue submitting your form, please try later',
    });
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      if (item) {
        await updateItem(item.$id, data);
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Product details updated successfully!',
        });
      } else {
        await createItem(data);
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Product added successfully!',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was an issue submitting your form, please try later',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [variants, setVariants] = useState<ProductVariant[]>(
    item ? item.variants : [{
      status: false,
      inventoryItems: []
    }]
  );

  useEffect(() => {
    if (item) {
      setValue('variants', item.variants);
      setVariants(item.variants);
    }
  }, [item, setValue]);

  const handleAddVariant = () => {
    const newVariant = { name: '', price: '', tax: '', allowDiscount: false, status: false, inventoryItems: [] };
    setVariants([...variants, newVariant]);
    setValue('variants', [...getValues('variants'), newVariant]);
  };

  const handleAddInventory = (variantIndex: number) => {
    const newInventoryItem = { $id: uuidv4() }; // Replace with your own method to generate unique ids
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].inventoryItems.push(newInventoryItem);
    setVariants(updatedVariants);
    setValue(`variants[${variantIndex}].inventoryItems`, updatedVariants[variantIndex].inventoryItems);
  };

  const handleRemoveInventory = (variantIndex: number, inventoryItemIndex: number) => {
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].inventoryItems.splice(inventoryItemIndex, 1);
    setVariants(updatedVariants);
    setValue(`variants[${variantIndex}].inventoryItems`, updatedVariants[variantIndex].inventoryItems);
  };

  const handleRemoveVariant = (variantIndex: number) => {
    if (variants.length > 1) {
      const updatedVariants = [...variants];
      updatedVariants.splice(variantIndex, 1);
      setVariants(updatedVariants);
      setValue('variants', updatedVariants);
    } else {
      toast({
        variant: 'warning',
        title: 'Cannot remove variant',
        description: 'Product must have at least one variant.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8">
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          {/* Left Column */}
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Product details</CardTitle>
                <CardDescription>
                  Details used to identify your product
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      control={form.control}
                      name={`name`}
                      label="Product name *"
                      placeholder="Enter product name"
                  />

                  <CustomFormField
                      fieldType={FormFieldType.CUSTOM_SELECTOR}
                      control={form.control}
                      name={`category`}
                      label="Product category *"
                      renderSkeleton={(field) => (
                          <CategorySelector value={field.value} onChange={field.onChange}/>
                      )}
                  />
                </div>

                <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name={`description`}
                    label="Product description"
                    placeholder="Enter product description"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product variants</CardTitle>
                <CardDescription>
                  Manage variants for this product
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {variants.map((variant, variantIndex) => (
                      <div key={variant.$id} className="border p-4 rounded-md">
                        <div className="flex justify-between items-center">
                          {variants.length > 1 && (
                              <Button type="button" onClick={() => handleRemoveVariant(variantIndex)} variant="link" className="ml-auto">
                                <Cross2Icon className="mr-2 h-4 w-4"/> Archive variant
                              </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <CustomFormField
                              fieldType={FormFieldType.INPUT}
                              control={form.control}
                              name={`variants[${variantIndex}].name`}
                              label="Product variant name *"
                              placeholder="Enter variant name"
                          />

                          <CustomFormField
                              fieldType={FormFieldType.INPUT}
                              control={form.control}
                              name={`variants[${variantIndex}].price`}
                              label="Product variant price *"
                              placeholder="Enter variant price"
                              type="number"
                          />

                          <CustomFormField
                              fieldType={FormFieldType.INPUT}
                              control={form.control}
                              name={`variants[${variantIndex}].tax`}
                              label="Product variant tax *"
                              placeholder="Enter variant tax amount"
                              type="number"
                          />

                          <CustomFormField
                              fieldType={FormFieldType.INPUT}
                              control={form.control}
                              name={`variants[${variantIndex}].barcode`}
                              label="Product variant barcode"
                              placeholder="Enter variant barcode"
                          />

                          <CustomFormField
                              fieldType={FormFieldType.SKELETON}
                              control={form.control}
                              name={`variants[${variantIndex}].status`}
                              label="Status *"
                              renderSkeleton={(field) => (
                                  <div className="mt-2">
                                    <Switch
                                        id={`variant-status-${variant.$id}`}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                  </div>
                              )}
                          />
                        </div>
                        <div className="space-y-2">
                          {variant.inventoryItems.map((inv, inventoryIndex) => (
                              <div key={inv.$id} className="space-y-2 p-2 rounded-md">
                                <Separator className="my-7"/>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                                  <CustomFormField
                                      fieldType={FormFieldType.CUSTOM_SELECTOR}
                                      control={form.control}
                                      name={`variants[${variantIndex}].inventoryItems[${inventoryIndex}].item`}
                                      label="Stock item *"
                                      renderSkeleton={(field) => (
                                          <InventorySelector value={field.value} onChange={field.onChange}/>
                                      )}
                                  />

                                  <CustomFormField
                                      fieldType={FormFieldType.INPUT}
                                      control={form.control}
                                      name={`variants[${variantIndex}].inventoryItems[${inventoryIndex}].amountUsed`}
                                      label="Quantity used *"
                                      placeholder="Enter quantity used per sale"
                                      type="number"
                                  />

                                  <CustomFormField
                                      fieldType={FormFieldType.CUSTOM_SELECTOR}
                                      control={form.control}
                                      name={`variants[${variantIndex}].inventoryItems[${inventoryIndex}].unit`}
                                      label="Unit of item usage *"
                                      renderSkeleton={(field) => (
                                          <UnitSelector value={field.value} onChange={field.onChange}/>
                                      )}
                                  />

                                  <Button type="button" className='mt-8' onClick={() => handleRemoveInventory(variantIndex, inv.$id)} variant='destructive'>
                                    Stop tracking
                                  </Button>
                                </div>
                              </div>
                          ))}
                          <Button type="button" onClick={() => handleAddInventory(variantIndex)} variant="link">
                            <PlusIcon className="mr-2 h-4 w-4"/> Track stock usage
                          </Button>
                        </div>
                      </div>
                  ))}
                </div>
                <CardFooter className="justify-center p-1">
                  <Button type="button" variant="ghost" className="gap-1" onClick={handleAddVariant}>
                    <PlusCircle className="h-3.5 w-3.5"/>
                    Add Variant
                  </Button>
                </CardFooter>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Product status</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="posStatus"
                    label="Status *"
                    placeholder="Select product status">
                  <SelectItem value={POSItemStatus.DRAFT}>{POSItemStatus.DRAFT}</SelectItem>
                  <SelectItem value={POSItemStatus.ACTIVE}>{POSItemStatus.ACTIVE}</SelectItem>
                  <SelectItem value={POSItemStatus.ARCHIVED}>{POSItemStatus.ARCHIVED}</SelectItem>
                </CustomFormField>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Product availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <CustomFormField
                      fieldType={FormFieldType.CUSTOM_SELECTOR}
                      control={form.control}
                      name="branch"
                      label="Branch *"
                      renderSkeleton={(field) => (
                          <BranchSelector value={field.value} onChange={field.onChange}/>
                      )}
                  />

                  <CustomFormField
                      fieldType={FormFieldType.CUSTOM_SELECTOR}
                      control={form.control}
                      name="department"
                      label="Department *"
                      renderSkeleton={(field) => (
                          <DepartmentSelector value={field.value} onChange={field.onChange}/>
                      )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product modifiers</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomFormField
                    fieldType={FormFieldType.CUSTOM_SELECTOR}
                    control={form.control}
                    name="modifier"
                    label="Modifiers"
                    renderSkeleton={(field) => (
                        <ModifierSelector value={field.value} onChange={field.onChange}/>
                    )}
                />
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Product images</CardTitle>
                <CardDescription>
                  Upload images of your product
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <CustomFormField
                      fieldType={FormFieldType.SKELETON}
                      control={form.control}
                      name="image"
                      label="Upload product image"
                      renderSkeleton={(field) => (
                          <FormControl>
                            <FileUploader files={field.value} onChange={field.onChange}/>
                          </FormControl>
                      )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex h-5 items-center space-x-4">
            <CancelButton/>
            <Separator orientation="vertical"/>
            <SubmitButton loading={isLoading} label={item ? "Update product" : "Save product"}/>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;

function uuidv4() {
  const crypto = require('crypto');
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.randomFillSync(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}