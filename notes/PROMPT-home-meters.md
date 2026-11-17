# Prompt: wat betekenen Board, Fans, Press, Room en Grip?

*Voor Claude als game developer van The Front Office. Plak dit als opdracht in een nieuwe sessie op `claude-game`.*

---

Je werkt als **game developer** van *The Front Office* volgens `CLAUDE.md`. De eigenaar beslist wat het spel is; jij bewaakt hoe het gebouwd wordt en zegt eerlijk als iets botst met de bijbel. Communiceer in het Nederlands; interfacetekst blijft Engels.

## De vraag
Op het homescherm staan vier tegels met een getal en een balk (**Board, Fans, Press, Room**) en een pil **Grip**. De eigenaar wil weten wat die waarden eigenlijk betekenen, en wil er een goed systeem van maken, of ze vervangen als ze niet deugen. **Bouw niets voordat de eigenaar een richting heeft gekozen.**

## Wat je eerst leest (en alleen dat)
1. `BIBLE.md`: de pijlers, vooral **P1** (je stuurt mensen), **P2** (elke beslissing laat een spoor na), **P4** (*druk voel je, je leest hem niet af*), **P9** (geen perfecte keuze). Het besluitenlog, vooral B6 (meters pas na een playtest), B21 (geen actiepunten, grip), B37 (moeilijkheid, ontslag ±20%, bestuursgoodwill), B44 (turnaround) en B49–B50.
2. `OVERZICHT.md`: hoofdstuk 8 (keten "Achterbannen"), 20 (grip), 22 (achterbannen en ontslag).
3. De code, gericht. Zoek met `grep -rn` en lees alleen de functies die je nodig hebt:
   - `src/loop.js`: `BK` (hoe de vier tegels uit state worden berekend), `VOICE`, `VOTE_AT`/`DANGER`, `lastChance`, de weekhook, `comingUp`.
   - `src/engine/08-weekly-inbox.js`: `boardWeekly` (wat het bestuursvertrouwen elke week beweegt).
   - `src/engine/10-season.js`: wat er aan het seizoenseinde met `board.conf` gebeurt (regressie naar 60).
   - `src/levers.js`: grip (`gain`, `MAXW`, `DECAY`, `GRIPK`, `GW`, de straf onder 25).
   - Alles wat `G.st.fans`, `G.st.press`, `p.morale` of `G.board.conf` verandert: `grep -rn "st.fans\|st.press\|board.conf\|\.morale" src | wc -l` en dan per bron samenvatten.
   - De UI van het homescherm: zoek de tegels (`Board`, `Room`, `Grip`) in `src/ui/`.

## Wat je oplevert (in deze volgorde, in een notitie `notes/home-meters.md`)
1. **Feiten, per waarde.** Voor Board, Fans, Press, Room en Grip: waar komt het getal vandaan (formule, `bestand:functie`), wat beweegt het (de vijf grootste bronnen), wat doet het (welke systemen lezen het, en wat gebeurt er bij laag of hoog), en ziet de speler het getal of alleen een stem. Zeg erbij wat je niet hebt kunnen vinden.
2. **Wat het voor de speler betekent.** Per waarde in één zin: welke vraag beantwoordt deze tegel voor de speler, en welke beslissing neemt hij er anders door? Als het antwoord "geen" is, zeg dat.
3. **Wat er schuurt.** Toets aan de pijlers en wees concreet. Denk aan:
   - P4: vier getallen met balken zijn afleesbare druk. Is dat een bewuste uitzondering of een fout?
   - Overlap: `st.fans` (stemming) naast `club.fanbase` (aantal) en marketingloyaliteit; Press tegenover de Gazette; Room tegenover de moraal per speler.
   - Ontslag: alleen het bestuur ontslaat direct; de andere drie via een stemming bij ≤5. Klopt dat met B37, en snapt een speler waarom?
   - Grip: een onzichtbare kracht van ±3,6 op elk hoofd, zichtbaar als een pil met een getal. Snapt de speler wat het is en wat hij eraan doet?
   - Dubbeltellingen (dezelfde gebeurtenis die twee meters raakt) en meters die alleen omlaag kunnen.
4. **Twee of drie richtingen**, elk in ±8 regels: wat de speler ziet, wat het oplost, welke pijler het versterkt, wat het kost (state, migratie, bestanden, tests), wat er verdwijnt. Minimaal één richting die **minder** meters toont (bijvoorbeeld stemmen in plaats van getallen, of meters samenvoegen), en minimaal één die het bestaande systeem houdt maar het betekenis geeft. Geen nieuwe meters of valuta zonder expliciete reden (`CLAUDE.md`).
5. **Je aanbeveling**, met de reden in drie zinnen, en wat we eerst klein en af kunnen maken.
6. **Vragen aan de eigenaar**, maximaal vier, via de vraagtool met opties en jouw aanbeveling bovenaan. Alleen vragen die de richting veranderen.

## Regels
- **Geen runs** zonder toestemming van de eigenaar. Als een getal ertoe doet (hoe vaak valt een stemming, waar staat grip gemiddeld), stel een kleine meting voor en zeg wat die kost.
- Zeg bij elke bewering of je het in de code hebt **gelezen**, **gemeten** of **vermoedt**.
- Toets elke richting aan "Het IS NIET" in de bijbel.
- Pas na de keuze van de eigenaar: een ontwerpnotitie van ±10 regels, dan bouwen volgens de loop in `CLAUDE.md` (oude saves laden, 390 px licht en donker, tests, bijbel bijwerken, push naar `claude-game`).
