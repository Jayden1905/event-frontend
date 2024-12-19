import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { User } from './types/user'
import { cookies } from 'next/headers'
import { api_endpoint } from './lib/utils'

export async function middleware(req: NextRequest) {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value || ''

  // Redirect to login if no token is present
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Verify token and authentication status
  const response = await fetch(`${api_endpoint}/api/v1/user/auth/status`, {
    method: 'GET',
    headers: {
      Authorization: `${token}`,
    },
  })

  if (!response.ok) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const user: User = await response.json().then((data) => data.user)

  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Proceed to the requested route
  return NextResponse.next()
}

// Apply middleware only to admin routes
export const config = {
  matcher: ['/dashboard', '/dashboard/:path'], // Protect all routes under /admin
}
