# Deploying NOT-2026

## Backend (Supabase) — one-time setup

Run these in order in the Supabase SQL Editor:

1. `supabase/migrations/0001_flashcards_schema.sql`
2. `supabase/migrations/0002_ai_generation_log.sql`
3. `supabase/migrations/0003_quiz_attempts.sql`
4. `supabase/migrations/0004_public_sharing.sql`

Deploy the AI Edge Function via **Supabase Dashboard → Edge Functions**:

- Create a function named `generate-flashcards`, paste in
  `supabase/functions/generate-flashcards/index.ts`, deploy.
- Under the function's **Secrets**, set `GROQ_API_KEY` to your key from
  console.groq.com/keys (free tier, no billing required).

## Frontend (Vercel)

1. Import the GitHub repo (`TheAaryanPrakash/NOT-2026`) into Vercel.
2. Set **Root Directory** to `Flashcard-Generator` (the app doesn't live at
   the repo root).
3. Framework preset: Create React App (auto-detected).
4. Add environment variables (Project Settings → Environment Variables):
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
   (values from Supabase Project Settings → API — the anon key is safe to
   expose client-side by design.)
5. Deploy.

## After the first deploy

Update **Supabase → Authentication → URL Configuration**:

- Set **Site URL** to your production Vercel URL.
- Add it to **Redirect URLs** too.

Otherwise signup confirmation emails will link back to `localhost:3000`
instead of the live site.
