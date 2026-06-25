'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CategoryFilter from './CategoryFilter';
import ProductCard from './ProductCard';
import { Search, SlidersHorizontal, PackageSearch, ChevronRight } from 'lucide-react';
import type { Product } from '@/lib/types';
import { DEMO_PRODUCTS } from '@/lib/demoData';

export default function CatalogClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(
    searchParams.get('category') ?? 'All',
  );
  const [activeSubcategory, setActiveSubcategory] = useState<string>(
    searchParams.get('subcategory') ?? '',
  );
  const [query, setQuery] = useState('');

  /* ── Fetch products from API ──────────────────────────────────── */
  useEffect(() => {
    setLoading(true);
    fetch('/api/products')
      .then((r) => r.json())
      .then((data: { products?: Product[] }) => {
        const list = data.products ?? [];
        setProducts(list.length > 0 ? list : DEMO_PRODUCTS);
      })
      .catch(() => {
        setError('Could not load products. Showing demo catalog.');
        setProducts(DEMO_PRODUCTS);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ── Sync filters from URL ────────────────────────────────────── */
  useEffect(() => {
    setActiveCategory(searchParams.get('category') ?? 'All');
    setActiveSubcategory(searchParams.get('subcategory') ?? '');
  }, [searchParams]);

  /* ── Handle category change + update URL ─────────────────────── */
  function handleCategoryChange(cat: string) {
    setActiveCategory(cat);
    setActiveSubcategory('');
    const params = new URLSearchParams(searchParams.toString());
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    params.delete('subcategory');
    router.replace(`/catalog?${params.toString()}`, { scroll: false });
  }

  /* ── Handle subcategory change + update URL ───────────────────── */
  function handleSubcategoryChange(sub: string) {
    setActiveSubcategory(sub);
    const params = new URLSearchParams(searchParams.toString());
    if (!sub) {
      params.delete('subcategory');
    } else {
      params.set('subcategory', sub);
    }
    router.replace(`/catalog?${params.toString()}`, { scroll: false });
  }

  /* ── Derived category list ────────────────────────────────────── */
  const categories = useMemo(() => {
    const seen = new Set<string>();
    for (const p of products) seen.add(p.category);
    return Array.from(seen).sort();
  }, [products]);

  /* ── Derived subcategory list for active category ─────────────── */
  const subcategories = useMemo(() => {
    const base =
      activeCategory === 'All'
        ? products
        : products.filter((p) => p.category === activeCategory);
    const seen = new Set<string>();
    for (const p of base) {
      if (p.subcategory) seen.add(p.subcategory);
    }
    return Array.from(seen).sort();
  }, [products, activeCategory]);

  /* ── Category counts ──────────────────────────────────────────── */
  const counts = useMemo(() => {
    const c: Partial<Record<string, number>> = { All: products.length };
    for (const p of products) {
      c[p.category] = (c[p.category] ?? 0) + 1;
    }
    return c;
  }, [products]);

  /* ── Filtered list ────────────────────────────────────────────── */
  const filtered = useMemo(() => {
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
  }, [products, activeCategory, activeSubcategory, query]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="bg-navy-800 text-white py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold">Product Catalog</h1>
          <p className="text-gray-300 text-sm lg:text-base mt-2">
            Electricals · Plumbing · Berger Paints — add items to your quotation cart.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* ── Category filter & search bar ──────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center justify-between">
          <div className="overflow-x-auto pb-1 -mx-1 px-1">
            <CategoryFilter
              active={activeCategory}
              onChange={handleCategoryChange}
              counts={counts}
              categories={categories}
            />
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72 flex-shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
            />
          </div>
        </div>

        {/* ── Subcategory filter ────────────────────────────────── */}
        {subcategories.length > 0 && (
          <div
            className="flex flex-wrap gap-2 mb-6 md:mb-8 overflow-x-auto pb-1 -mx-1 px-1"
            role="group"
            aria-label="Subcategory filter"
          >
            <button
              onClick={() => handleSubcategoryChange('')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                !activeSubcategory
                  ? 'bg-brand-100 text-brand-700 border-brand-300'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-brand-300 hover:text-brand-600'
              }`}
            >
              All {activeCategory !== 'All' ? activeCategory : 'Subcategories'}
            </button>
            {subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => handleSubcategoryChange(sub)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  activeSubcategory === sub
                    ? 'bg-brand-100 text-brand-700 border-brand-300'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-brand-300 hover:text-brand-600'
                }`}
              >
                <ChevronRight className="h-3 w-3" />
                {sub}
              </button>
            ))}
          </div>
        )}

        {/* ── Results count ────────────────────────────────────── */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-5 md:mb-7">
          <SlidersHorizontal className="h-4 w-4" />
          <span>
            {loading ? 'Loading…' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`}
          </span>
          {error && <span className="text-yellow-600 ml-2">⚠ {error}</span>}
        </div>

        {/* ── Loading skeleton ─────────────────────────────────── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-9 bg-gray-200 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Product grid ─────────────────────────────────────── */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* ── Empty state ──────────────────────────────────────── */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <PackageSearch className="h-16 w-16 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-700">No products found</h3>
            <p className="text-sm text-gray-500 max-w-xs">
              Try a different category or clear your search.
            </p>
            <button
              onClick={() => { setQuery(''); handleCategoryChange('All'); }}
              className="text-brand-600 font-semibold text-sm hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
