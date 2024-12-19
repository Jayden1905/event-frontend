import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { api_endpoint } from '@/lib/utils'
import { EventType } from '@/types/event'
import { toast } from 'sonner'
import EventClientPage from '../../(components)/Event/eventClientPage'

export default async function DashboardEventPage() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value || ''

  const response = await fetch(`${api_endpoint}/api/v1/events`, {
    method: 'GET',
    headers: {
      Authorization: `${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    toast.error(error.error)
    return null
  }

  const events: EventType[] = await response.json()

  return (
    <div>
      {events == null && (
        <main className="flex min-h-[86vh] w-full flex-col gap-2 lg:gap-2">
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-2xl font-bold tracking-tight">
                You have no events
              </h1>
              <p className="text-muted-foreground mb-3 text-sm">
                Event will show up here once you create them.
              </p>
              <Link href={`/dashboard/events/create`}>
                <Button>Create New Event</Button>
              </Link>
            </div>
          </div>
        </main>
      )}

      {events != null && <EventClientPage events={events} />}
    </div>
  )
}
