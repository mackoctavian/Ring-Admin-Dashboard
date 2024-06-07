'use client';

import { siteConfig } from "@/config/site"
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { BusinessRegistrationSchema } from "@/types/data-schemas"
import { Textarea } from "@/components/ui/textarea"
import { ReloadIcon } from "@radix-ui/react-icons"
import BusinessSizeSelector from "../layout/business-size-selector"
import BusinessTypeSelector from "../layout/business-type-selector"
import CountrySelector from "../layout/country-selector"
import { BusinessType } from "@/types";
import { registerBusiness } from "@/lib/actions/business.actions"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const BusinessRegistrationForm  = () => {
  const router = useRouter();
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false);
  const [country, setCountry] = useState<string>('Tanzania');
  const [selectedBusinessType, setSelectedBusinessType] = useState<BusinessType | undefined>(undefined);

  const form = useForm<z.infer<typeof BusinessRegistrationSchema>>({
    resolver: zodResolver(BusinessRegistrationSchema),
    defaultValues: {
      country: country,
    },
  });

  const { control, setValue } = form;
  const handleBusinessTypeChange = (businessType: BusinessType) => {
    setSelectedBusinessType(businessType);
    setValue('businessType', businessType);
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
  };

  const nameValue = form.watch('name');
    useEffect(() => {
        if (nameValue) {
            const generatedSlug = nameValue.toLowerCase().replace(/\s+/g, '-');
            form.setValue('slug', generatedSlug);
        }
    }, [nameValue, form.setValue]);

  

  const onInvalid = (errors : any ) => {
    console.error("Business registration error: ", JSON.stringify(errors));
    toast({
        variant: "warning",
        title: "Data validation failed!", 
        description: "Please make sure all the fields marked with * are filled correctly."
    });
  }

  const onSubmit = async (data: z.infer<typeof BusinessRegistrationSchema>) => {
    setIsLoading(true);

    try {
        await registerBusiness(data);
        toast({
            variant: "success",
            title: "Success", 
            description: "You have succesfully created your account, you will be redirected soon!"
        });
      
        // Redirect to dashboard
        router.push("/")
        router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating account.", 
        description: "Error: " + error
       });
      console.error("Error registering business: ", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="auth-form">
      <header className='flex flex-col gap-5 md:gap-8'>
        <Link href="/" className="cursor-pointer flex items-center gap-1">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt={siteConfig.name}
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">{siteConfig.name}</h1>
        </Link>

        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            Business registration
            <p className="text-16 font-normal text-gray-600">Complete registration by filling in your business details</p>
          </h1>
        </div>
      </header>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Business name</FormLabel>
                        <FormControl>
                            <Input
                            placeholder="Enter your business name"
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
                    <FormItem className="hidden">
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                            <Input
                              placeholder="Category identifier"
                              className="input-class"
                              disabled
                              {...field}
                              />
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
                            placeholder="Business phone number"
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
                            placeholder="Business email address"
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
                    name="registrationNumber"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Registration number</FormLabel>
                        <FormControl>
                            <Input
                            placeholder="Registration number"
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
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Business description</FormLabel>
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
          <div className="flex flex-col gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ): 'Complete registration'
              }
            </Button>
          </div>
          </>
          </form>
        </Form>
    </section>
  )
}

export default BusinessRegistrationForm;