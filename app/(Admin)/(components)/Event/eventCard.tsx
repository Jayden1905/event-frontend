import { CalendarIcon, MapPinIcon } from 'lucide-react'
import { format } from 'date-fns'

import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface EventCardProps {
  id: number
  title: string
  description: string
  startDate: Date
  endDate: Date
  location: string
  className?: string
}

export function EventCard({
  id,
  title,
  description,
  startDate,
  endDate,
  location,
  className,
}: EventCardProps) {
  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <Badge variant="secondary">
            {startDate.getTime() === endDate.getTime()
              ? 'One-day Event'
              : 'Multi-day Event'}
          </Badge>
        </div>
        <CardDescription className="mt-2 line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center">
            <CalendarIcon className="text-muted-foreground mr-2 h-5 w-5" />
            <span className="text-sm">
              {format(startDate, 'MMMM d, yyyy')}
              {startDate.getTime() !== endDate.getTime() &&
                ` - ${format(endDate, 'MMMM d, yyyy')}`}
            </span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="text-muted-foreground mr-2 h-5 w-5" />
            <span className="text-sm">{location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/event/${id}`}>
          <Button className="w-full">Mange Event</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
