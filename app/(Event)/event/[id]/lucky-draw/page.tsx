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
  const { data: initialParticipants } = useQuery({
    queryKey: ['attendees'],
    queryFn: () => fetchAttendees(currentEventID),
  })

  const [participants, setParticipants] = useState<AttendeeType[] | null>(null)
  const [winner, setWinner] = useState<AttendeeType | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [airBlowing, setAirBlowing] = useState(false)

  if (!initialParticipants) {
    return <LoadingComponent />
  }

  if (!participants) {
    setParticipants(initialParticipants)
  }

  const startLuckyDraw = () => {
    setIsDrawing(true)
    setWinner(null)
    setAirBlowing(true)

    setTimeout(() => {
      setAirBlowing(false)

      setTimeout(() => {
        if (participants) {
          const randomIndex = Math.floor(Math.random() * participants.length)
          const selectedWinner = participants[randomIndex]
          setWinner(selectedWinner)
          setParticipants(participants.filter((_, i) => i !== randomIndex))
          setIsDrawing(false)
        }
      }, 2000) // Stop air after 2 seconds
    }, 5000) // Air blows for 5 seconds
  }

  return (
    <div className="fixed inset-0 z-10 flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <h1 className="mb-8 text-4xl font-bold text-white">Lucky Draw</h1>

      <div className="relative flex h-[400px] w-[400px] items-center justify-center overflow-hidden border-4 border-gray-300 bg-white shadow-lg">
        {participants?.map((participant) => {
          const initials =
            `${participant.first_name[0]}${participant.last_name[0]}`.toUpperCase()
          const isWinner = winner?.id === participant.id

          return (
            <motion.div
              key={participant.id}
              initial={{
                x: Math.random() * 350 - 175,
                y: Math.random() * 350 - 175,
              }}
              animate={
                airBlowing
                  ? {
                      x: [
                        Math.random() * 350 - 175,
                        Math.random() * 350 - 175,
                        Math.random() * 350 - 175,
                      ],
                      y: [
                        Math.random() * 350 - 175,
                        Math.random() * 350 - 175,
                        Math.random() * 350 - 175,
                      ],
                    }
                  : isWinner
                  ? {
                      scale: 2, // Pop-out winner ball
                      y: -200, // Move out of the machine
                    }
                  : {
                      y: 180, // Simulate gravity
                    }
              }
              transition={{
                duration: airBlowing ? 1.2 : 2, // Faster transition for air blowing
                ease: airBlowing ? 'easeInOut' : 'easeOut',
                repeat: airBlowing ? Infinity : 0,
                repeatType: 'reverse',
              }}
              className={`absolute flex items-center justify-center rounded-full bg-blue-400 text-sm font-bold text-white shadow-md ${
                isWinner ? 'bg-green-500' : ''
              }`}
              style={{
                width: '25px', // Slightly larger size for visibility
                height: '25px',
              }}
            >
              {initials}
            </motion.div>
          )
        })}
      </div>

      {/* Control Buttons */}
      <button
        onClick={startLuckyDraw}
        className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-50"
        disabled={isDrawing}
      >
        {isDrawing ? 'Drawing...' : 'Start Lottery'}
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
