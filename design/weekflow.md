# De week van de CEO — analyse en voorstel

> 16-11-2026, branch `claude-game`. Getoetst aan P1, P2, P4, P7, P8, P9 en B3, B12–B20.
> Bewijs: code (`engine/12-week.js`, `ui/10-inbox.js`, `talks.js`) en een meting met de auditbibliotheek (12 runs × 3 seizoenen, 1.158 weken).

## 1. Wat er nu gebeurt in een week

**De volgorde voor de speler**
1. Inbox: een strook (positie, kas, volgende tegenstander), de backers, **de rode map** (berichten met antwoord) en **On your desk** (briefings, dossiers, pathway, preview).
2. Antwoorden: kies een antwoord en tik Send (B20). Een bericht kost 1 actie (3 per week); briefings en gesprekken zijn gratis.
3. Afdelingen: oordeel, "wants a word", Plan (alleen als je er zelf heen gaat).
4. **Next match**: preview met drie spelersverhalen, wedstrijd met commentaar, Gazette.
5. Einde week: wat de staf zelf deed, financiën, bestuur.

**Gemeten per week** (willekeurige speelstijl, alle modules):

| Wat vraagt om de CEO | Gemiddeld per week |
|---|---|
| Berichten in de rode map | 1,1 |
| Briefings die op hem wachten | 0,55 |
| Hoofden die een woord willen | 0,5 |
| Dossierdelen | 0,27 |
| Bestuursvergadering | 0,03 |

- Verdeling van het aantal dingen per week: 0 → 6%, 1 → 25%, 2 → 33%, 3 → 22%, 4+ → 13%.
- **31% van de weken heeft hooguit één ding.** Dan is de week: één tik, Next match, klaar.
- Het vaakst per seizoen: board review (3,0), persinterview (2,2), staff raise (2,0), "pre_box" (4,0) en stake match (3,9). Dossiers 1–2 keer per seizoen per verhaal.
- Er zijn 63 verschillende berichten en 14 briefingtypes die de CEO bereiken.

## 2. Waarom het herhalend voelt

1. **Elke week heeft dezelfde vorm.** Mail, mail, wedstrijd. Alles komt binnen als bericht met 2–3 antwoorden, of het nu een sponsor, een speler, het bestuur of een hoofd is. De vorm vertelt niets over wat voor week het is.
2. **De week heeft geen onderwerp.** Een derby, een transferdeadline of een bestuursvergadering zijn een regel in de strook of een briefing, geen gebeurtenis die de week bepaalt. De seizoensblokken bestaan (Opening, Autumn, Winter, Run-in, Finale), maar de speler merkt ze nauwelijks.
3. **Stille weken zijn leeg in plaats van vrij.** In 31% van de weken is er niets te doen. Een CEO zonder brandjes zou juist dan kiezen waar hij zijn tijd in steekt.
4. **Actiepunten zijn abstracte stipjes.** Drie bolletjes zeggen niets over wat een CEO doet. Ze zijn wel de enige echte schaarste (P9).
5. **De wedstrijd is van de coach, niet van de CEO.** De matchday-schermen zijn goed, maar de CEO heeft er geen rol in: hij kijkt alleen.
6. **Gevolgen komen zelden terug.** Dossiers en de pathway doen het goed (P2, P8), maar een gewoon besluit (een sponsor afgewezen, een speler niet verkocht) komt zelden in een latere week terug.

## 3. Voorstel: de week als agenda

Het doel: elke week heeft een onderwerp, een paar keuzes in verschillende vormen, en een moment waarop je ziet wat eerdere keuzes deden. Het past in een korte mobiele sessie (B3). Geen nieuwe meters: de bestaande actiepunten worden je tijd.

### 3.1 Maandag: de agenda (één scherm)
- Bovenaan het **onderwerp van de week** in één zin, gekozen uit wat er werkelijk speelt: "Derby week", "The window shuts on Friday", "Board meeting on Thursday", "A quiet week", "Cup week".
- Daaronder je **week in drie vakjes** (de bestaande 3 actiepunten, nu als agenda): wat je erin zet, doe je deze week. Gratis zaken (gesprekken, briefings) kosten geen vakje.
- Per onderwerp een andere vorm voor de hoofdzaak (zie 3.2). Wat je laat liggen, regelt de staf (zoals nu).

### 3.2 Meer vormen dan mail
Elke vorm bestaat al ergens in de code; ze worden ingezet waar ze bij passen:

| Vorm | Bestaat in | Wanneer |
|---|---|---|
| Bericht met antwoorden | rode map | routinezaken, buitenwereld (sponsor, pers, fans) |
| Gesprek (scène) | `talks.js`, coach-scènes | alles van een hoofd (B19) |
| Vergadering (meerdere punten, standpunten) | bestuursvergadering, zomervergadering, pathway | board review, transferdeadline, seizoensblokken |
| Persmoment | persconferentie | na een derby, na ontslag, bij een crisis |
| **Bezoek** (nieuw, klein) | — | stille weken: kies waar je je week doorbrengt |
| Matchday-moment | matchday | big games: één CEO-keuze rond de wedstrijd |

### 3.3 Stille weken: "Where do you spend your week?"
- Als er weinig speelt, kies je één plek uit drie, bepaald door de staat van de club: het trainingscomplex, de academie, een scoutingreis met de DoF, een sponsorlunch, de supportersclub, de gemeente.
- Elk bezoek is een korte scène (de gesprekmotor) met één echte afweging en een gevolg, bijvoorbeeld:
  - een speler die iets zegt over de coach;
  - een ouder die over het academiebeleid begint;
  - een sponsor die een voorwaarde stelt.
- Het kost een vakje (actie) en geeft grip. Zo worden stille weken de weken waarin jij het initiatief hebt (P1, P9).

### 3.4 Matchday: de CEO in de bestuurskamer
- Niet elke week, alleen bij big games (derby, top- of degradatieduel, beker; `stake_match` bestaat): vóór de aftrap één CEO-keuze. Bijvoorbeeld: de voorzitter van de tegenstander ontvangen (relatie, reputatie), een winbonus beloven, de pers toespreken, een sponsor meenemen.
- Na afloop soms een reactie: de kleedkamer, de pers of de fans, afhankelijk van de uitslag.
- De CEO kiest nooit het elftal (B1); dit gaat over de club rond de wedstrijd.

### 3.5 Gevolgen terug in de Gazette
- Een besluit kan een **terugblik** plannen: een regel die 3–8 weken later in de Gazette of als gesprek terugkomt. Bijvoorbeeld: "The betting sponsor you turned down now sponsors our rivals", of "Josh Eccles, who you refused a raise, has handed in a transfer request". Dit bouwt op `F.later` en de dossiers.
- Zo vertelt het seizoen het verhaal van jouw besluiten (P2, P8).

### 3.6 Variatie zonder meer werk
- **Weektypes** volgen de kalender die er al is: transferwindows, bekerweken, blokbegin, board reviews, derby's. De rest zijn stille weken.
- **Afkoeling per vorm:** niet twee weken achter elkaar dezelfde hoofdvorm, en een bericht van hetzelfde type hooguit één keer per x weken (de bestaande cooldowns).
- **Een week duurt hooguit ±3 keuzes plus de wedstrijd** (B3). Er komt niet meer bij; dezelfde hoeveelheid wordt beter verdeeld.

### 3.7 Wat er niet verandert
- De rode map blijft voor wat echt van de CEO is.
- Delegatie en bevoegdheid blijven: wat je laat liggen, doet de staf.
- Geen nieuwe meters. De actiepunten krijgen alleen een agendavorm.

## 4. Volgorde van bouwen (voorstel)
1. **Verdict-gesprekken** (uit de vorige vraag): een slecht oordeel wordt een gesprek met de verklaring van het hoofd; "All quiet" wordt eerlijk. Klein.
2. **Agenda en onderwerp van de week** op de inbox-thuispagina. Middel.
3. **Stille weken: bezoeken** met 6–8 plekken, elk met 2–3 varianten. Middel.
4. **Matchday-moment bij big games.** Klein tot middel.
5. **Terugblikken in de Gazette** voor 10–15 bestaande besluiten. Middel.
6. Meten: het aandeel weken met ≤ 1 keuze (nu 31%), herhaling per vorm, en de tijd per week (playtest).

## 5. Besluiten van de eigenaar (16-11-2026)
- **Geen actiepunten** (B21, overrulet bewust B6). In plaats van de agenda met vakjes: de afweging zit in de keuzes zelf.
- **Stille weken: wisselende kansen** die op je afkomen (B23), geen vast plekkenmenu; één per week.
- **Big games:** één CEO-keuze ervoor, een reactie erna (B23).
- **Terugblikken** in de Gazette voor ongeveer twintig besluiten (B24).

## 6. Wat er gebouwd is
- `weekflow.js` (nieuw): onderwerp van de week (`F.weekTopic`), elf kansen (`op_*` briefings, één per stille week), de keuze "Host a sponsor in the box" bij `stake_match`, de briefing `after_big` na een big game, en terugblikken (`ECHO`, alleen bij besluiten die de CEO zelf nam).
- `talks.js`: een slecht oordeel ("Well behind", "Struggling", "Weak") wordt een gesprek met de verklaring en een voorstel van het hoofd; in elk gesprek "What is going wrong?" als het slecht gaat. De afdelingslijst zegt "N struggling" in plaats van "All quiet".
- Actiepunten weg in engine (`AP_FREE`) en UI (stipjes, teksten "1 action"); push exclusief; grip niet meer uit mandaten, budget of staf.
- Inbox: het onderwerp van de week bovenaan; kansen heten "Opportunity" en tonen het gezicht van de speler.

## 7. Gemeten (12 runs × 3 seizoenen, willekeurige stijl; vóór → na)
- Weken met hooguit één ding: 31% → 7%. Dingen per week: 2,1 → ±3,2.
- Verschillende briefingtypes die de CEO bereiken: 14 → 27. Kansen: ±6 per seizoen, verdeeld over elf soorten.
- Uitleg-gesprekken bij een slecht oordeel: ±4,6 per seizoen.
- Ontslag (16 runs × 4 seizoenen): passief 8, actief 5, willekeurig 0, dezelfde verhouding als eerder. Te toetsen in de playtest: of de week niet te vol voelt (B3).

