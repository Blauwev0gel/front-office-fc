# MASTERPROMPT — NORTHMARCH: VAN VERHAALGAME NAAR VOLWAARDIGE VOETBALMANAGER

## Jouw rol en eindopdracht

Je bent tegelijkertijd lead game designer, systems designer, gameplay engineer en technische integrator. Je opdracht is **niet** om opnieuw een concept of auditrapport te produceren, maar om **na een korte, gerichte inventarisatie en een beperkt aantal ontwerpvragen een nieuwe, complete speelbare versie van Northmarch te bouwen**. Gebruik maximaal wat al werkt in de bestaande GitHub-repository. Repareer en integreer bestaande systemen waar dat verstandig is; bouw alleen nieuw wat ontbreekt.

**Repository:** `Blauwev0gel/front-office-fc`

**DE BASIS DIE WE BEHOUDEN:** branch `claude/loving-goodall-uv00vn`, bestand `standalone/front-office-fc/voorzitter/northmarch.html`. Dit is de herkenbare bestaande game met ledenclub/voorzitter, personen, loyaliteit, politieke keuzes, verhaalengine, wedstrijden en seizoenen. **Niet vervangen door de oudere `main`, `chatgpt` of `claude-game`-game.** Gebruik die en andere branches wel actief als **bibliotheek van bestaande werkende code**.

### De spelvisie — niet opnieuw ter discussie stellen

We bouwen een managementgame die **zonder verhalen, politieke gebeurtenissen, bijzondere beslissingskaarten, uitgewerkte personeelsautonomie of dynastie volledig zelfstandig kan functioneren**, in de geest van de diepgang en het spelgevoel van *Football Manager* / *FC Pro 2* — niet als kopie.

Een speler kan tientallen seizoenen een voetbalclub besturen, begroten, uitbreiden, onderhouden, keuzes onderzoeken en sportief en financieel laten groeien. De competitie en economie draaien ook door als de speler geen actie onderneemt. Er zijn meerdere zinvolle strategieën, falen heeft herstelmogelijkheden en investeringen hebben meetbare consequenties.

**Daarbovenop** komen uiteindelijk, in deze logische volgorde van afhankelijkheid:

1. **Zelfstandige wereld- en voetbalengine** — clubs, kalender, competitie, spelers, selectie, markt, wedstrijden, seizoen, wereldregels.
2. **Diep clubmanagement en economie** — stadion, clubterrein, faciliteiten, jeugdvoorzieningen, afdelingen, exploitatie, cashflow, schuld, onderhoud, bouw en meerjarige ontwikkeling. De speler kan op eigen initiatief handelen; de inbox is geen toegangspoort.
3. **Staff en autonomie** — medewerkers met vaardigheden, doelen en bevoegdheden voeren afgesproken mandaten uit. Zonder deze rijke laag gebruikt de basisgame eenvoudige, transparante uitvoeringsregels; de competitie mag nooit stilvallen.
4. **Verhaal-, bestuurlijke en consequentielaag** — de bestaande Northmarch-kracht: mensen, herinneringen, leden, ALV, drama, verhalen, keuzes. Deze **reageert op feiten** uit de simulatie en heeft via normale gamecommando's invloed; ze vervangt de simulatie niet.
5. **Dynastie en generaties** — familie, loopbanen, reputatie en continuïteit. Een ledenclub wordt nooit automatisch geërfd; iedere voorzitter moet legitimiteit verwerven.

Dit zijn **architectuurniveaus**. Binnen de basis zitten afzonderlijke **domeinengines** voor onder meer voetbal, financiën, clubfaciliteiten, transfers, jeugd en wereld. Verwar dat niet met tijdslagen (week/maand/seizoen/generatie) of met de zeven speellagen die in ander onderzoek worden beschreven. Maak die drie indelingen expliciet en consistent.

**Harde toets:** zet staff-autonomie, scripts, verhalen, ALV-drama en familie-events uit met een instelbare testmodus. De voetbalwereld, clubbeheer, economie en spelerskeuzes moeten dan nog steeds een boeiend, volwaardig managementspel vormen. De bestaande politieke gebeurtenissen hoeven in normale gameplay niet uit te staan: we behouden ze, maar hun aanwezigheid is geen technisch vereiste om de wereld te laten functioneren.

**Vaste identiteit:** de speler is gekozen voorzitter van een **ledenclub**, niet de eigenaar. Hij bouwt aan de club, bepaalt koers, personeelsmandaten, financiën en infrastructuur, maar kiest niet zelf de opstelling of individuele wedstrijdtactieken. De club bestaat zelfstandig voort wanneer de voorzitter vertrekt.

## FASE A — GERichte codeverkenning, géén maandenlange onderzoeksronde

**Begin bij echte code.** Lees eerst `northmarch.html` op `claude/loving-goodall-uv00vn` en bepaal precies welke `newWorld`, `mkClub`, `makeFixtures`, `simRound`, `promoteRelegate`, `cash`, `mkPerson`, `loy`, `genDesk`, `SIT`, `act`, `save/load` en schermfuncties daadwerkelijk werken.

Bekijk vervolgens de relevante modules/branches **gericht op hergebruik**, niet door elk bestand in de repository in je context te dumpen:

- `voorzitter-fundering`: `standalone/front-office-fc/voorzitter-fundering/src/club/ground.js`, `finance.js`, `club.js`, `players.js`, `market.js`, `td.js`, `summer.js`, `world/world.js`, `world/football.js`, `chairman/flow.js`, `ui/system.js`, plus bijbehorende tests en `dist/index.html`. Bevat vergevorderde bouw-/financiële en spelersmechanieken. Bekijk ook `standalone-research/LAGENMODEL-VOORZITTER.md`, `LAGEN-INVENTARIS-VOORZITTER.md`, `LAAG1-CLUBBEHEER-VOORZITTER.md` en `LAAG2-FINANCIEN-VOORZITTER.md` **als ontwerpbronnen**, niet als onbetwistbare implementatiewaarheid.
- `claude-game`: `src/projects.js`, `src/agreements.js`, `src/parties.js`, `src/world.js`, `src/weekflow.js`, `src/engine/07-finance-transfers.js`, en relevante tests. Controleer of functies achter `PARK`-flags zitten: aanwezige code is niet noodzakelijk actief of goed geïntegreerd.
- `chatgpt`: relevante engine-, club-, inbox-, matchday- en UI-modulecode, niet automatisch leidend voor ontwerp. Onderzoek in `design/research/front-office-fc-four-layers-2026-11/` is **historisch en deels onjuist over de laatste versie**; gebruik het hooguit als ideeënbron na broncodecontrole.
- `main`: gedeelde basis en bruikbare bestaande tests.
- `feature/situation-driven-weekloop`, `feature/transfer-summer-v3`, `fix/redbox-decisions-no-action-points`: uitsluitend de bewezen relevante veranderingen.
- `archive/front-office-standalone-20261118`, `docs/modular-foundation-research-20261118`: alleen voor technieken die anders verloren zouden gaan.

Controleer actuele branch-heads. Vertrouw niet op oudere commit-SHA's of PR-beschrijvingen als bewijs. Vind via echte functies/tests wat al werkt. **Geen blinde merges of complete branchkopieën.** Beslis per module: **REUSE / ADAPT / REWRITE / DEFER**, met één beknopte reden, bronpad, afhankelijkheden en bewijs (gelezen/getest/alleen beschreven).

**Efficiëntiegrens:** lever hier maximaal één compacte inventaris van circa 1–2 pagina's: (1) wat Northmarch werkelijk heeft, (2) herbruikbare modules, (3) zes grootste gaten en (4) de belangrijkste architectuurrisico's. Geen encyclopedische audit en geen nieuwe generieke blueprint. Gebruik codegerichte inspectie en schrijf langere technische details desnoods rechtstreeks naar een repositorydocument.

## FASE B — Stel MIJ gerichte ontwerpvragen en respecteer mijn antwoorden

**Na de eerste inventaris stel je maximaal ZES wezenlijke ontwerpvragen, bij voorkeur één per beurt.** Vraag niet opnieuw naar iets dat al vaststaat. Geef telkens:
- de concrete keuze en waarom zij voor gameplay/architectuur uitmaakt;
- 2–4 *werkelijk verschillende* opties, plus een eigen beredeneerde voorkeur;
- één risico van je voorkeur;
- daarna één directe vraag, zonder ellenlange uitleg.

De zes vraaggebieden (sla een vraag over als het antwoord al vaststaat):
1. **Speler-agency in de kern:** hoe diep de voorzitter direct infrastructuur, afdelingen, economie en voetbalbeleid beheert, vóórdat delegatie wordt aangesloten.
2. **Voetbalengine-doelbeeld:** hoe ver selectie, spelersprofielen, ontwikkeling, transfers en wedstrijdsimulatie voor de eerste volledige versie moeten gaan, zonder trainer-micromanagement.
3. **Wereld en startschaal:** Northmarch-competitie, aantal divisies/clubs en economische startpositie; bestaande documenten spreken elkaar hierover tegen. Presenteer ontwerpkeuzes als keuzes, geen voldongen feiten.
4. **Speltijd en ritme:** hoeveel vrijheid de speler heeft voor acties vóór het doorspelen van een week; wedstrijdscherm/verslag en seizoenovergangen. Geen verplichte 'eerst alle inboxkaarten afwerken'-lus.
5. **Economische complexiteit:** financieel realistisch genoeg voor strategie en herstel, maar niet een boekhoudsimulator zonder spelplezier.
6. **Eerste complete release en uiterlijk:** welke minimaal volledige systemen nodig zijn om V1 tientallen seizoenen zelfstandig speelbaar te maken; behoud of gerichte verbetering van de mobiele Northmarch-beeldtaal.

**Na iedere reactie** verwerk je de keuze in `docs/DECISIONS.md` inclusief motivatie, overwogen alternatieven, gevolgen voor de architectuur en eventueel open risico. Gebruik het meest recente expliciete gebruikersbesluit boven oudere onderzoeksteksten. Zodra de zes (of minder) beslissingen zijn beantwoord, **ga je bouwen zonder opnieuw toestemming te vragen voor iedere kleine stap**. Mocht de gebruiker alle antwoorden in één keer geven, verwerk ze in één keer.

## FASE C — Architectuur die hergebruik mogelijk maakt

Bouw een **modulaire codebase** waaruit een **standalone offline-speelbare HTML** kan worden gegenereerd. Het bestaande `northmarch.html` blijft een onveranderde speelbare referentie. Werk op een **nieuwe aparte ontwikkelbranch**; wijzig of overschrijf `main`, `chatgpt`, `claude-game`, `claude/loving-goodall-uv00vn` en `voorzitter-fundering` niet. Geen deployment naar de hoofdsite en geen merge zonder expliciete opdracht.

Verplichte scheiding:

- `core/` — deterministische RNG, kalender, tick/season scheduler, save- en migratieschema, command bus/event log;
- `world/` — competities, clubs, regelgeving, markten, tegenstanders, externe veranderingen;
- `football/` — spelers, teams, contracten, ontwikkeling, scouting/jeugd, wedstrijden, transfers, statistieken;
- `club/` — bezit, stadion, terrein, faciliteiten, afdelingen, projecten, kwaliteit/staat/capaciteit, onderhoud;
- `finance/` — alle geldstromen, grootboek, cashflow, begroting, schuld, financiering, prijzen, prognoses;
- `people/` — personen, rollen, competenties, relaties, geheugen, mandaten, autonome acties;
- `narrative/` — bestaande Northmarch-situaties, politiek, ALV, pers, consequenties en verhaallijnen;
- `dynasty/` — familie/loopbaan/opvolging, later uit te bouwen;
- `ui/` — mobielvriendelijke beheerschermen, wedstrijdflow, dossiers, overzicht, week/jaarverslag.

Dit is een **gewenste verantwoordelijkheidsverdeling**, geen verplichting om bestaande nuttige code letterlijk naar die mapnamen te verplaatsen. Kies de kleinste veilige migratie.

### De regels van de engines

1. Er bestaat één gedeelde, versieerbare wereldtoestand. Elke domeinengine heeft duidelijk eigenaarschap over haar data.
2. **Geen bypass-mutaties tussen systemen.** Een verhaalkaart, persoon of transfer mag niet rechtstreeks `club.cash += ...` uitvoeren. Alles loopt via een gevalideerd commando en een gebalanceerde, herleidbare transactie.
3. Eén deterministische tijdvoortgang. Vastgelegde volgorde voor acties, personeel, bouw, voetbal, inkomsten/kosten, ontwikkeling, gebeurtenissen en rapportage. Geen dubbele betalingen of dubbel afgehandelde projecten.
4. Autonomie en verhaal lezen gebeurtenissen uit de onderliggende simulatie. Als die lagen uitstaan, werken standaard club- en voetbalprocessen gewoon door.
5. Losse inputcommando's (`StartProject`, `SetTicketPrices`, `ApproveBudget`, `AssignMandate`, `AdvanceWeek`) met succes/falen, kosten, voorwaarden en traceerbare effecten.
6. Save/load ondersteunt nieuwe state zonder oude savegames te beschadigen. Test migraties, reproducibility en twintig seizoenen doorgroei.
7. Design volgens Football Manager-principe: **samenvatting → inspecteren → handelen → gevolg volgen**, met échte getallen onder de motorkap en een leesbare mobiele UI.

## FASE D — Bouw een COMPLETE speelbare game, niet alleen een demo

**V1 moet een complete, doorlopende managementlus hebben**, niet slechts het begin van één seizoen en niet alleen een nieuw clubsysteemscherm.

De eerste volwaardige release moet minimaal bevatten:
- nieuwe club/startgame, echte kalender, competitie, tegenstanders, wedstrijden, stand, promotie/degradatie en seizoensovergangen;
- een cluboverzicht met duidelijke groei-/risicocijfers, bezittingen, stadion, terrein, capaciteit, kwaliteit/staat en onderhoud;
- werkende projectcyclus: voorstel → alternatieven/offertes → kosten/financiering → uitvoering over tijd → vertragingen/risico's → oplevering → exploitatie en onderhoud;
- een sluitende club-economie met inkomsten, kosten, prognoses, schuld/aflossing, exploitatie en redelijke herstelopties;
- voldoende spelers-, selectie- en transfermechaniek om sportieve keuzes en investeringen van gevolgen te voorzien (gebruik wat al werkt; maak duidelijk wat nog niet op FM-diepte zit);
- spelers die zelf initiatieven nemen; elke week kunnen doorspelen zonder eerst door willekeurige verhaalkaarten te moeten;
- wedstrijddag en duidelijk week-/seizoensverslag; jarenlange state-continuïteit;
- de bestaande Northmarch-personen-/bestuurs-/verhaalonderdelen **waar mogelijk behouden en compatibel maken**, maar met een schakelbare verhaalloze testmodus;
- een **complete standalone HTML-release** met alle noodzakelijke CSS/JS, naast de onderhoudbare modulair opgebouwde broncode.

Bouw in kleine technische stappen, maar lever aan de gebruiker **geen onaf fragment als 'eindproduct'**. Iedere zichtbare release moet volledig speelbaar zijn. Houd de laatste gevalideerde versie als fallback. Als een kandidaat niet door de gates komt, lever de laatste werkende build met een duidelijk blockerbericht, niet een kapotte nieuwe versie.

### De centrale gameplay-bewijsvraag

Laat een speler zonder verhaallijnen zelf kiezen tussen bijvoorbeeld:
- financieel gezond blijven en langzaam groeien;
- investeren in infrastructuur/jeugd en langetermijnrendement;
- agressieve sportieve groei met hogere schulden en risico.

De strategieën moeten **werkelijk verschillende trade-offs** opleveren via dezelfde engine. Bouw geen verborgen vaste 'beste upgradevolgorde'. De wereld moet ook geloofwaardig doorlopen wanneer de speler weinig doet.

## FASE E — Verplicht testen vóór oplevering

Automatische en handmatige acceptatie:

1. **Story-off test:** 10 seizoenen zonder verhaallijnen, bijzondere dialogen, dynastie of rijke autonome personeelsagenten. Geen vastlopers; er blijven echte keuzes en gevolgen.
2. **Drie strategieën, identieke seeds:** vergelijk kas, schuld, sportieve prestaties, faciliteiten, groeisnelheid en noodsituaties; leg causale verschillen uit.
3. **Contrafeitelijke investeringstests:** zelfde seed, alleen een investering verschilt. Betere medische faciliteiten moeten bijvoorbeeld *werkelijk* de blessurekans beïnvloeden; niet alleen een displayvariabele. Test ook stadioncapaciteit, training, academie en commercie.
4. **Boekhoudinvarianten:** elke uitgave en ontvangst exact één keer; verwachte kassaldoverandering reconcilieert met transacties, transfers en projecten.
5. **Projecttest:** offertes, vergunningsvertraging, bouw, oplevering, onderhoud en onverwachte kosten over meerdere seizoenen.
6. **Seizoens-/save-/load-tests:** promotie en degradatie, contractverloop, 20 seizoenen, migratie van bestaand save-schema waar mogelijk.
7. **Echte mobiele browserplaytest**, bij voorkeur 390 px: start nieuw spel, navigeer, start project, speel weken, speel wedstrijd, lees rapport, sla op, laad opnieuw en voltooi een seizoen. Meld eerlijk als browserautomatisering niet beschikbaar is.
8. **Verhaal-aan test:** huidige Northmarch-mechanieken blijven werken, ontvangen echte signalen en veroorzaken geen dubbele simulatieresultaten.

Een test die alleen controleert dat een getal verandert is onvoldoende als het downstream-gedrag exact gelijk blijft.

## FASE F — Oplevering, documentatie en vervolg

Bewaar in de **nieuwe ontwikkelbranch** minimaal:
- `docs/PRODUCT_VISION.md` — deze visie en harde spelgrenzen;
- `docs/ARCHITECTURE.md` — eigenaarschap van elke engine, command/event-contracten, tickvolgorde en afhankelijkheden;
- `docs/CODE_REUSE_LEDGER.md` — hergebruik per branch en bestand met bron, keuze en bewijsstatus;
- `docs/DECISIONS.md` — mijn antwoorden, expliciete beslissingen en open ontwerpvragen;
- `docs/ACCEPTANCE.md` — wat een release moet bewijzen, met testresultaten;
- `docs/WORK_LOG.md` — welke functionaliteit gebouwd, getest, uitgesteld of gefaald is;
- `src/`, tests, buildproces en een gevalideerde, **standalone speelbare HTML**.

Eindantwoord per release: **speelbare link of rechtstreeks downloadbaar HTML-bestand**, bronbranch en SHA, wat werkelijk speelbaar is, welke bestaande code is hergebruikt, welke tests daadwerkelijk uitgevoerd zijn, en welke beperkingen nog bestaan. Geen 'klaar' zonder tests en geen claim van FM-diepte als er nog alleen simplistische placeholderstatistieken zijn.

## Directe eerstvolgende actie

**Voer nu uitsluitend FASE A uit en stel daarna de EERSTE wezenlijke ontwerpvraag uit FASE B.** Begin niet met algemene instemming, een nieuwe herschrijving of een brede theoretische audit. Toon dat je het bestaande Northmarch-spel en de concrete code-assets uit de andere branches hebt begrepen. Na mijn antwoorden ga je via FASE C–F daadwerkelijk bouwen, zonder herhaalde overleg- of bevestigingsrondes.
