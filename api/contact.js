import { Resend } from 'resend';

/* Where the notification lands. Overridable per-environment without a code change. */
const TO = process.env.CONTACT_TO || 'bincysines@gmail.com';
/* Must be an address on a domain verified in Resend. The resend.dev sender only
   delivers to the Resend account owner, so set CONTACT_FROM once a domain is verified. */
const FROM = process.env.CONTACT_FROM || 'The Center Book <onboarding@resend.dev>';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MAX = 5000;

function clean(v) {
  return typeof v === 'string' ? v.trim().slice(0, MAX) : '';
}

function esc(v) {
  return v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error('contact: RESEND_API_KEY is not set');
    return res.status(500).json({ error: 'Email is not configured.' });
  }

  /* Vercel parses JSON bodies, but tolerate a raw string if the header is off. */
  let data = req.body;
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch {
      return res.status(400).json({ error: 'Invalid request.' });
    }
  }
  if (!data || typeof data !== 'object') {
    return res.status(400).json({ error: 'Invalid request.' });
  }

  /* Bots fill every field they find; real submitters never see this one. */
  if (clean(data.company)) return res.status(200).json({ ok: true });

  const name = clean(data.name);
  const center = clean(data.center);
  const email = clean(data.email);
  const phone = clean(data.phone);
  const message = clean(data.message);
  const topic = clean(data.topic) || 'Get in Touch';

  if (!name || !center || !email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Please fill in your name, center, and a valid email.' });
  }

  const rows = [
    ['Name', name],
    ['Center', center],
    ['Email', email],
    ['Phone', phone || '—'],
    ['Message', message || '—'],
  ];

  const html = `
    <h2 style="font-family:sans-serif">${esc(topic)}</h2>
    <table style="font-family:sans-serif;border-collapse:collapse">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:4px 12px 4px 0;vertical-align:top"><strong>${k}</strong></td><td style="padding:4px 0">${esc(v).replace(/\n/g, '<br>')}</td></tr>`
        )
        .join('')}
    </table>`;

  const text = `${topic}\n\n${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}`;

  try {
    const { error } = await new Resend(key).emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `${topic} — ${center}`,
      html,
      text,
    });
    if (error) {
      console.error('contact: resend rejected the send', error);
      return res.status(502).json({ error: 'Could not send right now.' });
    }
  } catch (err) {
    console.error('contact: send threw', err);
    return res.status(502).json({ error: 'Could not send right now.' });
  }

  return res.status(200).json({ ok: true });
}
