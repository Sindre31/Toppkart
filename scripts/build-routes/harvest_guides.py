"""Collect the written guides out of the guide-swarm transcripts.

Same precedence as the corridor harvest: the fact-checker's `corrected` record
beats the writer's, because that is the point of running it. A tour marked
`suspect` is reported rather than quietly shipped.
"""

import glob
import json
import os
import sys

WF = os.environ.get("TOPPKART_WF") or (
    "/root/.claude/projects/-home-user-Toppkart/"
    "0580f52e-11d8-524c-86b8-7b383e97f1aa/subagents/workflows/wf_ac6c3f39-6c0"
)

REQUIRED = ("intro", "ascent", "descent", "avalanche", "caption")


def structured(path):
    out = []
    for line in open(path):
        try:
            d = json.loads(line)
        except ValueError:
            continue
        c = (d.get("message") or {}).get("content")
        if not isinstance(c, list):
            continue
        for b in c:
            if b.get("type") == "tool_use" and "tructured" in str(b.get("name")):
                out.append(b.get("input") or {})
    return out


def valid(text):
    if not isinstance(text, dict) or any(k not in text for k in REQUIRED):
        return False
    if not text["ascent"] or not text["descent"]:
        return False
    return len(text.get("avalanche") or []) >= 1


def main():
    written, checked, suspect = {}, {}, []

    for path in sorted(glob.glob(os.path.join(WF, "agent-*.jsonl"))):
        for payload in structured(path):
            for t in payload.get("tours") or []:
                slug = t.get("slug")
                if not slug:
                    continue
                if "verdict" in t:
                    cor = t.get("corrected") or {}
                    if valid(cor.get("no")) and valid(cor.get("en")):
                        checked[slug] = {
                            "no": cor["no"], "en": cor["en"],
                            "source": f"checked ({t.get('verdict')})",
                            "problems": t.get("problems") or [],
                        }
                    if t.get("verdict") == "suspect":
                        suspect.append((slug, t.get("problems") or []))
                elif valid(t.get("no")) and valid(t.get("en")):
                    written[slug] = {
                        "no": t["no"], "en": t["en"],
                        "source": "written",
                        "sources": t.get("sources") or [],
                        "uncertain": t.get("uncertain", ""),
                    }

    merged = dict(written)
    for slug, rec in checked.items():
        base = dict(merged.get(slug, {}))
        base.update(rec)
        merged[slug] = base

    with open("guides_swarm.json", "w") as f:
        json.dump(merged, f, ensure_ascii=False, indent=1)

    print(f"harvested {len(merged)} guides ({len(checked)} fact-checked)")
    problems = []
    for slug, r in sorted(merged.items()):
        no, en = r["no"], r["en"]
        flags = []
        for field in ("ascent", "descent", "avalanche"):
            if len(no[field]) != len(en[field]):
                flags.append(f"{field} NO {len(no[field])} vs EN {len(en[field])}")
        if "varsom.no" not in json.dumps(no["avalanche"], ensure_ascii=False):
            flags.append("no varsom.no in NO")
        if "varsom.no" not in json.dumps(en["avalanche"], ensure_ascii=False):
            flags.append("no varsom.no in EN")
        print(
            f"  {slug:<18}{r['source']:<18}"
            f"{len(no['ascent'])}a/{len(no['descent'])}d/{len(no['avalanche'])}av"
            + (("   <-- " + "; ".join(flags)) if flags else "")
        )
        if flags:
            problems.append((slug, flags))

    if suspect:
        print("\nfact-checker flagged as suspect:")
        for slug, ps in suspect:
            print(f"  {slug}: {'; '.join(ps)[:300]}")
    if problems:
        print(f"\n{len(problems)} guides need fixing before emit")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
