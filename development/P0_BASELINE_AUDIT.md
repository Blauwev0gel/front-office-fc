# P0 baseline audit — static inspection
Baseline prototype blob 68f490368b067eb8533dc70d1073f4b3db6efaf1; 1288 lines, 164575 characters. Branch claude/loving-goodall-uv00vn. No runtime tests or code edits in this pass. P0 not fully accepted.
## Findings
- Critical: book(kind,cat,amt) line 851 debits any non-inc amount. startBuild line 1073 and hospitality line 1094 debit capex twice. Remove second debit and test reconciliation.
- Critical: msg stores function-valued options; save line 786 JSON.stringify strips functions; A.answer and A.cnext invoke .f(). JSON round-trip cannot preserve pending callbacks. Verify actual save UI/boot path; migrate to typed commands, never silently discard pending decisions.
- High: forecastLow line 1100 repeats flat weekly net; sponsor expiry, debt maturity, home fixtures and commitments absent. Replace with dated forecast.
- High: startResearch auto raises budget; deptAct approves spending without cash guard; startBuild auto borrows. Shared feasibility required; explicit loan approval.
- High: takeLoan and savings mutate cash outside book; seasonSetup resets ledger; startup debt booked before reset. Reconcile opening balance, financing and operating flows separately. Savings should reduce expense rather than masquerade as revenue.
- High: genLeague produces eight teams, seasonSetup 14 matches + six window ticks, four tiers (founding tier 4). V2 five divisions of sixteen and cup not implemented here. Windows weekly, not daily. Do not describe this as a full calendar season. Preserve compact season for first vertical slice explicitly, then migrate calendar/world.
- Medium: Math.random alias R not seeded; random sort in genSquad. Introduce injectable seeded RNG for reproducibility.
- Medium: A.cnext defaults pending decisions via callbacks, some null defaults; inbox capped at 80 without explicit protection of unresolved decisions. Protect pending work and test duplicate execution.
- Medium: department triggers and cooldowns, no persistent alternatives or shared capacity. Preserve four heads and initial UI.
## Reuse
Retain founding, candidate selection, budget, coach/TD, match/transfer loop, department tiles, Echo, ALV and club history as baseline. Adapt rather than rewrite. Legacy non-chair mode coexists; isolate tests by mode.
## P1 implementation order
1 Capture reproducible baseline with local JS harness and browser save fixtures; check exact source before editing. 2 Fix double capex and reconcile ledger, seed RNG. 3 Introduce typed commands for new sponsor workflow and safe migration of existing pending decisions. 4 Dated commitments and forecast, feasibility and explicit financing. 5 Sponsor renewal/alternative/defer with persistent dossier, capacity and outcomes. 6 Run compact full season and paired choices, then human playtest. Do not expand world before slice works.
## Gate
Static inventory completed; runtime baseline, save fixtures, rollback rehearsal and detailed legacy D/T/P inventory outstanding. No CI or deployment. V2 design remains proposed. No tests claimed. Rollback target is baseline blob above; use versioned saves and preserve original before migration. Next work is local harness and targeted fixes, not a second engine.

## Implementation status (29 November 2026, Claude)
Implemented in `prototype/de-spelmaker.html` (chair mode v6, save version 6):
- **Fixed** double capex debit: `book('capex')` is the only debit; lounge and builds no longer subtract cash a second time.
- **Fixed** closures in saves: every decision option is plain data (`{n, fx, e:[effects]}`) executed through one effect gateway (`EFF`/`CMD`); fx text is computed at creation. No chair decision holds a function.
- **Fixed** ledger: kinds `inc`, `out`, `capex`, `fin` (loans in, repayments out) plus an opening balance per season; `reconcile()` checks cash = open + inc − out − capex + fin. Savings now reduce maintenance cost instead of appearing as income.
- **Fixed** auto-borrowing and auto-budget: research and department projects use one feasibility check (`feas`: busy, cash, budget, forecast dip below reserve); a budget shortfall needs an explicit chairman action; builds that need money ask the treasurer for an explicit loan or postpone; loan is never a default answer.
- **Fixed** flat forecast: `forecast()` steps through the remaining timeline with the real fixture list (home games), sponsor end dates and loan schedules; unsigned income excluded. Shown in The Books.
- **Fixed** seeded RNG: `R()` is a seeded generator; the state is saved with the game (`S.rng`) and restored on resume.
- **Fixed** inbox cap: unresolved decisions are never trimmed.
- **New (P1 slice)** sponsor renewal dossier: eight weeks before a deal ends, Commercial opens a dossier, compares renew / approach lead or search / betting firm (growth style only, not under policy) / defer by philosophy and risk, acts within mandate or escalates; follow-ups and the outcome land in the same dossier and the ledger. Market research leads feed the next renewal.
Tests run locally (not CI): bot runs over 7 seasons with 17 JSON save/load round-trips mid-decision, max ledger reconciliation error 0, no runtime errors; same seed reproduces the same season; legacy player mode smoke test passes. Not done: human playtest, paired-strategy runs at scale, migration of v5 saves (v5 saves are not loaded; the start screen starts a new game).
