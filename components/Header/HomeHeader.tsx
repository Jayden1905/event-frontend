'use client'
import Link from 'next/link'
import { Button } from '../ui/button'
import { api_endpoint } from '@/lib/utils'
import { useAuthClient } from '@/hooks/useAuthClient'
import { useState } from 'react'

export default function HomeHeader() {
  const { isAuthenticated } = useAuthClient()
  const [logoutLoading, setLogoutLoading] = useState(false)

  const handleLogin = () => {
    fetch(`${api_endpoint}/api/v1/user/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'jayden@gmail.com',
        password: 'helloworld',
      }),
    })
      .then((res) => {
        if (res.ok) {
          window.location.reload()
        }
      })
      .catch((error) => {
        console.error('Failed to login:', error)
      })
  }

  const handleLogout = () => {
    setLogoutLoading(true)
    fetch(`${api_endpoint}/api/v1/user/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => {
        if (res.ok) {
          window.location.reload()
        }
      })
      .catch((error) => {
        console.error('Failed to logout:', error)
      })
      .finally(() => {
        setLogoutLoading(false)
      })
  }

  return (
    <div className='w-full fixed bg-secondary shadow-lg'>
      <nav className='flex justify-between items-center py-4 max-w-7xl mx-auto px-4'>
        <div>Logo</div>
        <ul className='flex gap-4 justify-center items-center'>
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
          <li>
            <Link href={'/dashboard'}>Dashboard</Link>
          </li>
        </ul>
        <div>
          {!isAuthenticated && <Button onClick={handleLogin}>Login</Button>}
          {isAuthenticated && (
            <Button onClick={handleLogout} disabled={logoutLoading}>
              Logout
            </Button>
          )}
        </div>
      </nav>
    </div>
  )
}
