# V18.6 — Long-term investment balance, implementation checkpoint

## Implemented
- `src/club/finance.js`: weekly upkeep now scales with developed complex plots, stadium facility levels and stand rings. This is booked through the existing `weekLines` -> `financeWeek` -> `book` ledger path and applies to all clubs. No new save fields.
- `src/ui/upgrades-v186.js`: investment descriptions disclose recurring upkeep and continuing effects.
- Existing training, medical, academy, scouting, clubhouse, commercial, access, catering, stadium and pitch effects are reused rather than duplicated.

## Executed regression (one seed, 10 seasons each)
Assembled original V18.4 JavaScript with the changed V18.6 finance module and upgrades UI. All four scenarios ran to season ten without JS exceptions.

| Route | Accepted projects | End cash £k | End squad strength | Final-year upkeep £k |
|---|---:|---:|---:|---:|
| Control | 0 | 301.94 | 59.56 | 36.30 |
| Training | 7 | 440.85 | 54.46 | 26.10 |
| Commercial | 10 | 129.58 | 54.56 | 43.48 |
| Academy | 8 | 221.74 | 63.95 | 38.70 |

## Limitations and next gates
- These are scenario outcomes, not isolated causal effects; different project decisions change RNG consumption, league trajectory and club tier.
- Some clubs changed tiers and project counts differ. Maintenance differences also depend on changing stadium and facilities.
- Commercial investment ROI is not yet validated and may be negative.
- Need paired five-seed tests, isolated signal perturbations, weekly revenue and upkeep attribution, and browser/smoke verification.
- No deployment to main or Pages. Do not claim that all upgrades are proven to have satisfying long-term gameplay impact.
