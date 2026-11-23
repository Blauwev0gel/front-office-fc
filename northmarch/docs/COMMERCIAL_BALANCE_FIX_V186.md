# Commercial investment balance correction — V18.6

## Implementation
- `src/club/ground.js`: commercial plot upgrades use cost `round(25 * 1.28^currentLevel)` rather than the generic `lvCost(25,currentLevel+1)` with 1.6 growth.
- `src/club/finance.js`: merchandise gain from commercial shop signal increased to `retailGain*.32` and events to `retailGain*.25`. Both use `log2(1+signal)`, preserving diminishing returns and supporter-demand dependence.
- Existing weekly upkeep, ledger and save structure unchanged.

## Full ten-season regression
Engine assembled from released V18.4 JS with branch's ground.js and finance.js substituted. Real StartProject commands, 30 matchweeks per season, seed 1804.

| Route | Accepted projects | Cumulative build £k | Final cash £k | Final squad | Final season merch £k | Final season events £k | Final season upkeep £k | Negative-cash weeks |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Control | 0 | 0 | 932.9 | 52.7 | 48.7 | 37.0 | 24.9 | 0 |
| Commercial | 7 | 529.0 | 848.6 | 54.7 | 65.1 | 69.3 | 32.4 | 0 |

Cash differential -£84.3k, with £529k construction across ten seasons. Final-year merchandise and event income are £48.7k higher in the commercial route; these figures include differences in club demand and competition trajectory and are **not** a causal estimate.

## Isolated level-1 commercial upgrade — five starting seeds
To isolate direct weekly effect, each seed's identical initial club was evaluated before and after one plot-level increase (without running a season or changing RNG). Revenue lines and upkeep were compared, then annualized over 30 weeks. Construction price from real catalog.

| Seed | Price £k | Extra annual net £k | Simple static payback years |
|---|---:|---:|---:|
| 1804 | 32 | 15.0 | 2.1 |
| 1805 | 32 | 10.2 | 3.1 |
| 1806 | 32 | 15.6 | 2.1 |
| 1807 | 32 | 15.9 | 2.0 |
| 1808 | 32 | 9.9 | 3.2 |

The isolated benefit is `delta(merch+events+upkeep)`; this is a static calculation at the initial supporter base, not an observed 2-3 year payback in a simulated evolving world. Real build delay, overruns, supporters, sponsorship, inflation and cash financing are not incorporated into these simple ratios.

## Decision
Commercial upgrades now have a measurable incremental direct return and ten-season scenario remains solvent. **Partial PASS for commercial economics**, not an overall game-economy release pass. Remaining: multi-seed ten-season paths, all eleven upgrades, exact manifest build, UI and save/load smoke, and causal post-build long-term return checks. No deployment and no GitHub Actions runs.
