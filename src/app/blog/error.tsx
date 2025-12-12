'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-16 bg-white dark:bg-gray-900 min-h-screen transition-colors">
      <div className="max-w-md mx-auto text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="text-red-600 dark:text-red-400" size={64} />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Failed to load blog posts
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error.message || 'An error occurred while fetching posts'}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-gray-100"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  )
}
