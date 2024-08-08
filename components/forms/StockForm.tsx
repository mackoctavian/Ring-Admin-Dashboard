'use client'

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import {StockSchema} from "@/types/data-schemas";
import { createItem } from "@/lib/actions/stock.actions";
import { useToast } from "@/components/ui/use-toast";
import CancelButton from "../layout/cancel-button";
import SupplierSelector from "@/components/layout/supplier-selector";
import StaffSelector from "@/components/layout/staff-selector";
import InventorySelector from "@/components/layout/inventory-selector";
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
  Form,
  FormControl,
  FormItem,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  SelectItem,
} from "@/components/ui/select"
import CustomFormField, {FormFieldType} from "@/components/ui/custom-input";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {PlusCircle} from "lucide-react";
import "react-day-picker/style.css"
import CurrencySelector from "@/components/layout/currency-selector";

const StockIntakeSchema = z.object({
  items: z.array(StockSchema).min(1, "There must be at least one record before submitting"),
});

const StockForm =() => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof StockIntakeSchema>>({
    resolver: zodResolver(StockIntakeSchema),
    defaultValues: {
      items: [{}],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onInvalid = (errors: any) => {
    toast({
      variant: "warning",
      title: "Data validation failed!",
      description: "Please make sure all the fields marked with * are filled correctly.",
    });
  };

  const onSubmit = async (data: z.infer<typeof StockIntakeSchema>) => {
    setIsLoading(true);

    try {
      //@ts-ignore
      await createItem(data.items);
      toast({
        variant: "success",
        title: "Success",
        description: "Stock intake recorded successfully!",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error recording stock intake",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
      form.reset();
    }
  };

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
          <Card>
            <CardContent>
              {fields.map((field, index) => (
                  <React.Fragment key={field.id}>
                    {index > 0 && <Separator orientation={`horizontal`} className={`mt-10 mb-5`} />}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 rounded-md m-2 pt-4">
                      <CustomFormField
                          fieldType={FormFieldType.SKELETON}
                          control={form.control}
                          name={`items.${index}.item`}
                          label="Stock item *"
                          renderSkeleton={(field) => (
                              <InventorySelector value={field.value} onChange={field.onChange}/>
                          )}
                      />
                      <CustomFormField
                          fieldType={FormFieldType.INPUT}
                          control={form.control}
                          name={`items.${index}.quantity`}
                          label="Quantity *"
                          placeholder="Quantity of stock items"
                          type="number"
                      />

                      <CustomFormField
                          fieldType={FormFieldType.INPUT}
                          control={form.control}
                          name={`items.${index}.value`}
                          label="Value *"
                          placeholder="Value of stock items"
                          type="number"
                      />

                      <CustomFormField
                          fieldType={FormFieldType.SKELETON}
                          control={form.control}
                          name={`items.${index}.currency`}
                          label="Currency *"
                          renderSkeleton={(field) => (
                              <CurrencySelector value={field.value} onChange={field.onChange}/>
                          )}
                      />

                      <CustomFormField
                          fieldType={FormFieldType.SKELETON}
                          control={form.control}
                          name={`items.${index}.staff`}
                          label="Received by *"
                          renderSkeleton={(field) => (
                              <StaffSelector value={field.value} onChange={field.onChange}/>
                          )}
                      />
                      <CustomFormField
                          fieldType={FormFieldType.SKELETON}
                          control={form.control}
                          name={`items.${index}.supplier`}
                          label="Supplied by *"
                          renderSkeleton={(field) => (
                              <SupplierSelector value={field.value} onChange={field.onChange}/>
                          )}
                      />
                      <CustomFormField
                          fieldType={FormFieldType.SKELETON}
                          control={form.control}
                          name={`items.${index}.orderDate`}
                          label="Order date *"
                          renderSkeleton={(field) => (
                              <FormItem className="flex flex-col mt-2">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button variant={"outline"} className={cn("font-normal", !field.value && "text-muted-foreground")}>
                                        {field.value ? (format(field.value, "PPP")) : (
                                            <span>Select order date</span>
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
                                        disabled={(date) => date > new Date() || date < new Date("1970-01-01")}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </FormItem>
                          )}
                      />
                      <CustomFormField
                          fieldType={FormFieldType.SKELETON}
                          control={form.control}
                          name={`items.${index}.deliveryDate`}
                          label="Delivery date *"
                          renderSkeleton={(field) => (
                              <FormItem className="flex flex-col mt-2">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button variant={"outline"} className={cn("font-normal", !field.value && "text-muted-foreground")}>
                                        {field.value ? (format(field.value, "PPP")) : (
                                            <span>Select delivery date</span>
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
                                        disabled={(date) => date > new Date() || date < new Date("1970-01-01")}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </FormItem>
                          )}
                      />
                      <CustomFormField
                          fieldType={FormFieldType.INPUT}
                          control={form.control}
                          name={`items.${index}.orderNumber`}
                          label="Order number"
                          placeholder="Order number (if available)"
                      />
                      <CustomFormField
                          fieldType={FormFieldType.SELECT}
                          control={form.control}
                          name={`items.${index}.accurate`}
                          label="Were order items accurate ? *"
                          placeholder="Verify if the items delivered were as per the order">
                        <SelectItem key="true" value="true">Yes: Order was accurate</SelectItem>
                        <SelectItem key="false" value="false">No: Order was in-accurate</SelectItem>
                      </CustomFormField>
                      <Button
                          variant="destructive"
                          type="button"
                          className="mt-4"
                          onClick={() => fields.length > 1 && remove(index)}
                          disabled={fields.length === 1}>
                        Remove Item
                      </Button>
                    </div>
                  </React.Fragment>
              ))}
            </CardContent>
            <CardFooter className="justify-center border-t p-4">
              <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="gap-1"
                  //@ts-ignore
                  onClick={() => append({
                    quantity: 0,
                    value: 0,
                    accurate: true,
                    orderDate: new Date(),
                    deliveryDate: new Date(),
                  })}>
                  <PlusCircle className="h-3.5 w-3.5"/>
                  Add stock item
                </Button>
            </CardFooter>
          </Card>

          <div className="flex h-5 items-center space-x-4">
            <CancelButton/>
            <Separator orientation="vertical"/>
            <SubmitButton loading={isLoading} label="Record stock intake"/>
          </div>
        </form>
      </Form>
  );
};

export default StockForm;