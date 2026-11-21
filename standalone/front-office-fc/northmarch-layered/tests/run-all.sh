#!/bin/sh
# Build and run every test. Usage: sh tests/run-all.sh
set -e
cd "$(dirname "$0")/.."
node build.js
node tests/save-test.js
node tests/ab-test.js
node tests/idle-test.js
node tests/members-test.js
node tests/staff-test.js
node tests/commercial-test.js
for s in 20261121 1 77 4242; do node tests/sim-test.js $s 20 | tail -4; done
node tests/playtest.js
