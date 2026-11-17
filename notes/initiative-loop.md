# The Executive Initiative Loop (CEO-2): wat er gebouwd is

*Implementatienotitie. Dit is nog geen bijbelbesluit: B58 wacht op akkoord van de eigenaar.*

## De loop in het spel
1. **OBSERVE:** `signal()` kijkt naar de laatste vier competitieduels in `G.ft.games`. Er is een signaal bij:
   - ≥ 7 tegengoals → probleem in de verdediging;
   - ≤ 2 doelpunten → probleem in de aanval;
   - < 0,9 punt per wedstrijd terwijl de club > 2 plaatsen onder de verwachting staat → slechte resultaten.

   Is er geen probleem, dan is er ook geen signaal.
2. **INITIATE:**
   - Op het bureau verschijnt onder *Raise it yourself*: "12 goals conceded in four games: call in the coach and the DoF".
   - De afdelingen Recruitment en First team tonen *Agreements with you* met dezelfde knop.
   - Bij de DoF staat het onderwerp *The team* altijd in het gesprek (vanaf vier wedstrijden), ook zonder probleem.
3. **DISCUSS:** de DoF roept de coach en Finance erbij (`views()`). Elk spreekt vanuit zijn eigen vak:
   - **De coach** kijkt naar de prestaties. Zijn de kansen tegen hoog, dan zegt een coach met veel ego "te weinig kwaliteit" en een bescheiden coach "dat ligt aan mij, geef me tijd". Zijn de kansen tegen laag maar de goals hoog, dan zegt hij "pech, dat draait".
   - **De DoF** kijkt naar de selectie: de zwakste basisspeler in de linie tegenover het niveau van de eigen elf, plus de betrouwbare scoutingrapporten op die positie. Hij komt uit op "we moeten versterken", "eerst meer bewijs" of "de spelers zijn goed genoeg".
   - **Finance** kijkt naar het transferbudget en hoeveel weken de kas nog meegaat.
   - Elk van hen noemt zijn trackrecord uit eerdere initiatieven.
4. **AGREE:** de CEO kiest één van vier antwoorden.
   - **Back the coach.** Eigenaar: de coach. Hij krijgt vertrouwen en een tijdelijke boost en wordt beoordeeld na vijf wedstrijden.
   - **DoF fixes the position.** Eigenaar: de DoF. De positie gaat bovenaan het recruitmentplan, en als Finance het toelaat komt de helft van het transferbudget erbij (`rec.extra`). Beoordeling na het window. Vond de DoF dat er geen speler nodig was en heeft hij veel ego, dan weigert hij. De CEO kan het dan opdragen; dat wordt vastgelegd als *jouw* besluit.
   - **Joint review.** De scouts beginnen meteen. Na twee weken komen coach en DoF met één advies (`ini_joint`), gebaseerd op de stand van dat moment.
   - **Wait.** Er komt geen afspraak, en er volgt geen straf.
5. **EXECUTE:** elke week (`execute()`) logt de afspraak wat er echt gebeurde:
   - de punten, tegengoals en xG tegen sinds de afspraak;
   - het aantal scoutingrapporten;
   - of er een speler is getekend.

   Dat log staat onder *Still running* en bij de afdeling.
6. **REVIEW** (`verdictOf()`) zet de resultaten naast de cijfers eronder:
   - **worked:** de resultaten en de cijfers zijn beter;
   - **unlucky:** de cijfers zijn beter, de resultaten niet;
   - **lucky:** de resultaten zijn beter, de cijfers niet;
   - **failed:** niets is verbeterd;
   - **overtaken:** de ploeg herstelde zich voordat er iemand kwam;
   - **blocked:** er was nooit geld.

   Volgt er een stuk in de Gazette, een regel in de Record en een effect op de head, behalve als de CEO het zelf had opgedragen.
7. **CEO-oordeel** (`ini_review`): *Credit him*, *Hold him responsible* of *Circumstances. Move on*.
   - Wie een head de schuld geeft van pech of van je eigen opdracht, hoort dat terug en verliest meer vertrouwen.
   - Laat de CEO het liggen, dan blijft het bij geen oordeel.

## State
Alles zit in `G.agr` (dezelfde opslag als CEO-1). Het type `k: 'ini'` heeft deze velden:
- `kind` (`back` / `plan` / `joint`), `owner`, eventueel `with`;
- `S0`: de cijfers bij de start;
- `n0`: het aantal gespeelde wedstrijden bij de start;
- `by`, `log`, `funds`, `ordered`, `res`, `out` en het oordeel van de CEO (`ceo`).

Daarnaast `G.iniSeen` (de laatste keer dat de CEO "wait" koos). Een migratie is niet nodig: ontbrekende velden krijgen een veilige standaardwaarde.

## Bestanden
- `src/agreements.js`: het signaal, de standpunten, de afspraken, de uitvoering, de beoordeling en de twee vervolgevents.
- `src/talks.js`: het onderwerp en de antwoorden lopen via de bestaande gespreksmotor.
- `src/ui/08a-dept-parts.js`: meerdere sprekers in één gesprek.
- `src/ui/08-departments.js`: *Agreements with you*.
- `src/ui/10-inbox.js`: de knop op het bureau.
- `src/ui/15-actions.js`: de actie `ini-open`.
- `test/initiative.js`.

## Herziening na code review (vier P0-punten)

### 1. Afgesproken prioriteiten overleefden het rollende plan niet
- **Gereproduceerd:** ja.
- **Oorzaak:** `recruitx.js` (`squadPlanPrepare`) zette vanaf week 3 elke week `rec.plan.prios` opnieuw op de rijen van het winterplan.
- **Oplossing:** `F.agrPrios()` is de enige bron.
  - Het rollende plan voegt een afgesproken positie toe als rij met de reden "Agreed with the CEO in week X". Daardoor staat hij in het geschreven plan van de DoF en bij de scoutopdrachten.
  - De prioriteiten beginnen met de afgesproken posities.
  - `assignScouts` zet de eerste vrije scout op een afgesproken positie zolang er niemand op zit, in de regio waar de spelers zitten.
  - Als de afspraak klaar is (signing of beoordeling) valt hij weg, en daarna werkt de recruitment weer zelfstandig.
- **Test:** `test/initiative-fixes.js` §1.

### 2. Transfergeld werd dubbel geteld
- **Gereproduceerd:** ja. `rec.extra` was de helft van het transferbudget zelf, waardoor de koopkracht 1,5× het budget werd.
- **Oplossing:**
  - Het plan blijft standaard binnen het budget.
  - Het geld komt alleen uit de beschermde reserve als de CEO daar expliciet voor kiest ("…and allow up to £X from the reserve"). Dat bedrag is hooguit 40% van de kas boven het transferbudget, en er is niets beschikbaar als de kas nog maar ≤ 10 weken meegaat.
  - `extraAuth()` in `recruit.js` begrenst live: budget plus autorisatie is nooit meer dan de kas.
  - De autorisatie vervalt bij een signing of aan het einde van de afspraak.
  - Twee afspraken tellen niet bij elkaar op (het maximum telt, niet de som).
- **Test:** `test/initiative-fixes.js` §2.

### 3. Een joint review veranderde al beleid
- **Gereproduceerd:** ja. Het starten van een joint review riep `recPrioritise` aan.
- **Oplossing:**
  - Een onderzoek verandert geen prioriteit en kent geen geld toe.
  - Het advies komt na twee weken terug, gebaseerd op de stand van dat moment.
  - Laat de CEO het liggen, dan blijft alles zoals het was (`auto: 2`).
- **Test:** `test/initiative-fixes.js` §3.

### 4. Uitvoering en uitkomst liepen door elkaar
- **Oplossing:** `assess()` geeft drie aparte regels:
  - **Decision:** het bewijs bij de start (de zwakte, de rapporten, wie wat adviseerde), en of de CEO het opdroeg.
  - **Execution:** voor de DoF de rapporten, approaches, weken scoutwerk, de signing en de reden als het niet lukte (geld of mandaat); voor de coach de kansen voor en tegen.
  - **Outcome:** de resultaten en de cijfers eronder.
- De head krijgt een effect op basis van zijn **uitvoering**, niet van de uitslag:
  - delivered: +;
  - improved: +;
  - tried of blocked: 0;
  - idle of worse: −.
- Het oordeel van de CEO werkt door: wie een head de schuld geeft van goed werk of van een eigen opdracht, verliest meer vertrouwen.
- **Test:** `test/initiative-fixes.js` §4, plus geen herhaalde reviews en oude saves.

## Financiële integriteit (tweede review, vanaf 55a131d)

### Drie lagen geld, apart gehouden (`recruit.js`)
1. **Bevoegdheid:** het transferbudget dat Finance berekent (`transferBudget()`, elke keer opnieuw uit de kas), plus **uitzonderingen met een doel**:
   - een CEO-afspraak voor **één positie** (`F.agrAuthFor(pos)`, met `funds` en `used` per afspraak);
   - een CEO-uitzondering voor **één speler** (`rec.extra` met `rec.extraPid`).

   Een uitzondering helpt nooit een andere deal (`extraAuth(p)`).
2. **Verplichting:** biedingen die openstaan in andere onderhandelingen (`committed()`). Hetzelfde geld kan geen twee biedingen dekken. `capFor(p, x)` trekt ze af.
3. **Afrekening:** de kas gaat pas omlaag bij `F.sign`. Vlak daarvoor rekent Finance in `wagePhase` opnieuw na met de kas en het plafond van dat moment (`liveCap`).
   - Past de deal nog binnen het plafond, dan gaat de DoF terug met een lager bod.
   - Past hij niet meer, dan gaat de deal niet door, met de reden erbij.
   - Ook elke onderhandelingsronde volgt het actuele plafond.

### Eén manier om de reserve aan te spreken (`agreements.js`)
`liveOffer()` is de enige plek waar een uitzondering wordt geprijsd. Die werkt altijd met de cijfers van dat moment:
- de kas boven het transferbudget, min de uitzonderingen die al zijn toegekend, min de openstaande biedingen;
- daarvan hooguit 40%;
- niets als de kas nog 10 weken of minder meegaat.

Zowel de directe route als de joint review gebruiken hem. Het advies van de joint review legt geen bedrag vast. De CEO kiest apart "within budget" of "…and allow up to £X from the reserve", en dat bedrag wordt berekend op de dag van het besluit. Laat hij het liggen, dan verandert er niets (`auto: 3`).

### Gebruik en vrijgave
- Een signing op die positie gebruikt de uitzondering alleen voor het deel boven het gewone budget (`F.agrUse`). Dat komt in het log van de afspraak.
- Wat over is, vervalt zodra de afspraak klaar is (signing of beoordeling).
- Een uitzondering voor één speler vervalt als die deal mislukt.

### Gevonden tijdens de end-to-end test
Een afgesproken positie telde in `dofPipeline` niet als "gewenst". Daardoor kon de DoF hem laten liggen als de selectie al groot was. Dat is hersteld.

### Tests
`test/transfer-integrity.js` doorloopt de echte pipeline: aanraden, onderhandelen, ondertekenen, met de kascontrole bij elke ondertekening. Het dekt:
- de uitzondering gebruikt voor een signing op de juiste positie, en daarna vrijgegeven;
- een niet-gerelateerde speler die er niet bij kan;
- de joint review zonder bedrag, met een aanbod dat op de dag van het besluit wordt herberekend, en die bij negeren niets verandert;
- een kas die daalt tijdens de onderhandeling;
- twee concurrerende deals;
- opslaan tijdens een onderhandeling;
- een gewone signing zonder initiatief.
