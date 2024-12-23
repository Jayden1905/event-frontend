'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { api_endpoint } from '@/lib/utils'
import { usePathname } from 'next/navigation'

const importFormSchema = z.object({
  file: z
    .any()
    .refine((files) => files.length > 0, 'File is required.')
    .transform((files) => files[0])
    .refine((file) => file.type === 'text/csv', 'File must be a CSV.')
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      'File size must be less than 5MB.'
    ),
})

type ImportFormValues = z.infer<typeof importFormSchema>

export function AttendeeImportForm({
  refetchAttendees,
}: {
  refetchAttendees: () => void
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const currentEventID = pathname.split('/')[2]

  const form = useForm<ImportFormValues>({
    resolver: zodResolver(importFormSchema),
  })

  function handleImportAttendees(file: File, currentEventID: string) {
    const formData = new FormData()
    formData.append('import', file)

    fetch(`${api_endpoint}/api/v1/event/${currentEventID}/attendees/import`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    }).then((response) => {
      if (!response.ok) {
        return response.json().then((error) => {
          toast.error(error.error)
        })
      }

      toast.success('Attendees have been imported successfully.')
      refetchAttendees()
    })
  }

  function onSubmit(data: ImportFormValues) {
    handleImportAttendees(data.file, currentEventID)

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Import Attendees</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Attendees</DialogTitle>
          <DialogDescription>
            Upload a CSV file containing attendee information.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel>CSV File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={(e) => onChange(e.target.files)}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload a CSV file with attendee details. Max file size: 5MB.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Importing...' : 'Import'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
