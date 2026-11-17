# The Front Office — complete UX + decision-system rebuild audit

**Status:** Source-mapped architecture and implementation backlog; **not** a completed game redesign and **not** a runtime-certified 100% audit. Scope is exclusively the chatgpt branch.

## Read in order

1. [Executive review](00-EXECUTIVE-REVIEW.md) — systemic diagnosis, design decisions and unverified hypotheses.
2. [Complete UI function/screen inventory](01-COMPLETE-SCREEN-INVENTORY.md) — every numbered UI fragment and 166 function entry points.
3. [Decision engine audit](02-DECISION-ENGINE-AUDIT.md) — 105 statically registered event/brief keys plus specialized decision sources.
4. [Gameplay loops](03-GAMEPLAY-LOOPS.md) — founding, summer, weekly play, Matchday and seasonal consequences.
5. [Information architecture](04-INFORMATION-ARCHITECTURE.md) — global navigation, responsibilities, six department contracts.
6. [Every-screen specification](05-EVERY-SCREEN-SPECIFICATION.md) — 197 individually named player-facing screen/state design targets.
7. [Mobile wireframes](06-WIREFRAMES.md) — 24 page/decision/family patterns plus conditional variants.
8. [Decision engine redesign](07-DECISION-ENGINE-REDESIGN.md) — CaseView, authority, conversation types, idempotency, follow-through and migrations.
9. [Implementation roadmap](08-IMPLEMENTATION-ROADMAP.md) — 47 code work items in dependency order.
10. [Coverage and traceability](09-COVERAGE-AND-TRACEABILITY.md) — evidence status and unfinished runtime gap checks.
11. [Complete Action Registry](10-ACTION-REGISTRY.md) — 125 dispatcher cases and local effects.
12. [UI action callsites](11-ACTION-CALLSITES.md) — literal data-a references in all UI fragments.

## Nonnegotiable scope

Founding; six accountable heads and their specialist staff; summer and preseason; press; Desk; Player/Squad/League; Club and finance; **First Team, Recruitment, Academy, Commercial, Marketing, Business**; conversations, personnel, authority, escalations, board proposals, employee work, Matchday, Gazette, season review and save/restart.

## First code milestone

Instrument route and action coverage, then create a normalized **read-only** case adapter over existing engines before rewriting UI or decision persistence. Code and saved states stay unchanged by this audit.

## Evidence discipline

Function, screen/state, event and action are four different unit types. No browser tests, no per-event counterfactual playtests and no gameplay code were executed in this audit. Claiming complete runtime coverage would be inaccurate. The explicit completion protocol is in 09.
