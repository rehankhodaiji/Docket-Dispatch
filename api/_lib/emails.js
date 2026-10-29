// The three automated mails (welcome, how to read a listing, check-in) plus dates and shared footer.
// Voice: plain, specific, "we" for the publication, signed by Rehan. No em dashes.
export const SITE = 'https://www.docudocket.live';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const F = "Arial,Helvetica,sans-serif";
const S = "Georgia,'Times New Roman',serif";
const M = "'Courier New',monospace";

// ---- dates ----
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export function formatDate(d) {
  return `Tuesday ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
function firstTuesdayOf(year, month) {
  const d = new Date(Date.UTC(year, month, 1));
  while (d.getUTCDay() !== 2) d.setUTCDate(d.getUTCDate() + 1);
  return d;
}
// The next first Tuesday of a month that is after "from" (a Date).
export function nextIssueDate(from = new Date()) {
  const day = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
  for (let i = 0; i < 3; i++) {
    const t = firstTuesdayOf(day.getUTCFullYear(), day.getUTCMonth() + i);
    if (t > day) return t;
  }
  throw new Error('no issue date found');
}

// ---- shared pieces ----
export function footerVars() {
  return {
    manageUrl: process.env.MANAGE_URL || `mailto:${process.env.GMAIL_USER || 'docudocket@gmail.com'}?subject=Cancel%20my%20subscription`,
    postal: process.env.POSTAL_ADDRESS || '',
  };
}

const p = (t) => `<p style="margin:0 0 14px;">${t}</p>`;
const h = (t) => `<div style="margin:22px 0 6px;font-family:${M};font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#C86A14;">${esc(t)}</div>`;

function wrap({ title, preheader, inner }) {
  const { manageUrl, postal } = footerVars();
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:#F8F5EE;">
<div style="display:none;max-height:0;overflow:hidden;color:#F8F5EE;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8F5EE;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:2px solid #1A1714;">
<tr><td style="background:#1A1714;padding:12px 28px;font-family:${M};font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#F8F5EE;">Docket Dispatch</td></tr>
<tr><td style="padding:28px;font-family:${F};font-size:15px;line-height:1.6;color:#2E2822;">${inner}</td></tr>
<tr><td style="padding:16px 28px 24px;border-top:1px solid #E2DBCE;font-family:${F};font-size:12px;line-height:1.6;color:#736B5E;">
You are receiving this because you subscribed at docudocket.live.<br>
<a href="${SITE}/privacy/" style="color:#736B5E;">Privacy</a> &middot; <a href="${esc(manageUrl)}" style="color:#736B5E;">Manage or cancel your subscription</a>${postal ? `<br>Docket Dispatch &middot; ${esc(postal)}` : ''}
</td></tr></table></td></tr></table></body></html>`;
}

function textFooter() {
  const { manageUrl, postal } = footerVars();
  return `\n--\nYou are receiving this because you subscribed at docudocket.live.\nPrivacy: ${SITE}/privacy/\nManage or cancel your subscription: ${manageUrl}${postal ? `\nDocket Dispatch · ${postal}` : ''}\n`;
}

const firstName = (name) => (String(name || '').trim().split(/\s+/)[0] || 'there');

// ---- Mail 0: welcome, sent the moment a subscription becomes active ----
export function renderWelcome({ name, plan, firstIssue }) {
  const first = firstName(name);
  const planLine = plan && plan.name ? ` You chose the ${plan.name} plan, ${plan.price}.` : '';
  const annualText = plan && plan.annual
    ? `\nTELL US WHAT TO TRACK\nOn the Annual plan you can ask us to look at funders we don't cover yet. Reply to this email with the funder, foundation or state arts grant you have in mind, and we will reply to say whether it will be added.\n`
    : '';
  const annualHtml = plan && plan.annual
    ? h('Tell us what to track') + p('On the Annual plan you can ask us to look at funders we don&rsquo;t cover yet. Reply to this email with the funder, foundation or state arts grant you have in mind, and we will reply to say whether it will be added.')
    : '';
  const subject = "You're in. Here's what Docket sends and when";
  const preheader = "One issue a month, every listing linked to the funder's own page.";
  const text = `Welcome, ${first}. You're in.

Thanks for subscribing to Docket Dispatch.${planLine}

YOUR FIRST ISSUE
${firstIssue}
After that, one issue a month, on the first Tuesday. In your first two weeks you will also get two short notes: one on how to read a listing, and one asking what you would like us to add.

WHAT EACH LISTING SHOWS
Every entry gives you the funder, the amount, the stage, the deadline, who can apply, the date we last read the funder's page, and a link to the funder's own page.

If a funder's page doesn't say something, we write "not stated" and don't guess. Dates change, so check the funder's page before you apply. That is why every listing links straight to it.
${annualText}
SPOTTED A MISTAKE?
Reply to this email. We will look into it and note the fix in the next issue.

YOUR SUBSCRIPTION
Your payment receipt comes separately from our payment provider, Dodo Payments. You can cancel at any time and keep access until the end of the period you have paid for. We don't offer refunds except for billing errors.

Glad to have you,
Rehan Khodaiji
Docket Dispatch
${textFooter()}`;
  const html = wrap({
    title: subject, preheader,
    inner:
      `<h1 style="margin:0 0 14px;font-family:${S};font-size:26px;line-height:1.25;color:#1A1714;">Welcome, ${esc(first)}. You&rsquo;re in.</h1>` +
      p(`Thanks for subscribing to Docket Dispatch.${esc(planLine)}`) +
      h('Your first issue') +
      `<p style="margin:0 0 6px;font-family:${S};font-size:18px;color:#1A1714;"><strong>${esc(firstIssue)}</strong></p>` +
      p('After that, one issue a month, on the first Tuesday. In your first two weeks you will also get two short notes: one on how to read a listing, and one asking what you would like us to add.') +
      h('What each listing shows') +
      p('Every entry gives you the funder, the amount, the stage, the deadline, who can apply, the date we last read the funder&rsquo;s page, and a link to the funder&rsquo;s own page.') +
      p('If a funder&rsquo;s page doesn&rsquo;t say something, we write &ldquo;not stated&rdquo; and don&rsquo;t guess. Dates change, so check the funder&rsquo;s page before you apply. That is why every listing links straight to it.') +
      annualHtml +
      h('Spotted a mistake?') +
      p('Reply to this email. We will look into it and note the fix in the next issue.') +
      h('Your subscription') +
      p('Your payment receipt comes separately from our payment provider, Dodo Payments. You can cancel at any time and keep access until the end of the period you have paid for. We don&rsquo;t offer refunds except for billing errors.') +
      p('Glad to have you,<br>Rehan Khodaiji<br>Docket Dispatch'),
  });
  return { subject, preheader, text, html };
}

// ---- Mail 1: two days after joining ----
export function renderHowToRead({ name }) {
  const first = firstName(name);
  const subject = 'How to read a Docket listing in two minutes';
  const preheader = 'Four habits that keep you from missing a date or a rule.';
  const text = `Hi ${first},

A listing is only useful if you can trust its dates. Here is how to read one, in four steps.

1. START WITH "WHO CAN APPLY"
Many calls are limited by country, residency, company type or project stage. We quote the funder's own wording. If the funder's page doesn't say, we write "not stated". Treat that as a reason to ask the funder, not as a yes.

2. READ THE DEADLINE WITH ITS YEAR AND TIME ZONE
Funder pages often give a time without a zone, or a date without a year. We print what the page says and tell you when it is silent. Put the full date and the zone in your calendar.

3. LOOK AT THE "CHECKED" DATE
Every listing shows the day we last read the funder's page. Pages change after that, so the newer the date, the safer the listing.

4. OPEN THE FUNDER'S PAGE BEFORE YOU SPEND A WEEKEND
Each listing links to the official page. Read the guidelines there before you start an application.

We write up the gaps we keep finding on funder pages here: ${SITE}/blog/

Rehan Khodaiji
Docket Dispatch
${textFooter()}`;
  const li = (title, body) => `<p style="margin:0 0 14px;"><strong style="color:#1A1714;">${title}</strong><br>${body}</p>`;
  const html = wrap({
    title: subject, preheader,
    inner:
      p(`Hi ${esc(first)},`) +
      p('A listing is only useful if you can trust its dates. Here is how to read one, in four steps.') +
      li('1. Start with &ldquo;Who can apply&rdquo;', 'Many calls are limited by country, residency, company type or project stage. We quote the funder&rsquo;s own wording. If the funder&rsquo;s page doesn&rsquo;t say, we write &ldquo;not stated&rdquo;. Treat that as a reason to ask the funder, not as a yes.') +
      li('2. Read the deadline with its year and time zone', 'Funder pages often give a time without a zone, or a date without a year. We print what the page says and tell you when it is silent. Put the full date and the zone in your calendar.') +
      li('3. Look at the &ldquo;Checked&rdquo; date', 'Every listing shows the day we last read the funder&rsquo;s page. Pages change after that, so the newer the date, the safer the listing.') +
      li('4. Open the funder&rsquo;s page before you spend a weekend', 'Each listing links to the official page. Read the guidelines there before you start an application.') +
      p(`We write up the gaps we keep finding on funder pages here: <a href="${SITE}/blog/" style="color:#0D4952;">${SITE.replace('https://', '')}/blog/</a>`) +
      p('Rehan Khodaiji<br>Docket Dispatch'),
  });
  return { subject, preheader, text, html };
}

// ---- Mail 3: ten days after joining ----
export function renderCheckIn({ name, plan, nextIssue }) {
  const first = firstName(name);
  const subject = 'Anything wrong, or a funder we should add?';
  const preheader = 'Two quick things before your next issue.';
  const annualText = plan && plan.annual ? ' On your Annual plan, name a funder, foundation or state arts grant you would like us to cover, and we will reply to say whether it will be added.' : '';
  const text = `Hi ${first},

Your next issue arrives on ${nextIssue}. Before it goes out, two quick things.

1. Spotted a wrong date, a broken link or a listing that doesn't fit? Reply with the funder's name and what you saw. We check the funder's own page and note the fix in the next issue.

2. Tell us what you are applying to this season. One line is enough. It helps us decide which funders to read next.${annualText}

Reply to this email. It comes straight to us.

Rehan Khodaiji
Docket Dispatch
${textFooter()}`;
  const html = wrap({
    title: subject, preheader,
    inner:
      p(`Hi ${esc(first)},`) +
      p(`Your next issue arrives on <strong>${esc(nextIssue)}</strong>. Before it goes out, two quick things.`) +
      p('<strong style="color:#1A1714;">1.</strong> Spotted a wrong date, a broken link or a listing that doesn&rsquo;t fit? Reply with the funder&rsquo;s name and what you saw. We check the funder&rsquo;s own page and note the fix in the next issue.') +
      p(`<strong style="color:#1A1714;">2.</strong> Tell us what you are applying to this season. One line is enough. It helps us decide which funders to read next.${esc(annualText)}`) +
      p('Reply to this email. It comes straight to us.') +
      p('Rehan Khodaiji<br>Docket Dispatch'),
  });
  return { subject, preheader, text, html };
}
