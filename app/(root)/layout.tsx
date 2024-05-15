import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header />
            <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <main className="w-full pt-16">{children}</main>
                <Toaster />
            </div>
        </>
  
    );
}
