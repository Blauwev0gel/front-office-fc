# Balans B37: tempo en moeilijkheid (stand van zaken, 16-11-2026)

Doel (B37): 15 tot 20 seizoenen naar de top voor een gewone speler, 1 of 2 herstelbare crisisseizoenen, ±20% ontslag vóór seizoen 10 voor een willekeurige CEO.

## Gemeten (willekeurige CEO, 6 tot 8 carrières x 10 seizoenen)
| Stap | Wat | Divisie S10 | Ontslagen |
|---|---|---|---|
| nulmeting | | 1,0 | 0 van 8 |
| v1 | rivalen houden momentum (0,18 / 0,65), bestuursdoel = verwachte plek, promotie vult minder bij, kandidaten meer spreiding, coach en DoF wegen zwaarder | 1,3 | 0 van 6 |
| v2 | step-up-straf bij promotie -1,2, slow fade (`src/levers.js`) | 1,4 | 1 van 6 |
| v3 | potentieel geprijsd als loon (teruggedraaid, geen effect) | 1,3 | 0 van 6 |

## Wat we weten
- v2 werkt onderaan: de eerste tiers duren twee seizoenen. Bovenaan klimt de club weer één divisie per seizoen.
- De economie is per divisie evenredig (loon per sterktepunt / geldniveau = 0,34 op elke tier). Het geld verklaart de versnelling dus niet.
- Probe (1 carrière): de kern is jong (±24 jaar), blijvers groeien +0,3 tot +0,5 CA per seizoen, 30 tot 50% van de kern wordt vervangen door aankopen iets boven het kerngemiddelde. Kerngroei ±+0,75 CA per seizoen, terwijl een divisie 1,4 CA kost. De club zit vanaf seizoen 3 +1 tot +2 boven het divisiegemiddelde.

## Volgende hefboom (nog niet gedaan)
De ontwikkelsnelheid van jonge spelers in `develop()` (`src/engine/08-weekly-inbox.js`: `(pa - ca) * 0.0055 * devF`) rechtstreeks verlagen of met het niveau laten afnemen. Plus hefboom D (winnen kost iets: verwachtingen schalen met succes). Meet daarna met een kleine run.
