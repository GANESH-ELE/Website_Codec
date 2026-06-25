import { describe, it, expect, vi, beforeEach } from 'vitest';

/* ─────────────────────────────────────────────────────────────
   1.  listImages – local dev path (mocked fs)
   ───────────────────────────────────────────────────────────── */
vi.mock('fs', async () => {
  const actual = await vi.importActual<typeof import('fs')>('fs');
  return {
    ...actual,
    existsSync: vi.fn(() => true),
    mkdirSync: vi.fn(),
    readdirSync: vi.fn(() => [
      'water-pump.jpg',
      'cable-box.png',
      'paint-brush.webp',
      'readme.txt',       // should be filtered out
      'photo.JPEG',       // uppercase extension – still valid
    ]),
    readFileSync: actual.readFileSync,
    writeFileSync: vi.fn(),
  };
});

// Ensure NETLIFY env vars are absent so isNetlify() returns false
beforeEach(() => {
  delete process.env.NETLIFY;
  delete process.env.NETLIFY_BLOBS_CONTEXT;
  delete process.env.NETLIFY_LOCAL;
});

describe('listImages (local dev fallback)', () => {
  it('returns only image files (jpg, jpeg, png, webp) – case-insensitive', async () => {
    const { listImages } = await import('../lib/storage');
    const result = await listImages();
    expect(result).toContain('water-pump.jpg');
    expect(result).toContain('cable-box.png');
    expect(result).toContain('paint-brush.webp');
    expect(result).toContain('photo.JPEG');
    expect(result).not.toContain('readme.txt');
  });

  it('returns an array type', async () => {
    const { listImages } = await import('../lib/storage');
    const result = await listImages();
    expect(Array.isArray(result)).toBe(true);
  });
});

/* ─────────────────────────────────────────────────────────────
   2.  Filename sanitisation helper (mirrors route.ts logic)
   ───────────────────────────────────────────────────────────── */
function sanitiseFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-{2,}/g, '-')
    .toLowerCase();
}

describe('sanitiseFilename', () => {
  it('lowercases the filename', () => {
    expect(sanitiseFilename('Water-Pump.JPG')).toBe('water-pump.jpg');
  });

  it('replaces spaces with hyphens', () => {
    expect(sanitiseFilename('water pump.jpg')).toBe('water-pump.jpg');
  });

  it('collapses multiple consecutive hyphens', () => {
    expect(sanitiseFilename('my  product  image.png')).toBe('my--product--image.png'.replace(/-{2,}/g, '-'));
  });

  it('strips special characters', () => {
    expect(sanitiseFilename('product@#$.jpg')).toBe('product---.jpg'.replace(/-{2,}/g, '-'));
  });

  it('leaves safe filenames unchanged (except lowercasing)', () => {
    expect(sanitiseFilename('cable-box-v2.webp')).toBe('cable-box-v2.webp');
  });
});

/* ─────────────────────────────────────────────────────────────
   3.  isValidToken helper (mirrors /api/images route logic)
   ───────────────────────────────────────────────────────────── */
function isValidToken(token: string): boolean {
  if (!token) return false;
  try {
    const [prefix, encoded] = token.split('.');
    if (prefix !== 'geb') return false;
    const payload = JSON.parse(Buffer.from(encoded, 'base64').toString());
    const age = Date.now() - payload.iat;
    return age < 8 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

function makeToken(iatOffset = 0): string {
  const payload = { iat: Date.now() + iatOffset };
  return `geb.${Buffer.from(JSON.stringify(payload)).toString('base64')}`;
}

describe('isValidToken', () => {
  it('accepts a fresh valid token', () => {
    expect(isValidToken(makeToken())).toBe(true);
  });

  it('rejects empty string', () => {
    expect(isValidToken('')).toBe(false);
  });

  it('rejects wrong prefix', () => {
    const payload = Buffer.from(JSON.stringify({ iat: Date.now() })).toString('base64');
    expect(isValidToken(`bad.${payload}`)).toBe(false);
  });

  it('rejects expired token (older than 8 h)', () => {
    const expired = makeToken(-9 * 60 * 60 * 1000); // 9 hours ago
    expect(isValidToken(expired)).toBe(false);
  });

  it('rejects malformed payload', () => {
    expect(isValidToken('geb.not-valid-base64!!')).toBe(false);
  });
});

/* ─────────────────────────────────────────────────────────────
   4.  Supported image extensions (upload validation)
   ───────────────────────────────────────────────────────────── */
const ALLOWED_EXTS = ['jpg', 'jpeg', 'png', 'webp'];

function isAllowedExt(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  return ALLOWED_EXTS.includes(ext);
}

describe('isAllowedExt (upload validation)', () => {
  it('allows jpg', () => expect(isAllowedExt('photo.jpg')).toBe(true));
  it('allows jpeg', () => expect(isAllowedExt('photo.jpeg')).toBe(true));
  it('allows png', () => expect(isAllowedExt('icon.png')).toBe(true));
  it('allows webp', () => expect(isAllowedExt('banner.webp')).toBe(true));
  it('rejects gif', () => expect(isAllowedExt('anim.gif')).toBe(false));
  it('rejects bmp', () => expect(isAllowedExt('old.bmp')).toBe(false));
  it('rejects pdf', () => expect(isAllowedExt('doc.pdf')).toBe(false));
  it('rejects files with no extension', () => expect(isAllowedExt('noext')).toBe(false));
});
