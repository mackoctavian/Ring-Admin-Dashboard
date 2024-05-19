import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { sidebarLinks } from "@/constants";
import { Dispatch, SetStateAction } from "react";
import { Separator } from "@/components/ui/separator"
// import Footer from "@/components/layout/Footer"


const DashboardNav = ({ user, setOpen }) => {
  const pathname = usePathname();

  return (
    <>
      {sidebarLinks.map((item, index) => {
        const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);

        if (item.type === 'separator') {
          return <Separator key={index} className="my-2" />;
        }
        if (item.type === 'title') {
          return <p key={index} className="text-green-main tracking-tight text-sm font-medium mt-6">{item.label}</p>;
        }

        return (
          <Link href={item.route} key={item.label} className={cn('sidebar-link', { 'bg-green-main': isActive })}>
            <div className="relative size-5">
              <Image 
                src={item.icon!}
                alt={item.label!}
                fill
                className={cn("sidebar-label", { 'brightness-[3] invert-0': isActive })}
              />
            </div>
            <p className={cn("sidebar-label", { "!text-white": isActive })}> {item.label} </p>
          </Link>
        );
      })}
      {/* <Footer user={user} /> */}
    </>
  );
}

export default DashboardNav;