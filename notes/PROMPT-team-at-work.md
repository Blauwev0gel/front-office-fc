# Prompt: "Your team at work" menselijk maken

*Voor Claude op `claude-game`. Hoort bij UX-1, het CEO-bureau (`notes/ux1-desk.md`, artifact https://claude.ai/artifact/6JFVsUrJGbvNoUoGe7gvnv). De eigenaar: "Leuk, maar 'Your team at work' moet beter, menselijker."*

---

Je werkt als **game writer**, **UX-designer** en **gameplay engineer**. Nederlands in het gesprek, Engels in het spel. Volg `CLAUDE.md`.

## Het probleem
Het blok toont nu systeemregels:
- "Director of Football · Stefan Thorne: Window closed."
- "Academy · Hendrik Goodall: 15 in the academy."
- "Finance: wages are close to the cap: Finance notes your decision."

Dat zijn logregels, geen mensen. De speler moet het gevoel krijgen dat hij een organisatie leidt van mensen met een eigen manier van werken. Op dit moment leest hij een logboek.

## Het doel
Elke regel is **een mens die iets deed, op zijn eigen manier, met een gevolg**. In twee seconden ziet de speler:
- **wie** het was: gezicht, naam en rol;
- **wat** hij deed: één concrete handeling;
- **waarom of hoe**: in zijn eigen stem of karakter;
- **wat het opleverde**: of dat het nog loopt.

Voorbeelden van de toon. Dit is geen vaste tekst en geen claim dat de game dit al kan:
- *Rossi didn't wait for you on the left-back. "Kelly was the one. He'd have gone elsewhere by Friday." Signed for £40k.*
- *Goodall kept the under-18s back from the cup tie. Two of them were carrying knocks; he won't risk kids.*
- *Everett blocked a pay rise for the kitman. "Rules are rules." Wages stay under the cap.*
- *Kemp watched three games in the north and came back with nothing. He calls it a dry week.*

## Regels (niet onderhandelbaar)
1. **Niets verzinnen.** Elke handeling, elk bedrag en elke naam komt uit de staat:
   - besluiten van de desk (`G.inbox` met `del`, `m.outcome` en de reden uit `carry()`);
   - briefs die de head afhandelde (`b.del`, `b.out`);
   - weekrapporten (`G.reports`, bouwstenen in `buildReports`, `engine/11`);
   - werk van de DoF en de scouts (`G.dofNote`, `G.scoutNote`);
   - mijlpalen (`G.msNew`);
   - de Record (`G.desk.by[h].hist`).

   Een citaat parafraseert alleen wat er gebeurde. Het voegt geen nieuwe feiten toe.
2. **Karakter uit het profiel.** De stem volgt de persoonlijkheid die er al is:
   - `p.ego`: hoog betekent zelfverzekerd en kortaf;
   - `p.risk`: hoog betekent gedurfd, laag voorzichtig;
   - `p.amb`, `p.loy`;
   - `lean`, de stijl van de coach, en de bio.

   Een voorzichtige financieel man klinkt anders dan een ambitieuze DoF. Twee heads in dezelfde week klinken niet hetzelfde.
3. **Hooguit drie regels**, gekozen op betekenis:
   1. een fout of een gok, met de reden uit `carry()`;
   2. iets dat geld of een speler raakte;
   3. een mijlpaal van een speler;
   4. de rest.

   In een slechte reeks gaat de coach voor. Gebeurde er niets, dan één eerlijke rustregel, ook in de stem van een head. Bijvoorbeeld: *"Quiet week," says Everett. "That's how I like it."*
4. **Niet steeds hetzelfde.** Per soort handeling 3 tot 5 varianten, gekozen met de seeded RNG of een vaste hash, zodat een herlaad hetzelfde toont. Dezelfde zin keert binnen 4 weken niet terug.
5. **Kort.** Hooguit twee zinnen per regel en ±120 tekens. De naam staat in de kop, niet nog eens in de zin.
6. **Een gevolg als dat er is**, als klein label achteraan, bijvoorbeeld "£40k", "Wages under cap", "Board ↑" of "Went wrong". Toon dat alleen als de game het heeft berekend.
7. **Tikbaar.** Een tik opent het bericht, de afdeling (Record) of de speler.

## Werkwijze
1. **Inventaris (kort, in `notes/team-at-work.md`):** welke soorten zelfstandig werk de game nu vastlegt, welke velden er per soort zijn, en welke rapportzinnen te kaal zijn. Noem bestand en regel.
2. **Een stemmentabel:** per rol (coach, DoF, scout, academie, commercial, marketing, finance) en per karaktertype (voorzichtig / gedurfd, bescheiden / ego) een paar zinsvormen. Laat **6 voorbeeldregels** zien uit een echte gespeelde week (seed noemen). Daarna stop je voor akkoord.
3. **Bouwen:**
   - een kleine tekstmodule zonder DOM, bijvoorbeeld `src/teamwork.js` in `modules.json` na `desk.js`, met `F.teamWork()` die de regels levert;
   - het bureau (`ui/10-inbox.js`) toont ze;
   - waar een rapportzin te kaal is, verrijk je de bron in `engine/11` alleen met feiten die er al zijn.
4. **Testen (`test/teamwork.js`, vaste seeds):**
   - elke regel verwijst naar iets dat echt gebeurde;
   - de stem van twee heads met verschillend karakter verschilt;
   - geen herhaling binnen 4 weken;
   - hooguit 3 regels;
   - een rustige week geeft één rustregel.

   Draai daarnaast `autonomy`, `weekloop` en `gazette`, plus één browsercheck op 390 px in licht en donker. Werk het artifact bij op dezelfde link.

## Grenzen
- Geen nieuwe meters, valuta of schermen, en geen nieuw eventsysteem.
- Geen echte namen.
- Een head claimt nooit iets dat hij niet deed.
- Het gedrag van de heads verandert niet (dat is B54). Alleen hoe het verteld wordt.

## Oplevering
Eén commit op `claude-game`, de previewlink en de artifactlink. Daarnaast vier regels:
- wat er anders is;
- een voorbeeld vóór en ná;
- welke tests er draaiden;
- wat er nog openstaat.
