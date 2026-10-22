# What can be automated, and what cannot

Last checked 22 Oct 2026 from web searches. Third-party tutorial sites supplied some of this; verify on each platform's own docs before relying on it.

| Channel | Automate? | How | Catch |
|---|---|---|---|
| Bluesky | Yes, built | `social/publish.cjs`, official API, app password | Max 4 images per post, so a carousel sends the first 4 slides |
| LinkedIn (personal profile) | Yes, to build | "Share on LinkedIn" product, `w_member_social`, self-serve per vendor sites; the app must be linked to a LinkedIn Page | The access token lasts 60 days and cannot be refreshed in the background, so you sign in again every 60 days. Company Pages need LinkedIn review |
| X | Not checked | Needs a developer account and its current API terms | Pricing and limits not confirmed |
| Instagram | Not checked | Needs a Business or Creator account and Meta's API | App review and account-type rules not confirmed |
| Scheduler (Buffer) | Option for LinkedIn, Instagram, X and Bluesky together | Buffer's pricing page: Free plan up to 3 channels, 10 scheduled posts per channel at a time | Sources disagree on paid-plan fair-use caps. Whether each network is on the Free plan was not confirmed. Posting stays manual to the scheduler's queue unless its API is used |
| Reddit | No, on purpose | You post it after reading the subreddit's rules | Automated posting breaks community rules and risks a ban |

## What stays human

- Approving each post (about 10 minutes for a whole week in one batch).
- Reddit posts.
- Replies to comments and DMs.

## What a daily run can do on its own

Research, draft, render, audit with the reviewer agent, and put the result in the approval queue. A scheduled run only works while the Claude app is open on this computer. Publishing runs only on approved posts.
