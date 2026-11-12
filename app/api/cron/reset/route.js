import sql from '@/lib/db';

export const dynamic = 'force-dynamic';

// Nightly Vercel Cron (vercel.json): deletes every demo account and session so
// the public demo stays clean (the training catalogue is untouched). Vercel
// sends `Authorization: Bearer $CRON_SECRET`; without the secret every request
// is refused.
export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ message: 'Unauthorized.' }, { status: 401 });
  }

  await sql`truncate auth_demo.sessions, auth_demo.users`;

  return Response.json({ message: 'Demo data reset.' });
}
