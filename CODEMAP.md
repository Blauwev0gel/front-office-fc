# Code map

Read this first. It tells you which files to open for a task, so you never have to read the whole source.

## How the source is put together
- The game is one HTML page. `build.py` joins the modules in a fixed order into `dist/index.html`.
- A module is a file (`src/recruit.js`) or a folder of numbered parts (`src/engine/`, `src/ui/`, `src/style/`).
  The parts are **fragments of one file**: they share one scope and are only valid once joined in order.
  Each part starts at one of the original `/* ---------- section ---------- */` markers.
- Tests load modules the same way through `test/src.js`.
- `engine/` is the core (`var FO = (function () { … })()`), pure logic without DOM.
  Later modules are `(function (F) { … })(FO)` blocks that add systems.
- **Hooks**: the engine calls `HOOK.name(...)` at fixed points. A module sets a hook, usually by wrapping
  the previous one: `const prev = H.x; H.x = () => { prev(); … }`. So one behaviour can be spread across
  several modules: check the "Hooks set" column below before you change a hook.
- All state lives in one object `G` (`FO.G`), saved as JSON. New state needs a safe default or a migration
  (`engine/14-save-api.js`, `VERSION`).
- All randomness goes through the seeded `rnd()` in `engine/01-core.js`.

## Find a function
```bash
grep -rn "function vInbox\|vInbox =" src
```

## Systems: where to look

| System | Logic | Interface |
|---|---|---|
| Start: DNA, staff, mandates | `engine/04-staff-dna.js` (ROLES, MAND, LEAN, DNA, genStaff), `engine/13-newgame-preseason.js` | `ui/02-setup.js` |
| Staff actions: hire, fire, talk, push, mandate | `engine/09-meetings-actions-press.js` | `ui/06-sheets-ticker.js` (vSheet), `ui/15-actions.js` |
| Departments in general: staff, budget share, KPIs | `depts.js` | `ui/08-departments.js` (vDepts, vDept) |
| Authority and escalation (the desk) | `desk.js` | `ui/08-departments.js` (authHtml) |
| Grip | `levers.js` | `ui/13-redbox-render.js` (vBar) |
| First team / Head Coach | `firstteam.js`, `engine/05-world-selection.js` (pickXI, teamStrength) | `ui/09-firstteam-review.js` (vFirst) |
| Recruitment / DoF and scouting | `recruit.js`, `recruitx.js`, `engine/07-finance-transfers.js` (sign, dofWork), `engine/11-staffwork-analysis-briefs.js` (scoutWork) | `ui/08-departments.js` (rx*), `ui/05-pitches-squad-money.js` (vRecruit2) |
| Transfer summer (v2 is the flow; `summer.js` still supplies its steps, contracts and deadline day) | `summer.js`, `summer2.js` | `ui/03-summer-preseason-press.js` |
| Academy | `academy.js`, `academy2.js`, `academy3.js`, `engine/07-finance-transfers.js` (academyIntake) | `ui/08-departments.js` (ac*), `ui/09-firstteam-review.js` (vAcademy2) |
| Pathway storyline | `pathway.js` | `ui/10-inbox.js` (pw*, pathwayCard) |
| Commercial | `commercial.js`, `engine/07-finance-transfers.js` (ticketPrice, attendance, sponsorIncome) | `ui/08-departments.js` (com*) |
| Marketing | `marketing.js` | `ui/08-departments.js` (mk*) |
| Finance / Business | `business.js`, `engine/07-finance-transfers.js` (weeklyFinance, transferBudget) | `ui/08-departments.js` (biz*), `ui/05-pitches-squad-money.js` (vMoney2) |
| Inbox, events, briefings | `engine/08-weekly-inbox.js`, `events.js`, `events2.js`, `briefs.js` | `ui/10-inbox.js` (vInbox), `ui/13-redbox-render.js` (mail*) |
| Dossiers and pressure | `dossiers.js` | `ui/10-inbox.js` (dossierCard) |
| Meetings and project pitches | `engine/09-meetings-actions-press.js`, `events2.js` | `ui/05-pitches-squad-money.js` (pitchCard, meetingBlock) |
| Board, backers, votes | `engine/08-weekly-inbox.js` (boardWeekly), `engine/12-week.js` (sack), `loop.js` | `ui/10-inbox.js` (backersHtml) |
| Week and season | `engine/12-week.js` (endWeek), `engine/10-season.js` (endSeason), `season.js` | `ui/13-redbox-render.js` (render), `ui/09-firstteam-review.js` (vReview2) |
| Club and league screens | — | `ui/07-club-league.js`, `ui/04-masthead-news.js` (masthead, tabs, vNews) |
| Match | `engine/06-match.js`, `matchtalk.js`, `matchday.js` | `ui/14-matchday-gazette.js` |
| Press and Gazette | `engine/09-meetings-actions-press.js`, `engine/12-week.js` (buildPaper), `matchday.js` (edition) | `ui/03-summer-preseason-press.js` (vPress), `ui/12-scenes-cards.js` (gazette), `ui/14-matchday-gazette.js` |
| Players: cards and profiles | `engine/03-players.js` | `ui/11-players.js` |
| Portraits, sound, office | `faces.js` | — |
| Taps and buttons | — | `ui/15-actions.js` (one `act` switch on `data-a`) |
| Styles | — | `style/` (parts in cascade order) |

## Files (generated)

Regenerate with `node tools/codemap.js` after moving or adding code.

<!-- generated:start -->
| File | Size | Purpose | Hooks set | Hooks called | State `G.*` written |
|---|---|---|---|---|---|
| `engine/01-core.js` | 2 KB | rng & utils |  |  | rs, nid |
| `engine/02-world-constants.js` | 5 KB | world constants |  |  |  |
| `engine/03-players.js` | 4 KB | players |  |  |  |
| `engine/04-staff-dna.js` | 14 KB | staff; DNA |  | effBonus |  |
| `engine/05-world-selection.js` | 4 KB | world; squad & selection |  | coachAct, selBonus, ftExtra | clubs, divs |
| `engine/06-match.js` | 15 KB | match simulation |  | homeEdge, oppStyle, ftInj, say, storyW | msNew |
| `engine/07-finance-transfers.js` | 11 KB | finance; transfers |  | attendance, gate, acadIncome, recCost, acadCost, ftCost, deptCost, merchMult, costDisc, acadSale | signLog, shortlist, dofSigned, squad, dofNote |
| `engine/08-weekly-inbox.js` | 9 KB | weekly systems; events & inbox |  | ftDev, fanWeekly, desk, evWeight |  |
| `engine/09-meetings-actions-press.js` | 17 KB | management meeting & projects (1.2); player actions; press |  |  | propCd, meeting, projects, projDone, projLog, resBy, resOf |
| `engine/10-season.js` | 9 KB | season |  | objMet, acadSeason, recSeason, seasonReprieve, summerStart | coachNews, squad, academy, lastReport, phase, week, ap, form, inbox, queue, ss, paper, pressDone |
| `engine/11-staffwork-analysis-briefs.js` | 20 KB | staff work, records & chains (1.1); analysis & scorecards (1.3); weekly briefings (1.5) |  | deskBriefs | later, reports, bcd, briefs |
| `engine/12-week.js` | 8 KB | the week |  | recWeekly, acadWeekly, acadIntake, seasonAfterMatch, edition, seasonWeekly | phase, sackReason, queue, briefs, over, paper, msNew, prev, prevFan, lastMatch, lastCup, ap, later, inbox |
| `engine/13-newgame-preseason.js` | 7 KB | new game; pre-season planning (1.4) |  | acadInit, summerStart | club, mand, cup, phase, pre, meeting, press, pressDone, paper |
| `engine/14-save-api.js` | 2 KB | save |  | acadMigrate, recMigrate | ap, later, v |
| `events.js` | 70 KB | event library (module 1) Each event: from (role/board/fans/press), dept, cd (cooldown weeks), cond, w (weight) |  |  | academy, freezePrev |
| `events2.js` | 31 KB | desk 2.0 configuration, proposals and storylines (1.2) |  |  |  |
| `events3.js` | 18 KB | event library (module 1, part 3) Two kinds of event that make a long career feel different from a short one: - |  |  |  |
| `briefs.js` | 20 KB | weekly briefings (1.5) Short, state-driven updates and conversations |  |  | dofPrio, dofPrioAt, wageFreezePrev |
| `academy.js` | 14 KB | youth academy, module 2 part 1 Age groups, academy staff, development model, education and welfare, pathway | acadMigrate, acadInit, acadCost, acadWeekly, acadIntake, acadSeason |  | acad, academy |
| `academy2.js` | 28 KB | youth academy, module 2 part 2 Category & audit, poaching and tribunals, youth competitions, ROI, academy desk | acadWeekly, acadSeason, acadIncome, acadSale, objMet |  | academy, squad |
| `recruit.js` | 40 KB | recruitment, module 3 part 1 Player world, scouting department, reports with uncertainty, recruitment pipeline | recWeekly, recCost, recSeason, recMigrate |  | shortlist, rec |
| `summer.js` | 17 KB | the transfer summer, shared parts What summer2.js builds on: expiring contracts and the squad planner, what th | summerStart |  | phase, sum, inbox, lastSummer, squad, preEdge |
| `season.js` | 18 KB | season rhythm, module 4 part 2 Season blocks with a decision each, board reviews, high-stakes matches, a small | summerStart, seasonWeekly, seasonAfterMatch, recSeason |  | rival, stake, openTarget, matchEdge, blockDone, winterPrev, winBonus, recovery, loanedOut, squad |
| `summer2.js` | 32 KB | the transfer summer, version 2 A summer meeting with the DoF and staff that ends in a signed summer brief, a t | summerStart | recWeekly | dofStrikes |
| `faces.js` | 27 KB | visual layer, part 1 Procedural ink-style portraits for every person in the game, the CEO's office scene, repu |  |  |  |
| `firstteam.js` | 22 KB | First team department The coach's own instincts vs your mandate, support staff you can fund, talks as short sc | coachAct, ftCost, ftInj, ftDev, ftExtra, selBonus, seasonAfterMatch |  | ft |
| `depts.js` | 21 KB | departments Every department is a real unit: a head, staff underneath, a budget share, facilities, KPI history | effBonus, deptCost, merchMult, ftExtra, ftDev, ftInj, seasonAfterMatch |  | dept, deptB, deptSeason, staffAsk |
| `levers.js` | 7 KB | levers Grip: a club drifts without a CEO steering it | effBonus, ftExtra, seasonAfterMatch | deptCost | grip, gripW, gripLog |
| `commercial.js` | 10 KB | Commercial department The stadium as a system (three stands, demand, price, matchday experience), sponsor offe | attendance, gate, homeEdge, merchMult, deptCost, seasonAfterMatch |  | com |
| `marketing.js` | 7 KB | Marketing department A supporter funnel (reach, fans, season-ticket holders), loyalty that cushions bad result | fanWeekly, deptCost |  | mk |
| `business.js` | 7 KB | Business department A season budget per department (lean, normal, invest) against what the club can afford, a  | costDisc |  | biz, deptB |
| `academy3.js` | 5 KB | Academy as a department you run A trial day where you pick the intake, the "is he ready?" call, and a pyramid  | acadIntake, seasonAfterMatch |  | acadX, academy |
| `recruitx.js` | 25 KB | Recruitment as a department you run The scouting network per region (focus and investment), the DoF's track re | seasonAfterMatch, recWeekly, seasonWeekly, summerStart | recMigrate | recX |
| `world.js` | 18 KB | the seeded world (B38, B39, B42) Every league of the world is computed on demand from a seed: nothing is store | seasonWeekly |  | world |
| `turnaround.js` | 7 KB | the turnaround (B37, B44) When it goes properly wrong, the board asks what the CEO intends to do | ftExtra, seasonWeekly |  | turn, turnLast, turnAsk |
| `matchtalk.js` | 8 KB | match identity and commentary Opponents get a style, a form line and a dangerous player; commentary is drawn f | oppStyle, say |  |  |
| `desk.js` | 18 KB | the CEO's desk Departments decide routine matters themselves, inside the authority the CEO gives each head | desk, deskBriefs, seasonAfterMatch, effBonus |  | auth, desk |
| `talks.js` | 19 KB | talks with the heads One conversation engine for every head (B19) | seasonAfterMatch |  | convo, talks, dofPrio, dofStrikes |
| `weekflow.js` | 25 KB | the CEO's week Every week has a subject (B22): a derby, a window, a board review, or a quiet week | deskBriefs, seasonAfterMatch |  | bigDone, echo, coachNews, mem |
| `weekloop.js` | 2 KB | situation-driven week Chance serves the club's situation: an event is likelier when its department is under pr | evWeight |  |  |
| `loop.js` | 15 KB | the weekly loop, phase 1 Four backers (board, supporters, press, dressing room), each with its own voice | lastChance, seasonReprieve, seasonAfterMatch |  | votes, vote, bgoal, bgLog, wkDelta, wkPrev, wkLog |
| `dossiers.js` | 28 KB | phase 2: dossiers and pressure A dossier is a storyline in three parts that lands on the CEO's desk weeks apar | seasonAfterMatch |  | pressure, dos |
| `pathway.js` | 27 KB | the pathway question One governance storyline, built to show the core loop: you notice a problem, talk to the  | selBonus, seasonAfterMatch |  | cred, pw, academy, pwLog |
| `matchday.js` | 10 KB | match day Before kick-off: three stories about our own players | storyW, edition |  | mdS, eds |
| `ui/01-core.js` | 5 KB | atoms; base club: skip the founding |  |  |  |
| `ui/02-setup.js` | 19 KB | views: title & setup; mandates as a tactics board |  |  |  |
| `ui/03-summer-preseason-press.js` | 26 KB | the summer (M4); the summer, version 2 |  |  |  |
| `ui/04-masthead-news.js` | 1 KB |  |  |  |  |
| `ui/05-pitches-squad-money.js` | 15 KB | project pitches: one at a time, swipe or tap |  |  |  |
| `ui/06-sheets-ticker.js` | 21 KB | sheets; ticker |  |  |  |
| `ui/07-club-league.js` | 9 KB | review & sacked; club, league, staff, academy, review: game screens |  | deptCost |  |
| `ui/08-departments.js` | 25 KB | departments |  |  |  |
| `ui/08a-dept-parts.js` | 21 KB | department parts: words for numbers, attention, plan, record; recruitment; academy: the record as four questio |  |  |  |
| `ui/08b-portal.js` | 30 KB | navigation; leagues: a table whose columns follow the position filter; the player; drill-downs |  |  |  |
| `ui/09-firstteam-review.js` | 12 KB | first team department |  |  |  |
| `ui/10-inbox.js` | 18 KB | render; inbox home (1.6) |  |  |  |
| `ui/11-players.js` | 9 KB | players: cards, profiles, stories |  |  |  |
| `ui/12-scenes-cards.js` | 15 KB | game UI helpers |  |  |  |
| `ui/13-redbox-render.js` | 14 KB | the red box: an email you answer on one screen |  |  |  |
| `ui/14-matchday-gazette.js` | 25 KB | match day: preview, match, gazette (full screens); the Gazette: one design, opened after the match and from th |  |  |  |
| `ui/15-actions.js` | 19 KB | actions |  |  |  |
| `ui/16-boot.js` | 0 KB | boot |  |  |  |

## Functions per file

### `engine/01-core.js`
- Functions: rnd, ri, pick, chance, clamp, gauss, wpick, poisson, shuffle, uid, ord, absWeek

### `engine/02-world-constants.js`
- Functions: tierAvg, ORG_MEAN, newCoach, orgOf, S, sc, M, money

### `engine/03-players.js`
- Functions: calcCA, wageFor, upd, newStats, absStars, stars, genPlayer

### `engine/04-staff-dna.js`
- Functions: genStaff, ovr, staff, eff, man, defaultMandate, dnaMandates, alignment

### `engine/05-world-selection.js`
- Functions: townName, roundRobin, blankRow, buildFixtures, genWorld, sortTable, cname, myPos, expectedRank, squadAvail, fit, ordWord, cact, pickXI, strengthParts, teamStrength

### `engine/06-match.js`
- Functions: wxFor, expRand, simOurMatch, whyLines, quickSim, applyResult

### `engine/07-finance-transfers.js`
- Functions: playerWages, staffWages, ticketPrice, attendance, revenueAvg, estRevenue, sponsorIncome, wageRatio, transferBudget, weeklyFinance, window_, squadNeeds, weakestPos, genTarget, sign, staffName, protectedIds, administration, sellPlayer, dofWork

### `engine/08-weekly-inbox.js`
- Functions: develop, staffWeekly, kpiWeekly, boardWeekly, defineEvent, queueEvent, pendingOf, addMsg, safe, genMessages, autoEvent, secondOpinion

### `engine/09-meetings-actions-press.js`
- Functions: defineProposal, isMeeting, nextMeeting, genMeeting, proposalView, meetingPot, decideProposal, lapseMeeting, projectsWeekly, projWeekly, perk, msgView, autoIndex, resolve, respond, talk, push, setMandate, fire, genCands, hire, bestPlayer, pressQuestions, pressView, pressAnswer

### `engine/10-season.js`
- Functions: setObjectives, objMet, promiseMet, endSeason, startSeason, newSeasonStats

### `engine/11-staffwork-analysis-briefs.js`
- Functions: later, kittyFor, snapStart, buildReports, avgRat, squadAvgRat, record, xPts, forecast, analysis, scorecard, defineBrief, genBriefs, briefView, answerBrief

### `engine/12-week.js`
- Functions: sack, over, endWeek, buildPaper

### `engine/13-newgame-preseason.js`
- Functions: newGame, setDNA, staffBudget, finishStaff, finishMandates, setupPreseason, preTargets, preSetTarget, preToggleFocus, budgetCosts, weekForecast, finishPreseason, finishPress

### `engine/14-save-api.js`
- Functions: save, load

### `events.js`
- Functions: g, adj, fx, rel, boost, P, N, lean, ego, sq, randP, dna, week, pos, REG, ratingOf

### `events2.js`
- Functions: g, P, sq, fx, avgW, wageLim, R, stand, regionPick, rankWith, homeGate, pay

### `events3.js`
- Functions: g, P, sq, fx, rel, flagsN, tg

### `briefs.js`
- Functions: g, sq, rel, boost, fx, avg, inWindowSoon

### `academy.js`
- Functions: g, grp, A, ys, ybonus, yv, bud, tierLvl, hireY, band, genYouth, ensure, trim, promote
- Exports on `F`: acadView, acadPromote, acadGrp, YROLES, acadEnsure, acadBand, acadGenYouth, acadYv, acadTierLvl, acadSack, scorecard

### `academy2.js`
- Functions: g, sq, P, rel, fx, grp, avg, catScore, ensure2, PLAY, newYouthSeason, ourStr, playRound, poisson, ytable, cupTie, roi, diag, tfee
- Exports on `F`: acadView, acadCatName, scorecard, ACAD_PLANS, finishPreseason

### `recruit.js`
- Functions: g, sq, cn, inWin, winKey, winBuys, coachCoverageNeeds, slotOpen, aiClub, genPool, topUpPool, hireScout, nScouts, chiefAsScout, scoutsAll, report, posBest, posWorst, prioOf, fitsProfile, grade, rng, bandTxt, potTxt, pipeOf, addPipe, setStage, threshold, wageLimit, capFor, ruleIssues, openDeal, negRound, wagePhase, complete, assignScouts, scoutWeek, dofPipeline, scoreRec, worldWeek, G_shortlistMirror, targetFromWorld, ensure, dossier
- Exports on `F`: recTarget, recMoreReport, recPlanSuggest, recTogglePrio, recSetKind, REC_KINDS, recView, recScoutAcc, recReport, recScouts, recRules, recSetStage, recAddPipe, recPlanBoard, recSlotOpen, recDeal, recLate, recForceSign, recWageLimit, recPlayer, recBand, recPot, scorecard

### `summer.js`
- Functions: g, sq, finishSummer, median, advise, demand, decide, sellSuggest, snap, diff, drainQueue, oppOf, ddLine, ddDesc, ddCase, ddClose
- Exports on `F`: sumContract, sumPlanner, sumDiff, sumFriendlies, DD_HOURS, ddStart, ddTick, ddCase, ddDecision, ddDecide, ddSkip, sumView, sumFinish

### `season.js`
- Functions: g, sq, fx, tgt, blockOf, ambitions, upcoming, markDone, blockBrief, verdict, loansBack
- Exports on `F`: BLOCKS, blockOf, recLoan, recEval

### `summer2.js`
- Functions: g, sq, POSL, dof, trait, say, relD, mood, init2, lastSeason, diagnosis, openItem, shortlist, coachWish, buildPlan, planText, responses, stance, holdLine, giveLine, applyChange, next, makeBrief, applyBrief, startTicker, tl, explain, planStatus, five, weekTick, evalBrief
- Exports on `F`: SUM2_STEPS, sum2Ensure, SUM2_ITEMS, sum2Responses, sum2Answer, SUM2_WEEKS, tkStep, tkCall, tkAnswer, tkSkip, sum2Edition, sum2Debrief, sum2Talk, sum2Finish, sum2Step, sumDrain, sum2Auto, sumAuto

### `faces.js`
- Functions: rng, pickW, outfit, P, fx, face, g, cols, moodOf, staffFace, playerFace, poolFace, rep, office, on, tone, noise, vib

### `firstteam.js`
- Functions: g, hs, ft, pref, compliance, act, tierK, resCost, live, resBuy, resCancel, dealMet, biggestGap, why, mandateRows, squadEyes, line, say, BOOST, talkStart, topics, fxNote, talkAnswer, talkClose, sackQuote, sack, view
- Exports on `F`: ftView, ftTalkStart, ftTalkAnswer, ftTalkClose, ftResBuy, ftResCancel, ftSackQuote, ftSack, ftPref, ftCompliance, FT_RES

### `depts.js`
- Functions: g, slots, tierK, ensure, mkStaff, mult, active, has, kpiOf, cands, hireStaff, letGo, staffWant, headHire, budGet, budCap, budUsed, budSet, budCost, verdict, attention, status, view, overview, budView
- Exports on `F`: deptHas, deptHeadHire, deptStaffWant, deptVerdict, deptAttention, DEPTS, DEPT, DEPT_ROLES, deptEnsure, deptView, deptOverview, deptCands, deptHire, deptLetGo, deptBudView, deptBudSet

### `levers.js`
- Functions: g, gripInit, gain, wrap, net, runway, tight, wrapAuto, patchAutos
- Exports on `F`: sign, gripGain, finRunway, finTight

### `commercial.js`
- Functions: g, has, C, form, demand, newOffer, offerWeekly, offerAct, setPrice, expUp, expDown, promo, view
- Exports on `F`: comView, comSetPrice, comExpUp, comExpDown, comPromo, comOffer, COM_STANDS

### `marketing.js`
- Functions: g, has, K, form, campMult, campStart, commSet, view
- Exports on `F`: mkView, mkCamp, mkComm, MK_CAMPS

### `business.js`
- Functions: g, has, lvOf, B, fixed, deptCostAt, cur, plan, setLevel, propose, applyProp, view
- Exports on `F`: sign, bizView, bizSetLevel, bizPropose

### `academy3.js`
- Functions: g, T, pickBy, confirm, view
- Exports on `F`: acView, acTrialPick, AC_CRIT

### `recruitx.js`
- Functions: g, R, regions, setFocus, invest, record, view, copy, at, state, note, corePlayers, rows, action, refresh, priorities, renewals, requestPolicy, policyLive, policyAnswer
- Exports on `F`: squadPlanScoutJob, squadPlanAllows, squadPlanPrepare, squadPlanView, squadPlanAsk, recPlanSuggest, squadPlanDelivered, rxView, rxFocus, rxInvest

### `world.js`
- Functions: g, hstr, mk, WS, LGDEF, leagueName, clubsOf, lineage, build, attrsAt, season, market, record, ours, leaguePlayers, worldLeagues, worldLeague, worldPlayer, worldRemove, WX, aw, worldSlots, worldMeta, snapOf, worldFlag, worldUnflag, worldTargetState, worldTarget, worldSigned, worldConfirm, headOf, worldBetCheck, worldBets, worldFlagged
- Exports on `F`: worldLeagues, worldLeague, worldPlayer, worldRemove, WORLD_PLAN, worldSlots, worldMeta, worldFlag, worldUnflag, worldConfirm, worldFlagged, worldTarget, worldTargetState, worldSigned, worldBets, worldBetCheck

### `turnaround.js`
- Functions: g, abs, fx, ord, lossesLast5, ppg, snap, trouble, start, edge, STATE
- Exports on `F`: turnTrouble, turnEdge, TURN_LABEL

### `matchtalk.js`
- Functions: g, hs, opp, P, sur, crowd, preview
- Exports on `F`: mtPreview, MT_STY

### `desk.js`
- Functions: g, headOf, auth, setAuth, limit, amtOf, top3, errChance, lvl, first, reason, coreWhy, log, txt, slip, briefAmt, both, pickHead, deskView, authView
- Exports on `F`: AUTH, setAuth, authView, deskView, DESK_HEADS, deskLimit, auth(r)), deskNote, t, c, err) => log(headOf(r), err ? 1, c)

### `talks.js`
- Functions: g, first, fixFor, C, rel, boost, ask, reqText, lapse, weekly, say, note, common, reqOpts, open, answer, close, view, reqOf, reqsFor
- Exports on `F`: convoAsk, convoOpen, convoAnswer, convoClose, convoView, convoReq, convoReqs, CONVO_DEPT

### `weekflow.js`
- Functions: g, sq, fx, rel, first, topic, quiet, B, P, keepCtx, recall, htOffer, htChoice
- Exports on `F`: weekTopic, OPP_IDS, mdHtOffer, mdHtChoice, recall

### `weekloop.js`
- Functions: g, heat, heat0, weight
- Exports on `F`: weekHeat

### `loop.js`
- Functions: g, room, sup, voice, backers, snap, diff, form5, band, bump, lift, lastChance, tgt, needFor, blockTick, goalView, comingUp
- Exports on `F`: respond, answerBrief, backers, comingUp, goalView, BACKERS, VOTE_AT

### `dossiers.js`
- Functions: g, bk, cash, rel, nm, star, kid, press, pv, pSignal, defineDossier, heatT, D, start, stepDone, dosView
- Exports on `F`: DOS, dosView, defineDossier

### `pathway.js`
- Functions: g, nm, first, bk, rel, sq, P, findP, cred, credAdd, blocker, subject, dilemma, stances, start, ppgNow, routeHint, mandateRoute, agree, compliance, youthDrift, evaluate, close, changeCourse, ask, pwView
- Exports on `F`: pwView, pwAsk, pwChange, pwStart, credView, PW_ROUTES

### `matchday.js`
- Functions: g, avg, lastInjury, storyFor, mdStories, mdOutcomes, mdOutcomesShort, turningPoint, matchSum, edView
- Exports on `F`: mdStories, mdOutcomes, mdOutcomesShort, mdTurning, edView, edCount

### `ui/01-core.js`
- Functions: esc, money, G, saveGame, hasSave, loadGame, wipe, toast, setClub, lum, stars, bar, meter, crest, apPips, sign, quickStart

### `ui/02-setup.js`
- Functions: vTitle, vSetupDNA, staffCard, numbers, vSetupStaff, says, sliderRows, staffHead, leanNote, vSetupMandates, recPlanBlock

### `ui/03-summer-preseason-press.js`
- Functions: WHO, ddBlock, mtCard, vSummer2, ddSchedule, vPreseason, vPress

### `ui/04-masthead-news.js`
- Functions: masthead, tabs, cap, vNews

### `ui/05-pitches-squad-money.js`
- Functions: pitchCard, pitchDeck, meetingBlock, p90, squadSeg, recRow, vMoney2, vPitch, vSquad, spark, vMoney

### `ui/06-sheets-ticker.js`
- Functions: vSheet, previewAlign, vTicker, startTicker, tick

### `ui/07-club-league.js`
- Functions: mrow, secCommercial, secMarketing, secPromises, vClub2, vLeague2

### `ui/08-departments.js`
- Functions: spark, kfmt, vDepts, headLine, headCard, authHtml, headBtns, instinctRow, fillCol, stadiumSvg, comOverview, comDecisions, mkOverview, mkDecisions, planCard, bizOverview, acPyramid, acDecisions, vDept

### `ui/08a-dept-parts.js`
- Functions: relW, compW, netW, gapW, kpiTile, attAttr, attHtml, deskHist, recTiles, regionCard, recRecord, acKids, acRecord, acStaff, ftPlanExtra, squadPlanHtml, verdictCard, needsHtml, cvTalkHtml, ftActions, accHtml

### `ui/08b-portal.js`
- Functions: PLP, plAvgRat, plSt, plShow, plStars, plByKey, plMinFor, plPeers, plStars2, plPct, plHead, plFit, plGo, plAct, plLeagues, plAttrRow, plSrow, plCareer, plReview, plDof, plProfile, plStatPage, plClub, plTarget, plBetCheck, plBets, plFlags, vPortal, portalCard

### `ui/09-firstteam-review.js`
- Functions: vFirst, ftTalkHtml, vReview2, vSacked

### `ui/10-inbox.js`
- Functions: isRead, markRead, first, inboxItems, nextFix, backersHtml, comingHtml, dossierCard, archiveHtml, pwMeetHtml, pwEvalHtml, agreementHtml, pathwayCard, credHtml, caseHtml, fdHtml, isDis, rowThumb, rowHtml, isBox, boxRow, deskRow, vInbox

### `ui/11-players.js`
- Functions: strengths, roleOf, starsTxt, pcard, hashN, storyOf, attrGroups, formBars, profileHtml, scoutLine

### `ui/12-scenes-cards.js`
- Functions: sentEnds, clip2, splitSay, trayHtml, choiceHtml, ticOf, sceneHtml, vOpen, cardOpts, oppShort, fstrip, previewCard, whyPanel, matchCard, weekReport, msStrip, gazette

### `ui/13-redbox-render.js`
- Functions: mFirst, mailParas, mailTop, MSV, mailRows, second2, replyInline, mailSent, bkStrip, msgHtml, briefHtml, mailCommit, big, mailSend, mailAfter, propHtml, tourCard, tabBadge, vBar, advance, markFresh, render

### `ui/14-matchday-gazette.js`
- Functions: mdOppCols, mdClean, mdP, mdStadium, mdPitch, mdForm, mdPreview, mdTeams, mdMatch, gzEdition, mdPaper, vMatchday, mdKick
- Exports on `F`: storyOf

### `ui/15-actions.js`
- Functions: readSetup, act, srEnd, swEnd
- Exports on `F`: G

### `ui/16-boot.js`
- Functions: —

<!-- generated:end -->

## Tools
- `tools/contrast.js`: meets WCAG contrast on the department screens (390 px, light and dark) and forces the wants-a-word and vacant states. Needs `dist/index.html`.
