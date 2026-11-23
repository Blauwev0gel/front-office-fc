# NORTHMARCH — BALANCE SPRINT (10-SEASON VALIDATION)

## Mission
Validate and, only where supported by evidence, correct the Layer-1 club progression loop: investment -> observable effect -> sporting/financial consequences -> reinvestment. Never artificially guarantee success. Do not change staff-autonomy, dynasty or narrative layers.

## Source of truth
Use the actual modular source under `northmarch/src`, the `northmarch/manifest.json` build order, `northmarch/test/smoke.js`, and the existing finance, ground, player, recruitment and youth engines. Preserve save compatibility and `releases/northmarch/v18.4.html` as rollback.

## Required experiment
Run ten seasons for a control and three strategies (sporting, commercial, youth) from the same five seeds. Log each year:
- Club identity, tier and league position, cash, debt, operating result, revenue, wages, construction spend
- Squad quality, starting-XI quality, youth growth, injuries, intake/regulars
- Facility signals, construction completed, offers rejected with exact reason
- Promotions/relegations and administration
- All investments: actual cost, recurring operating costs, completion delay, and date effects materialize

Strategies must use the actual `projectCatalog` keys: `plot:<index>:up` for existing facilities and `plot:<index>:academy` / `plot:<index>:scouting` for new construction. Do not confuse technical keys with department names. Never bypass the command checks.

Compare outcomes against the control **within each seed**; label these paired-seed comparisons descriptive, not causal, because decisions can alter RNG consumption. Also perform isolated, same-state perturbations of training/academy/shop signals to validate directional causal wiring.

## Analysis gates
1. Is a 10-year passive strategy economically dominant? Quantify.
2. Does training improve the actual player-development flow? Distinguish skill gains from churn, ageing and transfers.
3. Does the academy create usable first-team players, or only youth intake? Show minutes, graduates, fees.
4. Does commercial construction earn back capital and recurring costs? Measure incremental revenue and payback, not merely cash.
5. Are stadium capacity, safety and access correctly binding? Test before adding seats.
6. Do denied projects show reasons, and are construction expenses actually booked?
7. Do promotions increase long-run resources without creating guaranteed snowballing?
8. Are save/load, club-switching and the match -> newspaper -> home loop intact?

## Changes
Do not rewrite formulas from one run. First fix test instrumentation. If at least two independent diagnostics identify a specific imbalance, make the smallest isolated formula change and rerun the same experiment. Keep all changes behind existing module boundaries.

## Release gates
- Local build, JS syntax, existing smoke, deterministic seed replay, ten-season runs.
- Compare baseline and candidate in a clear before/after table.
- No broken navigation or invisible actions on mobile.
- Only one controlled Pages deployment after passing gates. No Actions-based exploratory loops.
- If local test execution or browser verification is unavailable, report the exact gap and keep changes on an audit branch. Do not claim release completion.
