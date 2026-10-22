---
name: docket-social
description: Research, draft, audit and queue the Docket Dispatch social posts for a day or a week (captions per channel plus carousel images), then publish approved posts. Use for "today's post", "write day N", "draft the week", "audit this post", "publish the approved posts", or any social copy for docudocket.live.
---

# Docket social pipeline

Stages: **Research, Draft, Audit, Revise, Approve, Publish, Measure.** Work from `C:\Users\Dell\Documents\Claude\Code\Docket-Project`. Rules and scores are in `social/RUBRIC.md`. Settings are in `social/config.json`.

Post status in each `social/posts/<name>.json`: `drafted` (has a blocking problem) > `audited` (no blocks) > `approved` (user said yes to this post) > `posted`. Only the user moves a post to `approved`.

## 1. Research

1. Read `social/PLAN.md` for the day, channels and post type. "none" days: stop.
2. Facts come only from, in order: the blog post for the topic (`blog/posts/`), `data/sources.csv` and `emails/issues/*.json`, then the funder's own page read now with WebFetch.
3. Every claim you will use goes into the post's `facts` list: `claim`, `url` (funder page), `read` (today's date, YYYY-MM-DD), `evidence` (the page's own words for each date, time, zone, amount and eligibility line you use). If a page cannot be read, drop the claim. If a page is silent, say it is silent.
4. Rank two or three angles by what a US documentary director-producer would save or forward before a deadline (a deadline that is close, who is eligible, a gap the page leaves out). Pick the best; note the runner-up in the post file under `alt`.

## 2. Draft

- Copy the pattern of `social/posts/2026-10-29-deadlines.json`. Save as `social/posts/<YYYY-MM-DD>-<slug>.json` with `postDate`, `channels`, `slides`, `captions`, `facts`, `readDate` (the oldest `read` date, as "22 Oct 2026").
- Voice: first person singular, plain, specific, one idea. Full date with year and time zone wherever a deadline appears. Sentence case. No em dashes, "it's not X, it's Y", "not just", negation lists, trailing pile-ons, self-answered questions, stock phrases, emoji or exclamation marks.
- Channels: LinkedIn 600 to 1,300 characters, one link at the end. Instagram no URL, ends "Link in bio." X and Bluesky 300 characters or fewer including the link. Reddit is drafted as text only and posted by the user, after reading the subreddit's rules.
- Slides: cover (theme `teal`), 2 to 4 fact slides, closer (theme `ink`, one URL). 5 to 8 slides, under 45 words each, titles under 12 words.
- Links only to pages that exist and are live by the post date. No sign-up call to action until `signupLive` is true in `social/config.json`.
- Render: `node social/render.cjs <name> "<readDate>"`, then open the cover and one fact slide to check nothing is cut off.

## 3. Audit (two independent checks)

1. `node social/audit.cjs <name>` runs the mechanical gates: banned patterns, channel limits, slide limits, links, stale reads (7 days), the sign-up rule, and a trace that every date, time and amount in the post appears in a fact's evidence. Exit code 2 means BLOCK.
2. Then spawn the `social-auditor` agent with the post name. It re-reads every cited page, checks the claims against them, scores the judgment items and returns PASS, REVISE or BLOCK with numbered fixes. It does not edit files.

## 4. Revise

Apply the fixes, re-render if slides changed, and run both audits again. Maximum `maxRevisionRounds` (3) rounds. A BLOCK never goes to approval. If still failing after 3 rounds, show the user the post and the reasons, and let them decide.

## 5. Approve

Show the user, per post: day, channels, every caption in full, the slide images, the audit numbers (quality, virality, uncalibrated until 10 posts have results) and the fact list with page and read date. For a week, show all posts in one batch so approval takes about 10 minutes. On a clear yes, set `status` to `approved`. Approval covers that post only, with exactly that text and those images.

## 6. Publish

- Bluesky: `node social/publish.cjs <name>` is a dry run. `--send` publishes. It refuses unless the post is `approved`, the post date has arrived, and the audit passes again at send time (a page read that went stale blocks it). Needs `BSKY_HANDLE` and `BSKY_APP_PASSWORD` in the environment (an app password, never the account password; the user sets them, never write them to a file).
- LinkedIn, Instagram, X: use a scheduler the user chooses (see `social/AUTOMATION.md`) or paste manually. Do not send anything through the user's logged-in browser without being asked for that post.
- Reddit: never automated.
- After each post goes out, set `posted.<channel>` and add a row to `social/METRICS.csv`.

## 7. Measure

Forty-eight hours after posting, record impressions, reactions, comments, saves, shares, link clicks (Clarity source tags) and signups in `social/METRICS.csv`. After 10 posts, compare with the predicted virality scores and update the weights in `social/RUBRIC.md`. Add one line to `logs/PROJECT-LOG.md` per batch: what was drafted, audited, approved and posted.

## Never

Post without that post's approval. Invent a result, testimonial or count. Fill a gap a funder page leaves open. Store credentials in the repo. Commit `social/out/`.
