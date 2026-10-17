# Docket Dispatch

The Docket landing page (built in Google AI Studio) plus the project notes, in one repository. Last updated 2026-10-16.

## What is where
| Path | What it is |
|---|---|
| `src/`, `index.html`, `public/images/` | The Docket landing page (React + Vite). Served at `/` |
| `public/project/` | Project hub, dashboard and documents. Served at `/project/` |
| `data/` | Source registry (`sources.csv`), snapshots and check reports. Not published |
| `logs/PROJECT-LOG.md` | Time-stamped history of tasks, actions and results. Not published |

## Run it
```
npm install
npm run dev      # http://localhost:3000
npm run build    # output in dist/
```
`.npmrc` sets `legacy-peer-deps=true` because the AI Studio package list has a version conflict (esbuild and Vite) that otherwise stops `npm install`.

## Deploy on Vercel
Import this repo, Framework Preset **Vite**, build command `npm run build`, output `dist`.

## Known gaps
- The signup form asks for an email and a plan ($79/year or $15/month) but takes no payment and saves the email only in the visitor's own browser. It sends nothing to you. It needs a payment link and a place to store emails before it is published.
- The page says "20+ sources". The registry has 22, and 15 have been read on their official pages.
- No listing has been confirmed by a person.

## Rules
- Only a funder's official page can confirm a date. Aggregators are leads.
- Nothing is emailed or published automatically.
