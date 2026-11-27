#!/bin/sh
# Fast suite (under a minute): run after every change. Deterministic checks only.
# The statistical deep suite (A/B tests over many seeds, strategies, 20-season sims) is tests/run-all.sh: run it at milestones.
cd "$(dirname "$0")/.."
run(){ out=$("$@" 2>&1); code=$?; if [ $code -ne 0 ]; then echo "$out"; echo "FAILED: $*"; exit 1; fi; echo "$out" | tail -1; }
run node build.js
run node tests/pyramid-test.js
run node tests/foreign-world-test.js
run node tests/save-test.js
run node tests/ux-test.js
run node tests/department-ownership-test.js
run node tests/base-briefing-test.js
run node tests/smoke-test.js
run node tests/l25-test.js
run node tests/first-summer-test.js
run node tests/youth-test.js
run node tests/story-test.js
run node tests/slimline-test.js 4 101 202
run node tests/l3-test.js
run node tests/l3-s32-test.js
run node tests/l3-people-test.js
run node tests/player-data-test.js
run node tests/money-test.js
run node tests/layer-isolation-test.js
run node tests/base-isolation-test.js
run node tests/sim-test.js 20261121 20
[ -n "$SKIP_BROWSER" ] || run node tests/playtest.js light  # CI sets SKIP_BROWSER=1 (no browser there)
echo "fast suite: all passed"
