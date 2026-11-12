// Applies db/migration.sql (idempotent schema + seed) to the database.
// Usage: vercel env pull .env.local && npm run db:migrate
import { readFileSync } from 'node:fs';
import postgres from 'postgres';

const raw = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
if (!raw) {
  console.error('Set POSTGRES_URL_NON_POOLING or POSTGRES_URL (vercel env pull .env.local).');
  process.exit(1);
}

const url = new URL(raw);
const isLocal = ['localhost', '127.0.0.1'].includes(url.hostname);
url.search = '';

const sql = postgres(url.toString(), {
  ssl: isLocal ? false : 'require',
  max: 1,
  prepare: false,
  onnotice: () => {},
});

const file = new URL('../db/migration.sql', import.meta.url);
await sql.unsafe(readFileSync(file, 'utf8')).simple();
console.log('Applied db/migration.sql');
await sql.end();
