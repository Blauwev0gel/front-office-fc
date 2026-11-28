# Simulation model V2
Research 01–10 synthesis; numerical values are hypotheses until calibrated.
## State and ownership
Football owns fixtures, results, squad/contracts; finance owns ledger, commitments, debt and budget; organisation owns people/roles/capacity; departments own needs/plans; development owns assets/projects; governance owns member votes/identity; world owns external counterparties; dossiers reference these IDs, never duplicate balances.
## Time
Integer week and day within transfer window. Continue resolves eligible defaults once, advances to next boundary, settles dated obligations, simulates football/world, updates needs, reserves feasible work, progresses projects, records outcomes, evaluates material events, presents inbox. Exact order must be frozen in P0 with tests; do not skip weeks. No new time while reviewing UI.
## Feasibility
Check authority, cash forecast, budget remaining, role capacity, qualifications, prerequisites. Return allowed/conditional/rejected with reasons. Reserve resources atomically. Budget is not cash. Cash[t+1]=cash[t]+receipts-payments. Forecast minimum over dated horizon; uncertain transfers excluded from base. No automatic loans. Reserve policy distinct from insolvency.
## Autonomy
Need keyed by type/entity; observe evidence, evaluate at least two feasible alternatives incl defer, select by goal fit/urgency/risk/cost/philosophy, reserve, execute, review. Persist until material change. Capacity units abstract initially; avoid timesheets. No global action quota. Existing one project/meeting cooldown may remain temporarily, replace only when shared capacity works.
## Development and people
Asset capacity × available staff × demand determines use; maintenance and obligations persist. Projects have gated stages and actual milestones. Skill affects execution/estimate quality, philosophy affects preferences, trust changes after commitments. Identity changes slowly from material events; no repeated-click farming. Member priorities and turnout later, retain current ALV initially.
## External world
Full player club fidelity, compact direct counterparties, aggregate distant clubs. Finite sponsor/staff pools, stable IDs, contract expiry and competing demand. No duplicate signings or cash creation. Existing football engine audited before changing.
## Calibration
Use Research 02 observed club accounts as context, not direct amateur defaults. Synthetic fixtures explicitly labelled. Test sensitivities, paired seeds and failure cases. No universal staffing or attendance ratios. Collect missing grassroots data only when needed for next slice.
