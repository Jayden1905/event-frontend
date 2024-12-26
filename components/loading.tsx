import { Loader2 } from 'lucide-react'

export default function LoadingComponent() {
  return (
    // <div className="fixed inset-0 z-10 flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 opacity-90">
    <div className="fixed inset-0 z-20 flex min-h-screen w-full flex-col items-center justify-center bg-neutral-800 opacity-90">
      <div className="text-center">
        <Loader2 className="mx-auto mb-4 h-16 w-16 animate-spin text-white" />
        <h1 className="mb-2 text-3xl font-bold text-white">Loading...</h1>
        <p className="text-lg text-indigo-200">
          Please wait while we prepare your data
        </p>
      </div>
    </div>
  )
}
