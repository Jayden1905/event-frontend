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
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import TiptapEditor from './tiptapEditor'

const formSchema = z.object({
  subject: z.string().nonempty({ message: 'Subject is required' }),
  message: z.string().nonempty({ message: 'Message is required' }),
  content: z.string().nonempty({ message: 'Content is required' }),
})

export default function EdmBuilder() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      subject: '',
      message: '',
      content: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <div className='w-full relative'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='grid grid-cols-1 gap-4'
        >
          <FormField
            control={form.control}
            name='subject'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-lg' htmlFor='subject'>
                  Subject
                </FormLabel>
                <FormControl>
                  <Input placeholder='Your email subject here...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='message'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-lg' htmlFor='message'>
                  Message
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Your email message here...'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-lg' htmlFor='content'>
                  Content
                </FormLabel>
                <FormControl>
                  <TiptapEditor
                    description={field.value}
                    setContent={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <Button className='w-full mt-4' onClick={form.handleSubmit(onSubmit)}>
        Submit
      </Button>
    </div>
  )
}
