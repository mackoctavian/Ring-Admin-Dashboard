'use client'

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InventoryVariant, Staff, Supplier, Department } from "@/types";
import { StockSchema } from "@/types/data-schemas";
import { createItem } from "@/lib/actions/stock.actions";
import { useToast } from "@/components/ui/use-toast";
import CancelButton from "../layout/cancel-button";
import DepartmentSelector from "@/components/layout/department-selector";
import SupplierSelector from "@/components/layout/supplier-selector";
import StaffSelector from "@/components/layout/staff-selector";
import InventorySelector from "@/components/layout/inventory-selector";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export const StockIntakeSchema = z.object({
  items: z
    .array(StockSchema)
    .min(1, "There must be at least one record before submitting"),
});


const StockForm = ({ item, staff, suppliers, departments }: { item: InventoryVariant[] | undefined, staff: Staff[], suppliers: Supplier[], departments: Department[] }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof StockIntakeSchema>>({
    resolver: zodResolver(StockIntakeSchema),
    defaultValues: {
      items: [
        { 
          item: undefined, 
          quantity: 1, 
          staff: undefined, 
          department: undefined, 
          supplier: undefined, 
        }
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onInvalid = (errors: any) => {
    toast({
      variant: "warning",
      title: "Uh oh! Something went wrong.",
      description: "There was an issue submitting your form please try later",
    });
    console.error("Recording stock intake failed: ", JSON.stringify(errors));
  };

  const onSubmit = async (data: z.infer<typeof StockIntakeSchema>) => {
    setIsLoading(true);

    try {
      console.info("Submitted data", JSON.stringify(data));
      await createItem(data.items);
      toast({
        variant: "success",
        title: "Success",
        description: "Stock intake recorded successfully!",
      });

      router.push("/stock");
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-2 border p-4 rounded-md">
            
            <FormField
              control={form.control}
              name={`items.${index}.item`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item</FormLabel>
                  <FormControl>
                    <InventorySelector
                       value={field.value}
                       item={item}
                       onChange={(inventoryItem) => field.onChange(inventoryItem)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`items.${index}.quantity`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" placeholder="Quantity" className="input-class" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`items.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Value" className="input-class" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`items.${index}.staff`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Staff</FormLabel>
                  <FormControl>
                    <StaffSelector
                      value={field.value}
                      staff={staff}
                      onChange={(staffItem) => field.onChange(staffItem)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`items.${index}.department`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <DepartmentSelector
                      value={field.value}
                      departments={departments}
                      onChange={(department) => field.onChange(department)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`items.${index}.supplier`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier</FormLabel>
                  <FormControl>
                    <SupplierSelector
                      value={field.value}
                      suppliers={suppliers}
                      onChange={(supplier) => field.onChange(supplier)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            

            <Button
              variant="destructive"
              type="button"
              onClick={() => fields.length > 1 && remove(index)}
              disabled={fields.length === 1}>
              Remove Item
            </Button>
          </div>
        ))}

        <Button
          type="button"
          onClick={() =>
            append({
              item: undefined,
              quantity: 1,
              staff: undefined,
              department: undefined,
              supplier: undefined,
              value: undefined,
            })
          }>
          Add Item
        </Button>

        <div className="flex h-5 items-center space-x-4">
          <CancelButton />
          
          <Separator orientation="vertical" />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> &nbsp; Processing...
              </>
            ) : (
              "Record Stock Intake"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StockForm;