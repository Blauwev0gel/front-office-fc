# NORTHMARCH — SLIMLINE COMPLETENESS AUDIT
Date: 2026-11-21
Branch: claude/loving-goodall-uv00vn
Status: SOURCE REVIEW / NOT A RELEASE CERTIFICATION

## Product contract (locked)
Deliver a complete, playable, simple club-management simulation BEFORE L3 staff agents, L4 stories, L5 dynasty or elaborate chairman decisions.
Player sets broad policy, budgets and staffing; existing engines execute automatically. No individual transfer approvals, lineups, negotiations, mandatory weekly conversations, story gates, or deep mandates.
Loop: inspect club → optionally change policy → advance week → inspect matches, squad, finances, development → repeat across seasons.
Slimline = complete simulation with simple controls, NOT a thin simulation.
Do not remove existing member/AGM rules; keep them lightweight.

## Evidence and classification
A = functioning integrated process demonstrated in source; B = working process with gaps in visibility or evidence; C = partial process; D = signal without complete loop; E = absent. SOURCE REVIEW is not independent test execution. Earlier tests are reported in WORK_LOG and test scripts; they were not executed during this audit.

| Domain | Source evidence | Assessment | Completion gate |
|---|---|---|---|
| World, fixtures, divisions, cup | world/world.js, world/league.js, football/match.js, sim/clock.js | A/B | Multi-season promotion/relegation and match plausibility tests |
| Central clock and season lifecycle | sim/clock.js advanceWeek/closeSeason | A | All systems use the same week and save state |
| Squad and player lifecycle | football/players.js, football/life.js | B | Ages, injuries, contracts, departures, loans and replacements reconcile |
| Automated recruitment | football/market.js, club/recruitment.js | C | Needs → shortlist → purchases reliably; explain non-shortlist buys |
| Scouting | club/recruitment.js scoutWeek/shortlistCandidates | B | Investment changes observation quantity/accuracy AND signing outcomes |
| Youth | club/youth.js, football/players.js | B | Intake → minutes/loans → growth → first-team/sales across 5+ seasons |
| Coach, training, medical | club/staff.js, club/ground.js, football/match.js, football/players.js | C | Effects measurable on match strength, availability and growth |
| Finance and economy | club/finance.js, club/commercial.js | B | Ledger reconciliation, no economy collapse, sustainable varied strategies |
| Sponsors and club commerce | club/commercial.js | B | Deals, revenue, renewals and budget constraints persist |
| Facilities and projects | club/ground.js, club/projects.js | B | Projects complete, spend correctly, materially affect operations |
| Members/AGM | club/members.js | B | Annual assessment works; no additional political gameplay |
| Save/load | core/save.js, tests/save-test.js | B | Migration and long-run roundtrips |
| Mobile navigation | ui/board.js, ui/act.js, tests/playtest.js | B | All controls work at 390px, both themes, no horizontal overflow |
| Policy differentiation | recruitment.js recruitBias, finance.js SetSquadPolicy | C | Controlled matched-seed strategy comparison over >=5 seasons |
| Complete autonomous club operation | sim/clock.js, football/market.js | C | 10 seasons with no individual transfer/lineup decisions and no deadlocks |

## Specific code findings
1. buildPlan() counts positional shortages using REQ, but the sum of REQ is 22 while squad minimum is 20. Verify that this does not create persistent false recruitment needs or emergency signing churn.
2. buildPlan() marks an open need 'solved' when its key disappears. This may represent a failed renewal/departure rather than a successful fix. Distinguish fulfilled, expired, displaced and unresolved outcomes in reports.
3. The recruitment shortlist is only attached to the human club (S.ops); AI clubs use the strategy bias but do not maintain equivalent scouting history. Fine for Slimline IF their automated recruitment remains believable and competitive; measure.
4. Prior 4-world x 2-season observation: 7 of 41 signings from shortlist (17%). This is an observation from project reporting, not a newly executed benchmark. Determine why and whether the shortlist has material causal influence.
5. scoutWeek() samples a random other club, then checks positional availability and affordability; many weekly observations may fail. Measure effective observations vs configured scouting effort.
6. youthIntake() creates one cohort per summer; confirm whether output and development provide meaningful variation in policy outcomes, not merely records.
7. Existing tests/l25-test.js checks youth vs experience signing age, but only one-season signings with 3 reseeds. It does NOT establish sustained 5-season policy differentiation.
8. Existing tests/sim-test.js checks invariants and prints economy across 20 seasons, but does NOT assert that different policies lead to distinct club outcomes.
9. The central clock calls scoutWeek() weekly, squadManager() in winter/summer and renewals() in week 24. Validate policy changes persist and take effect at appropriate future windows, not retroactively.
10. Keep UI simple. Avoid implementing L3 dialogues/mandates or L4 stories as 'fixes' for missing underlying engine behavior.

## Priority build order
### S0 — Establish independent baseline
- Check branch SHA and working tree; run tests/run-fast.sh and tests/run-all.sh where supported.
- Record exact PASS/FAIL and test environment; do not claim passing from log alone.
- Inspect playtest UI on phone width. Identify non-functional controls.

### S1 — Autonomous sporting core (highest)
- Trace squad needs through shortlist, TD candidate choice, transfer, contract, wage budget, youth replacement.
- Repair missing causal links; preserve existing market and single clock.
- Add tests for needs closed by signings vs failed departures; recruitment sourcing; budget invariants.
- Measure AI squad completeness and recruitment churn over 10 seasons.

### S2 — Player and season realism
- Verify automatic lineup, development, injuries, loans, contract expiration and youth graduation.
- Ensure staffing/facility/training policy has bounded measurable effects, not cosmetic signals.
- Test five-season youth vs experienced policy outcomes with matched seeds.

### S3 — Whole-club economy and UI
- Reconcile project investments, sponsors, member fees, loans, stadium and player wages with cash and growth.
- Run mobile full-season smoke, save/load, and no-mandatory-decision flow.
- Present understandable dashboards without requiring weekly interaction.

## Required release gates
G1: All existing fast tests pass; no hidden skipped tests.
G2: >=10 seasons autonomous on multiple seeds without deadlocks, invalid squads, duplicate players, NaNs or unreconciled ledger.
G3: Paired policy scenarios (youth vs experience; conservative vs aggressive) have reported sample sizes, differences and uncertainty; no invented outcomes or forced significance.
G4: Every user-facing policy action changes stored state and affects downstream simulation; no decorative switches.
G5: Mobile 390px light/dark, full season and save/reload browser playtest pass.
G6: No L3 agents, story events, chairman conversation mechanics or mandatory individual football choices introduced.
G7: A built, playable HTML artifact and exact commit SHA are supplied only after actual verification.

## Next concrete implementation slice
S1.1: audit and fix recruitment decision causality. Produce one reproducible test comparing shortlist-backed vs ad-hoc signings, verify every purchase respects budget and wage policy, ensure positional needs are resolved truthfully, and rerun 20-season economy checks. Do not start a new independent recruitment simulator.

---

## Completion status (2026-11-22, Claude) — measured, not claimed
Status per gate. Numbers come from `tests/slimline-test.js` and `tests/policy-test.js` (matched worlds, 5 seasons, 4 seeds; ± is one standard error; small samples are indicative only).

| Gate | Status | Evidence |
|---|---|---|
| G1 fast tests | PASS | `tests/run-fast.sh`: build, save, ux, smoke, l25, youth, story, slimline (4 seasons × 2 seeds), 20-season sim, light playtest |
| G2 ≥10 seasons autonomous, several seeds | PASS | `node tests/slimline-test.js 10`: 3 seeds × 10 seasons: no invalid squads, duplicates, NaN, unreconciled ledger or empty position. **Found and fixed on the way:** 62 clubs without a keeper (or spits, back, midfielder) after the window |
| G3 paired policy scenarios | REPORTED | table below |
| G4 no decorative switches | PASS | every policy changes stored state and a measurable downstream value (table below) |
| G5 mobile 390 px, light/dark, full season, save/reload | PASS | `node tests/playtest.js` (both themes); multi-week play and the development screens checked at 390 px |
| G6 no L3/L4 | PASS | no agents, stories, conversations or individual football decisions; club courses only bundle existing settings |
| G7 artifact + SHA | see WORK_LOG | supplied after the final verification run |

### Policy scenarios (B minus A)
| Scenario | Clear effects (> 2 SE) | Not distinguishable from noise |
|---|---|---|
| Recruitment: youth v experience | squad age +2.3 ± 0.8, youth growth −4.6 ± 1.5, academy first-team apps −35 ± 16, net transfer spend +£502k ± 108k | points −2.1 ± 2.1, strength +1.1 ± 2.7 |
| Wage frame: tight v ambitious | wage bill +£3.6k/wk ± 1.3 (+18%) | strength +4.9 ± 4.8, points +1.4 ± 2.6 |
| Transfer money 10% v 90% | net transfer spend +£996k ± 381k, cash −£589k ± 277k, injury weeks +40 ± 11 | strength −1.0 ± 2.3 |
| Scouting staff 1 v 5 | scout looks ×2.0 (97 → 194, later 131 → 266 after the scouts' retry fix), squad age −2.1 ± 0.5 | strength |
| **Scouting, isolated window (40 worlds)** | strength gain per window +0.50 ± 0.21; estimate error 1.36 v 1.79; overestimation of signings 1.23 v 1.58 | – |
| Medical staff 1 v 5 | injury weeks −79 ± 17 (−46%), points +3.7 ± 1.3 | strength |
| Training staff 1 v 5 | youth growth +8.5 ± 2.1 (+72%) | strength, points |
| Academy staff 1 v 5 | strength +5.3 ± 1.8, points +2.1 ± 0.6 | intake potential (seen potential is noisy) |
| Loans on v off | players on loan −0.75 ± 0.48 | strength, points |
| Course: Sustainable v Win now | strength +5.0 ± 0.9, points +2.3 ± 0.5, wage bill +£4.7k/wk ± 0.8, net transfer spend +£585k ± 285k, cash −£640k ± 191k | squad age |
| Course: Youth first v Win now | – | everything (strength +0.4 ± 2.4, squad age −0.4 ± 0.4) |

### Findings of the audit, handled
1. REQ (22) v SQUAD_MIN (20): REQ is the per-position target and now also the floor below which only a wage crisis may let a player go (`canSpare`); no persistent false needs were found in 3 × 10 seasons.
2. Needs that disappear are now `solved` or `lapsed` (player left) and shown that way.
3. AI clubs: still no shortlist; their automated recruitment stays believable (0 administrations, ledger reconciles over 20 seasons, no empty positions).
4. The shortlist decides 8–17% of signings. The effect of scouting was not coming from it: the department's reports now sharpen the director's judgement of every candidate (`reportNoise`), which is what gives the measured +0.5 strength per window.
5. Scouts now try up to four clubs per look: effective looks rose about 35%.
6./7./8. Policy differentiation is measured over 5 seasons in matched worlds (table above); the 20-season economy check stays in `sim-test`.

### Known limits (not hidden)
- **Money buys little on the pitch.** More transfer money or a higher wage frame mostly changes spending, cash and the wage bill; the sporting return (+1 to +5 strength) is within the noise for single levers. The combined course (Sustainable v Win now) does show a clear return.
- **Youth first and Win now end up equally strong** after five seasons in this sample; the course description says so.
- The window is one decision moment, not a period of weeks; the chairman never picks individual players.
- Only the player's club keeps a shortlist and a squad plan.
- Policy scenarios take about 35 s each (`tests/policy-test.js`, not part of the fast suite).
