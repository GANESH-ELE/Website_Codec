import { NextRequest, NextResponse } from 'next/server';
import { listImages, storeImage } from '@/lib/storage';

export const dynamic = 'force-dynamic';

/* ── GET /api/images — list all stored image filenames ───────────── */
export async function GET() {
  try {
    const images = await listImages();
    return NextResponse.json({ images }, { status: 200 });
  } catch (err) {
    console.error('[GET /api/images] error:', err);
    return NextResponse.json({ error: 'Failed to list images' }, { status: 500 });
  }
}

/* ── POST /api/images — upload one or more image files ───────────── */
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('x-admin-token') ?? '';
  if (!isValidToken(authHeader)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const files = formData.getAll('files') as File[];
  if (files.length === 0) {
    return NextResponse.json({ error: 'No files provided' }, { status: 400 });
  }

  const uploaded: string[] = [];
  const errors: string[] = [];

  for (const file of files) {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
      errors.push(`${file.name}: unsupported format (use jpg, png, or webp)`);
      continue;
    }
    // Sanitise: keep only safe filename characters
    const safeName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, '-')
      .replace(/-{2,}/g, '-')
      .toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = file.type || `image/${ext === 'jpg' ? 'jpeg' : ext}`;
    await storeImage(buffer, safeName, contentType);
    uploaded.push(safeName);
  }

  return NextResponse.json({ uploaded, errors }, { status: 200 });
}

/* ── simple token validation (mirrors /api/import logic) ─────────── */
function isValidToken(token: string): boolean {
  if (!token) return false;
  try {
    const [prefix, encoded] = token.split('.');
    if (prefix !== 'geb') return false;
    const payload = JSON.parse(Buffer.from(encoded, 'base64').toString());
    const age = Date.now() - payload.iat;
    return age < 8 * 60 * 60 * 1000; // 8 h
  } catch {
    return false;
  }
}
