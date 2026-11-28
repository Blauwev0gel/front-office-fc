# Research 10 — Integrated Game Design & Roadmap
Advisory v1, synthesises Research 01–09. MB-46/47 and master decisions supersede proposals. No code or bible edits.
## Design thesis
A chairman game is strategic agency over an autonomous football organisation, not a football manager clone or passive simulator. Reference lenses (user supplied): Football Manager world continuity; Crusader Kings evolving people and relationships; FC PRO 2 club progression; No.10 Full Confidence political inbox and consequences; Hometown FC local club identity. These are design analogies, not claims of verified mechanics or direct copying.
## Shared system contract
Week clock → external events and football → ledger/commitments → needs/feasibility → autonomous plans → outcomes/dossiers → inbox and optional chairman initiatives → decisions/defaults → next week. Define tick ordering explicitly before implementation. Shared IDs, deterministic random source, serialisable records, atomic resource reservation. Identity and governance respond to consequential actions. No mandatory responses each week. Existing transfer interruptions preserved.
## Roadmap
| Phase | Deliverable | Blocks | Gate |
|---|---|---|---|
| P0 | audit latest branch, map canon, save fixtures and baseline metrics | all | reproducible local smoke and no regressions |
| P1 | dated ledger + commitments + feasibility | 02/01 | reconcile every week, no auto borrowing/budget creation |
| P2 | persistent commercial renewal + finance forecast vertical slice | 03/07 | autonomous plan, meaningful chairman intervention, visible realised return |
| P3 | joint academy/football pathway + chair agenda | 03/04 | optional initiative, no player micromanagement, durable follow-up |
| P4 | staged stand project and member consultation | 05/08/07 | funding/consent gates, costs and maintenance, no-build viable |
| P5 | staff market, succession, culture and identity | 06/09 | choices generate different organisation trajectories |
| P6 | external market/locality/world news expansion | 09 | counterparties respond, conservation and realistic bounded economy |
| P7 | balance, UI, accessibility and release | all | paired simulations plus actual chairman playtest |
P1 and P2 share minimal dossier/action serialization; full dossier presentation evolves as needed. No big-bang rewrite. P0 must refetch latest code; prior dbabc15 findings may be stale.
## Minimal playable vertical slice
Found member club, appoint existing heads, choose identity, set budget. Commercial observes expiring sponsor, autonomously compares feasible options. Chair can initiate market study or revise ethical mandate, or continue. Finance forecasts dated cash trough. Sponsor result arrives in same dossier and ledger. In parallel coach runs matches; newspaper displays material events. Next season club has actual capability, commitments, identity and member reaction. User can trace cause and effect. If this loop isn't fun, stop expansion and iterate.
## Decision evaluation
Every feature must answer: what can chair initiate? what does staff handle? why now? what options and opportunity costs? what changes immediately/later? what evidence shows outcome? what if ignored? Reject pure cosmetic upgrades, repeated scripted dilemmas, compulsory chores, hidden arbitrary bonuses.
## Test matrix
Four strategies: prudent local community, youth development, commercial enterprise, ambitious sporting growth. Paired seeded 10-season local simulations; at least 20 seeds per strategy as proposed starting test budget, adapt for runtime. Record cash trough, insolvency, payroll, debt, growth, promotion, youth progression, sponsor retention, capacity, member approval, unique meaningful decisions, autonomous completions, idle weeks, duplicate messages. Compare with baseline; report distribution and seed failures not just mean. Sensitivity ±25/50% uncertain parameters. No heavy CI unless explicitly approved.
Acceptance: no resource duplication; save/load identical continuation with seed; canonical defaults work; rejected funding cannot build; no auto player micromanagement; multiple viable strategies, no guaranteed success; user can initiate meaningful activity with empty inbox; distinct long-run organisations; plausible consequences visible in reports. Numeric balance targets to establish from baseline and playtests, not invented here.
## Research-to-build handoff
Each research block is advisory. Before coding, create canon decision proposals for employment model, shared feasibility, capacity representation, dossier schema, external market fidelity, governance cohort modelling; approve individually. Keep four tiles and current UI design. Record scope, module boundaries inside existing single-file prototype, tests, migration and rollback per phase. Do not merge/publish playable release until validated.
## Remaining evidence gaps
Research 01/02 have some observed benchmarks; 03–09 largely qualitative cases and design contracts. Missing grassroots financial panel, salary/volunteer hours, facility cost extraction, transfer market distributions, retention/attendance elasticities, and independent game playtest. Game references not empirically benchmarked. No simulations or implementation in this research batch. This closes initial research documentation, not empirical validation. Prioritise collection only where it changes P1/P2 decisions; avoid endless research instead of playable iterations.