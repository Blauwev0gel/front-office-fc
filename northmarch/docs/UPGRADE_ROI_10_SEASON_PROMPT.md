# Northmarch — Individual Upgrade ROI Audit, 10 Seasons

## Goal
Make each of the 11 player-facing upgrade routes meaningful over the long term without making every investment guaranteed to pay off. The player must understand price, completion time, maintenance, the system affected, when the benefit begins, and the risk of no payback.

## Procedure
1. Use the actual V18.6 finance module and existing ground/football engine. Never fake project completion, income, or match results.
2. Run a passive control and each of 11 routes for 10 seasons, starting from the same seed. Try the named project once each season, using real projectCatalog keys and StartProject. Log accepted/denied and build costs.
3. Track cash, debt, construction, recurring upkeep, league tier, squad strength, and route-specific signal.
4. For causal ROI, run multiple seeds, isolate one upgrade at a time (not 10 upgrades), use matched pre-construction state and RNG, and compare direct revenue lines and costs for 5 seasons after completion. Never treat a cash difference from a divergent league path as causal return.
5. Identify whether each investment's signal is actually consumed by a simulation system. Mark conditional investments (stands/access/safety, commercial demand, academy pathway).
6. Rebalance only proven defects: keep long-term maintenance, avoid costless bonuses, and show a realistic payback or explicit nonfinancial benefit. Do not invent effects.
7. Validate build, smoke, save/load, 10-season regression, mobile navigation, match/newspaper loop. Deploy only after all gates pass; no exploratory GitHub Actions.

## Decision standard
A strategy can fail, but every purchase must have a measurable route to a useful outcome and the player must be told what determines that outcome. Flag upgrades that are technically functional but economically irrational or too weak to feel.
