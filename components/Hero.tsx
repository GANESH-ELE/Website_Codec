'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';

interface Slide {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  cta: { label: string; href: string };
  bg: string;
  emoji: string;
  image?: string;
}

const slides: Slide[] = [
  {
    id: 1,
    tag: 'Authorized Dealer-Berger Paints',
    title: 'Berger Paints',
    subtitle: 'Transform your home with India\'s premium paint brand. Trusted by homeowners and contractors alike.',
    cta: { label: 'Shop Paints', href: '/catalog?category=Paints' },
    image: '/images/hero/berger_banner1.jpg',
    bg: 'from-orange-700 via-orange-600 to-yellow-500',
    emoji: '🎨',
    
  },
  {
    id: 2,
    tag: 'Authorized Dealer-Lisha Switches',
    title: 'Electrical Fixtures & Fittings',
    subtitle: 'Switches, Plates and more from top brands — all under one roof in Brahmavara.',
    cta: { label: 'Browse Electricals', href: '/catalog?category=Electricals' },
    bg: 'from-blue-900 via-blue-800 to-blue-600',
    emoji: '⚡',
    image: '/images/hero/lisha_banner6.jpg',
  },
  {
    id: 3,
    tag: 'Astral-Complete Plumbing Solutions',
    title: 'Plumbing Supplies',
    subtitle: 'Astral CPVC/PVC pipes, fittings, taps and water-management products from trusted manufacturers.',
    cta: { label: 'Explore Plumbing', href: '/catalog?category=Plumbing' },
    bg: 'from-teal-800 via-teal-700 to-cyan-500',
    emoji: '🔧',
    image: '/images/hero/astral_banner4.jpg',
  },
  {
    id: 4,
    tag: 'Kirloskar Pumps & Motors',
    title: 'Serving Since Years',
    subtitle: 'Visit us at Holy Family Complex, near Brahmavara Bus Stand on National Highway 66.',
    cta: { label: 'Get Directions', href: '/#contact' },
    bg: 'from-gray-900 via-gray-800 to-gray-700',
    emoji: '🏪',
    image: '/images/hero/kirloskar_banner5.jpg',
  },
  {
    id: 5,
    tag: 'SIntex Water Tanks and Pipes',
    title: 'Serving Since Years',
    subtitle: 'Sintex tanks and pipes available at our store.',
    cta: { label: 'Get Directions', href: '/#contact' },
    bg: 'from-gray-900 via-gray-800 to-gray-700',
    emoji: '🏪',
    image: '/images/hero/sintextanks_banner2.jpg',
  },
    {
    id: 6,
    tag: 'SIntex Eterno Tanks',
    title: 'With 50 years Warranty',
    subtitle: 'Sintex tanks and pipes available at our store.',
    cta: { label: 'Get Directions', href: '/#contact' },
    bg: 'from-gray-900 via-gray-800 to-gray-700',
    emoji: '🏪',
    image: '/images/hero/sintexEterno_banner2.jpg',
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
              {/* Background image — renders on top of the gradient fallback */}
              {s.image && (
                <>
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    className="object-cover"
                    priority={s.id === 1}
                    sizes="100vw"
                  />
                  {/* Dark overlay to keep white text readable */}
                  <div className="absolute inset-0 bg-black/40 bg-gradient-to-br from-black/50 to-black/20" />
                </>
              )}

              {/* Slide content — above image/overlay via z-index */}
              <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-20 sm:py-28 lg:py-36 xl:py-44 flex flex-col items-start gap-5 lg:gap-6">
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

              {/* Decorative circles — only shown for gradient-only slides */}
              {!s.image && (
                <>
                  <div className="absolute right-0 top-0 w-72 h-72 sm:w-[28rem] sm:h-[28rem] lg:w-[40rem] lg:h-[40rem] rounded-full bg-white/5 -translate-y-1/3 translate-x-1/4 pointer-events-none" />
                  <div className="absolute right-20 bottom-0 w-56 h-56 lg:w-80 lg:h-80 rounded-full bg-white/5 translate-y-1/2 pointer-events-none" />
                  <div className="absolute right-1/3 top-1/2 w-32 h-32 lg:w-48 lg:h-48 rounded-full bg-white/3 -translate-y-1/2 pointer-events-none" />
                </>
              )}
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
