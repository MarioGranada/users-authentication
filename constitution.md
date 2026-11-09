# Project Constitution — Training Authentication

This document defines the non-negotiable foundations for this repository. Read it before adding or changing features.

## Guiding Principles

- **Simplicity first** — prefer the smallest solution that solves the problem. If a change needs a long explanation, it is probably over-engineered.
- **No hardcoded secrets or endpoints** — configuration belongs in environment variables; visual design tokens belong in styles, not in `.env` files.
- **Traceability** — every value, dependency, and route should make its origin and purpose obvious.
- **Debuggability** — fail loudly and visibly; avoid silent fallbacks that hide broken data.
- **Official patterns** — use the documented API of each framework and library before inventing a workaround.
- **Portfolio clarity** — this repository is part of a public portfolio. Code should read as clean, intentional, and easy for a reviewer to follow. As a follow-along project, its purpose is to demonstrate the concepts practised in the course, not to imitate production scale.

## Technology Stack Foundations

| Layer | Choice | Rationale |
| --- | --- | --- |
| Framework | Next.js 14 (App Router) | Server components and server actions keep auth on the server. |
| Auth | Lucia v3 + `@lucia-auth/adapter-sqlite` | Session management with a SQLite adapter. |
| Database | SQLite via `better-sqlite3` | Zero-configuration local persistence for the course. |
| Passwords | Node `crypto.scryptSync` | Built-in, dependency-free password hashing. |
| Styling | Global CSS | A small stylesheet for the auth form and training grid. |

**Rule of thumb:** a new dependency must solve a concrete problem that the current stack cannot solve cleanly. Justify it in the change that introduces it.

## Core Premises

### 1. Scope

A course project for server-side authentication with Next.js and Lucia. It is not a production identity system; password reset, verification, MFA, and hosted persistence are out of scope.

### 2. Environment Isolation

- This project has no runtime secrets. Do not introduce `.env` files unless a real secret or environment-specific URL appears.
- If configuration is added, use environment variables and document them in the README.
- Never commit keys, tokens, database URLs, or credentials.

### 3. Architecture

- Auth actions live in `actions/`; database and session helpers live in `lib/`.
- Protected pages verify the session on the server before rendering.
- Client components receive actions as props or imports and never touch the database.

### 4. Data and State

- SQLite is the local source of truth for users, sessions, and trainings.
- Passwords are stored as `hash:salt` and verified with `timingSafeEqual`.
- Sessions are cookie-backed and validated on every protected request.
- Never return password hashes or session ids to the client.

### 5. Styling and UX

- Global styles live in `app/globals.css`.
- Keep the auth form and training grid readable on mobile.
- Do not add a UI library for this course project.

### 6. Quality Gates

- `npm run lint` and `npm run build` are the gates.
- Manually test signup, duplicate email, short password, login, wrong password, protected redirect, logout, and a stale cookie.
- Delete `training.db` and confirm the schema and seed are recreated.

### 7. Deployment

- Deploy Next.js to Vercel with Supabase (or another hosted Postgres) for persistence.
- Replace `better-sqlite3` before relying on production data; the local filesystem is ephemeral.
- Keep session cookies `secure` and serve over HTTPS.

## What to Avoid

- Committing `training.db` or real user data.
- Importing database code into client components.
- Swallowing Next.js redirect errors in try/catch blocks.
- Storing plaintext passwords or returning hashes.
- Shipping SQLite to a serverless host and expecting persistence.

## Checklist Before Adding Anything New

- Does this solve a real problem for this project, or am I adding scope for its own sake?
- Is every new value configuration-driven rather than hardcoded?
- Does the change follow the existing folder and naming patterns?
- Is there a clear failure path when data, the network, or the environment is unavailable?
- Have I run the available lint/build/test command and fixed what it reports?
- Did I update `README.md` and `MEMORY.md` if behaviour or setup changed?

## Philosophy Statement

This repository exists to show thoughtful front-end engineering: clear structure, readable code, and deliberate trade-offs. The goal is not to use every tool available, but to make every file explain itself. Simplicity is the feature.
