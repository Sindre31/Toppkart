"""Re-read tourmeta.json from lib/tours.ts.

`tourmeta.json` is the pipeline's copy of the tour list: `guide_facts.py` takes
the claimed summit height from it, `emit_ts.py` takes the order of ROUTES from
it, and `generate_routes.py` checks a routed gain against its `verticalM`. The
app reads none of it — `lib/tours.ts` is what ships — so the two drift the moment
a tour row is corrected by hand, and the drift is silent: a guide's elevation
profile keeps labelling the summit with the height the copy still holds.

Folarskardnuten is the case that showed it. Its summit moved 821 m and 5 m up,
`lib/tours.ts` was corrected, and the profile under the guide went on reading
"1927 moh" because `summitClaimM` comes from here.

Run after any hand edit to the tour rows, and before `guide_facts.py`.
"""

import json
import re

TOURS = "/home/user/Toppkart/lib/tours.ts"
META = "tourmeta.json"

ROW = re.compile(
    r'\{ slug: "(?P<slug>[a-z0-9-]+)", name: "(?P<name>[^"]*)", region: "(?P<region>[^"]*)", '
    r"lat: [-\d.]+, lng: [-\d.]+, summitM: (?P<summitM>\d+), verticalM: (?P<verticalM>\d+), "
    r'duration: "(?P<duration>[^"]*)", grade: (?P<grade>\d+), aspect: "(?P<aspect>[^"]*)", '
    r'season: "(?P<season>[^"]*)", hasGuide: (?P<hasGuide>true|false)'
)


def main():
    rows = [m.groupdict() for m in ROW.finditer(open(TOURS).read())]
    if not rows:
        raise SystemExit("no tour rows parsed — has the row format changed?")
    old = json.load(open(META))

    out, changed = {}, []
    for r in rows:
        slug = r["slug"]
        rec = {
            "name": r["name"],
            "region": r["region"],
            "summitM": int(r["summitM"]),
            "verticalM": int(r["verticalM"]),
            "duration": r["duration"],
            "grade": int(r["grade"]),
            "aspect": r["aspect"],
            "season": r["season"],
            "hasGuide": r["hasGuide"] == "true",
        }
        was = old.get(slug)
        if was != rec:
            diff = {k: (was or {}).get(k) for k, v in rec.items() if (was or {}).get(k) != v}
            changed.append((slug, {k: (v, rec[k]) for k, v in diff.items()}))
        out[slug] = rec

    # Tours that are routed but not published keep their entry: this file is the
    # pipeline's list, and dropping a peak here would drop it from routes.json.
    for slug, rec in old.items():
        out.setdefault(slug, rec)

    with open(META, "w") as f:
        json.dump(out, f, indent=1, ensure_ascii=False)
    print(f"{META}: {len(out)} tours, {len(changed)} updated from lib/tours.ts")
    for slug, diff in changed:
        print(f"  {slug:<18}" + ", ".join(f"{k}: {a} -> {b}" for k, (a, b) in diff.items()))


if __name__ == "__main__":
    main()
