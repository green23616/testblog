# Test Blog

A modern developer blog built with Next.js 16, React 19, and Supabase.

## Tech Stack

- **Framework**: Next.js 16.0.7 (App Router)
- **UI Library**: React 19.2.0
- **Language**: TypeScript 5.9
- **Styling**: TailwindCSS 3.4.18
- **Database**: Supabase (PostgreSQL)
- **Validation**: Zod
- **Icons**: Lucide React
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- Supabase account

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/green23616/testblog.git
   cd testblog
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `supabase/schema.sql` in the SQL Editor
   - Copy your project URL and anon key

4. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
testblog/
├── documents/              # Project reports and documentation
├── src/
│   ├── app/
│   │   ├── actions/        # Server Actions
│   │   ├── blog/           # Blog pages
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/         # React components
│   ├── lib/
│   │   ├── supabase/       # Supabase clients
│   │   ├── validations/    # Zod schemas
│   │   └── utils.ts
│   └── types/              # TypeScript types
├── supabase/
│   └── schema.sql          # Database schema
└── public/                 # Static assets
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Database Schema

### Tables

- **posts** - Blog posts with metadata
- **tags** - Categorization tags
- **post_tags** - Many-to-many relationship
- **comments** - User comments (with moderation)

### Features

- Row Level Security (RLS) enabled
- Automatic view counting
- Updated_at trigger
- Sample data included

## Server Actions

### Posts
- `getPosts()` - Fetch published posts with pagination
- `getPostBySlug()` - Get single post with tags
- `incrementViewCount()` - Atomic view counter
- `createPost()` - Create new post (admin)
- `updatePost()` - Update existing post (admin)
- `deletePost()` - Delete post (admin)

### Tags
- `getTags()` - Fetch all tags
- `createTag()` - Create new tag (admin)
- `deleteTag()` - Delete tag (admin)

## Development Notes

This is a **test implementation** for validating architecture decisions before building the production blog. See `documents/` for detailed phase reports.

## License

MIT
