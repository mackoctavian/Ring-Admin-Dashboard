import Link from "next/link";
import ThemeToggle from "@/components/layout/ThemeToggle/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {PersonIcon} from "@radix-ui/react-icons";
import {SignedIn, SignedOut, UserButton} from "@clerk/nextjs";
import Logo from "@/components/layout/logo";
import {getBusiness} from "@/lib/actions/business.actions";
import {IconBuildingWarehouse} from "@tabler/icons-react";
import { Suspense } from "react";
import Image from "next/image";

const BusinessContent = async () => {
    const business = await getBusiness();

    if (business) {
        return (
            <Link href={`/dashboard`} className={cn(buttonVariants({variant: "default"}), "bg-blue-700 dark:bg-blue dark:text-white")}>
                <PersonIcon className="mr-2 h-4 w-4" /> Dashboard
            </Link>
        );
    } else {
        return (
            <Link href={`/business-registration`} className={cn(buttonVariants({variant: "default"}), "bg-blue-700 dark:bg-blue dark:text-white")}>
                <IconBuildingWarehouse className="mr-2 h-4 w-4" /> Complete registration
            </Link>
        );
    }
};

export default function NavBar() {
    return (
        <div className="fixed top-3 left-0 right-0 backdrop-blur z-20">
            <nav className="h-14 flex items-center justify-between px-4 lg:px-10">
                <div className="flex items-center">
                    <div className="relative w-[100px] lg:w-[100px]">
                        <Logo />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <SignedIn>
                        <Suspense fallback={
                            <div className="relative size-6">
                                <Image src="/icons/icons/loading.svg" fill className={cn( "h-1 w-1 animate-spin", "dark:brightness-100", "" )} alt="Loading..." />
                            </div>
                        }>
                            <BusinessContent />
                        </Suspense>
                    </SignedIn>
                    <SignedOut>
                        <Link href={`/sign-in`} className={cn(buttonVariants({variant: "default"}), "bg-blue-700 dark:bg-blue dark:text-white")}>
                            <PersonIcon className="mr-2 h-4 w-4" /> Login
                        </Link>
                    </SignedOut>

                    <ThemeToggle />

                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </nav>
        </div>
    );
}