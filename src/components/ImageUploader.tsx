'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useRef } from 'react'
import Image from 'next/image'

interface ImageUploaderProps {
  currentImageUrl?: string
  currentImageAlt?: string
  onUploadComplete: (url: string) => void
  onAltTextChange?: (alt: string) => void
}

export function ImageUploader({
  currentImageUrl,
  currentImageAlt = '',
  onUploadComplete,
  onAltTextChange,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl || null
  )
  const [altText, setAltText] = useState(currentImageAlt)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return 'Invalid file type. Please upload JPG, PNG, WebP, or GIF.'
    }

    // Check file size (2 MB limit)
    const maxSize = 2 * 1024 * 1024 // 2 MB
    if (file.size > maxSize) {
      return 'File size must be under 2 MB. Please compress your image.'
    }

    return null
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setUploading(true)

    try {
      const supabase = createClient()

      // Create unique filename with timestamp
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('blog-images').getPublicUrl(uploadData.path)

      // Update preview and notify parent
      setPreviewUrl(publicUrl)
      onUploadComplete(publicUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      console.error('Upload error:', err)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl(null)
    onUploadComplete('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAltTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAlt = e.target.value
    setAltText(newAlt)
    onAltTextChange?.(newAlt)
  }

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Featured Image
        </label>
        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 dark:text-gray-400
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-md file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     dark:file:bg-blue-900 dark:file:text-blue-200
                     hover:file:bg-blue-100 dark:hover:file:bg-blue-800
                     disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {previewUrl && (
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={uploading}
              className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400
                       hover:text-red-700 dark:hover:text-red-300
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Remove
            </button>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          JPG, PNG, WebP, or GIF (max 2 MB)
        </p>
      </div>

      {/* Upload Status */}
      {uploading && (
        <div className="text-sm text-blue-600 dark:text-blue-400">
          Uploading image...
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
          {error}
        </div>
      )}

      {/* Image Preview */}
      {previewUrl && (
        <div className="space-y-3">
          <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <Image
              src={previewUrl}
              alt={altText || 'Preview'}
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          {/* Alt Text Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Alt Text (for accessibility)
            </label>
            <input
              type="text"
              value={altText}
              onChange={handleAltTextChange}
              placeholder="Describe this image..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600
                       rounded-md shadow-sm focus:outline-none focus:ring-2
                       focus:ring-blue-500 dark:focus:ring-blue-400
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Helps screen readers and improves SEO
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
