import { getTags } from '@/app/actions/tags'
import { TagForm } from '@/components/admin/TagForm'
import { DeleteTagButton } from '@/components/admin/DeleteTagButton'

export default async function AdminTagsPage() {
  const { tags } = await getTags()

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Tags Management</h2>

      {/* Create New Tag */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Create New Tag</h3>
        <TagForm />
      </div>

      {/* Existing Tags */}
      <div>
        <h3 className="text-lg font-semibold mb-4">All Tags ({tags.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 col-span-full">
              No tags yet. Create your first tag above!
            </p>
          ) : (
            tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div>
                  <div className="font-medium">{tag.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    /{tag.slug}
                  </div>
                </div>
                <DeleteTagButton tagId={tag.id} tagName={tag.name} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
