// GET /api/cron-issue  (runs every Tuesday; acts only on the first Tuesday of a month)
// Sends the monthly issue to every active subscriber, but ONLY when ALL of these are true:
//   - an issue file in emails/issues/ has sendDate = today (UTC)
//   - that issue has "approved": true  (set by a person, after re-reading the funder pages)
//   - every listing's "checked" date is within 7 days before the send date
//   - the built issue exists in emails/out/ and POSTAL_ADDRESS is set
// If any check fails, nothing is sent and the owner gets an email saying why.
import fs from 'node:fs';
import path from 'node:path';
import { listActiveSubscribers } from './_lib/dodo.js';
import { sendMail, notifyOwner } from './_lib/mail.js';
import { footerVars } from './_lib/emails.js';

const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
const STALE_DAYS = 7;

export async function GET(request) {
  if (!process.env.CRON_SECRET || request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) return json({ error: 'unauthorized' }, 401);
  const url = new URL(request.url);
  const dry = url.searchParams.get('dry') === '1';
  // A date override is allowed only for dry runs, so a test can never send a real issue.
  const todayIso = dry && url.searchParams.get('date') ? url.searchParams.get('date') : new Date().toISOString().slice(0, 10);
  const today = new Date(`${todayIso}T00:00:00Z`);

  if (today.getUTCDay() !== 2 || today.getUTCDate() > 7) return json({ skipped: 'not the first Tuesday', date: todayIso });

  const root = process.cwd();
  const issuesDir = path.join(root, 'emails', 'issues');
  const files = fs.existsSync(issuesDir) ? fs.readdirSync(issuesDir).filter((f) => f.endsWith('.json')) : [];
  const match = files.map((f) => ({ f, issue: JSON.parse(fs.readFileSync(path.join(issuesDir, f), 'utf8').replace(/^﻿/, '')) })).find((x) => x.issue.sendDate === todayIso);

  const stop = async (why) => { await notifyOwner(`Monthly issue NOT sent for ${todayIso}`, why); return json({ sent: 0, reason: why }); };

  if (!match) return stop('No issue file in emails/issues/ has this send date.');
  const { issue } = match;
  if (issue.approved !== true) return stop(`Issue ${issue.issueNumber} is not approved. Re-read the funder pages, then set "approved": true in ${match.f} and push.`);
  const stale = (issue.listings || []).filter((l) => {
    const age = (today - new Date(`${l.checked}T00:00:00Z`)) / 86400000;
    return !(age >= 0 && age <= STALE_DAYS);
  });
  if (stale.length) return stop(`These listings were not read within ${STALE_DAYS} days before the send date: ${stale.map((l) => `${l.funder} (checked ${l.checked})`).join('; ')}`);
  if (!footerVars().postal) return stop('POSTAL_ADDRESS is not set. A postal address is required in the footer of a bulk mail.');

  const nn = String(issue.issueNumber).padStart(3, '0');
  const htmlPath = path.join(root, 'emails', 'out', `issue-${nn}.html`);
  const txtPath = path.join(root, 'emails', 'out', `issue-${nn}.txt`);
  if (!fs.existsSync(htmlPath) || !fs.existsSync(txtPath)) return stop(`Built issue files emails/out/issue-${nn}.html and .txt are missing. Run node emails/build_issue.cjs issues/issue-${nn}.json and push.`);

  const { manageUrl, postal } = footerVars();
  const fill = (s) => s.replaceAll('{{unsubscribe_url}}', manageUrl).replaceAll('{{postal_address}}', postal);
  const html = fill(fs.readFileSync(htmlPath, 'utf8'));
  const textFull = fill(fs.readFileSync(txtPath, 'utf8'));
  const subject = (textFull.match(/^Subject:\s*(.+)$/m) || [])[1];
  if (!subject || /\{\{/.test(html + textFull)) return stop('The built issue still contains an unfilled placeholder or has no subject line.');
  const text = textFull.replace(/^Subject:.*\n(Preheader:.*\n)?\n?/m, '');

  let subscribers;
  try { subscribers = await listActiveSubscribers(); } catch (err) { return stop(`Could not list subscribers from Dodo: ${err.message}`); }
  if (dry) return json({ dry: true, issue: nn, subject, recipients: subscribers.length });

  let sent = 0;
  const failed = [];
  for (const s of subscribers) {
    try { await sendMail({ to: s.email, subject, text, html }); sent++; } catch (err) { failed.push(`${s.email}: ${err.message}`); }
  }
  await notifyOwner(`Issue ${nn} sent`, `Sent to ${sent} of ${subscribers.length} subscribers.${failed.length ? `\nFailed:\n${failed.join('\n')}` : ''}`);
  return json({ sent, failed: failed.length });
}
