'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

const client = new QueryClient()

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <div>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </div>
  )
}
