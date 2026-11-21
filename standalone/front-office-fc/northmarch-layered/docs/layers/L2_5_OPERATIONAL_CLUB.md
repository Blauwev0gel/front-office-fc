# L2.5 — Functionerende cluborganisatie
Status: IN PROGRESS. Source changes are not yet built or browser-tested.

## Scope and principle
L1 owns the football world; L2 owns governance; L2.5 exposes durable operational cycles, without introducing L3 staff agents. Chairman controls policy, staffing and budgets; TD executes recruitment.

## Code audit and gaps
| Domain | Existing evidence | Classification | Critical missing link |
|---|---|---|---|
| Scouting | football/market.js scoutPool, shopFor; ground.js scouting signal | C | Persist search intent, shortlist decisions, cross-window tracking |
| Squad planning | players.js squadGaps; market.js squadManager | C | Durable positional plan and explanation of needs |
| Transfers | market.js transfer/signFree/squadManager | B/C | Link individual signings to plan and retrospective outcomes |
| Youth | players.js playersSeasonEnd, academyHistory | C | Development history and permanent graduate outcomes |
| Training | players.js playersWeek, staff.js coachGrowth | B | Multiweek progress and coach reporting |
| Medical | players.js injuries, stats.injWeeks | B | Recovery schedule and medical reporting |
| Coach/TD | staff.js roles, skills, hiring | C | Operational reports and performance review |
| Contracts/loans | life.js, market.js renewals, loanOut | B/C | Contract-risk pipeline |
| Commercial | commercial.js sponsor offers, sponsorWeekK | B/C | Project/activity ledger |
| Members | members.js confidence, goals, AGM | B | Explicit member issues and progress |
| Ground | ground.js, projects.js | B | Unified facility investment plan |
| Finance | finance.js, commercial.js budgetRows | B | Department outcome versus investment |

Classifications are code-review hypotheses, not validation results. See L2-CLUB-MANAGEMENT.md for existing A/B claims; these have not been rerun.

## First vertical slice: recruitment
- Source of truth remains existing squadManager/shopFor/scoutPool.
- Candidate search snapshots and evaluated reasons persist in S.stats[club].scoutHistory for the current player club, capped at 12 searches.
- The director records affordability and quality screening, chosen candidate and reason; no invented individual scout.
- Search occurs during existing summer/winter transfer windows; no extra clock.
- UI in ui/depts.js shows director, search reach, recent candidates and decision.
- Limits: no persistent active search assignment between windows; no stable shortlist across searches; chairman can influence via staff appointment, scouting department and squad budget, but cannot yet approve a specific recruitment plan.
- Older saves have no historical candidate detail; new data is optional and serializes with S.

## Next packages
1. Persist positional needs and the director's season plan, linked to searches and signings.
2. Youth cohort outcomes and development history, including loans and departures.
3. Coach/medical reporting.
4. Commercial/member/ground/finance operational cycles.
5. End-to-end integration and mobile playtest.

## Acceptance / validation
- [ ] Run node build.js and verify generated standalone HTML.
- [ ] Run save/load tests and verify old v7 saves.
- [ ] Simulate summer/winter windows and verify recruitment reports and transfers.
- [ ] Browser/mobile smoke test navigation and department overlays.
- [ ] Multi-season progression and academy outcome test.
No RELEASED or PLAYABLE claim until gates pass.

## Recent commits
- 60b1f460 — search snapshots
- 8f68df64 — youth intake cohort snapshots
- 6683cdf1 — UI for histories
- d8538283 — worklog
- 2b790a87 — restore broken free-agent scouting loop; add evaluated reasons and TD decision
- c8191a10 — show decision and screening reasons in scouting UI
