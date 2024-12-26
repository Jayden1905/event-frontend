'use client'

import { SidebarProvider } from '@/components/ui/sidebar'
import {
  BarChart2,
  ClipboardCheck,
  Dices,
  FileCheck2,
  Home,
  Mail,
  PrinterCheck,
  Settings,
  Users,
} from 'lucide-react'
import BreadCrumb from '../(Admin)/(components)/Dashboard/BreadCrumb'
import DashboardHeader from '../(Admin)/(components)/Dashboard/DashboardHeader'
import DashboardSidebar from '../(Admin)/(components)/Dashboard/DashboardSideBar'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const [currentEventID, setCurrentEventID] = useState<string | null>(null)

  useEffect(() => {
    const id = pathname.split('/')[2] || null
    setCurrentEventID(id)
  }, [pathname])

  const menuItems = [
    {
      icon: <Home className="h-5 w-5" />,
      label: 'Back To Home',
      href: `/dashboard/events`,
      isActive: false,
    },
    {
      icon: <BarChart2 className="h-5 w-5" />,
      label: 'Overview',
      href: `/event/${currentEventID}`,
      isActive: false,
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: 'Attendees',
      href: `/event/${currentEventID}/attendees`,
      isActive: false,
    },
    {
      icon: <Mail className="h-5 w-5" />,
      label: 'Email',
      href: `/event/${currentEventID}/email`,
      isActive: false,
    },
    {
      icon: <ClipboardCheck className="h-5 w-5" />,
      label: 'Marking Attendance',
      submenu: [
        {
          icon: <FileCheck2 className="h-5 w-5" />,
          label: 'Check-in',
          href: `/event/${currentEventID}/check-in`,
          isActive: false,
        },
        {
          icon: <PrinterCheck className="h-5 w-5" />,
          label: 'Check-in & Print',
          href: `/event/${currentEventID}/check-in-print`,
          isActive: false,
        },
      ],
    },
    {
      icon: <Dices className="h-5 w-5" />,
      label: 'Lucky Draw',
      href: `/event/${currentEventID}/lucky-draw`,
      isActive: false,
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: 'Settings',
      href: `/event/${currentEventID}/settings`,
      isActive: false,
    },
  ]

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <DashboardSidebar menuItems={menuItems} />
        <div className="flex w-full flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <main className="bg-secondary/10 w-full flex-1 overflow-y-auto p-6">
            <BreadCrumb />
            <div className="pt-4">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
