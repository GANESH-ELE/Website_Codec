import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import path from 'path';
import type { Product } from './types';

/* ── Environment detection ───────────────────────────────────────── */
function isNetlify(): boolean {
  return !!(
    process.env.NETLIFY ||
    process.env.NETLIFY_BLOBS_CONTEXT ||
    process.env.NETLIFY_LOCAL
  );
}

/* ── Local filesystem paths (dev fallback) ──────────────────────── */
const LOCAL_DATA  = path.join(process.cwd(), '.data');
const PRODUCTS_FILE = path.join(LOCAL_DATA, 'products.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

function ensureDir(dir: string): void {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

/* ── Local helpers ──────────────────────────────────────────────── */
function getProductsLocal(): Product[] {
  ensureDir(LOCAL_DATA);
  if (!existsSync(PRODUCTS_FILE)) return [];
  try {
    return JSON.parse(readFileSync(PRODUCTS_FILE, 'utf-8')) as Product[];
  } catch {
    return [];
  }
}

function setProductsLocal(products: Product[]): void {
  ensureDir(LOCAL_DATA);
  writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

/* ── Public API ─────────────────────────────────────────────────── */
export async function getProducts(): Promise<Product[]> {
  if (isNetlify()) {
    try {
      const { getStore } = await import('@netlify/blobs');
      const store = getStore('geb-products');
      const data = await store.get('catalog', { type: 'json' });
      return (data as Product[]) ?? [];
    } catch {
      return [];
    }
  }
  return getProductsLocal();
}

export async function setProducts(products: Product[]): Promise<void> {
  if (isNetlify()) {
    const { getStore } = await import('@netlify/blobs');
    const store = getStore('geb-products');
    await store.setJSON('catalog', products);
    return;
  }
  setProductsLocal(products);
}

export async function storeImage(
  buffer: Buffer,
  key: string,
  contentType: string,
): Promise<string> {
  if (isNetlify()) {
    const { getStore } = await import('@netlify/blobs');
    const store = getStore('geb-images');
    // @netlify/blobs accepts ArrayBuffer
    const arrayBuffer: ArrayBuffer = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength,
    ) as ArrayBuffer;
    await store.set(key, arrayBuffer, { metadata: { contentType } });
    return `/api/images/${key}`;
  }
  ensureDir(UPLOADS_DIR);
  writeFileSync(path.join(UPLOADS_DIR, key), buffer);
  return `/uploads/${key}`;
}

export async function getImage(
  key: string,
): Promise<{ data: Buffer; contentType: string } | null> {
  if (isNetlify()) {
    try {
      const { getStore } = await import('@netlify/blobs');
      const store = getStore('geb-images');
      const result = await store.getWithMetadata(key, { type: 'arrayBuffer' });
      if (!result) return null;
      return {
        data: Buffer.from(result.data as ArrayBuffer),
        contentType: (result.metadata?.contentType as string) || 'image/jpeg',
      };
    } catch {
      return null;
    }
  }
  const filePath = path.join(UPLOADS_DIR, key);
  if (!existsSync(filePath)) return null;
  return { data: readFileSync(filePath), contentType: 'image/jpeg' };
}

export async function listImages(): Promise<string[]> {
  if (isNetlify()) {
    try {
      const { getStore } = await import('@netlify/blobs');
      const store = getStore('geb-images');
      const result = await store.list();
      return result.blobs.map((b) => b.key);
    } catch {
      return [];
    }
  }
  ensureDir(UPLOADS_DIR);
  return readdirSync(UPLOADS_DIR).filter((f) =>
    /\.(jpe?g|png|webp)$/i.test(f),
  );
}
