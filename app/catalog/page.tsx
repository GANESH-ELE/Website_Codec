import { Suspense } from 'react';
import CatalogClient from '@/components/CatalogClient';

export const metadata = {
  title: 'Product Catalog – Ganesh Electricals Hardware And Berger Paints',
  description:
    'Browse our complete catalog of electrical fixtures, plumbing supplies, and Berger Paints. Add items to your quotation cart.',
};

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
            <p className="text-gray-500 text-sm">Loading catalog…</p>
          </div>
        </div>
      }
    >
      <CatalogClient />
    </Suspense>
  );
}
