# Research 05 — Infrastructure & Development
Advisory v1. MB-47 capital/member approvals binding; 02 ledger and 03 capacity prerequisites.
## Evidence
FIFA feasibility guidance: https://legal.fifa.com/innovation/stadium-guidelines/general-process-guidelines/initiation-and-feasibility/project-feasibility — technical, legal, financial, time and risk; conditional feasibility; warns per-seat costs confounded by land and location.
FIFA stadium vision https://publications.fifa.com/de/football-stadiums-guidelines/general-process-guidelines/initiation-and-feasibility/the-stadium-vision/ distinguishes capex, opex, finance and lifecycle costs.
Sport England guidance https://production.sportengland.org/guidance-and-support/facilities-and-planning/design-and-cost-guidance/facility-cost-guidance separates capital and lifecycle, maintenance, repairs and replacement. Numerical capital worksheets not extracted.
Existing R05/R08/R10 Wimbledon/Exeter/Cambridge cover build, land/member approval and no-build alternatives.
## Asset model
Asset: ownership/lease, condition, capacity, operating hours, location, restrictions, maintenance schedule, useful life, utilisation, operating cost, dependencies. Projects: need, options, estimate range, land rights, feasibility, permissions, financing, consent, committed milestones, commissioning, outcomes. Use existing ground and project records.
| Asset | output | bottleneck |
|---|---|---|
| Pitch | training/match hours | weather, surface wear |
| Stand | sellable seats | demand, safety |
| Academy space | coaching slots | coaches, intake |
| Medical room | treatment capacity | qualified staff |
| Catering/hospitality | service inventory | staffing and demand |
| Training ground | session availability | access, travel |
Benefits require utilisation; no direct deterministic +strength upgrade.
## Stage gates
Need → options (rent/share/refurbish/build/defer) → feasibility → council/land → financing → member approval when required → procurement → construction milestones → commissioning → maintenance/review. Conditional approval and failure valid. No automatic borrowing. Cancellation preserves sunk costs; release only unpaid commitment. Existing threshold >25% turnover member approval from MB-47; clarify accounting denominator through canon before changing.
## Synthetic scenario
Stand 200 seats × 20 home dates × £10 net incremental ticket contribution × 60% utilisation = £24k/year incremental contribution before maintenance. £200k capex, £8k annual extra operating cost → £16k net before finance, simple payback 12.5 years. At 30% utilisation → £4k net, 50 years; 20% capex overrun → 15 years at original demand. Illustrative, not market benchmark. No assumption all seats create additional demand. Calculate NPV where useful, display range and cash trough.
## Chair decisions
I01 commission study; I02 lease vs buy; I03 repair vs replace; I04 phase vs full build; I05 select finance route; I06 consult council/members; I07 approve variation; I08 pause/cancel; I09 change maintenance policy. Staff execute procurement and construction.
## Gap/slice/tests
startBuild automatically borrows, pays upfront; forecast flat. First implement stand project with conditional feasibility, 3 payment milestones, explicit financing, actual capacity unlocked on commissioning, maintenance thereafter. Tests: rejected permission, funding failure, cost overrun, no demand, cancellation, delayed opening, save/load, maintenance wear; compare no-build and lease alternatives. No calibrated construction costs; source local archetype data before release.