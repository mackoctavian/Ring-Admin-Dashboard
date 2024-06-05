'use client';

import { siteConfig } from "@/config/site"
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/actions/user.actions';
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast"
import CountrySelector from "../layout/country-selector";
import { SignUpSchema } from "@/types/data-schemas";
import BusinessSizeSelector from "../layout/business-size-selector";
import BusinessTypeSelector from "../layout/business-type-selector";
import { BusinessType } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const SignUpForm  = () => {
  const router = useRouter();
  const { toast } = useToast()

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [country, setCountry] = useState<string>('Tanzania'); // Default country set
  const [selectedType, setSelectedType] = useState<BusinessType>();

  const handleTypeChange = (type: BusinessType) => {
    setSelectedType(type);
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
  };

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      country: country,
    },
  });

  const onInvalid = (errors : any ) => {
    console.error("Authentication error: ", JSON.stringify(errors));
    toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.", 
        description: "There was an issue submitting your form please try again"
    });
  }

  const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    setIsLoading(true);

    try {
        const userData = await signUp(data);
        setUser(userData);
        toast({
            variant: "success",
            title: "Success", 
            description: "Your account was created succesfully, you will be redirected soon!"
        });
      
        // Redirect to the business registration page after submission
        router.push("/business-registration");
        router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating account.", 
        description: "Error: " + error
       });
      console.error("Error logging in user: ", error);
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
            Sign up
            <p className="text-16 font-normal text-gray-600">Please enter your personal details to get started</p>
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
                        <FormLabel>Full name</FormLabel>
                        <FormControl>
                            <Input
                            placeholder="Enter your full name"
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
                    name="phoneNumber"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Phone number</FormLabel>
                        <FormControl>
                            <Input
                            placeholder="Phone number"
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
              <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
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
                name="password"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          className="input-class"
                          {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
              />
          </div>
          <div className="flex flex-col gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Loading...
                </>
              ): 'Sign Up'
              }
            </Button>
          </div>
          </>
          </form>
        </Form>
      <footer className="flex justify-center gap-1">
        <p className="text-14 font-normal text-gray-600"> Already have an account? </p>
        <Link href='/sign-in' className="form-link">Sign in</Link>
      </footer>
    </section>
  )
}

export default SignUpForm;