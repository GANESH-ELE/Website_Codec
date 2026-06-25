import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { password } = (await req.json()) as { password?: string };

  if (!password) {
    return NextResponse.json({ error: 'Password required' }, { status: 400 });
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD env var not set on server' },
      { status: 500 },
    );
  }

  if (password !== expected) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  /* Build a lightweight signed-look-alike token (not a real JWT).        */
  /* The import route validates the prefix + age; no secret is embedded.  */
  const payload = Buffer.from(
    JSON.stringify({ iat: Date.now() }),
  ).toString('base64');
  const token = `geb.${payload}`;

  return NextResponse.json({ token }, { status: 200 });
}
