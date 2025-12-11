import { getPosts } from '@/app/actions/posts'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { DeletePostButton } from '@/components/admin/DeletePostButton'

export default async function AdminPostsPage() {
  const { posts } = await getPosts({ limit: 100, includeUnpublished: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">All Posts</h2>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          New Post
        </Link>
      </div>

      {/* Posts Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-semibold">Title</th>
              <th className="text-left py-3 px-4 font-semibold">Status</th>
              <th className="text-left py-3 px-4 font-semibold">Views</th>
              <th className="text-left py-3 px-4 font-semibold">Created</th>
              <th className="text-right py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500 dark:text-gray-400">
                  No posts yet. Create your first post!
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <td className="py-3 px-4">
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="font-medium hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {post.title}
                    </Link>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      /{post.slug}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {post.published ? (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs rounded-full">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {post.view_count}
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </Link>
                      <DeletePostButton postId={post.id} postTitle={post.title} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
