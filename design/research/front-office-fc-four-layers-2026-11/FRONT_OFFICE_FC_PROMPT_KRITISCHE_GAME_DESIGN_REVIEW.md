# UITVOERPROMPT — FRONT OFFICE FC
## Kritische game-designreview, herontwerp en verbeterde spelbijbel (v2.0)

**Rol:** Je bent lead game designer, systems designer, simulation designer en kritisch game-development director voor **Front Office FC**. Je bent niet gevraagd om de bestaande visie te bevestigen, maar om haar te proberen **weerleggen, verbeteren en speelbaar te maken**.

**Opdracht in één zin:** Onderzoek de bestaande vierlagenblueprint en, waar beschikbaar, de werkelijke spelimplementaties; identificeer wat niet overtuigt, herstel ontbrekende of zwakke gameplaymechanieken, werk het geheel uit als een consistent en implementeerbaar game-design en **sla de volledige herziene versie op als een nieuw Markdown-bestand**.

Dit is een **ontwerp- en auditopdracht**, nog geen opdracht om gamecode te wijzigen of branches te mergen.

---

## A. VERPLICHTE INPUT EN BRONDISCIPLINE

### Primaire input
Lees het **volledige** document:

`FRONT_OFFICE_FC_VIERLAGEN_BLUEPRINT_V1.md`

Het is in de oorspronkelijke werkomgeving beschikbaar op:
`/mnt/data/front_office_fc_blueprint/FRONT_OFFICE_FC_VIERLAGEN_BLUEPRINT_V1.md`

Als het pad niet bestaat, gebruik het bij deze prompt geleverde Markdown-bestand. Zoek zo nodig naar dit exacte bestand in gesprek-/bestandsbibliotheek. **Doe niet alsof je het gelezen hebt als het niet toegankelijk is.** In dat geval meld je duidelijk wat ontbreekt en produceer je geen schijnbaar brongetrouwe definitieve revisie.

### Bestaande game: inspecteer waar toegankelijk
GitHub: `Blauwev0gel/front-office-fc`

- `main` — bestaande gedeelde release; **niet aanpassen**.
- `chatgpt` — omvangrijke bestaande Front Office FC-game. Lees minimaal `README.md`, `BIBLE.md`, `CODEMAP.md` en de daadwerkelijke modules voor de weekloop, wedstrijd, mandaten, mensen, afspraken, financiën en saves.
- `claude-game` — aparte ontwikkelversie; lees deze als relevante vergelijking, niet als automatisch canon.
- `claude/loving-goodall-uv00vn` — **serieuze zelfstandige game- en onderzoeksbranch**, niet slechts een simulatiehandover. Controleer onder andere `standalone/front-office-fc/voorzitter/northmarch.html`, de tests, en `standalone-research/` (afspraken, personen, gesprekken, ALV, oppositie, clubs, regelset).
- `voorzitter-fundering` — latere **modulaire standalone** fundering, met gelaagde code, tests, TD-/clubsystemen en seizoensflow; niet automatisch dezelfde build als Loving Goodall.

**Bronhiërarchie:** werkelijk uitgevoerde actuele code en reproduceerbare tests > directe code-inspectie > actuele documentatie > historische verslagen > hypotheses. Controleer branchnamen, commits, data, live-status en bouwbaarheid voordat je iets "werkend", "geïmplementeerd" of "gevalideerd" noemt. Onderscheid: BESTAAT IN CODE / GETEST / HISTORISCHE CLAIM / ONTWERP / HYPOTHESE.

De eerdere M0–M7-LoopSim-experimenten zijn bruikbaar voor **risico's rond besluitdichtheid en autonomie**, niet als bewijs dat een specifieke huidige Front Office FC-branch het beste speelt. Wedstrijdinteracties en bestuursbesluiten tellen **apart**.

**Belangrijk:** broncode of documentatie inspecteren is niet hetzelfde als daadwerkelijk een game in de browser spelen. Claim geen playtest als je alleen code las. Noem beperkingen expliciet.

### Benchmark (voorzichtig)
Gebruik Hometown FC, Football Chairman/Football Manager, Crusader Kings en Suzerain waar relevant om **mechanische risico's en ontwerpkeuzes** te contrasteren. Als je actuele informatie kunt verifiëren, benoem bronnen en datum. Anders label je de vergelijking als *conceptueel*, niet als recent geverifieerde featurecheck. Benchmark is geen uitnodiging om functies klakkeloos te kopiëren.

---

## B. BESLOTEN RICHTING — NIET OPNIEUW TER DISCUSSIE STELLEN

De speler is **een gekozen voorzitter van een ledenvoetbalclub**. Hij/zij **bezit die club niet**. Bestuursfuncties en bevoegdheden volgen uit statuten, benoemingen en verkiezingen. Familie kan invloed, relaties, privébezit, reputatie en eigen loopbanen hebben, maar erft **nooit automatisch** de club, een bestuurszetel of het voorzitterschap.

Het spel moet vier **volwaardige** en **in elkaar grijpende** lagen hebben:

1. **Clubmanagement:** competitie, wedstrijden, selectie, financiën, commercie, jeugd, stadion, infrastructuur, personeel en lange-termijnstrategie; een interessante voetbalgame op zichzelf.
2. **Personenmanagement:** competenties, karakter, relaties, drijfveren, carrières, mandaten, samenwerking, conflict, autonomie en vertrekkende/terugkerende personen.
3. **Beslissingen en bestuur:** eigen initiatief, gesprekken, formele bevoegdheden, afspraken, conflicten, projecten, leden, commissies, oppositie, ALV, consequenties en verantwoording.
4. **Familie en dynastie:** zelfstandig familieleven, persoonlijke keuzes, loopbanen, privévermogen, conflicten, opvolging van het speelpersonage en generaties; géén verkapte erfopvolging van de club.

**Behouden randvoorwaarden:**
- Geen opstellingen, tactiek, wissels of individuele transferonderhandelingen door de voorzitter.
- Week- en wedstrijddag hebben eigen voetbalwaarde: briefing → preview → wedstrijd (eigen scherm) → krant/weekafsluiting → vervolg.
- Managers en andere mensen handelen zelfstandig binnen werkelijke mandaten.
- De speler mag zelf agenderen/gesprekken starten; niet alleen reageren op een inbox.
- Geen willekeurige verplichte kaarten, decoratieve keuzes, arbitraire action points of "u heeft nog 2 gesprekken over" zonder geloofwaardige oorzaak.
- Niet iedere beslissing hoeft spectaculair te zijn; **substantiële keuzes** moeten aantoonbare acties, uitvoerders, afwegingen en latere gevolgen kunnen opleveren.
- Niet handelen moet soms verstandig zijn en mag niet automatisch een straf geven.
- Ledenmacht, privévermogen, clubkas, formele bevoegdheden, persoonlijke relaties en historische beloftes blijven onderscheiden.
- Mensen en clubs bestaan en veranderen buiten het zicht van de speler; ook wanneer de speler zijn voorzitterschap verliest.
- De bestaande speelbare game is de uitgangssituatie, geen excuus voor een projectreset.
- De vier lagen mogen **gefaseerd verdiept** worden, maar geen daarvan mag verdwijnen, cosmetisch worden of worden geparkeerd als vrijblijvende post-launchgedachte.
- De uiteindelijke spelnaam is **Front Office FC**. "De Voorzitter" is hooguit een ontwerp-/rolbenaming, niet de spelnaam.

Je mag **vrijwel alle concrete ontwerpbesluiten** uit v1 ter discussie stellen, inclusief een standaarddriejarige termijn, vier momenten per seizoen, omvang van familiegebeurtenissen, hoeveel personages actief gesimuleerd worden, ritme, statutenvarianten, complexiteit, UI, testmijlpalen en zelfs de voorgestelde enginevolgorde. Geef bij elke grote afwijking de reden en de nieuwe afweging. Behandel de bovenste gekozen richting en randvoorwaarden niet als vrijblijvende opties.

---

## C. FASE 1 — BRENG EERST DE ZWAKTES ONVERBLOEMD IN KAART

Lever vóór je herschrijft een **kritische audit** van het volledige blueprintdocument. Geen generieke complimenten of abstracte SWOT.

Beoordeel ten minste deze vragen:

**1. Is het daadwerkelijk een spel, of vooral een verzameling systemen?**
- Wat doet een speler concreet in de eerste 5 minuten, eerste week, eerste 10 weken, eerste seizoen, vijfde seizoen en twintigste seizoen?
- Wat is de intrinsieke reden om op **Volgende wedstrijd** te drukken?
- Welke 5–8 werkwoorden kan de speler daadwerkelijk uitvoeren, en welke beslisruimte hoort daarbij?
- Welke beloning voelt de speler zonder een +5-meter of tekst achteraf?

**2. Zijn de vier lagen echt gelijkwaardig?**
- Heeft elke laag een eigen spanning, doelen, voortgang, feedback en mislukking?
- Is de familielaag vanaf seizoen 1 méér dan een gebeurtenis en een stamboom?
- Is clubmanagement voldoende diep om los van verkiezingen te boeien?
- Is personenmanagement meer dan het optimaliseren van loyaliteit?
- Is het bestuurlijke spel meer dan dialoogkaarten met cosmetische consequenties?

**3. Is indirecte invloed daadwerkelijk spelbaar?**
- Hoe kan de voorzitter gericht invloed uitoefenen zonder de TD of trainer te spelen?
- Wanneer zijn medewerkers competent, koppig, opportunistisch of gerechtigd te weigeren?
- Hoe kan een speler een slechte beslissing herkennen en er later op reageren?
- Wat kan de speler **preventief** doen als alles goed gaat?
- Wanneer is geen actie de beste actie?

**4. Hoe geloofwaardig is ledenbestuur?**
- Wie mag wat besluiten, blokkeren, voordragen, afdwingen of terugdraaien?
- Waarom zou een voorzitter een ALV willen winnen als winnen zelf geen clubverbetering inhoudt?
- Hoe voorkom je stem-whack-a-mole of een triviale strategie van iedereen tevreden houden?
- Kunnen impopulaire maar noodzakelijke besluiten óók rationeel zijn?
- Wat doet de speler na een verloren verkiezing of tussentijds ontslag, zonder dat de voetbalgame stilvalt?

**5. Kan een familie-dynastie zonder clubeigendom werken?**
- Wat erft de volgende generatie wél; wat beslist ze zelfstandig; hoe krijg je een nieuwe speelbare protagonist?
- Hoe ziet interessante familiegameplay eruit als kinderen niet willen besturen, familie vervreemd raakt of er geen directe erfgenaam is?
- Kan de familielaag een échte trade-off creëren zonder dat de speler via nepotisme gratis macht krijgt?
- Wat gebeurt er met het voetbal als jouw familie even geen voorzitterszetel heeft?

**6. Is het in productie realistisch?**
- Waar dreigt combinatorische explosie in personagegedrag, families en relaties?
- Hoe houden we 40+ seizoenen snel, deterministisch, reproduceerbaar en save-compatibel?
- Welke ontwerpkeuze levert de grootste hoeveelheid echte gameplay per ontwikkeluur?
- Welke systemen uit de bestaande branches zijn geschikt om te hergebruiken, en welke juist niet?
- Zijn er te veel verschillende wallets, bevoegdheidsobjecten, relatievariabelen of eventlogs?

**7. Wat klopt er niet aan de v1-blueprint?**
- Zoek actieve tegenstrijdigheden, niet alleen ontbrekende details.
- Identificeer features die dubbel tellen, oneerlijke verwachtingen scheppen, schijnkeuzes opleveren of onbedoeld bestuurlijke micromanagement veroorzaken.
- Onderbouw wat je schrapt, samenvoegt, verdiept, herbouwt of uitstelt.

### Verplicht auditformat
Maak een tabel met **minstens 12 specifieke bevindingen**, met kolommen:
`Prioriteit (P0/P1/P2) | Concrete locatie in v1 of bestaande code | Probleem | Waarom het de gameplay schaadt | Falsifieerbare hypothese | Concrete ingreep | Acceptatiebewijs`.

Elke conclusie krijgt één bewijslabel: `[CODE]`, `[TEST]`, `[DOC]`, `[HYPOTHESE]` of `[ONBEKEND]`.
Gebruik niet "meer diepgang nodig" als conclusie zonder zichtbaar mechanisch probleem.

---

## D. FASE 2 — ONTWERP DE SPEELBARE KERN OPNIEUW

Herontwerp de game vanuit het **gedrag van de speler** en de werking van de simulatie, niet vanuit schermen of fictieve verhaaltjes.

Maak expliciet:

1. **De kernfantasie, spanning en verlies/doorstart.** Wie ben je? Wat ben je aan het opbouwen? Wat kun je kwijtraken? Wat blijft van jou of de club?
2. **De belangrijkste on-screen loop.** Een normale week en een drukke week, met exacte overgangen. Voetbal en bestuur zijn verbonden, maar **wedstrijdbediening is geen bestuurlijke beslissing**.
3. **De managementloop.** Sportieve, financiële en organisatorische doelen; planning, investeringen, personeel, autonome voortgang en prestatie-evaluatie. Niet slechts reageren op dossiers.
4. **De menselijke loop.** Ontdekken, aanstellen, afspraken, mandaten, prestaties, onderlinge relaties, rivalen, mentorrelaties, vertrek en terugkomst.
5. **De besluitloop.** Eigen agenda, informatiestroom, afweging, wettelijke/statutaire bevoegdheid, aanbod/tegenbod, uitvoering, monitoring, heronderhandeling en gevolgen.
6. **De familieloop.** Onafhankelijk familieleven, keuzes met persoonlijke inzet, carrièrevorming, band met de voetbalwereld, ouder worden, overlijden en overgang naar een nieuw speelpersonage.
7. **De seizoens-/verkiezingsloop.** Zomer, transferperiodes, competitie, begroting, ALV, statutaire termijnen, oppositie en eventuele leiderswisselingen.
8. **De generatieloop.** Spelerwissel, de toestand van de achtergelaten club, reputaties en netwerken over nieuwe clubs en decennia.

Voor **iedere loop** verplicht specificeren:
- concrete spelerwerkwoorden en zichtbare UI-acties;
- invoer uit de gedeelde wereld;
- systemen/personen die zelfstandig handelen;
- middelen en beperkingen (zonder arbitraire spelvaluta);
- normale uitkomst, gedeeltelijke uitvoering, mislukking en onverwachte wending;
- zichtbare feedback **nu**, na enkele weken en na meerdere seizoenen;
- onderlinge verbinding met minimaal twee andere lagen;
- waarom dit een keuze is en niet alleen een administratieve bevestiging.

Stel vervolgens één **minimaal geïntegreerde speelervaring** voor: niet een leeg prototype, maar een reeds bestaande game die op de juiste plaatsen met alle vier lagen wordt verbonden. De eerste 10 weken moeten tastbare gameplay geven; de volledige seizoens- en levensboog moet ontwerpbaar zijn.

---

## E. FASE 3 — WERK DE SYSTEMEN CONCREET EN IMPLEMENTEERBAAR UIT

Specificeer de interne modellen en hun interactie zonder te vervallen in alleen mooie tekst.

### Laag 1 — Clubmanagement
Behoud voetbal als zelfstandige aantrekkingskracht. Werk minimaal uit:
- competitie en wedstrijdbeleving, selectie, spelersontwikkeling, transfermarkt, jeugd;
- kasstromen, lonen, schulden, sponsorinkomsten, investeringen, risico en herstel;
- stadion-/faciliteitsprojecten met financiering, fasen, aanbesteding en bijbehorende consequenties;
- afdelingsbegrotingen, bevoegdheden en verantwoordelijke managers;
- verschillende levensvatbare clubsstrategieën, inclusief kleine communityclubs die bewust niet maximaliseren;
- informatievoorziening en rapportage zonder micromanagement.

### Laag 2 — Personenmanagement
Definieer:
- karakter, competenties, overtuigingen, belangen, doelen, informatie, relaties, tijd en carrière;
- besluitvaardigheid, bereidheid, autonomieniveau en afwijkend gedrag;
- relaties tussen **andere** personages, niet alleen een loyaliteitsscore tegenover de speler;
- gevolgen van ontslag, vertrek, promotie en overstappen naar rivalen;
- wie werkelijk tijdig rapporteert, verzwijgt, vertraagt, weigert of fouten maakt;
- hoe de speler informatie vergaart zonder dialoogquiz met één goed antwoord.

### Laag 3 — Beslissingen en macht
Definieer:
- één samenhangend besluit-/afspraak-/mandaatmodel met duidelijke verschillen tussen de drie;
- initiatieven vanuit speler, staf, board, leden, familie en wereld;
- een regel voor formele bevoegdheid, goedkeuring, veto en motie;
- transparante afwegingen en een uitvoeringsplan dat **werkelijke wereldtoestand** verandert;
- directe en vertraagde effecten, anticipatie en heronderhandeling;
- één doordachte ALV-/verkiezingsmechaniek met bindende beslissingen, geen alleenstaande supportmeter.

Behoud en verbeter het sterke Loving Goodall-principe:
**You give · They give · Tested · If it fails**, maar gebruik het alleen waar er een echte afspraak met een ander persoon of groep bestaat. Een stadionbouwplan of standaardtransfer hoort niet geforceerd als afspraakkaart te worden verpakt.

### Laag 4 — Familie/dynastie
Definieer:
- familieleden als onafhankelijke agents, eigen verlangens, banen, relaties en privé-middelen;
- familie-acties die **ook zonder clubpolitiek** interessant kunnen zijn, maar wel de voetbalwereld kunnen raken;
- familiale belangenconflicten, onafhankelijk toezicht, reputatie, afstand doen van besluitvorming;
- uitkomst bij vervreemding, kinderloosheid, adoptie, niet-voetballende verwanten, overlijden, scheiding, nieuw huwelijk of vrijwillige opvolging (zonder universeel voorgeschreven familiepad);
- hoe een opvolger de gespeelde carrière voortzet **zonder een verkozen positie te erven**;
- een speelbare lus wanneer familieleden geen bestuurlijke positie hebben: geen periode van puur wachten.

### Gedeelde simulatie
Maak een **enkelvoudig causaliteitsmodel** en een minimaal datacontract voor:
`World`, `Club`, `Membership`, `Statute`, `Person`, `Relationship`, `Family`, `PrivateAssets`, `Mandate`, `Agreement`, `Decision`, `Project`, `Election`, `EventLedger`, `Career`.

Benoem bij elk object: cruciale velden, eigenaar van mutatie, levenscyclus en welke bestaande systemen het gebruiken. Geef één eenduidige volgorde voor de weektick met grenzen tussen autonoom clubwerk, personen, familie, verkiezingen, wedstrijden, berichtgeving en saves. **Dubbele tick-uitvoering en vooruitkennis zijn release blockers.**

Definieer een **prestatiebudget** (actieve, gedetailleerde personen rondom de speler vs. geaggregeerde simulatie elders) voor 30–50 jaar spelplezier.

---

## F. FASE 4 — TEST HET ONTWERP ALS SPEL, NIET ALS PRESENTATIE

Maak **minstens zes volledig uitgewerkte actie→gevolg-ketens**, waarvan:
- één primair vanuit clubmanagement begint;
- één vanuit personeel/relaties;
- één vanuit ledenpolitiek/beslissingen;
- één vanuit familie en dynastie;
- één waarin **niet ingrijpen** rationeel is;
- één die na een verloren verkiezing of generatiewisseling doorloopt.

Iedere keten bevat:
`begintoestand → spelerinformatie → minstens 3 geloofwaardige opties → keuze → wie doet wat zonder jou → onmiddellijke veranderingen → 4-wekengevolg → seizoensgevolg → meerjarig gevolg → mogelijke tegenactie door andere agent → zichtbaar bewijs voor speler`.

Laat bij twee ketens zien waarom een aantrekkelijke optie later verkeerd kan uitpakken; bij één waarom een aanvankelijk onpopulair besluit alsnog juist kan zijn. Maak variatie uit systeemtoestand aannemelijk: geen voorspelbaar script met drie cosmetische eindes.

### Verplichte negatieve tests (red team)
Test expliciet wat gebeurt als:
1. De speler **10 weken niets bestuurlijks doet**.
2. De speler **iedere week overal tussenkomt**.
3. De speler altijd de meest populaire afspraak kiest.
4. De staf 3 keer achter elkaar anders handelt dan de speler verwacht.
5. De club sportief goed presteert maar financieel bijna failliet is.
6. De speler de ALV verliest ondanks sportief succes.
7. Een familielid een competente maar controversiële kandidaat is voor een clubfunctie.
8. De protagonist geen geschikte opvolger binnen de familie heeft.
9. Twee sterke afspraken elkaar tegenspreken.
10. De simulatie na 25 seizoenen veel relaties, projecten, schulden en historie bevat.

Voor elke test: **wat móét ontstaan, wat mag gebeuren, wat is verboden, hoe controleer je dat?**

### Meetbaar bewijs
Bedenk geen "fun score" uit het niets. Scheid:
- technische juistheid (determinisme, save/load, formele regels, geldstromen);
- systeemcausaliteit (verandert beleid werkelijk het handelen?);
- inzichtelijkheid (kan een tester herleiden wie waarom handelde?);
- gameplay (wil een echte speler doorklikken, onthoudt hij personages, heeft hij spijt of trots?).

Geef uitvoerbare botscenario's, tegenfeitelijke tests en minstens één menselijk speeltestscript voor de eerste 45–60 minuten. Beschrijf zowel acceptatie- als **afbreekcriteria** (wanneer is een mechaniek ondanks werkende code geen goed spel?).

---

## G. FASE 5 — ÉÉN REALISTISCH ONTWIKKELPLAN, GEEN NIEUWE RESET

1. Vergelijk de huidige codebasis op `chatgpt`, `claude-game`, `loving-goodall` en `voorzitter-fundering` op **implementatie**, onderhoudbaarheid, savecompatibiliteit, beschikbare tests en gameplay (waar speelbaar). Leg uit wat je eerst zou **hergebruiken**, **integreren**, **repareren** of **niet** moet overnemen.
2. Kies een **voorgestelde primaire basis** met criteria en bewijs. Is het bewijs onvoldoende, geef een conditionele keuze plus de specifieke verificatie die haar beslist. Doe niet alsof branch-merges vanzelf eenvoudig zijn.
3. Maak een milestoneplanning die de reeds bestaande speelbare game behoudt. **Iedere milestone levert een testbare gameplayverbetering op, niet alleen documentatie, schermen of scores.**
4. Zet álle vier lagen vanaf de eerste geïntegreerde release in de speelervaring; verdiep ze in volgende milestones, met expliciet welke complexe onderdelen eerst beperkt blijven.
5. Geef per milestone: concrete speelervaring, gewijzigde modules/objecten, afhankelijkheden, risico's, regressietests, UX-test en release gates.
6. Neem backwards-compatible saves, offline single-file build, mobiel 320/375/390/430 px, leesbaarheid, vertaling van data naar begrijpelijke feedback, performance en actieve wedstrijdweergave mee.
7. Maak een **P0/P1/P2-backlog** die op werkende functionaliteit is gerangschikt; prioriteer op gameplay-impact × hergebruik × risico, niet op zichtbaarheid van een feature.
8. Geen zelfgemaakte tijdsinschattingen in uren zonder echte code-inspectie en empirische basis.

---

## H. VERPLICHTE OUTPUT — SCHRIJF EN BEWAAR DE DOCUMENTEN

**Je bent pas klaar als de herziene bestanden echt bestaan.** Alleen "hier zou ik iets verbeteren" of een audit zonder aangepaste spelbijbel is onvoldoende.

### Bestand 1 — audit
Sla op als:

`FRONT_OFFICE_FC_KRITISCHE_GAME_DESIGN_AUDIT.md`

Vereiste inhoud:
- Executive verdict (max. 300 woorden).
- Review van de huidige v1 en actuele code waar beschikbaar.
- 12+ specifieke probleemstellingen en hun oplossingen.
- Tegenstrijdigheden, ontbrekende gameplay, hoofdrisico's.
- Prioriteit en bewijsstatus per bevinding.
- Wat is behouden, herschreven, geschrapt of uitgesteld.
- Besluiten versus nog open hypothesen.

### Bestand 2 — volledige verbeterde spelbijbel
Sla op als:

`FRONT_OFFICE_FC_VIERLAGEN_BLUEPRINT_V2.md`

Schrijf het **gehele document opnieuw als zelfstandig leesbare ontwerpbijbel**. Geen verzameling aanvullingen, geen patch-notities en geen tekst als "zie v1 voor de rest". Het moet bevatten:
- duidelijke spelerfantasie en gameplaypijlers;
- alle vier complete lagen;
- week-, maand-, seizoen-, carrière- en generatieloop;
- actor-, mandaat-, afspraak-, besluit-, verkiezings- en familieregels;
- gezamenlijke causaliteits- en statearchitectuur;
- minimaal 6 uitgewerkte verhaalketens uit systemen;
- UI-flow vanuit eerste 10 weken tot de ALV;
- anti-patronen en balansbescherming;
- testbare acceptatiecriteria;
- integratieplan voor huidige gamebranches;
- milestones met speelbare release gates.

Bij alle grote ontwerpkeuzes: **reden, alternatief dat is afgevallen en trade-off**. Doe geen nieuwe aannames alsof ze al door de gebruiker zijn goedgekeurd. Markeer ze `[VOORSTEL]`, terwijl de gekozen voorzittersrol en het vierlagensysteem als `[BESLOTEN]` gelden.

### Bestand 3 — veranderingsoverzicht en implementatieprioriteiten
Sla op als:

`FRONT_OFFICE_FC_V1_NAAR_V2_CHANGELOG_EN_BACKLOG.md`

Bevat:
- mapping van belangrijke v1-secties naar de nieuwe oplossing in v2;
- ontwerpbesluiten met bewijsstatus;
- P0/P1/P2 ontwikkelbacklog, ieder met duidelijke DoD;
- eerste drie causale ketens die geïmplementeerd/gevalideerd moeten worden;
- wat expliciet **niet** gebouwd moet worden voordat de kern bewezen is.

### Opslaan en valideren
- Maak de bestanden via beschikbare file-/container-/workspace-tools **werkelijk aan** (Markdown, UTF-8).
- Standaarddoel indien container beschikbaar: `/mnt/data/front_office_fc_design_v2/`.
- In een andere omgeving: gebruik een vergelijkbare schrijfbare werkmap, noem het exacte pad.
- Controleer na schrijven dat alle drie bestanden bestaan, niet leeg zijn, en dat de v2 alle vier lagen bevat.
- Controleer alle koppen, consistentie rond gekozen voorzitter, referenties en onderscheid *ontwerp versus geïmplementeerd*.
- Gebruik **geen schijnlinks**. Link de echte gemaakte bestanden of lever hun exacte locatie. Als schrijven niet kan, zeg dat expliciet en geef de complete inhoud in de chat; claim geen opgeslagen bestand.

**GitHub is READ-ONLY tijdens deze opdracht.** Geen codewijziging, branchwijziging, PR, commit, merge, release of deployment zonder nieuwe expliciete toestemming. De originele v1 blijft intact. De documentbestanden mogen lokaal/workspace worden gemaakt, maar niet naar bestaande GitHub-branches worden geschreven.

### Laatste antwoord
Lever compact:
1. **Het scherpste probleem** van v1 en wat v2 daaraan verandert.
2. **De drie ontwerpverbeteringen** met het grootste verwachte gameplay-effect.
3. **De eerste te bewijzen geïntegreerde loop** (actie → medewerker → voetbal/organisatie → politieke of familiale consequentie).
4. **Links naar de drie werkelijk opgeslagen bestanden.**
5. Wat je wel/niet hebt getest en welke wezenlijke ontwerpvragen nog hypothesen zijn.

**Niet vragen of je mag beginnen, niet blijven brainstormen en niet opnieuw eindigen met alleen een vervolgpompt.** Voer deze review en revisie binnen de huidige opdracht uit. Zorg dat de vier lagen volwaardige gameplay blijven en dat Front Office FC een betere game wordt, geen groter document.
