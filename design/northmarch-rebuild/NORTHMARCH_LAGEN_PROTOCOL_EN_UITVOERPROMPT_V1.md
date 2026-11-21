# NORTHMARCH — MASTERPROMPT: LAAG VOOR LAAG VAN BESTAAND SPEL NAAR VOLWAARDIGE VOETBALMANAGER

**Status:** uitvoerend ontwikkelprotocol, versie 1.0 — 21 november 2026.  
**Doel:** gericht onderzoeken, met de speler ontwerpbesluiten nemen, een nieuwe speelbare game bouwen én per laag de werking aantonen.  
**Repository:** Blauwev0gel/front-office-fc.

## 0. DE OPDRACHT — VERANDER DIT NIET IN EEN NIEUW CONCEPTPROJECT

Je bent lead game designer, simulation systems engineer, integrator en game developer.

Er is AL een functionerende Northmarch-game met een sterke laag voor personages, verkiezingen, autonomie in beperkte vorm, gebeurtenissen, afspraken en reacties. De primaire bestaande versie staat op:
- branch: claude/loving-goodall-uv00vn
- bestand: standalone/front-office-fc/voorzitter/northmarch.html
- laatst door ons bekeken commit: 7a2d5d3a8efb58ea05759e8d3b86d305bb3d8673

Dit is de **basis en identiteit**, niet de bron van alle reeds bestaande functionaliteit. Andere branches bevatten afzonderlijk gebouwde club-, financiële-, speler-, transfer- en wedstrijdsystemen. **Hergebruik die code aantoonbaar waar dat verantwoord kan.** Schrijf niet eerst een nieuwe versie van iets dat al goed werkt.

Onze eindgame is een **zelfstandig functionerende voetbalmanagementgame**, vergelijkbaar in diepgang van clubbesturing met Football Manager / FC Pro 2 (geen kopie). Als alle verhaalkaarten, bijzondere crises, uitgebreide staff-autonomie en dynastie worden uitgeschakeld, blijven de competitie, clubs, spelers, sportieve ontwikkeling, economie, investeringen, clubbesturing, tijd en seizoenen een volwaardig interessant spel.

Daarbovenop functioneren staff/autonomie, verhaal/politiek en later dynastie als echte extra lagen. De speler is een **gekozen voorzitter van een ledenvereniging**, niet de eigenaar van de club. Hij beheert kaders, de club en de organisatie; niet zelf de opstelling, wedstrijdtactiek of individuele scoutingactie.

### Kernprincipe

**Eerst een wereld die zelfstandig simuleert; dan een club die je proactief kunt besturen; vervolgens medewerkers die jouw besluiten uitvoeren; daarna verhalen die uit die wereld ontstaan; daarna generaties.** Alle lagen delen dezelfde echte speltoestand. Een verhaal of agent mag geen parallelle nep-economie aanmaken.

## 1. DE VIJF FUNCTIONELE LAGEN — IN DEZE VOLGORDE

Dit zijn vijf **product-/gameplaylagen**. Verwar deze niet met de bestaande **zeven domein-speellagen** uit voorzitter-fundering of met tijdslagen (moment/week/maand/seizoen/carrière). Die andere indelingen beschrijven respectievelijk eigenaarschap van simulatiegegevens en simulatieritme. Ze blijven bruikbaar, maar vormen GEEN concurrerende roadmap.

### L1 — ZELFSTANDIGE VOETBALWERELD EN SIMULATIE (de onderlaag)

**Moet zonder verhalen en zonder AI-personeel functioneren.**
- Competitiewereld: clubs, divisies, kalender, speelrondes, standen, promotie/degradatie, AI-clubs.
- Sport: selecties, individuele spelers, kwaliteiten, contracten, conditie, groei, blessures, transfers, jeugd, scouting, trainingen, wedstrijden.
- Club/economie als simulatie: kas, balans, inkomsten, kosten, verplichtingen, schulden, capaciteit, stadion, faciliteiten, projecten, onderhoud, budgetten.
- Een gedeelde tijdmotor, reproduceerbare RNG, spelhistorie, save/load en integriteitsregels.
- Autonome wereldprocessen mogen via **regelgebaseerde systemen** draaien; dit vraagt nog geen uitgewerkte personeelsagenten of verhalen.

**Acceptatie:** met alle hogere lagen uitgeschakeld lopen minimaal tien seizoenen correct door; clubs worden rijker/armer, spelers ouder/veranderen, infrastructuur en financiën verouderen of verbeteren, sportieve gevolgen zijn causaal, saves blijven werken. De basis bestaat niet uit een script dat alleen nieuwe verhaalkaarten uitdeelt.

### L2 — VOLWAARDIG CLUBMANAGEMENT (de actieve spelervaring)

**Bouwt OP L1, vervangt L1 niet.**
- Altijd beschikbare clubschermen: diagnose, historie, vergelijking, planning, transacties, strategische doelen.
- Stadion, tribunes, terrein, training, medisch, jeugd, scouting, commercie, afdelingen, prijzen en begroting.
- Proactieve werkwoorden: inspecteren, onderzoeken, vergelijken, beslissen, starten, uitstellen, financieren, onderhouden, evalueren en bijsturen.
- Investeringen met looptijd, risico, onderhoud, afschrijving en alternatieven; verschillende levensvatbare strategieën.
- De gekozen voorzitter werkt binnen geloofwaardige bevoegdheden en verenigingsregels. **Geen verplichte pop-up of inboxkaart om een nieuwe stap te kunnen zetten.**
- Iedere actie heeft een werkelijke systeemuitkomst. Bijvoorbeeld training verbetert feitelijk de ontwikkeling van spelers, niet alleen een label in het overzicht.

**Acceptatie:** een menselijke speler kan meerdere seizoenen zinvol runnen en groeien zonder verhaalkaarten, personeelsgesprekken of dynastie; er is ieder seizoen een begrijpelijke keuze met trade-offs tussen sport, geld, infrastructuur en risico. Maximaal investeren is niet altijd de optimale strategie.

### L3 — STAFF, MANDATEN EN AUTONOMIE

**Bouwt op dezelfde simulatie van L1 en player commands van L2.**
- Directeuren, trainers, scouts en afdelingshoofden hebben vakmanschap, karakter, belangen, rol en bevoegdheden.
- Je stelt kaders, kiest mensen en gaat betekenisvolle gesprekken aan; zij voeren toegestane acties zelfstandig uit.
- Mandaten bevatten doel, budget, bevoegdheid, looptijd, beoordelingsmoment en afwijkingsprocedure.
- Agenten gebruiken **dezelfde commando- en validatielaag** als de speler. Personeel kan niet via een verhaalkaart een niet-bestaande transfer, inkomstenpost of faciliteit realiseren.
- Volledige controle kan naar gelang het systeem gedelegeerd worden; autonomie moet toegevoegde gameplay zijn, niet een voorwaarde om L2 te spelen.

**Acceptatie:** twee verschillende stafprofielen en twee verschillende mandaten leveren op identieke uitgangsseeds meetbaar andere, uitlegbare beslissingen en uitvoeringssporen op. De speler ziet oorzaak → opdracht → uitvoering → resultaat.

### L4 — VERHALEN, PERSONEN, LEDEN EN POLITIEK

**Hier hergebruiken we de sterke Loving Goodall-kern.**
- Personen hebben geheugen, loyaliteit, waarden, relaties en een loopbaan.
- De bestaande gebeurtenissen, gesprekken, kaarten, krant, beloftes, oppositie en ALV blijven herkenbaar.
- Verhaalsituaties komen primair voort uit het echte systeemlog (verliesreeks, schuld, bouwvertraging, verkoop, conflict) en kunnen nieuwe systeemacties aanvragen.
- Afzonderlijk instelbare story OFF-modus: wereld en actieve clubbesturing functioneren dan onverminderd.
- Geen willekeurige verplichte beslissingen ter vervanging van daadwerkelijke clubmanagementmechanieken.

**Acceptatie:** dezelfde gameplayhistorie is met verhaal AAN beter beleefbaar, maar zonder verhalen mechanisch coherent. Een verhaal dat £30k kost boekt daadwerkelijk één transactie en respecteert bestaande goedkeuringen.

### L5 — DYNASTIE EN GENERATIES

- Leeftijd, familie, persoonlijke loopbanen, reputatie, langdurige banden, rivaliteiten, erfenis van sociale invloed.
- De **vereniging** blijft zelfstandig; de voorzitterspost wordt nooit automatisch geërfd.
- Geen dynastie die alleen uit een stamboomscherm bestaat; generaties moeten echte verkiezingen, medewerkers, clubs en historische consequenties beïnvloeden.
- De tijdmotor en persoons-ID's van L1/L3/L4 ondersteunen lange duur en opvolging.

**Acceptatie:** aantoonbare loopbanen en machtswisselingen over meerdere generaties; een opvolger moet volgens bestaande clubregels gekozen worden. Speelbare clubmanagementsimulatie blijft bestaan als de familie-engine uitstaat.

### Dwars door alle lagen: technische fundamenten

Dit is geen extra gameplaylaag: gedeelde kalender, deterministische simulatie, data-eigenaarschap, gebeurtenislog, validatie van commando's, migraties/savegames, testen, mobiele UI en versiebeheer.

## 2. GEBRUIK ALLE BESTAANDE CODE ALS EEN BIBLIOTHEEK — GEEN BLINDE MERGE

Bestaande referentiebranches:
- claude/loving-goodall-uv00vn — **canonieke basis**; behoud spelgevoel, personages, ALV, verhalen, keuzes, ritme en visuele taal.
- voorzitter-fundering — expliciet inspecteren: standalone/front-office-fc/voorzitter-fundering/src/club/{ground,finance,club,players,market,td,summer}.js; src/world/{world,football}.js; src/chairman/flow.js; src/ui/system.js; tests/.
- claude-game — relevante sport-, week-, transfer-, autonomie-, ui- en scenario-implementaties.
- chatgpt — bestaande gameplay-, UI- en testmodules, plus documentatie.
- main — historische gedeelde baseline en bestaande modules.
- feature/situation-driven-weekloop; feature/transfer-summer-v3; fix/redbox-decisions-no-action-points — smalle herbruikbare functionaliteit, geen automatisch actueel product.
- archive/front-office-standalone-20261118; docs/modular-foundation-research-20261118 — oudere experimenten en hypotheses.

**Kostenefficiënte inspectie:** bekijk per fase ALLEEN bestanden die voor de betreffende laag relevant zijn. Inventariseer globaal wat al bestaat, maar lees niet elke branch integraal voordat je begint. Gebruik specifieke sourcefiles, tests en commits; geen 'Claude moet eerst heel de repo onderzoeken'-ritueel.

Voor iedere functie of module leg je vast:
- bronbranch + pad + gecontroleerde commit;
- wat functioneert in code en wat de tests daadwerkelijk bewijzen;
- dependencies en mogelijke incompatibiliteiten met Northmarch;
- keuze: letterlijk hergebruiken / aanpassen / vervangen / tijdelijk buiten scope;
- welk testbewijs ontbreekt.

Een documentenclaim zonder uitgevoerde codecheck is **niet bewezen**. Een groot bestand is niet automatisch een goed systeem. Voeg niet twee strijdige simulaties samen: kies één source-of-truth per concept.

## 3. EEN UNIFORM LAAGCONTRACT — ALTIJD HETZELFDE PROCES

Voor **elke laag** maak je een afzonderlijk document in docs/layers/L1-... tot en met L5-... met exact:

1. **Spelbelofte:** wat kan de speler of wereld hier dat zonder deze laag niet kan?
2. **Bestaande code:** branches, bronbestanden, daadwerkelijke functies en teststatus.
3. **Eigen gegevens:** welke toestand wordt uitsluitend door deze laag/domeinengine geschreven?
4. **Belangrijkste mechanieken:** regels, tick-frequentie, dynamiek en beperkingen.
5. **Speleracties:** concrete werkwoorden en schermen; wat kan altijd, wat niet?
6. **Input/Output:** signalen en commands van/naar andere lagen, met concrete data-contracten.
7. **Economische en sportieve consequenties:** korte en lange termijn, feedback en verlies/herstel.
8. **Autonome werking:** wat gebeurt er als de speler niets doet of verhalen uitstaan?
9. **Spelvariatie:** twee of meer plausibele speelstrategieën met verschillende trade-offs.
10. **Open keuzes:** alleen beslissingen die productrichting veranderen.
11. **Acceptatietests:** isolate, integratie, contrafeitelijke A/B-seeds, menselijk speelgevoel.
12. **Bouwstatus:** Ontwerp → Code → Geïntegreerd → Speelbaar → Gevalideerd; met bewijs en expliciete blockers.

**Niet doorgaan naar een volgende laag op basis van alleen een document of een UI.** Iedere laag krijgt een werkend einde-tot-einde spelvoorbeeld, ook met hogere lagen uitgeschakeld. Blijf compatibel met de al spelende Northmarch-basis.

## 4. WERKWIJZE: ZES POORTEN PER LAAG

### Poort A — inventarisatie (kort)
Lees bestaande Northmarch-code en zoek gericht herbruikbare code voor de laag. Lever hooguit één compacte hergebruikmatrix plus de belangrijkste tekortkomingen, gescheiden in bewezen en vermoed.

### Poort B — ontwerpbesluiten
Formuleer maximaal **drie wezenlijke ontwerpvragen** per laag, **één tegelijk**. Geef duidelijke alternatieven, consequenties, en jouw kritische voorkeur. Geen herhaling van reeds gemaakte keuzes. Leg ieder antwoord met datum en reden vast in docs/DECISIONS.md. Als code al een beslissing kan ondersteunen zonder gebruikerskeuze, besluit technisch zelfstandig.

**Wacht op antwoord waar echt een productbeslissing nodig is.** Daarna geen nieuwe goedkeuringsvraag bij iedere technische stap.

### Poort C — spec en afhankelijkheden
Beschrijf de laag volgens het 12-puntencontract. Definieer minimaal één concreet pad van speleractie → systeemverandering → waarneembare consequentie. Specificeer koppelingen, modulegrenzen, data-eigenaarschap en migraties. Vermeld duidelijk wat hergebruikt wordt.

### Poort D — bouw in verticale speelbare stukken
Bouw de kleinste **samenhangende** implementatie waarin echte beslissingen tot meetbare gevolgen leiden. Gebruik bestaande modules waar mogelijk. Test elk onderdeel direct. Vermijd het bouwen van vele lege menu's, placeholdergetallen of nieuwe kaarten zonder simulatiewaarde.

### Poort E — bewijs
- Isolatietests van formules, geld, clubobjecten en kalender.
- End-to-end test zonder hogere lagen (story OFF, staff autonomy OFF, dynasty OFF).
- Contrafeitelijke tests met dezelfde seed en één afwijkende keuze; onderzoek zowel effect als neveneffecten.
- Multi-season en stress-simulaties, geen geheime geldcreatie of kapotte save.
- Browser/mobile playtest en menselijk speeloordeel **alleen claimen als echt uitgevoerd**.
- Controleer dat het bestaande Northmarch-verhaal- en verkiezingsspel niet kapotgaat.

### Poort F — speelbare release
Publiceer uitsluitend een **volledige standalone HTML-game** van een gevalideerde mijlpaal en onderhoud daarnaast modulaire broncode. Behoud een onveranderlijke laatst-speelbare build als fallback. Een mislukte candidate is geen release. Vermeld build/SHA, uitgevoerde tests, hergebruik en open tekortkomingen.

**Geen achtergronduitvoering beloven en geen 'klaar' claimen op basis van losse bestanden.** Lever binnen de actieve uitvoersessie daadwerkelijke resultaten op.

## 5. ALGEMENE ENGINECONTRACTEN

- **Één centrale klok**: één deterministische advance/tick-route voor week, wedstrijd, maand, seizoen en carrièremomenten. Modules krijgen events met voldoende context, niet willekeurige UI-calls.
- **Één waarheid per domein**: bijvoorbeeld Finance boekt cash/leningen; ClubAssets bezit faciliteiten; Football bezit spelerscontracten/uitslagen; People bezit persoonsrelaties; Politics bezit stemmingen en statuten.
- **Commands** zoals StartProject, ChangeTicketPrice, SetBudget, SignContract, HireDirector, ProposeMotion krijgen autorisatie- en validatieregels. Speler, agenten en verhalen gebruiken dezelfde commands.
- **Events** zoals ProjectCompleted, CashShortfall, PlayerInjured, CoachDismissed, MemberMotionPassed en SeasonClosed zijn feiten die andere lagen mogen lezen. Geen dubbele mutaties via UI of verhaalscripts.
- **Saves**: versieer schema en migraties; persistente club-/speler-/persoon-ID's; herstel verouderde saves expliciet.
- **Togglebare bovenlagen**: story OFF / autonomy OFF / dynasty OFF voor technische en speelbaarheidstests. Bestaande Northmarch met alles AAN blijft herkenbaar.

## 6. BOUWVOLGORDE EN EERSTE UITVOERING

**Fase 0 — veilig referentiepunt**
1. Controleer de werkelijke Loving Goodall-HTML op de genoemde branch/SHA, maak testbaseline voor nieuw spel, keuze, competitie, leden, verhaal, save/load.
2. Bewaar een exacte onveranderlijke kopie; wijzig de oorspronkelijke branches niet.
3. Maak pas na noodzakelijke ontwerpkeuzes een **nieuwe werkbranch**, bijvoorbeeld feature/northmarch-layered-game; geen merge naar main of publieke deploy zonder expliciete toestemming.

**Fase 1 — L1 simulatiefundament**
Hergebruik waar mogelijk de bestaande voetbal-, speler-, competitie-, financiële-, club- en transfermodules. Maak een consistente, afzonderlijk testbare echte spelwereld, niet uitsluitend Club.str + Cash. Koppel simulatiecorrectheid aan een 10-seizoenstest zonder verhalen. De club mag niet alleen via verhaalkaarten geld verdienen/verliezen.

**Fase 2 — L2 speelbaar clubmanagement**
Bouw een volwaardige clubhub met infrastructuur, projecten, onderhoud, economie en reële keuze-consequentieketens. Integratie met L1 verplicht; zichtbare wederkerigheid clubinvestering ↔ sport/inkomsten. Proactief spel zonder verhaalkaart aantoonbaar leuk/zinvol.

**Fase 3 — L3 autonomie**
Breng bestaande personages, TD en staf in als agenten op de **al bestaande** simulatiecommands. Mandaten, deadlines, initiatief en verantwoordingsgesprekken zijn nu functioneel.

**Fase 4 — L4 bestaande Loving Goodall-verhalen en politiek**
Bevestig behoud van bestaande flows na iedere eerdere fase; koppel nu de rijke verhalen aan echte events en choices aan echte commands. Geen opnieuw geschreven los verhalenspel.

**Fase 5 — L5 dynastie**
Pas na de werkende kern, clubbesturing en autonomie; binnen ledenclubdemocratie en de bestaande langere geschiedenis.

Deze fasen zijn geen vijf afzonderlijke apps. Na iedere fase bestaat een speelbaar geheel; de laag erboven wordt alleen aangezet wanneer hij daadwerkelijk waarde toevoegt.

## 7. VERPLICHTE DOCUMENTEN EN STATUSVERANTWOORDING

Behoud de twee oorspronkelijke documenten:
- design/northmarch-rebuild/NORTHMARCH_ARCHITECTUUR_EN_BOUWAANPAK_V1.md
- design/northmarch-rebuild/NORTHMARCH_MASTERPROMPT_GELAAGDE_FOOTBALMANAGER_V1.md

Dit document specificeert **hoe** ze uitgevoerd worden via lagen en is vanaf nu de leidende **werkwijzeprompt**, zonder de gamevisie te vervangen.

Op de nieuwe ontwikkelbranch:
- docs/DECISIONS.md — vastgelegde gebruikerskeuzes, supersessions en reden.
- docs/LAYER_INDEX.md — per laag status en het bewijs.
- docs/layers/L1-SIMULATION.md ... L5-DYNASTY.md — uniforme contracten.
- docs/CODE_REUSE_LEDGER.md — branch, file, SHA en hergebruikkeuze.
- docs/ARCHITECTURE.md — technische source of truth, commands/events/schema's.
- docs/TEST_EVIDENCE.md — testcommando, seed, uitkomst, UI/browserteststatus.
- docs/WORK_LOG.md — uitgevoerde wijzigingen, bugs, eerstvolgende stap.

Bij afronding van een laag niet alleen zeggen 'gemaakt': toon **werkende HTML**, duidelijke nieuwe speleracties, werkelijke gevolgen, codeherkomst en testbewijs.

## 8. STARTINSTRUCTIE — GEEN NIEUWE BREDE ONDERZOEKSRONDE

**Begin met FASE 0 / POORT A voor L1 + de minimale interfaces die L2 nodig heeft.**

1. Lees de bestaande Loving Goodall-gamebron. Gebruik de bekende inventory om direct de ontbrekende zelfstandige simulatiedomeinen te identificeren.
2. Inspecteer daarna *gericht* de bruikbare voetbal-/financiële-/clubcode in voorzitter-fundering en maximaal de relevante aanvullende branchfiles. Beperk de eerste terugkoppeling tot een korte hergebruikmatrix met codebewijs en max vijf echte gaten.
3. Leg de niet-onderhandelbare spelvisie expliciet vast; verzin geen nieuwe vierlagen-/zevenlagenroadmap.
4. Stel de **eerste wezenlijke ontwerpvraag** (één tegelijk). Werk in vervolgvragen toe naar de compacte eerste echt speelbare L1/L2-release.
5. Na de antwoorden: bouw op de nieuwe branch, integreer bestaande modules, test en lever een gevalideerd standalone HTML-spel. Ga vervolgens volgens hetzelfde protocol door naar de volgende laag.

**Wat wij NIET willen:** opnieuw een losse conceptgame, een brede vrijblijvende audit, nieuwe verhaalkaarten als vervanging voor gameplay, automatische enorme merges, een abstracte 'FM-achtige' ambitie zonder systeemtests, of een incomplete HTML-kandidaat die als release wordt verkocht.
