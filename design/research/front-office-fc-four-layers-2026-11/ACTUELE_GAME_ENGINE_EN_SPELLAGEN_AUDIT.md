# CORRECTIE — actuele spelversie, engine-architectuur en speellagen
## Front Office FC / De Voorzitter — codegebaseerde audit

**Status:** CORRIGENDUM op het eerder in deze map gepubliceerde onderzoek.  
**Verificatie:** GitHub Connector en een beperkte eigen headless enginecheck, 21 november 2026.  
**Werkelijke bronbranch voor dit onderzoek:** voorzitter-fundering, commit b8ae2efec93c2070992ed8a246917d463f5b3d41.  
**Spelbuild gelezen:** standalone/front-office-fc/voorzitter-fundering/dist/artifact.html, blob df9f69cc45a8d6f3db975fe14e4aa688515d3487.  
**Aard:** audit van het bestaande spel en ontwerp; geen implementatie, merge of browser-playtest.

## 0. De belangrijkste fout uit de eerdere review

De vorige vierlagenblueprint gebruikte vooral de oudere chatgpt- en claude-game-sporen. Daarmee werden de **nieuwste zelfstandige gamebuild en de bijbehorende zeven-lagenarchitectuur** op voorzitter-fundering gemist. De eerdere voorkeur voor claude-game als integratiebasis is daarom **NIET GEVALIDEERD** en mag niet worden herhaald zonder nieuwe branchvergelijking.

Er staan in deze repo al eigen onderzoeksdocumenten voor de engine en afzonderlijke speellagen. Een nieuw ontwerp dat die niet leest, is geen grondige code-audit.

**Canon voor dit spoor:** raadpleeg op voorzitter-fundering eerst standalone-research/CONCEPT-VOORZITTER-2026-11-18.md (§13, laatste beslissingen), daarna de werkelijke code en de laagdocumenten. Deze audit registreert de actuele toestand; hij vervangt geen door de gebruiker goedgekeurde spelbesluiten.

## 1. Drie verschillende betekenissen van 'lagen' — niet mengen

### A. Zeven SPEELLAGEN (eigen speltoestand en gameplay)

Bron: standalone-research/LAGENMODEL-VOORZITTER.md en LAGEN-INVENTARIS-VOORZITTER.md.

| Nr | Speellaag | Eigenaarschap / wat de speler doet | Huidige bron |
|---|---|---|---|
| 1 | Clubbeheer | Stadion, vier tribunezijden, veld, voorzieningen, zes kavels, zes afdelingen, projecten, onderhoud; bouwen en inrichten | src/club/ground.js, src/ui/system.js |
| 2 | Financiën | Kas, schulden, prijzen, grootboek, begrotingslogica, exploitatie; prijzen en geldbesluiten | src/club/finance.js, src/ui/system.js |
| 3 | Mensen | Rollen, eigenschappen, loyaliteit, relaties, geheugen, TD en trainer; aanstellen, spreken, beïnvloeden | src/world/world.js, src/club/td.js, src/chairman/state.js |
| 4 | Voetbal | Selectie, transfers, wedstrijdsimulatie, stand, seizoenen; kaders voor TD/trainer | src/club/players.js, club.js, summer.js, src/world/football.js |
| 5 | Leden en politiek | Ledengroepen, beloftes, statuten, oppositie, ALV en moties; belangen en stemmen | src/chairman/promises.js, situations.js, flow.js |
| 6 | Wereld | Clubs, rivalen, stad, competities, markt, pers; externe kansen en beperkingen | src/world/world.js, news.js, football.js |
| 7 | Dynastie | Familie, generaties en opvolging; politieke invloed zonder clubeigendom | Ontwerp in standalone-research/FAMILIE-VOORZITTER.md; nog geen zelfstandige game-engine in deze build |

De belangrijkste eigendomsregel uit het bronontwerp: een laag muteert alleen zijn eigen gegevens. Andere lagen ontvangen benoemde signalen of doen een verzoek. Dit is een **ontwerpcontract**; de huidige code implementeert het nog niet overal strikt.

### B. Drie ENGINE-NIVEAUS

Bron: standalone-research/ENGINE-VOORZITTER.md.

1. **Speler / acties**: proactief iets in gang zetten en reageren op situaties.
2. **Agenten**: TD, trainer, directeur, ledenleiders en later familie; eigen handelen, belangen en geheugen.
3. **Systemen**: voetbal, financiën, faciliteiten, leden, mensen, wereld en dynastie.

Deze drie zijn GEEN drie extra speellagen. Technisch is het actuele zelfstandige spel opgesplitst in modules onder core/, world/, club/, chairman/ en ui/ — ook deze mapstructuur is iets anders dan de speellagen.

### C. Vijf TIJDSLAGEN

Bron: standalone-research/SPELLOOP-VOORZITTER.md en LOOP-DYNASTIE-VOORZITTER.md.

Moment → week → maand/grote momenten → seizoen/ALV → carrière/generatie. Het bestaande spel heeft een opening, manifest, zomervergadering, zesweekse transferzomer, 30 competitieweken, wedstrijd en ALV. De generatielaag is vooralsnog ontwerp; een volledig speelbare carrièreoverdracht is niet bewezen.

### D. Vier PRODUCT-/ONTWIKKELPIJLERS uit het gesprek

De vier eerder besproken hoofdsystemen **Clubmanagement**, **Personenmanagement**, **Beslissingen/bestuur**, **Familie/dynastie** zijn een *ontwikkelstrategie*, niet dezelfde opsomming als de zeven technische speellagen.

Praktische mapping:
- **Clubmanagement als eerste zelfstandige release:** speellagen **1 Clubbeheer + 2 Financiën**, met beperkt gebruik van de bestaande voetbal- en wereldcontext (4 en 6) als feedback, zonder nieuwe People/Family-simulatie te eisen.
- **Personenmanagement:** verdieping van speellaag 3.
- **Beslissingen/bestuur:** verdieping van speellaag 5 en de speleracties / machtiging binnen de engine. Het bestaat in de huidige flow al deels; niet behandelen als volledig leeg.
- **Familie/dynastie:** uitbouw van speellaag 7.
- **Voetbal (4) en Wereld (6)** zijn al bestaande dragende engines en mogen nooit uit het onderzoeksmodel verdwijnen.

**Besloten volgorde van werkzaamheden in ons dossier:** eerst een volwaardig, zelfstandig te spelen CLUBsysteem uitwerken en testen; bouw de nieuwe familiesimulatie of geïntegreerde vier-lagenketen nu niet. Dit sluit niet uit dat een clubproject financiële effecten moet hebben en via stabiele interfaces feedback aan de *al bestaande* voetbalengine geeft.

## 2. Welke huidige versie speelt nu werkelijk?

**Actieve code** op voorzitter-fundering onder standalone/front-office-fc/voorzitter-fundering/.

Belangrijke sourcefiles:
- src/core/rng.js en content.js — seeded wereld, tekst en getalsfuncties.
- src/world/world.js — Northmarch-clubs en personen.
- src/world/football.js — rondes, standings, wedstrijdsimulatie.
- src/club/ground.js — fysieke club, projecten, onderhoud en afdelingsbudgetten.
- src/club/finance.js — opkomst, prijzen, inkomsten, kosten, grootboek en forecast.
- src/club/club.js — autonome club-/TD-week, transfers, spelersloop.
- src/club/summer.js — transferzomer (zes weken) en winter.
- src/chairman/flow.js — weekscènes, manifest, ALV, voortgang.
- src/ui/system.js — de Ground- en Money-schermen met doorklik.
- dist/artifact.html — gegenereerde zelfstandige game, **niet** verwarren met oudere documentatie over ontbrekende HTML in een ander spoor.

De nieuwste documentatieset bevat LAAG1-CLUBBEHEER-VOORZITTER.md tot en met LAAG5-LEDEN-VOORZITTER.md plus LAGENMODEL, LAGEN-INVENTARIS en ENGINE-VOORZITTER. **Laag 6 en laag 7 zijn nog niet als volwaardige code-/designset op hetzelfde niveau gedocumenteerd.**

## 3. Statusmatrix — code, koppeling en echt spelen

Gebaseerd op **de bestaande inventaris** op voorzitter-fundering, geverifieerde sourcefiles en de beperkte checks hieronder. Het is geen volledige menselijke gameplaytest.

| Laag | Geïmplementeerd en zichtbaar | Nog niet af / onduidelijk |
|---|---|---|
| 1 Clubbeheer | **Deels:** stadion per zijde, veld, faciliteiten, zes kavels, zes afdelingen, projectcatalogus, aannemer, bouw, onderhoud; Ground-scherm | De sportieve effecten van trainings-/medische-/academiegebouwen bereiken de voetbalengine nog niet; ledenvoorkeuren rond infrastructuur ontbreken |
| 2 Financiën | **Deels:** prijzen, opkomst, seizoenskaarten, grootboek met 17 posten, cashforecast, schuld en bankroodstand; Money-scherm | Sponsoraanbiedingen, formele leningen/obligaties/hypotheek, bankconvenanten, licentie, balans en volledige budgetpotten zijn vooral v3-ontwerp, niet allemaal code |
| 3 Mensen | **Ja, deels diep:** persoonskenmerken, geheugen, loyaliteit, relaties, TD-vakmanschap, aanstellingen, conflict | Afdelingshoofden met eigen kwaliteit, volledige agentdoelen, salarissen en onafhankelijk directeurshandelen ontbreken/deels |
| 4 Voetbal | **Ja:** selectie, Poisson-wedstrijden, TD-transfers, transferzomer en twee divisies | Faciliteitensignalen ontbreken in prestaties; vier divisies is gekozen in onderzoek maar niet in huidige wereldcode |
| 5 Leden en politiek | **Ja:** ledengroepen, manifest, situaties, oppositie, ALV, moties en consequenties | Reacties op specifieke prijzen, sponsors en gebouwen ontbreken; formele toestemmingen voor clubbouw/geld nog niet sluitend |
| 6 Wereld | **Basis:** 32 clubs, rivaliteit, krant, competities, tegenstanders | Gemeente, bond, vergunningen als autonome institutie, sponsormarkt en marktrente nog niet volwaardige systemen |
| 7 Dynastie | **Ontwerp:** familie, karaktererfenis, opvolgingsregels en politieke nalatenschap | Familie- en generatiesimulatie niet gebouwd; geen speelbare bewijsloop |

**Relevante tegenstrijdigheid:** keuze 81/82 legt een amateurachtige startclub in de **vierde divisie van vier** vast. In de actuele src/world/world.js maakt newWorld nog **twee divisies van zestien clubs** aan, met competitie van dertig rondes. Het ontwerp en de code lopen hier aantoonbaar uiteen. Niet presenteren als gebouwde vier-divisiewereld.

## 4. Eigen controle op de actuele standalone build

**Bron:** exact dist/artifact.html blob df9f69cc45a8d6f3db975fe14e4aa688515d3487 op voorzitter-fundering; JavaScript geëvalueerd als headless engine en seizoenen opgebouwd met dezelfde directe functieroute als tests/ground-test.js. Geen Playwright/browser, geen UI-klikken, geen volledige test-suite.

### A. Positieve checks (seed 5; 30 weken)

- Identieke seed → identiek wekelijks grootboek: **PASS**.
- Een nieuw ringproject wordt na verloop zichtbaar als extra ring: **PASS**.
- Bouwproject voor medisch gebouw kan opleveren: **PASS**.
- Zonder betere toegang en veiligheid blijft extra tribune-inhoud boven de vergunning ongebruikt: **PASS** (licentiecapaciteit 3.800).
- Met bouw voor ring + toegangsvoorziening + veiligheid neemt vergunde capaciteit toe: **PASS** (3.800 → 4.900).
- Bouwen kost geld; de geobserveerde seizoensnetto's waren £−131,1k versus £−217,1k in de testopzet: **PASS** op kosten-effect, geen balansbewijs.
- Afdelingsbudgetten beïnvloeden kosten: genereus circa £−141,8k, krap circa £−120,7k tegenover baseline £−131,1k: **PASS** op dit effect, niet automatisch bewijs van een aantrekkelijke trade-off.

### B. Aangetoonde P0-kloof: berekend medisch effect zonder echt sportief gevolg

Contrafeitelijke headless test, seeds **5, 11, 17, 23 en 31**. Dezelfde spelstand na newGame/cfInit; alleen de toestand van één kavel gewijzigd naar **medical level 8, condition 100** (een testinjectie, geen echte aankoop). Vervolgens dertig weken gespeeld met identieke seed.

| Seed | Blessurerisico UI/systeem normaal → medisch lvl 8 | Blessures normaal → medisch | Wedstrijdpunten |
|---|---|---|---|
| 5 | 0,95 → 0,48 | 16 → 16 | gelijk |
| 11 | 0,95 → 0,48 | 22 → 22 | gelijk |
| 17 | 0,95 → 0,48 | 18 → 18 | gelijk |
| 23 | 0,95 → 0,48 | 24 → 24 | gelijk |
| 31 | 0,95 → 0,48 | 15 → 15 | gelijk |

Ook het blessureschema was per seed **identiek**, niet alleen de totalen. Dit komt overeen met code-inspectie: groundSignals() berekent injuryRisk, maar de blessurelogica in src/club/club.js leest deze waarde niet. cfStrength() leest squadQuality, niet trainings- of veldkwaliteit.

**Conclusie:** gameplay-effect wordt zichtbaar voorgespiegeld zonder uitvoering in de sportengine. Dit is méér dan een ontbrekende animatie. Dit is geen claim dat de hele game niet werkt; de kosten-/capaciteitsketens werken aantoonbaar.

## 5. Prioritaire tekortkomingen — nu codegericht

| Prio | Probleem | Concrete bron | Juiste vervolg |
|---|---|---|---|
| P0 | Clubfaciliteiten beïnvloeden nauwelijks de voetbalwerkelijkheid | groundSignals in club/ground.js; cfStrength en blessures in club/club.js; world/football.js | Verbind de bestaande signalen met reële training, blessurerisico, jeugd, scouting, veld en thuisvoordeel; met seed-vaste counterfactualtests. Niet via een cosmetische bonuskaart |
| P0 | Financiële waarheid kan uit meerdere codepaden komen | transferkopen en -verkopen muteren c.cash in club/club.js, terwijl finance.js een afzonderlijk weekgrootboek bijhoudt; moties muteren c.cash in chairman/flow.js | Audit kas/boekingen en introduceer een centrale transactie-API; bewijs reconcilieerbaarheid en idempotentie. Het precieze lek is een verificatiehypothese, geen volledig bewezen balansfout |
| P0 | De gekozen competitie-/startstructuur wijkt af van code | besluit 82 vs newWorld in world/world.js | Eerst ontwerpbesluit en code in kaart brengen; daarna migratie voor bestaande saves en 4-divisietests, niet stilzwijgend aannemen dat dit al bestaat |
| P1 | Leden reageren niet betekenisvol op infrastructuur-/prijskeuzes | LAGEN-INVENTARIS + current finance/ground/chairman code | Contract voor voorkeurssignalen, echte afwegingen; bouw nog geen volledige politieke rewrite |
| P1 | Grote financieringsmechanieken vooral op papier | LAAG2-FINANCIEN v3 vs club/finance.js | Één instrument tegelijk met realistische cashflow, voorwaarden, terugbetaling, wanbetaling en alternatieven |
| P1 | Vergunning/bond/gemeente nog geen echte instituties | projectvergunning in ground.js, wereld in world.js; laag 6 ontbreekt | Eerst expliciete service-interface plus geloofwaardige restricties. Nieuwe wereldagenten pas wanneer clubmanagement dit nodig heeft |
| P1 | Infrastructuur heeft veel opties maar geen bewezen niet-dominante strategieset | club/ground.js, ground-test.js | Vergelijk 3 strategieën op exact dezelfde seeds en leg financiële en sportieve afruilen vast |
| P1 | Club v1 is nog niet als zelfstandig *spel* door mensen getest | ground-test.js is technische test; ui/system.js is schermcode | Mobiele playtest: rustige week, keuze, bouw, 10 weken effect, 2 seizoenen herstel; registreer daadwerkelijke wens tot doorspelen |
| P2 | Persoonlijke invloed / familie-erfenis nog niet uitgebreid | laag 3 en 7 documenten | Niet gelijktijdig bouwen; wel contracten en persistente IDs ontwerpen |

### Aanvullende precisie

De huidige attendance() in finance.js **reageert wel degelijk op prijs** met een elasticiteitsformule. De historische inventaris noemt een probleem van te hoge prijzen; onderzoek dat kwantitatief voordat je zegt dat 'prijzen geen effect hebben'. De **ledenpolitieke prijsreactie** is een afzonderlijk ontbrekend mechanisme.

## 6. Wat nu 'Clubsysteem als zelfstandig spel' betekent

**Het zelfstandige clubsysteem bestaat uit speellaag 1 plus speellaag 2** en gebruikt de reeds bestaande sportieve context waar nodig als feedback. Geen verplicht gecombineerde People/Board/Family-sprint.

**Minimale echte spelerwerkwoorden:**
- onderzoeken/vergelijking openen;
- clubgebied en faciliteiten plannen;
- project starten met aannemer, financiering en tijdsrisico;
- prijzen, exploitatie en afdelingsbudgetten kiezen;
- onderhoud inplannen of risico nemen;
- financieringsconstructie aanvragen en schuld beheersen;
- voortgang, kasprognose en gevolgen toetsen;
- koers bijstellen, uitstellen, verkopen of herstelpad kiezen.

**Volledigheid is geen hoeveelheid tabs.** Een klein clubje moet bewust goedkoop en duurzaam kunnen blijven. Een andere club kan opbouwen via faciliteiten/jeugd of via omzet en stadioninvesteringen. Geen strategie mag per definitie altijd beter zijn; balans moet met dezelfde seeds en menselijk spel worden getoetst.

**Technische interface:**
- Laag 1 bezit Facility/Asset/Project/Condition/Capacity/DepartmentState.
- Laag 2 bezit Cash/Debt/Financing/Journal/Forecast/Price/ApprovedBudget.
- Cross-layer contracten leveren expliciete outputs zoals facility.trainingEffect, facility.injuryRiskEffect, stadium.licensedCapacity, finance.authorizedBudget en finance.cashCommitted.
- Alleen de eigenaar van het object muteert het. Projectbetalingen moeten één keer worden geboekt door Financiën; Clubbeheer vraagt budget en meldt voortgang.
- Volwassen koppeling later via signalen naar Mensen, Voetbal, Leden, Wereld en Dynastie; deze andere engines zijn geen vereiste om de eerste *zelfstandig speelbare* clubmanagementrelease te bereiken.

**Eerst te bewijzen clubloop:** clubscan → eigen investeringsinitiatief → haalbaarheid/alternatieven → financiering + projectautoriteit → voortgang → gerealiseerde clubtoestand → tastbaar voordeel/nadeel na maanden en seizoenen. Dit is **niet** de oude geïntegreerde keten over alle vier hoofdproductpijlers.

## 7. Herzien, bewijsbaar ontwikkelplan (ontwerpvoorstel; niet uitgevoerd)

- **C0 — Baseline vasthouden:** bouw en test de huidige voorzitter-fundering. Geen reset naar claude-game of chatgpt zonder bewijs. Leg SHA, huidige saves, screenshots en scenario's vast.
- **C1 — Club-/geldwaarheid:** één transactiejournaal, projectafrekening, onderhoud, prijzen en budget; herstel/wanbetalingsscenario. Bestaande code behouden waar correct.
- **C2 — Effecten echt maken:** elke faciliteit levert een meetbare output aan de bestaande sport-/exploitatie-engine. Test medicus, jeugd, training, veld en scouten afzonderlijk, ook met exact dezelfde seed.
- **C3 — Financiële keuzes verdiepen:** aflossing, financieringsinstrumenten, contractvoorwaarden, budgetkeuzes, liquiditeit bij promotie/degradatie; geen lineaire dominante investeringsvolgorde.
- **C4 — Clubmanagement als zelfstandige release:** minimaal 2/5/10-seizoenssims, eerlijke tegenfeitelijke keuzes, 45–60 minuten mobiele mensentest, verlies/herstel, save/load en regressies tegen bestaand voorzittersspel.

Een milestone is pas 'klaar' wanneer het **daadwerkelijk speelbaar** en technisch juist is; geen documentendatum, codeomvang of UI-tab is een release gate.

## 8. Welke bronnen Claude EERST moet lezen

Op repo Blauwev0gel/front-office-fc, **branch voorzitter-fundering**:

1. standalone-research/LEESWIJZER-VOORZITTER.md
2. standalone-research/CONCEPT-VOORZITTER-2026-11-18.md (besluiten 76–82; actuele commit controleren)
3. standalone-research/LAGENMODEL-VOORZITTER.md
4. standalone-research/LAGEN-INVENTARIS-VOORZITTER.md
5. standalone-research/ENGINE-VOORZITTER.md
6. standalone-research/LAAG1-CLUBBEHEER-VOORZITTER.md
7. standalone-research/LAAG2-FINANCIEN-VOORZITTER.md
8. standalone-research/LAAG3-MENSEN-VOORZITTER.md
9. standalone-research/LAAG4-VOETBAL-VOORZITTER.md
10. standalone-research/LAAG5-LEDEN-VOORZITTER.md
11. standalone-research/LOOP-DYNASTIE-VOORZITTER.md en SPELLOOP-VOORZITTER.md
12. Actual src files en tests als genoemd boven; speel de build indien tooling beschikbaar.

Gebruik de oudere documenten in de **chatgpt**-onderzoeksmap uitsluitend als historische ideeënbron nadat deze actuele branch is gelezen. **Niet** de oude README als leidende interpretatie nemen.

## 9. Bewijsstatus en beperkingen

- **CODE:** de genoemde bronfiles, belangrijke statusmismatches, stadium-/finance-/clubfuncties.
- **HEADLESS TEST:** 7 gerichte bouw/economische controles, 5 seed-paired medische causaliteitsproeven.
- **DOC:** status van ontwerpkeuzes 80–82, inventarisbeoordelingen en werkplan.
- **NIET GETEST:** huidige volledige Node-testsuite, Playwright/Chrome op actuele build, menselijke retentie/plezier, 10–40 seizoenen en save-migraties.
- **VOORSTEL:** de mapping van vier macro-ontwikkelpijlers op zeven speellagen en de C0–C4 werkvolgorde; bestaande gebruikerskeuzes en bronarchitectuur zijn leidend.

**Geen GitHub-gamecode of gameplay in dit corrigendum gewijzigd.**
