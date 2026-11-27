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
**Northmarch is een football club chairman & dynasty game.** Je bent de benoemde voorzitter van een ledenclub in een fictieve voetbalwereld die zonder jou doordraait. Je ontdekt talent, investeert, geeft richting en bouwt een netwerk; je mensen runnen de dagelijkse operatie en jij draagt de gevolgen. Elk seizoen moet je de leden opnieuw overtuigen. Op lange termijn bouw je een nalatenschap over clubs en generaties.

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
| Clubkeuze | Open stoelen als dossiers: de opgave in één zin; per dossier identiteit (stad, luidste supportersgroep), legende, litteken, rivaal, drie namen, geld en steun | Dossiers lezen en vergelijken, dan *Take the chair* (benoemd, geen verkiezing; MB-39) | Een eigen startverhaal |
| Eerste dag | Welkom, de opgave en drie namen om te kennen | Het manifest kiezen en **tekenen** (Safe/Steady/Bold per belofte) | Persoonlijke inzet; de doelen staan vast tot de ALV (MB-17) |
| TD-vergadering | Gaten in de selectie, budget, het plan van de TD, dat je manifest volgt | Het plan aanvaarden of wijzigen | Een begrijpelijk plan |
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
- **Alleen via je eigen window (MB-18 🔷):** zolang jij het window speelt, kopen of verkopen andere clubs niet buiten je TD om bij jouw club. Na de deadline mag alleen de veiligheidsregel die voor elke club geldt (twee keepers en één speler per positie) een speler toevoegen, en dat staat er dan bij.

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
| MB-20 | 26-11 | ✅ | Alle lagen staan aan in het speelbare spel (L3 staf met mandaat, L4 momenten en afspraken, L5 familie). De L1/L2-basisbuild (`NORTHMARCH_BUILD_MODE=base`) blijft zelfstandig speelbaar en getest. | Eigenaar: "de lagen worden niet toegepast". Wijzigt de volgorde van MB-19: lagen aan, daarna per laag verdiepen. |
| MB-19 | 26-11 | ✅ | Het spel groeit laag voor laag naar een volledig speelbaar spel, in hoog tempo. Elke stap is een speelbare artifact op de echte engine: 1 eerste zomer · 2 week en seizoen met de ALV · 3 L3 staf · 4 L4 verhalen · 5 L5 dynastie. Geen handgeschreven nep-spel. | Uitvoering van §15; MB-10 blijft: de basis eerst. |
| MB-21 | 26-11 | 🔷 | L3 is actief: de TD en de trainer zijn personen met specialiteit, kwaliteit, contract, loyaliteit en geheugen. De voorzitter beslist over mensen (signeerlimiet van de TD, contract, wie), nooit over spelers of opstellingen. De staf komt zelf met situaties uit het seizoen: meer mandaat na een gemiste aanwinst, een grotere club die een disloyale staflid wil, ruzie tussen trainer en TD over een zomeraankoop die niet speelt, en een vacature met drie kandidaten. Loyaliteit stuurt wie te koop staat voor andere clubs. | Uitwerking van D-L3-1/D-L3-2 en fase 7 op verzoek van de eigenaar: "L3 mag niet passief aanvoelen". |
| MB-22 | 26-11 | 🔷 | De week (§6): de wedstrijd en de inzet bovenaan; *On your desk* alleen wat jou nodig heeft (anders één regel: je bureau is leeg); *Your plans this week*: twee tot vier acties uit de situatie van de club, elk met de reden (zwakke plek, academiebelofte, ontevreden groep); *Running*: wat je in gang zette en hoe het ervoor staat (vondsten om aan te bevelen, uitgenodigde jeugd, afspraken, bouw); de club ingeklapt. Het eindsignaal vertelt wat je week opleverde. De wedstrijd opent standaard live (uitzetbaar). Een week op de club tilt de ontevredenste groep zichtbaar op. | Eigenaar: "de week is een next-week-klikker, mijn acties slaan nergens op". |
| MB-23 | 26-11 | 🔷 | Spelers zijn data (Moneyball, §7.3–7.4, D-G4): elke competitiewedstrijd, thuis en in het buitenland, laat per speler een wedstrijdcijfer, een xG-aandeel en de laatste vijf cijfers na; seizoenen worden met gemiddeld cijfer en xG gearchiveerd. Elke speler heeft één profiel: wat we weten (eigen spelers exact, anderen als schatting met bandbreedte uit scouting, of alleen data), de data, het geld (waarde, loon, contract, vraagprijs per ratingpunt) en de loopbaan. De selectie is een sorteerbare datatabel. Een clubrecord of bod op je speler komt met een datastrip en het profiel. | Eigenaar: "geen spelersdiepte; dit moet naar Moneyball, stat heavy". Cijfer en xG volgen uit de wedstrijdengine, zonder extra toeval. |
| MB-24 | 26-11 | 🔷 | Club Builder als zichtbare lus (MB-01, MB-08, MB-16): bovenaan de week staat *Your club*: wat de club is en de volgende mijlpalen met voortgang (stadion, academie, trainingscomplex, schuldenvrij, eigen jeugd in de elf, promotie). Elke afdeling heeft een hoofd met een naam en één vraag met kosten, bouwtijd en jaarlijkse kosten; de twee betaalbaarste staan in de weekplannen. Investeren concurreert om het geld boven vier weken loon. Wat af is, verschijnt bij het eindsignaal (BUILT). | Eigenaar: "hoe laat ik mijn club groeien? Het voelt kil en dood". Namen van afdelingshoofden volgen uit club en afdeling; er komt geen nieuwe opgeslagen staat bij. |
| MB-25 | 26-11 | ✅ | De week draait om een inbox van mensen: beslissingen die van de voorzitter zijn (momenten, debrief, de twee transferuitzonderingen), adviezen van de staf met hun voorstel (scoutingreis, jeugdtoernooi, een week bij een ontevreden groep, een investering, de analist) en rapporten (vondsten om aan te bevelen, jeugd om uit te nodigen, de trainer na zaterdag). Bovenaan een nieuwsticker met resultaten, transfers en staf uit de wereld. Grenzen uit de bijbel blijven: geen routinegoedkeuringen (D-G1) en nooit alleen een inbox (MB-03): *Start something yourself* blijft. | Eigenaar: "een inbox met beslissingen, gesprek en advies is beter; en ik wil een news ticker". Vervangt *Your plans this week* uit MB-22. |
| MB-26 | 27-11 | ✅ | Geld knelt en de voorzitter voelt het. Salarissen zijn het grootste deel van de omzet (ongeveer 55–67%); een betere speler kost onevenredig meer, rijkere divisies betalen meer voor dezelfde speler, bouwen en afdelingen kosten aan de top een veelvoud, onderhoud is in de lage divisies goedkoper. Op het weekscherm staat *The books* (kas, seizoen tot nu, salarisquote, prognose) met de penningmeester; als het geld opraakt komt de penningmeester met echte keuzes: lenen, kaartprijzen omhoog, afdelingen op een krap budget, of een speler verkopen in het winterwindow. Administratie snijdt in de lonen in plaats van elk seizoen opnieuw te lenen. | Eigenaar: "geld moet knellen, en het spel moet een voorzitter feeling geven"; gemeten over meerdere werelden (zie §16). |
| MB-27 | 27-11 | 🔷 | Het spel wordt in modules gebouwd die vier munten verbruiken of opleveren: Geld, Vertrouwen, Sterkte en Tijd. Een scherm dat geen munt raakt, verdwijnt. De kerndriehoek komt eerst: Budget, Matchday en Leden. Module 2, de **budgetvergadering**, opent elke zomer na het manifest en vóór het TD-plan. Het geld (kas boven vier weken lonen, plus 60% van het verwachte seizoensoverschot) komt in blokken van 1/60 van de seizoensomzet, 2–16 per zomer. De voorzitter verdeelt die over vier potten: Spelers (TD), Lonen (trainer), Bouwen (hoofd faciliteiten) en de Bank (penningmeester). Samen vragen zij meer dan er is. Eén lening per zomer geeft drie extra blokken over vijf jaar. De potten binden het seizoen: de TD besteedt de spelerspot plus verkopen, de lonenpot verhoogt de loonruimte, een nieuw project vraagt om de bouwpot (reparaties niet). TD en trainer onthouden of ze kregen wat ze vroegen, ledengroepen reageren meteen, en op de ALV staat per pot wat het opleverde. Modulemodel: https://claude.ai/artifact/NmLxnLb6BHs339TEeNAL5U |
| MB-28 | 27-11 | 🔷 | **Afdelingen zijn mensen, geen draaiknoppen.** Elke afdeling bestaat uit een hoofd (met naam en een vraag), de mensen (kosten per week) en een gebouw (eenmalig, uit de bouwpot). Ze staan in drie groepen die een munt voeden: *On the pitch* (Training, Medical, Academy, Scouting → Sterkte), *On matchday* (Matchday, Grounds) en *The business* (Commercial, Members & community). Elke afdeling zegt of ze voor, gelijk of achter ligt op de divisie: in de voorzomer op sterkte (mensen plus het deel van het gebouw dat de mensen kunnen draaien), daarna op haar eigen seizoensmaat. Het afdelingsscherm vraagt één ding: maak haar sterker (mensen +£/week, of het gebouw £ eenmalig) of bespaar. Een gebouw dat niet volledig draait door te weinig mensen, wordt rood gemeld. De losse budgetknop verdwijnt uit beeld; alleen na een bezuiniging van de penningmeester kun je het terugzetten. Elke club krijgt bij de start een eigen profiel: één afdeling waar ze trots op is (+1 mensen), één die verwaarloosd is (−1), en eigen werkwijzen. Dat profiel is afgeleid van de club-id, zodat de random-reeks van de wereld onaangeroerd blijft. |
| MB-29 | 27-11 | 🔷 | **De jeugdacademie groeit van jongs af aan.** De club van de speler heeft vijf jeugdteams: U10, U12, U14, U16 en U18, met kinderen van 9 tot 17. Elke zomer is er een proefdag met zes negenjarigen voor 2–5 plekken (naar sterkte van de academie). De academiemanager kiest; de voorzitter mag het anders doen. Elk kind heeft een school, een zondagsclub, een wijk, een voorkeursbeen en een groeitype (vroege ontwikkelaar, gestage groeier, laatbloeier, wisselvallig). Per jaar komt er een regel bij: team, wedstrijden, doelpunten, beoordeling en een notitie van de trainer, bijvoorbeeld ‘Hat-trick against Corden’. De jeugdteams spelen een jeugdcompetitie. Bij de overgang naar de U12, U14 en U16 laat de academie kinderen gaan waar ze niet in gelooft. Op 17 gaan de besten naar het eerste elftal en nemen hun hele geschiedenis mee in het spelersprofiel (‘The academy years’). Elk kind van drie sterren of meer krijgt een contract, de rest wordt bij de alumni bewaard. Jeugdnieuws komt in de ticker. De academie gebruikt een eigen seeded generator, zodat de random-reeks van de wereld niet verandert. |
| MB-30 | 27-11 | 🔷 | **Het home-scherm is de club als plek.** Bovenaan staat een tekening van het stadion en de stad, opgebouwd uit de echte spelgegevens: tribunes (zitplaatsen in clubkleuren of een staantribune), dak, lichtmasten, publiek en een stadssilhouet per type stad (molen, mijnschacht, kathedraal, havenkraan, reuzenrad, flats). Het licht volgt het seizoen: julimiddag, herfst, winter onder de lichtmasten, voorjaar. Bij een uitwedstrijd staat het stadion van de tegenstander erin. Daaronder de wedstrijd van zaterdag met beide clubschilden, en vier meters: Money, Members (met de 50%-streep van de ALV), Team (rang in de divisie) en Season. Elke club heeft een eigen tenue (kleuren en patroon) en een schild. Elke persoon (staf, ledengroepen, inbox, familie, jeugd) heeft een getekend gezicht dat bij zijn naam hoort. De ticker is een LED-bord zoals in een stadion. |
| MB-31 | 27-11 | 🔷 | **De opening en de transferzomer volgen §7.1, §7.2 en §8 letterlijk, als tekstgerichte retro voetbalpagina's** (monospace, rijen met kolommen, een balk bovenaan). *Open chairs* is een index van dossiers, met per club divisie, stad, opgave en kas; het dossier is een tekstpagina. De **eerste dag** is één pagina: het stemresultaat, de opgave, de luidste groep, legende, litteken, rivaal, drie namen en je TD en trainer, met het manifest eronder (één tik minder). De **TD-vergadering** toont de linies, de gaten met de huidige basisspeler, `£X available \| £Y/w room` en het plan dat het manifest volgt. *Review priorities, funding and profile* staat in dezelfde vergadering, zoals §7.2 vraagt. De aparte budgetvergadering (MB-27) zit niet meer in de opening; die engine blijft beschikbaar voor later. Het **Transfer Centre** is het bord uit §8: geld en loonruimte, het TD-plan en de stand van de brief, een zin van de TD, één regel per deal (Offer, Negotiating, Needs your word, Signed, Walked away, Hijacked, Shortlisted), vier hefbomen (priorities en profile, recommend, funding, make space) en *Market news* van de week. Eén tik per marktweek, zonder dag-voor-dag-afspeling. De **zomerkrant** toont In, Out, Net, de veiligheidsregel, nieuws uit de competitie en de brief. Het verkoopdoel in de brief is haalbaar gemaakt: de helft van de waarde van overtollige spelers, hooguit een twaalfde van de seizoensomzet. De getekende scène (MB-30) staat niet meer in de opening; op de clubhub botst ze met §8 en wacht ze op het oordeel van de eigenaar (§11). |
| MB-32 | 27-11 | 🔷 | **Structuur: één klok en één schermskelet** (vraag van de eigenaar: ‘meer voetbalspel en sim, structuur toepassen’). (1) **De klok:** tijd loopt in vaste stappen, in transferwindows per dag (zomer 28 dagen, 1–28 juli; winter 14) en in het seizoen per speelweek. Er is één knop *Continue* die de klok laat lopen. De klok **stopt vanzelf** als de voorzitter nodig is: een bod op een van de drie beste spelers, een clubrecord, de ochtend van deadline day, of het sluiten van het window. *Pause* kan altijd. Een openstaand besluit vervalt pas als je zelf doorgaat. (2) **Het schermskelet**, op elk speelscherm hetzelfde: balk (waar en wanneer) → statusstrook (tijd en geld) → het plan (één regel per onderwerp met de stand) → hefbomen van de voorzitter → nieuws per datum, nieuwste eerst. (3) **Toegepast op de transferzomer:** een kalender met 28 vakjes en deadline day gemarkeerd; *Available, wage room, spent, raised*; per behoefte één regel (Searching → On the shortlist → Bid, answer due Thu → Talks → Signed of Covered, met het aantal mislukte pogingen); outgoing; vier hefbomen (Priority en profile, Shortlist, Funding, Transfer list); marktnieuws per datum. De engine speelt de markt echt per dag. Een bod krijgt na één tot drie dagen antwoord. De TD zoekt op ma, wo en vr. Andere clubs handelen twee keer per week. Oefenwedstrijden zijn op zaterdag. Bij een upgrade tekent de TD alleen een speler die direct in de basis komt. Gemeten over acht werelden blijft het aantal transfers in lijn met het weeksysteem. |
| MB-33 | 27-11 | 🔷 | **De voorzittersloop en informatie zonder tekstmuren.** Elke loop gaat van *kader zetten* naar *de wereld draait*, dan *ingrijpen* en tot slot *het oordeel*. In de zomer: manifest, TD-plan en geld, dan de marktklok, dan uitzonderingen en de deadline, dan zomerkrant en debrief. In een week: één beslissing, dan de wedstrijd, dan steun of druk, dan de uitslag met de oorzaak. In een seizoen: beloftes, dan 30 weken met de winter, dan investeren en mensen, dan de ALV. Elk oordeel wijst terug naar de handelingen van de voorzitter. **De opening en de zomer tonen informatie als cijfers, chips en balken, met hooguit één zin per blok.** *Open chairs*: per club een opgavelabel (WIN, GO UP, BUILD, STAY UP of CLIMB) en chips voor divisie, kas en schuld, squad-rang en fans. Het dossier toont vier tegels (kas, squad-rang, publiek met een vulbalk, opgericht), de luidste groep als percentage met citaat, drie namenkaartjes, en legende, litteken en rivaal op één regel. De verkiezingsavond toont het stemmen-% met de 50%-streep, de opgave, en de TD en trainer met gezicht en één zin. De TD-vergadering toont het bedrag om uit te geven als groot getal, de linies als balken, de gaten als chips (met wie er nu speelt) en het plan als genummerde lijst. Het Transfer Centre toont standaard alleen het nieuws van de laatste twee dagen; een net getekende speler licht op met een stempel SIGNED. |
| MB-34 | 27-11 | 🔷 | **Een transferzomer met echte beweging.** De oorzaak van ‘0 in, 0 uit’: bij de start van de wereld lagen de loonsommen ver boven het loonplafond (Premier ongeveer 2×; AI-clubs verkochten in de eerste weken hun sterren, de club van de speler zat vast). Elke club begint nu op hooguit 92% van haar plafond, zonder random draws. De TD maakt bij het tekenen van de brief een **verkooplijst**: wie weg wil, overtollige spelers op een positie, en een oudere speler die op de bank te veel verdient (de drie besten nooit). Hij verkoopt op dinsdag en donderdag, en op deadline day eventueel met wederzijds goedvinden. **Huren:** jonge spelers (≤ 24) die een club van gelijk of hoger niveau niet opstelt, voor een seizoen; de moederclub betaalt de helft van het loon. Daarnaast **één speler voor de toekomst** (≤ 21, plafond boven de huidige basisspeler) naast basisspelers. Gemeten over 30 clubs (6 werelden × 5 divisies): gemiddeld 2,9 binnen en 1,6 weg, en geen club zonder binnenkomer. |
| MB-35 | 27-11 | 🔷 | **De speelweek heeft één skelet:** speelronde, datum, stand, vorm, kas en leden-% → je bureau (beslissingen bovenaan, adviezen ingeklapt) → **jouw week** (scoutingreis, jeugdtoernooi, datadag of een week op de club; reizen sluiten elkaar uit) → zaterdag (tegenstander, vorm, inzet, gevaarlijkste man, je elf) → de club in vier regels (geld, doelen, mensen, bouwen) → het nieuws uit de competitie. De getekende scène en het LED-bord zijn van het weekscherm af. Elke afdelingsregel toont de volgende stap met prijs (`Next: build £64k · hire +£80/w`). |
| MB-36 | 27-11 | 🔷 | **De week van de voorzitter: wie je ontvangt, waar je zit, wat het deed.** Vervangt de losse rij ‘waar besteed je je tijd’. (1) **Doordeweeks** kloppen vier tot zes mensen aan, elk met een kwestie uit de echte clubstaat. *Trainer:* na twee nederlagen in drie urgent (publiek steunen, een reactie eisen of zwijgen), anders de selectie (trainingsbezoek, minuten voor de jeugd). *TD:* een aflopend contract van een sleutelspeler (een nieuw contract van drie jaar steunen tegen zijn looneis, of laten lopen), anders het komende window. *Penningmeester:* bij geldnood een lening of prijsverhoging, anders de kaartprijzen. *De ontevredenste ledengroep:* met naam, aandeel, wens en stemming (luisteren, of een gebaar dat geld kost). *Commercieel manager:* soms een sponsorbod (accepteren, meer vragen, of laten lopen; sommige namen kosten steun bij een groep). *Hoofdscout:* een reis naar een regio. De voorzitter ontvangt **één** van hen, urgente kwesties staan bovenaan. (2) **Zaterdag** kies je je plek. Thuis: de bestuurskamer met de voorzitter van de tegenstander (een contact en een tip over een van hun spelers, die onder Running verschijnt), de sponsorlounge (gastvrijheidsinkomsten) of de tribune (de grootste groep +4). Uit: met de ploeg mee (moraal +3) of de U18 kijken. (3) **Na het eindsignaal** staat onder *Your week · what it did* wat je keuzes deden. Elke keuze werkt op de echte spelstaat: moraal, loyaliteit, groepsstemming, kas, contracten of een scoutingtip. Een week niets doen mag; doorgaan is altijd één tik. |
| MB-37 | 27-11 | ✅ | Het denkkader van §14 (bijbel, dan de zes domeinen van de clubdirecteur × vier momenten, dan de sim) is bindend voor elk voorstel en elke bouwstap. De bouwvolgorde volgt uit de toets: (1) de trainer onder druk en ontslaan of aanstellen; (2) de stand als race en de laatste speeldag; (3) tv- en prijzengeld zichtbaar; (4) de ster die weg wil, met makelaar; (5) pers en de rivaliserende voorzitter. |
| MB-38 | 27-11 | 🔷 | **De stoel van de trainer** (stap 1 van MB-37; cel *Sportief × Gebeurtenis* van ~ naar ✓). Elke week wordt de positie van de trainer gewogen zoals een club dat doet. De weging gebruikt de stand tegenover de verwachting, de laatste vijf uitslagen (een nieuwe trainer alleen zijn eigen wedstrijden), de stemming van de leden, de band met de voorzitter en een wittebroodsweken-korting van zes weken. Dat levert één van vier woorden op: *Safe, Watched, Under pressure, On the brink*. Dat woord staat elke week bovenaan, met de feiten (‘16th (expected 3rd) · 0W 4L in the last 5’) en een lijn van de laatste weken. Erger wordt het, dan komt het in de Echo; op de rand zingt de harde kern tegen hem. **Op de rand** komt de vertrouwensvraag naar de voorzitter: publiek steunen met een puntendoel, een ultimatum, of ontslaan. Vanaf *Under pressure* kan de voorzitter hem ook zelf ontslaan via de agenda (met de ontslagvergoeding). Na een ontslag neemt een interim-trainer het team over. Er verschijnt een **vacature met een shortlist van vier**, elk met leeftijd, herkomst, niveau (sterren, een schatting), stijl (*Attacking football, Organised, Wins ugly, Brings young players on*), welke ledengroep zou juichen, loon en eventuele afkoopsom. Een nieuwe trainer geeft een opleving in de kleedkamer en wint de groep die van zijn stijl houdt. Over acht gespeelde seizoenen stond de trainer in vijf seizoenen onder druk en in drie op de rand. |
| MB-39 | 28-11 | ✅ | **De oprichting is nooit een verkiezing.** Je kiest een bestaande club en wordt direct **benoemd** tot voorzitter (*Take the chair*). Je eerste dag toont het vertrouwen van de leden zoals het nu is; de eerste ALV is het eerste oordeel. |
| MB-40 | 28-11 | 🔷 | **De overdracht: de eerste ochtend met het eerste besluit** (§7.1 ‘de eerste echte keuze valt vroeg’). Na *Take the chair* toont één pagina de club in drie regels (opgave, squad-rang, kas, schuld, vertrouwen) en de eerste kwestie uit de echte clubstaat: een bod op de beste speler (accepteren, meer vragen, weigeren), een bank die een plan wil (een speler verkopen, een lening van vijf jaar, of bezuinigen), of de toekomst van de trainer (verlengen, of hem zich laten bewijzen). Doorgaan kan pas na het besluit. De flow is: overdracht → mandaat → TD-vergadering → window (klok) → deadline → zomerkrant → seizoen → week. |
| MB-41 | 28-11 | 🔷 | **Het window vraagt de voorzitter.** De TD komt tijdens het window met verzoeken die de klok stilzetten. (1) *Geld:* als er voor het budget geen basisspeler is maar wel één die net te duur is (tot 60% erboven), vraagt de TD om het verschil. Vrijgeven verhoogt het budget voor die speler; weigeren laat de TD een goedkoper alternatief zoeken. Dat gebeurt hooguit één keer per positie. (2) *Rivaal:* bij een betaalde lopende deal meldt zich soms een andere club. Je gaat 15% hoger of laat de speler gaan; zo'n kaping gebeurt niet meer willekeurig buiten je om. Huur staat op zijn plek: eerst een betaalbare basisspeler, dan het geldverzoek, dan pas een huurling, maximaal twee per zomer. Gemeten over 18 windows: per window 2,9 binnen (0,9 gekocht, 0,6 gehuurd), en in 8 van de 18 een verzoek of rivaal. |
| MB-17 | 25-11 | 🔷 | Het manifest wordt op de eerste dag van elke zomer getekend, vóór het TD-plan. Daarna liggen de doelen vast tot de ALV: een goede zomer maakt een belofte makkelijker, de lat schuift niet mee. | Ingevuld door Claude op verzoek van de eigenaar (herziening eerste zomer). |
| MB-18 | 25-11 | 🔷 | Zolang de voorzitter het window speelt, handelen andere clubs niet buiten de TD om met de club van de speler. Na de deadline geldt alleen de veiligheidsregel voor elke club, zichtbaar gemeld. | Lost NM-001 op; voert §7.2 uit. |

## 11. Open vragen voor de game director ❓

**V7 (27-11) ❓ — De getekende stadionscène op de clubhub (MB-30) tegenover §8 'tekstgerichte retro voetbalpresentatie'.** Advies: de hub ook als tekstpagina in dezelfde stijl als het Transfer Centre (MB-31), met de clubkleuren alleen in de balk, en de scène schrappen. De academie (MB-29) blijft, maar wordt in dezelfde tekststijl gezet.

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
**Het denkkader (MB-37 ✅, afgesproken met de eigenaar 27-11).** Elk voorstel en elke bouwstap wordt getoetst met drie lenzen, in deze volgorde:
1. **De bijbel:** E1–E5, de rol van de voorzitter (§4: richting, geld, mensen, netwerk, uitzonderingen; nooit opstelling, tactiek of onderhandelen) en het ritme (§6).
2. **De clubdirecteur:** zes domeinen, elk met beslissingen op vier momenten:

| Domein | Per jaar (zomer/ALV) | Per window | Per week | Bij een gebeurtenis |
|---|---|---|---|---|
| Sportief (TD, trainer) | Ambitie, mandaat | Brief aan de TD | Steun of druk op de trainer | Ontslaan of aanstellen |
| Selectie en markt | Selectiestrategie | Uitzonderingen | — | Bod op je ster, clubrecord, transferverzoek |
| Geld | Budget, loonplafond, schuld | Financiering | Kas | Crisis, lening |
| Inkomsten | Prijzen, sponsors, tv- en prijzengeld | — | Wedstrijddag | Sponsorbod |
| Mensen buiten de club | Manifest, ALV | — | Stemming van de leden | Protest, motie, pers, gemeente |
| Infrastructuur | Stadion, training, academie | — | Voortgang | Vergunning, overschrijding |

3. **De sim:** een klok die loopt, oorzaak en gevolg die je kunt zien, informatie die onzeker is, en spanning over het hele seizoen.

**Definition of done van het spel als geheel:** elk domein heeft minstens één betekenisvolle beslissing op zijn natuurlijke moment; elke beslissing heeft een zichtbaar gevolg; alles komt samen in het oordeel op de ALV; één seizoen is speelbaar van zomer tot ALV met spanning in elke fase; en de eigenaar heeft het gespeeld. De toets (✓ ~ ✗ per cel) staat in §16 en wordt na elke stap bijgewerkt.

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

**Officiële bron:** `slimline-main` (zie de release history hieronder voor de laatste SHA). Publicatie: https://blauwev0gel.github.io/front-office-fc/northmarch/ · laatst gerapporteerde succesvolle livebron `3157b3a`; pariteit niet opnieuw gemeten.

**Implementatiestatus (uitgangspositie)** — L1/L2 bestaan als speelbare bronbuild volgens historische documentatie, niet integraal tegen deze bijbel gevalideerd. Opening/zomer, netwerk, weekflow, upgrades en seizoensboog: implementaties aanwezig, audit nodig. L3 deels aanwezig als opt-in. L4/L5 niet vrijgegeven. Actualiseer per feature na inspectie, niet op naam van een module.

**Geld (27-11, MB-26):** gemeten over vier werelden (seizoen 2–3): Premier en One rond 10% marge (was 33% en 15%), Two rond 5%, Three rond 0–3%, Four rond −10% (leeft van spelersverkopen); salarissen 50–67% van de omzet; een kwart tot de helft van de clubs maakt verlies. 20 seizoenen: 8–13 administraties (was 34–48), 86–87 weggestemde AI-voorzitters, geen ontsporende schulden. Lekken gedicht: administratie leende elk seizoen opnieuw zonder loonsnede (een club liep op tot −£50 mln); de TD tekende in het window spelers zonder naar de loonruimte te kijken. Test `money-test`. De volledige snelle testset is groen.

**Budgetvergadering (27-11, MB-27):** de zomer heeft nu vijf stappen: manifest, het geld, het plan, de markt en het seizoen. Gemeten over drie werelden en vijf divisies vragen de vier mensen in 14 van de 15 clubs meer dan er is (1,1 tot 3,5 keer). Meer blokken voor spelers geeft meetbaar meer transfergeld uit (zes werelden: £303k, met alle blokken naar spelers £434k). Nog niet gebouwd: de winterbijstelling van de potten, en een alarm per pot in de inbox. Bot-test groen; nog niet door een mens gespeeld.

**Afdelingen (27-11, MB-28):** de clubpagina heeft nu één kaart *Your departments* in plaats van de hoofdenkaart plus de ingeklapte draaiknoppen. Het afdelingsscherm is vervangen door één nieuw scherm met een stem, een maat tegen de divisie, *Make it stronger*, *Save money* en de werkwijze; de interne details staan onder *Inside the department*. Bot-test en schermafdruk (390 px, licht en donker) gecontroleerd; nog niet door een mens gespeeld.

**Academie en home-scherm (27-11, MB-29/30):** een nieuwe academie-engine (`src/club/academy.js`) met vijf jeugdteams; een academiescherm met de proefdag, tabbladen per leeftijdsgroep, een kinderprofiel met een tijdlijn per jaar, en alumni. Een home-scène met stadion, stad, seizoenslicht en uitstadion, en vier meters. Clubtenues en -schilden; getekende gezichten voor alle mensen; de ticker als LED-bord. `academy-test.js` en de volledige snelle suite inclusief de browser-playtest zijn groen; schermafdrukken op 390 px in licht en donker bekeken. Nog niet door een mens gespeeld.

**Opening en transferzomer (27-11, MB-31):** opnieuw opgebouwd volgens §7.1, §7.2 en §8 als tekstpagina's. Route: open chairs → dossier → *Stand for election* → eerste dag met manifest → TD-vergadering → vier marktweken (één tik per week) → deadline → zomerkrant → seizoen. De volledige snelle suite inclusief de browser-playtest is groen (de playtest controleert nu: TD-vergadering als tekstpagina, vier markttikken, geen afspeling). Schermafdrukken op 390 px in licht en donker bekeken. Nog niet door een mens gespeeld.

**Marktklok (27-11, MB-32):** `preDay()` speelt een marktdag, en `preWeek()` blijft bestaan als wrapper voor het winterwindow en de tests. In de UI loopt de klok vanzelf (ongeveer 0,4 s per dag, deadline-rondes 0,9 s) en stopt bij besluiten, op deadline day en bij het sluiten; bij verminderde beweging springt hij direct naar de volgende stop. De volledige snelle suite inclusief de browser-playtest is groen. `player-data-test` is minder seed-afhankelijk gemaakt: bij seed 9090 zijn na het seizoen 10 in plaats van 11 vaste spelers over, door de veranderde wereldvolgorde; geen fout in het spel. Volgende stap: hetzelfde skelet en dezelfde klok op de speelweek in het seizoen. Nog niet door een mens gespeeld.

**Transfers, week en afdelingen (27-11, MB-34/35):** de volledige snelle suite inclusief de browser-playtest is groen, ook de economie- en simulatietests na de aanpassing van de startlonen. Nog niet door een mens gespeeld.

**Week van de voorzitter (27-11, MB-36):** `src/club/agenda.js` en `agenda-test.js`. De volledige snelle suite inclusief de browser-playtest is groen. Nog niet door een mens gespeeld.

**Toets volgens §14 (27-11, na stap 1):** Sportief: jaar ~, window ✓, week ✓ (de trainer en zijn status elke week bovenaan), gebeurtenis ✓ (druk, vertrouwensvraag, ontslag, shortlist). Selectie en markt: jaar ✗, window ✓, gebeurtenis ~ (transferverzoek ✗). Geld: jaar ~, window ✓, week ~, gebeurtenis ✓. Inkomsten: jaar ~ (tv- en prijzengeld ✗), week ~, gebeurtenis ~. Mensen buiten de club: jaar ✓, week ~, gebeurtenis ~ (pers ✗, gemeente ✗). Infrastructuur: jaar ~, week ✓, gebeurtenis ~. Seizoensspanning: ✗ (stap 2). `coachseat-test.js` en de volledige snelle suite inclusief de browser-playtest zijn groen. Nog niet door een mens gespeeld.

**Inbox en ticker (26-11, MB-25):** het weekscherm opent met een nieuwsticker (pauzeert bij aanraken; zonder animatie bij verminderde beweging) en daarna de wedstrijd en *Your inbox*: berichten met gezicht, naam, rol, onderwerp en een label (DECIDE, ADVICE, REPORT). Adviezen hebben een eigen knop en *Not now* (een investering komt na vier weken terug, de rest volgende week). Vondsten en jeugdspelers die op jou wachten staan als rapport in de inbox; *Running* houdt wat al loopt.

**Club Builder (26-11, MB-24):** *Your club* op het weekscherm en de clubpagina (mijlpalen met voortgangsbalk, ruimte om te investeren); *Your department heads* met naam, rol, niveau van hun gebouw en hun volgende vraag; investeren vanuit de weekplannen; bouw onder *Running*; oplevering bij het eindsignaal. De draaiknoppen per afdeling (personeel, budget, richting) staan ingeklapt. Nog open en cruciaal: geld moet knellen (NM-012); zolang de top te veel verdient, zijn investeringen geen echte afweging.

**Spelers en data (26-11, MB-23):** wedstrijdcijfer, xG, goals minus xG en vorm (laatste vijf) per speler, voor alle clubs in binnen- en buitenland; een profielpagina voor elke speler, met *What we know* (exact, schatting met bandbreedte, of alleen data), *The data*, *The money* en *Season by season*; de selectie als tabel, sorteerbaar op rating, gemiddeld cijfer, goals, xG, waarde, loon en leeftijd; namen in je vondsten, op het bord van de TD en bij de doelpuntenmakers openen het profiel. Test `player-data-test`. Nog niet: assists, speelminuten en positiespecifieke data.

**De week (26-11, MB-22):** het weekscherm is herordend naar §6: wedstrijdkop met inzet, *On your desk*, *Your plans this week* (acties met de reden uit de clubsituatie), *Running* (vondsten met aanbevelen, jeugd met uitnodigen, afspraken met voortgang, bouw), *Your people* compact en de club ingeklapt. De speelknop zegt tegen wie je speelt. Het eindsignaal heeft *Your week*: wat je acties opleverden. De wedstrijd speelt standaard live af (ongeveer 15 seconden, overslaan of uitzetten kan). Supportersgroepen heten naar hun stad (The Docks, The Mill).

**L3 actief (26-11, MB-21):** op het weekscherm staat *Your people*: TD en trainer met specialiteit, sterren, contract, hoe ze over je denken en wat ze zich herinneren; je zet de signeerlimiet van de TD (klein/middel/groot, met de afweging erbij), verlengt contracten en vervangt staf uit drie kandidaten. Vier staffmomenten: meer mandaat, een andere club wil je mensen (houden kost 25% meer loon, laten gaan levert compensatie en een vacature op), ruzie over een ongebruikte zomeraankoop (de trainer steunen zet de speler op de winterlijst), en de vacature. Gemeten: ongeveer 7 momenten per seizoen, waarvan 1–2 van je staf. Test `l3-people-test`. In de basisbuild (L1/L2) staan de staffmomenten uit.

**Lagen aan (26-11, MB-20):** het gepubliceerde spel bevat L3 (TD-mandaat en verantwoording), L4 (momenten met afspraken, ALV met groepen en moties) en L5 (familie, opvolging). Nieuwe momenten uit gewone seizoensfeiten: de derby (de voorzitter van de rivaal in de krant), een academiespeler die doorbreekt, en de ontevredenste supportersgroep. De wachttijd tussen momenten is 3 weken in plaats van 5; de trainer onder druk komt hoogstens twee keer per seizoen terug. Gemeten over 8 werelden: ongeveer 6 momenten en 1,3 familiemomenten per seizoen (was ruim 4, waarvan 3 keer de trainer). Opgelost: momenten werden aangemaakt maar verborgen achter een onbeantwoorde debrief en vervielen ongezien (NM-013); alle open beslissingen staan nu onder elkaar, en een debrief vervalt na drie weken stilte.

**Stap 2, L1/L2-seizoen (26-11):** verkiezingsavond en de eerste ochtend met de eigen mensen van de club; bij elke wedstrijd het whiteboard met de waarschijnlijke elf (nieuwe spelers en academie gemarkeerd, blessures), de gevaarlijkste man van de tegenstander en de derby met de reden van de rivaliteit; bij het eindsignaal de doelpuntenmakers met hun herkomst (academie, deze zomer gehaald, jouw vondst) en waarom op basis van de kansen; de ALV-uitslag als onthulling (HERKOZEN of WEGGESTEMD tegen de 50%-lijn); je eigen week per activiteit (MB-12). Clubs hebben een historisch transferrecord (NM-011); L5-familiemomenten staan uit tot stap 5.

**Stap 1, eerste zomer (26-11):** het transfercentrum in de echte engine. De week van de TD speelt dag voor dag af op een ticker; daarna verschijnt het bord met deals (stappen, SIGNED- en HIJACKED-stempels). Je praat met de TD over prioriteit en geld; de twee uitzonderingen verschijnen als BREAKING. Deadline day speelt op een klok en eindigt met WINDOW CLOSED. Het winterwindow gebruikt hetzelfde bord en dezelfde ticker. Prototype: `prototypes/first-summer.html`.

**Implementatiestatus eerste zomer (25-11)** — Opening en transferzomer herzien: Implemented, Tested, Playtested (bot, Playwright, 390 px licht en donker). Menselijke playtest nog niet gedaan.

**Test evidence (25-11, herziening eerste zomer)** — Lokaal: `node build.js` slaagt; nieuw `tests/first-summer-test.js` slaagt (manifest vast, plan volgt manifest, geen verborgen transfers in 10 werelden, save/load). Groen gebleven: pyramid, foreign-world, save, ux, base-briefing, smoke, l25, youth, story, slimline (4 seizoenen, 3 seeds), l3, l3-s32, layer-isolation, base-isolation. Browser-playtest (`tests/playtest.js`) bijgewerkt naar de huidige flow en groen in licht en donker. Rood, en al rood vóór deze wijziging: `department-ownership-test` (verwacht het oude homescherm met 13 tegels) en `sim-test` (administratie te vaak: 39 tegen een limiet van 33; vóór de wijziging 41). Geen CI gedraaid.

**Bekende problemen**
| ID | Status | Probleem / volgende actie |
|---|---|---|
| NM-001 | Opgelost (25-11) | Dubbele zomermarkt: bij de start van het seizoen draaide de directeur van de eigen club nog een volledige ronde en dumpten andere clubs spelers bij de speler. Nu geldt MB-18; test `first-summer-test`. |
| NM-002 | Auditkandidaat | Summer clock en persoonlijke activiteiten: beschikbaarheid per zomerweek toetsen. |
| NM-003 | Auditkandidaat | TD-planactualisatie, budgetvalidatie en deadlinebeslissingen: causale keten en behoud van state controleren. |
| NM-004 | Open validatie | V19-economie en strategieverschillen: eerst scope en baseline, geen ongevraagde zware sims. |
| NM-005 | Open validatie | Menselijke spelbeleving van de eerste zomer en L1/L2: prototype en playtest. |
| NM-006 | Operationeel, open | Sinds 25-11 20:10 faalt elke Pages-run (454–456) in `deploy-pages`: het artefact wordt geüpload, maar de deploy vindt het niet ("No artifacts named github-pages"). Build en upload slagen. Niet blijven herstarten; eigenaar kijkt naar Pages-instellingen en GitHub-status. |
| NM-007 | Wacht op eigenaar | `CLAUDE.md` en `AGENTS.md` verwijzen nog naar *The Front Office*. Voorstellen voor MB-11 liggen klaar; de eigenaar past ze zelf toe of geeft Claude daar expliciet opdracht toe. |
| NM-009 | Opgelost (26-11) | `department-ownership-test` controleert nu het weekscherm in plaats van het oude homescherm. |
| NM-010 | Opgelost (27-11) | `sim-test` is groen: 8–13 administraties, 86–87 weggestemde AI-voorzitters in 20 seizoenen. |
| NM-011 | Opgelost (26-11) | Het clubrecord stond bij een nieuwe voorzitter op £0, waardoor bijna elke aankoop op goedkeuring wachtte en verviel. Nu een historisch record per divisie (150/80/45/25/12k). 12 werelden: geen zomer meer zonder aankoop. |
| NM-013 | Opgelost (26-11) | Het weekscherm toonde maar één beslissing tegelijk; een openstaande debrief verborg elk moment, dat na twee weken ongezien verviel. Nu staan alle open beslissingen onder elkaar. |
| NM-012 | Opgelost (27-11) | Geld knelt: zie MB-26 en *Geld (27-11)* hierboven. Verder fijnstellen hoort bij de menselijke playtest. |
| NM-008 | Opgelost (26-11) | MB-12 in de code: een reis neemt de week en sluit de andere reis en een week op de club uit; een data-dag past ernaast, eens per week. Test in `first-summer-test`. |

**Release history**
- 25-11-2026 · V1.1 — documentatie geconsolideerd op `slimline-main` `7147f23` en `main` `cc4c5db` (identieke blob `ecb6ad3`).
- 25-11-2026 · V1.2 — charter, workflow, kwaliteitstoets, roadmap en registers toegevoegd (`b69ea16`, branch `docs/master-bible-v1-2`, niet geïntegreerd).
- 25-11-2026 · V1.3 — herstructurering in vier delen, één besluitenregister, feitelijke correcties; open vragen beslist (MB-11–MB-16). Geen spelwijziging.
- 25-11-2026 · Spel — herziening van de opening en de transferzomer (MB-17, MB-18) op `slimline-main` `f45310e`. Publicatie op `/northmarch/` mislukt (NM-006); speelbaar als privépagina op claude.ai.

**Current work**
- **Afgerond:** herziening van de opening en de transferzomer (fase 1). NM-001 is opgelost.
- **Wacht op eigenaar:** geen open ontwerpvragen.
- **Volgende producttaak:** L1/L2 afmaken met fase 3 en 6: het netwerk van contacten (MB-06) en de balans van de economie (NM-012, NM-010); daarna de menselijke playtest (NM-005) en stap 3 (L3 staf).
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
