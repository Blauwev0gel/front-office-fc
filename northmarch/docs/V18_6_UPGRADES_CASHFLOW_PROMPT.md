# Northmarch V18.6 — Club Upgrades & Cashflow

Build a fun Layer-1 owner progression interface using the existing economy, project catalog, and match engine. No fictional upgrade effects, no extra currencies, no autonomous-staff layer.

**Player loop:** read club finances -> choose one of several concrete investment routes -> see real cost, build duration and benefit mechanism -> approve through existing StartProject command -> play matches -> see completed works and weekly financial consequences -> reinvest.

**UI:**
- Mobile home includes an immediately readable club cashflow panel: actual season-to-date income, expenses, construction spend, net result, cash balance, debt and projected liquidity low. Clearly label actual vs projection; never present forecasts as guarantees.
- Upgrades page has a curated set of clear options: training, medical, academy, scouting, commercial, clubhouse, catering, stadium access, pitch, and stands. Use real projectCatalog entries, including build-new and upgrade-existing. Expose only what exists and is currently available.
- Each option explains **what changes in the engine**, cost, construction weeks, and condition (e.g. capacity capped by access/safety). Include a reserve warning and weekly construction instalment estimate; keep existing confirmation flow.
- Preserve full catalog for advanced players, navigation, saves, old engine and weekly newspaper.

**Validation:**
- Assemble the manifest, test syntax and rendering, verify all cards have real project keys and commands, test one completed upgrade and financial ledger, and run ten seasons if runtime allows.
- Do not claim balanced progression based on one seed. No CI exploration. One controlled publish only after tests.
- Deliver code, prompt and concise limitations in GitHub.
