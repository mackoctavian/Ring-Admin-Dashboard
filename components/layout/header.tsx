import ThemeToggle from "@/components/layout/ThemeToggle/theme-toggle";
import { cn } from "@/lib/utils";
import  MobileSidebar  from "./mobile-sidebar";
import { UserNav } from "./user-nav";
import Link from "next/link";
import { siteConfig } from "@/config/site"
import Image from 'next/image'

export default function Header() {
  return (
    <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
      <nav className="h-14 flex items-center justify-between px-4">
        <div className="hidden lg:block">
          <Link href="/" className="cursor-pointer flex items-center gap-2">
            <Image 
              src="/icons/logo.svg"
              width={34}
              height={34}
              alt={siteConfig.name}
              className="size-[24px] max-xl:size-14"
            />
            <h1 className="sidebar-logo">{siteConfig.name}</h1>
          </Link>
        </div>
        <div className={cn("block lg:!hidden")}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-2">
          <UserNav />
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
