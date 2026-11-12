# Training Authentication — Working Memory

_Last updated: 2026-11-12_

## Current status

- Signup, login, logout, session validation, and the protected training page work (verified end to end against Postgres on 2026-11-12).
- Data lives in Supabase Postgres (`auth_demo` schema); schema + seed in `db/migration.sql` (idempotent).
- Linked to Vercel project `users-authentication` (GitHub connected). Live at https://users-authentication-ruby.vercel.app since 2026-11-12.
- No tests yet.

## Key decisions

- Used Lucia; 2026-11-12 switched from the SQLite adapter to `@lucia-auth/adapter-postgresql` (PostgresJsAdapter) on the shared portfolio Supabase project.
- Used Node `crypto` for hashing to avoid an extra dependency.
- Schema named `auth_demo` because Supabase reserves `auth`.

## Known limitations and follow-ups

- No password reset, email verification, or rate limiting.
- Nested `(auth)` layout renders a second `<html>`/`<body>`.
- Lucia v3 is deprecated; acceptable for a learning project.
- No tests.

## Mistakes to avoid

- Importing `lib/db.js` in a client component breaks the build.
- A non-HTTPS production deployment drops the `secure` session cookie.
- Catching a `redirect()` error prevents the navigation.
- Training image names are stored without a leading slash (the page adds `/trainings/`).

## Next steps

- Simplify the nested layout; add rate limiting and tests.

---

Keep this file under ~60 lines. Summarise or delete notes that no longer add value.
