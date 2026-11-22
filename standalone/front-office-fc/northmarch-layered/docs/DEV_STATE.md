# DEV_STATE: gedeelde status (GitHub is de waarheid, niet een gesprek)
Beide ontwikkelaars werken dit bestand bij **bij elke afgeronde werksessie**, in dezelfde pull request als de code. CI faalt als het niet is bijgewerkt. Protocol: `docs/DEV_PROTOCOL.md`.

Laatst bijgewerkt: 2026-11-22 (offline weekbrief integratiekandidaat op aparte werkbranch) · door: ChatGPT

## Officiële basis
OFFICIAL_BRANCH: slimline-main
OFFICIAL_SHA: 3bc49924046e549b66bc1b58a6396d5dd3e04b6d
Toelichting: de commit waarop deze status slaat (laatste gemergde officiële tip vóór deze statusupdate). Dit bestand staat in een latere, alleen-documentatie-commit. `scripts/sync-check.sh` controleert dat deze SHA in de geschiedenis van je branch zit.
Basis ontstaan door: `claude/loving-goodall-uv00vn` (alle Slimline-werk van Claude en ChatGPT, 39 commits na Claudes laatste volledige controle) op 2026-11-22 vastgelegd als officiële ontwikkelbasis.

## Artifact (speelbare versie)
ARTIFACT_URL: https://claude.ai/artifact/MsN96ouEWMVwn76jvKr3Qw
ARTIFACT_VERSION: 15
ARTIFACT_SHA: 1234d0e
Status: V15 is de laatst gepubliceerde versie, afkomstig van 1234d0e. De officiële branch bevat sindsdien ook de documentatiemerge a2422c6. Er is geen nieuwe HTML gepubliceerd; elke latere release vereist exacte sync-check.

## Werkgebieden (één ontwikkelaar per gebied tegelijk)
| Ontwikkelaar | Werkbranch | Gebied | Status |
|---|---|---|---|
| Claude | `claude/loving-goodall-uv00vn` | Slimline-kern: werving en scouting, jeugd, windows, clubkoersen, economiebalans; L3 (staf en mandaten) | rust (wacht op de nieuwe basis) |
| ChatGPT | `chatgpt-slimline-world` (aangemaakt vanaf 1234d0e; `chatgpt/slimline-world` kan niet: de branch `chatgpt` bestaat al) | Wereld: vijf divisies, beker, buitenlandse competities, Europa, internationale markt, wedstrijdstatistieken, wereldnieuws, rivaliteiten | actief |
Overlap vermijden: raak je een bestand van het andere gebied (`world/`, `football/market.js`, `core/save.js`), meld het hier onder "Open wijzigingen" voordat je begint.

## Integratiekandidaat (aparte werkbranch, NIET officieel vrijgegeven)
- Branch: `chatgpt-base-weekbrief-offline-20261122` (van `3bc49924046e549b66bc1b58a6396d5dd3e04b6d`). PR #8 blijft Draft; PR #6 is al gemerged.
- Selectief geïntegreerd: feitelijk read-only weekoverzicht met club-ID 0 fix, mobiele 390px-stijlen, UI-hook, modulemanifest, regressietest en testsuite-registratie.
- Standaardbuild blijft L1/L2; L3 uitsluitend opt-in. Geen sim-, markt- of save-engine aangepast.
- Kostenprotocol: `docs/GITHUB_ACTIONS_KOSTENPROTOCOL.md` toegevoegd op deze werkbranch (nog niet gemerged).
- **Lokaal daadwerkelijk getest op het offline-pakket**: 5/5 migratietests, 13/13 briefing-unit-tests, Node syntaxchecks voor beide nieuwe JS-bestanden en Python compile check, alles geslaagd.
- **Niet uitgevoerd op de volledige game**: `node build.js`, `node tests/base-briefing-test.js`, `node tests/base-isolation-test.js`, `node tests/layer-isolation-test.js`, echte mobiele browserplaytest en menselijke speeltest. De werkcontainer heeft geen uitgaande GitHub-netwerktoegang.
- **GitHub Actions**: de werkbranch valt buiten de aangetroffen push-triggers. Geen PR, CI-verzoek, merge of publicatie.
- De laatste speelbare publicatie blijft artifact V15 vanaf `1234d0e`. Zonder verdere tests geen merge/release.

## Open wijzigingen en bekende problemen
- [ ] **Lagen eerst:** fase A = zelfstandig functionerend basisspel (L1+L2); pas daarna L3 autonomie, L4 verhaal en L5 dynasty. Vastgelegd in `docs/LAYER_CONTRACT.md` en `docs/DEV_PROTOCOL.md`.
- [ ] **S3.2 optioneel (behouden):** `src/layers/autonomy/director-accountability.js` en `director-accountability-ui.js` zijn optionele modules, integreren via `src/core/layers.js` met `transferWindowClosed`, `weekClosed`, `saveLoaded` en een UI-slot. `tests/layer-isolation-test.js` controleert dat spel en Football-UI zonder deze S3.2-modules blijven draaien.
- [ ] **S3.1 van de standaardbuild losgemaakt:** de mandaatlimiet, scans, UI, command en save-velden zijn verhuisd naar `layers/autonomy/director-deals*.js`. De kern heeft generieke regels en events; `node build.js` bundelt standaard geen L3. `NORTHMARCH_BUILD_MODE=autonomy node build.js` bundelt beide L3-slices expliciet. Meerjarige baseline-test is toegevoegd; CI en browserplaytest verifiëren voor merge.

- [ ] **Overeengekomen overlap**: ChatGPT bouwt op verzoek eigenaar L3 S3.2 op `chatgpt-slimline-world` (recruitment/clock/UI). Claude werkt in hetzelfde productgebied; eerst PR #6 controleren/integreren vóór parallelle L3-wijzigingen.
- [ ] S3.2: vensterrapporten en betrouwbaarheid per directeur zijn geïmplementeerd en met een regressietest vastgelegd. CI en browserplaytest nog verifiëren. Betrouwbaarheid is een informatieve inschatting van scouting, geen automatisch personeelsverloop (S3.5).

- [ ] Economie: de directeur kan meerdere vrije spelers op dezelfde positie tegelijk tekenen (upgradelus in `squadManager`).
- [ ] Economie: de onderste divisie (4) heeft nauwelijks financiële buffer (mediane cash ±£3–10k in lange simulaties).
- [ ] Wereldkwaliteit zakt langzaam over lange periodes (loonschaal is begrensd op 11,7, het onderliggende verloop niet opgelost).
- [ ] L3 slice 3 en 4 (Sales-/Contracts-mandaat, trainer) gepland; ontwerp `docs/layers/L3-STAFF.md` (geen goedkeuring van losse transfers, besluit D-L3-2).
- [ ] Volgens `docs/SLIMLINE_WORLD_ROADMAP.md` (ChatGPT) is het volledige spel, mobiele UX, het test-harnas en de langetermijneconomie na zijn laatste wijzigingen nog niet door hem uitgevoerd. Nieuwe regressietests (`tests/world-repair-regressions.js`) zijn volgens zijn commit geschreven maar niet uitgevoerd.

## Teststatus (laatst bekende feiten per SHA)
| Wat | SHA | Resultaat | Datum | Door |
| Basisbuild standaard zonder S3.1/S3.2, opt-in L3 build en 3-seizoenen baseline-regressie | f40b092 | **Groen** via GitHub Actions run 45039214254; build + bestaande L3-tests + layer-isolation + base-isolation + 20-season sim, zonder browser | 2026-11-22 | GitHub Actions |
| Mobiele 390px-browser-playtest licht én donker op standaard basisspel-build | 073015b + docs | Extra CI-gate `mobile-browser` toegevoegd; **uitkomst in afwachting**, niet lokaal uitgevoerd | 2026-11-22 | ChatGPT / GitHub Actions |
| S3.2 als optionele modules + isolatietest (build, engine, UI zonder module) | 34ebd53 + docs | CI **in afwachting**; lokaal niet uitgevoerd wegens geen netwerktoegang tot GitHub vanuit werkcontainer | 2026-11-22 | GitHub Actions / ChatGPT |
| S3.2: `node build.js`, snelle engine-suite incl. `l3-s32-test.js` en echte zomer-/winterwindowtest | 27c2d66 | **groen** in GitHub Actions, run 45032149630 (zonder browser) | 2026-11-22 | GitHub Actions |
| S3.2: melding voor langdurig niet gebruikte aankopen | 639b6d9 + docs | **CI in afwachting**; geen lokale build, geen browserplaytest | 2026-11-22 | GitHub Actions / ChatGPT |
|---|---|---|---|---|
| Build, `save-test`, `smoke-test` | ccceb42 | groen | 2026-11-22 | Claude (lokaal) |
| Volledige snelle suite (`tests/run-fast.sh`, incl. browser-playtest licht, 20-seizoenensim) | 717c019 | groen | 2026-11-22 | Claude (lokaal) |
| CI (`build-and-test`, zonder browser) op de officiële basis | ccceb42 (+ docs) | **rood**: build, pyramid-, foreign-world-, save-, ux-, smoke-test groen; `l25-test` faalde op een te kleine steekproef (testfout); `youth-`, `story-`, `slimline-`, `l3-test` en sim niet bereikt | 2026-11-22 | GitHub Actions, runs 1 en 2 |
| `l25-test` na herstel van die check | ccceb42 + testfix | groen (alleen deze test lokaal gedraaid) | 2026-11-22 | Claude |
| CI op pull request 4 (testfix, kop `b82dac5`), daarna gemerged tot `1234d0e` | b82dac5 | **groen** (build en alle snelle engine-tests, zonder browser) | 2026-11-22 | GitHub Actions, run 3 |
| Lange gates (`slimline-test 10`, `policy-test`, volledige playtest licht+donker) | 717c019 (deels eerder) | groen op de toen actuele stand | 2026-11-22 | Claude |
Regel: een resultaat geldt alleen voor de genoemde SHA. Nieuwe SHA = opnieuw vermelden of "niet gedraaid".

## Wijzigingslog (nieuwste bovenaan)
- 2026-11-22 ChatGPT: `mobile-browser` CI-job toegevoegd aan Slimline workflow: installeert Playwright/Chromium en bouwt/doorloopt de standaard L1/L2 standalone HTML op 390px in licht en donker. SHA f40b092 engine+base-isolation CI groen, zie run 45039214254. Browserjob nog niet afgetekend.
- 2026-11-22 ChatGPT: S3.1 volledig uit kern en basale UI gehaald naar `layers/autonomy/director-deals.js` + `director-deals-ui.js`; default `build.js` bundelt alleen L1/L2, autonomie opt-in. Generieke hook/rule/action interfaces; market gebruikt mandaatregel alleen als feature die aanbiedt. `tests/base-isolation-test.js` toegevoegd: 3 volle seizoenen, financiën, standaard transferbeleid, save/load zonder L3; `tests/layer-isolation-test.js` blijft S3.2 vergelijken. Dit is een architectuursprint, geen claim dat gameplay 'leuk' is. CI/browseruitslagen nog te verifiëren. Overlap met Claude-code gerapporteerd in PR #6 en hier.
- 2026-11-22 ChatGPT: op expliciet verzoek eigenaar de bouwvolgorde hersteld: eerst speelbaar basisspel, daarna autonoom L3, L4, L5. S3.2-registratie en -UI verplaatst naar optionele `layers/autonomy` modules met generieke feature-events en optioneel UI-slot; basismodule-isolatietest toegevoegd. S3.1 blijft apart open voor toekomstige refactor. Documentatie en protocol bijgewerkt. PR #6 blijft Draft totdat CI slaagt; geen merge of publicatie.
- 2026-11-22 ChatGPT: S3.2 evidence-based directeurverantwoording (vensters, historische optredens, beoordeling na 8 wedstrijden, identiteit bij stafwisseling, save/load), regressietest toegevoegd op eigen branch en PR #6 als DRAFT. Lokaal build/engine niet uitgevoerd wegens onbereikbare GitHub vanuit container; CI-status volgt. Niet gemerged of gepubliceerd.
- 2026-11-22 Claude: artifact versie 15 gepubliceerd vanaf de officiële tip 1234d0e (sync-check --publish geslaagd); CI-regel van pull request 4 bijgewerkt (groen); branch `chatgpt-slimline-world` vastgelegd. Geen codewijzigingen.
- 2026-11-22 Claude: eerste CI-runs op `slimline-main` rood door een steekproefcheck in `tests/l25-test.js` (3+ kijkmomenten vs 1 bij twee spelers); check vervangen door een deterministische (onzekerheid daalt per kijkmoment) en een steekproefvergelijking vanaf 8 spelers per groep. Pull request naar `slimline-main`.
- 2026-11-22 Claude: `slimline-main` aangemaakt vanaf ccceb42; `scripts/sync-check.sh`, `.github/workflows/slimline-ci.yml`, `docs/DEV_STATE.md`, `docs/DEV_PROTOCOL.md` toegevoegd; testschermafbeeldingen (`tests/shots/`) niet langer gevolgd.
