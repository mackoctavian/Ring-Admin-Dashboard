'use client'

import React, { useState } from 'react';
import { useForm } from 'react-hook-form'
import { Separator } from "@/components/ui/separator"
import {
  Form,
  FormControl
} from "@/components/ui/form"
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod'
import { useToast } from "@/components/ui/use-toast"
import CountrySelector from "../layout/country-selector"
import BusinessSizeSelector from "../layout/business-size-selector"
import BusinessTypeSelector from "../layout/business-type-selector"
import {Business} from "@/types"
import {BranchSchema, BusinessSchema} from '@/types/data-schemas'
import CancelButton from "../layout/cancel-button"
import { updateItem } from "@/lib/actions/business.actions"
import { SubmitButton } from "@/components/ui/submit-button"
import CustomFormField, {FormFieldType} from "@/components/ui/custom-input";
import {FileUploader} from "@/components/ui/custom-file-uploader";
import CurrencySelector from "@/components/layout/currency-selector";

const BusinessSettingsForm = ({ item }: { item?: Business | null }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof BusinessSchema>>({
        resolver: zodResolver(BusinessSchema),
        //handle nullable inputs
        //@ts-ignore
        defaultValues: item ? { ...item, address: item.address ?? '', city: item.city ?? '', description: item.description ?? '', registrationNumber: item.registrationNumber ?? '' }: {}
    })

    const onInvalid = (errors: any) => {
        toast({
          variant: 'warning',
          title: 'Data validation failed!',
          description: 'Please make sure all the fields marked with * are filled correctly.',
        });
    };

  const onSubmit = async (data: z.infer<typeof BusinessSchema>) => {
    setIsLoading(true);

      // Store file info in form data as
      let formData;

      //Check if logo exists
      if (data.logo && data.logo?.length > 0) {
          const blobFile = new Blob([data.logo[0]], {
              type: data.logo[0].type,
          });

          formData = new FormData();
          formData.append("blobFile", blobFile);
          formData.append("fileName", data.logo[0].name);
      }

    try {
      //@ts-ignore
      await updateItem(item!.$id, data);

      toast({
        variant: 'success',
        title: 'Successfully updated.',
        description: 'You have successfully updated your business information.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description:'There was an issue submitting your form, please try later',
      });
    } finally {
        setIsLoading(false);
        form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="name"
                  label={`Name of your business *`}
                  placeholder="Enter business name"
              />

              <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="slug"
                  label="Slug ( Auto-generated ) *"
                  placeholder="Slug"
              />

              <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="email"
                  label="Business email address *"
                  placeholder="Enter business email address"
              />

              <CustomFormField
                  fieldType={FormFieldType.PHONE_INPUT}
                  control={form.control}
                  name="phoneNumber"
                  label="Contact number *"
                  placeholder="Enter business phone number"
              />

              <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="registrationNumber"
                  label="Business registration number"
                  placeholder="Enter business registration number"
              />

              <CustomFormField
                  fieldType={FormFieldType.CUSTOM_SELECTOR}
                  control={form.control}
                  name="size"
                  label="Size of your business *"
                  renderSkeleton={(field) => (
                      <BusinessSizeSelector value={field.value} onChange={field.onChange}/>
                  )}
              />

              <CustomFormField
                  fieldType={FormFieldType.CUSTOM_SELECTOR}
                  control={form.control}
                  name="businessType"
                  label="Type of business *"
                  renderSkeleton={(field) => (
                      <BusinessTypeSelector value={field.value} onChange={field.onChange}/>
                  )}
              />

              <CustomFormField
                  fieldType={FormFieldType.CUSTOM_SELECTOR}
                  control={form.control}
                  name="currency"
                  label="Business operating currency *"
                  renderSkeleton={(field) => (
                      <CurrencySelector value={field.value} onChange={field.onChange}/>
                  )}
              />

              <CustomFormField
                  fieldType={FormFieldType.CUSTOM_SELECTOR}
                  control={form.control}
                  name="country"
                  label="Country of operation *"
                  renderSkeleton={(field) => (
                      <CountrySelector value={field.value} onChange={field.onChange}/>
                  )}
              />

              <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="city"
                  label="Business location (city) *"
                  placeholder="Enter business location"
              />

              <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name={`address`}
                  label="Business address"
                  placeholder="Enter business address"
              />
          </div>
          <div className="space-y-5">
              <CustomFormField
                  fieldType={FormFieldType.SKELETON}
                  control={form.control}
                  name="logo"
                  label="Upload your logo"
                  renderSkeleton={(field) => (
                      <FormControl>
                          <FileUploader files={field.value} onChange={field.onChange}/>
                      </FormControl>
                  )}
              />
              <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="description"
                  label="Brief description of your business"
                  placeholder="Brief description detailing your business"
              />
          </div>

          <div className="flex h-5 items-center space-x-4">
              <CancelButton/>
              <Separator orientation="vertical"/>
              <SubmitButton loading={isLoading} label={item ? 'Update business details' : 'Save business details'}/>
          </div>
      </form>
    </Form>
  );
};

export default BusinessSettingsForm;