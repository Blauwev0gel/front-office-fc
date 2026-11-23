# Economic Balance V1 — execution and validation gate

## Goal
Build an economy where income, operating costs, construction, debt and sporting outcomes interact over ten seasons; all 11 upgrades must have observable but conditional benefits. No new currencies or autonomous staff. Preserve modularity and old saves.

## Actual changes on this branch
- Finance: fan-dependent merchandise and events with logarithmic diminishing returns from upgraded retail/community signals, instead of linear unlimited returns.
- Finance: recurring upkeep for additional buildings, upgraded complex levels, upgraded stadium facilities and additional stand rings. Base stands remain covered by existing capacity-based maintenance. This avoids a free bonus for extra development.
- Previous branch work: V18.6 upgrade cards, cashflow display, initial long-term maintenance.
- No new save fields.

## Test performed
Ran the released V18.4 engine with the modified V18.6 finance.js module inserted, using real StartProject commands and ten seasons for each tested route (seed 1804). The test runs were executed without GitHub Actions.

| Strategy | Projects accepted | Cumulative build paid £k | Final cash £k | Final squad | Negative-cash weeks |
|---|---:|---:|---:|---:|---:|
| Control | 0 manually | 52.3 | 883.0 | 54.4 | 1 |
| Commercial complex | 7 | 736.0 | 680.8 | 54.8 | 0 |

The control club incurred £52.3k in build payments despite zero manual project orders; investigate AI/system-initiated construction and attribution before treating all construction as player investment.

**Important**: This is a partial regression, not a validated balance. Earlier 11-route ten-season tests were performed against the previous finance formula. They cannot be passed off as tests of this revision. The full multi-seed test matrix, isolated project ROI, save/load, mobile UI and newspaper tests are still open.

## Required remaining gates
1. Locally run at least five seeds × ten seasons for control, sporting, youth, commercial, conservative and stress strategies.
2. Isolate one completed upgrade at a time and compare same initial club and economic demand; attribute incremental income and upkeep without treating divergent league outcomes as causal.
3. Audit `weekLines`, `financeWeek`, `book`, `cashForecast`, `financeSeasonEnd` for ledger reconciliation and whether loans/transfer fees are correctly excluded from operating cashflow.
4. Check stadium demand and capacity bottlenecks, medical injury weeks, academy graduates, recruitment outcomes and pitch home advantage.
5. Validate complete modular manifest build, save/load, weekly match/newspaper loop and mobile UI.
6. Only after all gates pass consider promotion to main and Pages; do not trigger exploratory GitHub Actions.

## Release decision
**HOLD**. Partial implementation and a two-route ten-season smoke regression are complete; the full user-requested economic rebalance is not.
