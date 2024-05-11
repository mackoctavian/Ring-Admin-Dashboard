import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { sidebarLinks } from "@/constants";
import { Dispatch, SetStateAction } from "react";
import Footer from "@/components/layout/Footer"

const DashboardNav = ({ user, setOpen }: DashboardNavProps) => {
  const pathname = usePathname();

  return (
    <>
      {sidebarLinks.map((item) => {
        const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
        return (
          <Link href={item.route} key={item.label} className={cn('sidebar-link', { 'bg-bank-gradient': isActive })}>
            <div className="relative size-6">
              <Image 
                src={item.imgURL}
                alt={item.label}
                fill
                className={cn({
                  'brightness-[3] invert-0': isActive
                })}
              />
            </div>
            <p className={cn("sidebar-label", { "!text-white": isActive })}>
              {item.label}
            </p>
          </Link>
        );
      })}
      {/* <Footer user={user} /> */}
      {/* <PlaidLink user={user} /> */}
    </>
  );
}

export default DashboardNav
