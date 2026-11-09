# Training Authentication

A Next.js App Router app that demonstrates cookie-based authentication with Lucia. Visitors can create an account or log in, and authenticated users reach a training catalogue that is seeded into SQLite on first run.

Passwords are hashed with Node’s `scrypt`, sessions are stored in SQLite, and the session cookie is validated on the server before the protected page renders.

> **Follow-along project.** This app was built while following **Next.js 14 & React — The Complete Guide (Academind / Maximilian Schwarzmüller)**. It is included in the portfolio as a learning exercise, not as a production product. The implementation is my own work based on the course material.

## Features

- Signup and login through server actions.
- Password hashing and verification with `scrypt` and a random salt.
- Lucia v3 session creation, validation, and invalidation.
- SQLite persistence for users, sessions, and trainings.
- Protected `/training` route that redirects unauthenticated visitors.
- Login/signup mode switch through the `?mode=` query parameter.
- Logout server action that clears the session cookie.
- Seed data for seven training activities.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 14 (App Router) |
| Auth | Lucia v3 + `@lucia-auth/adapter-sqlite` |
| Database | SQLite via `better-sqlite3` |
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
│   ├── db.js                   # Schema creation and training seed
│   ├── hash.js                 # scrypt hash/verify
│   ├── training.js             # Training queries
│   └── user.js                 # User queries
├── public/                     # Auth icon and training images
└── jsconfig.json               # @/* path alias
```

## Getting started

### Requirements

- Node.js 18 or 20 (use a version supported by `better-sqlite3`).
- npm (a `package-lock.json` is committed).
- A writable project directory; `training.db` is created on first run.

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

**Start the development server**

```bash
npm run dev
```

Open http://localhost:3000.

The SQLite schema and training rows are created automatically on first import.

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Next.js in development mode on port 3000. |
| `npm run build` | Create a production build. |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run `next lint`. |

## How it works

`lib/db.js` opens `training.db`, creates the `users`, `sessions`, and `trainings` tables if needed, and inserts seven training rows only when the table is empty.

`lib/auth.js` configures Lucia with `BetterSqlite3Adapter`, creates sessions, writes the session cookie through `next/headers`, validates it on each protected request, and clears it on logout.

`actions/auth-actions.js` contains the `"use server"` actions. Signup validates email and an eight-character password, hashes it, inserts the user, creates a session, and redirects to `/training`. Login verifies the password and creates a session.

`components/auth-form.js` is a client component using `useFormState` with the bound `auth` action. `app/page.js` chooses login or signup from `searchParams.mode`.

`app/(auth)/training/page.js` calls `verifyAuth()` and redirects to `/` when there is no user; otherwise it renders the seeded trainings.

## Deployment

- Target: Vercel for Next.js, with Supabase for persistence. `better-sqlite3` writes `training.db` to the local filesystem, which is ephemeral on Vercel.
- Migration path: replace the SQLite adapter with a hosted Postgres adapter and keep the Lucia session API, or move to Supabase Auth.
- Session cookies are marked `secure` when `NODE_ENV === "production"`; HTTPS is required in production.
- No GitHub Actions workflow is committed; Vercel’s Git integration is the simplest path.

## Notes and limitations

- `training.db` is gitignored (`*.db`) and is created on first run.
- The seed stores image paths such as `/yoga.jpg`, while the page prefixes them with `/trainings/`, producing `/trainings//yoga.jpg`; browsers usually normalise the double slash, but the data should be cleaned up.
- `app/(auth)/layout.jsx` renders its own `<html>` and `<body>` inside the root layout. This is a course quirk and should be simplified to a fragment in a production app.
- There is no password reset, email verification, or rate limiting.
- Lucia v3 is deprecated in favour of newer auth approaches; treat this as a learning implementation.

---

**Author:** Mario Granada
