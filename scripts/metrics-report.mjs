// Weekly numbers from Dodo: active subscribers by plan, new this week, and where they came from.
// Run: DODO_API_KEY=... DODO_ENV=live DODO_PRODUCT_ANNUAL=pdt_... DODO_PRODUCT_MONTHLY=pdt_... node scripts/metrics-report.mjs
// Reads only; changes nothing in Dodo.
import { dodoBase, planOf } from '../api/_lib/dodo.js';

const key = process.env.DODO_API_KEY;
if (!key) {
  console.error('Set DODO_API_KEY (and DODO_ENV=live for real sales). Nothing was read.');
  process.exit(1);
}

const subs = [];
for (let page = 0; page < 200; page++) {
  const res = await fetch(`${dodoBase()}/subscriptions?status=active&page_size=100&page_number=${page}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
  if (!res.ok) { console.error(`Dodo returned ${res.status}`); process.exit(1); }
  const items = (await res.json()).items || [];
  subs.push(...items);
  if (items.length < 100) break;
}

const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
const byPlan = {};
const bySource = {};
let newThisWeek = 0;
for (const s of subs) {
  const plan = planOf(s.product_id).name || 'Unknown plan';
  byPlan[plan] = (byPlan[plan] || 0) + 1;
  const src = (s.metadata && s.metadata.source) || 'untagged';
  bySource[src] = (bySource[src] || 0) + 1;
  if (new Date(s.created_at).getTime() >= weekAgo) newThisWeek++;
}

console.log(`Mode: ${process.env.DODO_ENV === 'live' ? 'live' : 'test'}   Date: ${new Date().toISOString().slice(0, 10)}`);
console.log(`Active subscribers: ${subs.length}   New in the last 7 days: ${newThisWeek}`);
console.log('By plan:', JSON.stringify(byPlan));
console.log('By source:', JSON.stringify(bySource));
