'use client'

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { api_endpoint } from '@/lib/utils'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { toast } from 'sonner'

const formSchema = z.object({
  email: z.string().email({
    message: 'Invalid email address',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters',
  }),
})

export default function LoginForm() {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleResendVerificationEmail = (email: string) => {
    fetch(`${api_endpoint}/api/v1/user/verify/email/resend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.error || 'Something went wrong')
          })
        }
        toast.success(
          'Verification email has been sent. Please verify your email to login.',
        )
      })
      .catch((err) => {
        toast.error(err.message)
      })
  }

  const handleLogin = ({
    email,
    password,
  }: {
    email: string
    password: string
  }) => {
    fetch(`${api_endpoint}/api/v1/user/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.error || 'Something went wrong')
          })
        }
        toast.success('Login successful')
        return router.push('/dashboard')
      })
      .catch((err) => {
        if (err.message === 'Please verify your email') {
          return toast("Haven't received the email?", {
            action: {
              label: 'Resend email',
              onClick: () => handleResendVerificationEmail(email),
            },
          })
        }
        toast.error(err.message)
      })
  }

  function onSubmit(data: z.infer<typeof formSchema>) {
    handleLogin({
      email: data.email,
      password: data.password,
    })
  }

  return (
    <Card className='mx-auto max-w-sm'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl font-bold'>Login</CardTitle>
        <CardDescription>
          Enter your email and password to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-2'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='example@gmail.com' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='space-y-2'>
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type='password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='space-y-4'>
              <Button type='submit' className='w-full'>
                Login
              </Button>
            </div>
          </form>
        </Form>
        <div className='pt-2'>
          <Link className='text-sm underline' href='/register'>
            Doesn&apos;t have an account?
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
