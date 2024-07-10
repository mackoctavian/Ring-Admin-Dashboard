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
import { Branch } from "@/types";
import { createItem, updateItem } from "@/lib/actions/branch.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button";
import TimeSelector from "../layout/time-selector";
import DaysSelector from "../layout/days-selector";
import { BranchSchema } from "@/types/data-schemas";

const BranchForm = ({ item }: { item?: Branch | null }) => {

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof BranchSchema>>({
        resolver: zodResolver(BranchSchema),
        defaultValues: item ? {
                ...item,
                daysOpen: item.daysOpen ? JSON.parse(item.daysOpen) : [] 
              } : {
                status: false,
                daysOpen: [],
              },
          });

    const onInvalid = (errors : any ) => {
        console.error("Creating branch failed: ", JSON.stringify(errors));
        toast({
            variant: "warning",
            title: "Data validation failed!", 
            description: "Please make sure all the fields marked with * are filled correctly."
        });
    }

    const onSubmit = async (data: z.infer<typeof BranchSchema>) => {
        setIsLoading(true);
        try {
            if (item) {
                await updateItem(item.$id!, data);
                toast({
                    variant: "success",
                    title: "Success", 
                    description: "Branch details have been updated succesfully!"
                });
            } else {
                await createItem(data);
                toast({
                    variant: "success",
                    title: "Success", 
                    description: "Branch has been created succesfully!"
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

            <div className="grid grid-cols-3 gap-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Branch name</FormLabel>
                        <FormControl>
                            <Input
                            placeholder="Branch full name (eg. Nairobi Branch)"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Branch email address</FormLabel>
                        <FormControl>
                            <Input
                            type="email"
                            placeholder="Enter branch email address"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Branch phone number</FormLabel>
                        <FormControl>
                            <Input
                            type="tel"
                            placeholder="Enter branch phone number"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Branch address</FormLabel>
                            <FormControl>
                                <Input
                                placeholder="Enter branch location"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Branch location</FormLabel>
                                <FormControl>
                                    <Input
                                    placeholder="Enter branch location"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="staffCount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Number of staff</FormLabel>
                                <FormControl>
                                    <Input
                                    type="number"
                                    min="1"
                                    placeholder="Enter number of staff"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="daysOpen"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Branch open days</FormLabel>
                                <FormControl>
                                    <DaysSelector 
                                        placeholder="Select days branch is open"
                                        field={field}
                                        />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                    />

                    
                    <FormField
                        control={form.control}
                        name="openingTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Branch opening time</FormLabel>
                                <FormControl>
                                    <TimeSelector {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                    />

                    <FormField
                        control={form.control}
                        name="closingTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Branch closing time</FormLabel>
                                <FormControl>
                                    <TimeSelector {...field} />
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

            <div className="flex h-5 items-center space-x-4">
                <CancelButton />
            
                <Separator orientation="vertical" />

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> &nbsp; Processing...
                        </>
                        ) : (
                        item ? "Update branch details" : "Create branch"
                    )}
                </Button> 
            </div>
        </form>
    </Form>
    );
};
  
export default BranchForm;