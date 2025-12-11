import { getTags } from '@/app/actions/tags'
import { PostForm } from '@/components/admin/PostForm'

export default async function NewPostPage() {
  const { tags } = await getTags()

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Create New Post</h2>
      <PostForm tags={tags} />
    </div>
  )
}
