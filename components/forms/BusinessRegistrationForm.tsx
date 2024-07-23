'use client';

import React, { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { BusinessRegistrationSchema } from "@/types/data-schemas";
import BusinessSizeSelector from "../layout/business-size-selector";
import BusinessTypeSelector from "../layout/business-type-selector";
import CountrySelector from "../layout/country-selector";
import { registerBusiness } from "@/lib/actions/business.actions";
import {
    Form,
    FormControl
} from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomFormField, {FormFieldType} from '../ui/custom-input';
import CurrencySelector from "@/components/layout/currency-selector";
import {FileUploader} from "@/components/ui/custom-file-uploader";
import {useUser} from "@clerk/nextjs";

const BusinessRegistrationForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { user } = useUser();

    const form = useForm<z.infer<typeof BusinessRegistrationSchema>>({
        resolver: zodResolver(BusinessRegistrationSchema),
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
        },
    });

    const onSubmit = async (values: z.infer<typeof BusinessRegistrationSchema>) => {
        setIsLoading(true);

        // Store file info in form data as
        let formData;

        //Check if logo exists
        if (values.logo && values.logo?.length > 0) {
            const blobFile = new Blob([values.logo[0]], {
                type: values.logo[0].type,
            });

            formData = new FormData();
            formData.append("blobFile", blobFile);
            formData.append("fileName", values.logo[0].name);
        }

        try {
            const business = {
                name: values.name,
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                phoneNumber: values.phoneNumber,
                address: values.address,
                size: values.size,
                city: values.city,
                country: values.country,
                businessType: values.businessType,
                currency: values.currency,
                registrationNumber: values.registrationNumber,
                description: values.description,
                logo: values.logo
                    ? formData
                    : undefined,
                termsConsent: values.termsConsent,
            };

            await registerBusiness(business);

            toast({
                variant: "success",
                title: "Success",
                description: "Your business has been registered successfully. You will be redirected to your dashboard.",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error registering business",
                description: error instanceof Error ? error.message : "An unexpected error occurred",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="auth-form mt-10">
            <header className="flex flex-col gap-5 md:gap-8 mb-4">
                <div className="flex flex-col gap-1 md:gap-3">
                    <h1 className="text-24 lg:text-36 font-semibold">
                        Business registration
                    </h1>
                    <p className="text-16 font-normal">
                        Complete registration by filling in your business details
                    </p>
                </div>
            </header>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-0">
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="firstName"
                            label={`First name`}
                            placeholder="First name"
                        />
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="lastName"
                            label={`Last name`}
                            placeholder="Last name"
                        />
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="name"
                            label={`Business name`}
                            placeholder="Business name"
                        />
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="email"
                            label="Email address"
                            placeholder="Business email address"
                        />
                        <CustomFormField
                            fieldType={FormFieldType.PHONE_INPUT}
                            control={form.control}
                            name="phoneNumber"
                            label="Phone number"
                            placeholder="Business phone number"
                        />
                        <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name="registrationNumber"
                            label="Registration number"
                            placeholder="Business registration number"
                        />
                        <CustomFormField
                            fieldType={FormFieldType.CUSTOM_SELECTOR}
                            control={form.control}
                            name="country"
                            label="Country"
                            renderSkeleton={(field) => (
                                <CountrySelector value={field.value} onChange={field.onChange}/>
                            )}
                        />
                        <CustomFormField
                            fieldType={FormFieldType.CUSTOM_SELECTOR}
                            control={form.control}
                            name="currency"
                            label="Operating currency"
                            renderSkeleton={(field) => (
                                <CurrencySelector value={field.value} onChange={field.onChange}/>
                            )}
                        />
                        <CustomFormField
                            fieldType={FormFieldType.CUSTOM_SELECTOR}
                            control={form.control}
                            name="size"
                            label="Business size"
                            renderSkeleton={(field) => (
                                <BusinessSizeSelector value={field.value} onChange={field.onChange}/>
                            )}
                        />
                        <CustomFormField
                            fieldType={FormFieldType.CUSTOM_SELECTOR}
                            control={form.control}
                            name="businessType"
                            label="Business type"
                            renderSkeleton={(field) => (
                                <BusinessTypeSelector value={field.value} onChange={field.onChange}/>
                            )}
                        />
                    </div>
                    <div className="space-y-5">
                        <CustomFormField
                            fieldType={FormFieldType.SKELETON}
                            control={form.control}
                            name="logo"
                            label="Logo"
                            renderSkeleton={(field) => (
                                <FormControl>
                                    <FileUploader files={field.value} onChange={field.onChange} />
                                </FormControl>
                            )}
                        />
                        <CustomFormField
                            fieldType={FormFieldType.TEXTAREA}
                            control={form.control}
                            name="description"
                            label="Business description"
                            placeholder="Short description of your business"
                        />
                        <CustomFormField
                            fieldType={FormFieldType.CHECKBOX}
                            control={form.control}
                            name="termsConsent"
                            label="I acknowledge that I have reviewed and agree to the terms & conditions"
                        />
                    </div>

                    <SubmitButton label={`Complete registration`} loading={isLoading}/>
                </form>
            </Form>
        </section>
    );
};

export default BusinessRegistrationForm;
