'use client'

import { useToast } from "@/components/ui/use-toast"
import React, {useCallback, useState} from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { Switch } from "@/components/ui/switch"
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons"
import { PlusCircle } from "lucide-react"
import { useForm, useFieldArray } from 'react-hook-form'
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {Product} from "@/types"
import { createItem, updateItem } from "@/lib/actions/product.actions"
import CancelButton from "../layout/cancel-button"
import ModifierSelector from "../layout/modifier-multiselector"
import {ProductSchema, POSItemStatus} from "@/types/data-schemas"
import CategorySelector from "@/components/layout/category-multiselector"
import InventorySelector from "@/components/layout/inventory-selector"
import { Form, FormControl } from "@/components/ui/form";
import {SelectItem} from "@/components/ui/select"
import { SubmitButton } from '../ui/submit-button'
import UnitSelector from '../layout/unit-selector'
import BranchSelector from '../layout/branch-multiselector'
import DepartmentSelector from '../layout/department-multiselector'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import CustomFormField, {FormFieldType} from "@/components/ui/custom-input"
import {FileUploader} from "@/components/ui/custom-file-uploader"
import CurrencySelector from "@/components/layout/currency-selector"
import {ScrollArea} from "@/components/ui/scroll-area";

const ProductForm: React.FC<{ item?: Product | null }> = ({ item }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(ProductSchema),
    defaultValues: item ? {
      ...item,
      description: item.description ?? '',
      variants: item.variants.map(variant => ({
        ...variant,
        inventoryItems: variant.inventoryItems.map(invItem => ({
          ...invItem,
          $id: invItem.$id || null
        }))
      }))
    } : {
      name: '',
      posStatus: POSItemStatus.DRAFT,
      image: null,
      variants: [{
        status: false,
        inventoryItems: []
      }]
    }
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control: form.control,
    name: 'variants'
  });

  const onInvalid = useCallback((errors: any) => {
    console.log(errors);
    toast({
      variant: "warning",
      title: "Uh oh! Something went wrong.",
      description: "There was an issue submitting your form, please try later",
    });
  }, [toast]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    let formData;

    if (data.image && data.image?.length > 0) {
      const blobFile = new Blob([data.image[0]], {
        type: data.image[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", data.image[0].name);
    }

    try {
      const productData = {
        $id: item?.$id ?? null,
        name: data.name,
        category: data.category,
        currency: data.currency,
        description: data.description,
        branch: data.branch,
        department: data.department,
        modifier: data.modifier,
        image: data.image
            ? formData
            : undefined,
        variants: data.variants,
        posStatus: data.posStatus,
        sku: null
      };

      console.log(productData);

      const action = item ? await updateItem(item.$id, productData, item.image, item.imageId) : createItem(productData);
      await action;
      toast({
        variant: 'success',
        title: 'Success',
        description: `Product ${item ? 'updated' : 'added'} successfully!`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'There was an issue submitting your form. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVariant = () => {
    appendVariant({
      status: false,
      inventoryItems: []
    });
  };

  const handleAddInventory = (variantIndex: number) => {
    const currentVariant = form.getValues(`variants.${variantIndex}`);
    const updatedInventoryItems = [
      ...currentVariant.inventoryItems,
      { $id: uuidv4(), amountUsed: 1, unit: "666bfaa90002d3ce9abf" }
    ];
    form.setValue(`variants.${variantIndex}.inventoryItems`, updatedInventoryItems);
    form.trigger();
  };

  const handleRemoveInventory = (variantIndex: number, inventoryItemIndex: number) => {
    const currentVariant = form.getValues(`variants.${variantIndex}`);
    const updatedInventoryItems = currentVariant.inventoryItems.filter((_, index) => index !== inventoryItemIndex);
    form.setValue(`variants.${variantIndex}.inventoryItems`, updatedInventoryItems);
    form.trigger();
  };

  //console.log(item)

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
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
                        description="Only categories of type `PRODUCT` allowed"
                        renderSkeleton={(field) => (
                            <CategorySelector value={field.value} onChange={field.onChange}/>
                        )}
                    />

                    <CustomFormField
                        fieldType={FormFieldType.CUSTOM_SELECTOR}
                        control={form.control}
                        name="currency"
                        label="Currency *"
                        renderSkeleton={(field) => (
                            <CurrencySelector value={field.value} onChange={field.onChange}/>
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
                    {variantFields.map((field, index) => (
                        <div key={field.id} className="border p-4 rounded-md mb-4">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-medium">Variant {index + 1}</h4>
                            {variantFields.length > 1 && (
                                <Button type="button" onClick={() => removeVariant(index)} variant="ghost" size="sm">
                                  <Cross2Icon className="mr-2 h-4 w-4" /> Remove variant
                                </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <CustomFormField
                                fieldType={FormFieldType.INPUT}
                                control={form.control}
                                name={`variants.${index}.name`}
                                label="Product variant name *"
                                placeholder="Enter variant name"
                            />

                            <CustomFormField
                                fieldType={FormFieldType.INPUT}
                                control={form.control}
                                name={`variants.${index}.price`}
                                label="Product variant price *"
                                placeholder="Enter variant price"
                                type="number"
                            />

                            <CustomFormField
                                fieldType={FormFieldType.INPUT}
                                control={form.control}
                                name={`variants.${index}.tax`}
                                label="Product variant tax *"
                                placeholder="Enter variant tax amount"
                                type="number"
                            />

                            <CustomFormField
                                fieldType={FormFieldType.INPUT}
                                control={form.control}
                                name={`variants.${index}.barcode`}
                                label="Product variant barcode"
                                placeholder="Enter variant barcode"
                            />

                            <CustomFormField
                                fieldType={FormFieldType.SKELETON}
                                control={form.control}
                                name={`variants.${index}.status`}
                                label="Status *"
                                renderSkeleton={(field) => (
                                    <div className="mt-2">
                                      <Switch
                                          name={`variants.${index}.status`}
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                      />
                                    </div>
                                )}
                            />
                          </div>

                          <Drawer>
                            <DrawerTrigger asChild>
                              <Button variant="outline" className="snap-end">
                                <PlusIcon className="mr-2 h-4 w-4" /> Enable stock item tracking
                              </Button>
                            </DrawerTrigger>
                            <DrawerContent>
                              <div className="mx-auto w-full max-w-5xl">
                                <DrawerHeader>
                                  <DrawerTitle>Track Stock Items</DrawerTitle>
                                  <DrawerDescription>This feature enables stock reduction as per product sales</DrawerDescription>
                                </DrawerHeader>
                                <div className="p-4 pb-0">
                                  <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-sm font-medium">Variant {index + 1} stock item tracking</h4>
                                    <Button
                                        type="button"
                                        onClick={() => handleAddInventory(index)}
                                        variant="ghost"
                                        size="sm"
                                        className="accent-green-400">
                                      <PlusIcon className="mr-2 h-4 w-4" /> Add trackable item
                                    </Button>
                                  </div>

                                  <ScrollArea key="itemScroll">
                                    {form.watch(`variants.${index}.inventoryItems`, []).map((inventoryItem, inventoryIndex) => (
                                        <div key={inventoryItem.$id} className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-10 px-2">
                                          <CustomFormField
                                              fieldType={FormFieldType.CUSTOM_SELECTOR}
                                              control={form.control}
                                              name={`variants.${index}.inventoryItems.${inventoryIndex}.item`}
                                              label="Stock item *"
                                              renderSkeleton={(field) => (
                                                  <InventorySelector value={field.value} onChange={field.onChange} />
                                              )}
                                          />

                                          <CustomFormField
                                              fieldType={FormFieldType.INPUT}
                                              control={form.control}
                                              name={`variants.${index}.inventoryItems.${inventoryIndex}.amountUsed`}
                                              label="Quantity used *"
                                              placeholder="Enter quantity used per sale"
                                              type="number"
                                          />

                                          <CustomFormField
                                              fieldType={FormFieldType.CUSTOM_SELECTOR}
                                              control={form.control}
                                              name={`variants.${index}.inventoryItems.${inventoryIndex}.unit`}
                                              label="Unit of item usage *"
                                              renderSkeleton={(field) => (
                                                  <UnitSelector value={field.value} onChange={field.onChange} />
                                              )}
                                          />

                                          <Button
                                              type="button"
                                              className="mt-8"
                                              onClick={() => handleRemoveInventory(index, inventoryIndex)}
                                              variant="destructive">
                                            Remove tracker
                                          </Button>
                                        </div>
                                    ))}
                                  </ScrollArea>
                                </div>
                                <DrawerFooter>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <DrawerClose asChild>
                                      <Button>Submit</Button>
                                    </DrawerClose>
                                    <DrawerClose asChild>
                                      <Button variant="outline">Cancel</Button>
                                    </DrawerClose>
                                  </div>
                                </DrawerFooter>
                              </div>
                            </DrawerContent>
                          </Drawer>
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
                  <CardTitle>Product image</CardTitle>
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
            <div className="flex h-5 items-center space-x-4 py-4">
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
  // @ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ crypto.randomFillSync(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}