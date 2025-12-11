'use server'

import { createClient } from '@/lib/supabase/server'
import { tagSchema, type TagFormData } from '@/lib/validations/schemas'
import { revalidatePath } from 'next/cache'

/**
 * Fetch all tags
 */
export async function getTags() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching tags:', error)
    return { tags: [], error: error.message }
  }

  return { tags: data, error: null }
}

/**
 * Create a new tag (admin only)
 */
export async function createTag(formData: TagFormData) {
  const validation = tagSchema.safeParse(formData)

  if (!validation.success) {
    return {
      success: false,
      error: validation.error.flatten().fieldErrors,
    }
  }

  const supabase = await createClient()

  const { data: tag, error } = await supabase
    .from('tags')
    .insert(validation.data)
    .select()
    .single()

  if (error || !tag) {
    return {
      success: false,
      error: error?.message || 'Failed to create tag',
    }
  }

  revalidatePath('/blog')

  return {
    success: true,
    tag,
    error: null,
  }
}

/**
 * Delete a tag (admin only)
 */
export async function deleteTag(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('tags').delete().eq('id', id)

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
