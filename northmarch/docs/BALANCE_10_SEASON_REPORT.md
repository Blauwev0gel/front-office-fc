# Northmarch — 10-season balance execution report

Date: 2026-11-22. Scope: existing V18.4 engine, also underlying V18.5; **not a complete browser or save/load audit**.

## Executed (seed 1804, same starting club c27)
One 10-season run per strategy. Project commands used the actual `projectCatalog` keys; construction/finance/football simulation advanced through `advanceWeek` and `closeSeason`.

| Strategy | Accepted | Denied | End cash (£k) | End squad strength | End tier |
| --- | ---: | ---: | ---: | ---: | ---: |
| Passive / no investment | 0 | 0 | 657.68 | 60.71 | 1 |
| Training / medical | 9 | 1 | 248.23 | 53.35 | 0 |
| Commercial / clubhouse | 10 | 0 | 634.44 | 59.15 | 0 |
| Academy / scouting | 6 | 3 | 642.69 | 59.01 | 1 |

Notes:
- Training signal rose from 5.6 after season one to 10.2 by season ten in the sporting strategy; squad strength declined from 54.19 to 53.35. This does not prove training hurts: ageing, squad churn, finances and random outcomes confound.
- Passive training remained approximately 4.1–4.4. Passive squad strength rose to 60.71, suggesting passive development/recruitment is strong enough to compete with deliberate investment in this seed.
- Academy strategy raised the academy signal from 0.9 to 7.9. Scouting remained at 0.9 because only one free plot was available and it was used for the academy. A single youth+scouting strategy is therefore not a valid test of scouting ROI.
- In the sporting scenario, the club changed tier repeatedly. Tier is not itself proof of a consistent promotion trend.
- Cash is in thousands of pounds. The different random trajectories mean the table cannot be read as isolated causal effects.

## Code-level mechanism review
- `playersWeek`: training modifies `grow=(.12+.08*t)*coachGrowth(...)/SEASON_WEEKS`. Young players develop toward potential; established/ageing players can still decline. The *average squad* is not the same as youth development.
- `playersSeasonEnd`: contract expiries, retirements, academy intake and player releases materially alter the squad each year. Comparing training to team strength alone is insufficient.
- `groundWeek` books construction through `financeWeek`; `finishProject` increases facility levels after permit/build phases.
- `groundSignals` depends on facility condition, staff and budget, so the headline upgrade level is not its whole effect.
- Academy intake increases with signal thresholds (at least 3 and 6) and raises youth quality/potential. Track subsequent first-team apps and sales before claiming ROI.
- Stadium licensed capacity is bounded by safety/access, independently of raw seats. Upgrading stands alone may not increase paid attendance.
- The passive club retained substantial cash while finishing with strong squad quality in the observed run. **This is a balance risk, not yet a validated defect.**

## Work completed on audit branch
- `docs/BALANCE_SPRINT_PROMPT.md`: execution specification, hypotheses and release gates.
- `test/progression.js`: fixed facility matching, added new-build academy/scouting keys, ten-season horizon, annual club/finance/squad/facility/youth diagnostics, configurable seeds and individual strategy batches. JavaScript syntax checked.
- No gameplay formulas changed. No Pages deployment or GitHub Actions runs requested.

## Remaining validation
1. Run modular `build.py`, `smoke.js` and the new test harness locally; the source-backed script is not yet executed end-to-end in Node.
2. Run five seeds per strategy (20 ten-season scenarios) and inspect within-seed differences, denials, project costs and club continuity.
3. Isolate training, youth and commercial effects using controlled state perturbations; separate revenue from costs.
4. Validate youth graduates, scouting availability, and save/load + mobile click paths.
5. Only then change balancing constants, with before/after regression runs.

## How to run without GitHub Actions
```bash
python3 northmarch/build.py
node northmarch/test/smoke.js
node northmarch/test/progression.js /tmp/northmarch-control.json control 5
node northmarch/test/progression.js /tmp/northmarch-sporting.json sporting 5
node northmarch/test/progression.js /tmp/northmarch-commercial.json commercial 5
node northmarch/test/progression.js /tmp/northmarch-youth.json youth 5
```

**Release decision: HOLD.** The data is insufficient to justify changing progression formulas or claiming the entire game is balanced.
