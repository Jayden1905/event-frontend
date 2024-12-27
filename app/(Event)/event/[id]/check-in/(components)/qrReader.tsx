'use client'

import { Button } from '@/components/ui/button'
import { api_endpoint } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { QrReader } from 'react-qr-reader'
import { toast } from 'sonner'

interface QRCodeScannerProps {
  onResult: (result: string) => void
  setError: (error: boolean) => void
}

export function QRCodeScanner({ onResult, setError }: QRCodeScannerProps) {
  const [startScan, setStartScan] = useState(false)

  const mutationMarkAttendance = useMutation({
    mutationKey: ['markAttendance'],
    mutationFn: async (email: string) => {
      const res = await fetch(
        `${api_endpoint}/api/v1/attendees/mark_attendance/${email}`,
        {
          method: 'POST',
          credentials: 'include',
        }
      )

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }

      return res.json()
    },

    onSuccess: () => {
      toast.success('Attendance marked successfully')
      setError(false)
    },

    onError: (error: Error) => {
      toast.error(error.message)
      setError(true)
    },
  })

  const handleScan = (result: unknown) => {
    if (result) {
      mutationMarkAttendance.mutate((result as { text: string }).text)
      onResult((result as { text: string }).text)
    }
  }

  return (
    <>
      <div className="mx-auto w-full max-w-md">
        {startScan && (
          <>
            <QrReader
              className="mb-4"
              onResult={handleScan}
              constraints={{ facingMode: 'environment' }}
              videoStyle={{ width: '100%' }}
              containerStyle={{ width: '100%' }}
            />
            <p className="mt-2 text-sm text-gray-500">
              Position the QR code within the camera view to scan.
            </p>
          </>
        )}
      </div>
      <Button
        size={'lg'}
        className="text-xl"
        onClick={() => {
          setStartScan(!startScan)
          if (startScan) {
            onResult('')
          }
        }}
      >
        {startScan ? 'Stop Scan' : 'Start Scan'}
      </Button>
    </>
  )
}
