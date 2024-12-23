'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserProfile } from '@/components/User/UserProfile'
import { useAuthClient } from '@/hooks/useAuthClient'

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
