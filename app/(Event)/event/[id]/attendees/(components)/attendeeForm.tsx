import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { CreateAttendeeType } from '@/types/attendee'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

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

export function AttendeeCreateForm({
  refetchAttendees,
}: {
  refetchAttendees: () => void
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const pathname = usePathname()
  const currentEventID = pathname.split('/')[2]

  const form = useForm<AttendeeFormValues>({
    resolver: zodResolver(attendeeFormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      company_name: '',
      title: '',
      table_no: 0,
      role: '',
    },
  })

  function handleCreateAttendee({
    first_name,
    last_name,
    email,
    company_name,
    title,
    table_no,
    role,
  }: CreateAttendeeType) {
    setLoading(true)
    fetch(`${api_endpoint}/api/v1/event/add_attendee`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: first_name,
        last_name: last_name,
        email: email,
        event_id: Number(currentEventID),
        company_name: company_name,
        title: title,
        table_no: table_no,
        role: role,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            toast.error(data.error, {
              description: data.fields,
            })
          })
        }

        toast.success('Attendee created.')
        refetchAttendees()
        setLoading(false)
        setOpen(false)
      })
      .catch((err) => {
        toast.error(err.message)
        setLoading(false)
        setOpen(false)
      })
  }

  function onSubmit(data: AttendeeFormValues) {
    handleCreateAttendee(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create New Attendee</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Attendee</DialogTitle>
          <DialogDescription>
            Fill in the details for the new attendee. Click save when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
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
            </form>
          </Form>
        </div>
        <DialogFooter className="border-t pt-4">
          <Button
            type="submit"
            disabled={loading}
            onClick={form.handleSubmit(onSubmit)}
          >
            {loading && <Loader2 className="animate-spin" />}
            {loading ? 'Creating...' : 'Create Attendee'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
