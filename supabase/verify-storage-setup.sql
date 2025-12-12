-- Verify storage setup is complete

-- 1. Check if blog-images bucket exists
SELECT id, name, public
FROM storage.buckets
WHERE id = 'blog-images';
-- Expected: 1 row with name='blog-images', public=true

-- 2. Check if featured_image columns exist in posts table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'posts'
  AND column_name IN ('featured_image', 'featured_image_alt')
ORDER BY column_name;
-- Expected: 2 rows (featured_image, featured_image_alt)

-- 3. Check storage RLS policies
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'objects'
  AND schemaname = 'storage'
ORDER BY policyname;
-- Expected: 4 policies for blog-images bucket
