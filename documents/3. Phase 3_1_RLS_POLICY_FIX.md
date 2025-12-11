# RLS Policy Fix - Admin Operations

## Issue

When trying to create posts in the admin dashboard, you get this error:
```
new row violates row-level security policy for table "posts"
```

## Root Cause

The initial database schema only created policies for:
- ✅ SELECT (reading published posts)
- ✅ UPDATE (incrementing view count)

But it was **missing policies for**:
- ❌ INSERT (creating posts)
- ❌ UPDATE (editing posts fully)
- ❌ DELETE (deleting posts)

## Fix

Run the SQL in `supabase/add-admin-policies.sql` in your Supabase SQL Editor.

### Steps:

1. **Go to Supabase Dashboard**
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy the contents of `/Users/jwk/Documents/Vsc/testblog/supabase/add-admin-policies.sql`
5. Paste into the SQL Editor
6. Click **Run** (or Cmd/Ctrl + Enter)
7. You should see: ✅ **"Success. No rows returned"**

### What This Does

Adds permissive RLS policies for admin operations:

**Posts:**
- INSERT: Allow creating new posts
- UPDATE: Allow editing all post fields
- DELETE: Allow deleting posts

**Tags:**
- INSERT: Allow creating tags
- UPDATE: Allow editing tags
- DELETE: Allow deleting tags

**Post Tags (junction):**
- INSERT: Allow linking posts to tags
- DELETE: Allow unlinking posts from tags

**Comments:**
- INSERT: Allow public comment submission
- UPDATE: Allow approving/editing comments
- DELETE: Allow deleting comments

## Security Note

⚠️ **These policies are permissive (allow all operations) for testing purposes.**

For production, you should:
1. Implement Supabase Auth
2. Add role-based policies like:
   ```sql
   create policy "Admin can insert posts"
     on posts for insert
     with check (
       auth.jwt() ->> 'role' = 'admin'
     );
   ```
3. Use service role key only for admin operations
4. Implement proper authentication checks

## Verify Fix

After running the SQL:

1. **Test creating a post**:
   - Visit `/admin/posts/new`
   - Fill in title and content
   - Click "Create Post"
   - Should redirect to posts list successfully ✅

2. **Test editing a post**:
   - Click edit icon on any post
   - Modify content
   - Click "Update Post"
   - Changes should save ✅

3. **Test deleting a post**:
   - Click delete icon on a post
   - Confirm deletion
   - Post should disappear ✅

4. **Test creating tags**:
   - Visit `/admin/tags`
   - Create a new tag
   - Should appear in list ✅

## Troubleshooting

### Still Getting RLS Error?
- Make sure you ran the SQL successfully
- Check in Supabase Dashboard → Authentication → Policies
- You should see multiple policies for each table

### SQL Error?
- The policies might already exist (if you ran it before)
- Error "policy already exists" is OK - skip it
- Or drop existing policies first:
  ```sql
  drop policy if exists "Allow all insert on posts" on posts;
  ```

---

**File Created**: December 12, 2025
**Related Files**:
- `supabase/add-admin-policies.sql`
- `supabase/schema.sql` (original schema)
