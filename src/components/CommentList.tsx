import { getComments } from '@/app/actions/comments'
import { formatDistanceToNow } from 'date-fns'

interface CommentListProps {
  postId: string
}

export async function CommentList({ postId }: CommentListProps) {
  const { comments, error } = await getComments(postId, true)

  if (error) {
    return (
      <div className="text-red-600 dark:text-red-400">
        Error loading comments: {error}
      </div>
    )
  }

  if (comments.length === 0) {
    return (
      <p className="text-gray-600 dark:text-gray-400 text-center py-8">
        No comments yet. Be the first to comment!
      </p>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Comments ({comments.length})
      </h3>

      {comments.map((comment) => (
        <div
          key={comment.id}
          className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {comment.author_name}
            </span>
            <time className="text-sm text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(comment.created_at), {
                addSuffix: true,
              })}
            </time>
          </div>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {comment.content}
          </p>
        </div>
      ))}
    </div>
  )
}
