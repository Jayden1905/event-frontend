'use client'

import { Button } from '@/components/ui/button'
import { api_endpoint } from '@/lib/utils'
import { useState } from 'react'
import { QrReader } from 'react-qr-reader'
import { toast } from 'sonner'

interface QRCodeScannerProps {
  onResult: (result: string) => void
  setError: (error: string) => void
}

export function QRCodeScanner({ onResult, setError }: QRCodeScannerProps) {
  const [startScan, setStartScan] = useState(false)

  function handleMarkAttendance(email: string) {
    fetch(`${api_endpoint}/api/v1/attendees/mark_attendance/${email}`, {
      method: 'POST',
      credentials: 'include',
    }).then((res) => {
      if (!res.ok) {
        return res.json().then((data) => {
          toast.error(data.error)
          setError(data.error)
        })
      }

      toast.success('Attendance marked successfully')
    })
  }

  const handleScan = (result: unknown) => {
    if (result) {
      handleMarkAttendance((result as { text: string }).text)
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
