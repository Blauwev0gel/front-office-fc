# Audit en reset: terug naar een spel dat je snapt

*18-11-2026. Gemeten in de code en in de browser, niet geschat. Bij de core die de eigenaar vandaag vastlegde.*

## 1. De core (eigenaar, bindend)
1. De CEO zet een club op.
2. De transferzomer wordt gerund door de TD; **de selectiepuzzel staat centraal**.
3. Het seizoen begint. Elke afdeling adviseert: wat willen ze bereiken, wat hebben ze nodig, wat is hun doel? Jij helpt ze en houdt ze verantwoordelijk.
4. Diepte per afdeling. **De TD is de algemene baas**: spelers, contracten, de selectiepuzzel en de diepte van de selectie. Er is een scoutingsysteem dat jij zelf kunt sturen.
5. Een jeugdacademie met een pijplijn van jonge leeftijd tot het eerste, met verhaallijnen.
6. Hetzelfde voor commercial, marketing en finance.
7. Elke week gebeurt er iets waarop je reageert. Er zijn **meters die je in het groen moet houden**, anders lig je eruit.
8. Elke week een tekstwedstrijd.

**Liever simpel en later uitbreiden dan andersom.**

## 2. Wat er mis is (gemeten)
| Bevinding | Cijfer | Waarom het stroef voelt |
|---|---|---|
| **Te veel besluiten, te snel** | 148 commits en 13 ontwerpbesluiten (B53–B65) in twee dagen; 64 besluiten in totaal | Elk scherm is de afgelopen dagen minstens één keer omgegooid. Niets voelt vertrouwd |
| **Lange weg naar de eerste wedstrijd** | ±33 tikken voor de setup, daarna ±16 in de zomer (vergadering, ticker, deadline day, krant, debrief, drie projecten, twee focusdoelen) | Je speelt pas na ±50 tikken. Een mobiel spel moet je binnen een minuut laten spelen |
| **Te veel systemen** | 35 logicamodules, 1,16 MB code, ±145 functies op `F` | Naast de core draaien er systemen die je nooit gevraagd hebt: gemeente en trainingscomplex, initiatieven, afspraken, dossiers, bevoegdheden per head |
| **Dubbele generaties** | `events` / `events2` / `events3`, `academy` / `2` / `3`, `summer` / `summer2`, `weekflow` / `weekloop` / `loop`, `recruit` / `recruitx` | Dezelfde regel staat op meerdere plekken; een fix op de ene plek breekt de andere |
| **Haken die elkaar overschrijven** | `seasonAfterMatch` wordt 19× vervangen, `effBonus` 3× (en één keer zonder de vorige aan te roepen) | Volgorde bepaalt het gedrag; onvoorspelbaar |
| **Dode code** | 11 functies worden nergens meer aangeroepen (oude bureaublokken); de oude CSS van het bureau staat er nog | Ruis, maar geen gevaar |
| **Meters onduidelijk** | Stemmingen van bestuur, fans, pers en kleedkamer staan nu achter een tik in Club | Kern 7 ("houd ze in het groen") is niet zichtbaar op het moment dat het telt |
| **Week zelf is niet het probleem** | 1–2 besluiten per week, ±150–200 woorden op het homescherm | De week is rustig genoeg; het probleem zit vóór de eerste wedstrijd en in alles eromheen |

**Tests:** de meeste tests zijn groen. Een paar geven geen duidelijk oordeel (`audit`, `acad`, `mig`, `budget`), en `rec` print "undefined" in zijn uitvoer; die moeten nagekeken worden.

## 3. Core tegenover wat er nu is
| Core | Wat er nu is | Voorstel |
|---|---|---|
| 1. Club opzetten | DNA in 8 stappen + 7 heads aannemen + mandaten | **Inkorten:** naam en kleuren, 3 DNA-keuzes, heads krijg je voorgesteld (je mag wisselen) |
| 2. Zomer, TD, puzzel | Vergadering met 5 vragen, ticker, deadline day, krant, debrief | **Eén scherm: de puzzel.** De selectie per positie, waar het gat zit, wat de TD doet. Jij keurt grote deals goed. Ticker en deadline day blijven als korte samenvatting |
| 3. Seizoensstart met afdelingen | Drie projecten goedkeuren + twee focusdoelen + B57-afspraken | **Eén ronde langs de afdelingen:** per afdeling één doel, één verzoek (geld of steun), jij zegt ja of nee. Dat is meteen waar je ze op afrekent |
| 4. Diepte, TD de baas, scouting | Recruitment-kamers, scoutingportal, squad plan | **Houden.** TD wordt "Football" (selectie, contracten, scouting) |
| 5. Academie met pijplijn | Piramide, trial day, pathway-verhaal, credibility | **Houden**, pathway wordt de verhaallijn van de academie |
| 6. Commercial, marketing, finance | Kamers met stadion, sponsors, campagnes, budgetten | **Houden**, eenvoudiger |
| 7. Reageren en meters | Inbox (Needs you), stemmingen achter een tik | **Meters bovenaan het homescherm**, met kleur en "onder X lig je eruit" |
| 8. Tekstwedstrijd | Wedstrijdscherm met ticker en krant | **Houden** (het sterkste deel) |

**Parkeren** (uitzetten, code blijft bestaan, later terug als het past):
- gemeente en trainingscomplex (B58/B59);
- initiatieven (CEO-2) en afspraken (B57);
- dossiers;
- bevoegdheidsniveaus per head;
- weddenschappen en het gesprek na de wedstrijd.

Zo ontstaat een kern van zes systemen waar alles achter klopt.

## 4. Het plan, in vier fasen
1. **Core vastleggen** (vandaag): de core als besluit in de bijbel. Featurestop: niets nieuws tot fase 2 af is.
2. **Flow-reset**: van nieuw spel naar de eerste wedstrijd in **±15 tikken**: kort opzetten → de zomerpuzzel met de TD → de seizoensronde langs de afdelingen → wedstrijd. De meters komen bovenaan het homescherm. Geparkeerde systemen gaan uit.
3. **Opschonen** (fase 2 uit CLAUDE.md): dubbele generaties samenvoegen, haken op één plek, dode code weg, tests weer allemaal eenduidig groen. Zonder gedrag te veranderen.
4. **Diepte per afdeling**, één voor één en met jouw akkoord: eerst de TD (puzzel en scouting), dan de academie (pijplijn en verhaallijnen), dan commercial, marketing en finance.

Elke fase eindigt met een speelbare preview en een korte check van jou.

## 5. Drie vragen aan de eigenaar
1. Mogen de systemen onder "parkeren" uit (code blijft, later terug)?
2. Welke meters wil je in het groen houden? Voorstel: **Bestuur, Fans, Kas en Kleedkamer**. Pers valt dan weg als meter.
3. Akkoord om met fase 2 (de flow-reset) te beginnen?
