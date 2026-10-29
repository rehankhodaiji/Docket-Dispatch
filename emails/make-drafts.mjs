// Writes preview copies of the automated mails into emails/drafts (sample values, nothing is sent).
import fs from 'node:fs';
process.env.GMAIL_USER ||= 'docudocket@gmail.com';
const { renderWelcome, renderHowToRead, renderCheckIn } = await import('../api/_lib/emails.js');
const { planOf } = await import('../api/_lib/dodo.js');
process.env.DODO_PRODUCT_ANNUAL = 'a'; process.env.DODO_PRODUCT_MONTHLY = 'm';
const set = {
  '1-welcome-annual': renderWelcome({ name: 'Asha Rao', plan: planOf('a'), firstIssue: 'Tuesday 3 November 2026' }),
  '1-welcome-monthly': renderWelcome({ name: 'Asha Rao', plan: planOf('m'), firstIssue: 'Tuesday 3 November 2026' }),
  '2-day2-how-to-read': renderHowToRead({ name: 'Asha Rao' }),
  '4-day10-check-in': renderCheckIn({ name: 'Asha Rao', plan: planOf('a'), nextIssue: 'Tuesday 1 December 2026' }),
};
for (const [k, m] of Object.entries(set)) {
  fs.writeFileSync(`emails/drafts/${k}.html`, m.html);
  fs.writeFileSync(`emails/drafts/${k}.txt`, `Subject: ${m.subject}\nPreheader: ${m.preheader}\n\n${m.text}`);
}
console.log(Object.keys(set).join('\n'));
