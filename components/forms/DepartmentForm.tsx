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
import { Department } from "@/types";
import { createDepartment, updateDepartment } from "@/lib/actions/department.actions"
import { toast } from "sonner"
import CancelButton from "../layout/cancel-button";

const formSchema = z.object({
    shortName: z.string().min(1),
    name: z.string().min(1),
    business: z.string().min(1),
    status: z.boolean(),
});
  
  const DepartmentForm = ({ item }: { item?: Department | null }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: item ? item : {
        name: "",
        shortName: "",
        business: "664338f2002b67031e4c",
        status: false,
      },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
      setIsLoading(true);
  
      try {
        console.error("submitting data:", data);
        if (item) {
            await updateDepartment(item.$id, data);
            toast("Department updated succesfully!");
        } else {
            await createDepartment(data);
            toast("Department created succesfully!");
        }
        
        // Redirect to list page after submission
        router.push("/departments");
      } catch (error) {
        console.error("Creating department failed: ", error);
      }
  
      setIsLoading(false);
    };
  
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Department name</FormLabel>
                        <FormControl>
                            <Input
                            placeholder="Enter department name"
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
                                placeholder="Enter department short name ( eg. HR )"
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
                            item ? "Update department" : "Create department"
                        )}
                    </Button> 
                </div>
            </form>
        </Form>
        );
    };
  
export default DepartmentForm;