'use server'

import { createClient } from '@/lib/supabase/server'
import { commentSchema, type CommentFormData } from '@/lib/validations/schemas'
import { revalidatePath } from 'next/cache'

/**
 * Fetch comments for a post
 */
export async function getComments(postId?: string, approvedOnly = true) {
  const supabase = await createClient()

  let query = supabase
    .from('comments')
    .select('*')
    .order('created_at', { ascending: false })

  if (postId) {
    query = query.eq('post_id', postId)
  }

  if (approvedOnly) {
    query = query.eq('approved', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching comments:', error)
    return { comments: [], error: error.message }
  }

  return { comments: data, error: null }
}

/**
 * Submit a new comment (public)
 */
export async function submitComment(formData: CommentFormData) {
  const validation = commentSchema.safeParse(formData)

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.flatten().fieldErrors,
    }
  }

  const supabase = await createClient()

  const { data: comment, error } = await supabase
    .from('comments')
    .insert({ ...validation.data, approved: false })
    .select()
    .single()

  if (error || !comment) {
    return {
      success: false,
      error: error?.message || 'Failed to submit comment',
    }
  }

  return {
    success: true,
    comment,
    error: null,
  }
}

/**
 * Approve a comment (admin only)
 */
export async function approveComment(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('comments')
    .update({ approved: true })
    .eq('id', id)

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  revalidatePath('/admin/comments')

  return {
    success: true,
    error: null,
  }
}

/**
 * Delete a comment (admin only)
 */
export async function deleteComment(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('comments').delete().eq('id', id)

  if (error) {
    return {
      success: false,
      error: error.message,
    }
  }

  revalidatePath('/admin/comments')

  return {
    success: true,
    error: null,
  }
}
