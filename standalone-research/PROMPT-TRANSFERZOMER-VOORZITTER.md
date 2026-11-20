# Prompt: een transferzomer die spannend is, en een TD die je kunt afrekenen

*Voor Claude als voetbalexpert én game developer. Branch `voorzitter-fundering`, standalone-spoor. Opgesteld 20-11-2026.*

**Werkwijze:** eerst templates, dan pas bouwen.

---

## De vraag van de eigenaar
> "De zomer transfer schermen / routine van de originele versie op Claude lijkt beter in elkaar te zitten. Kijk naar de transfer zomer en TD rollen vanuit een voetbal expert en vooral game developer pov, en geef een prompt voor verbetering waardoor het leuker wordt."

## Bindende keuzes (20-11-2026, keuze 70)
1. **De invloed van de voorzitter blijft zoals nu.** De TD stelt de prioriteiten en de staf reageert in de zomervergadering. Jouw hefboom is het mandaat: budget, loonplafond, identiteit en rode lijnen.
   - Geen onderhandeling over het plan.
   - Geen telefoontjes tijdens de ticker.
   - Keuze 68 blijft staan: geen schijninvloed.
2. **Over uit het origineel (`claude-game`, `src/summer2.js`):**
   - **een getekende *summer brief* met afrekenpunten:** de TD tekent waarop hij wordt beoordeeld;
   - **een zomereditie van de krant met een cijfer van A tot E**;
   - **een debrief met vijf vragen**, dat ook het oordeel Keep / Warn / Sack voedt (TD-stap 4).
3. **Zichtbare scouting.** Elk target krijgt een **scoutcijfer (A–D)** en een prijs. Een TD met een zwak oog zit er vaker naast, en dat blijkt later uit Hit of Miss. De speler kiest geen spelers, maar ziet wat de TD ziet.

## Analyse: waarom de huidige zomer minder werkt dan het origineel

**Wat het origineel goed deed (bron: `claude-game` `src/summer2.js` en `summer.js`):**
- **Een structuur in vijf stappen:** *Summer meeting → The summer → Summer edition → Debrief → Season goals*. Elke stap heeft een eigen gevoel.
- **De vergadering heeft agendapunten:** de club en de contracten, het geld, wat we nodig hebben, de brief. Iedereen heeft een stem: de DoF, de trainer met zijn wens, de scout met concrete namen en cijfers, financiën. Het plan noemt **namen**, met Plan A en Plan B per positie.
- **De brief maakt de zomer meetbaar.** Bijvoorbeeld "Sign a player for left-back and striker", "Net spend under £X", "Land a clear upgrade" of "At least three signings".
- **De ticker heeft ritme:**
  - zes weken, regel voor regel onthuld;
  - oefenwedstrijden in week 4 en 5;
  - in een rustige week de stand van het plan ("Left-back: Plan B in talks");
  - "Plan A for left-back is off. Plan B: …";
  - deadline day als slot.
- **Er is een vonnis.**
  - De krant geeft een cijfer, een kop ("A summer to remember" of "A summer of half measures"), een vergelijking per positie, en reacties van trainer, fans en bestuur.
  - De debrief beantwoordt vijf vragen: *plan gevolgd · uitvoering · markt · team beter · kosten*. Daarbij is de markt "not on him".
  - De TD krijgt strikes, en een waarschuwing vervalt na een seizoen.

**Wat de huidige versie mist:**
1. **Geen inzet vooraf.** Er is niets afgesproken, dus de uitkomst betekent niets. Twee van de drie prioriteiten halen voelt hetzelfde als drie.
2. **De targets zijn anoniem tot de ticker.** Je hebt niemand om op te hopen. Het origineel noemde Plan A en Plan B met naam en scoutcijfer in de vergadering.
3. **De ticker is monotoon.** Alle regels hebben hetzelfde gewicht, er zijn maar vier weken, er zijn geen oefenwedstrijden, en een rustige week vertelt niet waar het plan staat.
4. **Geen vonnis.** Het rapport is een goede analyse, maar geen moment: geen cijfer, geen kop, geen reacties.
5. **De TD hoeft geen verantwoording af te leggen.** Er is geen afrekenmoment, en de keuze van je TD krijgt dus geen gewicht.
6. **"Missed" komt in de praktijk niet voor**, omdat een huurling als C-keuze altijd lukt. Mislukken moet kunnen.
7. **De assessment in de vergadering is een lange tekstlijst.** Het origineel liet mensen spreken.
8. **Het winterwindow werkt nog op de oude manier.** Het origineel gebruikte dezelfde machine, kleiner (drie weken, één prioriteit).

## Ontwerpprincipes (game design)
1. **De lus: verwachting → onzekerheid → ontknoping → oordeel.** De brief geeft verwachting, de ticker onzekerheid, deadline day de ontknoping, en de editie met debrief het oordeel.
2. **Namen maken je betrokken.** Een target met naam, gezicht, scoutcijfer en Plan B is iemand om op te hopen. "Plan A is off" moet pijn doen.
3. **Variabele beloning.** Een koopje, een kaping, een speler die een C-cijfer had en toch slaagt. Niet elke zomer verloopt hetzelfde.
4. **Pieken in het ritme.** Een rustige week, een oefenwedstrijd, een kaping, deadline day. Gebruik leesgewicht: een grote regel voor een aanwinst of een kaping, een kleine voor ruis.
5. **Eerlijk oordeel.** De debrief onderscheidt pech (de markt) van kunde (de uitvoering). Zo leert de speler zijn TD kennen en voelt een ontslag terecht.
6. **Geen schijninvloed** (keuze 68). Wat de speler doet in de zomer is kijken, lezen en oordelen. Zijn invloed zat in het mandaat en de keuze van de TD.

## De gewenste zomer (stappen, met een voortgangsbalk bovenaan)

| Stap | Wat de speler ziet | Wat er gebeurt |
|---|---|---|
| **1. The summer meeting** | Agendapunten in tekstballonnen met gezichten:<br>**(a) De club:** de TD over vorig seizoen ("Our weakest line was…"), wie weg moet, de contracten.<br>**(b) Het geld:** de financieel directeur over kas, loonsom en marge.<br>**(c) Wat we nodig hebben:** de prioriteiten van de TD met **Plan A en Plan B op naam**, met scoutcijfer, leeftijd en prijs. De trainer zegt of zijn wens erbij zit, de scout zegt hoe zeker hij is.<br>**(d) Het mandaat** (de bestaande keuzes). | De voorzitter zet het mandaat (bestaand). De rest is lezen. Maximaal twee zinnen per ballon. |
| **2. The summer brief** | Een document met de handtekening van de TD: 3 afrekenpunten, afgeleid van zijn plan en jouw mandaat. Bijvoorbeeld "A player for left-back and striker", "Net spend under £40k", "At least one grade-A signing". | Opgeslagen in de state; het meetpunt voor editie en debrief. Een kort stempelmoment. |
| **3. The summer (ticker)** | **6 weken plus deadline day.** Regel voor regel onthuld (automatisch, met *Show it all*). Een **bord met de stand van het plan** per prioriteit (A in talks · B · signed · missed). **Oefenwedstrijden in week 4 en 5** met uitslag. In een rustige week de stand van het plan. Een kaping of "Plan A is off" als grote regel. | Geen keuzes. Het bord In/Out groeit mee. |
| **4. Summer edition** | Een krantenvoorpagina: **cijfer A–E**, een kop, aanwinsten met foto en scoutcijfer, rating per linie voor en na, en citaten van trainer, fans en bestuur. | Het cijfer volgt uit de brief (gehaalde punten), de teamrating en het geld. |
| **5. Debrief** | **De vijf vragen**, elk als regel met ✔ / ✖ / –: *Plan gevolgd · Uitvoering (scoutcijfers van de aanwinsten) · Markt (wat was pech) · Team beter · Geld tegen de brief*. Daarna één zin van de TD. Het telt mee voor het oordeel in juni (Keep/Warn/Sack, TD-stap 4). | Er wordt een strike genoteerd als het slecht ging en het geen pech was. Een strike vervalt na een seizoen, zoals in het origineel. |
| *(winter)* | Dezelfde machine, kleiner: geen vergadering maar een kort bericht van de TD, een brief met 1–2 punten, 3 weken ticker, een editie en een debrief. | Vervangt het oude winterwindow. |

## Scouting met cijfers
- **Elk target krijgt een scoutcijfer A–D** op basis van de *geziene* kwaliteit (`tdSee`, het bestaande oog-mechanisme) tegenover de huidige elf.
  - A: een duidelijke verbetering;
  - B: een goede aanvulling;
  - C: breedte;
  - D: een gok.
- **Het echte niveau kan afwijken.** Een TD met een zwak oog geeft vaker een A aan een middelmatige speler. Dat zie je terug als **Hit/Miss** na een half seizoen, en in de debrief bij *Uitvoering*.
- **In de UI:** een cijferchip bij elk target (in de vergadering, de ticker, de editie en de spelerskaart onder "Scouted as A").

## Wat ook moet veranderen
- **"Missed" moet kunnen.** De C-keuze lukt niet altijd. Een huur kan mislukken (de clubs lenen niet uit), en een jeugdspeler is niet altijd klaar. Doel: over 20 seeds wordt 10–25% van de prioriteiten gemist.
- **Kapingen en de markt worden gelogd als "not on him"**, voor de debrief.
- **Leesgewicht in de ticker:** drie regelgroottes (groot: aanwinst, vertrek, kaping, Plan A off · normaal: stappen in een deal · klein: wereldnieuws en ruis).
- **Staff-tab:** toon de brief van deze zomer met de status per punt, en de "His signings" met scoutcijfer → Hit/Miss.

## Wat er vaststaat (niet heronderhandelen)
- De voorzitter kiest, keurt en ordent geen spelers, en er zijn geen telefoontjes in de zomer.
- De clublaag weet niets van de voorzitterslaag. De zomer draait ook zonder voorzitter (`tdSummerAuto`).
- Fictieve wereld. UI in het Engels, volgens de templates (keuze 64): chips, iconen, maximaal twee zinnen.
- Seeded RNG. Oude saves blijven laden: nieuwe velden krijgen een veilige default.
- Mobiel: 390 px, tikdoelen van minstens 44 px, tekst van minstens 13 px, en de animaties gaan uit bij `prefers-reduced-motion`.
- **Tijd:** de hele zomer, inclusief vergadering en mandaat, duurt 3–4 minuten. De ticker loopt vanzelf en kan worden overgeslagen.

## Werkwijze
1. **Fase A, templates.** `templates/zomer-templates.html` met de schermen meeting, brief, ticker, editie en debrief, met voorbeelddata (een fictieve club en een TD met een zwak oog, zodat één A-cijfer later een Miss wordt). Leg dit voor aan de eigenaar.
2. **Fase B, bouwen** (na akkoord), in deze volgorde:
   - scoutcijfers en Plan A/B op naam in het plan;
   - de brief;
   - de ticker naar zes weken met het bord, oefenwedstrijden en leesgewicht;
   - "Missed" mogelijk maken;
   - de editie;
   - de debrief met strikes;
   - de winter op dezelfde machine;
   - de Staff-tab.
3. **Fase C, testen** en een speeltest door de eigenaar.
4. **Vastleggen:** het besluitenlog, `TD-VOORZITTER.md` naar v0.5, en commit en push naar `voorzitter-fundering`.

## Testen (meld eerlijk wat faalt)
- `node build.js`, daarna `foundation-test`, `chairman-audit`, `identity-test`, `opening-test`, `mobile-audit`, `ui-season` en `td-test`.
- **`td-test` uitbreiden:**
  - elke zomer heeft een brief met 2–3 punten;
  - het cijfer van de editie is over 20 seeds gespreid (niet altijd B);
  - 10–25% van de prioriteiten wordt gemist;
  - een TD met eye 1 geeft aantoonbaar vaker een A aan een speler die later Miss wordt dan een TD met eye 5;
  - de debrief onderscheidt pech van eigen fouten (een kaping telt als markt);
  - de ticker heeft 6 weken met 3–6 regels per week en oefenwedstrijden in week 4 en 5;
  - de winter draait op dezelfde machine zonder fouten.
- **Mobiele audit** op alle nieuwe schermen, met screenshots op 390 px gebundeld in één strip.
- **Speeltest door de eigenaar:** "Wist ik vóór de zomer waar mijn TD op zou worden afgerekend, hoopte ik op Plan A, en voelde het oordeel achteraf eerlijk?"

## Wat je níét doet
- Geen onderhandeling met de TD over zijn plan, geen telefoontjes en geen wens van de voorzitter (keuze 66, 68 en 70).
- Geen scoutingscherm of database om in te zoeken. Je ziet alleen de targets van zijn plan.
- Geen cijfers voor het vakmanschap van de TD in de UI. Het scoutcijfer is zijn oordeel over een speler, niet een score van de TD.
- Niet bouwen voordat de templates zijn goedgekeurd.
