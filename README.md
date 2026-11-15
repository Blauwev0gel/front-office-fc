# The Front Office

A mobile football CEO game. You run the club from the boardroom: you hire the heads of department, set their mandates and answer what lands in your red box. You never pick the team.

The whole game is one HTML file with vanilla JavaScript.

**Play it live:** https://blauwev0gel.github.io/front-office-fc/

The live site is published by GitHub Actions from the source on three branches:

| Branch | Play | Who works here |
|---|---|---|
| `main` | https://blauwev0gel.github.io/front-office-fc/ | Shared release |
| `chatgpt` | https://blauwev0gel.github.io/front-office-fc/chatgpt/ | Codex / ChatGPT |
| `claude-game` | https://blauwev0gel.github.io/front-office-fc/claude/ | Claude |

Each push rebuilds all three branches and publishes them together. Wait for
**Publish game versions** in Actions to finish, then refresh the relevant link.
The previews have separate browser saves; the main version keeps its existing
save key. The two preview links start without importing the main save.
Use separate local checkouts or worktrees for simultaneous work.
You can also build locally and open `dist/index.html` in a browser.

## Structure

| Path | What it is |
|---|---|
| `src/` | The source. `engine/` is the pure game logic (no DOM, runs in Node). The other modules add events, departments, the weekly loop, dossiers, the pathway storyline and match day. `ui/`, `faces.js` and `style/` are the interface. A folder holds the numbered parts of one module; `build.py` joins them in order. |
| `CODEMAP.md` | Which files and functions belong to which system. Start here. |
| `build.py` | Joins the source files in order into one page: `dist/index.html`. |
| `docs/index.html` | Legacy playable snapshot; live deployment now builds from `src/`. |
| `.github/workflows/pages.yml` | Builds and publishes all three branch versions. |
| `test/*.js` | Headless tests in Node: simulation, saves, dismissal, pathway, match day and the Gazette. |
| `test/browser/` | Browser playtests with Playwright and Chrome. |
| `tools/auditlib.js` | Balance audit helper that plays seasons with different CEO styles. |
| `tools/codemap.js` | Regenerates the file tables in `CODEMAP.md`. |
| `design/` | Playable design prototypes: the inbox and match day. |

## Build and test

```sh
python3 build.py                 # writes dist/index.html
node test/matchday.js            # stories, outcomes, turning points
node test/gazette.js             # one edition per week, archive, old saves
node test/sack.js                # dismissal is final
node test/pathway.js             # the youth pathway storyline
python3 test/browser/playtest.py # a run of weeks with real clicks (needs Playwright and Chrome)
node test/browser/mail.cjs       # reply flow, immediate saves, keyboard and mobile layouts (needs Playwright)
```

For the mail browser test, set `TEST_BROWSER` to your Chrome executable if
Playwright's bundled Chromium is not installed. Set `MAIL_SCREENSHOTS` to an
output directory to save the mobile and desktop screenshots.

To preview: build, run the relevant tests, and push to your assigned branch.
To release: merge the approved changes into `main`. GitHub Actions publishes
the new main version and preserves both previews. No manual HTML copy is needed.

## Ground rules

- No real players, clubs or brands.
- Saves keep working across versions; new state is added with a migration or a safe default.
- Mobile first at 390 px, light and dark, tap targets of at least 44 px, contrast at WCAG AA.
- Interface text in English, at most two sentences per block.
