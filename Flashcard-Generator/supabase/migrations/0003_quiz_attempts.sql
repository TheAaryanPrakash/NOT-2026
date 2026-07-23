create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  group_id uuid not null references public.flashcard_groups(id) on delete cascade,
  score int not null,
  total int not null,
  created_at timestamptz not null default now()
);

create index quiz_attempts_group_id_idx on public.quiz_attempts(group_id);

alter table public.quiz_attempts enable row level security;

create policy "Users manage their own quiz attempts"
  on public.quiz_attempts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
