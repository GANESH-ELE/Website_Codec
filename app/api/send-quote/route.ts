import { NextRequest, NextResponse } from 'next/server';
import type { QuotationPayload } from '@/lib/types';

export const dynamic = 'force-dynamic';

function buildEmailBody(payload: QuotationPayload): string {
  const lines = payload.items.map(
    (item, i) =>
      `${i + 1}. ${item.product.item_name} (${item.product.brand}) – Qty: ${item.quantity}`,
  );

  return `
New Quotation Request – Ganesh Electricals Hardware And Berger Paints
=====================================================================

Customer Details:
  Name  : ${payload.customer_name  || 'Not provided'}
  Phone : ${payload.customer_phone || 'Not provided'}
  Email : ${payload.customer_email || 'Not provided'}

Items Requested:
${lines.join('\n')}

Note: ${payload.note || 'None'}

---
This request was submitted via the website quotation cart.
  `.trim();
}

export async function POST(req: NextRequest) {
  let payload: QuotationPayload;
  try {
    payload = (await req.json()) as QuotationPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!payload.items?.length) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  const storeEmail =
    process.env.STORE_EMAIL || 'ganeshelectricals576213@gmail.com';
  const emailBody = buildEmailBody(payload);

  /* ── Try to send via nodemailer ──────────────────────────────────── */
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(process.env.SMTP_PORT ?? '587'),
        secure: false,
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || smtpUser,
        to: storeEmail,
        replyTo: payload.customer_email || undefined,
        subject: `Quotation Request – ${payload.customer_name || 'Website Visitor'}`,
        text: emailBody,
      });
    } catch (err) {
      console.error('[send-quote] SMTP error:', err);
      return NextResponse.json(
        { error: 'Email delivery failed; please contact us directly.' },
        { status: 502 },
      );
    }
  } else {
    /* No SMTP configured – log to console (dev/demo mode) */
    console.log('[send-quote] SMTP not configured. Email content:\n', emailBody);
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
