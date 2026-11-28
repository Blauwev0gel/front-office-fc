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
