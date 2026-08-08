#!/usr/bin/env bash
# Retrace every tour whose trail data has landed, in waves, until all are done.
#
# The Overpass fetch runs at about a tour a minute and the retrace at about two
# minutes a route, so waiting for the whole download before starting the solve
# leaves three cores idle for an hour. This picks up whatever is cached, solves
# it on two workers, and goes round again for whatever arrived meanwhile.
#
# Each wave writes its own report; `retrace_trails.py --apply` merges them.
set -u
cd "$(dirname "$0")"

wave=0
while :; do
  python3 - "$wave" <<'PY'
import glob, json, os, sys
wave = sys.argv[1]
routes = json.load(open('routes.json'))
have = {os.path.basename(p)[len('trails_'):-len('.json')] for p in glob.glob('cache/trails_*.json')}
done = set()
for p in glob.glob('/tmp/retrace*.json'):
    for key in json.load(open(p)):
        done.add(key)
todo = sorted(
    s for s, recs in routes.items()
    if all(f"{s}_{r['id']}" in have for r in recs)
    and not all(f"{s}_{r['id']}" in done for r in recs)
)
half = (len(todo) + 1) // 2
open(f'/tmp/wave{wave}_1.txt', 'w').write(' '.join(todo[:half]))
open(f'/tmp/wave{wave}_2.txt', 'w').write(' '.join(todo[half:]))
print(len(todo))
PY
  n=$(cat /tmp/wave${wave}_1.txt /tmp/wave${wave}_2.txt | wc -w)
  if [ "$n" -eq 0 ]; then
    # Nothing ready. Either the fetch is still going, or everything is done.
    if pgrep -f "[t]rails.py" >/dev/null; then sleep 60; continue; fi
    echo "all waves complete"
    break
  fi
  echo "wave $wave: $n tours"
  for half in 1 2; do
    list=$(cat /tmp/wave${wave}_${half}.txt)
    [ -n "$list" ] || continue
    stdbuf -oL python3 retrace_trails.py --out /tmp/retraceW${wave}_${half}.json $list \
      > /tmp/retraceW${wave}_${half}.log 2>&1 &
  done
  wait
  wave=$((wave + 1))
done
