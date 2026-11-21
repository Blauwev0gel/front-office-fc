# FRONT OFFICE FC — VIERLAGENBLUEPRINT V2.0
## Een levende voetbalclub, een gekozen voorzitter en een familie die haar eigen geschiedenis schrijft

**Datum:** 20 november 2026  
**Type:** zelfstandige game-designbijbel + systeemcontract, **niet** een claim dat alles gebouwd is.  
**Besloten:** gekozen voorzitter van een ledenclub; vier volwaardige, geïntegreerde lagen; voetbal en wedstrijdpresentatie blijven zelfstandig; voorzitter kiest nooit opstelling of individuele transfers.  
**Voorgesteld:** de concrete procedures, regels, datamodellen, interface en ontwikkelvolgorde hieronder. Een `[VOORSTEL]` is nog geen geaccordeerde productregel.  
**Bewijslabels:** `[CODE]` code geïnspecteerd, `[DOC]` documentatie, `[TEST-EERDER]` eerdere headless proef in deze conversatie, `[HYPOTHESE]` nog niet gevalideerd.

---

# 1. Wat voor game is dit?

**De fantasy:** *Je wordt gekozen om een voetbalclub te leiden die niet van jou is. Je probeert sportief succes, een gezonde club en een blijvende traditie te bouwen via mensen die hun eigen belangen hebben. Ondertussen leeft je familie verder: met of zonder jouw invloed, met of zonder een plaats in de bestuurskamer.*

Front Office FC bestaat uit **vier volwaardige gamesystemen die dezelfde wereld delen**, geen vier minigames die via losse menu's naast elkaar leven:

1. **CLUB** — speelbare voetbal- en organisatieontwikkeling.
2. **PEOPLE** — leidinggeven aan zelfstandig handelende personen en netwerken.
3. **BOARD** — zelf initiatieven nemen, tegenstrijdige belangen afwegen, besluiten mogelijk maken, afspraken sluiten en verantwoording afleggen.
4. **FAMILY** — een doorlopend privéleven, loopbanen, vermogen, relaties en meerdere generaties die géén club erven.

De speler is **één persoon op een bepaald moment in de geschiedenis**, niet een onsterfelijke, alwetende account. Die persoon kan gekozen voorzitter zijn, uit zijn functie vertrekken, andere functies vervullen en op termijn door een nieuw speelbaar familielid worden opgevolgd. De club leeft zelfstandig door.

## 1.1 De vijf vragen die de speler steeds moet voelen

| Moment | Spelvraag | Wat mij als speler verder trekt |
|---|---|---|
| Nu | Wie speelt zaterdag en wat staat er op het spel? | De wedstrijd, herkenbare spelers, stand en rivaliteit |
| Komende weken | Wat gebeurt er met mijn plan als ik deze mensen hun gang laat gaan? | Autonome uitvoering en onzekerheid over hun keuzes |
| Komende maanden | Welke ingreep, kans of compromis verandert de koers? | Een beslissing met een echte prijs en een eigen uitvoerder |
| Komende seizoenen | Welke club laat ik achter en kan ik mijn mandaat behouden? | Sportieve ontwikkeling, infrastructuur, bestuurscoalities en vertrouwen |
| Decennia | Wat doen mijn oude vrienden, rivalen en familieleden wanneer ik niet meer aan de macht ben? | Een geschiedenis die nieuwe kansen en problemen produceert |

## 1.2 De rol en haar grenzen

**[BESLOTEN]** Een gekozen voorzitter:
- benoemt, beoordeelt en ontslaat leidinggevenden **voor zover het statuut dat toestaat**;
- stelt beleidsrichting en begrotingen voor, onderhandelt over bestuurlijke steun en laat bevoegde organen beslissen;
- kan mensen aanspreken, informatie vragen, mandaten vastleggen, afspraken sluiten en publieke verantwoordelijkheid nemen;
- onderhandelt **niet** zelf over individuele spelersovereenkomsten, kiest **geen** elftal, spelersrollen, tactiek of wissels;
- kan ontslagen of weggestemd worden zonder dat de club of familie ophoudt te bestaan.

**[BESLOTEN]** Verwantschap biedt geen automatische toegang tot bestuursfuncties. Clubmiddelen, clubrechten, het private huis van de protagonist en diens familiebedrijf zijn **verschillende eigendomsdomeinen**.

## 1.3 De acht kernwerkwoorden

| Werkwoord | UI-actie | Werkelijk gevolg | Geen schijnversie |
|---|---|---|---|
| **Bekijken** | Selectie, wedstrijd, financiële stand, personenarchief openen | Je krijgt informatie waarmee je betere keuzes kunt maken | Een kijkactie verandert nooit stiekem de RNG of resultaten |
| **Agenderen** | Een eigen voorstel of gesprek beginnen | Bereidt een plan, verantwoordelijke of formele procedure voor | Niet wachten op een willekeurige inboxkaart |
| **Benoemen** | Kandidaten vergelijken en een functie toevertrouwen | Andere agent krijgt bevoegdheden, planning en eigen incentives | Niet slechts `staffQuality += 5` |
| **Mandateren** | Doel, limiet, beoordelingsmoment vastleggen | Autonomous agent kan binnen begrenzing handelen | Geen fictieve inspraak op de opstelling |
| **Onderhandelen** | Aanbod, tegenbod, concessie, weigering | Wederkerige afspraak, beperking of geen deal | Geen quiz met één juiste loyaliteitsoptie |
| **Besluiten** | Binnen eigen bevoegdheid bevestigen; anders voorstel voorleggen | Plan/contract/motie gaat naar de juiste bevoegde uitvoerder | Een presidentiële klik omzeilt nooit een ledenveto |
| **Toezien** | Uitvoering, bewijs, risico en deadline bekijken | Mogelijk heronderhandelen, bijsturen of bewust niets doen | Geen gratis, altijd nuttige extra check |
| **Verantwoorden** | Jaarverslag, ledenvragen, ALV, familiegrens toelichten | Nieuwe coalities, mandaten, persoonlijke gevolgen | Niet eenvoudig iedereen +10 stemmen geven |

Familie-acties — steunen, afstand houden, een privéplan financieren of een conflict uitspreken — zijn echte toepassingen van deze werkwoorden in de privésfeer. Daar geldt een ander bevoegdheidsdomein.

## 1.4 Het cruciale spelontwerpbesluit: één gedeelde werkelijkheid

De vier lagen krijgen **eigen doelen en bronnen van spanning**, maar geen eigen kopie van personen, kas, tijd of gebeurtenissen. De TD in de kleedkamer is exact dezelfde persoon die een bestuursbrief schrijft, een aanbod van een rivaal krijgt en misschien de zwager van je hoofdpersoon wordt.

**Invariant:** elk substantieel besluit heeft precies één bron van bevoegdheid, één identificeerbare actor, een navolgbare uitvoeringsgeschiedenis en een werkelijke uitkomst in de wereld. Een latere krant mag interpreteren; zij mag nooit de wereld verzinnen.

---

# 2. De vier speelbare loops

## 2.1 LAAG 1 — Clubmanagement: voetbal als motor

### Kernloop

**Bekijk de toestand → kies strategische richting of prioriteit → delegeer uitvoering → volg wedstrijden, projecten en financiële stromen → beoordeel het resultaat → bepaal volgende koers.**

**Directe spelverlangens:** de derby winnen; een jeugdspeler zien doorbreken; degradatie vermijden; een sluitende begroting vinden; een nieuw trainingscomplex openen; een langdurige rivaal voorbijstreven.

### Wat zit er in de club?

| Subsysteem | Wat de voorzitter zelf mag doen | Wat anderen doen | Zichtbare progressie / risico |
|---|---|---|---|
| Competitie (competitieweken + beker) | Ambitie, trainer, investering en verantwoordingskader kiezen | Coach bepaalt XI, speelwijze, training en vorm | Uitslagen, stand, statistiek, vorm, derby's, promotie/degradatie |
| Selectie | TD-profiel, budget, leeftijds-/jeugdbeleid, verkoop- en salarismandaat bepalen | TD scout/onderhandelt; coach gebruikt beschikbare spelers | Contracten, kwaliteit, blessures, moraal, transferprofielen, mislukte plannen |
| Jeugd | Academy head, leeftijdslijnen, middelen en ontwikkeldoelen bepalen | Opleiding verzorgt ontwikkeling; coach besluit speeltijd | Doorbraak, carrière, verkoopwaarde, clubidentiteit |
| Financiën | Meerjarenbegroting, liquiditeitsbuffer, financieringsvoorwaarden en prioriteiten ter goedkeuring aanbieden | Financieel directeur betaalt, forecast, waarschuwt, adviseert | Cashflow, runway, schuld, verplichtingen, kredietwaardigheid |
| Stadion/faciliteiten | Behoefte vaststellen, businesscase laten maken, route ter goedkeuring indienen | Projectteam/tender/financier werkt binnen goedgekeurd budget | Vaste lasten, capaciteit, vertraging, veiligheid, jeugdgebruik |
| Commercie | Sponsorethiek, prijskaders, doelgroep en bevoegdheden vastleggen | Commercieel hoofd sluit deals; marketing bereikt gemeenschap | Inkomen, lokale loyaliteit, afbreukrisico, toegang tot leden |
| Gemeenschap | Lidmaatschapsstrategie en sociaal clubbeleid ter stemming brengen | Vrijwilligers, supportersgroepen en community-afdeling handelen | Ledeninstroom, betrokkenheid, onvrede, beschikbaar vrijwilligerswerk |

**Niet alleen financieel optimaliseren.** Een kleine club mag bewust weigeren om tickets te verdubbelen en kiest dan bijvoorbeeld lagere winstmarge in ruil voor een hechte ledenbasis. De game beoordeelt dat op zelfgekozen doelstellingen, solvabiliteit en ledenverwachtingen — niet op maximaal banksaldo.

### De manager wil iets dat de voorzitter niet direct kan uitvoeren

De voorzitter kan een TD vragen om *binnen drie jaar meer eigen jeugd in de eerste selectie te brengen*; de TD kan daarop jeugdscouting starten, een oudere speler laten uitstromen of weigeren wegens gebrek aan geschikte talenten. De trainer beslist wie speelt. Daardoor komt invloed **via organisatiegedrag** tot stand, niet via een directe +2-sterktebonus.

### Voetbalervaring op een eigen scherm

**HQ → Wedstrijdvoorbeschouwing → Live wedstrijddag → Uitslag/verklaring → Gazette/weekafsluiting → HQ.** De wedstrijd kan in snelheid worden aangepast of tot fulltime worden gesimuleerd. Die knoppen beïnvloeden **alleen presentatie**, nooit de berekende uitslag. Geen wedstrijd-sms of halve-time instructie namens de voorzitter. Belangrijke clubverhalen — voormalige jeugdspeler tegen je, trainer onder druk, rivaal met ex-TD — staan in de voorbeschouwing en komen ná de wedstrijd terug indien er daadwerkelijk iets gebeurde.

### Financieel model (geeft echte alternatieven)

- **Kaspositie:** actuele beschikbare middelen. Niet gelijk aan vrij besteedbaar projectbudget.
- **Committed funds:** reeds goedgekeurde verplichtingen, contracten, tekorten en bestemmingen. Twee projecten kunnen dezelfde reservering niet tegelijk gebruiken.
- **Weekstromen:** ticketopbrengst, sponsoring, vrijwilligerssubsidies waar relevant, transfers, loonlasten, personeel, faciliteiten, rente/aflossing.
- **Projecten:** `idea → study → approvals → contracted → build/operate → review`, met contractuitval, herfinanciering en vertraging.
- **Reëel herstelpad:** bezuinigingsplan, heronderhandeling schulden, projectuitstel, noodvergadering, eventueel gedwongen insolventie en ontslag. Geen automatische faillissements-reset en geen onmogelijk strafspiraal-scenario.
- **Forecast is onzeker:** de financieel directeur heeft competentie en informatiegrenzen. Speler ziet bandbreedte en aannames, niet een magisch exact eindbedrag.

**[VOORSTEL]** In de eerste release één stadium-/trainingsproject dat door de volledige club-, mens-, besluit- en eventueel familielus loopt; verdere faciliteitscategorieën pas na integratiebewijs.

### Wanneer voelt deze laag als een game?

Een passieve bestuursweek bevat nog altijd uitslagen, competitieposities, spelersminuten, nieuwe talenten, transfers van rivalen en zichtbare budgettrends. De speler moet de volgende wedstrijd willen beleven omdat de **club zélf** een interessant object is — niet omdat er een nieuw dossier is.

## 2.2 LAAG 2 — Personenmanagement: mensen met eigen carrière en macht

### Kernloop

**Ontdek wat iemand kan en wil → kies vertrouwen, afspraak, mandaat of vervanging → de persoon voert uit vanuit eigen drijfveren → zijn resultaten en relaties veranderen → reageer op de nieuwe mensensituatie.**

### Ieder relevant persoon heeft ten minste

- **Identiteit:** stabiel `personId`, leeftijd, naam, woonplaats en historie.
- **Rol(len) en bevoegdheden:** trainer, TD, commissielid, supporter, sponsor, journalist, familielid; meerdere rollen alleen als procedureel toegestaan.
- **Vaardigheden:** per taakgebied plus betrouwbaarheid en communicatie; niet uitsluitend een gemiddelde rating.
- **Persoonlijkheid en waarden:** voorkeuren met gradaties, professionele ethiek, risicohouding, grenzen.
- **Doelen:** publiek verteld doel, eigen langetermijnambitie, mogelijk verborgen bezwaar; geen verplichte 'raad mijn diepe wens'-quiz.
- **Relaties:** vertrouwen, afhankelijkheid, vriendschap, rivaliteit, mentorschap, familiebanden **tussen personen**. Relaties hebben oorzaak en context.
- **Informatie:** wat deze persoon weet, denkt of vermoedt; kan fout zijn of onvolledig.
- **Alternatieven:** externe baanaanbiedingen, andere bondgenoten, ontslag, terugtrekking, clubwisseling.
- **Levensloop:** werkervaring, familiale overgangen, prestaties, reputatie bij onderscheiden groepen.

### Werkelijke handelingsvrijheid

Voordat een agent handelt, moet een regelset controleren:

`bevoegdheid → middelen → contractuele beperkingen → urgentie → eigen doel → relaties/afspraken → kennis → competentie → haalbare actie`.

Een hoogbekwame, principiële financieel directeur kan een geldige, maar riskante strategie actief bekritiseren. Een onervaren, loyale directeur kan juist met goede bedoelingen fouten maken. Een trainer met weinig vertrouwen kan een afspraak passief uitvoeren, zelfstandig alternatieven voorstellen of bij een legitieme bevoegdheidsconflict escaleren.

**Geen nepautonomie:** een karaktertrek mag niet alleen invloed geven op de tekst, maar op concrete acties, vertraagde uitvoering, besluitvorming, onderlinge samenwerking of vertrek. Random weigering zonder grond is ongewenst.

### Relatie- en informatiegame

De speler kan luisteren naar meerdere perspectieven; informatie is **niet** volledig betrouwbaar. De TD zegt dat de coach jeugdspelers niet vertrouwt, de coach zegt dat er geen talent klaarstaat, een ervaren jeugdtrainer ziet wél een mogelijke kandidaat. De speler mag een evaluatie, mediator of proefperiode voorstellen; geen enkele tekstkeuze is op zichzelf 'de juiste oplossing'.

De speler wint informatie door interesse, journalistiek, stafrapporten of een onafhankelijke audit. Dat heeft geloofwaardige tijd- en reputatiekosten, geen verboden '2 gesprekken per maand'-valuta. Het belangrijkste is dat **informatie de opties verandert**, niet alleen een verborgen rapportcijfer.

### Carrières als systeem

Een ontslagen TD verdwijnt niet. Hij komt in de regionale arbeidsmarkt, kan een baan bij een rivaal krijgen, neemt ervaring mee en heeft een geheugen van eerdere afspraken. Een talentvolle jeugdspeler kan later clubicoon, trainer, raadslid of supporter worden. De oude verhouding tot de speler maakt toekomstige contacten anders, maar beslist ze nooit volledig.

### Personeel en bestuur beïnvloeden elkaar

Een populaire trainer kan politieke steun bij supporters hebben; een financieel directeur kan via een onafhankelijke commissie een investering afremmen; een gerespecteerde aanvoerder kan publiek campagne voeren. **Sociale invloed = toegang tot een concrete actie of informatie**, niet enkel een score die iedereen harder laat stemmen.

## 2.3 LAAG 3 — Beslissingen en bestuursmacht: betekenisvolle verantwoordelijkheden

### Kernloop

**Eigen doel of externe aanleiding → feiten en alternatieven → formele bevoegdheid → beslissing / tegenbod / geen besluit → onafhankelijke uitvoering → toetsmoment → nieuw probleem, recht of kans.**

Dit is de centrale verbinding tussen lagen, niet een aparte 'kaartengenerator'.

### Vier verschillende spelobjecten — nooit verwarren

| Object | Wat het is | Voorbeeld | Wat het níet is |
|---|---|---|---|
| **Mandate** | Een geldige bevoegdheid/beleidsgrens voor een functie | TD mag tot bepaald financieel plafond contracten sluiten | Niet een belofte die de TD per definitie graag wil |
| **Agreement** | Wederzijdse toezegging tussen identificeerbare partijen | Coach krijgt tot december gelegenheid; voorzitter verbindt zijn publieke naam | Niet automatisch juridisch goedgekeurd clubbeleid |
| **Decision** | Geautoriseerde vaststelling of formeel voorstel met gevolgen | Bestuur keurt begroting goed of verwijst plan naar ALV | Niet hetzelfde als de uitvoering door een medewerker |
| **Project** | Een meerstappenuitvoering met eigen middelen, eigenaar, risico's | Renovatie trainingsterrein, 6 mijlpalen | Niet een instant upgrade na geldbetaling |

**Regel van voorrang** `[VOORSTEL]`: bestaande statutaire/rechtmatige bevoegdheden en aangenomen bindende besluiten > nieuwe bestuurlijke besluitbevoegdheid > rolspecifiek mandaat > individuele toezegging die juridisch/operationeel uitvoerbaar is. Een privé-afspraak kan een formeel veto niet uitschakelen; haar breuk kan wél politieke gevolgen hebben.

### De besluitkaart bevat

- **Doel** en het feit dat het probleem veroorzaakte; selecteerbaar bewijs.
- **Wie besluit?** `chair / board / committee / memberVote / staffRole`.
- **Wie voert uit?** Een persoon/rol, eventueel meerdere agents met duidelijke taakverdeling.
- **Wat kost het?** Geld, capaciteit, publiek woord, relatie/vertrouwen, formeel besluitrecht.
- **Welke alternatieven?** Inclusief uitstellen of niet handelen, met expliciete gevolgen van niets doen.
- **Welke afspraak geldt al?** Conflicten en bestaande beperkingen zijn zichtbaar.
- **Wanneer terugkoppeling?** Deadline, objectieve mijlpaal of review, niet willekeurige timer.
- **Wat weet ik niet?** Onzekerheid en bron van informatie.

**Transactionele regels:** dezelfde klik wordt via `commandId` exact één keer doorgevoerd. Een afgekeurd besluit reserveert geen geld. Een aangenomen motie is pas geldig na quorum, stemdrempel en formele registratie. Het spel heeft één bron van waarheid over status en bevoegdheid.

### Loving Goodall-afspraak (behouden waar hij hoort)

**You give · They give · Tested · If it fails.** Dit is vooral krachtig bij mensen: publiek beschermen in ruil voor een harde evaluatie, een sponsorbelofte voor toegankelijk voetbal, een bestuurlijke coalitie die een veto op een financieel project krijgt. Niets doen of weigeren moet soms het verstandigste zijn. Het gesprek levert *de mogelijkheid tot een overeenkomst*; het is niet de spelhandeling zelf.

**Een contract heeft twee risico's:** (a) de ander handelt niet zoals verwacht; (b) de voorwaarden blijken onverenigbaar met budget, mandaat of een andere toezegging. De speler ziet botsingen voordat hij instemt, maar niet alle toekomstige gebeurtenissen zijn voorspelbaar.

### Leden en politiek

- Ledenclubs hebben statuten: **wie is lid**, wie stemgerechtigd is, wanneer verkiezingen plaatsvinden, hoe een bestuurszetel ontstaat, welke projecten een meerderheid/kwalificatie vereisen, welke veto's en maximale termijnen gelden.
- De **ALV is jaarlijks** voor verslag, begroting, moties, verantwoording en mogelijk vertrouwen; **verkiezing** volgt de statutaire termijn of een geldige uitzonderingsroute. Deze procedures zijn verwant maar niet hetzelfde.
- **Stem op een motie ≠ stem op de voorzitter.** Een lid kan de huidige voorzitter vertrouwen maar tegen een sponsordeal zijn.
- Ledengroepen hebben belangen, aantallen stemgerechtigden, opkomstmotivatie en geschiedenis. Leiders kunnen mobiliseren maar zijn niet magische stemboosters.
- De oppositie doet eigen, tijdgebonden zetten: nieuwe kandidaat zoeken, een voorstel indienen, vrijwilligers overtuigen, steun van een sponsor weigeren, een foutenrapport publiceren; altijd binnen zijn bevoegdheid en kennis.
- Een aangenomen motie verandert direct **rechten, verplichtingen of de clubkoers**. Geen cosmetische 'ALV gewonnen' alleen.
- Reguliere verkiezingen kunnen bijvoorbeeld driejaarlijks zijn **als** het statuut dat zegt. **Dit is een standaardontwerpvoorstel**, niet een universele voetbalregel.

### Stemmodel zonder brute manipulatie

Per lid `willingnessToVote` volgt uit lidmaatschapsduur, betrokkenheid en onderwerp; keuze volgt uit onderwerpbelang, gerapporteerde uitvoering, geloofwaardigheid, alternatieven en sociale invloed. Voor grote groepen mag de simulatie geaggregeerd worden, met een vaste seed en reproduceerbare stemberekening. De speler ziet **peilingen en motieven**, niet exacte verborgen stemmen. Elke uitslag kan worden uitgesplitst naar concrete groepsredenen zonder alle berekening op het scherm te zetten.

**Anticheese:** voor de ALV drie concessies doen kan op korte termijn stemmen winnen, maar die concessies moeten in de volgende seizoenen echte begrotings-, bestuurs- of handelsbeperkingen opleggen. Een beleid dat alle groepen tevreden stelt tegen nul kosten is een ontwerpfout. Populair versus houdbaar is een echte afweging.

## 2.4 LAAG 4 — Familie/dynastie: een zelfstandig langetermijnspel

### Kernloop

**Een familielid ontwikkelt een doel of probleem → jij kiest steun, eerlijkheid, grens of afstand → dat familielid maakt een eigen vervolgkeuze → relaties, carrières, privévermogen of maatschappelijk netwerk veranderen → nieuwe kansen of conflicten ontstaan, soms rond de club.**

### Familie kan niet alleen aan de club hangen

Minimaal vier speelbare domeinen:

| Domein | Speleracties | Autonoom familiedeel | Beloning en risico |
|---|---|---|---|
| Band en vertrouwen | Steun, verzoening, moeilijke waarheid bespreken, afstand | Andere familieleden worden bondgenoot, rivaal of onafhankelijk | Vertrouwen, vervreemding, wie later wil samenwerken |
| Loopbaan en ambitie | Advies, een mentor zoeken, toegang tot eigen netwerk bieden, weigeren | Studie, werk, verhuizing, een eigen bedrijf, voetbalbaan of ander pad | Nieuwe perspectieven, andere belangen, mislukkingen en successen |
| Privévermogen | Privéproject financieren, sparen, risico spreiden, testament/wil vastleggen | Familielid investeert of neemt financieel risico | Eigen zekerheid, verlies, autonomie, erfenis; nooit clubkapitaal zonder procedure |
| Familiegeschiedenis | Tradities, conflicten, opvolgers, herinneringen | Generaties onderhouden of verbreken banden | Andere startpositie en relaties van de volgende protagonist |

**Niet elke familielid wil voetbal.** De speler moet daarom bijvoorbeeld kunnen kiezen om de studie van een zoon te ondersteunen **buiten** voetbal, ook als dat de volgende generatie geen voorzitter oplevert. Familie is geen mechaniek om gratis scoutnetwerken en stemmen te produceren. Er zijn *echte private doelen* met een apart verloop.

### Eerste seizoen: geen lege stamboom

Start bij een gecreëerde protagonist met een **samenhangend bestaand huishouden/verwantennetwerk**. Voorbeelden: oudere ouder, zelfstandige zus, volwassen kind, partner, neef, mentor en een eventueel niet-verwante gekozen familieband. Niet elk huishouden heeft partner of kinderen. Minimaal twee volwassenen hebben een zelfstandig doel en kunnen aan de speler een keuze voorleggen — **niet noodzakelijk in week 1**, maar wel ruim binnen het eerste seizoen. We simuleren hun eigen keuzes en feedback buiten de zichtbare scènes om.

### Bevoegdheids- en belangenconflict

Een zus met een bouwbedrijf heeft recht op haar zelfstandige beroepscarrière. Jij hebt geen recht om haar te bevoordelen met clubgeld. Je kunt haar aanmoedigen mee te dingen, maar een onafhankelijke aanbesteding/commissie bepaalt de uitkomst. **Je bent verplicht je terug te trekken uit een besluit met een relevant direct privébelang** als het fictieve statuut/clubregels dat vereisen. Nepotisme kan geld, reputatie en familiebanden kosten. Zelfs als je niks onrechtmatigs doet, kan de publieke uitleg onvoldoende zijn.

### Generatiewisseling

1. Een protagonist veroudert; levensgebeurtenissen volgen karakter, levensfase en toestand, zonder verplicht kinderen-spel.
2. De speler kan tijdig één of meerdere **potentiële volgende perspectieven** volgen: volwassen familielid met eigen functie, geld, relaties en aspiraties.
3. Bij vrijwillig vertrek, overlijden of bewuste overdracht van de *speelcamera* kies je een **speelbaar individueel perspectief**. **Niet** een automatische overdracht van bestuur, clubkas of stemrecht.
4. Als niemand in de familie beschikbaar/willig is, zijn er transparante alternatieven: doorgaan met de huidige protagonist zolang mogelijk, een verwant buiten de kernfamilie kiezen, of een **expliciete legacy-route** met een protegé/niet-verwant personage. Die laatste is een voortzetting van de politieke erfenis, geen biologische familiedynastie. Geen verplichte voortplantingsroute.
5. Bij het moment van overdracht worden **relaties en publieke familiegeschiedenis** beïnvloed door wat het familielid zelf beleefde. De nieuwe speler krijgt eigen vaardigheden, alternatieven en verantwoordelijkheid. Privébezit wordt alleen overgedragen conform testament/erfenis; formele clubmacht nooit.

### Wanneer de familie geen voorzitterszetel heeft

Dit is een **actieve carrièrefase**, geen tijdsprong met willekeurige rollende kaarten. De hoofdrolspeler mag — afhankelijk van zijn eigen profiel en statuut — actief:
- deelnemen aan ledenvergaderingen en moties voorbereiden;
- een lokale leden- of vrijwilligerscoalitie ontwikkelen;
- zich verkiesbaar stellen als kandidaat bij een ledenclub of in een bestuurscommissie;
- een maatschappelijk initiatief of privéproject ondernemen dat het lokale voetbal beïnvloedt;
- relaties onderhouden met oud-medewerkers en andere clubs;
- wedstrijden, divisies en spelerscarrières blijven volgen.

**Grenzen:** een gewone kandidaat mag nooit het transfermandaat van een vreemde club veranderen. De protagonist kan geen directeurstaken vanuit de familiepagina kapen. In een rol zonder bestuursmandaat staan alleen **die acties open waarvoor het personage werkelijk bevoegd is**. Een mogelijke kandidatuur moet vanuit zijn levenssituatie bereikbaar zijn, maar geen garantie op verkiezingsoverwinning bieden.

### De familie loop na tien en twintig seizoenen

Na tien jaar kennen verschillende verwanten elkaar, hebben ondernemingen/banen, wonen elders en hebben uiteenlopende opvattingen over de club. Oude conflicten beïnvloeden wie belt, wie je gelooft en wie bereid is je te helpen. Na twintig jaar zijn bekende mensen ouder of overleden, ontstaan nieuwe leiders en hebben familietakken misschien een geschiedenis bij meerdere clubs. De speler kan die samenhang aantonen aan echte contracten, verkiezingen, verhuizingen, carrières en herinneringen — **geen decoratieve stamboom als enige beloning**.

---
# 3. Eén ritme: de voetballoop en de drie andere lagen beïnvloeden elkaar

De week is de basiseenheid van gameplay; een jaar is een seizoensgrens; mensen en familie hebben een levensloop over meerdere jaren.

## 3.1 Een normale week (concrete schermflow)

1. **HQ / Week 8.** Je ziet plaats in de competitie, komende tegenstander, drie relevante ontwikkelingen (bijvoorbeeld blessure, scoutresultaat, projectmijlpaal) en een rustig overzicht van lopende afspraken. De knop **Next Match** blijft de dominante voortgangsactie.
2. **Eigen initiatief (optioneel).** De speler kan `Club plan`, `Talk to head`, `Board agenda`, `Family` openen en een zinvol voorstel doen als de toestand en zijn bevoegdheid dit toestaan. Niet elk scherm hoeft aandacht.
3. **Noodzakelijke bestuurspost (indien van toepassing).** Een overschrijding van het transfermandaat, een bestuursstem of een wettelijke deadline komt vóór het commitmoment. Er verschijnt een duidelijke `Who must decide` en `What if ignored`.
4. **Match preview.** Jeugdspeler, tegenstander, rivaliteit, coachplan en mogelijke belangen zichtbaar, maar **geen tactiekknop voor de voorzitter**.
5. **Match centre.** De wedstrijd vindt één keer plaats. Afspelen, versnellen en fulltime springen veranderen nooit het resultaat; de timer is presentatie.
6. **Gazette / After the whistle.** Uitslag, stand, blessures, spelersverhalen, relevante stafacties en één korte causale terugblik waar er daadwerkelijk een link is.
7. **Start volgende week.** Eerder gestarte projecten en familie-/persoonsinitiatieven kunnen nieuwe fases bereiken; je ziet gebeurtenissen op de plek waar ze ertoe doen.

**Waarom spel?** Het voetbal geeft onafgebroken emotie en voortgang, de bestuurlijke vrijheid geeft richting en de andere agents zorgen voor onzekerheid. Zonder nieuwe bestuurszaken wil je alsnog de volgende wedstrijd zien.

## 3.2 Een drukke week (niet vijf generieke kaarten)

Stel: je TD heeft een bod op een clubicoon binnengekregen, een tribuneproject bereikt de betaaldeadline en je nicht heeft belangstelling voor een baan bij de club. Dit zijn **drie verschillende bevoegdheidsroutes**:
- de TD behandelt het spelersbod binnen mandaat, tenzij verkoop van iconen expliciet een bestuursrecht raakt;
- de financieel directeur mag een goedgekeurde termijn betalen; zonder dekking moet de bevoegde commissie besluiten;
- de nicht solliciteert via dezelfde procedure als iedereen, en een belangenconflict vraagt onthouding en informatieplicht.

De game mag deze zaken in **één weekbriefing groeperen**, maar niet tot drie losstaande '+ loyaliteit'-kaarten reduceren. De speler kan urgentie zien, informatie opvragen en een legitieme kwestie laten verlopen. Er bestaat geen arbitraire kliklimiet; de **deadline, uitvoerder en schaarse middelen** zijn de beperkingen.

## 3.3 Tijdschalen

| Schaal | Moet doorgaan | Wat kan de speler doen | Interessante mogelijke breuk |
|---|---|---|---|
| Wedstrijd (afzonderlijk) | Competitie, teamkeuze van trainer, resultaat | Bekijken, spelerverhalen volgen, presentatie versnellen | Eigen jeugdspeler scoort tegen je als hij inmiddels vertrokken is |
| Week | Team, cash, staf, lopende projecten, contactkansen | Agenda, gesprekken, mandaat, formeel besluit | Een zelfstandige TD haalt een ander type speler dan verwacht |
| 4–6 weken | Financiële prognoses, doelstellingen, samenwerking | Review, heronderhandeling, second opinion | Een project presteert technisch goed maar sociaal slecht |
| Seizoen | Zomer/winter, ALV, doelen, promotie/degradatie, familieleeftijd | Jaarplan, staf, moties, persoonlijke carrièrekeuze | Coach vertrekt; begroting wordt door ALV afgewezen |
| Statutaire termijn | Ledenverkiezing, coalitievorming, bestuurspositie | Herverkiesbaarheid, kandidaatplan, statuutwijziging | Je wint sportief maar verliest de ledenverkiezing |
| Generaties | Levensloop, carrièrewissel, erfenis, herinnering | Protagonist voortzetten/overdragen, privébelangen beheren | Familie keert zich tegen oude familiepolitiek |

## 3.4 Een geloofwaardige eerste tien weken

Dit is een **voorbeeldsave**, geen verplicht lineair script. De engine mag andere incidenten en zelfs weken zonder bestuurszaken produceren.

| Week | Club / voetbal | Personen / beslissingen | Familie / continuïteit |
|---|---|---|---|
| 1 | Eerste competitiewedstrijd, beschikbare selectie zichtbaar | Intro met TD en trainer, **mandaat** en lopend jaarplan, geen random crisis | Profiel van twee al zelfstandige verwanten en hun actuele persoonlijke doelen |
| 2 | Eerste uitslag plus inzicht in sportief knelpunt | TD handelt routine zelfstandig; speler kan vrijwillig een gesprek beginnen | Privéproject op achtergrond ontwikkelt zich |
| 3 | Wedstrijd met derbycontext of gewone fixture | Financieel directeur presenteert forecast, geen verplicht besluit zonder drempel | Verwant maakt eigen beroepskeuze |
| 4 | Talenten en selectiegegevens worden herkenbaar | Coach-/TD-doel nog niet gehaald; speler kan informatie vragen of wachten | Geen geforceerde familiekaart |
| 5 | Nieuwe blessures of eerste goede reeks indien ontstaan | Alleen bij echte spanning ontstaat afspraakconflict of escalatie | Familielid kan onafhankelijk een baan aannemen |
| 6 | Competitiebeeld begint te ontstaan | Informele voortgangsreview bij open afspraken | Relatie-effect van eerder privébesluit zichtbaar |
| 7 | Mogelijke nieuwe speler krijgt debuut via coach | TD rekent uitvoeringsplan door; bestuurscommissie kan voorwaarden stellen | Eventueel sociaal voordeel/nadeel door familiegeschiedenis |
| 8 | Wedstrijd bepaalt sportieve perceptie | Eén open bestuurskeuze heeft zichtbare vervolgstatus; optie om niets te doen | Familiedossier toont *eigen* voortgang, niet clubbonus |
| 9 | Stand, vorm, rival en clubiconen | Bestaande afspraken kunnen conflicteren of netjes worden ingelost | Nieuw bericht alleen als werkelijk getriggerd |
| 10 | Krant toont ontwikkeling over tien weken | Speler kan onderbouwen wie wat uitvoerde en waarom | De familie heeft minstens één blijvende toestandverandering |

## 3.5 Het seizoen van start tot ALV

- **Zomer (preseason):** nieuw of lopend mandaat, clubdoelen/ledenverwachtingen, begroting, statuut en verantwoordelijke managers; de TD voert eigen zomerplan uit. De overgang toont spelers die vertrekken en wie later terugkomt.
- **Week 1–14:** competitieopbouw, beperkte maar niet kunstmatig schaarse bestuurlijke ingrepen; iemand kan vertrouwen winnen of verspelen.
- **Winterwindow:** TD ziet opvolgingsproblemen; een eventueel uitzonderingsverzoek gaat door de juiste bevoegdheidsroute, niet door een transfer-minigame voor de voorzitter.
- **Run-in:** sportieve strijd, financiële beperkingen, bestaande beloftes, familie- en werkcarrières.
- **Seizoensreview:** evaluatie van doelen aan echte resultaten en agent-uitvoering; onderscheid pech, beleidsfout en regelrecht vertrouwenbreuk.
- **ALV:** jaarcijfers, bindende moties, verslag, eventueel bestuur/vertrouwen/verkiezing op de statutair juiste basis. De leden kunnen een besluit tegenhouden zonder de voorzitter per se weg te stemmen.
- **Nieuw jaar:** contracten/financiële verplichtingen blijven lopen; de wereld veroudert, loopbanen veranderen, opvolging wordt voorbereid.

**Een seizoensreview is geen scherm dat automatisch +/− steun oplevert:** de club heeft daadwerkelijk geld uitgegeven, iemand heeft iets beslist, een motie is aangenomen en de gevolgen belasten de volgende begroting.

---

# 4. Formele regels en economische/maatschappelijke legitimiteit

## 4.1 De bestuurlijke macht is geleend

De speler bezit de club niet. De statutaire macht hoort bij verkozen organen en professionele functies, niet bij een familie-achternaam. **Defaultregels zijn ontwerpvarianten**, geen geclaimde universele voetbalwet:

| Besluittype | Default bevoegde actor `[VOORSTEL]` | Verandering bij statuut |
|---|---|---|
| Trainingsplanning/opstelling | Trainer | De voorzitter mag nooit teamtactiek kiezen |
| Gewone transfer binnen vooraf goedgekeurd beleid | TD | Spelersbescherming/budget kan escalatie vereisen |
| Individuele stafaanstelling onder delegatie | Bevoegde leidinggevende | Bepaalde hoofdrollen kunnen bestuursgoedkeuring vereisen |
| TD/coach benoemen of ontslaan | Voorzitter + eventueel bestuur | Schorsings-, medezeggenschaps- of compensatievereisten |
| Jaarbegroting | Bestuur, ledencontrole voor belangrijke wijzigingen | Quorum/ledenakkoord bij bepaalde omvang |
| Stadionlening of verkoop clubasset | Bestuur + mogelijk ALV | Gekwalificeerde meerderheid / onafhankelijke toetsing |
| Statuutwijziging | Leden met voorgeschreven drempel | Niet omzeilbaar via privéafspraak |
| Externe familietransactie | Onafhankelijke besluitroute met recusal | Strengere belangenconflictregels |
| Verkiezing voorzitter | Leden/kiesgerechtigden | Termijn, toelating, kandidaten en stemming per club |

## 4.2 Politieke AI: mensen stemmen over concrete onderwerpen

Ledenstemmen is niet `mood > 50 = ja`. Een ledengroep kan tegelijk **voor de voorzitter**, **tegen een investeerder** en **voor betaalbare kaartprijzen** zijn. Partijen/commissieleden voeren eigen campagne of onderhandelen; hun acties hebben voorbereidingstijd en beperkte kennis. Stemmen worden afgeleid van (a) belangen; (b) geloofwaardigheid; (c) concrete beleidsuitkomsten; (d) informatie; (e) mobilisatie en opkomst; (f) procedurele regels; (g) gecontroleerde onzekerheid. Het telt per stemming opnieuw, niet één globale populariteitsbar.

**Stemmingsproces:** `validProposal → notice → eligibility/quorum → campaign/coalitions → voting → verification → boundPolicy`. Een ongeldige motie komt niet op de stembiljetlijst. Een goedgekeurd maar onvoldoende gefinancierd project wordt niet magisch gebouwd: er ontstaat een legale procedure om voorwaarden te wijzigen of een andere route te zoeken.

## 4.3 Wat als je de ALV verliest?

De game moet onderscheiden:

1. **Motie verloren, voorzitter blijft:** de beslissing is bindend, het werk gaat door binnen nieuwe regels.
2. **Vertrouwen verloren:** afhankelijk van statuut kan een specifieke procedure beginnen; niet een instant willekeurige game-over.
3. **Verkiezing verloren:** andere verkozen voorzitter neemt rechtmatige bevoegdheden over. De oude club blijft spelen, inclusief jouw oude afspraken en schulden. De protagonist is nu *ex-voorzitter*, niet onzichtbare eigenaar.
4. **Kandidaat worden elders:** alleen als lidmaatschap, benoemings- of verkiezingsvoorwaarden zijn gehaald; je oude reputatie en relaties kunnen zowel helpen als hinderen.
5. **Familie/levenscarrière:** als je besluit geen kandidatuur te zoeken, speel je actieve ledenpolitiek, maatschappelijke initiatieven of privéleven, terwijl het voetbal in de wereld doorgaat. Je kunt later terugkeren of een speelbare familierol overnemen.

**Geen strafwachten:** zodra je geen voorzitter bent, verandert de interfacebevoegdheid. Vóór de volgende competitieperiode moet het spel **minstens één betekenisvolle toegestane actie** en een bereikbaar politiek perspectief bieden. Het automatisch kiezen van een nieuwe club zonder een kandidatuur is óók geen oplossing.

## 4.4 Kwaliteitsrisico: de altijd-winnende diplomaat

De meest vriendelijke, aanwezige voorzitter mag niet dominant worden. Sommige belangen zijn werkelijk tegengesteld: supporters willen lage prijzen, financieel bestuur heeft een leningconvenant; de TD wil jeugd, trainer wil ervaring; familie wil financiering, commissies willen onafhankelijkheid. Een concessie kan een ALV winnen maar toekomstige begrotingsvrijheid beperken. **Respecteer wel het verschil tussen complexiteit en willekeur:** een goede speler moet kunnen uitleggen waarom een optie riskant was vóór hij haar koos.

---

# 5. Causale engine en gegevenscontracten

## 5.1 Eén bron van waarheid met stabiele identiteit

De hoofdsave bevat één `WorldState` met een versioned schema; schermen lezen projecties en houden geen tweede 'waarheid' bij. De bestaande modules kunnen aanvankelijk via adapters op dezelfde gamewereld aansluiten. **Geen poging om vier engines op runtime naast elkaar te laten draaien.**

| Object | Minimumvelden | Enige verantwoordelijke voor kernmutatie | Levenscyclus / verbinding |
|---|---|---|---|
| `World` | `seed`, `season`, `week`, `calendar`, `clubs[]`, `people[]`, `playerPersonId`, `rngState`, `schemaVersion` | World/tick coordinator | Maakt kalender; blijft bij verloren voorzitterschap bestaan |
| `Club` | `id`, `town`, `tier`, `ledgerId`, `memberships[]`, `statuteId`, `boardIds[]`, `headIds[]`, `squadIds[]`, `assets[]`, `projects[]`, `history[]` | Club domain services | Club kan groeien/krimpen; behoudt ID bij verhuizing/naamswijziging |
| `Membership` | `personId`, `clubId`, `joinedAt`, `votingStatus`, `group`, `participation` | Membership/elections | Toelating en stemrecht volgen statuut; geen automatisch familielidmaatschap |
| `Statute` | `clubId`, `termLength`, `electionRules`, `quorumRules`, `reservedPowers`, `recusalRules`, `history` | Governance (ledenbesluit) | Wijziging is geldige motie, niet direct slider |
| `Person` | `id`, `age`, `birthYear`, `roles`, `traits`, `skills`, `goals`, `knowledge`, `memories`, `career`, `availability` | People domain | Dezelfde persoon in club, familie en politieke omgeving |
| `Relationship` | `id`, `personA`, `personB`, `type`, `trust`, `stakes`, `memories`, `updatedAt` | People domain | Dubbele relaties op één paar worden getypeerd; oorzaaklog |
| `Family` | `id`, `members[]`, `kinshipEdges`, `households[]`, `familyLegacy`, `currentProtagonistId` | Family domain | Band blijft bij carrièremigratie; geen club-id als bezit |
| `PrivateAssets` | `ownerPersonOrFamilyId`, `cash`, `holdings`, `liabilities`, `obligations`, `inheritancePlan` | Private finance domain | Gescheiden boekhouding; officiële clubdeal vereist apart besluit |
| `Office` / `Mandate` | `role`, `personId`, `clubId`, `validFrom`, `validUntil`, `limits`, `goals`, `approvalRoute`, `reviewDue` | Governance/staff domain | Ontstaat via bevoegd besluit; eindigt bij vertrek/ontslag |
| `Agreement` | `id`, `parties`, `give[]`, `receive[]`, `visibleTo`, `conditions`, `reviewDue`, `breachTerms`, `status`, `linkedDecisionIds` | Agreement domain | Is afspraak, geen bevoegdheidsbron; koppelt aan besluit/project |
| `Decision` | `id`, `context`, `proposedBy`, `jurisdiction`, `options`, `chosenOption`, `approvedBy`, `executorIds`, `due`, `status` | Command/governance gateway | `draft → pending → valid/rejected → executing → delivered/partial/failed` |
| `Project` | `id`, `clubId`, `ownerRole`, `phases`, `approvedBudget`, `committed`, `funding`, `dependencies`, `milestones`, `status` | Project domain | Middelen worden eenmaal geboekt; vertraging en herziening mogelijk |
| `Election` / `Motion` | `id`, `clubId`, `voters`, `candidates/proposal`, `quorum`, `threshold`, `ballots`, `results`, `boundDecisionId` | Elections domain | Geldig proces per statuut; verkiezing ≠ motie |
| `EventLedger` | `eventId`, `tickId`, `commandId`, `actorId`, `targetIds`, `sourceId`, `before/after`, `visibility`, `causes[]` | Event/tick coordinator append-only | Ontstaat uit echte mutaties; geschikt voor Gazette, inspectie, saves |
| `Career` | `personId`, `roles[]`, `elections[]`, `appointments[]`, `clubs[]`, `legacyLinks[]` | People/governance | Loopbaan loopt buiten eigen club en over generaties |

**Exclusieve mutaties:** clubkas mag niet direct door een familiedialoog wijzigen, maar via een geautoriseerde `ClubPayment`. Een projectkostenfase mag niet ook door een event-end hook nogmaals worden afgeschreven. Transfers mogen alleen door het recruitmentdomein plaatsvinden, met geëscaleerde goedkeuring vanuit governance waar nodig.

## 5.2 Interface tussen regels en game

Indicatief contract; geen exacte code die al bestaat:

```text
propose(actorId, kind, targetId, payload) → DraftDecision
assessJurisdiction(draft, statute, mandates, conflicts) → allowed | requiresVote | blocked
preview(draft, knowledgeOfPlayer) → visibleOptions + risks + unknowns
submit(commandId, actorId, optionId) → Accepted | NeedsApproval | Rejected
executeAuthorized(decisionId, tickId) → ExecutionEvents[]
applyEffectsOnce(events, tickId) → StateDeltas
reviewAgreement(agreementId, observedEvents) → Fulfilled | Partial | Broken | Contested
recordOutcome(eventIds) → GazetteStory / PersonMemory / BoardRecord / FamilyMemory
```

**Onmogelijkheden:** `submit()` verleent niet automatisch formele goedkeuring; `recordOutcome()` verandert zelf geen stand, kas of loyaliteit; `preview()` mag geen geheime RNG of toekomstige uitslag lekken; `applyEffectsOnce()` heeft een uniek idempotentiesleutel per mutatie.

### Voorbeeld van één trace

```text
D-104: Voorzitter geeft TD mandaat "onder 25 jaar, haalbaar loon, 2 windows".
A-22: TD belooft alleen een eerste shortlist en een evaluatie in oktober.
E-531: TD bezoekt jeugdcompetitie → scoutReport+1 (agent evidence).
E-548: TD doet aanbieding binnen mandaat → contract aangevraagd.
E-590: Financieel directeur bevestigt loondekking → contract getekend.
E-616: Trainer zet nieuw talent 42 minuten in → ontwikkeling + eigen matchdata.
E-671: Gazette vermeldt dat talent onder het jeugdplan kwam.
D-104 review: 1 geslaagde aanwinst, loonspeling 6%, geen claim "jouw mandaat won de wedstrijd".
```

De causaliteitsketen is **identificeerbaar**, maar het laatste doelpunt blijft afhankelijk van voetbal en toeval. Het spel mag nooit suggereren dat D-104 het doelpunt deterministisch veroorzaakte.

## 5.3 De wekelijkse tick: exact één keer en zonder voorkennis

**Bij start van week W (snapshot voor de speler):**

1. [Lees, muteer niet] bevries de zichtbare toestand `StartW`; verzamel bekende feiten, deadlines en bevoegdheden. Maken van rapporten en openen van schermen verbruikt **geen gameplay-RNG**.
2. [Spelerfase] accepteer handelingen en voorstellen binnen bevoegdheid; leg keuzes vast met `commandId`, valideer budget, statuut, belangenconflict en deadlines. Opslaan kan na elke klik.
3. [Lock] de speler kiest **Next Match** of een equivalent. De engine sluit W voor nieuwe acties. Een al in W besloten dossier krijgt precies één uitkomstpad.
4. [Autonome plannen] staf, andere clubs, relevante personen en familie doen alleen **legale, haalbare** acties op basis van kennis en mandaten. Escalaties worden waar mogelijk voorbereid voor W+1; echt kritieke door-de-weekse bestuurlijke besluiten moeten vóór lock aangeboden zijn.
5. [Economische/projectuitvoering vóór wedstrijd] contracten, transfers, bouw, salarissen en geplande bevoegde betalingen worden in geordende subtransacties uitgevoerd. De wedstrijdselectie ziet hierdoor een consistente selectie; geen toekomstige transfer verschijnt achteraf ineens in de XI.
6. [Wedstrijd] simuleer competitie en eventueel beker met deterministische sport-RNG. **Eén matchId per speeldag**. Timing/animaties lezen een immutable eventstream; afspelen doet de motor niet nogmaals draaien.
7. [Sportieve gevolgen] blessures, wedstrijden, statistieken, moraal en jeugdminuten uit de echte gespeelde gebeurtenis toepassen; bewaar bron-ID.
8. [Financieel/maatschappelijk einde week] verwerk matchday-inkomsten, leningen, projectverplichtingen, ledenactiviteit, relaties, relevante familiecarrièrefeiten en reputatie; arbitreer botsingen deterministisch.
9. [Review / archief] toets afspraken waarvan de condition werkelijk is bereikt; registreer voltooide acties en geldige volgende aanleidingen. Leg causaliteitsketens vast en maak Gazette uit `EventLedger`.
10. [Atomic commit] schrijf `endOfWeek(W)` met checksum, voortgangsflag en nieuwe state; save/reload op iedere grens werkt. Verschuif kalender naar W+1 **na** geslaagde commit.

**Probleem dat v1 liet liggen:** als `seasonAfterMatch` door meerdere modules wordt gewrapt, kunnen dezelfde acties dubbel afgaan. V2 eist daarom een testbare `tickId`, effect-ID's, een fasevolgorde en registratie van de laatst toegekende uitvoeringsfase.

## 5.4 Determinisme, kans en eerlijkheid

- Scheid streams of hashgebaseerde RNG voor `football`, `agents`, `politics`, `family`, `projects`, zodat het openen van een scherm of het bekijken van een player profile nooit wedstrijdgeluk verandert.
- **Zelfde seed + dezelfde wereldwijzigingen + zelfde commands = identieke state en oorzaken.** Een weggelaten keuze mag de wereld veranderen, maar een andere UI-volgorde zonder actie niet.
- Voor kansrijke besluiten ziet de speler *reden* en *risicoband*: 'waarschijnlijk', 'twijfelachtig', 'weinig kans', met bewijsherkomst. Geen gegarandeerde toekomstkennis.
- Beslissingen over trainer-/TD-samenwerking hebben altijd een handeling/pad als uitkomst: uitvoering, weigering, mislukte poging of onderhandelde aanpassing; **alleen** een relationele scorewijziging telt niet als geslaagde kernbeslissing.
- Informatiekwaliteit kan onjuist zijn, maar de speler kan post-hoc zien of het rapport fout was en van wie het kwam.

## 5.5 Prestatiebudget voor lange carrières `[VOORSTEL]`

| Groep | Voorstel detailniveau | Simulatie |
|---|---|---|
| Protagonist, familie en huidige clubkern | ±15–30 individuen volledig actief | Per relevante week eigen doelen, geheugen, sociale links en vaardigheden |
| Lokale rivalen, ex-staf, oppositie en belangrijke relaties | ±30–80 individuen selectief actief | Eigen acties bij relevante deadlines, overstap, verkiezing, afspraak |
| Overige competities/clubs | Aggregatie en deterministische seed, promote-to-detail bij contact | Tabellen, generatiewisselingen en transfermarkt op seizoens-/windowgrenzen |
| Oude gebeurtenissen | Werkend samenvattingsarchief plus referenties naar relevante mijlpalen | Niet elke oude inboxboodschap een actief agent |

Doelwaarden zijn **testbare engineeringhypothesen**, geen opgegeven hardwarebenchmarks: op een budget-telefoon moeten 40 seizoenen, save/reload, weektick en wedstrijdweergave binnen overeengekomen meetgrenzen blijven. Begrens vooral *tickkosten*, niet het aantal bewaarde historische feiten. Persistente persoons-ID's blijven geldig als een personage uit detailmodus gaat en later terugkomt.

---
# 6. Zes volledige spelketens: bewijs dat het geen brochure is

Alle onderstaande gebeurtenissen zijn **ontwerpcontracten, niet geclaimde actuele functionaliteit**. Namen en uitkomsten zijn fictief, maar zijn gekoppeld aan echte statevariabelen, bevoegdheden en mogelijke agentkeuzes. Iedere keten hoort tijdens implementatie minstens één **tegenfeitelijke test** te krijgen: dezelfde beginsituatie, andere spelerbeslissing, herleidbaar andere wereldtoestand.

## 6A. Clubmanagement — de trainingsbasis die de club kan maken of breken

**Begin:** `Saltmere Athletic`, 8e divisie; kas €92.000, vaste verplichtingen €71.000, slechte trainingen, een terrein aan de haven komt beschikbaar; de ALV heeft bepaald dat leningen boven €70.000 ledensteun vragen. De financieel directeur verwacht dat investeren de komende 12 maanden lastig wordt.

**Wat je vooraf ziet:** jeugd-/trainingsproblemen, voorlopige bouwraming met risico, de lokale raad met een concurrerende bieder, de financiële verplichtingen en de stemroute. De uitkomst van een aanbesteding is niet vooraf bekend.

**Drie of meer echte opties:**
1. **Gefaseerd renoveren** binnen beschikbare middelen. Minder onmiddellijke verbetering, kleine schuld, weinig politieke weerstand.
2. **Nieuwe trainingsbasis aanvragen** met lening en ledenstemming. Kans op grotere meerjarige verbetering, maar schuld, bouwvertraging en verlies van autonomie.
3. **De basis delen met de school** via een lokaal partnerschap. Lager kapitaalbeslag maar minder exclusieve trainingstijden en afhankelijkheid van gemeentelijk beleid.
4. **Niet investeren** en de begroting herstellen. Geen automatische straf; je behoudt reserves en verliest mogelijk toekomstige jeugdontwikkeling.

**Direct:** het gekozen plan verandert de *project pipeline*, budgetreservering en benodigde goedkeuring. De financieel directeur krijgt een onderzoekstaak; de voorzitter verandert nog niet meteen het trainingsniveau. **Tegenactie:** de gemeente kan eisen dat buurtsport voorrang krijgt of met de andere bieder verdergaan.

**Na vier weken:** er ligt een geprijsd en door een medewerker samengesteld uitvoeringsvoorstel, of het terrein is weg. De speler kan voorwaarden herzien, financiering zoeken of stoppen. De ALV kan het grote plan afwijzen ondanks populariteit van de voorzitter.

**Seizoensgevolg:** als de bouw start, verandert kas, lening, bouwstatus, trainingsbeschikbaarheid en het vertrouwen van een expliciete ledengroep. Sportieve resultaten kunnen intussen tegenvallen door verminderde middelen elders.

**Na drie jaar:** de trainingskwaliteit is duurzaam hoger *als* het project werkt; de financieringsverplichtingen blijven. Een nieuwe voorzitter erft het contract, niet een gratis upgrade. De gemeente kan bij schending van buurturen sancties toepassen.

**Wat de speler ziet als bewijs:** `proposal → board vote/ALV → contract → betaling → bouwfases → fysieke faciliteit → jeugd-/trainingsdata`. **Aantrekkelijke maar mogelijk verkeerde keuze:** nieuwbouw voelt prestigieus, maar kan toekomstige lonen en transferbudgetten blokkeren. **Test:** bij dezelfde seed moet optie 1 versus 2 aantoonbaar andere kas, activa, verplichtingen en ontwikkelcondities leveren; de wedstrijdpresentatie blijft exact dezelfde matchengine.

## 6B. Personenmanagement — TD en trainer willen allebei een andere club

**Begin:** de TD heeft jeugdwerving beloofd; de trainer vreest degradatie en wil ervaren spelers. De talentvolle maar weinig vertrouwde jeugdspeler `Mason Vale` heeft weinig minuten, terwijl de club geld tekortkomt.

**Informatie:** selectie, daadwerkelijk gespeelde minuten, scoutinschattingen, historische prestaties en twee tegenstrijdige standpunten. De coach stelt de XI vast; de TD onderhandelt transfers.

**Opties:**
1. **Huidige mandaten respecteren** en de staf zelf met het probleem laten omgaan. Je kiest geen van beiden automatisch als schuldige.
2. **Een gezamenlijk sportplan vragen** met twee meetbare voorwaarden, een personeelsreview na zes weken en ruimte voor twee uitvoeringsroutes.
3. **Het beleidsmandaat aanpassen** richting ervaren spelers, na toetsing van budget en bestaande afspraken.
4. **Een van de leidinggevenden vervangen** via geldige benoemingsroute; inclusief afkoopsom, zoektocht en de risico's van een nieuwe kandidaat.

**Direct:** niemand krijgt automatisch extra doelpunten. Er verandert een mandaat, een verantwoordelijkheid of een nieuw evaluatiemoment. **Tegenactie:** de trainer kan weerstand bieden omdat hij zijn selectieautonomie verdedigt; de TD kan een externe aanbieding aannemen.

**Na vier weken:** de TD heeft wel/niet jeugdspelers gescout; de coach heeft aantoonbare minuten of niet; mogelijke teamsterkte, salariskosten en xG in de werkelijke sportdata zijn vastgelegd. Bij weigering moet zijn **reden** zichtbaar zijn.

**Seizoensgevolg:** de club behoudt een gemotiveerde leider of raakt hem kwijt; een speler is doorgebroken, verkocht, vertrokken of nog steeds niet klaar. Leden waarderen beleid op resultaat én proces, niet alleen op steunmeter.

**Na vijf jaar:** de ontslagen TD bouwt bij een rivaal een jeugdselectie; de spelers en afspraken uit dit conflict zijn terug te vinden in hun carrière en de clubhistorie.

**Bewijs:** begin- en eindmandaten, daadwerkelijke selectiebesluiten van trainer, scouting-/transferslog, gedrag van de betrokken agent, spelersstatistieken, eventueel transfer van de TD. **Aantrekkelijke maar mogelijke fout:** de populairste trainer te snel steunen kan het jeugdplan vernietigen. **Test:** mandaat wijzigen mag niet zelf de XI vervangen; coach en TD moeten andere uitvoeringspaden kiezen bij andere doelen en competenties.

## 6C. Beslissingen/ledenpolitiek — betaalbaar voetbal versus financiële zekerheid

**Begin:** promotie heeft een duurdere competitie opgeleverd, de stadionveiligheid is achterstallig; ledenfracties willen betaalbare kaarten maar de financieel directeur ziet een kasrisico. Over vier weken komt de begroting op de ALV.

**Informatie:** echte inkomsten/uitgaven, ledenopbouw, betaalbaarheid, verplichtingen uit vorig jaar, oppositiestandpunten en de statutaire stemdrempel. Er is geen perfect win-win-alternatief.

**Opties:**
1. **Kaartprijzen verhogen** binnen voorgestelde grenzen en het veiligheidsonderhoud financieren. Financieel logisch, mogelijk minder opkomst en vertrouwen.
2. **Prijzen bevriezen** en een bezuinigingsmandaat aan andere afdelingen geven. Meer toegankelijkheid, minder sportieve ruimte.
3. **Publieke driejarige prijsafspraak** sluiten en de leden om goedkeuring voor een lening vragen. Politiek aantrekkelijk nu, maar latere begrotingsvrijheid verdwijnt.
4. **Tijdelijk geen voorstel doen** en financiële cijfers laten herzien. Zinvol bij onzekerheid, riskant bij harde deadlines.

**Direct:** de nieuwe voorstellen gaan naar de **juiste** stemprocedure; een belofte is nog geen geldige begroting. De oppositieleider kan amendementen voorstellen.

**Na vier weken:** ALV of commissiestemming beslist. Een motie kan aangenomen worden terwijl je vertrouwen behoudt; een populaire concessie kan worden verworpen wegens te hoge schuld. De niet-gekozen opties blijven geen verborgen straf.

**Seizoensgevolg:** daadwerkelijke opkomst, ticketopbrengst, veiligheidsproject, loonkosten en de relatieve invloed van supporters-/financiële groepen veranderen. De club kan een veilige maar bescheiden sportieve koers volgen.

**Na drie jaar:** bindende prijsafspraken of schuldvoorwaarden blijven gelden onder een andere voorzitter. Mensen herinneren zich wie de deal verdedigde, maar mogen anders stemmen als nieuwe feiten ontstaan.

**Bewijs:** `Statute`→`Motion`→`votes/quorum`→`boundPolicy`→`ClubLedger`→`attendance`/veiligheidsproject→`Election`. **Op het eerste gezicht juiste keuze die fout kan zijn:** met prijsbevriezing de ALV winnen maar intussen een groot veiligheidsrisico laten oplopen. **Test:** voorzitter mag geen goedgekeurde, bindende prijsregel per privéafspraak overschrijven.

## 6D. Familie — de zus die een serieuze aannemer is

**Begin:** je zus `Eva` is eigenaar van een bouwbedrijf met serieuze expertise; haar onderneming zit financieel onder druk en wil meedingen naar een contract met de club. Jij bent voorzitter; de statuten eisen onafhankelijke aanbesteding en onthouding bij belangenconflict.

**Informatie:** familieband, privéfinanciën, tenderroute, schijnbare offertes, onafhankelijke commissie, Eva's verwachtingen. Haar bedrijf is niet per definitie slecht of corrupt.

**Opties:**
1. **Transparant informeren en terugtrekken.** De onafhankelijke commissie neemt de zaak over. Je zus kan je als weinig steunend ervaren; je club kan best de beste inschrijving ontvangen.
2. **Je zus helpen met algemene informatie die alle bieders krijgen.** Het proces blijft open, maar strikte documentatie is nodig; vermeend voordeel is mogelijk.
3. **De familiebelangen boven transparantie plaatsen** en een ongeoorloofd privévoordeel proberen te regelen. **Alleen beschikbaar als het spel bewust illegale/omstreden acties toelaat**, met reële risico's van ontdekking, ongeldige beslissing en aftreden — nooit gratis bonus.
4. **De familiegesprekken loskoppelen van de tender:** beloof emotionele of zakelijke steun buiten de club en laat de clubaanbesteding zelfstandig verlopen.

**Direct:** familiegesprek en eventuele belangenmelding worden afzonderlijk geregistreerd. Een privébetaling kan alleen uit `PrivateAssets`, geen clubkas. **Tegenactie:** Eva kan zich terugtrekken, toch meedoen, informatie publiek maken, of een ander project aannemen.

**Na vier weken:** de tender is eerlijk beoordeeld of er is een onderzoek; Eva's werk en vermogen ontwikkelen zich onafhankelijk, en zij kan persoonlijk teleurgesteld zijn zelfs als je correct handelde.

**Seizoensgevolg:** eventuele renovatie heeft een echte prijs/kwaliteit, clubreputatie heeft een onderbouwde procedurele geschiedenis. Eva's loopbaan gaat verder, met of zonder clubcontract.

**Na vijf jaar:** Eva is mogelijk een belangrijke lokale werkgever, werkt voor een rivaal, of heeft financieel verlies geleden; familiebanden kunnen warmer of kouder zijn geworden. De club heeft nooit formele familiebestuursrechten gecreëerd.

**Bewijs:** `Person` Eva → haar `PrivateAssets` → `ConflictDeclaration` → `TenderDecision` en commissiestem → `Project` → `FamilyMemory`. **Test:** zelfs de meest competente familieaanbieding mag alleen via geldige procedure doorgaan; ongeldige directe benoeming veroorzaakt geen betaling.

## 6E. Bewust niets doen — de trainer hoeft niet altijd gered te worden

**Begin:** de club heeft drie keer niet gewonnen, de trainer probeert een verdedigende speelstijl, de selectie is nog gezond en het bestuur heeft zes weken geleden een ontwikkelplan met hem goedgekeurd. Een supporter eist ingrijpen; de agent heeft nog voldoende looptijd en vertrouwen.

**Informatie:** xG-bandbreedte, spelersmorale, eerdere afspraak, komende kalender, beschikbare reserves en eerdere gesprekken. Toeval in de laatste drie uitslagen kan een grote rol spelen.

**Opties:**
1. **Huidig mandaat handhaven en de geplande review afwachten.** Geen nieuwe toezegging, geen gratis beloning; risico dat achterstand groeit.
2. **Tweede opinie van de TD vragen.** Kost voorbereidingstijd; brengt mogelijk relevante nieuwe informatie, maar kan het vertrouwen van de trainer raken.
3. **Publiek trainer steunen.** Je naam wordt verbonden aan zijn resultaten; over zes weken mag je daarop worden afgerekend.
4. **Trainer ontslaan.** Geldige route, kosten en kans op instabiliteit. Mag niet bij ieder verlies de optimale knop zijn.

**Direct:** bij optie 1 verandert geen loyaliteitsmeter. Alleen de bestaande review blijft staan; de wereld gaat gewoon door. **Tegenactie:** trainer past eigen training aan, supporters organiseren een protest of de oppositie schrijft een column.

**Na vier weken:** de resultaten kunnen verbeteren zonder inmenging, of het probleem wordt ernstiger en de voorziene evaluatie geeft bewijs. De speler mag dan alsnog handelen.

**Seizoensgevolg:** wie vroeg handelde kan loonbudget hebben verbrand; wie wachtte kan zijn baan behouden en vertrouwen in deskundigheid opbouwen — of een degradatie hebben laten gebeuren.

**Na drie jaar:** een toen bewaarde trainer kan een clublegende zijn; een vroeg ontslagen trainer kan succesvol bij een rivaal worden. Welke route beter was, hangt af van teamkwaliteit en agentgedrag.

**Bewijs:** ongewijzigd mandaat/contract bij optie 1, werkelijke agentbesluiten, sportieve statistiek, budget, review, ledenreacties en loopbaan van trainer. **Test:** optionele nietsdoenactie veroorzaakt niet automatisch `fans-2`; bij verschillende seeds is nietsdoen soms beter dan ingrijpen.

## 6F. Dynastie na verkiezingsverlies — jouw club is niet jouw bezit

**Begin:** na negen seizoenen verliest voorzitter `Tom Ellery` de verkiezing ondanks een bekerfinale. De leden verwerpen een stadionlening en kiezen `Maya Brook`, die financieel sober wil besturen. Toms volwassen neef `Ruben` organiseert een lokale supportersvereniging maar heeft een andere visie dan Tom.

**Informatie:** verkiezingsuitslag per groep, formeel bestuursbesluit, reden voor verlies, open contracten, nieuwe voorzitter en carrière-/familieprofielen. De spelerssave blijft dezelfde wereld.

**Opties:**
1. **Tom blijft actief als lid/oppositieleider**, steunt een alternatieve begroting en bereidt een nieuwe kandidatuur voor binnen statuten.
2. **Tom wordt kandidaat bij een andere ledenclub** wanneer de toelatingsregels en kalender dat toelaten. De oude club blijft een rivaal of herinnering.
3. **Perspectief wisselen naar Ruben** (als volwassen, beschikbaar en bereid): hij bouwt zijn eigen steunbasis en kan een maatschappelijke rol zoeken zonder zetel te erven.
4. **Familie buiten de club voorrang geven:** Tom organiseert een privéproject; je volgt als spelende protagonist de voetbalwereld en laat een nieuwe politieke kans later ontstaan.

**Direct:** oude voorzitter verliest direct zijn bestuurlijke acties; de nieuwe bestuursleden krijgen de wettelijke bevoegdheden. Alle bestaande geldige clubcontracten blijven. De speler houdt familie, reputatie en eigen privé-assets. **Tegenactie:** Maya kan Toms oude projecten annuleren binnen contractuele grenzen en Ruben publiek proberen te winnen.

**Na vier weken:** Tom kan als lid een motie voorbereiden of een andere functie aanvaarden; Ruben kan autonoom zijn vereniging uitbreiden of Toms steun afwijzen. Clubwedstrijden gaan door, met wijzigingen die door Maya en haar TD worden besloten.

**Seizoensgevolg:** de oude club kan sportief verbeteren of financieel verschralen; Tom/Ruben kan echte politieke steun opbouwen, een andere club dienen, of privéverlies lijden. Niet in het bestuur zitten mag gameplay verschuiven, maar geen blanco stilstand opleveren.

**Na tien jaar:** Ruben is mogelijk voorzitter, journalist, zelfstandige ondernemer, kritische rivaal of afzijdig familielid; Tom is ouder of overleden, met een reputatie die uiteenlopend wordt herinnerd. De club is nog altijd geen familiebezit.

**Bewijs:** `ElectionOutcome`→`Office.revoked`→`newChair`→`clubPolicy`→`Family.protagonist`→`Career`→`MemberCampaign`→`newElection`. **Test:** doorstart zonder voorzittersmacht is vanaf de eerste speelbare week interactief; player mag in die toestand geen stafmandaat wijzigen en geen spelers transfereren. Na een generatiewissel zijn oude clubkas en bestuursmandaten nooit aan de protagonist gekoppeld.

---

# 7. Technische en game-design-red-teamtests

Deze tests hebben **geen vooraf geclaimde PASS-status**. Ze zijn releasecriteria en falsificatiescenario's.

| Test | Moet gebeuren | Mag gebeuren | Verboden | Bewijsmethode |
|---|---|---|---|---|
| 1. Tien weken bestuurlijk niets doen | Wedstrijden, staff, geld, personen en familie bewegen door | Club doet het verrassend goed of slecht | Kunstmatige straf op elke nietsdoenweek | Bot `passive`, ledgervergelijking, mobiele playtest |
| 2. Elke week overal tussenkomen | Bemoeienis creëert echte voorbereiding, risico, werk- en relatie-effecten | Soms verbetering door aandacht | Alle interventies als gratis positief stapelen | Counterfactual actieve vs. gerichte strategie |
| 3. Altijd populairste optie | Concessies binden toekomstig geld en beslisruimte | ALV-win in enkele jaren | Elk jaar vanzelf optimale winst | Drie-seizoenen scenario; schuld/beleid/coalitie check |
| 4. Staf weigert driemaal | Iedere weigering heeft bevoegdheid/motief/beschikbaarheid en gevolg | Vervanging, bemiddeling of exit | RNG-"nee" zonder verklaring | Trace per staff agent, drempeltest |
| 5. Sportief sterk, bijna failliet | Cash, convenanten en bestuursbevoegdheden blijven leidend | Titel én insolventie | Sportief succes schept gratis liquiditeit | Financial ledger + projectbelasting |
| 6. ALV-/verkiezingsverlies ondanks succes | Geldige stemroute, uitsplitsing, speelbare doorstart | Een geliefde coach blijft behouden | Onverklaard ontslag of eindeloze game-over | Verkiezingsbot, twee extra seizoenen |
| 7. Competent familielid solliciteert | Gelijke selectieprocedure, recusal, eigen wens | Familielid wordt terecht gekozen | Gratis benoeming door achternaam | Permission-/tender-/nepotismtests |
| 8. Geen gewenste/geschikte familieopvolger | Transparant alternatief en betekenisvolle protagonistkeuze | Niet-verwante legacy-route of vrijwillig einde | Verplicht biologisch kind / automatische overname | Save met geïsoleerde protagonist, opvolgingstest |
| 9. Twee strijdige afspraken | Conflict expliciet zichtbaar, één prioriteitsregel | Heronderhandeling, reputatieschade, annulering | Beide eisen onafhankelijk en onzichtbaar uitvoeren | Contract-resolver-invariant |
| 10. 25+ seizoenen en veel agenten | Stabiele IDs, geldige saves, bounded tickkosten, coherent geheugen | Verlies van niet-relevante detailinformatie in compressie | Dubbele personen, negatieve kas door duplicaatbetalingen, secondenlange UI-block | 40-seizoenen bot, profiling, replay & save-load |

## 7.1 Testmethoden: technische correctheid ≠ causaliteit ≠ plezier

**Techniek:** `node`-tests voor determinisme, lidmaatschaps-/veto-/eigendomsregels, command-idempotentie, enige budgetbetaling, migraties, saves en procesgaten. 40-seizoenen- en edge-case fuzzing waar effectief.

**Causaliteit:** neem exact dezelfde save op W4, speel keuze A en B uit met relevante gecontroleerde RNG; vergelijk *wie handelde*, *wat er veranderde*, *welke nieuwe opties ontstonden*, niet alleen eindpositie of gemiddeld xG. Bewaar bewijs met command/effect IDs.

**Inzichtelijkheid:** menselijke tester krijgt een mandaat en wordt vier weken later gevraagd: 'Wie deed wat? Waarom? Waar staat het bewijs? Wat zou je volgende keer anders doen?' Meet taakuitvoering/gevonden logregels en de mate waarin de speler verkeerde causale verbanden legt.

**Gameplay:** observeer iemand die **zonder uitleg** 45–60 minuten speelt. Vraag na afloop naar favoriete speler, belangrijkste persoon, een moeilijke keuze, een beslissing waar hij spijt van had en of hij de volgende wedstrijd wil zien. Niet vragen 'vond je het leuk?' als enige maat.

## 7.2 Menselijke speeltest van 60 minuten

| Tijd | Observatie zonder begeleidende uitleg | Afbreeksignaal |
|---|---|---|
| 0–10 min | Clubkeuze, ledenstatuut in eigen woorden uitleggen, eerste manager-/clubactie | Speler begrijpt niet dat club geen bezit is of wordt door setup geblokkeerd |
| 10–20 min | Eerste twee wedstrijden, teamverhalen, eerste autonome stafhandeling | Speler wil uitslag overslaan omdat voetbal niets zegt |
| 20–35 min | Vrijwillig een kwestie agenderen, met TD/coach of familie spreken | Geen concrete actie beschikbaar of alle uitkomsten zijn meters |
| 35–45 min | Open dossier: verantwoordelijkheid en mogelijke prijs begrijpen | Speler weet niet wie uitvoering gaat doen of waarom goedkeuring nodig is |
| 45–60 min | Vervolgwedstrijden, project-/persoonsfollow-up, familievoortgang | Tester herinnert zich geen persoon/keuze en voelt geen nieuwsgierigheid |

**Ontwerpbrekers:** als 2 van 3 testers niet weten waarom hun bestuurlijke actie de wereld veranderde, als zij een familiegebeurtenis uitsluitend als '+relatie'-spam ervaren, of als ze na de derde wedstrijd geen speler of clubdoel onthouden, dan **geen volgende featuresprint**. Repareren, opnieuw testen en pas dan verdiepen. Dit zijn werkcriteria, geen reeds gemeten getallen.

## 7.3 Test met meerdere speelstijlen

- `hands-off`: onderhoudt mandaten, reageert alleen op formele deadlines;
- `interventionist`: zoekt vaak gesprekken, audits en mandaatwijzigingen;
- `coalition`: besteedt tijd aan ledengroepen en afspraken;
- `club-builder`: prioriteert faciliteiten, financiën en jeugd;
- `family-first`: investeert in privéloopbanen, volgt clubgedrag zonder automatisch invloed te kopen;
- `random`: ongericht maar geldige besluiten;
- `rival-AI`: dezelfde agentregels bij een andere club.

Scheid meetwaarden in **voetbal** (punten, clubsucces, sportief verhaal), **club** (cash, solvabiliteit, capaciteit, jeugd), **bestuur** (reële besluiten en geldige voortgang, niet louter aantal kaarten), **mensen** (agentopdrachten en conflicten), **familie** (persoonlijke loopbanen/keuzes en vrije protagonisttransitie). Een score met meer klikken is niet noodzakelijk een succes. De beste strategie mag contextafhankelijk verschillen.

---
# 8. Interface: vier lagen, één spelwereld, geen vier inboxen

**[VOORSTEL]** Mobile-first navigatie met één HQ/Today en vier directe bestemmingen. Niet elk tabblad krijgt een eigen notificatiebron; er is één tijdlijn die verwijst naar relevante objecten. De bestaande aparte matchdayflow blijft behouden.

| Scherm | Eerste zichtbare vraag | Handelingen | Contextlink |
|---|---|---|---|
| **HQ / Today** | Wat staat er deze week op het spel? | Next Match; één urgent dossier of eigen actie openen | Naar hetzelfde project/personId/clubId |
| **Club** | Hoe staat mijn organisatie ervoor? | Bekijk stand/financiën/selectie; strategie en plan voorstellen | TD-mandaat, stadionproject, ledenregel |
| **People** | Wie handelt werkelijk namens ons? | Spreek/benoem/evalueer, geschiedenis/relaties, loopbaan | Mandaat, uitvoering, familieband |
| **Board** | Welke afspraak, motie of procedure begrenst mijn macht? | Agenderen, onderhandelen, voorstellen, verantwoorden | Clubbudget, persoon, verkiezing |
| **Family** | Welke zelfstandige doelen hebben mijn verwanten? | Relatie, privéproject, carrièresteun, opvolgingsperspectief | PersonId en publieke belangenconflicten |
| **Matchday** | Wat gebeurt er op het veld? | Preview; playback/sim; krant | Echte spelers, managerbesluiten, derby's |

**Alle informatie zichtbaar in context:** wie een handeling uitvoert, zijn bevoegdheid, laatste bewijs, volgende review en het gevolg van niets doen. Een gebruiker mag vanaf de TD-pagina naar de aanwinst, vanaf de aanwinst naar de wedstrijdminuten, en van de Gazette terug naar de oorspronkelijke bestuurskeuze. Dat zijn twee contextsprongen, geen zoekspel door vier menu's.

### Informatiehiërarchie op mobiel

1. **Hoofdzin:** `Away to Oakby · 5th vs 7th`.
2. **Persoonlijk onderwerp:** `The director promised a replacement by week 10. No suitable player signed.`
3. **Jouw geldige actie:** `Request a progress meeting` / `Keep mandate` / `Escalate to board` indien bevoegd.
4. **Kosten en onzekerheid vóór de klik:** budget, relationele prijs, stemroute en controletermijn.
5. **After the whistle:** geen navertelling van alle mogelijke events, maar wat deze week veranderde, met verwijzing naar het dossier.

**Niet doen:** standaard alle metrics verbergen om 'roleplay' te suggereren. Managers en financiële spelers moeten cijfers kunnen raadplegen; verberg vooral *exacte toekomstige RNG-uitkomsten*, niet begrijpelijke huidige uitgaven of daadwerkelijke spelersstatistieken. Een bestuursspel zonder betrouwbare financiële administratie wordt onbespeelbaar.

# 9. Technische baselines en integratieplan zonder projectreset

## 9.1 Wat staat waar?

| Branch / scope | Aantoonbaar in bron | Bruikbaar voor v2 | Blokkerende kanttekening |
|---|---|---|---|
| `chatgpt` | 34 competitieweken, seeded engine, modules voor afdelingen, mandaten, matchday, besluiten, verhaal, saveversie 3 | Bestaande voetbal- en organisatiegame, UX, testen | `ownerOn`/investeerders-DNA en `sack()` met final phase botsen met gekozen ledenvoorzitter; geen volledige familiedynastie |
| `claude-game` | `modules.json`, `world.js`, `agreements.js`, `parties.js`, `projects.js`, `weekflow.js`, `talks.js`, saveversie 5, eigen tests | Rijke kandidaat voor voetbalwereld, gesprekken, projecten en sociale autonomie | `PARK` in `engine/01-core.js` schakelt `base/ini/agr/dos/auth` standaard uit; meer code betekent niet automatisch meer bereikbaar spel |
| `claude/loving-goodall-uv00vn` | `northmarch.html`, wereld- en Playwright-testscripts, ALV-/afspraak-/persoon- en regio-ontwerp | Sociale/morele spelmechanieken en gekozen ledenbestuur | Eigen standalone state en minder clubmanagement; niet direct in huidige hoofdengine in te voegen |
| `voorzitter-fundering` | Gescheiden `src/` met voorzitter-, club- en wereldfuncties, eigen tests | Functioneel onderzoeksreferentie voor causale data en modulaire tests | Aparte standalone; de branchnaam zegt niets over directe save-/UX-compatibiliteit |

**Status:** deze tabel is gebaseerd op broninspectie `[CODE]` en documentatie `[DOC]`. Eerder uitgevoerde gedeeltelijke headless runs zijn geen recente volledige compatibiliteits-/browserbenchmark. Een concrete technische basis moet daarom **voorwaardelijk** gekozen worden.

## 9.2 Voorgestelde primaire basis

**[VOORSTEL] Voorlopige voorkeurskandidaat: `claude-game`**, **alleen als** een standaard (`PARK` ongewijzigd) mobiele end-to-end 34-wekenrun, de brongebonden basistests, save/migratietests en de bestaande UX acceptabel zijn. Reden: de bestaande overeenkomsten-, project-, externe partijen- en wereldmodules zijn een betere *hergebruikscatalogus* voor het vierlagenspel dan deze systemen opnieuw ontwerpen. **Alternatief:** `chatgpt` als productmatige fallback als `claude-game` in de standaardinstelling onvoldoende speelbare of stabiele workflows heeft. Daarop kunnen goedgekeurde, kleinere ontwerpconcepten uit Loving Goodall worden geport, niet de hele runtime.

**Niet gekozen:** Loving Goodall `northmarch.html` als hoofdengine. De politieke kern is scherp, maar dat zou de uitgebreide 34-weekse voetbal- en afdelingengine grotendeels opzijzetten. Het is een goed mechanisch voorbeeld, geen vanzelfsprekende productbasis. **Trade-off:** het omzetten van ALV-afspraken naar een rijkere wereld kost werk, maar spaart voetbalmanagementontwikkeling.

**Beslisproef vóór enige code-integratie:**
1. Leg exacte branch-commit-SHA's vast en maak onafhankelijke werkcopies. Controleer voor elk de zichtbare **standaard** featurepaden.
2. Bouw elk met de **eigen** buildtool, niet met scripts van een andere branch.
3. Speel dezelfde functionele 10-weekssessie (setup, TD/trainer, transfer, matchday, Gazette, save/reload) op 390px en test eindweek 34, winterwindow en seizoensreview. Controleer echte meldingen, dubbele effecten en stilstaande schermen.
4. Test huidige saves en toekomstige migratiepad; vergelijk crashes, schermtaps, causale traces, doorlooptijd en arbeidsomvang van een minimale vierlaag-invoeging.
5. Kies **één** engine. De andere branches blijven ongepast; hergebruik wordt door kleine geïnterpreteerde contracten, niet door volledige merges.

**GitHub-regel:** bestaande `main`, `chatgpt`, `claude-game`, Loving Goodall, andere branches, PRs en deployments blijven ongewijzigd zolang geen nieuwe expliciete implementatieopdracht is gegeven. Deze v2 is een ontwerpvoorstel, geen codepatch.

## 9.3 Releasefasen: iedere fase bevat vier *werkende* lagen

| Milestone | Concrete nieuwe gameplay | Verplicht 4-lagenbewijs | Componenten/risico's | Releasegate |
|---|---|---|---|---|
| **M0. Baseline & contract** | Volledig bestaande game behouden; gameplay- en save-contract controleren | Vierlagenscenario uittekenen op echte bestaande club; nog geen nieuwe familie-UI claimen | `engine`, `world`, `matchday`, `agreements`, `projects`, `saves`; risico: geparkeerde modules | Groene build + 34 weken + save + match + mobiele clicks, gekozen basis bevestigd |
| **M1. Eerste geïntegreerde slice** | Club kiest jeugd/financiële koers; coach en TD gedragen zich anders; voorzitter onderhandelt een echte review; familie heeft zelfstandig beroeps-/privébesluit | **Een betekenisvol uitvoerbaar pad in ALLE VIER lagen** in de eerste 10 weken | `Person`, `Family`, `DecisionGateway`, `Mandate`, `Agreement`, `EventLedger`, UI; risico: dubbele mutaties | Drie causale ketens, waaronder familie→belangenconflict, plus browserflow en oude saves |
| **M2. Compleet seizoen** | Werkende 34-weekse clubagenda, echte vergadering/moties, winter, zomer, clubbudget en familierol over jaargrens | Elke laag heeft seizoensevaluatie en vervolgkeuze; voetbal blijft zelfstandig | `Elections`, `Projects`, `Finance`, `Membership`; risico: stempopulariteit-optimum | Vol seizoen + ALV + first-to-second season + quiet-week negative test |
| **M3. Meerdere seizoenen en verlies** | Jeugdprojecten, personeelscarrières en familierelaties groeien; verkiezingsverlies leidt tot actieve carrière zonder zetel | Club draait onafhankelijk door; politiek/privéleven/people zijn speelbaar buiten ambt | `Office`, `Career`, `Membership`, `Family`, save; risico: geen interessante post-office gameplay | Minstens twee seizoenen na verlies, mutatie- en bevoegdheidsinvarianten |
| **M4. Echte dynastie** | Levensfasen, eigen familiecarrières, privébezit/erfenis, opvolgers, rivaliserende clubs, vaste geschiedenis | Nieuwe protagonist is zelf iemand met eigen keuzes; clubmacht wordt niet overgedragen | wereldaggregatie, memory compaction, NPC AI; risico: 40-seizoenen performance | 40-seizoenen replay, save/load na protagonistwisseling, browser- en menselijke tests |

**Geen kalenderinschatting zonder gemeten omvang.** Iedere milestone eindigt met een **speelbare volledige HTML** die minimaal net zo stabiel is als de laatst geaccepteerde build; anders de laatste werkende build behouden en de kandidaat als test/ontwerp markeren. Niet vrijgeven omdat een nieuwe feature zichtbaar is.

## 9.4 Drie ketens die als eerste moeten worden bewezen

1. **TD-mandaat → autonome scouting/transfer → echte speler in selectie → wedstrijdminuten → financiële-/ledenreview.** `club + person + decision`, én de familie heeft parallel een eigen lopende carrièrezaak; alle vier aanwezig in de slice.
2. **Bestuursbegroting → commissie-/ALV-recht → gefinancierd project → echte faciliteit/contractverplichting → familiebelangenconflict.** `club + decision + person + family` in één trace.
3. **Familiekeuze → zelfstandige carrière van familielid → netwerk/rol buiten de club → speler krijgt een legaal eigen initiatief → club of leden reageert.** Geen verstopt gratis invloedseffect; ook wanneer het familielid geen voetbalambitie heeft.

### Waarom juist deze drie?

Ze testen drie fundamenteel verschillende causaliteitspaden: **professionele uitvoering**, **institutionele bevoegdheid** en **persoonlijke autonomie**. Samen bewijzen ze dat de vier lagen meer zijn dan aparte tabbladen en dat dezelfde wereld dezelfde personen en kasstromen gebruikt.

## 9.5 Nog niet bouwen voordat de kern slaagt

- Nieuwe categorieën stadionupgrades zonder project-/financiële integriteit.
- Honderden gegenereerde familie-events of huishoudklusjes.
- Handmatige transfer- of tactische UI voor de voorzitter.
- Een nieuwe tweede inbox/afsprakenadministratie naast de canonieke game-state.
- Volledige real-time AI-gesprekken (scripted/generated tekst is niet het probleem; spelregels zijn het probleem).
- Meerdere extra continenten, onbeperkte leagues of gedetailleerde NPCs zonder performancebudget.
- Een kunstmatige vier-momentenlimiet of nieuwe action-point-valuta als oplossing voor pacing.
- Een `merge all branches`-actie zonder dubbele systeemchecks, migratieplan en echte testbewijs.

---

# 10. Besluitenlog: trade-offs expliciet

| Ontwerpbesluit | Status | Waarom | Afgevallen alternatief en prijs |
|---|---|---|---|
| Gekozen ledenvoorzitter | **[BESLOTEN]** | Democratische macht en beperking vormen kern | Erfelijke private eigenaar: simpeler dynastie, maar andere spelerfantasie |
| Alle vier lagen zijn volwaardig | **[BESLOTEN]** | Langetermijnspel zonder lege familie- of voetbalcomponent | Alleen politieke kaarten: kleiner, maar geen volledige voetbalgame |
| Geen presidentiële tactiek/transferdeal | **[BESLOTEN]** | Macht moet indirect via mensen gaan | Direct controle: sneller, maar ondermijnt rol |
| Scheiding mandaat/afspraak/besluit/project | **[VOORSTEL]** | Legale en uitvoerbare gevolgen bewijzen | Eén generieke keuze-tag: makkelijker, maar foutgevoelig en schijncontrole |
| Jaarlijks ALV, verkiezing volgens statuut | **[VOORSTEL]** | Spelritme, politieke betekenis en realisme | Elk seizoen herverkiezing: meer drama, maar te voorspelbaar/uitputtend |
| Vrij agenderen, geen event-quota | **[VOORSTEL]** | Actieve speler heeft eigen initiatief | Vier gedwongen scènes: goede papieren proef, maar beperkt meerdere systemen |
| Familie vanaf eerste seizoen als twee werkende personen | **[VOORSTEL]** | Voorkomt 15 jaar lege generatiebouw | Baby-naar-opvolger wachten: weinig betekenisvolle vroege gameplay |
| Speelbaar buiten voorzitterschap | **[VOORSTEL]** | Verliezen mag geen einde aan wereld/familie zijn | Automatisch overstappen op nieuwe club: sneller, maar vernietigt verkiezingsinzet |
| Voorwaardelijke technische basis `claude-game` | **[VOORSTEL]** | Rijk hergebruik van reeds geschreven projecten/agents | Automatisch `chatgpt` of `northmarch`: mogelijk stabieler/scherper, moet beproefd worden |
| Afzonderlijke footbal- en bestuursmetrieken | **[BESLOTEN]** | Geen matchinteracties als besluitbudget tellen | Eén clickscore: makkelijk, maar misleidend |

## 10.1 Wat een volgende game developer wel en niet mag zeggen

- **Wel:** 'De TD heeft volgens het ledger een speler gescout na het jeugdmandaat, maar hij is niet getekend omdat Finance het salaris veto gaf.'
- **Niet:** 'Je keuze veroorzaakte een overwinning' als de matchsim dat niet bewijst.
- **Wel:** 'De gekozen `claude-game`-build toont de projectflow in de standaard-UI, getest met Playwright op SHA ...'.
- **Niet:** 'De module staat in de repository, dus dit werkt al'.
- **Wel:** 'De familietest heeft drie carrièreroutes en een post-office doorstart doorlopen'.
- **Niet:** 'Familie is geïntegreerd omdat er een stamboomscherm is'.

# 11. Eindoordeel en spelbelofte

> **Het voetbal maakt je nieuwsgierig naar zaterdag. De mensen maken je verantwoordelijk voor wat maandag gebeurt. De besluiten veranderen wie morgen de macht heeft. De familie bepaalt wie je bent als je daar allang niet meer zit.**

We verbeteren Front Office FC niet door de vier lagen te rangschikken of tot één inbox te reduceren, maar door ze als **gelijkwaardige bronnen van gameplay** te behandelen en technisch te dwingen elkaar werkelijk te beïnvloeden.

**Vier validatievragen voordat de v2 als spel geslaagd is:**

1. Wil een speler de volgende wedstrijd spelen zónder een nieuw bestuursdossier?
2. Kan een speler één personeelskeuze aanwijzen die werkelijk de wereld veranderde?
3. Kan een impopulaire maar legitieme beslissing een goede langetermijnstrategie zijn?
4. Is een verloren verkiezing of een generatieovergang het begin van een nieuwe speelbare situatie, niet het einde van het spel?

Pas na bevestiging van die vier in echte gameplaytests verdienen extra systemen prioriteit.

---

# 12. Bronverantwoording en bewijsgrenzen

**Interne uitgangspunt:** `FRONT_OFFICE_FC_VIERLAGEN_BLUEPRINT_V1.md`, 439 regels, als complete input gelezen en kritisch bewerkt.

**Geïnspecteerde bronnen, read-only, op 20 november 2026:**
- `Blauwev0gel/front-office-fc`, `chatgpt`: `BIBLE.md`, `CODEMAP.md`, `src/engine/{01-core,08-weekly-inbox,10-season,12-week,13-newgame-preseason,14-save-api}.js`, `src/{ceocore,desk,stories,specialist-cases}.js`.
- `Blauwev0gel/front-office-fc`, `claude-game`: `BIBLE.md`, `OVERZICHT.md`, `src/modules.json`, `src/engine/{01-core,12-week,13-newgame-preseason,14-save-api}.js`, `src/{agreements,parties,projects,world,talks,weekflow,weekloop}.js`, `test/agreements.js`.
- `Blauwev0gel/front-office-fc`, `claude/loving-goodall-uv00vn`: `standalone-research/{CONCEPT-VOORZITTER-2026-11-18,REGELSET-VOORZITTER,ALV-VOORZITTER,PERSONEN-VOORZITTER,AFSPRAAK-VOORZITTER,GESPREK-VOORZITTER,CLUBS-VOORZITTER,OPPOSITIE-VOORZITTER}.md`, `standalone/front-office-fc/voorzitter/northmarch.html` en tests.
- `Blauwev0gel/front-office-fc`, `voorzitter-fundering`: `standalone/front-office-fc/voorzitter-fundering/src/chairman/flow.js` en eerder geïnspecteerde modulaire bron; *niet als drop-in hoofdgame bewezen*.

**Referenties:**
- https://github.com/Blauwev0gel/front-office-fc/tree/chatgpt
- https://github.com/Blauwev0gel/front-office-fc/tree/claude-game
- https://github.com/Blauwev0gel/front-office-fc/tree/claude/loving-goodall-uv00vn
- https://github.com/Blauwev0gel/front-office-fc/tree/voorzitter-fundering

**Bewijsgrens:** deze v2 is een game-design- en integratiecontract met code-inspectie. Er is **geen actuele volledige browserplaytest, geen complete build, geen end-to-end familiesimulatie en geen codewijziging** uitgevoerd bij het opstellen van dit document. Hometown FC en andere referenties dienen als conceptuele benchmark; actuele featureclaims uit eerdere gesprekken zijn in deze versie niet opnieuw onafhankelijk geverifieerd. **Geen cijfers in deze bijbel zijn echte playtestresultaten**, tenzij expliciet als eerder vastgesteld aangeduid.
