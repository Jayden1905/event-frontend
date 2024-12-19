import { api_endpoint } from '@/lib/utils'
import { User } from '@/types/user'
import { cookies } from 'next/headers'

export default async function useAuthServer(): Promise<{
  isAuthenticated: boolean
  token: string
  user: User
}> {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value || ''

  const response = await fetch(`${api_endpoint}/api/v1/user/auth/status`, {
    method: 'GET',
    headers: {
      Authorization: `${token}`,
    },
  })

  if (!response.ok) {
    return { isAuthenticated: false, token: '', user: {} as User }
  }

  const user: User = await response.json().then((data) => data.user)

  return { isAuthenticated: !!token, token, user }
}
