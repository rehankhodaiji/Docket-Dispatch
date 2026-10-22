---
name: docket-social
description: Write the day's Docket Dispatch social post (exact caption per channel plus carousel images) from verified funder facts. Use when the user says "today's post", "write day N", "make the carousel", or asks for social copy for docudocket.live.
---

# Docket social post

Produces, for one day of the posting plan: the channel list, the exact caption for each channel, and carousel PNGs in the Docket brand. Nothing is posted by this skill. The user approves, then posts (or asks to send through the browser).

Work from the project root `C:\Users\Dell\Documents\Claude\Code\Docket-Project`.

## 1. Find the day

Read `social/PLAN.md` for the day's channels and post type. If the user gives a date, use it. If a day is "none", say so and stop.

## 2. Get the facts (never from memory)

Allowed sources, in this order:
1. The blog post for that topic in `blog/posts/` (its `sources` line lists the funder pages).
2. `data/sources.csv` and `emails/issues/issue-001.json` for listing details.
3. The funder's own page, read now.

Rules:
- Every date, amount, eligibility line and time zone must appear on a funder's page read within 7 days of the post date. If the source's `facts_checked` is older, re-read the funder pages first (use WebFetch) and update the `facts_checked` line and the slides' read date.
- Where a page is silent, say it is silent. Never fill the gap.
- Keep a quote under 15 words, or paraphrase.
- Never write a testimonial, subscriber count, "confirmed by a person" claim or result that has not happened. Nothing in Issue 001 is confirmed by a person unless the user says so.
- Do not link to a sign-up or checkout call to action until the signup form really captures emails (check `src/components/Hero.tsx` and the project log). Link only to pages that exist: `/`, `/blog/...`, `/terms/`, `/privacy/`, `/refunds/`.

## 3. Write the copy

Voice: first person singular for the founder ("I read each page"), plain, specific, one idea per post. Follow the copywriting rules:
- No em dashes. No "it's not X, it's Y", "not just", negation lists, "here's the thing", "unlock", "seamless", "game changer", self-answered questions.
- At most one fragment and one list of three per post.
- Full date with year and time zone wherever a deadline appears.
- Title-case nothing. Sentence case everywhere.
- Per channel: LinkedIn 600 to 1,300 characters with a line break between ideas, one link at the end. Instagram: caption without a URL, ends "Link in bio." X and Bluesky: under 300 characters including the link.
- Run the three-question gate on every line: can the reader picture it, can it be proved true or false, could a competitor write the same sentence.

## 4. Build the carousel

1. Copy `social/posts/2026-10-29-deadlines.json` as the pattern. Save the new one as `social/posts/<YYYY-MM-DD>-<slug>.json`.
2. Slide shape: cover (theme `teal`, `h1` + `sub`), 2 to 4 fact slides (paper background: `kicker`, `big` or `h2`, `lab`, `items`, `tag` or `fix`), closer (theme `ink`, `h1`, `sub`, `url`). 5 slides is the default. Max 8.
3. One idea per slide. Titles under 12 words. Slide text under 45 words.
4. Render: `node social/render.cjs <name> "<read date, e.g. 22 Oct 2026>"`. Output: `social/out/<name>-1.png` and so on, 1080 x 1350.
5. Open at least the cover and one fact slide to check nothing is cut off or overlapping. Fix and re-render.

Brand (do not change): paper #F8F5EE, ink #1A1714, teal #0D4952, marigold #C86A14; Newsreader for headlines, Plus Jakarta Sans for body, JetBrains Mono for labels; sharp corners; no gradients, shadows, stock photos or emoji.

## 5. Present for approval

Show: day, channels, the caption per channel in full, the image paths, and a list of every fact with the funder page it came from and its read date. Ask for approval. Make changes until the user says accept.

## 6. After approval

- Save the final captions inside the JSON.
- Add a line to `logs/PROJECT-LOG.md` (next entry number, date, what was drafted, not posted).
- Do not commit `social/out/` (generated). Do not post anything unless the user asks, and then only to the channel they named.
