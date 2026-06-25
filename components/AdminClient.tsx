'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminUpload from './AdminUpload';
import ImageGallery from './ImageGallery';
import {
  Lock,
  Eye,
  EyeOff,
  LogOut,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  PackageSearch,
} from 'lucide-react';
import type { Product } from '@/lib/types';

const TOKEN_KEY = 'geb_admin_token';

const CATEGORY_COLOURS: Record<string, string> = {
  Electricals: 'bg-blue-100 text-blue-700',
  Plumbing:    'bg-teal-100 text-teal-700',
  Paints:      'bg-orange-100 text-orange-700',
};

export default function AdminClient() {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);

  /* ── Restore token from sessionStorage ────────────────────────── */
  useEffect(() => {
    const saved = sessionStorage.getItem(TOKEN_KEY);
    if (saved) setToken(saved);
  }, []);

  /* ── Fetch products once authenticated ────────────────────────── */
  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = (await res.json()) as { products?: Product[] };
      setProducts(data.products ?? []);
    } catch {
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) fetchProducts();
  }, [token, fetchProducts]);

  /* ── Login ─────────────────────────────────────────────────────── */
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { token?: string; error?: string };

      if (!res.ok || !data.token) {
        setLoginError(data.error ?? 'Invalid password');
      } else {
        sessionStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
        setPassword('');
      }
    } catch {
      setLoginError('Network error. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setProducts([]);
  }

  /* ── Login screen ──────────────────────────────────────────────── */
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm">
          <div className="flex justify-center mb-5">
            <span className="bg-brand-100 p-4 rounded-2xl">
              <Lock className="h-8 w-8 text-brand-600" />
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-gray-900 text-center mb-1">
            Admin Login
          </h1>
          <p className="text-center text-xs text-gray-400 mb-6">
            Ganesh Electricals – Catalog Management
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin password"
                autoComplete="current-password"
                required
                className="w-full border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {loginError && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <XCircle className="h-3.5 w-3.5" /> {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={loginLoading || !password}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              {loginLoading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            Set <code className="bg-gray-100 px-1 rounded">ADMIN_PASSWORD</code> in your environment.
          </p>
        </div>
      </div>
    );
  }

  /* ── Dashboard ─────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-navy-800 text-white py-5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-brand-400" />
            <span className="font-bold text-sm">Admin Dashboard</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Upload section */}
        <AdminUpload token={token} onImportDone={fetchProducts} />

        {/* Image Gallery section */}
        <ImageGallery token={token} />

        {/* Product list */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <PackageSearch className="h-5 w-5 text-brand-600" />
              Current Products
              {!productsLoading && (
                <span className="text-xs font-normal text-gray-400 ml-1">
                  ({products.length} total)
                </span>
              )}
            </h2>
            <button
              onClick={fetchProducts}
              disabled={productsLoading}
              className="flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${productsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {productsLoading && (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
            </div>
          )}

          {!productsLoading && products.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              <PackageSearch className="mx-auto h-12 w-12 mb-2 text-gray-200" />
              <p className="text-sm">No products in the database yet.</p>
              <p className="text-xs mt-1">Upload an Excel file above to get started.</p>
            </div>
          )}

          {!productsLoading && products.length > 0 && (
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs text-gray-400 uppercase tracking-wider">
                    <th className="px-3 py-2">Product</th>
                    <th className="px-3 py-2">Brand</th>
                    <th className="px-3 py-2">Category</th>
                    <th className="px-3 py-2">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-3">
                        <p className="font-medium text-gray-900 line-clamp-1 max-w-xs">
                          {p.item_name}
                        </p>
                        {p.description && (
                          <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                            {p.description}
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-3 text-gray-600 whitespace-nowrap">{p.brand}</td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLOURS[p.category] ?? 'bg-gray-100 text-gray-600'}`}>
                          {p.category}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {p.stock_status === 'In Stock' ? (
                          <span className="flex items-center gap-1 text-green-700 text-xs font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5" /> In Stock
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-600 text-xs font-medium">
                            <XCircle className="h-3.5 w-3.5" /> Out of Stock
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
