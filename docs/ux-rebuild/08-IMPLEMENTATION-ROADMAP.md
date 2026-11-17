# Integrated implementation roadmap — complete code plan

**Status:** design backlog from source audit, no gameplay code changed by this audit. **Critical path:** audit instrumentation → common decision read model/authority → case interaction → founding/summer/Desk → Football/six departments → Matchday/season → cleanup. Existing interface patches are not assumed safe forever.

## Priority and dependencies

- **P0:** architectural blockers and critical data/response guarantees. Complete first.
- **P1:** integrated family rebuilds; an entire department or screen journey must remain playable when promoted.
- **P2:** retirement and canonical documentation, only after route parity.
- No autonomous implementation should update main or claude-game. Work on chatgpt only, with coherent commits and existing game preserved.

| Task | Package | Priority | Implementable change | Design refs | Code targets | Acceptance gate |
|---|---|---|---|---|---|---|
| UX-001 | FOUNDATION | P0 | Establish immutable gameplay/save baseline — read old saves, compare phase routes | 01, 02, 10 | engine/14-save-api.js; test/preview-save.js | All baseline versions load and retain same phase |
| UX-002 | FOUNDATION | P0 | Phase and route graph — eliminate split return destinations | 03, 04, 05 | ui/13-redbox-render.js; ui/15-actions.js | Every phase/view has one intended next/back destination |
| UX-003 | FOUNDATION | P0 | Game-wide shell + responsive components — shared layout and semantic controls | 04, 06 | ui/04-masthead-news.js; style/* | 320px navigation and selected state predictable |
| UX-004 | FOUNDATION | P0 | Instrumented state census harness — runtime view registry and screen capture | 01, 05, 09 | test/browser/*; ui/13-redbox-render.js | Every enumerated state classified reached, unreachable or gated |
| UX-005 | FOUNDATION | P0 | Full action-to-view reachability crosswalk — detect stale buttons and orphan handlers | 01, 05, 10 | ui/15-actions.js; ui/* | No active button missing handler; orphan actions named |
| UX-006 | DECISION | P0 | Normalized CaseView adapter for all sources — one readable contract, no parallel writes | 02, 07 | desk.js; ui/13-redbox-render.js; ceocore.js | A case renders from canonical DTO with unchanged outcomes |
| UX-007 | DECISION | P0 | Authority and no-response semantics map — actual mandate/CEO exception routing | 02, 07 | desk.js; engine/08-weekly-inbox.js | Staff-managed cases do not demand CEO approval |
| UX-008 | DECISION | P0 | One-tap idempotent command gateway — commit once and persist | 07, 10 | ui/15-actions.js; engine/09-meetings-actions-press.js | Double tap/reload cannot duplicate effect |
| UX-009 | DECISION | P0 | Distinct dialogue/ballot/agreement templates — appropriate interaction per case type | 05, 06, 07 | ui/12-scenes-cards.js; ui/13-redbox-render.js | Conversation doesn't behave like contract approval |
| UX-010 | DECISION | P1 | Counterfactual option audit of registered event keys — document actual trade-offs; eliminate false choices | 02, 07 | events.js; events2.js; briefs.js | All registered IDs tagged live/auto/off and meaningful/repair |
| UX-011 | DECISION | P1 | Case outcome/provenance view model — unify displays without duplicating stored state | 03, 07 | ceocore.js; dossiers.js; stories.js; pathway.js | One case history shows what actually happened |
| UX-012 | DECISION | P1 | Mandate and authority agreement UX — owner, freedom, resources and review | 05, 07 | ui/06-sheets-ticker.js; desk.js | Player understands staff discretion and changes |
| UX-013 | FOUNDING | P1 | New game / resume / preset flows — clear entry and save decisions | 05, 06 | ui/02-setup.js; ui/01-core.js | All entry routes and resume behave coherently |
| UX-014 | FOUNDING | P1 | DNA/identity flow — trade-offs and football meaning | 05, 06 | ui/02-setup.js; engine/04-staff-dna.js | Seven DNA choices reflect actual rules |
| UX-015 | FOUNDING | P1 | Head hiring and staff comparison — six accountable heads | 05, 06 | ui/02-setup.js; engine/04-staff-dna.js | Appointments show role, wage and mandate |
| UX-016 | FOUNDING | P1 | Opening mandate negotiation — role-by-role responsibility | 05, 07 | ui/02-setup.js; desk.js | All six heads have understood authority |
| UX-017 | SUMMER | P1 | Summer manager/DoF plan — conflict, shortlist, alternatives | 03, 05 | ui/03-summer-preseason-press.js; summer2.js | Agreement leads to autonomous recruitment |
| UX-018 | SUMMER | P1 | Deadline day negotiations and follow-through — time constraints with actual results | 03, 05 | summer.js; summer2.js; ui/03-summer-preseason-press.js | Every response attached to a deal and outcome |
| UX-019 | SUMMER | P1 | Preseason board objectives and staff focus — credible goal/resource alignment | 03, 05 | engine/13-newgame-preseason.js; ui/03-summer-preseason-press.js | No fake separate approval loops |
| UX-020 | SUMMER | P1 | Press questions and public response — different from board vote | 03, 07 | ui/03-summer-preseason-press.js; engine/09-meetings-actions-press.js | Press consequence contextual, not generic dismissal |
| UX-021 | DESK | P1 | Desk as phase-aware CEO briefing — current football event first | 03, 05 | ui/10-inbox.js | Quiet and crisis weeks both clear |
| UX-022 | DESK | P1 | True escalations vs optional staff briefings — authority-based information | 02, 05, 07 | ui/10-inbox.js; desk.js | Optional reports don't gate match progression |
| UX-023 | DESK | P1 | Ongoing case timeline and history — source-keyed correlation | 05, 07 | ui/10-inbox.js; ceocore.js; pathway.js; dossiers.js | No duplicate unrelated timeline entries |
| UX-024 | DESK | P1 | Message archive and selected return state — simplify navigation | 05, 10 | ui/10-inbox.js; ui/12-scenes-cards.js | All event types can be recovered |
| UX-025 | FOOTBALL | P1 | Squad and coach XI presentation — rich football data without coaching controls | 05, 06 | ui/05-pitches-squad-money.js | Player can compare positions, availability, form |
| UX-026 | FOOTBALL | P1 | Player/academy/target dossier — shared identity and evidence with source distinction | 05, 06 | ui/11-players.js; ui/06-sheets-ticker.js | Contract/stat/potential context correctly sourced |
| UX-027 | FOOTBALL | P1 | Division/league/results/cup UI — authentic compact football tables | 05, 06 | ui/07-club-league.js | Promotion/relegation and historical results legible |
| UX-028 | FIRST | P1 | Head Coach performance and conversation — evaluate results, philosophy and support staff | 05, 06, 07 | ui/09-firstteam-review.js; firstteam.js | CEO acts through head, not starting XI |
| UX-029 | FIRST | P1 | Coach staffing, mandate and dismissal — staff competence, vacancy and compensation | 05, 07 | depts.js; firstteam.js; ui/06-sheets-ticker.js | All consequences and next appointment route clear |
| UX-030 | RECRUIT | P1 | DoF/Chief Scout accountability — separate recommendation vs evidence | 05, 07 | ui/08-departments.js; recruit.js | Every pipeline decision owned |
| UX-031 | RECRUIT | P1 | Scout pipeline / shortlist / negotiation — context and confidence, no fake certainty | 05, 06, 07 | ui/05-pitches-squad-money.js; recruit.js | Deals progress by employee execution |
| UX-032 | RECRUIT | P1 | Loans, rolling plan and transfer exceptions — constraints and check-ins | 05, 07 | recruitx.js; summer2.js | Board/CEO only sees true exceptions |
| UX-033 | ACADEMY | P1 | Academy Head/three levels of youth evidence — intakes, youth form, progress | 05, 06 | ui/09-firstteam-review.js; academy*.js | Development visible over weeks/seasons |
| UX-034 | ACADEMY | P1 | Welfare, pathway and multi-head agreement — real review and causal evidence | 05, 07 | pathway.js; ui/10-inbox.js | Coach/DoF/Academy disagreement meaningful |
| UX-035 | COMMERCIAL | P1 | Sponsor, ticket and retail interfaces — financial and reputational consequences | 05, 06 | commercial.js; ui/08-departments.js | Deals and pricing have real trade-offs |
| UX-036 | MARKETING | P1 | Marketing team, campaigns and community — actual fan/club outcomes | 05, 06 | marketing.js; ui/08-departments.js | Campaigns don't become generic upgrade buttons |
| UX-037 | MARKETING | P1 | Marketing–Commercial conflict paths — two heads and a CEO resolution | 02, 07 | events.js; stories.js | Both departments can act differently after CEO decision |
| UX-038 | BUSINESS | P1 | Finance Head and specialist staff — accountability and cost policy | 05, 06 | business.js; ui/08-departments.js | Cash, legal, budget responsibilities distinct |
| UX-039 | BUSINESS | P1 | Financial scenarios and exception handling — one consistent risk case | 05, 07 | business.js; engine/07-finance-transfers.js | No duplicate approval entry points |
| UX-040 | MATCH | P1 | One canonical Matchday state machine — preview/live/FT/Gazette/Desk | 03, 05 | ui/14-matchday-gazette.js; ui/06-sheets-ticker.js | No parallel active ticker accidentally restarts match |
| UX-041 | MATCH | P1 | Live controls and narrative quality — actual events, time, speed/skip | 05, 06 | matchday.js; ui/14-matchday-gazette.js | Controls reflect engine and preserve result |
| UX-042 | MATCH | P1 | Gazette and retrospective reports — football world with causal reporting | 05, 06 | ui/14-matchday-gazette.js; ui/12-scenes-cards.js | Edition reflects real results and staff developments |
| UX-043 | SEASON | P1 | Season checkpoint / winter agenda — actual adaptation opportunities | 03, 05 | season.js; summer2.js | Choices modify existing plan and follow-up |
| UX-044 | SEASON | P1 | End-season review and board evaluation — compare actuals to commitments | 05, 06 | ui/09-firstteam-review.js; engine/10-season.js | Objective outcome derives from engine |
| UX-045 | SEASON | P1 | Dismissal, promotion, relegation, restart — consequence and recovery path | 05, 06 | engine/10-season.js; ui/09-firstteam-review.js | No trapping or impossible save state |
| UX-046 | CLEANUP | P2 | Remove dead overlays and CSS branches — controlled deprecation | 01, 10 | ui/06-sheets-ticker.js; style/* | No active action or save route lost |
| UX-047 | CLEANUP | P2 | Commit final coverage registry and canon — no documentation contradiction | 09 | BIBLE.md; CODEMAP.md; docs/ux-rebuild/* | All registry links resolve and omissions classified |

## Build order by coherent milestone

1. **Foundation:** UX-001..005. Freeze authoritative branch, build a runtime screen-state census and orphan-action check. Do not claim 100% coverage from source alone.
2. **Decision core:** UX-006..012. Introduce adapters and a unified case view; retain authoritative engine calls until migration tests prove parity.
3. **Season startup:** UX-013..020. Users complete founding → first summer → press → Week 1 with shared decision UI.
4. **Normal season:** UX-021..027. Build the Desk and football information system in a coherent whole.
5. **Responsible club:** UX-028..040. Each of the six departments has its own integrated flow and exception routes; do not group them into a generic page-only sprint.
6. **Football climax:** UX-041..043. Matchday/Gazette as one state machine.
7. **Season and cleanup:** UX-044..end. Complete multi-season path and remove abandoned legacy UI.

## Delivery format per development milestone

- One coherent branch commit or draft PR with explicit scope and file list.
- Screen IDs and Action/Decision IDs attached to changed flow.
- Concise before/after interaction map showing click count or eliminated route.
- Minimal functional verification of action bindings and save parity (not necessarily exhaustive multi-season playtests for every UI patch).
- Existing source of truth updated only after implementation; no false DONE status.

## Design acceptance by role

- Football expert checks whether club/football roles are plausible and no tactical CEO control slipped in.
- UX checks small-screen hierarchy, control semantics, back navigation and match flow.
- Systems designer verifies options, staff autonomy, follow-through, and nonresponse semantics.
- Engineer verifies callable handlers, engine invariants and save migration.

## Dependencies that must not be skipped

- Cannot retire vSheet(ticker) until canonical match flow and any season review routes are migrated.
- Cannot replace stored response data before migration of G.inbox, G.briefs, G.meeting, G.auth and any case logs.
- Cannot claim staffing screen done when only heads are visible and specialist roles are hidden.
- Cannot claim Marketing/Commercial/Business are complete with generic cards; each has distinct economics and decisions.
- Cannot turn every event into CEO action. Preserve desk.js authority rules and autonomous event modes.

## Deferred until evidence

True 320px visual usability, profile scroll behavior and any rare event dead ends require actual browser interaction. Make these explicit follow-up QA gates without blocking the completion of the written audit.
