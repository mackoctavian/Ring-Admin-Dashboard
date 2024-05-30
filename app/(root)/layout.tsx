import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { UserProvider } from '@/context/UserContext';
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <UserProvider>
            <Header />
            <div className="flex overflow-x-hidden">
                <Sidebar />
                <main className="w-full pt-16">{children}</main>
                <Toaster />
            </div>
        </UserProvider>
  
    );
}
