'use client'

import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch"
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
import { Staff } from "@/types";
import { createItem, updateItem } from "@/lib/actions/staff.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button";
import { Gender, StaffSchema } from '@/types/data-schemas';
import DepartmentSelector from "@/components/layout/department-multiselector"
import BranchSelector from "@/components/layout/branch-multiselector";
import CountrySelector from "@/components/layout/country-selector";

import "react-day-picker/style.css"
import {
    Form,
    FormControl,
    FormDescription,
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
import { SubmitButton } from '../ui/submit-button';


const StaffForm = ({ item }: { item?: Staff | null }) => {
const [isLoading, setIsLoading] = useState(false);
const { toast } = useToast();

const form = useForm<z.infer<typeof StaffSchema>>({
    resolver: zodResolver(StaffSchema),
    defaultValues: item ? item : {
    status: true,
    posAccess: false,
    dashboardAccess: false,
    },
});

const onInvalid = (errors: any) => {
    toast({
        variant: "warning",
        title: "Data validation failed!", 
        description: "Please make sure all the fields marked with * are filled correctly."
    });
};

const onSubmit = async (data: z.infer<typeof StaffSchema>) => {
    setIsLoading(true);

    try {
        if (item) {
            await updateItem(item.$id!, data);
            toast({
            variant: "success",
            title: "Success",
            description: "Employee details updated successfully!"
            });
        } else {
            await createItem(data);
            toast({
            variant: "success",
            title: "Success",
            description: "Employee added successfully!"
            });
        }
    } catch (error: any) {
    toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was an issue submitting your form, please try later"
    });
    } finally {
    // Delay loading
    setTimeout(() => {
        setIsLoading(false);
    }, 1000);
    }
};

return (
<Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                        <Input
                        placeholder="Enter employee's name"
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
                    <FormLabel>Employee email address</FormLabel>
                    <FormControl>
                        <Input
                        type="email"
                        placeholder="Enter employee's email address"
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
                    <FormLabel>Employee phone number</FormLabel>
                    <FormControl>
                        <Input
                        type="tel"
                        placeholder="Enter employee's phone number"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Profile picture</FormLabel>
                    <FormControl>
                        <Input
                        type='file'
                        placeholder="Select employee's profile picture"
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
                    <FormLabel>Staff ID</FormLabel>
                    <FormControl>
                        <Input
                        placeholder="Enter employee's staff id"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                        <Input
                        placeholder="Enter employee's job title"
                        {...field}
                        />
                    </FormControl>
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
                        <FormControl>
                            <BranchSelector {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
            />

            <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                            <DepartmentSelector {...field} />
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
                        placeholder="Enter employee home address"
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
                name="joiningDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col mt-2">
                    <FormLabel>Date joined</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn( "font-normal", !field.value && "text-muted-foreground" )}
                            >
                            {field.value ? (
                                format(field.value, "PPP")
                            ) : (
                                <span>Select date</span>
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
                            disabled={(date) =>
                            date > new Date() || date < new Date("1970-01-01")
                            }
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
            />
            
            <FormField
                control={form.control}
                name="dashboardAccess"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Allow dashboard access *</FormLabel>
                        <FormControl>
                            <div className="mt-2">
                                <Switch
                                    id="dashboardAccess"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </div>
                        </FormControl>
                        <FormDescription>Invitation will be sent to email address</FormDescription>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="posAccess"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Allow POS application access *</FormLabel>
                        <FormControl>
                            <div className="mt-2">
                                <Switch
                                    id="posAccess"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </div>
                        </FormControl>
                        <FormDescription>User will be prompted to set credentials on first use</FormDescription>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 space-y-1">
            <h3 className="text-lg font-bold">Emergency contact details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
                control={form.control}
                name="emergencyName"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                        <Input
                        placeholder="Enter contact name"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="emergencyNumber"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                        <Input
                        type="tel"
                        placeholder="Enter phone number"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="emergencyRelationship"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <FormControl>
                        <Input
                        placeholder="Enter relationship"
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
            name="notes"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Admin notes</FormLabel>
                <FormControl>
                    <Textarea
                        placeholder="Any other important details about the employee"
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
            <SubmitButton label={item ? "Update employee details" : "Save employee details"} loading={isLoading} />
        </div>
    </form>
</Form>
);
};
  
export default StaffForm;