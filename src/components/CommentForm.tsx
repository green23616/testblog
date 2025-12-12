'use client'

import { submitComment } from '@/app/actions/comments'
import { useState } from 'react'
import { MessageSquare } from 'lucide-react'

interface CommentFormProps {
  postId: string
}

export function CommentForm({ postId }: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    author_name: '',
    author_email: '',
    content: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await submitComment({
        ...formData,
        post_id: postId,
      })

      if (result.success) {
        setSuccess(true)
        setFormData({ author_name: '', author_email: '', content: '' })
      } else {
        if (typeof result.error === 'string') {
          setError(result.error)
        } else {
          const fieldErrors = Object.entries(result.error || {})
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('\n')
          setError(fieldErrors || 'Validation failed')
        }
      }
    } catch (err) {
      setError('Failed to submit comment')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <MessageSquare size={24} />
        Leave a Comment
      </h3>

      {success && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-300">
          Thank you! Your comment has been submitted and is awaiting approval.
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-300">
          <pre className="whitespace-pre-wrap text-sm">{error}</pre>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="author_name" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
              Name *
            </label>
            <input
              type="text"
              id="author_name"
              value={formData.author_name}
              onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="author_email" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
              Email *
            </label>
            <input
              type="email"
              id="author_email"
              value={formData.author_email}
              onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Your email will not be published
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
            Comment *
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Share your thoughts..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Comment'}
        </button>
      </form>
    </div>
  )
}
