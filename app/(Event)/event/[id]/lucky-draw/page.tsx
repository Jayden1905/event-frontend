'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AttendeeType } from '@/types/attendee'
import { api_endpoint } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import LoadingComponent from '@/components/loading'

const fetchAttendees = async (eventID: string) => {
  const response = await fetch(
    `${api_endpoint}/api/v1/event/${eventID}/attendees/all`,
    {
      method: 'GET',
      credentials: 'include',
    }
  )
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to fetch attendees')
  }

  return response.json() as Promise<AttendeeType[]>
}

export default function LuckyDrawPage() {
  const pathname = usePathname()
  const currentEventID = pathname.split('/')[2]
  const { data: participants } = useQuery({
    queryKey: ['attendees'],
    queryFn: () => fetchAttendees(currentEventID),
  })

  const [currentIndex, setCurrentIndex] = useState(0)
  const [winner, setWinner] = useState<AttendeeType | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  if (!participants) {
    return <LoadingComponent />
  }

  const startLuckyDraw = () => {
    setIsDrawing(true)
    setWinner(null)
    let iterations = 30
    let localIndex = currentIndex

    const interval = setInterval(() => {
      localIndex = (localIndex + 1) % participants?.length
      setCurrentIndex(localIndex)
      iterations--

      if (iterations <= 0) {
        clearInterval(interval)
        setIsDrawing(false)
        setWinner(participants[localIndex])
      }
    }, 100)
  }

  return (
    <div className="fixed inset-0 z-10 flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <h1 className="mb-8 text-4xl font-bold text-white">Lucky Draw</h1>

      <div className="relative flex h-96 w-96 items-center justify-center rounded-xl bg-white shadow-lg">
        {participants.map((participant, index) => (
          <motion.div
            key={participant.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: index === currentIndex ? 1 : 0,
              scale: index === currentIndex ? 1 : 0.8,
            }}
            transition={{ duration: 0.3 }}
            className={`absolute text-center ${
              index === currentIndex ? 'z-10' : 'z-0'
            }`}
          >
            <h2 className="text-2xl font-bold text-gray-800">
              {participant.first_name} {participant.last_name}
            </h2>
            <p className="text-gray-600">{participant.email}</p>
          </motion.div>
        ))}
      </div>

      <button
        onClick={startLuckyDraw}
        className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-50"
        disabled={isDrawing}
      >
        {isDrawing ? 'Drawing...' : 'Start Lucky Draw'}
      </button>

      {winner && (
        <div className="mt-8 rounded-lg bg-white p-4 text-center shadow-md">
          <h2 className="text-2xl font-bold text-green-500">🎉 Winner 🎉</h2>
          <p className="text-gray-800">
            {winner.first_name} {winner.last_name}
          </p>
          <p className="text-gray-600">{winner.email}</p>
        </div>
      )}

      <Link href={`/event/${currentEventID}`}>
        <Button
          disabled={isDrawing}
          className="mt-8 rounded-lg px-6 py-3 font-semibold shadow-md disabled:opacity-50"
        >
          Back To Event
        </Button>
      </Link>
    </div>
  )
}
