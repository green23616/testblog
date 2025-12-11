'use server'

import { createClient } from '@/lib/supabase/server'
import { postSchema, type PostFormData } from '@/lib/validations/schemas'
import { revalidatePath } from 'next/cache'
import type { PostWithTags } from '@/types/database'

/**
 * Fetch published posts with pagination
 */
export async function getPosts(options?: {
  limit?: number
  offset?: number
  includeUnpublished?: boolean
}) {
  const { limit = 10, offset = 0, includeUnpublished = false } = options || {}

  const supabase = await createClient()

  let query = supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (!includeUnpublished) {
    query = query.eq('published', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching posts:', error)
    return { posts: [], error: error.message }
  }

  return { posts: data, error: null }
}

/**
 * Fetch single post by slug with tags
 */
export async function getPostBySlug(slug: string): Promise<{
  post: PostWithTags | null
  error: string | null
}> {
  const supabase = await createClient()

  // Fetch post
  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (postError || !post) {
    return { post: null, error: postError?.message || 'Post not found' }
  }

  // Fetch tags for this post
  const { data: postTags, error: tagsError } = await supabase
    .from('post_tags')
    .select('tag_id, tags(*)')
    .eq('post_id', post.id)

  if (tagsError) {
    console.error('Error fetching tags:', tagsError)
  }

  const tags = postTags?.map((pt: any) => pt.tags).filter(Boolean) || []

  return {
    post: { ...post, tags },
    error: null,
  }
}

/**
 * Increment view count for a post
 */
export async function incrementViewCount(postId: string) {
  const supabase = await createClient()

  const { error } = await supabase.rpc('increment_view_count', {
    post_id: postId,
  })

  if (error) {
    console.error('Error incrementing view count:', error)
    return { success: false, error: error.message }
  }

  return { success: true, error: null }
}

/**
 * Create a new post (admin only)
 */
export async function createPost(formData: PostFormData) {
  const validation = postSchema.safeParse(formData)

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.flatten().fieldErrors,
    }
  }

  const supabase = await createClient()
  const { tag_ids, ...postData } = validation.data

  // Insert post
  const { data: post, error: postError } = await supabase
    .from('posts')
    .insert(postData)
    .select()
    .single()

  if (postError || !post) {
    return {
      success: false,
      error: postError?.message || 'Failed to create post',
    }
  }

  // Link tags if provided
  if (tag_ids && tag_ids.length > 0) {
    const postTagsData = tag_ids.map((tag_id) => ({
      post_id: post.id,
      tag_id,
    }))

    const { error: tagError } = await supabase
      .from('post_tags')
      .insert(postTagsData)

    if (tagError) {
      console.error('Error linking tags:', tagError)
    }
  }

  revalidatePath('/blog')
  revalidatePath(`/blog/${post.slug}`)

  return {
    success: true,
    post,
    error: null,
  }
}

/**
 * Update an existing post (admin only)
 */
export async function updatePost(id: string, formData: PostFormData) {
  const validation = postSchema.safeParse(formData)

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.flatten().fieldErrors,
    }
  }

  const supabase = await createClient()
  const { tag_ids, ...postData } = validation.data

  // Update post
  const { data: post, error: postError } = await supabase
    .from('posts')
    .update(postData)
    .eq('id', id)
    .select()
    .single()

  if (postError || !post) {
    return {
      success: false,
      error: postError?.message || 'Failed to update post',
    }
  }

  // Update tags if provided
  if (tag_ids !== undefined) {
    // Remove existing tags
    await supabase.from('post_tags').delete().eq('post_id', id)

    // Add new tags
    if (tag_ids.length > 0) {
      const postTagsData = tag_ids.map((tag_id) => ({
        post_id: id,
        tag_id,
      }))

      const { error: tagError } = await supabase
        .from('post_tags')
        .insert(postTagsData)

      if (tagError) {
        console.error('Error updating tags:', tagError)
      }
    }
  }

  revalidatePath('/blog')
  revalidatePath(`/blog/${post.slug}`)

  return {
    success: true,
    post,
    error: null,
  }
}

/**
 * Delete a post (admin only)
 */
export async function deletePost(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('posts').delete().eq('id', id)

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  revalidatePath('/blog')

  return {
    success: true,
    error: null,
  }
}
