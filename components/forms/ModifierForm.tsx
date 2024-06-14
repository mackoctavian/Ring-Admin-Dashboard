'use client'

import * as z from "zod";
import React, { useState, useEffect } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Modifier, Branch } from "@/types"
import { createItem, updateItem } from "@/lib/actions/modifier.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button"
import { ModifierSchema, ModifierType } from "@/types/data-schemas"
import BranchSelector from "../layout/branch-multiselector"
import InventorySelector from "@/components/layout/inventory-selector"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import { SubmitButton } from "../ui/submit-button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "../ui/button";


const ModifierForm = ({ modifier }: { modifier?: Modifier }) => {
    
    console.log("MODIFIER DATA",modifier)
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const [selectedBranch, setSelectedBranch] = useState<Branch[] | null>(modifier?.branches ?? null);

    useEffect(() => {
        if (modifier && modifier.branches) {
            setSelectedBranch(modifier.branches);
        } else {
            setSelectedBranch(null);
        }
    }, [modifier]);

    const form = useForm<z.infer<typeof ModifierSchema>>({
        resolver: zodResolver(ModifierSchema),
        defaultValues: modifier ? modifier : {
            status: true,
            allowMultiple: false,
            modifierItems: [
                { price: 0, inventoryItem: null }
             ]
        }
    });

    const { fields, append, remove, update } = useFieldArray({
        control: form.control,
        name: "modifierItems",
    });

    const onInvalid = (errors: any) => {
        console.log("Errors", errors)
        toast({
            variant: "warning",
            title: "Data validation failed!",
            description: "Please make sure all the fields marked with * are filled correctly."
        });
    };

    const onSubmit = async (data: z.infer<typeof ModifierSchema>) => {
        setIsLoading(true);
        try {
            if (modifier && modifier.$id) {
                await updateItem(modifier.$id, data);
                toast({
                    variant: "success",
                    title: "Success",
                    description: "Modifier details updated successfully!"
                });
            } else {
                await createItem(data);
                toast({
                    variant: "success",
                    title: "Success",
                    description: "Modifier created successfully!"
                });
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was an issue submitting your form, please try later"
            });
        } finally {
            setTimeout(() => setIsLoading(false), 1000);
        }
    };

    useEffect(() => {
        fields.forEach((field, index) => {
            const name = form.watch(`modifierItems.${index}.name`);
            const price = form.watch(`modifierItems.${index}.price`);
            const inventoryItem = form.watch(`modifierItems.${index}.inventoryItem`);

            if (name !== field.name || price !== field.price || inventoryItem !== field.inventoryItem) {
                update(index, { ...field, name, price, inventoryItem });
            }
        });
    }, [fields, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
                <Card>
                    <CardHeader>
                      <CardTitle>Modifier details</CardTitle>
                      <CardDescription>
                        Details used to identify your modifier item
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                          <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Modifier title *</FormLabel>
                                      <FormControl>
                                          <Input placeholder="Modifier title ( eg. Milk )" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="type"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Modifier type *</FormLabel>
                                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                                          <FormControl>
                                              <SelectTrigger>
                                                  <SelectValue placeholder="Select type" />
                                              </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                              <SelectItem value={ModifierType.LIST}>Choose an option from a list of modifiers</SelectItem>
                                              <SelectItem disabled value={ModifierType.TEXT}>Modify item by typing into a text box</SelectItem>
                                          </SelectContent>
                                      </Select>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="branches"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Branches *</FormLabel>
                                      <FormControl>
                                          <BranchSelector
                                              value={selectedBranch}
                                              onChange={(branch) => { setSelectedBranch(branch); field.onChange(branch); }}
                                          />
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
                                      <FormLabel>Image</FormLabel>
                                      <FormControl>
                                          <Input type="file" placeholder="Modifier image" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                  </FormItem>
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="allowMultiple"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Allow multiple items? *</FormLabel>
                                      <FormControl>
                                          <div className="mt-2">
                                              <Switch
                                                  id="allowMultiple"
                                                  checked={field.value}
                                                  onCheckedChange={field.onChange}
                                              />
                                          </div>
                                      </FormControl>
                                      <FormDescription>Only one item on the modifier can be selected</FormDescription>
                                  </FormItem>
                              )}
                          />
                          <FormField
                              control={form.control}
                              name="status"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>Status *</FormLabel>
                                      <FormControl>
                                          <div className="mt-2">
                                              <Switch
                                                  id="status"
                                                  checked={field.value}
                                                  onCheckedChange={field.onChange}
                                              />
                                          </div>
                                      </FormControl>
                                  </FormItem>
                              )}
                          />
                      </div>
                </CardContent>
              </Card>
              
              <Card>
                  <CardHeader>
                    <CardTitle>Modifier items</CardTitle>
                    <CardDescription>
                      Items in the modifier
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {fields.map((field, index) => (
                    <>
                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-md">
                            <FormField
                                control={form.control}
                                name={`modifierItems.${index}.name`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Item name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Item name eg. ( Low fat milk )" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`modifierItems.${index}.price`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Item price</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="0" placeholder="Item price" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`modifierItems.${index}.inventoryItem`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Inventory Item</FormLabel>
                                        <FormControl>
                                            <InventorySelector {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button
                                variant="destructive"
                                type="button"
                                className="mt-8"
                                onClick={() => fields.length > 1 && remove(index)}
                                disabled={fields.length === 1}>
                                Remove Item
                            </Button>
                        </div>
                        <Separator className="m-4" />
                    </>

                    ))}
                  </CardContent>
                  <CardFooter>
                      <Button type="button" onClick={() => append({ name: '', price: 0, inventoryItem: null })}>
                          Add modifier item
                      </Button>
                  </CardFooter>
              </Card>
                
                <div className="flex h-5 items-center space-x-4">
                    <CancelButton />
                    <Separator orientation="vertical" />
                    <SubmitButton loading={isLoading} label={modifier ? "Update modifier" : "Save modifier"} />
                </div>
            </form>
        </Form>
    );
};

export default ModifierForm;

