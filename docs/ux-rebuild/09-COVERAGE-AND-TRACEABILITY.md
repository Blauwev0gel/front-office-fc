# Coverage and traceability — source-level audit control

## Precise status

**Source baseline:** chatgpt commit 6b70e70570db704071663859b3cb2c622be08d7f at audit start. Only documentation under docs/ux-rebuild/ has been added by this audit; no gameplay/UX code was changed.

| Dimension | Identified | Source-level audit | Designed | Implementation plan | Runtime verified |
|---|---:|---|---|---|---|
| Numbered UI modules | 17 | All 17 inspected for function/route structures | Family design + component patterns | UX-001..047 | No |
| Named functions in UI source | 166 | All 166 indexed in 01 | 197 screen/state target catalogue, not 1:1 | Each family in 08 | No |
| Dispatcher cases | 125 | All defined cases indexed in 10 | Shared interaction contract + family treatment | UX-005..012 and family tasks | No |
| Literal UI action references | 240 matches across module groups before dedupe | Indexed by source in 11 | Central route contract | UX-005 | No |
| Static registered event/brief keys | 105 | IDs catalogued in 02; individual option code still needs semantic grading | Canonical case types defined in 07 | UX-010 | No |
| Six departments | 6 | All six found in depts.js with specialist roles | Individual screen states and wireframes | UX-028..040 | No |
| Known generic sheet kinds | 18 | Conditional keys indexed in 01 and 05 | Specific future treatment per kind | UX-006..012, UX-046 | No |
| Player-facing screen/state **design targets** | 197 | Catalogued from source names and required variants | Each has source/view, player purpose, UI treatment | Family task mapping | No |
| Week/season major phases | founding, staff, mandates, summer, preseason, press, season, review, sacked + Matchday stages | Inspected in renderer and phase APIs | Phase-aware transitions in 03 | UX-001, UX-017..020, UX-041..045 | No |
| UI visual variants at 320/375/390/430px | — | CSS inspected | Target rules in 04 and 06 | Family tasks | No |
| Dynamic event-specific screens | Constructed by event/brief templates | 105 static keys indexed; dynamic prefixes present | Use parameterized decision/case templates | UX-010, UX-006 | No |

**Do not interpret 197 as 197 independently existing pages.** Some are conditional states of one renderer and some are future explicitly required screens; the 166 function entries include helpers as well as renderers. The 105 ID registry also includes declarations that may currently be auto/off, and excludes any dynamically constructed IDs not statically captured.

## Artifact traceability index

| Source domain | Existing source | Proposed screen families | Decision families | Implementation tasks |
|---|---|---|---|---|
| Founding and mandates | ui/02, engine/04, engine/13 | START-* | hiring/mandate/personnel | UX-013..016 |
| Summer/preseason/press | ui/03, summer, summer2, season | SUMMER-* | negotiation/board/press | UX-017..020 |
| Desk/inbox | ui/10, ui/12, ui/13, desk | DESK-* | events, briefs, dossiers | UX-021..024 |
| Squad/player | ui/05, ui/11, engine/03 | FOOT-* | player contextual consultations | UX-025..026 |
| League/cup | ui/07, engine/05 | FOOT-* | mostly observational | UX-027 |
| Club/board/finance | ui/07, loop, business | CLUB-* | board/finance/policy | UX-035..040 |
| First Team | ui/08, ui/09, firstteam | FIRST-* | coach talk, mandate, sack | UX-028..029 |
| Recruitment | ui/05, ui/08, recruit, recruitx | RECRUIT-* | negotiation and exception | UX-030..032 |
| Academy | ui/08, ui/09, academy, pathway | ACADEMY-* | multi-head agreement | UX-033..034 |
| Commercial | ui/08, commercial | COMMERCIAL-* | deals/pricing | UX-035 |
| Marketing | ui/08, marketing | MARKETING-* | campaigns/conflict | UX-036..037 |
| Business | ui/08, business, engine/07 | BUSINESS-* | finance, legal, budgets | UX-038..039 |
| All sheets/dialogues | ui/06 | SHEET-* | decision templates + old routes | UX-006..012, UX-046 |
| Matchday/Gazette | ui/14, ui/06, matchday, matchtalk | MATCH-* | progression, mostly informational | UX-040..042 |
| Season/restart/saves | ui/09, engine/10, engine/14 | END-* | board review, transitions | UX-043..045 |

Note: UX IDs above refer to numerical positions in 08. Where text labels and ranges disagree, use the **canonical row titles** in 08 rather than inferring a task from range alone; future automation should generate this table directly from task IDs.

## Unresolved gaps — explicit, not hidden

1. **Actual branch runtime coverage:** A source path may be dead, and a dynamic event path may be omitted from a static regex. Need instrumented route traversal on seeded saves and relevant scenarios; classify each screen-ID active, guarded, old-only, proposed or unreachable.
2. **Actual event semantics:** The 105 static key inventory doesn't grade every option's conditionality, auto-decision and real effect. This is a planned event-by-event task, not finished work.
3. **Action callsite parity:** All 125 switch cases and literal callsites are indexed, but mapping each individual action to exact rendered screen(s), F command and specific decision instance requires instrumented UI/source reconciliation. Some handlers use dynamically built attributes.
4. **CSS and visual behavior:** No screenshot-based contrast, scroll, focus, 320px tap or positioning audit has been performed. No claim of visual acceptance.
5. **Save states:** Serializer and migration source is known, but running old archived saves against a future Case DTO is not tested.
6. **Mutually exclusive engine paths:** Parallel Matchday ticker, summer v1/v2 wrappers, event modes and screen aliases require runtime proof before removal.
7. **User experience quality:** No recorded player/task-time data yet; evaluate 3/4/5 global routes, very long player info pages and multi-step conversations using representative test sessions.

## Literal every-screen completion protocol for implementation

1. Instrument render() and vSheet() (in development builds only) to log phase, route, local tab, sheet kind, Matchday stage, event key, action attributes and stable screen ID.
2. Start new and restored saves with varied seeded states including no staff, financial crisis, promotion, summer, week 1, a midseason deadline, cup match and sacked state.
3. Union observed states with the source register; any observed but unregistered state adds a Screen ID. Any source-defined but unobserved state is marked guarded/dead rather than deleted.
4. For each registered screen, record owning F data, transitions, keyboard/touch behavior and a screenshot at 320px/390px if browser QA becomes available.
5. Compare all rendered data-a IDs to the 125 dispatcher cases. Every active control must have exactly one intended handler; all cases without controls are explained.
6. Compare generated cases to event/brief keys, authorizations and no-response policy. Verify staff-owned events do not appear as CEO approvals.
7. Link each completed feature change to exact source path, Screen ID, Action ID and Decision ID in the implementation tracker.
8. Only mark full audit/implementation coverage once there are **zero unexplained source-to-screen or action-to-handler gaps** and the runtime census is complete.

## Bottom line

**Completed now:** source-level module survey; function, action and static decision registries; a 197-target screen specification; wireframe patterns; six department contracts; decision-engine migration blueprint; 47-task implementation plan.

**Not completed:** browser/seeded state census, per-event counterfactual semantics, empirical visual review, and any new engine or interface implementation. A claim of literally exhaustive runtime coverage would therefore be unjustified.

This document is the hand-off checkpoint for implementation, not a release certificate.
