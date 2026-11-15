# The Front Office

A mobile football CEO game. You run the club from the boardroom: you hire the heads of department, set their mandates and answer what lands in your red box. You never pick the team.

The whole game is one HTML file with vanilla JavaScript.

**Play it live:** https://blauwev0gel.github.io/front-office-fc/

The live site is GitHub Pages, served from `docs/` on `main`. Or open `docs/index.html` in a browser.

## Structure

| Path | What it is |
|---|---|
| `src/` | The source. `engine.js` is the pure game logic (no DOM, runs in Node). The other modules add events, departments, the weekly loop, dossiers, the pathway storyline and match day. `ui.js`, `faces.js` and `style.css` are the interface. |
| `build.py` | Joins the source files in order into one page: `dist/index.html`. |
| `docs/index.html` | The current playable build, served live by GitHub Pages. |
| `test/*.js` | Headless tests in Node: simulation, saves, dismissal, pathway, match day and the Gazette. |
| `test/browser/` | Browser playtests with Playwright and Chrome. |
| `tools/auditlib.js` | Balance audit helper that plays seasons with different CEO styles. |
| `design/` | Playable design prototypes: the inbox and match day. |

## Build and test

```sh
python3 build.py                 # writes dist/index.html
node test/matchday.js            # stories, outcomes, turning points
node test/gazette.js             # one edition per week, archive, old saves
node test/sack.js                # dismissal is final
node test/pathway.js             # the youth pathway storyline
python3 test/browser/playtest.py # a run of weeks with real clicks (needs Playwright and Chrome)
```

To release: build, run the tests, then copy `dist/index.html` to `docs/index.html` and push to `main`. The live site updates within a minute or two.

## Ground rules

- No real players, clubs or brands.
- Saves keep working across versions; new state is added with a migration or a safe default.
- Mobile first at 390 px, light and dark, tap targets of at least 44 px, contrast at WCAG AA.
- Interface text in English, at most two sentences per block.
