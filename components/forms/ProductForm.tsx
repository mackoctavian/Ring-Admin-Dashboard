'use client'

import React, { useState, useEffect } from 'react';
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch"
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons"
import { PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input";
import { Product, Category, ProductUnit, ProductInventoryItemUsage, ProductVariant } from "@/types";
import { createItem, updateItem } from "@/lib/actions/product.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button";
import { generateSKU } from "@/lib/utils"
import ModifierSelector from "../layout/modifier-multiselector";
import { CategoryType, ProductSchema, POSItemStatus } from "@/types/data-schemas"
import CategorySelector from "@/components/layout/category-multiselector"
import InventorySelector from "@/components/layout/inventory-selector"
import { Heading } from "@/components/ui/heading";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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

import {
  ChevronLeft,
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Upload,
  Users2,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import Image from "next/image"


const ProductForm = ({ item }: { item?: Product | null }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(ProductSchema),
    defaultValues: item ? item : {
      variants: [{
        $id: uuidv4(),
        status: false,
        tax: 0,
        inventoryItems: []
      }],
    },
  });

  const { control, handleSubmit, setValue, getValues, formState: { errors } } = form;

  const onInvalid = (errors: any) => {
    console.log(errors)
    toast({
      variant: 'warning',
      title: 'Uh oh! Something went wrong.',
      description: 'There was an issue submitting your form, please try later',
    });
  };

  const onSubmit = async (data: z.infer<typeof ProductSchema>) => {
    setIsLoading(true);
    try {
        if (item) {
            await updateItem(item.$id!, data);
            toast({
            variant: "success",
            title: "Success",
            description: "Product details updated successfully!"
            });
        } else {
            await createItem(data);
            toast({
            variant: "success",
            title: "Success",
            description: "Product added successfully!"
            });
        }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: JSON.stringify(error) || 'There was an issue submitting your form, please try later',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [variants, setVariants] = useState<ProductVariant[]>(
    item ? item.variants : [{
      $id: uuidv4(),
      allowDiscount: false,
      status: false,
      inventoryItems: []
    }]
  );

  const handleAddVariant = () => {
    const newVariant = { $id: uuidv4(), allowDiscount: false, status: false, inventoryItems: [] };
    setVariants([...variants, newVariant]);
    setValue('variants', [...getValues('variants'), newVariant]);
  };

  const handleAddInventory = (variantIndex: number) => {
    const newInventoryItem = { $id: uuidv4() };
    const updatedVariants = [...variants];
    updatedVariants[variantIndex].inventoryItems.push(newInventoryItem);
    setVariants(updatedVariants);
    setValue(`variants[${variantIndex}].inventoryItems`, updatedVariants[variantIndex].inventoryItems);
  };

  const handleRemoveInventory = (variantIndex: number, inventoryItemId: string) => {
    const updatedVariants = [...variants];
    const inventoryItems = updatedVariants[variantIndex].inventoryItems.filter(
      (inv) => inv.$id !== inventoryItemId
    );
    updatedVariants[variantIndex].inventoryItems = inventoryItems;
    setVariants(updatedVariants);
    setValue(`variants[${variantIndex}].inventoryItems`, inventoryItems);
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Product name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product SKU *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Product sku ( Auto-generated )"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product category *</FormLabel>
                      <FormControl>
                        <CategorySelector type={CategoryType.PRODUCT} {...field} />
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
                        <FormLabel>Description *</FormLabel>
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
                  <div key={variant.$id} className="border bg-gray-100 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      {variants.length > 1 && (
                        <Button type="button" onClick={() => handleRemoveVariant(variantIndex)} variant="link" className="ml-auto">
                          <Cross2Icon className="mr-2 h-4 w-4" /> Delete variant
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={control}
                        name={`variants[${variantIndex}].name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Variant name *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Variant name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`variants[${variantIndex}].price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Variant price *</FormLabel>
                            <FormControl>
                              <Input
                                type='number'
                                step='0.01'
                                placeholder="Variant price"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`variants[${variantIndex}].tax`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Variant tax *</FormLabel>
                            <FormControl>
                              <Input
                                type='number'
                                step='0.01'
                                placeholder="Variant tax"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`variants[${variantIndex}].barcode`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Variant barcode</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Variant barcode"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`variants[${variantIndex}].status`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                              <div className="mt-2">
                                <Switch
                                  id={`variant-status-${variant.$id}`}
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      {variant.inventoryItems.map((inv, inventoryIndex) => (
                        <div key={inv.$id} className="space-y-2 p-2 rounded-md">
                          <Separator className="my-7" />
                          <div className="grid grid-cols-4 gap-4">
                            <FormField
                              control={control}
                              name={`variants[${variantIndex}].inventoryItems[${inventoryIndex}].item`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Stock item</FormLabel>
                                  <FormControl>
                                    <InventorySelector {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={control}
                              name={`variants[${variantIndex}].inventoryItems[${inventoryIndex}].amountUsed`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Quantity used</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Quantity used"
                                      type="number"
                                      step="0.01"
                                      {...field}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={control}
                              name={`variants[${variantIndex}].inventoryItems[${inventoryIndex}].unit`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Unit</FormLabel>
                                  <FormControl>
                                    <UnitSelector {...field} />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <Button type="button" className='mt-8' onClick={() => handleRemoveInventory(variantIndex, inv.$id)} variant='destructive'>
                              Remove tracking
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button type="button" onClick={() => handleAddInventory(variantIndex)} variant="link">
                        <PlusIcon className="mr-2 h-4 w-4" /> Track stock item
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <CardFooter className="justify-center p-1">
                <Button type="button" variant="ghost" className="gap-1" onClick={handleAddVariant}>
                  <PlusCircle className="h-3.5 w-3.5" />
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
              <FormField
                control={form.control}
                name="posStatus"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value={POSItemStatus.DRAFT}>{POSItemStatus.DRAFT}</SelectItem>
                            <SelectItem value={POSItemStatus.ACTIVE}>{POSItemStatus.ACTIVE}</SelectItem>
                            <SelectItem value={POSItemStatus.ARCHIVED}>{POSItemStatus.ARCHIVED}</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Product availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                  <FormField
                    control={control}
                    name="branch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch *</FormLabel>
                        <FormControl>
                          <BranchSelector {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department *</FormLabel>
                        <FormControl>
                          <DepartmentSelector {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
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
              <FormField
                control={control}
                name="modifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modifiers</FormLabel>
                    <FormControl>
                      <ModifierSelector
                        placeholder="Select modifier"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Modifiers selected here will be applied to the product during sale</FormDescription>
                    <FormMessage />
                  </FormItem>
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
                <FormField
                      control={control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="file"
                              placeholder="Product image"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex h-5 items-center space-x-4">
        <CancelButton />
        <Separator orientation="vertical" />
        <SubmitButton loading={isLoading} label={item ? "Update product" : "Save product"} />
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