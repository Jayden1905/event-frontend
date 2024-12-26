'use client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { api_endpoint } from '@/lib/utils'
import { AttendeeType } from '@/types/attendee'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const fetchAttendees = async (id: string) => {
  const response = await fetch(`${api_endpoint}/api/v1/attendees/${id}`, {
    method: 'GET',
    credentials: 'include',
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to fetch attendees')
  }

  return response.json() as Promise<AttendeeType>
}

export const attendeeFormSchema = z.object({
  first_name: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  last_name: z.string().min(2, {
    message: 'Last name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  company_name: z.string(),
  title: z.string(),
  table_no: z.number().nonnegative({
    message: 'Table number must be a positive number.',
  }),
  role: z.string(),
})

type AttendeeFormValues = z.infer<typeof attendeeFormSchema>

export default function AttendeeEditgPage() {
  const pathname = usePathname()
  const attendeeID = pathname.split('/')[4]
  const [attendeeData, setAttendeeData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    company_name: '',
    title: '',
    table_no: 0,
    role: '',
  })

  const { data } = useQuery({
    queryKey: ['attendee_one', attendeeID],
    queryFn: () => fetchAttendees(attendeeID),
    retry: false,
  })

  const mutation = useMutation({
    mutationKey: ['attendee_update', attendeeID],
    mutationFn: (data: AttendeeFormValues) => {
      return fetch(`${api_endpoint}/api/v1/event/attendees/${attendeeID}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
    },
    onMutate: (data) => {
      setAttendeeData(data)
    },
    onSuccess: () => {
      toast.success('Attendee info updated successfully.')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useForm<AttendeeFormValues>({
    resolver: zodResolver(attendeeFormSchema),
    defaultValues: attendeeData,
  })

  useEffect(() => {
    form.reset(attendeeData)
  }, [attendeeData, form])

  useEffect(() => {
    if (data) {
      setAttendeeData({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        company_name: data.company_name,
        title: data.title,
        table_no: data.table_no,
        role: data.role,
      })
    }
  }, [data])

  function onSubmit(data: AttendeeFormValues) {
    mutation.mutate(data)
  }

  return (
    <main>
      <div className="px-2 py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Software Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="table_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Table Number</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => {
                        field.onChange(Number(e.target.value))
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input placeholder="Attendee" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="animate-spin" />}
              {mutation.isPending ? 'Updating Info' : 'Update Info'}
            </Button>
          </form>
        </Form>
      </div>
    </main>
  )
}
