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
import { Staff } from "@/types";
import { createItem, updateItem } from "@/lib/actions/staff.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button";
import {Gender, StaffSchema} from '@/types/data-schemas';
import DepartmentSelector from "@/components/layout/department-multiselector"
import BranchSelector from "@/components/layout/branch-multiselector";
import CountrySelector from "@/components/layout/country-selector";
import { Form, FormControl, FormItem } from "@/components/ui/form";
import {SelectItem} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import { SubmitButton } from '../ui/submit-button';
import CustomFormField, {FormFieldType} from "@/components/ui/custom-input";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {FileUploader} from "@/components/ui/custom-file-uploader";
import "react-day-picker/style.css"


const StaffForm = ({ item }: { item?: Staff | null }) => {
const [isLoading, setIsLoading] = useState(false);
const { toast } = useToast();

const form = useForm<z.infer<typeof StaffSchema>>({
    resolver: zodResolver(StaffSchema),
    //@ts-ignore
    defaultValues: item ? { ...item, notes: item.notes ?? '', email: item.email ?? null, address: item.address ?? '' }: {
        status: true,
        posAccess: false,
        dashboardAccess: false
    }
});

const onInvalid = (errors: any) => {
    console.log(errors)
    toast({
        variant: "warning",
        title: "Data validation failed!", 
        description: "Please make sure all the fields marked with * are filled correctly."
    });
};

const onSubmit = async (data: z.infer<typeof StaffSchema>) => {
    setIsLoading(true);

    let formData;

    if (data.image && data.image?.length > 0) {
        const blobFile = new Blob([data.image[0]], {
            type: data.image[0].type,
        });

        formData = new FormData();
        formData.append("blobFile", blobFile);
        formData.append("fileName", data.image[0].name);
    }

    const staffData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        code: data.code,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        nationality: data.nationality,
        joiningDate: data.joiningDate,
        jobTitle: data.jobTitle,
        emergencyNumber: data.emergencyNumber,
        emergencyName: data.emergencyName,
        emergencyRelationship: data.emergencyRelationship,
        address: data.address,
        notes: data.notes,
        department: data.department,
        branch: data.branch,
        image: data.image
            ? formData
            : undefined,
        status: data.status,
        posAccess: data.posAccess,
        dashboardAccess: data.dashboardAccess,
    };

    try {
        if (item) {
            //@ts-ignore
            await updateItem(item.$id, staffData, item.image, item.imageId)
            toast({
                variant: "success",
                title: "Success",
                description: "Employee details updated successfully!"
            });
        } else {
            //@ts-ignore
            await createItem(staffData);
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
        setIsLoading(false);
    }
};

return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                {/* Left Column */}
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal details</CardTitle>
                            <CardDescription>Enter personal details of the staff member</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4">

                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name={`firstName`}
                                    label="First name *"
                                    placeholder="Enter employee's first name"
                                />

                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name={`lastName`}
                                    label="Last name *"
                                    placeholder="Enter employee's last name"
                                />

                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name={`email`}
                                    label="Email address"
                                    placeholder="Enter employee's email address"
                                    type="email"
                                />

                                <CustomFormField
                                    fieldType={FormFieldType.PHONE_INPUT}
                                    control={form.control}
                                    name={`phoneNumber`}
                                    label="Phone number *"
                                    placeholder="Enter employee's phone number"
                                />

                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name={`code`}
                                    label="Staff ID"
                                    placeholder="Enter employee's staff id"
                                />

                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name={`jobTitle`}
                                    label="Job title"
                                    placeholder="Enter employee's job title"
                                />

                                <CustomFormField
                                    fieldType={FormFieldType.CUSTOM_SELECTOR}
                                    control={form.control}
                                    name={`branch`}
                                    label="Branch *"
                                    renderSkeleton={(field) => (
                                        <BranchSelector value={field.value} onChange={field.onChange}/>
                                    )}
                                />

                                <CustomFormField
                                    fieldType={FormFieldType.CUSTOM_SELECTOR}
                                    control={form.control}
                                    name={`department`}
                                    label="Department *"
                                    renderSkeleton={(field) => (
                                        <DepartmentSelector value={field.value} onChange={field.onChange}/>
                                    )}
                                />

                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name={`address`}
                                    label="Address"
                                    placeholder="Enter employee's home address"
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
                                    fieldType={FormFieldType.CUSTOM_SELECTOR}
                                    control={form.control}
                                    name={`nationality`}
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
                                                        <Button variant={"outline"}
                                                                className={cn("font-normal", !field.value && "text-muted-foreground")}>
                                                            {field.value ? (format(field.value, "PPP")) : (
                                                                <span>Select date of birth</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
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
                                                        disabled={(date) => date > new Date() || date < new Date("1970-01-01")}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormItem>
                                    )}
                                />

                                <CustomFormField
                                    fieldType={FormFieldType.SKELETON}
                                    control={form.control}
                                    name="joiningDate"
                                    label="Date joined *"
                                    renderSkeleton={(field) => (
                                        <FormItem className="flex flex-col mt-2">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button variant={"outline"}
                                                                className={cn("font-normal", !field.value && "text-muted-foreground")}>
                                                            {field.value ? (format(field.value, "PPP")) : (
                                                                <span>Select date joined</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
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
                                                        disabled={(date) => date > new Date() || date < new Date("1970-01-01")}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormItem>
                                    )}
                                />

                                <CustomFormField
                                    fieldType={FormFieldType.SKELETON}
                                    control={form.control}
                                    name="status"
                                    label="Status *"
                                    renderSkeleton={(field) => (
                                        <div className="mt-2">
                                            <Switch
                                                id="status"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Emergency contact details</CardTitle>
                            <CardDescription>Enter details for the next of kin </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name={`emergencyName`}
                                    label="Emergency contact's name"
                                    placeholder="Enter full name"
                                />

                                <CustomFormField
                                    fieldType={FormFieldType.PHONE_INPUT}
                                    control={form.control}
                                    name={`emergencyNumber`}
                                    label="Emergency contact's phone number"
                                    placeholder="Enter phone number"
                                />

                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name={`emergencyRelationship`}
                                    label="Emergency contact's relationship"
                                    placeholder="Enter emergency contact's relationship"
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>HR notes</CardTitle>
                            <CardDescription>Any other notes relating to this employee</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-4">
                                <CustomFormField
                                    fieldType={FormFieldType.TEXTAREA}
                                    control={form.control}
                                    name={`notes`}
                                    description={`Notes are only visible to other admins`}
                                    placeholder="Any other important details about the employee"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                {/* Right Column */}
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Manage permissions</CardTitle>
                            <CardDescription>Set what access the employee has</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6">
                                <CustomFormField
                                    fieldType={FormFieldType.SKELETON}
                                    control={form.control}
                                    name="dashboardAccess"
                                    label="Allow dashboard access? *"
                                    description="Invitation will be sent to email address"
                                    renderSkeleton={(field) => (
                                        <div className="mt-2">
                                            <Switch
                                                id="dashboardAccess"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </div>
                                    )}
                                />

                                <CustomFormField
                                    fieldType={FormFieldType.SKELETON}
                                    control={form.control}
                                    name="posAccess"
                                    label="Allow POS application access? *"
                                    description="Staff will be prompted to set credentials on first use"
                                    renderSkeleton={(field) => (
                                        <div className="mt-2">
                                            <Switch
                                                id="posAccess"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile picture</CardTitle>
                            <CardDescription>Upload profile image for the employee</CardDescription>
                        </CardHeader>
                        <CardContent>
                                <CustomFormField
                                    fieldType={FormFieldType.SKELETON}
                                    control={form.control}
                                    name="image"
                                    renderSkeleton={(field) => (
                                        <FormControl>
                                            <FileUploader files={field.value} onChange={field.onChange}/>
                                        </FormControl>
                                    )}
                                />
                        </CardContent>
                    </Card>
                </div>
                <div className="flex h-5 items-center space-x-4">
                    <CancelButton/>
                    <Separator orientation="vertical"/>
                    <SubmitButton label={item ? "Update employee details" : "Save employee details"} loading={isLoading}/>
                </div>
            </div>
        </form>
    </Form>
    );
};

export default StaffForm;