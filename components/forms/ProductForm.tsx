'use client'

import React, { useState, useEffect } from 'react';
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch"
import { Cross2Icon, PlusIcon, ReloadIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input";
import { Product, Discount, Category, ProductUnit, ProductInventoryItemUsage } from "@/types";
import { createItem, updateItem } from "@/lib/actions/product.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button";
import { generateSKU } from "@/lib/utils"
import { Plus , Minus } from "lucide-react"
import DiscountSelector from "../layout/discount-selector";
import { CategoryType, ProductSchema } from "@/types/data-schemas"
import CategorySelector from "@/components/layout/category-selector"
import InventorySelector from "@/components/layout/inventory-selector"
import { Heading } from "@/components/ui/heading";
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

const ProductForm = ({ item }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(ProductSchema),
    defaultValues: item || {
      status: false,
      variants: [{
        id: Date.now(),
        name: '',
        price: '',
        minPrice: '',
        discount: '',
        allowDiscount: false,
        status: false,
        inventoryItems: []
      }],
    },
  });

  const [usageItems, setUsageItems] = useState<ProductInventoryItemUsage[]>(form.getValues("inventoryItems") || []);
  useEffect(() => {
    form.setValue('inventoryItems', usageItems);
  }, [usageItems, form]);

  const { control, handleSubmit, setValue, getValues, watch, formState: { errors } } = form;
  const { fields: variants, append: addVariant, remove: removeVariant } = useFieldArray({
    control,
    name: 'variants'
  });

  const handleAddVariant = () => {
    addVariant({ id: Date.now(), name: '', price: '', minPrice: '', discount: '', allowDiscount: false, status: false, inventoryItems: [] });
  };

  const handleRemoveVariant = (index: number) => {
    removeVariant(index);
  };

  const handleAddInventory = (variantIndex: string) => {
    const inventoryItems = getValues(`variants.${variantIndex}.inventoryItems`);
    const newInventoryItem = { id: Date.now(), item: '', amount: '' };
    const updatedInventory = [...inventoryItems, newInventoryItem];
    setValue(`variants.${variantIndex}.inventoryItems`, updatedInventory, { shouldValidate: true, shouldDirty: true });
  };

  const handleRemoveInventory = (variantIndex: string, inventoryId: string) => {
    const inventoryItems = getValues(`variants.${variantIndex}.inventoryItems`);
    const updatedInventory = inventoryItems.filter((i) => i.id !== inventoryId);
    setValue(`variants.${variantIndex}.inventoryItems`, updatedInventory, { shouldValidate: true, shouldDirty: true });
  };
  

  const onInvalid = (errors) => {
    toast({
      variant: 'warning',
      title: 'Uh oh! Something went wrong.',
      description: 'There was an issue submitting your form, please try later',
    });
    console.error(JSON.stringify(errors));
  };

  const onSubmit = async (data) => {
    console.log(JSON.stringify(data))
    setIsLoading(true);
    try {
      toast({
        variant: 'default',
        title: 'Success',
        description: 'Product updated successfully!',
      });

      router.push('/products');
      router.refresh();
      setIsLoading(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: JSON.stringify(error) || 'There was an issue submitting your form, please try later',
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product name *</FormLabel>
                <FormControl>
                  <Input placeholder="Product name" {...field} />
                </FormControl>
                <FormMessage>{errors.name?.message}</FormMessage>
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
                  <Input placeholder="Product sku (Auto-generated)" {...field} />
                </FormControl>
                <FormMessage>{errors.sku?.message}</FormMessage>
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
                  <CategorySelector {...field} />
                </FormControl>
                <FormMessage>{errors.category?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product image *</FormLabel>
                <FormControl>
                  <Input type="file" placeholder="Product image" {...field} />
                </FormControl>
                <FormMessage>{errors.image?.message}</FormMessage>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          {variants.map((variant, variantIndex) => (
            <div key={variant.id} className="space-y-2 border p-4 rounded-md">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-bold">Variant</h2>
                {variants.length > 1 && (
                  <Button type="button" onClick={() => handleRemoveVariant(variantIndex)} variant="link">
                    <Cross2Icon className="mr-2 h-4 w-4" /> Remove variant
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={control}
                  name={`variants.${variantIndex}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variant name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Variant name" {...field} />
                      </FormControl>
                      <FormMessage>{errors.variants?.[variantIndex]?.name?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`variants.${variantIndex}.price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variant price *</FormLabel>
                      <FormControl>
                        <Input placeholder="Variant price" {...field} />
                      </FormControl>
                      <FormMessage>{errors.variants?.[variantIndex]?.price?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`variants.${variantIndex}.minPrice`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variant minimum price</FormLabel>
                      <FormControl>
                        <Input placeholder="Variant minimum price" {...field} />
                      </FormControl>
                      <FormMessage>{errors.variants?.[variantIndex]?.minPrice?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`variants.${variantIndex}.discount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variant discount</FormLabel>
                      <FormControl>
                        <DiscountSelector value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage>{errors.variants?.[variantIndex]?.discount?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`variants.${variantIndex}.allowDiscount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allow discount at counter *</FormLabel>
                      <Select onValueChange={(value) => field.onChange(value === 'true')} value={field.value.toString()}>
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
                      <FormMessage>{errors.variants?.[variantIndex]?.allowDiscount?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`variants.${variantIndex}.status`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=unchecked]:bg-red-500"
                        />
                      </FormControl>
                      <FormMessage>{errors.variants?.[variantIndex]?.status?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                {variant.inventoryItems.map((inv, inventoryIndex) => (
                  <div key={inv.id} className="space-y-2 p-2 rounded-md">
                    <Separator className="my-7" />
                    <div className="flex justify-between items-center">
                      <h5 className="text-md font-medium">Inventory Item</h5>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={control}
                        name={`variants.${variantIndex}.inventoryItems.${inventoryIndex}.item`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Item</FormLabel>
                            <FormControl>
                              <InventorySelector value={field.value} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage>{errors.variants?.[variantIndex]?.inventoryItems?.[inventoryIndex]?.item?.message}</FormMessage>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={control}
                        name={`variants.${variantIndex}.inventoryItems.${inventoryIndex}.amountUsed`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount used</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Amount used"
                                type="number"
                                step="0.01"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage>{errors.variants?.[variantIndex]?.inventoryItems?.[inventoryIndex]?.amount?.message}</FormMessage>
                          </FormItem>
                        )}
                      />

                      <Button type="button" className="mt-7" onClick={() => handleRemoveInventory(variantIndex, inv.id)} variant="destructive">
                        Remove item
                      </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={() => handleAddInventory(variantIndex)} variant="link">
                  <PlusIcon className="mr-2 h-4 w-4" /> Add inventory item
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" onClick={handleAddVariant} variant="ghost" className="float-right">
            <PlusIcon className="mr-2 h-4 w-4" /> Add variant
          </Button>
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
              item ? 'Update product' : 'Save product'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;