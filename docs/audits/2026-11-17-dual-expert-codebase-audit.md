# The Front Office — Dual Expert Codebase Audit

**Datum:** 17 november 2026  
**Repository:** [Blauwev0gel/front-office-fc](https://github.com/Blauwev0gel/front-office-fc)  
**Onderzochte branch:** `claude-game`  
**Methode:** statische broncodeanalyse en documentatie-inspectie; **geen** browserplaytest, uitgevoerde tests of meerjarige simulatie  
**Status:** onafhankelijk, adviserend reviewrapport; geen ontwerpbesluit en geen codewijziging

> **Bewijsstatus:** `VERIFIED` betekent rechtstreeks zichtbaar in de geïnspecteerde code; `INFERRED` is een beredeneerde ontwerpconclusie; `UNTESTED` vereist uitvoering of empirische validatie. Scores zijn subjectieve codebasebeoordelingen, geen metingen van ervaren spelplezier of balans. File/line-verwijzingen betreffen de op 17 november geïnspecteerde `claude-game`-versie en kunnen verschuiven.

## 1. Executive verdict

**Ontwikkelfase: speelbare alpha op basis van geïmplementeerde flows, waarvan de ervaren speelbaarheid niet onafhankelijk is getest.** De codebase bevat een samenhangende kern: centrale state, seeded simulatie, club-DNA, afdelingen, mandaten, recruitment, wedstrijden, financiën en wekelijkse gebeurtenissen. De huidige systemen zijn geen lege placeholders, maar de management-fantasie is niet consequent uitgewerkt: de CEO behoort te sturen door mensen, mandaten en vertrouwen, terwijl het Grip-systeem nog regelmatig zelf ingrijpen beloont.

**Game Design Quality: 66/100. Football Simulation Quality: 60/100. Overall: 63/100** (beide disciplines gelijk gewogen; indicatief en niet playtest-gevalideerd).

**Strategisch verdict:** doorontwikkelen, niet herbouwen. Herontwerp eerst de interactie tussen autonomie, Grip, mandaten en escalaties. Voeg niet eerst meer inbox-events, afdelingen of visuele complexiteit toe.

## 2. Scope en architectuur

Bekeken documentatie: `README.md`, `BIBLE.md`, `CODEMAP.md`. Onderzochte modules omvatten `src/engine/{01-core,02-world-constants,03-players,04-staff-dna,05-world-selection,06-match,07-finance-transfers,08-weekly-inbox,09-meetings-actions-press,10-season,12-week,13-newgame-preseason,14-save-api}.js`, `src/{desk,levers,weekflow,weekloop,firstteam,recruit,recruitx,summer2,depts,matchday}.js` en representatieve UI-/testbestanden. Niet elke regel van alle modules is volledig gecontroleerd; dit is een diepgaande gerichte code-inspectie, **geen exhaustieve security-, test- of code-audit**.

De game gebruikt de centrale toestand `FO.G`, seeded RNG, een build die modules samenvoegt in standalone HTML, en een reeks door modules uitgebreide `FO.HOOK`-functies. Dat vergemakkelijkt systeemontwikkeling, maar maakt de effectieve uitvoeringsvolgorde en het gezamenlijk effect van hooks moeilijker te volgen. Zie `CODEMAP.md` en `src/engine/14-save-api.js`.

### Centrale gameplayloop

Club-DNA → afdelingshoofden → mandaten → zomerbriefing en transferbeleid → voorseizoen/pers → wekelijkse inbox/besluiten → wedstrijd → Gazette/rapportage → seizoensevaluatie. De loop is aanwezig; de kwaliteit van herhaling, pacing en replayability is niet empirisch getest.

## 3. Expert A — Senior Game Developer & Systems Designer

### A1. CEO-fantasie versus activiteitendruk — **HIGH / VERIFIED**

`src/levers.js` regels ca. 12–38: `gripInit()` begint op 60; `gain()` beloont `respond` (+6), brief- en gespreksacties (+3/+5), andere directe keuzes en individuele activiteiten. `H.seasonAfterMatch` verlaagt Grip met vijf per week. `H.effBonus` laat Grip de effectiviteit van personeel beïnvloeden. Lage Grip kan bestuursvertrouwen en relaties verslechteren.

`src/engine/01-core.js` heeft `AP_FREE = 99`, waarmee de eerdere action-point beperking functioneel wordt geneutraliseerd. Toch bestaat via Grip een tweede activiteitsprikkel.

**Interpretatie:** het mechaniek beloont de hoeveelheid interventies; het meet niet direct of de CEO de juiste mensen aannam, een helder mandaat gaf of terecht niet ingreep. Dat is een fundamentele ontwerpfrictie, geen bevestigde codebug. Een goede CEO mag betrokken moeten zijn, maar betrokkenheid moet herleidbaar zijn tot strategie, evaluatie en het oplossen van echte uitzonderingen.

### A2. Autonomie en escalaties — **HIGH / VERIFIED**

`src/desk.js`, ca. regels 18–120, bepaalt wat core-CEO-zaken zijn, welke bevoegdheden personeel heeft (`auth`, `limit`), en waarom een dossier escaleert (`reason`). De head kan routinebesluiten automatisch verwerken via `H.desk` en `H.deskBriefs`; een foutkans (`errChance`) kan een alternatieve eventoptie laten kiezen. Bij hoge autonomie neemt die kans voor bepaalde besluiten toe.

**Sterkte:** operationeel onderscheid tussen routinebesluiten en bestuurlijke uitzonderingen; er zijn gevolgen in log en state.

**Zwaktes:** een deel van de beslisautonomie is gebaseerd op vaste defaultopties en een generieke foutkans, niet primair op concrete doelen, waarden en kennis van een specifiek afdelingshoofd. Meer autonomie kan daardoor lijken op 'meer willekeurige fouten' in plaats van eigenzinnig maar herkenbaar professioneel gedrag.

### A3. Inbox — **MIXED / VERIFIED + INFERRED**

`src/engine/08-weekly-inbox.js` gebruikt voorwaarden, cooldowns, gewogen selecties, queued follow-ups, verplichte dossiers en automatische routine-events. `src/weekloop.js` past druk en recency-gewichten aan; `src/weekflow.js` bewaakt thema's en rustige weken.

De technische routing is duidelijk meer dan een kale random-eventlijst. Tegelijk blijven veel gebeurtenissen vooraf gedefinieerde situaties. Of de speler ze als organisch en voldoende verschillend ervaart, is **UNTESTED**.

### A4. Geheugen en consequenties — **MIXED / VERIFIED**

`src/weekflow.js` ca. 151–203 bevat `ECHO`, `G.mem`, `recall` en vertraagde Gazette-echo's. De oorspronkelijke eventopties kunnen echte state changes hebben; latere echo's bestaan geregeld uit narratieve terugblikken zonder nieuwe structurele state-effecten. Dit is waardevol voor sfeer, maar mag niet worden verward met causale, langetermijngevolgen in onderliggende systemen.

### A5. Architectuur en foutafhandeling — **MEDIUM / VERIFIED**

`CODEMAP.md` documenteert veelvoudig wrappen van `HOOK`-functies, waaronder `seasonAfterMatch` en `effBonus`. Wijzigingen kunnen impliciete effecten hebben door afhankelijkheden en volgorde. `src/engine/09-meetings-actions-press.js` `resolve()` vangt uitzonderingen bij eventeffecten op met de tekst 'The situation resolved itself.' en markeert de beslissing als afgehandeld; dit kan programmalogische fouten verhullen. Save/load werkt via een eenvoudige JSON-state en migraties in `src/engine/14-save-api.js`; actuele regressieprestaties zijn **UNTESTED**.

### Expert A scorekaart

| Categorie | Score /10 |
|---|---:|
| Core gameplay loop | 7 |
| Betekenisvolle beslissingen | 6 |
| Decision engine | 7 |
| Systeeminteractie | 7 |
| Progressie en balans | 6 |
| UX-architectuur (zonder browservalidatie) | 6 |
| Replayability-potentieel | 6 |
| Technische architectuur | 8 |

**Expert A verdict:** dit is meer dan een verzameling ongekoppelde features, maar nog geen volledig consequente game over leidinggeven. De game beloont deels verkeerd CEO-gedrag.

## 4. Expert B — Football Expert & Sporting Director

### B1. Cluborganisatie — **STRONG / VERIFIED**

`src/depts.js` laat afdelingshoofden personeel aannemen binnen begroting en bevoegdheid; `src/desk.js` modelleert escalaties; `src/firstteam.js` laat de trainer eigen voorkeuren en een relatie tot het mandaat ontwikkelen. De CEO kiest niet direct het elftal. Dat is inhoudelijk passend bij het concept.

### B2. TD en selectieplanning — **PROMISING / VERIFIED + INFERRED**

`src/recruit.js` bevat scouting met onzekerheidsmarges, regionale kennis, prospectprofielen en recruitmentfases. `src/recruitx.js` maakt winter- en zomerplannen met contractrisico, leeftijd, blessures, opvolging en automatische verlengingen. `src/summer2.js` brengt coachwensen, TD-risicohouding, selectiehiaten en budget samen.

**Beperking:** veel beleidsverschillen worden vertaald naar posities, ratings, leeftijd en budget. De doorwerking van een volledige voetbalfilosofie op spelersprofielen en het spel op het veld is relatief beperkt. De ernst van dat probleem als spelerservaring is **INFERRED**.

### B3. Spelers en jeugd — **PROMISING / VERIFIED**

`src/engine/03-players.js` definieert 14 attributen, positional fit, potentieel en persoonlijkheid. `src/engine/08-weekly-inbox.js` `develop()` gebruikt leeftijd, speeltijd, coach, faciliteiten en professionaliteit. Er is dus echte ontwikkeling, niet enkel verhalende tekst. Brede kleedkamerrelaties en groepsdynamiek zijn minder duidelijk doorontwikkeld in de onderzochte code.

### B4. Match engine — **STRONG BASE / VERIFIED**

`src/engine/06-match.js` simuleert negentien vijfminutenblokken met deelnemende spelers in opbouw, creatie, verdediging en afwerking, plus doelpuntenkansen/xG, score-effecten, rode kaarten, vermoeidheid, wissels, blessures, ratings en statistieken. `src/engine/05-world-selection.js` kiest automatisch een XI via posities, kwaliteit, coachvoorkeur en jeugd/rotatie.

Beperking: een vaste positionele XI-structuur en vrij compacte tactische modifiers leveren nog geen rijke tactische identiteit. Extra tackles/intercepties worden deels aanvullend gegenereerd naast de eigenlijke aanvalsketens. `whyLines()` baseert de matchuitleg onder meer op echte score-/xG-/kaartfactoren, maar vormt geen volledige tactische causaliteitsanalyse.

### B5. Tegenstanders — **HIGH / VERIFIED**

De eigen club heeft persistente spelers, contracten en selectieplanning. `src/engine/06-match.js` `oppSquad()` construeert een tegenstander-XI vanuit clubsterkte voor een wedstrijd, en `quickSim()` simuleert andere competitiewedstrijden vanuit clubsterkte en Poisson-doelpunten. Tegenstanders hebben wel persistente clubsterkte, vorm en een coach, maar geen vergelijkbaar volledig persistente spelersorganisatie als de menselijke club.

Dat beperkt het potentieel voor langetermijnrivaliteit en betekenisvolle veranderingen in andermans selectie, ook als het een verdedigbare performance-afweging is.

### B6. Voetbalfinanciën — **ADEQUATE / VERIFIED**

`src/engine/07-finance-transfers.js` relateert transferbudget aan cash, reserves, salarissen en het financiële mandaat. Er zijn sponsor-/ticketinkomsten, doorlopende kosten en faillissementsrisico's. De abstractie is acceptabel voor een compacte managementgame, mits de trade-offs merkbaar blijven; dat laatste is **UNTESTED**.

### Expert B scorekaart

| Categorie | Score /10 |
|---|---:|
| Realisme cluborganisatie | 8 |
| Technisch beleid | 7 |
| Trainer en staf | 6 |
| Transfers en scouting | 7 |
| Spelers en jeugdontwikkeling | 7 |
| Wedstrijdsimulatie | 7 |
| Voetbalfinanciën | 6 |
| Voetbalwereld en -beleving | 5 |

**Expert B verdict:** een redelijk rijk voetbalmodel voor de eigen club, maar de omliggende wereld en de sportieve overtuigingen van personeel zijn minder diep gesimuleerd.

## 5. Confrontatie

| Thema | Game developer | Voetbalkenner | Gezamenlijke conclusie |
|---|---|---|---|
| Autonomie | Activiteit wordt te veel beloond | CEO moet mensen beoordelen, geen routine uitvoeren | **Prioriteit 1** |
| Personeel | Generieke auto-keuzes en foutkansen | Eigen voetbalvisie moet beslissingen sturen | Ontwikkel herkenbare beleidsagenten |
| Transfers | Pipeline en deadlines goed gekoppeld | Profiel/voetbalvisie nog te zwak | Koppel strategie aan selectieplanning |
| Match engine | Rijke eventstructuur | Beperkte tactische differentiatie | Verbeter beleidsdoorwerking, geen totale rewrite |
| Herinnering | Goede narratieve laag | Historie moet het voetbal beïnvloeden | Onderscheid verhaal van structureel gevolg |
| Tegenstanders | Efficiënte approximatie | Beperkte persistente voetbalwereld | Lichte persistentie is waarschijnlijk zinvol |

**Verschil van inzicht:** de developer wil eerst Grip/autonomie herstellen; de voetbalkenner wil meer persistente voetbalwereld. Gezamenlijke prioriteit gaat naar het CEO-model: meer voetbalinhoud helpt minder als het spel verkeerde bestuurlijke handelingen stimuleert.

## 6. Top tien bevindingen

| # | Bevinding | Ernst | Bewijs | Aanpak |
|---|---|---|---|---|
| 1 | Grip beloont frequent persoonlijk ingrijpen | Hoog | VERIFIED | Herontwerp |
| 2 | Automatische keuzes/fouten zijn deels generiek | Hoog | VERIFIED | Herontwerp |
| 3 | Tegenstanders missen een gelijkwaardig persistent spelersmodel | Hoog | VERIFIED | Gerichte uitbreiding |
| 4 | Sommige langetermijngevolgen zijn hoofdzakelijk tekst | Hoog | VERIFIED | Sterker koppelen |
| 5 | Voetbalvisie vertaalt zich beperkt naar profielen en spel | Hoog | INFERRED | Verdiepen |
| 6 | Hooks scheppen impliciete onderlinge afhankelijkheden | Middel | VERIFIED | Hardening/testdekking |
| 7 | Spelerpersoonlijkheden vormen beperkt groepsdynamiek | Middel | INFERRED | Verdiepen |
| 8 | Niet alle wedstrijdstatistieken komen direct uit events | Middel | VERIFIED | Bewust modeldocumenteren |
| 9 | Stilzwijgende event-fallbacks kunnen fouten maskeren | Middel | VERIFIED | Diagnostiek |
| 10 | Meerjarige balans/replayability niet onafhankelijk onderbouwd | Middel | UNTESTED | Later valideren |

## 7. Beschermen bij verdere ontwikkeling

1. CEO bestuurt indirect: **nooit rechtstreeks XI of tactische wissels kiezen**.
2. Zelfstandige TD, scoutingpipeline, zomerbriefing en selectieplanning.
3. Spelergebaseerde, eventgedreven match engine.
4. Gedeelde, seeded simulatielogica en modulaire source-build.
5. Gazette, player milestones en clubgeschiedenis.

## 8. Ontwikkelprioriteiten

1. **Autonomie, Grip en escalaties als één systeem ontwerpen.** Goede mensen met goede mandaten moeten autonoom presteren; CEO krijgt betekenisvolle uitzonderingen, evaluaties en koerskeuzes, geen klikplicht.
2. **Medewerkers duurzaam laten handelen vanuit eigen beleid.** TD, coach en heads volgen herkenbare voorkeuren, competenties en ambities.
3. **Structurele consequenties scheiden van narratieve echo's.** Besluiten veranderen waar zinvol toekomstige mogelijkheden, relaties of uitvoering.
4. **Lichte persistente identiteit voor belangrijke tegenstanders.** Trainers, kernspelers en ontwikkeling over seizoenen.
5. **Sportief beleid explicieter door laten werken in de match engine.** Geen CEO-tactiekbediening.

**Niet nu bouwen:** nog meer afdelingen, willekeurige inboxevents, algemene action-point-systemen, grotere menu's of een cosmetische totaalredesign.

## 9. Prioriteit 1 — ontwerpgrenzen en acceptatie

Deze audit doet **geen** definitief implementatievoorstel. Een opvolgende sprint moet eerst de werkelijke paden in `levers.js`, `desk.js`, `weekflow.js`, `weekloop.js`, `engine/09-meetings-actions-press.js`, `engine/12-week.js`, `depts.js` en relevante UI-/testbestanden inventariseren.

Een geslaagde herziening moet aantoonbaar maken dat:

- een competente head met voldoende mandaat de normale werkzaamheden zonder CEO-klikken uitvoert;
- passief leiderschap niet automatisch gelijkstaat aan slecht leiderschap;
- niet reageren op een **echte, gemotiveerde strategische escalatie** een geloofwaardig gevolg heeft;
- de speler niet door middel van spam-/dummy-interacties collectieve personeelseffectiviteit kan verhogen;
- meer autonomie herkenbaar gedrag en proportionele risico's veroorzaakt, niet enkel een hogere willekeurige foutkans;
- beslissingen één keer worden uitgevoerd, en zichtbaar worden toegeschreven aan de juiste eigenaar;
- bestaande beslissingen, tijdlijn, opslaan/laden en spelverloop behouden blijven;
- geautomatiseerde tests ook negatieve gevallen en determinisme controleren.

## 10. Grenzen van dit rapport

Er is op verzoek **geen** browserplaytest of seizoenssimulatie uitgevoerd. Er zijn in deze auditsessie ook geen builds/tests gerund. UX-scores, balans, pacing en daadwerkelijk spelplezier kunnen uit broncode alleen niet met zekerheid worden vastgesteld. Claims over teststatus uit bestaande README of spelbijbel zijn geen onafhankelijk bewijs. Het rapport introduceert geen commits aan de gamecode en is geen toestemming om ontwerpbesluiten zonder review te wijzigen.

**Einduitspraak:** maak van The Front Office eerst een spel over het bouwen en beoordelen van een autonome voetbalorganisatie, in plaats van een spel dat regelmatige persoonlijke interventie als proxy voor goed CEO-leiderschap gebruikt.
