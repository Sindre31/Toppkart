"""Fold researched corridors for the new peaks into corridors.json.

Input is `new_corridors.json`: one record per peak, in the shape the research
pass returns —

  {"slug": …, "verdict": "ok" | "corrected" | "reject", "corrections": [...],
   "corridor": {"routeId", "routeName", "routeDescriptionFull", "trailhead":
   {"name","lat","lng","elevationM"}, "waypoints": [...], "season", "aspect",
   "grade", "hazardNotes", "teaserNo", "teaserEn", "sources", "confidence"}}

A corridor may carry an `alternates` list of the same shape — a second documented
way up, with its own trailhead and waypoints and a `note` saying what it is. They
are appended after the primary, which stays first because it is the route the
tour's `verticalM` and `duration` describe.

Everything outside the corridor itself — season, aspect, grade, teasers — is kept
in `new_tourmeta.json` rather than dropped, because it is what the tour rows in
lib/tours.ts are written from, and it should be reviewable next to the geometry
it was researched with.

A record with verdict "reject" is written to neither file: a peak with no
defensible corridor does not go on the map.
"""

import json
import os

CORRIDORS = "corridors.json"
IN = "new_corridors.json"
META = "new_tourmeta.json"


def route_rec(c, source, note=""):
    """One corridor route in the shape generate_routes.py reads."""
    th = c["trailhead"]
    return {
        "id": c.get("routeId") or "normalruta",
        "name": c["routeName"],
        "description": c.get("routeDescriptionFull", c["routeName"]),
        "trailhead": {
            "name": th["name"],
            "lat": round(float(th["lat"]), 5),
            "lng": round(float(th["lng"]), 5),
            "elevation_m": round(float(th["elevationM"]), 2),
            "fullName": th["name"],
        },
        "waypoints": [
            {
                "name": w["name"],
                "lat": round(float(w["lat"]), 5),
                "lng": round(float(w["lng"]), 5),
                "elevation_m": round(float(w["elevationM"]), 2),
            }
            for w in c.get("waypoints") or []
        ],
        # The 24 audited corridors say "audited (ok)"; these say what they are, so
        # nobody reads a second batch as a first one.
        "source": source,
        "notes": note or c.get("hazardNotes", ""),
    }


def main():
    records = json.load(open(IN))
    corridors = json.load(open(CORRIDORS)) if os.path.exists(CORRIDORS) else {}
    meta = json.load(open(META)) if os.path.exists(META) else {}

    kept = rejected = 0
    for rec in records:
        slug = rec["slug"]
        if rec.get("verdict") == "reject":
            print(f"  reject {slug}: {rec.get('rejectReason', '')[:110]}")
            rejected += 1
            continue
        c = rec["corridor"]
        source = f"researched, verified ({rec.get('verdict', '?')}), no local audit"
        # A peak researched with two documented starts carries both, the primary
        # first — the same rule `ALTERNATES` in build_corridors.py follows for the
        # first 24, and it needs a way in here too because that module is fed by
        # a swarm file this batch has no equivalent of. Høgevarde is the case:
        # Tempelseter and Norefjellstua are nine kilometres and 85 vertical metres
        # apart, and each has its own published route description.
        routes = [route_rec(c, source)]
        for alt in c.get("alternates") or []:
            routes.append(route_rec(alt, source, note=alt.get("note", "")))
        corridors[slug] = {"routes": routes}
        # Three fields are revised downstream and must survive a re-merge.
        #
        # `corrections` accumulate: the adversarial read of the written guides and
        # the re-measurement after a summit moved both appended their findings
        # here, and `check_guides.py` treats them as the source for the figures in
        # the prose. Replacing the list wholesale silently unsources every number
        # a later pass measured.
        #
        # The two teasers are drafted from the research and then rewritten against
        # the routed gain — the research figure is a straight-line estimate, and
        # resetting a shipped teaser to it puts a wrong number on the tour card.
        prev = meta.get(slug) or {}
        corrections = list(prev.get("corrections") or [])
        for note in rec.get("corrections", []):
            if note not in corrections:
                corrections.append(note)
        meta[slug] = {
            "season": c.get("season", ""),
            "aspect": c.get("aspect", ""),
            "grade": c.get("grade"),
            "gradeReason": c.get("gradeReason", ""),
            "roadClosedInWinter": c.get("roadClosedInWinter", False),
            "teaserNo": prev.get("teaserNo") or c.get("teaserNo", ""),
            "teaserEn": prev.get("teaserEn") or c.get("teaserEn", ""),
            "hazardNotes": c.get("hazardNotes", ""),
            "sources": c.get("sources", []),
            "confidence": c.get("confidence", ""),
            "corrections": corrections,
            "notes": c.get("notes", ""),
        }
        kept += 1

    with open(CORRIDORS, "w") as f:
        json.dump(corridors, f, indent=1, ensure_ascii=False)
    with open(META, "w") as f:
        json.dump(meta, f, indent=1, ensure_ascii=False)
    print(f"\n{CORRIDORS}: {len(corridors)} tours ({kept} merged, {rejected} rejected)")


if __name__ == "__main__":
    main()
