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
import { createBranch, updateBranch } from "@/lib/actions/branch.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button";


    const formSchema = z.object({
        name: z.string(),
        email: z.string().email("Invalid email address"),
        phoneNumber: z.number(),
        address: z.string().optional(),
        city: z.string().optional(),
        openingTime: z.string().optional(),
        closingTime: z.string().optional(),
        status: z.boolean(),
    });
  
    const BranchForm = ({ item }: { item?: Branch | null }) => {
        const router = useRouter();
        const [isLoading, setIsLoading] = useState(false);
        const { toast } = useToast()

        const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: item ? item : {
                status: false,
            },
        });

        const onInvalid = (errors : any ) => {
            console.error("Creating branch failed: ", JSON.stringify(errors));
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
                    await updateBranch(item.$id, data);
                    toast({
                        variant: "default",
                        title: "Success", 
                        description: "Branch updated succesfully!"
                    });
                } else {
                    await createBranch(data);
                    toast({
                        variant: "default",
                        title: "Success", 
                        description: "Branch created succesfully!"
                    });
                }
                
                // Redirect to the list page after submission
                router.push("/branches");
                router.refresh();
                setIsLoading(false);
            } catch (error) {
                console.error("Creating branch failed: ", error);
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
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Branch name</FormLabel>
                        <FormControl>
                            <Input
                            placeholder="Branch full name (eg. Nairobi Branch)"
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
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Branch email address</FormLabel>
                            <FormControl>
                                <Input
                                type="email"
                                placeholder="Enter branch email address"
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
                            <FormLabel>Branch phone number</FormLabel>
                            <FormControl>
                                <Input
                                type="tel"
                                placeholder="Enter branch phone number"
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
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Branch address</FormLabel>
                                <FormControl>
                                    <Input
                                    placeholder="Enter branch location"
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
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Branch location</FormLabel>
                                <FormControl>
                                    <Input
                                    placeholder="Enter branch location"
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
                        name="openingTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Branch opening time</FormLabel>
                                <FormControl>
                                    <Input
                                    placeholder="Select branch opening time"
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
                        name="closingTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Branch closing time</FormLabel>
                                <FormControl>
                                    <Input
                                    placeholder="Enter branch closing time"
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
                            item ? "Update branch" : "Save branch"
                        )}
                    </Button> 
                </div>
            </form>
        </Form>
        );
    };
  
export default BranchForm;