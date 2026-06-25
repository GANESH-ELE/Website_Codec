import { NextRequest, NextResponse } from 'next/server';
import { getImage } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: { key: string } },
) {
  const key = decodeURIComponent(params.key);
  const result = await getImage(key);

  if (!result) {
    return new NextResponse('Not found', { status: 404 });
  }

  return new NextResponse(new Uint8Array(result.data), {
    status: 200,
    headers: {
      'Content-Type': result.contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
