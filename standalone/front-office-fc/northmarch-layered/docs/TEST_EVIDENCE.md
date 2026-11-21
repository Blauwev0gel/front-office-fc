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

## 2026-11-21 — Pakket 1 (leden, vertrouwen, doelen, ALV), `sh tests/run-all.sh`, exit 0
- members-test (16 seeds): prijzen +£5 → vertrouwen 40,8 vs 62,2 · contributie +£25 → leden 571 vs 677, contributie £39,0k vs £26,4k, vertrouwen 49,5 vs 64,7 · elke club 3 doelen en een ALV · wegstemmen → keuzescherm, 3 stoelen (één per divisie), oude club speelt door · AI-voorzitters vervangen.
- sim-test 4 seeds × 20 seizoenen: groen; 46–59 AI-voorzitters weggestemd; de automatisch gespeelde speler 0–4 keer; 5–8 administrations.
- save-test: schema v3; migraties 1→2→3 laden en spelen door tot en met een ALV.
- ab-test, idle-test (met `S.agmOff`), playtest 390 px licht/donker (doelen, contributie, ALV-wegstemmen, nieuwe club, herladen): groen.

## 2026-11-21 — Pakket 2 (trainer en directeur), `sh tests/run-all.sh`, exit 0
- staff-test (20 seeds): trainer 'results' q16 vs q7: 45,3 vs 38,4 punten (14/20) · ontwikkeltrainer q15: groei +0,71 vs +0,56 per jonge speler · directeur 'eye' q16 vs q7: miskopen 2% vs 27% · ontslag (vergoeding, interim, vrije markt), verlenging, aflopend contract, ambitieplafond: groen · zes seizoenen: 98 ontslagen, 107 benoemingen, 13 weggekocht.
- save-test: schema v4; migraties 1→2→3→4 laden en spelen door.
- sim-test 4 seeds × 20 seizoenen: groen; 49–69 AI-voorzitters weggestemd; 6–9 administrations; mediane kas £298–395k.
- ab-test, idle-test, members-test, playtest 390 px licht/donker (incl. trainer benoemen): groen.

## 2026-11-21 — Pakket 3 (begroting, commercie, financiering), `sh tests/run-all.sh`, exit 0
- commercial-test (16 seeds): loonlimiet 88% vs 50% → loonsom £11,8k vs £8,9k/week, selectie 11,83 vs 11,58 · begroting met plan/koers en loonwaarschuwing · prestatiesponsor t.o.v. vast: zwakke helft −£2,5k, sterke helft +£5,0k · ledenobligatie £77k bij vertrouwen 80 vs £24k bij 25, goedkoper dan de bank, één per seizoen · inzameling £18k → £9k en minder vertrouwen · grond verkopen: kas nu, huur per week, −15 vertrouwen; statuut blokkeert bij laag vertrouwen · prijsstatuut · speelschema: langste reeks 3, 15 thuisduels.
- staff-test: trainer 'results' q16 vs q7 nu op 32 seeds: 43,3 vs 38,8 punten (23/32); wegkopen alleen nog in de zomer.
- sim-test 4 seeds × 20 seizoenen: groen; 0–1 administrations (zie open punt pakket 6), 38–54 AI-voorzitters weggestemd.
- save-test (schema v5), ab-test, idle-test, members-test, playtest 390 px licht/donker (budget, loonlimiet, sponsors, funding, inzameling): groen.
