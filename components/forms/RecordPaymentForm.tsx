'use client'

import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "@/components/ui/separator"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {SelectItem} from "@/components/ui/select"
import { recordPayment } from "@/lib/actions/expense.actions"
import { useToast } from "@/components/ui/use-toast"
import CancelButton from "../layout/cancel-button";
import { SubmitButton } from "../ui/submit-button";
import { Button } from "../ui/button";
import { ExpensePaymentSchema, PaymentMethod} from "@/types/data-schemas"
import ExpenseSelector from "@/components/layout/expense-selector"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "@radix-ui/react-icons"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import CustomFormField, {FormFieldType} from "@/components/ui/custom-input";
import "react-day-picker/style.css"
import CurrencySelector from "@/components/layout/currency-selector";

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
                description: "Repayment recorded successfully!"
            })
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <CustomFormField
                        fieldType={FormFieldType.SKELETON}
                        control={form.control}
                        name="expense"
                        label="Expense"
                        renderSkeleton={(field) => (
                            <ExpenseSelector status="INCOMPLETE" value={field.value} onChange={field.onChange}/>
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

                    <CustomFormField
                        fieldType={FormFieldType.SELECT}
                        control={form.control}
                        name="paymentMethod"
                        label="Payment method *"
                        placeholder="Select payment method">
                            <SelectItem value={PaymentMethod.CASH}>Cash</SelectItem>
                            <SelectItem value={PaymentMethod.MOBILE}>Mobile money</SelectItem>
                            <SelectItem value={PaymentMethod.BANK}>Bank transfer</SelectItem>
                            <SelectItem value={PaymentMethod.CARD}>Card</SelectItem>
                            <SelectItem value={PaymentMethod.CHEQUE}>Cheque</SelectItem>
                            <SelectItem value={PaymentMethod.OTHER}>Other</SelectItem>
                    </CustomFormField>

                    <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        control={form.control}
                        name="amount"
                        label="Repayment amount *"
                        placeholder="Repayment amount"
                        type="number"
                    />

                    <CustomFormField
                        fieldType={FormFieldType.SKELETON}
                        control={form.control}
                        name="currency"
                        label="Currency *"
                        renderSkeleton={(field) => (
                            <CurrencySelector value={field.value} onChange={field.onChange}/>
                        )}
                    />
                </div>

                <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="notes"
                    label="Notes regarding payment"
                    placeholder="Any other information regarding this payment"
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