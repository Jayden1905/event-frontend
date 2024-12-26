'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api_endpoint } from '@/lib/utils'
import { EventType } from '@/types/event'
import { useQuery } from '@tanstack/react-query'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const fetchEvents = async () => {
  const res = await fetch(`${api_endpoint}/api/v1/events`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!res.ok) {
    return []
  }

  return (await res.json()) as EventType[]
}

export default function DashboardPage() {
  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: () => fetchEvents(),
  })

  if (!events) {
    return <p>Loading...</p>
  }

  // Calculate total events
  const totalEvents = events.length

  // Calculate average event duration
  const avgDuration =
    events.reduce((acc, event) => {
      const start = new Date(event.start_date)
      const end = new Date(event.end_date)
      return acc + (end.getTime() - start.getTime()) / (1000 * 3600 * 24) // in days
    }, 0) / totalEvents

  // Prepare data for events over time chart
  const eventsOverTime = events.reduce(
    (acc: { [key: string]: number }, event) => {
      const month = new Date(event.start_date).toLocaleString('default', {
        month: 'short',
      })
      acc[month] = (acc[month] || 0) + 1
      return acc
    },
    {}
  )

  const eventsOverTimeData = Object.entries(eventsOverTime).map(
    ([month, count]) => ({ month, count })
  )

  // Prepare data for events by location
  const eventsByLocation = events.reduce(
    (acc: { [key: string]: number }, event) => {
      acc[event.location] = (acc[event.location] || 0) + 1
      return acc
    },
    {}
  )

  const eventsByLocationData = Object.entries(eventsByLocation).map(
    ([location, count]) => ({ location, count })
  )

  // Prepare recent events list
  const recentEvents = [...events]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5)

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Event Analytics Dashboard</h1>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalEvents}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Event Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{avgDuration.toFixed(1)} days</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Events Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventsOverTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Events by Location</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={eventsByLocationData}
                  dataKey="count"
                  nameKey="location"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#82ca9d"
                  label
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recentEvents.map((event) => (
              <li key={event.id} className="bg-secondary rounded p-2">
                <span className="font-bold">{event.title}</span> -{' '}
                {new Date(event.start_date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
