# Longevity-onderzoek (16-11-2026), om later op te pakken

Volledig rapport met grafieken (privé artifact van de eigenaar): https://claude.ai/artifact/DssfZpp3XoSxLKB3td9xhY
Dit is een notitie, geen besluit. Alleen het besluitenlog in `BIBLE.md` is bindend.

## Meting (opnieuw te draaien)
```bash
node tools/longrun.js 12 10 /tmp/longrun.json
node tools/longrun-analyze.js /tmp/longrun.json
```
12 carrières x 10 seizoenen, alle modules, willekeurige CEO. Een ondergrens voor wat een speler ziet.
Let op: `test/sim.js` laadt `talks`, `weekflow`, `weekloop`, `loop`, `dossiers` en `pathway` niet; `tools/longrun.js` wel.

## Bevindingen
- Klif rond seizoen 9: een carrière klimt ongeveer één divisie per seizoen; in seizoen 10 staat 10 van 12 in de top, met kas tot £4,7m.
- Herhaling: aandeel berichten dat al eerder kwam is 67% (S2), 87% (S3), 95% (S5), 98% (S6). Van 97 events zie je er na 10 seizoenen ±57.
- Dossiers: 8 lijnen, allemaal gezien rond seizoen 4 tot 6 (uiterlijk 8), daarna ±3 keer afgerond per lijn.
- Geen ontslag in 12 carrières; vertrouwen bestuur gemiddeld 81 tot 100 (signaal, geen bewijs: een willekeurige CEO is geen goede speler).
- Carrières delen 77% van hun events in de eerste 5 seizoenen; DNA verandert de uitkomst weinig (kleine groepen).
- Na een carrière blijft alleen prijzenkast, seizoenstabel en eindscherm; niets draagt over.

## Open vraag voor de eigenaar
Zie vijf vragen in het rapport. Eén balansbesluit: hoeveel pijn mag verlies doen (nu: geen ontslag in de sim)?

## Hefbomen die al in de code zitten (goedkoop te benutten)
1. `ECHO` in `src/weekflow.js`: 18 echo's van 3 tot 8 weken later, bij ±97 events. Meer echo's en een horizon van seizoenen is data, geen nieuw systeem.
2. Event-velden `cond`, `w`, `cd`, `setup` en tekst als functie (`src/events.js`): events kunnen al reageren op club, tier en context.
3. `evWeight` in `src/weekloop.js`: weegt events op de situatie (druk per afdeling); is een plek om geschiedenis mee te laten wegen.
4. Dossiers (`src/dossiers.js`, `defineDossier`): nieuwe lijnen zijn data met `parts`, `touches` en `heat`.
5. Druk en backers (`src/loop.js`, bestuursdoelen via `setObjectives`): drempels kunnen met tier of succes meeschalen.
6. Grip (`src/levers.js`) en bevoegdheid (`src/desk.js`): bestaande schuiven voor "hoe zelf ben je bezig".
7. `G.history` per seizoen: uit te breiden met sleutelmomenten voor een seizoens- of carrièresamenvatting.
