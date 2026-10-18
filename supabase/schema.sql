-- Visual & Motion Atlas: accounts for "My projects".
-- Paste this whole file into Supabase → SQL Editor → New query → Run. It is safe to run again.
--
-- What it creates
--   public.profiles   one row per signed-in person (created automatically on sign-up)
--   public.projects   one row per project hub; the hub itself (directions, kit, system, links,
--                     file list, notes) lives in the data jsonb column
--   storage bucket    project-files (private). Files are stored at <user id>/<project id>/<file id>
-- Row level security
--   owners have full access to their own rows and files; anyone can read a project, and its
--   files, only while that project is marked public (is_public = true).

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

drop policy if exists "profiles: owner can read" on public.profiles;
create policy "profiles: owner can read" on public.profiles
  for select to authenticated using (id = auth.uid());
drop policy if exists "profiles: owner can insert" on public.profiles;
create policy "profiles: owner can insert" on public.profiles
  for insert to authenticated with check (id = auth.uid());
drop policy if exists "profiles: owner can update" on public.profiles;
create policy "profiles: owner can update" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- projects ----------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  slug text,
  brief text not null default '',
  data jsonb not null default '{}'::jsonb,
  cover text,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists projects_owner_updated on public.projects (owner, updated_at desc);
alter table public.projects enable row level security;

drop policy if exists "projects: owner full access" on public.projects;
create policy "projects: owner full access" on public.projects
  for all to authenticated using (owner = auth.uid()) with check (owner = auth.uid());
drop policy if exists "projects: public can read public projects" on public.projects;
create policy "projects: public can read public projects" on public.projects
  for select to anon, authenticated using (is_public);

-- The browser sends updated_at (last write wins). Fill it in if a client leaves it out.
create or replace function public.projects_touch()
returns trigger language plpgsql as $$
begin
  if new.updated_at is null or (tg_op = 'UPDATE' and new.updated_at = old.updated_at) then
    new.updated_at := now();
  end if;
  return new;
end $$;
drop trigger if exists projects_touch on public.projects;
create trigger projects_touch before insert or update on public.projects
  for each row execute function public.projects_touch();

-- ---------- storage: project-files ----------
insert into storage.buckets (id, name, public, file_size_limit)
values ('project-files', 'project-files', false, 52428800)
on conflict (id) do nothing;

drop policy if exists "project-files: owner can read" on storage.objects;
create policy "project-files: owner can read" on storage.objects
  for select to authenticated
  using (bucket_id = 'project-files' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "project-files: owner can upload" on storage.objects;
create policy "project-files: owner can upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'project-files' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "project-files: owner can update" on storage.objects;
create policy "project-files: owner can update" on storage.objects
  for update to authenticated
  using (bucket_id = 'project-files' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "project-files: owner can delete" on storage.objects;
create policy "project-files: owner can delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'project-files' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "project-files: public projects are readable" on storage.objects;
create policy "project-files: public projects are readable" on storage.objects
  for select to anon, authenticated
  using (
    bucket_id = 'project-files'
    and exists (
      select 1 from public.projects p
      where p.id::text = (storage.foldername(name))[2] and p.is_public
    )
  );
