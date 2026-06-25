'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './CartContext';
import { Home, LayoutGrid, ShoppingCart, Phone } from 'lucide-react';

const BOTTOM_LINKS = [
  { href: '/',         label: 'Home',    Icon: Home },
  { href: '/catalog',  label: 'Catalog', Icon: LayoutGrid },
  { href: '/cart',     label: 'Cart',    Icon: ShoppingCart },
  { href: '/#contact', label: 'Contact', Icon: Phone },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href.split('#')[0]);

  return (
    /* Hidden on md+ (desktop) — visible on mobile only */
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-inset-bottom"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {BOTTOM_LINKS.map(({ href, label, Icon }) => {
          const active = isActive(href);
          const isCart = href === '/cart';

          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-xl transition-colors ${
                active ? 'text-brand-600' : 'text-gray-500 hover:text-brand-500'
              }`}
            >
              <span className="relative">
                <Icon
                  className={`h-6 w-6 transition-transform ${active ? 'scale-110' : ''}`}
                  strokeWidth={active ? 2.5 : 1.75}
                />
                {isCart && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center leading-none">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </span>
              <span className={`text-xs font-medium ${active ? 'text-brand-600' : ''}`}>
                {label}
              </span>
              {active && (
                <span className="absolute top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-500" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
