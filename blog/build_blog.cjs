// Builds the Docket blog from Markdown files in blog/posts/ into static HTML under public/.
// Runs automatically before every site build (npm run build). Run by hand with: node blog/build_blog.cjs
//
// Writes:  public/blog/index.html, public/blog/<slug>/index.html, public/sitemap.xml, public/robots.txt, public/rss.xml
// A post appears once its "date" is today or earlier (UTC). Set BLOG_PREVIEW_ALL=1 to include future posts for a local preview.
// Bad posts are skipped with a message. Style problems only print warnings, so a draft can never break the whole site deploy.
const fs = require('fs');
const path = require('path');

const SITE = 'https://www.docudocket.live';
const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(__dirname, 'posts');
const OUT = path.join(ROOT, 'public');
const TODAY = new Date().toISOString().slice(0, 10);
const PREVIEW = process.env.BLOG_PREVIEW_ALL === '1';
const STALE_DAYS = 7; // facts_checked must be within this many days of the publish date

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const nice = (iso) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const rfc822 = (iso) => new Date(iso + 'T09:00:00Z').toUTCString();

// ---------- tiny Markdown subset: ## ### paragraphs, - lists, 1. lists, | tables |, [text](url), **bold** ----------
function inline(text) {
  let t = esc(text);
  t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g, (_, label, url) => {
    const ext = /^https?:/.test(url) && !url.startsWith(SITE);
    return `<a href="${url}"${ext ? ' target="_blank" rel="noopener"' : ''}>${label}</a>`;
  });
  return t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}
function markdown(src) {
  const lines = src.replace(/\r/g, '').split('\n');
  const out = []; let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    let m;
    if ((m = /^(#{2,3})\s+(.+)$/.exec(l))) { const n = m[1].length; out.push(`<h${n} id="${m[2].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}">${inline(m[2])}</h${n}>`); i++; continue; }
    if (/^\|/.test(l)) {
      const rows = []; while (i < lines.length && /^\|/.test(lines[i])) { rows.push(lines[i]); i++; }
      const cells = (r) => r.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const head = cells(rows[0]); const body = rows.slice(2).map(cells);
      out.push(`<div class="tablewrap"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }
    if (/^[-*]\s+/.test(l)) { const items = []; while (i < lines.length && /^[-*]\s+/.test(lines[i])) { items.push(lines[i].replace(/^[-*]\s+/, '')); i++; } out.push(`<ul>${items.map((x) => `<li>${inline(x)}</li>`).join('')}</ul>`); continue; }
    if (/^\d+\.\s+/.test(l)) { const items = []; while (i < lines.length && /^\d+\.\s+/.test(lines[i])) { items.push(lines[i].replace(/^\d+\.\s+/, '')); i++; } out.push(`<ol>${items.map((x) => `<li>${inline(x)}</li>`).join('')}</ol>`); continue; }
    const para = []; while (i < lines.length && lines[i].trim() && !/^(#{2,3}\s|\||[-*]\s|\d+\.\s)/.test(lines[i])) { para.push(lines[i]); i++; }
    out.push(`<p>${inline(para.join(' '))}</p>`);
  }
  return out.join('\n');
}
function parsePost(file) {
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8').replace(/^﻿/, '');
  const m = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw.replace(/\r/g, ''));
  if (!m) return { file, error: 'no front matter block between --- lines' };
  const meta = {}; for (const line of m[1].split('\n')) { const k = /^([a-z_]+):\s*(.*)$/.exec(line); if (k) meta[k[1]] = k[2].trim(); }
  return { file, meta, body: m[2].trim() };
}

// ---------- checks ----------
const BANNED = [/—/, /\bit['’]s not\b/i, /\bnot just\b/i, /here['’]s the thing/i, /in today['’]s/i, /\bunlock/i, /seamless/i, /\brobust\b/i, /\bdelve/i, /game.?changer/i, /whether you['’]re/i, /say goodbye/i, /\bleverage\b/i];
const problems = []; const warnings = [];
const posts = [];
for (const f of fs.readdirSync(POSTS_DIR).filter((x) => x.endsWith('.md')).sort()) {
  const p = parsePost(f);
  if (p.error) { problems.push(`${f}: ${p.error}`); continue; }
  const need = ['title', 'description', 'slug', 'date', 'facts_checked'];
  const miss = need.filter((k) => !p.meta[k]);
  if (miss.length) { problems.push(`${f}: missing ${miss.join(', ')}`); continue; }
  if (!/^[a-z0-9-]+$/.test(p.meta.slug)) { problems.push(`${f}: slug must be lowercase letters, numbers and hyphens`); continue; }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(p.meta.date) || !/^\d{4}-\d{2}-\d{2}$/.test(p.meta.facts_checked)) { problems.push(`${f}: dates must look like 2026-10-29`); continue; }
  const w = [];
  if (p.meta.title.length > 60) w.push(`title is ${p.meta.title.length} characters (aim for 60 or fewer)`);
  if (p.meta.description.length > 160 || p.meta.description.length < 110) w.push(`description is ${p.meta.description.length} characters (aim for 110 to 160)`);
  const age = (new Date(p.meta.date) - new Date(p.meta.facts_checked)) / 86400000;
  if (age > STALE_DAYS) w.push(`facts were checked ${Math.round(age)} days before the publish date (limit ${STALE_DAYS}). Read the funder pages again and update facts_checked`);
  for (const re of BANNED) if (re.test(p.body) || re.test(p.meta.title) || re.test(p.meta.description)) w.push(`style: matches banned pattern ${re}`);
  if (w.length) warnings.push(`${f} (${p.meta.date}): ` + w.join('; '));
  posts.push(p);
}
const live = posts.filter((p) => PREVIEW || p.meta.date <= TODAY).sort((a, b) => b.meta.date.localeCompare(a.meta.date));
const scheduled = posts.filter((p) => !live.includes(p)).sort((a, b) => a.meta.date.localeCompare(b.meta.date));

// ---------- page shell ----------
const css = `
.wrap{max-width:740px;margin-inline:auto;padding:44px 16px 80px}
.kicker{font:500 11px var(--mono);letter-spacing:.14em;text-transform:uppercase;color:#C86A14}
h1{font-size:clamp(30px,5.6vw,44px);line-height:1.1;margin:10px 0 12px;text-wrap:balance}
h2{font-size:26px;margin:34px 0 8px} h3{font-family:var(--display);font-size:20px;margin:24px 0 6px}
p,li{font-size:17px;line-height:1.75;color:#3A352F;margin:0 0 14px} ul,ol{margin:0 0 14px;padding-left:24px}
.meta{font:500 12px var(--mono);letter-spacing:.06em;color:#736B5E;margin-bottom:22px}
.checked{background:#E8F2F3;border-left:4px solid #0D4952;padding:12px 16px;margin:18px 0;font-size:15px}
.checked p{margin:0;font-size:15px}
.tablewrap{overflow-x:auto;border:1px solid #E2DBCE;background:#fff;margin:14px 0 20px}
table{border-collapse:collapse;width:100%;font-size:14.5px;min-width:560px}
th,td{text-align:left;padding:9px 12px;border-bottom:1px solid #E2DBCE;vertical-align:top;line-height:1.5}
th{font:500 11px var(--mono);letter-spacing:.06em;text-transform:uppercase;color:#736B5E;background:#F8F5EE}
tr:last-child td{border-bottom:0}
.cta{border:2px solid #1A1714;background:#FAF8F3;padding:20px 22px;margin:40px 0 8px}
.cta h2{margin:0 0 6px;font-size:22px} .cta p{margin:0 0 12px}
.btn{display:inline-block;background:#0D4952;color:#fff;text-decoration:none;font:600 12px var(--mono);letter-spacing:.08em;text-transform:uppercase;padding:12px 18px}
.btn:hover{background:#073339}
.list{list-style:none;padding:0;margin:20px 0;border-top:1px solid #E2DBCE}
.list li{border-bottom:1px solid #E2DBCE;padding:16px 0;margin:0}
.list a.t{font:600 22px/1.3 var(--display);color:#1A1714;text-decoration:none}.list a.t:hover{color:#0D4952}
.list .d{display:block;margin:4px 0 0;font-size:15.5px;color:#5D564C}
.list .when{font:500 11px var(--mono);letter-spacing:.08em;color:#736B5E;text-transform:uppercase}
.sources{font-size:14.5px}.sources li{font-size:14.5px;margin-bottom:6px;line-height:1.55}`;
function shell({ title, description, canonical, body, jsonld, type = 'website' }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<link rel="alternate" type="application/rss+xml" title="Docket Dispatch" href="${SITE}/rss.xml">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:site_name" content="Docket Dispatch">
<meta property="og:type" content="${type}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta name="twitter:card" content="summary">
<link rel="stylesheet" href="/project/theme.css">
<style>${css}</style>
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body>
<nav class="topbar" aria-label="Site"><span><a href="/">The Docket Dispatch</a><span class="sep">/</span><a href="/blog/">Blog</a></span><span class="right"><a href="/#pricing">Get the monthly list</a></span></nav>
<main class="wrap">
${body}
</main>
</body>
</html>
`;
}
const author = { '@type': 'Person', name: 'Rehan Khodaiji' };
const publisher = { '@type': 'Organization', name: 'Docket Dispatch', url: SITE + '/' };

// ---------- write posts ----------
const blogDir = path.join(OUT, 'blog');
fs.rmSync(blogDir, { recursive: true, force: true });
fs.mkdirSync(blogDir, { recursive: true });
for (const p of live) {
  const m = p.meta; const url = `${SITE}/blog/${m.slug}/`;
  const sources = (m.sources || '').split('|').map((s) => s.trim()).filter(Boolean);
  const related = live.filter((x) => x !== p).slice(0, 3);
  const body = `<article>
<div class="kicker">Documentary funding</div>
<h1>${esc(m.title)}</h1>
<div class="meta">By Rehan Khodaiji &middot; Published ${nice(m.date)}${m.updated ? ' &middot; Updated ' + nice(m.updated) : ''}</div>
<div class="checked"><p><strong>Checked ${nice(m.facts_checked)}.</strong> Every date, amount and rule below was read on the funder's own page on that day. Funders change dates and rules without notice, so open the funder's page before you apply.</p></div>
${markdown(p.body)}
${sources.length ? `<h2>Pages we read</h2><ul class="sources">${sources.map((s) => { const [label, u] = s.split('=>').map((x) => x.trim()); return `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(label)}</a></li>`; }).join('')}</ul>` : ''}
<div class="cta"><h2>Get a checked list like this once a month</h2><p>Docket Dispatch sends one email on the first Tuesday of each month. Each call links to the funder's own page, with the deadline and who can apply, and says "not stated" where the page does not say.</p><a class="btn" href="/#pricing">See the plans</a></div>
${related.length ? `<h2>More from the blog</h2><ul>${related.map((r) => `<li><a href="/blog/${r.meta.slug}/">${esc(r.meta.title)}</a></li>`).join('')}</ul>` : ''}
</article>`;
  const jsonld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Article', headline: m.title, description: m.description, datePublished: m.date, dateModified: m.updated || m.date, author, publisher, mainEntityOfPage: url, inLanguage: 'en' },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Docket', item: SITE + '/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: SITE + '/blog/' },
      { '@type': 'ListItem', position: 3, name: m.title, item: url } ] } ] };
  fs.mkdirSync(path.join(blogDir, m.slug), { recursive: true });
  fs.writeFileSync(path.join(blogDir, m.slug, 'index.html'), shell({ title: m.title + ' | Docket', description: m.description, canonical: url, body, jsonld, type: 'article' }));
}

// ---------- blog index ----------
const indexBody = `<header><div class="kicker">Blog</div><h1>Documentary funding notes</h1>
<p>Notes on documentary funding calls, written from the funders' own pages and dated so you can see how fresh they are. New posts every two weeks.</p></header>
${live.length ? `<ul class="list">${live.map((p) => `<li><span class="when">${nice(p.meta.date)}</span><br><a class="t" href="/blog/${p.meta.slug}/">${esc(p.meta.title)}</a><span class="d">${esc(p.meta.description)}</span></li>`).join('')}</ul>` : '<p>The first post is on its way.</p>'}
<div class="cta"><h2>Get the checked list by email</h2><p>One email a month with open and upcoming documentary funding calls.</p><a class="btn" href="/#pricing">See the plans</a></div>`;
fs.writeFileSync(path.join(blogDir, 'index.html'), shell({
  title: 'Documentary funding blog | Docket', description: "Notes on documentary funding calls, written from the funders' own pages with dates, eligibility and links. New posts every two weeks.",
  canonical: SITE + '/blog/', body: indexBody,
  jsonld: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Documentary funding blog', url: SITE + '/blog/', publisher } }));

// ---------- sitemap, robots, rss ----------
const urls = [[SITE + '/', null], [SITE + '/blog/', live[0] ? live[0].meta.date : null], ...live.map((p) => [`${SITE}/blog/${p.meta.slug}/`, p.meta.updated || p.meta.date]), [SITE + '/terms/', null], [SITE + '/refunds/', null], [SITE + '/privacy/', null]];
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u, d]) => `  <url><loc>${u}</loc>${d ? `<lastmod>${d}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /project/\n\nSitemap: ${SITE}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, 'rss.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>Docket Dispatch</title><link>${SITE}/blog/</link><description>Notes on documentary funding calls, written from the funders' own pages.</description><language>en</language>\n${live.map((p) => `<item><title>${esc(p.meta.title)}</title><link>${SITE}/blog/${p.meta.slug}/</link><guid>${SITE}/blog/${p.meta.slug}/</guid><pubDate>${rfc822(p.meta.date)}</pubDate><description>${esc(p.meta.description)}</description></item>`).join('\n')}\n</channel></rss>\n`);

console.log(`Blog built: ${live.length} published, ${scheduled.length} scheduled${PREVIEW ? ' (preview mode: future posts included)' : ''}.`);
for (const s of scheduled) console.log(`  scheduled: ${s.meta.date}  ${s.meta.slug}`);
for (const p of problems) console.log('SKIPPED ' + p);
for (const w of warnings) console.log('WARNING ' + w);
