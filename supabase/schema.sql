create extension if not exists pgcrypto;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  make text not null,
  model text not null,
  service text not null check (service in ('stage1','stage2','egr','coding','diagnostics')),
  date date not null,
  time text not null,
  phone text not null,
  comment text not null default '',
  status text not null default 'Новая',
  created_at timestamptz not null default now()
);

alter table public.bookings enable row level security;

-- No public SELECT/UPDATE/DELETE policies.
-- Vercel API writes/reads using the server-only service_role key.
-- Never expose SUPABASE_SERVICE_ROLE_KEY in VITE_ variables.
