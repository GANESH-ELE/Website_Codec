import { describe, it, expect } from 'vitest';
import type { Product, Category } from '../lib/types';

/* ─────────────────────────────────────────────────────────────
   1. Type-level: Category is now plain string
   ───────────────────────────────────────────────────────────── */
describe('Category type', () => {
  it('accepts any string value, not just the three originals', () => {
    const cat: Category = 'Hardware'; // was previously illegal
    expect(typeof cat).toBe('string');
  });

  it('still accepts legacy values', () => {
    const cats: Category[] = ['Electricals', 'Plumbing', 'Paints'];
    expect(cats).toHaveLength(3);
  });
});

/* ─────────────────────────────────────────────────────────────
   2. Product interface: subcategory field is optional string
   ───────────────────────────────────────────────────────────── */
describe('Product interface', () => {
  it('is valid without subcategory', () => {
    const p: Product = {
      id: '1',
      item_name: 'Test',
      brand: 'Brand',
      category: 'Electricals',
      description: 'desc',
      images: [],
      stock_status: 'In Stock',
    };
    expect(p.subcategory).toBeUndefined();
  });

  it('accepts subcategory when provided', () => {
    const p: Product = {
      id: '2',
      item_name: 'Test',
      brand: 'Brand',
      category: 'Electricals',
      subcategory: 'Wires & Cables',
      description: 'desc',
      images: [],
      stock_status: 'In Stock',
    };
    expect(p.subcategory).toBe('Wires & Cables');
  });

  it('accepts a custom (non-legacy) category', () => {
    const p: Product = {
      id: '3',
      item_name: 'Bolt',
      brand: 'Generic',
      category: 'Hardware',
      subcategory: 'Fasteners',
      description: 'Steel bolt',
      images: [],
      stock_status: 'In Stock',
    };
    expect(p.category).toBe('Hardware');
    expect(p.subcategory).toBe('Fasteners');
  });
});

/* ─────────────────────────────────────────────────────────────
   3. Filter logic (extracted from CatalogClient useMemo)
   ───────────────────────────────────────────────────────────── */
function applyFilters(
  products: Product[],
  activeCategory: string,
  activeSubcategory: string,
  query: string,
): Product[] {
  let list = products;
  if (activeCategory !== 'All') {
    list = list.filter((p) => p.category === activeCategory);
  }
  if (activeSubcategory) {
    list = list.filter((p) => p.subcategory === activeSubcategory);
  }
  if (query.trim()) {
    const q = query.toLowerCase();
    list = list.filter(
      (p) =>
        p.item_name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }
  return list;
}

const SAMPLE: Product[] = [
  { id: '1', item_name: 'Havells Switch', brand: 'Havells', category: 'Electricals', subcategory: 'Switches', description: 'desc', images: [], stock_status: 'In Stock' },
  { id: '2', item_name: 'Finolex Wire', brand: 'Finolex', category: 'Electricals', subcategory: 'Wires', description: 'desc', images: [], stock_status: 'In Stock' },
  { id: '3', item_name: 'Astral Pipe', brand: 'Astral', category: 'Plumbing', subcategory: 'Pipes', description: 'desc', images: [], stock_status: 'In Stock' },
  { id: '4', item_name: 'Berger Paint', brand: 'Berger', category: 'Paints', description: 'desc', images: [], stock_status: 'In Stock' },
  { id: '5', item_name: 'Steel Bolt', brand: 'Generic', category: 'Hardware', subcategory: 'Fasteners', description: 'desc', images: [], stock_status: 'In Stock' },
];

describe('applyFilters (CatalogClient filter logic)', () => {
  it('returns all products when category is All', () => {
    expect(applyFilters(SAMPLE, 'All', '', '')).toHaveLength(5);
  });

  it('filters by a legacy category', () => {
    const result = applyFilters(SAMPLE, 'Electricals', '', '');
    expect(result).toHaveLength(2);
    expect(result.every((p) => p.category === 'Electricals')).toBe(true);
  });

  it('filters by a custom (non-legacy) category', () => {
    const result = applyFilters(SAMPLE, 'Hardware', '', '');
    expect(result).toHaveLength(1);
    expect(result[0].item_name).toBe('Steel Bolt');
  });

  it('filters by subcategory within a category', () => {
    const result = applyFilters(SAMPLE, 'Electricals', 'Wires', '');
    expect(result).toHaveLength(1);
    expect(result[0].item_name).toBe('Finolex Wire');
  });

  it('subcategory filter across All categories', () => {
    const result = applyFilters(SAMPLE, 'All', 'Fasteners', '');
    expect(result).toHaveLength(1);
    expect(result[0].subcategory).toBe('Fasteners');
  });

  it('filters by search query', () => {
    const result = applyFilters(SAMPLE, 'All', '', 'berger');
    expect(result).toHaveLength(1);
    expect(result[0].brand).toBe('Berger');
  });

  it('returns empty array when nothing matches', () => {
    expect(applyFilters(SAMPLE, 'All', '', 'xyzzy')).toHaveLength(0);
  });

  it('products without subcategory do not match subcategory filter', () => {
    // 'Berger Paint' has no subcategory
    const result = applyFilters(SAMPLE, 'All', 'Pipes', '');
    result.forEach((p) => expect(p.subcategory).toBeDefined());
  });
});

/* ─────────────────────────────────────────────────────────────
   4. Import route helpers (validCategory / subcategory parsing)
   ───────────────────────────────────────────────────────────── */
function validCategory(v: unknown): string {
  return String(v ?? '').trim() || 'Electricals';
}

function parseSubcategory(v: unknown): string | undefined {
  return String(v ?? '').trim() || undefined;
}

describe('validCategory (import helper)', () => {
  it('passes through any non-empty string as-is', () => {
    expect(validCategory('Hardware')).toBe('Hardware');
    expect(validCategory('Electricals')).toBe('Electricals');
    expect(validCategory('  Plumbing  ')).toBe('Plumbing');
  });

  it('falls back to Electricals for blank / null / undefined', () => {
    expect(validCategory('')).toBe('Electricals');
    expect(validCategory(null)).toBe('Electricals');
    expect(validCategory(undefined)).toBe('Electricals');
  });
});

describe('parseSubcategory (import helper)', () => {
  it('returns the trimmed string when present', () => {
    expect(parseSubcategory('Wires & Cables')).toBe('Wires & Cables');
    expect(parseSubcategory('  Switches  ')).toBe('Switches');
  });

  it('returns undefined when blank / null / undefined', () => {
    expect(parseSubcategory('')).toBeUndefined();
    expect(parseSubcategory(null)).toBeUndefined();
    expect(parseSubcategory(undefined)).toBeUndefined();
  });
});

/* ─────────────────────────────────────────────────────────────
   5. catColor fallback (app/page.tsx Featured loop)
   ───────────────────────────────────────────────────────────── */
const catColor: Record<string, string> = {
  Electricals: 'bg-blue-100 text-blue-700',
  Plumbing: 'bg-teal-100 text-teal-700',
  Paints: 'bg-orange-100 text-orange-700',
};

describe('catColor lookup with fallback', () => {
  it('returns known colors for legacy categories', () => {
    expect(catColor['Electricals'] ?? 'bg-gray-100 text-gray-700').toBe('bg-blue-100 text-blue-700');
    expect(catColor['Paints'] ?? 'bg-gray-100 text-gray-700').toBe('bg-orange-100 text-orange-700');
  });

  it('falls back to gray for unknown categories', () => {
    expect(catColor['Hardware'] ?? 'bg-gray-100 text-gray-700').toBe('bg-gray-100 text-gray-700');
    expect(catColor[''] ?? 'bg-gray-100 text-gray-700').toBe('bg-gray-100 text-gray-700');
  });
});
