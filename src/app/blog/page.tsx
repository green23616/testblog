'use client'

import { getPosts } from '@/app/actions/posts'
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { ThemeToggle } from '@/components/ThemeToggle'
import { SearchBar } from '@/components/SearchBar'
import { useEffect, useState } from 'react'
import type { Post } from '@/types/database'

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadPosts() {
      const { posts: data, error: err } = await getPosts({ limit: 20 })
      if (err) {
        setError(err)
      } else {
        setPosts(data)
        setFilteredPosts(data)
      }
      setIsLoading(false)
    }
    loadPosts()
  }, [])

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredPosts(posts)
      return
    }

    const lowercaseQuery = query.toLowerCase()
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowercaseQuery) ||
        post.excerpt?.toLowerCase().includes(lowercaseQuery) ||
        post.content.toLowerCase().includes(lowercaseQuery)
    )
    setFilteredPosts(filtered)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 bg-white dark:bg-gray-900 min-h-screen transition-colors">
        <div className="absolute top-8 right-8">
          <ThemeToggle />
        </div>
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">Blog</h1>
        <p className="text-gray-600 dark:text-gray-400">Loading posts...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 bg-white dark:bg-gray-900 min-h-screen transition-colors">
        <div className="absolute top-8 right-8">
          <ThemeToggle />
        </div>
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">Blog</h1>
        <p className="text-red-600">Error loading posts: {error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 bg-white dark:bg-gray-900 min-h-screen transition-colors">
      <div className="absolute top-8 right-8">
        <ThemeToggle />
      </div>
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">Blog</h1>

      <div className="mb-8 max-w-2xl">
        <SearchBar onSearch={handleSearch} />
      </div>

      {filteredPosts.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          {posts.length === 0 ? 'No posts yet. Check back soon!' : 'No posts found matching your search.'}
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Featured Image Thumbnail */}
              {post.featured_image && (
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={post.featured_image}
                      alt={post.featured_image_alt || post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </Link>
              )}

              <div className="p-6">
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-2xl font-bold mb-2 hover:text-blue-600 dark:hover:text-blue-400 text-gray-900 dark:text-gray-100">
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
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
