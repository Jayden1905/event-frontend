import { Color } from 'three'

export type AttendeeType = {
  id: number
  first_name: string
  last_name: string
  email: string
  event_id: number
  qr_code: string
  company_name: string
  title: string
  table_no: number
  role: string
  attendance: boolean
}

export type CreateAttendeeType = {
  first_name: string
  last_name: string
  email: string
  company_name: string
  title: string
  table_no: number
  role: string
}
