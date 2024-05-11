'use client'

import { cn } from '@/lib/utils'
import DashboardNav from '@/components/layout/dashboard-nav';
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Sidebar() {
  return (
    <section className="sidebar">
      <ScrollArea className="h-full">
      <nav className={cn(`relative hidden h-screen pt-16 lg:block w-72`)}>
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight">
                Overview
              </h2>
              <DashboardNav />
            </div>
          </div>
        </div>
      </nav>
      </ScrollArea>
    </section>
  )
}
