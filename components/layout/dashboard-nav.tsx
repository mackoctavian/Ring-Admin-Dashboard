'use client'

import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { mainMenu } from "@/types/nav";
import { Separator } from "@/components/ui/separator"
import Footer from "@/components/layout/footer"

interface Props {
  setOpen: (value: string) => void;
}

export default function DashboardNav({ setOpen }: Props) {
  const pathname = usePathname();

  return (
    <>
      {mainMenu.map((item, index) => {
        if (item.type === 'separator') {
          return <Separator key={index} className="my-2" />;
        }
        if (item.type === 'title') {
          return <p key={index} className="text-green-main tracking-tight text-sm font-medium mt-6">{item.label}</p>;
        }

        // Ensure item.route is defined
        if (item.route) {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);

          return (
            <Link href={item.route} key={item.label} className={cn('sidebar-link', { 'bg-green-main': isActive })}>
              <div className="relative size-5">
                <Image 
                  src={item.icon!}
                  alt={item.label!}
                  fill
                  className={cn("sidebar-label", { 'brightness-[10] invert-0': isActive })}
                />
              </div>
              <p className={cn("sidebar-label", { "!text-white": isActive })}> {item.label} </p>
            </Link>
          );
        }

        // Optionally, handle the case where item.route is undefined
        return null;
      })}
      <Footer />
    </>
  );
}