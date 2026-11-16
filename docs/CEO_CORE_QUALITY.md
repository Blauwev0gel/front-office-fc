# CEO Core Quality — source-first sprint, 16 November 2026

## Source comparison (before changes)

Basis: `chatgpt` at `56da7ed2`. Cross-checked against `BIBLE.md`, `CODEMAP.md`, the current engine modules and the following **separate** research from `claude-game`:
`design/analyse-sportief.md`, `design/analyse-structuur-sportief.md`, `design/besluiten-sportief.md`, `design/besluiten-wedstrijd.md`, `design/besluiten-zomer.md`, `design/weekflow.md`, `notes/longevity-2026-11.md`, `notes/balance-b37.md`, `notes/moneyball-model.md`.

| Issue | chatgpt executable baseline | claude-game research / decisions | This sprint |
|---|---|---|---|
| CEO action points | 3/week for talk/mandate/initiative, required Red Box replies free; B13 = development/test discipline | B21 abolishes action points; B13 means something **else** on Claude's Bible | **Preserved chatgpt.** Cross-branch design conflict; not silently reconciled |
| Coach attack mandate | `HOOK.coachAct` influences match chance volume, weak result separation | Sporting analysis D4; calibrated match and trade-offs B25 | Modest extra matchup-sensitive chance-share trade-off, measurable xG for and against |
| DoF data mandate | `man('dof','data')` did not gate the live `dofPipeline` | B30: cautious data-led DoF demands better evidence; scout's eye accepts more uncertainty | Implemented within existing `dofPipeline`; keeps Plan A/B and financial approval gates intact |
| Delegated execution | `desk.js` logs counts/errors, and messages have outcomes, but no durable compact record of **why** | Sporting research: visibility and accountability; B32 rolling plan | Reuses `H.desk` / `H.deskBriefs`; persists real option, authority reason, staff name, outcome and error |
| Delayed consequences | dossiers/pathway and some later events; no reusable audit of instructions and outcomes | B24/B31 weekly follow-ups and echoes | Snapshots at appointment, coaching/recruitment mandate, authority change and selected high-stakes CEO calls; after ~3 playing weeks Gazette reviews real recorded indicators |
| Multi-season pacing | Not proven by the current 10-week scenario | B37 target 15–20 seasons, early crisis and recovery; small seed-based balance experiments | **Not imported or claimed solved**; requires separate longitudinal balance study |
| Moneyball | No four-layer model | B38/B39 model is proposed / partly decided, **not implemented** | Not included; this sprint restores the CEO core first |

**Source hierarchy:** `chatgpt/BIBLE.md` and executable `chatgpt` code govern this branch. Claude documents provide research and design alternatives; their incompatible decisions are not treated as existing chatgpt behaviour.

## Work delivered

- `engine/06-match.js`: attacking mandate changes the probability of creating the next chance depending on relative team strength; it also increases defensive xG exposure. This is a trade-off, not a guaranteed wins button.
- `recruit.js`: DoF data policy **≥70** accepts only high-confidence reports; **≤35** can recommend promising low-confidence reports; in between, existing confidence/urgency rules remain. No new direct transfer control for the CEO.
- `desk.js`: when a delegated event or briefing is executed, its selected option, authority reason, staff owner, result and any error are recorded after the actual effect. No fabricated results.
- `ceocore.js`: separate evidence **ledger**, not a separate decision engine. Wraps the already exposed FO action functions and the existing seasonAfterMatch hook. Records which direction was given; after 3 playing weeks it compares actual match xG, U21 participation, scout observations, signings, staff relationship or delegation outcomes. Notes explicitly that observed changes are *not necessarily caused* by the decision.
- `ui/10-inbox.js`: a single **collapsed** Decisions and consequences section on the inbox overview. Recent delegated actions include a reason and actual outcome. Two follow-ups at most appear per weekly Gazette edition.
- Save data stays in `G.ceoCore`. Old saves use a lazy safe default; `VERSION` is unchanged. Existing `summer.js`, `summer2.js` and player-facing summer stay intact.
- The build includes `ceocore.js` after `matchday.js` so it wraps all previously installed hooks.

## Reproducible tests and findings

`node test/ceocore.js` covers: new club → real summer → season, staff selection, coach and DoF mandate, free hand, delegated event reason/outcome, ten weeks of inbox/departments/match preview/match/Gazette with reload in week five, delayed Gazette reviews for hire/mandate/authority, save migration, DoF low-confidence counterfactual, matched coach attack counterfactual and subsequent end-season/summer flow with reload.

**Pre-push validation:** the full candidate engine was assembled in a V8 isolate; the test script was executed there with an equivalent virtual module loader and assertions. Its 10-week and 34-week checks passed; JavaScript changes parsed. Native Node execution and the actual standalone HTML build are performed by the GitHub Actions workflow after the single branch update; do not claim those before the run reports success.

**Coach counterfactual:** 14 paired seeds × 10 matches at attack 10 vs 90, same starting seeds. Attack 90 averaged about **+0.25 xG for and +0.38 xG against per match**, and effectively no average points change (about −0.01 points per match in this small sample). The effect is measurable; whether it creates satisfying choices requires playtesting.

## Acceptance checklist

1. Compare current executable code, Bible and Claude research — **done**, this report preserves unresolved B13/B21 conflict.
2. Coach and DoF mandates affect actual behavior — **tested** via counterfactual matches and live recommendation pipeline.
3. Three kinds of instructions lead to later recorded evidence — **tested** for appointment, mandate and delegated authority, plus selected CEO choices.
4. Find delegated choices with who, why, decision and outcome — **tested**, persisted to save.
5. Reproduce ten consecutive weeks through inbox, six departments, preview, match and Gazette — **tested in the actual engine**, not a graphical browser.
6. Save/load and player summer route — **tested** during season, after season and in summer.
7. Pre-push scenario checks and successful CI — **pre-push V8 checks passed; GitHub CI outcome must be checked after push.**

## Outstanding, not disguised as complete

- This is an **engine/API regression**, not a hands-on 390-pixel mobile clickthrough. The UI addition is a collapsed text block; a browser QA pass is still useful.
- Other coach mandates (youth, rotation, intensity) have not been recalibrated here.
- The small sample is not evidence of balanced long-run promotions, injuries, difficulty, engagement or 15–20 season longevity.
- Claude's no-action-points B21 and other incompatible design choices require a deliberate separate decision. They were not merged.
