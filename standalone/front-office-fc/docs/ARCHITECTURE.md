# Architecture — standalone HTML prototype

## Boundary
The standalone build is a single HTML document with embedded CSS and JavaScript. This is **not** the modular `src/` architecture of the existing GitHub game.

## Functional layers to preserve
1. **World generation:** clubs, players, staff and career seed.
2. **Persistent state:** club identity, roster, TD, competition, match phase and season history.
3. **Competition:** schedule, fixtures, results, table and season transition.
4. **Match simulation:** match timeline generated independently of playback controls.
5. **Playback:** clock/ticker/speed/pause/Full Time; presentation must not change result.
6. **Sporting department:** owner choice and direction, autonomous TD action, squad changes.
7. **UI state:** screen selection and rendering; should not duplicate core game state.
8. **Save/load:** serialise enough information to resume safely.

## Expected causal paths
Player quality → team strength → match simulation → result → table.
Owner direction + TD attributes → autonomous decisions → squad changes → team strength.
These paths require code-level and statistical regression checks after future edits; this document does not claim that every factor is already well calibrated.

## Technical risks
- Monolithic HTML creates accidental coupling between UI and engine.
- State migration and resuming an active match need dedicated tests.
- Deterministic test seeds must be distinct from normal career generation.
- UI-only redesigns can silently alter event handlers.
- Season changes must preserve career state without duplicating match outcomes.

## Next verification
Archive exact 2.2 HTML, map actual functions and state keys with line references, and add executable smoke/regression tests before refactoring.
