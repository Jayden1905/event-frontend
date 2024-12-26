'use client'
import { useState } from 'react'
import { QRCodeScanner } from './(components)/qrReader'

export default function CheckInPage() {
  const [scannedResult, setScannedResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleQRCodeResult = (result: string) => {
    setScannedResult(result)
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="mb-2 text-3xl font-bold">Check-in Page</h1>
      <QRCodeScanner onResult={handleQRCodeResult} setError={setError} />
      {scannedResult && (
        <div
          className={`mt-8 rounded-lg ${
            error ? 'bg-red-500' : 'bg-green-100'
          } p-4`}
        >
          <h2 className="mb-2 text-xl font-semibold">Scanned Result:</h2>
          <p className="break-all">
            {error
              ? scannedResult + ' already marked attenance.'
              : scannedResult + ' attendance marked successfully.'}
          </p>
        </div>
      )}
    </div>
  )
}
