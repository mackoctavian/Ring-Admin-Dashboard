'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch"
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Customer } from "@/types";
import { createItem, updateItem } from "@/lib/actions/customer.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button";
import { SubmitButton } from "@/components/ui/submit-button"
import CountrySelector from "../layout/country-selector";
import {
  Form,
  FormControl,
  FormItem,
} from "@/components/ui/form";
import {SelectItem} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {CustomerSchema, Gender} from "@/types/data-schemas";
import BranchSelector from "../layout/branch-selector";
import "react-day-picker/style.css"
import CustomFormField, {FormFieldType} from "@/components/ui/custom-input";
  
const CustomerForm = ({ item }: { item?: Customer | null }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast()

    const form = useForm<z.infer<typeof CustomerSchema>>({
        resolver: zodResolver(CustomerSchema),
        //handle nullable inputs & objects
        //@ts-ignore
        defaultValues: item ? { ...item, branch: item.branch.$id ?? '', allowNotifications: true }: {}
    });

    const onInvalid = (errors : any ) => {
        toast({
            variant: "warning",
            title: 'Data validation failed!',
            description: 'Please make sure all the fields marked with * are filled correctly.',
        });
    }

    const onSubmit = async (data: z.infer<typeof CustomerSchema>) => {
        setIsLoading(true);

        try {
            if (item) {
                //@ts-ignore
                await updateItem(item.$id!, data);
                toast({
                    variant: "success",
                    title: "Success",
                    description: "Customer details updated successfully!"
                });
            } else {
                //@ts-ignore
                await createItem(data);
                toast({
                    variant: "success",
                    title: "Success",
                    description: "Customer added successfully!"
                });
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was an issue submitting your form, please try later"
            });
        } finally {
            setIsLoading(false);
        }
    };

return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="name"
                    label="Customer's full name *"
                    placeholder="Enter customer's full name"
                />

                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="email"
                    label="Email address *"
                    placeholder="Enter customer's email address"
                    type="email"
                />

                <CustomFormField
                    fieldType={FormFieldType.PHONE_INPUT}
                    control={form.control}
                    name="phoneNumber"
                    label="Phone number"
                    placeholder="Enter customer's phone number"
                />

                <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="registrationBranch"
                    label="Registration branch *"
                    renderSkeleton={(field) => (
                        <BranchSelector value={field.value} onChange={field.onChange}/>
                    )}
                />

                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="address"
                    label="Customer's physical address"
                    placeholder="Enter customer's address"
                />

                <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="gender"
                    label="Gender *"
                    placeholder="Select gender">
                        <SelectItem value={Gender.UNDISCLOSED}>Do not disclose</SelectItem>
                        <SelectItem value={Gender.MALE}>Male</SelectItem>
                        <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                </CustomFormField>

                <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="nationality"
                    label="Nationality *"
                    renderSkeleton={(field) => (
                        <CountrySelector value={field.value} onChange={field.onChange}/>
                    )}
                />

                <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="dateOfBirth"
                    label="Date of birth"
                    renderSkeleton={(field) => (
                        <FormItem className="flex flex-col mt-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant={"outline"} className={cn( "font-normal", !field.value && "text-muted-foreground" )}>
                                            {field.value ? ( format(field.value, "PPP") ) : (
                                                <span>Select date of birth</span>
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
                                        disabled={ (date) => date > new Date() || date < new Date("1970-01-01") }
                                    />
                                </PopoverContent>
                            </Popover>
                        </FormItem>
                    )}
                />

                <CustomFormField
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="allowNotifications"
                    label="Allow notifications? *"
                    renderSkeleton={(field) => (
                        <div className="mt-2">
                            <Switch
                                id="allowNotifications"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </div>
                    )}
                />

            </div>

            <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="notes"
                label="Admin notes"
                placeholder="Any other important details about the customer"
            />

            <div className="flex h-5 items-center space-x-4">
                <CancelButton />
                <Separator orientation="vertical" />
                <SubmitButton loading={isLoading} label={ item ? "Update customer details" : "Save customer details" } />
            </div>
        </form>
    </Form>
    );
};

export default CustomerForm;