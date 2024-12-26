import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { EventType } from '@/types/event'

export default function EventDetails({ event }: { event: EventType }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    })
  }

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Title</TableCell>
          <TableCell>{event.title}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Description</TableCell>
          <TableCell>{event.description}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Start Date</TableCell>
          <TableCell>{formatDate(event.start_date.toString())}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">End Date</TableCell>
          <TableCell>{formatDate(event.end_date.toString())}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Location</TableCell>
          <TableCell>{event.location}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Created At</TableCell>
          <TableCell>{formatDate(event.created_at.toString())}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Updated At</TableCell>
          <TableCell>{formatDate(event.updated_at.toString())}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
