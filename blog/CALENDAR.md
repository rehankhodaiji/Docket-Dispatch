# Docket Dispatch blog calendar

One post every second Thursday. Posts are written ahead and go live automatically on their date, but only when the site is rebuilt on or after that date (see "Making posts go live" below).

| Date | Slug | Topic | Status |
|---|---|---|---|
| 29 Oct 2026 | documentary-funding-deadlines-november-december-2026 | Six calls with dates in Nov and Dec, and which take US producers | Drafted. Re-read funder pages 27-28 Oct, then set facts_checked |
| 12 Nov 2026 | what-documentary-funder-pages-leave-out | Seven gaps found reading ten funder pages | Drafted. Re-read before publish |
| 26 Nov 2026 | when-documentary-funders-open-2026-windows | Windows already closed and ahead, no-calendar programs | Drafted. Re-read before publish |
| 10 Dec 2026 | sundance-documentary-fund-2026-call | What the 2026 call said, what is unannounced | Drafted. Re-read before publish |
| 24 Dec 2026 | (to write) | Fiscal sponsorship: what it is and when you need one (IDA page facts) | Idea. Read IDA page again, fee is not stated there |
| 7 Jan 2027 | (to write) | January 2027 deadlines | Idea. Needs a fresh read of every funder |

## Rules for every post

1. Facts come only from a funder's own page, read within 7 days before publishing. Update `facts_checked` to that read date. The builder warns when it is older.
2. Where a page is silent, say it is silent. Do not fill the gap.
3. Title 60 characters or fewer. Description 110 to 160.
4. No em dashes, "it's not X, it's Y", "not just", "unlock", "seamless" and similar. The builder warns on these.
5. End each post by pointing to /#pricing only through the built-in call-to-action box, not in the body.

## Making posts go live

The builder publishes a post when its date is today or earlier (UTC), but a static site only changes when it is rebuilt. Either push a small commit on each publish date, or add a Vercel deploy hook and a scheduled call to it on the Thursdays above.

## Weekly 10-minute routine

1. Open the next post and the funder pages it cites.
2. Fix anything that changed. Set `facts_checked` to today.
3. Run `npm run build` and read the warnings.
4. Push.