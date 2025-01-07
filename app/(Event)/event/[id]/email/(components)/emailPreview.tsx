'use client'
import { Html, Tailwind } from '@react-email/components'

export default function EmailPreview({ content }: { content: string }) {
  return (
    <Html>
      <Tailwind>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </Tailwind>
    </Html>
  )
}
