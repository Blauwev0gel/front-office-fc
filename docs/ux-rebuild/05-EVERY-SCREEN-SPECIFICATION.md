# Every-screen rebuild specification — complete design candidate register

**Source baseline:** `chatgpt` `6b70e7057` plus later audit documentation commits; code inventory performed 2026-11-17. This file defines a target for every enumerated player-visible surface. IDs identify **design candidates**, not claims that every conditional surface was reached in a browser. The function-level inventory in `01-*` and dispatcher in `10-*` are cross-checks; this file is a source-based specification, not a runtime-certified exhaustive reachability map.

**Common screen contract:** 320–430px mobile, meaningful page title and location, primary action where appropriate, one-touch decision with explicit no-response behavior, no horizontal overflow for core content, accessible return, context retained, actual engine data, empty/error state, save-safe effects. All on-screen choices must have one owner and one commit route.

## START — engine/13-newgame-preseason.js; engine/04-staff-dna.js

**UI source:** `src/ui/02-setup.js`

| Screen ID | Screen/state | Source renderer | Player question / target information | Interaction and planned treatment |
|---|---|---|---|---|
| START-001 | Title/new/continue | `vTitle` | Entry, save slot and quick start | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| START-002 | Club name/city/short | `vSetupDNA` | Identity fields and constraints | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| START-003 | Club colours | `vSetupDNA` | Accessible palette preview | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| START-004 | DNA question | `vSetupDNA` | Each choice has long-term consequence | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| START-005 | DNA summary | `vSetupDNA` | Club DNA review | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| START-006 | Head candidate selection | `vSetupStaff` | Shortlist compare expertise, personality and wages | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| START-007 | Head candidate comparison | `vSetupStaff` | Side-by-side relative evidence | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| START-008 | Head appointment result | `vSetupStaff` | Role filled, cost, expectation | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| START-009 | Hiring overview | `vSetupStaff` | Six heads and vacancies | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| START-010 | Mandate role selection | `vSetupMandates` | Select head and authority | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| START-011 | Mandate sliders and rules | `vSetupMandates` | Meaningful trade-off and defaults | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| START-012 | Mandate completion | `vSetupMandates` | Summary and next phase | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |

### Detailed implementation contract for this family

- **Initial view:** state the football or CEO question before controls; show responsible person and why this material matters now.
- **Secondary depth:** put raw supporting metrics, season history, and process logs behind one explicit detail route, not nested tabs upon tabs.
- **Decision types:** informational views must not invent an action. Conversation, governance, exception, personnel, and simulation interactions use their correct decision contracts from `07-DECISION-ENGINE-REDESIGN.md`.
- **Navigation:** stable home, local backward path, no modal trap, persistent selected context, and consistent route back after commit.
- **Exceptional states:** loading/empty, unavailable employee/player, stale deadline, expired offer, crisis, replay/end-season and old-save migration must be defined per relevant screen.
- **Code:** refactor the named renderer in its actual source module and the corresponding `ui/15-actions.js` case; use a shared component vocabulary from `04-INFORMATION-ARCHITECTURE.md`; change supporting engine functions only with migration.
- **Acceptance:** source data displayed, meaningful controls wired, one-tap submission, visible saved consequence or pending execution, back navigation and a stable return to the appropriate phase.

## SUMMER — summer.js; summer2.js; season.js

**UI source:** `src/ui/03-summer-preseason-press.js`

| Screen ID | Screen/state | Source renderer | Player question / target information | Interaction and planned treatment |
|---|---|---|---|---|
| SUMMER-013 | Summer opening | `vSummer2` | Context and responsibility | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SUMMER-014 | Summer diagnosis | `vSummer2` | Squad strength and gaps | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SUMMER-015 | DoF summer meeting | `vSummer2` | Staff recommendations with constraints | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SUMMER-016 | Shortlist | `vSummer2` | Existing targets and confidence | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SUMMER-017 | Coach transfer wishes | `vSummer2` | Conflict with DoF recommendation | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SUMMER-018 | Summer position/stance | `vSummer2` | Agree, contest or delegate | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SUMMER-019 | Summer response exchange | `vSummer2` | Response genuinely modifies subsequent plan | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SUMMER-020 | Summer agreement | `vSummer2` | Owner, target, limits and review | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SUMMER-021 | Deadline day opening | `vSummer2` | Pending windows and risk | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SUMMER-022 | Deadline day case | `vSummer2` | Offer and response | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SUMMER-023 | Deadline day decision | `vSummer2` | Commit and consequence | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SUMMER-024 | Deadline day result | `vSummer2` | Actual transfer result | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SUMMER-025 | Summer completion | `vSummer2` | Financial and squad summary | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SUMMER-026 | Preseason target | `vPreseason` | Board target and alternative terms | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SUMMER-027 | Preseason focus | `vPreseason` | Limited strategic commitments | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SUMMER-028 | Preseason advice | `vPreseason` | Staff perspective | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SUMMER-029 | Preseason academy | `vPreseason` | Youth planning within roles | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SUMMER-030 | Preseason confirmation | `vPreseason` | Agreed objectives and accountability | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SUMMER-031 | Press question | `vPress` | Contextual public statement | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SUMMER-032 | Press response/result | `vPress` | What was said and expected reaction | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SUMMER-033 | Preseason-to-season transition | `vPress` | Clear handoff to week one | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |

### Detailed implementation contract for this family

- **Initial view:** state the football or CEO question before controls; show responsible person and why this material matters now.
- **Secondary depth:** put raw supporting metrics, season history, and process logs behind one explicit detail route, not nested tabs upon tabs.
- **Decision types:** informational views must not invent an action. Conversation, governance, exception, personnel, and simulation interactions use their correct decision contracts from `07-DECISION-ENGINE-REDESIGN.md`.
- **Navigation:** stable home, local backward path, no modal trap, persistent selected context, and consistent route back after commit.
- **Exceptional states:** loading/empty, unavailable employee/player, stale deadline, expired offer, crisis, replay/end-season and old-save migration must be defined per relevant screen.
- **Code:** refactor the named renderer in its actual source module and the corresponding `ui/15-actions.js` case; use a shared component vocabulary from `04-INFORMATION-ARCHITECTURE.md`; change supporting engine functions only with migration.
- **Acceptance:** source data displayed, meaningful controls wired, one-tap submission, visible saved consequence or pending execution, back navigation and a stable return to the appropriate phase.

## DESK — desk.js; engine/08-weekly-inbox.js; events.js; events2.js; briefs.js; ceocore.js

**UI source:** `src/ui/10-inbox.js`; `src/ui/12-scenes-cards.js`; `src/ui/13-redbox-render.js`

| Screen ID | Screen/state | Source renderer | Player question / target information | Interaction and planned treatment |
|---|---|---|---|---|
| DESK-034 | Week overview | `vInbox` | Football context and immediate relevance | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| DESK-035 | No decisions | `vInbox` | Quiet week is valid | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| DESK-036 | One required decision | `vInbox` | Clear owner and no-response rule | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| DESK-037 | Many required decisions | `vInbox` | Priority without artificial queue | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| DESK-038 | Optional briefing | `vInbox` | Advice not a compulsory task | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| DESK-039 | Staff autonomous update | `vInbox` | Work completed without requesting approval | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| DESK-040 | Financial crisis | `vInbox` | Real cash data and responsible officer | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| DESK-041 | Stakeholder crisis | `vInbox` | Real board/fans/room signal | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| DESK-042 | Fixture card | `vInbox` | Next opponent and match context | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| DESK-043 | Fixture-free week | `vInbox` | Continue without fictitious fixture | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| DESK-044 | Gazette entry | `vInbox` | Story headline | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| DESK-045 | Live dossier list | `deskMatters` | Open agreements and pending reviews | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| DESK-046 | Dossier detail | `dossierCard` | History, evidence and next checkpoint | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| DESK-047 | Pathway detail | `pathwayCard` | Agreement, ownership, progress | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| DESK-048 | Case archive | `archiveHtml` | Outcome and historical accountability | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| DESK-049 | Decision ledger | `deskMatters` | Causal follow-through | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| DESK-050 | Delegation ledger | `deskMatters` | Who acted within authority and why | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| DESK-051 | Club records | `deskArchive` | Five primary filters and deeper archive | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| DESK-052 | Filtered records | `deskArchive` | Accessible records with a route home | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| DESK-053 | Individual message | `vOpen` | Who, issue, facts, action | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| DESK-054 | Briefing detail | `briefHtml` | Optional response and alternatives | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| DESK-055 | Board proposal detail | `propHtml` | Cost, duration and owner | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| DESK-056 | Match result detail | `matchCard` | Result interpreted with football data | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| DESK-057 | Coach debrief detail | `matchCard` | Coach reaction | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| DESK-058 | Weekly report detail | `weekReport` | One digest, not six compulsory clicks | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| DESK-059 | Player milestone item | `msStrip` | Actual achievement | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| DESK-060 | Preview item | `previewCard` | Optional contextual route to matchday | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |

### Detailed implementation contract for this family

- **Initial view:** state the football or CEO question before controls; show responsible person and why this material matters now.
- **Secondary depth:** put raw supporting metrics, season history, and process logs behind one explicit detail route, not nested tabs upon tabs.
- **Decision types:** informational views must not invent an action. Conversation, governance, exception, personnel, and simulation interactions use their correct decision contracts from `07-DECISION-ENGINE-REDESIGN.md`.
- **Navigation:** stable home, local backward path, no modal trap, persistent selected context, and consistent route back after commit.
- **Exceptional states:** loading/empty, unavailable employee/player, stale deadline, expired offer, crisis, replay/end-season and old-save migration must be defined per relevant screen.
- **Code:** refactor the named renderer in its actual source module and the corresponding `ui/15-actions.js` case; use a shared component vocabulary from `04-INFORMATION-ARCHITECTURE.md`; change supporting engine functions only with migration.
- **Acceptance:** source data displayed, meaningful controls wired, one-tap submission, visible saved consequence or pending execution, back navigation and a stable return to the appropriate phase.

## FOOT — engine/03-players.js; engine/05-world-selection.js; recruit.js; recruitx.js

**UI source:** `src/ui/05-pitches-squad-money.js`; `src/ui/07-club-league.js`; `src/ui/11-players.js`

| Screen ID | Screen/state | Source renderer | Player question / target information | Interaction and planned treatment |
|---|---|---|---|---|
| FOOT-061 | Football section selection | `foLocalMenu` | Squad vs league | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| FOOT-062 | Likely XI | `vPitch` | Coach-selected team sheet | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| FOOT-063 | Bench/other squad | `vPitch` | Availability and role | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| FOOT-064 | All players | `vSquad` | Sortable compact roster | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| FOOT-065 | Advanced stats | `vSquad` | Detailed comparable stats | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| FOOT-066 | Player profile overview | `profileHtml` | Context, strength, potential, availability | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| FOOT-067 | Player profile stats | `profileHtml` | Actual per-season data | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| FOOT-068 | Player profile career | `profileHtml` | History and narrative | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| FOOT-069 | Academy player detail | `profileHtml` | Development and welfare | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| FOOT-070 | Scouted target detail | `profileHtml` | Confidence and data provenance | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| FOOT-071 | League table | `vLeague2` | Current rank and competition table | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| FOOT-072 | Other division | `vLeague2` | Correct scope and labels | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| FOOT-073 | Extended standings | `vLeague2` | P/W/D/L/GD/Pts | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| FOOT-074 | Recent results | `vLeague2` | Meaningful form | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| FOOT-075 | Fixtures/next opponent | `vLeague2` | Home/away, stakes and navigation | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| FOOT-076 | Cup competition | `vLeague2` | Round and previous results | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |

### Detailed implementation contract for this family

- **Initial view:** state the football or CEO question before controls; show responsible person and why this material matters now.
- **Secondary depth:** put raw supporting metrics, season history, and process logs behind one explicit detail route, not nested tabs upon tabs.
- **Decision types:** informational views must not invent an action. Conversation, governance, exception, personnel, and simulation interactions use their correct decision contracts from `07-DECISION-ENGINE-REDESIGN.md`.
- **Navigation:** stable home, local backward path, no modal trap, persistent selected context, and consistent route back after commit.
- **Exceptional states:** loading/empty, unavailable employee/player, stale deadline, expired offer, crisis, replay/end-season and old-save migration must be defined per relevant screen.
- **Code:** refactor the named renderer in its actual source module and the corresponding `ui/15-actions.js` case; use a shared component vocabulary from `04-INFORMATION-ARCHITECTURE.md`; change supporting engine functions only with migration.
- **Acceptance:** source data displayed, meaningful controls wired, one-tap submission, visible saved consequence or pending execution, back navigation and a stable return to the appropriate phase.

## CLUB — business.js; loop.js; season.js; engine/07-finance-transfers.js

**UI source:** `src/ui/07-club-league.js`; `src/ui/05-pitches-squad-money.js`; `src/ui/06-sheets-ticker.js`

| Screen ID | Screen/state | Source renderer | Player question / target information | Interaction and planned treatment |
|---|---|---|---|---|
| CLUB-077 | Club overview | `vClub2` | Cash, board, trust, work | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| CLUB-078 | Financial report | `vMoney2` | Sources, expenses, outlook | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| CLUB-079 | Weekly cash forecast | `vMoney2` | Net and risk not arbitrary score | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| CLUB-080 | Board objectives | `vClub2` | Target and evidence | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| CLUB-081 | Stakeholder overview | `vClub2` | Board/Fans/Room differences | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| CLUB-082 | Stakeholder explanations | `vSheet(backers)` | Causal history not only percentages | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| CLUB-083 | Club identity/credibility | `vClub2` | DNA, commitments and drift | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| CLUB-084 | Promises | `secPromises` | Fulfilment and consequences | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| CLUB-085 | Projects | `vClub2` | Owner, deadline and budget | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| CLUB-086 | Facilities | `vDept` | Ownership and level | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| CLUB-087 | Previous seasons | `vClub2` | Historical record | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| CLUB-088 | Honours | `vClub2` | Promotions and trophies | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| CLUB-089 | CEO status | `vClub2` | Governance rather than arcade XP | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |

### Detailed implementation contract for this family

- **Initial view:** state the football or CEO question before controls; show responsible person and why this material matters now.
- **Secondary depth:** put raw supporting metrics, season history, and process logs behind one explicit detail route, not nested tabs upon tabs.
- **Decision types:** informational views must not invent an action. Conversation, governance, exception, personnel, and simulation interactions use their correct decision contracts from `07-DECISION-ENGINE-REDESIGN.md`.
- **Navigation:** stable home, local backward path, no modal trap, persistent selected context, and consistent route back after commit.
- **Exceptional states:** loading/empty, unavailable employee/player, stale deadline, expired offer, crisis, replay/end-season and old-save migration must be defined per relevant screen.
- **Code:** refactor the named renderer in its actual source module and the corresponding `ui/15-actions.js` case; use a shared component vocabulary from `04-INFORMATION-ARCHITECTURE.md`; change supporting engine functions only with migration.
- **Acceptance:** source data displayed, meaningful controls wired, one-tap submission, visible saved consequence or pending execution, back navigation and a stable return to the appropriate phase.

## FIRST — firstteam.js; depts.js

**UI source:** `src/ui/08-departments.js`; `src/ui/09-firstteam-review.js`; `src/ui/06-sheets-ticker.js`

| Screen ID | Screen/state | Source renderer | Player question / target information | Interaction and planned treatment |
|---|---|---|---|---|
| FIRST-090 | Department overview | `vDept(first)` | Person in charge, issues and work | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| FIRST-091 | Head coach detail | `vFirst` | Manager's record and philosophy | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| FIRST-092 | Coach briefing | `vDept(first:over)` | Situation and recommendations | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| FIRST-093 | First-team staff | `vDept(first:people)` | Assistant/fitness/analyst/psychologist/GK | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| FIRST-094 | First-team evidence | `vDept(first:data)` | Results, fitness, analysis | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| FIRST-095 | First-team mandate | `vDept(first:dec)` | CEO direction and limits | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| FIRST-096 | Coach conversation | `ftTalkHtml` | Meaningful reciprocal dialogue | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| FIRST-097 | Coach alternatives | `vSheet(sack)` | Replacement trade-off | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| FIRST-098 | Coach dismissal | `vSheet(sack)` | Consequences and vacancy | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| FIRST-099 | First-team support hire | `vSheet(dcand)` | Candidate comparison and autonomous staffing | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |

### Detailed implementation contract for this family

- **Initial view:** state the football or CEO question before controls; show responsible person and why this material matters now.
- **Secondary depth:** put raw supporting metrics, season history, and process logs behind one explicit detail route, not nested tabs upon tabs.
- **Decision types:** informational views must not invent an action. Conversation, governance, exception, personnel, and simulation interactions use their correct decision contracts from `07-DECISION-ENGINE-REDESIGN.md`.
- **Navigation:** stable home, local backward path, no modal trap, persistent selected context, and consistent route back after commit.
- **Exceptional states:** loading/empty, unavailable employee/player, stale deadline, expired offer, crisis, replay/end-season and old-save migration must be defined per relevant screen.
- **Code:** refactor the named renderer in its actual source module and the corresponding `ui/15-actions.js` case; use a shared component vocabulary from `04-INFORMATION-ARCHITECTURE.md`; change supporting engine functions only with migration.
- **Acceptance:** source data displayed, meaningful controls wired, one-tap submission, visible saved consequence or pending execution, back navigation and a stable return to the appropriate phase.

## RECRUIT — recruit.js; recruitx.js; depts.js; summer.js

**UI source:** `src/ui/08-departments.js`; `src/ui/05-pitches-squad-money.js`; `src/ui/06-sheets-ticker.js`

| Screen ID | Screen/state | Source renderer | Player question / target information | Interaction and planned treatment |
|---|---|---|---|---|
| RECRUIT-100 | Recruitment overview | `vDept(recruit)` | DoF accountability | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| RECRUIT-101 | DoF and chief scout | `vDept(recruit:people)` | Responsibility separation | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| RECRUIT-102 | Scouting data | `vDept(recruit:data)` | Evidence and uncertainty | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| RECRUIT-103 | Recruitment mandate | `vDept(recruit:dec)` | Policy and exceptions | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| RECRUIT-104 | Recruitment pipeline | `vRecruit2` | Named stages and blockers | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| RECRUIT-105 | Player target profile | `vSheet(target)` | Scout evidence and valuation | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| RECRUIT-106 | Recruitment plan | `vSheet(recplan)` | Profiles, priorities and budget | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| RECRUIT-107 | Scouting priority | `vDept(recruit)` | Positions and scouting reach | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| RECRUIT-108 | Contract negotiation | `vRecruit2` | Offer, rounds and responsible actor | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| RECRUIT-109 | Transfer approval | `vRecruit2` | Only actual CEO exceptions | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| RECRUIT-110 | Loans | `vRecruit2` | Incoming/outgoing and minutes | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| RECRUIT-111 | Rolling squad plan | `squadPlanHtml` | Age, contracts and succession | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| RECRUIT-112 | Winter planning | `vSummer2` | DoF seasonal choices | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| RECRUIT-113 | Transfer deadline decision | `vSummer2` | Time pressure and alternatives | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |

### Detailed implementation contract for this family

- **Initial view:** state the football or CEO question before controls; show responsible person and why this material matters now.
- **Secondary depth:** put raw supporting metrics, season history, and process logs behind one explicit detail route, not nested tabs upon tabs.
- **Decision types:** informational views must not invent an action. Conversation, governance, exception, personnel, and simulation interactions use their correct decision contracts from `07-DECISION-ENGINE-REDESIGN.md`.
- **Navigation:** stable home, local backward path, no modal trap, persistent selected context, and consistent route back after commit.
- **Exceptional states:** loading/empty, unavailable employee/player, stale deadline, expired offer, crisis, replay/end-season and old-save migration must be defined per relevant screen.
- **Code:** refactor the named renderer in its actual source module and the corresponding `ui/15-actions.js` case; use a shared component vocabulary from `04-INFORMATION-ARCHITECTURE.md`; change supporting engine functions only with migration.
- **Acceptance:** source data displayed, meaningful controls wired, one-tap submission, visible saved consequence or pending execution, back navigation and a stable return to the appropriate phase.

## ACADEMY — academy.js; academy2.js; academy3.js; pathway.js

**UI source:** `src/ui/08-departments.js`; `src/ui/09-firstteam-review.js`; `src/ui/10-inbox.js`

| Screen ID | Screen/state | Source renderer | Player question / target information | Interaction and planned treatment |
|---|---|---|---|---|
| ACADEMY-114 | Academy overview | `vDept(academy)` | Youth development progress | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| ACADEMY-115 | Academy head and staff | `vDept(academy:people)` | Coach/recruiter/welfare/education | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| ACADEMY-116 | Academy performance | `vDept(academy:data)` | Intake, growth and outcomes | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| ACADEMY-117 | Academy mandate | `vDept(academy:dec)` | Development route and constraints | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| ACADEMY-118 | Youth squad | `vAcademy2` | Named prospect data | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| ACADEMY-119 | Youth development | `vAcademy2` | Progress and uncertainty | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| ACADEMY-120 | Youth competition | `vAcademy2` | Results where exposed | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| ACADEMY-121 | Pathway signal | `pathwayCard` | Prospect and obstacles | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| ACADEMY-122 | Pathway discussion | `pwMeetHtml` | Coach/DoF/Academy views | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| ACADEMY-123 | Pathway agreement | `agreementHtml` | Responsibilities and test | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| ACADEMY-124 | Pathway evaluation | `pwEvalHtml` | Evidence against commitments | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| ACADEMY-125 | Academy credibility | `credHtml` | Causal reputation record | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |

### Detailed implementation contract for this family

- **Initial view:** state the football or CEO question before controls; show responsible person and why this material matters now.
- **Secondary depth:** put raw supporting metrics, season history, and process logs behind one explicit detail route, not nested tabs upon tabs.
- **Decision types:** informational views must not invent an action. Conversation, governance, exception, personnel, and simulation interactions use their correct decision contracts from `07-DECISION-ENGINE-REDESIGN.md`.
- **Navigation:** stable home, local backward path, no modal trap, persistent selected context, and consistent route back after commit.
- **Exceptional states:** loading/empty, unavailable employee/player, stale deadline, expired offer, crisis, replay/end-season and old-save migration must be defined per relevant screen.
- **Code:** refactor the named renderer in its actual source module and the corresponding `ui/15-actions.js` case; use a shared component vocabulary from `04-INFORMATION-ARCHITECTURE.md`; change supporting engine functions only with migration.
- **Acceptance:** source data displayed, meaningful controls wired, one-tap submission, visible saved consequence or pending execution, back navigation and a stable return to the appropriate phase.

## COMMERCIAL — commercial.js; depts.js

**UI source:** `src/ui/08-departments.js`; `src/ui/07-club-league.js`

| Screen ID | Screen/state | Source renderer | Player question / target information | Interaction and planned treatment |
|---|---|---|---|---|
| COMMERCIAL-126 | Commercial overview | `vDept(commercial)` | Revenue and opportunities | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| COMMERCIAL-127 | Commercial staff | `vDept(commercial:people)` | Sponsorship/ticketing/retail | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| COMMERCIAL-128 | Commercial evidence | `vDept(commercial:data)` | Sales, attendance and pipeline | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| COMMERCIAL-129 | Commercial mandate | `vDept(commercial:dec)` | Authority and objectives | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| COMMERCIAL-130 | Sponsor offer | `comDecisions` | Counterparty, return and trade-offs | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| COMMERCIAL-131 | Sponsorship negotiation | `secCommercial` | Deal terms, execution and renewal | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| COMMERCIAL-132 | Ticket pricing | `comDecisions` | Demand, affordability and attendance | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| COMMERCIAL-133 | Retail development | `comOverview` | Merchandise and operating scope | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| COMMERCIAL-134 | Commercial expansion | `comDecisions` | Cost, facilities and payoff | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |

### Detailed implementation contract for this family

- **Initial view:** state the football or CEO question before controls; show responsible person and why this material matters now.
- **Secondary depth:** put raw supporting metrics, season history, and process logs behind one explicit detail route, not nested tabs upon tabs.
- **Decision types:** informational views must not invent an action. Conversation, governance, exception, personnel, and simulation interactions use their correct decision contracts from `07-DECISION-ENGINE-REDESIGN.md`.
- **Navigation:** stable home, local backward path, no modal trap, persistent selected context, and consistent route back after commit.
- **Exceptional states:** loading/empty, unavailable employee/player, stale deadline, expired offer, crisis, replay/end-season and old-save migration must be defined per relevant screen.
- **Code:** refactor the named renderer in its actual source module and the corresponding `ui/15-actions.js` case; use a shared component vocabulary from `04-INFORMATION-ARCHITECTURE.md`; change supporting engine functions only with migration.
- **Acceptance:** source data displayed, meaningful controls wired, one-tap submission, visible saved consequence or pending execution, back navigation and a stable return to the appropriate phase.

## MARKETING — marketing.js; depts.js

**UI source:** `src/ui/08-departments.js`; `src/ui/07-club-league.js`

| Screen ID | Screen/state | Source renderer | Player question / target information | Interaction and planned treatment |
|---|---|---|---|---|
| MARKETING-135 | Marketing overview | `vDept(marketing)` | Supporter/community direction | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| MARKETING-136 | Marketing staff | `vDept(marketing:people)` | Social/community/content | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| MARKETING-137 | Marketing evidence | `vDept(marketing:data)` | Campaign and fan trends | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| MARKETING-138 | Marketing mandate | `vDept(marketing:dec)` | Authority and strategy | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| MARKETING-139 | Campaign proposal | `mkDecisions` | Cost, expected results and trade-off | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| MARKETING-140 | Community programme | `mkDecisions` | Local engagement/credibility | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| MARKETING-141 | Marketing-commercial conflict | `vOpen` | Competing perspectives and resolution | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| MARKETING-142 | Campaign results | `mkOverview` | Evidence, not engagement vanity | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |

### Detailed implementation contract for this family

- **Initial view:** state the football or CEO question before controls; show responsible person and why this material matters now.
- **Secondary depth:** put raw supporting metrics, season history, and process logs behind one explicit detail route, not nested tabs upon tabs.
- **Decision types:** informational views must not invent an action. Conversation, governance, exception, personnel, and simulation interactions use their correct decision contracts from `07-DECISION-ENGINE-REDESIGN.md`.
- **Navigation:** stable home, local backward path, no modal trap, persistent selected context, and consistent route back after commit.
- **Exceptional states:** loading/empty, unavailable employee/player, stale deadline, expired offer, crisis, replay/end-season and old-save migration must be defined per relevant screen.
- **Code:** refactor the named renderer in its actual source module and the corresponding `ui/15-actions.js` case; use a shared component vocabulary from `04-INFORMATION-ARCHITECTURE.md`; change supporting engine functions only with migration.
- **Acceptance:** source data displayed, meaningful controls wired, one-tap submission, visible saved consequence or pending execution, back navigation and a stable return to the appropriate phase.

## BUSINESS — business.js; depts.js; engine/07-finance-transfers.js

**UI source:** `src/ui/08-departments.js`; `src/ui/05-pitches-squad-money.js`; `src/ui/07-club-league.js`

| Screen ID | Screen/state | Source renderer | Player question / target information | Interaction and planned treatment |
|---|---|---|---|---|
| BUSINESS-143 | Business overview | `vDept(business)` | Finance governance and risks | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| BUSINESS-144 | Finance Head profile | `vDept(business:people)` | Relationship and expertise | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| BUSINESS-145 | Finance staff | `vDept(business:people)` | Accountant/controller/lawyer | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| BUSINESS-146 | Financial evidence | `vDept(business:data)` | Cash, revenue, costs | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| BUSINESS-147 | Budget authority | `vDept(business:dec)` | Approval thresholds | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| BUSINESS-148 | Financial proposal | `bizOverview` | Business investment or mitigation | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| BUSINESS-149 | Cost policy | `bizOverview` | Trade-off and implementation | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| BUSINESS-150 | Budget plan | `planCard` | Department constraints | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| BUSINESS-151 | Legal/contract exposure | `vDept(business)` | Existing contract constraints | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| BUSINESS-152 | Financial crisis response | `vOpen` | CEO vs Finance authority | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| BUSINESS-153 | Financial reviews | `vMoney2` | Forecast and next review | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |

### Detailed implementation contract for this family

- **Initial view:** state the football or CEO question before controls; show responsible person and why this material matters now.
- **Secondary depth:** put raw supporting metrics, season history, and process logs behind one explicit detail route, not nested tabs upon tabs.
- **Decision types:** informational views must not invent an action. Conversation, governance, exception, personnel, and simulation interactions use their correct decision contracts from `07-DECISION-ENGINE-REDESIGN.md`.
- **Navigation:** stable home, local backward path, no modal trap, persistent selected context, and consistent route back after commit.
- **Exceptional states:** loading/empty, unavailable employee/player, stale deadline, expired offer, crisis, replay/end-season and old-save migration must be defined per relevant screen.
- **Code:** refactor the named renderer in its actual source module and the corresponding `ui/15-actions.js` case; use a shared component vocabulary from `04-INFORMATION-ARCHITECTURE.md`; change supporting engine functions only with migration.
- **Acceptance:** source data displayed, meaningful controls wired, one-tap submission, visible saved consequence or pending execution, back navigation and a stable return to the appropriate phase.

## SHEET — engine/09-meetings-actions-press.js; depts.js; recruit.js

**UI source:** `src/ui/06-sheets-ticker.js`

| Screen ID | Screen/state | Source renderer | Player question / target information | Interaction and planned treatment |
|---|---|---|---|---|
| SHEET-154 | Department issue | `vSheet(dept-issue)` | Escalated issue and plan | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SHEET-155 | Player sheet | `vSheet(player)` | Profile and detail navigation | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SHEET-156 | Department candidate | `vSheet(dcand)` | Candidate comparison | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SHEET-157 | Help | `vSheet(help)` | Game controls, not data overload | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SHEET-158 | Legacy grip | `vSheet(grip)` | Retire if reachable and migrate | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SHEET-159 | Coach sack | `vSheet(sack)` | Costs, vacancy and relationship | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SHEET-160 | Transfer target | `vSheet(target)` | Scout and negotiation data | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SHEET-161 | Recruitment plan | `vSheet(recplan)` | Plan and mandate | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SHEET-162 | Mandate editor | `vSheet(mand)` | Authority, expectations and review | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SHEET-163 | Staff talk | `vSheet(talk)` | Contextual conversation | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SHEET-164 | Support request | `vSheet(push)` | No repeatable trust farming | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SHEET-165 | General candidates | `vSheet(cands)` | Compare and appoint head | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SHEET-166 | Fire employee | `vSheet(fire)` | Consequences and backfill | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SHEET-167 | Quick start | `vSheet(quick)` | Explain preset | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SHEET-168 | Stakeholders | `vSheet(backers)` | Sources and changes | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SHEET-169 | Analysis | `vSheet(analysis)` | Performance interpretation | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SHEET-170 | Confirm progression | `vSheet(confirm)` | Avoid routine double confirmation | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| SHEET-171 | Legacy ticker | `vSheet(ticker)` | Consolidate with canonical Matchday | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |

### Detailed implementation contract for this family

- **Initial view:** state the football or CEO question before controls; show responsible person and why this material matters now.
- **Secondary depth:** put raw supporting metrics, season history, and process logs behind one explicit detail route, not nested tabs upon tabs.
- **Decision types:** informational views must not invent an action. Conversation, governance, exception, personnel, and simulation interactions use their correct decision contracts from `07-DECISION-ENGINE-REDESIGN.md`.
- **Navigation:** stable home, local backward path, no modal trap, persistent selected context, and consistent route back after commit.
- **Exceptional states:** loading/empty, unavailable employee/player, stale deadline, expired offer, crisis, replay/end-season and old-save migration must be defined per relevant screen.
- **Code:** refactor the named renderer in its actual source module and the corresponding `ui/15-actions.js` case; use a shared component vocabulary from `04-INFORMATION-ARCHITECTURE.md`; change supporting engine functions only with migration.
- **Acceptance:** source data displayed, meaningful controls wired, one-tap submission, visible saved consequence or pending execution, back navigation and a stable return to the appropriate phase.

## MATCH — engine/06-match.js; matchday.js; matchtalk.js

**UI source:** `src/ui/14-matchday-gazette.js`; `src/ui/06-sheets-ticker.js`; `src/ui/12-scenes-cards.js`

| Screen ID | Screen/state | Source renderer | Player question / target information | Interaction and planned treatment |
|---|---|---|---|---|
| MATCH-172 | Match preview | `mdPreview` | Opponent, form and context | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| MATCH-173 | Match kickoff | `mdKick` | One transition | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| MATCH-174 | Live match | `mdMatch` | Score, clock, factual events | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| MATCH-175 | Match speed | `mdMatch` | Fast/normal mode | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| MATCH-176 | Match to full-time | `mdMatch` | Finish option | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| MATCH-177 | Half-time | `mdMatch` | Own informational phase | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| MATCH-178 | Full-time | `mdMatch` | Score and consequence | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| MATCH-179 | Match newspaper | `mdPaper` | Narrative and factual statistics | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| MATCH-180 | Gazette edition | `gzEdition` | Stories and club-world events | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| MATCH-181 | Gazette archive | `gazette` | Navigate old issues | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| MATCH-182 | Cup match variant | `vMatchday` | Correct continuation | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| MATCH-183 | Return to new week | `vMatchday` | State and next action | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |

### Detailed implementation contract for this family

- **Initial view:** state the football or CEO question before controls; show responsible person and why this material matters now.
- **Secondary depth:** put raw supporting metrics, season history, and process logs behind one explicit detail route, not nested tabs upon tabs.
- **Decision types:** informational views must not invent an action. Conversation, governance, exception, personnel, and simulation interactions use their correct decision contracts from `07-DECISION-ENGINE-REDESIGN.md`.
- **Navigation:** stable home, local backward path, no modal trap, persistent selected context, and consistent route back after commit.
- **Exceptional states:** loading/empty, unavailable employee/player, stale deadline, expired offer, crisis, replay/end-season and old-save migration must be defined per relevant screen.
- **Code:** refactor the named renderer in its actual source module and the corresponding `ui/15-actions.js` case; use a shared component vocabulary from `04-INFORMATION-ARCHITECTURE.md`; change supporting engine functions only with migration.
- **Acceptance:** source data displayed, meaningful controls wired, one-tap submission, visible saved consequence or pending execution, back navigation and a stable return to the appropriate phase.

## END — engine/10-season.js; season.js; engine/14-save-api.js

**UI source:** `src/ui/09-firstteam-review.js`; `src/ui/13-redbox-render.js`; `src/ui/03-summer-preseason-press.js`

| Screen ID | Screen/state | Source renderer | Player question / target information | Interaction and planned treatment |
|---|---|---|---|---|
| END-184 | Season review | `vReview2` | Goals, football and governance | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| END-185 | Promotion outcome | `vReview2` | New competition and expectations | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| END-186 | Relegation outcome | `vReview2` | Recovery and staff consequences | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| END-187 | Board judgment | `vReview2` | Evidence and trust | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| END-188 | CEO dismissed | `vSacked` | Reason and next option | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| END-189 | New-season transition | `vReview2` | Clear return to summer | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| END-190 | New season summer | `vSummer2` | Carry forward promises and staff | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| END-191 | Save game | `saveGame` | Stable storage and clear success | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| END-192 | Load game | `loadGame` | Legacy-compatible migration | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| END-193 | Unsaved state | `vTitle` | First-time and empty save | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| END-194 | No head coach | `vFirst` | Vacancy and responsible party | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| END-195 | No staff or reports | `vDepts` | Informative empty state | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| END-196 | No available match | `vInbox` | Week progress still works | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |
| END-197 | Missing target/expired deal | `vSheet(target)` | Explicit stale-data recovery | Rebuild as a clear context → evidence → action (if warranted) → follow-up route; preserve owner and back path |

### Detailed implementation contract for this family

- **Initial view:** state the football or CEO question before controls; show responsible person and why this material matters now.
- **Secondary depth:** put raw supporting metrics, season history, and process logs behind one explicit detail route, not nested tabs upon tabs.
- **Decision types:** informational views must not invent an action. Conversation, governance, exception, personnel, and simulation interactions use their correct decision contracts from `07-DECISION-ENGINE-REDESIGN.md`.
- **Navigation:** stable home, local backward path, no modal trap, persistent selected context, and consistent route back after commit.
- **Exceptional states:** loading/empty, unavailable employee/player, stale deadline, expired offer, crisis, replay/end-season and old-save migration must be defined per relevant screen.
- **Code:** refactor the named renderer in its actual source module and the corresponding `ui/15-actions.js` case; use a shared component vocabulary from `04-INFORMATION-ARCHITECTURE.md`; change supporting engine functions only with migration.
- **Acceptance:** source data displayed, meaningful controls wired, one-tap submission, visible saved consequence or pending execution, back navigation and a stable return to the appropriate phase.

## Registry total

197 individually named screen or state **design targets** spanning 14 families, cross-referenced to the source function-level and action registries. There are also shared components and dynamic event-specific instances; those are **parameterized views**, not 197 unique rendering functions. They remain in scope via the full key list in `02-DECISION-ENGINE-AUDIT.md` and every `ACT-*` in `10-ACTION-REGISTRY.md`.

**Coverage caveat:** A source inspection cannot establish that every conditional branch is reachable, or that variants render visually. A dynamic instrumented screen-state census is still required before declaring literal 100% screen coverage. See `09-COVERAGE-AND-TRACEABILITY.md`.
