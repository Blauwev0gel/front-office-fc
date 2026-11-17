# Mobile wireframe library — reference patterns for every screen family

These are **wireframe patterns**, not claims about currently implemented visuals. Screens in `05-EVERY-SCREEN-SPECIFICATION.md` link to the matching family and inherit its pattern; each unique state changes data, actions and reason for urgency. Mock numbers/names below are illustrative only and **must never be hardcoded into runtime**. Screen widths 320, 375, 390 and 430px are targets, not tested outputs.

## WIRE-001 — FOUNDING / Club identity

    Club formation · Step 2 of 7
    CLUB NAME  [Harwick Athletic]
    TOWN       [Harwick]
    ABBREVIATION [HWA]
    CLUB COLOURS  [swatch] [options]
    Your choices shape board priorities and club identity.
    [Back]                         [Continue]

**Design rule:** No generic executive dashboard at founding; explain why identity matters before taking money decisions.

## WIRE-002 — HIRING / Candidate comparison

    APPOINT A HEAD OF RECRUITMENT
    Budget for role · wage range
    CANDIDATE A               CANDIDATE B
    Evidence / strengths / risks
    Age, trait, wage, personality
    Previous commitments / vacancy impact
    [Ask candidate] [Appoint A] [Appoint B]

**Design rule:** Use actual generated candidate characteristics, not fake biographies.

## WIRE-003 — MANDATE / Agreement

    HEAD COACH — AGREED RESPONSIBILITIES
    Current goal 
     Manager's own recommendation
    Scope: squad / youth / training / budget
    Authority level: short / normal / free hand
    What he can decide without you
    What triggers escalation
    How you will judge results · when
    [Discuss]            [Agree mandate]

**Design rule:** Make what changes and what stays autonomous unambiguous.

## WIRE-004 — SUMMER / Planning conversation

    SUMMER MEETING — DIRECTOR OF FOOTBALL
    Squad gaps and contract timeline
    DoF diagnosis vs coach's wish
    Budget and market limits
    Proposal A: strengthen now
    Proposal B: develop within current squad
    Proposal C: protect cash / reassess
    Consequences, accountability, checkpoint
    [Ask one question] [Agree direction]

**Design rule:** One decision can lead to multiple weeks of staff execution.

## WIRE-005 — DESK / Quiet week

    SEASON 1 · WEEK 3
    LEAGUE 9TH  FORM WDL  CASH...
    Nothing needs your approval
    From the club: staff already working
    Ongoing: one recruitment assignment
    NEXT MATCH · home vs ...
    [Match preview →]
    [Club records]

**Design rule:** No invented urgent email or filler warning.

## WIRE-006 — DESK / Crisis week

    SEASON 2 · WEEK 25
    FINANCIAL PRESSURE · verified negative cash
    Finance Head: exception needs CEO
    Reason, urgency, no-response effect
    [Review decision]
    Other operations and next fixture
    [Continue] available under existing rules

**Design rule:** Differentiate true CEO approvals from optional staff advice.

## WIRE-007 — DECISION / Exception

    TRANSFER EXCEPTION · DIRECTOR OF FOOTBALL
    Why is this on your desk?
    Requested fee / agreed mandate limit
    DoF recommendation and evidence
    A — approve once within new ceiling
    B — renegotiate and return by deadline
    C — decline and revise shortlist
    If left open: staff/default handling
    [Tap one option → committed]

**Design rule:** No extra send/confirm routine; guard against duplicate command.

## WIRE-008 — CONVERSATION / Conflict

    MEETING · HEAD COACH + DIRECTOR OF FOOTBALL
    What the coach wants 
     what DoF wants
    Point of conflict and club stakes
    [Ask coach why] [Ask DoF for alternative]
    CEO: [Back coach] [Back DoF] [Joint agreement]
    Responsibility and next review
    [Back to case]

**Design rule:** Show sides with distinct motives; do not collapse into morale points.

## WIRE-009 — CASE / Ongoing agreement

    CASE #R-012 · CENTRE-BACK COVERAGE
    Week 6: shortage raised by DoF
    Week 6: CEO agreed affordable experience
    Week 7: scouts assigned
    Week 8: two leads identified
    CURRENT OWNER — DOF 
     NEXT REVIEW — WK 10
    [View evidence] [Meet DoF]

**Design rule:** Only actual recorded events; no fictitious timeline entries.

## WIRE-010 — FOOTBALL / Squad

    FOOTBALL · SQUAD / LEAGUE
    MANAGER'S XI 
     ALL PLAYERS 
     ADVANCED
    POS  PLAYER          FORM   APPS
    GK   ...              ...     ...
    CB   ...              ...     ...
    Unavailable: injuries / suspensions
    [Open player] [Discuss with coach]

**Design rule:** Squad is rich information, not direct CEO team selection.

## WIRE-011 — PLAYER / Detail

    PLAYER · NAME / POSITION
    Age · contract · availability
    CURRENT ABILITY      POTENTIAL
    APPS  GOALS  RATING  MORALE
    Overview 
     Statistics 
     Career
    Attributes and scout evidence
    Relevant issue with owner
    [Back to squad]

**Design rule:** Never imply scout certainty beyond known confidence.

## WIRE-012 — LEAGUE / Table

    DIVISION · SEASON
    Own rank / target / next opponent
    #  CLUB            P  GD  PTS
    1  ...            20 +14  40
    2  ...            20 +10  38
    ...
    Promotion/relegation band legend
    [Full statistics] [Other division]

**Design rule:** Use compact conventional football table semantics.

## WIRE-013 — CLUB / Governance

    CLUB · BOARD AND FINANCE
    Cash / weekly trajectory / runway
    Board goal / measured progress
    Board · Supporters · Room
    Projects and accountable heads
    [Review finance] [View objectives]
    [Club history]

**Design rule:** No single generic trust number and no Grip.

## WIRE-014 — PEOPLE / All six heads

    PEOPLE · DEPARTMENTS
    FIRST TEAM       Head Coach     STATUS
    RECRUITMENT      DoF + Scout    STATUS
    ACADEMY          Academy Head   STATUS
    COMMERCIAL       Commercial H. STATUS
    MARKETING        Marketing H.  STATUS
    BUSINESS         Finance Head   STATUS
    [Open department]

**Design rule:** All six always in the same navigation; visibility of autonomous work.

## WIRE-015 — DEPARTMENT / Generic detail

    DEPARTMENT — RESPONSIBLE PERSON
    Status vs agreed target
    Current work and next review
    Briefing 
     Staff 
     Evidence 
     Mandate
    Issues requiring CEO (if any)
    Specialist departmental evidence
    [Discuss with head]

**Design rule:** Generic shell; each department receives distinct data below.

## WIRE-016 — FIRST TEAM / Manager

    FIRST TEAM · HEAD COACH
    Record vs expected / tactical ownership
    Fitness + availability / assistants
    Coaching and support staff
    [Discuss playing opportunities]
    [Review coach mandate]
    [Consider dismissal: contextual]

**Design rule:** No tactical intervention controls for CEO.

## WIRE-017 — RECRUITMENT / Pipeline

    RECRUITMENT · DOF / CHIEF SCOUT
    Squad needs and priorities
    IDENTIFIED → SCOUTED → APPROACH → DEAL
    Candidates, confidence, blockers
    Contracts / loans / wage ceilings
    [Discuss policy] [Review exception]

**Design rule:** DoF owns execution; Chief Scout owns evidence.

## WIRE-018 — ACADEMY / Pathway

    ACADEMY · PLAYER DEVELOPMENT
    Youth intake / welfare / progress
    Prospect, coach stance, DoF stance
    Agreement: means / performance indicator
    Next review after real playing weeks
    [Request update] [Change course by agreement]

**Design rule:** Development never guarantees first-team minutes.

## WIRE-019 — COMMERCIAL / Revenue

    COMMERCIAL · SPONSORS / TICKETS / RETAIL
    Income trajectory 
     sponsor pipeline
    Current ticket pricing / attendance
    Opportunity → term → reputation risk
    [Authorize exceptional sponsor] [Discuss growth]

**Design rule:** Not a click-to-increase-revenue shop.

## WIRE-020 — MARKETING / Supporters

    MARKETING · COMMUNITY / CONTENT / SOCIAL
    Club brand goals vs supporter sentiment
    Campaigns and community commitments
    Evidence: cost, reach, conversion or fan ties
    [Discuss campaign] [Review outcome]

**Design rule:** Avoid generic vanity-metric bars.

## WIRE-021 — BUSINESS / Risk

    BUSINESS · FINANCE / LEGAL
    Cash trajectory and commitments
    Ledger, policy and constraints
    Accountant / controller / legal officer
    Proposed measures and responsibility
    [Set direction] [Review exceptions]

**Design rule:** Finances must link to decisions across departments.

## WIRE-022 — MATCHDAY / Preview and live

    PREVIEW: opponent, form, stakes → [Kick off]
    LIVE: HOME 1–0 AWAY   57'
    Events: goal, chance, yellow card
    [Normal/Fast] [Simulate to end]
    FULL TIME: score, key incidents and real stats
    GAZETTE: headline, sporting consequence
    [Go to next week]

**Design rule:** Exactly one match-state machine; retire parallel ticker only after migration.

## WIRE-023 — SEASON / Review

    SEASON REVIEW · ACTUAL VS AGREED
    League place, budget and promises
    Board assessment and staff evaluation
    Evidence of previous agreements
    Promotion/relegation if applicable
    [See detail] [Begin new summer]

**Design rule:** The outcome follows the actual engine; do not use cosmetic season-level rewards.

## WIRE-024 — SHEET / Modal states

    MODAL / DETAIL PAGE
    Persistent context and reliable back
    Identity, case, exact evidence
    One clear reason for the sheet
    [Commit ONE effect] or [Close]
    After commit: result and owner
    [Return to source screen]

**Design rule:** Mobile complex decisions should become full-screen; no trapped overlay.

## Conditional variants (not just a single static happy path)

| Variant | How the wireframe differs |
|---|---|
| No staff head | Header says Vacant; show actual appointment route and interim consequences, not dummy departmental performance |
| Several pending cases | Only top one/two at first view, rest in grouped list; actual importance/deadline ordering |
| Quiet week | Explain autonomous activity, expose next match or week progression; no urgency decoration |
| Financial or sporting crisis | Strong but bounded signal; actual cause and responsible head linked to a case |
| Empty league or unplayed season | Table/stat placeholders state no results rather than fabricated rankings |
| Suspended/injured player | Availability clearly visible alongside performance; no CEO tactical toggle |
| Expired transfer deal | Preserve historical terms and outcome; disable obsolete approval command |
| Disabled event | Not rendered as active case; only historical archive if previously recorded |
| Full-time / end-of-season | Phase-specific next step rather than ordinary Desk's weekly action |
| Archived/decided case | Render outcome and provenance; no second commit |
| Old save | Use migrated compatible fields, show neutral fallback for absent new fields |

## Navigation and visual contract

- Default compact information, bold identity line and readable distinct CTA; avoid giant faux-SaaS cards.
- Every decision route includes one back destination, one actual effect and an outcome review where applicable.
- Tables are semantic and compact. Optional data may scroll horizontally; global pages must not.
- UI elements derive from game state. Omit data that does not exist rather than inventing context.
- Do not turn every optional question into a multi-step modal. Use full screen only for substantive dialogue and agreement.
- Multiweek causal stories require real dates and connected source event IDs.
