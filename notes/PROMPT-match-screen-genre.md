# Prompt: het wedstrijdscherm, opnieuw, zoals voetbalspellen het doen

*Voor Claude op `claude-game`. Dit vervangt de richting van het commentaarpaneel in `notes/match-commentary.md`. De eigenaar: "Ik wil een ticker voor de huidige actie. Kijk naar andere voetbalspellen, bijvoorbeeld CM 00/01."*

---

Je werkt als **game developer** én als **kenner van voetbalmanagementspellen** (Championship Manager 00/01 en 01/02, de tekstmodus van Football Manager, livescore-apps). Je kent hun wedstrijdschermen en weet waarom ze zo zijn gebouwd. Nederlands in het gesprek, Engels in het spel.

## Wat er misging (lees dit eerst)
De vorige versies bouwden een **commentaarvak**: een groot paneel met twee of drie regels tekst onderaan en veel lege ruimte erboven. Dat is niet wat de eigenaar vroeg en niet hoe het genre het doet. In de genreschermen is het commentaar **één regel in één smalle balk**: de huidige actie. Elke nieuwe stap vervangt de vorige op dezelfde plek. De rest van het scherm is informatie die altijd op dezelfde plek staat.

## Stap 1: analyseer het genre (oplevering: `notes/match-screen-genre.md`)
Beschrijf zonder iets te kopiëren hoe het genre een wedstrijd toont, en wat elk onderdeel voor de speler doet. Begin bij het CM 00/01-scherm dat de eigenaar meestuurde:

| Onderdeel in CM 00/01 | Wat het doet voor de speler |
|---|---|
| Twee grote **scorebalken** bovenaan: clubnaam in de clubkleur, de stand in een wit vak | In één oogopslag de stand en wie wie is |
| **Tabs** onder de stand: Match Overview, Match Stats, Action Zones, Match Report | Meer diepte zonder het hoofdscherm te verstoren |
| **Status** in het midden: "Second Half" | Waar in de wedstrijd zitten we |
| **Infoband**: datum links, competitie en ruststand rechts | Context, altijd op dezelfde plek |
| **Doelpuntenmakers** onder de clubnaam, met de minuten ("Cole 17, 32") | Het verhaal van de wedstrijd tot nu toe |
| De **tickerbalk** in het midden: één regel, groot, wit op donker ("Dabizas plays it right towards Gavilán") | De huidige actie. Spanning ontstaat doordat de regels elkaar opvolgen op dezelfde plek |
| **"Last 5 mins"**: een balk met balbezit per ploeg in procenten | Wie heeft nu de overhand |
| **Infoband onder**: scheidsrechter, toeschouwers, weer | Sfeer, altijd op dezelfde plek |
| **Knoppen onderaan**: stats per ploeg, spelerscijfers, andere uitslagen, stand | Wat je tijdens de wedstrijd wilt opzoeken |
| **Stadion en stad** in de voetregel | Waar we zijn |

Vul aan met hoe de tekst in de tickerbalk zich gedraagt in het genre:
- elke stap van een aanval is een **nieuwe regel op dezelfde plek** ("X plays it to Y" → "Y crosses" → "Z heads it… GOAL!");
- een goal is één regel in een andere kleur of groter, plus de stand die verandert;
- de kleur van de regel volgt de ploeg die de bal heeft;
- in rustige stukken gaan de regels snel;
- er staat nooit een leeg vak.

Kijk ook naar livescore-apps voor de lijst met gebeurtenissen (thuisploeg links, uitploeg rechts, minuut in het midden; die zit al in het prototype en blijft).

Leg per onderdeel vast: **overnemen**, **aanpassen** of **niet nodig**, en waarom. Denk aan wat bij *dit* spel past: de speler is CEO, geen trainer. Zijn verhalen, zijn achterbannen als stemming (B51/B52) en "Why" (B26) horen op dit scherm.

## Stap 2: het nieuwe scherm (oplevering: een wireframe in de notitie, dan het prototype)
Ontwerp het scherm van boven naar beneden, op 390 px, elk onderdeel met een **vaste hoogte**. Uitgangspunt:
1. **Scorebalk**: thuis links, uit rechts, clubnaam in de clubkleur, de stand in een vak; eronder de **doelpuntenmakers met minuten** per ploeg.
2. **Statusregel**: helft en klok links, competitie en ruststand rechts.
3. **De ticker**: één balk met **één regel**, groot en gecentreerd, in de kleur van de ploeg met de bal. Elke beat vervangt de vorige op dezelfde plek. Een goal krijgt een opvallende maar even hoge versie (andere kleur, de stand licht op). Nooit leeg: tussen acties staat een korte rustregel ("Kingford keep the ball in midfield"). De bestaande beatgrammatica uit `notes/match-commentary.md` (aanloop, spanning, pauze, afloop, naklank) levert de regels.
4. **Balbezit laatste 5 minuten**: een balk met twee kleuren en percentages, uit de engine.
5. **Een vaste rij** met de belangrijkste cijfers (schoten, op doel, verwachte goals), of een kleine **tabkeuze** (Overview, Stats, Key events, Report) met panelen van gelijke hoogte.
6. **Key events** zoals livescore (al gebouwd), in een vak met vaste hoogte.
7. **Infoband**: scheidsrechter (fictieve naam), toeschouwers, weer.
8. **Knoppen**: pauze, sneller, naar het eindsignaal. Eventueel spelerscijfers en andere uitslagen, als de engine die heeft.

Houd de **stijl van het spel** aan (krantenroze, Oswald en Source Serif, clubkleur, licht en donker; de eigenaar wees de teletekstversie af). Neem de **opbouw en de ideeën** van het genre over, niet de look, de kleuren of de namen van een bestaand spel (`CLAUDE.md`: eigen ontwerp in het genre). Geen echte spelers, clubs, scheidsrechters of stadions.

## Stap 3: de engine levert wat het scherm nodig heeft
Controleer en vul aan in `notes/prototypes/match/match-proto.js`:
- balbezit per vijf minuten;
- doelpuntenmakers met minuten;
- fictieve scheidsrechter;
- toeschouwers (`attendance`) en weer (`wxFor`);
- rustregels voor stille minuten;
- spelerscijfers als die er komen.

Raak de ijkdoelen niet; het harnas `tools/matchlab.js` draait alleen na toestemming.

## Eisen (niet onderhandelbaar)
- **Eén regel in de ticker.** Geen vak met meerdere regels.
- **Niets verspringt.** Meet het zoals eerder: de posities en hoogtes van alle onderdelen zijn gelijk vanaf de aftrap tot na het eindsignaal en na "Watch again".
- **Geen lege vlakken.** Elk onderdeel heeft altijd inhoud.
- **Duur:** stel een duur voor en meet hem; de eigenaar beslist (eerder genoemd: ±35–45 seconden).
- 390 px, licht en donker (beide met een screenshot bekeken), `prefers-reduced-motion`, tikdoelen ≥ 44 px, WCAG AA.

## Oplevering, in deze volgorde
1. `notes/match-screen-genre.md`: de genre-analyse (tabel hierboven aangevuld), wat we overnemen en waarom, en de wireframe.
2. Het bijgewerkte prototype op dezelfde artifact-URL (https://claude.ai/artifact/DQCDSUEMLZrnwwV7azATrY), met de meting van posities en duur, en screenshots in licht en donker.
3. Hooguit drie vragen aan de eigenaar, in tekst, met jouw aanbeveling.

## Regels
- Zeg bij elke bewering of je het **gelezen**, **gezien**, **gemeten** of **vermoed** hebt.
- Toon het scherm aan de eigenaar pas als je het zelf naast de CM-screenshot hebt gelegd en elke eis hebt afgevinkt.
- Niets in het spel zelf bouwen voordat de eigenaar het prototype goedkeurt.
