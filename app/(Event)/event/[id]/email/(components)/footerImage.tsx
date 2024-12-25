'use client'

import { Input } from '@/components/ui/input'

interface FooterImageProps {
  onImageSelect: (imageUrl: string) => void
  imgaeUrl: string
}

export function FooterImage({ onImageSelect, imgaeUrl }: FooterImageProps) {
  return (
    <div className="pt-2">
      <h2 className="text-lg font-semibold">Footer Image</h2>
      <Input
        type="text"
        placeholder="Enter footer image URL"
        value={imgaeUrl}
        onChange={(e) => onImageSelect(e.target.value)}
      />
    </div>
  )
}
