'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserProfile } from '@/components/User/UserProfile'
import { useAuthClient } from '@/hooks/useAuthClient'
import { capitalize } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment } from 'react'

export default function DashboardHeader() {
  const { isAuthenticated } = useAuthClient()

  return (
    <header className="flex h-16 w-full items-center justify-between border-b px-6">
      <div className="flex items-center">
        <SidebarTrigger />
        <h1 className="ml-4 text-2xl font-semibold">Dashboard</h1>
      </div>
      <div className="flex items-center space-x-4">
        {isAuthenticated && <UserProfile />}
      </div>
    </header>
  )
}
export function BreadCrumb() {
  const paths = usePathname()
  const pathNames = paths.split('/').filter((item) => item !== '')

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={'/dashboard'}>Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {pathNames.length > 0 && <BreadcrumbSeparator />}

        {pathNames.map((item, index) => {
          const href = `/${pathNames.slice(0, index + 1).join('/')}`
          const linkName = capitalize(item)
          const isLastPath = pathNames.length === index + 1

          return (
            <Fragment key={index}>
              <BreadcrumbItem>
                {!isLastPath ? (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{linkName}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{linkName}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {pathNames.length !== index + 1 && <BreadcrumbSeparator />}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
