import { api_endpoint } from '@/lib/utils'
import { EventType } from '@/types/event'
import { cookies } from 'next/headers'

export default async function EventDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value || ''

  const res = await fetch(`${api_endpoint}/api/v1/event/${params.id}`, {
    method: 'GET',
    headers: {
      Authorization: `${token}`,
    },
  })

  const event: EventType = await res.json()

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">{event.title}</h1>
      <p className="text-muted-foreground mb-4">{event.description}</p>
    </div>
  )
}
