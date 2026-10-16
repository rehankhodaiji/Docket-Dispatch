# Docket project log

Time-stamped history of tasks, actions and results. Newest entries go at the bottom.

**About the times.** Entries before 16 Oct were not clock-stamped when they happened, so they show the date only ("-" under Time). From 16 Oct 12:11 IST on, every entry has a time. Times are IST (UTC+05:30).

## History

| # | Date | Time | Task | Action / method | Result | Output |
|---|---|---|---|---|---|---|
| 1 | 2026-10-12 | - | Folder access | Listed the working folders | Code folder was empty; parent had Skills, Skills.zip and a .skill file | - |
| 2 | 2026-10-12 | - | Install Claude Code | Gave PowerShell and npm install commands | User ran the installer | - |
| 3 | 2026-10-12 | - | Fix "claude not recognized" | Read user's screenshot | Install succeeded; PATH was missing `C:\Users\Dell\.local\bin`; gave the fix | - |
| 4 | 2026-10-12 | - | Which folder | Answered from session info | Code folder is the working directory | - |
| 5 | 2026-10-12 | - | Open Docket site in Chrome | Claude in Chrome, page text | Site loads: "Docket - Documentary Funding Tracker"; one listing visible | - |
| 6 | 2026-10-13 | - | Is the list ready? | Read the full page structure | Waitlist landing page. Sample digest shows 4 of 19 listings, labelled illustrative. Countdowns stale (about 2 weeks off); ITVS and BBC/C4 deadlines already passed | - |
| 7 | 2026-10-13 | - | Auto-correct dates | Advice only | Store ISO dates, compute countdown on load | - |
| 8 | 2026-10-13 | - | Periodic link checks | Advice only | Proposed links file plus scheduled check | - |
| 9 | 2026-10-13 | - | Find official pages for 5 funders | 5 web searches | Sundance window closed 15 Jun; ITVS not accepting; IDA no 2026 deadline (fund reported paused); BBC via PiCos (no URL); Channel 4 rolling. None of the 4 sample listings matched an open call | - |
| 10 | 2026-10-13 | - | Funder links file | Wrote `funder-links.md` | 5 rows, 3 marked mismatch, 2 unconfirmed | `..\funder-links.md` |
| 11 | 2026-10-13 | - | Weekly check task | Created scheduled task `docket-funder-date-check` (Thursdays 09:04) | Task created | scheduled task |
| 12 | 2026-10-13 | - | Newsletter feasibility | Analysis, no tools | Feasible as a niche business; weekly cadence too thin for US-only | - |
| 13 | 2026-10-13 | - | How much information exists | 2 web searches | Few US calls open today; free newsletters already exist; estimate 2-4 new items per week | - |
| 14 | 2026-10-13 | - | Information per region | 7 web searches (US, Canada, UK, Europe, South Asia, ANZ, MENA/Africa/LatAm) | 7 leads found, 0 confirmed | `documents\regional-research.md` |
| 15 | 2026-10-16 | - | Sourcing and verification method | Wrote and published a document | Pipeline of 7 stages, source tiers, verification states | `documents\docket-source-method.html`; https://claude.ai/artifact/XUrwybecCJjRdTQ7gLM5JP |
| 16 | 2026-10-16 | - | Two verification options | Wrote and published a document | Option A human-verified, Option B Claude-verified with improvement loop; recommends B with full human check for the first 3 issues | `documents\docket-verification-options.html`; https://claude.ai/artifact/UZV27wMfQsCY65frXRmA2F |
| 17 | 2026-10-16 | 12:11 | Project folder | Inspected the Code folder before moving anything | Found files and tasks this conversation did not create (see next section) | - |
| 18 | 2026-10-16 | 12:11+ | Project folder, log, dashboard | Created `Docket-Project\`, copied documents and snapshots, wrote README, regional research, this log, dashboard | Done. Live files left in the parent folder because the scheduled tasks use those paths | `Docket-Project\` |

## Changes found on disk on 16 Oct that were not made in this conversation

I did not make these and do not know who or what did. They are recorded so the project history is accurate.

| When | What | Detail |
|---|---|---|
| 2026-10-15 13:42 IST | Scheduled check ran | Run of `docket-funder-date-check`; updated `funder-links.md`, wrote `date-check-2026-10-15.md`. Found: IDA page has no Enterprise fund status; Sundance lists a 2027 Producers Track (opens 17 Nov, year not stated) |
| before 2026-10-16 | Task `docket-funder-date-check` changed | Now monthly (1st, 09:00), not weekly Thursdays as created |
| before 2026-10-16 | Two tasks added | `docket-friday-digest-draft` (monthly, 1st 11:00) and `docket-closing-soon-watch` (weekdays 08:00) |
| 2026-10-15 23:55 | `verified-listings.md` created | Empty table. A row needs the official page read in that run, status open, a future deadline and US eligibility |
| 2026-10-15 23:57 | `output\docket-walkthrough.html` created | A walkthrough page; copied into `documents\` |
| 2026-10-16 10:10 IST | Closing-soon watch ran | No verified listings, so nothing to watch |
| 2026-10-13 21:34-23:36 | Unrelated files | `output\CorpFin_*` and `work\*` belong to a different project. Not touched |

## Current state (16 Oct 2026)
- Verified listings: 0. Human-confirmed listings: 0.
- Funders tracked: 5. Regional leads: 7, all unconfirmed or machine-read only.
- Docket sample digest still says "Verified Oct 2026" on listings that do not match an official open call.

## Open items
1. Pick the first region to cover (Docket is US-only today).
2. Pick Option A or Option B.
3. Fix the site: stale countdowns, "Verified Oct 2026" label.
4. Find the BBC PiCos portal URL.
5. Confirm IDA Enterprise Fund status with IDA (contact addresses differ between sources).
6. Decide whether the weekly cadence I created or the current monthly one is wanted.

## Addendum 2026-10-16 (times IST)

| # | Date | Time | Task | Action / method | Result | Output |
|---|---|---|---|---|---|---|
| 19 | 2026-10-16 | 12:20 | Funder links and direct page reads | 13 official pages read with the page reader (several failed first: connection reset, 403); 4 searches for US funders | 13 sources read on official pages; 9 more listed as leads. Doha and Hubert Bals pages could not be read by the reader | `data\sources.csv` |
| 20 | 2026-10-16 | 12:20 | Test plain web requests from this PC | PowerShell loop over 21 registered URLs | 18 loaded on the right domain; 3 failed (Catapult connection error, Chicken and Egg redirect, Hubert Bals 403). Doha loaded here though the reader failed. One false alarm: BFI evidence phrase not found (phrase loosened to "Round 2") | - |
| 21 | 2026-10-16 | 12:20 | Source checker | Wrote `data\check_sources.py` (Python, standard library) | NOT RUN: Python is not installed on this PC. Not tested. | `data\check_sources.py` |
| 22 | 2026-10-16 | 12:20 | Viability and automation document | Wrote and published | Verdict, money table, six-month trial, scraping answer, safeguards, link directory | `documents\docket-viability-and-automation.html`; https://claude.ai/artifact/E7K1YbFWDA2AQK4M2RjkPQ |

Notes: PowerShell script files are disabled on this PC (execution policy), so the PC test was run inline, not as a saved script. Dashboard rebuilt after this addendum.


| 23 | 2026-10-16 | 12:34 | Mailer and distribution | Wrote and published a sample Issue 001 (from pages read 16 Oct), other email types, monthly send process, platform and compliance checklists | Sample is marked not sent and unconfirmed. No newsletter platform is connected; where the waitlist sign-ups go was not checked | `documents\docket-mailer-and-distribution.html`; https://claude.ai/artifact/TqgdQSYB7mqKciZSyf3CP2 |

| 24 | 2026-10-16 | 16:49 | Push to GitHub | Local git repository, first commit (15 files), pushed from the user's terminal after the user signed in | Pushed to https://github.com/rehankhodaiji/Docket-Dispatch (branch main). Private repo as chosen; not checked by me from GitHub's side | GitHub repository |
| 25 | 2026-10-16 | 16:52 | Front page for Vercel | Added `index.html` linking the dashboard and five documents; pointed the dashboard's document links at the repo files; scanned for emails (only public funder contacts and a fictional sample address) | Ready to push and deploy as a public site. User chose public | `index.html` |
| 26 | 2026-10-16 | 17:12 | Merge AI Studio UI | Cloned the user's AI Studio export (Docu-docket), put the app at the repo root, moved the project hub, dashboard and documents to `public/project/`, added `.npmrc` (dependency conflict), built and viewed it locally | Build passes; `/` shows the Docket page, `/project/` the hub. Found: waitlist form stores emails only in the visitor's browser; no API keys in the code. Not yet pushed or deployed | repo root |
| 27 | 2026-10-16 | 17:15 | Restyle /project/ to match the Docket page | User approved the landing page look and rejected the project hub's look. Added `public/project/theme.css` (Docket paper, ink, teal, marigold, Newsreader / Plus Jakarta Sans / JetBrains Mono, sharp corners), rebuilt the hub in that style, wrapped the dashboard and documents as complete pages with a masthead strip and a link back to `/`. The walkthrough page was only wrapped, its own design is unchanged | Built and viewed locally. Landing page (`/`) not touched |
