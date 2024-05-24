'use client'

import React, { useState, useEffect } from 'react';
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input";
import { Product, Discount, Category, ProductUnit } from "@/types";
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

const useProductForm = (item?: Product | null) => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const [selectedDiscount, setSelectedDiscount] = useState<Discount | undefined>(item?.discount);
    const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(item?.category);
    const [hasVariants, setHasVariants] = useState(false);
  
    const form = useForm<z.infer<typeof ProductSchema>>({
      resolver: zodResolver(ProductSchema),
      defaultValues: item
        ? { ...item, discount: item.discount, category: item.category }
        : {
            quantity: 0,
            allowDiscount: true,
            status: true,
          },
    });
  
    const { watch, setValue, handleSubmit, control } = form;
    const { fields: variantFields, append: addVariant, remove: removeVariant } = useFieldArray({
      control,
      name: 'productVariants'
    });
    const { fields: inventoryFields, append: addInventoryItem, remove: removeInventoryItem } = useFieldArray({
      control,
      name: 'ProductInventoryItems'
    });
  
    // Generate SKU and Slug
    useEffect(() => {
      const nameValue = watch('name');
      if (nameValue) {
        const generatedSKU = generateSKU(nameValue);
        setValue('sku', generatedSKU);
  
        const generatedSlug = nameValue.toLowerCase().replace(/\s+/g, '-');
        setValue('slug', generatedSlug);
      }
    }, [watch('name'), setValue]);
  
    useEffect(() => {
      if (item) {
        setSelectedDiscount(item.discount);
        setSelectedCategory(item.category);
      }
    }, [item]);
  
    return {
      form,
      isLoading,
      setIsLoading,
      selectedDiscount,
      setSelectedDiscount,
      selectedCategory,
      setSelectedCategory,
      toast,
      handleSubmit,
      variantFields,
      addVariant,
      removeVariant,
      inventoryFields,
      addInventoryItem,
      removeInventoryItem,
      hasVariants,
      setHasVariants,
    };
  };
  
  const ProductForm = ({ item }: { item?: Product | null }) => {
    const router = useRouter();
    const {
      form,
      isLoading,
      setIsLoading,
      selectedDiscount,
      setSelectedDiscount,
      selectedCategory,
      setSelectedCategory,
      toast,
      handleSubmit,
      variantFields,
      addVariant,
      removeVariant,
      inventoryFields,
      addInventoryItem,
      removeInventoryItem,
      hasVariants,
      setHasVariants,
    } = useProductForm(item);
  
    const onSubmit: SubmitHandler<z.infer<typeof ProductSchema>> = async (data) => {
      setIsLoading(true);
      try {
        if (item && item.$id) {
          await updateItem(item.$id, data);
          toast({
            variant: "success",
            title: "Success",
            description: "Product updated successfully!",
          });
        } else {
          await createItem(data);
          toast({
            variant: "success",
            title: "Success",
            description: "Product created successfully!",
          });
        }
        router.push("/products");
        router.refresh();
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
  
    const onInvalid = (errors: any) => {
      console.error("Creating product failed: ", JSON.stringify(errors));
      toast({
        variant: "warning",
        title: "Uh oh! Something went wrong.",
        description: "There was an issue submitting your form please try later",
      });
    };
  
    useEffect(() => {
      if (hasVariants) {
        // Clear and disable inventory items on the parent object when variants are selected
        removeInventoryItem();
      }
    }, [hasVariants, removeInventoryItem]);
  
    return (
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-8">
            <div className="flex items-end">
                <Switch
                    id="hasVariants"
                    checked={hasVariants}
                    onCheckedChange={() => setHasVariants(!hasVariants)}
                />
                <label htmlFor="hasVariants" className="cursor-pointer">&nbsp;  Enable Variants</label>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Product name"
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
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product SKU (Auto generated) *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Product sku (eg. SKU-001)"
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
              name="slug"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>Product Slug (Auto generated) *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Product slug"
                      className="input-class"
                      disabled
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
                  <FormLabel>Product category *</FormLabel>
                  <CategorySelector
                    type={CategoryType.PRODUCT}
                    value={selectedCategory}
                    onChange={(cat) => { setSelectedCategory(cat); field.onChange(cat); }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product image *</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      placeholder="Product image"
                      className="input-class"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!hasVariants && (
              <>
                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product discount</FormLabel>
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
                          <SelectItem value="false">Discounts ALLOWED at counter</SelectItem>
                          <SelectItem value="true">Discounts NOT allowed at counter</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Price *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Minimum Price"
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
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Price *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Product price"
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
                        <FormItem className="flex flex-col items-start space-y-2">
                            <FormLabel className="cursor-pointer">Status</FormLabel>
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
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Short description of the product"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                

              </>
            )}
            </div>

          <Separator />
          {!hasVariants && inventoryFields.map((item, index) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name={`ProductInventoryItems.${index}.inventoryItem`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inventory Item</FormLabel>
                    <InventorySelector
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`ProductInventoryItems.${index}.amountUsed`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount Used</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Amount Used"
                        className="input-class"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="button" variant="destructive">Remove Item</Button>

            </div>
          ))}
          {!hasVariants && <Button type="button" onClick={() => addInventoryItem({})}>Add Inventory Item</Button>}
          
          
          {hasVariants && (
            <>
              {variantFields.map((variant, index) => (
                <div key={variant.id} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name={`productVariants.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Variant Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Variant name"
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
                    name={`productVariants.${index}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Variant Price *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Variant price"
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
                    name={`productVariants.${index}.discount`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Variant Discount</FormLabel>
                        <DiscountSelector
                          value={field.value}
                          onChange={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`productVariants.${index}.allowDiscount`}
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
                            <SelectItem value="false">Discounts ALLOWED at counter</SelectItem>
                            <SelectItem value="true">Discounts NOT allowed at counter</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`productVariants.${index}.minPrice`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Price *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Minimum Price"
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
                    name={`productVariants.${index}.status`}
                    render={({ field }) => (
                        <FormItem className="flex flex-col items-start space-y-2">
                            <FormLabel className="cursor-pointer">Status *</FormLabel>
                            <FormControl>
                                <Switch
                                    id={`productVariants.${index}.status`}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                  {variant.ProductInventoryItems?.map((item, idx) => (
                    <div key={item.id} className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name={`productVariants.${index}.ProductInventoryItems.${idx}.inventoryItem`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Inventory Item</FormLabel>
                            <InventoryItemSelector
                              value={field.value}
                              onChange={field.onChange}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`productVariants.${index}.ProductInventoryItems.${idx}.amountUsed`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount Used</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Amount Used"
                                className="input-class"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                    </div>
                  ))}
                  <div className="flex h-5 items-center space-x-4">
                    <Button type="button" onClick={() => addInventoryItem({})}>Add Inventory Item to Variant</Button>
                    <Separator orientation="vertical" />
                    <Button type="button" variant="destructive" onClick={() => removeVariant(index)}>Remove Variant</Button>
                  </div>
                  
                </div>
              ))}
              <Button type="button" onClick={() => addVariant({})}>Add Variant</Button>
            </>
          )}
          
          <Separator  />

          <div className="flex h-5 items-center space-x-4">
            <CancelButton />
            <Separator orientation="vertical" />
            <Button type="submit">
              {isLoading ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> &nbsp; Processing...
                </>
              ) : (
                item ? "Update product" : "Create product"
              )}
            </Button>
          </div>
        </form>
      </Form>
    );
  };
  
  export default ProductForm;