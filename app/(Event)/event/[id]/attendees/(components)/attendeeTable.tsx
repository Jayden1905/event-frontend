'use client'

import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from '@radix-ui/react-icons'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import * as React from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { api_endpoint } from '@/lib/utils'
import { AttendeeType } from '@/types/attendee'
import { Loader2 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { AttendeeCreateForm } from './attendeeForm'
import { AttendeeImportForm } from './attendeeImport'
import Link from 'next/link'

function handleDeleteAttendee(id: number, eventID: number) {
  fetch(`${api_endpoint}/api/v1/event/${eventID}/attendees/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((data) => {
        toast.error(data.error || 'Failed to delete attendee.')
      })
    }

    toast.success('Attendee has been deleted successfully.')
  })
}

function handleMarkAttendance(email: string) {
  fetch(`${api_endpoint}/api/v1/attendees/mark_attendance/${email}`, {
    method: 'POST',
    credentials: 'include',
  }).then((res) => {
    if (!res.ok) {
      return res.json().then((data) => {
        toast.error(data.error)
      })
    }

    toast.success('Attendance marked successfully')
  })
}

export const columns: ColumnDef<AttendeeType>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue('email') || ''}</div>
    ),
  },
  {
    accessorKey: 'first_name',
    header: 'First Name',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('first_name') || ''}</div>
    ),
  },
  {
    accessorKey: 'last_name',
    header: 'Last Name',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('last_name') || ''}</div>
    ),
  },
  {
    accessorKey: 'company_name',
    header: 'Company Name',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('company_name') || ''}</div>
    ),
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('title') || ''}</div>
    ),
  },
  {
    accessorKey: 'table_no',
    header: 'Table No.',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('table_no') || 0}</div>
    ),
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('role') || ''}</div>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const attendee = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() =>
                navigator.clipboard.writeText(String(attendee.email))
              }
            >
              Copy Attendee Email
            </DropdownMenuItem>
            <Link href={`/event/${attendee.event_id}/attendees/${attendee.id}`}>
              <DropdownMenuItem className="cursor-pointer">
                Edit Attendee
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleMarkAttendance(attendee.email)}
            >
              Mark Attendance
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                handleDeleteAttendee(attendee.id, attendee.event_id)
              }}
            >
              Delete Attendee
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function AttendeeTable({
  attendees,
  refetchAttendees,
}: {
  attendees: AttendeeType[] | undefined
  refetchAttendees: () => void
}) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [data, setData] = React.useState<AttendeeType[]>(attendees ?? [])
  const [loading, setLoading] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  function handleDeleteAllAttendees(eventID: number) {
    setLoading(true)
    fetch(`${api_endpoint}/api/v1/event/${eventID}/attendees`, {
      method: 'DELETE',
      credentials: 'include',
    }).then((res) => {
      if (!res.ok) {
        return res.json().then((data) => {
          setLoading(false)
          setOpen(false)
          toast.error(data.error || 'Failed to delete attendees.')
        })
      }

      setLoading(false)
      setOpen(false)
      toast.success('Attendees have been deleted successfully.')
      refetchAttendees()
    })
  }

  useEffect(() => {
    setData(attendees ?? [])
  }, [attendees])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const pathname = usePathname()
  const currentEventID = Number(pathname.split('/')[2])

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('email')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex items-center space-x-4">
          <div className="hidden items-center space-x-4 lg:flex">
            <AttendeeImportForm refetchAttendees={refetchAttendees} />
            <AttendeeCreateForm refetchAttendees={refetchAttendees} />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-start gap-4">
        <div className="flex flex-wrap items-center gap-4 lg:hidden">
          <AttendeeImportForm refetchAttendees={refetchAttendees} />
          <AttendeeCreateForm refetchAttendees={refetchAttendees} />
        </div>
        <AlertDialog open={open}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" onClick={() => setOpen(true)}>
              Delete All Attendees
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all
                the attendees.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setOpen(false)
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeleteAllAttendees(currentEventID)}
                disabled={loading}
              >
                {loading && <Loader2 className="animate-spin" />}
                {loading ? 'Deleting' : 'Delete All'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
