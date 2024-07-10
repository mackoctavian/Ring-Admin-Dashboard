'use client';

import { siteConfig } from "@/config/site"
import React, { useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { ReloadIcon } from "@radix-ui/react-icons"
import { useRouter } from 'next/navigation';
import { SignInSchema } from "@/types/data-schemas";
import { signIn } from '@/lib/actions/user.actions';
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input";
import Link from 'next/link'
import Image from 'next/image'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"

const SignInForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast()
    const [user, setUser] = useState(null)

    const form = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
    });

    const onInvalid = (errors : any ) => {
        console.error("Sign in failed: ", JSON.stringify(errors));
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.", 
            description: "There was an issue submitting your form please try later"
        });
    }

    const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
        setIsLoading(true);
    
        try {
            await signIn(data);
            toast({
                variant: "success",
                title: "Success", 
                description: "Login succesful, you will be redirected soon!"
            });
            
            // Redirect to the list page after submission
            router.push("/");
            router.refresh();
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.", 
                description: "Please verify your credentials."
            });
        } finally {
            //delay loading
            setTimeout(() => {
                setIsLoading(false);
            }, 2000); 
        }
    };

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
                Sign in 
                <p className="text-16 font-normal text-gray-600">
                    Enter your credentials to proceed
                </p>
            </h1>
            </div>
        </header>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
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
                    ) : 'Sign In'
                    }
                    </Button>
                </div>
            </form>
        </Form>
        <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
                Don't have an account ?
            </p>
            <Link href='/sign-up' className="form-link">
                Sign up
            </Link>
        </footer>
    </section>
    )}

export default SignInForm;