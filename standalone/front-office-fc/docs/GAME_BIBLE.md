# Game Bible — standalone Front Office FC

## Status and provenance
Working design canon for the **standalone** prototype, not for the pre-existing repository game. Research basis: [modular start](https://github.com/Blauwev0gel/front-office-fc/blob/docs/modular-foundation-research-20261118/docs/research/2026-11-18-modulaire-start.md), explicitly exploratory.

## Vision
A mobile-first football club owner/CEO game. The player hires and evaluates staff, sets organisational direction and sees indirect football consequences. They do not select line-ups, make tactical substitutions or individually negotiate every transfer.

## Design pillars
- **Owner, not coach:** authority over people and direction, not pitch-side tactics.
- **Staff autonomy:** independent actions must change game state, not just generate prose.
- **Football-first:** preview → dedicated match → report/newspaper → club life.
- **Persistent world:** time moves week by week; quiet weeks can pass quickly.
- **Compact mobile game UI:** legible game screens, short labels, touch-first interactions.
- **Incremental vertical slices:** a playable build and honest test evidence after each module.

## Present prototype scope
An eight-club, 14-round competition; fictional squads; manager selection; match simulation with separate playback; a sporting director appointment, strategic direction and simple autonomous squad changes; career/save and season progression; game-style Home/Squad/Staff/Club/League screens. Verify specific mechanics in the actual 2.2 HTML before changing them.

## Core loops
Football: HQ → preview → live match → report → week summary → next week.
Organisational: owner direction → TD action → squad changes → team strength → evaluation. The latter is **early-stage**, not yet a deep organisational simulation.

## Deliberate exclusions for current scope
No detailed tactics, complete transfer market, sponsorship, stadium upgrades, finance engine, family simulation, succession, multiple controlled clubs or dynasty. These are not rejected forever; several were explicitly research-only.

## Design warning
A TD who only writes messages is not autonomous. Conversely, forcing a CEO approval every week destroys the intended role. Avoid action points, random inbox spam and superficial upgrade meters.

See [research traceability](RESEARCH_TRACEABILITY.md) and [decisions](DECISIONS.md).
