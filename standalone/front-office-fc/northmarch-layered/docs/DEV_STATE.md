# DEV_STATE: gedeelde status (GitHub is de waarheid, niet een gesprek)
Beide ontwikkelaars werken dit bestand bij **bij elke afgeronde werksessie**, in dezelfde pull request als de code. CI faalt als het niet is bijgewerkt. Protocol: `docs/DEV_PROTOCOL.md`.

Laatst bijgewerkt: 2026-11-22 (Basisspel V1, onafhankelijke PR) · door: ChatGPT

## Officiële basis
OFFICIAL_BRANCH: slimline-main
OFFICIAL_SHA: a2422c6
Toelichting: de commit waarop deze status slaat (laatste gemergde officiële tip vóór deze statusupdate). Dit bestand staat in een latere, alleen-documentatie-commit. `scripts/sync-check.sh` controleert dat deze SHA in de geschiedenis van je branch zit.
Basis ontstaan door: `claude/loving-goodall-uv00vn` (alle Slimline-werk van Claude en ChatGPT, 39 commits na Claudes laatste volledige controle) op 2026-11-22 vastgelegd als officiële ontwikkelbasis.

## Artifact (speelbare versie)
ARTIFACT_URL: https://claude.ai/artifact/MsN96ouEWMVwn76jvKr3Qw
ARTIFACT_VERSION: 15
ARTIFACT_SHA: 1234d0e
Status: actueel (gelijk aan de officiële tip op het moment van publiceren, gepubliceerd na `scripts/sync-check.sh --publish`). Elke nieuwe officiële commit maakt hem verouderd: publiceer opnieuw vanaf de officiële tip en werk deze regels bij.

## Werkgebieden (één ontwikkelaar per gebied tegelijk)
| Ontwikkelaar | Werkbranch | Gebied | Status |
|---|---|---|---|
| Claude | `claude/loving-goodall-uv00vn` | Slimline-kern: werving en scouting, jeugd, windows, clubkoersen, economiebalans; L3 (staf en mandaten) | rust (wacht op de nieuwe basis) |
| ChatGPT | `chatgpt-slimline-world` (aangemaakt vanaf 1234d0e; `chatgpt/slimline-world` kan niet: de branch `chatgpt` bestaat al) | Wereld: vijf divisies, beker, buitenlandse competities, Europa, internationale markt, wedstrijdstatistieken, wereldnieuws, rivaliteiten | actief |
| ChatGPT — Basisspel V1 | `chatgpt-basisspel-v1` (vanaf officiële a2422c6) | UI-weekcyclus, feitelijke bestuursbesluiten en spelbaarheidsacceptatie; **geen wijzigingen aan L3, kern-/marktlogica of Claudes branch** | actief; eigen PR |
Overlap vermijden: raak je een bestand van het andere gebied (`world/`, `football/market.js`, `core/save.js`), meld het hier onder "Open wijzigingen" voordat je begint.

## Open wijzigingen en bekende problemen
- [ ] **Basisspel V1, issue #7:** eerste werkende wekelijkse briefing in `src/ui/week-brief.js`, geen verplicht beslismoment of simulatieaanpassing. Weekoverzicht toont echte kas, stand, laatste weekresultaat, gesorteerde aandachtspunten met echte navigatie, en observatie na laatste bestuursbesluit. Dit bewijst nog niet dat het basisspel leuk is: menselijke speelsessie vereist.
- [ ] S3.2 en `docs/LAYER_CONTRACT.md` staan apart in PR #6; deze basisspelbranch is zelfstandig vanaf de officiële basis ontstaan, niet vanaf PR #6. Na merge beide PR's opnieuw op conflicts en testdekking controleren.

- [ ] Economie: de directeur kan meerdere vrije spelers op dezelfde positie tegelijk tekenen (upgradelus in `squadManager`).
- [ ] Economie: de onderste divisie (4) heeft nauwelijks financiële buffer (mediane cash ±£3–10k in lange simulaties).
- [ ] Wereldkwaliteit zakt langzaam over lange periodes (loonschaal is begrensd op 11,7, het onderliggende verloop niet opgelost).
- [ ] L3 slice 3 en 4 (Sales-/Contracts-mandaat, trainer) gepland; ontwerp `docs/layers/L3-STAFF.md` (geen goedkeuring van losse transfers, besluit D-L3-2).
- [ ] Volgens `docs/SLIMLINE_WORLD_ROADMAP.md` (ChatGPT) is het volledige spel, mobiele UX, het test-harnas en de langetermijneconomie na zijn laatste wijzigingen nog niet door hem uitgevoerd. Nieuwe regressietests (`tests/world-repair-regressions.js`) zijn volgens zijn commit geschreven maar niet uitgevoerd.

## Teststatus (laatst bekende feiten per SHA)
| Wat | SHA | Resultaat | Datum | Door |
| Basisspel V1: `node build.js`, `base-briefing-test.js`, `tests/run-fast.sh` (incl. één volledig seizoen, save/load en echte wedstrijdscore) | b6e86b0 | **Groen** via GitHub Actions run 45037121192 (build en snelle engine-tests; CI zonder browser) | 2026-11-22 | GitHub Actions |
| Basisspel V1: browser-playtest licht/donker, menselijke speelsessie | b6e86b0 + docs | **Niet uitgevoerd**; browser en spelplezier nog niet gevalideerd | 2026-11-22 | ChatGPT |
|---|---|---|---|---|
| Build, `save-test`, `smoke-test` | ccceb42 | groen | 2026-11-22 | Claude (lokaal) |
| Volledige snelle suite (`tests/run-fast.sh`, incl. browser-playtest licht, 20-seizoenensim) | 717c019 | groen | 2026-11-22 | Claude (lokaal) |
| CI (`build-and-test`, zonder browser) op de officiële basis | ccceb42 (+ docs) | **rood**: build, pyramid-, foreign-world-, save-, ux-, smoke-test groen; `l25-test` faalde op een te kleine steekproef (testfout); `youth-`, `story-`, `slimline-`, `l3-test` en sim niet bereikt | 2026-11-22 | GitHub Actions, runs 1 en 2 |
| `l25-test` na herstel van die check | ccceb42 + testfix | groen (alleen deze test lokaal gedraaid) | 2026-11-22 | Claude |
| CI op pull request 4 (testfix, kop `b82dac5`), daarna gemerged tot `1234d0e` | b82dac5 | **groen** (build en alle snelle engine-tests, zonder browser) | 2026-11-22 | GitHub Actions, run 3 |
| Lange gates (`slimline-test 10`, `policy-test`, volledige playtest licht+donker) | 717c019 (deels eerder) | groen op de toen actuele stand | 2026-11-22 | Claude |
Regel: een resultaat geldt alleen voor de genoemde SHA. Nieuwe SHA = opnieuw vermelden of "niet gedraaid".

## Wijzigingslog (nieuwste bovenaan)
- 2026-11-22 ChatGPT: Basisspel V1-sprint gestart op eigen branch `chatgpt-basisspel-v1` vanaf officiële a2422c6. Feitelijke briefing en één niet-verplicht bestuurlijk aandachtspunt boven het Week-scherm gebouwd; regressietest voor data-integriteit, seizoen en save/reload plus browser-assertions in Playwright toegevoegd. Geen core-sim wijzigingen, geen L3-featurewijziging, geen merge of publicatie; CI/testuitslagen nog te verifiëren.
- 2026-11-22 Claude: artifact versie 15 gepubliceerd vanaf de officiële tip 1234d0e (sync-check --publish geslaagd); CI-regel van pull request 4 bijgewerkt (groen); branch `chatgpt-slimline-world` vastgelegd. Geen codewijzigingen.
- 2026-11-22 Claude: eerste CI-runs op `slimline-main` rood door een steekproefcheck in `tests/l25-test.js` (3+ kijkmomenten vs 1 bij twee spelers); check vervangen door een deterministische (onzekerheid daalt per kijkmoment) en een steekproefvergelijking vanaf 8 spelers per groep. Pull request naar `slimline-main`.
- 2026-11-22 Claude: `slimline-main` aangemaakt vanaf ccceb42; `scripts/sync-check.sh`, `.github/workflows/slimline-ci.yml`, `docs/DEV_STATE.md`, `docs/DEV_PROTOCOL.md` toegevoegd; testschermafbeeldingen (`tests/shots/`) niet langer gevolgd.
