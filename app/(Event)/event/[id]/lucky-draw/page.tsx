'use client'

import LoadingComponent from '@/components/loading'
import { Button } from '@/components/ui/button'
import { api_endpoint } from '@/lib/utils'
import { AttendeeType } from '@/types/attendee'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Confetti } from './(components)/confetti'

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
        {participants?.map((participant, index) => {
          const initials =
            `${participant.first_name[0]}${participant.last_name[0]}`.toUpperCase()
          const colors = [
            'bg-red-400',
            'bg-blue-400',
            'bg-yellow-400',
            'bg-purple-400',
            'bg-pink-400',
            'bg-indigo-400',
            'bg-teal-500',
            'bg-green-400',
          ]
          const colorClass = colors[index % colors.length]

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
              className={`absolute ${colorClass} flex items-center justify-center rounded-full text-sm font-bold text-white shadow-md`}
              style={{
                width: '25px', // Slightly larger size for visibility
                height: '25px',
              }}
              drag
              dragConstraints={{
                left: -175,
                right: 175,
                top: -175,
                bottom: 175,
              }}
              dragElastic={0.5}
              whileTap={{ scale: 1.2 }}
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
        {isDrawing ? 'Drawing...' : 'Start Drawing'}
      </button>

      <div className="mt-8 flex h-[150px] w-[250px] flex-col items-center justify-center gap-2 rounded-lg bg-white p-4 text-center shadow-md">
        {winner && (
          <>
            <Confetti />
            <h2 className="text-2xl font-bold text-green-500">🎉 Winner 🎉</h2>
            <p className="text-gray-800">
              {winner.first_name} {winner.last_name}
            </p>
            <p className="text-gray-600">{winner.email}</p>
          </>
        )}
      </div>

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
