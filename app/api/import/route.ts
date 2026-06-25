import { NextRequest, NextResponse } from 'next/server';
import { getProducts, setProducts } from '@/lib/storage';
import type { Product, Category, StockStatus, ImportResult } from '@/lib/types';
import { randomUUID } from 'crypto';

export const dynamic = 'force-dynamic';

function validCategory(v: unknown): Category {
  return String(v ?? '').trim() || 'Electricals';
}

function validStock(v: unknown): StockStatus {
  return String(v ?? '').toLowerCase().includes('out')
    ? 'Out of Stock'
    : 'In Stock';
}

async function parseImageUrls(raw: string): Promise<string[]> {
  if (!raw) return [];
  return raw
    .split(/[,\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function POST(req: NextRequest) {
  /* ── auth check ─────────────────────────────────────────────────── */
  const authHeader = req.headers.get('x-admin-token') ?? '';
  if (!isValidToken(authHeader)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  /* ── parse FormData ──────────────────────────────────────────────── */
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const file = formData.get('file') as File | null;
  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!['xlsx', 'xls'].includes(ext ?? '')) {
    return NextResponse.json(
      { error: 'Only .xlsx / .xls files are accepted' },
      { status: 400 },
    );
  }

  /* ── parse Excel ─────────────────────────────────────────────────── */
  const { read, utils } = await import('xlsx');
  const buffer = Buffer.from(await file.arrayBuffer());
  const workbook = read(buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: '',
  });

  const result: ImportResult = { success: true, imported: 0, skipped: 0, errors: [] };
  const newProducts: Product[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const name = String(row['item_name'] ?? '').trim();
    if (!name) {
      result.errors.push(`Row ${i + 2}: missing item_name – skipped`);
      result.skipped++;
      continue;
    }

    const images = await parseImageUrls(String(row['images'] ?? ''));
    const subcategory = String(row['subcategory'] ?? '').trim() || undefined;

    newProducts.push({
      id: randomUUID(),
      item_name: name,
      brand: String(row['brand'] ?? '').trim() || 'Generic',
      category: validCategory(row['category']),
      subcategory,
      description: String(row['description'] ?? '').trim(),
      images,
      video_url: String(row['video_url'] ?? '').trim() || undefined,
      stock_status: validStock(row['stock_status']),
      created_at: new Date().toISOString(),
    });
    result.imported++;
  }

  if (newProducts.length === 0) {
    return NextResponse.json(
      { ...result, success: false, error: 'No valid rows found' },
      { status: 400 },
    );
  }

  /* ── merge with existing products ───────────────────────────────── */
  const mode = (formData.get('mode') as string) ?? 'merge';
  const existing = mode === 'replace' ? [] : await getProducts();

  // Deduplicate by item_name+brand
  const existingKeys = new Set(
    existing.map((p) => `${p.item_name}|${p.brand}`.toLowerCase()),
  );
  const fresh = newProducts.filter(
    (p) =>
      !existingKeys.has(`${p.item_name}|${p.brand}`.toLowerCase()),
  );
  result.skipped += newProducts.length - fresh.length;

  await setProducts([...existing, ...fresh]);

  return NextResponse.json(result, { status: 200 });
}

/* ── simple token validation ──────────────────────────────────────── */
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
