// Publishes an APPROVED post to Bluesky (official AT Protocol API). Dry run by default.
// Usage: node social/publish.cjs <post-name> [--send]
// Credentials come from the environment, never from files: BSKY_HANDLE, BSKY_APP_PASSWORD
// (create an app password in Bluesky: Settings > Privacy and security > App passwords).
// Gates: status must be "approved", postDate must not be in the future, and the audit
// must pass again right now (so a page read that has gone stale blocks the send).
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const name = process.argv[2];
const send = process.argv.includes('--send');
if (!name) { console.error('Usage: node social/publish.cjs <post-name> [--send]'); process.exit(1); }
const file = path.join(__dirname, 'posts', name + '.json');
const load = () => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, ''));
let post = load();
const fail = m => { console.error('STOP: ' + m); process.exit(1); };

if (!(post.channels || []).includes('Bluesky')) fail('This post does not list Bluesky as a channel.');
if (post.posted && post.posted.Bluesky) fail('Already posted to Bluesky: ' + post.posted.Bluesky.uri);
if (post.status !== 'approved') fail(`Status is "${post.status}". Only "approved" posts can be published. The user approves each post.`);
const today = new Date().toISOString().slice(0, 10);
if (post.postDate > today) fail(`Post date ${post.postDate} is in the future (today ${today}).`);

const a = spawnSync(process.execPath, [path.join(__dirname, 'audit.cjs'), name], { encoding: 'utf8' });
if (a.status !== 0) fail('Audit failed at send time:\n' + a.stdout);
post = load();

const text = post.captions.Bluesky;
const imgs = [];
for (let i = 1; i <= Math.min(4, post.slides.length); i++) {
  const p = path.join(__dirname, 'out', `${name}-${i}.png`);
  if (!fs.existsSync(p)) fail('Missing image ' + p + '. Run: node social/render.cjs ' + name);
  imgs.push(p);
}
console.log(`${send ? 'SENDING' : 'DRY RUN'} to Bluesky (${text.length} characters, ${imgs.length} images, first 4 slides only: Bluesky allows 4 images)\n\n${text}\n`);
if (!send) { console.log('Nothing sent. Add --send to publish.'); process.exit(0); }

const handle = process.env.BSKY_HANDLE, pw = process.env.BSKY_APP_PASSWORD;
if (!handle || !pw) fail('Set BSKY_HANDLE and BSKY_APP_PASSWORD in the environment first.');

(async () => {
  const host = 'https://bsky.social/xrpc/';
  const j = async (r) => { const b = await r.json().catch(() => ({})); if (!r.ok) throw new Error(`${r.status} ${JSON.stringify(b)}`); return b; };
  const s = await j(await fetch(host + 'com.atproto.server.createSession', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ identifier: handle, password: pw }) }));
  const auth = { Authorization: 'Bearer ' + s.accessJwt };
  const images = [];
  for (let i = 0; i < imgs.length; i++) {
    const buf = fs.readFileSync(imgs[i]);
    const up = await j(await fetch(host + 'com.atproto.repo.uploadBlob', { method: 'POST', headers: { ...auth, 'Content-Type': 'image/png' }, body: buf }));
    const sl = post.slides[i];
    const alt = [sl.kicker, sl.h1 || sl.h2 || sl.big, sl.sub || sl.lab].filter(Boolean).join('. ').slice(0, 300);
    images.push({ alt, image: up.blob, aspectRatio: { width: 1080, height: 1350 } });
  }
  const facets = [];
  const enc = new TextEncoder();
  for (const m of text.matchAll(/https?:\/\/[^\s]+/g)) {
    const start = enc.encode(text.slice(0, m.index)).length;
    facets.push({ index: { byteStart: start, byteEnd: start + enc.encode(m[0]).length }, features: [{ $type: 'app.bsky.richtext.facet#link', uri: m[0] }] });
  }
  const record = { $type: 'app.bsky.feed.post', text, createdAt: new Date().toISOString(), langs: ['en'], facets, embed: { $type: 'app.bsky.embed.images', images } };
  const r = await j(await fetch(host + 'com.atproto.repo.createRecord', { method: 'POST', headers: { ...auth, 'Content-Type': 'application/json' }, body: JSON.stringify({ repo: s.did, collection: 'app.bsky.feed.post', record }) }));
  post = load();
  post.posted = Object.assign(post.posted || {}, { Bluesky: { uri: r.uri, at: new Date().toISOString() } });
  if ((post.channels || []).every(c => post.posted[c])) post.status = 'posted';
  fs.writeFileSync(file, JSON.stringify(post, null, 2) + '\n');
  console.log('Posted: ' + r.uri);
})().catch(e => fail(e.message));
