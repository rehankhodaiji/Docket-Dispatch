// Dodo Payments helpers: webhook signature check (Standard Webhooks) and the subscriber list.
import crypto from 'node:crypto';

// Standard Webhooks: HMAC-SHA256 over "<webhook-id>.<webhook-timestamp>.<raw body>".
// A secret that starts with whsec_ is base64 after the prefix. Timestamps more than 5 minutes off are rejected.
export function verifyWebhook(raw, headers, secret, nowMs = Date.now()) {
  const id = headers.get('webhook-id');
  const ts = headers.get('webhook-timestamp');
  const sig = headers.get('webhook-signature');
  if (!id || !ts || !sig || !secret) return false;
  if (Math.abs(nowMs / 1000 - Number(ts)) > 300) return false;
  const key = secret.startsWith('whsec_') ? Buffer.from(secret.slice(6), 'base64') : Buffer.from(secret, 'utf8');
  const expected = crypto.createHmac('sha256', key).update(`${id}.${ts}.${raw}`).digest('base64');
  return sig.split(' ').some((part) => {
    const [version, value] = part.split(',');
    if (version !== 'v1' || !value) return false;
    const a = Buffer.from(value);
    const b = Buffer.from(expected);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  });
}

export function dodoBase() {
  return process.env.DODO_ENV === 'live' ? 'https://live.dodopayments.com' : 'https://test.dodopayments.com';
}

// Active subscriptions, newest data from Dodo each time. Returns [{ email, name, productId, createdAt }].
export async function listActiveSubscribers(fetchImpl = fetch) {
  const key = process.env.DODO_API_KEY;
  if (!key) throw new Error('DODO_API_KEY is not set');
  const out = [];
  for (let page = 0; page < 200; page++) {
    const res = await fetchImpl(`${dodoBase()}/subscriptions?status=active&page_size=100&page_number=${page}`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!res.ok) throw new Error(`Dodo list subscriptions failed: ${res.status}`);
    const body = await res.json();
    const items = body.items || [];
    for (const s of items) {
      const email = s.customer && s.customer.email;
      if (email) out.push({ email: email.trim().toLowerCase(), name: (s.customer.name || '').trim(), productId: s.product_id, createdAt: s.created_at });
    }
    if (items.length < 100) break;
  }
  const seen = new Set();
  return out.filter((s) => (seen.has(s.email) ? false : seen.add(s.email)));
}

// Which plan a product is. Set DODO_PRODUCT_ANNUAL and DODO_PRODUCT_MONTHLY in the environment.
export function planOf(productId) {
  if (productId && productId === process.env.DODO_PRODUCT_ANNUAL) return { name: 'Annual', price: '$79 a year', annual: true };
  if (productId && productId === process.env.DODO_PRODUCT_MONTHLY) return { name: 'Monthly', price: '$15 a month', annual: false };
  return { name: '', price: '', annual: false }; // unknown product: the mail stays generic instead of guessing
}
