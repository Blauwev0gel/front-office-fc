# NORTHMARCH — MASTER GAME DESIGN BIBLE
**Versie 1.3 — 25 november 2026** · herziening van V1.2 (`b69ea16`); open vragen V1–V6 beslist door de game director (MB-11–MB-16)

## 0. Hoe je dit document leest
Dit is het enige actieve ontwerpdocument van Northmarch. Het beschrijft het **beoogde spel**, niet per se de huidige build; de broncode en tests zijn de waarheid over wat er nu werkt.

| Deel | Inhoud | Verandert |
|---|---|---|
| I — Het spel (§1–9) | Wat Northmarch is en niet is, rollen, plezier, ritme, systemen, UX, balans | Zelden; alleen via een besluit |
| II — Besluiten (§10–11) | Het enige bindende register en de open vragen | Bij elk besluit |
| III — Werkwijze (§12–14) | Beslisrechten, werkcyclus, kwaliteitstoets, tests, kosten | Zelden |
| IV — Roadmap en status (§15–16) | Fasen, exit gates, actuele status, bekende problemen | Elke sessie |

**Statuslabels:** ✅ besluit van de game director (bindend) · 🔷 gedelegeerd besluit van een developer (bindend tot herzien; nooit presenteren als eigenaarbesluit) · ❓ open, alleen de eigenaar beslist · ~~doorgehaald~~ vervangen.
**Voorrang:** een recenter ✅-besluit gaat altijd voor; daarna 🔷; daarna de lopende tekst. Tekst die botst met het register is een fout in de tekst.

---

# DEEL I — HET SPEL

## 1. Pitch en succesfantasie
**Northmarch is een football club chairman & dynasty game.** Je bent de gekozen voorzitter van een ledenclub in een fictieve voetbalwereld die zonder jou doordraait. Je ontdekt talent, investeert, geeft richting en bouwt een netwerk; je mensen runnen de dagelijkse operatie en jij draagt de gevolgen. Elk seizoen moet je de leden opnieuw overtuigen. Op lange termijn bouw je een nalatenschap over clubs en generaties.

De speler moet denken: **"Dit is mijn club, ik heb dit mogelijk gemaakt, en ik wil weten wat er hierna gebeurt."**

**Hiërarchie (MB-01 ✅):** *Club Builder* is de dagelijkse gameplay, *Chairman* is de rol en de manier van spelen, *Dynasty* is de langetermijnbeloning. Het zijn geen aparte modi. L1/L2 moeten zonder L3–L5 een compleet en leuk spel zijn. **Spelers zijn de emotionele motor** (D-G4 ✅).

## 2. Ervaringsdoelen en ontwerpregels
Elke feature versterkt minstens één ervaringsdoel en breekt er geen.

| # | Ervaringsdoel | Ontwerpregel die eruit volgt |
|---|---|---|
| E1 | **Mijn keuzes doen ertoe.** | Een keuze heeft een verdedigbaar alternatief, een prijs en een terugvindbaar gevolg. Geen dominante gratis optie. |
| E2 | **Mijn club en de wereld leven, ook zonder mij.** | Rivalen, spelers en staf handelen zelf, met dezelfde regels als de speler. Niets verandert de wereld buiten de regels om. |
| E3 | **Ik kan verliezen; succes is verdiend.** | De ALV is de seizoensgebonden verliesconditie; een passieve voorzitter doet het aantoonbaar slechter, een actieve heeft geen garantie. |
| E4 | **Ik voel dat ik de voorzitter ben.** | Invloed loopt via richting, geld, mensen, netwerk en uitzonderingen; nooit via opstelling, tactiek of contractonderhandeling. |
| E5 | **Ik geef om mijn spelers.** (D-G4) | Een ontdekte of opgeleide speler blijft volgbaar: groei, prestaties, waarde en de verkoop aan het eind. |

## 3. Wat het spel IS NIET
- Geen manager-game: je maakt geen opstellingen, tactiek, trainingsschema's of contractonderhandelingen.
- Geen goedkeuringsspel (D-G1, D-L3-2 ✅): routinezaken handelt de staf af; geen stapels kaarten om af te tikken.
- Geen actiepunten of generiek weekquotum als schaarste; schaarste komt uit geld, tijd en gelegenheid (MB-03, MB-04 ✅).
- Geen passieve simulator, spreadsheet, willekeurige kaartjesmachine of losse stamboomsimulator.
- Geen lineaire upgradegrind waarin elke investering vanzelf de juiste is (MB-08 🔷).
- Geen gescripte crises los van de wereld, geen verborgen tweede markt of economie.
- Geen dagelijkse loginbeloning, kunstmatige stamina of real-time wachttijd.
- Geen echte spelers, clubs of merken; geen kopie van een bestaand spel.

## 4. Rollen en bevoegdheden
| Voorzitter (jij) | Technisch directeur (TD) | Trainer |
|---|---|---|
| Clubrichting en manifest, financiële kaders, investeringen, personeelsbeleid, netwerk, talent ontdekken en aanbevelen, uitzonderlijke transfers, leden | Selectieplanning, scouting, aan- en verkopen, contracten, voetbalbeleid binnen jouw kaders | Opstelling, tactiek, wedstrijdcoaching, sportieve voorbereiding |

- Je **ontdekt** spelers maar tekent ze niet. Een aanbeveling geeft extra gewicht op de shortlist van de TD; de TD mag haar naast zich neerleggen (D-S1 ✅).
- De TD doet elke transfer zelf, met **twee uitzonderingen** die bij jou komen: een bod op een van de drie beste spelers van de club en een aankoop boven het clubrecord (D-L3-2b ✅).
- Je bent **proactief én situationeel** (MB-03 ✅): je start zelf initiatieven (reizen, onderzoek, partnerclubs, relaties) en de wereld brengt kansen en problemen. Je bent nooit alleen van een inbox afhankelijk. Initiatieven kunnen mislukken of pas later renderen.

## 5. Waar het plezier vandaan komt
| Bron | Wat de speler voelt | Waar het in het spel zit |
|---|---|---|
| Ontdekking | "Ik zag hem eerder dan de rest." | Scouting met onzekerheid, netwerk, jeugdtoernooien |
| Groei | "Die jongen heb ik binnengehaald." | Spelersprofiel, academie, speelminuten, verhuur |
| Afweging | "Verkopen of houden? Nu of later?" | Geld, investeringen, uitzonderlijke transfers |
| Autonomie | "Ik koos de juiste mensen." | TD en staf die zelf handelen binnen kaders |
| Spanning | "Dit seizoen staat alles op het spel." | Wedstrijden, rivalen, deadline, ALV |
| Eigenaarschap | "Dit is míjn club geworden." | Identiteit, clubboek, geschiedenis, later familie |

**Clubidentiteit (MB-02 ✅).** Elke club begint met een bestaande identiteit uit historie, omgeving, supporters en voetbaltraditie; geen blanco canvas. Het jaarlijkse **manifest** is je intentie; identiteit verandert pas door herhaald gedrag over seizoenen (jeugdgebruik, werving, prijzen, lokale binding, investeringen, resultaten). Identiteit, ambitie en gerealiseerde ontwikkeling zijn drie gescheiden dingen. Gewichten worden met tests gekalibreerd.

## 6. Het ritme
**Ontdekken → richting geven → delegeren → beleven → evalueren → opnieuw ontdekken.**

| Schaal | Inhoud |
|---|---|
| Moment | Eén herkenbare kans, afweging of probleem. |
| Week | Kijk wat er speelt, handel als je wilt, speel de week, lees de Echo. |
| Seizoen | Zomer → competitie → winterwindow → run-in → ALV. |
| Carrière | Clubontwikkeling, reputatie, andere clubs, later opvolging en generaties. |

### De week
Elke week is een eigen stap met wedstrijdverslag; geen doorspoelen en geen versneld spelen dat weken overslaat (D4, MB-13 ✅). De week wordt sneller, niet korter. De week opent op de situatie van de club: volgende wedstrijd en inzet, eventueel een urgente zaak, je lopende initiatieven en recente gevolgen. Je kunt afdelingen bezoeken, investeren, scouten, talent volgen of beleid aanpassen. Daarna speel je de week en lees je in de Echo de uitslag (met oorzaak), het geld en het club- en wereldnieuws.

**Een rustige week is geldig, maar nooit leeg.** D4 eist dat elke week iets te lezen of te beslissen biedt en snel af te handelen is. Daarom toont elke week minstens één echt gevolg uit de wereld (uitslag met reden, ontwikkeling van een gevolgde speler, projectvoortgang, rivaal- of marktnieuws) en is doorgaan altijd één tik. Geen kunstmatige kaarten om de week te vullen en geen straf voor niets doen.

*Voorbeeld (illustratief):* week 8, Pell United staat zesde. De Echo meldt dat de 17-jarige spits die je in de zomer aanbeval zijn eerste basisplaats kreeg. Een jeugdtoernooi in het noorden is volgende week; de reis kost geld en bezet je voor die week. Je gaat, of je bewaart het geld voor de tribune. Je drukt op *Play week 8*.

### Het seizoen
Zomer: analyse, plan, speelbare markt, voorbereiding (§7.2). Competitie: volgen, ontwikkelen, kansen benutten. Winter: kortere speelbare markt op dezelfde engine. Run-in: sportieve en bestuurlijke spanning. **ALV:** beoordeling van beloftes, resultaten, financiën en ledenvertrouwen (D6, D-G5 ✅). Verlies betekent vertrek uit de club, niet het einde van je carrière (D7 ✅).

### De sessie
Een sessie begint op de clubhub en eindigt bij een natuurlijk resultaat: een wedstrijd, een transfer, een bouwmijlpaal of een ALV. Vrijwillige verdieping mag langer duren; de verplichte route per week blijft kort.

## 7. Systemen
Elk systeem heeft één eigenaar-module en één bron van waarheid. Wat hieronder staat is het doelmodel; wat al in code bestaat staat in §16.

### 7.1 Opening — de eerste zomer is de tutorial (MB-05 🔷)
Geen aparte tutorial waarin je alleen op Next drukt; afdelingen worden uitgelegd zodra ze ertoe doen. De eerste echte keuze valt vroeg.

| Moment | Speler ziet | Speler doet | Beloning |
|---|---|---|---|
| Clubkeuze | Drie open voorzittersstoelen: wapen, historie, middelen, uitdaging | Club kiezen, dossiers vergelijken | Een eigen startverhaal |
| Eerste dag | Drie herkenbare spelers, identiteit, belangrijkste sportieve en financiële opgave | Manifest en koers bepalen | Persoonlijke inzet voor het seizoen |
| TD-vergadering | Gaten in de selectie, mogelijke vertrekkers, budget, plan A/B | Prioriteit en kaders kiezen of het plan aanvaarden | Een begrijpelijk plan |
| Marktweken | Echte kandidaten, rivalen die handelen | Onderzoeken, aanbevelen, ruimte vrijmaken, afwachten | Een vondst of concreet resultaat |
| Deadline | Open deals, alternatieven | Een uitzonderlijk besluit als dat nodig is | Definitieve selectie en zomerkrant |
| Eerste wedstrijd | Nieuwe spelers, tegenstander, inzet | Beleven, gevolgen lezen | Eerste sportieve payoff |

Geen verplichte geheime schuld of crisis bij elke start; een bijzonderheid mag alleen uit de gegenereerde clubstaat komen. Identiteit en financiën zijn vóór de benoeming begrijpelijk genoeg om bewust te kiezen.

### 7.2 Transfermarkt (D-G6, MB-14 ✅)
De markt hoort bij **L2**: ze werkt volledig zonder hogere lagen. Alleen de persoonlijkheid en het mandaat van de TD zijn L3. De markt is een verhaal over weken, niet één klik: **TD-vergadering → zomerbrief → ticker met wekelijkse updates (ook rivalen) → deadline → zomerkrant → debrief.** De winter gebruikt dezelfde engine met een korter ritme.

- **Dealstatus (doelmodel):** `identified → shortlisted → enquiry → offer → negotiation → agreed → signed`, met eindstatussen `rejected / withdrawn / hijacked / expired`. Elke deal heeft club, speler, herkomst, behoefte, voorwaarden, geldigheid en statusreden.
- **Plan en brief:** het TD-plan bevat geprioriteerde behoeften en haalbare alternatieven. Je kunt prioriteiten, wervingsprofiel en financiële ruimte wijzigen; het plan past zich aan, de oorspronkelijke brief blijft bewaard voor de debrief.
- **Regels:** elke club volgt dezelfde budget- en loonregels. Een aanbeveling is invloed, geen garantie. Een mislukte transfer is mogelijk en heeft gevolgen. Een tekort mag blijven bestaan; alleen noodzakelijke veiligheidsregels grijpen in, transparant en voor alle clubs gelijk.
- **Na sluiting:** geen onzichtbare tweede markt die eerdere keuzes ongedaan maakt. Openstaande uitzonderingen blijven bewaard tot ze zijn beslist.

### 7.3 Talent, scouting en netwerk
- **Scouting (D-S1 ✅):** reizen, toernooien en dataonderzoek leveren spelers op, met kwaliteit en potentieel als **schatting** met onzekerheid. Een volglijst houdt ook spelers bij die niet tekenen.
- **Dossier en Moneyball:** het dossier volgt talent door de jaren; per speler zie je aankoop, groei, verkoop en sportieve bijdrage. Een verkoop is geen winst als de sportieve en financiële kosten de opbrengst overtreffen.
- **Persoonlijke tijd (MB-04, MB-12 ✅):** dit vervangt de regel "één activiteit per week" uit D-S1. Elke activiteit heeft haar eigen beperking; reizen sluiten elkaar uit. een reis heeft een bestemming, kosten en bezette tijd; een toernooi een datum; een partnerclub benader je pas opnieuw als er iets te bespreken is. Telefoneren, dossiers lezen en beleid wijzigen kosten niets. Herhaald klikken levert geen onbeperkte vondsten, vertrouwen of geld op. Geen agenda- of urenboekhouding.
- **Netwerk (MB-06 🔷):** contacten (voorzitters, scouts, oud-spelers, zakenrelaties) hebben een identiteit, rol, regio, bron van kennismaking en laatste betekenisvolle interactie. Ze geven **toegang** tot informatie en kansen (spelers, toernooien, oefenwedstrijden, partnerclubs, sponsors), nooit directe transfercontrole. Contacten kunnen verhuizen of stoppen. Geen relatiegrind en geen straf voor niet dagelijks onderhouden. L3/L4 voegen vertrouwen en wederkerigheid toe; L5 laat het netwerk generaties overleven.

### 7.4 Spelers
Elke speler heeft een stabiele identiteit, positie, leeftijd, herkomst, contract, clubhistorie, speelminuten, prestaties, waarde en ontwikkeling. Er is één canonieke profielpagina, ongeacht de ingang: waarom deze speler relevant is, wat we weten en wat er veranderd is. Legendes ontstaan uit echte prestaties en dienstjaren. Je geeft geen trainingsopdrachten, basisplaatsen of speelminutengaranties.

### 7.5 Clubmanagement en investeringen
Elke afdeling is een herkenbaar deel van de club met eigen informatie, acties, investeringen en gevolgen. **De upgrades van een afdeling zitten in haar eigen tile**; geen apart upgradescherm.

| Domein | Voorzittersvraag | Gevolg |
|---|---|---|
| Geld | Wat kunnen we ons veroorloven? | Kas, schuld, loonruimte, risico |
| Voetbal/werving | Waar moet de selectie heen? | Kwaliteit, leeftijd, kosten, verkoopwaarde |
| Training | Hoe ontwikkelen we spelers? | Groei, sportieve kwaliteit |
| Academie | Hoe bouwen we een eigen pijplijn? | Instroom, doorbraak, verkoop, identiteit |
| Medisch | Hoe houden we de selectie fit? | Blessures, herstel |
| Stadion/terreinen | Welke capaciteit en voorzieningen? | Inkomsten, onderhoud, thuisvoordeel |
| Commercie/wedstrijddag | Hoe groeien inkomsten duurzaam? | Sponsors, recettes, kosten |
| Leden | Waarom steunen mensen ons? | Vertrouwen, verwachtingen, herverkiezing |

Dit is een functionele indeling; de code bepaalt de exacte afdelingen (nu acht, T7).

**Investeringen (MB-08 🔷)** concurreren om dezelfde middelen. Een investeringskaart toont huidige toestand, kosten nu en per week, oplevering, effect, onderhoud en risico. Geen project zonder betaalbaarheidstoets. Een faciliteit levert een waarneembaar verschil in de wereld, niet alleen een hogere meter.

**Financiën:** één grootboek. Kas, beschikbaar budget, toekomstige verplichtingen en winst zijn gescheiden begrippen. Geld is een bruikbare maar niet dominante hefboom.

### 7.6 De levende wereld
Fictieve clubs en personen: vijf divisies van zestien (80 clubs) met een nationale beker en een buitenlandse wereld (MB-15 ✅). Elke club heeft een eigen selectie, economie, identiteit en ontwikkeling en beslist met dezelfde commando's als de speler (D1 ✅). Spelers verouderen, groeien, raken geblesseerd, wisselen van club en stoppen. Relevante wereldgebeurtenissen verschijnen in de Echo.

### 7.7 ALV, carrière en falen (MB-09 🔷)
Het jaarrapport bevat beloftes, resultaten, financiën, clubontwikkeling en vertrouwen. L2 gebruikt de mechanische stemming (D6 ✅); L4 voegt debat, groepen, moties en oppositie toe **op dezelfde meter**, zonder tweede stemmodel. Sportief, financieel en menselijk succes vormen geen samengestelde highscore. Weggestemd? De wereld blijft, je reputatie bepaalt je nieuwe kansen: drie open stoelen (D7 ✅). Geen game-over door één tegenvaller.

**Waar speel je naartoe? (MB-16 ✅)** Er is geen eindscherm en geen winconditie. Het doel op lange termijn is je **reputatie**, je **prijzen** en het **clubboek** dat je achterlaat. Mijlpalen maken voortgang zichtbaar, zoals *eerste promotie*, *eigen jeugd in de basis*, *schuldenvrij*, *een beker* of *een recordverkoop*. Ze komen uit echte gebeurtenissen, staan in het clubboek en tellen mee voor je reputatie; ze geven geen bonussen.

### 7.8 Hogere lagen (L3–L5)
- **L3 — mensen met mandaten (D-L3-1 ✅):** staf zijn personen met competenties, richting en verantwoording. Een mandaat is een grens: daarbinnen beslist de staf, daarbuiten komt een voorstel. Ze voeren echt handelingen uit; geen tekstuele schijnautonomie.
- **L4 — verhalen en politiek:** situaties ontstaan uit bestaande feiten en relaties. Groepen, oppositie en afspraken maken de gevolgen van beleid persoonlijk.
- **L5 — dynastie (D-G3 ✅):** de voorzitter is een persoon met partner en kinderen die opgroeien, eigenschappen erven en een pad kiezen. Een ledenclub is geen erfelijk bezit: een opvolger wordt via de ALV gekozen. Het clubboek (legendes, resultaten, tijdperken) staat los van het dynastieboek (familie en nalatenschap).

## 8. UX: een spel, geen dashboard
Mobile-first (390 px, licht en donker), Engelse interface, tekstgerichte retro voetbalpresentatie. Informatie begint met *wat er speelt, waarom het telt en wat je kunt doen*; diepere cijfers op verzoek. Tikdoelen ≥ 44 px, WCAG AA, korte tekstblokken.

**Informatiearchitectuur (MB-07 🔷):** één clubhub met een vaste voortgangsknop. Maximaal vier primaire bestemmingen: **Club** (afdelingen, geld, staf), **World** (selectie, competitie, markt), **Network** (contacten, scoutingdossier), **Echo** (nieuws, geschiedenis). Tijdens een transferwindow is het Transfer Centre dominant op de hub. Dit is een doel-IA, geen opdracht om de huidige tabs blind te vervangen. Een urgente uitzondering mag prominent zijn; geen reeks modals.

Een beslissing toont altijd: situatie, alternatief, kosten, onzekerheid, bevestiging en waar je het gevolg later terugvindt.

```text
┌──────────────────────────────┐   ┌──────────────────────────────┐
│ PELL UNITED         WEEK 08  │   │ TRANSFER CENTRE    WEEK 2/4  │
│ £118k cash | 6th | Trust 64% │   │ £36k available | £900/w room │
│ NEXT: Ravensby (H)           │   │ TD plan: striker, then LB    │
│ Win to move into top four    │   │ ST  Reed     Offer rejected  │
│ YOUR CLUB                    │   │ ST  Vos      Alternative     │
│ [Football]   [Finance]       │   │ LB  North    Enquiry         │
│ [Academy]    [Training]      │   │ [Review priorities]          │
│ [Medical]    [Ground]        │   │ [Recommend from dossier]     │
│ [Commercial] [Members]       │   │ [Review funding]             │
│ YOUR OPPORTUNITIES           │   │ MARKET NEWS                  │
│ Scout report: 2 new players  │   │ Rival signs young winger     │
│ THE ECHO — Last week         │   │                              │
│ 2–1 win · +£3k · Youth debut │   │                              │
│ [Play week 08]               │   │ [Advance market week]        │
│ Club | World | Network | Echo│   │                              │
└──────────────────────────────┘   └──────────────────────────────┘
```
Namen en getallen zijn illustratief; elke echte kaart komt uit de engine.

## 9. Balans en bewijs van plezier
- Een goede economische keuze heeft opportuniteitskosten; geen strategie domineert in elke context.
- Een actieve, vaardige voorzitter verschilt aantoonbaar van een passieve, zonder garantie op succes.
- Verschillende clubstrategieën zijn haalbaar, afhankelijk van de club. Lagere divisies blijven levensvatbaar.
- **Een stabiele ledger, een groene CI of een simulatie bewijst geen plezier.** Plezier vraagt een menselijke playtest.
- **Releasegate:** begrensde meerjarige simulatie (10–20 seizoenen), budget- en selectie-invarianten, gepaarde beleidsvergelijkingen met dezelfde seeds, save/load, mobiele end-to-end test en een menselijke speeltest.

---

# DEEL II — BESLUITEN

## 10. Besluitenregister (enige bindende bron)
Historische ID's (D/T/P) komen uit `DECISIONS.md` op commit `3157b3a`; MB/DEV zijn van 25-11-2026. Technische besluiten T1–T15 staan alleen in het archief (§17) en zijn implementatiedetails, geen ontwerpcanon.

| ID | Datum | Status | Besluit | Vervangt / opmerking |
|---|---|---|---|---|
| D1 | 21-11 | ✅ | Alle clubs volledig gesimuleerd; AI-clubs gebruiken dezelfde commando's als de speler. Geen verborgen tweede economie. | |
| D3 | 21-11 | ~~✅~~ | ~~3 divisies van 16 (48 clubs) + beker.~~ | Vervangen door MB-15. |
| D4 | 21-11 | ✅ | Elke week is een eigen stap met wedstrijdverslag; geen doorspoelen. Elke week biedt iets te lezen of te beslissen en is snel af te handelen. | |
| D5 | 21-11 | ~~✅~~ | ~~Voorzitter zet alleen kaders; geen veto, geen eigen opdrachten.~~ | Deels vervangen door D-S1 en D-L3-2b. Kaders blijven. |
| D6 | 21-11 | ✅ | Ledenvertrouwen (mechanisch) + jaarlijkse ALV als verliesconditie. L4 dramatiseert dezelfde meter. | |
| D7 | 21-11 | ✅ | Na wegstemmen kies je een van drie open stoelen in dezelfde wereld; carrière en reputatie lopen door. | |
| D-L3-1 | 22-11 | ✅ | L3 = staf als mensen én mandaten. | |
| D-L3-2 | 22-11 | ✅ | De voorzitter keurt nooit losse spelers, opstellingen of verlengingen goed. | Uitzonderingen: D-L3-2b. |
| D-G1 | 24-11 | ✅ | Een spel, geen goedkeuringsspel; routinezaken doet de staf. | |
| D-G2 | 24-11 | ✅ | De afdelingen vormen de basislaag; eerst moeten keuzes voelbaar zijn en moet de week een ritme hebben. | |
| P-1 | 24-11 | ✅ | Claude ontwerpt en bouwt als game developer en test licht; ChatGPT test balans en regressie. Geen lange runs zonder vraag. | |
| D-S1 | 25-11 | ✅ | De voorzitter reist en beveelt spelers aan; aanbevolen spelers krijgen extra gewicht bij de TD. ~~Eén activiteit per week.~~ | "Eén per week" vervangen door MB-12. |
| D-L3-2b | 25-11 | ✅ | Twee uitzonderingen bij de voorzitter: bod op een top-3-speler, aankoop boven het clubrecord. | Wijzigt D-L3-2. |
| D-G3 | 25-11 | ✅ | Dynastie = familie; opvolging via de ALV, de club is geen erfelijk bezit. | |
| D-G4 | 25-11 | ✅ | Spelers zijn de motor van het plezier: vinden, opleiden, zien groeien, verkopen (Moneyball). | |
| D-G5 | 25-11 | ✅ | Elk seizoen moet de voorzitter een stemming winnen; de ALV is de climax. | |
| D-G6 | 25-11 | ✅ | De transfermarkt is een speelbaar verhaal over weken (vergadering → brief → ticker → deadline → krant → debrief). | Laag gewijzigd van L3 naar L2: MB-14. |
| MB-01 | 25-11 | ✅ | Club Builder = gameplay, Chairman = rol, Dynasty = langetermijnbeloning. L1/L2 zijn zelfstandig leuk. | |
| MB-02 | 25-11 | ✅ | Bestaande clubidentiteit + jaarlijks manifest; verandering door gedrag en resultaten. | |
| MB-03 | 25-11 | ✅ | Proactief én situationeel, binnen de voorzittersrol; geen actiepunten. | |
| MB-04 | 25-11 | ✅ | Natuurlijke, activiteitsgebonden beperkingen in plaats van een universeel weekquotum. | Door de eigenaar bevestigd via MB-12. |
| MB-05 | 25-11 | 🔷 | De eerste zomer is de introductie; geen aparte tutorialcampagne. | |
| MB-06 | 25-11 | 🔷 | Persistent netwerk met toegang tot informatie en kansen, niet tot transfercontrole. | |
| MB-07 | 25-11 | 🔷 | Eén clubhub, vaste voortgangsknop, bediening in de afdeling, Echo als weekverslag. | |
| MB-08 | 25-11 | 🔷 | Geen lineaire upgradegrind; investeringen concurreren en hebben onderhoud en meetbaar effect. | |
| MB-09 | 25-11 | 🔷 | ALV is de verliesconditie; geen samengestelde highscore. | |
| MB-10 | 25-11 | 🔷 | Eerst een causale, leuke verticale slice van de basis; geen hogere laag als reparatie. | |
| DEV-01 | 25-11 | ✅ | Ontwikkelcharter, werkcyclus, kwaliteitstoets, roadmap, documentatieprotocol en gedelegeerde autonomie (deel III–IV) zijn goedgekeurd. | Vervangt geen kosten- of laaggrenzen. |
| MB-11 | 25-11 | ✅ | **Northmarch is het actieve spel.** Deze bijbel is de enige canon voor alle developers, ook Claude; `slimline-main` is de officiële branch. *The Front Office* (`BIBLE.md`, `claude-game`) is archief. | `CLAUDE.md` en `AGENTS.md` moeten hierop worden aangepast (NM-007). |
| MB-12 | 25-11 | ✅ | Persoonlijke activiteiten hebben elk hun eigen beperking (kosten, datum, bezette tijd, wachttijd tot er iets nieuws is); reizen sluiten elkaar uit. Geen vast aantal per week. | Vervangt "één activiteit per week" (D-S1); bevestigt MB-04. |
| MB-13 | 25-11 | ✅ | Geen versneld spelen dat weken overslaat; D4 blijft. Rustige weken worden sneller (één tik), niet weggelaten. | Bevestigt D4. |
| MB-14 | 25-11 | ✅ | De speelbare transfermarkt hoort bij L2 en werkt zonder hogere lagen. Alleen persoonlijkheid en mandaat van de TD zijn L3. | Wijzigt de laag van D-G6 en T5. |
| MB-15 | 25-11 | ✅ | De wereld heeft vijf divisies van zestien (80 clubs) plus de nationale beker. | Vervangt D3. |
| MB-16 | 25-11 | ✅ | Geen eindscherm of winconditie. Het doel is reputatie, prijzen en het clubboek; mijlpalen uit echte gebeurtenissen maken voortgang zichtbaar, zonder bonussen. | |

## 11. Open vragen voor de game director ❓
Hier neemt geen developer een besluit over. Een nieuwe vraag krijgt een nummer, de reden waarom het knelt en een advies; na het besluit verhuist ze naar §10.

**Er zijn nu geen open vragen.** V1–V6 uit het V1.3-concept zijn op 25-11-2026 beslist volgens het advies van de developer:

| # | Vraag | Besluit |
|---|---|---|
| V1 | Welk spel is actief en welke werkafspraken gelden voor Claude? | MB-11 |
| V2 | Vervangt MB-04 "één activiteit per week"? | MB-12 |
| V3 | Mag versneld spelen weken overslaan? | MB-13 |
| V4 | Hoort de transfermarkt bij L2? | MB-14 |
| V5 | Vijf of drie divisies? | MB-15 |
| V6 | Wat is "winnen" in L1/L2? | MB-16 |

---

# DEEL III — WERKWIJZE

## 12. Beslisrechten en samenwerking
- **Game director:** bepaalt productfantasie, bevoegdheden, laagvolgorde, harde grenzen, kosten en publicatiemomenten.
- **Developer (Claude, ChatGPT):** beslist zelf over ontwerpdetails, alternatieven, UX, implementatie, testaanpak en techniek, en registreert dat als 🔷. Vraag de eigenaar alleen bij een conflict met een ✅-besluit, een onomkeerbare wijziging, een ontbrekende randvoorwaarde of kosten. Verandert een inzicht de kernvisie: maak het conflict expliciet en leg een gerichte keuze voor (§11).
- **Werkgebieden** (tenzij de eigenaar anders bepaalt): Claude — kern, scouting, clubmanagement; ChatGPT — wereld, balans/regressie, documentconsolidatie.
- Werkbranches blijven van hun eigenaar: geen force-push, geen stille merges, geen wijziging in andermans gebied zonder afstemming. Stem af via commits en §16 *Current work*, niet via losse documenten.
- Communiceer in het Nederlands; de interface van het spel is Engels.

## 13. Werkcyclus per feature
Pas de diepgang aan op de omvang: een kleine fix vraagt geen onderzoek of prototype, een nieuwe kernloop wel. Het is één cyclus, geen tien goedkeuringsmomenten.

1. **Synchroniseren** — lees deze bijbel, controleer branch, HEAD en de officiële tip; draai `standalone/front-office-fc/northmarch-layered/scripts/sync-check.sh` vóór codewerk.
2. **Begrijpen** — reproduceer het probleem; volg de route van UI-actie naar command, state, simulatie en feedback in de echte code.
3. **Ontwerpen** — welk ervaringsdoel (§2)? Vergelijk bij belangrijke keuzes twee à drie echt verschillende oplossingen. Leg vast: spelersactie → systeemverandering → gevolg → feedback, met domeineigenaar en acceptatiecriteria.
4. **Prototypen** — alleen bij nieuwe kernmechaniek of UX: wireframe, papieren flow of kleine simulatie, vóór de grote bouw.
5. **Uitdagen** — toets aan §14; zoek misbruik, saaie routes en ongewenste gevolgen. Uitkomst: go, revise of reject.
6. **Bouwen** — kleinste complete verticale slice in bestaande modules: echte state, centrale klok, seeded RNG, events en commands.
7. **Valideren** — passende lokale tests (testladder hieronder) en de relevante route spelen; vergelijk met de baseline.
8. **Vastleggen** — werk §10 en §16 bij met commit-SHA, bevindingen en volgende stap.
9. **Integreren** — alleen via de afgesproken route en met toestemming waar kosten of publicatie dat vragen.

**Technische regels**
- Wijzig broncode, nooit gegenereerde output (`dist/` blijft ongevolgd). Nieuwe modules expliciet in de buildconfiguratie.
- Alle toeval via de seeded RNG. Nieuwe savevelden krijgen een veilige default of migratie plus regressietest.
- De standaard L1/L2-build mag niet afhankelijk zijn van hogere lagen; test die grens.
- Eén eigenaar per domein, één klok, één economie, één command-route. Geen dubbele selectie- of budgetstate, geen UI-wrapper op UI-wrapper.
- Build: `node build.js` in `standalone/front-office-fc/northmarch-layered/`; hogere autonomie via `NORTHMARCH_BUILD_MODE=autonomy`.

**Testladder** — statische controle → gerichte unit-/integratietest → lokale build en korte smoke-test → gerichte save-/laag-/UX-regressie → alleen bij balanswijzigingen een vooraf begrensde meerseizoenssimulatie → menselijke playtest voor elke plezierclaim. Geen volledige suite voor een tekstwijziging. Vermeld bij elk resultaat de exacte SHA, wat wel en wat niet is getest.

**Kosten en publicatie** — geen CI-triggerende push, PR, merge, workflowwijziging of herstart zonder specifieke toestemming. Een push naar `slimline-main` start publicatie (`publish-trigger.yml`); een PR naar `slimline-main` start CI. Werk daarom op een eigen, niet-publicerende branch. Een documentwijziging is geen toestemming voor een Pages-run. Mislukte run: niet automatisch herstarten.

## 14. Kwaliteitstoets en definition of done
**Toets voor elke nieuwe mechaniek** — noteer per relevante dimensie *pass*, *revise* of *n.v.t.* met een concreet voorbeeld. Geen totaalscore.

| Dimensie | Vraag |
|---|---|
| Agency | Kan de speler doelgericht, ook proactief, een uitkomst beïnvloeden? |
| Causaliteit | Komt de verandering echt door de actie, en is dat terug te lezen? |
| Afweging | Zijn meerdere keuzes verdedigbaar, zonder gratis dominante optie? |
| Ontdekking | Ontstaan onverwachte maar geloofwaardige kansen of inzichten? |
| Binding | Groeit de band met club, spelers, mensen of wereld? |
| Herspeelbaarheid | Leiden andere clubs en strategieën tot andere carrières? |
| Rolzuiverheid | Is dit werk van een voorzitter, niet van de TD of trainer? |
| Integratie | Versterkt het bestaande systemen zonder losse minigame of tweede engine? |

**Afwijzingsgronden:** schijnkeuzes, verplichte routinegoedkeuringen, actiepunten als kunstmatige schaarste, informatie zonder doel, automatisch doorspelen zonder invloed, klikbeloningen zonder afweging, lineaire upgrades, en systemen die de onderliggende laag afhankelijk maken.

**Definition of done**
- Dient één ervaringsdoel en heeft één domeineigenaar; geen dubbele bron van waarheid.
- Heeft een echte spelersactie of een duidelijke feedbackfunctie; verandert de state en toont het gevolg op het juiste moment.
- Werkt met oude saves, zonder hogere modules, op 390 px in licht en donker.
- Getest met de goedkoopste passende lokale tests; SHA, scope, uitkomst en beperkingen vastgelegd.
- Plezierclaims alleen na een menselijke playtest; een bot-playtest heet ook zo.
- Deze bijbel klopt nog met wat het spel doet.

---

# DEEL IV — ROADMAP EN STATUS

## 15. Lagen en roadmap
**Lagen** — L1 wereld, tijd, spelers, competities en markt · L2 speelbare clubontwikkeling, de speelbare transfermarkt (MB-14), geld, beleid, basispersoneel, bestuurlijke acties, scouting en jeugd (het vroegere "L2.5" hoort hierbij) · L3 autonome staf en mandaten · L4 verhalen, relaties en politiek · L5 dynastie en opvolging. L1/L2 vormen zonder hogere lagen een compleet spel; bestaande L4/L5-slices bewijzen niet dat de basis klaar is (MB-10).

| Fase | Mijlpaal | Exit gate | Niet als omweg toevoegen |
|---|---|---|---|
| 0 | Consolidatie en baseline | Eén canon; bron, modulegrenzen en blockers bekend | — |
| **1** | **The First Summer** | Clubkeuze, manifest, TD-plan, interactieve zomer, deadline en eerste wedstrijd vormen één loop; geen verborgen dubbele markt; beslissingen aantoonbaar causaal | Complexe gesprekken, politiek, dynastie |
| 2 | Wekelijkse gameplay | Proactieve en situationele acties, rustige maar niet lege weken, wekelijkse Echo; meerdere weken speelbaar zonder hogere lagen | Kaarten om weken te vullen |
| 3 | Netwerk en talent | Netwerk levert concrete kansen; aanbevelingen bereiken de TD; profielen en volglijst creëren binding | Directe transfercontrole |
| 4 | Clubontwikkeling | Afdelingstiles, projecten, alternatieve groeistrategieën, betaalbare cashflow | Lineaire upgrades |
| 5 | Seizoensboog | Wedstrijden, rivaliteit, winter, nieuws, eindstand en ALV vormen een herkenbare boog | Tweede stemmodel |
| 6 | L1/L2-balans | Representatieve clubs, actieve/passieve strategieën, meerdere seeds; menselijke playtest ondersteunt de kernervaring | — |
| 7 | L3 staf | Mandaten, kwaliteit en vertrouwen veranderen aantoonbaar gedrag; uitschakelbaar | Routinegoedkeuringen, tweede transferengine |
| 8 | L4 verhalen en politiek | Situaties uit echte feiten met causale gevolgen | Gescripte crises |
| 9 | L5 dynastie | Opvolging en familie bouwen voort op bestaande club- en wereldhistorie | Losse familie-minigame |
| 10 | Productkwaliteit | Samenhang, performance, toegankelijkheid, saves, langetermijnbalans, playtests | — |

**Volgend werkpakket — fase 1, The First Summer**
1. Bron versus livebuild vergelijken; zuivere baseline vastleggen.
2. Auditkandidaten NM-001–003 reproduceren vóór een fix wordt gekozen.
3. Eerste club, TD-brief en transferperiode tot één doorlopende flow maken; kandidaten en echte keuzes tonen vóór doorspelen.
4. Scouting, aanbevelingen, profielen, eerste wedstrijd en Echo op dezelfde feiten laten rusten.
5. Meerdere startclubs en budgetten spelen; actieve tegen passieve voorzitter toetsen.
6. Pas daarna fase 2. Geen L3/L4/L5-uitbreiding in deze sprint.

## 16. Living record
*Werk dit bij aan het eind van elke sessie, zodat iedereen vanuit GitHub verder kan zonder chatgeschiedenis. Statuswoorden: Designed · Implemented · Tested · Playtested (mens of bot vermelden) · Validated · Released, plus Partial / Blocked / Not tested / Superseded. Geen groen label zonder bewijs; een test op een oude commit telt niet voor een nieuwe.*

**Officiële bron:** `slimline-main` @ `7147f23` (consolidatie; geen spelrelease). Publicatie: https://blauwev0gel.github.io/front-office-fc/northmarch/ · laatst gerapporteerde succesvolle livebron `3157b3a`; pariteit niet opnieuw gemeten.

**Implementatiestatus (uitgangspositie)** — L1/L2 bestaan als speelbare bronbuild volgens historische documentatie, niet integraal tegen deze bijbel gevalideerd. Opening/zomer, netwerk, weekflow, upgrades en seizoensboog: implementaties aanwezig, audit nodig. L3 deels aanwezig als opt-in. L4/L5 niet vrijgegeven. Actualiseer per feature na inspectie, niet op naam van een module.

**Test evidence** — Geen game-, browser- of simulatietests uitgevoerd voor V1.2 of V1.3 (documentatie). Historisch bewijs via §17.

**Bekende problemen**
| ID | Status | Probleem / volgende actie |
|---|---|---|
| NM-001 | Auditkandidaat | Dubbele zomermarkt: zomerafsluiting en eerste week traceren, reproduceren vóór fix. |
| NM-002 | Auditkandidaat | Summer clock en persoonlijke activiteiten: beschikbaarheid per zomerweek toetsen. |
| NM-003 | Auditkandidaat | TD-planactualisatie, budgetvalidatie en deadlinebeslissingen: causale keten en behoud van state controleren. |
| NM-004 | Open validatie | V19-economie en strategieverschillen: eerst scope en baseline, geen ongevraagde zware sims. |
| NM-005 | Open validatie | Menselijke spelbeleving van de eerste zomer en L1/L2: prototype en playtest. |
| NM-006 | Operationeel | Laatste Pages-run mislukt na herstart (gemelde oorzaak: dubbele artifactnaam). Niet nodig voor documentatiewerk. |
| NM-007 | Wacht op eigenaar | `CLAUDE.md` en `AGENTS.md` verwijzen nog naar *The Front Office*. Voorstellen voor MB-11 liggen klaar; de eigenaar past ze zelf toe of geeft Claude daar expliciet opdracht toe. |
| NM-008 | Implementatie | De code volgt nog "één activiteit per week" (D-S1). Omzetten naar MB-12 in fase 2 of 3, met savemigratie. |

**Release history**
- 25-11-2026 · V1.1 — documentatie geconsolideerd op `slimline-main` `7147f23` en `main` `cc4c5db` (identieke blob `ecb6ad3`).
- 25-11-2026 · V1.2 — charter, workflow, kwaliteitstoets, roadmap en registers toegevoegd (`b69ea16`, branch `docs/master-bible-v1-2`, niet geïntegreerd).
- 25-11-2026 · V1.3 — herstructurering in vier delen, één besluitenregister, feitelijke correcties; open vragen beslist (MB-11–MB-16). Geen spelwijziging.

**Current work**
- **Actief:** V1.3 vastgesteld op `claude/loving-goodall-uv00vn`; integratie in `slimline-main` wacht op toestemming van de eigenaar (start publicatie).
- **Wacht op eigenaar:** geen open ontwerpvragen.
- **Volgende producttaak:** fase 1, The First Summer (§15).
- **Niet actief:** hogere lagen, ongevraagde balanssimulaties, Pages-herstarts, releasewerk.

---

## 17. Bronnen en archief (read-only)
Historische documenten zijn geen actieve canon; onderzoek is input, geen besluit. Alle 65 Markdown-bestanden van vóór de consolidatie staan ongewijzigd op commit [`3157b3a`](https://github.com/Blauwev0gel/front-office-fc/tree/3157b3ac9293397ee73fb2b846418199412eb7a7). De belangrijkste:

- [DECISIONS.md](https://github.com/Blauwev0gel/front-office-fc/blob/3157b3ac9293397ee73fb2b846418199412eb7a7/standalone/front-office-fc/northmarch-layered/docs/DECISIONS.md) — volledige tekst van D-, T- en P-besluiten.
- [LAYER_CONTRACT.md](https://github.com/Blauwev0gel/front-office-fc/blob/3157b3ac9293397ee73fb2b846418199412eb7a7/standalone/front-office-fc/northmarch-layered/docs/LAYER_CONTRACT.md) — modulegrenzen per laag.
- [CORE_LOOP.md](https://github.com/Blauwev0gel/front-office-fc/blob/3157b3ac9293397ee73fb2b846418199412eb7a7/standalone/front-office-fc/northmarch-layered/docs/CORE_LOOP.md) — voorstel van 25-11, geen canon.
- [DEV_STATE.md](https://github.com/Blauwev0gel/front-office-fc/blob/3157b3ac9293397ee73fb2b846418199412eb7a7/standalone/front-office-fc/northmarch-layered/docs/DEV_STATE.md) — technische status vóór consolidatie (niet onafhankelijk geverifieerd).
- [loopsim-handover](https://github.com/Blauwev0gel/front-office-fc/blob/3157b3ac9293397ee73fb2b846418199412eb7a7/loopsim-handover/HANDOVER-CHATGPT.md) — 37.760 gesimuleerde runs; richtinggevend tegen opvulkaarten, geen bewijs van plezier.
- [Voorzitter-onderzoek](https://github.com/Blauwev0gel/front-office-fc/tree/3157b3ac9293397ee73fb2b846418199412eb7a7/standalone-research) — concept, kern, ervaring, transferzomer, TD, ALV, familie.
- [BIBLE.md (The Front Office)](https://github.com/Blauwev0gel/front-office-fc/blob/claude-game/BIBLE.md) — *The Front Office*, CEO-variant op `claude-game`; archief sinds MB-11.

**North star:** bouw een club die je herkent, ontdek spelers om wie je geeft, neem beslissingen die ertoe doen en laat een geschiedenis achter die zonder jou niet hetzelfde zou zijn.

### Werknotitie — Canonieke transferzomer (25 november 2026)
- Baseline `69aee45930cd81e2c550681e7dfa3c2b59ac2eca`; werkbranch `canonical-transfer-summer-chatgpt`. Scope NM-001 en eerste correcties NM-002/003; expliciet verzoek om codeopschoning vóór runtime-audit.
- Interactieve zomer is leidend voor de spelersclub. Na week vier blijven openstaande beslissingen zichtbaar; expliciete afsluiting voert resterende wereldmarkt, minimale gratis nooddekking, verhuur en reconciliatie uit vóór de definitieve Echo. De eerste competitieweek draait die markt niet opnieuw. De oude automatische route blijft voor headless/legacy-aanroepen zonder getekende brief; volledige convergentie is open.
- Persistente ledger registreert feitelijke transfers, vrije signings, verhuur en releases; Echo en debrief gebruiken deze waar aanwezig. Normale AI-markt mag niet buiten de interactieve route direct handelen met de spelersclub. Herberekening selectieplan, heropening van behoeften, aparte zomerweektijd en feehercontrole. MB-12 natuurlijke activiteitslimieten blijven NM-008.
- Niet af: runtime-reproductie, browser/saves, economische balans, volledige salaris- en budgetvalidatie, afzonderlijke deadline-uren, wintermarktconvergentie en legacy/headless-pariteit. Geen claim dat NM-001–003 gevalideerd zijn. Geen simulaties, CI of publicatie; volgende stap gerichte lokale build en acceptatietests vóór integratie.
