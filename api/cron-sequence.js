// GET /api/cron-sequence  (daily). Sends the two short onboarding notes by days since the subscription was created:
//   day 2  -> how to read a listing
//   day 10 -> check-in
// Stateless: it works from Dodo's created_at date, so there is no database to keep.
import { listActiveSubscribers, planOf } from './_lib/dodo.js';
import { sendMail, notifyOwner } from './_lib/mail.js';
import { renderHowToRead, renderCheckIn, nextIssueDate, formatDate } from './_lib/emails.js';

const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

export async function GET(request) {
  if (!process.env.CRON_SECRET || request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) return json({ error: 'unauthorized' }, 401);
  const dry = new URL(request.url).searchParams.get('dry') === '1';

  const now = Date.now();
  let subscribers;
  try { subscribers = await listActiveSubscribers(); } catch (err) {
    await notifyOwner('Daily sequence FAILED', err.message);
    return json({ error: err.message }, 500);
  }

  const due = [];
  for (const s of subscribers) {
    const days = Math.floor((now - Date.parse(s.createdAt)) / 86400000);
    if (days === 2) due.push({ s, kind: 'how-to-read' });
    if (days === 10) due.push({ s, kind: 'check-in' });
  }
  if (dry) return json({ dry: true, subscribers: subscribers.length, due: due.map((d) => `${d.kind}: ${d.s.email}`) });

  const results = { sent: 0, failed: [] };
  for (const { s, kind } of due) {
    const mail = kind === 'how-to-read'
      ? renderHowToRead({ name: s.name })
      : renderCheckIn({ name: s.name, plan: planOf(s.productId), nextIssue: formatDate(nextIssueDate()) });
    try {
      await sendMail({ to: s.email, subject: mail.subject, text: mail.text, html: mail.html });
      results.sent++;
    } catch (err) {
      results.failed.push(`${s.email} (${kind}): ${err.message}`);
    }
  }
  if (results.failed.length) await notifyOwner('Some onboarding mails FAILED', results.failed.join('\n'));
  return json(results);
}
