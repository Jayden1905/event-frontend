'use client'

import { api_endpoint } from '@/lib/utils'
import { AttendeeType } from '@/types/attendee'
import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import { AttendeeTable } from './(components)/attendeeTable'

const fetchAttendees = async (eventID: string) => {
  const response = await fetch(
    `${api_endpoint}/api/v1/event/${eventID}/attendees`,
    {
      method: 'GET',
      credentials: 'include',
    }
  )
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to fetch attendees')
  }
  return response.json() as Promise<AttendeeType[]>
}

export default function AttendeePage() {
  const pathname = usePathname()
  const currentEventID = pathname.split('/')[2]

  const { data, refetch } = useQuery({
    queryKey: ['attendees'],
    queryFn: () => fetchAttendees(currentEventID),
  })

  return (
    <div>
      <AttendeeTable attendees={data} refetchAttendee={refetch} />
    </div>
  )
}
