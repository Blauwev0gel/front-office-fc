# The Front Office — Dual Expert Codebase Audit V2

**Datum:** 17 november 2026  
**Branch:** `claude-game`  
**Gecontroleerde HEAD vóór rapportcommit:** `b90ee57ea01f41a7355362bf3a08241f8ba405b6`  
**Vergelijkingsbasis:** auditcommit `252e8b7b0cfee9ee7c3b755c84ee17a217f75da1`  
**Methode:** onafhankelijke, gerichte statische code- en documentatie-inspectie. **Geen** browserplaytest, wedstrijd-/seizoenssimulatie, lokale build of uitgevoerde Node-test. Dit rapport schrijft geen spelcode.

> **Bewijslabels:** VERIFIED = rechtstreeks aangetroffen in de bekeken bron; INFERRED = ontwerpconclusie uit de code; UNTESTED = uitvoering of spelerervaring nodig. De cijfers zijn expertinschattingen van de codebase, geen empirische kwaliteitsmetingen. Een **potentiële runtimefout** is zonder uitvoering geen gereproduceerde crash. Regelnummerverwijzingen hebben betrekking op bovenstaande SHA.

## 1. Executive verdict

**De huidige branch heeft een betere CEO-fundering dan tijdens V1, maar autonomie is nog niet causaal betrouwbaar.** Het Grip-mechanisme is verwijderd, willekeurige escalaties zijn versmald tot betekenisvolle voorwaarden, en het spel heeft tests voor deze wijzigingen. Niettemin bestaan er nog concrete breuken tussen wat het spel over een personeelsbesluit zegt en wat de eventeffecten werkelijk doen. Bovendien kan de bevoegdhedenweergave door een achtergebleven functieaanroep falen.

- **Expert A — Game Developer:** **64/100** (V1 66). De afname is een risicocorrectie voor nieuw zichtbare, niet volledig verholpen uitvoeringspaden; het is **geen gemeten verslechtering**.
- **Expert B — Football Expert:** **61/100** (V1 60). Scouting, transfers, coach- en matchsystemen zijn inhoudelijk rijk; tegenstanders en sportieve causaliteit blijven beperkt.
- **Overall:** **63/100** (gelijke weging; indicatief, afgerond).
- **Fase:** technisch uitgebreide alpha, met openstaande kernintegriteitsvragen.
- **B54-verdict:** **GEDEELTELIJK AFGEROND**.

**Topprioriteit:** **Autonomy Integrity / Decision Lifecycle** — maak de uitkomst van autonome beslissingen echt causaal, herstel de bevoegdhedenweergave en geef escalaties en briefs een expliciete afloop.

## 2. Branchstatus, diff en onderzochte bronnen

Ten opzichte van de oorspronkelijke auditcommit staat de gecontroleerde branch **drie commits verder**. De connector vergelijkt 17 gewijzigde bestanden: `BIBLE.md`, `CODEMAP.md`, `OVERZICHT.md`, `notes/PROMPT-ceo-autonomy.md`, `notes/ceo-autonomy.md`, `src/desk.js`, `src/engine/01-core.js`, `src/engine/14-save-api.js`, `src/levers.js`, `src/recruit.js`, `src/style/04-setup-press-firstteam-depts-messages.css`, `src/talks.js`, `src/ui/06-sheets-ticker.js`, `src/ui/07-club-league.js`, `src/ui/13-redbox-render.js`, `test/autonomy.js`, `test/sack.js`.

Gelezen/gericht geïnspecteerd: `CLAUDE.md`, `BIBLE.md`, `CODEMAP.md`, `OVERZICHT.md`, `notes/ceo-autonomy.md`, `notes/PROMPT-ceo-autonomy.md`, `test/autonomy.js`; `src/desk.js`, `src/levers.js`, `src/talks.js`, `src/depts.js`, `src/firstteam.js`, `src/recruitx.js`, `src/summer2.js`, `src/weekflow.js`, `src/weekloop.js`; engine `05-world-selection`, `06-match`, `07-finance-transfers`, `08-weekly-inbox`, `09-meetings-actions-press`, `10-season`, `11-staffwork-analysis-briefs`, `12-week`, `14-save-api`. De UI werd gericht onderzocht via de B54-diff en aanroepen in de renderpaden, niet pixel- of interactief getest. Niet alle modules zijn exhaustief gelezen.

`CLAUDE.md` schrijft voor: eigenaar beslist spelrichting, gamelogica zonder DOM, seeded RNG, mobiele 390px-interface, geen merge naar `main`. Deze audit respecteert die grenzen.

## 3. B54 — grondige herbeoordeling

### 3.1 Grip verwijderd — **OPGELOST / VERIFIED**

`src/levers.js` (nu 65 regels) bevat geen Grip/gain/decay-interventielus meer. `src/engine/14-save-api.js:3` migreert saves van vóór v4 en ruimt `grip`, `gripW`, `gripLog` en `flags.gripWarn` op. `BIBLE.md` besluit B54 bevestigt de ontwerpkeuze.

`test/autonomy.js:12–21` vergelijkt acht rustige weken met een klik-CEO en controleert het ontbreken van Grip-bonussen. **Testcode aanwezig, niet tijdens deze audit uitgevoerd.** De test meet specifiek hooksysteem-effectiviteit en niet of de strategieën sportief of economisch evenwichtig zijn.

### 3.2 Escalaties verklaarbaar — **GROTENDEELS OPGELOST / VERIFIED**

`src/desk.js:52–66` `reason(e,c)` behandelt bovenlimietbedragen, belangrijke spelers, reputatie, korte lijn, koude relatie en een zwakke head met veel geld. De oude toevalsregels voor escalatie zijn verwijderd; nieuwe regels geven een concrete reden.

Belangrijk onderscheid: dit maakt de *routing* uitlegbaar, maar het bewijst niet dat deadlines en fallbacks verstandig werken. Personeelsafhankelijkheid blijft gebaseerd op `auth`, `rel`, `lvl` en eventmetadata.

### 3.3 Personeelsbeslissing versus werkelijk effect — **HOOG RISICO / VERIFIED**

`src/desk.js:39–49` `carry(h)` retourneert `ok`, `win` of `err` op grond van relatieve kwaliteit, bevoegdheid en risicotrek. In `src/desk.js:83–96` wordt echter eerst `const idx = F.autoIndex(m)` bepaald en vervolgens **altijd** `F.resolve(m, idx, s.name)` uitgevoerd. `resolve` roept het normale eventeffect `e.opts[idx].f(m.ctx)` aan (`src/engine/09-meetings-actions-press.js:68–72`). Pas **daarna** volgen `slip(h)` of `gain(h)` en de verklarende tekst.

**Gevolg:** een event dat succesvol een contract, sponsor of personeelswijziging uitvoert, doet dat ook bij een `carry().k === 'err'`. De algemene drift-/reputatiestraf compenseert mogelijk iets, maar is niet een geloofwaardig alternatief voor een onjuist of mislukt operationeel besluit.

Dit is geen claim dat iedere automatische beslissing defect is. Het is wel een **aantoonbare causale ontkoppeling** tussen het succeslabel en het eventeffect. Daarnaast kiest `autoIndex()` nog steeds een bestaande eventoptie, vaak een vaste default; risk/profiel veranderen voornamelijk de *evaluatie na het besluit*, niet de gekozen operationele handeling.

`test/autonomy.js:31–46` test de uitkomsten van `deskCarry()` bij 1.500 aanroepen, **niet** of een werkelijke `H.desk`-afhandeling in het geval `err` tot een bijpassende alternatieve state change leidt.

### 3.4 Waarschijnlijke runtime-regressie — **P0 KANDIDAAT / VERIFIED CODE PATH, UNTESTED CRASH**

`src/desk.js:210` bevat nog `err: Math.round(errChance(h) * 100)` in `authView(h)`. De vroegere `errChance`-functie bestaat niet meer in de geinspecteerde actuele `src/desk.js`, die in B54 is omgebouwd naar `carry()`.

**Waarschijnlijk:** `ReferenceError: errChance is not defined` wanneer de bevoegdhedenweergave dit pad aanroept. Dit is op basis van de module-identiteit een zeer sterk foutsignaal, **maar niet daadwerkelijk gereproduceerd**. Verifieer in sprint 1 dat er geen andere globale definitie bestaat en voer een gerichte render-/functieaanroeptest uit.

### 3.5 Niet reageren blijft te generiek — **ONVOLLEDIG / VERIFIED**

`src/engine/12-week.js:15`: aan het begin van `endWeek()` worden alle open inboxberichten afgehandeld met `resolve(m, autoIndex(m), who)`. Er is geen uniforme, door eventtype geregelde `routine/wait/hard`-lifecycle op dit punt.

`src/engine/11-staffwork-analysis-briefs.js:130–140`: `genBriefs()` vervangt `G.briefs` met de nieuwe kandidaten en laat een eerder onbeantwoorde brief doorgaans verdwijnen, tenzij een specifiek subsysteem dit apart opvangt. `HOOK.deskBriefs` wordt bovendien in een lege `catch` aangeroepen, wat een fout kan maskeren.

**Positieve uitzondering:** `src/talks.js:54–64` heeft een expliciete wachttijd en gerichte `lapse()`-afhandeling voor gespreksverzoeken. Dit patroon is herbruikbaar.

### 3.6 Gesprekken — **GEDEELTELIJK OPGELOST / VERIFIED**

`src/talks.js:97–98, 135–142` vraagt een concrete aanleiding voordat backing/pushing effect heeft: slechte prestaties, fouten of een lopend verzoek. Dit is een verbetering ten opzichte van gratis trust-opbouw. Niet ieder gespreks- en eventpad is hiermee automatisch causale simulatie.

### 3.7 Reguliere event-foutafhandeling — **ONVERANDERD / VERIFIED**

`src/engine/09-meetings-actions-press.js:68–70` markeert de gebeurtenis als voltooid en vervangt een exception uit `e.opts[idx].f` door `The situation resolved itself.`. `src/engine/11-staffwork-analysis-briefs.js:140,150` slikt fouten bij briefverwerking. Daardoor kan de UI succes lijken te tonen terwijl state verandert noch het probleem wordt gerapporteerd.

### 3.8 Eindoordeel B54

**Gedeeltelijk afgerond.** De oude activiteitsprikkel is weg, de routering is beter en veel relevante testcases bestaan. De laatste stap — de juiste functionele gevolgen bij autonome keuzes, weigeringen en fouten — is nog niet degelijk ingevuld. B54 mag niet als volledig afgerond gelden voordat dat pad bewezen klopt.

## 4. Expert A — Senior Game Developer

### Core loop en beslissingskwaliteit

**Positieve codevoorbeelden:**
1. `src/desk.js:32–66`: bevoegdheid en situatie bepalen wie beslist en waarom een verzoek escaleert.
2. `src/depts.js:127–154`: hoofden kiezen hun eigen teamgrootte en aanwervingen binnen budget; bij overschrijding vragen ze toestemming.
3. `src/summer2.js:92–115`: trainerbehoefte, TD-persoonlijkheid, selectiehiaten en budget vormen één transferbrief.
4. `src/recruitx.js:55–112`: dynamische selectieplanning verbindt blessures, contracten, leeftijd en opvolgers met de zomer/winter.
5. `src/talks.js:54–64`: verzoeken van medewerkers hebben een echte wachttijd en verschillende afloop.

**Zwakke codevoorbeelden:**
1. `src/desk.js:83–96`: `carry()`-falen verandert de automatische gekozen optie/effecten niet.
2. `src/desk.js:210`: achtergebleven `errChance()`-referentie in `authView`.
3. `src/engine/12-week.js:15`: alle open events krijgen een uniforme fallback, ook strategische zaken.
4. `src/engine/11-staffwork-analysis-briefs.js:130–140`: open briefs worden overschreven; silent catch.
5. `src/engine/09-meetings-actions-press.js:68–70`: exception kan als afgeronde keuze worden gepresenteerd.

De basisloop DNA → staf → mandaten → zomer/voorseizoen → week/inbox → wedstrijd/Gazette → review bestaat en blijft onderscheidend. De game is nog niet aantoonbaar gebalanceerd voor passieve, actieve en willekeurige CEO's. Sommige keuzes hebben directe state-effecten; andere herinneringen in `src/weekflow.js:154–202` zijn vooral journalistieke echo's.

### Technische beoordeling

De scheiding tussen engine en UI, seeded RNG en een volledige state zijn solide. De keten van `H.seasonAfterMatch`-wrappers in verschillende modules en de stille `catch`-blokken vergroten regressierisico. De nieuwe test `test/autonomy.js` is gericht en bruikbaar, maar mist integratiechecks voor volledig afgehandelde events en specifieke UI-paden.

| Categorie | V2-score /10 |
|---|---:|
| Core loop | 7 |
| Decision quality | 6 |
| Autonome uitvoering | 5 |
| Systeeminteractie | 7 |
| Progressie/balans (zonder sim) | 6 |
| UX-codearchitectuur (geen browsercheck) | 6 |
| Replayability-potentieel | 6 |
| Onderhoudbaarheid en testbaarheid | 8 |

**Expert A-verdict:** de uitvoeringsarchitectuur is sterk genoeg om door te bouwen, maar de zinvolle scheiding tussen CEO, staff en gebeurtenissen is nog niet end-to-end geborgd. Laat de code niet op cosmetische of contentfeatures doorontwikkelen zolang de causale logica en UI-regressie openstaan.

## 5. Expert B — Football Expert & Sporting Director

### Organisatie

`src/firstteam.js` heeft een trainer met eigen voorkeuren, compliance, speelintensiteit, jeugdbeleid en gesprekken; `src/depts.js` laat heads eigen ondersteuners aannemen. Dat klopt beter met een echte voetbalorganisatie dan handmatige XI-bediening door de CEO.

### Technisch beleid en scouting

`src/recruitx.js` biedt continuïteit van contracten, kwetsbare posities, opvolgingsplanning en rekrutering. `src/summer2.js` laat de TD een plan communiceren en financiële randvoorwaarden bespreken. `src/recruit.js` gebruikt onzekerheid in scouting en regionale kennis (eerste audit). Er is beleidsinhoud, maar het plan wordt vaak versimpeld naar positie, rating, leeftijd, budget en een risicoprofiel.

### Wedstrijdmodel

`src/engine/06-match.js:26–125` simuleert wedstrijdblokken met werkelijke spelers in de opbouw, kanscreatie, verdediging en afwerking, xG, vermoeidheid, wissels en kaarten. `src/engine/05-world-selection.js:40–63` gebruikt automatische selectie, coachvoorkeur, moraal en teamkwaliteit. Sterke basis; formaties en voetbalidentiteiten zijn bescheidener dan personeelsdossiers suggereren. Sommige defensieve statistieken worden aanvullend gegenereerd in plaats van uitsluitend als persistent gesimuleerde duel-events.

### Voetbalwereld

`src/engine/06-match.js:17–25` bouwt de tegenstander-XI vanuit teamsterkte en seed; `quickSim()` (`145`) rekent andere competitiewedstrijden op geaggregeerde clubsterkte af. `src/engine/10-season.js:36` bewaart/verwisselt tegenstandercoaches, maar tegenstanders hebben niet hetzelfde persistente contract-/speler-/recruitmentsysteem als de menselijke club. Dat is efficiënt maar beperkt diepgaande rivaliteit.

### Financiën

`src/engine/07-finance-transfers.js:15–20` koppelt het transferbudget aan reserves, kas en het financieel mandaat; doorlopende kosten, sponsoring, kaartverkoop en insolventie bestaan. Of de routevarianten levensvatbaar zijn, blijft **UNTESTED**.

| Categorie | V2-score /10 |
|---|---:|
| Cluborganisatie | 8 |
| Sportief beleid | 7 |
| Trainer/staf | 6 |
| Transfers/scouting | 7 |
| Spelersontwikkeling | 7 |
| Match engine | 7 |
| Financiën | 6 |
| Wereld/rivaliteit | 5 |

**Expert B-verdict:** een interessante voetbalclub met echte sportieve systemen, maar haar eigen bestuurders worden niet consequent afgerekend op de voetbalbesluiten die zij daadwerkelijk nemen. De tegenstanderwereld is bovendien substantieel eenvoudiger.

## 6. Confrontatie

| Onderwerp | Expert A | Expert B | Oordeel |
|---|---|---|---|
| B54 | Fix eerst feitelijke beslissingseffecten | Een TD-fout moet een herkenbare verkeerde voetbalkeuze zijn | Eens — prioriteit 1 |
| Werelddiepte | Technisch duur, gefaseerd | Nodig voor langere carrières | Verdiepen ná autonomie-integriteit |
| Match engine | Goede eventarchitectuur | Nog beperkt tactisch | Gerichte beleidsdoorwerking, niet herschrijven |
| Escalaties | Goede routing, zwakke lifecycle | CEO moet echte uitzonderingen krijgen | Eens |
| Journalistieke echo's | Goede continuïteit | Niet verwarren met sportieve oorzaak | Eens |
| UI | Renderingroute kan crashen | Bevoegdheden moeten begrijpelijk zijn | Regressie eerst herstellen |

De voetbalexpert zou op de middellange termijn rivalen en transferidentiteit verdiepen. De developer ziet onmiddellijke regressierisico's. Beiden kiezen nu **autonomie-integriteit** als eerste sprint: zonder correcte besluiten/uitkomsten heeft extra sportieve diepte een zwakke bestuurlijke basis.

## 7. V1 → V2: tien bevindingen

| V1 # | Oorspronkelijke bevinding | V2 status | Bewijs |
|---|---|---|---|
| 1 | Grip beloont klikgedrag | **OPGELOST** | `src/levers.js`, migratie `engine/14`, B54 |
| 2 | Auto-keuzes en fouten te generiek | **GEDEELTELIJK OPGELOST** | `desk.js:39–96`; `carry` beter, maar effect na `resolve` |
| 3 | Tegenstanders missen persistente spelerswereld | **ONVERANDERD** | `engine/06-match.js:17,145` |
| 4 | Langetermijngevolgen deels tekstueel | **ONVERANDERD** | `weekflow.js:154–202` |
| 5 | Voetbalvisie beperkt vertaald naar profiel/tactiek | **ONVOLDOENDE NIEUW BEWIJS** | `firstteam.js`, `summer2.js`, matchengine; geen gerichte nieuwe diff |
| 6 | Hooks creëren impliciete afhankelijkheden | **ONVERANDERD** | `OVERZICHT.md`, meerdere `H.seasonAfterMatch` |
| 7 | Spelerpersoonlijkheden beperkt in groepsdynamiek | **ONVOLDOENDE NIEUW BEWIJS** | Geen nieuwe gerichte implementatie aangetroffen |
| 8 | Niet alle wedstrijdstats direct eventgebaseerd | **ONVERANDERD** | `engine/06-match.js:99–111` |
| 9 | Fouten kunnen door catches worden verborgen | **ONVERANDERD** | `engine/09:68–70`, `engine/11:140,150` |
| 10 | Meerjarige balans niet bewezen | **ONVOLDOENDE BEWIJS** | Geen run in audit; bestaande notities zijn historisch |

Nieuw na V1: achtergebleven `authView()`-referentie naar `errChance()` en gebrek aan een integratietest voor echte operationele fail-state.

## 8. Tien grootste resterende problemen (gerangschikt)

Schaal impact 1–5. **Kosten** en **risico** zijn grove engineering-inschattingen, geen schattingen in uren of empirisch geteste resultaten.

| # | Probleem | Type | Impact | Kosten | Risico | Evidence |
|---|---|---|---:|---|---|---|
| 1 | `authView` verwijst naar verwijderde `errChance` | Potentiële bug | 5 | Laag | Laag | VERIFIED code; crash UNTESTED |
| 2 | `carry(err)` laat het reguliere operationele eventeffect doorgaan | Systeemintegriteit | 5 | Middel | Hoog | VERIFIED |
| 3 | Onbeantwoorde berichten hebben uniforme auto-afloop | Onvolledige implementatie | 5 | Middel | Middel | VERIFIED |
| 4 | Briefings worden vervangen zonder generieke afhandelingsregel | Onvolledige implementatie | 4 | Middel | Middel | VERIFIED |
| 5 | Auto-keuze uit eventdefault is nog beperkt afhankelijk van profiel | Game design | 4 | Middel/hoog | Hoog | VERIFIED |
| 6 | Silent catches kunnen foutieve state maskeren | Technische schuld / bugrisico | 4 | Middel | Middel | VERIFIED |
| 7 | Langetermijngeheugen gebruikt deels uitsluitend narratieve echo's | Systeemdiepte | 3 | Hoog | Middel | VERIFIED |
| 8 | Tegenstanders missen persistente speler-/transferidentiteit | Voetbalwereld | 4 | Hoog | Hoog | VERIFIED |
| 9 | Sportief beleid heeft beperkte invloed op voetbalprofiel en tactiek | Game design | 4 | Hoog | Hoog | INFERRED |
| 10 | Meerjarige balans en strategieverschillen niet onafhankelijk gevalideerd | Bewijsgat | 4 | Middel | Middel | UNTESTED |

## 9. Drie volgende ontwikkelsprints

### Sprint 1 — Autonomy Integrity & Decision Lifecycle (**AANBEVOLEN**)

**Probleem:** Foutlabels en echte effecten kunnen uiteenlopen; onbeantwoorde dossiers worden generiek verwerkt; één rendererpad heeft een vermoedelijk onbestaande functiereferentie.

**Spelersdoel:** een CEO ziet duidelijke, competente afdelingsbesluiten, met werkelijk verklaarbare successen, mislukkingen, deadlines en verantwoordelijkheid.

**Scope:**
1. Reproduceer en herstel `authView()` / `errChance()`-referentie; voeg gerichte regressietest toe.
2. Inventariseer `autoIndex`, `carry`, `resolve` en event-effecten. Ontwerp een **kleine compatibele contractlaag** die gekozen optie, competentie, risicobesluit, werkelijk effect en verslaglegging correct koppelt; vermijd generiek resultaat achteraf.
3. Geef eventtypen expliciete follow-up/lapse-semantiek (`routine`, `wait`, `hard` of functioneel equivalent), inclusief backward-compatible defaults.
4. Zorg dat open briefs niet verdwijnen zonder uitvoering of gedocumenteerd verval.
5. Repareer silent success-fallbacks in de **aangepakte** betrokken codepaden en voeg testbare foutdiagnostiek toe.
6. Controleer eigenaarschap, éénmalige uitvoering, determinisme, save/load en weekgrenzen.
7. Hergebruik bestaande UI en gesprekken; geen nieuwe meter of scherm.

**Acceptatie:**
- Bevoegdhedenweergave kan zonder exception gegevens voor iedere head ophalen.
- Een **mislukte** autonome keuze voert niet ongemerkt exact dezelfde positieve state change uit als een geslaagde keuze.
- Een geslaagde riskante keuze heeft aantoonbaar een andere state-/uitkomst dan een mislukte riskante keuze, met bijpassende uitleg.
- Alle open dossierklassen hebben een eindige en uitlegbare lifecycle; bestaande saves blijven leesbaar.
- Briefings komen terug, worden aantoonbaar afgehandeld of verlopen met een passend gevolg; niet stil overschreven.
- Eén event veroorzaakt nooit dubbele financiële of personeelseffecten.
- Gericht geteste seeded scenario's zijn deterministisch en de bestaande relevante tests blijven groen.

**Tests:** `test/autonomy.js` uitbreiden met volledige `H.desk`-integratie, `authView`, deadlines, brief-overgang, duplicate-handling, oude saves, negatieve scenario's; relevante bestaande Node-tests en build. Geen browser-/seizoenssim vereist voor **deze audit**, maar een uitvoeringssprint moet zijn eigen relevante tests runnen en de uitkomsten rapporteren.

**Niet doen:** matchengine/recruitment uitbreiden, alle eventbibliotheken herschrijven, meer meters, UI-redesign.

### Sprint 2 — Technical Director as a Coherent Football Executive

**Probleem:** de TD heeft een echte recruitmentpipeline, maar zijn persoonlijke voetbalvisie bepaalt niet altijd consequent plan, targets, afweging en terugkoppeling.

**Spelersdoel:** twee TD's met verschillend karakter en dezelfde selectie stellen aantoonbaar verschillende maar verklaarbare plannen voor.

**Scope:** bestaande `recruit.js`, `recruitx.js`, `summer2.js`, `firstteam.js` afstemmen; selectieprofiel, trainerwensen, risk, contractduur en scoutingonzekerheid volgen één gedeelde rationale. CEO bepaalt grenzen, TD voert uit.

**Acceptatie:** drie gefixeerde stafprofielen leiden tot verschillende reproduceerbare shortlist-/contractkeuzes; transferuitkomst is zichtbaar terug te voeren op beleidskeuze; mandaatgrenzen respecteren; geen handmatige CEO-XI.

**Tests:** seed/beleid matrix, transferwindow, loonplafond, save/load, summer/winter regressies.

**Niet doen:** nieuwe transfermarkt, volledige wereldsimulatie of uitbreiding van tactische schermen.

### Sprint 3 — Persistent Rival Identity (lightweight)

**Probleem:** tegenstanders bestaan primair als clubsterkte met per match gegenereerde spelers.

**Spelersdoel:** belangrijke rivalen hebben herkenbare, door de tijd veranderende coaches, sterren en talenten; de Gazette beschrijft echte veranderingen.

**Scope:** beperkte persistente rivalenstate, kostenbewuste update bij seizoensovergangen, kopspelers/traineridentiteit, doorslag naar matchsterkte; aanvulling op bestaande `genWorld`, `oppSquad`, `quickSim`, `endSeason` en save/load.

**Acceptatie:** bekende rivaal heeft stabiele sterren binnen een seizoen; opvolging/vertrek verandert toekomstig teammodel; promotie/degradatie en saves behouden gegevens; simulatie blijft performant.

**Tests:** deterministische identiteit, seizoenstransitie, save/load, geen dubbele speleridentiteiten en gewenste prestatiegrens.

**Niet doen:** alle clubs voorzien van de volledige menselijke selectie-, academie- en transferengine.

## 10. Aanbeveling en verboden zijpaden

**Als er maar één sprint komt, kies Sprint 1.** Een voetbalmanagementgame draait om het kunnen vertrouwen van besluiten, medewerkers, gevolgen en informatie. Eerst moet de basis kloppen: falen moet falen betekenen, een deadline moet betekenis hebben en het bevoegdhedenscherm mag geen regressie bevatten.

**Nu niet bouwen:** extra willekeurige inboxevents, nieuwe afdelingen, een tweede interventiemeter, handmatige tactieken voor de CEO, een volledige frontendvervanging of een totale rewrite van de matchengine.

## 11. Scorekaart en definitieve uitspraak

| Discipline | V1 | V2 | Toelichting |
|---|---:|---:|---|
| Game Design | 66 | **64** | Grip verwijderd, maar de nieuw blootgelegde integriteits- en UI-regressierisico's beperken vertrouwen |
| Football Simulation | 60 | **61** | Breed voetbalfundament; kernbeperkingen blijven aanwezig |
| Overall | 63 | **63** | Indicatieve gelijkgewogen beoordeling, afgerond |

Deze cijfers zijn **niet empirisch vergelijkbaar als prestatiemeting**: de methode is statische review, geen playtest/simulatie. De positieve verandering aan autonomie is echt, maar het functionele werk is nog niet volledig.

### Definitief verdict

**B54 = gedeeltelijk afgerond.** Niet opnieuw Grip bouwen en niet teruggaan naar klikpunten. Bouw één compacte kwaliteits-sprint die autonome besluiten **daadwerkelijk** laat kloppen, inclusief fout-/succesgevolg, deadlines, briefingovergangen, bevoegdhedenweergave en regressietests. Ga daarna verder met de kwaliteit van de TD en de voetbalwereld.

_Deze audit heeft geen broncode of tests aangepast; de bevindingen zijn gebaseerd op de geinspecteerde HEAD, niet op beweerde testuitvoering._
