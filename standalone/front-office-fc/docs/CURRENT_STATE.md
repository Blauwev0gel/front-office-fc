# Current State — 18 November 2026

## Current standalone candidate
**Module 2.2 — Native Mobile Game UI**, local source `front-office-fc-module2-2-native-game.html` (71 KB approximately). **Not yet uploaded to this GitHub branch.** Therefore **no GitHub-hosted playable standalone release** is currently verified.

## Present systems (source inspection and prior development reports)
- 8-club league and match-week flow.
- Match engine, ticker, 1×/2×/4×/8× playback and Full Time.
- TD candidates, sporting direction, limited autonomous squad development.
- Home, Squad, Staff, Club, League and match screens.
- Local save and season transitions.

These are descriptions of the local build, **not fresh browser validation in this GitHub consolidation**.

## Test evidence
Previous sessions reported simulation and mobile-browser checks. Those claims are **not independently reproduced in this consolidation**. Historical local scripts exist, but have not been added here as reproducible CI.

## Current constraints
- Existing repository branches and live game are entirely separate.
- Current 2.2 HTML must be archived and independently validated before marking this track as a playable GitHub release.
- Sporting director decisions are still relatively shallow.
- Safari save/reopen behaviour is not independently validated.

## Next recommended milestone
**Release provenance + independent regression test first**: commit exact 2.2 HTML without gameplay edits; validate new game, TD appointment, navigation, 5-week play, match playback, reload, full season and season transition. Only then decide the next gameplay module.

## Release restrictions
Do not edit `main`, `chatgpt`, `claude-game`, the research branch, existing files, PRs, workflows or deployments. New files only under `standalone/front-office-fc/` on a separate branch.

## Last updated
2026-11-18. Commit SHA to be recorded after publishing.
