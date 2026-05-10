-- =================================================================
-- Alan Studio — avatar storage
-- Run in Supabase SQL Editor AFTER profiles.sql
-- =================================================================


-- -----------------------------------------------------------------
-- 1. Phone column (additive — safe to run even if profiles exists)
-- -----------------------------------------------------------------
alter table public.profiles
  add column if not exists phone text;


-- -----------------------------------------------------------------
-- 2. Avatars storage bucket (public — URLs are unguessable by path)
-- -----------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880,                                          -- 5 MB
  array['image/jpeg','image/png','image/gif','image/webp']
)
on conflict (id) do nothing;


-- -----------------------------------------------------------------
-- 3. Storage RLS policies
--    Files are stored at  {user_id}/avatar.{ext}
--    The first path segment must match the caller's auth.uid().
-- -----------------------------------------------------------------

-- Anyone can read (bucket is public, but explicit is safer)
create policy "avatars: public read"
  on storage.objects for select
  to public
  using (bucket_id = 'avatars');

-- Authenticated users may upload into their own folder only
create policy "avatars: upload own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow overwriting (upsert) — same path restriction
create policy "avatars: update own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow deleting own avatar (e.g. if user resets to initials later)
create policy "avatars: delete own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
