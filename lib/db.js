import postgres from 'postgres';

// One shared Postgres client per server instance.
// POSTGRES_URL is injected by the Supabase <-> Vercel integration and points at
// Supabase's transaction pooler, which does not support prepared statements.
function createClient() {
  const raw = process.env.POSTGRES_URL;
  if (!raw) {
    throw new Error('POSTGRES_URL is not set. Run `vercel env pull .env.local`.');
  }

  const url = new URL(raw);
  const isLocal = ['localhost', '127.0.0.1'].includes(url.hostname);
  url.search = ''; // drop provider-specific query params; SSL is configured below

  return postgres(url.toString(), {
    ssl: isLocal ? false : 'require',
    prepare: false,
    max: 5,
    idle_timeout: 20,
  });
}

const sql = globalThis.__portfolioSql ?? createClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__portfolioSql = sql;
}

export default sql;
