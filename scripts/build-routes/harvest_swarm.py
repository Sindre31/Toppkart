"""Collect researched corridors out of the route-research agent transcripts.

Two generations of transcript exist and both are read. The first run returned one
corridor per tour (`route_name` + `trailhead` + `waypoints`); the second returns a
`routes` list per tour, since a peak can have several ways up. Everything is
normalised to the list shape here so the rest of the pipeline only knows one.

Precedence, strongest last:
  1. research from the earlier run
  2. research from the later run
  3. an auditor's `corrected` record — the point of running the verify pass
A tour the auditor marked `suspect` is reported rather than quietly used.
"""

import glob
import json
import os
import sys

# Where the research agents' transcripts live. Session-specific, so it is passed
# in rather than baked in: TOPPKART_WF=<dir> or argv[1].
WF = os.environ.get("TOPPKART_WF") or (sys.argv[1] if len(sys.argv) > 1 else "")


def structured_outputs(path):
    out = []
    with open(path) as f:
        for line in f:
            try:
                d = json.loads(line)
            except ValueError:
                continue
            content = (d.get("message") or {}).get("content")
            if not isinstance(content, list):
                continue
            for b in content:
                if b.get("type") == "tool_use" and "tructured" in str(b.get("name")):
                    out.append(b.get("input") or {})
    return out


def normalise(rec, source):
    """Both transcript generations -> {"routes": [...], "source": ...}."""
    routes = rec.get("routes")
    if routes is None and rec.get("trailhead"):
        # First-generation shape: a single unnamed standard route.
        routes = [
            {
                "id": "normalruta",
                "name": rec.get("route_name") or "Normalruta",
                "primary": True,
                "trailhead": rec["trailhead"],
                "waypoints": rec.get("waypoints") or [],
            }
        ]
    if not routes:
        return None

    clean = []
    for i, r in enumerate(routes):
        if not r.get("trailhead"):
            continue
        clean.append(
            {
                "id": r.get("id") or ("normalruta" if i == 0 else f"rute-{i + 1}"),
                "name": r.get("name") or "",
                "primary": bool(r.get("primary", i == 0)),
                "trailhead": r["trailhead"],
                "waypoints": r.get("waypoints") or [],
                "confidence": r.get("confidence", ""),
                "notes": r.get("notes", ""),
            }
        )
    if not clean:
        return None
    # Exactly one primary, and it goes first — the app reads routes[0] as the one
    # the tour's published figures describe.
    if not any(r["primary"] for r in clean):
        clean[0]["primary"] = True
    clean.sort(key=lambda r: not r["primary"])
    for r in clean[1:]:
        r["primary"] = False
    return {"routes": clean, "source": source}


def main():
    if not WF or not os.path.isdir(WF):
        print(
            "Set TOPPKART_WF (or pass argv[1]) to the directory holding the route-research\n"
            "agent transcripts — the *.jsonl files containing their StructuredOutput calls.\n"
            "corridors.json in this directory is the committed result of a previous run, so\n"
            "this step is only needed when re-running the research.",
            file=sys.stderr,
        )
        return 2

    research, audited, suspect = {}, {}, []

    # Sorted by path so the later run (wf_e1...) overrides the earlier (wf_67...).
    for path in sorted(glob.glob(os.path.join(WF, "*", "agent-*.jsonl"))):
        for payload in structured_outputs(path):
            for rec in payload.get("tours") or []:
                slug = rec.get("slug")
                if not slug:
                    continue
                if "verdict" in rec:
                    verdict = rec.get("verdict")
                    norm = normalise(rec.get("corrected") or {}, f"audited ({verdict})")
                    if not norm:
                        continue
                    if verdict == "suspect":
                        suspect.append((slug, rec.get("problems") or []))
                    audited[slug] = norm
                else:
                    conf = (rec.get("routes") or [{}])[0].get("confidence", "")
                    norm = normalise(rec, f"researched ({conf})" if conf else "researched")
                    if norm:
                        research[slug] = norm

    merged = dict(research)
    merged.update(audited)

    with open("corridors.swarm.json", "w") as f:
        json.dump(merged, f, indent=1, ensure_ascii=False)

    n_routes = sum(len(v["routes"]) for v in merged.values())
    print(
        f"harvested {len(merged)} tours / {n_routes} routes "
        f"({len(audited)} audited, {len(merged) - len(audited)} research-only)"
    )
    for slug, rec in sorted(merged.items()):
        head = rec["routes"][0]
        extra = ", ".join(r["id"] for r in rec["routes"][1:])
        print(
            f"  {slug:<18}{rec['source']:<22}{len(rec['routes'])}r  "
            f"{head['trailhead'].get('elevation_m')} m  {head['trailhead'].get('name','')[:40]}"
            + (f"   + {extra}" if extra else "")
        )
    if suspect:
        print("\nauditor flagged as suspect:")
        for slug, problems in suspect:
            print(f"  {slug}: {'; '.join(problems)[:400]}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
