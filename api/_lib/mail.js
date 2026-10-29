// Sends mail from the Docket Gmail account over SMTP (app password). MAIL_DRY_RUN=1 logs instead of sending.
import nodemailer from 'nodemailer';

let transport;

export async function sendMail({ to, subject, text, html, replyTo }) {
  if (process.env.MAIL_DRY_RUN === '1') {
    console.log(`[dry-run mail] to=${to} subject=${subject}`);
    return { dryRun: true };
  }
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) throw new Error('GMAIL_USER and GMAIL_APP_PASSWORD are not set');
  transport ??= nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
  return transport.sendMail({
    from: `Docket Dispatch <${user}>`,
    to,
    subject,
    text,
    html,
    replyTo: replyTo || process.env.REPLY_TO || user,
  });
}

// A short note to the owner. Never throws, so a failed alert cannot hide the real result.
export async function notifyOwner(subject, text) {
  const to = process.env.OWNER_EMAIL;
  if (!to) return;
  try {
    await sendMail({ to, subject: `[Docket automation] ${subject}`, text });
  } catch (err) {
    console.error('owner notification failed', err.message);
  }
}
