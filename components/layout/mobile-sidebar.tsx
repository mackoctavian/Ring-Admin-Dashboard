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
import { mainMenu } from "@/types/nav";
import React from "react";
import { siteConfig } from "@/config/site";
import Footer from "./footer";

export default function MobileSidebar() {
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
            <div className="relative w-full max-w-[100px]"> {/* Adjust max-w to your desired maximum width */}
                <Image 
                  src={siteConfig.logo}
                  layout="responsive"
                  width={961}
                  height={396}
                  alt={siteConfig.name}
                />
              </div>
          </Link>
          <div className="mobilenav-sheet">
            <SheetClose asChild>
              <nav className="flex h-full flex-col gap-6 pt-16 text-white">
                {mainMenu.map((item, index) => {
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
              </nav>
            </SheetClose>
            
          </div>

        <Footer type="mobile" />
        </SheetContent>

      </Sheet>
    </section>
  );
}