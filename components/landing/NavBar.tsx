import { siteConfig } from "@/config/site";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "@/components/layout/ThemeToggle/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {PersonIcon} from "@radix-ui/react-icons";

export default function NavBar() {
    return (
        <div className="fixed top-3 left-0 right-0 supports-backdrop-blur:bg-background/60 bg-background/95 backdrop-blur z-20">
            <nav className="h-14 flex items-center justify-between px-4 lg:px-10">
                <div className="flex items-center">
                    <Link href="/sign-in" className="cursor-pointer flex items-center gap-2">
                        <div className="relative w-[100px] lg:w-[100px]">
                            <Image
                                src={siteConfig.logo}
                                layout="responsive"
                                width={961}
                                height={396}
                                alt={siteConfig.name}
                            />
                        </div>
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <Link href={"/dashboard"} className={cn(buttonVariants({ variant: "default" }), "bg-blue-700 dark:bg-blue dark:text-white")}>
                        <PersonIcon className="mr-2 h-4 w-4"/> Login
                    </Link>
                    <ThemeToggle/>
                </div>
            </nav>
        </div>
    );
}