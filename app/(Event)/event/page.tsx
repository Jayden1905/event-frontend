'use client'

import { useRouter } from 'next/navigation'

export default function EventPage() {
  const router = useRouter()
  router.back()
}
