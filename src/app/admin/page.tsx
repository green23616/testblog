import { getPosts } from '@/app/actions/posts'
import { getTags } from '@/app/actions/tags'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function AdminDashboard() {
  const [{ posts }, { tags }] = await Promise.all([
    getPosts({ limit: 5, includeUnpublished: true }),
    getTags(),
  ])

  const publishedCount = posts.filter((p) => p.published).length
  const draftCount = posts.filter((p) => !p.published).length

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          New Post
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
            Total Posts
          </h3>
          <p className="text-3xl font-bold">{posts.length}</p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
            Published
          </h3>
          <p className="text-3xl font-bold">{publishedCount}</p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <h3 className="text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-2">
            Drafts
          </h3>
          <p className="text-3xl font-bold">{draftCount}</p>
        </div>
      </div>

      {/* Recent Posts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Recent Posts</h3>
          <Link
            href="/admin/posts"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="space-y-3">
          {posts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              No posts yet. Create your first post!
            </p>
          ) : (
            posts.slice(0, 5).map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex-1">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="font-medium hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {post.title}
                  </Link>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                    <span>{post.view_count} views</span>
                    <span>
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div>
                  {post.published ? (
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded-full">
                      Published
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-sm rounded-full">
                      Draft
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Tags Summary */}
      <div>
        <h3 className="text-xl font-bold mb-4">Tags ({tags.length})</h3>
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 10).map((tag) => (
            <span
              key={tag.id}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
            >
              {tag.name}
            </span>
          ))}
          {tags.length > 10 && (
            <Link
              href="/admin/tags"
              className="px-3 py-1 text-blue-600 dark:text-blue-400 text-sm hover:underline"
            >
              +{tags.length - 10} more
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
