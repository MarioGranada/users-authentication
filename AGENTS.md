# AGENTS.md — Training Authentication

Compact guide for future OpenCode sessions. It records only the facts an agent is likely to miss or get wrong.

## Quickstart

| Command | Description |
| --- | --- |
| `npm install` | Install dependencies. |
| `npm run dev` | Start the app at http://localhost:3000. |
| `npm run build` | Verify the production build. |
| `npm run lint` | Run Next.js linting. |

## Requirements

- Node.js 22+.
- npm (a `package-lock.json` is committed).
- A Postgres database (production: the shared portfolio Supabase project). Run `npm run db:migrate` once.

## Environment

- `POSTGRES_URL` (required): pooled connection string injected by the Supabase ↔ Vercel integration; `vercel env pull .env.local` locally.
- `POSTGRES_URL_NON_POOLING` (optional): used by `npm run db:migrate`. Both documented in `.env.example`.
- `CRON_SECRET`: protects `app/api/cron/reset/route.js` (nightly Vercel Cron in `vercel.json`), which deletes every account and session (the training catalogue stays). Missing secret → every request is refused. Never print or commit it.
- In production, the session cookie is `secure`; the app must be served over HTTPS.
- Never commit `.env*` files (except `.env.example`) or real user data.

## Architecture

- `actions/auth-actions.js` — signup, login, auth dispatcher, logout.
- `lib/auth.js` — Lucia adapter, session creation/validation/destruction.
- `lib/db.js` — schema creation and training seed.
- `lib/hash.js` — scrypt hashing and timing-safe verification.
- `lib/user.js` / `lib/training.js` — queries.
- `app/(auth)/training/page.js` — protected page.

## Commands and build order

- Run `npm run dev`; the database is created automatically.
- Use `npm run build` to catch server/client boundary mistakes.
- `npm run lint` is the only static check; there are no tests.

## Conventions and gotchas

- Never import `lib/db.js` into a client component.
- Server actions must keep the `"use server"` directive.
- Lucia reads and writes cookies through `next/headers`, which only works on the server.
- `redirect()` throws internally; do not wrap it in a try/catch that swallows the error.
- The shared Supabase database hosts other apps' schemas too (`news`, `foodies`, `newsletter`); only touch `auth_demo`.
- Duplicate signups are detected by Postgres error code `23505`.

## Memory

- Read `MEMORY.md` first to understand the current status and decisions.
- Before changing behaviour, read `constitution.md` and keep the change aligned with it.
- After a task, update `MEMORY.md` with status, decisions, and mistakes to avoid. Keep it short.
- If a rule becomes permanent, move it into this file instead of leaving it in memory.
- Never store secrets, tokens, or personal data in `MEMORY.md`.
