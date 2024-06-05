import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { SubscriptionProvider } from '@/context/SubscriptionContext';
import SubscriptionNotice from '@/components/subscription-notice';
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SubscriptionProvider>
            <Header />
            <div className="flex overflow-x-hidden">
                <Sidebar />
                <main className="w-full pt-16">{children}</main>
                <Toaster />
            </div>
        </SubscriptionProvider>
    );
}
