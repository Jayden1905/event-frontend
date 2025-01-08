'use client'

import ImageProvider from '@/app/(Event)/event/[id]/email/(context)/imageProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

const client = new QueryClient()

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <div>
      <QueryClientProvider client={client}>
        <ImageProvider>{children}</ImageProvider>
      </QueryClientProvider>
    </div>
  )
}
