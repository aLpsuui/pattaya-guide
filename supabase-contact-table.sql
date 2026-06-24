-- Run once in the Supabase SQL editor to enable the /contact form.
-- The form writes via the server (service role), so RLS is on with no public
-- policies — anon/auth users cannot read or write these messages.

create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  subject    text,
  message    text not null,
  handled    boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- (Optional) index for sorting newest-first in the admin.
create index if not exists contact_messages_created_idx
  on public.contact_messages (created_at desc);
