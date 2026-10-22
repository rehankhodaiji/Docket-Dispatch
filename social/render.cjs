// Renders a carousel from social/posts/<name>.json to social/out/<name>-<n>.png (1080x1350).
// Usage: node social/render.cjs <name> [readDate]
// readDate (e.g. "22 Oct 2026") replaces the footer date on every slide.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const name = process.argv[2];
if (!name) { console.error('Usage: node social/render.cjs <post-name> [readDate]'); process.exit(1); }
const dir = __dirname;
const post = JSON.parse(fs.readFileSync(path.join(dir, 'posts', name + '.json'), 'utf8').replace(/^\uFEFF/, ''));
const readDate = process.argv[3] || post.readDate;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const CSS = `:root{--paper:#F8F5EE;--ink:#1A1714;--teal:#0D4952;--gold:#C86A14;--line:#D9D2C3;--mute:#6B6358}
*{box-sizing:border-box;margin:0;padding:0;border-radius:0}html,body{width:1080px;height:1350px;overflow:hidden}
.s{width:1080px;height:1350px;display:flex;flex-direction:column;padding:72px 80px;background:var(--paper);color:var(--ink);font-family:'Plus Jakarta Sans',sans-serif}
.s.teal{background:var(--teal);color:var(--paper)}.s.ink{background:var(--ink);color:var(--paper)}
.top{display:flex;justify-content:space-between;font:500 24px 'JetBrains Mono',monospace;letter-spacing:.08em;text-transform:uppercase;padding-bottom:22px;border-bottom:3px solid currentColor}
.kick{font:600 26px 'JetBrains Mono',monospace;letter-spacing:.06em;text-transform:uppercase;color:var(--gold);margin-top:70px}
.teal .kick,.ink .kick{color:#E8A54E}
h1{font:700 100px/1.04 'Newsreader',serif;letter-spacing:-.02em;margin-top:34px}
h2{font:700 64px/1.1 'Newsreader',serif;letter-spacing:-.01em;margin-top:30px}
.big{font:700 150px/1 'Newsreader',serif;letter-spacing:-.03em;margin-top:40px}.big.sm{font-size:112px}
.lab{font:500 28px 'JetBrains Mono',monospace;color:var(--mute);margin-top:16px}
p.sub{font:400 36px/1.4 'Plus Jakarta Sans',sans-serif;margin-top:36px;max-width:860px}
.teal p.sub,.ink p.sub{color:#E3DED1}
ul{list-style:none;margin-top:46px}
li{font:500 38px/1.38 'Plus Jakarta Sans',sans-serif;padding:20px 0;border-top:1px solid var(--line)}li:last-child{border-bottom:1px solid var(--line)}
li b{font-weight:700}li span{display:block;font:400 30px/1.4 'Plus Jakarta Sans',sans-serif;color:var(--mute);margin-top:4px}
.tag{display:inline-block;margin-top:44px;background:var(--teal);color:var(--paper);font:600 26px 'JetBrains Mono',monospace;letter-spacing:.06em;text-transform:uppercase;padding:14px 22px;align-self:flex-start}
.fix{margin-top:44px;border-left:8px solid var(--gold);padding:6px 0 6px 28px;font:600 36px/1.4 'Plus Jakarta Sans',sans-serif}
.fix i{display:block;font:500 24px 'JetBrains Mono',monospace;color:var(--gold);font-style:normal;letter-spacing:.06em;text-transform:uppercase;margin-bottom:8px}
.foot{margin-top:auto;display:flex;justify-content:space-between;font:500 24px 'JetBrains Mono',monospace;letter-spacing:.06em;color:var(--mute)}
.teal .foot,.ink .foot{color:#BFD3D6}
.url{font:600 40px 'JetBrains Mono',monospace;color:#E8A54E;margin-top:50px;word-break:break-all;line-height:1.35}`;

function body(s) {
  let h = '';
  if (s.kicker) h += `<div class="kick">${esc(s.kicker)}</div>`;
  if (s.h1) h += `<h1>${esc(s.h1)}</h1>`;
  if (s.h2) h += `<h2>${esc(s.h2)}</h2>`;
  if (s.big) h += `<div class="big${s.bigSmall ? ' sm' : ''}">${esc(s.big)}</div>`;
  if (s.lab) h += `<div class="lab">${esc(s.lab)}</div>`;
  if (s.sub) h += `<p class="sub">${esc(s.sub)}</p>`;
  if (s.items) h += '<ul>' + s.items.map(i => typeof i === 'string' ? `<li>${esc(i)}</li>`
    : `<li><b>${esc(i.b)}</b>${i.rest ? ' ' + esc(i.rest) : ''}${i.span ? `<span>${esc(i.span)}</span>` : ''}</li>`).join('') + '</ul>';
  if (s.tag) h += `<span class="tag">${esc(s.tag)}</span>`;
  if (s.fix) h += `<div class="fix"><i>Do this</i>${esc(s.fix)}</div>`;
  if (s.url) h += `<div class="url">${esc(s.url)}</div>`;
  return h;
}

const chrome = ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'].find(fs.existsSync);
if (!chrome) { console.error('No Chrome or Edge found'); process.exit(1); }
const out = path.join(dir, 'out'); fs.mkdirSync(out, { recursive: true });
const tmp = path.join(dir, 'out', '_tmp'); fs.mkdirSync(tmp, { recursive: true });
const N = post.slides.length;
post.slides.forEach((s, i) => {
  const html = `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Newsreader:opsz,wght@6..72,400;6..72,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"><style>${CSS}</style></head><body><div class="s ${s.theme || ''}"><div class="top"><span>Docket Dispatch</span><span>${i + 1} / ${N}</span></div>${body(s)}<div class="foot"><span>docudocket.live</span><span>Dates read ${esc(readDate)}</span></div></div></body></html>`;
  const f = path.join(tmp, `${name}-${i + 1}.html`);
  fs.writeFileSync(f, html, 'utf8');
  const png = path.join(out, `${name}-${i + 1}.png`);
  spawnSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=1080,1350',
    '--virtual-time-budget=8000', `--screenshot=${png}`, 'file:///' + f.replace(/\\/g, '/')], { stdio: 'ignore' });
  console.log(fs.existsSync(png) ? 'wrote ' + png : 'FAILED ' + png);
});
fs.rmSync(tmp, { recursive: true, force: true });
