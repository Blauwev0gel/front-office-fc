# SLIMLINE — Six-block world-development roadmap

**Date:** 22 November 2026  
**Repository:** `Blauwev0gel/front-office-fc`  
**Branch:** `claude/loving-goodall-uv00vn`  
**Scope:** standalone `front-office-fc/northmarch-layered` only. No GitHub merge/deployment.

## Contract and evidence
Build the actual football simulation, not story scripts, staff dialogues, owner dilemmas or a cosmetic dashboard. Every new rule must move an existing sporting, economic or historical outcome.

**Current release evidence:** Code has been written and committed to GitHub. The changed JavaScript source files were checked for **syntax only** using V8 compilation. **No build, unit/integration suite, 20-season playthrough or browser playtest has been run** for these changes, following the user's instruction to focus on development. Consequently no block is certified complete.

## Six blocks: actual implementation status

| Block | Status | Implemented in source | Remaining release gate |
|---|---|---|---|
| 1 — World and competition integrity | IMPLEMENTING | Five-tier domestic pyramid, 80-team cup, six foreign leagues resolved weekly, European four-round calendar avoiding cup weeks, income and player effects, V9 migrations and partial old-save reconstruction | Demonstrate 20 seasons, all 5×16 counts, cup 79 ties, European calendar, deterministic save roundtrip |
| 2 — International player market | IMPLEMENTING | 72 foreign clubs own persistent players, nationalities; same-market free agents; normal director scouting sees overseas players; `foreignMove()` changes both squads and financial records; club/player willingness and needs constrain movement | Validate signed player availability, contract/financial reconciliation, credible volumes, replacement chains and AI vs player-club behavior |
| 3 — Individual player careers | IMPLEMENTING | Individual growth paths, peaks, player styles, loyalty/ambition; match outcomes change form; actual club stints on move and loan return, separate Europe apps/goals, career trophies and youth breakthrough events | Verify career statistics and identities across domestic/foreign/loan/free agency/retirement for 20 seasons |
| 4 — Dynamic club evolution | IMPLEMENTING | Persistent heritage/titles, promotion history, multi-season reputation, responsive rivalry heat, own-youth playing-time culture and derived evolving identity | Measure long-run competitive balance and meaningful club differentiation; stop false identity flips |
| 5 — Match engine | IMPLEMENTING | Quality+injury+morale XI, trainer style match-ups, player playing-style effects on xG and scoring, bounded team form, physical burden of cup/Europe, results feed player morale/form | Calibrate thousands of scorelines; check unexpected biases and injuries/cups/Europe interaction |
| 6 — World becomes visible | IMPLEMENTING | In-game weekly world news, European previews and results, international transfer wire, foreign tables, annual awards, player profile career/honours, evolving club profiles and rise/fall trends | Browser acceptance of mobile navigation, safe old-save rendering, fact consistency, readability |

## Functional design (locked)
**World → player populations → transfers and development → clubs → fixtures/results → news and history.**

A mechanism never qualifies as implemented merely because it writes an isolated value. Player identity, ownership, club finances and match strength must be integrated.

### Block 1: concrete source
- `src/world/world.js`, `league.js`, `foreign.js`, `sim/clock.js`
- `src/core/save.js` V9 with `expandLegacyPyramid()`, `foreignRestoreCalendar()`, `enrichLegacyWorld()`.
- National cup weeks: 2,4,9,14,19,24,28. Europe: 6,11,17,25.
- Legacy caveat: New lower tiers cannot have historical financial records reconstructed. Old current-season results are synthetic, and pre-existing cup format is preserved using a legacy flag.
- Continental money is queued until `financeWeek` writes the normal weekly ledger.

### Block 2: concrete source
- `src/world/foreign.js`: `foreignSquadInit`, `foreignMove`, `foreignTransferWindow`, free-agency, contract renewal and nationalities.
- `src/football/market.js`: director searches both domestic and foreign candidate pools and uses the same budget/mandate checks.
- `src/club/recruitment.js`: incoming/outgoing international transfers appear in recruitment windows and the director's report.

### Block 3: concrete source
- `src/football/players.js`: `PLAYER_STYLES`, `DEV_PATHS`, `playerCloseStint`, player growth, ambition/loyalty, honours and breakthroughs.
- `src/football/life.js`, `src/club/youth.js`: match-driven form, separate loan-club stints and real youth loan records.
- `src/ui/club.js`: player career and contract, nationalities, development, honours and European stats.

### Block 4: concrete source
- `src/world/rivalry.js`: derby/rivalry consequences and playing-time-derived youth culture.
- `src/football/life.js`, `src/sim/clock.js`: season title, club heritage, reputation and tier transitions.
- Identity is **derived**, not predefined as a hardcoded club strategy.

### Block 5: concrete source
- `src/football/match.js`: bounded chance modifiers from actual tactical and player profiles, with real scorer weights.
- `src/world/foreign.js`: foreign XI selection, league/Europe goalscorers, injuries, morale and player workload.
- `src/club/finance.js`: European income in the correct ledger period.

### Block 6: concrete source
- `src/world/awards.js`: factual events, annual awards, club trends and year records.
- `src/core/bus.js`: bounded persistent real-world wire alongside event history.
- `src/ui/history.js`, `render.js`, `club.js`, `act.js`: live week feed and world archive reachable in UI.

## Highest-priority outstanding engineering issues
1. Verify runtime behavior of the expanded engine. Syntax-valid does not establish working gameplay; inspect for undefined data and lifecycle mistakes.
2. Assess the multi-year domestic economy and foreign transfer volumes. Foreign clubs deliberately have light budgets, not full finance systems.
3. Check international signing and transfer refusal branches do not leave active shortages unfillable.
4. Investigate missing or duplicated goals across transfers, foreign free agents, loans, and player award calculations.
5. Ensure completed old-version cup seasons and V9 migration remain playable through multiple saves.
6. Evaluate whether current world-news density is informative rather than overwhelming on a phone.
7. Verify five domestic divisions, unique IDs, consistent cup draw and complete foreign standings over multiple seeds.
8. Validate HTML build and mobile UX before any 'COMPLETE' or release label.

## Explicitly deferred, not in scope
- Mandatory owner inbox story problems, new agent autonomy layer, dynasty layer and complex individual tactical controls.
- Overly detailed foreign staff/stadium/economy simulation until the light foreign model proves insufficient.
- GitHub main merge and production deployment.

## Verification policy
User requested **code development now, not blocking on builds/tests**. Accordingly, source modifications continue and evidence remains honestly recorded as **untested**. When testing is authorized, run `node build.js`, `tests/run-fast.sh`, `tests/run-all.sh`, save migration checks and a seeded 20-season world simulation, followed by mobile interaction review.

## Hand-off note
Do not restart the six-block analysis or propose cosmetic changes. Read this roadmap and the updated `docs/ARCHITECTURE.md` and `docs/layers/L1-SIMULATION.md`, then work directly on remaining integration gaps. Do not call unfinished blocks COMPLETE.
