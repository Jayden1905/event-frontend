'use client'

import { EventType } from '@/types/event'
import { EventCard } from './eventCard'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function EventClientPage({ events }: { events: EventType[] }) {
  const [search, setSearch] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchResults, setSearchResults] = useState<EventType[]>([])

  const upcomingEvents = events.filter((event) => {
    return new Date(event.start_date) > new Date()
  })

  const ongoingEvents = events.filter((event) => {
    return (
      new Date(event.start_date) <= new Date() &&
      new Date(event.end_date) >= new Date()
    )
  })

  const pastEvents = events.filter((event) => {
    return new Date(event.end_date) < new Date()
  })

  useEffect(() => {
    if (searchQuery.length > 0) {
      setSearch(true)
      const results = events.filter((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setSearchResults(results)
    } else {
      setSearch(false)
    }
  }, [events, searchQuery, searchQuery.length])

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Input
          onChange={(e) => {
            setSearchQuery(e.target.value)
          }}
          type="text"
          placeholder="Search for events by title"
          className="w-1/2 rounded-lg border border-gray-300 p-2"
        />
        <Link href="/dashboard/events/create">
          <Button size={'lg'}>
            <Plus /> Create New Event
          </Button>
        </Link>
      </div>
      {search && (
        <div className="mb-10">
          <h1 className="mb-3 text-3xl font-bold">Search Results</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {searchResults.map((event) => (
              <div key={event.id}>
                <EventCard
                  id={event.id}
                  title={event.title}
                  description={event.description}
                  startDate={new Date(event.start_date)}
                  endDate={new Date(event.end_date)}
                  location={event.location}
                  className="mb-4"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {!search && (
        <div>
          {ongoingEvents.length > 0 && (
            <div className="mb-10">
              <h1 className="mb-3 text-3xl font-bold">Ongoing Events</h1>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {ongoingEvents.map((event) => (
                  <div key={event.id}>
                    <EventCard
                      id={event.id}
                      title={event.title}
                      description={event.description}
                      startDate={new Date(event.start_date)}
                      endDate={new Date(event.end_date)}
                      location={event.location}
                      className="mb-4"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mb-10">
            <h1 className="mb-3 text-3xl font-bold">UpcomingEvents Events</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents &&
                upcomingEvents.map((event) => (
                  <div key={event.id}>
                    <EventCard
                      id={event.id}
                      title={event.title}
                      description={event.description}
                      startDate={new Date(event.start_date)}
                      endDate={new Date(event.end_date)}
                      location={event.location}
                      className="mb-4"
                    />
                  </div>
                ))}
            </div>
          </div>
          <div className="mb-10">
            <h1 className="mb-3 text-3xl font-bold">Past Events</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pastEvents.length > 0 ? (
                pastEvents.map((event) => (
                  <div key={event.id}>
                    <EventCard
                      id={event.id}
                      title={event.title}
                      description={event.description}
                      startDate={new Date(event.start_date)}
                      endDate={new Date(event.end_date)}
                      location={event.location}
                      className="mb-4"
                    />
                  </div>
                ))
              ) : (
                <p>No past events for now.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
