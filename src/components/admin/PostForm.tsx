'use client'

import { createPost, updatePost } from '@/app/actions/posts'
import { getTags } from '@/app/actions/tags'
import type { Post, Tag } from '@/types/database'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Save, X } from 'lucide-react'
import { ImageUploader } from '@/components/ImageUploader'
import MarkdownEditor from '@/components/admin/MarkdownEditor'
import PreviewPanel from '@/components/admin/PreviewPanel'

interface PostFormProps {
  post?: Post
  tags: Tag[]
}

export function PostForm({ post, tags: initialTags }: PostFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tags, setTags] = useState<Tag[]>(initialTags)

  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    content: post?.content || '',
    excerpt: post?.excerpt || '',
    published: post?.published || false,
    reading_time_minutes: post?.reading_time_minutes || null,
    meta_title: post?.meta_title || '',
    meta_description: post?.meta_description || '',
    og_image: post?.og_image || '',
    featured_image: post?.featured_image || '',
    featured_image_alt: post?.featured_image_alt || '',
    tag_ids: [] as string[],
  })

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: post ? prev.slug : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const result = post
        ? await updatePost(post.id, formData)
        : await createPost(formData)

      if (result.success) {
        router.push('/admin/posts')
        router.refresh()
      } else {
        if (typeof result.error === 'string') {
          setError(result.error)
        } else {
          // Format field errors
          const fieldErrors = Object.entries(result.error || {})
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('\n')
          setError(fieldErrors || 'Validation failed')
        }
      }
    } catch (err) {
      setError('Failed to save post')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-300">
          <pre className="whitespace-pre-wrap text-sm">{error}</pre>
        </div>
      )}

      {/* Title - Full Width */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter post title"
        />
      </div>

      {/* Split Layout: Editor Left, Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT PANEL - Form Fields */}
        <div className="space-y-6">

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="block text-sm font-medium mb-2">
          Slug *
        </label>
        <input
          type="text"
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
          pattern="[a-z0-9-]+"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="post-url-slug"
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          URL-friendly version (lowercase, hyphens only)
        </p>
      </div>

      {/* Excerpt */}
      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          value={formData.excerpt || ''}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          rows={2}
          maxLength={300}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Short description (max 300 characters)"
        />
      </div>

      {/* Featured Image */}
      <ImageUploader
        currentImageUrl={formData.featured_image}
        currentImageAlt={formData.featured_image_alt}
        onUploadComplete={(url) => setFormData({ ...formData, featured_image: url })}
        onAltTextChange={(alt) => setFormData({ ...formData, featured_image_alt: alt })}
      />

      {/* Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-2">
          Content * (Markdown)
        </label>
        <MarkdownEditor
          value={formData.content}
          onChange={(content) => setFormData({ ...formData, content })}
          placeholder="Write your post content in markdown..."
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium mb-2">Tags</label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <label
              key={tag.id}
              className="flex items-center gap-2 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-full cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <input
                type="checkbox"
                value={tag.id}
                checked={formData.tag_ids.includes(tag.id)}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    tag_ids: e.target.checked
                      ? [...prev.tag_ids, tag.id]
                      : prev.tag_ids.filter((id) => id !== tag.id),
                  }))
                }}
                className="rounded"
              />
              <span className="text-sm">{tag.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reading Time */}
      <div>
        <label htmlFor="reading_time_minutes" className="block text-sm font-medium mb-2">
          Reading Time (minutes)
        </label>
        <input
          type="number"
          id="reading_time_minutes"
          value={formData.reading_time_minutes || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              reading_time_minutes: e.target.value ? parseInt(e.target.value) : null,
            })
          }
          min="1"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Estimated reading time"
        />
      </div>

      {/* SEO Fields */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">SEO & Metadata</h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="meta_title" className="block text-sm font-medium mb-2">
              Meta Title
            </label>
            <input
              type="text"
              id="meta_title"
              value={formData.meta_title || ''}
              onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
              maxLength={60}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="SEO title (max 60 chars)"
            />
          </div>

          <div>
            <label htmlFor="meta_description" className="block text-sm font-medium mb-2">
              Meta Description
            </label>
            <textarea
              id="meta_description"
              value={formData.meta_description || ''}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              maxLength={160}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="SEO description (max 160 chars)"
            />
          </div>

          <div>
            <label htmlFor="og_image" className="block text-sm font-medium mb-2">
              OG Image URL
            </label>
            <input
              type="url"
              id="og_image"
              value={formData.og_image || ''}
              onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      </div>

      {/* Published Toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="published"
          checked={formData.published}
          onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
          className="w-5 h-5 rounded"
        />
        <label htmlFor="published" className="text-sm font-medium">
          Publish immediately
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={20} />
          {isSubmitting ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <X size={20} />
          Cancel
        </button>
      </div>

        </div>

        {/* RIGHT PANEL - Preview */}
        <div className="lg:sticky lg:top-4 lg:h-fit">
          <PreviewPanel title={formData.title} content={formData.content} />
        </div>
      </div>
    </form>
  )
}
