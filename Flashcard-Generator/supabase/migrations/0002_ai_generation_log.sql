-- Tracks AI flashcard-generation calls per user, purely for rate limiting.
-- Only ever read/written by the generate-flashcards Edge Function using the
-- service role key, so no client-facing RLS policies are needed.
create table public.ai_generation_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.ai_generation_log enable row level security;

create index ai_generation_log_user_id_created_at_idx
  on public.ai_generation_log(user_id, created_at);
