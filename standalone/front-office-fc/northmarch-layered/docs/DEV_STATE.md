# DEV_STATE: gedeelde status (GitHub is de waarheid, niet een gesprek)
Beide ontwikkelaars werken dit bestand bij **bij elke afgeronde werksessie**, in dezelfde pull request als de code. CI faalt als het niet is bijgewerkt. Protocol: `docs/DEV_PROTOCOL.md`.

Laatst bijgewerkt: 2026-11-22 · door: Claude

## Officiële basis
OFFICIAL_BRANCH: slimline-main
OFFICIAL_SHA: ccceb42
Toelichting: de code-SHA waarop deze status slaat. Dit bestand staat in een latere, alleen-documentatie-commit. `scripts/sync-check.sh` controleert dat deze SHA in de geschiedenis van je branch zit.
Basis ontstaan door: `claude/loving-goodall-uv00vn` (alle Slimline-werk van Claude en ChatGPT, 39 commits na Claudes laatste volledige controle) op 2026-11-22 vastgelegd als officiële ontwikkelbasis.

## Artifact (speelbare versie)
ARTIFACT_URL: https://claude.ai/artifact/MsN96ouEWMVwn76jvKr3Qw
ARTIFACT_VERSION: 14
ARTIFACT_SHA: 717c019
Status: **VEROUDERD**: 40 commits achter OFFICIAL_SHA (o.a. saveschema v10, wereldnieuws, wedstrijdstatistieken). Publiceren alleen vanaf de officiële tip (`scripts/sync-check.sh --publish`), daarna deze regel bijwerken.

## Werkgebieden (één ontwikkelaar per gebied tegelijk)
| Ontwikkelaar | Werkbranch | Gebied | Status |
|---|---|---|---|
| Claude | `claude/loving-goodall-uv00vn` | Slimline-kern: werving en scouting, jeugd, windows, clubkoersen, economiebalans; L3 (staf en mandaten) | rust (wacht op de nieuwe basis) |
| ChatGPT | *nog in te vullen (eigen branch, niet de branch van Claude)* | Wereld: vijf divisies, beker, buitenlandse competities, Europa, internationale markt, wedstrijdstatistieken, wereldnieuws, rivaliteiten | actief |
Overlap vermijden: raak je een bestand van het andere gebied (`world/`, `football/market.js`, `core/save.js`), meld het hier onder "Open wijzigingen" voordat je begint.

## Open wijzigingen en bekende problemen
- [ ] Economie: de directeur kan meerdere vrije spelers op dezelfde positie tegelijk tekenen (upgradelus in `squadManager`).
- [ ] Economie: de onderste divisie (4) heeft nauwelijks financiële buffer (mediane cash ±£3–10k in lange simulaties).
- [ ] Wereldkwaliteit zakt langzaam over lange periodes (loonschaal is begrensd op 11,7, het onderliggende verloop niet opgelost).
- [ ] L3 slice 3 en 4 (Sales-/Contracts-mandaat, trainer) gepland; ontwerp `docs/layers/L3-STAFF.md` (geen goedkeuring van losse transfers, besluit D-L3-2).
- [ ] Volgens `docs/SLIMLINE_WORLD_ROADMAP.md` (ChatGPT) is het volledige spel, mobiele UX, het test-harnas en de langetermijneconomie na zijn laatste wijzigingen nog niet door hem uitgevoerd. Nieuwe regressietests (`tests/world-repair-regressions.js`) zijn volgens zijn commit geschreven maar niet uitgevoerd.

## Teststatus (laatst bekende feiten per SHA)
| Wat | SHA | Resultaat | Datum | Door |
|---|---|---|---|---|
| Build, `save-test`, `smoke-test` | ccceb42 | groen | 2026-11-22 | Claude (lokaal) |
| Volledige snelle suite (`tests/run-fast.sh`, incl. browser-playtest licht, 20-seizoenensim) | 717c019 | groen | 2026-11-22 | Claude (lokaal) |
| Volledige snelle suite op de officiële basis | ccceb42 | **niet gedraaid**; CI doet dit op de eerste pull request | | |
| Lange gates (`slimline-test 10`, `policy-test`, volledige playtest licht+donker) | 717c019 (deels eerder) | groen op de toen actuele stand | 2026-11-22 | Claude |
Regel: een resultaat geldt alleen voor de genoemde SHA. Nieuwe SHA = opnieuw vermelden of "niet gedraaid".

## Wijzigingslog (nieuwste bovenaan)
- 2026-11-22 Claude: `slimline-main` aangemaakt vanaf ccceb42; `scripts/sync-check.sh`, `.github/workflows/slimline-ci.yml`, `docs/DEV_STATE.md`, `docs/DEV_PROTOCOL.md` toegevoegd; testschermafbeeldingen (`tests/shots/`) niet langer gevolgd.
