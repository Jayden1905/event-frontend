'use client'

import { Button } from '@/components/ui/button'
import { Check, Trash } from 'lucide-react'
import Image from 'next/image'

interface GalleryImageProps {
  src: string
  onDelete?: () => void
  onSelected?: () => void
}

export default function GalleryImage({
  src,
  onDelete,
  onSelected,
}: GalleryImageProps) {
  return (
    <div className='relative group w-full aspect-square overflow-hidden rounded'>
      <Image
        src={src}
        alt='image'
        className='w-full h-full object-cover'
        width={600}
        height={600}
      />

      <div className='absolute hidden group-hover:flex bottom-0 left-0 right-0'>
        <Button
          className='flex-1 flex justify-center rounded-none items-center'
          variant={'destructive'}
          size={'icon'}
          onClick={onDelete}
        >
          <Trash className='h-5 w-5' />
        </Button>
        <Button
          className='bg-green-600 hover:bg-green-500 rounded-none flex-1 flex justify-center items-center'
          size={'icon'}
          onClick={onSelected}
        >
          <Check className='h-5 w-5' />
        </Button>
      </div>
    </div>
  )
}
