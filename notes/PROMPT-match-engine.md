# Prompt: de wedstrijd, flink beter (logica en beeld)

*Voor Claude als game developer van The Front Office, op `claude-game`. Plak dit in een nieuwe sessie of geef het als opdracht.*

---

Je werkt als **game developer** van *The Front Office* volgens `CLAUDE.md`. De eigenaar beslist wat het spel is; jij bewaakt hoe het gebouwd wordt en zegt het eerlijk als een idee botst met de bijbel. Nederlands in het gesprek, Engels in het spel.

## De opdracht
De wedstrijd moet flink beter, en wel op twee fronten tegelijk:
1. **De logica** (de wedstrijdsimulatie): geloofwaardiger, meer karakter, en zichtbaar het gevolg van wat de CEO besloot.
2. **Het beeld** (het wedstrijdscherm): iets waar je naar wilt kijken, dat vertelt wat er echt gebeurt, op een telefoon.

Denk als een game developer: wat moet de speler voelen, wat ziet hij, waarom komt hij terug, en wat kost het. **Bouw niets groots voordat de eigenaar een richting heeft gekozen**; een prototype mag wel.

## Wat niet mag veranderen (lees en toets)
Lees eerst `BIBLE.md` helemaal: de pijlers, "Het IS / Het IS NIET" en het besluitenlog. Belangrijk voor de wedstrijd:
- **Geen ingrijpen in de wedstrijd** ("Het IS NIET: een live-wedstrijdsimulator waarin jij ingrijpt"; B1, P1). De CEO stuurt mensen, geen spelers: geen tactiek, geen wissels, geen opstelling. Alleen bij de academie mag een mentor ingrijpen (B38).
- **B25:** gekalibreerd op realistische uitslagen (±2,7 goals per wedstrijd, ±8% 0-0); elk coachschuifje heeft een prijs.
- **B26:** na elke wedstrijd 2–3 regels waarom we wonnen of verloren, uit de echte factoren.
- **B27:** soms bij rust de kleedkamer in; het gaat om mensen, nooit om uitslag of tactiek. Een wedstrijd duurt ±45 seconden.
- **B42/B43:** de wedstrijd houdt per speler negen tellers bij (schoten, sleutelpasses, tackles enzovoort) en het portaal rekent daarop (`F.STATK` en `test/stats.js`).
- Techniek: alles via de seeded RNG (`F.rnd`), nooit `Math.random`; logica zonder DOM in de engine; één HTML-bestand, offline; 390 px, licht en donker, `prefers-reduced-motion`, tikdoelen ≥ 44 px, WCAG AA; een oude telefoon moet het vloeiend tonen.

## Wat er nu is (controleer dit in de code, het komt uit eerdere sessies)
- **Logica** (`src/engine/06-match.js`, 15 KB): alleen onze wedstrijd wordt echt gespeeld (`simOurMatch`). Het aantal kansen is ±Poisson(27 × volume × stijl tegenstander × weer); elke kans krijgt een xG (`expRand(0.112)`, gecorrigeerd voor afwerking tegenover verdediging, pushes, rode kaarten); de kansverdeling volgt de sterkteverschillen (`share`). Tellers per speler worden achteraf afgeleid. Alle andere wedstrijden zijn `quickSim` (Poisson op teamsterkte). `whyLines` maakt de uitleg van B26.
- **Rondom:** `matchtalk.js` (stijl, gevaarlijke man, commentaar uit tekstbanken), `matchday.js` (drie verhalen over eigen spelers, kantelpunt, de krant), hooks `homeEdge`, `oppStyle`, `say`, `storyW`, `ftInj`.
- **Beeld** (`src/ui/14-matchday-gazette.js`, 26 KB; `src/style/07-matchday-gazette.css`): preview met stadion, weer en opkomst (`mdPreview`, `mdStadium`); de live speler `MDP`: 22 stippen en een bal op een veld, een klok, een momentumgrafiek, gebeurtenissen per minuut, kaarten, rust (`half`), versnellen en overslaan. De beelden zijn geseed maar staan los van wat er in de simulatie gebeurt (vermoed: controleer of een stip ooit de echte maker of verdediger is).
- **Tests:** `test/matchday.js`, `test/stats.js`, `test/sim.js`, `test/gazette.js`. `tools/longrun.js` is duur.

## Fase 1: onderzoek (oplevering `notes/match-audit.md`)
1. **Logica, volledig gelezen.** Beschrijf de keten van opstelling tot uitslag met `bestand:functie` en getallen. Wat bepaalt een uitslag echt (sterkte, coach, stijl, moraal, weer, thuis, geluk)? Wat doen de mandaatschuifjes van de coach (aanvallend, rotatie, intensiteit, jeugdminuten)? Wat ontbreekt dat een speler zou verwachten (momenten, tempo, vorm binnen een wedstrijd, vermoeidheid, een rode kaart die het spel echt verandert, comebacks)? Waar is het één willekeurige trekking die je niet terugziet?
2. **Beeld, met screenshots** van preview, live wedstrijd (begin, doelpunt, kaart, rust, einde) en de krant, op 390 px in licht en donker. Wat vertelt het scherm, wat niet? Klopt wat je ziet met wat er gebeurde? Hoe lang duurt het echt, en waar haak je af?
3. **Ijking zonder dure runs.** Bouw (of stel voor) een klein harnas dat alleen de wedstrijdfunctie draait, zonder seizoen: bijvoorbeeld 5.000 wedstrijden tussen vaste teams in een paar seconden, met gemiddelde goals, 0-0, thuiswinst, verdeling van uitslagen en het effect van elk schuifje. Draai het pas na toestemming van de eigenaar en zeg wat het kost.
4. **Vergelijk met het genre**, zonder iets te kopiëren (`CLAUDE.md`): hoe tonen andere managementspellen een wedstrijd zonder dat je tactiek speelt (tekst, 2D-highlights, momenten, ticker)? Wat past bij *jouw* spel: een CEO op de tribune, niet de trainer.

## Fase 2: richtingen (in dezelfde notitie)
Werk **twee of drie richtingen** uit, elk met: wat de speler ziet en voelt, wat er aan de logica verandert, wat het kost (bestanden, state, migratie, tests, prestaties op een telefoon), en welke pijler het versterkt. Denk bijvoorbeeld aan:
- **Logica:** de wedstrijd als reeks *momenten* (balbezit, aanvallen, kansen) waarin spelers met namen en attributen echt meedoen, zodat de tellers niet achteraf worden verzonnen; een paar duidelijke spelfasen (start, druk, na een goal, slotfase); en de beslissingen van de CEO (mandaten, staf, moraal, pushes) die herkenbaar terugkomen in hoe er gespeeld wordt. Rivalen kunnen een lichtere versie van dezelfde engine krijgen.
- **Beeld:** het veldje laat zien wat er in de simulatie gebeurt (de echte aanval, de echte maker, de echte redding), met minder maar betekenisvolle momenten; de CEO-blik (de tribune, de bestuurskamer, de reacties van de achterbannen als stemming, B51/B52); en een betere ritmiek binnen de ±45 seconden.
Houd minstens één richting **klein en af** (bijvoorbeeld: alleen het beeld koppelen aan de echte gebeurtenissen) en één **ambitieus**.

## Fase 3: prototype en keuze
- Maak voor het beeld een **klikbaar prototype** als artifact (zoals bij het scoutingportaal), gebouwd op de bestaande designtokens van het spel en met echte uitvoer van de engine, niet met verzonnen data.
- Leg de eigenaar **hooguit vier vragen** voor via de vraagtool, met opties en jouw aanbeveling bovenaan: welke richting, hoe lang een wedstrijd mag duren, hoeveel de CEO-beslissingen zichtbaar moeten zijn, en of rivalen dezelfde engine krijgen.

## Fase 4: bouwen (pas na de keuze)
Ontwerpnotitie van ±10 regels, dan bouwen volgens de loop in `CLAUDE.md`:
- de kalibratie van B25 blijft binnen de marges (aantonen met het harnas);
- de tellers van B42 en `F.STATK` blijven kloppen (`test/stats.js`, `test/world.js`);
- B26 (waarom) en B27 (rust) werken nog en worden er beter van;
- oude saves laden; `test/sim.js` en de andere tests blijven groen; nieuwe tests voor de engine;
- browsercheck op 390 px licht en donker, met en zonder `reduced-motion`, en een ruwe prestatiemeting op een trage telefoon (Playwright met CPU-vertraging);
- bijbel bijwerken (nieuw besluit), `OVERZICHT.md` hoofdstuk 11 bijwerken, push naar `claude-game` en de previewlink geven.

## Regels
- Zeg bij elke bewering of je het **gelezen**, **gemeten** of **vermoed** hebt.
- Geen runs van het hele spel zonder toestemming; het kleine wedstrijdharnas alleen na toestemming.
- Klein en af boven groot en half: liever één fase goed dan alles half.
- Geen kopie van een bestaand spel; eigen ontwerp in het genre is prima.
