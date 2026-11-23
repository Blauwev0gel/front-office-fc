# Northmarch V18.6 — Training / Youth / Medical / Stadium balance improvements

Date: 2026-11-23. Branch: `feature/northmarch-upgrades-cashflow-v186`. No live promotion or Actions runs.

## Code changes
1. `src/club/ground.js`: recurring upgrade-cost curve reduced for training and medical to 1.32^level and academy to 1.22^level (commercial was already 1.28). The original generic cost escalator was excessively punitive over multiple upgrades; all changes use existing `projectCatalog` and `StartProject`.
2. `src/football/players.js`: medical injury prevention uses `1.25/(1+.18*med)` with training/medical synergy, rather than a hard `1.25-.15*med` clamp at .45. Higher upgrades therefore continue to offer diminishing marginal protection.
3. `src/football/players.js`: academy graduation thresholds adjusted to 2.5 and 5.5 academy signal; intake ability per academy signal .25 → .34; potential per signal .35 → .48. Effect remains dependent on actual season-end academy intake and players' development.
4. `src/ui/upgrades-v186.js`: stadium projects now disclose computed immediate extra licensed capacity, including a clear zero-benefit warning when licences or raw ground capacity are currently limiting. No RNG calls or save mutations in UI rendering.

## Exact engine validation
Engine runs used released V18.4 inline JavaScript, substituting the current branch's **three** modules: `football/players.js`, `club/ground.js`, `club/finance.js`. The normal project catalog, StartProject, 30-week seasons and closeSeason were used. One planned named upgrade was attempted each season for each 10-season route, seed 1804. These are **divergent single-seed strategy trajectories, not causal matched paired trials**.

| Route | Accepted projects | Construction paid £k | Final cash £k | Final squad | Negative-cash weeks | Specific indicator |
|---|---:|---:|---:|---:|---:|---|
| Passive control | 0 | — | 193.2 | 51.43 | 12 | youthGrowth 58.16, 14 intake, 182 injury weeks |
| Training | 6 | 486.2 | 1200.6 | 57.01 | 0 | youthGrowth 69.04 |
| Academy | 9 | 895.3 | 255.7 | 64.47 | 0 | 22 intake, average best intake PA 15.06 |
| Medical | 10 | 1282.0 | 120.5 | 54.44 | 16 | 98 injury weeks |
| North stand | 10 | 457.0 | 574.1 | 58.19 | 0 | final-year gate 363.8 |

Control last-year gate £351.5k. Higher/lower gate cash in divergent scenarios cannot be assigned causally to stands.

## Isolated immediate effects across five start seeds (1804–1808)
- Upgrade to training level: project catalog £34k; effective training signal +0.9 to +1.1 per level.
- Upgrade to medical level: project catalog £53k; prevention signal +0.9 to +1.0 per level (medical risk formula now diminishing without premature saturation).
- One North Stand ring: catalog £45k; **+400 licensed places** in each of these five start states; this is additional capacity only, not proof of attendance/gate ROI.
- Initial generated clubs in these five seeds did not have an existing academy plot, so isolated *academy level-up* could not be tested without a prior real construction project. The 10-season academy strategy above tests the real construction path.

## Verification
- Syntax parsing of all four modified modules: PASS.
- 10-season full world simulation, seed 1804, four upgrade routes and passive control: PASS without observed JS exceptions.
- Five-seed deterministic immediate-signal check for training, medical and North Stand: PASS.
- Full manifest browser build, save/load regression, UI smoke, causal one-time ROI across five 10-season seeds: NOT RUN.

## Status
| Area | Implementation | Directional test | Release status |
|---|---|---|---|
| Training | IMPROVED | PASS: development signal and growth measured | HOLD full regression |
| Academy | IMPROVED | PASS: actual graduates and quality measured | HOLD full regression |
| Medical | IMPROVED | PASS: injury model, injury weeks measured | HOLD full regression |
| Stadium | IMPROVED (decision guidance) | PASS: conditional licensed capacity verified | HOLD demand/gate causality |

Improved means changes have been implemented and directionally validated, **not** that the entire economy has been fully balanced or that every repeated upgrade is economically rational. Ten medical upgrades still led to 16 negative-cash weeks: overinvestment remains a real risk. Do not automatically release to main on the basis of this test alone.
