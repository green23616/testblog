'use client'

import { approveComment } from '@/app/actions/comments'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function ApproveCommentButton({ commentId }: { commentId: string }) {
  const router = useRouter()
  const [isApproving, setIsApproving] = useState(false)

  const handleApprove = async () => {
    setIsApproving(true)

    try {
      const result = await approveComment(commentId)

      if (result.success) {
        router.refresh()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      alert('Failed to approve comment')
      console.error(error)
    } finally {
      setIsApproving(false)
    }
  }

  return (
    <button
      onClick={handleApprove}
      disabled={isApproving}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
    >
      <Check size={18} />
      {isApproving ? 'Approving...' : 'Approve'}
    </button>
  )
}
