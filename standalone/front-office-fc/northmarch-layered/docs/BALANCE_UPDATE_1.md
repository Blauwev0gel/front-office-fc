# Balance update 1 — facility running costs follow the division (UNTESTED, for the testing agent)

Branch: `claude/loving-goodall-uv00vn`. Claude made this change without running simulations (the owner asked for low cost);
**the testing agent must validate it** and report numbers, not claims.

## The problem (measured on V19, slimline-main 7bb5cc4)
- `sim-test` red: 39 administrations (limit 33), 163 chairmen voted out (limit 133).
- Median cash by division: division 0 piles up (~£1.6M), divisions 3–4 only £1–15k.
- Cause: `PRO_COST` (facility running costs, £k/year) is absolute, while income differs ~30x between division 0 and 4
  (`TV=[4.6,2.2,.8,.35,.15]` per week). One level-3 academy (£11k/yr) is ~20% of a division-4 club's income.

## The change (one rule, `src/club/ground.js`)
`facilityAnnual(kind,lv,id)` is multiplied by `FAC_SCALE=[1,.6,.3,.15,.08]` by the club's division.
Division 0 is unchanged. Build prices (plot cost 1.85^lv) are unchanged, so the top levels stay out of reach for small clubs.
Intended logic: maintenance-only holds ground; moderate investment pays; reckless investment still hurts; low divisions stop bleeding.

## What to test (bounded; do not rerun CI repeatedly)
1. `bash tests/run-fast.sh` — target: sim-test inside its limits (≤33 / ≤133), nothing else new red.
2. `node tests/balance-strategies.js <tier> <seed> 8 out.json` (needs `ONLY=hold,cut,boost,smart,max`): per division 0–4, seeds ≥3, compare
   `hold` (maintenance), `cut`, `boost` (staff 4), `smart` (build with reserve), `max` (everything).
   Expected: `max` ends with the least cash and often worse results at divisions 2–4; `smart`/`boost` beat `hold` modestly in points or cash-per-points;
   `cut` slowly stagnates; no strategy dominates in all divisions; division 3–4 median cash > £15k.
3. Report per division: cash, points, position, injury weeks per strategy. If the factors are wrong, tune only `FAC_SCALE`.
Do not claim balance is proven from a small sample.

## Balance update 2 (with the weekly agenda, untested by Claude)
- Staff weigh more in every department signal: `groundSignals` staff term `staff*.3*budget` → `staff*.45*budget` (`src/club/ground.js`).
  Goal: hiring a coach, physio or scout has a felt effect within weeks, so agenda choices matter. Applies to AI clubs too.
- To test: does an extra staff level now give a measurable effect (growth, injury weeks, scouting looks) inside 5–10 weeks; does sim-test move.
