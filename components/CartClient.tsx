'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from './CartContext';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import type { QuotationPayload } from '@/lib/types';

const WHATSAPP_NUMBER = '917619373606';
const STORE_EMAIL = 'ganeshelectricals576213@gmail.com';

export default function CartClient() {
  const { items, removeItem, updateQty, clearCart } = useCart();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [note, setNote] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [emailError, setEmailError] = useState('');

  function buildWhatsAppMessage(): string {
    const lines = items.map(
      (it, i) =>
        `${i + 1}. ${it.product.item_name} (${it.product.brand}) — Qty: ${it.quantity}`,
    );
    const intro = `Hello! I'd like to request a quotation for the following items:\n\n${lines.join('\n')}`;
    const customer = name
      ? `\n\nName: ${name}${phone ? `\nPhone: ${phone}` : ''}`
      : '';
    const noteStr = note ? `\n\nNote: ${note}` : '';
    return `${intro}${customer}${noteStr}\n\nThank you!`;
  }

  function handleWhatsApp() {
    const msg = encodeURIComponent(buildWhatsAppMessage());
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  }

  async function handleEmailQuote() {
    setEmailStatus('sending');
    setEmailError('');

    const payload: QuotationPayload = {
      items,
      customer_name: name || undefined,
      customer_phone: phone || undefined,
      customer_email: customerEmail || undefined,
      note: note || undefined,
    };

    try {
      const res = await fetch('/api/send-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? 'Failed to send');
      }
      setEmailStatus('sent');
    } catch (err) {
      setEmailStatus('error');
      setEmailError(err instanceof Error ? err.message : 'Unknown error');
    }
  }

  /* ── Empty state ───────────────────────────────────────────────── */
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-5 px-4 text-center">
        <ShoppingCart className="h-20 w-20 text-gray-200" />
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Your quotation is empty</h1>
        <p className="text-gray-500 text-sm lg:text-base max-w-sm">
          Browse our catalog and add products to request a quotation.
        </p>
        <Link
          href="/catalog"
          className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-3.5 rounded-full transition-colors shadow hover:shadow-md"
        >
          Browse Catalog →
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-navy-800 text-white py-8 md:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-3 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Catalog
          </Link>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold">My Quotation Cart</h1>
          <p className="text-gray-300 text-sm lg:text-base mt-1">
            {items.length} item{items.length !== 1 ? 's' : ''} — send your list via WhatsApp or email.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">

          {/* ── Item list ─────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => {
              const imgSrc =
                product.images[0] ||
                `https://placehold.co/120x90/e5e7eb/9ca3af?text=${encodeURIComponent(
                  product.item_name.substring(0, 12),
                )}`;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-5 flex gap-4 items-start hover:shadow-md transition-shadow"
                >
                  <div className="relative w-20 h-20 lg:w-24 lg:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={imgSrc}
                      alt={product.item_name}
                      fill
                      sizes="96px"
                      className="object-cover"
                      unoptimized={imgSrc.includes('placehold.co')}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm lg:text-base leading-snug line-clamp-2">
                      {product.item_name}
                    </p>
                    <p className="text-xs lg:text-sm text-gray-400 mt-0.5">
                      {product.brand} · {product.category}
                    </p>

                    {/* Quantity stepper */}
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => updateQty(product.id, quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5 text-gray-600" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-gray-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQty(product.id, quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1 flex-shrink-0"
                    aria-label={`Remove ${product.item_name}`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              );
            })}

            <button
              onClick={clearCart}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" /> Clear all items
            </button>
          </div>

          {/* ── Sidebar: customer form + actions ──────────────────── */}
          <div className="space-y-5">
            {/* Customer details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:p-6">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-1">
                Your Details
                <span className="text-gray-400 font-normal text-xs ml-1">(optional)</span>
              </h2>
              <div className="space-y-3">
                {[
                  { label: 'Name',  value: name,          setter: setName,          type: 'text',  placeholder: 'Your name' },
                  { label: 'Phone', value: phone,         setter: setPhone,         type: 'tel',   placeholder: '+91 98765 43210' },
                  { label: 'Email', value: customerEmail, setter: setCustomerEmail, type: 'email', placeholder: 'you@example.com' },
                ].map(({ label, value, setter, type, placeholder }) => (
                  <div key={label}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                    <input
                      type={type}
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      placeholder={placeholder}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Note</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Any special requirements…"
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Send actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:p-6 space-y-3">
              <h2 className="font-bold text-gray-800 mb-2 text-lg">Send Quotation</h2>

              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm lg:text-base"
              >
                <MessageCircle className="h-5 w-5" />
                Send via WhatsApp
              </button>

              <button
                onClick={handleEmailQuote}
                disabled={emailStatus === 'sending' || emailStatus === 'sent'}
                className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm lg:text-base"
              >
                {emailStatus === 'sending' && <><Loader2 className="h-5 w-5 animate-spin" /> Sending…</>}
                {emailStatus === 'sent'    && <><CheckCircle className="h-5 w-5" /> Email Sent!</>}
                {(emailStatus === 'idle' || emailStatus === 'error') && <><Mail className="h-5 w-5" /> Send via Email</>}
              </button>

              {emailStatus === 'sent' && (
                <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-800">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>Sent to <strong>{STORE_EMAIL}</strong>. We will contact you shortly!</span>
                </div>
              )}
              {emailStatus === 'error' && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-800">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{emailError || 'Could not send email. Please try WhatsApp.'}</span>
                </div>
              )}

              <p className="text-xs text-gray-400 text-center pt-1">
                No payment collected — this is a quotation request only.
              </p>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 text-sm">
              <p className="font-semibold text-gray-700 mb-3">Order Summary</p>
              {items.map((it) => (
                <div key={it.product.id} className="flex justify-between text-gray-600 py-1 border-b border-gray-100 last:border-0">
                  <span className="truncate mr-2 max-w-[72%] text-xs">{it.product.item_name}</span>
                  <span className="flex-shrink-0 font-medium text-xs">× {it.quantity}</span>
                </div>
              ))}
              <div className="mt-3 pt-3 flex justify-between font-semibold text-gray-800 text-sm border-t border-gray-200">
                <span>Total qty</span>
                <span>{items.reduce((s, i) => s + i.quantity, 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
