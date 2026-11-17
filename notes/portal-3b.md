# Ontwerpnotitie: portaal plak 3b (targets en één wereld)

*Status: voorstel, niet gebouwd. Wacht op het besluit onderaan.*

**Doel.** Wat je in het portaal vindt, kun je ook kopen. Eén keten van data tot handtekening tot achteraf zien of je gelijk had.
**Pijler.** Je beslist waarop je inzet en wie je gelooft (leiden), niet over de onderhandeling zelf. Het portaal oordeelt niet (B40).

**Wat de speler ziet en doet**
1. In het portaal: *Zet als target* bij een geflagde speler (met je hypothese erbij). Hij verschijnt in recruitment onder "Targets" en loopt door de bestaande pipeline: scouted, recommended, approach, negotiating, signed. Mandaten, goedkeuringslijn en zomerbrief werken zoals nu.
2. Een scoutbevestiging in het portaal (nu `worldConfirm`) wordt een echt rapport: dezelfde `report()` met de bias en onzekerheid van de scout die ernaar kijkt. De band en betrouwbaarheid komen terug in het portaalprofiel. Er komt geen A–D-oordeel in het portaal; de DoF houdt zijn grade in recruitment.
3. Tekent hij, dan verdwijnt hij uit het portaal (`worldRemove`). Een tab **Bets** toont je geflagde spelers met hypothese, uitkomst na een seizoen (CA, statistiek tegen de hypothese) en of je gelijk had. Dat is het terugkerende moment.

**State.** `G.world.flags[key].target = pid` en `G.rec.pool[pid].wkey = key` (koppeling in twee richtingen). Veilige defaults (`|| {}`), geen migratie; oude saves hebben geen targets.

**Hoe het technisch past**
- `F.worldTarget(key)` bouwt een poolspeler uit het wereldrecord (`F.genPlayer`, daarna naam, 14 attributen, `pers`, `ca`, `pa`, contract, `ask`, `wageAsk` overschrijven) en roept `F.recAddPipe(pid, 'scouted')` aan.
- Clubs: bij de acht binnenlandse niveaus is `p.club` een echt club-id (werkt met `F.cname`). Bij buitenlandse clubs bestaat geen club-id. Oplossing: `p.fclub = clubnaam` en één kleine uitzondering in `cname` voor die spelers.
- Bestanden: `world.js` (target, bets), `recruit.js` (rapport voor wereldspelers, tekenen ruimt de wereld op), `ui/08b-portal.js` (knop, Bets-tab), `ui/08-departments.js` (Targets-lijst), `engine/05-world-selection.js` (`cname`).
- RNG: alles blijft seeded; een wereldspeler zet het spel-RNG pas in beweging als hij echt een target wordt.

**Testen.** Nieuwe `test/world.js`-gevallen: target zet de speler in de pipeline; één speler is nooit tegelijk in wereld en pool; tekenen verwijdert hem uit de wereld; save en load behouden de koppeling; bevestiging geeft een rapport zonder grade in het portaal. Daarnaast `test/rec.js`, `test/sim.js` (zelfde uitvoer als er geen targets zijn), de browsertest en een screenshot op 390 px.

**Risico's.**
- Dezelfde speler zit soms in de DoF-pool (nu een eigen set spelers rond je niveau) en in het portaal. Dat is een dubbele identiteit.
- Buitenlandse clubs hebben nu geen eigen transferlogica; de verkoper is altijd "de club" met een vraagprijs.
- De prijs: de portaalprijs (`market()`, op een waargenomen niveau) en de poolprijs (`p.value × regio`) verschillen. Ze mogen niet verschillende getallen tonen voor dezelfde speler.

**Besluit nodig (eigenaar).** Welke wereld is leidend?
- **A (aanbevolen): `G.world` is de bron.** De DoF-pool wordt een venster erop: de DoF scout de wereld, geen eigen spelers meer. Eén identiteit en één prijs. Grotere ingreep in `recruit.js`; de pool moet worden vervangen door het portaal.
- **B: de pool blijft, het portaal koppelt ernaar.** Een target is een kopie in de pool. Kleiner en veiliger, maar dezelfde speler kan twee prijzen hebben en de pool blijft een tweede bestaande wereld.

Mijn voorstel is B als eerste stap (klein en af), en A later als de ervaring het vraagt. Dan is het risico op oude saves en de DoF-balans het kleinst.
