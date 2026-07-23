alter table public.flashcard_groups
  add column is_public boolean not null default false;

-- Anyone (including anonymous visitors) can read a group once its owner
-- marks it public, and the terms that belong to it.
create policy "Public can view public groups"
  on public.flashcard_groups for select
  using (is_public = true);

create policy "Public can view terms of public groups"
  on public.flashcard_terms for select
  using (
    exists (
      select 1 from public.flashcard_groups g
      where g.id = group_id and g.is_public = true
    )
  );
