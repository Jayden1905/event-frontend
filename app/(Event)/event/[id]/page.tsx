import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useAuthServer from '@/hooks/useAuthServer'
import { api_endpoint } from '@/lib/utils'
import { AttendeeType } from '@/types/attendee'
import { EventType } from '@/types/event'
import { CalendarDays, MapPin, UserCheck, Users } from 'lucide-react'
import AttendanceChart from './(components)/attendanceChart'
import AttendeeList from './(components)/attendeeList'
import EventDetails from './(components)/eventDetails'

export default async function EventDetailPage({
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

  const attendeesRes = await fetch(
    `${api_endpoint}/api/v1/event/${params.id}/attendees/all`,
    {
      method: 'GET',
      headers: {
        Authorization: `${token}`,
      },
    }
  )

  const attendees: AttendeeType[] = await attendeesRes.json()

  const totalAttendees = attendees.length
  const presentAttendees = attendees.filter((a) => a.attendance).length

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {event.title} Dashboard
        </h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendees">Attendees</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Attendees
                </CardTitle>
                <Users className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAttendees}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Present Attendees
                </CardTitle>
                <UserCheck className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{presentAttendees}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Event Duration
                </CardTitle>
                <CalendarDays className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1 day</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Location</CardTitle>
                <MapPin className="text-muted-foreground h-4 w-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{event.location}</div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent>
                <EventDetails event={event} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <AttendanceChart attendees={attendees} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="attendees">
          <Card>
            <CardHeader>
              <CardTitle>Attendee List</CardTitle>
            </CardHeader>
            <CardContent>
              <AttendeeList attendees={attendees} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
