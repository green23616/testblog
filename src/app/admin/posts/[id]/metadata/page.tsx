import { createClient } from '@/lib/supabase/server'
import { getTags } from '@/app/actions/tags'
import { PostMetadataForm } from '@/components/admin/PostMetadataForm'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ id: string }>
}

export default async function PostMetadataPage({ params }: Props) {
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
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Post Metadata & SEO</h2>
      </div>
      <PostMetadataForm post={post} tags={tags} />
    </div>
  )
}
