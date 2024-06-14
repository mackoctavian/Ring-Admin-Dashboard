'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Section, Branch } from "@/types";
import { Textarea } from "@/components/ui/textarea"
import { createItem, updateItem } from "@/lib/actions/section.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button";
import { SectionSchema, SectionType } from "@/types/data-schemas";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import BranchSelector from "../layout/branch-selector";
  
const SectionForm = ({ item }: { item?: Section | null }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast()

    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(item?.branch ?? null);
    useEffect(() => {
        if (item && item.branch) {
        setSelectedBranch(item.branch);
        } else {
        setSelectedBranch(null);
        }
    }, [item]);

    const handleBranchChange = (branch: Branch | null) => {
        setSelectedBranch(branch);
    };

    const form = useForm<z.infer<typeof SectionSchema>>({
        resolver: zodResolver(SectionSchema),
        defaultValues: item ? item : {
            status: false,
        },
    });

    const onInvalid = (errors : any ) => {
        console.error("Creating section failed: ", JSON.stringify(errors));
        toast({
            variant: "warning",
            title: "Data validation failed!", 
            description: "Please make sure all the fields marked with * are filled correctly."
        });
    }

    const onSubmit = async (data: z.infer<typeof SectionSchema>) => {
        setIsLoading(true);
    
        try {
            if (item) {
                await updateItem(item!.$id, data);
                toast({
                    variant: "success",
                    title: "Success", 
                    description: "Section / space updated succesfully!"
                });
            } else {
                await createItem(data);
                toast({
                    variant: "success",
                    title: "Success", 
                    description: "Section / space created succesfully!"
                });
            }
            
            // Redirect to the list page after submission
            router.push("/sections");
            router.refresh();
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
            }, 2000); 
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
                        <FormLabel>Section / space name *</FormLabel>
                        <FormControl>
                            <Input
                            placeholder="Section name ( eg. Room 01 / Table 01 )"
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
                    <FormLabel>Section / space type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select section / space type" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value={SectionType.ROOM}>Room</SelectItem>
                            <SelectItem value={SectionType.SEAT}>Seat</SelectItem>
                            <SelectItem value={SectionType.TABLE}>Table</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="branch"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Branch *</FormLabel>
                        <BranchSelector 
                            value={selectedBranch}
                            onChange={(branch) => { setSelectedBranch(branch); field.onChange(branch); }}
                            />
                    <FormMessage />
                    </FormItem>
                )}
                />


            </div>

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

            <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter service description"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
        
        

            

    
            <div className="flex h-5 items-center space-x-4">
                <CancelButton />
            
                <Separator orientation="vertical" />

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> &nbsp; Processing...
                        </>
                        ) : (
                        item ? "Update section / space" : "Save section / space"
                    )}
                </Button> 
            </div>
        </form>
    </Form>
    );
};
  
export default SectionForm;