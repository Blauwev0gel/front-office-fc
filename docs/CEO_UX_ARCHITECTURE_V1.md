> **Historical V1 architecture.** Superseded by BIBLE.md § B20 (four global destinations: Desk, Football, Club, People). The original five-tab comparison and V1 wireframes below are historical, not instructions for the current chatgpt UI rebuild. Matchday remains contextual, Football contains Squad and League views, and the old routes remain compatible.

# THE FRONT OFFICE — CEO UX architecture V1 (chatgpt)

## Evidence and decision

Read CODEMAP and the actual inbox, club, league, render and action modules. The game currently has five persistent bottom destinations (Inbox, Club, Squad, League, Depts), plus contextual News/Gazette and matchday. The inbox had nine always-present folder choices beneath its main decision area; the cash shortcut incorrectly opened Staff. Club still displayed the retired Grip metric, and a low Grip could still trigger a Club warning badge. These are information-architecture defects, not reasons to rebuild the engine.

**Decision:** retain five destinations for now. Combining Squad and League into Football would add a second navigation level to two heavily consulted football views. Do not merge them without a measured mobile task-flow advantage. The Inbox remains the primary play surface. Matchday remains its own staged screen, not a sixth persistent tab. The Gazette remains reachable contextually, not a sixth persistent tab.

## Page contract

| Page | Player question | First screen: essential information | Deeper on demand | CEO decisions | Must not do |
|---|---|---|---|---|---|
| Inbox | What needs me now? | Red box, current week, short club pulse, current match and urgent issues | Nine message folders, decisions ledger, stories, handled items | One-tap responses, escalation, delegation and week advance | Make archived folders compete with the decision area |
| Club | Is my club healthy? | Cash and weekly trajectory, board objectives, Board/Fans/Room confidence, immediate risk | Commercial deals, public promises, project progress, history | Strategy via proposals, meetings and existing systems | Display retired Grip or offer arbitrary click upgrades |
| Squad | Who plays for us and how are they doing? | Team, positions, availability, form, key player data | Individual profiles, youth pathway, detailed statistics | Raise issues with coach/DoF through existing conversations | Let CEO pick XI or set tactics |
| League | Where do we stand? | Position, target, next opponent, table, recent form | Other divisions, cup and detailed standings | Normally none; information informs conversations elsewhere | Invent a button just to create activity |
| Departments | Who owns the work? | Department head, mandate, progress and actual problems | Staff, facilities, pipeline, budget, evidence, project details | Appoint, discuss, mandate, approve exceptions | Make CEO execute routine staff work |
| Matchday | What is at stake and what happened? | Opponent, context, score/time, key incidents | Preview, live text, result and Gazette | Advance/fast-forward/end; no tactics | Render the match as a pop-up or require CEO tactical control |
| Conversations | What is being asked and why? | Sender, problem, recommendation, consequence, distinct options | Second opinion, evidence, decision history | One tap to commit; save immediately | Draft/send/confirm loops |

## Information hierarchy

1. **Now:** urgent decisions, deadlines, next match and consequences. Always visible at point of need.
2. **Monitor:** club health, football performance, people and active agreements. Visible on the owning page.
3. **Investigate:** full player profiles, department reports, standings and archived messages. One deliberate tap away.
4. **Internal:** RNG, hidden match odds, detailed engine weights and AI selection rules. Never presented as a dashboard.

## Changes in this implementation

- Inbox keeps the red box, desk updates and Gazette prominent. Nine folder filters remain fully accessible inside a collapsed **Browse all messages** section. Existing filter actions and all folder data remain intact.
- The cash pulse opens **Club**, its actual owning page, not Staff.
- Club no longer shows Grip; low legacy Grip no longer triggers a warning badge. The three accountable stakeholders remain.
- Inbox folder buttons expose selection state and use 44px touch targets. No gameplay decisions or match navigation are removed.

## Mobile text wireframes

### Inbox

```text
CLUB NAME                        WK 12
[POSITION / TARGET] [CASH] [NEXT MATCH]
BOARD  FANS  ROOM

THE RED BOX                    2 to answer
[Technical Director — contract issue]
[Board — meeting request]

ON YOUR DESK
[Finance report]

THE GAZETTE
[Headline]

[Browse all messages ▸]

[NEXT MATCH]   (primary advance)
INBOX | CLUB | SQUAD | LEAGUE | DEPTS
```

### Club

```text
CLUB — YOUR ORGANISATION
CASH  / WEEKLY FORECAST
BOARD OBJECTIVES  2/3 ON TRACK
BOARD | FANS | ROOM
[Promises] [Projects] [Commercial]
```

### Squad / League / Departments

```text
SQUAD: first XI, bench, availability -> player details
LEAGUE: position, target, next match -> full table
DEPTS: responsible head, mandate, status -> department details
```

### Match and conversations

```text
PREVIEW -> MATCH (fast-forward / finish) -> GAZETTE -> INBOX
MESSAGE: who / why / evidence -> ONE-TAP DECISION -> RESULT
```

## Functional UX scenarios and release gates

1. New player: setup and first inbox must explain the next action without requiring folder browsing.
2. Normal week: Red Box and next-match control must be directly accessible.
3. Financial issue: cash pulse must open Club; detailed department information remains accessible through Depts.
4. Coach issue: coach and mandate details remain in Departments; Squad provides football evidence.
5. Important match: matchday is its own screen with preview, progression and Gazette, not a popup.
6. Season two: dossiers, decision ledger and nine filters remain available but do not crowd the initial inbox view.

Static contract test: `node test/ux-architecture.cjs`. Existing engine, save, one-tap and story tests remain mandatory in GitHub Actions. **Owner performs browser QA** at 320/375/390/430px and checks back/next, scroll position, touch targets and text contrast. Static tests do not prove those visual properties.

## Deferred, not claimed as complete

Full redesign of Squad/League/Departments and matchday layout; six scenario-based browser journeys; measured tap counts; comparative four-vs-five-tab usability study; comprehensive accessibility audit. These require further implementation and user playtesting. Do not claim this document or the first navigation patch completes them.
