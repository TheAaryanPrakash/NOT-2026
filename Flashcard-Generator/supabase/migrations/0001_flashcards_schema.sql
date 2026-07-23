-- Flashcard groups (sets)
create table public.flashcard_groups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text default '',
  image_url text,
  created_at timestamptz not null default now()
);

-- Terms within a group
create table public.flashcard_terms (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.flashcard_groups(id) on delete cascade,
  term text not null,
  definition text not null,
  image_url text,
  position int not null default 0
);

create index flashcard_groups_user_id_idx on public.flashcard_groups(user_id);
create index flashcard_terms_group_id_idx on public.flashcard_terms(group_id);

-- Row Level Security: each user can only see/manage their own data
alter table public.flashcard_groups enable row level security;
alter table public.flashcard_terms enable row level security;

create policy "Users manage their own groups"
  on public.flashcard_groups for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage terms of their own groups"
  on public.flashcard_terms for all
  using (
    exists (
      select 1 from public.flashcard_groups g
      where g.id = group_id and g.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.flashcard_groups g
      where g.id = group_id and g.user_id = auth.uid()
    )
  );

-- Storage bucket for group/term images (public read, owner-only write)
insert into storage.buckets (id, name, public)
values ('flashcard-images', 'flashcard-images', true)
on conflict (id) do nothing;

create policy "Public read access to flashcard images"
  on storage.objects for select
  using (bucket_id = 'flashcard-images');

create policy "Users upload to their own folder"
  on storage.objects for insert
  with check (
    bucket_id = 'flashcard-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users update their own images"
  on storage.objects for update
  using (
    bucket_id = 'flashcard-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users delete their own images"
  on storage.objects for delete
  using (
    bucket_id = 'flashcard-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
