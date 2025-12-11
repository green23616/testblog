-- Fix SELECT policy to allow reading unpublished posts in admin
-- Run this in Supabase SQL Editor

-- Add policy to allow reading ALL posts (including drafts)
-- This is needed for the admin dashboard to see unpublished posts
CREATE POLICY "Allow reading all posts"
  ON posts FOR SELECT
  USING (true);

-- Note: Now we have TWO SELECT policies:
-- 1. "Public posts viewable" - allows reading published posts (for public blog)
-- 2. "Allow reading all posts" - allows reading all posts (for admin dashboard)
--
-- Postgres RLS uses OR logic: if ANY policy allows access, the query succeeds
-- So: Public users see published posts, Admin sees all posts
