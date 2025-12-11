-- Add admin policies for posts, tags, and comments
-- Run this in Supabase SQL Editor

-- Posts: Allow all operations (INSERT, UPDATE, DELETE)
-- Note: In production, add authentication checks here
create policy "Allow all insert on posts"
  on posts for insert
  with check (true);

create policy "Allow all update on posts"
  on posts for update
  using (true)
  with check (true);

create policy "Allow all delete on posts"
  on posts for delete
  using (true);

-- Tags: Allow all operations
create policy "Allow all insert on tags"
  on tags for insert
  with check (true);

create policy "Allow all update on tags"
  on tags for update
  using (true)
  with check (true);

create policy "Allow all delete on tags"
  on tags for delete
  using (true);

-- Post Tags: Allow all operations
create policy "Allow all insert on post_tags"
  on post_tags for insert
  with check (true);

create policy "Allow all delete on post_tags"
  on post_tags for delete
  using (true);

-- Comments: Allow public insert, admin update/delete
create policy "Allow public comment submission"
  on comments for insert
  with check (true);

create policy "Allow all update on comments"
  on comments for update
  using (true)
  with check (true);

create policy "Allow all delete on comments"
  on comments for delete
  using (true);
