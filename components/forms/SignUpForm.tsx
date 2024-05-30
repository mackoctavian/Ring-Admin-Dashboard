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
import { getLoggedInUser, signIn, signUp } from '@/lib/actions/user.actions';
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast"
import CountrySelector from "../layout/country-selector";
import { SignUpSchema, Gender } from "@/types/data-schemas";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const SignUpForm  = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [country, setCountry] = useState<string>('TZ'); // Default country set
  const { toast } = useToast()

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
        const newUser = await signUp(data);
        setUser(newUser);
        toast({
            variant: "success",
            title: "Success", 
            description: "Your account was created succesfully, you will be redirected soon!"
        });
      
        // Redirect to the list page after submission
        router.push("/");
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
                    name="dateOfBirth"
                    render={({ field }) => (
                        <FormItem className="flex flex-col mt-2">
                            <FormLabel>Date of birth</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button variant={"outline"} className={cn( "font-normal", !field.value && "text-muted-foreground" )}>
                                        {field.value ? ( format(field.value, "PPP") ) : (
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
                                    onSelect={field.onChange}
                                    disabled={(date) => {
                                      const today = new Date();
                                      const minAgeDate = new Date();
                                      minAgeDate.setFullYear(today.getFullYear() - 18);
                                      
                                      return date > today || date < minAgeDate;
                                    }}
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value={Gender.UNDISCLOSED}>Do not disclose</SelectItem>
                            <SelectItem value={Gender.MALE}>Male</SelectItem>
                            <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                        </SelectContent>
                    </Select>
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