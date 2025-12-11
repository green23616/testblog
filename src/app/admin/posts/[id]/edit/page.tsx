import { createClient } from '@/lib/supabase/server'
import { getTags } from '@/app/actions/tags'
import { PostForm } from '@/components/admin/PostForm'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch post
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !post) {
    notFound()
  }

  // Fetch tags
  const { tags } = await getTags()

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Edit Post</h2>
      <PostForm post={post} tags={tags} />
    </div>
  )
}
