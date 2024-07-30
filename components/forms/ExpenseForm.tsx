'use client'

import * as z from "zod";
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Expense } from "@/types";
import { ExpenseSchema, ExpenseStatus } from "@/types/data-schemas";
import { createItem, updateItem } from "@/lib/actions/expense.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button";
import { SubmitButton } from '../ui/submit-button';
import DepartmentSelector from "../layout/department-selector";
import StaffSelector from "../layout/staff-selector";
import ExpenseCategorySelector from "../layout/expense-category-selector";
import CurrencySelector from "../layout/currency-selector";
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import "react-day-picker/style.css";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import SupplierSelector from "../layout/supplier-selector";
import BranchSelector from "../layout/branch-selector";
import CustomFormField, {FormFieldType} from "@/components/ui/custom-input";

 const ExpenseForm = ({ item }: { item?: Expense | null }) => {
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof ExpenseSchema>>({
        resolver: zodResolver(ExpenseSchema),
        //@ts-ignore
        defaultValues: item ? item : {
            tax: 0,
            status: ExpenseStatus.UNPAID,
        },
    });

    const onInvalid = (errors : any ) => {
        toast({
            variant: "warning",
            title: "Uh oh! Something went wrong.", 
            description: "There was an issue submitting your form please try later"
        });
    }
        
    const onSubmit = async (data: z.infer<typeof ExpenseSchema>) => {
        setIsLoading(true);

        // Store file info in form data as
        let formData;

        //Check if document exists
        if (data.document && data.document?.length > 0) {
            const blobFile = new Blob([data.document[0]], {
                type: data.document[0].type,
            });

            formData = new FormData();
            formData.append("blobFile", blobFile);
            formData.append("fileName", data.document[0].name);
        }
        try {
            const expense = {
                name: data.name,
                category: data.category,
                amount: data.amount,
                status: data.status,
                tax: data.tax,
                expenseDate: Date.now(),
                currency: data.currency,
                dueDate: data.dueDate,
                description: data.description,
                document: data.document
                    ? formData
                    : undefined,
            }

            if (item) {
                //@ts-ignore
                await updateItem(item.$id!, expense);
                toast({
                    variant: "success",
                    title: "Success", 
                    description: "Expense details updated successfully!"
                });
            } else {
                //@ts-ignore
                await createItem(expense);
                toast({
                    variant: "success",
                    title: "Success", 
                    description: "Business expense recorded successfully!"
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
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="name"
                        label="Expense title *"
                        placeholder="Enter expense title"
                    />
                
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Expense category *</FormLabel>
                                    <ExpenseCategorySelector onChange={field.onChange} value={field.value} />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="amount"
                        label="Amount *"
                        type="number"
                        placeholder="Enter amount"
                    />

                    <CustomFormField
                        fieldType={FormFieldType.CUSTOM_SELECTOR}
                        control={form.control}
                        name="currency"
                        label="Currency *"
                        renderSkeleton={(field) => (
                            <CurrencySelector value={field.value} onChange={field.onChange}/>
                        )}
                    />

                    <CustomFormField
                        fieldType={FormFieldType.SKELETON}
                        control={form.control}
                        name="dueDate"
                        label="Due date *"
                        renderSkeleton={(field) => (
                            <FormItem className="flex flex-col mt-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button variant={"outline"} className={cn( "font-normal", !field.value && "text-muted-foreground" )}>
                                                {field.value ? ( format(field.value, "PPP") ) : (
                                                    <span>Select expense due date</span>
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
                                            disabled={ (date) => date < new Date("1970-01-01") }
                                        />
                                    </PopoverContent>
                                </Popover>
                            </FormItem>
                        )}
                    />

                    <CustomFormField
                        fieldType={FormFieldType.SKELETON}
                        control={form.control}
                        name="branch"
                        label="Branch"
                        renderSkeleton={(field) => (
                            <BranchSelector value={field.value} onChange={field.onChange}/>
                        )}
                    />

                    <CustomFormField
                        fieldType={FormFieldType.SKELETON}
                        control={form.control}
                        name="department"
                        label="Department"
                        renderSkeleton={(field) => (
                            <DepartmentSelector value={field.value} onChange={field.onChange}/>
                        )}
                    />

                    <CustomFormField
                        fieldType={FormFieldType.SKELETON}
                        control={form.control}
                        name="vendor"
                        label="Supplier"
                        renderSkeleton={(field) => (
                            <SupplierSelector value={field.value} onChange={field.onChange}/>
                        )}
                    />

                    <CustomFormField
                        fieldType={FormFieldType.SKELETON}
                        control={form.control}
                        name="staff"
                        label="Staff *"
                        renderSkeleton={(field) => (
                            <StaffSelector value={field.value} onChange={field.onChange}/>
                        )}
                    />

                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="tax"
                        label="Tax amount"
                        placeholder="Enter total tax amount"
                        type="number"
                    />

                    <CustomFormField
                        fieldType={FormFieldType.SKELETON}
                        control={form.control}
                        name="document"
                        label="Document"
                        placeholder="Upload document related to this expense"
                        renderSkeleton={(field) => (
                            <FormControl>
                                <Input type="file" value={field.value} onChange={field.onChange} />
                            </FormControl>
                        )}
                    />
                </div>

                <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="description"
                    label="Expense description"
                    placeholder="Short description of the expense"
                />
        
                <div className="flex h-5 items-center space-x-4">
                    <CancelButton />
                    <Separator orientation="vertical" />
                    <SubmitButton label={item ? "Update expense details" : "Record expense"} loading={isLoading} />
                </div>
            </form>
        </Form>
        );
    };
  
export default ExpenseForm;