"use client";

import { createPost, updatePost } from "@/app/actions/posts";
import type { Post } from "@/types/database";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Save, X, Settings } from "lucide-react";
import { ImageUploader } from "@/components/ImageUploader";
import PreviewPanel from "@/components/admin/PreviewPanel";

const MarkdownEditor = dynamic(() => import("@/components/admin/MarkdownEditor"), {
  ssr: false,
  loading: () => <div className="h-96 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-500">Loading editor...</div>,
});

interface PostFormProps {
  post?: Post;
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    content: post?.content || "",
    published: post?.published || false,
    featured_image: post?.featured_image || "",
    featured_image_alt: post?.featured_image_alt || "",
  });

  // Auto-generate slug from title (only for new posts)
  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: post
        ? prev.slug
        : title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Add required fields with defaults for validation
      const postData = {
        ...formData,
        excerpt: post?.excerpt || null,
        meta_title: post?.meta_title || null,
        meta_description: post?.meta_description || null,
        og_image: post?.og_image || null,
        reading_time_minutes: post?.reading_time_minutes || null,
      };

      const result = post
        ? await updatePost(post.id, postData)
        : await createPost(postData);

      if (result.success) {
        // For new posts, redirect to metadata page
        if (!post && result.post?.id) {
          router.push(`/admin/posts/${result.post.id}/metadata`);
        } else {
          router.push("/admin/posts");
        }
        router.refresh();
      } else {
        if (typeof result.error === "string") {
          setError(result.error);
        } else {
          const fieldErrors = Object.entries(result.error || {})
            .map(
              ([field, errors]) =>
                `${field}: ${Array.isArray(errors) ? errors.join(", ") : errors}`
            )
            .join("\n");
          setError(fieldErrors || "Validation failed");
        }
      }
    } catch (err) {
      setError("Failed to save post");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-300">
          <pre className="whitespace-pre-wrap text-sm">{error}</pre>
        </div>
      )}

      {/* Header with Title and Metadata Link */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            className="w-full px-4 py-3 text-2xl font-bold border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter post title"
          />
        </div>
        {post && (
          <button
            type="button"
            onClick={() => router.push(`/admin/posts/${post.id}/metadata`)}
            className="flex items-center gap-2 px-4 py-2 mt-7 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            title="Manage metadata, tags, and SEO"
          >
            <Settings size={20} />
            Metadata
          </button>
        )}
      </div>

      {/* Split Layout: Editor Left, Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT PANEL - Editor */}
        <div className="space-y-6">
          {/* Featured Image */}
          <ImageUploader
            currentImageUrl={formData.featured_image}
            currentImageAlt={formData.featured_image_alt}
            onUploadComplete={(url) =>
              setFormData({ ...formData, featured_image: url })
            }
            onAltTextChange={(alt) =>
              setFormData({ ...formData, featured_image_alt: alt })
            }
          />

          {/* Content Editor */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-2">
              Content * (Markdown)
            </label>
            <MarkdownEditor
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="Write your post content in markdown..."
            />
          </div>

          {/* Published Toggle */}
          <div className="flex items-center gap-3 pt-4">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) =>
                setFormData({ ...formData, published: e.target.checked })
              }
              className="w-5 h-5 rounded"
            />
            <label htmlFor="published" className="text-sm font-medium">
              Publish immediately
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {isSubmitting
                ? "Saving..."
                : post
                ? "Update Post"
                : "Create & Setup Metadata"}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={20} />
              Cancel
            </button>
          </div>
        </div>

        {/* RIGHT PANEL - Enhanced Preview */}
        <div className="lg:sticky lg:top-4 lg:h-fit">
          <PreviewPanel title={formData.title} content={formData.content} fullWidth />
        </div>
      </div>
    </form>
  );
}
