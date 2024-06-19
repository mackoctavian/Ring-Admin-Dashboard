'use client'

import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
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
import { Input } from "@/components/ui/input";
import { recordPayment } from "@/lib/actions/expense.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button";
import { SubmitButton } from "../ui/submit-button";
import { Button } from "../ui/button";
import { ExpensePaymentSchema, PaymentMethod } from "@/types/data-schemas"
import ExpenseSelector from "@/components/layout/expense-selector"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "@radix-ui/react-icons"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import "react-day-picker/style.css"

 const RecordPaymentForm = () => {
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof ExpensePaymentSchema>>({
        resolver: zodResolver(ExpensePaymentSchema),
        defaultValues: {},
    });

    const onInvalid = (errors : any ) => {
        toast({
            variant: "warning",
            title: "Data validation failed!", 
            description: "Please make sure all the fields marked with * are filled correctly."
        });
    }

    const onSubmit = async (data: z.infer<typeof ExpensePaymentSchema>) => {
        setIsLoading(true);
    
        try {
            await recordPayment(data);
            toast({
                variant: "success",
                title: "Success", 
                description: "Repayment recorded succesfully!"
            })
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
                        name="expense"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Expense *</FormLabel>
                            <FormControl>
                                <ExpenseSelector {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="paymentDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col mt-2">
                            <FormLabel>Payment date *</FormLabel>
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
                        name="paymentMethod"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Payment method *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select payment method" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value={PaymentMethod.CASH}>Cash</SelectItem>
                                    <SelectItem value={PaymentMethod.MOBILE}>Mobile money</SelectItem>
                                    <SelectItem value={PaymentMethod.BANK}>Bank transfer</SelectItem>
                                    <SelectItem value={PaymentMethod.CARD}>Card</SelectItem>
                                    <SelectItem value={PaymentMethod.CHEQUE}>Cheque</SelectItem>
                                    <SelectItem value={PaymentMethod.OTHER}>Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount *</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Repayment amount"
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
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Any other information regarding this payment"
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
                    <SubmitButton label={"Record expense repayment"} loading={isLoading} />
                </div>
            </form>
        </Form>
        );
    };
  
export default RecordPaymentForm;