'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { AttendeeType } from '@/types/attendee'

export default function AttendeeList({
  attendees,
}: {
  attendees: AttendeeType[]
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(attendees.length / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAttendees = attendees.slice(startIndex, endIndex)

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Table</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Attendance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentAttendees.map((attendee) => (
            <TableRow key={attendee.id}>
              <TableCell>{`${attendee.first_name} ${attendee.last_name}`}</TableCell>
              <TableCell>{attendee.email}</TableCell>
              <TableCell>{attendee.company_name || 'N/A'}</TableCell>
              <TableCell>{attendee.title || 'N/A'}</TableCell>
              <TableCell>{attendee.table_no || 'N/A'}</TableCell>
              <TableCell>{attendee.role || 'N/A'}</TableCell>
              <TableCell>
                {attendee.attendance ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-muted-foreground text-sm">
          Showing {startIndex + 1} to {Math.min(endIndex, attendees.length)} of{' '}
          {attendees.length} entries
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
