'use client'

import { Button } from '@/components/ui/button'
import { visibleAtom } from '@/lib/store'
import { Editor } from '@tiptap/react'
import { useAtom } from 'jotai'
import { CloudUpload, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { FileUploader } from 'react-drag-drop-files'
import { toast } from 'sonner'
import { deleteImage, uploadFile } from '../(actions)/file'
import { useImages } from '../(context)/imageProvider'
import GalleryImage from './galleryImage'

interface ImageGalleryProps {
  editor: Editor | null
}

export default function ImageGallery({ editor }: ImageGalleryProps) {
  const [visible, setVisible] = useAtom(visibleAtom)
  const [isUploading, setIsUploading] = useState(false)

  const image = useImages()
  const images = image?.images
  const updateImages = image?.updateImages
  const removeOldImages = image?.removeOldImages

  const pathname = usePathname()
  const eventID = pathname.split('/')[2]

  function handleClose() {
    setVisible(!visible)
  }

  function handleSelection(image: string) {
    editor?.chain().focus().setImage({ src: image, alt: image }).run()
    handleClose()
  }

  if (!visible) return null

  if (!editor) return null

  return (
    <div
      tabIndex={-1}
      onKeyDown={({ key }) => {
        if (key === 'Escape') handleClose()
      }}
      className='fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40 flex items-center justify-center'
    >
      <div className='relative md:w-[760px] w-[80%] h-[80%] bg-white rounded-md p-4 overflow-y-auto'>
        <div className='absolute right-4 top-4 p-2 z-40'>
          <Button size={'icon'} onClick={handleClose}>
            <X className='h-5 w-5' />
          </Button>
        </div>
        <FileUploader
          handleChange={async (file: File) => {
            setIsUploading(true)
            try {
              const formData = new FormData()
              formData.append('file', file)

              const res = await uploadFile(formData, eventID)
              if (res && updateImages) {
                updateImages([res.secure_url])
                toast.success('Image uploaded successfully')
              }
            } catch (error) {
              console.log(error)
              toast.error('Failed to upload image')
            }
            setIsUploading(false)
          }}
          name='file'
          types={['png', 'jpg', 'jpeg', 'webp']}
        >
          <div className='flex items-center justify-center w-full'>
            <label className='flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600'>
              <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                <CloudUpload className='w-6 h-6' />
                <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
                  <span className='font-semibold'>Click to upload</span> or drag
                  and drop
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  Image File
                </p>
              </div>
              <input id='dropzone-file' type='file' className='hidden' />
            </label>
          </div>
        </FileUploader>
        {!images?.length ? (
          <p className='p-4 text-center text-xl font-semibold opacity-45'>
            No Images to render.
          </p>
        ) : null}
        <div className='grid gap-4 md:grid-cols-3 grid-cols-2 mt-4'>
          {isUploading && (
            <div className='w-full aspect-square rounded animate-pulse bg-gray-200'></div>
          )}
          {images?.map((image, index) => (
            <GalleryImage
              key={index}
              src={image}
              onSelected={() => handleSelection(image)}
              onDelete={async () => {
                await deleteImage(image)
                if (removeOldImages) {
                  removeOldImages(image)
                  toast.success('Image deleted successfully')
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
