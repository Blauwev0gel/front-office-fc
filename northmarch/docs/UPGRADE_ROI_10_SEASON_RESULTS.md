# Northmarch V18.6 — 11 Upgrade Routes, 10-Season Simulation

**Executed:** 2026-11-22. V18.4 released simulation with V18.6 finance module substituted, matching the modified economic engine. Same seed 1804 for each route, same starting club, one attempted named project per season for ten seasons. Uses real StartProject command and advances all matchweeks. The UI module itself was not browser-tested. All 12 scenarios completed without a JavaScript exception.

| Route | Accepted | Denied | Construction £k | Final cash £k | Final squad strength | Final tier |
|---|---:|---:|---:|---:|---:|---:|
| No investment | 0 | 0 | 0 | 301.9 | 59.56 | 0 |
| Training | 7 | 3 | 1226.2 | 440.9 | 54.46 | 0 |
| Medical | 6 | 3 | 1429.8 | 8.8 | 56.32 | 0 |
| Academy | 8 | 1 | 1948.0 | 221.7 | 63.95 | 0 |
| Scouting | 4 | 0 | 257.4 | 493.1 | 56.88 | 0 |
| Commercial / club shop | 10 | 0 | 1594.6 | 129.6 | 54.56 | 0 |
| Clubhouse | 9 | 1 | 1443.7 | 732.1 | 45.79 | 0 |
| Catering | 4 | 0 | 303.0 | 449.9 | 53.05 | 1 |
| Access | 6 | 0 | 576.0 | 570.6 | 60.79 | 0 |
| Safety | 3 | 0 | 339.0 | 537.5 | 53.05 | 1 |
| Pitch | 5 | 0 | 350.0 | 335.7 | 50.48 | 0 |
| North stand | 10 | 0 | 459.0 | 377.4 | 52.38 | 1 |

**Final-year non-construction operating result**: passive +£199.1k; training +£470.0k; medical -£412.3k; academy +£212.6k; scouting -£176.1k; commercial +£150.0k; clubhouse +£640.4k; catering -£96.9k; access -£491.2k; safety +£209.3k; pitch +£55.6k; stand +£109.2k. These are *total club* results, not attributable upgrade returns.

## Findings
- All 11 routes can be issued through the existing project engine; accepted project counts vary, and some routes become unavailable when capped or a site is occupied.
- Training affects weekly player growth; medical affects injury probability/recovery; academy affects intake and potential; scouting affects observations and precision. These are indirect effects that require player-level measurements to establish impact.
- Commercial and clubhouse signals feed commercial income, members, events and/or long-term support. Sponsor contracts and competition results can dominate realized cash.
- Access/safety/stands are conditional on licensed capacity and actual demand. Extra seats with no additional attendance have no direct gate return.
- Pitch affects home match conditions; the outcome must be measured across comparable matches, not inferred from final squad quality.
- Medical cash ends at only £8.8k and club-shop cash at £129.6k in this seed. These are clear warning flags, not yet evidence that their formulas are wrong.
- Clubhouse cash ends at £732.1k but squad quality only 45.79. Revenue and sport success can diverge.
- Repeated upgrade investment reaches £1.9m for academy; this is not a one-project ROI test.
- Same seeds are *not* paired causal outcomes once actions change RNG consumption, standings, and financial events. No exact payback years or investment IRR can be responsibly reported from this experiment.

## Release decision
**HOLD.** This completed the requested 10-season route audit. It does not establish that the new balance works, or that all 11 upgrades are worthwhile. Next step: isolated single-upgrade multi-seed ROI experiments with ledger attribution, then minimal balance changes. Do not promote this branch to live solely from this evidence.
