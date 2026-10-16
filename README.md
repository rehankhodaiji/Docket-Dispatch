# Docket project

Everything for the Docket documentary funding tracker lives here. Last updated 2026-10-16.

## Folders
| Folder | What is in it |
|---|---|
| `documents/` | Written deliverables: source method, verification options, walkthrough page, regional research |
| `data/` | Dated snapshots of the working data files and the check reports |
| `logs/` | `PROJECT-LOG.md`, the time-stamped history of tasks, actions and results |
| `dashboard/` | `dashboard.html`, the project dashboard (a snapshot; ask Claude to refresh it) |

## Live files that stay in the parent folder
The scheduled tasks read and write these by their full path, so they were NOT moved. The copies in `data/` are snapshots.

- `..\funder-links.md` (funder registry)
- `..\verified-listings.md` (only rows the automated check verified; currently empty)
- `..\date-check-*.md`, `..\digest-draft-*.md`, `..\alerts.md` (task outputs, when they exist)

## Scheduled tasks (3)
- `docket-funder-date-check`: monthly
- `docket-friday-digest-draft`: monthly
- `docket-closing-soon-watch`: weekdays

## Not part of Docket
`..\output\CorpFin_*` and `..\work\*` are from a different project (13 Oct). They were left alone.

## Rules this project follows
- Only a funder's official page can confirm a date. Aggregators are leads.
- Nothing is called "human-verified" until a person has confirmed it.
- Nothing is emailed or published automatically.
