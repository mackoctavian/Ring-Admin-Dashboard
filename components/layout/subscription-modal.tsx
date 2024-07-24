'use client'

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {Button, buttonVariants} from "@/components/ui/button";
import {Form, FormControl} from "@/components/ui/form";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import CustomFormField, {FormFieldType} from "@/components/ui/custom-input";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";
import {IconBrandPaypal, IconCreditCardPay, IconDeviceLandlinePhone} from "@tabler/icons-react";
import SubscriptionPlanSelector from "@/components/layout/subscription-plan-selector";
import {SelectItem} from "@/components/ui/select";
import * as React from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {SubscriptionPaymentSchema} from "@/types/data-schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {processPayment} from "@/lib/actions/billing.actions";
import {useState} from "react";
import {useToast} from "@/components/ui/use-toast";
import {useUser} from "@clerk/nextjs";
import {cn} from "@/lib/utils";
import {Plus} from "lucide-react";
import {SubmitButton} from "@/components/ui/submit-button";

export default function SubscriptionModal() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { user } = useUser();

    const form = useForm<z.infer<typeof SubscriptionPaymentSchema>>({
        resolver: zodResolver(SubscriptionPaymentSchema),
        defaultValues: {
            fullName: user?.fullName || '',
            email: user?.primaryEmailAddress?.emailAddress || '',
            phoneNumber: user?.primaryPhoneNumber?.phoneNumber || '',
            paymentMethod: 'mobile',
            subscriptionPeriod: 'month',
        },
    });

    const onSubmit = async (values: z.infer<typeof SubscriptionPaymentSchema>) => {
        setIsLoading(true);
        console.log("Form submitted with values:", values);
        try {
            const payment = {
                fullName: values.fullName,
                paymentMethod: values.paymentMethod,
                email: values.email,
                phoneNumber: values.phoneNumber,
                subscriptionPeriod: values.subscriptionPeriod,
                subscriptionPlan: values.subscriptionPlan,
                network: values.network,
            };

            await processPayment(payment);

            toast({
                variant: "success",
                title: "Success",
                description: "You have successfully renewed your subscription.",
            });
        } catch (error) {
            console.error("Payment processing error:", error);
            toast({
                variant: "destructive",
                title: "Error processing payment",
                description: error instanceof Error ? error.message : "An unexpected error occurred",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button className={cn(buttonVariants({variant: "default"}))}>
                    <Plus className="mr-2 h-4 w-4"/> Purchase subscription
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[640px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Payment details</AlertDialogTitle>
                    <AlertDialogDescription>
                        Make sure you enter valid payment details before proceeding
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Card>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
                            console.error("Form validation errors:", errors);
                        })}>
                            <CardContent className="grid gap-6 pt-4">
                                <CustomFormField
                                    fieldType={FormFieldType.SKELETON}
                                    control={form.control}
                                    name="paymentMethod"
                                    label="Payment method"
                                    renderSkeleton={(field) => (
                                        <FormControl>
                                            <RadioGroup
                                                className="grid grid-cols-2 gap-4"
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}>
                                                <div key="mobile" className="radio-group">
                                                    <RadioGroupItem value="mobile" id="mobile" className="peer sr-only"/>
                                                    <Label htmlFor="mobile"
                                                           className="cursor-pointer flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                                        <IconDeviceLandlinePhone />
                                                        Mobile money
                                                    </Label>
                                                </div>
                                                <div key="card" className="radio-group">
                                                    <RadioGroupItem disabled={true} value="card" id="card" className="peer sr-only"/>
                                                    <Label htmlFor="card"
                                                           className="cursor-pointer flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                                        <IconCreditCardPay />
                                                        Card
                                                    </Label>
                                                </div>
                                            </RadioGroup>
                                        </FormControl>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-0">
                                    <CustomFormField
                                        fieldType={FormFieldType.INPUT}
                                        control={form.control}
                                        name="fullName"
                                        label={`Full name`}
                                        placeholder="Full name"
                                    />
                                    <CustomFormField
                                        fieldType={FormFieldType.INPUT}
                                        control={form.control}
                                        name="email"
                                        type="email"
                                        label={`Email address`}
                                        placeholder="Email address"
                                    />
                                    <CustomFormField
                                        fieldType={FormFieldType.PHONE_INPUT}
                                        control={form.control}
                                        name="phoneNumber"
                                        label={`Phone number`}
                                        placeholder="Phone number"
                                    />
                                    <CustomFormField
                                        fieldType={FormFieldType.SELECT}
                                        control={form.control}
                                        name="network"
                                        label="Mobile network"
                                        placeholder="Select mobile network">
                                        <SelectItem className={`cursor-pointer`} key={`Airtel`} value={`Airtel`}>
                                            Airtel</SelectItem>
                                        <SelectItem className={`cursor-pointer`} key={`Tigo`} value={`Tigo`}>
                                            Tigo</SelectItem>
                                        <SelectItem className={`cursor-pointer`} key={`Halopesa`} value={`Halopesa`}>
                                            Halopesa</SelectItem>
                                        <SelectItem className={`cursor-pointer`} key={`Vodafone`} value={`Vodafone`}>
                                            Vodacom</SelectItem>
                                    </CustomFormField>
                                    <CustomFormField
                                        fieldType={FormFieldType.CUSTOM_SELECTOR}
                                        control={form.control}
                                        name="subscriptionPlan"
                                        label="Subscription Plan"
                                        renderSkeleton={(field) => (
                                            <SubscriptionPlanSelector value={field.value} onChange={field.onChange}/>
                                        )}
                                    />
                                    <CustomFormField
                                        fieldType={FormFieldType.SELECT}
                                        control={form.control}
                                        name="subscriptionPeriod"
                                        label="Payment period"
                                        placeholder="Select payment period">
                                        <SelectItem className={`cursor-pointer`} key={`month`} value={`month`}>1
                                            Month</SelectItem>
                                        <SelectItem className={`cursor-pointer`} key={`biAnnual`} value={`biAnnual`}>6
                                            Months</SelectItem>
                                        <SelectItem className={`cursor-pointer`} key={`annual`} value={`annual`}>12
                                            Months</SelectItem>
                                    </CustomFormField>
                                </div>
                            </CardContent>
                        </form>
                    </Form>
                </Card>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
                        Make payment
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    );
}