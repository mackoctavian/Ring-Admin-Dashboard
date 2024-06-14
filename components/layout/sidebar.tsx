import { cn } from '@/lib/utils'
import DashboardNav from '@/components/layout/dashboard-nav';
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Sidebar() {
  return (
    <section className="sidebar bg-gray-100 dark:bg-darkgray-25">
      <ScrollArea>
      <nav className={cn(`relative hidden h-screen pt-16 lg:block w-72`)}>
        <DashboardNav setOpen='open'  />
      </nav>
      </ScrollArea>
    </section>
  )
}