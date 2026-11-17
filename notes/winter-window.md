# Ontwerpnotitie: het winterwindow als eigen fase (B50)

**Doel.** Het winterwindow krijgt dezelfde behandeling als de zomer, en alleen binnen een window mag er verkocht worden (B49).
**Pijler.** Leiden zonder alles zelf te doen: de DoF stelt een plan voor, jij tekent, hij voert uit en legt achteraf verantwoording af.

**Wat de speler ziet.** Na de wedstrijd van week 16 opent het winterwindow als een eigen fase (de wedstrijden staan stil, zoals in de zomer):
1. *Winter meeting* met DoF, financiën, coach en scout: de stand halverwege, het geld, wat we nodig hebben, de winterbrief om te tekenen.
2. *The window*: een ticker van drie weken waarin de DoF de brief uitvoert (met oproepen waarbij jij beslist), dan deadline day.
3. *Winter edition*: de krant met cijfer A–E, wat er binnenkwam en vertrok, en of de brief gehaald is.
4. *Debrief* met de DoF (prijzen, doorvragen, waarschuwen, mandaat aanpassen), dan terug naar het seizoen op week 17.
Vervalt tegenover de zomer: contractverlengingen, vriendschappelijke wedstrijden, seizoensdoelen en pre-season.

**State.** Geen nieuwe meter. `G.sum` krijgt `win: true`; `G.winDone = seizoen` onthoudt dat het window geweest is; `G.lastWinter` bewaart de uitkomst. Geen migratie: een oude save zonder `winDone` opent het window zodra hij week 17 bereikt.

**Hoe.** `summer2.js` krijgt een winterstand (stappen, weken, teksten, diagnose van de eerste helft); `summer.js` krijgt `winterOpen` en `winterFinish`; het window wordt in de UI geopend als het wedstrijdscherm van week 16 sluit (net als de zomer is het een scherm, geen headless gebeurtenis); `window_()` houdt de oude weken 17–18 alleen aan zolang er geen winterfase is geweest (de testsimulaties zonder UI). `recruit.js` telt aankopen in het winterwindow als winter (`W`).

**Testen.** Nieuwe `test/winter.js`: de fase opent in week 17, een afgesproken verkoop wordt in het window afgehandeld, `sum2Auto` sluit het winterwindow terug naar het seizoen, een save midden in het window laadt, en daarna loopt het seizoen door. Bestaande tests moeten hetzelfde blijven; browsercheck op 390 px.
