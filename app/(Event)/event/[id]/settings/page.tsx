import useAuthServer from '@/hooks/useAuthServer'
import { api_endpoint } from '@/lib/utils'
import { EventType } from '@/types/event'
import EventEditForm from './(components)/eventEditForm'

export default async function EventSettingPage({
  params,
}: {
  params: { id: string }
}) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { token } = await useAuthServer()

  const res = await fetch(`${api_endpoint}/api/v1/event/${params.id}`, {
    method: 'GET',
    headers: {
      Authorization: `${token}`,
    },
  })

  const event: EventType = await res.json()

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">{event.title} Settings Page</h1>
      <EventEditForm data={event} />
    </div>
  )
}
