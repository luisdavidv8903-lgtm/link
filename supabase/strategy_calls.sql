create table if not exists public.strategy_calls (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  company text not null,
  email text not null,
  phone text not null
);

alter table public.strategy_calls enable row level security;

drop policy if exists "Allow public strategy call inserts" on public.strategy_calls;

create policy "Allow public strategy call inserts"
on public.strategy_calls
for insert
to anon
with check (true);
