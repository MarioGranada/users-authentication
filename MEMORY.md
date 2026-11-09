# Training Authentication — Working Memory

_Last updated: 2026-11-02_

## Current status

- Signup, login, logout, session validation, and the protected training page work.
- SQLite schema and training seed are created automatically.
- No tests or deployment workflow yet.

## Key decisions

- Used Lucia with the SQLite adapter to keep sessions server-side and cookie-backed.
- Used Node `crypto` for hashing to avoid an extra dependency.
- Kept the database local to match the course before a hosted migration.

## Known limitations and follow-ups

- SQLite is not durable on Vercel.
- No password reset, email verification, or rate limiting.
- Training image paths produce a double slash.
- Nested `(auth)` layout renders a second `<html>`/`<body>`.
- No tests.

## Mistakes to avoid

- Deleting `training.db` logs everyone out and reseeds trainings.
- Importing `lib/db.js` in a client component breaks the build.
- A non-HTTPS production deployment drops the `secure` session cookie.
- Catching a `redirect()` error prevents the navigation.

## Next steps

- Migrate persistence to Supabase Postgres and the matching Lucia adapter.
- Fix the training image paths and simplify the nested layout.
- Add password reset and basic rate limiting.
- Add tests for the auth actions.

---

Keep this file under ~60 lines. Summarise or delete notes that no longer add value.
