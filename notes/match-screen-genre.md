# Het wedstrijdscherm zoals het genre het doet

*17-11-2026, volgens `notes/PROMPT-match-screen-genre.md`. Prototype: https://claude.ai/artifact/DQCDSUEMLZrnwwV7azATrY (bron `notes/prototypes/match/matchday-wire.html`). Labels: **gezien** (de CM 00/01-screenshot van de eigenaar en het prototype in de browser), **gemeten**, **vermoed**.*

## 1. Wat het genre doet en wat we overnemen

| Onderdeel in CM 00/01 (gezien) | Wat het doet | Besluit | Hoe in ons scherm |
|---|---|---|---|
| Twee grote scorebalken, clubnaam in de clubkleur, de stand in een wit vak | Stand en wie wie is, in één oogopslag | **Overnemen** | Twee balken naast elkaar, naam in de clubkleur, stand in een papierkleurig vak dat oplicht bij een goal |
| Doelpuntenmakers onder de clubnaam, met minuten | Het verhaal tot nu toe | **Overnemen** | Een regel per ploeg onder de balken ("Oakes 16 · Cole 48") |
| Status in het midden ("Second Half"), datum, competitie, ruststand | Waar in de wedstrijd, welke context | **Overnemen, samengevoegd** | Eén statusregel: klok, helft, competitie en ruststand |
| **De tickerbalk: één regel, de huidige actie** | De spanning: elke stap vervangt de vorige op dezelfde plek | **Overnemen (kern)** | Eén zwarte balk met één regel; een streep links in de kleur van de ploeg met de bal; een goal maakt de balk goud, even hoog |
| "Last 5 mins" met balbezit in procenten | Wie heeft nu de overhand | **Overnemen** | Een tweekleurige balk met percentages, per vijf minuten uit de engine |
| Tabs (Match Overview, Stats, Action Zones, Report) | Diepte zonder het hoofdscherm te verstoren | **Aanpassen** | Drie tabs met een paneel van vaste hoogte: Key events (als livescore), Stats, Report (Why, B26) |
| Scheidsrechter, toeschouwers, weer | Sfeer | **Overnemen** | Een infoband met een fictieve scheidsrechter, het publiek (thuis) en het weer |
| Knoppen onderaan (stats per ploeg, ratings, andere uitslagen, stand) | Opzoeken tijdens de wedstrijd | **Later** | Nu: pauze, sneller, naar het eindsignaal. Spelerscijfers en andere uitslagen als de engine die levert |
| Stadion en stad in de voetregel | Waar we zijn | **Overnemen** | De plaats en thuis of uit |
| De foto van een stadion als achtergrond | Sfeer | **Niet** | Past niet bij de krantenstijl van het spel en kost leesbaarheid op een telefoon |

**Uit het genre over de ticker zelf:**
- elke stap van een aanval is een nieuwe regel op dezelfde plek;
- een goal is één opvallende regel;
- rustige stukken gaan snel;
- er staat nooit een leeg vak.

**Uit livescore-apps:** de lijst met gebeurtenissen met de thuisploeg links, de uitploeg rechts en de minuut in het midden.

**Wat bij dit spel hoort (de CEO):**
- de verhalen van de preview in de tekst;
- de gevaarlijke man;
- "Why" in het tabblad Report;
- later de stemming van de achterbannen, B51.

## 2. Wireframe (390 px, vaste hoogtes in px)
```
[ HARWICK        2 ][ KINGFORD       1 ]   46  scorebalken
  Oakes 16 · Cole 48          Marsden 91    38  doelpuntenmakers
 90+4'   FULL TIME   COUNTY LEAGUE · HT 1-0 26  status
[▌        90+4' Full time. 2-1.          ]  58  ticker: één regel
 LAST 5 MINS [ 27% |        73%         ]   30  balbezit
[ Key events ][  Stats  ][  Report  ]       44  tabs
[ paneel                                ]  236  vaste hoogte, scrolt van binnen
 Ref: Stuart Oakley  Crowd: 1,300  Dry, evening   30  infoband
[ Pause ][ 2x speed ][ Full time ]           44  knoppen
[ HARWICK, HOME ]                            28  plaats
```

## 3. Gemeten in het prototype
- **Niets verspringt:** de posities en hoogtes van alle tien onderdelen zijn gelijk van de aftrap tot na het eindsignaal en na "Watch again", in licht en donker.
- **De ticker is altijd één regel en nooit leeg.** Er zijn 266 metingen gedaan tijdens een wedstrijd. Een te lange regel wordt kleiner gezet tot hij past.
- **Duur:** 40,3 seconden. Een beat staat 80% van zijn ontwerpduur; rustige minuten gaan snel.
- **"Watch again"** begint schoon: aftrap, 0–0, een lege lijst met uitleg.
- **Op 390 px:** geen zijdelings scrollen en geen fouten.
- **Bij het naast elkaar leggen gevonden en opgelost:**
  - de balbezitbalk vulde niet;
  - de clubnamen werden afgekapt;
  - de eindregel paste niet in de ticker;
  - de naam van de scheidsrechter werd afgekapt;
  - het minuutlabel stond 2 px te hoog.

## 4. Gekozen voorbeeld
Het prototype toont Harwick tegen Kingford (2–1, xG 0,4 tegen 2,3). Ik heb seed 1 van zes gekozen omdat die een gewone uitslag gaf; de engine is nog niet geijkt en gaf bij andere seeds 0–2, 2–4 of 4–4. Het ijkharnas (`tools/matchlab.js`) wacht op toestemming.
