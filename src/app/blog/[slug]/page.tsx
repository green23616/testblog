import { getPostBySlug, incrementViewCount } from '@/app/actions/posts'
import { notFound } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ThemeToggle } from '@/components/ThemeToggle'
import { CommentForm } from '@/components/CommentForm'
import { CommentList } from '@/components/CommentList'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { post } = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.og_image ? [{ url: post.og_image, width: 1200, height: 630 }] : [],
      type: 'article',
      publishedTime: post.created_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || undefined,
      images: post.og_image ? [post.og_image] : [],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const { post, error } = await getPostBySlug(slug)

  if (error || !post) {
    notFound()
  }

  // Increment view count (fire and forget)
  incrementViewCount(post.id).catch(console.error)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || undefined,
    image: post.og_image || undefined,
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    author: {
      '@type': 'Person',
      name: 'Blog Author',
    },
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="absolute top-8 right-8">
        <ThemeToggle />
      </div>
      <article className="container mx-auto px-4 py-16 max-w-3xl">
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">{post.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <time dateTime={post.created_at}>
            {formatDistanceToNow(new Date(post.created_at), {
              addSuffix: true,
            })}
          </time>

          {post.reading_time_minutes && (
            <span>{post.reading_time_minutes} min read</span>
          )}

          <span>{post.view_count} views</span>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="prose dark:prose-invert max-w-none">
        {post.content.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>

        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <a
            href="/blog"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to blog
          </a>
        </footer>

        {/* Comments Section */}
        <section className="mt-12">
          <CommentList postId={post.id} />
          <CommentForm postId={post.id} />
        </section>
      </article>
    </div>
  )
}
