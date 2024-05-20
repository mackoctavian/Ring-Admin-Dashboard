'use client'

import { cn } from '@/lib/utils'
import DashboardNav from '@/components/layout/dashboard-nav';
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Sidebar() {
  return (
    <section text-white className="sidebar">
      <ScrollArea>
      <nav className={cn(`relative hidden h-screen pt-16 lg:block w-72`)}>
        <DashboardNav   />
      </nav>
      </ScrollArea>
    </section>
  )
}
