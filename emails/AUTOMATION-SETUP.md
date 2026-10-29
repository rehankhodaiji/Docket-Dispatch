# Mail automation: what is built and what you set

## What runs by itself
| Mail | Trigger | Code |
|---|---|---|
| Welcome | Dodo sends `subscription.active` to `/api/dodo-webhook` the moment a subscription starts | api/dodo-webhook.js |
| How to read a listing | Daily job, 2 days after the subscription was created | api/cron-sequence.js |
| Check-in | Same daily job, 10 days after | api/cron-sequence.js |
| Monthly issue | Tuesday job, first Tuesday of the month only | api/cron-issue.js |

The monthly issue is sent only if the issue file for that date has `"approved": true`, every listing was read within 7 days before the send date, `POSTAL_ADDRESS` is set and the built files exist. Otherwise nothing is sent and the owner gets an email saying why. Accuracy is the product, so a person approves each issue.

## Settings (Vercel project that serves www.docudocket.live, Settings, Environment Variables)
Set these on ONE project only. The repo is connected to two Vercel projects, and both would run the jobs.

| Name | Value |
|---|---|
| GMAIL_USER | docudocket@gmail.com |
| GMAIL_APP_PASSWORD | a Google app password for that account (needs 2-step verification on) |
| DODO_API_KEY | Dodo dashboard, Developer, API keys |
| DODO_WEBHOOK_SECRET | the `whsec_...` secret Dodo shows when you add the webhook |
| DODO_ENV | `test` until Dodo approves you, then `live` |
| DODO_PRODUCT_ANNUAL / DODO_PRODUCT_MONTHLY | the two product ids (pdt_...) |
| CRON_SECRET | any long random string; Vercel sends it with each scheduled call |
| OWNER_EMAIL | rehan.khodaiji@gmail.com (gets a note on every new subscriber, failure and skipped issue) |
| POSTAL_ADDRESS | your postal address (required in the footer of a bulk mail) |
| MANAGE_URL | where a subscriber manages or cancels (Dodo customer portal link) |

## Dodo webhook
Dodo dashboard, Developer, Webhooks, add endpoint `https://www.docudocket.live/api/dodo-webhook`, tick ONLY `subscription.active`.

## Each month
1. Re-read the funder pages, update emails/issues/issue-NNN.json.
2. `node emails/build_issue.cjs issues/issue-NNN.json` (writes emails/out/).
3. Check it, set `"approved": true`, commit, push before the first Tuesday.

## Tests
`node emails/test-automation.mjs` (28 checks, sends nothing).
