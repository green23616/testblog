import Link from 'next/link'
import { Home, FileText, Tags, MessageSquare } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link
                href="/"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                ← Back to Site
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-gray-100"
              >
                <Home size={20} />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/admin/posts"
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-gray-100"
              >
                <FileText size={20} />
                <span>Posts</span>
              </Link>
              <Link
                href="/admin/tags"
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-gray-100"
              >
                <Tags size={20} />
                <span>Tags</span>
              </Link>
              <Link
                href="/admin/comments"
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-gray-100"
              >
                <MessageSquare size={20} />
                <span>Comments</span>
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
