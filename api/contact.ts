import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const MAX = { name: 120, center: 160, email: 200, phone: 40, topic: 120, message: 4000 };

function esc(v: string) {
  return v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM;

  // Misconfiguration must be loud, not a silent "thanks" to the visitor.
  const missing = [
    !apiKey && 'RESEND_API_KEY',
    !to && 'CONTACT_TO',
    !from && 'CONTACT_FROM',
  ].filter(Boolean);
  if (missing.length) {
    console.error('[contact] missing env vars:', missing.join(', '));
    return res
      .status(500)
      .json({ error: 'The contact form is not configured yet. Please try again later.' });
  }

  const body = (typeof req.body === 'string' ? safeParse(req.body) : req.body) ?? {};

  // Hidden field no human sees. If it is filled in, it is a bot.
  if (typeof body.website === 'string' && body.website.trim()) {
    return res.status(200).json({ ok: true });
  }

  const field = (k: keyof typeof MAX) => String(body[k] ?? '').trim().slice(0, MAX[k]);
  const name = field('name');
  const center = field('center');
  const email = field('email');
  const phone = field('phone');
  const topic = field('topic') || 'Get in Touch';
  const message = field('message');

  if (!name || !center || !email) {
    return res.status(400).json({ error: 'Please fill in your name, center name, and email.' });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'That email address does not look right.' });
  }

  const rows: [string, string][] = [
    ['Name', name],
    ['Center', center],
    ['Email', email],
    ['Phone', phone || '—'],
    ['Message', message || '—'],
  ];

  const html = `
    <h2 style="font-family:system-ui,sans-serif">${esc(topic)}</h2>
    <table style="font-family:system-ui,sans-serif;border-collapse:collapse">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:4px 12px 4px 0;vertical-align:top;color:#666">${k}</td>` +
            `<td style="padding:4px 0"><strong>${esc(v).replace(/\n/g, '<br>')}</strong></td></tr>`
        )
        .join('')}
    </table>
    <p style="font-family:system-ui,sans-serif;color:#888;font-size:12px">
      Submitted from thecenterbook.com. Reply to this email to reach them directly.
    </p>`;

  const text = `${topic}\n\n${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}`;

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: from as string,
      to: [to as string],
      replyTo: email,
      subject: `${topic} — ${name} (${center})`,
      html,
      text,
    });
    if (error) {
      console.error('[contact] resend rejected the send:', error);
      return res
        .status(502)
        .json({ error: "We couldn't send that just now. Please try again in a moment." });
    }
  } catch (err) {
    console.error('[contact] send threw:', err);
    return res
      .status(502)
      .json({ error: "We couldn't send that just now. Please try again in a moment." });
  }

  return res.status(200).json({ ok: true });
}

function safeParse(s: string) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
