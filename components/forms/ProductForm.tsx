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

const ProductForm = ({ item }: { item?: Product | null }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  
  const form = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
      defaultValues: item ? item : {
      status: false,
    },
  });

  const onInvalid = (errors : any ) => {
    toast({
        variant: "warning",
        title: "Uh oh! Something went wrong.", 
        description: "There was an issue submitting your form please try later"
    });
    console.error(JSON.stringify(errors))
  }

  const onSubmit = async (data: z.infer<typeof ProductSchema>) => {
    setIsLoading(true);
    try {
        toast({
          variant: "default",
          title: "Success", 
          description: "Discount updated succesfully!"
        });
      
      // Redirect to the list page after submission
      router.push("/products");
      router.refresh();
      setIsLoading(false);
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.", 
            description: error.message || "There was an issue submitting your form, please try later"
        });
    } finally {
      //delay loading
      setTimeout(() => {
          setIsLoading(false);
          }, 1000); 
      }
    }

  const [variants, setVariants] = useState([{ id: Date.now(), name: '', price: '', minPrice: '', discount: '', allowDiscount: false, status: false, inventory: [] }]);

  const handleAddVariant = () => {
    setVariants([...variants, { id: Date.now(), name: '', price: '', minPrice: '', discount: '', allowDiscount: false, status: false, inventory: [] }]);
  };

  const handleRemoveVariant = (id) => {
    setVariants(variants.filter(variant => variant.id !== id));
  };

  const handleVariantChange = (id, field, value) => {
    setVariants(variants.map(variant => variant.id === id ? { ...variant, [field]: value } : variant));
  };

  const handleAddInventory = (variantId) => {
    setVariants(variants.map(variant => variant.id === variantId ? { ...variant, inventory: [...variant.inventory, { id: Date.now(), item: '', amount: '' }] } : variant));
  };

  const handleRemoveInventory = (variantId, inventoryId) => {
    setVariants(variants.map(variant => variant.id === variantId ? { ...variant, inventory: variant.inventory.filter(inv => inv.id !== inventoryId) } : variant));
  };

  const handleInventoryChange = (variantId, inventoryId, field, value) => {
    setVariants(variants.map(variant => variant.id === variantId ? { ...variant, inventory: variant.inventory.map(inv => inv.id === inventoryId ? { ...inv, [field]: value } : inv) } : variant));
  };

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
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
                      <FormLabel>Product SKU *</FormLabel>
                      <FormControl>
                          <Input
                          placeholder="Product sku ( Auto-generated )"
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
                      <FormLabel>Product category *</FormLabel>
                        <FormControl>
                          <CategorySelector type={CategoryType.PRODUCT} {...field} />
                        </FormControl>
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
      </div>

      <div className="space-y-4">
        {variants.map(variant => (
          <div key={variant.id} className="space-y-2 border p-4 rounded-md">
            <div className="flex justify-between items-center">
              <h2 className='text-base font-bold'>Variant</h2>
              {variants.length > 1 && (
                <Button type="button" onClick={() => handleRemoveVariant(variant.id)} variant="link">
                  <Cross2Icon className="mr-2 h-4 w-4" /> Remove variant
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name={`variant-name-${variant.id}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variant name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Variant name"
                          {...field}
                          value={variant.name}
                          onChange={(e) => handleVariantChange(variant.id, 'name', e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`variant-price-${variant.id}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variant price *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Variant price"
                          {...field}
                          value={variant.name}
                          onChange={(e) => handleVariantChange(variant.id, 'price', e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                <FormField
                  control={form.control}
                  name={`variant-barcode-${variant.id}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variant barcode *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Variant barcode"
                          {...field}
                          value={variant.barcode}
                          onChange={(e) => handleVariantChange(variant.id, 'barcode', e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                

                <FormField
                  control={form.control}
                  name={`variant-minPrice-${variant.id}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variant minimum price</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Variant minimum price"
                          {...field}
                          value={variant.minPrice}
                          onChange={(e) => handleVariantChange(variant.id, 'minPrice', e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`variant-discount-${variant.id}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variant discount</FormLabel>
                        <FormControl>
                          <DiscountSelector 
                            value={variant.discount} 
                            onChange={(value) => handleVariantChange(variant.id, 'discount', value)} 
                            />
                        </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`variant-allowDiscount-${variant.id}`}
                  render={({ field }) => (
                      <FormItem>
                          <FormLabel>Allow discount at counter *</FormLabel>
                          <Select onChange={(e) => handleVariantChange(variant.id, 'allowDiscount', e.target.value)} value={variant.allowDiscount} defaultValue={variant.allowDiscount}>
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
                  name={`variant-status-${variant.id}`}
                  render={({ field }) => (
                      <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                              <Switch
                                  id={`variant-status-${variant.id}`}
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                              />
                          </FormControl>
                      </FormItem>
                  )}
              />
            
            </div>

            <div className="space-y-2">
              {variant.inventory.map(inv => (
                <div key={inv.id} className="space-y-2 p-2 rounded-md">

                  <Separator className="my-7" />
                  <div className="flex justify-between items-center">
                    <h5 className="text-md font-medium">Inventory Item</h5>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`inventory-item-${inv.id}`} 
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Status</FormLabel>
                              <FormControl>
                                <InventorySelector 
                                  value={inv.item} 
                                  onChange={(value) => handleInventoryChange(variant.id, inv.id, 'item', value)} />
                              </FormControl>
                          </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`inventory-amount-${inv.id}`}
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Amount used</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Amount used"
                                  type="number"
                                  step="0.01"
                                  {...field}
                                  value={inv.amount}
                                  onChange={(e) => handleInventoryChange(variant.id, inv.id, 'amount', e.target.value)}
                                />
                              </FormControl>
                          </FormItem>
                      )}
                    />
                    <Button type="button" className='mt-7' onClick={() => handleRemoveInventory(variant.id, inv.id)}  variant='destructive'>
                        Remove item
                    </Button> 
                    
                  </div>
                </div>
              ))}
              <Button type="button" onClick={() =>  handleAddInventory(variant.id)}  variant="link">
                <PlusIcon className="mr-2 h-4 w-4" /> Add inventory item
              </Button>

            </div>
          </div>
        ))}
        <Button type="button" onClick={handleAddVariant}  variant="ghost" className="float-right">
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
                    item ? "Update product" : "Save product"
                )}
            </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;