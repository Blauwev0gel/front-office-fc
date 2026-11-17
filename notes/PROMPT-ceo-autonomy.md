# Prompt: CEO-autonomie en leiderschap (prioriteit 1 uit de audit)

*Voor Claude op `claude-game`. Vervangt de sprintprompt "P1: CEO Autonomy & Leadership Quality". Besluit van de eigenaar (B54): **Grip verdwijnt.***

---

Je werkt als game designer en gameplay engineer van *The Front Office*. Nederlands in het gesprek, Engels in het spel. Volg `CLAUDE.md`.

## Het probleem
De speler is CEO, geen trainer of technisch directeur. Hij wint door goede mensen aan te nemen, ze een passend mandaat te geven, ze eerlijk te beoordelen en in te grijpen wanneer dat echt nodig is.

Nu beloont het spel **klikken**. Grip (`src/levers.js`) daalt elke week met 5 en stijgt door zelf te reageren, gesprekken te starten of briefs te beantwoorden. Via `H.effBonus` tilt of drukt Grip daarna **alle** heads tegelijk. Wie veel klikt, krijgt betere mensen, los van de kwaliteit van zijn besluiten (audit `docs/audits/2026-11-17-dual-expert-codebase-audit.md`, bevinding 1).

## Het doel
- Een goede CEO met goede mensen en passende mandaten slaagt, ook in rustige weken zonder klikken.
- Een slechte aanstelling of een verkeerd mandaat kost zichtbaar en herleidbaar iets.
- Voortdurend ingrijpen is niet vanzelf het beste.
- Een echte escalatie negeren heeft een gevolg dat bij die zaak past.

## Werkwijze: drie stappen, met een stop na stap 1

### Stap 1: analyse en ontwerpnotitie (geen code)
Oplevering: `notes/ceo-autonomy.md`, hooguit twee schermen tekst. Daarna stop je en wacht je op akkoord.

1. Breng de keten in kaart: CEO-keuze → mandaat → head → beslissing → gevolg → beoordeling. Noem voor elke stap de functies en bestanden. Begin bij `CODEMAP.md`, `levers.js`, `desk.js`, `depts.js`, `weekflow.js`, `weekloop.js`, `talks.js` en `engine/04`, `08`, `09`, `11` en `12`.
2. Beantwoord kort, met bestand en regel:
   - Waar leest de code Grip?
   - Wat doen heads zelf?
   - Wanneer bereikt een zaak de CEO?
   - Wat gebeurt er bij geen reactie?
   - Waar zijn fouten willekeurig in plaats van herleidbaar?
3. Leg vast wat er weg moet, wat blijft en wat de plek van Grip inneemt. Noem dit alleen als het nodig is, en zonder nieuwe meter.
4. Doe een voorstel voor de balans: Grip gaf nu tot ±3,6 attribuutpunten per head. Leg uit hoe het spel even moeilijk blijft zonder die bonus.

### Stap 2: Grip weg, heads die voorspelbaar beslissen
1. **Grip verwijderen, overal:**
   - `levers.js` (gain, decay, `effBonus`, de waarschuwing, `gripLog`);
   - de UI (de "Drifting"-chip, "Your staff", sheets en homescherm);
   - `talks.js`, `desk.js`, CSS en tests.
   Zoek met `grep -rni grip src test`.

   Migratie: oude saves laden, `G.grip`, `gripW`, `gripLog` en `flags.gripWarn` worden opgeruimd (`VERSION` +1). Er blijft geen tekst achter die naar Grip verwijst.
2. **Geen straf voor rust.** Een week zonder CEO-besluit kost niets, behalve als er een echte zaak openstond.
3. **Heads beslissen vanuit wie ze zijn.** Waar nu een generieke foutkans zit, hangt de uitkomst af van:
   - competentie (kwaliteit);
   - karakter en DNA (voorzichtig of gewaagd, jeugd of ervaring);
   - mandaat (hoeveel ruimte ze hebben).

   Een sterke, voorzichtige head maakt weinig en kleine fouten. Een ambitieuze head met veel ruimte neemt herkenbare risico's die goed of slecht kunnen uitpakken. Gebruik wat er al is: DNA, mandaten en `rel`. Bouw geen tweede systeem ernaast.
4. **Zichtbaar in de week:** wat een head zelf besloot, staat met naam en reden in de weekrapportage die al bestaat. Er komt geen nieuw scherm.
5. Pushen, zodat de eigenaar kan spelen.

### Stap 3: escalaties met een reden, en wat er gebeurt als je zwijgt
1. **Escaleren alleen met een reden.** Mogelijke redenen:
   - buiten het budget of mandaat;
   - twee heads die botsen;
   - strategie of een bestuursafspraak in het geding;
   - een structureel probleem.

   Routinewerk komt niet bij de CEO. Te krappe mandaten leveren herkenbaar meer escalaties of vertraging op.
2. **Geen reactie, per soort zaak:**
   - routine: de head lost het zelf op;
   - verzoek: een fallback, of het blijft open zolang dat logisch is;
   - harde deadline: een concreet gevolg dat in de inbox staat.
3. **Conflict tussen heads:** de zaak komt bij de CEO, met beide standpunten. Het besluit raakt beide afdelingen, bijvoorbeeld in `rel` en in wat ze daarna doen.
4. **Gesprekken met een doel**, zoals een keuze, een meningsverschil, een beoordeling of een afspraak. Een gesprek geeft nooit een algemene bonus.
5. Pushen.

## Tests (kort en gericht, geen lange runs)
Nieuw bestand `test/autonomy.js`, met een vaste seed:
1. **Rustige CEO:** competente heads en een seizoen lang geen klikken. De effectiviteit van de heads daalt niet door die rust.
2. **Klik-CEO:** dezelfde club, maar alles beantwoorden en elke week gesprekken voeren. Dat geeft geen statistische bonus op de heads.
3. **Zwakke head met veel ruimte:** meer en grotere fouten dan een sterke head, verklaarbaar uit zijn eigenschappen.
4. **Te krap mandaat:** meer escalaties, elk met een reden.
5. **Genegeerde deadline:** het gevolg past bij de zaak en staat in de inbox.
6. **Conflict:** het besluit raakt beide heads.
7. **Oude save** met Grip-velden: laadt zonder fouten en zonder Grip-resten.
8. **Determinisme:** dezelfde seed en dezelfde acties geven dezelfde uitkomst.

Draai daarnaast de bestaande tests die deze systemen raken: `weekloop`, `backers`, `sack`, `summer3`, `turnaround`, `mig`, `budget`, `rec`, `squad-plan` en `world`. De lange audit en de seizoenssimulaties draai je alleen als de eigenaar daarom vraagt. Doe één browsercheck van het homescherm op 390 px, licht en donker.

## Grenzen
- Wedstrijdengine, recruitment en portal blijven, tenzij een kleine aanpassing nodig is.
- Geen nieuwe meters, valuta of schermen, en geen verborgen action points (B21).
- Alle toeval via de seeded RNG. De engine blijft zonder DOM.
- Geen `try/catch` die fouten wegmoffelt.

## Oplevering
- Per stap één commit op `claude-game` en de previewlink.
- `BIBLE.md` bijwerken: de systemenlijst (de rij Grip eruit) en de besluiten.
- Eindrapport in ±10 regels:
  - wat er veranderde;
  - hoe goed leiderschap nu werkt;
  - wat er gebeurt als de CEO niets doet;
  - welke tests draaiden, met hun uitkomst;
  - wat er nog openstaat.
- Zeg bij elke bewering of je het **gelezen**, **gemeten** of **vermoed** hebt.
