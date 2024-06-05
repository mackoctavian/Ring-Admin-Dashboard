'use client'

import React, { useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ReloadIcon } from "@radix-ui/react-icons"
import { Input } from "@/components/ui/input";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation";
import CountrySelector from "../layout/country-selector";
import { Textarea } from "@/components/ui/textarea"
import BusinessSizeSelector from "../layout/business-size-selector";
import BusinessTypeSelector from "../layout/business-type-selector";
import { BusinessType, Business } from "@/types";
import { BusinessSchema } from '@/types/data-schemas';
import CancelButton from "../layout/cancel-button";

const BusinessSettingsForm = ({ item }: { item?: Business | null }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [country, setCountry] = useState<string>('Tanzania'); // Default country set
  const [selectedType, setSelectedType] = useState<BusinessType>();

  const handleTypeChange = (type: BusinessType) => {
    setSelectedType(type);
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
  };

  console.error("Business settings form item: ", JSON.stringify(item));
  const form = useForm<z.infer<typeof BusinessSchema>>({
    resolver: zodResolver(BusinessSchema),
    defaultValues: item ? item : {
    status: true,
    },
  });

const onInvalid = (errors : any ) => {
  console.error("Error saving business settings: ", JSON.stringify(errors));
  toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.", 
      description: "There was an issue submitting your form please verify the fields and try again."
  });
}

const onSubmit = async (data: z.infer<typeof BusinessSchema>) => {
  console.log(data);

  setIsLoading(true);

  try {
      
      // Redirect to the list page after submission
      router.push("/branches");
      router.refresh();
      setIsLoading(false);
  } catch (error: any) {
      toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.", 
          description: error.message || "There was an issue submitting your form, please try later"
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
              <div className="space-y-4">
                <h2 className="text-lg font-bold">Main Business Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                          <FormLabel>Business name *</FormLabel>
                          <FormControl>
                              <Input
                              placeholder="Business full name"
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
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                          <FormLabel>Slug ( Auto-generated ) *</FormLabel>
                          <FormControl>
                              <Input
                              placeholder="Slug"
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
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel>Logo</FormLabel>
                        <FormControl>
                            <Input
                            type="file"
                            placeholder="Business logo"
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email address</FormLabel>
                        <FormControl>
                            <Input
                            type="email"
                            placeholder="Email address"
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
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business type</FormLabel>
                      <FormControl>
                        <BusinessTypeSelector value={selectedType} onChange={handleTypeChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business size</FormLabel>
                      <FormControl>
                        <BusinessSizeSelector {...field} />
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
                        <FormLabel>Phone number</FormLabel>
                        <FormControl>
                            <Input
                              type="tel"
                              placeholder="Enter phone number"
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
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <CountrySelector value={country} onChange={handleCountryChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                  <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                          <Input
                          placeholder="Enter city / region name"
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
                    name="address"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                            <Input
                            placeholder="Enter address"
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
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Short description of your business"
                                className="resize-none"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                  />
              </div>

      <div className="flex h-5 items-center space-x-4">
          <CancelButton />
      
          <Separator orientation="vertical" />

          <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                  <>
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> &nbsp; Processing...
                  </>
                  ) : (
                  item ? "Update business details" : "Save business details"
              )}
          </Button> 
      </div>
    </form>
    </Form>
  );
};

export default BusinessSettingsForm;