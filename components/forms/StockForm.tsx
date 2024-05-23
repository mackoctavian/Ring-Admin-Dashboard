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
import { Stock } from "@/types";
import { StockSchema, InventoryStatus, StockVariantSchema } from "@/types/data-schemas";
import { createItem, updateItem } from "@/lib/actions/stock.actions";
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


const formSchema = z.object({
  items: z.array(
    z.object({
      item: z.object({
        $id: z.string(),
        name: z.string(),
      }),
      quantity: z.number().min(1, "Quantity must be at least 1"),
      staff: z
        .object({
          $id: z.string(),
          name: z.string(),
        })
        .optional(),
      department: z
        .object({
          $id: z.string(),
          name: z.string(),
        })
        .optional(),
      supplier: z.object({
        $id: z.string(),
        name: z.string(),
      }),
      value: z.number().optional(),
    })
  ).min(1, "At least one item is required"),
});

type FormSchemaType = z.infer<typeof formSchema>;

const StockForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: [{ item: { $id: "", name: "" }, quantity: 1, staff: undefined, department: undefined, supplier: { $id: "", name: "" }, value: undefined }],
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

  const onSubmit = async (data: FormSchemaType) => {
    setIsLoading(true);

    try {
      console.info("Submitted data", JSON.stringify(data));
      await createItem(data); // Implement createItem function
      toast({
        variant: "success",
        title: "Success",
        description: "Stock intake recorded successfully!",
      });

      router.push("/stock");
      setIsLoading(false);
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
                      value={field.value.$id}
                      onChange={(value) => field.onChange({ $id: value.$id, name: value.name })}
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
              name={`items.${index}.staff`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Staff</FormLabel>
                  <FormControl>
                    <StaffSelector
                      value={field.value?.$id || ""}
                      onChange={(value) => field.onChange(value ? { $id: value.$id, name: value.name } : undefined)}
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
                      value={field.value?.$id || ""}
                      onChange={(value) => field.onChange(value ? { $id: value.$id, name: value.name } : undefined)}
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
                      value={field.value.$id}
                      onChange={(value) => field.onChange({ $id: value.$id, name: value.name })}
                    />
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

            <Button
              variant="destructive"
              type="button"
              onClick={() => fields.length > 1 && remove(index)}
              disabled={fields.length === 1}
            >
              Remove Item
            </Button>
          </div>
        ))}

        <Button
          type="button"
          onClick={() =>
            append({
              item: { $id: "", name: "" },
              quantity: 1,
              staff: undefined,
              department: undefined,
              supplier: { $id: "", name: "" },
              value: undefined,
            })
          }
        >
          Add Item
        </Button>

        <div className="flex h-5 items-center space-x-4">
          <CancelButton />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> &nbsp; Processing...
              </>
            ) : (
              "Save Stock Intake"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StockForm;