# Northmarch V18.4-R — architecture refactor

The V18.4 release has been split **without modifying the original CSS or JavaScript**. The game is still delivered as one standalone HTML file.

- `src/template.html` contains the original document with CSS/JS insertion markers.
- `src/style.css` is the original CSS.
- `src/core/`, `world/`, `football/`, `club/`, `sim/`, `ui/` are the original 40 code sections, preserved in source order.
- `manifest.json` is the explicit ordered list. Modules share one classic JavaScript scope; they are not ES modules.
- `build.py` assembles the standalone game into `dist/index.html`.
- `test/smoke.js` checks assembly, JavaScript syntax, a real construction order and 20 seasons.
- `releases/northmarch/v18.4.html` is the unchanged rollback/reference.

Run locally: `python3 northmarch/build.py && node northmarch/test/smoke.js`.

Only change the relevant source file, not the generated HTML. This is a behavior-preserving extraction, not full dependency isolation. The shared globals remain. GitHub Pages still builds other branches; separate CI optimization would be needed to reduce that cost.
