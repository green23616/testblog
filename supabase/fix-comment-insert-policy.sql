-- Fix comment INSERT policy
-- Run this in Supabase SQL Editor if comment submission fails

-- Drop existing policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public comment submission" ON comments;

-- Recreate the policy to allow public comment insertion
CREATE POLICY "Allow public comment submission"
  ON comments FOR INSERT
  WITH CHECK (true);

-- Note: This allows anyone to submit comments
-- Comments are created with approved=false and require admin approval
-- If you need SELECT policy for approved comments:
DROP POLICY IF EXISTS "Allow reading approved comments" ON comments;

CREATE POLICY "Allow reading approved comments"
  ON comments FOR SELECT
  USING (approved = true);
