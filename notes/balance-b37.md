# Balans B37: tempo en moeilijkheid (stand van zaken, 16-11-2026)

Doel (B37): 15 tot 20 seizoenen naar de top voor een gewone speler, 1 of 2 herstelbare crisisseizoenen, ±20% ontslag vóór seizoen 10 voor een willekeurige CEO.

## Gemeten (willekeurige CEO, 6 tot 8 carrières x 10 seizoenen)
| Stap | Wat | Divisie S10 | Ontslagen |
|---|---|---|---|
| nulmeting | | 1,0 | 0 van 8 |
| v1 | rivalen houden momentum (0,18 / 0,65), bestuursdoel = verwachte plek, promotie vult minder bij, kandidaten meer spreiding, coach en DoF wegen zwaarder | 1,3 | 0 van 6 |
| v2 | step-up-straf bij promotie -1,2, slow fade (`src/levers.js`) | 1,4 | 1 van 6 |
| v3 | potentieel geprijsd als loon (teruggedraaid, geen effect) | 1,3 | 0 van 6 |
| v4 | groei met diminishing returns t.o.v. divisieniveau (`develop`), bestuursvertrouwen drijft elk seizoen 12% terug naar 60 | 1,8 | 1 van 6 |

## Wat we weten
- v2 werkt onderaan: de eerste tiers duren twee seizoenen. Bovenaan klimt de club weer één divisie per seizoen.
- De economie is per divisie evenredig (loon per sterktepunt / geldniveau = 0,34 op elke tier). Het geld verklaart de versnelling dus niet.
- Probe (1 carrière): de kern is jong (±24 jaar), blijvers groeien +0,3 tot +0,5 CA per seizoen, 30 tot 50% van de kern wordt vervangen door aankopen iets boven het kerngemiddelde. Kerngroei ±+0,75 CA per seizoen, terwijl een divisie 1,4 CA kost. De club zit vanaf seizoen 3 +1 tot +2 boven het divisiegemiddelde.

## Stand na v4 (6 carrières)
Ontslag ±17% (doel 20%), ±0,8 crisisseizoen (plek 10+) per carrière (doel 1 tot 2), tempo divisie 1,8 in S10 (doel: ruim 4 voor 15 tot 20 seizoenen). Het tempo is het open punt. De club zit gemiddeld +1,26 boven het divisiegemiddelde.

## Volgende hefboom (nog niet gedaan)
Het structurele voordeel van +1,26 aanpakken: waar komt het vandaan (startselectie, transferefficiëntie van de DoF, jeugd)? Pas daarna verder tunen.

Oude voorstel, deels gedaan in v4:
De ontwikkelsnelheid van jonge spelers in `develop()` (`src/engine/08-weekly-inbox.js`: `(pa - ca) * 0.0055 * devF`) rechtstreeks verlagen of met het niveau laten afnemen. Plus hefboom D (winnen kost iets: verwachtingen schalen met succes). Meet daarna met een kleine run.

## v5 (owner input: basis selectie OK, jeugd te snel, slechte staf moet slechter presteren) — nog niet gemeten met een run
- Jeugdgroei bijna gehalveerd: `develop()` 0,0055 → 0,0030 per week (`src/engine/08-weekly-inbox.js`), academie 0,006/0,0045 → 0,0033/0,0025 (`src/academy.js`). Rekenvoorbeeld (17-jarige, tier 6, gemiddelde coach): 27% → 16% van het gat naar potentieel per seizoen; 90% sluiten duurt 13 in plaats van 7,3 jaar; tot 24 jaar bereikt hij ±70% van zijn potentieel.
- Coach telt relatief aan het divisieniveau: `(eff − tierAvg) × 0,18` op teamsterkte (zwak −0,50, gemiddeld 0, sterk +0,58 op tier 6) en `(eff − tierAvg)/10 × 0,8` in de groeifactor. DoF-prijsinvloed `(eff − tierAvg) × 0,04`.
- `test/sack.js` aangepast: een volledig afwezige CEO kan nu al in seizoen 1 ontslagen worden (kleedkamerstemming in week 28), dus de test houdt de achterbannen in de aanloop op niveau.
- Niet aangepakt: effect van de andere staf (scout, academy, commercial, marketing, finance) op resultaten.

## v5 uitkomst (6 carrières x 10 seizoenen) en de echte oorzaak
v5: divisie S10 1,7 (v4: 1,8), 0 ontslagen, gemiddeld +1,47 boven de divisie. Groeivertraging en relatieve staf veranderden het tempo niet.

Probe (1 carrière, onderdelen van teamsterkte per seizoen, `strengthParts` naast de echte rivalen):
- selectie (`squad`) ≈ rivalengemiddelde (5,9 tegen 6,2 in S1): basisselectie is goed.
- coach + stijl + moraal + extra's geven de club van de speler er +1,5 tot +2,5 bovenop (S1: 1,47 + 0,30 + 0,39 + 0,06). Rivalen hebben die niet: hun `str` is het divisiegemiddelde plus ruis.
- Dit is het structurele voordeel, en de reden dat alles hierboven (jeugd, kandidaten, doelen) niets deed.

v6 (eigenaar: geen vlakke bonus, rivalen hebben hun eigen coaches; nog niet gemeten): elke rivaal heeft `c.coach = { name, q }` (`src/engine/02-world-constants.js`: `newCoach`, `orgOf`, `ORG_MEAN`). `q` (0 tot 2,6 sterktepunten) komt bovenop de selectie van de club: gemiddeld 0,8 op tier 8 tot 1,5 op tier 1, spreiding 0,6 (verschil tussen clubs tot 2,6), 16% kans per seizoen op een nieuwe coach, daarnaast kleine drift. Gebruikt in de eerste generatie, de jaarlijkse bijsturing (`src/engine/10-season.js`) en de ambitieregel (`src/season.js`). Oude saves krijgen coaches vanzelf. `test/rivals.js` dekt dit. De namen zijn nog nergens zichtbaar (Gazette of competitiescherm is een mogelijke vervolgstap).

## Rivaalcoaches zichtbaar (eigenaar akkoord)
- Gazette: een coachwissel bij een club in jouw divisie verschijnt als "On the touchline" (max. twee per week; een zeer goede coach krijgt de droge regel "which is unhelpful"). Registratie bij seizoenseinde in `src/engine/10-season.js` (`G.coachNews`), publicatie in `src/weekflow.js`.
- Competitiescherm: inklapbaar lijstje "Head coaches" onder de tabel met de coach per club en een woord voor zijn kwaliteit (highly rated, solid, steady, inexperienced). Het lijstje leest alleen bestaande gegevens; het bekijken van het scherm verandert het spel niet.
- `test/rivals.js` dekt het Gazette-bericht.
