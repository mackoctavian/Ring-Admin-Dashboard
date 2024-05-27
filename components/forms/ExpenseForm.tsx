'use client'

import * as z from "zod";
import React, { useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input";
import { Expense, Staff, Department, Supplier } from "@/types";
import { ExpenseSchema } from "@/types/data-schemas";
import { createItem, updateItem } from "@/lib/actions/expense.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button";
import DepartmentSelector from "../layout/department-selector";
import StaffSelector from "../layout/staff-selector";
import ExpenseCategorySelector from "../layout/expense-category-selector";
import CurrencySelector from "../layout/currency-selector";
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
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

 const ExpenseForm = ({ item }: { item?: Expense | null }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const [selectedStaff, setSelectedStaff] = useState<Staff | undefined>(
        item ? item.staff : undefined
    );
    const [selectedDepartment, setSelectedDepartment] = useState<Department | undefined>(
        item ? item.department : undefined
    );
    const [selectedCurrency, setSelectedCurrency] = useState<string | undefined>(
        item ? item.currency : undefined
    );
    const [selectedVendor, setSelectedVendor] = useState<Supplier | undefined>(
        item ? item.vendor : undefined
    );
    
    const form = useForm<z.infer<typeof ExpenseSchema>>({
        resolver: zodResolver(ExpenseSchema),
        defaultValues: item ? { ...item, staff: item.staff, department: item.department, vendor: item.vendor } : {
            tax: 0
            // type: CategoryType.PRODUCT,
            // description: '',
            // status: false,
        },
    });

    const onInvalid = (errors : any ) => {
        toast({
            variant: "warning",
            title: "Uh oh! Something went wrong.", 
            description: "There was an issue submitting your form please try later"
        });
        console.error(JSON.stringify(errors));
    }
        
    const onSubmit = async (data: z.infer<typeof ExpenseSchema>) => {
        setIsLoading(true);
    
        try {
            if (item) {
                await updateItem(item.$id, data);
                toast({
                    variant: "success",
                    title: "Success", 
                    description: "Expense details updated succesfully!"
                });
            } else {
                await createItem(data);
                toast({
                    variant: "success",
                    title: "Success", 
                    description: "Business expense recorded succesfully!"
                });
            }
            
            // Redirect to the list page after submission
            router.push("/expenses");
            router.refresh();
            setIsLoading(false);
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

    useEffect(() => {
        if (item) {
          setSelectedStaff(item.staff);
        }
      }, [item]);

    useEffect(() => {
        if (item) {
          setSelectedDepartment(item.department);
        }
    }, [item]);

    useEffect(() => {
        if (item) {
          setSelectedVendor(item.vendor);
        }
    }, [item]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Expense title</FormLabel>
                            <FormControl>
                                <Input
                                placeholder="Enter expense title"
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
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Expense Category</FormLabel>
                                    <ExpenseCategorySelector onChange={field.onChange} value={field.value} />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="vendor"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vendor</FormLabel>
                                <SupplierSelector
                                    value={selectedVendor}
                                    onChange={(suppl) => { setSelectedVendor(suppl); field.onChange(suppl); }}
                                />
                                <FormMessage />
                            </FormItem>
                            )}
                    />

                    <FormField
                        control={form.control}
                        name="staff"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Staff</FormLabel>
                                <StaffSelector
                                    value={selectedStaff}
                                    onChange={(stff) => { setSelectedStaff(stff); field.onChange(stff); }}
                                />
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
                                <DepartmentSelector
                                    value={selectedDepartment}
                                    onChange={(dpt) => { setSelectedDepartment(dpt); field.onChange(dpt); }}
                                />
                                <FormMessage />
                            </FormItem>
                            )}
                    />

                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Amount"
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
                        name="tax"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tax amount</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Enter total tax amount"
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
                        name="currency"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Currency</FormLabel>
                                <FormControl>
                                    <CurrencySelector
                                        value={selectedCurrency}
                                        onChange={(curr) => { setSelectedCurrency(curr); field.onChange(curr); }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="expenseDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col mt-2">
                                <FormLabel>Expense date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant={"outline"} className={cn( "font-normal", !field.value && "text-muted-foreground" )}>
                                            {field.value ? ( format(field.value, "PPP") ) : (
                                                <span>Select expense date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={ (date) => date > new Date() || date < new Date("1970-01-01") }
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col mt-2">
                                <FormLabel>Due date</FormLabel>
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
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={ (date) => date > new Date() || date < new Date("1970-01-01") }
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="document"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Document</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        placeholder="Upload document related to this expense"
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
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Expense description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Short description of the expense"
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

                    <Button type="submit">
                        {isLoading ? (
                            <>
                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> &nbsp; Processing...
                            </>
                            ) : (
                            item ? "Update expense details" : "Record expense"
                        )}
                    </Button> 
                </div>
            </form>
        </Form>
        );
    };
  
export default ExpenseForm;