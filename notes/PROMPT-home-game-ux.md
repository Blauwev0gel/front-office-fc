# Prompt: het homescherm als game, niet als dashboard

*Voor Claude op `claude-game`. De eigenaar, bij een screenshot van het tiles-prototype (B60): "Dat is geen spel meer. Je denkt niet meer als game developer." Hij heeft gelijk. Het scherm is een inbox met kaders: tekst in vakken, alles even zwaar, met ontwikkelaarstaal ("Your say, if you want it", "Running: Nothing", "Nash made the call"), zonder plek, gezichten, sfeer of beloning.*

---

## Wie je bent bij deze opdracht
Je bent **game designer en UX-designer voor mobiele games**, niet een ontwikkelaar die data op een scherm zet. Je eerste vraag is nooit "welke informatie moet erop?", maar: **"wat moet de speler voelen als hij dit scherm opent, en wat wil hij dan doen?"**

Nederlands in het gesprek, Engels in het spel. Volg `CLAUDE.md` en de bijbel. Een featurestop geldt: je verandert presentatie en flow, geen spelregels.

## Wat er mis is (begin hier, en zeg het hardop)
Analyseer het huidige homescherm (screenshot in het gesprek, of maak er zelf een op 390 px) als game designer:
- **Geen plek.** Waar ben ik? Een spel heeft een wereld: een kantoor, een bestuurskamer, een stadion in de verte. Hier zijn het grijze vakken.
- **Geen focus.** Alles is even groot en even belangrijk. Het oog weet niet waar het moet beginnen.
- **Geen mensen.** Het spel gaat over mensen (P1, P7), maar je ziet geen gezicht dat iets van je wil.
- **Geen spanning en geen beloning.** Niets maakt nieuwsgierig naar zaterdag, en niets voelt als vooruitgang.
- **Tekst in plaats van taal.** Systeemzinnen in plaats van een stem.
- **Uitleg in de weg.** Het tutorial-blok "This week… Got it" staat bovenaan als eerste indruk.

Noem per punt wat de speler mist, niet wat de code doet.

## Onderzoek: hoe games dit oplossen (kort, geen kopie)
Beschrijf hoe **managementgames en mobiele games** hun hoofdscherm opbouwen, en waarom. Kopieer niets: geen namen, geen look. Kijk naar:
- **een thuisbasis als plek** (een kantoor, een kamp, een stad) die verandert als je vooruitgaat;
- **één duidelijke volgende actie** (de grote knop), plus een paar zachte uitnodigingen;
- **personages die je aanspreken** in plaats van meldingen;
- **een ritme**: wat is er nieuw sinds de vorige keer (een klein moment, een animatie, een "+");
- **progressie die je ziet**: de club groeit zichtbaar (stadion, kantoor, prijzenkast);
- **leesbaarheid op een telefoon**: één focuspunt, weinig tekst, grote tikdoelen, duim-zone.

Vertaal elk patroon naar **ons** spel: de CEO-fantasie (B58), de krantentoon, krantenroze, Oswald en Source Serif, clubkleuren, licht en donker.

## Ontwerp: drie echt verschillende concepten
Maak **drie concepten** die van elkaar verschillen in idee, niet alleen in layout. Bijvoorbeeld:
1. **Het kantoor**: een illustratie van de bestuurskamer of het kantoor. De mensen die iets willen, staan in de deur (gezichten); de krant ligt op tafel; het raam toont het stadion (groeit mee met de club). Weinig tekst, alles tikbaar in de scène.
2. **Aftellen naar zaterdag**: de wedstrijd is het hart. Grote clubkleuren, de tegenstander, wat er op het spel staat. Daaronder alleen wie je nog wil spreken ("2 people at your door").
3. **De krant van de week**: het homescherm ís de voorpagina van de clubkrant. De kop is de week, de foto's zijn je mensen, en de rubrieken zijn tikbaar.

Per concept:
- **De fantasie** in één zin: wat voelt de speler?
- **Het focuspunt**: waar kijkt het oog als eerste?
- **De ene hoofdactie.**
- **Wat er verdwijnt of naar een tweede laag gaat.** Er gaat geen functionaliteit verloren; zeg waar het naartoe gaat.
- **Hoe het verandert** in een rustige week, een crisis, een derby en na een promotie.
- **Wat de speler ziet als nieuw** sinds vorige week.
- **De taal:** schrijf alle teksten op het scherm in de stem van het spel. Geen "Your say, if you want it", geen "Nothing", geen "made the call".
- **Risico's:** wat kan er misgaan in leesbaarheid, toegankelijkheid of bouwwerk?

## Regels (bindend)
- **Eén focuspunt** per scherm, en **één** hoofdknop.
- Hooguit **±25 woorden** op het homescherm zonder te tikken. De rest zit achter een tik.
- **Gezichten vóór tekst**: wie iets van je wil, zie je als persoon.
- **Geen dashboardtaal.** Elke regel klinkt als iemand uit het spel, of als de krant.
- **Geen tutorialkaart bovenaan.** Uitleg komt één keer, klein en op de plek zelf, of via de ?-knop.
- Een **rustige week voelt rustig, niet leeg.** Er is altijd iets om naar te kijken (de krant, het stadion, je selectie), maar niets wat je verplicht moet doen.
- 390 px, licht en donker, tikdoelen ≥ 44 px, WCAG AA, `prefers-reduced-motion`.
- Bestaande illustraties eerst: de gezichten (`ART.staffFace`, `ART.playerFace`), het stadion uit de wedstrijdvoorbeschouwing (`mdStadium`) en de crest. Nieuwe illustratie mag, maar alleen als het concept erom vraagt, en eenvoudig (SVG).
- Geen echte clubs, merken of spelers. Kopieer geen bestaand spel.

## Oplevering, en stop
1. `notes/home-ux.md`, hooguit 3 pagina's: de analyse, het korte onderzoek en de drie concepten.
2. **Drie klikbare prototypes** in één artifact (tabs of naast elkaar), met echte voorbeelddata van drie weken: rustig, crisis en derby. Licht en donker, op 390 px.
3. Jouw **aanbeveling** met reden, en hooguit drie vragen aan de eigenaar.

**Stop daarna.** De eigenaar kiest. Pas dan bouw je het gekozen concept in het spel, met tests en een browsercheck, en daarna (één voor één, met akkoord) dezelfde taal en focus voor de schermen die vanaf het homescherm openen.

## Toets
Laat het homescherm aan jezelf zien als iemand die het spel nooit speelde. Binnen 3 seconden moet hij kunnen zeggen: **"Ik ben de baas van deze club, dit is wat er speelt, en dáár tik ik nu op."** Kan dat niet, dan is het geen goed homescherm.
