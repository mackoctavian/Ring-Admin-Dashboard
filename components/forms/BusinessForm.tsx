'use client'

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form'
import { Separator } from "@/components/ui/separator"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import CountrySelector from "../layout/country-selector"
import { Textarea } from "@/components/ui/textarea"
import BusinessSizeSelector from "../layout/business-size-selector"
import BusinessTypeSelector from "../layout/business-type-selector"
import { BusinessType, Business } from "@/types"
import { BusinessSchema } from '@/types/data-schemas'
import CancelButton from "../layout/cancel-button"
import { updateItem } from "@/lib/actions/business.actions"
import { SubmitButton } from "@/components/ui/submit-button"
import {flatten} from "@sentry/utils";

const BusinessSettingsForm = ({ item }: { item?: Business | null }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [country, setCountry] = useState<string>('Tanzania'); // Default country set
  const [selectedBusinessType, setSelectedBusinessType] = useState<BusinessType | undefined>(
    item ? item.businessType : undefined
  );

  const form = useForm<z.infer<typeof BusinessSchema>>({
    resolver: zodResolver(BusinessSchema),
    defaultValues: item ? item : {},
  });

  const { control, setValue } = form;

  useEffect(() => {
    if (item) {
      //setValue('businessType', item.businessType);
      setSelectedBusinessType(item.businessType);
      setCountry(item.country || 'Tanzania');
    }
  }, [item, setValue]);

  const handleBusinessTypeChange = (businessType: BusinessType) => {
    setSelectedBusinessType(businessType);
    setValue('businessType', businessType);
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
    setValue('country', value);
  };

  const onInvalid = (errors: any) => {
    console.error('Error saving business settings: ', flatten(errors));
    toast({
      variant: 'warning',
      title: 'Data validation failed!',
      description: 'Please make sure all the fields marked with * are filled correctly.',
    });
  };

  const onSubmit = async (data: z.infer<typeof BusinessSchema>) => {
    setIsLoading(true);

    try {
      await updateItem(item!.$id, data);

      toast({
        variant: 'success',
        title: 'Successfully updated.',
        description: 'You have successfully updated your business information.',
      });

      router.push('/business');
      router.refresh();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description:'There was an issue submitting your form, please try later',
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Main Business Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Business full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug ( Auto-generated ) *</FormLabel>
                  <FormControl>
                    <Input placeholder="Slug" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <Input type="file" placeholder="Business logo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="registrationNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration number *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter registration number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="businessType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business type *</FormLabel>
                  <FormControl>
                    <BusinessTypeSelector value={selectedBusinessType} onChange={handleBusinessTypeChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business size *</FormLabel>
                  <FormControl>
                    <BusinessSizeSelector {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number *</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country *</FormLabel>
                  <FormControl>
                    <CountrySelector value={country} onChange={handleCountryChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city / region name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Short description of your business" className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex h-5 items-center space-x-4">
          <CancelButton />
          <Separator orientation="vertical" />
          <SubmitButton loading={isLoading} label={item ? 'Update business details' : 'Save business details'} />
        </div>
      </form>
    </Form>
  );
};

export default BusinessSettingsForm;