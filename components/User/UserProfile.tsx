'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthClient } from '@/hooks/useAuthClient'
import { api_endpoint } from '@/lib/utils'
import { LogOut, Settings, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function UserProfile() {
  const router = useRouter()
  const { user } = useAuthClient()

  const fullName: string = user?.first_name + ' ' + user?.last_name
  const initials: string =
    fullName
      .split(' ')
      .map((n) => n[0])
      .join('') || ''

  const twoInitials = initials.length > 2 ? initials.slice(0, 2) : initials

  const handleLogout = () => {
    fetch(`${api_endpoint}/api/v1/user/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to logout')
        }
        router.push('/login')
      })
      .catch((error) => {
        console.error('Failed to logout:', error)
      })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className='w-[2.25rem] h-[2.25rem] cursor-pointer'
      >
        <Avatar>
          <AvatarImage src={''} alt='User Profile' />
          <AvatarFallback className='uppercase font-bold'>
            {twoInitials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href='/user-profile'>
            <DropdownMenuItem className='cursor-pointer'>
              <User className='mr-2 h-4 w-4' />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          <Link href='/dashboard/settings'>
            <DropdownMenuItem className='cursor-pointer'>
              <Settings className='mr-2 h-4 w-4' />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuItem className='cursor-pointer' onClick={handleLogout}>
          <LogOut className='mr-2 h-4 w-4' />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
