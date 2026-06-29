import Hero from '@/components/Hero';
import Link from 'next/link';
import { Zap, Droplet, PaintBucket, MapPin, Phone, Mail, Clock, Star } from 'lucide-react';

/* ── Sample / demo products ─────────────────────────────────────────── */
const FEATURED = [
  {
    id: 'demo-1',
    item_name: 'Havells Crabtree Switch Board',
    brand: 'Havells',
    category: 'Electricals',
    description: 'Premium modular switch board with 8-module configuration.',
    images: [],
    stock_status: 'In Stock',
  },
  {
    id: 'demo-2',
    item_name: 'Berger WeatherCoat Premium',
    brand: 'Berger',
    category: 'Paints',
    description: '100% acrylic exterior emulsion – superior water resistance.',
    images: [],
    stock_status: 'In Stock',
  },
  {
    id: 'demo-3',
    item_name: 'Astral CPVC Pipe 1"',
    brand: 'Astral',
    category: 'Plumbing',
    description: 'CPVC hot & cold water pipe, ISI marked, 3 m length.',
    images: [],
    stock_status: 'In Stock',
  },
  {
    id: 'demo-4',
    item_name: 'Finolex 4 sq mm Wire',
    brand: 'Finolex',
    category: 'Electricals',
    description: 'FR-grade PVC insulated copper wire, 90 m coil, ISI marked.',
    images: [],
    stock_status: 'In Stock',
  },
];

const CATEGORIES = [
  {
    name: 'Electricals',
    Icon: Zap,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    iconBg: 'bg-blue-100',
    desc: 'Wires, switches, MCBs, LED bulbs, fans, water pumps & more.',
    href: '/catalog?category=Electricals',
  },
  {
    name: 'Plumbing',
    Icon: Droplet,
    color: 'bg-teal-50 text-teal-700 border-teal-200',
    iconBg: 'bg-teal-100',
    desc: 'CPVC/PVC pipes, fittings, taps, mixers, and sanitary ware.',
    href: '/catalog?category=Plumbing',
  },
  {
    name: 'Berger Paints',
    Icon: PaintBucket,
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    iconBg: 'bg-orange-100',
    desc: 'Interior emulsions, exterior weathercoats, primers & distempers.',
    href: '/catalog?category=Paints',
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero slider ─────────────────────────────────────────────── */}
      <Hero />

      {/* ── Category highlights ─────────────────────────────────────── */}
      <section className="py-10 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3">
              What We Offer
            </h2>
            <p className="text-gray-500 text-sm lg:text-base max-w-xl mx-auto">
              Premium products across three core categories — trusted by contractors and homeowners in Brahmavara.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {CATEGORIES.map(({ name, Icon, color, iconBg, desc, href }) => (
              <Link
                key={name}
                href={href}
                className={`group flex flex-col items-center text-center p-8 rounded-2xl border hover:shadow-xl transition-all hover:-translate-y-1 ${color}`}
              >
                <span className={`${iconBg} rounded-full p-5 mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-9 w-9" />
                </span>
                <h3 className="font-bold text-xl mb-2">{name}</h3>
                <p className="text-sm opacity-80 leading-relaxed">{desc}</p>
                <span className="mt-5 text-sm font-semibold underline underline-offset-2">
                  Browse {name} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured products ─────────────────────────────────────────── */}
      <section className="py-10 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 md:mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900">
                Featured Products
              </h2>
              <p className="text-gray-500 text-sm lg:text-base mt-1">
                Popular picks from our catalog
              </p>
            </div>
            <Link
              href="/catalog"
              className="text-brand-600 font-semibold text-sm lg:text-base hover:underline hidden sm:block"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {FEATURED.map((p) => {
              const catColor: Record<string, string> = {
                Electricals: 'bg-blue-100 text-blue-700',
                Plumbing: 'bg-teal-100 text-teal-700',
                Paints: 'bg-orange-100 text-orange-700',
              };
              return (
                <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${catColor[p.category] ?? 'bg-gray-100 text-gray-700'}`}>
                      {p.category}
                    </span>
                    <span className="text-xs text-green-600 font-semibold bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                      ✓ In Stock
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 leading-snug">{p.item_name}</h3>
                  <p className="text-xs text-gray-400 font-medium">{p.brand}</p>
                  <p className="text-sm text-gray-600 leading-relaxed flex-1">{p.description}</p>
                  <Link
                    href={`/catalog?category=${p.category}`}
                    className="mt-auto text-center bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                  >
                    See in Catalog
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link href="/catalog" className="text-brand-600 font-semibold text-sm hover:underline">
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* ── About Us ────────────────────────────────────────────────── */}
      <section id="about" className="py-10 md:py-20 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text */}
            <div>
              <span className="text-brand-600 font-semibold text-sm uppercase tracking-widest">
                About Us
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                Ganesh Electricals Hardware<br />
                <span className="text-brand-600">And Berger Paints</span>
              </h2>
              <p className="mt-5 text-gray-600 text-base lg:text-lg leading-relaxed">
                Welcome to <strong>Ganesh Electricals Hardware And Berger Paints</strong>,
                your trusted destination in Brahmavara for electrical, plumbing,
                and painting solutions. We specialize in Berger Paints, electrical fixtures,
                water pumps, and plumbing supplies, serving contractors and homeowners with
                reliable products and expert service for years.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {[
                  { label: 'Authorized Berger Paints Dealer', icon: '🎨' },
                  { label: 'Trusted by Contractors', icon: '👷' },
                  { label: 'Wide Range of Brands', icon: '🏷️' },
                  { label: 'Expert Product Guidance', icon: '💡' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-2 text-sm lg:text-base text-gray-700">
                    <span className="text-xl leading-none">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/catalog"
                className="mt-8 inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-3.5 rounded-full transition-colors shadow hover:shadow-md"
              >
                Browse Our Catalog →
              </Link>
            </div>

            {/* Info card */}
            <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-3xl p-8 lg:p-10 text-white shadow-xl">
              <div className="flex items-center gap-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-yellow-400 text-sm font-medium ml-1">Trusted Store</span>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold mb-6">Visit Our Store</h3>
              <ul className="space-y-4 text-sm lg:text-base">
                <li className="flex gap-3">
                  <MapPin className="h-5 w-5 text-brand-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Holy Family Complex, NH 66</p>
                    <p className="text-gray-400">Brahmavara, Udupi District – 576213</p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Near Brahmavara Bus Stand, National Highway NH 66
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Phone className="h-5 w-5 text-brand-400 flex-shrink-0" />
                  <a href="tel:+917619373606" className="hover:text-brand-300 transition-colors font-medium">
                    +91 76193 73606
                  </a>
                </li>
                <li className="flex gap-3">
                  <Mail className="h-5 w-5 text-brand-400 flex-shrink-0" />
                  <a
                    href="mailto:ganeshelectricals576213@gmail.com"
                    className="hover:text-brand-300 transition-colors break-all text-xs lg:text-sm"
                  >
                    ganeshelectricals576213@gmail.com
                  </a>
                </li>
                <li className="flex gap-3">
                  <Clock className="h-5 w-5 text-brand-400 flex-shrink-0" />
                  <div>
                    <p>Monday – Saturday</p>
                    <p className="text-gray-400">8:00 AM – 8:00 PM</p>
                    <p>Sunday</p>
                    <p className="text-gray-400">8:00 AM – 1:00 PM</p>
                  </div>
                </li>
              </ul>
              <a
                href="https://wa.me/917619373606?text=Hi%2C%20I%20would%20like%20a%20quotation%20for%20some%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm lg:text-base"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.853L.044 23.956l6.272-1.463A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.816 9.816 0 01-5.032-1.386l-.361-.214-3.725.869.9-3.629-.235-.374A9.79 9.79 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact section ─────────────────────────────────────────── */}
      <section id="contact" className="py-10 md:py-20 bg-gray-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-10 md:mb-14">
            <span className="text-brand-600 font-semibold text-sm uppercase tracking-widest">
              Get in Touch
            </span>
            <h2 className="mt-2 text-3xl lg:text-4xl font-extrabold text-gray-900">
              Contact &amp; Location
            </h2>
            <p className="mt-2 text-gray-500 lg:text-base max-w-lg mx-auto">
              We are located on NH 66, easily accessible from Brahmavara Bus Stand.
            </p>
          </div>

          {/* Two-column desktop layout: contact cards left, map banner right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">

            {/* Left column: 3 info cards stacked */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-5">
              {/* Address */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:items-center sm:text-center lg:flex-row lg:text-left lg:items-start gap-4">
                <span className="bg-brand-100 p-3 rounded-full flex-shrink-0">
                  <MapPin className="h-6 w-6 text-brand-600" />
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Store Address</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Holy Family Complex, NH 66<br />
                    <strong>Brahmavara</strong>, Udupi District, Karnataka – <strong>576213</strong>
                  </p>
                  <a
                    href="https://www.google.com/maps/place/GANESH+ELECTRICALS+,+HARDWARE+AND+BERGER+PAINTS/@13.4348502,74.7424361,17z/data=!3m1!4b1!4m6!3m5!1s0x3bbcbd0a9242f88b:0xdfe046eac32f9822!8m2!3d13.434845!4d74.745011!16s%2Fg%2F11h40zq8ln?authuser=0&entry=ttu&g_ep=EgoyMDI2MDYyNC4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 font-semibold text-sm hover:underline mt-2 inline-block"
                  >
                    Open in Maps →
                  </a>
                </div>
              </div>

              {/* Phone & Email */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:items-center sm:text-center lg:flex-row lg:text-left lg:items-start gap-4">
                <span className="bg-green-100 p-3 rounded-full flex-shrink-0">
                  <Phone className="h-6 w-6 text-green-600" />
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Call or WhatsApp</h3>
                  <a
                    href="tel:+917619373606"
                    className="text-lg font-bold text-gray-900 hover:text-brand-600 transition-colors block"
                  >
                    +91 76193 73606
                  </a>
                  <a
                    href="mailto:ganeshelectricals576213@gmail.com"
                    className="text-xs text-gray-500 hover:text-brand-600 transition-colors break-all block mt-0.5"
                  >
                    ganeshelectricals576213@gmail.com
                  </a>
                  <a
                    href="https://wa.me/917619373606"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-1.5 rounded-full transition-colors"
                  >
                    WhatsApp Us
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:items-center sm:text-center lg:flex-row lg:text-left lg:items-start gap-4">
                <span className="bg-blue-100 p-3 rounded-full flex-shrink-0">
                  <Clock className="h-6 w-6 text-blue-600" />
                </span>
                <div className="w-full">
                  <h3 className="font-bold text-gray-900 mb-2">Business Hours</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    {[
                      { day: 'Monday – Friday', hours: '8:00 AM – 8:00 PM' },
                      { day: 'Sunday',        hours: '8:00 AM – 1:00 PM' },                      
                    ].map((h) => (
                      <div key={h.day} className="flex justify-between border-b border-gray-50 last:border-0 py-1">
                        <span className="font-medium text-gray-700">{h.day}</span>
                        <span className="text-gray-500">{h.hours}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/cart"
                    className="mt-3 text-brand-600 font-semibold text-sm hover:underline inline-block"
                  >
                    Request a Quotation →
                  </Link>
                </div>
              </div>
            </div>

            {/* Right column: map banner + CTA */}
            <div className="flex flex-col gap-5">
              <div className="bg-navy-800 rounded-2xl p-8 lg:p-10 text-white flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">📍</span>
                  <div>
                    <p className="font-bold text-lg lg:text-xl leading-snug">
                      Holy Family Complex, NH 66
                    </p>
                    <p className="text-gray-400 text-sm">Brahmavara – 576213</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm lg:text-base leading-relaxed mb-6">
                  Located on National Highway 66, just beside the Brahmavara Bus Stand.
                  Easily accessible by road — look for the yellow signboard!
                </p>

                <div className="space-y-3">
                  <a
                    href="https://www.google.com/maps/place/GANESH+ELECTRICALS+,+HARDWARE+AND+BERGER+PAINTS/@13.4348502,74.7424361,17z/data=!3m1!4b1!4m6!3m5!1s0x3bbcbd0a9242f88b:0xdfe046eac32f9822!8m2!3d13.434845!4d74.745011!16s%2Fg%2F11h40zq8ln?authuser=0&entry=ttu&g_ep=EgoyMDI2MDYyNC4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-400 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors text-sm lg:text-base w-full"
                  >
                    <MapPin className="h-4 w-4" />
                    Get Directions on Google Maps
                  </a>
                  <a
                    href="https://wa.me/917619373606?text=Hi%2C%20I%20need%20directions%20to%20your%20store."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-xl transition-colors text-sm lg:text-base w-full border border-white/20"
                  >
                    Ask for Directions on WhatsApp
                  </a>
                </div>
              </div>

              {/* Quotation CTA card */}
              <div className="bg-brand-600 rounded-2xl p-6 lg:p-8 text-white text-center">
                <h3 className="font-bold text-xl lg:text-2xl mb-2">Need a Quotation?</h3>
                <p className="text-white/80 text-sm lg:text-base mb-5">
                  Add products to your cart and send us a quotation request instantly via WhatsApp or email.
                </p>
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-7 py-3 rounded-full hover:bg-brand-50 transition-colors shadow text-sm lg:text-base"
                >
                  Browse Catalog & Request Quote →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
