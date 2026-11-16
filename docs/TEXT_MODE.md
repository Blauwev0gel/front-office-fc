# The Front Office — text-only development build

**Branch:** `chatgpt`  
**Preview after GitHub Pages publishes:** https://blauwev0gel.github.io/front-office-fc/chatgpt/  
**Shared release:** `main` is unchanged.

## Purpose

This branch deliberately removes visual dressing so we can test the **CEO loop and underlying systems** rather than polish illustrations. This is a presentation experiment, **not** a fork of the game mechanics. Do not replace the established engines or rewrite BIBLE.md to justify presentation changes.

The following remain driven by the original `FO` object, seeded random generator, persistent save format and `data-a` action router:

- Club founding, DNA selection, staff hiring, mandates and authority.
- Transfer summer: DoF meeting, plan, ticker, decisions, deadline day, Gazette, evaluation.
- Inbox, Red Box, staff messages, dossiers, briefings, proposals and project decisions.
- Weekly decisions, match preview, commentary, skip, post-match Gazette.
- Scouting, youth, recruitment, finance, departments, squad and league.
- Season changes, review, dismissal, careers, save/load and auto-save.

## Implementation

- `src/ui/00-text-mode.js` substitutes empty icon/portrait drawings and audio cues; it does not touch engine state. It guards against the test harness loading the UI prefix without `faces.js`.
- `src/style/zz-text-only.css` is automatically appended after the numbered style fragments by `build.py`. It removes gradients, colored ornament, animation and illustration; keeps readable text buttons, input controls, navigation and overlays.
- `src/ui/01-core.js` renders the club abbreviation, star ratings, gauges and action counts as text rather than drawn shapes.
- `src/ui/02-setup.js` has no title illustration; color swatch choices retain visible labels via `aria-label` in the renderer.
- `src/ui/04-masthead-news.js` removes the disabled sound toggle.
- `src/ui/08-departments.js` renders numeric trend summaries rather than sparklines.
- `src/ui/13-redbox-render.js` makes icon-only buttons readable, and backer support visible numerically.
- `src/ui/14-matchday-gazette.js` shows commentary from **existing match-engine events**, not moving players/ball. It keeps match controls and full-time/Gazette phases.

**Important:** Hiding a graph is not allowed to hide its information. When relevant, provide the data as numbers or descriptive text.

## Build and verification

```sh
python3 build.py
node test/preview-save.js
node test/text-mode.js
node test/matchday.js
node test/gazette.js
node test/squad-plan.js
node test/sack.js
node test/pathway.js
node test/browser/mail.cjs
node test/browser/text-mode.cjs
```

The last two browser tests require Playwright/Chrome. Existing headless tests also cover other engine systems. Source-level checks are **not** a substitute for real mobile/browser playthroughs.

**Release gate:** Do not claim feature parity until a full founding run, the five-stage summer, regular weekly play, staff/department controls, a match, Gazette, season transition and reload have been exercised in a browser. Leave `main` visual unless the user explicitly requests otherwise.
