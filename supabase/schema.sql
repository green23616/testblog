-- Database Schema for Test Blog
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Posts table (CMS content)
create table posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  content text not null,
  excerpt text,
  published boolean default false,
  view_count integer default 0,
  reading_time_minutes integer,
  meta_title text,
  meta_description text,
  og_image text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tags table
create table tags (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null,
  created_at timestamptz default now()
);

-- Post-Tags junction (many-to-many)
create table post_tags (
  post_id uuid references posts(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

-- Comments table
create table comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  author_name text not null,
  author_email text not null,
  content text not null,
  approved boolean default false,
  created_at timestamptz default now()
);

-- Create indexes for better performance
create index posts_slug_idx on posts(slug);
create index posts_published_idx on posts(published);
create index posts_created_at_idx on posts(created_at desc);
create index tags_slug_idx on tags(slug);
create index comments_post_id_idx on comments(post_id);
create index comments_approved_idx on comments(approved);

-- Enable RLS (Row Level Security)
alter table posts enable row level security;
alter table tags enable row level security;
alter table post_tags enable row level security;
alter table comments enable row level security;

-- Public read policies
create policy "Public posts viewable"
  on posts for select
  using (published = true);

create policy "Public tags viewable"
  on tags for select
  using (true);

create policy "Public approved comments viewable"
  on comments for select
  using (approved = true);

-- Anyone can increment view count
create policy "Anyone can update view count"
  on posts for update
  using (true)
  with check (true);

-- View count increment function
create or replace function increment_view_count(post_id uuid)
returns void as $$
begin
  update posts
  set view_count = view_count + 1,
      updated_at = now()
  where id = post_id;
end;
$$ language plpgsql security definer;

-- Updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at trigger to posts
create trigger update_posts_updated_at
  before update on posts
  for each row
  execute function update_updated_at_column();

-- Insert sample data for testing
insert into tags (name, slug) values
  ('Next.js', 'nextjs'),
  ('React', 'react'),
  ('TypeScript', 'typescript'),
  ('TailwindCSS', 'tailwindcss'),
  ('Supabase', 'supabase');

insert into posts (slug, title, content, excerpt, published, reading_time_minutes) values
  (
    'hello-world',
    'Hello World - First Post',
    'This is the first post on our blog. Welcome!',
    'Welcome to our new blog built with Next.js and Supabase.',
    true,
    1
  ),
  (
    'getting-started-nextjs',
    'Getting Started with Next.js 16',
    'Next.js 16 brings amazing new features including Turbopack and React 19 support.',
    'Learn about the new features in Next.js 16.',
    true,
    5
  );

-- Link tags to posts
insert into post_tags (post_id, tag_id)
select
  (select id from posts where slug = 'hello-world'),
  (select id from tags where slug = 'nextjs');

insert into post_tags (post_id, tag_id)
select
  (select id from posts where slug = 'getting-started-nextjs'),
  (select id from tags where slug = 'nextjs');

insert into post_tags (post_id, tag_id)
select
  (select id from posts where slug = 'getting-started-nextjs'),
  (select id from tags where slug = 'react');
