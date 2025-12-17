import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Build-time Supabase client (no cookies, for generateStaticParams)
 * Uses anon key for read-only access at build time
 */
export function createBuildClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )
}
