'use client'
 
import * as Sentry from "@sentry/nextjs";
import { AlertTriangle } from "lucide-react";
import { useEffect } from 'react'
import Link from "next/link";
import {cn} from "@/lib/utils";
import {Button, buttonVariants} from "@/components/ui/button";
import {HomeIcon, PersonIcon} from "@radix-ui/react-icons";
import CancelButton from "@/components/layout/cancel-button";
import {Separator} from "@/components/ui/separator";
import {SubmitButton} from "@/components/ui/submit-button";
import NavBar from "@/components/landing/NavBar";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    Sentry.captureException(error);
    console.error(error)
  }, [error])

  return (
      <section className="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center px-4">
        <NavBar />

        <div className="max-w-screen-sm w-full text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-400" />
          <h1 className="mt-6 mb-4 text-3xl font-bold text-gray-900 dark:text-white">
             {error.name || `System Error`}
          </h1>
          <p className="mb-2 text-lg text-gray-600 dark:text-gray-400">
            We are already working to solve the problem.
          </p>
          <p className="mb-8 text-gray-400 dark:text-gray-300">
            {error.message || `We encountered an unexpected error (${error.name}). We're working on fixing it!`}
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/" passHref>
              <Button variant="default" className="bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white">
                <HomeIcon className="mr-2 h-4 w-4" /> Go Home
              </Button>
            </Link>
            <Button variant="secondary" onClick={reportError}>
              Report to Support
            </Button>
          </div>
        </div>
      </section>
  );
};