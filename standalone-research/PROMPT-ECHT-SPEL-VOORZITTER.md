# Prompt: van systeem naar voetbalspel (De Voorzitter)

*Branch `voorzitter-fundering`. Bouwt voort op `standalone/front-office-fc/voorzitter-fundering/`, het concept (`standalone-research/CONCEPT-VOORZITTER-2026-11-18.md`, keuzes 1–51) en alle ontwerpnotities in `standalone-research/`.*

---

## Wie je bent
Je bent lead game designer, game-feel designer en developer van **De Voorzitter**: een mobiel voetbalspel waarin de speler eigenaar en voorzitter van een ledenclub is.
Je werkt samen met de eigenaar (game director) en spreekt hem tegen als iets het spel slechter maakt.
Communicatie in het Nederlands; alle tekst in het spel is Engels.

## Het probleem
De eigenaar: *"Het is niet echt een voetbalspel momenteel."*

**Wat er wel is:**
- de systemen: een selectie, een TD binnen het mandaat, geld, spelers met verhalen, situaties op het bureau, de ALV en een regio met geheugen;
- de tests: de fundering draait zonder voorzitter, kaders veranderen het gedrag van de TD, situaties komen uit echte staat.

**Wat ontbreekt** (eerste diagnose, toets die zelf in fase A):
1. **De wedstrijd is geen hoogtepunt.** Je krijgt een uitslag met twee regels. Er is geen opbouw, geen sfeer, geen moment waarop je hart sneller gaat. De zaterdag hoort het hart van de week te zijn.
2. **Het seizoen heeft geen boog.** Er is geen titelrace, geen degradatiestrijd die je ziet aankomen, geen beker, geen deadline day en geen slotdag waarop alles samenkomt.
3. **Het voelt als formulieren.** Lijsten, panelen en tekst. Er zijn geen clubkleuren op het veld, geen wapen dat leeft, geen stadion, geen publiek, geen trofee.
4. **Er staat te weinig op het spel.** Een bewuste speler wint 39 van de 40 ALV's. Zonder kans op falen is er geen spanning, en dus geen spel.
5. **Er zijn geen beloningen.** Promotie, een bekerwinst of een record leveren geen moment op dat je wilt delen of onthouden.
6. **Je beslissingen worden niet zichtbaar op het veld.** De speler die je steunde in zijn crisis en de spits die de TD binnen jouw mandaat haalde, zie je niet terug als *jouw* uitkomst op zaterdag.

## De opdracht
Maak er **een spel** van dat onmiskenbaar **voetbal** is, terwijl de speler **voorzitter** blijft.
- Geen opstelling, geen tactiek, geen wissels, geen training.
- De emotie van voetbal moet je wél voelen: de zaterdag, de stand, de tribune, de derby, de beker, de laatste speeldag.
- En je moet zien dat jouw beslissingen daar het verschil maakten.

**Kernvraag bij elke feature:** voelt de speler hier iets, en komt dat gevoel voort uit iets wat hij als voorzitter deed?

## Wat blijft (bewezen, niet opnieuw ter discussie)
- **Het spel is de afspraak.** Actie → consequentie → uitkomst → nieuwe situatie.
- **De fundering draait zelf; de voorzitter zet het mandaat** in de zomervergadering met de staf.
- **Situaties uit echte staat**, met de kosten van niets doen zichtbaar.
- **De ALV** met moties, de gang en de telling. De regio met geheugen en loopbanen.
- **Woorden tijdens het spelen; geld als bedrag.** Mobiel 390 px, licht en donker.
- **Fictieve wereld**, seeded RNG, geen gegenereerde AI-tekst in het spel.

## Pijlers voor dit werk
1. **De zaterdag is het hart.** Elke week bouwt naar de wedstrijd toe, en de wedstrijd is kort, spannend en persoonlijk.
2. **Het seizoen is een verhaal met een boog:** een opening, een winter, een slot, en een finale die ertoe doet.
3. **Je ziet je club:** kleuren, wapen, tenue, stadion, publiek.
4. **Er staat iets op het spel:** echte kans op falen, en herstel dat je zelf verdient.
5. **Hoogtepunten worden momenten:** promotie, beker, records en afscheid krijgen een eigen scherm dat je onthoudt.
6. **Elke week iets leuks om te zien, en een club die je zichtbaar opbouwt** (toegevoegd door de eigenaar).
   - **Kort:** elke week een levendige feed met updates over je spelers, je staf, de regio en de stad. De wereld moet dynamisch genoeg zijn om verrassend te blijven.
   - **Lang:** een upgradeboom voor de club als plek, verdiend met punten uit de ALV, gehouden beloftes en sportieve mijlpalen.

## De wekelijkse laag: een levende feed en een club die groeit

### Keuzes van de eigenaar (bindend)
- **Geen wedstrijdpremies en geen weekdoelen.**
- **Het plezier zit in elke week naar leuke updates kijken,** in een wereld waar genoeg dynamisch gebeurt.
- **Een upgradeboom is welkom,** gekoppeld aan punten:
  - **punten uit:** de ALV (meer bij een ruimere herverkiezing), gehouden beloftes, sportieve mijlpalen (promotie, bekerrondes, een academiedebuut, records);
  - **gebroken beloftes kosten een punt.**
- **De boom bouwt de club als plek op:** stadion, academie, trainingscomplex, scouting en gemeenschap.
- **Updates verschijnen als een feed met kaarten.**

Dit herziet het verbod op een upgradesysteem uit de oorspronkelijke opdracht, op uitdrukkelijk verzoek van de eigenaar. Het blijft wel verbonden met het voorzitterschap: punten verdien je met je woord en met resultaten, niet met klikken.

### A. De feed: 4–6 kaarten per week
- **Elke kaart:** een gezicht, wapen of beeld; een kop van maximaal acht woorden; één zin. Tik voor meer: het spelersprofiel, de club, de persoon.
- **De belangrijkste kaart staat bovenaan:** iets over je eigen club, iemand die je kent, of je rivaal.
- **Vier bronnen.** Elke week minstens drie verschillende, gekozen naar relevantie:
  1. **Je spelers:** debuut, eerste doelpunt, vormdip, terugkeer na blessure, een verjaardag, vader worden, ruzie in de kleedkamer, een vriendschap, een speler die bij de jeugd meetraint, een speler die bijna stopt.
  2. **Je staf aan het werk:** de TD bij een wedstrijd elders, de uitslag van een jeugdteam, de coach die iets nieuws probeert, de financieel directeur over de kas.
  3. **De regio:** ontslagen, transfers, een club in de schulden, een wonderjongen bij de rivaal, een voorzitter die wordt weggestemd, en mensen die je kent die van club wisselen.
  4. **De stad en de fans:** een uitverkocht uitvak, een sponsor die stopt of begint, de gemeente met een plan, een clubicoon die jarig is, een supporter met een verhaal.

**Dynamiek, zodat het leuk blijft:**
- **Gebeurtenissen komen uit de simulatie** (vorm, blessures, loopbanen, de stand, het geld). Daarbovenop komt een **bibliotheek van kleine, gewone voetbalgebeurtenissen**: een verjaardag, een nieuw sponsorbord, het weer, een dorpsclub die de beker haalt.
- **Herhaling is begrensd:** geen dezelfde soort kaart binnen vier weken, en geen identieke zin binnen een seizoen.
- **Verhalen lopen door.** Een kaart kan een vervolg krijgen ("Reyes trained with the first team" → twee weken later "Reyes makes his debut"). Elke vierde week heeft minstens één vervolg.
- **Kaarten zijn meestal om te lezen, niet om te beslissen.** Beslissingen blijven op het bureau. Een kaart mag wel naar een situatie leiden als er echt iets speelt.

### B. De upgradeboom: de club als plek
- **Vijf takken, elk 3–4 niveaus:** stadion, academie, trainingscomplex, scouting, gemeenschap.
- **Elk niveau verandert iets zichtbaars en heeft een echte afweging:**
  - **kosten:** punten en meestal ook geld;
  - **een gevolg dat je ziet:** meer plaatsen en een vollere tribune; een extra jeugdteam en meer debuten; minder blessures; betere vrije spelers in beeld van de TD; meer fans en een andere stemming bij de leden;
  - **soms een bijwerking:** onderhoud dat geld kost, of een ledengroep die het niet wil.
- **Een upgrade verschijnt in de feed** als moment: *"The new East Stand opens: 900 more seats"*. Hij is zichtbaar in de identiteit van de club, zoals de tribunekaart en het stadion.
- **De boom past bij een ledenclub:** grote upgrades (bijvoorbeeld een nieuwe tribune) kunnen een **motie op de ALV** vragen. Het statuut kan dan in de weg zitten.
- **Geen gratis winst.** Punten zijn schaars (±3–8 per seizoen). Je kiest per seizoen één à twee upgrades.

### C. Ritme van beloningen
| Niveau | Hoe vaak | Wat |
|---|---|---|
| Elke week | 30–90 seconden | De feed: iets verrassends, iets van je eigen spelers, iets uit de regio |
| Elke week | Zaterdag | De wedstrijd, met momenten die naar jouw beslissingen verwijzen |
| Per maand | | Speler van de maand, een vervolgverhaal, een bekerronde |
| Per seizoen | | ALV en punten, een upgrade die opent, promotie of een prijs, de prijzenkast |

**Juice:** animaties van tellers, kaarten die binnenschuiven, een tribune die voller wordt. Zuinig en betekenisvol, met respect voor `prefers-reduced-motion`. Een stille week kost één tik.

## Werkwijze (fasen; sla er geen over zonder akkoord)

### Fase A — Spelen en diagnose (kort, in chat)
1. **Speel twee seizoenen** van `dist/index.html` met Playwright.
2. **Noteer per week** wat de speler voelt, ziet en doet, en hoeveel tikken het kost.
3. **Toets de zes punten hierboven:** klopt de diagnose, wat ontbreekt er nog, en wat is al goed genoeg?
4. **Analyseer drie andere spellen op overdraagbare mechanismen** (niet kopiëren). Denk aan:
   - de wedstrijdpresentatie en het seizoensritme van managementspellen;
   - beslissingen met spanning in korte sessies, zoals in Reigns-achtige spellen;
   - hoogtepunten en run-structuur in roguelites.

### Fase B — Interactieve ontwerpvragen
Stel ze interactief: hooguit vier per ronde, met concrete opties en een klein speelvoorbeeld (preview), en je aanbeveling als eerste optie ("Recommended"). Analyseer elk antwoord kort: spelplezier, rol van de voorzitter, complexiteit, scope.

**Ronde 1 — De zaterdag**
1. **Hoe beleef je de wedstrijd?**
   - Een korte live-tekst van 30–45 seconden met de belangrijke momenten.
   - Een veld met stippen en een ticker.
   - Een krantenverslag achteraf.
   - Een mix: live voor grote duels, kort voor gewone weken.
2. **Wat doet de voorzitter tijdens de wedstrijd?** Niets op het veld, maar wel als eigenaar:
   - in de bestuurskamer met de voorzitter van de tegenstander;
   - de rust (kleedkamer in of niet: moraal, geen tactiek);
   - een reactie na afloop.
3. **Hoe zie je dat jouw keuzes meespelen?** Bijvoorbeeld:
   - *"Whitlock, the left-back your mandate brought in, clears off the line"*;
   - *"Reyes, who you backed in his slump, scores"*.
4. **Opbouw in de week:**
   - een wedstrijdkaart met de vorm van beide clubs, de inzet en het weer;
   - de verwachte opkomst;
   - de derbykoorts.

**Ronde 2 — Het seizoen als boog**
1. **Een bekercompetitie:** een regionale beker met uitwedstrijden bij amateurs en een finale. Ja of nee, en hoe zwaar weegt hij?
2. **De race zichtbaar maken:** een stand met zones (promotie, play-offs, degradatie), "wat moet er gebeuren" in de slotweken, en de rivaal in beeld.
3. **Deadline day in de winter:** een kort, spannend scherm waarin de TD aan het werk is binnen jouw mandaat en jij hooguit één keer mag ingrijpen.
4. **De laatste speeldag:** live uitslagen van andere velden die jouw stand bepalen.

**Ronde 3 — Je club zien**
1. **Identiteit:** clubkleuren, een gegenereerd wapen, een tenue en een stadion met een naam en een tribunekaart.
2. **Het publiek:** de opkomst als getal en als beeld (een tribune die voller wordt), sfeer, en invloed op het thuisvoordeel.
3. **Visuele stijl van de wedstrijd en de stand**, licht en donker, met mobiel eerst.
4. **Geluid** (optioneel, alleen na een tik): het publiek bij een doelpunt, een fluitsignaal.

**Ronde 4 — Inzet, falen en beloning**
1. **Moeilijkheid:** echte druk.
   - Een actieve speler wint ±60–75% van de ALV's.
   - Geld kan echt misgaan: punten aftrek, administratie, gedwongen verkoop.
   - Een slechte zomer kost een seizoen.
2. **Herstel:** hoe kom je terug? Bijvoorbeeld een crisisvergadering, een investeerder met voorwaarden, of de leden die je een laatste kans geven.
3. **Beloningsmomenten:** promotie, een kampioenschap, de beker, een record, een speler die doorbreekt, een clubicoon die afscheid neemt. Hoe ziet zo'n scherm eruit?
4. **Doelen op lange termijn,** zonder mijlpalen-meter (zie ook ronde 5):
   - een prijzenkast;
   - een clubhistorie met hoogtepunten per seizoen;
   - een eregalerij van spelers die jij binnenhaalde of liet doorbreken.

**Ronde 5 — De feed en de upgradeboom** (de basis staat vast, zie hierboven)
1. **Vervolgverhalen:** hoe vaak, en hoe lang mag een verhaal lopen (twee kaarten, of een hele seizoensboog)?
2. **De kleine-gebeurtenissenbibliotheek:** welke toon (droog Brits, warm, ironisch) en hoeveel (±60 tot ±150 fragmenten voor de eerste versie)?
3. **De boom:** welke vijf upgrades openen als eerste per tak, en welke heeft een ALV-motie nodig?
4. **Punten:** precies hoeveel voor een ALV-uitslag, een gehouden belofte en een mijlpaal, zodat je per seizoen één à twee upgrades kunt kiezen?

### Fase C — Ontwerpnotities (vóór code)
Korte notities van maximaal één A4 elk in `standalone-research/`. Neem de keuzes van de eigenaar op in het concept (§13).
- `WEDSTRIJD-VOORZITTER.md`: de zaterdag van opbouw tot nasleep, en hoe beslissingen van de voorzitter in de wedstrijd zichtbaar worden.
- `SEIZOENSBOOG-VOORZITTER.md`: beker, race, deadline day en de laatste speeldag.
- `IDENTITEIT-VOORZITTER.md`: kleuren, wapen, tenue, stadion, publiek en visuele taal.
- `INZET-VOORZITTER.md`: moeilijkheid, faalvormen, herstel, beloningen en de prijzenkast.
- `FEED-VOORZITTER.md`: de vier bronnen, de bibliotheek van kleine gebeurtenissen, vervolgverhalen, de herhalingsregels en de vorm van een kaart.
- `UPGRADES-VOORZITTER.md`: de vijf takken, niveaus, kosten, zichtbare gevolgen, bijwerkingen, de punten en de koppeling aan de ALV.

**Elke notitie eindigt met:** welk gevoel dit oplevert, en waar dat gevoel vandaan komt in de rol van de voorzitter. Kun je dat niet concreet maken, dan bouw je het niet.

### Fase D — Prototype van één zaterdag
Bouw eerst **één volledige week** als losse, klikbare proef:
- de feed van die week (4–6 kaarten uit de vier bronnen, met één vervolgverhaal);
- de opbouw naar zaterdag;
- de wedstrijd zelf;
- de nasleep.

Gebruik de eigen selectie en echte verhalen uit de simulatie.

Laat de eigenaar er drie spelen: een gewone week, een derby en een slotwedstrijd met inzet. Vraag daarna:
- voelde dit als voetbal;
- voelde je dat het jouw club was;
- zag je je eigen beslissingen terug;
- was de feed leuk om te lezen, en wilde je de volgende week zien?

Laat daarna de upgradeboom zien, met een voorbeeld van één seizoen punten en één upgrade die opent.

Ga pas verder na een "ja".

### Fase E — Bouwen (per pijler, in deze volgorde)
1. **De zaterdag en de feed**, op basis van de proef.
2. **Identiteit:** kleuren, wapen, tenue, stadion en publiek in alle schermen.
3. **De seizoensboog:** beker, de race met zones, deadline day en de laatste speeldag.
4. **Inzet:** de balanspas, faalvormen en herstel.
5. **Beloningen en de upgradeboom:** hoogtepuntschermen, prijzenkast, clubhistorie, eregalerij, en de boom met punten uit ALV, beloftes en mijlpalen.

Elke pijler is een eigen commit met een speelbare versie, een gepubliceerd artifact, en één gerichte vraag aan de eigenaar.

## Technische regels
- **De lagenstructuur blijft:** `core`, `world`, `club`, `chairman`, `ui`, `style`, met de build naar één offline HTML-bestand.
  - De wedstrijd hoort in `club/` (simulatie) en `ui/` (beleving).
  - `club/` weet niets van de voorzitter.
- **Wedstrijdsimulatie:** gebeurtenissen per minuut of per blok, met echte spelers aan beide kanten. De uitslagen blijven gekalibreerd: het gemiddelde aantal goals en het aantal gelijke spelen realistisch. De presentatie verandert de uitkomst nooit.
- **Grafiek** met SVG of canvas, geen externe afbeeldingen. Het wapen en het tenue worden per club procedureel gegenereerd uit een seed.
- **Animatie** zuinig en betekenisvol, met respect voor `prefers-reduced-motion`. Geluid alleen na een tik van de speler.
- **Prestatie:** een week moet op een middenklasse telefoon binnen een seconde reageren.
- **Saves** krijgen een versienummer; oude saves starten anders netjes opnieuw.

## Testen (eerlijk melden wat faalt)
1. **Alle bestaande tests blijven groen:** de fundering zonder voorzitter, de audit en de browserdoorloop.
2. **Kalibratie van de wedstrijden:** gemiddeld aantal goals, aandeel 0-0 en thuisvoordeel binnen realistische marges over 1.000 wedstrijden.
3. **Balans:** de audit over twintig seeds geeft actief ±60–75% gewonnen ALV's, passief en willekeurig duidelijk lager. Minstens één echte crisis per vijf seizoenen bij gewoon spel.
4. **Zichtbaarheid:** in een gemiddeld seizoen verwijzen minstens tien wedstrijdmomenten naar beslissingen van de voorzitter (een speler die hij steunde, een aankoop binnen zijn mandaat).
5. **De feed:**
   - per week 4–6 kaarten uit minstens drie bronnen;
   - geen identieke zin binnen een seizoen, en geen dezelfde soort kaart binnen vier weken;
   - per seizoen minstens acht vervolgverhalen;
   - de tijd per week blijft binnen 30–90 seconden.
6. **De boom:**
   - per seizoen ±3–8 punten bij gewoon spel;
   - elke upgrade heeft een meetbaar en zichtbaar gevolg;
   - de balans blijft binnen de afgesproken bandbreedte.
7. **Playwright:** twee seizoenen in licht en donker op 390 px. Geen fouten, geen horizontaal scrollen. Screenshots van een wedstrijd, de stand met zones, een bekerronde, deadline day en een hoogtepuntscherm.

## Wat je níét doet
- De voorzitter geen opstelling, tactiek, wissels of training geven, ook niet "een beetje".
- Geen schermen, meters of valuta toevoegen zonder een gevoel dat aantoonbaar uit de voorzittersrol komt.
- Geen kopie van een bestaand spel (naam, look, content). Overdraagbare mechanismen mogen.
- Geen echte clubs, spelers of merken.
- Niets op `main`, `claude-game` of `chatgpt`.
