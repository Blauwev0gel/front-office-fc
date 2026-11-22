# Slimline — World development roadmap
Updated 2026-11-22. Branch: `claude/loving-goodall-uv00vn`.

## Non-negotiable scope
Build the football simulation first. No owner-story, staff conversation or dynasty layers. All mechanics must have observable downstream consequences. Do not claim tests passed unless run.

## Block status
| Block | Status | Release gate |
|---|---|---|
| 1. World and competition integrity | IMPLEMENTING | 5×16 Northmarch, 6 foreign countries, coherent domestic cup, real calendar-based Europe, save migration, deterministic 20-season simulations |
| 2. International player market | IMPLEMENTING | Persistent foreign squads, player movement, transfers affect club strength and finances |
| 3. Player careers | IMPLEMENTING | Development and career history persist across clubs/seasons |
| 4. Club evolution | IMPLEMENTING | Results alter resources, reputation, youth and long-term outcomes |
| 5. Match simulation | IMPLEMENTING | Tested plausible score distributions, squad availability and tactical identities |
| 6. World presentation | IMPLEMENTING | All news and histories trace to real events |

## Block 1 audit (source inspection; not a successful test run)
- Domestic league uses five tiers, 16 teams each and a 30-week fixture generator. The national cup uses a 32-club preliminary round followed by 48 additional clubs.
- Foreign clubs are stored separately in `S.foreign`, protecting domestic cash/staff loops.
- **Critical:** foreign leagues and the European cup are resolved in a single call at `closeSeason()`. They are NOT integrated with the weekly clock. This is not a finished European competition system.
- **Critical:** the international market has no foreign squads, so Europe cannot yet share domestic player availability or transfer effects.
- **Critical:** no actual local or CI tests have been observed since the five-tier migration. Existing test scripts contain assumptions from three-tier Northmarch and must be audited before declaring compatibility.
- **Critical:** historical save migration 7→8 initializes a new foreign world after load; it does not reconstruct past foreign history. This must be documented as a new subsystem introduced at the upgrade point.
- The Northmarch club names are generated from a finite pool; check uniqueness and league size under multiple seeds.
- The 80-team national cup should be validated for exactly 79 matches, 7 rounds and one winner.

## Required verification commands
```sh
cd standalone/front-office-fc/northmarch-layered
node build.js
node tests/pyramid-test.js
node tests/foreign-world-test.js
sh tests/run-fast.sh
sh tests/run-all.sh
node tests/slimline-test.js 20 101 202 303
```
Report command output and seed-specific failures. Do not merge/deploy without permission.

## Implementation sequence for Block 1
1. Repair immediate deterministic failures in five-tier initialization, national cup and foreign results.
2. Model foreign league fixtures and European qualification at season start; schedule results through `advanceWeek()`, not at season close.
3. Ensure continental matches affect player fitness, injuries, stats and financial ledger for Northmarch participants without double-booking.
4. Introduce fixture conflict rules and verify the week calendar.
5. Add deterministic save/reload continuation, 20-season invariants, benchmark and mobile smoke test.
6. Build `dist/northmarch-layered.html`, only then mark Block 1 COMPLETE.

## Evidence log
- 2026-11-22: Source files inspected through GitHub connector; container cannot reach github.com (DNS resolution failed), so Node build and test execution have **not** occurred. Status remains AUDIT.

- 2026-11-22: Weekly foreign fixture schedules, league tables and four-week European knockout integrated into `advanceWeek()`; domestic European participants receive minutes, injury exposure and ledger income. Source committed; tests/build deliberately deferred at user request. Remaining: migration of in-progress older saves, calendar and qualification edge cases, presentation, validation.

- 2026-11-22: Fixed European player accounting: continental appearances now use `eApps` rather than inflating league/career appearance fields; `europeLoad` carries fatigue into the following matchweek, where squad selection and quality already read `tired`. Commits `7ef3a5c`, `47e07a5`. Added `current.startedAt` to distinguish new calendars from schedules reconstructed for legacy mid-season saves. No tests or build run at user's explicit request. Block 1 remains IMPLEMENTING.

## Development batch — 2026-11-22 (source changes, untested by request)
- Block 2: `foreign.js` now persists foreign squads with actual player IDs, adds foreign-to-Northmarch, Northmarch-to-foreign and foreign-to-foreign transfers, transfers cash through the domestic ledger, and keeps a bounded market log. Foreign players age, develop and are replenished. Integrated into `newWorld`, summer window and deserialization. Commits `d0c8660`, `6be88fa`, `895e1d6`, `f82b17b`, `8b264a7`, `6349e7d`.
- Block 3: Individual player growth paths (early/steady/late/volatile), peak age, structured season and move histories; commits `9fc6636`, `ce2f056`.
- Block 4: Persistent club heritage (top-division titles, cups, promotions, relegations, best tier, recent competitive streak), multi-season reputation effects; commits `858ef2a`, `d815496`.
- Critical limitations: no build/tests performed; domestic scouting pool does not yet deliberately search foreign squads; international transfer negotiation is simplified; foreign players do not yet play detailed simulated match minutes; midseason legacy-save international results may not be reconstructed. Blocks remain IMPLEMENTING, not COMPLETE. Blocks 5 and 6 not started.

- Block 5: coach-style matchup now changes chance creation (bounded modifiers), while existing coach strength and Poisson goals remain authoritative. Commit `f9fb02a`.
- Block 6: world archive now renders six foreign league tables, current and historical European results, and recent international transfer events; title text updated to five divisions. Commits `656a512`, `1c24d42`.
- Finance: European competition income now has an explicit media ledger category (`661520a`).
- **Status:** all six blocks have source-code work underway, **none is COMPLETE**. Tests/build intentionally not executed. Major outstanding work: full save migration and mid-season foreign calendar recovery; foreign transfer scouting/negotiation; rich individual European match events and statistics; economic balancing; multi-season simulation verification; better world discovery/navigation and player-profile history rendering.
