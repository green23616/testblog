import { getPosts } from '@/app/actions/posts'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export const revalidate = 3600 // Revalidate every hour

export default async function BlogPage() {
  const { posts, error } = await getPosts({ limit: 20 })

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <p className="text-red-600">Error loading posts: {error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>

      {posts.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          No posts yet. Check back soon!
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-bold mb-2 hover:text-blue-600 dark:hover:text-blue-400">
                  {post.title}
                </h2>
              </Link>

              {post.excerpt && (
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {post.excerpt}
                </p>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500">
                <time dateTime={post.created_at}>
                  {formatDistanceToNow(new Date(post.created_at), {
                    addSuffix: true,
                  })}
                </time>
                {post.reading_time_minutes && (
                  <span>{post.reading_time_minutes} min read</span>
                )}
              </div>

              <div className="mt-4 text-sm text-gray-500 dark:text-gray-500">
                {post.view_count} views
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
