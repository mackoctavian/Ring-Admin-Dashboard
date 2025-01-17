import {
  IconBrowserCheck, IconCreditCardPay,
  IconNotification,
  IconPalette,
  IconTool,
  IconUser,
} from '@tabler/icons-react'
import { Separator } from '@/components/ui/separator'
import SidebarNav from './components/sidebar-nav'

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {  
  return (
    <>
      <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Settings
          </h1>
          <p className='text-muted-foreground'>
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className='my-6' />
        <div className='flex flex-1 flex-col space-y-8 overflow-auto lg:flex-row lg:space-x-12 lg:space-y-0'>
          <aside className='sticky top-0 lg:w-1/5'>
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className='w-full p-1 pr-4 lg:max-w-xxl'>
            <div className='pb-16'>
              {children}
            </div>
          </div>
        </div>
    </>
  )
}

const sidebarNavItems = [
  {
    title: 'Profile',
    icon: <IconUser size={18} />,
    href: '/dashboard/settings/user-profile',
  },
 {
   title: 'Subscription',
   icon: <IconCreditCardPay size={18} />,
   href: '/dashboard/settings/subscription',
 },
  {
    title: 'Business',
    icon: <IconTool size={18} />,
    href: '/dashboard/settings/business',
  },
  {
    title: 'Manage devices',
    icon: <IconBrowserCheck size={18} />,
    href: '/dashboard/settings/devices',
  },
  {
    title: 'Appearance',
    icon: <IconPalette size={18} />,
    href: '/dashboard/settings/appearance',
  },
  {
    title: 'Notifications',
    icon: <IconNotification size={18} />,
    href: '/dashboard/settings/notifications',
  },
]
