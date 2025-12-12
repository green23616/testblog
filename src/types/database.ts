export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          slug: string
          title: string
          content: string
          excerpt: string | null
          published: boolean
          view_count: number
          reading_time_minutes: number | null
          meta_title: string | null
          meta_description: string | null
          og_image: string | null
          featured_image: string | null
          featured_image_alt: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          content: string
          excerpt?: string | null
          published?: boolean
          view_count?: number
          reading_time_minutes?: number | null
          meta_title?: string | null
          meta_description?: string | null
          og_image?: string | null
          featured_image?: string | null
          featured_image_alt?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          content?: string
          excerpt?: string | null
          published?: boolean
          view_count?: number
          reading_time_minutes?: number | null
          meta_title?: string | null
          meta_description?: string | null
          og_image?: string | null
          featured_image?: string | null
          featured_image_alt?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
        }
      }
      post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          author_name: string
          author_email: string
          content: string
          approved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          author_name: string
          author_email: string
          content: string
          approved?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          author_name?: string
          author_email?: string
          content?: string
          approved?: boolean
          created_at?: string
        }
      }
    }
    Functions: {
      increment_view_count: {
        Args: { post_id: string }
        Returns: void
      }
    }
  }
}

export type Post = Database['public']['Tables']['posts']['Row']
export type PostInsert = Database['public']['Tables']['posts']['Insert']
export type PostUpdate = Database['public']['Tables']['posts']['Update']

export type Tag = Database['public']['Tables']['tags']['Row']
export type TagInsert = Database['public']['Tables']['tags']['Insert']

export type Comment = Database['public']['Tables']['comments']['Row']
export type CommentInsert = Database['public']['Tables']['comments']['Insert']

export type PostWithTags = Post & {
  tags: Tag[]
}
