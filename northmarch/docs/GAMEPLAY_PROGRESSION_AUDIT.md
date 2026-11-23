# Northmarch — Gameplay & progression audit (V18.5 preparation)

## Status
Code inspected on main: ground.js, finance.js, players.js, recruitment.js, clock.js, board.js and smoke.js. A new experiment harness lives at `test/progression.js`. **It has not yet been executed or validated in a local Node environment.** Do not interpret its presence as passing tests or as a balance verdict. No production gameplay/UI changed.

## Causal graph (existing code)
- Ground construction: `projectCatalog` -> `StartProject` command -> `groundWeek` -> `groundSignals`.
- Training: `groundSignals.training` -> `playersWeek` growth and decline modifiers -> squad strength -> match inputs.
- Medical: `groundSignals.medPrev/medRec` -> `playersWeek` injury risk/duration -> available players.
- Scouting: `groundSignals.scouting` -> `scoutWeek` / candidate information -> recruitment decisions. This is an *indirect* route to squad improvement.
- Academy: `groundSignals.academy` -> youth intake/development; verify strength and frequency in youth.js before claiming measured return.
- Stadium and commercial: capacity/business/shop/sales signals -> matchday and weekly finance inputs; `financeWeek` books expenses and construction, `cashForecast` estimates liquidity.
- Week: `advanceWeek` orchestrates match, development, finance, directors, scouting, events; `playWeeks` allows advancing without forcing weekly decisions.
- Existing UI: `clubHubTile`, `IMPROVEMENT_ROUTES` and `buildView` already expose some progression, but are fragmented.

## UX hypothesis
Choose a **hybrid home**, not nine equally weighted tiles:
1. Permanent score strip: position, available cash, squad strength, recent form.
2. Dominant next-fixture CTA; match -> report/newspaper -> return home.
3. Four to six priority club tiles; additional departments in one expandable directory.
4. Maximum one contextually important notice; no fabricated urgency.
5. Each department: current performance, division benchmark, one actionable improvement, real cost, lead time, recurring cost, predicted mechanism.
6. Drill-down for detailed finance, staff and projects; never duplicate game state.

## Measurement protocol
Run locally from repository root:
```
python3 northmarch/build.py
node northmarch/test/smoke.js
node northmarch/test/progression.js northmarch-progression-results.json
```
Compare five seeds across twenty seasons, four strategies: control, sporting, commercial, youth. Inspect output and verify the run completes before publishing conclusions.

**Known experiment limitations**:
- One attempted project per season is a deliberately simplified strategy, not an optimized chairman policy.
- Each strategy may invest unequal sums; compare spend before interpreting outcomes.
- A fixed seed does not guarantee paired random trajectories after decisions change the number/order of RNG calls.
- Club ownership may change after AGM; inspect club continuity before causal claims.
- `tier` ordering must be checked before labeling smaller/larger values as promotion.
- Five seeds is a smoke-level sample, not a statistical power guarantee.
- If the test throws, fix the harness before discussing results; do not silently replace missing data.

## Acceptance gates for future V18.5
- Gameplay and finances still pass existing smoke test.
- No second economy, progression state or match engine.
- Home -> match -> newspaper -> home in a few obvious taps on mobile.
- All displayed upgrade costs/benefits derived from real engine values, no illustrative values in production.
- Action consequences appear in next relevant weekly/seasonal report.
- Every tile has a real destination and back navigation.
- Save/load survives a project in progress.
- Manual mobile playtest: first fixture reachable immediately, no compulsory admin, readable text, no clipped controls.
- Keep rollback `releases/northmarch/v18.4.html` intact.
- No GitHub Actions workflow changes or unnecessary remote runs.

## Decision
Do not implement a UI redesign until the experiment script runs and the benefit pathways are measured. A hybrid dashboard is the leading **hypothesis**, not yet an accepted UI design.
