# Besluiten

| # | Datum | Laag | Vraag | Besluit | Reden |
|---|---|---|---|---|---|
| D1 | 2026-11-21 | L1 | Hoe diep simuleren we de andere clubs? | **A. Alle 32 clubs volledig**: selecties, contracten, stadion en grootboek; AI-clubs beslissen via regels en dezelfde commando's als de speler. | Echte transfermarkt, clubs die opkomen en wegzakken, geen verborgen tweede economie; legt de basis voor L3 (agenten op dezelfde commando's). |
| D2 | 2026-11-21 | — | Waar wordt gebouwd? | Map `standalone/front-office-fc/northmarch-layered/` op branch `claude/loving-goodall-uv00vn`; `northmarch.html` blijft onaangeroerd. | Deze sessie mag alleen naar deze branch pushen; het referentiespel blijft intact. |
| D3 | 2026-11-21 | L1 | Competitiestructuur? | **3 divisies van 16 (48 clubs) + knock-outbeker.** | Lange carrièrebogen over decennia (diepere val, lange klim) en bekerdrama/inkomstenpieken. Gevolg: 16 nieuwe clubs voor de derde divisie, met eigen identiteit; meer balanceerwerk. |
| D4 | 2026-11-21 | L1 | Hoe loopt de tijd? | **Elke week verplicht**: elke week is een eigen stap met wedstrijdverslag (competitie en beker), geen doorspoelen. | Maximale betrokkenheid per week. Gevolg: elke week moet iets te lezen of te beslissen bieden (uitslag, blessures, bouwvoortgang, geld); de UI moet een week snel afhandelbaar houden. |
| D5 | 2026-11-21 | L2 | Zeggenschap van de voorzitter over transfers? | **Alleen kader**: de voorzitter stelt loon- en transferkaders in; de directeur beslist alle deals zelf. Geen veto, geen eigen opdrachten. | Zuivere voorzittersrol. Gevolg: invloed op de selectie loopt via kaders, faciliteiten (training, academie, scouting) en geld; L3 maakt de directeur tot persoon die je benoemt en beoordeelt. |
| D6 | 2026-11-21 | L2 | Kan de voorzitter zijn functie verliezen met verhalen uit? | **Ledenvertrouwen + jaarlijkse ALV**: mechanische tevredenheid (prestatie vs. verwachting, prijzen, schuld, faciliteiten, eigen jeugd); elk seizoen een stemming; te laag vertrouwen = weggestemd. | Echte verliesconditie en spanning per seizoen in het verhaalloze spel. L4 dramatiseert later dezelfde meter (groepen, oppositie, moties) in plaats van een tweede systeem te bouwen. |
| D7 | 2026-11-21 | L2 | Wat gebeurt er na wegstemmen? | **Nieuwe club kiezen**: drie open voorzittersstoelen in dezelfde wereld; de oude club gaat zonder jou verder; carrière en reputatie lopen door. | Zoals het origineel Northmarch; maakt spel over decennia mogelijk en sluit aan op L5 (dynastie). |

## Technische besluiten (door de developer, binnen de gekozen scope)

| # | Datum | Besluit | Reden / bewijs |
|---|---|---|---|
| T1 | 2026-11-21 | Lonen volgen het marktniveau: `wageFor(q)` rekent met kwaliteit relatief aan `S.qref` (gemiddelde selectiekwaliteit van de wereld). | Zonder anker stortte de economie na ±8 seizoenen in (lonen 100–400% van de inkomsten). |
| T2 | 2026-11-21 | Nieuwe vrije spelers komen van onder Northmarch Two (lager niveau); goede vrije spelers zijn spelers die clubs lieten gaan. | Gratis instroom op topniveau veroorzaakte kwaliteitsinflatie. |
| T3 | 2026-11-21 | Noodaankopen kiezen de goedkoopste geschikte speler; buiten de zomer koopt een club alleen bij echte nood. Bij loonnood mogen ook basisspelers verkocht worden. | Lek in de loondiscipline (aankopen boven het plafond). |
| T4 | 2026-11-21 | Medische zorg verkort blessures sterker en voorkomt lange uitval (−32% blessureweken met een medisch centrum niveau 1). | Effect op niveau 1 was −6% en verdween in de ruis; investering moet voelbaar zijn. |
| T5 | 2026-11-21 | De selectie van de spelersclub wordt door een regelgebaseerde directeur beheerd binnen het kader van de voorzitter (`SetSquadPolicy`). De rijke TD/zomer-machine van voorzitter-fundering komt in L3. | Visie: de voorzitter stelt kaders, doet geen individuele transfers; L3 levert de persoon. |
| T6 | 2026-11-21 | De Northmarch-verhaallaag zit nog niet in deze build; het origineel blijft apart speelbaar. Personen, groepen, rivaliteiten en statuten worden wel al gegenereerd voor L4. | Eerst een gevalideerde L1; L4 sluit later aan op events en commando's. |
