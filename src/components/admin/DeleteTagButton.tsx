'use client'

import { deleteTag } from '@/app/actions/tags'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function DeleteTagButton({
  tagId,
  tagName,
}: {
  tagId: string
  tagName: string
}) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete the tag "${tagName}"?`)) {
      return
    }

    setIsDeleting(true)

    try {
      const result = await deleteTag(tagId)

      if (result.success) {
        router.refresh()
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      alert('Failed to delete tag')
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
      title="Delete"
    >
      <Trash2 size={18} />
    </button>
  )
}
