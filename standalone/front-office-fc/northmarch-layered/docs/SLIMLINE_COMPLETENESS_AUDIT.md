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
