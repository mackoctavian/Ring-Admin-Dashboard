"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { sidebarLinks } from "@/constants";
import React from "react";
import { siteConfig } from "@/config/site";

interface Props {
  user?: string;
}

export default function MobileSidebar({ user }: Props) {
  const pathname = usePathname();

  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger>
          <Image
            src="/icons/icons/hamburger.svg"
            width={30}
            height={30}
            alt="menu"
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-white">
          <Link href="/" className="cursor-pointer flex items-center gap-1 px-4">
            <Image 
              src="/icons/logo.svg"
              width={34}
              height={34}
              alt="{siteConfig.name}"
            />
            <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">{siteConfig.name}</h1>
          </Link>
          <div className="mobilenav-sheet">
            <SheetClose asChild>
              <nav className="flex h-full flex-col gap-6 pt-16 text-white">
                {sidebarLinks.map((item, index) => {
                  // Ensure item.route is defined
                  if (item.route) {
                    const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
                    
                    return (
                      <SheetClose asChild key={item.route || index}>
                        <Link href={item.route} className={cn('mobilenav-sheet_close w-full flex items-center gap-2', { 'bg-green-main': isActive })}>
                          <Image 
                            src={item.icon!}
                            alt={item.label!}
                            width={20}
                            height={20}
                            className={cn({
                              'brightness-[10] invert-0': isActive
                            })}
                          />
                          <p className={cn('text-green-main', { '!text-white': isActive })}> {item.label} </p>
                        </Link>
                      </SheetClose>
                    );
                  }
                  // Optionally, handle the case where item.route is undefined
                  return null;
                })}
                USER
              </nav>
            </SheetClose>
            {/* <Footer user={user} type="mobile" /> */}
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}