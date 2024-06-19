'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input";
import { Customer } from "@/types";
import { createItem, updateItem } from "@/lib/actions/customer.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button";
import { SubmitButton } from "@/components/ui/submit-button"
import CountrySelector from "../layout/country-selector";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CustomerSchema, Gender } from "@/types/data-schemas";
import BranchSelector from "../layout/branch-selector";
import "react-day-picker/style.css"
  
const CustomerForm = ({ item }: { item?: Customer | null }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast()

    const form = useForm<z.infer<typeof CustomerSchema>>({
        resolver: zodResolver(CustomerSchema),
        defaultValues: item ? item : {
            status: true,
            allowNotifications: true,
        },
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
                await updateItem(item.$id, data);
                toast({
                    variant: "success",
                    title: "Success",
                    description: "Customer details updated succesfully!"
                });
            } else {
                await createItem(data);
                toast({
                    variant: "success",
                    title: "Success",
                    description: "Customer added succesfully!"
                });
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was an issue submitting your form, please try later"
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Full name</FormLabel>
                        <FormControl>
                            <Input
                            placeholder="Enter customer's full name"
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
                        <FormLabel>Email address</FormLabel>
                        <FormControl>
                            <Input
                            type="email"
                            placeholder="Enter customer's email address"
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
                        <FormLabel>Phone number</FormLabel>
                        <FormControl>
                            <Input
                            type="tel"
                            placeholder="Enter customer's phone number"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Customer Unique Code ( Auto generated )</FormLabel>
                        <FormControl>
                            <Input
                            placeholder="Enter customer's unique code"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="registrationBranch"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Registration branch</FormLabel>
                        <FormControl>
                            <BranchSelector {...field} />
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
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                            <Input
                            placeholder="Enter customer's address"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value={Gender.UNDISCLOSED}>Do not disclose</SelectItem>
                                <SelectItem value={Gender.MALE}>Male</SelectItem>
                                <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nationality</FormLabel>
                            <CountrySelector onChange={field.onChange} value={field.value} />
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                        <FormItem className="flex flex-col mt-2">
                            <FormLabel>Date of birth</FormLabel>
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
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    control={form.control}
                    name="allowNotifications"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Allow notifications *</FormLabel>
                            <FormControl>
                                <div className="mt-2">
                                    <Switch
                                        id="allowNotifications"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />

            </div>
            <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Admin notes</FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder="Any other important details about the customer"
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
                <SubmitButton loading={isLoading} label={ item ? "Update customer details" : "Save customer details" } />
            </div>
        </form>
    </Form>
    );
};

export default CustomerForm;