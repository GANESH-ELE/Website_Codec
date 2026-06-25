import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/storage';
import type { Category } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') as Category | null;

    let products = await getProducts();
    if (category && ['Electricals', 'Plumbing', 'Paints'].includes(category)) {
      products = products.filter((p) => p.category === category);
    }
    return NextResponse.json({ products }, { status: 200 });
  } catch (err) {
    console.error('[/api/products] error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 },
    );
  }
}
