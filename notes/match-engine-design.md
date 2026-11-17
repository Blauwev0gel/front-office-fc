# Ontwerp: de wedstrijdengine en de tekstengine

*17-11-2026, volgens `notes/PROMPT-match-text-engine.md`. Gebouwd op `notes/match-audit.md`. Labels: **gelezen**, **gemeten**, **vermoed**. Er is nog niets in het spel veranderd, behalve dat `simOurMatch` in de API staat zodat het harnas hem kan aanroepen.*

**Wat er ligt:**
- prototype-engine `notes/prototypes/match/match-proto.js`;
- prototype-tekstengine `notes/prototypes/match/text-proto.js`;
- voorbeeldwedstrijd `notes/match-example.txt`;
- klikbaar scherm https://claude.ai/artifact/DQCDSUEMLZrnwwV7azATrY (bron: `notes/prototypes/match/matchday-wire.html`);
- ijkharnas `tools/matchlab.js` (nog niet gedraaid).

## De drie rollen in het kort
| Besluit | Game developer | Voetbalsim-specialist | Designer |
|---|---|---|---|
| Tekst eerst, het veld met 22 stippen eruit | Minder code om te onderhouden, sneller op een telefoon | Geen beelden die liegen over posities | Tekst kan precies zeggen wat er gebeurde; een zonebalk geeft genoeg ruimte |
| Aanvallen als ketting met echte spelers | Bouwt op de bestaande kansenmotor (richting C) | Oorzaak en gevolg te volgen; tellers kloppen | Elke regel heeft een naam, een helper en een plek |
| Fasen in blokken van vijf minuten | Eenvoudig, goed te ijken | Grof maar eerlijk: vermoeidheid en stand werken per blok | Natuurlijke plek voor samenvattingen van rustige stukken |
| Hoe groot een regel is volgt uit een gewicht | Eén getal per gebeurtenis | Belang volgt de wedstrijd (laat, gelijk, groot) | Grote momenten groot, de rest klein |

**Twijfel:** de sim-specialist vindt vijf minuten grof voor een late wissel of een rode kaart in minuut 89. Voor de eerste plak is dat goed genoeg; minuten blijven wel echt per gebeurtenis.

## Deel 1: de wedstrijdengine

**Wat blijft** (gelezen):
- `pickXI` en `strengthParts` (opstelling en sterkte, met coach, stijl, moraal en extra's);
- het sterkteverschil `d` met thuisvoordeel (`homeEdge`);
- de logistiek die de verdeling van het spel bepaalt (`0,6 × (d + bijsturing)`);
- de bijsturing bij stand, rode kaarten, intensiteit en aanvallend;
- weer en stijl van de tegenstander (`oppStyle`);
- `whyLines` (B26);
- het afspelen achteraf: de wedstrijd wordt in `endWeek` berekend, het scherm speelt hem af.

**Wat verandert:**
1. **Blokken van vijf minuten** (19 met blessuretijd). Per blok wordt de verdeling van het spel opnieuw bepaald uit kwaliteit, stand, rode kaarten, **verschil in energie**, fase (begin met intensiteit, slotfase met een vol stadion) en de schuifjes van de coach.
2. **Aanvallen als ketting.** Een aanval heeft:
   - een **opbouwer** (verdediger of middenvelder, gewogen op passing);
   - een **maker** (via de flank met voorzetten, of centraal met passing en visie);
   - een **stopper** van de andere ploeg (verdediging en middenveld, gewogen op tackelen en dekken, met vermoeidheid);
   - als het een schot wordt, een **schutter** (gewogen op afwerken of koppen; de gevaarlijke man van de tegenstander zwaarder).

   Of een aanval een schot wordt, hangt af van maker tegenover stopper. Is het geen schot, dan telt een tackle of onderschepping bij de stopper.
3. **Schoten met soort en plek:** kopbal, van dichtbij, uit de zestien, van afstand, elk met een eigen xG. Daarna op doel of niet, geblokt of niet, en de keeper.
4. **Tijdens het duel:**
   - **vermoeidheid** per speler (intensiteit kost, uithoudingsvermogen en een fitnesscoach sparen);
   - **wissels** van de meest vermoeide speler tussen de 60e en 80e minuut;
   - **blessures** die met vermoeidheid toenemen en een gedwongen wissel geven;
   - **kaarten** uit duels, een rode kaart haalt een speler echt van het veld.

   De sterkte verandert daarmee voor de rest van de wedstrijd.
5. **De tegenstander krijgt spelers:** elf vaste namen per club (geseed op de club, stabiel over seizoenen) met attributen rond de clubsterkte; de gevaarlijke man uit de preview staat in de ploeg en scoort ook echt.
6. **De tellers van B42 komen uit de gebeurtenissen** (schoten, op doel, sleutelpasses, tackles, intercepties, ontruimingen, reddingen, xG en xA per speler) in plaats van achteraf getrokken. De tarieven in `world.js` (`B`) moeten daarna opnieuw geijkt worden (`test/stats.js`).
7. **Rivalen:** voorlopig `quickSim` houden, maar het harnas moet laten zien dat onze motor en `quickSim` dezelfde verdeling van uitslagen geven. Een lichte versie voor rivalen pas als dat niet zo is.

**Wat de CEO terugziet** (alleen waar de engine het echt laat gebeuren):

| Keuze van de CEO | Effect in de wedstrijd |
|---|---|
| Intensiteit | Een sterkere start, meer energieverlies |
| Fitnesscoach | Minder energieverlies, dus een sterkere slotfase |
| Aanvallend | Meer aanvallen en open wedstrijden, aan beide kanten |
| Jeugd en rotatie | Via de opstelling |
| Vol stadion | Iets meer druk in de slotfase |
| Moraal | In de sterkte |

**IJkdoelen** (vast te leggen met het harnas; bron is B25 plus gangbare cijfers uit het profvoetbal):

| Maat | Doel | Prototype (één wedstrijd, niet geijkt) |
|---|---|---|
| Goals per wedstrijd | 2,6–2,8 | 2 (0–2) |
| 0-0 | ±8% | – |
| Thuis / gelijk / uit | ±45 / 27 / 28% | – |
| Schoten per wedstrijd (samen) | 22–28 | 26 |
| Op doel | 8–10 | 9 |
| xG per schot | ±0,11 | 0,11 |
| Goals na de 80e minuut | ±18–22% van alle goals | – |
| Rode kaarten per wedstrijd | ±0,1–0,15 | 1 |
| Effect van een rode kaart | merkbaar, niet beslissend | – |
| Effect per coachschuifje | merkbaar, niet beslissend | – |

## Deel 2: de tekstengine

**Gebeurtenistypen:** aftrap, goal, redding, mis, blok, corner, gele kaart, rode kaart, wissel, blessure, rustig stuk (balbezit zonder kans), rust, einde, en een spoor van de CEO. Elk met variabelen: speler, maker, opbouwer, stopper, keeper, soort schot, flank, xG, stand, minuut, publiek, weer, derby.

**Gewicht en grootte:**
- 5 voor een goal: een kaart in de kleur van de ploeg, met de stand;
- 3 voor rood en het einde;
- 2,2 voor een grote kans;
- 0,9 voor een redding, 0,4 voor een mis, 0,2 voor een rustig stuk.

Het gewicht bepaalt ook hoe lang een regel blijft staan.

**Samenvatten:** drie of meer kleine pogingen van één ploeg binnen zes minuten worden één regel ("Kingford Borough keep coming: 3 efforts in a few minutes, none on target"). Balverlies zonder schot krijgt geen regel; het zit in de zonebalk en het momentum.

**Afwisseling:** tekstbanken per type en per kant, met een geheugen per wedstrijd (een zin valt niet twee keer). Nog te bouwen: een geheugen per week, zodat de opening niet elke wedstrijd hetzelfde is, en toon per situatie (derby, late winnaar, regen).

**Verhalen:**
- De gevaarlijke man scoort met een eigen zin ("The man we were warned about").
- De drie verhalen van de preview (`mdStories`) en het kantelpunt (`matchday.js`) zijn in het prototype nog niet gekoppeld: dat is plak 2.

**Spoor van de CEO:** hooguit twee regels per wedstrijd, alleen als het meetbaar is ("The fitness work shows: we are finishing stronger than they are").

**Bekende tekstproblemen in het prototype:**
- de spelersnamen van de tegenstander komen uit een kleine lijst (een keeper en een spits kunnen dezelfde achternaam hebben);
- gele kaarten zeggen niet altijd van welke ploeg;
- bij elf namen per club is variatie per seizoen nodig.

## Deel 3: het scherm (zie het prototype)

*Versie 2 (feedback eigenaar): teletekst- en CM-stijl, elk paneel op een vaste plek met een vaste hoogte (gemeten: geen enkel paneel verschuift tijdens of na de wedstrijd), en een livescore-lijst met de thuisploeg links en de uitploeg rechts. Wat hieronder over kaarten en kleuren van het spel staat, geldt voor versie 1.*

- **Bovenaan, vast:** de stand, de klok en een voortgangsbalk.
- **Zonebalk** met vijf vakken (zestien, eigen helft, midden, hun helft, hun zestien) en een bal die naar de plek van de laatste gebeurtenis gaat, plus wie aanvalt. **Het veld met 22 stippen verdwijnt:** het liet posities zien die niet bestonden.
- **Momentum uit wat er gebeurde** (goal, grote kans, schot, rustig stuk), met verval per minuut.
- **De laatste gebeurtenis als kaart**, goals groot in de kleur van de ploeg; daaronder de tijdlijn, nieuwste boven, kleine regels klein.
- **Ritme:** minuten zonder gebeurtenis gaan snel, voor een gebeurtenis rustiger. Gemeten duur: **34,7 seconden** voor de voorbeeldwedstrijd.
- **Knoppen:** pauze, 2× sneller, naar het eindsignaal. Bij rust de coach; de echte rustkeuze (B27) komt erbij als in het spel.
- **Einde:** uitslag, schoten, op doel, xG en "Why".
- **Gecontroleerd:** 390 px licht en donker, geen horizontaal scrollen, geen fouten, `prefers-reduced-motion` stopt de animaties.

## Kosten

| Onderdeel | Bestanden | Opmerking |
|---|---|---|
| Engine | `engine/06-match.js` | `simOurMatch` herschreven rond de blokken en kettingen. Uitvoer in hetzelfde formaat plus extra velden, zodat `matchday.js`, de krant en `whyLines` blijven werken. |
| Tegenstander | `matchtalk.js` | De elf namen naast de gevaarlijke man |
| Tekst | `matchtalk.js` (`HOOK.say`) | Uitgebreid met de taxonomie, gewichten, samenvattingen en het geheugen |
| Scherm | `ui/14-matchday-gazette.js`, `style/07-matchday-gazette.css` | `mdMatch` en `MDP` vervangen door de tijdlijn met zonebalk |
| Portaal | `world.js` (tarieven `B`), `test/stats.js`, `test/world.js` | Opnieuw ijken |
| Opslag | – | Geen nieuwe state, geen migratie: de wedstrijd wordt niet bewaard, alleen uitslag en tellers zoals nu |
| Tests | – | Nieuw `test/match.js` (formaat, consistentie: een geblesseerde speler scoort niet meer, tellers gelijk aan gebeurtenissen); `test/sim.js`, `test/matchday.js`, `test/gazette.js` groen; harnas binnen de ijkdoelen |

## Risico's
- **De balans van het hele spel hangt aan de wedstrijd** (B37: punten, ontslag, promotie). Het harnas moet aantonen dat de verdeling van uitslagen gelijk blijft bij hetzelfde sterkteverschil.
- **Het portaal rekent op de tellers.** Zonder herijking van `world.js` kloppen de percentielen in het portaal niet meer.
- **De prestaties op een telefoon:** de engine draait één keer per week (licht); het scherm is lichter dan nu (geen 22 bewegende elementen).

## Plakken (na goedkeuring)
1. **Engine met kettingen en echte spelers, en het nieuwe scherm.** Uitslagen geijkt met het harnas; tellers nog op de oude manier.
2. **Verloop:** vermoeidheid, wissels, blessures en kaarten tijdens het duel, en verhalen en kantelpunt gekoppeld.
3. **De tellers uit de gebeurtenissen**, en het portaal herijkt.
