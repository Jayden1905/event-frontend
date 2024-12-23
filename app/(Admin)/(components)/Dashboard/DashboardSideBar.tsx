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
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

type MenuItemsProps = {
  icon?: ReactNode
  label: string
  href?: string
  isActive?: boolean
  submenu?: MenuItemsProps[]
}

export default function DashboardSidebar({
  menuItems,
}: {
  menuItems: MenuItemsProps[]
}) {
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
                        {item.icon}
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
                            <Link
                              href={subItem.href || '/'}
                              className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50',
                                {
                                  'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50':
                                    subItem.href === pathname,
                                }
                              )}
                            >
                              {subItem.icon}
                              <span>{subItem.label}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <SidebarMenuButton asChild className="w-full">
                  <Link
                    href={item.href || '/'}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50',
                      {
                        'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50':
                          item.href === pathname,
                      }
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
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
