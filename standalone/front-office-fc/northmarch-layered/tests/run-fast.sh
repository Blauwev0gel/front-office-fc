#!/bin/sh
# Fast suite (under a minute): run after every change. Deterministic checks only.
# The statistical deep suite (A/B tests over many seeds, strategies, 20-season sims) is tests/run-all.sh: run it at milestones.
cd "$(dirname "$0")/.."
run(){ out=$("$@" 2>&1); code=$?; if [ $code -ne 0 ]; then echo "$out"; echo "FAILED: $*"; exit 1; fi; echo "$out" | tail -1; }
run node build.js
run node tests/save-test.js
run node tests/ux-test.js
run node tests/smoke-test.js
run node tests/l25-test.js
run node tests/youth-test.js
run node tests/story-test.js
run node tests/slimline-test.js 4 101 202
run node tests/sim-test.js 20261121 20
run node tests/playtest.js light
echo "fast suite: all passed"
