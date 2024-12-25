'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api_endpoint } from '@/lib/utils'
import { EmailTemplateType } from '@/types/email'
import { Loader2 } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ContentEditor } from './contentEditor'
import { EmailPreview } from './emailPreview'
import { FooterImage } from './footerImage'
import { HeaderImage } from './headerImage'

export function EDMBuilder({ data }: { data: EmailTemplateType | undefined }) {
  const [headerImage, setHeaderImage] = useState('')
  const [content, setContent] = useState('')
  const [footerImage, setFooterImage] = useState('')
  const [templateID, setTemplateID] = useState(0)
  const [subject, setSubject] = useState('')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [message, setMessage] = useState('')

  const [showPreview, setShowPreview] = useState(false)
  const [onUpdate, setOnUpdate] = useState(false)
  const [loading, setLoading] = useState(false)

  const [open, setOpen] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)

  const pathname = usePathname()
  const eventID = pathname.split('/')[2]

  const router = useRouter()

  const handleGenerateEmail = () => {
    setShowPreview(true)
  }

  const handleCreateTemplate = (eventID: number) => {
    setLoading(true)
    fetch(`${api_endpoint}/api/v1/email_templates`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_id: eventID,
        header_image: headerImage,
        content: content,
        footer_image: footerImage,
        subject: subject,
        bg_color: bgColor,
        message: message,
      }),
    }).then((res) => {
      if (!res.ok) {
        return res.json().then((error) => {
          toast.error(error.error || 'Failed to save template')
          setLoading(false)
        })
      }

      toast.success('Template saved successfully')
      setLoading(false)
      setOnUpdate(true)
    })
  }

  const handleUpdateTemplate = (templateID: number, eventID: number) => {
    setLoading(true)
    fetch(`${api_endpoint}/api/v1/email_templates`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: templateID,
        event_id: eventID,
        header_image: headerImage,
        content: content,
        footer_image: footerImage,
        subject: subject,
        bg_color: bgColor,
        message: message,
      }),
    }).then((res) => {
      if (!res.ok) {
        return res.json().then((error) => {
          toast.error(error.error)
          setLoading(false)
        })
      }

      toast.success('Template updated successfully')
      setLoading(false)
      router.refresh()
    })
  }

  const handleSendEmails = () => {
    setEmailLoading(true)
    fetch(`${api_endpoint}/api/v1/event/${eventID}/attendees/send_invitation`, {
      method: 'POST',
      credentials: 'include',
    }).then((res) => {
      if (!res.ok) {
        return res.json().then((error) => {
          toast.error(error.error)
          setEmailLoading(false)
        })
      }

      toast.success('Emails sent successfully')
      setEmailLoading(false)
      setOpen(false)
    })
  }

  useEffect(() => {
    if (data) {
      setHeaderImage(data.header_image)
      setContent(data.content)
      setFooterImage(data.footer_image)
      setTemplateID(data.id)
      setSubject(data.subject)
      setBgColor(data.bg_color)
      setMessage(data.message)
      setOnUpdate(true)
    }
  }, [data])

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">EDM Builder</h1>
      <div className="space-y-4">
        <div>
          <h2 className="mb-2 text-lg font-semibold">Subject</h2>
          <Input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value)
            }}
          />
        </div>
        <div>
          <h2 className="mb-2 text-lg font-semibold">Message</h2>
          <Input
            type="text"
            placeholder="Message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
            }}
          />
        </div>
        <h2 className="text-lg font-semibold">Background Color</h2>
        <div className="flex items-center space-x-4">
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="h-12 w-12 cursor-pointer appearance-none overflow-hidden rounded-lg !border-none !outline-none"
          />
          <div className="font-semibold">{bgColor}</div>
        </div>
        <HeaderImage imageUrl={headerImage} onImageSelect={setHeaderImage} />
        <ContentEditor body={content} onContentChange={setContent} />
        <FooterImage imgaeUrl={footerImage} onImageSelect={setFooterImage} />
        <div className="flex flex-wrap gap-4">
          {onUpdate ? (
            <Button
              variant="default"
              onClick={() => {
                handleUpdateTemplate(templateID, Number(eventID))
              }}
            >
              {loading ? 'Updating...' : 'Update Template'}
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={() => {
                handleCreateTemplate(Number(eventID))
              }}
            >
              {loading ? 'Creating...' : 'Create Template'}
            </Button>
          )}

          <Button variant="secondary" onClick={handleGenerateEmail}>
            Generate Email
          </Button>
        </div>
      </div>
      {showPreview && (
        <EmailPreview
          headerImage={headerImage}
          content={content}
          footerImage={footerImage}
          backgroundColor={bgColor}
        />
      )}
      <AlertDialog open={open}>
        <AlertDialogTrigger asChild className="mt-4">
          <Button variant="default" onClick={() => setOpen(true)}>
            Send Emails to Attendees
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will send emails to all
              attendees.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={emailLoading}
              onClick={handleSendEmails}
            >
              {emailLoading && <Loader2 className="animate-spin" />}
              {emailLoading ? 'Sending' : 'Send Emails'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
