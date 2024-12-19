import useAuthServer from '@/hooks/useAuthServer'
import { redirect } from 'next/navigation'

export default async function Home() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isAuthenticated } = await useAuthServer()
  if (isAuthenticated) {
    redirect('/dashboard')
  }

  redirect('/login')
}
