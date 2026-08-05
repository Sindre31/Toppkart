"""Fold the research notes and audit findings back into guide_facts.json.

The corridor pipeline only needed coordinates, so the verdict schema dropped the
prose — but for writing a guide the prose IS the material: it is where the
cornices, cliff bands and measured steep sections are recorded. Pull it back out
of the agent transcripts, and pick up the teasers from lib/tours.ts while here.
"""
import glob, json, os, re

WF = ("/root/.claude/projects/-home-user-Toppkart/"
      "0580f52e-11d8-524c-86b8-7b383e97f1aa/subagents/workflows")

notes = {}      # slug -> research notes (per route id)
findings = {}   # slug -> auditor problems

for path in sorted(glob.glob(os.path.join(WF, "*", "agent-*.jsonl"))):
    for line in open(path):
        try: d = json.loads(line)
        except ValueError: continue
        c = (d.get("message") or {}).get("content")
        if not isinstance(c, list): continue
        for b in c:
            if b.get("type") != "tool_use" or "tructured" not in str(b.get("name")): continue
            for t in (b.get("input") or {}).get("tours", []):
                slug = t.get("slug")
                if not slug: continue
                if "verdict" in t:
                    ps = [p for p in (t.get("problems") or []) if p]
                    if ps: findings.setdefault(slug, []).extend(ps)
                else:
                    for r in (t.get("routes") or []):
                        if r.get("notes"):
                            notes.setdefault(slug, {})[r.get("id","normalruta")] = r["notes"]
                    if t.get("notes"):  # first-generation shape
                        notes.setdefault(slug, {})["normalruta"] = t["notes"]

# The fifteen tours added after the first round were audited into tracked files
# rather than left in transcripts, so their findings can be read straight off
# disk. Same material, same role: the measured flank angles, the corrected
# cornice sides and the rejected first drafts a guide is entitled to quote.
for rec in json.load(open("new_corridors.json")):
    ps = [p for p in (rec.get("corrections") or []) if p]
    if ps:
        findings.setdefault(rec["slug"], []).extend(ps)
for slug, m in json.load(open("new_tourmeta.json")).items():
    extra = [p for p in (m.get("corrections") or []) if p]
    for key in ("gradeReason", "hazardNotes", "notes"):
        if m.get(key):
            extra.append(m[key])
    if extra:
        findings.setdefault(slug, []).extend(extra)

# Terrain measured after the fact, for any tour. The first round's research lives
# in transcripts, so a figure measured later — a flank beside the track, a face
# below a summit — had nowhere to be written down, and twelve of them sat in the
# check as unsourced numbers because of it.
for slug, records in json.load(open("measurements.json")).items():
    if slug.startswith("_"):
        continue
    for m in records:
        findings.setdefault(slug, []).append(
            f"Målt: {m['what']} — {m['figure']}. {m['how']}"
        )

# teasers straight out of the shipped source
teasers = {}
src = open("/home/user/Toppkart/lib/tours.ts").read()
for m in re.finditer(r'slug: "([^"]+)".*?teaser: "((?:[^"\\]|\\.)*)"', src):
    teasers[m.group(1)] = m.group(2).replace('\\"', '"')

f = json.load(open("guide_facts.json"))
n_notes = n_find = n_teas = 0
for slug, t in f.items():
    if slug in teasers and teasers[slug]:
        t["teaser"] = teasers[slug]; n_teas += 1
    for r in t["routes"]:
        got = (notes.get(slug) or {}).get(r["id"])
        if got and not r.get("researchNotes"):
            r["researchNotes"] = got; n_notes += 1
    if slug in findings:
        t["auditFindings"] = findings[slug]; n_find += 1

json.dump(f, open("guide_facts.json", "w"), ensure_ascii=False, indent=1)
print(f"teasers restored: {n_teas}/{len(f)}")
print(f"routes given research notes: {n_notes}")
print(f"tours given audit findings: {n_find}/{len(f)}")
missing = [s for s, t in f.items() if not t["routes"][0].get("researchNotes") and s not in findings]
print("still with no prose at all:", missing or "none")
