# Prompt: de achterbannen en grip, volledig doorlichten en afmaken

*Voor Claude als game developer van The Front Office, op `claude-game`. Vervolg op B51 en `notes/home-meters.md`. Die analyse was onvolledig: hij keek naar formules en wie de waarden leest, maar niet naar alles wat ze verandert, niet naar wat ze over een seizoen doen en niet naar elk scherm waar ze verschijnen.*

---

Je werkt als **game developer** van *The Front Office* volgens `CLAUDE.md`. Nederlands in het gesprek, Engels in het spel. Bouw pas na een keuze van de eigenaar, behalve kleine fouten die geen ontwerpkeuze zijn (die meld je en los je op).

## Aanleiding (screenshot van de eigenaar, week 22, het detailscherm *Your backers*)
- **Board 82, Supporters 100 (+6 this week), Press 45, Dressing room 90.** In een goed seizoen lopen drie van de vier tegen het plafond aan. Een meter op 100 die "+6 this week" meldt, zegt niets meer.
- **Alle balken hebben dezelfde donkerrode kleur**, ook bij 100. Dat leest als alarm.
- **Het scherm is getal-eerst** ("82", "100") en de uitleg is een getal ("below 5"), terwijl B51 en pijler P4 zeggen: druk voel je, je leest hem niet af.
- **De namen verschillen per scherm:** Fans/Supporters, Room/Dressing room.
- De stem (*"The board toasts you at lunch."*) en de uitleg (*"Owns your contract…"*) lopen door elkaar in één alinea.

## Wat je onderzoekt (volledig, niet gericht)
Lees eerst `BIBLE.md` (P2, P4, P7, P9, B6, B21, B37, B44, B49–B51), `notes/home-meters.md` en `OVERZICHT.md` hoofdstukken 5, 8, 20 en 22.

1. **Alle schrijfplekken.** Maak een volledige lijst van alles wat `G.board.conf`, `G.st.fans`, `G.st.press`, `p.morale` (en dus Room) en `G.grip` verandert, in de engine, alle modules en alle event-opties. Zoek ook de indirecte vormen (`fx({ fans… })`, `adj(…)`, `bump(…)`, `BACKERS[…].put`, `rel(…)` waar relevant). Groepeer per bron (uitslag, wekelijkse drift, events, gesprekken, transfers, seizoenseinde, promotie en degradatie, beloftes, crisis) met de grootte van het effect. Tel hoeveel plekken omhoog en hoeveel omlaag duwen.
2. **Alle leesplekken.** Wat doet elke waarde in het spel (bestuur, ontslag, opkomst, thuisvoordeel, teamsterkte, sponsors, merk, event-weging, turnaround, stemmingen)? Ook wat je in B51 hebt toegevoegd.
3. **Schalen en drempels.** De omrekeningen in `loop.js` (`BK`), de banden van `VOICE` en de stemmingswoorden (`MOOD`), `VOTE_AT`, `DANGER`, de bestuursdrempels (22, 45, 0), de grip-drempels (25, 35) en de seizoensregressie (alleen het bestuur?). Zijn ze onderling logisch? Waarom staat een tegel bij 100 en wat is dan nog het verschil tussen goed en heel goed?
4. **Gedrag over een seizoen.** Wat doet de drift tegenover de grootte van de events en uitslagen? Lopen meters in goede en slechte seizoenen vast tegen 0 of 100? Wat gebeurt er met fans, pers en room aan het seizoenseinde? Stel hiervoor **één kleine meting** voor (een paar seizoenen, een paar seeds, een goed en een slecht spelende CEO) met wat die kost, en draai hem pas na toestemming.
5. **Elk scherm waar ze verschijnen**, met screenshot op 390 px in licht en donker:
   - homescherm (`backersHtml`, `ui/10-inbox.js`);
   - de strip bij berichten en de delta na een beslissing (`bkStrip`, `bk0`, `U.bkFrom`, `ui/13-redbox-render.js`; `m.fd`/`b.fd` in `loop.js`);
   - het detailscherm *Your backers* (`ui/06-sheets-ticker.js`, sheet `backers`) en het grip-scherm (sheet `grip`);
   - "Who backs you" op het clubscherm (`ui/07-club-league.js`);
   - de weekterugblik "This week" (`ui/12-scenes-cards.js`);
   - de wedstrijdkrant (`ui/14-matchday-gazette.js`, `matchday.js` `bk`);
   - het ontslagscherm (`ui/09-firstteam-review.js`);
   - de hulp en de tour (`ui/06`).
   Let op namen, kleuren, getallen tegenover P4, tikdoelen ≥ 44 px, contrast (WCAG AA, `tools/contrast.js`) en of de schermen elkaar tegenspreken.
6. **Grip.** Hetzelfde voor grip: schrijfplekken (de `wrap`s in `levers.js` en `desk.js`), wat het doet, hoe vaak het onder 35 en 25 komt, en of *Drifting* klopt met de Gazette-melding onder 25.

## Wat je oplevert
In `notes/backers-audit.md`, in deze volgorde:
1. **Inventaris**: tabellen met schrijf- en leesplekken per waarde (`bestand:functie`, richting, grootte).
2. **Bevindingen**, genummerd, elk met bewijs (code, screenshot of meting) en het label *gelezen*, *gemeten* of *vermoed*. Fouten die geen ontwerpkeuze zijn (zoals "+6 this week" op een meter die al op 100 staat, of een verkeerde kleur) apart.
3. **Voorstel**: één samenhangend systeem voor de vier achterbannen en grip. Wat elke waarde betekent, hoe hij beweegt (zodat hij niet vastloopt), wat hij doet, en hoe hij op elk scherm verschijnt. Toets aan P4 en B51. Geen nieuwe meters of valuta zonder reden.
4. **Vragen aan de eigenaar**, hooguit vier, via de vraagtool met opties en jouw aanbeveling bovenaan.

## Daarna, na de keuze
Ontwerpnotitie van ±10 regels, dan bouwen volgens de loop in `CLAUDE.md`:
- oude saves laden (getallen op de oude schaal blijven geldig of worden gemigreerd met `VERSION` + migratie in `load`);
- alle schermen uit punt 5 aangepast en met elkaar in overeenstemming;
- tests: de bestaande (vooral `test/sack.js`, `test/backers.js`, `test/turnaround.js`) blijven groen, plus nieuwe voor het vastlopen en voor de schermteksten;
- browsercheck op 390 px licht en donker, met screenshots van elk scherm uit punt 5;
- bijbel bijwerken (B51 aanvullen of een nieuw besluit), `OVERZICHT.md` bijwerken, push naar `claude-game`.

## Regels
- Zeg bij elke bewering of je het **gelezen**, **gemeten** of **vermoed** hebt.
- Lees alles wat de waarden aanraakt; sla geen bestand over omdat het "waarschijnlijk niet relevant" is. Als je iets niet kon nalopen, zeg dat.
- Geen runs zonder toestemming van de eigenaar.
