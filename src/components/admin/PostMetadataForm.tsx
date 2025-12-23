"use client";

import { updatePost } from "@/app/actions/posts";
import { getTags } from "@/app/actions/tags";
import type { Post, Tag } from "@/types/database";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Save, X } from "lucide-react";

interface PostMetadataFormProps {
  post: Post;
  tags: Tag[];
}

export function PostMetadataForm({ post, tags: initialTags }: PostMetadataFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState<Tag[]>(initialTags);

  const [formData, setFormData] = useState({
    slug: post.slug,
    excerpt: post.excerpt || "",
    reading_time_minutes: post.reading_time_minutes || null,
    meta_title: post.meta_title || "",
    meta_description: post.meta_description || "",
    og_image: post.og_image || "",
    tag_ids: [] as string[],
  });

  // Load existing tags for this post
  useEffect(() => {
    const loadPostTags = async () => {
      const supabase = (await import("@/lib/supabase/client")).createClient();
      const { data } = await supabase
        .from("post_tags")
        .select("tag_id")
        .eq("post_id", post.id);

      if (data) {
        setFormData((prev) => ({
          ...prev,
          tag_ids: data.map((pt) => pt.tag_id),
        }));
      }
    };

    loadPostTags();
  }, [post.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Merge with existing post data to satisfy all required fields
      const updateData = {
        title: post.title,
        content: post.content,
        published: post.published,
        featured_image: post.featured_image,
        featured_image_alt: post.featured_image_alt,
        ...formData,
      };

      const result = await updatePost(post.id, updateData);

      if (result.success) {
        router.push("/admin/posts");
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
      setError("Failed to update metadata");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-300">
          <pre className="whitespace-pre-wrap text-sm">{error}</pre>
        </div>
      )}

      {/* Post Title (Display Only) */}
      <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {post.title}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Managing metadata for this post
        </p>
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="block text-sm font-medium mb-2">
          URL Slug *
        </label>
        <input
          type="text"
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
          pattern="[a-z0-9-]+"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="post-url-slug"
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          URL-friendly version (lowercase, hyphens only)
        </p>
      </div>

      {/* Excerpt */}
      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
          Excerpt
        </label>
        <textarea
          id="excerpt"
          value={formData.excerpt || ""}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          rows={3}
          maxLength={300}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Short description (max 300 characters)"
        />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {formData.excerpt?.length || 0} / 300 characters
        </p>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium mb-2">Tags</label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <label
              key={tag.id}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <input
                type="checkbox"
                value={tag.id}
                checked={formData.tag_ids.includes(tag.id)}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    tag_ids: e.target.checked
                      ? [...prev.tag_ids, tag.id]
                      : prev.tag_ids.filter((id) => id !== tag.id),
                  }));
                }}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium">{tag.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reading Time */}
      <div>
        <label
          htmlFor="reading_time_minutes"
          className="block text-sm font-medium mb-2"
        >
          Reading Time (minutes)
        </label>
        <input
          type="number"
          id="reading_time_minutes"
          value={formData.reading_time_minutes || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              reading_time_minutes: e.target.value ? parseInt(e.target.value) : null,
            })
          }
          min="1"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Estimated reading time"
        />
      </div>

      {/* SEO Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">SEO & Open Graph</h3>

        <div className="space-y-4">
          <div>
            <label htmlFor="meta_title" className="block text-sm font-medium mb-2">
              Meta Title
            </label>
            <input
              type="text"
              id="meta_title"
              value={formData.meta_title || ""}
              onChange={(e) =>
                setFormData({ ...formData, meta_title: e.target.value })
              }
              maxLength={60}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="SEO title (max 60 chars)"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {formData.meta_title?.length || 0} / 60 characters
            </p>
          </div>

          <div>
            <label
              htmlFor="meta_description"
              className="block text-sm font-medium mb-2"
            >
              Meta Description
            </label>
            <textarea
              id="meta_description"
              value={formData.meta_description || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  meta_description: e.target.value,
                })
              }
              maxLength={160}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="SEO description (max 160 chars)"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {formData.meta_description?.length || 0} / 160 characters
            </p>
          </div>

          <div>
            <label htmlFor="og_image" className="block text-sm font-medium mb-2">
              Open Graph Image URL
            </label>
            <input
              type="url"
              id="og_image"
              value={formData.og_image || ""}
              onChange={(e) =>
                setFormData({ ...formData, og_image: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/og-image.jpg"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Recommended: 1200x630px
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={20} />
          {isSubmitting ? "Saving..." : "Save Metadata"}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <X size={20} />
          Cancel
        </button>
      </div>
    </form>
  );
}
