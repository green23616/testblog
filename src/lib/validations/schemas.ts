import { z } from 'zod'

// Post validation schema
export const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  excerpt: z.string().max(300, 'Excerpt is too long').optional().nullable(),
  published: z.boolean().default(false),
  reading_time_minutes: z.number().int().positive().optional().nullable(),
  meta_title: z.string().max(60, 'Meta title is too long').optional().nullable(),
  meta_description: z.string().max(160, 'Meta description is too long').optional().nullable(),
  og_image: z.string().url('Invalid image URL').optional().nullable(),
  tag_ids: z.array(z.string().uuid()).optional(),
})

export type PostFormData = z.infer<typeof postSchema>

// Tag validation schema
export const tagSchema = z.object({
  name: z.string().min(1, 'Tag name is required').max(50, 'Tag name is too long'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
})

export type TagFormData = z.infer<typeof tagSchema>

// Comment validation schema
export const commentSchema = z.object({
  post_id: z.string().uuid('Invalid post ID'),
  author_name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
  author_email: z.string().email('Invalid email address'),
  content: z
    .string()
    .min(10, 'Comment must be at least 10 characters')
    .max(1000, 'Comment is too long'),
})

export type CommentFormData = z.infer<typeof commentSchema>

// Search validation schema
export const searchSchema = z.object({
  query: z.string().min(1).max(100),
  limit: z.number().int().positive().max(50).default(10),
  offset: z.number().int().nonnegative().default(0),
})

export type SearchParams = z.infer<typeof searchSchema>
