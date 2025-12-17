'use client'

import { getPosts } from '@/app/actions/posts'
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { ThemeToggle } from '@/components/ThemeToggle'
import { SearchBar } from '@/components/SearchBar'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Post } from '@/types/database'

const POSTS_PER_PAGE = 12

export default function BlogPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [totalPosts, setTotalPosts] = useState(0)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    async function loadPosts() {
      setIsLoading(true)
      const offset = (currentPage - 1) * POSTS_PER_PAGE
      const { posts: data, total, error: err } = await getPosts({
        limit: POSTS_PER_PAGE,
        offset
      })
      if (err) {
        setError(err)
      } else {
        setPosts(data)
        setFilteredPosts(data)
        setTotalPosts(total)
      }
      setIsLoading(false)
    }
    if (!isSearching) {
      loadPosts()
    }
  }, [currentPage, isSearching])

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredPosts(posts)
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const lowercaseQuery = query.toLowerCase()
    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowercaseQuery) ||
        post.excerpt?.toLowerCase().includes(lowercaseQuery) ||
        post.content.toLowerCase().includes(lowercaseQuery)
    )
    setFilteredPosts(filtered)
  }

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  const navigateToPage = (page: number) => {
    const url = page === 1 ? '/blog' : `/blog?page=${page}`
    router.push(url)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePreviousPage = () => {
    if (canGoPrevious) {
      navigateToPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (canGoNext) {
      navigateToPage(currentPage + 1)
    }
  }

  const handlePageClick = (page: number) => {
    navigateToPage(page)
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    pages.push(1)

    if (currentPage > 3) {
      pages.push('...')
    }

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (currentPage < totalPages - 2) {
      pages.push('...')
    }

    pages.push(totalPages)

    return pages
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
        <>
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

          {/* Pagination - only show when not searching */}
          {!isSearching && totalPages > 1 && (
            <div className="mt-12 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={!canGoPrevious}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700
                           bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                           hover:bg-gray-50 dark:hover:bg-gray-700
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, index) => (
                    typeof page === 'number' ? (
                      <button
                        key={index}
                        onClick={() => handlePageClick(page)}
                        className={`px-4 py-2 rounded-lg border transition-colors
                          ${currentPage === page
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                      >
                        {page}
                      </button>
                    ) : (
                      <span key={index} className="px-2 text-gray-500 dark:text-gray-400">
                        {page}
                      </span>
                    )
                  ))}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={!canGoNext}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700
                           bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                           hover:bg-gray-50 dark:hover:bg-gray-700
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors"
                >
                  Next
                </button>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Page {currentPage} of {totalPages} ({totalPosts} posts total)
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
