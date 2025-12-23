import { PostForm } from '@/components/admin/PostForm'

export default async function NewPostPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Create New Post</h2>
      <PostForm />
    </div>
  )
}
