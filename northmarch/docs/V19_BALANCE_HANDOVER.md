# Northmarch V19 — balance handover

Release commit: 4f091cab72452b82a555dc695a8b1945c9cfae18. The deployed build route is main/northmarch/build.py, currently embedding the standalone HTML; modular sources are NOT synchronized. Extract the actual HTML and reconcile modules before editing. No Pages deployment verification yet.

## Observed simulations
64 season observations across 12 runs, two seeds, both starting in division 1. Values below transcribed from local JSON logs; cash in £k, division 1 highest. Each row is a separate run. Rankings and cash are recorded BEFORE closeSeason, not after promotion/relegation.
| Seed | Club | Strategy | Orders | Divisions by season | Ranks | Cash by season |
|---|---|---|---:|---|---|---|
|1804|c27|control|0|1,1,1|10,13,16|596.8,581.6,771.1|
|1804|c27|academy|2|1,1,1|9,6,10|505.6,647.1,591.3|
|1804|c27|scouting|3|1,1,1|6,8,16|519.7,292.1,420.8|
|1804|c27|training|1|1,1,1|10,12,15|526.2,312.4,502.0|
|1804|c27|medical|1|1,1,1|10,12,16|526.2,337.6,714.7|
|1804|c27|commercial|2|1,2,1|15,1,4|349.1,474.0,431.1|
|1804|c27|stadium|8|1,1,1|6,10,15|435.4,511.6,580.6|
|1804|c27|balanced|6|1,1,2|6,15,9|475.1,495.4,432.3|
|1805|c10|academy|3|1,1,1,2,3,2,2,2,1,1|14,10,16,15,1,5,8,1,14,9|89.4,185.9,1015,921.9,977.5,952.9,926,726,624.8,658|
|1805|c10|control|0|1,2,2,2,2,2,3,3,4,3|15,3,10,14,12,15,7,15,1,13|302.2,545.5,552.1,265.6,150.2,178.6,237.3,136,154.2,50.2|
|1805|c10|balanced|2|1,1,2,2,2,2,2,2,2,2|13,16,11,9,6,14,14,14,10,16|113,101.5,93.5,100.3,186.2,105.5,207.1,150.6,183.5,182.8|
|1805|c10|commercial|2|1,1,2,3,2,3,3,3,3,3|13,15,16,1,16,4,11,3,10,6|224,255.5,469.4,147.6,171.7,189.3,33.4,52.9,23.4,99|

## Method and limitations
First available club selected. Every 10 weeks active bots repair condition below 55 if cash remaining >100; buy cheapest eligible project if cost <20% cash and remaining cash >150. Stadium bot only selects stand rings, not licensing. Control makes no owner decisions, but director still recruits. Balanced bot chooses cheapest among training, medical, academy, scouting, commercial, not genuinely balanced. Forced reappointment after dismissal; 10-year dismissals: academy 1, control 4, commercial 6, balanced 0. Shared initial seeds do not ensure matched random streams. No maintenance-only control. No causal proof, no lower-division starts, no 20-year tests. Raw logs remain local; table is a transcription. Relative strength in seed 1804 control -4.11 to -2.80, so worsening rank is NOT proof of declining relative strength.

## Actual V19 formulas (inspected local release candidate)
Plot construction cost = base * 1.85^(level-1). Annual operating costs in £k for levels 1–8:
|Department|1|2|3|4|5|6|7|8|
|---|---:|---:|---:|---:|---:|---:|---:|---:|
|academy|2|5|11|22|40|75|125|210|
|training|2|4|8|16|30|55|95|160|
|medical|1|3|6|12|23|43|75|130|
|scouting|1|3|6|12|22|40|70|120|
|commercial|1|2|5|10|18|34|60|100|
|clubhouse|1|2|4|8|15|28|48|80|
|parking|1|2|3|6|11|20|35|60|
Operating level = min(physical level, tight:max(1,staff), normal:max(2,staff+2), generous:max(3,staff+3)). Annual cost = 20% physical level cost + 80% operating level cost. Effective facility signal multiplies operating level by (.2+.8*condition/100) and department factor. Weekly wear .55 stands, .50 facilities/plots; recovery budget .10/.32/.70 times (.7+.1*staff). Training growth (.08+.19*training)*coachGrowth*culture factor / season weeks. Medical risk clamp(1.25/(1+.27*med)-fitness adjustment-team manager adjustment,.32,1.3). Academy intake 1–3, thresholds 2.5/5.5 effective academy signal; quality base-3.8+.60*a+culture+random; potential q+.6+.85*a+culture+random; contract 3. Wage cap min(income*wageRatio, .95*income-fixed nonplayer costs)/season weeks, floored at zero. Transfer reserve max(6 weeks wages, 6 weeks recurring outflows). Recruitment value includes annualized fee/3 + annual wages relative to income, potential and uncertainty. AI repairs below 65; annual project cost limited to 12% estimated income plus affordability check. Stadium and plot prices cover all five tiers.

## Claude assignment
Reconcile standalone build with modular source and restore normal build pipeline. Preserve L1/L2 boundaries, existing saves and department tiles. Design a coherent economy, not isolated buffs. No hard division caps: upper-level facilities should be financially unsustainable at low tiers, with physical vs operating level and downsizing. Ensure maintenance-only can hold ground, passive ownership stagnates or declines relatively, youth/scouting/training/medical/commercial each have measurable distinct benefits, stadium investment respects demand and licensed capacity. Audit recurring income, wages, transfer fees, construction installments, upkeep, reserves, debt, AI parity and promotion/relegation shocks. Test actual capacity, youth first-team minutes/sales, injury burden, player growth, recruitment value and operating cash flow. Use five seeds across all five divisions, 10-year comparisons and 20-year stress tests, checkpoint locally, separate maintenance-only, overinvestment and recovery strategies. Record dismissals and post-close-season outcomes. Avoid repeated CI/Pages runs; publish only after validation and user approval. Do not claim balance proven by the present sample.
