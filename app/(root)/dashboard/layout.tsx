import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import SubscriptionNotice from '@/components/subscription-notice';
import CookieConsent from "@/components/layout/cookie-consent";
import { Toaster } from "@/components/ui/toaster"
import {
    SignedIn,
    SignedOut,
    RedirectToSignIn,
  } from "@clerk/nextjs";
  
export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {    
    return (
        <>
            <SignedIn>
                <Header />
                <SubscriptionNotice />
                <div className="flex overflow-x-hidden">
                    <Sidebar />
                        <main className="w-full pt-16 bg-gray-100 dark:bg-darkgray-25">{children}</main>
                    <Toaster />
                    <CookieConsent demo={false} />
                </div>
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
    );
}
