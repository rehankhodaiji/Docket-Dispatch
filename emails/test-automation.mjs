// Local tests for the mail automation. Sends nothing: MAIL_DRY_RUN=1 and Dodo calls are stubbed.
// Run: node emails/test-automation.mjs
import crypto from 'node:crypto';
import fs from 'node:fs';
import assert from 'node:assert/strict';

process.env.MAIL_DRY_RUN = '1';
process.env.DODO_WEBHOOK_SECRET = 'whsec_' + Buffer.from('test-secret-key').toString('base64');
process.env.CRON_SECRET = 'cron-test';
process.env.DODO_API_KEY = 'x';
process.env.DODO_PRODUCT_ANNUAL = 'pdt_annual';
process.env.DODO_PRODUCT_MONTHLY = 'pdt_monthly';
process.env.OWNER_EMAIL = 'owner@example.com';
process.env.GMAIL_USER = 'docudocket@gmail.com';
process.env.POSTAL_ADDRESS = '1 Test Street, Test City';

const { verifyWebhook, planOf } = await import('../api/_lib/dodo.js');
const { renderWelcome, renderHowToRead, renderCheckIn, nextIssueDate, formatDate } = await import('../api/_lib/emails.js');
const { POST } = await import('../api/dodo-webhook.js');
const cronIssue = await import('../api/cron-issue.js');

let n = 0;
const ok = async (name, fn) => { await fn(); n++; console.log('ok  ' + name); };
const sign = (body, id = 'msg_1', ts = Math.floor(Date.now() / 1000)) => {
  const key = Buffer.from('test-secret-key');
  return { 'webhook-id': id, 'webhook-timestamp': String(ts), 'webhook-signature': 'v1,' + crypto.createHmac('sha256', key).update(`${id}.${ts}.${body}`).digest('base64') };
};

// signature
const body = JSON.stringify({ type: 'subscription.active', data: { product_id: 'pdt_annual', customer: { email: 'a@b.com', name: 'Asha Rao' } } });
await ok('valid signature accepted', () => assert.equal(verifyWebhook(body, new Headers(sign(body)), process.env.DODO_WEBHOOK_SECRET), true));
await ok('tampered body rejected', () => assert.equal(verifyWebhook(body + ' ', new Headers(sign(body)), process.env.DODO_WEBHOOK_SECRET), false));
await ok('wrong secret rejected', () => assert.equal(verifyWebhook(body, new Headers(sign(body)), 'whsec_' + Buffer.from('other').toString('base64')), false));
await ok('old timestamp (replay) rejected', () => assert.equal(verifyWebhook(body, new Headers(sign(body, 'm', Math.floor(Date.now() / 1000) - 1000)), process.env.DODO_WEBHOOK_SECRET), false));

// dates
await ok('next issue date after 29 Oct 2026 is Tue 3 Nov 2026', () => assert.equal(formatDate(nextIssueDate(new Date('2026-10-29T10:00:00Z'))), 'Tuesday 3 November 2026'));
await ok('on the first Tuesday itself, next is the following month', () => assert.equal(formatDate(nextIssueDate(new Date('2026-11-03T10:00:00Z'))), 'Tuesday 1 December 2026'));

// templates
const mails = {
  welcomeAnnual: renderWelcome({ name: 'Asha Rao', plan: planOf('pdt_annual'), firstIssue: 'Tuesday 3 November 2026' }),
  welcomeMonthly: renderWelcome({ name: '', plan: planOf('pdt_monthly'), firstIssue: 'Tuesday 3 November 2026' }),
  howToRead: renderHowToRead({ name: 'Asha Rao' }),
  checkIn: renderCheckIn({ name: 'Asha Rao', plan: planOf('pdt_annual'), nextIssue: 'Tuesday 1 December 2026' }),
};
for (const [k, m] of Object.entries(mails)) {
  await ok(`${k}: no leftover placeholders`, () => assert.doesNotMatch(m.text + m.html, /\{\{|undefined|\[object/));
  await ok(`${k}: no em dash`, () => assert.doesNotMatch(m.text + m.html, /—/));
  await ok(`${k}: subject under 60 characters`, () => assert.ok(m.subject.length <= 60, m.subject));
}
await ok('Annual welcome has the funder-tracking block, Monthly does not', () => {
  assert.match(mails.welcomeAnnual.text, /TELL US WHAT TO TRACK/);
  assert.doesNotMatch(mails.welcomeMonthly.text, /TELL US WHAT TO TRACK/);
});
await ok('blank name falls back to "there"', () => assert.match(mails.welcomeMonthly.text, /Welcome, there\./));

// webhook handler
const req = (b, headers) => new Request('https://x.test/api/dodo-webhook', { method: 'POST', body: b, headers });
let res = await POST(req(body, sign(body)));
await ok('webhook: signed subscription.active returns 200 and sends', () => assert.equal(res.status, 200));
res = await POST(req(body, { ...sign(body), 'webhook-signature': 'v1,AAAA' }));
await ok('webhook: bad signature returns 401', () => assert.equal(res.status, 401));
const other = JSON.stringify({ type: 'payment.succeeded', data: {} });
res = await POST(req(other, sign(other)));
await ok('webhook: other event types are ignored (no double welcome)', async () => assert.equal((await res.json()).ignored, 'payment.succeeded'));
const noEmail = JSON.stringify({ type: 'subscription.active', data: {} });
res = await POST(req(noEmail, sign(noEmail)));
await ok('webhook: missing customer email does not crash or retry-loop', () => assert.equal(res.status, 200));

// monthly issue gates (dry runs only)
const issueReq = (q, auth = 'Bearer cron-test') => new Request(`https://x.test/api/cron-issue?${q}`, { headers: { authorization: auth } });
res = await cronIssue.GET(issueReq('dry=1', 'Bearer wrong'));
await ok('issue cron: wrong secret returns 401', () => assert.equal(res.status, 401));
res = await cronIssue.GET(issueReq('dry=1&date=2026-11-10'));
await ok('issue cron: skips a Tuesday that is not the first', async () => assert.match((await res.json()).skipped, /first Tuesday/));
res = await cronIssue.GET(issueReq('dry=1&date=2026-11-03'));
const gate = await res.json();
await ok('issue cron: Issue 001 is blocked because it is not approved', () => assert.match(gate.reason, /not approved/));
await ok('issue cron: the real send date is the first Tuesday', () => assert.equal(JSON.parse(fs.readFileSync('emails/issues/issue-001.json', 'utf8').replace(/^﻿/, '')).approved, false));

console.log(`\n${n} checks passed. Nothing was sent.`);
