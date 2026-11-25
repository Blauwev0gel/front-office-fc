# L2.5 — Functionerende cluborganisatie

Overall status: IN PROGRESS. A1 (recruitment cycle) and A2 (youth cycle) are TESTED; A3 and B are PLANNED.

## Scope and principle
L1 owns the football world, L2 owns governance, and L2.5 makes the club's operational cycles visible and lasting.
The chairman sets policy, staffing, budgets and the recruitment strategy; the director (TD) does the recruiting.
L2.5 adds no individual staff agents (that is L3), no story (L4) and no dynasty (L5).
Navigation: CLUB → DEPARTMENT → WORK → RESULTS → DECISIONS. The recruitment cycle sits under Club → Football.

## Code audit (A–E)
- **A:** complete and working.
- **B:** working, but the cycle is not visible.
- **C:** partial; a link in the cycle is missing.
- **D:** only a signal or number, with no process behind it.
- **E:** absent.

| Domain | Evidence in code | Class | Critical missing link |
|---|---|---|---|
| Squad planning | `players.js squadGaps`, `market.js squadManager:100`; **new** `recruitment.js buildPlan` | C → **B** | A plan now exists, with open/filled/solved needs; there is still no multi-season age plan |
| Scouting | `market.js scoutPool:37`, `ground.js groundSignals:65`; **new** `recruitment.js scoutWeek` | D → **B** | Weekly observation of real players, with estimates that firm up; no individual scouts (L3) |
| Candidate assessment | `market.js shopFor:65` (ChatGPT: `scoutHistory`, evaluated reasons) | C → **B** | Shortlist candidates enter `shopFor` with their refined estimate; reasons are kept per candidate |
| TD decision | `shopFor`, `staff.js tdNoise:25` | B | The strategy (`recruitBias`) colours the choice; the decision is linked to a need |
| Signings review | **new** `recruitment.js recordDecision`, `signingReview` | E → **B** | "Judged then, seen now", with appearances and current club |
| Contracts/renewals | `market.js renewals:127`, `life.js` | B | Expiring contracts appear in the plan; no contract-risk pipeline yet |
| Loans | `life.js loanOut:37`, `returnLoans:48` | B/C | A loan leaves no trace in the player's history |
| Youth/academy | `players.js playersSeasonEnd:79`, `S.stats.academyHistory` (ChatGPT `8f68df64`); **new** `club/youth.js` | C → **B** | Cohorts with permanent outcomes, development lines and academy yield now exist; no separate youth competition (deliberate) |
| Training | `players.js playersWeek:59`, `staff.js coachGrowth:24` | B | Only an aggregate (`youthGrowth`); no growth per player |
| Medical | `players.js` injuries, `stats.injWeeks` | B | No recovery planning or report |
| Coach/TD | `staff.js` profiles, hiring and sacking | B | No performance review against the plan |
| Commercial | `commercial.js sponsorOffers:35`, `budgetRows:17` | B | No activities ledger |
| Members | `members.js membersWeek:19`, `holdAGMs:55` | B | Explicit member issues are missing |
| Ground/facilities | `ground.js startProject:118`, `projects.js` | B | No combined investment plan |
| Finance | `finance.js financeSeasonEnd:120`, ledger | A/B | Department investment is not set against results |

Verification of ChatGPT's commits (`60b1f460`, `8f68df64`, `6683cdf1`, `d8538283`, `2b790a87`, `c8191a10`):
- **Correct:** the restored free-agent loop (broken earlier by an inline `//`), `bv=-Infinity` for emergency signings, and the search snapshots with reasons.
- **Side effect, fixed in `c8d1526`:** tying new free agents to `S.qref`, together with emergency signings outside the wage cap, collapsed the economy. New players now have a fixed level, and emergency cover must fit within the cap.

## Build order
1. **A1 Recruitment cycle**: need → scouting → assessment → TD decision → review. *TESTED.*
2. **A2 Youth and development cycle**: cohorts with permanent outcomes, development history per player, minutes, step-up into the plan's `ready` list, loans and departures kept in history. *TESTED.*
3. **A3 Integration**: the plan uses youth readiness, the coach and medical departments report against the plan, and multi-season validation. *PLANNED.*
4. **B Club operations**: commercial activities, member issues, facility investment plan, department accountability (investment → result). *PLANNED.*

## A1 — Recruitment cycle (architecture)
- **State:**
  - `S.ops = {plan:{s,w,needs[],ready[],next}, shortlist[], signings[]}`, for the player's club only.
  - `F(id).policy.recruit` holds balanced/youth/experience/value for every club.
  - Old saves get `opsAfterLoad()`, and the policy default comes from `SetSquadPolicy`/`finInit`. VERSION stays at 7: the new state is optional, and old saves load with defaults.
- **Plan (`buildPlan`):**
  - Need kinds and priorities: hole (3); expiring contract of a good player (2); transfer request (2); starter aged 32+ (1); weakest starter well below the squad (1).
  - Needs keep their status and history: open → filled (by whom) or solved.
  - Runs at the start of the game, in the week before the winter window, in the renewal week and around the summer window.
- **Scouting (`scoutWeek`, every week):**
  - Looks per week: `1+floor(scouting/1.5)`.
  - Positions are weighted by need kind (hole 3, upgrade/leaving 2, otherwise 1).
  - Half the looks go back to the least-watched player on the list; the scouts only watch players who can be had and are affordable.
  - Each look is noisy, with `scoutNoise = 1.4·clamp(.9−.08·scouting, .35, .9)`, and the estimate is the running average.
  - The list holds at most 12 players being watched; the weakest cautious estimate drops out.
- **Assessment and decision (`shopFor`):**
  - Players on the shortlist join the options and are judged on the refined estimate.
  - The director deducts half of the uncertainty (`scoutRange` for watched players, `eyeRange` for one glance), so watched players are judged more fairly.
  - The strategy adds `recruitBias`.
  - `recordDecision` links the signing to the need and records why each listed candidate was rejected.
- **UI (`ui/recruit.js`, Club → Football):**
  - Strategy choice.
  - Squad plan: top 5 needs with timing (Urgent/Soon/Later) and "Ready to step up".
  - Shortlist with estimate ± range, number of looks and last reason.
  - Signings review: "judged then, seen now".
- **Command:** `SetSquadPolicy {recruit}`, logged in the decision journal.

## A2 — Youth development cycle (architecture)
- **State:**
  - `S.youth = {cohorts:[{s, ids, level}], grads:{pid:{name, pos, s, q0, pot0, peak, dev[], status, fate, regular}}}`, for the player's club only. At most 15 cohorts are kept; records of older cohorts are removed with them.
  - `p.dev` holds one line per season for the player's own players aged ≤23: `{s, age, q, apps, where}`, where `where` is the loan club.
- **Recording:**
  - `youthDevRecord` runs at season end, before ageing.
  - `youthIntake` runs after the summer intake.
  - `youthLeft` is called on every departure route: transfer (with fee and buying club), release, end of contract, academy release, retirement.
  - `youthReconcile` runs after the winter window and at the end of the season, and catches everything else. A record stays after the player leaves.
- **Potential vs quality:**
  - `potentialSeen` = true potential plus a fixed error per player, which gets smaller with better academy staff.
  - `potentialBand` compares it with the squad: Future starter / First-team player / Squad player / Unlikely to make it.
- **Pathway (`pathwayOf`):** On loan / Starting / Ready to step up (from the A1 plan `ready`) / Needs games (fewer than 25% of matches while still able to grow) / Developing.
- **Academy yield (`academyYield`):** over the last 5 cohorts, the regulars (≥10 apps in a season for the first team), first-team appearances and transfer fees, with the outcome per graduate.
- **UI (`ui/youth.js`):**
  - Club → Academy shows the pathway, the loan decision in context (`SetSquadPolicy {loans}`), young players now and the academy yield.
  - The player sheet shows "Development · end of each season".
- **Old saves:** `youthAfterLoad` rebuilds cohorts from `S.stats.academyHistory`. Development lines start from the next season. VERSION stays at 7.

## Test results (A2)
- **`tests/youth-test.js` (≈7 s), green:**
  - one cohort per summer, and every graduate has a record;
  - graduates who leave keep how and when they left;
  - graduates without an outcome really are at the club or on loan from it;
  - sold graduates name the buying club;
  - development lines exist;
  - the academy yield adds up;
  - save and load keep the records, an old save rebuilds them, and recording continues afterwards.
- **Browser (390 px, light and dark):** the academy sheet renders and the loan toggle works, with no errors and no horizontal scroll.
- **Limitation:** small clubs produce one graduate per summer, so the yield there is thin. That is a balance question for phase 5, not something to solve here.

## Test results (A1)
- **`tests/l25-test.js` (≈7 s), green:**
  - the plan has needs;
  - the shortlist has ≥6 real players at ≥2 positions;
  - better scouting gives more looks;
  - summer signings are linked to needs;
  - filled needs record who filled them;
  - the youth strategy signs younger players;
  - save and load keep `S.ops`.
- **Measurement over 4 worlds × 2 seasons:**
  - 41 signings, of which 7 came from the shortlist (previously 3 of 32).
  - Average estimate error: 0.66 for scouted players and 0.72 for unscouted ones (previously 2.47, inverted).
- **Light suite:** build, save-test, smoke-test, l25-test and a 20-season sim are green. The sim shows 2 administrations and a cash median of 245.
- **Browser (390 px, light and dark):** the plan, shortlist and strategy toggle render with no errors and no horizontal scroll.
- `tests/playtest.js` is outdated since ChatGPT's 16-tile hub (`fdfb8a9`) and fails on the old selectors. This is not caused by A1, and the fix is still open.

## Remaining shortcomings (A1)
- The shortlist influences a minority of signings (≈17%). The rest still come from the director's ad-hoc search in the window.
- The plan has no age profile across multiple seasons and no budget per need.
- Computer clubs use the strategy but have no plan or shortlist (deliberately, for speed and save size).
- The chairman cannot yet mark a need as a priority; that is a possible A3 decision, kept within the "frame, not micromanagement" principle.

## Relation to L3–L5
- **L3 (staff as agents):** individual scouts with a region and judgement replace `scoutNoise`. The director becomes an agent who maintains the plan himself. The data structures (`plan`, `shortlist`, `signings`) stay the same.
- **L4 (story):** a signing that disappoints, or a scouted gem, can become a story through the review. A need that stays open is a source of conflict.
- **L5 (dynasty):** cohort outcomes (A2) and signings history become the club's long-term memory.

## Acceptance / validation
- [x] `node build.js` and the generated HTML.
- [x] Save/load, including `S.ops` (l25-test, save-test).
- [x] Windows simulated; signings linked to needs.
- [x] Browser smoke test at 390 px, light and dark (recruitment panels).
- [x] `tests/playtest.js` updated to the new hub (club opens on the office; sections via the hub).
- [x] A2 multi-season youth outcomes (youth-test, 5–6 seasons).
- [ ] A3 integration and the owner's playtest.

No PLAYABLE or RELEASED claim until the playtest is green and the owner has played it.

## Besproken en gebouwd, 25 november (D-S1, D-G4)
- **Spelers zijn de motor** (D-G4): vinden, opleiden, zien groeien, verkopen; de voorzitter struint de wereld af.
- **De week van de voorzitter** (`club/chairtrips.js`, D-S1): één activiteit per week. Scoutingreis naar één van acht regio's (eigen profiel, reiskosten, leegvissen per seizoen), jeugdtoernooi (uitnodigen → volgende zomer academie), data-dag (spelers die beter zijn dan hun prijs) of op de club.
- **Dossier en aanbevelen:** vondsten met schatting en twijfel; aanbevolen spelers komen op de shortlist van de directeur met extra gewicht; het dossier toont waarde toen → nu en waarom de directeur een aanbeveling (nog) niet tekende.
- **Moneyball-bord** (`S.mb`): elke speler in en uit met fee, groei en wedstrijden; hit rate en beste deal.
- **Scouting volgt alleen spelers die ertoe doen** (vanaf selectieniveau − 1,5).
- **Open:** partnerclubs, regio's die opengaan met reputatie, clubfilosofie, rivalen die meedingen (mijlpaal M5); de balans van fees en budgetten (zie L2 §13).
