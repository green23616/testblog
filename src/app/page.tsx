import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-sans text-sm">
        <h1 className="text-4xl font-bold mb-4">Test Blog</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Next.js 16 + React 19.2 + TailwindCSS 3.4.18 + Supabase
        </p>
        <Link
          href="/blog"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Blog Posts
        </Link>
      </div>
    </main>
  );
}
