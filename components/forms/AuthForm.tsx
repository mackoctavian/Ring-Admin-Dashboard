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
import CustomInput from '@/components/layout/CustomInput';
import { authFormSchema } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { getLoggedInUser, signIn, signUp } from '@/lib/actions/user.actions';
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import CountrySelect from "@/components/ui/country-picker"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { BusinessForm } from "./BusinessForm";

const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const formSchema = authFormSchema(type);
  const [country, setCountry] = useState<string>('TZ'); // Default country set

  const handleCountryChange = (value: string) => {
    setCountry(value);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: '',
      firstName: "",
      lastName: "",
      phoneNumber: "",
      city: "",
      country: country,
      gender: "",
      dateOfBirth: null,
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      if (type === 'sign-up') {
        const userData = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          name: data.firstName! + " " + data.lastName!,
          email: data.email,
          phoneNumber: data.phoneNumber!,
          city: data.city!,
          country: data.country!,
          gender: data.gender!,
          dateOfBirth: data.dateOfBirth!,
          password: data.password
        }

        const newUser = await signUp(userData);
        setUser(newUser);
      }

      if (type === 'sign-in') {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });

        if (response && response.success) {
          router.push('/');
        } else {
          console.log("Sign in failed.");
        }
      }
    } catch (error) {
      console.log("Error:", error);
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
            {user
              ? 'Business details'
              : type === 'sign-in'
                ? 'Sign In'
                : 'Sign Up'
            }
            <p className="text-16 font-normal text-gray-600">
              {user
                ? 'Set up your business details to get started'
                : 'Please enter your details'
              }
            </p>
          </h1>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">
          <BusinessForm />
        </div>
      ) : (
        <Form {...form} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {type === 'sign-up' && (
            <>
              <div className="flex gap-4">
                <CustomInput control={form.control} name='firstName' label="First Name" placeholder='Enter your first name' />
                <CustomInput control={form.control} name='lastName' label="Last Name" placeholder='Enter your first name' />
              </div>
              <div className="flex gap-4">
                <CustomInput control={form.control} name='phoneNumber' label="Phone number" placeholder='Enter your phone number starting with country code' />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Select date of birth</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => field.onChange(date.toISOString())}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4">
                <CustomInput control={form.control} name='city' label="City" placeholder='Enter your city' />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <CountrySelect value={country} onChange={handleCountryChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>
              <div className="flex gap-4">
                <CustomInput control={form.control} name='gender' label="Gender" placeholder='Gender' />
              </div>
            </>
          )}

          <CustomInput control={form.control} name='email' label="Email" type='email' placeholder='Enter your email address' />

          <CustomInput control={form.control} name='password' label="Password" type='password' placeholder='Enter your password' />

          <div className="flex flex-col gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : type === 'sign-in' ? 'Sign In' : 'Sign Up'
              }
            </Button>
          </div>
        </Form>
      )}
      <footer className="flex justify-center gap-1">
        <p className="text-14 font-normal text-gray-600">
          {type === 'sign-in' ? "Don't have an account?" : "Already have an account?"}
        </p>
        <Link href={type === 'sign-in' ? '/sign-up' : '/sign-in'} className="form-link">
          {type === 'sign-in' ? 'Sign up' : 'Sign in'}
        </Link>
      </footer>
    </section>
  )
}

export default AuthForm;