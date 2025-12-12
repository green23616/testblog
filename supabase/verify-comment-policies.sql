-- Verify comment policies exist
-- Run this in Supabase SQL Editor to check current policies

SELECT
    schemaname,
    tablename,
    policyname,
    cmd as command,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'comments'
ORDER BY policyname;
