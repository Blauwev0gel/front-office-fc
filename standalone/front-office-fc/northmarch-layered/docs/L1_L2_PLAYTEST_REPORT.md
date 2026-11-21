# L1/L2 playtest — bewijsstatus

**Niet uitgevoerd voor de nieuwste wijzigingen.**

## Beschikbaar historisch bewijs
Volgens `docs/TEST_EVIDENCE.md` werden eerdere L1/L2-versies op 2026-11-21 met Node en Chromium getest, inclusief save/load, simulatie en mobiele browser. Dat is geen bewijs voor de nieuwe dashboard- en stafwijzigingen.

## Nieuwe wijzigingen die validatie vereisen
- Club-dashboard met `boardjump`-ankernavigatie, dashboardgegevens en snelkoppelingen.
- Stafvergelijking op `staffStars(staffEstimate(...))`, loonverschil en compensatie.

## Niet uitgevoerd
- `node build.js`
- `sh tests/run-all.sh`
- Playwright desktop/mobile
- Zes meerjarige strategische scenario's
- Menselijke beoordeling van speelplezier

## Releasepoort
De laatste gevalideerde speelbare HTML blijft de fallback totdat een nieuwe build alle vereiste tests doorstaat.
