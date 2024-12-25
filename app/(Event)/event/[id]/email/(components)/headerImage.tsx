'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CldUploadButton } from 'next-cloudinary'

interface HeaderImageProps {
  onImageSelect: (imageUrl: string) => void
  imageUrl: string
}

export function HeaderImage({ onImageSelect, imageUrl }: HeaderImageProps) {
  return (
    <div className="pb-2">
      <h2 className="mb-2 text-lg font-semibold">Header Image</h2>
      <Button asChild variant="default" className="mb-2">
        <CldUploadButton
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          onSuccess={(result) => {
            if (
              typeof result.info === 'object' &&
              'secure_url' in result.info
            ) {
              onImageSelect(result.info.secure_url)
            }
          }}
        />
      </Button>

      <Input
        type="text"
        placeholder="Enter header image URL"
        value={imageUrl}
        onChange={(e) => onImageSelect(e.target.value)}
      />
    </div>
  )
}
