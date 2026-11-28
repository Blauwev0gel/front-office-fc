# NORTHMARCH Research 02 — Financial Operating Model
28 November 2026. Desk research v1. Advisory, not canon. Baseline dbabc15; read MB-47, Research 01, existing R01/R02/R07/R08 and G01/G02/G07–11. No code changes.

## 1. Findings
Profit, cash, budget authority and financial capacity are distinct. A club can report profit while unable to pay wages. Recurring costs outlive the decision to incur them. Football transfers and promotion are volatile, not dependable baseline revenue. Member ownership requires credible financing alternatives to unlimited owner injections.

## 2. Sources and benchmarks
Primary sources:
- [Exeter statutory accounts 2025](https://find-and-update.company-information.service.gov.uk/company/00097808/filing-history/MzUxODcyNzgyMWFkaXF6a2N4/document), turnover note p27.
- [Exeter 2024 club statement](https://www.exetercityfc.co.uk/Accounts2024).
- [Exeter Trust reserve FAQ](https://weownexetercityfc.co.uk/faqs/).
- [Independent Football Regulator State of the Game](https://sotg.footballregulator.org.uk/).
- AFCW PLC 2025 filed accounts, turnover and other operating income notes p34, company 04764827; durable [filing history](https://find-and-update.company-information.service.gov.uk/company/04764827/filing-history).
- [UK Parliament financial sustainability briefing](https://commonslibrary.parliament.uk/research-briefings/CDP-2025-0041/).
Secondary reconciliation:
- [Exeter multi-year transcription](https://psrwatch.com/club/eng-exeter/financials).
- [Exeter cash and profit series](https://theaccounts.uk/company/00097808/exeter-city-a-f-c-limited/).
- [BBC March 2026 Exeter crisis](https://www.bbc.co.uk/sport/football/articles/cm2r9g8j33yo).

## 3. Data catalogue
Exeter FY ending June, GBP millions, rounded:
| FY | Turnover | Total staff costs | Operating result | Cash | Operating cash flow |
|---|---:|---:|---:|---:|---:|
| 2021 | 2.4 | ND | -1.4 | 1.9 | ND |
| 2022 | 4.5 | 4.0 | -0.3 | 3.3 | 2.0 |
| 2023 | 5.8 | 4.9 | -1.1 | 1.1 | 1.0 |
| 2024 | 6.569 | 5.1 | -2.947 | .318 | -.3 |
| 2025 | 8.213 | 6.9 | -4.385 | .347 | -1.2 |
Sources secondary transcriptions above; ND not zero. Total staff costs include employer costs, not just wages. 2025 net profit .348m despite operating losses; subsequent trust loans .6m reported by BBC. Do not infer causality from annual aggregates.

Exeter FY2025 turnover mix, exact GBP:
| Stream | 2024 | 2025 |
|---|---:|---:|
| Gates | 1454880 | 1361318 |
| Season tickets | 800090 | 808738 |
| Commercial | 1838941 | 2436251 |
| League | 1811351 | 2710542 |
| TV | 10000 | 10000 |
| Food/drink | 653690 | 886029 |
| Total | 6568952 | 8212878 |

AFC Wimbledon FY2025 turnover 10.195m vs 9.028m prior. Match receipts/prizes/player loans 6.137m; merchandise 1.082m; sponsorship .1.043m (i.e. 1.043m); food/events .861m; donations/sundry .526m; youth development .546m. Other operating income 1.154m including .942m flood insurance, .146m flood donations: do not treat these as recurrent. Categories differ from Exeter; no direct stream comparison without mapping.

IFR top five divisions external financing per £1 revenue: PL .33, Championship .57, League One .72, League Two .26, National League .55. 66% of responding clubs reported survival <=90 days without fresh owner funding, 29% <=30 days. 67 clubs received >=6 injections March 2025–March 2026, 28 >=12. These describe observed dependence, not desirable targets; do not extrapolate to grassroots.
Exeter Trust changed reserve from three to two months wages in 2024; FAQ distinguishes working capital from available cash. Use separate indicators.
Parliament briefing: lower EFL tiers depend more on matchday receipts; historical 70% wages/revenue guideline is not the same as a current UEFA squad cost regulatory calculation.

## 4. Financial ontology
Cash ledger, accrual reporting, restricted funds, receivables, payables, contractual commitments, debt and capital assets. Minimal engine can omit full statutory accounting but must not conflate these. All amounts in integer minor currency units; consistent week IDs.
Revenue: tickets (walk-up vs prepaid season tickets), member dues, sponsors (fixed/bonus/in-kind), merchandise gross sales and cost of goods, concessions margin, league distributions, grants with restrictions, prize money, player trading and conditional clauses. Financing is not revenue. Cash collected in advance is not repeated on each match.
Costs: player and nonplayer payroll, employer costs, travel, rent, matchday, utilities, insurance, academy, medical, administration, taxes, debt interest, maintenance. Capex versus operating cost. Distinguish rent from owned-ground maintenance.
Transfer fee: separate signing date, instalments, contingent add-ons, sell-on liabilities and optional amortisation; no duplicated fee at registration and settlement.
Capital expenditure: feasibility, approvals, deposit, milestone payments, variation/contingency, commissioning, ongoing maintenance. Benefits only after operation. No automatic loan.
Funding: member contributions, community bonds, bank credit, grants, player sales, cost reduction. Each has approval, timing, amount, restrictions or repayment. No unlimited owner cash.

## 5. Proposed simulation contract
cash[t+1] = cash[t] + actual receipts - actual payments.
available unrestricted cash = bank cash - restricted balances.
forecast[t+h] = current unrestricted cash + dated forecast inflows - dated obligations. Forecast base/stress/upside, with uncertain transfers excluded from base until contractual.
headroom = minimum forecast cash over horizon - policy reserve.
budget remaining = approved allocation - recognised spend - open commitments (avoid double counting).
Feasibility(action) returns cash impact by week, budget impact, required authority, capacity impact, conditions and reasons. Same function for autonomous and chairman-initiated actions. A budget increase is not cash creation. Prevent duplicate bookings with unique transaction/commitment IDs.
Reserve proposal: desired months of essential expenses, distinguish hard floor zero from policy floor; override only through explicit authority and visible consequences.
Loan: principal P, weekly rate r, n payments; payment P*r/(1-(1+r)^(-n)), zero-rate P/n. Credit decision considers stressed debt-service capacity, collateral and lender willingness. Offer may be refused or delayed. Fees, covenants, repayment and default recorded.
Forecast horizons: 13-week liquidity and season-end outlook proposed for UI, not empirically prescribed. Do not expose spreadsheets as mandatory chores.

## 6. Illustrative founding club calibration fixture (not research measurements)
Synthetic GBP annual recurring receipts: member dues 12k, matchday 24k, sponsorship 20k, net ancillary receipts 4k =60k. Costs: football 24k, staff 8k, pitch 10k, match operations 8k, admin 5k =55k. Opening cash 12k, desired reserve 5k. Sponsor paid 10k twice a year; dues paid up front; gate spread over 20 home dates. Summer no gate. Fixture for tests, not universal amateur economics. Model gross merchandise and COGS separately when enabled, avoid double counting net ancillary fixture. Stress with 25% gate drop, delayed sponsor instalment, injury-related cost, promotion wage increment. No calibrated wage/attendance levels yet.
Example liquidity: opening 12k, month 1 receipts 2k/payment 8k ->6k; month 2 receipts 1k/payment 8k ->-1k; month 3 contracted sponsor 10k/payment 4k ->5k. Positive total horizon cash change does not prevent intermediate default. An additional 4k investment worsens trough to -5k. Show minimum cash, not merely end balance.

## 7. Chairman decisions F01–F14
F01 annual budget goals; F02 midseason revised forecast; F03 reserve policy; F04 approve staff contract; F05 transfer offer with instalments; F06 sponsor price/term/ethics; F07 season ticket pricing and prepayment; F08 member financing; F09 bank loan/refinancing; F10 phased capex or defer; F11 contingency cuts; F12 grant restrictions; F13 overdue receivables/collections policy; F14 restructuring under relegation. Each case must show alternatives, risk, time, authority, and actual later outcome. Staff handle collection, invoicing and routine payments. No per-invoice chairman decisions.

## 8. Current prototype gaps
At dbabc15: forecastLow extrapolates current weekly balance; startResearch can raise department budget automatically; startBuild automatically funds shortfall through debt and books cost upfront. Existing budget, reserve, loans, projects and ALV should be retained and connected to shared ledger. No verified comprehensive dated commitments or three-scenario forecast. Static review only.
Implementation slice: 1 ledger and commitments, 2 recurring/dated cash schedule, 3 feasibility API, 4 board budget and reserve, 5 staff projects and sponsor timing, 6 phased capital and financing. Preserve save migration and existing defaults; don't silently cancel valid old obligations. No UI rewrite.
Finance tile: cash, next 13-week low, forecast vs budget, upcoming obligations, available headroom, material exceptions. Weekly inbox: only meaningful variance or proposed decision. Seasonal ALV includes actual versus plan.

## 9. Tests and acceptance
Ledger reconciliation each week; no duplicate receipt; restricted grant cannot fund wages; annual season ticket cash not repeated; cancelled project releases unspent commitment but not sunk cost; loan principal and interest reconcile; rejected financing cannot start build; forecast detects intermediate shortfall; transfer instalments arrive only when due; relegation reduces future revenues but wages persist; save/load retains schedule. Paired 10-season local runs: conservative, youth trading, commercial and aggressive; report insolvency, cash trough, operating margin, payroll burden, debt service, member funding, promotions, infrastructure and meaningful decisions. Sensitivity ±25/50% synthetic variables. No heavy CI. No balance claim before runs.
Success: no universal optimal debt strategy; profitable club can face liquidity crisis; prudent growth viable but not guaranteed; losses have consequences and recovery routes; no invisible cash creation.

## 10. Limits and handoff
This completes v1 finance architecture research, not calibrated economy. England-heavy evidence, two detailed operating club revenue mixes and one longitudinal series, no representative amateur accounts, staffing wages, ticket elasticities or lender terms. No direct account audit beyond retrieved notes; secondary values labelled. Future calibration needs more grassroots/semipro countries, domestic specific rules and distribution data. Next block 03 Department Intelligence: use finance feasibility and Research 01 work capacity as constraints, not independent upgrade systems. Master Bible decisions remain binding; proposed models await approval.
