"""Docket source checker. Run on your own PC: python check_sources.py

Reads sources.csv and, for each registered official page, checks:
  - the page loads (HTTP status)
  - it stays on the registered funder domain after redirects
  - the saved evidence phrase is still on the page
  - a hash of the page text, so a change from last run is visible
Writes check_report.md and last_hashes.json next to this file.
It never edits sources.csv, never emails, never publishes. Anything it cannot read is flagged for a person.
Standard library only. Pages that load dates with JavaScript will show "phrase not found": a person must look.
"""
import csv, hashlib, json, re, sys, time, urllib.request, urllib.error
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse

HERE = Path(__file__).parent
UA = "Mozilla/5.0 (compatible; DocketChecker/0.1; personal research)"

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=25) as r:
        body = r.read(2_000_000).decode("utf-8", "replace")
        return r.status, r.geturl(), body

def text_of(html):
    html = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", html)
    return re.sub(r"\s+", " ", re.sub(r"(?s)<[^>]+>", " ", html)).strip()

def main():
    rows = list(csv.DictReader(open(HERE / "sources.csv", encoding="utf-8")))
    hash_file = HERE / "last_hashes.json"
    old = json.loads(hash_file.read_text()) if hash_file.exists() else {}
    new, lines = {}, []
    flags = 0
    for r in rows:
        url, dom = r["page_url"].strip(), r["registered_domain"].strip().lower()
        res = {"id": r["id"], "name": f'{r["funder"]} - {r["program"]}', "url": url}
        if not url.startswith("http"):
            res["result"] = "NO URL - find the official page"; flags += 1
        else:
            try:
                status, final, body = fetch(url)
                host = (urlparse(final).hostname or "").lower()
                text = text_of(body)
                h = hashlib.sha256(text.encode()).hexdigest()[:16]
                new[r["id"]] = h
                notes = []
                if not (host == dom or host.endswith("." + dom)):
                    notes.append(f"LEFT REGISTERED DOMAIN -> {host}")
                ev = r["evidence_phrase"].strip()
                if ev and ev.lower() not in text.lower():
                    notes.append(f'evidence phrase "{ev}" NOT FOUND (changed, or page loads text with JavaScript)')
                if r["id"] in old and old[r["id"]] != h:
                    notes.append("page text CHANGED since last run")
                res["result"] = f"HTTP {status}" + ("; " + "; ".join(notes) if notes else "; ok")
                if notes: flags += 1
            except urllib.error.HTTPError as e:
                res["result"] = f"HTTP {e.code} - could not read; person must check"; flags += 1
            except Exception as e:
                res["result"] = f"ERROR {type(e).__name__} - could not read; person must check"; flags += 1
        lines.append(f'| {res["id"]} | {res["name"]} | {res["result"]} | {url} |')
        time.sleep(1.5)  # be polite to funder sites
    hash_file.write_text(json.dumps({**old, **new}, indent=1))
    out = ["# Source check", f"Run: {datetime.now():%Y-%m-%d %H:%M}", "",
           f"{flags} of {len(rows)} need a person to look.", "",
           "| ID | Source | Result | URL |", "|---|---|---|---|", *lines, "",
           "A clean row means the page loaded on the right domain and the saved phrase is still there. It does not confirm a deadline. A person still confirms before anything is published."]
    (HERE / "check_report.md").write_text("\n".join(out), encoding="utf-8")
    print(f"Done: {flags} flagged. See check_report.md")

if __name__ == "__main__":
    sys.exit(main())
