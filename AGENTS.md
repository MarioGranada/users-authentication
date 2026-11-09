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

- Node.js 18 or 20 (use a version supported by `better-sqlite3`).
- npm (a `package-lock.json` is committed).
- A writable project directory; `training.db` is created on first run.

## Environment

- No environment variables are required for local development.
- In production, the session cookie is `secure`; the app must be served over HTTPS.
- Never commit `training.db` or real user data.

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

- Never import `better-sqlite3` or `lib/db.js` into a client component.
- Server actions must keep the `"use server"` directive.
- Lucia reads and writes cookies through `next/headers`, which only works on the server.
- `redirect()` throws internally; do not wrap it in a try/catch that swallows the error.
- Deleting `training.db` resets users, sessions, and seeded trainings.

## Memory

- Read `MEMORY.md` first to understand the current status and decisions.
- Before changing behaviour, read `constitution.md` and keep the change aligned with it.
- After a task, update `MEMORY.md` with status, decisions, and mistakes to avoid. Keep it short.
- If a rule becomes permanent, move it into this file instead of leaving it in memory.
- Never store secrets, tokens, or personal data in `MEMORY.md`.
