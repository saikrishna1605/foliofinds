'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="mx-auto max-w-md text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Something went wrong!
            </h2>
            <p className="mt-4 text-gray-600">
              We apologize for the inconvenience. Please try again.
            </p>
            <div className="mt-6">
              <Button onClick={reset}>
                Try again
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
