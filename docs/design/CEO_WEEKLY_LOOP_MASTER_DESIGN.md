# THE FRONT OFFICE — CEO WEEKLY LOOP MASTER DESIGN
## Gameplay-first · Football-first · CEO-first
**Onderzoek:** 17 november 2026  
**Repository/branch:** Blauwev0gel/front-office-fc · claude-game  
**Geverifieerde HEAD bij onderzoeksstart:** 4a07075589899951a01c94750bb4f2320b9c8278  
**Status:** ONTWERPVOORSTEL, geen vastgesteld bijbelbesluit, geen implementatie  
**Methode:** actuele GitHub-code en spelbijbel, de UX-/code-audits en onafhankelijke voetbalkundige bronnen. Geen eigen browserplaytest, geen nieuwe run van de game of balansmeting. De apart aangehaalde seed-401-resultaten zijn eerdere testnotities, niet een nieuwe test in deze audit.

**Bewijscodes:** **[BESTAAT]** = code of bindend besluit teruggevonden; **[ONDERZOEK]** = professioneel oordeel; **[ONTWERP]** = voorstel, nog niet gebouwd; **[VERIFICATIE NODIG]** = claims die een test of werkende prototype nodig hebben. Deze labels zijn belangrijk: wireframes en de carrière van tien weken zijn demonstraties van het ontwerp, niet van de huidige speelbare build.

---

## 1. Executive verdict

**The Front Office heeft al een grotendeels herkenbare wekelijkse bestuurskamer, maar nog geen volledig sterke _speler-gedreven_ wekelijkse CEO-loop.** Het huidige spel weet steeds beter te _vertellen_ wat medewerkers doen. De nog grotere kans is de speler in staat te stellen zélf een verstandige agenda te kiezen, een ander gezichtspunt te vragen, een strategisch experiment aan te gaan en later de verantwoordelijke persoon op die keuze aan te spreken — zonder diens werk over te nemen.

### Wat de actuele code al heeft

1. **Autonomie en bevoegdheden:** heads mogen gedelegeerde kwesties afhandelen; besluiten krijgen een geregistreerde reden/uitkomst (src/desk.js), met relevante tests en eerdere risico's uit de technische audit.
2. **The Weekly Desk:** onderwerp, uitslagenreeks, backers, **Your team at work**, opgesplitste red box, volgende wedstrijd en archieflinks (src/ui/10-inbox.js). **Dit is nieuwer dan de vorige UX-audit.** B55 in BIBLE.md bevestigt het principe.
3. **Mensen met stem:** src/teamwork.js geeft maximaal drie geprioriteerde regels met temperament; eerdere notitie notes/team-at-work.md bevat seed-401-voorbeelden (geen nieuw bewijs van balans).
4. **Doorlopende context:** src/teamwork.js:stillRunning en B56 verbinden boardplan, coachbelofte en academieafspraak met toekomstige evaluatie; src/weekflow.js houdt een bestuurscrisis samen.
5. **Gesprekken:** src/talks.js heeft ongevraagde aanvragen, optionele CEO-Talk, review/back/push/warn en concrete heads-verzoeken.
6. **Voetbalritueel:** full-screen voorbeschouwing → wedstrijd → Gazette (src/ui/14-matchday-gazette.js).
7. **Vrijwillige diepte:** Recruitment-squadplan, scoutingportaal met hypotheses, flags/targets/bets, academie, afdelingsplannen, commerciële/marketing-/financiële opties (B38–B47, src/ui/08a-dept-parts.js).

### Wat nog niet overtuigend is

- De centrale spelerhandeling is te vaak **reactie** op verzoek/brief, en te weinig **initiatief** vanuit een geobserveerd voetbalprobleem of kans.
- Vrijwillige handelingen zitten verspreid in afdelingen en zijn vaak generiek (Talk → Back / Push / Review), in plaats van onderwerpgebonden en later toetsbaar (src/talks.js:common/open).
- Een incident kan goed worden verteld terwijl de strategische keuze slechts een tijdelijke relatie-, boost- of budgetwijziging oplevert. **Betekenis moet causaal verifieerbaar zijn.**
- Lange carrières riskeren herhaling als de loop hoofdzakelijk bestaat uit matches, berichten, enkele transferwindows en generieke gesprekshandelingen.
- Een _vrije hand_ mag niet betekenen dat de speler geen interessante invloed meer heeft. **Strategische beïnvloeding** moet interessant blijven zonder operationele micromanagementknoppen.

**Hoofdbesluit dat ik voorstel (niet bindend): een hybride Executive Leadership & Football Dynasty-loop.**  
Elke week is er een duidelijke briefing; de CEO kan vervolgens **observeren, iemand bevragen, koers zetten of bewust niets doen**. Medewerkers nemen de uitvoering over. Voetbal produceert nieuw bewijs. De volgende briefing laat zien wat er veranderde.

**De game wordt interessant wanneer een eigen hypothese van de speler kan worden bevestigd, tegengesproken of achterhaald door de voetbalwereld.** Niet wanneer iedere week een kaartje verschijnt dat moet worden weggeklikt.

---

## 2. Een echte voetbal-CEO: wat is bruikbaar als spel?

### Realistische taakverdeling

Clubs verschillen in omvang en eigendomsstructuur. In grote clubs scheidt men clubstrategie, operationele CEO-leiding, sporting direction en coaching; in kleine clubs lopen taken en vrijwilligersrollen vaker door elkaar. Supportersorganisaties benadrukken richting, toezicht en delegatie; de Premier League en Bundesliga beschrijven de sporting director als leider van recruitment en voetbalplanning; UEFA beschrijft de hoofdtrainer als verantwoordelijke voor selectie, tactiek en training. **Dit zijn richtinggevende rolgrenzen, geen universeel org-chart**.

| Ritme | Reëel werk van CEO / bestuur | Gamewaardig? | Hoe omzetten |
|---|---|---|---|
| Dagelijks | Brandjes, personeelscoördinatie, operationeel toezicht | Alleen uitzonderingen | Team regelt routine; CEO krijgt een eenduidige escalatiereden |
| Wekelijks | Executive briefing, financiële risico's, sportieve context, relaties met heads | **Ja** | Korte briefing plus vrijwillig persoonlijk contact |
| Wekelijks indien aanleiding | Coach/DoF ondersteunen of kritisch bevragen | **Ja** | Contextueel gesprek, een echte afspraak, gevolgen later |
| Wekelijks incidenteel | Pers/sponsor/supporters, gemeente of bond | Soms | Thema wanneer het druk zet op clubidentiteit, geld of voetbal |
| Maandelijks / blok | Voortgang tegen plan, budget, prestaties van heads | **Ja, als ritueel** | Bespreek een helder dossier, niet 12 losse KPI's |
| Winter/zomer | Lange selectieplanning, middelen, ambities, managers beoordelen | **Hoog** | Plan van DoF → challenge → toestemming → uitvoering → debrief |
| Einde seizoen | Board review, opvolging, contracten, faciliteiten, strategie | **Hoog** | Terugblik op beloften, verantwoording, toekomstig dilemma |
| Operationeel dagelijks | Eigen advertenties instellen, scouts trips plannen, tickets decimalen tunen, individuele contracten onderhandelen | **Meestal nee** | Alleen principiële beleidskaders, desnoods optionele diepe tools |
| Sportief dagelijks | Team trainen, basiselftal, wissels en wedstrijdtactiek | **Nee (B1)** | Via coachbeoordeling, mandaat en directiefunctie |

### CEO versus voorzitter versus eigenaar

**[BESTAAT]** de BIBLE pitch gebruikt CEO, maar de speler heeft ook founding-DNA en stevige bestuursbevoegdheden. Dat is een bewust spelabstrahering. De game moet intern consistent zijn: **de speler is de uitvoerende clubleider met een bestuur dat hem beoordeelt**, geen onbeperkte eigenaar die iedere keer zijn eigen baas is. De voorzitter/board stelt grenzen; de DoF en coach blijven zelfstandig.

**Besluit nodig:** willen we de fictie van ‘founder-CEO met toezichthoudend bestuur’ expliciet maken in eerste werkdag / clubintro? Mijn advies is ja, zonder het oprichtingsverhaal te herschrijven.

### Filter: is een verantwoordelijkheid daadwerkelijk leuk?

Een interactie komt alleen in de kernloop als minimaal drie vragen **ja** krijgen:
1. Is er een informatie- of perspectiefverschil, dus een echte afweging?
2. Heeft de speler via **een persoon, opdracht, investering of niet-ingrijpen** reële invloed?
3. Komt het resultaat later zichtbaar terug?
4. Is er een plausibel alternatief dat soms beter kan uitpakken?
5. Is deze actie niet eenvoudiger en geloofwaardiger door een head af te handelen?

Geen drie keer ja? Dan is het hoofdzakelijk administratie: delegeren of optionele inzage.

---

## 3. Spelplezier: zes concurrerende motoren

**[ONDERZOEK]** Prioriteit voor The Front Office, niet universele wetenschap:

| Rang | Motor | Waarom in deze game? | Huidig bewijs en grootste gat |
|---|---|---|---|
| **1** | **Mensen leiden** | Kernfantasie, onzekere autonomie, verantwoordelijkheid en verschil van inzicht | Heads, mandaten, Talk bestaan; eigen afspraken zijn onvoldoende het centrum van iedere relatie |
| **2** | **Strategisch experimenteren** | Zorgt dat de CEO iets uit eigen initiatief te doen heeft; geen vaste optimale aanpak | DNA, mandates, budgets en scoutinghypotheses bestaan; een expliciete voorstel→uitvoering→evaluatiecyclus ontbreekt op clubniveau |
| **3** | **Voetbalspanning** | Elke week een natuurlijke onzekere uitkomst die beslissingen op de proef stelt | Sterke matchflow; verband naar eigen beleid kan duidelijker |
| 4 | Ontdekkingen en kansen | Spelverhalen ontstaan zonder scripted drama; scouts en academie hebben betekenis | Portaal, talenten, kansen bestaan; relevantie en vindbaarheid variëren |
| 5 | Nalatenschap | Geeft seizoenen/emoties een geheugen | Gazette/archief/Bets bestaan; ‘waarom dit door mijn besluit kwam’ is beperkt |
| 6 | Problemen oplossen | Hoogspanning en consequenties, maar alleen bij echte aanleiding | Turnaround, dossiers, board/backers bestaan; teveel crises zou de weekloop verpletteren |

**Cruciale ontwerpkeuze:** *problemen oplossen* is niet de dominante motor. Een CEO-game die voortdurend brandjes aansteekt, leert de speler dat bekwaam personeel niet mag bestaan. Positieve kansen en goed uitgevoerde plannen zijn minstens zo belangrijk.

**Game-designbewijs:** agency groeit wanneer de speler het verband kan begrijpen tussen keuze, handeling en consequentie, niet simpelweg door een groter aantal knoppen. Zie de researchreferenties aan het einde.

### Het ‘nog één week’-motief

Niet: "Er zijn nog twee unread messages."  
Wel: "**De DoF zal over twee weken uitleggen of ons jonge centrumduo sterk genoeg is; zaterdag krijgen ze hun eerste serieuze test.**"

Een goede cliffhanger vraagt **wat zal er gebeuren?**, niet **wat moet ik nog afvinken?**

---

## 4. CEO Weekly Activity Matrix — moet, zou, kan, delegeert

**Definities:** **M** = noodzakelijke handeling om de speelweek te doorlopen (niet elke week een besluit); **Z** = verstandig bij concrete aanleiding; **K** = vrij initiatief, zonder verplichting; **D** = delegeren; **F** = fasespecifiek. **Status:** A = al in code, P = presentatie/verbinding deels, N = nieuw voorstel. ‘Gevolg’ is het bedoelde causale pad; ontbrekende effecten blijven voorstellen.

| Activiteit | Klasse | Trigger / frequentie | Concrete CEO-handeling | Waarom interessant / gevolg | Status |
|---|---|---|---|---|---|
| Korte weekbriefing lezen | M | 34 speelweken | Lees clubsituatie, doorlopende afspraak en stafwerk | Oriëntatie op gevolgen van vorige keuzes | A/P |
| Naar wedstrijd/volgende week | M | Normale week | Open preview, kijk/sim, lees krant, verder | Natuurlijk ritme, sportieve onzekerheid | A |
| Reageren op bestuursdeadline | Z/F | Echte deadline | Kies koers of laat expliciete default lopen | Spanning tussen vertrouwen en verantwoordelijkheid | A/P |
| Red-box-escalatie behandelen | Z | Mandaat/bedrag/conflict | Beslis of de head binnen grenzen kan handelen | Autoriteit, tradeoff, verantwoordelijkheid | A |
| Overige red-box-brief laten lopen | K/D | Optioneel | Laat bevoegde head beslissen of kans verlopen | Niet-ingrijpen is bewuste strategie | A |
| Weekrapport verdiepen | K | Bij nieuwsgierigheid | Open record / details | Leren wat afdeling doet | A |
| Trainer aanspreken over vorm | Z | Slechte reeks, belofte, blessure | Vraag verklaring, spreek norm af | Vertrouwen vs tijd; matchuitkomst test het | A/P |
| DoF challengen over squadplan | Z/K | Zwakke dekking, window, nieuw talent | Vraag waarom en alternatief | Persoon met eigen plan, geen transferknop | A/P |
| Head vrijer of strakker laten werken | K | Fouten, succes, afweging | Wijzig authority/mandate | Vertrouwensbesluit met risico | A |
| Head op resultaten beoordelen | Z/F | Reden of blokreview | Vraag evidence, steun, waarschuw, eventueel ontsla | Verantwoordelijkheid voor eigen benoeming | A/P |
| Een onderwerpgestuurd overleg starten | K | Speler ziet ontwikkeling | Kies onderwerp: plan, middelen, evaluatie | **Vrije CEO-agency; besluit kan doorlopen** | **N** |
| Een clubexperiment voorstellen | K | Idee of kans met middelen | Leg doel, eigenaar, horizon en succescriterium voor | Hypothese wordt testbaar; risico op mislukking | **N** |
| Tussentijdse voortgang opvragen | K | Lopende afspraak | Vraag status bij verantwoordelijke, eventueel second opinion | Verdieping zonder verplichte mail | P/N |
| Bestaande afspraak herzien | Z/K | Tegenbewijs of nieuwe omstandigheden | Houd koers / verfijn doel / stop project | Strategisch leren zonder straf voor reflectie | P/N |
| Onafhankelijke tweede mening vragen | K | Risicovolle keuze | Vraag een andere head, mits plausibele kennis | Tegenspraak en onzekerheid | A/P |
| Scoutingportal onderzoeken | K | Zin in diepgang | Vergelijk statistieken, maak flag/hypothese | Eigen ontdekking, bet later beoordeeld | A |
| Geflagde speler bij DoF neerleggen | K | Onderbouwde hypothese | Geef target ter onderzoek, niet voor handtekening | Delegeren + vraag wat hij ervan vindt | A |
| Scoutreis/onderzoek prioriteren | K/Z | Signaal dat bewijs ontbreekt | Vraag onderzoek, wijs middelen toe | Informatie is schaars, niet een perfecte filter | A/P |
| Jeugdtraject/academy-rapport volgen | K | Talent/strategie | Vraag directeur naar traject en coachminuten | Een speler groeit door meerdere jaren | A/P |
| Jeugdspelers persoonlijk selecteren | D | Opleiding | Geen | Niet het werk van de CEO (B16) | B1/B16 |
| Trainer de basiself opleggen | D | Voor elke match | Geen | Ondergraven van eigen fantasy (B1) | Verboden |
| Persoonlijk transfers onderhandelen | D | Windows | Geen | DoF voert uit binnen mandaat (B1) | Verboden |
| Individuele scouts/assistents aannemen | D | Afdelingswerk | Geef head budget, head kiest | Delegeer de organisatie | A |
| Dagelijks ticketprijzen schuiven | D/K* | Commerciële koers | Spreek strategie af; operationeel wijzigen door head | Club-DNA vs inkomsten | A huidig, **herziening voorgesteld** |
| Losse marketingcampagnes kiezen | D/K* | Campagnekans | Richting en investeringsgrens, head voert uit | Belangen fans/sponsors | A huidig, **herziening voorgesteld** |
| Financiële prioriteiten bepalen | Z/F | Werkelijk gat/kans | Kies afwegingskader, investeer of beveilig | Sportief versus overleven | A/P |
| Een sponsorwaardeconflict oplossen | Z | Botsing identiteit en geld | Advies ontvangen, keuze verantwoorden | Club-DNA krijgt prijskaartje | A/P |
| Bestuursgesprek in blokweek | F | Week 10/19/29 | Verdedig koers en doelen | Verantwoording, tijdsdruk | A |
| Transferwindowbrief goedkeuren | F | Zomer/winter | Spreek plan en grenzen af, DoF uitvoert | Grote executive-rituelen | A |
| Transferresultaat evalueren | F | Na window | Beoordeel plan, pech, fouten, progressie | Eerdere aanstelling op het spel | A |
| Seizoenafsluiting | F | Week 34 | Review doel, belofte, staff en clubidentiteit | Legacy, volgend seizoen | A/P |
| Pers/achterbannen reageren | Z/K | Grote clubgebeurtenis | Publieke koers kiezen, niet standaard PR | Reputatie, sponsors, kleedkamer | A/P |
| Gemeente-/stadionkans onderzoeken | K | Concrete aanleiding | Financieel/maatschappelijk gesprek starten | Club wordt letterlijk groter | P/N |
| Externe concurrent observeren | K | Rivaliteit, transfer-/trainerrisico | Vraag head wat concurrent betekent voor onze koers | Wereld buiten club wordt relevant | P/N |
| Niet ingrijpen | K | Altijd | Vertrouw, laat plan lopen | Besluit heeft risico, maar geen click reward | A/P |

*Voor commerciële/marketing-UI geldt: de operationele toggles bestaan, maar of ze naar beleid/mandaat moeten verschuiven is een **nieuw ontwerpbesluit**. Niet stilzwijgend weghalen.*

### Harde ontwerpregel: minimale verplichte inhoud

**De enige structureel verplichte wekelijkse handeling is het spel voortzetten.** Een deadline kan aandacht verdienen, maar de speler wordt niet in een menu opgesloten totdat hij een antwoord geeft. De preview moet de eerlijke default tonen: head beslist, board beslist, verzoek vervalt of afspraak loopt door. Geen AP, geen clickbonus, geen verplichte praatronde.

---

## 5. Drie werkelijk verschillende loopconcepten

### Concept 1 — Executive Briefing / **The Delegator**

**Volgorde:** weekly briefing → uitzonderingen/delegatie → match → newspaper.  
**De speler doet:** appoint, authorize, approve/reject, beoordeling.  
**Niet doen:** allerlei dagelijkse taken.  
**Sterk:** authentiek, snel, telefoonvriendelijk, goed voor rust.  
**Zwak:** als alles goed gaat kan het spel een pure voetbalnieuwslezer worden; veel keuzes komen van het systeem in plaats van de speler.  
**Week 20:** nog steeds dezelfde rode map tenzij agenda verandert.  
**Seizoen 5:** resultaten en historie hebben betekenis, maar eigen actievariatie beperkt.  
**Risico:** passiviteit als de grootste bron van agency **autonomie** is.

### Concept 2 — Leadership Drama / **The People Manager**

**Volgorde:** medewerker met doel/mening → gesprek → afspraak → voetbalbewijs → evaluatie.  
**De speler doet:** mensen bevragen, steunen, uitdagen, aanstellen, afscheid nemen.  
**Sterk:** persoonlijke betrokkenheid; tegenspraak; reputatie; een goed ontslag raakt.  
**Zwak:** risico op een gesprekssimulator; dialogen worden leeg als twee ‘Back’/‘Push’-knoppen structureel voldoende zijn.  
**Week 20:** afhankelijk van hoeveelheid echte verschillende onderwerpen.  
**Seizoen 5:** terugkerende namen kunnen sterke verhalen geven; veel content/causale binding nodig.  
**Risico:** personages praten, maar veranderen niet werkelijk hun plannen.

### Concept 3 — Strategy & Discovery / **The Club Architect**

**Volgorde:** analyseer club/wereld → stel plan of hypothese voor → delegatie → voetbal/financieel bewijs → leer → investeer.  
**De speler doet:** koerskeuzes, actief kansen onderzoeken, scoutingbets, budgetprioriteiten en strategische experimenten.  
**Sterk:** uit eigen initiatief iets doen; verschillende clubidentiteiten en lange carrières.  
**Zwak:** kan verkapte spreadsheet-/optimalisatiegame worden, waarin ‘sliders’ de personages verdringen.  
**Week 20:** volop zelfgekozen experimenten.  
**Seizoen 5:** meerdere strategieën leveren verschillende clubidentiteiten.  
**Risico:** DoF/coach worden passieve uitvoerders van CEO-scripts.

### Scorevergelijking (1–5, kwalitatieve ontwerpinschatting)

| Criterium | Delegator | People Manager | Club Architect | **Hybride** |
|---|---:|---:|---:|---:|
| Spelplezier | 3 | 4 | 4 | **5** |
| CEO-realiteit | 5 | 4 | 4 | **5** |
| Voetbalervaring | 3 | 4 | 4 | **5** |
| Vrij initiatief | 2 | 3 | 5 | **5** |
| Variatie over weken | 2 | 3 | 4 | **5** |
| Toegankelijkheid | 5 | 4 | 2 | **4** |
| Diepgang | 3 | 4 | 5 | **5** |
| Lange carrière | 3 | 4 | 5 | **5** |
| Implementatiegemak (5=gemakkelijk) | 5 | 3 | 2 | **2** |
| Grote zwakte | passief | dialoogspam | micromanagement | scope/complexiteit |

### Gekozen model: **The Executive Leadership Loop**

**Deze hybride is geen optelsom van drie featuresets.** De briefing geeft een *probleem of kans*, het gesprek confronteert visies, de CEO kan besluiten of een hypothese voorstellen, de head implementeert, en de wedstrijd/clubvoortgang toont bewijs.

**Definitieve kernloop:**

> **Zie → Bevraag → Kies richting óf vertrouw → Laat uitvoeren → Beleef voetbal → Evalueer/leer → Volgende week.**

Dit is **flexibel**, geen verplichte achtstappenwizard. ‘Bevraag’ en ‘Kies’ kunnen ontbreken; ‘Zie’ en ‘Beleef voetbal’ keren vrijwel elke week terug.

---

## 6. De ideale CEO-week — exact spelerspad

### Stap 1. Het bureau opent

**In 5–10 seconden** (ontwerpdoel, nog niet getest) ziet de speler:
- **Wat is nieuw?** resultaat, stand, echte kwestie of kans.
- **Wie draagt dit?** één head of meerdere head-stemmen.
- **Wat loopt door?** de laatst overeengekomen koers, alleen als relevant.
- **Wat staat zaterdag op het spel?** de volgende wedstrijd.

De huidige UI-1/B55-indeling is bruikbaar: **niet opnieuw cosmetisch herontwerpen**.

### Stap 2. Eerste beoordeling: wat vraagt aandacht?

Drie niveaus:
- **Watch:** informatie zonder actie.
- **Worth discussing:** een vrijwillige vraag, nader onderzoek of beleidsoptie.
- **Needs your judgment:** echte ownership/overschrijding, conflict of harde termijn.

Red box blijft alleen **Needs your judgment**. Een head-update is geen verkapt besluit.

### Stap 3. Vrijwillige initiatiefroute

De speler mag altijd zonder penalty:
- de betrokken head spreken **over het concrete onderwerp**;
- een bestaande afspraak opvragen;
- een hypothese/experiment voorstellen;
- extra bewijs aanvragen bij de juiste afdeling;
- expliciet zeggen: *Keep going; report back when it matters*.

**Belangrijk:** een gesprek mag eindigen met ‘er is geen nieuwe informatie’ of ‘dat ligt bij mij’, mits dat begrijpelijk is. Niet iedere poging levert progress op.

### Stap 4. Een voorstel leidt tot een echte opdracht

Een strategische afspraak heeft minimaal:
1. **Eigenaar:** coach/DoF/academy/Finance/Commercial/Marketing.
2. **Aanleiding:** echte clubstate of vrijwillige hypothese.
3. **Keuze/alternatieven:** waarom wel/niet, plus wat head ervan vindt.
4. **Middel/kosten:** geld, tijd, verloren andere kans, relationele prijs.
5. **Toetsmoment:** weekblok, window of meetbaar doel.
6. **Bevoegdheid:** head kan instemmen, bezwaar maken of alternatief aanbieden.
7. **Later gevolg:** wat is daadwerkelijk gebeurd, niet een vooraf gegarandeerde uitkomst.

Voorbeeld: de CEO vraagt DoF en coach een plan voor de linkerflank. **Geen individuele speler of opstelling voorgeschreven.** De head mag terugkomen met een ander inzicht.

### Stap 5. Bewust niets doen

Wanneer niets wordt besloten:
- beslist de head binnen mandaat;
- vervalt een verlopen kans;
- blijft het eerder gekozen plan doorlopen;
- leren we via resultaat/rapportage of dat verstandig was.

**Geen straf voor rust, geen fictieve opportuniteit om leegte te vullen.**

### Stap 6. Wedstrijddag

Behoud de bestaande full-screen preview / match / Gazette. Maak contextueel één echte **lead story** die verband houdt met de huidige opdracht/clubontwikkeling. Geen extra klik voor de CEO tijdens iedere match. De bestaande halftime-optie blijft alleen bij geschikte aanleiding.

### Stap 7. Krant en nieuwe week

De Gazette meldt:
- wat er op het veld feitelijk gebeurde;
- wat de coach/de DoF/andere head daadwerkelijk deed;
- wat het betekent voor één belangrijke afspraak;
- wat we **nog niet weten**.

De nieuwe briefing haalt de relevantste open lus terug. Niet alle overeenkomsten wekelijks, maar alleen bij verandering, mijlpaal of nadering van de evaluatie.

### Tempo en ritme

- **Korte sessie:** briefing lezen → eventuele beslissing → match/krant.
- **Verdieping:** vrijwillig 1–3 afdelingsbezoeken, analyse in Moneyball, gesprek of voornemen. **Geen vast quotum**.
- **Rustige week:** kan in één korte loop verlopen en zonder gesprek toch een sportief verhaal hebben.
- **Drukke week:** maximaal één prominente hoofdkernzaak plus logisch verwante secundaire informatie; overige onafhankelijke zaken blijven toegankelijk en kunnen niet onterecht verdwijnen.
- **Seizoensritueel:** blokreview in 10/19/29, winterwindow na 16, slot 30–34, einde seizoen (volgens BIBLE).

---

## 7. People & Relationship Loop — de mensen worden echte keuzes

**Huidige kracht [BESTAAT]:** staff-personalities (ego/risk/amb/loyalty/lean), mandaten, autonomie, relatie, coach afwijzing, gesprek, aanstelling/ontslag, Record. **Huidige beperking [BESTAAT]:** een zelf geïnitieerd gesprek via src/talks.js heeft vooral generieke Back/Push/Review/Warn. Dat is geen duurzaam beleidsgesprek wanneer er niets specifieks is gebeurd.

### Verbetering: een dossier tussen twee mensen

**[ONTWERP]** Per belangrijke relatie mag de speler één of meer **inhoudelijke afspraken** terugvinden (geen extra trustmeter):

~~~text
DIRECTOR OF FOOTBALL — ANNABEL VALE
OUR AGREEMENT
"Build defensive depth with players under 24."
Owner: Vale · agreed week 4
Next review: week 10

VALE'S VIEW
"I want two more reports before I commit."
[Ask why] [Request alternative] [Back the plan] [Review later]
~~~

**Niet altijd een nieuwe knop:** bij ontbreken van nieuw bewijs is [Review later] alleen een niet-actieve status of terugkeer. Conversaties krijgen context uit echte bestaande state.

### Welke interacties horen bij welk moment?

| Contact | Initiatief | Trigger | Uitkomst |
|---|---|---|---|
| Head wil iets | Head | Mandaat blokkeert doel of prestatie schiet tekort | Vraag aan CEO, later lapse/default |
| CEO vraagt uitleg | Speler | Elke relevante afdelingsstate | Onderbouwd antwoord, geen gratis boost |
| CEO stelt agenda | Speler | Vrijwillig, met echte resource-/horizonkeuze | Voorstel van head, mogelijke bijstelling |
| Head spreekt tegen | Head | Persoonlijkheid en verschil met beleid | Onenigheid, rapportage of alternatief |
| Gezamenlijk overleg | Speler of board | Interdepartementaal conflict | Eén casus met twee inzichten, één besluit |
| Evaluatie | Moment/CEO | Afspraak nadert, resultaten beschikbaar | Eerlijk oordeel met oorzaak/context |
| Opvolging/ontslag | CEO | Structureel falen, koersbreuk of betere kandidaat | Geld/vertrouwen, vervangingsrisico, legacy |

**Mensen moeten niet alwetend zijn.** De coach kan vorm verklaren maar niet contractprijzen voorspellen. De DoF kan squadplanning verdedigen maar niet garanderen dat de markt meewerkt. Finance kan risico's kwantificeren maar niet sportieve fit beoordelen. Twee deskundige heads mogen allebei redelijke argumenten hebben.

### Anti-gespreksspam

- Elk gesprek heeft aanleiding, standpunt, antwoord en eventueel één duidelijk vervolg.
- Een herhaling zonder nieuw bewijs krijgt geen nieuwe perk; toon desnoods ‘we discussed this in week 8’.
- Een head kan gemotiveerd weigeren of alternatieven voorstellen.
- Staff ‘karakter’ beïnvloedt ook **wat hij aanraadt/riskeert**, niet alleen schrijfstijl.
- Beperk niet het aantal gesprekken met een arbitraire resource; **de spelwereld** (lopende afspraak, afwezig bewijs, kosten en deadlines) bepaalt hun waarde.

---

## 8. The Football Loop — tien feitelijke ketens

**[ONTWERP]** Onderstaande tabel beschrijft hoe gebeurtenissen *zouden moeten* doorwerken; check voor implementatie welke elementen al volledig bestaan.

| Voetbalgebeurtenis | Organisatorische betekenis | Reactie van medewerker | Mogelijke CEO-actie | Toekomstig toetsmoment |
|---|---|---|---|---|
| 3–4 nederlagen | Doel raakt uit zicht | Coach: pech/vorm; DoF: selectie/fit | Vraag gezamenlijk herstelplan / steun / wacht | Na 4–6 wedstrijden |
| Ploeg wint verrassend | Coachbeleid krijgt tijdelijk bewijs | Coach vraagt vertrouwen in aanpak | Geef ruimte of blijf voorzichtig | Komende sterke tegenstander |
| Aanstaande derby | Culturele betekenis, fans/press | Commercial/coach geven verschillende prioriteit | Alleen bij echte big-game-keuze: event/investeer/geen actie | Uitslag + fans/press |
| Jeugdspeler breekt door | Talentstrategie krijgt tastbaar gezicht | Academy: ontwikkelpad; coach: speelminuten | Vraag haalbaar plan, geen opstelling | Seizoenblokken |
| Sleutelspeler raakt geblesseerd | Korte termijn vs langetermijn | Coach: vervanging; DoF: noodplan | Vraag opties/risico; niet zelf behandelen | Matchen en window |
| Sterspeler wil weg | Vermogen, moraal, fans | DoF: vervanger, Finance: bodem | Richt verkoopbeleid binnen window | Opvolging + financiële impact |
| Scoutinghypothese klopt | Mogelijkheid voor goedkoop talent | Scout rapporteert; DoF twijfelt/steunt | Vraag vervolgonderzoek of target via DoF | Volgend window / Bets |
| Tegenstander is directe rivaal | Klassering en reputatie | Coach identificeert bedreiging | Geen tactisch commando; bespreek inzet en verwachtingen | Wedstrijd en Gazette |
| Promotiekans | Nieuwe divisie, capaciteit, contracten | Finance: licentierisico; DoF: kwaliteitsstap | Bestuurlijke prioriteiten stellen | Seizoenseinde |
| Cupstunt | Publiek, geld, verwachtingen | Commercial ziet kans, coach bewaakt kern | Sponsor/matchdaybesluit indien aanleiding | Volgende ronde |
| Druk op coach | Organisatievertrouwen | Coach verdedigt proces, DoF visie | Evaluatie, termijn, ontslag | Volgende blokreview |
| Stadion/licentieprobleem | Club moet investeren | Finance/Commercial geven alternatieven | Accepteer risico, stel uit, schaal plan terug | Licentiecontrole |

**Regel:** niet elk sportief feit genereert een red-box-besluit. Soms gaat het slechts om **nieuwe informatie**, een vrijwillig gesprek of voortgang op een eerdere belofte.

**Causaliteitslabel:** wanneer het systeem geen betrouwbare oorzaak kan aanwijzen, formuleer: ‘in de periode sinds het besluit’ of ‘dit is nieuwe informatie’, nooit ‘omdat jij X koos’.

---

## 9. Vijf soorten weken en seizoensritme

### Type 1 — Rustige bedrijfsvoering

**Ingang:** weinig relevante veranderingen, geen deadline.  
**Spel:** één echte stafupdate of eenvoudig 'nothing to report', bestaande afspraak eventueel zichtbaar, match preview. Vrijwillige analyse.  
**Valkuil:** standaard een nieuwe opportuniteit verzinnen. B55 heeft B23 al verzacht.

### Type 2 — Een voetbalweek

**Ingang:** derby, cruciale match, blessure, doorbraak of zichtbare vormtrend.  
**Spel:** het voetbal is de hoofdlijn; de CEO mag ingrijpen als bestuurlijke reden bestaat.  
**Valkuil:** score bepaalt te vaak zomaar bestuurstraf.

### Type 3 — Een bestuurlijke week

**Ingang:** board review, budget, conflict, head-evaluatie.  
**Spel:** twee perspectieven, één plausibel besluit; laat **niet doen** of **meer bewijs vragen** bestaan wanneer tijd dat toelaat.  
**Valkuil:** elke afdeling komt tegelijk met eigen losse escalatie.

### Type 4 — Crisisweek

**Ingang:** aanhoudend onderpresteren of financiële dreiging.  
**Spel:** één bestuursdossier, meerdere stemmen, tijdshorizon en toetsing.  
**Valkuil:** elke crisis met dezelfde ‘back, sack, invest’-opties oplossen.

### Type 5 — Kansenweek

**Ingang:** waarneembare ontdekking, gesprek of clubcontext, niet verplicht bij rust.  
**Spel:** opt-in onderzoek of experiment; head kan zeggen dat het idee onvoldoende onderbouwd is.  
**Valkuil:** opportuniteiten worden altijd positieve gratis beloningen.

### Binnen één seizoen

- **Weken 1–6:** doelen testen, staf leren kennen, weinig crisis vóór basisbewijs.
- **7–15:** eerste serieuze diagnostiek, markt-/scoutinghypotheses en blokreview 10.
- **16 → winter:** plannen en uitvoeringsruimte worden geconcentreerd in de aparte winterfase (B50).
- **20–29:** afweging vasthouden versus bijsturen; review 29, academie/contracten.
- **30–34:** sterke voetbalspanning; lichte dagelijkse rapportage, minder nieuwe langetermijnprojecten met onhaalbare deadline.
- **Zomer:** personeel en structurele keuzes evalueren, successen herinterpreteren; vooral verschillen tussen eigen beleid en uitvoering zichtbaar maken.

---

## 10. Tien opeenvolgende speelweken — één fictieve carrière
**[ONTWERP] Dit is een hypothetisch demonstratiescript, géén seed-run of bestaande matchuitkomst.** Alle namen, bedragen, uitslagen en causaliteit hieronder zijn fictief; een echte implementatie moet die via state en simulatie genereren.

**Club:** Fenmere Athletic, kleine fictieve club, financieel voorzichtig, boarddoel middenmoot.  
**CEO:** speler. **DoF:** Maeve Carter — geduldig, jeugdgericht, hecht aan scoutingbewijs. **Coach:** Tom Hargreaves — ervaringsgericht en pragmatisch. **Finance:** Idris Shaw — risicomijdend. **Academy:** Ruth Bell — wil minuten voor talenten. **Te volgen jeugdspeler:** Lucas Pryce, 18, middenvelder.  
**Seizoensvraag:** wint de club op korte termijn wedstrijden zonder de jeugdstrategie op te geven?

| Week | Clubsituatie / stafhandelingen | Vrijwillig initiatief speler | Verplichte / wezenlijke keuze | Wedstrijd & gevolg | Waarom door? |
|---|---|---|---|---|---|
| **1** | DoF deelt zomerplan: tekort aan ervaren verdedigers; coach vertrouwt kern | CEO leest eerste rapport en bezoekt coach | **Geen besluit verplicht**; aanstellingen en mandaten liggen al vast | 1–1; degelijke maar vlakke start | Hoe doet deze ploeg het als het echt tegenzit? |
| **2** | Academy: Pryce valt op; coach vindt hem nog licht | CEO vraagt academy waarom zij in hem gelooft | Geen. Academy levert een ontwikkeladvies, coach kiest opstelling | 2–0 winst zonder Pryce | Is het talent echt goed of jeugdoptimisme? |
| **3** | Coach beklaagt te smalle defensie; DoF wil eerst bevestiging van scouts | CEO vraagt DoF een alternatief voor de winter, met lage loonlast | **Geen verplichte beslissing**; DoF krijgt een onderzoeksvraag [ontwerp] | 0–1 verlies tegen sterke tegenstander | Komt er bewijs voor aankoop of voor geduld? |
| **4** | Scouts vinden twee kandidaten; één is onzeker, één duur | CEO vraagt second opinion aan Finance | **Echte afweging:** onderzoekt de DoF eerst de goedkope onzekere optie of houdt club geld beschikbaar? Alleen als er daadwerkelijk tijd/kostenconflict is | 0–0 | Wie had gelijk over het geld? |
| **5** | Coach meldt vormdip; Pryce traint beter; fans blijven kalm | Speler kiest **niet in te grijpen** | Geen; eerdere onderzoek loopt door | 0–2, tweede nederlaag in drie | Wanneer wordt geduld onverantwoord? |
| **6** | DoF brengt rapport: onzekere verdediger is beter gescout maar kan looncap breken | Speler vraagt DoF: is een jeugdoptie voldoende? | CEO laat looncap staan, DoF moet alternatief vinden [ontwerp] | 1–2; verdediging onder druk | Coach/DoF-visies gaan botsen |
| **7** | Derde slechte prestatie; Hargreaves wil ervaring, Carter verdedigt opvolgingsplan | Speler initieert een **gezamenlijk gesprek** | Keuze: tijd geven met beoordelingsdatum, of korte-termijn investeringsmandaat; geen automatische ontslagkeuze | 1–1; Pryce maakt debuut door coachkeuze | Krijgt jeugdplan een eerlijke kans? |
| **8** | **Rustige week:** scout controleert contractstatus; geen nieuwe boardzaak | CEO kijkt vrijwillig naar Pryce en het scoutbet | **Geen.** Personeel voert uit | 2–1 winst; Pryce op bank | Is dit een incident of keerpunt? |
| **9** | Een lokale sponsor biedt extra geld, maar wil een ongewenste tegenprestatie; Finance ziet ruimte, Commercial ziet merkrisico | Speler vraagt Commercial en Finance afzonderlijk naar hun advies | Eén **strategische dilemma**: geld voor winterscouting versus DNA-/fanrisico; afwijzen is verdedigbaar | 1–0 winst | Wat kost vasthouden aan identiteit? |
| **10** | Board review: middenmoot, 3 recente ongeslagen; DoF heeft winter-shortlist, coach ziet voorzichtig verbetering | Speler vraagt Carter wat ze geleerd heeft sinds week 3 | Bestuur: bevestig jeugd-/financiële koers of maak budgetruimte voor directe versterking | 1–1; bestuur accepteert plan onder voorwaarden [hypothetisch] | Winterwindow test het echte leiderschap |

### De causale boog

- **Vóór week 3:** CEO weet weinig; is niet verplicht iedereen te ‘grinden’.
- **Week 3 → 6:** een **vrijwillige vraag** wordt een DoF-opdracht met bewijs.
- **Week 7:** dat bewijs wordt een personeelsconflict; de CEO kan ingrijpen.
- **Week 8:** niet-ingrijpen is een betekenisvolle, niet-bestraffende keuze.
- **Week 9:** een kansenweek brengt club-DNA en middelen in conflict.
- **Week 10:** board review gaat terug op de sinds week 3 opgebouwde geschiedenis.

**Wat de echte game niet zomaar kan tonen:** de gezamenlijke, onderwerpgebonden CEO-overleggen, formele kleine onderzoeksopdracht met toetsmoment en bijbehorend board-reviewverhaal vereisen eerst extra causale state/UI. Het zijn geen huidige features.

### Waarom seizoen 3 anders moet zijn

- Bekende mensen hebben een **track record**, beloften en onderlinge geschiedenis.
- Jeugdspelers uit jaar 1 zijn basisspeler, reserve, uitgeleend of vertrokken; sommige ideeën bleken verkeerd.
- Financiële keuzes hebben faciliteiten en contractruimte veranderd.
- Het bestuur verhoogt de norm; successen hebben nieuwe risico's.
- De CEO begint minder vanuit ‘wie zijn deze mensen?’ en meer vanuit ‘welke mensen passen bij onze inmiddels bewezen of mislukte koers?’
- In hogere divisies zijn middelen groter, maar transfer-/pers-/supportersdruk groeit.
- De game mag **niet** alleen sterkere cijfers en dezelfde crisis-opties herhalen.

---

## 11. Long-Term Loop: waarom tientallen seizoenen interessant kunnen zijn

### Vier terugkerende persoonlijke verhalen

1. **De head die jij benoemde:** talent → succes → grotere ambities → conflict of loyaliteit → vervanging of clubicoon.
2. **De speler die je volgde:** jonge belofte → doorbraak → keuze voor minuten → contract/sale → mogelijk tegenstander.
3. **De clubidentiteit die je verdedigde of veranderde:** lokale wortels versus commerciële groei; academie versus onmiddellijke punten.
4. **De eigen theorie van de CEO:** ‘wij kunnen via statistiek/jeugd/coachcontinuïteit groeien’ → reeks tests → bewijs/tegenbewijs.

**[BESTAAT deels]:** historie, seizoensreviews, player milestones en scoutingbets. **[ONTWERP]:** een compacte **besluit-/afspraak-tijdlijn met causal links** zodat deze verhalen ook na meerdere seizoenen herkenbaar blijven.

### Geen onbeperkt stapelbare buffs

- Een clubexperiment mag alleen op basis van een bestaande middelen-/tijdsafweging werken.
- Meer praten geeft geen gratis permanente performance.
- Een stafvervanging heeft salaris-/transitiekosten en risico op verlies van continuïteit.
- Een succesvolle jeugdstrategie heeft tijd en kans dat talent vertrekt.
- Toenemende divisies mogen nieuwe vraagstukken introduceren, maar niet elke week extra schermen.

---

## 12. Homescreen UX — afgeleid van de gameplay, niet andersom

### Altijd vindbaar

- Weeknummer/clubstatus.
- **Eén relevant hoofdthema** of 'all quiet'.
- **Your team at work** (feitelijke verschillen, niet generieke herhalingen).
- **Your red box** met harde/soft deadlines, eerlijke defaults.
- **Next match**.
- Optioneel verdieping naar hoofdafdelingen/club/league/nieuws.
- **Still running** alleen bij relevante, echte afspraken of toetsing; B56 heeft dit al opgeleverd.

### Extra verbetering die nog niet volledig bestaat

**[ONTWERP] Een optionele speler-ingang: ‘Meet your team’ / ‘Take initiative’.** Geen nieuw hoofdtabblad en geen lijst met willekeurige acties. Tik opent bestaande Depts of een kort onderwerpkeuzescherm dat start vanuit **deze clubsituatie**: ‘Ask Carter about defensive depth’ en ‘Ask Hargreaves about Pryce’s minutes’ in plaats van generiek 'Talk'.

**Indien er geen relevante vraag is:** toon een normale afdelingsroute en geen schijnkeuze.

### Vijf tekstwireframes (390 px)

**A. Normale week**
~~~text
FENMERE ATHLETIC                        W10
ON TARGET · 12th · £68k
THIS WEEK: Still in the mix
The DoF's defensive review is due soon.

YOUR TEAM AT WORK
Carter · 2 scouts returned with reports.
Bell · Pryce has improved in training.

STILL RUNNING
Defensive depth plan · Review week 10
[Ask Carter about progress]    (optional)

THE RED BOX
Nothing needs your signature.

NEXT MATCH
Fenmere v Alderby United
[Match preview]
~~~

**B. Rustige week**
~~~text
WEEK 8 · FENMERE
All quiet. Staff work within their mandates.

YOUR TEAM AT WORK
Shaw: wage commitments remain on plan.

THE RED BOX
Nothing to sign.

You can explore your departments at any time.
[Departments]

NEXT: away to Oakford
[Preview]
~~~

**C. Bestuurlijke crisis**
~~~text
WEEK 14 · BOARD REQUEST
Four matches without a win.

ONE ISSUE · Three views
Coach: "We need experience."
DoF: "Our plan needs time."
Finance: "Funding is tight."

[Hear them together]
[Review the board's options]
Sunday: board expects a response; see default.

NEXT: Fenmere v Westbridge
[Preview]
~~~

**D. Belangrijke voetbalweek**
~~~text
WEEK 32 · A PROMOTION TEST
A win could move us into the top three.

YOUR TEAM
Hargreaves kept faith with Pryce.
Bell says the academy plan is on track.

THE RED BOX
No new CEO decision.

NEXT MATCH · Rival
Fenmere v Hillborough
[Open preview]
~~~

**E. Transferweek**
~~~text
WINTER WINDOW — BOARDROOM
Carter's plan: defensive cover under 24.
Coach: "I need someone ready now."
Shaw: "Only one signing fits the limit."

THE DECISION
[Review winter brief]
(or wait; DoF retains existing authority)

IN MOTION
Two targets under observation.
[Recruitment]

[Continue window]
~~~

Deze wires zijn **slechts ontwerpen**. De echte UI-B55/B56 heeft veel van de informatiestructuur al, dus een nieuwe dashboard-herbouw is niet gerechtvaardigd.

---

## 13. Drie experts: onafhankelijke verdicts en confrontatie

### A — Principal Game Designer

**Topprioriteit:** vrijwillige, contextspecifieke spelersinitiatieven met later bewijs. Niet elke week een verplichte choice. Doorlopende hypothesen maken onzekerheid betekenisvol.

**Kritiek op de hybride:** het kan een oppervlakkige combinatie worden van Talk, budgetslider en newspaper indien afspraken geen eigen toekomst hebben. **Eis:** elke nieuwe initiatiefactie moet een toetsmoment en echte tegenkracht hebben; anders schrappen.

### B — Football Club CEO / Sporting Director

**Topprioriteit:** coach en DoF zijn personen die voorstellen doen en elkaar soms terecht tegenspreken. De CEO beslist op **niveau van koers, aanstelling, mandaat en verantwoordelijkheid**, niet over individuele spelers.

**Kritiek op de hybride:** een speler die voortdurend een agenda kan opleggen wordt alsnog een schaduwtechnisch directeur. **Eis:** de head kan wijzen op ontbrekend bewijs, een alternatief bieden en binnen eigen bevoegdheid uitvoeren. De CEO mag niet via een achterdeur opstellingen of transfers bepalen.

### C — Senior Gameplay UX Designer

**Topprioriteit:** begrijpelijke signalen, één hoofdlijn en vrijwillige verdieping zonder scrollen door acht subsystemen.

**Kritiek op de hybride:** drie volledig toegankelijke initiatiefschermen worden al snel een menuramp. **Eis:** begin met één inhoudelijke gesprekstoegang op bestaande afdelingsschermen en een zichtbare afspraakstatus; geen nieuwe navigatiestructuur.

### Confrontatie — concrete keuze

**Game Designer:** "Als de CEO alleen af en toe een briefing bekijkt, is de speler passief."  
**Football CEO:** "Als hij elke week het transferplan invult, speelt hij DoF, niet CEO."  
**UX Designer:** "Maak de keuze niet breder met menu's; maak dezelfde informatie relationeel en contextueel."

**Gezamenlijk besluit als aanbeveling:** **de CEO mag een probleem of ambitie op tafel leggen, maar de medewerker formuleert en voert het plan uit**. Dit creëert agency zonder operationele controle.

### Twaalf kritische ontwerpantwoorden

1. **Belangrijkste beslissing:** de juiste persoon een mandaat én beoordelingscriterium geven, en later verstandig handelen op het bewijs.
2. **Anders dan een instelling:** er is een mens met een ander oordeel, een tijdshorizon, risico's en feedback.
3. **Voldoende invloed nu?** Redelijk bij escalaties/windows, onvoldoende bij vrijwillige agenda en bespreking.
4. **Wat wordt na 10× saai?** Back/Push/Review zonder context, herhaald 'nothing to report', vaste crisisdilemma's.
5. **Welke dialogen herhalen?** Generieke begroetingen, trust-effecten, ‘more from you’ zonder expliciete prestatie.
6. **Als medewerkers goed zijn?** Minder problemen, maar meer kansen, ambitie, concurrentiedruk, experimenten en clubgroei; geen verplichte kunstmatige crisis.
7. **Als medewerkers slecht zijn?** Begrijpbare fouten, herstelopties, geld-/reputatieprijs; niet meteen onomkeerbaar lot.
8. **Meerdere strategieën?** Ja als aanpakken echte kosten/timing en onzekerheid hebben; niet als één scoutpreset altijd optimaal wordt.
9. **Twee verschillende carrières?** Alleen als personeel, club-DNA, datawereld, middelen en gevolgkeuzes echt doorwerken.
10. **Waarom afdelingen vrijwillig openen?** Verantwoording/onderzoek, echte kansen, voortgang op zelfgemaakte afspraak.
11. **Waarom voetbal?** Wekelijkse resultaten en de selectie/wedstrijden testen strategische ideeën onder onzekere omstandigheden.
12. **Zonder rijke UI nog leuk?** Ja als beslissing, reactie en later gevolg op drie tekstregels interessant blijven. Anders ligt het probleem in het game-design, niet in de styling.

---

## 14. Vijf manieren waarop dit alsnog saai kan worden — en fixes

1. **Pseudo-agency:** CEO-initiatief verandert alleen tekst of relatiepunten.  
   **Fix:** ieder initiatief krijgt een echte actie-eigenaar, alternatief en toestand die later wordt geëvalueerd.

2. **Overvolle besturingsagenda:** speler kan oneindig veel initiatieven stapelen.  
   **Fix:** beperk door echte stafcapaciteit, geld en afhankelijkheden, niet door AP/gespreksquota; laat head eerlijk zeggen wat niet tegelijk kan.

3. **Gespreksspam:** iedere week coach bellen voor meer vertrouwen.  
   **Fix:** zonder nieuwe informatie of geloofwaardige aanleiding geen extra buffs; gesprekken over plannen en gegevens.

4. **Schijncausaliteit:** Gazette claimt jeugdplan veroorzaakte een overwinning die matchengine niet zo modelleert.  
   **Fix:** onderscheid gebeurtenis, samenhang en causale impact; gebruik alleen in state gegronde effecten.

5. **Dominante strategie:** youth-first/low wages/one preset winnen altijd.  
   **Fix:** over seizoenen scenario's meten met teams en rivalen van verschillende sterkte; make tradeoffs bindend.

6. **Te veel autonomie:** beste strategie wordt nooit iets doen.  
   **Fix:** heads voeren uit maar leveren niet automatisch optimale richting; CEO kan informatie benutten en kansen starten.

7. **Te veel CEO-controle:** speler kan personeelswerk alsnog omzeilen.  
   **Fix:** iedere initiatiefroute laat head een plan formuleren en eigen afwegingen maken; geen individuele transferhandtekening of line-up.

8. **Geen herkenbaar verleden:** seizoen 5 voelt gelijk aan seizoen 1.  
   **Fix:** compact persistente agreement/owner/evaluation history; Gazette en reviews tonen de echte boog.

---

## 15. Behouden / herontwerpen / toevoegen

### BEHOUDEN — verifieer dit tegen actuele branch
- B55/B56 bureau-structuur, echte staff voice en Still running.
- Red box met bevoegdheden en per zaak zichtbare default.
- Persoonlijkheid, mandaten, autonomie en Record.
- Bestaande moneyball-scouting, flags/targets/bets als **optionele** diepte.
- Voorbeschouwing → wedstrijd → Gazette; geen CEO-tactische controle.
- Aparte zomer- en winterwindows.
- Weekblokken, board review en echt ontslagrisico.
- Mobiel retro/text-first karakter.

### HERONTWERPEN
- Vrijwillige Talk → **onderwerpgebonden vragen** die aansluiten bij clubstate.
- Opstart van experimenten: van mandaat-slider of antwoordoptie naar **voorstel aan head** plus toetsing, niet random events.
- Weekly agenda: nieuwe spelerkeuzes herkenbaar onderbrengen zonder meer red-boxruis.
- Dept Record: van losse logregels naar beknopt **we agreed / what happened / next review**.
- Commercieel/marketing operationele acties → **beleid waar passend**, maar pas na review van BIBLE-besluiten; niet blind weghalen.
- Season review: terugkomen op maximaal twee bepalende eigen koersbesluiten.

### TOEVOEGEN (alleen waar huidige state tekortschiet)
1. **CEO-initiated topic-specific discussion**: uit bestaande observable signals naar een echte hoofdgesprekroute.
2. **Small agreement / initiative lifecycle**: proposition → head view → agreed/refused → execution → review; dezelfde state voor staffgesprekken, dossier en Gazette.
3. **Opt-in strategic experiments**: maximaal enkele typen met echt resource-conflict, niet honderden events.
4. **Cause-aware feedback**: head legt uit welke afspraak werd getest en wat onbekend blijft.
5. **Season memory of executive decisions**: compacte archivering zonder grote database.

---

## 16. De top tien echte ontwerpwijzigingen

**Impact 1–5** op dagelijkse gameplay; **inspanning L/M/H** is een indicatie.

| Prio | Wijziging | Nieuw spelersgedrag | Wat bestaat al? | Kleinste complete verbetering | Impact | Kosten |
|---|---|---|---|---|---:|---|
| **1** | Contextuele eigen gesprekken | CEO start vanuit echte situatie een vraag | Talk, dossier, head state | 2–3 onderwerpen met echt antwoord en consequentie | 5 | M |
| **2** | Afspraak met eigenaar, toetsmoment | CEO volgt een eigen keuze over meerdere weken | Deals/turnaround/pathway | Eén generiek zichtbaar agreement-verloop voor gekozen casus | 5 | M |
| **3** | Eerlijke uitvoering + impact | Head kan afwijken, leveren of uitleggen waarom niet | Desk, briefs, Records | Feedback op bovenstaande afspraak, op basis van echte state | 5 | M/H |
| **4** | Voluntary opportunity / strategy proposal | CEO begint een zinvol initiatief | Moneyball, marketing, budgets | Eén experiment in geselecteerde afdeling, met middelen | 5 | M/H |
| **5** | CEO-agenda bij bestaande B55-bureau | Speler ontdekt zonder inboxmelding wat hij kan doen | Team at work, red box | Inhoudelijke ‘Discuss’ ingang naar concrete casus | 5 | L/M |
| **6** | Managerconfrontatie als één dossier | Afdelingen geven verschillende adviezen | B56 turn-call | Hergebruik voor een niet-crisisgeval met echte consequenties | 4 | M |
| **7** | Review met geheugen | Speler beoordeelt eerder besluit ipv alleen resultaat | Board goals, history | 2 bestaande afspraken in blok-/seasonreview | 4 | M |
| **8** | School/academy-player story continuity | Volg talent zonder XI te kiezen | Milestones, academy | Eén bestaande spelersboog terughalen in relevante rapporten | 4 | M |
| **9** | Football-to-executive feedback | Matchen worden test van beleid | Preview, Gazette, coach | Eén onderbouwde link naar recent beleid per relevante match | 4 | M |
| **10** | Clubrol-consistentie | CEO beslist niet elk ticket-/campagnedetail | Commercial/marketing UI | Audit en herplaats operationele knoppen achter headbeleid | 3 | M |

**Niet in eerste drie sprints:** volledige persistent rival squads, generatieve dialogen, heel nieuwe wedstrijdengine, extra grote dashboards of nieuwe currencies. Die kunnen later relevant zijn, maar ze lossen het **initiatiefprobleem** niet eerst op.

---

## 17. Drie aanbevolen sprints (afgeronde verticale slices)

### Sprint CEO-1 — **I Can Start a Conversation That Matters** (eerste prioriteit)

**Spelersprobleem:** de CEO kan altijd praten, maar bepaalt nog te weinig een echt onderwerp met later bewijs.

**Doel:** vanuit **bestaande staat** een hoofd uitnodigen voor een relevant overleg; minstens één gesprek resulteert in een plan/afspraak die later controleerbaar terugkomt.

**Scope:**
- Twee concrete onderwerpen: **coach / teamontwikkeling** en **DoF / squadplan**, alleen als er werkelijk relevante feiten zijn.
- In bestaande afdeling of via bureau-link één contextuele [Discuss] knop.
- Head presenteert standpunt, eventuele onzekerheid en alternatief; CEO kan steunen, om meer bewijs vragen, koers bijstellen of laten lopen (afhankelijk van het onderwerp).
- Een afspraak krijgt eigenaar + toetsmoment en echte vervolgstate; omgekeerde head-keuze mogelijk.
- Status keert terug in Staff Record en op het bureau onder Still running indien relevant.
- Geen verplichte extra dialoog elke week.

**Niet:** extra hoofdtabs, nieuwe random events, self-negotiation, nieuwe stat-bars, volledig nieuwe conversation engine.

**Acceptatie (functioneel):**
1. CEO start gesprek zonder binnenkomend bericht.
2. Gesprek is gekoppeld aan aantoonbare actuele aanleiding.
3. Minstens twee verschillende head-opinies/uitkomsten worden ondersteund.
4. Keuze slaat een afspraak op met eigenaar en reviewweek.
5. Na drie weken/meer komt op basis van gespeelde state eerlijk terug wat is gebeurd.
6. Nicht-handelen blijft mogelijk zonder default penalty.
7. Hetzelfde herhaalgesprek zonder nieuw bewijs geeft geen gratis buff.
8. Geen tegenstrijdige claims tussen bureau, afdeling en Gazette.
9. Eén eenvoudige mobiele flow op 390 px, 44px targets, licht/donker.
10. Save/load, version/migratie en bestaande tests blijven goed.

**Testset:** deterministische scenariofixtures (normaal, rust, vormcrisis, overeenstemming en tegenspraak), Unit test agreement-lifecycle, Node-regressies, build, browserplaytest op 390 px. **Geen validatieclaim zonder uitvoering.**

### Sprint CEO-2 — **My Initiatives, Their Plans**

**Spelersprobleem:** vrijwillig strategisch ondernemerschap is nog versnipperd of gelijk aan sliders.

**Doel:** CEO ziet een probleem of kans, initieert **één volledig uitgewerkte experimentsoort** bij een head en krijgt plan + resource tradeoff + evaluatie.

**Aanbevolen eerste experiment:** coach/DoF gezamenlijk een **jeugd-doorstroming versus korte-termijnresultaat**-plan laten voorstellen. De CEO vraagt om een route en succescriterium; coach kiest selectie, DoF bepaalt middelen, academie ontwikkelt.  
**Alternatief bij minder state-wijziging:** commerciële fan-/stadionstrategie als head-initiatief met bestaande prijzen/budgetten.

**Scope:** propose → heads react → CEO agrees/declines → autonomous execution → review. Niet drie halfgekoppelde experimenten.

**Acceptatie:** er is minstens één betekenisvolle alternatieve aanpak, echte capaciteit/kosten, mogelijkheid tot weloverwogen nietsdoen, feedback na verloop, geen dubbele agenda en geen indirecte line-up controle.

### Sprint CEO-3 — **A Club With Memory**

**Spelersprobleem:** goede beslissingen leveren nieuws, maar nog niet altijd een herkenbaar clubverhaal.

**Doel:** briefings, belangrijke wedstrijden, de Gazette en seizoenreviews kunnen één echte staffafspraak over langere tijd herkennen.

**Scope:** twee soorten cross-week-verhalen; betrokken medewerker en doel; verwijzing naar matchuitkomst als bewijs (geen schijncausaliteit); seizoenreview met één leermoment; archief toegankelijk zonder alle oude berichten te herhalen.

**Acceptatie:** bij echte save/reload in week 1, 10 en na eerste season review kan de speler de gekozen afspraak herkennen; geen feiteloze recap; geen extra verplichte content per match.

---

## 18. Hoe beoordelen we of het écht leuker werd?

**Kwalitatieve playtest — vier gedragstypen:**
- **De delegator:** leest briefing en speelt door; voelt hij nog agency?
- **De relationele CEO:** praat veel, wil medewerkers leren kennen; krijgt hij zinvolle verschillende reacties zonder farming?
- **De strateeg:** zoekt vrijwillig in scouting/club/beleid; kan hij een eigen hypothese testen?
- **De crisismanager:** grijpt in wanneer resultaten tegenvallen; zijn opties substantieel verschillend?

**Meetbare observaties zonder gefingeerde benchmarks:**
- In hoeveel weken **koos** de speler vrijwillig een onderwerp, en waarom?
- Kan de speler na tien weken twee eerdere afspraken benoemen?
- Wist hij welke beslissing bij hem hoorde en waarom?
- Was een rustige week saai of juist een passend tempo?
- Vonden spelers een echte reden om Coach/DoF te bezoeken?
- Werd één strategisch resultaat verkeerd toegeschreven aan de CEO?
- Kon een voorzichtige én een ondernemende speelstijl beide voortgang ervaren?
- Werden dezelfde gespreksopties betekenisloos herhaald?
- Hadden spelers na één seizoen een herkenbare verwachting voor de volgende?
- Was de flow op 390px prettig zonder scroll-overload?

**Pas na deze meting** kunnen we tempo, frequentie en eventuele quota vaststellen. Geen fictieve ‘spelerretentie +X%’-claims.

---

## 19. Drie verplichte eindantwoorden

**1. Wat maakt maandag interessant?**  
Niet dat er e-mail ligt, maar dat de club is veranderd: een uitslag, iemand die iets ondernam, een eerder beloofd plan dat dichter bij toetsing komt en een volgende sportieve test. De briefing kan daardoor zinvol zijn zonder verplicht besluit.

**2. Wat doet de CEO zonder verplichtingen?**  
Hij mag een **onderbouwde eigen vraag stellen**, iemand om een beter plan vragen, een clubkans onderzoeken, een hoofd het voordeel van de twijfel geven of zichzelf verdiepen in scouting en jeugd. Hij stelt richting en voorwaarden; de medewerkers hebben echte autonomie. Dat zijn interessantere activiteiten dan ‘vertrouwen +3’ farmen.

**3. Waarom voelt seizoen 10 als mijn verhaal?**  
Omdat de speler weet welke medewerkers hij benoemde, welke visie hij verdedigde, welke gok hij waagde, wanneer hij ongelijk had, welke jeugdspelers hij zag opgroeien, hoe een crisis werd opgelost en waarom de club er nu zo uitziet. Dat geheugen moet feitelijk terug te vinden zijn, niet door de Gazette worden verzonnen.

**Definitieve richting:** bouw **geen tweede postvak en geen nieuw dashboard**. Bouw eerst **één optioneel, contextueel, causaal echt CEO-overleg** met herkenbaar vervolg. Dat is de kleinste ingreep die de aard van de week substantieel verandert.

---

## 20. Bronstatus, beperkingen en beslispunten

### GitHub-verwijzingen
- BIBLE.md: P1–P9, B1/B2/B3, B19/B21/B22/B23, B31/B32, B38–B47, B50, B53–B56. **De nieuwste besluiten gaan vóór eerdere tegenstrijdige versies.**
- CODEMAP.md, OVERZICHT.md en CLAUDE.md.
- docs/audits/2026-11-17-ux-first-game-design-audit.md
- docs/audits/2026-11-17-dual-expert-codebase-audit-v2.md
- src/ui/10-inbox.js:110–168, src/teamwork.js:85–117, src/talks.js:96–178, src/weekflow.js:13–45, src/ui/08a-dept-parts.js:98–146, src/ui/14-matchday-gazette.js.
- notes/ux1-desk.md, notes/team-at-work.md en notes/PROMPT-team-at-work.md zijn recente, nuttige werknotities. **Niet alles daarin is nog open; de code gaat voor.**

### Extern — rolverdeling en agency
- Football Supporters' Association, board roles/responsibilities: https://thefsa.org.uk/fan-resources/resource-training/community-owned-clubs/board-best-practice/roles-and-responsibilities/
- Brighton & Hove Albion, committees and roles (clubvoorbeelden van CEO/board): https://www.brightonandhovealbion.com/committees_and_roles
- Premier League, sporting directors: https://www.premierleague.com/en/news/3991780
- Bundesliga, sporting director versus coach: https://www.bundesliga.com/en/bundesliga/news/what-is-a-sporting-director-bayern-munich-borussia-dortmund-rb-leipzig-schalke-3321-2323/
- UEFA competition regulations, head coach verantwoordelijk voor selectie/tactiek: https://documents.uefa.com/r/Regulations-of-the-UEFA-Champions-League-2026/27/Article-6-Duties-of-the-clubs-Online
- Warwick, Serious Games Cookbook, player agency/feedback/meaningful choice: https://wrap.warwick.ac.uk/id/eprint/185802/1/WRAP-Serious-Games-Cookbook-beginner%27s-guide-using-designing-serious-games-2024.pdf

### Open ontwerpkeuzes — niet bindend gemaakt
1. **CEO-initiatief:** mogen spelers op eigen initiatief een onderwerpgebonden opdracht starten die een head mag afwijzen? **Aanbevolen: ja, met echte aanleiding en gevolgen.**
2. **Strategische experimenten:** kiezen we aanvankelijk één cross-department jeugd/squad-experiment of een commerciële casus? **Aanbevolen: jeugd/squad als voetbal-first eerste slice; kosten hoger.**
3. **Oprichter-CEO versus CEO:** hoeveel formele strategische vrijheid heeft de speler tegenover het bestuur? **Aanbevolen: consistente executive-role met boardtoezicht.**
4. **Operationele knoppen Commercial/Marketing:** moeten die aan headbeleid worden gekoppeld? **Aanbevolen eerst observeren en testen, daarna per geval beslissen.**
5. **Hoeveel open initiatieven tegelijk?** **Geen fictieve AP/quota.** Kies echte resource-/stafcapaciteit en voorkom tegenstrijdige opdrachten.
6. **Technisch risico uit eerdere audit:** autonoom besluit en werkelijk eventeffect waren eerder niet overal causaal congruent. Controleer in implementatie tests; huidige documentontwerp mag die correctheid niet veronderstellen.

### Afleveringsstatus
**Dit bestand is een onderzoeks- en ontwerpartifact.** Er is in deze opdracht geen gamecode gebouwd, geen build gedraaid en geen playtest uitgevoerd. De voorbeelden en scores zijn expliciet als hypotheses of voorstellen benoemd. Pas na goedkeuring van de eigenaar worden nieuwe ontwerpregels in het bindende BIBLE-besluitenlog gezet.
