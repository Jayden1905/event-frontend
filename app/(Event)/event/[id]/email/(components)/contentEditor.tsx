'use client'

import { Button } from '@/components/ui/button'

interface ContentEditorProps {
  onContentChange: (content: string) => void
  body: string
}

export function ContentEditor({ onContentChange, body }: ContentEditorProps) {
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onContentChange(e.target.value)
  }

  const insertPlaceholder = (placeholder: string) => {
    const newContent = body + ` {{${placeholder}}}`
    onContentChange(newContent)
  }

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Email Content</h2>
      <div className="mb-2 flex space-x-2">
        <Button onClick={() => insertPlaceholder('qr_code')}>
          Insert QR Code
        </Button>
      </div>
      <textarea
        className="h-64 w-full rounded border p-2"
        value={body}
        onChange={handleContentChange}
      />
    </div>
  )
}
