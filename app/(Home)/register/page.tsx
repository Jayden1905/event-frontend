import RegisterForm from '@/components/auth/registerForm'
import useAuthServer from '@/hooks/useAuthServer'
import { redirect } from 'next/navigation'

export default async function Page() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isAuthenticated } = await useAuthServer()
  if (isAuthenticated) {
    redirect('/dashboard')
  }

  return (
    <div className='flex justify-center items-center h-screen'>
      <RegisterForm />
    </div>
  )
}
