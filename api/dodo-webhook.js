// POST /api/dodo-webhook
// Dodo calls this when a payment goes through. In Dodo's webhook settings enable ONLY "subscription.active"
// (a purchase also fires payment.succeeded, and enabling both would send two welcome mails).
import { verifyWebhook, planOf } from './_lib/dodo.js';
import { sendMail, notifyOwner } from './_lib/mail.js';
import { renderWelcome, nextIssueDate, formatDate } from './_lib/emails.js';

const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

export async function POST(request) {
  const raw = await request.text();
  if (!verifyWebhook(raw, request.headers, process.env.DODO_WEBHOOK_SECRET)) return json({ error: 'invalid signature' }, 401);

  let event;
  try { event = JSON.parse(raw); } catch { return json({ error: 'bad json' }, 400); }
  if (event.type !== 'subscription.active') return json({ ignored: event.type });

  const data = event.data || {};
  const email = data.customer && data.customer.email;
  if (!email) {
    // Payload shape differs from what we expect. Tell the owner and stop Dodo from retrying.
    await notifyOwner('Welcome mail NOT sent: no customer email in the event', `Event ${event.type}. Keys in data: ${Object.keys(data).join(', ')}`);
    return json({ error: 'no customer email in event' });
  }

  const plan = planOf(data.product_id);
  const mail = renderWelcome({ name: data.customer.name, plan, firstIssue: formatDate(nextIssueDate()) });
  try {
    await sendMail({ to: email, subject: mail.subject, text: mail.text, html: mail.html });
  } catch (err) {
    await notifyOwner('Welcome mail FAILED', `To: ${email}\nError: ${err.message}\nDodo will retry this event.`);
    return json({ error: 'send failed' }, 500); // non-2xx makes Dodo retry
  }
  await notifyOwner('New subscriber', `${email} (${plan.name || 'plan not recognised'}). Welcome mail sent.`);
  return json({ ok: true });
}
