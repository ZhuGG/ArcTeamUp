create extension if not exists "pgcrypto";

create type public.user_role as enum ('visitor', 'practitioner', 'teacher');
create type public.content_type as enum ('posture', 'marche', 'mouvement', 'meditation', 'kihon', 'theme', 'programme');
create type public.program_visibility as enum ('public', 'assigned', 'private');
create type public.block_type as enum ('preparation', 'kihon', 'posture', 'marche', 'mouvement', 'meditation', 'cooldown', 'notes');

create table if not exists public.dojos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  country text,
  contact text,
  website text,
  created_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  role public.user_role not null default 'visitor',
  dojo_id uuid references public.dojos(id),
  teacher_id uuid references public.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  type public.content_type not null,
  title text not null,
  body_md text,
  level text,
  allowed_autonomous boolean not null default false,
  tags jsonb not null default '[]'::jsonb,
  media_urls jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  created_by uuid references public.users(id),
  visibility public.program_visibility not null default 'private',
  created_at timestamptz not null default now()
);

create table if not exists public.program_blocks (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  "order" integer not null,
  block_type public.block_type not null,
  content_item_id uuid references public.content_items(id),
  duration_sec integer,
  instructions_md text
);

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  student_id uuid not null references public.users(id) on delete cascade,
  start_date date,
  cadence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  program_id uuid references public.programs(id),
  started_at timestamptz,
  ended_at timestamptz,
  offline_id text
);

create table if not exists public.session_logs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  metrics jsonb not null default '{}'::jsonb,
  notes text,
  shared_with_teacher boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.teacher_feedback (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  teacher_id uuid not null references public.users(id) on delete cascade,
  comment text,
  created_at timestamptz not null default now()
);
