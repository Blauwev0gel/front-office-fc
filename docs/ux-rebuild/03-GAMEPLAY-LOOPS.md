# Gameplay loops — current paths and target player experience

## Source map

| Phase | Current sources | Existing UI entry | Main responsibility |
|---|---|---|---|
| New game | engine/13-newgame-preseason.js, engine/04-staff-dna.js | ui/02-setup.js | Create club, DNA, hire heads, define mandates |
| Summer | summer.js, summer2.js, recruitx.js | ui/03-summer-preseason-press.js | DoF agenda, squad planning, transfer choices, staff advice |
| Preseason | engine/13-newgame-preseason.js, season.js | vPreseason | Board objectives, staff commitments, academy |
| Press | engine/09-meetings-actions-press.js | vPress | Public narrative and reputational context |
| Weekly Desk | engine/08-weekly-inbox.js, desk.js, briefs.js, events.js, events2.js | ui/10-inbox.js | CEO escalations, advisory notes, outcomes |
| Staff operations | depts.js and six departmental modules | ui/08-departments.js, UI sheets | Autonomous work under mandates |
| Matchday | engine/06-match.js, matchday.js, matchtalk.js | ui/14-matchday-gazette.js | Preview, match progression, result, newspaper |
| End week | engine/12-week.js, loop.js, season.js | render and play action | Staff weekly work, message generation, objectives and finances |
| Season end | engine/10-season.js, season.js | ui/09-firstteam-review.js | Objectives, board judgment, restart |
| Save/load | engine/14-save-api.js, ui/01-core.js | title/continue | Persistent G JSON with version migration |

## Current critical chain

1. F.newGame → setDNA → hire heads → finishStaff → finishMandates.
2. F.setupPreseason / preseason/press phase gates → F.finishPreseason → F.finishPress.
3. In season, inboxItems aggregates G.inbox messages, meeting proposals, G.briefs, milestones, pathways, dossiers, preview and Gazette. The rendered Desk organizes these into optional/required categories.
4. Message authority is determined through desk.js and event/brief configuration. F.respond applies actual answer; F.answerBrief and F.decideProposal are separate flows.
5. Player can advance through UI play action; the canonical logic is F.endWeek, which simulates matches/finances/staff work and propagates hooks.
6. Matchday adds a staged preview/live/after/Gazette layer over match results; confirm when and where the separate ticker is still reachable.
7. F.endSeason and F.startSeason bridge into review and next summer. Save/load persists G.

**Note:** exact ordering within F.endWeek, F.sum2 and hooks must be confirmed while implementing. Source mapping is not an executed run trace.

## Weekly target loop: no administrative treadmill

**Monday / Desk:** show latest game-changing football outcome, current sporting/financial pressure and staff activity. Only genuinely escalated cases ask for CEO choice. Optional staff conversation and reports remain available.

**During week:** the player can inspect squad, league, projects or employees, open a meaningful case, ask for evidence, set direction or leave empowered staff to act. No abstract action-point resource or repeatable trust bonus.

**Matchday:** one explicit preview → event-driven simulation with speed controls → consequence report → Gazette → following Desk. No mandatory read/close loops.

**Next week:** consolidate actual staff decisions, progress on agreements and unresolved exceptions. New messages must originate from state-dependent triggers, not a fixed quota.

## Season target loop

Summer diagnosis → DoF/coach conversation → coherent recruitment strategy → board expectation negotiation → staff mandate check → press moment → ordinary weeks / crisis windows / winter checkpoint → run-in → board review and financial/football appraisal → next summer.

- **Summer** is a plan formation loop, not a checklist with redundant confirmations.
- **Winter** is a revision checkpoint shaped by actual results and constraints; ensure the current season module actually surfaces it.
- **Review** uses comparable evidence and records reasons for meeting/missing objectives.
- **Recovery** must remain playable after disappointing results until an actual dismissal branch triggers.

## Multi-season progression

Sporting progress raises expectations and costs. Academy success requires both development resources and playing opportunity. Strong staff can take larger autonomous mandates. Commercial and Marketing should evolve with fanbase and league context rather than become disconnected click upgrades. Finance controls trade-offs rather than merely warning about cash.

## Scenario contracts (to design before code)

| Situation | Entry evidence | Meaningful CEO choice | Staff execution | Delayed trace |
|---|---|---|---|---|
| Quiet week | no critical event | proceed or investigate | autonomous routine decisions | Desk/Gazette summary |
| Contract escalation | wage/authority threshold | exception vs mandate change vs hold | DoF negotiates | actual salary/squad and trust effects |
| Coach–DoF dispute | opposing priorities | mediate, back one, create joint mandate | coach and DoF operate accordingly | performance and relationship review |
| Cash shortfall | forecast/runway | finance direction or board response | Finance Head and Commercial Head work | financial trajectory |
| Youth pathway | development evidence | agree outcomes and evaluation | Academy, coach and DoF | pathway report |
| Promoted season | new tier, resource gaps | priorities and staff mandates | six departments react | season goals and results |
| Manager dismissed | vacancy and costs | replacement route | interim manager/team continues | sporting recovery |

## Screen transitions

No global action should unexpectedly trigger match kickoff from a deep employee profile. Primary advance belongs to the Desk at the right phase. Provide context-specific return and preserve data selection when coming back from detail. Transient overlays should neither persist ghost choices nor erase important history.

## Implementation gates

- One phase graph with explicit allowed transitions.
- One responsibility owner per decision.
- Clear distinction between **observe**, **consult**, **commit**, **delegate** and **advance time**.
- Every resulting event has traceable timestamp, source, actor and cause when data exists.
- Engine-generated outcomes remain authoritative; UI never invents win probabilities or post hoc outcomes.
