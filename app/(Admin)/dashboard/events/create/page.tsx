import EventForm from '@/app/(Admin)/(components)/Event/eventCreateForm'

export default async function CreateEventPage() {
  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Creating A New Event</h1>
      <p className="text-muted-foreground mb-4">
        Fill out the form below to create a new event.
      </p>
      <EventForm />
    </div>
  )
}
