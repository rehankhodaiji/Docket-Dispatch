// Mechanical audit of a post: hard gates (BLOCK), warnings (WARN), a quality score and
// virality proxies. The reviewer agent adds the judgment calls (see RUBRIC.md).
// Usage: node social/audit.cjs <post-name>        writes the result into the post JSON
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const root = path.join(dir, '..');
const name = process.argv[2];
if (!name) { console.error('Usage: node social/audit.cjs <post-name>'); process.exit(1); }
const file = path.join(dir, 'posts', name + '.json');
const post = JSON.parse(fs.readFileSync(file, 'utf8').replace(/^ï»¿/, ''));
const cfg = JSON.parse(fs.readFileSync(path.join(dir, 'config.json'), 'utf8').replace(/^ï»¿/, ''));
const issues = [];
const add = (sev, code, msg) => issues.push({ sev, code, msg });

const slideText = s => ['kicker', 'h1', 'h2', 'big', 'lab', 'sub', 'tag', 'fix', 'url']
  .map(k => s[k] || '').concat((s.items || []).map(i => typeof i === 'string' ? i : [i.b, i.rest, i.span].filter(Boolean).join(' '))).join(' ');
const words = t => (t.match(/\S+/g) || []).length;
const slides = post.slides || [];
const caps = post.captions || {};
const allText = slides.map(slideText).concat(Object.values(caps)).join('\n');

// 1. Banned patterns (copywriting rules)
const BANNED = [
  [/â€”/, 'em dash'], [/it['â€™]s not\b/i, '"it\'s not X" reveal'], [/\bnot just\b/i, '"not just"'],
  [/here['â€™]s the thing/i, '"here\'s the thing"'], [/in today['â€™]s/i, '"in today\'s"'],
  [/\bunlock/i, '"unlock"'], [/\bseamless/i, '"seamless"'], [/\brobust\b/i, '"robust"'], [/\bdelve\b/i, '"delve"'],
  [/game.?changer/i, '"game changer"'], [/whether you['â€™]re/i, '"whether you\'re"'], [/say goodbye/i, '"say goodbye"'],
  [/\bleverage\b/i, '"leverage"'], [/\bthe result\?/i, 'self-answered question'], [/\bthe best part:/i, 'colon reveal'],
  [/\p{Extended_Pictographic}/u, 'emoji (brand has none)']];
for (const [re, label] of BANNED) if (re.test(allText)) add('BLOCK', 'copy', 'Banned pattern: ' + label);
if (/!/.test(allText)) add('WARN', 'copy', 'Exclamation mark');

// 2. Channel limits
for (const [ch, text] of Object.entries(caps)) {
  const n = text.length;
  if (/^(X|Bluesky)$/.test(ch) && n > 300) add('BLOCK', 'limit', `${ch} caption is ${n} characters (max 300)`);
  if (ch === 'LinkedIn') {
    if (n > 3000) add('BLOCK', 'limit', `LinkedIn caption is ${n} characters (max 3000)`);
    else if (n < 600 || n > 1300) add('WARN', 'limit', `LinkedIn caption is ${n} characters (aim 600 to 1300)`);
  }
  if (ch === 'Instagram') {
    if (/https?:\/\/|www\./i.test(text)) add('BLOCK', 'limit', 'Instagram caption contains a URL (not clickable)');
    if (!/link in bio\.?$/i.test(text.trim())) add('WARN', 'limit', 'Instagram caption should end "Link in bio."');
  }
}
for (const ch of post.channels || []) if (!caps[ch]) add('BLOCK', 'limit', `No caption for channel ${ch}`);

// 3. Slide structure
if (slides.length > 8) add('BLOCK', 'slides', `${slides.length} slides (max 8)`);
else if (slides.length < 5) add('WARN', 'slides', `${slides.length} slides (aim 5 to 8)`);
slides.forEach((s, i) => {
  const w = words(slideText(s));
  if (w > 60) add('BLOCK', 'slides', `Slide ${i + 1} has ${w} words (max 60)`);
  else if (w > 45) add('WARN', 'slides', `Slide ${i + 1} has ${w} words (aim under 45)`);
  const t = (s.h1 || s.h2 || '');
  if (words(t) > 12) add('WARN', 'slides', `Slide ${i + 1} title is ${words(t)} words (aim under 12)`);
});

// 4. Links: only pages that exist and are live on the post date
const slugs = {};
for (const f of fs.readdirSync(path.join(root, 'blog', 'posts')).filter(f => f.endsWith('.md'))) {
  const t = fs.readFileSync(path.join(root, 'blog', 'posts', f), 'utf8');
  const slug = (t.match(/^slug:\s*(.+)$/m) || [])[1], date = (t.match(/^date:\s*(.+)$/m) || [])[1];
  if (slug) slugs[slug.trim()] = (date || '').trim();
}
const STATIC = ['/', '/blog/', '/terms/', '/privacy/', '/refunds/'];
const urls = (allText.match(/(?:https?:\/\/)?(?:www\.)?docudocket\.live[^\s)"']*/gi) || []);
for (const u of new Set(urls)) {
  const p = ('/' + u.replace(/^(?:https?:\/\/)?(?:www\.)?docudocket\.live/i, '').replace(/^\//, '')).replace(/[.,]$/, '');
  const m = p.match(/^\/blog\/([^/]+)\/?$/);
  if (m) {
    if (!(m[1] in slugs)) add('BLOCK', 'link', `Blog link to unknown post: ${u}`);
    else if (post.postDate && slugs[m[1]] > post.postDate) add('BLOCK', 'link', `Blog post ${m[1]} goes live ${slugs[m[1]]}, after the post date ${post.postDate}`);
  } else if (!STATIC.includes(p.endsWith('/') || p === '/' ? p : p + '/')) add('BLOCK', 'link', `Link to a page that does not exist: ${u}`);
}

// 5. Sign-up call to action only when signup works
if (!cfg.signupLive && /\b(sign up|subscribe|join the (waitlist|list)|start your (free )?(trial|subscription))\b/i.test(allText))
  add('BLOCK', 'cta', 'Sign-up call to action while signup is not live (social/config.json signupLive is false)');

// 6. Fact trace: every fact needs a funder URL, a read date, and the post's dates must appear in the evidence
const facts = post.facts || [];
if (!facts.length) add('BLOCK', 'facts', 'No facts listed. Each claim needs a funder page URL, read date and evidence.');
const day = s => Date.parse(s + 'T00:00:00Z');
let oldest = null;
for (const f of facts) {
  if (!f.url || !/^https?:\/\//.test(f.url)) add('BLOCK', 'facts', `Fact without a funder URL: "${f.claim}"`);
  if (!f.read) { add('BLOCK', 'facts', `Fact without a read date: "${f.claim}"`); continue; }
  if (!f.evidence) add('BLOCK', 'facts', `Fact without evidence text: "${f.claim}"`);
  if (!oldest || f.read < oldest) oldest = f.read;
  if (post.postDate) {
    const age = Math.round((day(post.postDate) - day(f.read)) / 864e5);
    if (age > 7) add('BLOCK', 'stale', `"${f.claim}" was read ${age} days before the post date (limit 7). Re-read the page.`);
  }
}
if (oldest && post.readDate) {
  const d = new Date(day(oldest));
  const label = `${d.getUTCDate()} ${d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })} ${d.getUTCFullYear()}`;
  if (label !== post.readDate) add('BLOCK', 'stale', `Slide footer says "${post.readDate}" but the oldest read date is ${label}`);
}
const norm = s => s.toLowerCase().replace(/\s+/g, '').replace(/(\d)(st|nd|rd|th)/g, '$1');
const MON = 'jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec';
const readTxt = facts.filter(f => f.read).map(f => { const d = new Date(day(f.read)); return d.getUTCDate() + ' ' + d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }); }).join(' ');
const evid = norm(facts.map(f => f.evidence || '').concat(readTxt).join(' ')).replace(new RegExp(`(\\d{1,2})(${MON})[a-z]*`, 'g'), '$1$2');
const tokens = new Set();
for (const re of [new RegExp(`\\b\\d{1,2}(?:st|nd|rd|th)?\\s+(?:${MON})[a-z]*`, 'gi'), /\b\d{1,2}(?::\d{2})?\s?(?:am|pm)\b/gi, /\b\d{2}:\d{2}\b/g,
  /CHF\s?\d+/g, /[Â£$â‚¬]\s?[\d,.]+(?:\s?(?:million|m))?/gi, /\b\d{2,3}\s?(?:minutes|min)\b/gi])
  for (const m of allText.match(re) || []) tokens.add(m);
for (const t of tokens) {
  let n = norm(t).replace(new RegExp(`(\\d{1,2})(${MON})[a-z]*`), '$1$2');
  if (!evid.includes(n)) add('BLOCK', 'trace', `"${t}" appears in the post but not in any fact's evidence`);
}

// Scores
const blocks = issues.filter(i => i.sev === 'BLOCK').length, warns = issues.filter(i => i.sev === 'WARN').length;
const quality = Math.max(0, 100 - blocks * 25 - warns * 5);
const hook = (post.channels || []).includes('LinkedIn') ? (caps.LinkedIn || '').split('\n')[0] : Object.values(caps)[0] || '';
const cover = slides[0] || {};
const coverTitle = cover.h1 || cover.h2 || '';
const prox = [
  ['Cover headline is 12 words or fewer', words(coverTitle) > 0 && words(coverTitle) <= 12, 15],
  ['Cover or first caption line contains a number', /\d|\b(one|two|three|four|five|six|seven|eight|nine|ten)\b/i.test(coverTitle + hook), 15],
  ['Names the audience in the hook (US, producers, filmmakers, documentary)', /\b(US|producers?|filmmakers?|documentary)\b/i.test(coverTitle + hook), 10],
  ['First caption line is 140 characters or fewer', hook.length > 0 && hook.length <= 140, 10],
  ['5 to 8 slides', slides.length >= 5 && slides.length <= 8, 10],
  ['Has a save-worthy slide (checklist, table or "Do this")', slides.some(s => s.fix || (s.items && s.items.length >= 3)), 15],
  ['Closing slide has a single link or handle', slides.length > 0 && !!(slides[slides.length - 1].url), 10],
  ['At most one link per caption', Object.values(caps).every(c => (c.match(/https?:\/\//g) || []).length <= 1), 15]];
const viralityProxy = prox.reduce((a, [, ok, pts]) => a + (ok ? pts : 0), 0);

const verdict = blocks ? 'BLOCK' : (quality >= 80 && viralityProxy >= 60 ? 'PASS' : 'REVISE');
post.audit = { when: new Date().toISOString(), verdict, quality, viralityProxy, issues, proxies: prox.map(([k, ok, pts]) => ({ k, ok, pts })) };
if (!['approved', 'scheduled', 'posted'].includes(post.status)) post.status = blocks ? 'drafted' : 'audited';
fs.writeFileSync(file, JSON.stringify(post, null, 2) + '\n', 'utf8');

console.log(`${name}: ${verdict}   quality ${quality}/100   virality proxies ${viralityProxy}/100`);
for (const i of issues) console.log(`  ${i.sev.padEnd(5)} [${i.code}] ${i.msg}`);
for (const p of post.audit.proxies) console.log(`  ${p.ok ? 'yes' : 'NO '} (${p.pts}) ${p.k}`);
process.exit(blocks ? 2 : 0);


