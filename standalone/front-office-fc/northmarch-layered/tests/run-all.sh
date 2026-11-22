#!/bin/sh
# Deep suite (30-45 minutes): every statistical test over many seeds. Run at milestones only; use tests/run-fast.sh after normal changes.
set -e
run(){ out=$("$@" 2>&1); code=$?; echo "$out" | tail -6; [ $code -eq 0 ] || { echo "FAILED: $*"; exit 1; }; }
cd "$(dirname "$0")/.."
node build.js
node tests/pyramid-test.js
node tests/foreign-world-test.js
node tests/save-test.js
node tests/smoke-test.js
node tests/ab-test.js
node tests/idle-test.js
node tests/members-test.js
node tests/staff-test.js
node tests/commercial-test.js
node tests/life-test.js
node tests/projects-test.js
node tests/ux-test.js
run node tests/strategy-test.js 5 5
for s in 20261121 1 77 4242; do run node tests/sim-test.js $s 20; done
node tests/playtest.js
