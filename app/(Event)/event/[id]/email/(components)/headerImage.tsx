'use client'

import { Input } from '@/components/ui/input'

interface HeaderImageProps {
  onImageSelect: (imageUrl: string) => void
  imageUrl: string
}

export function HeaderImage({ onImageSelect, imageUrl }: HeaderImageProps) {
  return (
    <div className="pb-2">
      <h2 className="text-lg font-semibold">Header Image</h2>
      <Input
        type="text"
        placeholder="Enter header image URL"
        value={imageUrl}
        onChange={(e) => onImageSelect(e.target.value)}
      />
    </div>
  )
}
