#!/usr/bin/env bash
# Mandatory synchronisation check: run it BEFORE every code change and BEFORE every publication.
# GitHub decides the truth, not a conversation. Exit code 0 = safe to continue, 1 = stop and sync first.
#   scripts/sync-check.sh             before a code change
#   scripts/sync-check.sh --publish   before an artifact/release publication (stricter)
set -u
OFFICIAL="${OFFICIAL_BRANCH:-slimline-main}"
MODE="${1:-}"
cd "$(git rev-parse --show-toplevel)" || exit 1
fail(){ echo "STOP: $*" >&2; exit 1; }

git fetch -q origin "$OFFICIAL" 2>/dev/null || fail "cannot fetch origin/$OFFICIAL (no network or branch missing)"
HEAD_SHA=$(git rev-parse HEAD); TIP=$(git rev-parse "origin/$OFFICIAL")
STATE=$(git ls-files --full-name -- '*docs/DEV_STATE.md' | head -1)
echo "branch      : $(git rev-parse --abbrev-ref HEAD) @ ${HEAD_SHA:0:7}"
echo "official    : origin/$OFFICIAL @ ${TIP:0:7}"

# 1. the official branch must be contained in what we build on: otherwise we are behind or diverged
if ! git merge-base --is-ancestor "$TIP" "$HEAD_SHA"; then
  BEHIND=$(git rev-list --count "$HEAD_SHA..$TIP")
  fail "you are $BEHIND commit(s) behind origin/$OFFICIAL. Sync first: git merge origin/$OFFICIAL, resolve conflicts openly, build, then continue. No silent overwrites."
fi
# 2. the SHA recorded in DEV_STATE.md must be part of our history
if [ -n "$STATE" ] && [ -f "$STATE" ]; then
  REC=$(grep -m1 '^OFFICIAL_SHA:' "$STATE" | awk '{print $2}')
  if [ -n "$REC" ] && git cat-file -e "$REC^{commit}" 2>/dev/null; then
    git merge-base --is-ancestor "$REC" "$HEAD_SHA" || fail "DEV_STATE.md names official SHA $REC, which is not in this branch's history"
    echo "DEV_STATE   : official SHA $REC is in our history"
  fi
fi
AHEAD=$(git rev-list --count "$TIP..$HEAD_SHA"); echo "ahead       : $AHEAD commit(s) not yet in origin/$OFFICIAL"
DIRTY=$(git status --porcelain | grep -v '^??' | wc -l | tr -d ' ')
[ "$DIRTY" != "0" ] && echo "note        : $DIRTY uncommitted change(s)"

if [ "$MODE" = "--publish" ]; then
  # 3. a publication must be exactly the official SHA, built from a clean tree
  [ "$HEAD_SHA" = "$TIP" ] || fail "not publishing from $(echo ${HEAD_SHA:0:7}): only the official tip ${TIP:0:7} may be published. Merge via pull request first."
  [ "$DIRTY" = "0" ] || fail "uncommitted changes: publish only what is committed"
  echo "PUBLISH OK  : record artifact SHA ${TIP:0:7} in docs/DEV_STATE.md"
fi
echo "OK: in sync with origin/$OFFICIAL"
