import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-brand-500 rounded-lg p-1.5">
                <Zap className="h-5 w-5 text-white" />
              </span>
              <span className="text-white font-bold text-sm leading-tight">
                <span className="text-brand-400">Ganesh</span> Electricals<br />
                <span className="text-xs font-normal text-gray-400">
                  Hardware &amp; Berger Paints
                </span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted destination in Brahmavara for premium electrical,
              plumbing, and painting solutions.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/', label: 'Home' },
                { href: '/catalog', label: 'Product Catalog' },
                { href: '/catalog?category=Electricals', label: 'Electricals' },
                { href: '/catalog?category=Plumbing', label: 'Plumbing' },
                { href: '/catalog?category=Paints', label: 'Berger Paints' },
                { href: '/cart', label: 'My Quotation' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="hover:text-brand-400 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div id="contact">
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <Phone className="h-4 w-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <a
                  href="tel:+917619373606"
                  className="hover:text-brand-400 transition-colors"
                >
                  +91 76193 73606
                </a>
              </li>
              <li className="flex gap-2">
                <Mail className="h-4 w-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:ganeshelectricals576213@gmail.com"
                  className="hover:text-brand-400 transition-colors break-all"
                >
                  ganeshelectricals576213@gmail.com
                </a>
              </li>
              <li className="flex gap-2">
                <MapPin className="h-4 w-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <span>
                  Holy Family Complex, NH 66,<br />
                  Brahmavara, Udupi – 576213
                </span>
              </li>
              <li className="flex gap-2">
                <Clock className="h-4 w-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <span>Mon – Sat: 9 AM – 7 PM</span>
              </li>
            </ul>
          </div>

          {/* Location / Map */}
          <div>
            <h3 className="text-white font-semibold mb-4">Find Us</h3>
            <div className="text-sm text-gray-400 space-y-2">
              <p>
                📍 Near{' '}
                <span className="text-gray-300 font-medium">
                  Brahmavara Bus Stand
                </span>
              </p>
              <p>National Highway NH&nbsp;66, Brahmavara</p>
              <a
                href="https://maps.google.com/?q=Holy+Family+Complex+NH+66+Brahmavara+Udupi+576213"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
              >
                Open in Google Maps
              </a>
            </div>
            <div className="mt-4">
              <a
                href="https://wa.me/917619373606?text=Hi%2C%20I%20would%20like%20to%20know%20more%20about%20your%20products."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.853L.044 23.956l6.272-1.463A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.816 9.816 0 01-5.032-1.386l-.361-.214-3.725.869.9-3.629-.235-.374A9.79 9.79 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
                </svg>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-navy-700 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Ganesh Electricals Hardware And Berger Paints. All rights reserved.</p>
          <p>Brahmavara, Udupi District, Karnataka</p>
        </div>
      </div>
    </footer>
  );
}
