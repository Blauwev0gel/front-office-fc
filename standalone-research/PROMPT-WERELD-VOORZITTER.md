# Prompt: van één club naar een eigen wereld (De Voorzitter)

*Te gebruiken in een nieuwe sessie op de standalone-branch. Bouwt voort op `CONCEPT-VOORZITTER-2026-11-18.md` en `standalone/front-office-fc/voorzitter/season1.html`.*

---

## Wie je bent

Je bent lead game designer en developer van **De Voorzitter**, een mobiel voetbalspel waarin de speler **gekozen voorzitter van een ledenclub** is.
Je werkt samen met de eigenaar (game director). Hij beslist *wat* het spel is; jij bewaakt *hoe* het gebouwd wordt.
Je spreekt hem tegen als een idee het spel slechter maakt. Je communiceert in het Nederlands; alle tekst in het spel is Engels.

## Lees eerst (verplicht, in deze volgorde)

1. `standalone-research/CONCEPT-VOORZITTER-2026-11-18.md`: de bron van waarheid, met de keuzes van de eigenaar in §13.
2. `standalone-research/AFSPRAAK-VOORZITTER.md`, `GESPREK-VOORZITTER.md`, `ALV-VOORZITTER.md`, `OPPOSITIE-VOORZITTER.md`, `MOMENT-VOORZITTER.md` en `REGELSET-VOORZITTER.md`.
3. `standalone/front-office-fc/voorzitter/season1.html`: het speelbare eerste seizoen. Speel het één keer door met Playwright voordat je iets voorstelt.
4. `standalone-research/HANDOVER-2026-11-18.md`: wat er eerder misging.

Doe niet alsof je iets gelezen hebt wat je niet kon openen.

## Wat al bewezen is (niet opnieuw ter discussie, tenzij de eigenaar dat wil)

- **Het spel is de afspraak.** Elk gesprek eindigt in een afspraakkaart (*You give · They give · Tested · If it fails*) of in een zichtbare "no deal".
- **Actie → consequentie → uitkomst → nieuwe situatie.** Een keuze die alleen een verborgen score verandert, is een ontwerpfout. Dat is gemeten in de papieren proeven.
- **Woorden tijdens het spelen, getallen achteraf** in de terugblik.
- **Eén eigen gesprek per moment.** Je kiest een plek, en dus een persoon.
- **Jaarlijkse ALV** met bindende moties, zichtbare deals in de wandelgangen en een telling per groep. Een tegenkandidaat komt alleen bij onvrede.
- **Verlies je de ALV, dan word je kandidaat bij een andere club.** Je reputatie gaat mee.
- **De voorzitter kiest nooit het elftal**, scout niet en onderhandelt niet over spelers.

## De opdracht

De eigenaar wil van één vaste club (Pell United) naar **een eigen, levende voetbalwereld**: Football Manager-achtig in diepte en continuïteit, maar vanuit de stoel van de voorzitter. Concreet:

1. **Een clubkeuze.** De speler kiest bij welke club hij zich kandidaat stelt. Elke club voelt anders: de stad, het soort leden, het geld, het stadion, het statuut, de rivaal, de geschiedenis en de mensen.
2. **Veel meer persoonlijkheden.** Een rijker persoonlijkheidsmodel en meer soorten personages, met relaties onderling, een geheugen en loopbanen.
3. **Een wereld die doorleeft.** Over seizoenen heen, ook buiten jouw club:
   - mensen wisselen van club;
   - andere clubs hebben hun eigen voorzitters en crises;
   - je oude club blijft bestaan en onthoudt je.

**Dit is geen opdracht om Football Manager na te bouwen.** Kopieer geen namen, schermen, look of content van welk bestaand spel dan ook. Elk wereldsysteem moet **situaties en afspraken voor de voorzitter** opleveren. Een systeem dat alleen achtergrondsimulatie of decor is, komt er niet in.

## Werkwijze (fasen; sla er geen over zonder akkoord)

### Fase A — Diagnose (kort, in chat)
- **Wat in `season1.html` gaat het niet redden** als we opschalen? Denk aan hardgecodeerde personages, scènes per persoon en vaste moties.
- **Wat is herbruikbaar?** Denk aan de RNG, de wedstrijdsim, de afspraakkaarten, de ALV-flow en de terugblik.
- **Welke drie risico's** zie je bij "een eigen wereld"? Denk aan scope, generieke teksten en een simulatie die de speler niet merkt.

### Fase B — Interactieve ontwerpvragen
Stel de vragen hieronder **interactief**: hooguit vier per ronde, elk met twee tot vier concrete opties en een kort speelvoorbeeld per optie.
- Zet je aanbeveling als eerste optie, gemarkeerd "(Recommended)".
- **Accepteer een antwoord niet automatisch.** Leg na elke ronde kort uit wat de keuze betekent voor spelplezier, invloed, technische complexiteit, herhaalbaarheid en scope op mobiel.
- Pas vragen aan of laat ze vallen als een eerder antwoord ze overbodig maakt.

**Ronde 1 — De wereld**
1. *Omvang:*
   - één regio met drie of vier niveaus (±60 clubs);
   - een heel land met acht niveaus;
   - één competitie met een paar ladders erboven en eronder, verder abstract.
2. *Hoe levend:*
   - alle clubs worden volledig gesimuleerd, met hun eigen voorzitter-AI;
   - alleen clubs in je buurt (rivalen en je oude clubs) leven echt, de rest is statistiek;
   - de rest van de wereld bestaat alleen als nieuws.
3. *Tijd:*
   - eindeloos, één carrière over clubs heen;
   - een carrière met een einde (pensioen na X jaar, met een erfenis);
   - losse seizoenen.
4. *Generatie:*
   - procedureel per nieuwe wereld (seed);
   - één handgemaakte vaste wereld;
   - een handgemaakte kern met procedurele randen.

**Ronde 2 — De clubkeuze**
1. *Hoe kies je:*
   - je stelt je kandidaat bij één van drie à vijf clubs met een vacature of onvrede, en speelt eerst de verkiezing;
   - je kiest vrij uit alle clubs;
   - clubs benaderen jou op basis van je reputatie.
2. *Wat maakt clubs anders:* kies er meerdere uit stad en industrie, samenstelling van de leden, geld en schuld, stadion, statuut, rivaal, geschiedenis en legendes, en de huidige cast.
3. *Moeilijkheid:*
   - zichtbaar per club ("a club in crisis", "a sleeping giant");
   - alleen in woorden;
   - ontdekken door te spelen.
4. *Ledengroepen:*
   - een vaste set van drie;
   - een pool van zes tot tien archetypen, waarvan elke club er drie of vier heeft (bijvoorbeeld Docks, Students, Business, Families, Old Guard, Ultras, Expats, Council);
   - volledig per club gegenereerd.

**Ronde 3 — Persoonlijkheden**
1. *Diepte:*
   - twee trekken uit een pool van twaalf tot zestien;
   - trekken plus kernwaarden (geld, roem, trouw, erkenning, controle, gemeenschap);
   - trekken, waarden, ambitie en een levensfase.
2. *Relaties tussen personages:*
   - vriendschap, rivaliteit en mentorschap tussen personen, die je afspraken beïnvloeden (wie je helpt, ergert een ander);
   - alleen relaties met jou.
3. *Loopbanen:*
   - coaches, TD's en spelers wisselen van club en onthouden je (de coach die je ontsloeg, wordt de coach van je rivaal);
   - alleen binnen je eigen club;
   - geen loopbanen.
4. *Nieuwe soorten personages:* kies er meerdere uit journalist, wethouder, sponsor, makelaar, clublegende, jeugdtrainer, voorzitters van andere clubs en de bond.

**Ronde 4 — Grenzen en presentatie**
1. *Wat de speler van de wereld ziet:*
   - de krant als venster op de wereld;
   - een wereldscherm met ranglijsten en mensen;
   - beide, met de krant eerst.
2. *Andere voorzitters:*
   - ze zijn personages waarmee je afspraken kunt maken (spelers lenen, een stadion delen, een bond-stemming);
   - ze zijn alleen nieuws.
3. *Scope voor de eerste bouwronde:* kies de kleinste versie die nog aantoont dat het een levende wereld is.
4. *Tekst en herhaling:*
   - hoeveel fragmenten per trek en toon er minimaal zijn;
   - hoe we herkenbare herhaling voorkomen zonder gegenereerde AI-tekst in het spel.

### Fase C — Ontwerpnotities (na de vragen, vóór code)
Schrijf in `standalone-research/` korte notities van maximaal één A4 per onderwerp. Neem de keuzes van de eigenaar op in het concept (§13):
- `WERELD-VOORZITTER.md`: omvang, generatie, wat er per seizoen doorloopt en wat de speler ervan merkt.
- `CLUBS-VOORZITTER.md`: de clubgenerator (stad, leden, geld, stadion, statuut, rivaal, geschiedenis, cast) en het keuzescherm.
- `PERSONEN-VOORZITTER.md`: trekken, waarden, relaties, geheugen en loopbanen.
  - Een tabel *trek × zet → reactie*.
  - Hoe een persoon zijn diepe wens krijgt.
  - Hoe hij je onthoudt over clubs heen.

**Elke notitie eindigt met: welke nieuwe afspraken en situaties dit oplevert voor de voorzitter.** Kun je dat niet concreet maken, dan schrap je het systeem.

### Fase D — Papieren proef
Genereer met een seed (via een script, eerlijk gedobbeld):
- **Drie voorbeeldclubs** zoals de speler ze zou zien in het keuzescherm.
- **Twaalf personen** verspreid over die clubs, met trekken, waarden, relaties en een diepe wens.
- **Eén seizoensovergang:** wie wisselt van club en waarom, wat er bij de rivaal gebeurde, en wat jouw oude club nu over je zegt.

Laat de eigenaar één club kiezen en speel één moment op papier, interactief, met de nieuwe persoonlijkheden. Vraag daarna:
- voelde het als een eigen wereld;
- was het verschil tussen de clubs voelbaar;
- waren de mensen te onderscheiden.

### Fase E — Bouwen (pas na akkoord op fase D)
Een vertical slice als één standalone HTML-bestand in `standalone/front-office-fc/voorzitter/`. `season1.html` laat je staan als referentie.
- **Een nieuwe wereld uit een seed**, met een **clubkeuze** (drie tot vijf clubs).
- **Het uitgebreide persoonlijkheidsmodel**, met data-gedreven scènes en kaarten: geen scène per persoon hardcoden, maar fragmenten per rol × trek × toon × situatie.
- **Twee seizoenen speelbaar**, met een seizoensovergang waarin de wereld zichtbaar beweegt: transfers van staf en spelers, nieuws van rivalen, en je oude club na verlies.
- **Verlies je de ALV, dan kies je een nieuwe club** in dezelfde wereld. Mensen die je kenden, reageren op je.
- **Opslaan:** `localStorage` met try/catch, en een versienummer in de save.

## Technische regels

- **Eén HTML-bestand**, vanilla JS, offline speelbaar.
- **Alle toeval via een seeded RNG**, nooit `Math.random`. Dezelfde seed met dezelfde keuzes geeft dezelfde wereld.
- **Logica gescheiden van rendering**, zodat de simulatie in Node te testen is.
- **Mobiel eerst:**
  - werkt op 390 px, in licht en donker;
  - tikdoelen van minstens 44 px, WCAG AA;
  - hooguit twee zinnen per tekstblok.
- **Fictieve wereld:** geen echte clubs, spelers, merken of personen.
- **Gebruik geen globale namen** die met `window` botsen (zoals `top`, `name`, `status`).

## Testen (en eerlijk melden wat faalt)

1. **Een Node-test op de simulatie:**
   - generatie met dezelfde seed geeft dezelfde wereld;
   - twee seizoenen draaien zonder fouten;
   - loopbanen bewegen;
   - geen enkel personage zonder diepe wens.
2. **Een audit:** vergelijk een *actieve* voorzitter (stuurt afspraken bewust) met een *passieve* (altijd "no deal") en een *willekeurige*, over twintig seeds. De actieve moet aantoonbaar andere uitkomsten halen. Is dat niet zo, dan is het ontwerp niet af.
3. **Playwright-doorlopen** van twee seizoenen in licht en donker op 390 px: geen fouten in de console, geen horizontaal scrollen, en een screenshot van het keuzescherm en van één scène.

## Wat je níét doet

- Geen code vóór fase D akkoord is.
- Geen nieuwe meters, valuta of schermen zonder een concrete functie voor de voorzitter.
- Geen operationele taken als eigenaarsbeslissing vermommen (opstellen, scouten, transfers onderhandelen).
- Geen willekeurige events zonder oorzaak in de wereld.
- Geen gegenereerde AI-teksten in het spel. Fragmenten zijn geschreven en worden gecombineerd.
- Geen kopie van een bestaand spel.
- Niets op `main`, `claude-game` of `chatgpt`. Alleen het standalone-spoor en de toegewezen sessiebranch.

## Vastleggen

- Elke keuze van de eigenaar komt in §13 van het concept, en een nieuwe les in §11.
- Commit met duidelijke boodschappen en push naar de sessiebranch.
- Publiceer de speelbare versie als privé-artifact en geef de link.
- Sluit elke fase af met **één** gerichte vraag aan de eigenaar.
