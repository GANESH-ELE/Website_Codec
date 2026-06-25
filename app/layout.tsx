import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/components/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';

export const metadata: Metadata = {
  title: 'Ganesh Electricals Hardware And Berger Paints – Brahmavara',
  description:
    'Your trusted destination in Brahmavara for premium electrical, plumbing, and Berger Paints solutions. Holy Family Complex, NH 66, Brahmavara, Udupi – 576213.',
  keywords: [
    'Ganesh Electricals',
    'Berger Paints Brahmavara',
    'Hardware Udupi',
    'Electricals Brahmavara',
    'Plumbing NH 66',
    'Holy Family Complex Brahmavara',
  ],
  openGraph: {
    title: 'Ganesh Electricals Hardware And Berger Paints',
    description: 'Electricals, Plumbing & Berger Paints – Brahmavara, Udupi',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navbar />
          {/* pb-16 on mobile to clear the fixed BottomNav */}
          <main className="pb-16 md:pb-0">{children}</main>
          <Footer />
          <BottomNav />
        </CartProvider>
      </body>
    </html>
  );
}
