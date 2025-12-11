import { getComments } from '@/app/actions/comments'
import { createClient } from '@/lib/supabase/server'
import { formatDistanceToNow } from 'date-fns'
import { ApproveCommentButton } from '@/components/admin/ApproveCommentButton'
import { DeleteCommentButton } from '@/components/admin/DeleteCommentButton'

export default async function AdminCommentsPage() {
  const supabase = await createClient()

  // Fetch all comments (approved and pending)
  const { data: comments } = await supabase
    .from('comments')
    .select('*, posts(title, slug)')
    .order('created_at', { ascending: false })

  const pendingCount = comments?.filter((c) => !c.approved).length || 0
  const approvedCount = comments?.filter((c) => c.approved).length || 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Comments</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {pendingCount} pending • {approvedCount} approved
        </p>
      </div>

      {/* Pending Comments */}
      {pendingCount > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-yellow-600 dark:text-yellow-400">
            Pending Approval ({pendingCount})
          </h3>
          <div className="space-y-4">
            {comments
              ?.filter((c) => !c.approved)
              .map((comment: any) => (
                <div
                  key={comment.id}
                  className="border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium">{comment.author_name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {comment.author_email}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(comment.created_at), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    {comment.content}
                  </p>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-yellow-200 dark:border-yellow-800">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      On:{' '}
                      <a
                        href={`/blog/${comment.posts.slug}`}
                        target="_blank"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {comment.posts.title}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <ApproveCommentButton commentId={comment.id} />
                      <DeleteCommentButton
                        commentId={comment.id}
                        authorName={comment.author_name}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Approved Comments */}
      {approvedCount > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Approved Comments ({approvedCount})
          </h3>
          <div className="space-y-4">
            {comments
              ?.filter((c) => c.approved)
              .map((comment: any) => (
                <div
                  key={comment.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium">{comment.author_name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {comment.author_email}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(comment.created_at), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    {comment.content}
                  </p>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      On:{' '}
                      <a
                        href={`/blog/${comment.posts.slug}`}
                        target="_blank"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {comment.posts.title}
                      </a>
                    </div>
                    <DeleteCommentButton
                      commentId={comment.id}
                      authorName={comment.author_name}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {comments?.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">No comments yet.</p>
      )}
    </div>
  )
}
