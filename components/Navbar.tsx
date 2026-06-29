'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './CartContext';
import { useState } from 'react';
import { ShoppingCart, Menu, X, Zap, ChevronRight, Phone } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/catalog', label: 'Catalog' },
  { href: '/#about', label: 'About Us' },
  { href: '/#contact', label: 'Contact' },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href.split('?')[0].split('#')[0]);

  return (
    <header className="sticky top-0 z-50 bg-navy-800 shadow-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* ── Brand ───────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <img src="/logo.png" 
            alt="Ganesh Electricals Logo" 
            className="h-16 w-auto" />
          </Link>

          {/* ── Desktop nav ─────────────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(l.href)
                    ? 'text-brand-400 bg-white/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* ── Right actions ────────────────────────────────────── */}
          <div className="flex items-center gap-3">
            {/* Desktop: call link */}
            <a
              href="tel:+917619373606"
              className="hidden lg:flex items-center gap-1.5 text-gray-400 hover:text-white text-xs font-medium transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              +91 76193 73606
            </a>

            {/* Desktop: Request Quotation CTA */}
            <Link
              href="/cart"
              className="hidden md:inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors shadow"
            >
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 ? (
                <span>Cart ({totalItems})</span>
              ) : (
                <span>Request Quote</span>
              )}
            </Link>

            {/* Mobile: cart icon */}
            <Link
              href="/cart"
              aria-label={`Quotation cart, ${totalItems} items`}
              className="md:hidden relative p-2 text-gray-300 hover:text-brand-400 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-brand-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile slide-down menu ───────────────────────────────── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-navy-900 border-t border-white/10 px-4 py-3 space-y-1">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive(l.href)
                  ? 'bg-brand-600/20 text-brand-400'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {l.label}
              <ChevronRight className="h-4 w-4 opacity-50" />
            </Link>
          ))}

          {/* Quick action in mobile menu */}
          <div className="pt-2 mt-2 border-t border-white/10">
            <a
              href="tel:+917619373606"
              className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              📞 Call Us: +91 76193 73606
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
