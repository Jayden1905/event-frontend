'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CldUploadButton } from 'next-cloudinary'

interface FooterImageProps {
  onImageSelect: (imageUrl: string) => void
  imgaeUrl: string
}

export function FooterImage({ onImageSelect, imgaeUrl }: FooterImageProps) {
  return (
    <div className="pt-2">
      <h2 className="mb-2 text-lg font-semibold">Footer Image</h2>
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
        placeholder="Enter footer image URL"
        value={imgaeUrl}
        onChange={(e) => onImageSelect(e.target.value)}
      />
    </div>
  )
}
