'use client'
 
import { useEffect } from 'react'
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react';

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
 
  const router = useRouter();

  return (
    <section className="bg-white dark:bg-gray-900 ">
    <div className="container flex items-center justify-center min-h-screen px-6 py-12 mx-auto">
        <div className="w-full ">
            <div className="flex flex-col items-center max-w-lg mx-auto text-center">
                <p className="text-sm font-medium text-red-500 dark:text-blue-400">ERROR</p>
                <h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">Something shameful occured</h1>
                <p className="mt-4 text-gray-500 dark:text-gray-400">We are really sorry about this, we have taken a note of this and we will fix it as soon as possible</p>

                <div className="flex items-center w-full mt-6 gap-x-3 shrink-0 sm:w-auto">
                    <Button type='button' variant="secondary" onClick={ () => router.back() }>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 rtl:rotate-180">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                        </svg>

                         Go back
                    </Button>

                    <Button variant="default" onClick={ () => router.push("/") }>
                        Take me home
                    </Button>
                </div>
            </div>

            <div className="grid w-full max-w-6xl grid-cols-1 gap-8 mx-auto mt-8 sm:grid-cols-2 lg:grid-cols-2">
                <div className="p-6 rounded-lg bg-blue-50 dark:bg-gray-800">
                    <span className="text-gray-500 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                    </span>
                    
                    <h3 className="mt-6 font-medium text-gray-700 dark:text-gray-200 ">FAQs</h3>

                    <p className="mt-2 text-gray-500 dark:text-gray-400 ">Dive in to FAQs to see if you can find a solution to this issue.</p>

                    <a href="#" className="inline-flex items-center mt-4 text-sm text-blue-500 gap-x-2 dark:text-blue-400 hover:underline">
                        <span>FAQs</span>

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 rtl:rotate-180">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                        </svg>
                    </a>
                </div>

                <div className="p-6 rounded-lg bg-blue-50 dark:bg-gray-800">
                    <span className="text-gray-500 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                        </svg>
                    </span>
                    
                    <h3 className="mt-6 font-medium text-gray-700 dark:text-gray-200 ">Chat to us</h3>

                    <p className="mt-2 text-gray-500 dark:text-gray-400 ">Talk to one of our representatives to help you find a solution</p>

                    <a href="#" className="inline-flex items-center mt-4 text-sm text-blue-500 gap-x-2 dark:text-blue-400 hover:underline">
                        <span>Chat to our team</span>

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 rtl:rotate-180">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>
  )
}