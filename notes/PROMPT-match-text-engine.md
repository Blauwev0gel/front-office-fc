# Prompt: de wedstrijdengine en de tekstengine, optimaal

*Voor Claude op `claude-game`. Vervolg op `notes/match-audit.md`. De eigenaar: "de engine mag best text-based zijn als een 2D-veld te veel is".*

---

Je werkt in drie rollen tegelijk, en elke beslissing moet alle drie doorstaan:
- **Game developer:** wat voelt de speler, waarom komt hij terug, wat kost het, past het in de bestaande code en in `CLAUDE.md`?
- **Voetbalsim-specialist:** klopt het met hoe voetbal werkt en met echte statistieken, en zijn oorzaak en gevolg te volgen?
- **Designer** (tekst en scherm): leest het als een wedstrijd die je meemaakt, op een telefoon, in een paar seconden per moment?

Nederlands in het gesprek, Engels in het spel. Bouw op **wat er al bestaat**; gooi niets weg zonder reden. Bouw niet voordat de eigenaar het ontwerp heeft goedgekeurd; een prototype mag wel.

## Lees eerst (en alleen dat, gericht)
1. `BIBLE.md`: pijlers en "Het IS / Het IS NIET". Bindend voor de wedstrijd:
   - **B1, P1:** de CEO grijpt niet in. Geen tactiek, geen wissels, geen opstelling (alleen de academie-mentor van B38).
   - **B25:** gekalibreerd op ±2,7 goals per wedstrijd en ±8% 0-0; elk coachschuifje heeft een prijs.
   - **B26:** na afloop 2–3 regels waarom.
   - **B27:** soms bij rust de kleedkamer in, alleen over mensen.
   - **B42/B43:** negen tellers per speler, gebruikt door het portaal (`F.STATK`, `world.js`).
   - **B51/B52:** achterbannen als stemming, nooit als getal.
2. `notes/match-audit.md`: de keten van opstelling tot uitslag, de vijftien bevindingen en de richtingen.
3. De code: `src/engine/06-match.js` (`simOurMatch`, `whyLines`, `quickSim`), `src/engine/05-world-selection.js` (`pickXI`, `strengthParts`), `src/matchtalk.js` (stijl, gevaarlijke man, tekstbanken via `HOOK.say`), `src/matchday.js` (verhalen, kantelpunt, krant), `src/ui/14-matchday-gazette.js` (`mdPreview`, `mdMatch`, `MDP`), `src/style/07-matchday-gazette.css`, en de tests `test/stats.js`, `test/world.js`, `test/matchday.js`, `test/sim.js`, `test/gazette.js`.

## Deel 1: de wedstrijdengine (de voetbalsim-specialist leidt)
Ontwerp de simulatie die achter de tekst zit. Uitgangspunt is richting C uit de audit (de kansenmotor blijft, maar wordt eerlijk); kies iets anders alleen met een reden.
- **Model:** een wedstrijd als reeks **aanvallen** met een ketting: wie wint de bal, waar (zone), wie geeft hem door, wie schiet of verliest hem, wat doet de keeper. Spelers van **beide** teams doen mee op basis van positie en attributen; de tegenstander krijgt namen (de gevaarlijke man en een paar vaste spelers, geseed en stabiel per club).
- **Verloop:** fasen (afwachtende start, druk, na een goal, slotfase), vermoeidheid per speler, en wissels, blessures en rode kaarten **tijdens** het duel die de sterkte voor de rest van de wedstrijd veranderen. Spelhervattingen (corners, vrije trappen, penalty's) waar ze iets toevoegen.
- **De CEO zie je terug:** coachschuifjes (aanvallend, intensiteit, rotatie, jeugdminuten), staf (fitness, analist, psycholoog), moraal, pushes en het publiek moeten herkenbare gevolgen hebben in het spel, niet alleen in de uitslag.
- **Tellers:** de negen tellers van B42 komen uit de echte gebeurtenissen, niet meer achteraf. Pas de tarieven in `world.js` alleen aan als de meting dat vraagt.
- **Rivalen:** beslis of andere wedstrijden een lichte versie van dezelfde engine krijgen of `quickSim` houden, en laat zien dat beide dezelfde verdeling geven.
- **Ijkdoelen** (leg ze vast in een tabel, met bron of redenering): goals per wedstrijd ±2,7, 0-0 ±8%, thuiswinst/gelijk/uit, schoten en schoten op doel per team, xG per schot ±0,11, rode kaarten per wedstrijd, goals na de 80e minuut, het effect van een rode kaart, en per coachschuifje een meetbaar maar niet beslissend effect.
- **Techniek:** alles via de seeded RNG (`F.rnd`), geen DOM in de engine, de hele wedstrijd wordt nog steeds vooraf berekend in `endWeek` en het scherm speelt hem af. Het resultaat is een lijst gebeurtenissen met genoeg gegevens voor tekst en beeld (minuut, zone, spelers, uitkomst, belang, oorzaak).

## Deel 2: de tekstengine (de designer leidt)
Ontwerp hoe die gebeurtenissen tekst worden. Bouw op `matchtalk.js` (`HOOK.say`).
- **Taxonomie:** een vaste lijst gebeurtenistypen en per type de variabelen (speler, aangever, zone, xG, stand, minuut, publiek, weer, rivaliteit).
- **Belang:** elke gebeurtenis krijgt een gewicht (goal, rood, grote redding, gelijkmaker in de slotfase boven een schot van ver). Het gewicht bepaalt hoe groot hij verschijnt en hoe lang hij blijft staan; kleine dingen worden samengevat ("Ten minutes of pressure, no way through").
- **Afwisseling:** tekstbanken per type en situatie, met een geheugen zodat dezelfde zin niet twee keer in een wedstrijd en zelden twee keer in een week valt. Toon en lengte volgen de situatie (een derby klinkt anders dan een rustige middag, een late winnaar anders dan een vroege goal).
- **Verhalen:** de drie verhalen van de preview (`mdStories`) en de gevaarlijke man komen terug in de tekst als ze meedoen; de kantelpunten van `matchday.js` sluiten aan op wat je las.
- **Het spoor van de CEO:** hooguit een paar regels per wedstrijd die een gevolg benoemen van iets wat jij besliste ("The fitness coach you hired: we finish stronger"), alleen als het echt zo uit de engine komt.
- **Taal:** Engels, kort (P5: hooguit twee zinnen per blok), geen echte namen, clubs of merken, geen kopie van commentaar uit bestaande spellen.

## Deel 3: het scherm (de designer leidt, de game developer toetst)
- **Tekst eerst:** een tijdlijn per minuut met gezichten (`ART.playerFace`), grote momenten groot en kleine momenten één regel. Een smalle **zonebalk** (eigen helft, middenveld, hun zestien) mag het 2D-veld met 22 stippen vervangen; leg uit waarom je het veld houdt of weghaalt.
- **Momentum** volgt wat er gebeurde, nooit wat komt.
- **Ritme:** de klok versnelt als er niets gebeurt; de totale duur blijft rond ±40 seconden tenzij de eigenaar anders kiest. Versnellen, overslaan en de rustkeuze (B27) blijven.
- **De rest van het scherm:** geen lege onderhelft; overweeg de stemming op de tribune (als stemming, B51) en een tussenstand elders.
- **Eisen:** 390 px, licht en donker, `prefers-reduced-motion`, tikdoelen ≥ 44 px, WCAG AA (`tools/contrast.js`), vloeiend op een trage telefoon.

## Oplevering, in deze volgorde
1. **Ontwerpdocument** `notes/match-engine-design.md`: per deel het ontwerp, wat er van de bestaande code blijft en wat verandert (`bestand:functie`), de ijkdoelen, de gebeurtenis- en tekstformaten met voorbeelden, risico's, en wat het kost (bestanden, state, migratie, tests).
2. **Een voorbeeldwedstrijd** in tekst, van aftrap tot eindsignaal, gegenereerd door een prototype van de nieuwe engine op een echte save (niet met de hand geschreven).
3. **Een klikbaar prototype** als artifact van het nieuwe wedstrijdscherm, op de designtokens van het spel en met die echte uitvoer.
4. **Het ijkharnas** `tools/matchlab.js`: alleen de wedstrijdfunctie, duizenden wedstrijden in seconden, uitvoer tegen de ijkdoelen. Draai het pas na toestemming van de eigenaar (het kost seconden, geen seizoensruns).
5. **Hooguit vier vragen** aan de eigenaar, met opties en jouw aanbeveling bovenaan (in tekst als de vraagtool niet werkt).

## Daarna, na goedkeuring: bouwen in plakken
- Elke plak klein en af: eerst de gebeurtenissen met echte spelers en het nieuwe scherm, dan het verloop (fasen, vermoeidheid, wissels en kaarten tijdens het duel), dan de tellers uit de gebeurtenissen.
- Na elke plak: het harnas binnen de ijkdoelen, `test/stats.js` en `test/world.js` groen, nieuwe engine- en teksttests, oude saves laden, browsercheck op 390 px licht en donker met en zonder reduced-motion, een ruwe prestatiemeting met CPU-vertraging.
- Bijbel bijwerken (nieuw besluit), `OVERZICHT.md` hoofdstuk 11 bijwerken, push naar `claude-game` en de previewlink geven.

## Regels
- Zeg bij elke bewering of je het **gelezen**, **gemeten** of **vermoed** hebt.
- Toets elk ontwerpbesluit aan de drie rollen; schrijf erbij welke rol twijfelt en waarom.
- Geen seizoensruns; het harnas alleen na toestemming.
- Geen kopie van een bestaand spel; eigen ontwerp in het genre is prima.
