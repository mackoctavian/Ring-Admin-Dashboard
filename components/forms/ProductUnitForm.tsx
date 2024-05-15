"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProductUnit } from "@/types";
import { createProductUnit } from "@/lib/actions/business.actions"
import { toast } from "sonner"

const formSchema = z.object({
    shortName: z.string().min(1),
    name: z.string().min(1),
    business: z.string().min(1),
    status: z.boolean(),
  });
  
  const ProductUnitForm = ({ unit }: { unit: ProductUnit }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: unit ? unit : {
        name: "",
        shortName: "",
        business: "664338f2002b67031e4c",
        status: true,
      },
    });
  
    const submit = async (data: z.infer<typeof formSchema>) => {
      setIsLoading(true);
  
      try {
        console.error("submitting data:", data);
        if (unit) {
            //await updateProductUnit(unitid, data);
        } else {
            await createProductUnit(data);
            toast("Product unit created succesfully!");
        }
        
        // Redirect to the units page after submission
        
        router.push("/units");
      } catch (error) {
        console.error("Creating unit failed: ", error);
      }
  
      setIsLoading(false);
    };
  
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className="flex flex-col">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="border-t border-gray-200">
                <div className="payment-transfer_form-item py-5">
                  <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                    Unit name
                  </FormLabel>
                  <div className="flex w-full flex-col">
                    <FormControl>
                      <Input
                        placeholder="Unit full name (eg. carton)"
                        className="input-class"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-12 text-red-500" />
                  </div>
                </div>
              </FormItem>
            )}
          />
  
          <FormField
            control={form.control}
            name="shortName"
            render={({ field }) => (
              <FormItem className="border-t border-gray-200">
                <div className="payment-transfer_form-item pb-5 pt-6">
                  <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                    Short name
                  </FormLabel>
                  <div className="flex w-full flex-col">
                    <FormControl>
                      <Input
                        placeholder="Unit short name (eg. ctn)"
                        className="input-class"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-12 text-red-500" />
                  </div>
                </div>
              </FormItem>
            )}
          />
  
          <div className="payment-transfer_btn-box">
            <Button type="submit" className="payment-transfer_btn">
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> &nbsp; Sending...
                </>
              ) : (
                "Save unit"
              )}
            </Button>
          </div>
        </form>
      </Form>
    );
  };
  
  export default ProductUnitForm;