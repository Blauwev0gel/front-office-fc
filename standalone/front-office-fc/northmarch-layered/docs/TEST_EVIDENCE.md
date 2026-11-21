# Testbewijs

Alles uitgevoerd op 2026-11-21 met `sh tests/run-all.sh` (Node 22, Chromium via Playwright). Exit-code 0.
Menselijk speeloordeel: **nog niet uitgevoerd** (alleen geautomatiseerde browser-playtest).

| Test | Wat | Seed(s) | Uitkomst |
|---|---|---|---|
| `node build.js` | standalone build | — | 16 modules, 122 KB |
| `tests/sim-test.js` | 20 seizoenen zonder verhalen/staff/dynastie; elk seizoen: 3×16 clubs, selecties 18–30, kas eindig, grootboek sluit (start + alle regels = kas), geen speler dubbel | 20261121, 1, 77, 4242 | alle groen. 40–43/48 clubs wisselen van divisie; 27–30 clubs ≥3 keer; 0–3 klimmers Two→Premier en 0–4 vallers Premier→Two per run; 6–9 administrations in 20 jaar; mediane kas £289–399k; 11–15 verschillende bekerwinnaars; loon 63–72% van de inkomsten |
| `tests/ab-test.js` | contrafeitelijk, 16 seeds per hefboom | 1000–4015 | trainingscomplex: jonge spelers +2,06 vs +1,32 kwaliteit in 2 seizoenen (16/16 beter), kost £195k aan kas · medisch centrum: 36,1 vs 53,4 blessureweken in seizoen 2 (14/16) · academie: 1,5 vs 1,0 talenten, beste potentieel 11,7 vs 10,8 · terrasprijs +£4: publiek −9%, recette +7% · determinisme: identiek |
| `tests/save-test.js` | save in week 12 → laden → 2 seizoenen verder identiek aan het origineel; nieuwere/vreemde save geweigerd | 777 | alle groen |
| `tests/idle-test.js` | voorzitter die 10 seizoenen niets doet | 11–16 | selectie blijft vol (22–26), boekhouding loopt; club spaart (£119–629k) maar training 1,9–2,1 vs 6,9–7,2 bij AI-clubs |
| `tests/playtest.js` | browser 390×844, licht én donker: nieuw spel, club kiezen, 30 weken tikken, alle tabs en overlays, project starten, prijs, lening, kader, seizoen sluiten, review, herladen + doorgaan | willekeurig | alle groen; geen horizontaal scrollen; alle knoppen ≥ 44 px; geen scriptfouten. Screenshots: `tests/shots/` |

Bekende beperkingen: webfonts worden in de test geblokkeerd (offline fallback-fonts in screenshots).

## 2026-11-21 — L2 pakket 1 (afdelingen), `sh tests/run-all.sh`, exit 0
- ab-test: alle eerdere hefbomen groen + personeel: elite medisch team 38,8 vs 51,3 blessureweken; sterk verkoopteam £59k vs £52k sponsors; afdelingskosten £50k vs £36k.
- save-test: versie 2; een versie-1-save migreert naar acht afdelingen en speelt door.
- sim-test 4 seeds × 20 seizoenen: groen; 37–43 clubs wisselen van divisie, 5–11 administrations, mediane kas £336–436k.
- playtest 390 px licht/donker: afdeling openen, personeel werven, koers wisselen, faciliteit vanuit de afdeling bouwen, Money-tab: groen.
