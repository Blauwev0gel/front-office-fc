# Prompt: samen het spel ontdekken in plaats van features bouwen

*Voor Claude als game developer, samen met de eigenaar als game director. Branch `voorzitter-fundering`. Opgesteld 21-11-2026.*

## Waarom deze aanpak
We hebben veel gebouwd (wereld, opening, TD, transferzomer, ALV), maar het plezier is nog niet bewezen. Game developers draaien dat om: **eerst "find the fun" met goedkope prototypes, daarna pas bouwen.**

Het denkkader is MDA (Mechanics → Dynamics → Aesthetics): kies eerst het gevoel dat de speler moet hebben, en ontwerp pas daarna de regels die dat gevoel opwekken.

**Regels voor deze aanpak:**
- **Geen code** tot fase 4.
- **Elke sessie duurt 20–30 minuten** en levert precies één ding op.
- Claude **checkt na elke sessie in** en draait geen grote simulaties zonder akkoord.

## Wat we al hebben (input, niet heilig)
- **Een fantasie die uniek is:** de gekozen voorzitter van een ledenclub die geen spelers kiest. In het genre bestaat dat nauwelijks.
- **Een wereld:** 32 clubs, ledengroepen, mensen met geheugen, een trainer en een TD met eigen karakter.
- **Sterke momenten:** de envelop, de handtekening, het transfer centre, de krant met een cijfer, de ALV.
- **Eén getal:** de ledensteun in %, als score en als leven (keuze 71).
- **Lessen uit de simulatie** (zie `loopsim-handover/` op branch `claude/loving-goodall-uv00vn`):
  - **De staf werkt zelf volgens het mandaat, en de voorzitter beslist weinig maar zwaar op echte crisismomenten.** Dat scoort het sterkst, want timing weegt zwaarder dan de omvang van een keuze. Let op: dit model is achteraf ontworpen, dus het is een richting en geen bewijs.
  - **Sms'jes tijdens de wedstrijd doen vrijwel niets.**
  - **2–4 kaarten per week vragen 3–5 keer meer inhoud** dan er vanzelf gebeurt. Dat is een risico op opvulkaarten.
  - **Alleen invloed rond de wedstrijd geeft geen speelvaardigheid.**

## De werkwijze in vijf fasen

### Fase 1: het gevoel vastleggen (1 sessie)
- **Eén pagina:** de spelerfantasie, de drie gevoelens die de speler moet hebben (bijvoorbeeld *"mijn club leeft"*, *"mijn keuze deed ertoe"*, *"ik kan het verliezen"*), en wat het spel níét is.
- **Toets:** elk volgend idee moet een van die drie gevoelens dienen, anders vervalt het.

### Fase 2: de kern ontdekken (2–3 sessies)
- **Het werkwoord van de speler kiezen.** Wat doet de voorzitter steeds opnieuw? Kandidaten: *kaders zetten*, *mensen kiezen*, *ingrijpen op het juiste moment*, *beloven en waarmaken*. Kies er één of twee.
- **De loop op één A4:** wat doe je per moment, per week, per seizoen en per carrière, en wat voedt wat.
- **Drie richtingen schetsen** als korte verhalen van één seizoen, zoals een speler het zou navertellen. Bijvoorbeeld:
  - *"De bestuurder"*: delegeren, en ingrijpen bij een crisis;
  - *"De beloftemaker"*: beloften als motor van het seizoen;
  - *"De mensenmens"*: relaties met trainer, TD, aanvoerder en supportersleider als motor.
- De eigenaar kiest, of combineert er twee.

### Fase 3: spelen zonder code (2 sessies)
- **Een papieren proef (*Wizard of Oz*):** de eigenaar speelt één seizoen in snelle stappen in de chat. Claude speelt de wereld met vaste regels en gooit de dobbelstenen eerlijk.
- **Na elke proef dezelfde vijf vragen:**
  1. Wanneer wilde je doorgaan?
  2. Wanneer verveelde je je?
  3. Welke keuze voelde zwaar?
  4. Wat onthoud je van dit seizoen?
  5. Wat wil je navertellen?
- **Een lijst "houden / schrappen / veranderen"** na elke proef.

### Fase 4: de kleinste speelbare versie (vertical slice)
- **Eén seizoen, één club, alleen de gekozen loop.** De UI mag lelijk zijn, we hergebruiken de bestaande code, en alles wat niet bijdraagt, gaat uit (feature flags).
- **Meten:**
  - de tijd per week;
  - het aantal keuzes;
  - hoe vaak de steun in gevaar komt;
  - het verhaal van één seizoen, door de eigenaar navertelt in drie zinnen.

### Fase 5: uitbouwen in lagen
Pas als de slice leuk is, in deze volgorde:
1. inhoud (situaties, mensen, varianten);
2. de seizoensboog;
3. de carrière;
4. de mooie UI.

Elke laag krijgt een speeltest door de eigenaar met de vraag: **is het leuker geworden?**

## Afspraken
- **De eigenaar beslist** wat het spel is. Claude stelt voor, toetst aan de drie gevoelens, en zegt het eerlijk als een idee schuurt.
- **Interactieve vragen** in plaats van lange documenten. Hooguit één pagina per sessie.
- **Klein en af.** Geen nieuwe meters, valuta of schermen zonder reden.
- **Kosten bewaken:** geen grote simulaties of builds zonder akkoord, en na elke stap inchecken.
