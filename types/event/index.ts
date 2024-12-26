export type EventType = {
  id: number
  title: string
  description: string
  start_date: Date
  end_date: Date
  location: string
  userID: number
  created_at: Date
  updated_at: Date
}

export type CreateEventType = {
  title: string
  description: string
  startDate: Date
  endDate: Date
  location: string
}
