'use client'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { BarChart2, ChevronRight, Folder, Home, Settings } from 'lucide-react'
import { usePathname } from 'next/navigation'

const menuItems = [
  { icon: Home, label: 'Overview', href: '/dashboard', isActive: false },
  {
    icon: BarChart2,
    label: 'Analytics',
    submenu: [
      { label: 'Overview', href: '/', isActive: false },
      { label: 'Reports', href: '/', isActive: false },
      { label: 'Real-time', href: '/', isActive: false },
    ],
  },
  { icon: Folder, label: 'Events', href: '/dashboard/events', isActive: false },
  {
    icon: Settings,
    label: 'Settings',
    href: '/dashboard/settings',
    isActive: false,
  },
]

export default function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between px-4 py-2">
        <span className="text-xl font-bold">MyApp</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item, index) => (
            <SidebarMenuItem key={index}>
              {item.submenu ? (
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="w-full justify-between">
                      <span className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </span>
                      <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-9 pt-1">
                    <SidebarMenu>
                      {item.submenu.map((subItem, subIndex) => (
                        <SidebarMenuItem key={subIndex}>
                          <SidebarMenuButton asChild className="w-full">
                            <a
                              href={subItem.href}
                              className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50',
                                {
                                  'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50':
                                    subItem.href === pathname,
                                }
                              )}
                            >
                              {subItem.label}
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <SidebarMenuButton asChild className="w-full">
                  <a
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50',
                      {
                        'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50':
                          item.href === pathname,
                      }
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <p className="text-sm text-gray-500">© 2023 MyApp Inc.</p>
      </SidebarFooter>
    </Sidebar>
  )
}
