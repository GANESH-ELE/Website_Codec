'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';

const slides = [
  {
  id: 1,
  tag: 'Authorized Dealer-Sintex Water Tanks & Plumbing Supplies',
  image: '\images\ads\EternoAds.jpg', // <--- I added this for you
  title: 'Sintex Water Tank',
  subtitle: 'A Premium Storage Solution for Your Home. Durable, Reliable, and Trusted by Indians.',
  cta: { label: 'Shop Plumbing', href: '/catalog?category=Plumbing' },
  bg: 'from-orange-700 via-orange-600 to-yellow-500',
  emoji: '🎨',
},
  {
    id: 6,
    tag: 'Authorized Dealer',
    title: 'Berger Paints',
    subtitle: 'Transform your home with India\'s premium paint brand. Trusted by homeowners and contractors alike.',
    cta: { label: 'Shop Paints', href: '/catalog?category=Paints' },
    image:'\images\ads\EternoAds.jpg',
    emoji: '🎨',
  },
  {
    id: 2,
    tag: 'Wide Range',
    title: 'Electrical Fixtures & Fittings',
    subtitle: 'Switches, MCBs, wires, pumps and more from top brands — all under one roof in Brahmavara.',
    cta: { label: 'Browse Electricals', href: '/catalog?category=Electricals' },
    bg: 'from-blue-900 via-blue-800 to-blue-600',
    emoji: '⚡',
  },
  {
    id: 3,
    tag: 'Sintex Water Tanks',
    title: 'Plumbing Supplies',
    subtitle: 'Complete Range Of Sintex Water Storage Tanks.',
    cta: { label: 'Explore Plumbing', href: '/catalog?category=Plumbing' },
    bg: 'from-teal-800 via-teal-700 to-cyan-500',
    emoji: '🔧',
  },
  {
    id: 4,
    tag: 'Brahmavara, NH 66',
    title: 'Serving You Since Years',
    subtitle: 'Visit us at Holy Family Complex, near Brahmavara Bus Stand on National Highway 66.',
    cta: { label: 'Get Directions', href: '/#contact' },
    bg: 'from-gray-900 via-gray-800 to-gray-700',
    emoji: '🏪',
  },
];

export default function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4500, stopOnInteraction: false }),
  ]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="relative overflow-hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((s) => (
            <div
              key={s.id}
              className={`relative flex-[0_0_100%] min-w-0 bg-gradient-to-br ${s.bg}`}
            >
              <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-20 sm:py-28 lg:py-36 xl:py-44 flex flex-col items-start gap-5 lg:gap-6">
                {/* Tag */}
                <span className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full backdrop-blur-sm">
                  {s.tag}
                </span>

                {/* Title */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight max-w-2xl">
                  <span className="mr-3 text-4xl sm:text-6xl xl:text-7xl">{s.emoji}</span>
                  {s.title}
                </h1>

                {/* Subtitle */}
                <p className="text-white/80 text-base sm:text-lg lg:text-xl max-w-xl lg:max-w-2xl leading-relaxed">
                  {s.subtitle}
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-2">
                  <Link
                    href={s.cta.href}
                    className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold text-sm lg:text-base px-7 py-3.5 lg:px-8 lg:py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                  >
                    {s.cta.label} →
                  </Link>
                  <Link
                    href="/cart"
                    className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold text-sm lg:text-base px-7 py-3.5 lg:px-8 lg:py-4 rounded-full border border-white/30 backdrop-blur-sm transition-all"
                  >
                    <FileText className="h-4 w-4" />
                    Request Quotation
                  </Link>
                </div>
              </div>

              {/* Decorative circles */}
              <div className="absolute right-0 top-0 w-72 h-72 sm:w-[28rem] sm:h-[28rem] lg:w-[40rem] lg:h-[40rem] rounded-full bg-white/5 -translate-y-1/3 translate-x-1/4 pointer-events-none" />
              <div className="absolute right-20 bottom-0 w-56 h-56 lg:w-80 lg:h-80 rounded-full bg-white/5 translate-y-1/2 pointer-events-none" />
              <div className="absolute right-1/3 top-1/2 w-32 h-32 lg:w-48 lg:h-48 rounded-full bg-white/3 -translate-y-1/2 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Prev / Next buttons — larger on desktop */}
      <button
        onClick={scrollPrev}
        className="absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 lg:p-3 transition-colors shadow"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 lg:h-6 lg:w-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-3 lg:right-6 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 lg:p-3 transition-colors shadow"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6" />
      </button>
    </section>
  );
}
