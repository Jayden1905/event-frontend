'use client'

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { readAllImages } from '../(actions)/file'
import { usePathname } from 'next/navigation'

interface InitialImageContent {
  images: string[]
  updateImages: (images: string[]) => void
  removeOldImages: (src: string) => void
}

const Context = createContext<InitialImageContent | null>(null)

export default function ImageProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<string[]>([])

  const pathname = usePathname()
  const eventID = pathname.split('/')[2]

  const updateImages = (data: string[]) => {
    setImages([...data, ...images])
  }

  const removeOldImages = (src: string) => {
    setImages(images.filter((image) => image !== src))
  }

  useEffect(() => {
    readAllImages(eventID).then(setImages)
  }, [eventID])

  return (
    <Context.Provider value={{ images, updateImages, removeOldImages }}>
      {children}
    </Context.Provider>
  )
}

export const useImages = () => useContext(Context)
