'use client';

import Image from 'next/image';
import { ShoppingCart, CheckCircle, XCircle } from 'lucide-react';
import { useCart } from './CartContext';
import type { Product } from '@/lib/types';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem, items } = useCart();
  const inCart = items.some((i) => i.product.id === product.id);
  const isAvailable = product.stock_status === 'In Stock';

  const imgSrc =
    product.images[0] ||
    `https://placehold.co/400x300/e5e7eb/9ca3af?text=${encodeURIComponent(product.item_name)}`;

  const categoryColor: Record<string, string> = {
    Electricals: 'bg-blue-100 text-blue-700',
    Plumbing: 'bg-teal-100 text-teal-700',
    Paints: 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 w-full bg-gray-50 overflow-hidden">
        <Image
          src={imgSrc}
          alt={product.item_name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized={imgSrc.startsWith('https://placehold.co')}
        />
        {/* Stock badge */}
        <span
          className={`absolute top-2 right-2 flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full shadow ${
            isAvailable
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {isAvailable ? (
            <CheckCircle className="h-3.5 w-3.5" />
          ) : (
            <XCircle className="h-3.5 w-3.5" />
          )}
          {product.stock_status}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
            {product.item_name}
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {product.brand}
          </span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              categoryColor[product.category] ?? 'bg-gray-100 text-gray-600'
            }`}
          >
            {product.category}
          </span>
        </div>

        {product.description && (
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {product.video_url && (
          <a
            href={product.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-brand-600 hover:underline mt-auto"
          >
            ▶ Watch Demo
          </a>
        )}

        {/* CTA */}
        <button
          disabled={!isAvailable}
          onClick={() => addItem(product)}
          className={`mt-auto flex items-center justify-center gap-2 w-full py-2 rounded-xl text-sm font-semibold transition-colors ${
            !isAvailable
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : inCart
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-brand-600 hover:bg-brand-700 text-white'
          }`}
        >
          <ShoppingCart className="h-4 w-4" />
          {!isAvailable
            ? 'Out of Stock'
            : inCart
            ? 'Added to Quote'
            : 'Add to Quotation'}
        </button>
      </div>
    </div>
  );
}
