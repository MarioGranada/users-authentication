# Training Authentication

A Next.js App Router app that demonstrates cookie-based authentication with Lucia. Visitors can create an account or log in, and authenticated users reach a training catalogue stored in Postgres.

Passwords are hashed with Node’s `scrypt`, users, sessions and trainings are stored in an `auth_demo` schema of a hosted Supabase Postgres database, and the session cookie is validated on the server before the protected page renders.

> **Follow-along project.** This app was built while following **Next.js 14 & React — The Complete Guide (Academind / Maximilian Schwarzmüller)**. It is included in the portfolio as a learning exercise, not as a production product. The implementation is my own work based on the course material.

## Live demo

| | |
| --- | --- |
| **Live site** | https://users-authentication-ruby.vercel.app |
| **Repository** | https://github.com/MarioGranada/users-authentication |
| **Portfolio summary** | Cookie-based authentication in Next.js with Lucia: signup, login, logout and a protected training catalogue, with users and sessions stored in Supabase Postgres. |

The demo is public: accounts and sessions are deleted every night (04:00 UTC).

## Features

- Signup and login through server actions.
- Password hashing and verification with `scrypt` and a random salt.
- Lucia v3 session creation, validation, and invalidation.
- Supabase Postgres persistence for users, sessions, and trainings.
- Protected `/training` route that redirects unauthenticated visitors.
- Login/signup mode switch through the `?mode=` query parameter.
- Logout server action that clears the session cookie.
- Seed data for seven training activities.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 14 (App Router) |
| Auth | Lucia v3 + `@lucia-auth/adapter-postgresql` (PostgresJsAdapter) |
| Database | Supabase Postgres via `postgres` (postgres.js) |
| Passwords | Node `crypto.scryptSync` |
| Styling | Global CSS |

## Project structure

```text
users-authentication/
├── app/
│   ├── page.js                 # Login/signup screen
│   ├── layout.js               # Root layout
│   ├── globals.css
│   └── (auth)/
│       ├── layout.jsx          # Authenticated shell + logout
│       └── training/page.js    # Protected training catalogue
├── actions/auth-actions.js     # signup, login, auth, logout
├── components/auth-form.js     # Client form + useFormState
├── lib/
│   ├── auth.js                 # Lucia adapter and session helpers
│   ├── db.js                   # Shared postgres.js client
│   ├── hash.js                 # scrypt hash/verify
│   ├── training.js             # Training queries
│   └── user.js                 # User queries
├── db/migration.sql            # Idempotent schema + training seed
├── scripts/db-migrate.mjs      # Applies db/migration.sql
├── public/                     # Auth icon and training images
└── jsconfig.json               # @/* path alias
```

## Getting started

### Requirements

- Node.js 22+.
- npm (a `package-lock.json` is committed).
- A Postgres database. The deployed app uses the shared portfolio Supabase project, connected to the Vercel project through the Supabase integration.

### 1. Install dependencies

```bash
npm install
```


### 2. Configure environment variables

```bash
vercel link          # once, links the folder to the Vercel project
vercel env pull .env.local
```

| Variable | Description | Required |
| --- | --- | --- |
| `POSTGRES_URL` | Pooled Postgres connection string (set by the Supabase integration). | Yes |
| `POSTGRES_URL_NON_POOLING` | Direct connection used by `npm run db:migrate`; falls back to `POSTGRES_URL`. | No |
| `CRON_SECRET` | Protects `/api/cron/reset`; Vercel sends it to the nightly cron. Random value set in the Vercel project. | Production |

Any Postgres works locally, e.g. `POSTGRES_URL=postgres://postgres:postgres@localhost:5432/postgres`. See `.env.example`. No auth secret is needed: Lucia stores sessions in the database.

### 3. Create the schema and seed data

```bash
npm run db:migrate
```

Safe to re-run: tables use `if not exists` and seed rows `on conflict do nothing`.

### 4. Run locally

```bash
npm run dev
```

Open http://localhost:3000.

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Next.js in development mode on port 3000. |
| `npm run build` | Create a production build. |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run `next lint`. |
| `npm run db:migrate` | Apply `db/migration.sql` (schema + seed). |

## How it works

`db/migration.sql` creates the `auth_demo.users`, `auth_demo.sessions` and `auth_demo.trainings` tables and seeds seven trainings. `lib/db.js` exports the shared postgres.js client used by every query (`lib/user.js`, `lib/training.js`).

`lib/auth.js` configures Lucia with `PostgresJsAdapter` on the `auth_demo` tables, creates sessions, writes the session cookie through `next/headers`, validates it on each protected request, and clears it on logout.

`actions/auth-actions.js` contains the `"use server"` actions. Signup validates email and an eight-character password, hashes it, inserts the user, creates a session, and redirects to `/training`. Login verifies the password and creates a session.

`components/auth-form.js` is a client component using `useFormState` with the bound `auth` action. `app/page.js` chooses login or signup from `searchParams.mode`.

`app/(auth)/training/page.js` calls `verifyAuth()` and redirects to `/` when there is no user; otherwise it renders the seeded trainings.

## Deployment

- **Live:** https://users-authentication-ruby.vercel.app (Vercel production, deployed from `main`).
- Target: Vercel, with data in the shared portfolio Supabase project (schema `auth_demo`; not `auth`, which Supabase reserves). The Supabase ↔ Vercel integration injects `POSTGRES_URL` into every environment.
- A daily Vercel Cron (`vercel.json`, 04:00 UTC) calls `/api/cron/reset`, which deletes every account and session (the training catalogue stays). It requires `CRON_SECRET`.
- Run `npm run db:migrate` once against the Supabase database before the first deployment.
- Session cookies are marked `secure` when `NODE_ENV === "production"`; HTTPS is required in production.
- Deployed through Vercel’s Git integration; no GitHub Actions workflow is needed.

## Notes and limitations

- The `auth_demo` schema is not exposed through the Supabase Data API; RLS is enabled with no policies, and the app connects server-side only. Password hashes never leave the server.
- `app/(auth)/layout.jsx` renders its own `<html>` and `<body>` inside the root layout. This is a course quirk and should be simplified to a fragment in a production app.
- There is no password reset, email verification, or rate limiting.
- Lucia v3 is deprecated in favour of newer auth approaches; treat this as a learning implementation.

---

**Author:** Mario Granada
