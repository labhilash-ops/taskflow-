-- ============================================================
--  TaskFlow — Supabase Database Schema
--  Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ── Projects ──────────────────────────────────────────────────────────────────
create table public.projects (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null,
  description text,
  color       text default '#e8f0fe',
  emoji       text default '📋',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table public.projects enable row level security;

create policy "Users manage own projects"
  on public.projects for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── Categories ────────────────────────────────────────────────────────────────
create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid references public.projects(id) on delete cascade not null,
  name        text not null,
  position    integer default 0,
  created_at  timestamptz default now()
);

alter table public.categories enable row level security;

create policy "Users manage categories of own projects"
  on public.categories for all
  using (
    exists (
      select 1 from public.projects p
      where p.id = categories.project_id and p.user_id = auth.uid()
    )
  );

-- ── Tasks ─────────────────────────────────────────────────────────────────────
create table public.tasks (
  id               uuid primary key default gen_random_uuid(),
  project_id       uuid references public.projects(id) on delete cascade not null,
  category_id      uuid references public.categories(id) on delete set null,
  name             text not null,
  description      text,
  status           text default 'pending' check (status in ('pending','inprogress','completed','onhold','tbd')),
  deadline         text,
  protocol_target  text,
  activity_target  text,
  assignee         text,
  position         integer default 0,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

alter table public.tasks enable row level security;

create policy "Users manage tasks of own projects"
  on public.tasks for all
  using (
    exists (
      select 1 from public.projects p
      where p.id = tasks.project_id and p.user_id = auth.uid()
    )
  );

-- ── Status Updates ────────────────────────────────────────────────────────────
create table public.status_updates (
  id         uuid primary key default gen_random_uuid(),
  task_id    uuid references public.tasks(id) on delete cascade not null,
  user_id    uuid references auth.users(id) on delete set null,
  note       text not null,
  status     text check (status in ('pending','inprogress','completed','onhold','tbd')),
  created_at timestamptz default now()
);

alter table public.status_updates enable row level security;

create policy "Users manage status updates of own tasks"
  on public.status_updates for all
  using (
    exists (
      select 1 from public.tasks t
      join public.projects p on p.id = t.project_id
      where t.id = status_updates.task_id and p.user_id = auth.uid()
    )
  );

-- ── Auto-update updated_at ────────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger projects_updated_at before update on public.projects
  for each row execute function update_updated_at();

create trigger tasks_updated_at before update on public.tasks
  for each row execute function update_updated_at();
