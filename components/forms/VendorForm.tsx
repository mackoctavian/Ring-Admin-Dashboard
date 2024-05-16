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
import { Vendor } from "@/types";
import { createVendor, updateVendor } from "@/lib/actions/vendor.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button";
import { Textarea } from "@/components/ui/textarea"


    const phoneNumberRegex = /^[0-9]{10,15}$/;


    const formSchema = z.object({
        name: z.string(),
        email: z.string().email("Invalid email address"),
        phoneNumber:  z.string().regex(phoneNumberRegex, "Invalid phone number. It should contain 10 to 15 digits."),
        address: z.string().optional(),
        description: z.string().optional(),
        contactPersonName: z.string().optional(),
        status: z.boolean(),
    });
  
    const VendorForm = ({ item }: { item?: Vendor | null }) => {
        const router = useRouter();
        const [isLoading, setIsLoading] = useState(false);
        const { toast } = useToast()

        const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: item ? item : {
                status: false,
                contactPersonName: ""
            },
        });

        const onInvalid = (errors : any ) => {
            console.error("Creating vendor failed: ", JSON.stringify(errors));
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.", 
                description: "There was an issue submitting your form please try later"
            });
        }

        const onSubmit = async (data: z.infer<typeof formSchema>) => {
            setIsLoading(true);
        
            try {
                if (item) {
                    await updateVendor(item.$id, data);
                    toast({
                        variant: "default",
                        title: "Success", 
                        description: "Vendor updated succesfully!"
                    });
                } else {
                    await createVendor(data);
                    toast({
                        variant: "default",
                        title: "Success", 
                        description: "Vendor created succesfully!"
                    });
                }
                
                // Redirect to the list page after submission
                router.push("/vendors");
                router.refresh();
                setIsLoading(false);
            } catch (error) {
                console.error("Creating vendor failed: ", error);
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.", 
                    description: "There was an issue submitting your form please try later"
                });
                setIsLoading(false);
            }
        };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vendor name</FormLabel>
                            <FormControl>
                                <Input
                                placeholder="Enter vendor full name"
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
                    name="contactPersonName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contact person</FormLabel>
                            <FormControl>
                                <Input
                                placeholder="Enter contact person's full name"
                                className="input-class"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vendor email address</FormLabel>
                            <FormControl>
                                <Input
                                type="email"
                                placeholder="Enter vendor email address"
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
                    name="phoneNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vendor phone number</FormLabel>
                            <FormControl>
                                <Input
                                type="tel"
                                placeholder="Enter vendor phone number"
                                className="input-class"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>

                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vendor address</FormLabel>
                                <FormControl>
                                    <Input
                                    placeholder="Enter vendor address"
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
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Short notes about the vendor"
                                className="resize-none"
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
                            item ? "Update vendor" : "Save vendor"
                        )}
                    </Button> 
                </div>
            </form>
        </Form>
        );
    };
  
export default VendorForm;