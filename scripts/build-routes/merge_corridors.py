"""Fold researched corridors for the new peaks into corridors.json.

Input is `new_corridors.json`: one record per peak, in the shape the research
pass returns —

  {"slug": …, "verdict": "ok" | "corrected" | "reject", "corrections": [...],
   "corridor": {"routeId", "routeName", "routeDescriptionFull", "trailhead":
   {"name","lat","lng","elevationM"}, "waypoints": [...], "season", "aspect",
   "grade", "hazardNotes", "teaserNo", "teaserEn", "sources", "confidence"}}

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
        th = c["trailhead"]
        corridors[slug] = {
            "routes": [
                {
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
                    # The 24 audited corridors say "audited (ok)"; these say what
                    # they are, so nobody reads a second batch as a first one.
                    "source": f"researched, verified ({rec.get('verdict', '?')}), no local audit",
                    "notes": c.get("hazardNotes", ""),
                }
            ]
        }
        meta[slug] = {
            "season": c.get("season", ""),
            "aspect": c.get("aspect", ""),
            "grade": c.get("grade"),
            "gradeReason": c.get("gradeReason", ""),
            "roadClosedInWinter": c.get("roadClosedInWinter", False),
            "teaserNo": c.get("teaserNo", ""),
            "teaserEn": c.get("teaserEn", ""),
            "hazardNotes": c.get("hazardNotes", ""),
            "sources": c.get("sources", []),
            "confidence": c.get("confidence", ""),
            "corrections": rec.get("corrections", []),
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
