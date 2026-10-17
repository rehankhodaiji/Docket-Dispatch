// Builds one monthly Docket issue (HTML and plain text) from a JSON file, using ONE fixed template.
// Run: node build_issue.cjs issues/issue-001.json
// Output: ../public/project/emails/issue-NNN.html and .txt
// The script refuses to build an issue that breaks the standard (see LIMITS and checks below).
const fs = require('fs');
const path = require('path');

// ---- The standard (change here, and every issue follows) ----
const SECTIONS = [
  { id: 'closing',  title: 'Closing soon',        hint: 'Deadline within 21 days of the send date' },
  { id: 'open',     title: 'Open now',            hint: 'Open, or rolling with no deadline' },
  { id: 'soon',     title: 'Opening soon',        hint: 'Opens within 60 days' },
  { id: 'calendar', title: 'On the calendar',     hint: 'Dated, more than 60 days away' },
  { id: 'watch',    title: 'Watchlist',           hint: 'No date yet. Names the funder so you can keep an eye on it' },
];
const LIMITS = { mainTotal: 12, watch: 3, closed: 5, staleDays: 7 }; // main = closing + open + soon + calendar
const CARD_FIELDS = ['funder', 'program', 'region', 'stage', 'amount', 'deadline', 'who', 'apply', 'page', 'checked', 'state'];

const file = process.argv[2];
if (!file) { console.error('Usage: node build_issue.cjs issues/issue-001.json'); process.exit(1); }
const issue = JSON.parse(fs.readFileSync(path.resolve(__dirname, file), 'utf8').replace(/^\uFEFF/, ''));

// ---- Checks ----
const problems = [];
const warnings = [];
for (const l of issue.listings) {
  for (const f of CARD_FIELDS) if (!l[f] || !String(l[f]).trim()) problems.push(`${l.funder || '(no funder)'}: missing "${f}"`);
  if (!/^https:\/\//.test(l.apply || '')) problems.push(`${l.funder}: apply link must start with https://`);
  if (!SECTIONS.find((s) => s.id === l.section)) problems.push(`${l.funder}: unknown section "${l.section}"`);
  if (l.checked === 'not read' || /not read/i.test(l.state)) warnings.push(`${l.funder}: not read on the funder's page. Move to the watchlist or read it before sending.`);
  else {
    const age = (new Date(issue.sendDate) - new Date(l.checked)) / 86400000;
    if (age > LIMITS.staleDays) warnings.push(`${l.funder}: page was read ${Math.round(age)} days before the send date (limit ${LIMITS.staleDays}). Read it again.`);
  }
}
const count = (id) => issue.listings.filter((l) => l.section === id).length;
const main = issue.listings.filter((l) => l.section !== 'watch').length;
if (main > LIMITS.mainTotal) problems.push(`${main} main listings. The limit is ${LIMITS.mainTotal}.`);
if (count('watch') > LIMITS.watch) problems.push(`${count('watch')} watchlist items. The limit is ${LIMITS.watch}.`);
if ((issue.closed || []).length > LIMITS.closed) problems.push(`${issue.closed.length} recently closed names. The limit is ${LIMITS.closed}.`);
if (problems.length) { console.error('Issue does NOT meet the standard:\n - ' + problems.join('\n - ')); process.exit(2); }

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const nn = String(issue.issueNumber).padStart(3, '0');
const subject = `Docket · ${issue.month}: ${main} calls to watch`;
const preheader = 'Open and upcoming documentary funding calls, each linked to the funder\'s own page.';

// ---- HTML ----
const F = "Arial,Helvetica,sans-serif", S = "Georgia,'Times New Roman',serif", M = "'Courier New',monospace";
function card(l) {
  const row = (k, v) => `<tr><td style="padding:2px 10px 2px 0;width:92px;vertical-align:top;font-family:${M};font-size:11px;letter-spacing:.5px;text-transform:uppercase;color:#736B5E;">${k}</td><td style="padding:2px 0;font-family:${F};font-size:14px;line-height:1.5;color:#2E2822;">${v}</td></tr>`;
  return `
  <tr><td class="pad" style="padding:14px 32px;border-top:1px solid #E2DBCE;">
    <div style="font-family:${S};font-size:18px;line-height:1.3;color:#1A1714;font-weight:bold;">${esc(l.funder)}: ${esc(l.program)}</div>
    <div style="font-family:${M};font-size:11px;letter-spacing:.5px;text-transform:uppercase;color:#0D4952;padding:3px 0 6px;">${esc(l.region)} · ${esc(l.stage)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${row('Amount', esc(l.amount))}
      ${row('Deadline', '<strong>' + esc(l.deadline) + '</strong>')}
      ${row('Who can apply', esc(l.who))}
      ${row('Apply', `<a href="${esc(l.apply)}" style="color:#0D4952;">${esc(l.apply.replace(/^https:\/\//, ''))}</a>`)}
      ${l.note ? row('Note', esc(l.note)) : ''}
    </table>
    <div style="font-family:${F};font-size:12px;color:#736B5E;padding-top:6px;">Page read ${esc(l.checked)} · ${esc(l.state)}</div>
  </td></tr>`;
}
function section(s) {
  const items = issue.listings.filter((l) => l.section === s.id);
  if (!items.length) return '';
  return `
  <tr><td class="pad" style="padding:18px 32px 6px;">
    <div style="font-family:${M};font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#C86A14;font-weight:bold;">${esc(s.title)} · ${items.length}</div>
    <div style="font-family:${F};font-size:12px;color:#736B5E;">${esc(s.hint)}</div>
  </td></tr>${items.map(card).join('')}`;
}
const closedBlock = (issue.closed && issue.closed.length) ? `
  <tr><td class="pad" style="padding:18px 32px 6px;border-top:1px solid #E2DBCE;">
    <div style="font-family:${M};font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#736B5E;font-weight:bold;">Recently closed, so you don't chase them</div>
    <ul style="margin:6px 0 0;padding-left:18px;font-family:${F};font-size:14px;line-height:1.6;color:#5D564C;">${issue.closed.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
  </td></tr>` : '';

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(subject)}</title>
<!-- Generated by emails/build_issue.js from ${esc(file)}. Do not edit by hand: change the JSON and rebuild.
     Subject: ${esc(subject)}
     Placeholders to fill in your sending tool: {{unsubscribe_url}}  {{postal_address}} -->
<style>body{margin:0;background:#F8F5EE}a{color:#0D4952}@media (max-width:620px){.wrap{width:100%!important}.pad{padding-left:18px!important;padding-right:18px!important}}</style>
</head><body style="margin:0;background:#F8F5EE;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#F8F5EE;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8F5EE;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:#FFFFFF;border:1px solid #E2DBCE;">
${issue.status ? `<tr><td style="padding:8px 32px;background:#FBF2E5;font-family:${F};font-size:12px;color:#6F4108;">${esc(issue.status)}</td></tr>` : ''}
<tr><td class="pad" style="padding:26px 32px 16px;border-bottom:3px solid #0D4952;">
  <div style="font-family:${S};font-size:30px;font-weight:bold;color:#1A1714;">Docket</div>
  <div style="font-family:${M};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#736B5E;padding-top:4px;">The Docket Dispatch · Issue ${nn} · ${esc(issue.month)}</div>
</td></tr>
<tr><td class="pad" style="padding:22px 32px 6px;font-family:${F};font-size:16px;line-height:1.65;color:#2E2822;">
  <p style="margin:0 0 12px;">${esc(issue.intro)}</p>
  <table role="presentation" cellpadding="0" cellspacing="0" style="border:1px solid #E2DBCE;background:#F8F5EE;width:100%;"><tr><td style="padding:10px 14px;font-family:${M};font-size:12px;line-height:1.7;color:#4A443B;">
    ${SECTIONS.map((s) => `${esc(s.title)}: <strong>${count(s.id)}</strong>`).join(' &nbsp;·&nbsp; ')}
  </td></tr></table>
</td></tr>
${SECTIONS.map(section).join('')}
${closedBlock}
<tr><td class="pad" style="padding:16px 32px;border-top:1px solid #E2DBCE;font-family:${F};font-size:14px;line-height:1.6;color:#4A443B;">
  <strong>Corrections:</strong> ${esc(issue.corrections || 'None this issue.')}<br>
  <strong>Dates change.</strong> Check the funder's own page before you apply. Spot a mistake? Reply to this email.
</td></tr>
<tr><td class="pad" style="padding:16px 32px;background:#F3EFE6;border-top:1px solid #E2DBCE;font-family:${F};font-size:12px;line-height:1.6;color:#736B5E;">
  <a href="https://www.docudocket.live/privacy/" style="color:#736B5E;">Privacy</a> · <a href="{{unsubscribe_url}}" style="color:#736B5E;">Unsubscribe</a><br>Docket Dispatch · {{postal_address}}
</td></tr>
</table></td></tr></table></body></html>`;

// ---- Plain text ----
const text = [
  `Subject: ${subject}`, `Preheader: ${preheader}`, '',
  `DOCKET · Issue ${nn} · ${issue.month}`, issue.status ? `(${issue.status})` : '', '', issue.intro, '',
  ...SECTIONS.flatMap((s) => {
    const items = issue.listings.filter((l) => l.section === s.id);
    if (!items.length) return [];
    return [`== ${s.title.toUpperCase()} (${items.length}) ==`, `${s.hint}`, '', ...items.flatMap((l) => [
      `${l.funder}: ${l.program}`, `${l.region} · ${l.stage}`, `Amount: ${l.amount}`, `Deadline: ${l.deadline}`, `Who can apply: ${l.who}`, `Apply: ${l.apply}`,
      ...(l.note ? [`Note: ${l.note}`] : []), `Page read ${l.checked} · ${l.state}`, '']),];
  }),
  ...(issue.closed && issue.closed.length ? ['== RECENTLY CLOSED ==', ...issue.closed.map((c) => `- ${c}`), ''] : []),
  `Corrections: ${issue.corrections || 'None this issue.'}`,
  "Dates change. Check the funder's own page before you apply. Spot a mistake? Reply to this email.", '',
  '--', 'Privacy: https://www.docudocket.live/privacy/', 'Unsubscribe: {{unsubscribe_url}}', 'Docket Dispatch · {{postal_address}}',
].join('\n');

const outDir = path.resolve(__dirname, '..', 'public', 'project', 'emails');
fs.mkdirSync(outDir, { recursive: true });
// Encode every non-ASCII character as an HTML entity so no mail app or browser can mis-read the encoding
const asciiHtml = html.replace(/[^\x00-\x7F]/g, (c) => '&#' + c.codePointAt(0) + ';');
fs.writeFileSync(path.join(outDir, `issue-${nn}.html`), asciiHtml);
fs.writeFileSync(path.join(outDir, `issue-${nn}.txt`), text);
console.log(`Built issue ${nn}: ${main} main listings (${SECTIONS.map((s) => s.id + '=' + count(s.id)).join(', ')}), ${(issue.closed || []).length} closed names.`);
if (warnings.length) console.log('\nBefore sending, fix these:\n - ' + warnings.join('\n - '));


