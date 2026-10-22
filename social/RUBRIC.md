# Post audit rubric

Every post gets two audits: the script (`social/audit.cjs`, mechanical) and the reviewer agent (`social-auditor`, judgment, with fresh page reads). A post is publishable only when it has no BLOCK, quality is 80 or more, and the virality score is 60 or more.

## Gate 1: Accuracy (pass or fail, no score)

A single failure blocks the post.

| Check | Who checks | Fail means |
|---|---|---|
| Every date, time, zone, amount and eligibility line traces to a funder's own page | script (trace) and agent (fresh read) | Block |
| Pages read within 7 days before the post date | script | Block |
| Agent re-reads each cited page today and the wording still matches | agent | Block |
| The post says "silent" where the page is silent, with nothing filled in | agent | Block |
| No invented proof: testimonials, subscriber counts, results, "confirmed by a person" | agent | Block |
| Links go only to pages that exist and are live on the post date | script | Block |
| No sign-up call to action while signup is not live (`social/config.json`) | script | Block |

## Gate 2: Quality benchmark (0 to 100)

The script deducts 25 per BLOCK and 5 per WARN from 100. The agent confirms these and may add up to 3 WARNs.

- Copy rules: no em dashes, contrast reveals, negation lists, trailing pile-ons, self-answered questions, stock phrases, emoji, exclamation marks.
- Channel fit: X and Bluesky 300 characters or fewer; LinkedIn 600 to 1,300; Instagram no URL and ends "Link in bio."
- Slides: 5 to 8; under 45 words each; titles under 12 words; brand tokens unchanged.
- Three-question gate on each line: can the reader picture it, can it be proved true or false, could a competitor write the same sentence.
- Voice: first person singular, plain, one idea.

## Gate 3: Virality potential (0 to 100) — a prediction, not a fact

Nobody can reliably predict virality. This score estimates how well a post fits what tends to travel in this niche, and it is checked against real results (below). Treat it as a ranking tool for deciding which of several drafts to post, not a promise.

| Part | Points | How |
|---|---|---|
| Mechanical proxies (script) | 40 | Short hook, a number in the hook, audience named, first caption line under 141 characters, 5 to 8 slides, a save-worthy slide, one link or handle, one link per caption. The script reports these out of 100; the pipeline takes 40% of that score |
| Agent judgment | 60 | Each of five items scored 0 to 12: (1) the hook stops a documentary producer scrolling, (2) the post is worth saving for a deadline, (3) a reader would forward it to a collaborator, (4) it is new information, not a repeat of the funders' own announcement, (5) it fits the channel's format and tone |

Virality = 0.4 x script proxies + agent judgment (out of 60).

## Calibration loop

After 48 hours, record real results in `social/METRICS.csv` (impressions, reactions or likes, comments, saves, shares or reposts, link clicks from Clarity source tags, signups). After 10 posts, compare the virality score with results by channel and change the weights above. Until then the score is uncalibrated and the agent must say so in its report.

## Verdicts

- PASS: no BLOCK, quality 80 or more, virality 60 or more.
- REVISE: no BLOCK but a score is under its bar. The drafter fixes the listed items and the audit runs again. Maximum 3 rounds, then the post goes to the user with the reasons.
- BLOCK: an accuracy or hard rule failed. Never goes to the approval queue until fixed.
