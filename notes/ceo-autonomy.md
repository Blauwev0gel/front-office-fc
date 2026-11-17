# CEO-autonomie: analyse en ontwerp (stap 1)

*Bij `notes/PROMPT-ceo-autonomy.md` en besluit B54 (Grip verdwijnt). Alles hieronder is **gelezen** in de code, tenzij er iets anders staat. Er is nog geen code gewijzigd.*

## 1. De keten zoals hij nu loopt
| Stap | Waar |
|---|---|
| **CEO-keuze:** aannemen, mandaat, bevoegdheid (Short leash / Normal / Free hand) | `setAuth` in `desk.js:33`; mandaten via `man()` in `engine/04:58` |
| **Zaak ontstaat:** een event wordt een bericht | `engine/08:95` |
| **Wie beslist:** `reason()` kiest tussen CEO (core), escalatie of de afdeling | `desk.js:52` |
| **Afdeling beslist:** `autoIndex` neemt de standaardoptie van het event; daarna een **foutkans** | `desk.js:78`, `engine/09:67` |
| **Gevolg:** `resolve`, plus een krantenregel "handled it (badly)" en `slip()` bij een fout (drift, board, fans) | `desk.js:73` |
| **Registratie:** `G.desk.by[head]` met aantallen, fouten en de laatste 8 besluiten | `desk.js:69` (de Record per afdeling) |
| **Beoordeling:** gesprekken (`talks.js`) en ontslag; `perf` en `rel` sturen effectiviteit via `eff()` | `engine/04:57` |

## 2. De vijf vragen
1. **Waar leest de code Grip?**
   - `levers.js:12–39`: Grip begint op 60 en zakt elke week met 5. CEO-acties tellen op, tot 16 per week: `respond` +6, een gesprek +5, `answerBrief` +3, andere keuzes +2 of +3. Een afdelingsbesluit zonder fout geeft +1 (`desk.js:85`).
   - `H.effBonus`: (Grip − 50) / 14 wordt opgeteld bij **alle** heads, tot ±3,6 attribuutpunten. Dat is enorm op een schaal van 1–20.
   - Onder 25: elke week lagere bestuursconfidence en `rel`, plus het krantenbericht "Who runs this club?".
   - UI: `ui/06:15,22,29–33` (helptekst, sheet), `ui/07:27` ("Your staff"), `ui/13:103,110` (badge, "Drifting"-chip) en CSS `04:157–187`.
2. **Wat doen heads zelf?**
   - Berichten binnen hun bevoegdheid (`H.desk`) en routinebriefs (`H.deskBriefs`, `desk.js:100`).
   - Van de 103 standaardkeuzes (`auto`) in de events hangen er 37 af van mandaat of karakter; 64 zijn een vast getal (gemeten met grep).
3. **Wanneer bereikt een zaak de CEO?**
   - Altijd bij een conflict, het bestuur, de fans of de pers (CORE/CLASH).
   - Als er geld boven de bevoegdheid nodig is, het gaat om een top-3-speler, of de naam van de club op het spel staat.
   - Daarnaast **op toeval**:
     - bij Short leash in 55% van de gevallen;
     - bij `rel` < 35 in 40%;
     - bij een zwakke head in 35% (`desk.js:62–64`).
4. **Wat gebeurt er bij geen reactie?**
   - **Alle** open berichten worden aan het eind van de week op dezelfde manier afgehandeld met de standaardoptie (`engine/12:15`). Een harde deadline en een verzoek dat kan wachten werken dus gelijk.
   - Briefs die je niet beantwoordt verdwijnen stil, omdat `genBriefs` ze elke week overschrijft (`engine/11:139`).
   - Gespreksverzoeken van heads wachten 2 weken; daarna beslist de head zelf (`talks.js:12`). Dat is al goed.
5. **Waar is het willekeur in plaats van herleidbaar?**
   - `errChance` (`desk.js:44`): een zwakke head kiest **een willekeurige andere optie**. Zijn risicotrek, ambitie of voorkeur spelen geen rol.
   - De escalaties op toeval uit vraag 3.
   - Het gesprek "You have my backing" geeft elke 3 weken gratis trust (`talks.js:98`), en `rel` telt mee in `eff()`. Ook dat is een pompknop.
   - Er zijn `try/catch`-blokken die fouten wegmoffelen als "Noted.": `desk.js:105–107` en `engine/11:140`.

## 3. Wat weg gaat, wat blijft, wat erbij komt
**Weg:**
- Grip, overal: logica, UI en CSS. `G.grip`, `gripW`, `gripLog` en `flags.gripWarn` worden opgeruimd (migratie, `VERSION` +1).
- De willekeurige foutkans en de escalaties op toeval.
- De gratis trust uit "backing": die mag alleen nog iets doen als er een aanleiding is, bijvoorbeeld na een slechte periode of een conflict.

**Blijft:**
- `reason()` met zijn concrete redenen, de bevoegdheidsniveaus, `G.desk`-registratie en de Record.
- Gespreksverzoeken met wachttijd, de CLASH-events, en het effect van bevoegdheid op `rel`/`eff` (`desk.js:121`: Free hand +0,4 bij goede band, kort houden van een egoïst −0,4). Dat is een echte bestuurlijke oorzaak.

**Vervangt de foutkans (geen nieuwe meter):**
- **Een head beslist vanuit zijn profiel.** Bij een keuze met opties weegt hij af:
  - wat het mandaat zegt (zoals nu);
  - zijn risicotrek en ambitie: bij een gok-optie kiest een gewaagde head die eerder;
  - zijn kwaliteit: hoe goed hij inschat wat de uitkomst wordt.
- **Kwaliteit bepaalt of zijn inschatting klopt, niet welke knop hij indrukt.** Een zwakke head kiest de optie die bij hem past, en bij een gok pakt die vaker slecht uit.
- **Zichtbaar:** de krantenregel en de Record noemen de reden, bijvoorbeeld "Rossi went for it: he likes a gamble" of "...misjudged the market".
- **Bevoegdheid bepaalt hoe zwaar het weegt:** bij Free hand neemt hij grotere gokken.

**Geen reactie, per soort zaak** (een veld op het event, met veilige default):
| Soort | Wat er gebeurt |
|---|---|
| `routine` | De head beslist met zijn profiel. Dit wordt de default. |
| `wait` | Blijft maximaal 2 weken open, daarna beslist de head (zoals bij gespreksverzoeken). |
| `hard` | De zaak verloopt met het gevolg dat in het event staat ("No answer: the offer lapses"). Je ziet dat gevolg vooraf in het bericht. |

Briefs die je laat liggen, beslist de head volgens zijn profiel in plaats van ze stil te laten verdwijnen.

## 4. Balans
Grip gaf een **actieve** speler tot +3,6 en een **passieve** tot −3,6 per head. Zonder Grip is de bonus voor iedereen 0. Dat is gelijk aan Grip 50, iets onder de start van 60 (+0,7).

Ik **vermoed** dat een actieve speler gemiddeld Grip 70–90 had, dus +1,4 tot +2,9. Voor die speler wordt het spel dan merkbaar zwaarder.

Voorstel:
1. **Geen vaste compensatie.** De echte invloed komt terug via de juiste bevoegdheid bij de juiste head (de bestaande ±0,4, verhoogd naar ±0,8) en via de profielbeslissingen hierboven.
2. **Eén meting na stap 2** met de bestaande CEO-audit (`test/audit.js`): ongeveer 2 minuten, alleen na jouw akkoord. Daarmee vergelijken we de seizoensuitkomst voor een actieve en een passieve CEO met de huidige versie. Wijkt het gemiddelde meer dan een paar plaatsen af, dan stel ik één knop bij in `tierAvg`/`eff`.

## 5. Volgorde
- **Stap 2:** Grip weg, migratie, profielbeslissingen in plaats van de foutkans, geen escalaties op toeval, en "backing" alleen met aanleiding. Tests 1, 2, 3, 7 en 8.
- **Stap 3:** soort zaak bij geen reactie, briefs met een fallback, conflicten en gesprekken met een doel. Tests 4, 5 en 6.

## Vragen aan de eigenaar
1. Mag de bevoegdheidsbonus van ±0,4 naar ±0,8, als deel van de compensatie voor het wegvallen van Grip? **Aanbeveling: ja.**
2. Mag ik na stap 2 één keer de audit (±2 min) draaien om de balans te meten? **Aanbeveling: ja.**
