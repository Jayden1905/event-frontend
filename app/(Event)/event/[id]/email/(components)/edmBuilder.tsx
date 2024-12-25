'use client'

import { Button } from '@/components/ui/button'
import { api_endpoint } from '@/lib/utils'
import { EmailTemplateType } from '@/types/email'
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
  const [showPreview, setShowPreview] = useState(false)
  const [onUpdate, setOnUpdate] = useState(false)
  const [loading, setLoading] = useState(false)

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

  useEffect(() => {
    if (data) {
      setHeaderImage(data.header_image)
      setContent(data.content)
      setFooterImage(data.footer_image)
      setTemplateID(data.id)
      setOnUpdate(true)
    }
  }, [data])

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">EDM Builder</h1>
      <div className="space-y-4">
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
        />
      )}
    </div>
  )
}
