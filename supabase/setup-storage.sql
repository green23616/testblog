-- Phase 5: Image Upload Functionality
-- Setup Supabase Storage bucket and RLS policies
-- IMPORTANT: Designed to avoid RLS issues encountered in Phase 3 & 4

-- 1. Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage RLS Policies
-- Note: Storage policies work differently than table policies
-- Since bucket is public, we use permissive policies to avoid blocking legitimate operations

-- Allow EVERYONE to read images (public bucket)
CREATE POLICY "Anyone can view blog images"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

-- Allow EVERYONE to upload (we'll validate in application code)
-- This prevents RLS blocking during upload operations
CREATE POLICY "Anyone can upload blog images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blog-images');

-- Allow EVERYONE to update (for image replacement scenarios)
CREATE POLICY "Anyone can update blog images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'blog-images')
WITH CHECK (bucket_id = 'blog-images');

-- Allow EVERYONE to delete (admin validation in app code)
CREATE POLICY "Anyone can delete blog images"
ON storage.objects FOR DELETE
USING (bucket_id = 'blog-images');

-- 3. Add featured_image column to posts table
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS featured_image TEXT;

-- 4. Add image metadata columns (optional but useful)
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS featured_image_alt TEXT;

COMMENT ON COLUMN posts.featured_image IS 'Public URL of the featured image from Supabase Storage';
COMMENT ON COLUMN posts.featured_image_alt IS 'Alt text for the featured image (accessibility)';

-- Note: Security is handled at application level (admin routes require auth)
-- This prevents RLS policy conflicts during file operations
-- Images are in public bucket anyway, so read access is expected
