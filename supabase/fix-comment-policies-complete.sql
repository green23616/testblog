-- Complete comment policies fix
-- This drops ALL existing comment policies and recreates them correctly
-- Run this in Supabase SQL Editor

-- Drop all existing comment policies
DROP POLICY IF EXISTS "Allow public comment submission" ON comments;
DROP POLICY IF EXISTS "Allow all update on comments" ON comments;
DROP POLICY IF EXISTS "Allow all delete on comments" ON comments;
DROP POLICY IF EXISTS "Allow reading approved comments" ON comments;

-- Policy 1: Allow anyone to INSERT comments (public submission)
-- Comments are created with approved=false by default
CREATE POLICY "Allow public comment submission"
  ON comments
  FOR INSERT
  WITH CHECK (true);

-- Policy 2: Allow reading ONLY approved comments (public viewing)
CREATE POLICY "Allow reading approved comments"
  ON comments
  FOR SELECT
  USING (approved = true);

-- Policy 3: Allow UPDATE on all comments (admin approval/editing)
CREATE POLICY "Allow all update on comments"
  ON comments
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy 4: Allow DELETE on all comments (admin moderation)
CREATE POLICY "Allow all delete on comments"
  ON comments
  FOR DELETE
  USING (true);
