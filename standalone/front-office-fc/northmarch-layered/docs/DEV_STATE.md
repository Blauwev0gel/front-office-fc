# DEV_STATE: gedeelde status (GitHub is de waarheid, niet een gesprek)
Beide ontwikkelaars werken dit bestand bij **bij elke afgeronde werksessie**, in dezelfde pull request als de code. CI faalt als het niet is bijgewerkt. Protocol: `docs/DEV_PROTOCOL.md`.

Laatst bijgewerkt: 2026-11-24 (V19 teruggebracht in de modulaire bron; balansonderzoek gestart) · door: Claude

## Officiële basis
OFFICIAL_BRANCH: slimline-main
OFFICIAL_SHA: 3bc49924046e549b66bc1b58a6396d5dd3e04b6d
Toelichting: de commit waarop deze status slaat (laatste gemergde officiële tip vóór deze statusupdate). Dit bestand staat in een latere, alleen-documentatie-commit. `scripts/sync-check.sh` controleert dat deze SHA in de geschiedenis van je branch zit.
Basis ontstaan door: `claude/loving-goodall-uv00vn` (alle Slimline-werk van Claude en ChatGPT, 39 commits na Claudes laatste volledige controle) op 2026-11-22 vastgelegd als officiële ontwikkelbasis.

## Artifact en preview (speelbare versies)
Regel: `src/` is de bron van waarheid, `build.js` genereert de HTML, `dist/` is gegenereerd en wordt **niet meer door Git gevolgd** (staat in `.gitignore`). Een speelbare versie heeft altijd een bron-commit, een buildvariant en een checksum.

| | Artifact V16 | Preview in Git |
|---|---|---|
| Waar | https://claude.ai/artifact/MsN96ouEWMVwn76jvKr3Qw | `preview/northmarch-slimline.html` op `claude/loving-goodall-uv00vn` |
| Bron-commit | `02d2eaa` | `d7d705c` (officiële tip na pull request 9) |
| Buildvariant | basis (L1/L2), standaard `node build.js` | basis (L1/L2), standaard `node build.js` |
| SHA-256 | niet bewaard; gelijk aan de preview (zie onder) | `3e029ee71f0c38ab952dd9920d4d5969a4a77b50aa6c7aeac0c01218049ca781` |
| Gepubliceerd | 2026-11-22, op verzoek van de eigenaar vóór de merge (dus niet via `sync-check --publish`) | 2026-11-22 |
ARTIFACT_URL: https://claude.ai/artifact/MsN96ouEWMVwn76jvKr3Qw
ARTIFACT_VERSION: 16
ARTIFACT_SHA: 02d2eaa
Gelijkheid: een verse build van `02d2eaa` en van `d7d705c` geeft dezelfde checksum (`3e029ee71f0c38ab…`) en onder `src/` en `build.js` verschilt geen enkel bestand. De spelcode van V16 en van de preview is dus identiek. De bytes van V16 zelf zijn niet bewaard: de gelijkheid volgt uit de deterministische build, niet uit een meting van het gepubliceerde bestand. De eerdere stand `1234d0e` / V15 is vervangen.
Het eerder opgeslagen `dist/northmarch-layered.html` was verouderd (zonder weekoverzicht, mét L3) en is daarom uit Git gehaald.

## V19 teruggebracht in slimline-main (lokaal voorbereid, NIET gepusht, geen pull request)
Besluit eigenaar: één centrale ontwikkelbranch (`slimline-main`); de publicatiebranch alleen voor gevalideerde versies. Details en bewijs: `docs/V19_PORT.md`.
- V19 bleek een superset van `slimline-main`: 24 engineonderdelen gewijzigd en 6 economiefuncties nieuw (kosten per niveau, fysiek v. operating level, wervingswaarde), 8 UI-lagen en de Upgrades-tab, 476 CSS-regels, een testbalk. Alles staat nu als module in `src/` (zie de tabel in `docs/V19_PORT.md`).
- **Bewijs:** het script van de build bevat precies dezelfde 4.554 regels als V19 (0 verschil). Dezelfde seed, twee seizoenen: de volledige opgeslagen staat is identiek (SHA over 4,58 miljoen tekens). `department-ownership-test`, `v19-smoke-test` (20 seizoenen) en de nieuwe `playtest.js` (390 px, licht en donker) slagen.
- **Rood, en dat is de economie van V19 zelf, niet de port:** `tests/sim-test.js` faalt op de gezondheidsgrenzen: 39 administraties (grens 33) en 163 weggestemde voorzitters (grens 133). Vóór de port zat `slimline-main` op 14–21 administraties en 71–86 weggestemd. Per divisie: boven ruim voldoende geld (divisie 0 groeit naar £1,6M), maar de mediane club in divisie 3 en 4 heeft £1–15k cash (was £10–40k). De sim duurt ook ±110 s tegenover ±40 s.
- Gevolg: **deze port mag niet naar `slimline-main` zolang de snelle suite rood is.** De balansfix is de volgende stap; zie "Balans".
- Correctie op een eerdere bewering: de regel over de transferreserve in `V19_BALANCE_HANDOVER.md` klopt (hij beschrijft `budgetFor`: max(6 weken loon, 6 weken terugkerende uitgaven)); de functie `reserveK` is een andere.

## Balans (gestart, lokaal)
- Onderzoeksgereedschap: `tests/balance-roi.js` (gepaarde werelden, één afdeling op niveau 1 of 5). Eerste meting op de oude economie van `slimline-main` (3 divisies, 3 seeds, 5 seizoenen) staat in de scratchpad; uitwerking volgt.
- Vaststellingen tot nu toe: afdelingsstaf kost ±1% van het inkomen per niveau en levert veel op (geen echte keuze); bovenin stapelt geld zich op zonder bestemming; onderin is de buffer te dun.

## Werkgebieden (één ontwikkelaar per gebied tegelijk)
| Ontwikkelaar | Werkbranch | Gebied | Status |
|---|---|---|---|
| Claude | `claude/loving-goodall-uv00vn` | Slimline-kern: werving en scouting, jeugd, windows, clubkoersen, economiebalans; L3 (staf en mandaten) | rust (wacht op de nieuwe basis) |
| ChatGPT | `chatgpt-slimline-world` (aangemaakt vanaf 1234d0e; `chatgpt/slimline-world` kan niet: de branch `chatgpt` bestaat al) | Wereld: vijf divisies, beker, buitenlandse competities, Europa, internationale markt, wedstrijdstatistieken, wereldnieuws, rivaliteiten | actief |
Overlap vermijden: raak je een bestand van het andere gebied (`world/`, `football/market.js`, `core/save.js`), meld het hier onder "Open wijzigingen" voordat je begint.

## Basisspel V1: weekoverzicht (commit 02d2eaa, in deze pull request naar slimline-main)
- Branch: `chatgpt-base-weekbrief-offline-20261122` (van `3bc49924046e549b66bc1b58a6396d5dd3e04b6d`). PR #8 blijft Draft; PR #6 is al gemerged.
- Selectief geïntegreerd: feitelijk read-only weekoverzicht met club-ID 0 fix, mobiele 390px-stijlen, UI-hook, modulemanifest, regressietest en testsuite-registratie.
- Standaardbuild blijft L1/L2; L3 uitsluitend opt-in. Geen sim-, markt- of save-engine aangepast.
- Kostenprotocol: `docs/GITHUB_ACTIONS_KOSTENPROTOCOL.md` is toegevoegd en komt met deze pull request op `slimline-main`.
- **Lokaal daadwerkelijk getest op het offline-pakket**: 5/5 migratietests, 13/13 briefing-unit-tests, Node syntaxchecks voor beide nieuwe JS-bestanden en Python compile check, alles geslaagd.
- **Lokaal getest door Claude op `02d2eaa` (22 nov, in een aparte worktree)**: `node build.js` (40 basismodules), `base-briefing-test`, `base-isolation-test`, `layer-isolation-test`: alle groen. Browsercontrole op 390 px, licht en donker: 3 statistieken, 1 actie (52 px, leidt naar het budgetscherm), uitslag en nettoresultaat kloppen met de engine, geen horizontale scroll, geen scriptfouten, opnieuw renderen verandert de wereld niet. Ook de build mét optionele L3-modules: overzicht werkt, een seizoensovergang slaagt.
- **Niet uitgevoerd**: volledige snelle suite, 20-seizoenensim, menselijke speeltest. Club-ID 0 (numeriek) kon niet end-to-end worden geprobeerd: de club-ID's in deze engine zijn tekst (`pell`, `c5`); alleen de guard `S.my==null` is gelezen.
- **GitHub Actions**: de branch `chatgpt-base-weekbrief-offline-20261122` heeft zelf geen run gestart (geen enkele run gevonden). De CI draait nu voor het eerst op deze pull request, met toestemming van de eigenaar.
- Kostenprotocol: `docs/GITHUB_ACTIONS_KOSTENPROTOCOL.md` is leidend bij botsende instructies. Deze pull request is een bewuste, door de eigenaar toegestane CI-run.

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
| Basisspel V1: build (40 basismodules), `base-briefing-`, `base-isolation-`, `layer-isolation-test`, 390 px browsercheck licht+donker, L3-variant | 02d2eaa | groen (gerichte tests, lokaal) | 2026-11-22 | Claude |
| Port van V19: build (49 modules), base-briefing-, base-isolation-, layer-isolation-, smoke-, save-, ux-, l25-, youth-, story-, l3-, pyramid-, foreign-world-, department-ownership-test | lokaal, na port op `slimline-main` 13bebbb | groen | 2026-11-24 | Claude |
| `v19-smoke-test` (20 seizoenen) en nieuwe `playtest.js` (390 px, licht+donker) | idem | groen | 2026-11-24 | Claude |
| `sim-test` (20 seizoenen, 80 clubs) na de port | idem | **rood**: 39 administraties (grens 33), 163 weggestemd (grens 133); economie van V19 zelf | 2026-11-24 | Claude |
| CI op de pull request met `02d2eaa` en deze statuscorrectie | | in afwachting | | GitHub Actions |
| CI op pull request 4 (testfix, kop `b82dac5`), daarna gemerged tot `1234d0e` | b82dac5 | **groen** (build en alle snelle engine-tests, zonder browser) | 2026-11-22 | GitHub Actions, run 3 |
| Lange gates (`slimline-test 10`, `policy-test`, volledige playtest licht+donker) | 717c019 (deels eerder) | groen op de toen actuele stand | 2026-11-22 | Claude |
Regel: een resultaat geldt alleen voor de genoemde SHA. Nieuwe SHA = opnieuw vermelden of "niet gedraaid".

## Wijzigingslog (nieuwste bovenaan)
- 2026-11-24 Claude: V19 teruggebracht in de modulaire bron (lokaal, niet gepusht); `tests/playtest.js` herschreven voor de V19-flow; `department-ownership-test` in de snelle suite; `tests/v19-smoke-test.js` en `tests/balance-roi.js` toegevoegd; bevinding: de economie van V19 laat de sim-test falen (administraties en weggestemde voorzitters boven de grens), balansfix volgt. `docs/V19_PORT.md` beschrijft de overzetting.
- 2026-11-22 Claude: distributie opgeschoond: `dist/` in `.gitignore` en met `git rm --cached` uit Git gehaald (lokale bestanden blijven); herkomst van artifact V16 (bron `02d2eaa`) en de preview (bron `d7d705c`, zelfde checksum) vastgelegd met buildvariant en SHA-256; `preview/README.md` en `docs/DEV_PROTOCOL.md` bijgewerkt. Alleen lokaal voorbereid en getest; nog niet gepusht, geen pull request, geen CI.
- 2026-11-22 Claude: weekoverzicht (`02d2eaa`, ChatGPT) lokaal getest en samen met deze statuscorrectie aangeboden als pull request naar `slimline-main`; artifact V16 gepubliceerd op de eigen link; geen workflows gewijzigd.
- 2026-11-22 ChatGPT: `mobile-browser` CI-job toegevoegd aan Slimline workflow: installeert Playwright/Chromium en bouwt/doorloopt de standaard L1/L2 standalone HTML op 390px in licht en donker. SHA f40b092 engine+base-isolation CI groen, zie run 45039214254. Browserjob nog niet afgetekend.
- 2026-11-22 ChatGPT: S3.1 volledig uit kern en basale UI gehaald naar `layers/autonomy/director-deals.js` + `director-deals-ui.js`; default `build.js` bundelt alleen L1/L2, autonomie opt-in. Generieke hook/rule/action interfaces; market gebruikt mandaatregel alleen als feature die aanbiedt. `tests/base-isolation-test.js` toegevoegd: 3 volle seizoenen, financiën, standaard transferbeleid, save/load zonder L3; `tests/layer-isolation-test.js` blijft S3.2 vergelijken. Dit is een architectuursprint, geen claim dat gameplay 'leuk' is. CI/browseruitslagen nog te verifiëren. Overlap met Claude-code gerapporteerd in PR #6 en hier.
- 2026-11-22 ChatGPT: op expliciet verzoek eigenaar de bouwvolgorde hersteld: eerst speelbaar basisspel, daarna autonoom L3, L4, L5. S3.2-registratie en -UI verplaatst naar optionele `layers/autonomy` modules met generieke feature-events en optioneel UI-slot; basismodule-isolatietest toegevoegd. S3.1 blijft apart open voor toekomstige refactor. Documentatie en protocol bijgewerkt. PR #6 blijft Draft totdat CI slaagt; geen merge of publicatie.
- 2026-11-22 ChatGPT: S3.2 evidence-based directeurverantwoording (vensters, historische optredens, beoordeling na 8 wedstrijden, identiteit bij stafwisseling, save/load), regressietest toegevoegd op eigen branch en PR #6 als DRAFT. Lokaal build/engine niet uitgevoerd wegens onbereikbare GitHub vanuit container; CI-status volgt. Niet gemerged of gepubliceerd.
- 2026-11-22 Claude: artifact versie 15 gepubliceerd vanaf de officiële tip 1234d0e (sync-check --publish geslaagd); CI-regel van pull request 4 bijgewerkt (groen); branch `chatgpt-slimline-world` vastgelegd. Geen codewijzigingen.
- 2026-11-22 Claude: eerste CI-runs op `slimline-main` rood door een steekproefcheck in `tests/l25-test.js` (3+ kijkmomenten vs 1 bij twee spelers); check vervangen door een deterministische (onzekerheid daalt per kijkmoment) en een steekproefvergelijking vanaf 8 spelers per groep. Pull request naar `slimline-main`.
- 2026-11-22 Claude: `slimline-main` aangemaakt vanaf ccceb42; `scripts/sync-check.sh`, `.github/workflows/slimline-ci.yml`, `docs/DEV_STATE.md`, `docs/DEV_PROTOCOL.md` toegevoegd; testschermafbeeldingen (`tests/shots/`) niet langer gevolgd.
- 2026-11-24 Claude: eenvoudig proces. Eén ontwikkelbranch `slimline-main`; `/northmarch/` (Pages) bouwt daaruit; CI draait alleen nog op pull requests (build + snelle suite), de browser-playtest is een handmatige knop (workflow_dispatch). Balance update 1 (`FAC_SCALE`) staat erin, ongetest door Claude; ChatGPT test volgens `docs/BALANCE_UPDATE_1.md`.
- 2026-11-24 Claude: UX stap 1. Nieuwe schil `ui/game.js` + `style/game.css`: weekscherm (status, volgende wedstrijd, max. 3 beslissingen, vorige uitslag), Play → full time (uitslag, tabelpositie, weeksaldo, clubnieuws) → Next week; vier tabs onderin (Week · Squad · Club · Table); testbalk ingeklapt en Engels. Alleen presentatie, geen nieuwe state. Stap 2: Squad/Club/Table indelen, seizoenseinde, oude V17–V18.7-lagen opruimen.
- 2026-11-24 Claude: live link werkte niet automatisch (push-workflows lopen vanaf het bestand op de gepushte branch). `publish-trigger.yml` op slimline-main start nu bij elke push `pages.yml` op main; de verouderde kopie van pages.yml op slimline-main is verwijderd.
- 2026-11-24 Claude: UX stap 2. Club-tab is één overzicht (geld, 8 afdelingen als tegels, 5 vaste links); seizoenseinde opent met een rapport (uitslag, punten, geld, ledenstem, doelen) en één knop, de volledige review ingeklapt eronder. Squad en Table ongewijzigd (waren al helder). Oude V17–V18.7-lagen nog niet opgeruimd (onzichtbaar voor de speler, apart te doen).
- 2026-11-24 Claude: UX stap 3 (duidelijkheid). Pre-season-kaart op het weekscherm: wat pre-season is, wat de selectie nodig heeft, wie gescout wordt (schatting ± twijfel), budget, looplimiet en wervingsstrategie. Full time toont de transfers van die week (IN/OUT/LET GO). Afdelingstegels zeggen wat elke afdeling doet en dat er drie knoppen zijn (staf, budget, focus). Opgemerkt, niet aangepast: scouts volgen soms spelers ver onder het selectieniveau (bv. 8,4 bij gemiddelde 12,2).
- 2026-11-24 Claude: scouting-regel aangepast: scouts volgen alleen spelers vanaf selectiespelerniveau (`squadQuality − 1,5`), voor vrije spelers, binnenlandse en buitenlandse clubs. l25-test groen.
