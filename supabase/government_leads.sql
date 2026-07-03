create table if not exists public.government_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  owner_name text not null,
  business_name text not null,
  email text not null,
  phone text not null,
  state text not null,
  industry text not null,
  llc boolean not null,
  ein boolean not null,
  uei boolean not null,
  sam boolean not null,
  capability_statement boolean not null,
  government_experience boolean not null,
  score integer not null check (score >= 0 and score <= 100)
);

alter table public.government_leads enable row level security;

drop policy if exists "Allow public readiness lead inserts" on public.government_leads;

create policy "Allow public readiness lead inserts"
on public.government_leads
for insert
to anon
with check (true);
