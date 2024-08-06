'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input";
import { Discount } from "@/types";
import { createItem, updateItem } from "@/lib/actions/discount.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button";
import React from 'react';
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "@radix-ui/react-icons"
import BranchSelector from "@/components/layout/branch-multiselector"
import DepartmentSelector from "@/components/layout/department-multiselector"
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
    
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { DiscountSchema, DiscountType } from "@/types/data-schemas";
import { SubmitButton } from "../ui/submit-button";
import "react-day-picker/style.css"

const DiscountForm = ({ item }: { item?: Discount | null }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof DiscountSchema>>({
        resolver: zodResolver(DiscountSchema),
        defaultValues: item ? item : {
        type: DiscountType.PERCENTAGE,
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
    
const onSubmit = async (data: z.infer<typeof DiscountSchema>) => {
    setIsLoading(true);

    try {
        if (item) {
            await updateItem(item.$id, data);
            toast({
                variant: "default",
                title: "Success", 
                description: "Discount updated successfully!"
            });
        } else {
            await createItem(data);
            toast({
                variant: "default",
                title: "Success", 
                description: "Discount created successfully!"
            });
        }
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
};

return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">

        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          {/* Left Column */}
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
                <CardHeader>
                  <CardTitle>Discount details</CardTitle>
                  <CardDescription>
                    Main discount details
                  </CardDescription>
                </CardHeader>
                <CardContent>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Discount name</FormLabel>
                        <FormControl>
                            <Input
                            placeholder="Discount name (eg. Easter season discount)"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Discount code</FormLabel>
                        <FormControl>
                            <Input
                            placeholder="Discount code (eg. DSC001)"
                            {...field}
                            />
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
                        <FormLabel>Discount type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select discount type" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value={DiscountType.PERCENTAGE}>Percentage</SelectItem>
                                <SelectItem value={DiscountType.AMOUNT}>Amount</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Discount value</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                placeholder="Discount value"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="applyAfterTax"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Apply discount after taxes</FormLabel>
                            <FormControl>
                                <div className="mt-2">
                                    <Switch
                                        id="applyAfterTax"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </div>
                            </FormControl>
                            <FormDescription>
                                This should only be enabled for supplier discounts
                            </FormDescription>
                            <FormMessage />
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
                    <FormLabel>Discount description</FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder="Short description of the discount"
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
          <CardTitle>Discount purchase rule</CardTitle>
          <CardDescription>Apply the discount on the following selection only</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="item"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Item(s)</FormLabel>
                        <FormControl>
                            <BranchSelector {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="branch"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Branches</FormLabel>
                        <FormControl>
                            <BranchSelector {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Departments</FormLabel>
                        <FormControl>
                            <DepartmentSelector {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="customer"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Customers</FormLabel>
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
            <div className="flex h-5 items-center space-x-4">
                <CancelButton />
                <Separator orientation="vertical" />
                <SubmitButton loading={isLoading} label={item ? "Update discount" : "Create discount"} />
            </div>

      </div>

      {/* Right Column */}
      <div className="space-y-8">
          <Card>
              <CardHeader>
                <CardTitle>Discount schedule</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="grid gap-6">
                  <FormField
                      control={form.control}
                      name="redemptionStartDate"
                      render={({ field }) => (
                          <FormItem className="flex flex-col mt-2">
                              <FormLabel>Redemption start date</FormLabel>
                              <Popover>
                                  <PopoverTrigger asChild>
                                  <FormControl>
                                      <Button variant={"outline"} className={cn( "font-normal", !field.value && "text-muted-foreground" )}>
                                          {field.value ? ( format(field.value, "PPP") ) : (
                                              <span>Select redemption start date</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                  </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    hideNavigation={true}
                                    captionLayout="dropdown"
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < new Date() || date < new Date("1970-01-01") }
                                  />
                                  </PopoverContent>
                              </Popover>
                              <FormMessage />
                          </FormItem>
                      )}
                  />

                  <FormField
                      control={form.control}
                      name="redemptionEndDate"
                      render={({ field }) => (
                          <FormItem className="flex flex-col mt-2">
                              <FormLabel>Redemption end date</FormLabel>
                              <Popover>
                                  <PopoverTrigger asChild>
                                  <FormControl>
                                      <Button variant={"outline"} className={cn( "font-normal", !field.value && "text-muted-foreground" )}>
                                          {field.value ? ( format(field.value, "PPP") ) : (
                                              <span>Select redemption end date</span>
                                          )}
                                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                  </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    hideNavigation={true}
                                    captionLayout="dropdown"
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => date < new Date() || date < new Date("1970-01-01") }
                                  />
                                  </PopoverContent>
                              </Popover>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
                  </div>
              </CardContent>
            </Card>

            <Card>
                <CardHeader>
                  <CardTitle>Discount limits</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <FormField
                            control={form.control}
                            name="maximumValue"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Maximum discount value</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Maximum discount value"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Only applys to percentage-based discounts.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="redemptionLimit"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Redemption limit</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Maximum number of redemptions"
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
        </form>
    </Form>
    );
};

export default DiscountForm;