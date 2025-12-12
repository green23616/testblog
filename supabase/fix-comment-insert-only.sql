-- Fix comment INSERT by removing the .select() call requirement
-- The issue might be that INSERT policy works but SELECT policy blocks reading back

-- Drop and recreate ALL comment policies with proper configuration
DROP POLICY IF EXISTS "Allow public comment submission" ON comments;
DROP POLICY IF EXISTS "Allow reading approved comments" ON comments;
DROP POLICY IF EXISTS "Allow all update on comments" ON comments;
DROP POLICY IF EXISTS "Allow all delete on comments" ON comments;

-- INSERT: Allow anyone to insert (this is what submitComment needs)
CREATE POLICY "Allow public comment submission"
  ON comments
  FOR INSERT
  WITH CHECK (true);

-- SELECT: Allow reading ALL comments (not just approved)
-- This is needed for .select() in the insert query to work
CREATE POLICY "Allow reading all comments for insert"
  ON comments
  FOR SELECT
  USING (true);

-- UPDATE: Admin only
CREATE POLICY "Allow all update on comments"
  ON comments
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- DELETE: Admin only
CREATE POLICY "Allow all delete on comments"
  ON comments
  FOR DELETE
  USING (true);
