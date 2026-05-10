-- =================================================================
-- Alan Studio — profiles table
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor)
-- =================================================================


-- -----------------------------------------------------------------
-- 1. Table
-- -----------------------------------------------------------------
create table public.profiles (
  id          uuid        primary key references auth.users(id) on delete cascade,
  email       text        not null,
  full_name   text,
  avatar_url  text,
  is_owner    boolean     not null default false,
  is_admin    boolean     not null default false,
  is_coach    boolean     not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;


-- -----------------------------------------------------------------
-- 2. Auto-create profile row when a user signs up
--    Runs as SECURITY DEFINER so it bypasses RLS.
-- -----------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- -----------------------------------------------------------------
-- 3. Keep updated_at current on every row change
-- -----------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();


-- -----------------------------------------------------------------
-- 4. Prevent role-flag self-escalation
--    Regular users and coaches/admins cannot promote themselves.
--    Only the owner can change is_owner / is_admin / is_coach
--    on any row (including their own).
-- -----------------------------------------------------------------
create or replace function public.guard_role_flags()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  caller_is_owner boolean;
begin
  -- auth.uid() is NULL in the Supabase SQL editor and any service-role
  -- context (no user JWT present). Allow those updates through so an admin
  -- can bootstrap or manually correct flags without hitting this guard.
  if auth.uid() is null then
    return new;
  end if;

  select is_owner into caller_is_owner
  from public.profiles
  where id = auth.uid();

  if not coalesce(caller_is_owner, false) then
    new.is_owner = old.is_owner;
    new.is_admin = old.is_admin;
    new.is_coach = old.is_coach;
  end if;

  return new;
end;
$$;

create trigger profiles_guard_roles
  before update on public.profiles
  for each row execute procedure public.guard_role_flags();


-- -----------------------------------------------------------------
-- 5. Helper functions for RLS policies
--    SECURITY DEFINER bypasses RLS inside, preventing recursion
--    when policies reference the profiles table itself.
-- -----------------------------------------------------------------
create or replace function public.is_owner()
returns boolean
language sql
security definer stable set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_owner = true
  );
$$;

create or replace function public.is_admin_or_owner()
returns boolean
language sql
security definer stable set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and (is_admin = true or is_owner = true)
  );
$$;


-- -----------------------------------------------------------------
-- 6. RLS policies
-- -----------------------------------------------------------------

-- Every authenticated user can read their own profile
create policy "profiles: read own"
  on public.profiles for select
  using (auth.uid() = id);

-- Admins and owner can read all profiles (e.g. user management)
create policy "profiles: admin/owner read all"
  on public.profiles for select
  using (public.is_admin_or_owner());

-- Users can update their own row (role flags silently preserved by trigger)
create policy "profiles: update own"
  on public.profiles for update
  using  (auth.uid() = id)
  with check (auth.uid() = id);

-- Owner can update any row (needed to set flags on other users)
create policy "profiles: owner update any"
  on public.profiles for update
  using (public.is_owner());


-- -----------------------------------------------------------------
-- 7. Bootstrap role flags
--    Run these in the Supabase SQL editor AFTER both accounts exist.
--    The guard_role_flags trigger allows NULL auth.uid() sessions
--    (SQL editor / service role) so these updates go through cleanly.
-- -----------------------------------------------------------------
-- update public.profiles set is_owner = true where email = 'alan@yourdomain.com';
-- update public.profiles set is_admin = true where email = 'you@yourdomain.com';
