export type EventType = {
  id: number
  title: string
  description: string
  start_date: Date
  end_date: Date
  location: string
  userID: number
  createdAt: Date
  updatedAt: Date
}

export type CreateEventType = {
  title: string
  description: string
  startDate: Date
  endDate: Date
  location: string
}
