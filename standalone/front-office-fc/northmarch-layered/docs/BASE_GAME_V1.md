# Northmarch — Basisspel V1 (L1 + L2)

Status: **niet vrijgegeven**. Lokale integratievoorbereiding voor PR #8 op `slimline-main` na merge van PR #6. Geen claim op een speelbaarheids-/pleziergate.

## Productbelofte
Een zelfstandig voetbalmanagementspel waarin de voorzitter een club kiest, het budget, de ambities, het risico, de staf en de faciliteiten stuurt, weken en seizoenen laat verlopen en door echte sportieve en financiële consequenties opnieuw moet kiezen. De voorzitter kiest geen opstellingen, tactische details of individuele transfers.

## Architectuurgrens
- `node build.js` bouwt standaard L1/L2, zonder `layers/autonomy/`.
- `NORTHMARCH_BUILD_MODE=autonomy node build.js` is de expliciete L3-ontwikkelvariant.
- `src/ui/week-brief.js` is een read-only projectie: leest officiële wedstrijd-/financiële-/beleidstoestand; verandert geen game state, RNG of clock en schrijft geen eigen savefields.
- `src/ui/render.js` behoudt de `featurePanel('week:recruitmentAlerts')`-slot van de architectuur na PR #6.
- Eén bestaande wekelijkse klok, één financiering, één stand.

## Verifieerbare releasegates
1. **Functionele 3-seizoensronde**: clubkeuze, 90 speelweken, transfers, jeugd, financiën, beker, promotie/degradatie en save/load zonder blokkerende fouten.
2. **Strategische gevolgen**: vergelijk bij gelijke seeds *sparen vs sportieve investeringen*, *jeugd vs korte termijn*, *ambitie vs lage risico's*. Kijk niet alleen naar winsten maar ook naar schulden, selectie, lonen, jeugdgroei, promotiekansen en faillissementsrisico. Vermeld spreiding en effectgrootte.
3. **Economische gezondheid**: corrigeer bewezen free-agent-upgradeloops, financiële krapte laagste divisie en langdurige kwaliteitsdrift, zonder automatische 'gratis' positieve feedback.
4. **Mobile 390px licht/donker**: alle knoppen bereikbaar, geen horizontale scroll, een duidelijk weekresultaat en één optionele actie; geen verplichte inbox.
5. **Menselijke speelsessie**: 30–60 minuten daadwerkelijk spelen; noteer momenten van betekenisvolle keuzes, twijfel, verveling, verwarring en de reden om het volgende seizoen te starten.
6. **Langetermijnstabiliteit**: meerdere seeds over 10–20 seizoenen, save-migratie en deterministische tests; geen NaNs, ontbrekende clubs of corrupte boekhouding.
7. **Officiële release**: pas na één expliciet goedgekeurde GitHub/CI-actie en alleen uit de actuele geteste officiële commit. CI-groen alléén bewijst geen spelplezier.

## Kostenprotocol (strenger dan het oude GitHub-protocol)
`/Northmarch/GITHUB_ACTIONS_KOSTENPROTOCOL.md` in ChatGPT Library is leidend: **geen GitHub-mutatie of CI-run zonder afzonderlijke expliciete toestemming**. Alle normale ontwikkeling, syntax-, unit-, engine- en browserchecks eerst lokaal. Bundel eventuele toekomstige upload tot één goedgekeurde stap. Maak CI in een later goedgekeurd werkblok goedkoper: browser/deep suites handmatig en na expliciete toestemming, kortere checks per PR. Een algemene 'ga aan de slag' geldt niet als push-/CI-toestemming.

## Integratie en bewijs
Na lokaal toepassen van de `integrate.py` uit het offline-pakket eerst `node build.js`, `node tests/base-briefing-test.js` en `node tests/base-isolation-test.js` uitvoeren. Browserplaytest is optioneel en alleen lokaal als Playwright/Chromium al geïnstalleerd is. Werk `docs/DEV_STATE.md` bij met **de dan actuele officiële SHA, de uitgevoerde checks en exacte testresultaten**; vermeld niet-uitgevoerde checks als niet uitgevoerd. Publiceer of merge niets zonder toestemming.
