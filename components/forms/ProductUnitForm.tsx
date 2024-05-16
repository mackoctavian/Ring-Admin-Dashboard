'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "@/components/ui/separator"
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
import { createProductUnit, updateProductUnit } from "@/lib/actions/product-unit.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button";

    const formSchema = z.object({
        shortName: z.string().min(1),
        name: z.string().min(1),
        status: z.boolean(),
    });
  
  const ProductUnitForm = ({ unit }: { unit?: ProductUnit | null }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: unit ? unit : {
        name: "",
        shortName: "",
        business: "",
        status: false,
      },
    });

    const onInvalid = (errors : any ) => {
        console.error("Creating unit failed: ", errors);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.", 
            description: "There was an issue submitting your form please try later"
        });
    }

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
      setIsLoading(true);
  
      try {
        if (unit) {
            await updateProductUnit(unit.$id, data);
            toast({
                variant: "default",
                title: "Success", 
                description: "Product unit updated succesfully!"
            });
        } else {
            await createProductUnit(data);
            toast({
                variant: "default",
                title: "Success", 
                description: "Product unit created succesfully!"
            });
        }
        
        // Redirect to the units page after submission
        router.push("/units");
        router.refresh();
        setIsLoading(false);
      } catch (error) {
        console.error("Creating unit failed: ", error);
        setIsLoading(false);
      }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Unit name</FormLabel>
                        <FormControl>
                            <Input
                            placeholder="Unit full name (eg. carton)"
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
                    name="shortName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Short name </FormLabel>
                            <FormControl>
                                <Input
                                placeholder="Unit short name (eg. ctn)"
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
                    <FormItem>
                        <FormLabel>Status</FormLabel>
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

        
                <div className="flex h-5 items-center space-x-4">
                    <CancelButton />
                
                    <Separator orientation="vertical" />

                    <Button type="submit">
                        {isLoading ? (
                            <>
                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> &nbsp; Processing...
                            </>
                            ) : (
                            unit ? "Update unit" : "Save unit"
                        )}
                    </Button> 
                </div>
            </form>
        </Form>
        );
    };
  
export default ProductUnitForm;