# Proposed information architecture — one football CEO game

## Architecture choice

**Recommended: contextual game phase + four stable exploration destinations**, subject to route-depth validation.

- **Desk:** actionable headquarters; phase-aware priority, staff updates, pending cases and progression. Not an email application.
- **Football:** squad, XI, player dossiers, league, fixtures, results, cup, scouting context. Football information rich; no direct CEO tactics.
- **Club:** finances, board commitments, stakeholders, facilities, promises, projects, historical results.
- **People:** all six departments, head profiles, employees, responsibilities, mandates, conversations and evaluation.

Full-screen contextual stages: founding, summer, preseason, press, individual decisions/meetings, match preview, live match, full time, Gazette and season review. These are **not** bottom-navigation destinations.

## Alternatives considered

| Model | Benefit | Structural downside | Verdict |
|---|---|---|---|
| Pure Desk/inbox | All prompts in one place | Turns club leadership into compulsory notifications; football exploration indirect | Reject |
| Traditional FM sidebar | Rich football navigation | Many global entries, role confusion (CEO vs manager), especially on 320px | Borrow tables and drill-down, not role |
| Contextual phase with four destinations | Matches week flow, still inspectable football/people | Risk that Football and People have too many sublevels | Preferred, test tap counts |
| Fully context-only | Minimal navigation | High cost to compare staff/player/club information | Reject |

## Required navigation behavior

- Persistent game shell uses club, season/week, current destination, compact back/context.
- Bottom navigation only for in-season exploration; should not intercept full-screen match/season phase flow.
- Main destination → subsection → data/profile → contextual conversation/decision. Prefer one subordinate navigation level.
- On return, preserve list filter/scroll unless returning from a completed phase, in which case show refreshed Desk.
- Critical action should be reachable from its owner's overview AND from the Desk when escalated, but both must resolve to the **same case ID**, not two independent decision instances.
- Informational material may be consulted without making a decision. An archival article never automatically advances a week.

## Data hierarchy

| Category | Immediately visible | One tap deeper | Specialist detail | Do not expose as certainty |
|---|---|---|---|---|
| Desk | current week, football event, genuine escalation, upcoming match | case / staff update | archive and causal record | hidden engine weights |
| Football | position, form, squad availability, upcoming match | squad, table, fixture | player stats/history, scouting detail | exact future match result |
| Club | cash trajectory, board objective, serious risk | finance, projects, people who matter | cost breakdown and outcome ledger | hidden exact event rolls |
| People | each head, mandate, current work, red flags | department detail | employee history, specialist evidence | unwarranted success guarantee |
| Decision | owner, ask, stakes, options, recommendation | evidence/second opinion | prior commitments | guaranteed numerical effects when uncertain |
| Match | clock, score, meaningful events | relevant real match stats | Gazette, league consequences | fake momentum / AI-generated events |

## Six department ownership contracts

### First Team
Manager accountable for results, fitness and training. CEO sees coaching philosophy, expected vs actual performance, availability, staffing, training infrastructure and meaningful conversations. No direct XI/tactics control.

### Recruitment
DoF accountable for squad plan and deal execution; Chief Scout accountable for discovery and evidence. CEO sets profile, financial/authority thresholds and exceptions. One pipeline view with sources and blockers. Contract negotiation is not a CEO shopping cart.

### Academy
Academy Head accountable for recruitment, coaching, welfare and development. Player pathways require agreement among Academy, Coach and DoF; evaluate on multiweek evidence. Avoid upgrades that automatically generate success.

### Commercial
Commercial Head owns sponsoring, ticketing and retail. CEO influences strategy, exceptional reputational deals, risk and major investment. Show how commercial choices interact with attendance and supporter relationships.

### Marketing
Marketing Head owns audience, social, content and community. CEO defines public identity and exceptional campaigns/conflicts; not every social post. Metrics are contextualized to supporters/brand, not just vanity exposure.

### Business
Finance Head owns bookkeeping, cost controls and legal review. CEO sees runway, commitments, scenario consequences and actual policies. Budget authority must be synchronized with other heads; no duplicate budget controls on Desk and department.

## Universal interaction vocabulary

- **Inspect:** read without effect.
- **Ask:** request explanation / second opinion; changes information state, not magically performance.
- **Discuss:** choose conversation topic or negotiation stance, may reveal differing staff views.
- **Agree:** assign accountable owner, resources, limits, goal and review date.
- **Authorize:** one-tap approval for exception, bound by authority and state.
- **Delegate:** leave within existing mandate; true staff-owned execution and outcome.
- **Advance:** explicit time passage; never disguised as Continue within a dialogue.
- **Review:** compare outcome against committed expectation.

Only actions appropriate to the case are shown. No universal fixed three-option policy.

## Component design system

1. Game shell and phase header.
2. Section switcher (never multiple nested horizontal tabs).
3. Football stat row and table, including optional horizontally scrolling dense data.
4. Person summary and specialist evidence.
5. Decision docket: case type, requestor, facts, options, no-response path.
6. Conversation scene: participants, stance, evidence, response.
7. Agreement card: owner, mandate, scope, checkpoint.
8. Case timeline: actual events, provenance and outcomes.
9. Matchday ticker: event clock, score, real commentary, skip/fast-forward.
10. Gazette article: narrative with visible link to match/club evidence.

Square retro visual vocabulary, strong readable type hierarchy and selected states; avoid faux-terminal hostility and giant generic SaaS cards.

## Global empty and failure states

No head, absent specialist, expired offer, deferred project, no match, off-season, disabled historical event, completed dossier, missing player, unexpected old-save data and interrupted Matchday need dedicated safe fallbacks. Never render an enabled action without a valid callback.
