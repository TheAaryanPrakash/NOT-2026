# NOT-2026 (Notes On Time)

A flashcard-generator web app — create flashcard sets by hand or generate them
automatically with AI from pasted notes, a PDF, or a photo of your notes.
Study them with a multiple-choice quiz mode, print them, or share a set
publicly with a read-only link.

**Live app:** https://notes-on-time.vercel.app/

## Features

- **Auth** — email/password signup and login (Supabase Auth) with protected
  routes and public-only routes (e.g. you can't visit `/login` while signed in)
- **Flashcard CRUD** — create, edit, and delete flashcard groups and the terms
  inside them, with an image per group and per term
- **AI generation** — paste notes, or upload a PDF/image, and get a flashcard
  set generated automatically:
  - PDF text is extracted client-side with [pdf.js](https://mozilla.github.io/pdf.js/)
  - Image text (OCR) is extracted client-side with [tesseract.js](https://github.com/naptha/tesseract.js)
  - The extracted text is sent to a Supabase Edge Function, which calls Groq
    (`llama-3.3-70b-versatile`) to generate the term/definition pairs — the
    number of terms scales with how much text is provided
- **Quiz mode** — multiple-choice quizzes generated from a flashcard set,
  with attempt history (score, total, date) stored per group
- **Public sharing** — mark a group public and share a read-only link at
  `/share/:id`, viewable by anyone without an account
- **Print view** — a dedicated print-friendly (light-themed) layout for a
  flashcard set
- **Dashboard search** — search your own flashcard groups by name
- **Image uploads** — group/term images stored in Supabase Storage

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Create React App), React Router, Tailwind CSS |
| Data fetching | TanStack React Query |
| Forms | Formik + Yup |
| Backend | Supabase — Postgres, Auth, Storage, Edge Functions |
| AI | Groq (`llama-3.3-70b-versatile`), called from a Supabase Edge Function |
| Text extraction | pdf.js (PDF), tesseract.js (image OCR) — both run client-side |
| Hosting | Vercel (frontend), Supabase (backend) |

## Project structure

```
Flashcard-Generator/        # the app itself (Vercel root directory)
├── src/
│   ├── pages/               # route-level views (dashboard, quiz, auth, landing, ...)
│   ├── components/          # AiGenerator, CreateGroup/Term, ShareModal, ui/ primitives
│   ├── layouts/              # AppLayout, AuthLayout
│   ├── routes/                # route definitions + ProtectedRoute/PublicOnlyRoute
│   ├── hooks/                 # useFlashcards, useQuiz (React Query hooks)
│   ├── lib/                    # supabaseClient, api/, storage, text extraction
│   ├── context/                 # AuthContext
│   └── schema/                   # Yup validation schemas
├── supabase/
│   ├── migrations/           # SQL migrations, run in order (0001–0004)
│   └── functions/
│       └── generate-flashcards/  # Edge Function that calls Groq
└── DEPLOY.md                 # full deployment/secrets setup guide
```

## Database schema

Defined in `Flashcard-Generator/supabase/migrations/`, applied in order:

1. **`0001_flashcards_schema.sql`** — `flashcard_groups` and `flashcard_terms`
   tables, with row-level security so each user can only read/write their own
   data
2. **`0002_ai_generation_log.sql`** — logs AI generation calls per user for
   rate limiting (written only by the Edge Function's service role, no client
   access)
3. **`0003_quiz_attempts.sql`** — stores quiz results (score/total) per user
   per group
4. **`0004_public_sharing.sql`** — adds an `is_public` flag to
   `flashcard_groups` and RLS policies allowing anonymous read access to
   public groups/terms

## Getting started locally

### Prerequisites

- Node.js and npm
- A Supabase project (free tier is fine)
- A [Groq API key](https://console.groq.com/keys) (free tier, no billing required)

### 1. Clone and install

```bash
git clone https://github.com/TheAaryanPrakash/NOT-2026.git
cd NOT-2026/Flashcard-Generator
npm install
```

### 2. Set up the backend

Run the SQL files in `supabase/migrations/` in order (0001 → 0004) in your
Supabase project's SQL Editor.

Deploy the `generate-flashcards` Edge Function (Supabase Dashboard → Edge
Functions), using `supabase/functions/generate-flashcards/index.ts`, and set
its `GROQ_API_KEY` secret.

Full step-by-step instructions, including environment variables and the
post-deploy auth redirect setup, are in
[`Flashcard-Generator/DEPLOY.md`](Flashcard-Generator/DEPLOY.md).

### 3. Configure environment variables

Create a `.env` file in `Flashcard-Generator/` with:

```
REACT_APP_SUPABASE_URL=your-supabase-project-url
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Run the app

```bash
npm start
```

The app runs at `http://localhost:3000`.

### Other scripts

```bash
npm test    # run tests
npm run build   # production build
```

## Deployment

The app is deployed on Vercel with the **Root Directory** set to
`Flashcard-Generator`, since the app doesn't live at the repo root. See
[`Flashcard-Generator/DEPLOY.md`](Flashcard-Generator/DEPLOY.md) for the full
Vercel + Supabase deployment guide.
