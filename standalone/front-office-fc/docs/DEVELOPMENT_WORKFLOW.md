# Development Workflow

## Before coding
1. Read [Current State](CURRENT_STATE.md), [Game Bible](GAME_BIBLE.md), [Architecture](ARCHITECTURE.md), [Decisions](DECISIONS.md).
2. Inspect the exact current HTML release and existing tests.
3. State the player problem, one coherent module scope, acceptance criteria and regressions.

## During development
4. Keep a last-playable immutable fallback.
5. Implement engine, UI and state coherently; avoid decorative features.
6. Test game start, navigation, staff, match, saves, season progression and small mobile screens.
7. Distinguish automated tests, manual browser checks and unverified assumptions.

## Release
8. Promote only a tested standalone HTML; otherwise keep the prior release current.
9. Update `CURRENT_STATE.md`, `DEVELOPMENT_HISTORY.md`, `BACKLOG.md` and `releases/manifest.json`; update other docs when their content changes.
10. Record exact file, commit, test evidence, limitations and next milestone.

## Git safety
- Only work on a **new isolated branch** until explicitly authorised otherwise.
- Add files under `standalone/front-office-fc/`; never overwrite existing files or touch original game branches.
- Do not merge, open PRs, modify workflows or deploy without approval.
- Before push, verify all changes are add-only in the allowed directory.
