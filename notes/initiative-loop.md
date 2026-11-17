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
