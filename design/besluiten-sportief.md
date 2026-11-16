# Besluiten sportieve organisatie

Werklijst voor alle problemen uit `design/analyse-sportief.md` (**A**) en `design/analyse-structuur-sportief.md` (**S**).
De eigenaar beslist per ronde; daarna wordt gebouwd. Echte ontwerpbesluiten gaan ook naar het besluitenlog in `BIBLE.md`.

Status: **open** · **besloten** · **gebouwd** · **getest**. Type: bug · misleidend · dubbel · ontwerp · balans · opschonen.

## Ronde 1 — Repareren

| Id | Probleem | Bron | Type | Status |
|---|---|---|---|---|
| R1 | De mini-kop breekt op People, Data en Decisions: het bevoegdheidsblok wordt in de kop geperst ("H C", "Sho leas"). | S §3.3 | bug | getest |
| R2 | Het budgetsegment toont "Lean" bij een budget onder Lean (Recruitment £90 tegenover £195). | S §3.3 | misleidend | getest |
| R3 | "Wrong calls: frequent" (voorspelde kans) staat naast "0 against your mandate" (werkelijke telling). | S §3.3 | misleidend | getest |
| R4 | De grade-badge van een kandidaat toont de huidige grade, de tekst de grade van toen (D tegenover "grade B"). | S §3.3 | misleidend | getest |
| R5 | Coach-afspraken met een deadline na week 34 lopen nooit af ("Top two", laat "youngsters"/"top half"). Daarna kan er nooit meer een target worden afgesproken. | A §4.2 | bug | getest |
| R6 | "Loan him out" en "One more season" in *Is he ready?* worden aan het seizoenseinde teruggedraaid door het academiemandaat. | A §4.4 | bug | getest |
| R7 | Het ontslagsheet van de coach toont andere effecten op board, press en relaties dan er werkelijk gebeuren. | A §4.2 | misleidend | getest |
| R8 | De hint "Back the coach: recruitment more conservative" (coach–DoF-clash) belooft een effect dat niet bestaat. | A §4.1 | misleidend | getest |
| R9 | De push "First team" belooft "Squad morale up", maar heeft geen effect op morale. | A §6 | misleidend | getest |
| R10 | "Next trial day in week 28" staat er ook na week 28. | S §3.3 | bug | getest |
| R11 | Het label "Academy players protected in squad" suggereert speeltijd; de regel beschermt alleen tegen verkoop. | A §4.4 | misleidend | getest |
| R12 | De bijbel (§9.2) zegt dat de tests de zomer via v1 draaien; ze draaien al via v2. | A §3 | misleidend (doc) | getest |

## Ronde 2 — Structuur van een afdeling

| Id | Probleem | Bron | Type | Status |
|---|---|---|---|---|
| T1 | De tabs (Overview, People, Data, Decisions) zijn bakken voor soorten inhoud, niet antwoorden op vragen. Voorstel: Now / Plan / People / Record. | S §4.1 | ontwerp | getest |
| T2 | De status-chip ("2 to fix") en "5 need attention" zeggen niet wat er mis is. Een rode rij buiten de eerste vier tegels is onzichtbaar. | S §3.1 | misleidend | getest |
| T3 | "All numbers" herhaalt de KPI-tegels. | S §3.2 | dubbel | getest |
| T4 | "Full academy report" is een tweede academiescherm in het eerste. | S §3.2 | dubbel | getest |
| T5 | Recruitment Data is ongeveer 3.000 px, met dezelfde signings in drie lijsten. | S §3.2, §3.5 | dubbel | getest |
| T6 | De regio's staan vier keer (kaart, focuschips, tripchips, mandaat). | S §3.5 | dubbel | getest |
| T7 | Het budget heeft twee bedieningen: een schuif van 0–100 in het mandaat en een knop met drie standen. | S §3.5 | dubbel | getest |
| T8 | Kale getallen zonder schaal of oordeel (relatie 44, "Follows mandate 71%", netwerk 21/100, ±1.7★, categoriescore). | S §3.4 | ontwerp | getest |
| T9 | "Holding it back" (oorzaak plus knop) staat verstopt op de Data-tab. | S §3.1 | ontwerp | getest |
| T10 | Een inboxbericht linkt niet naar de afdeling. | S §3.7 | ontwerp | getest |
| T11 | Wat een hoofd namens de CEO besliste, is alleen een telling ("16 staff calls"). | S §3.7 | ontwerp | getest |
| T12 | Het statuswoord weegt de rijen niet ("Good" op de 11e plek). | S §3.3 | misleidend | getest |
| T13 | Dezelfde instelling kost via de ene route 1 AP en via de andere niets (mandaat, chips, budget, debrief). | A §4.1, S §2 | ontwerp | getest |
| T14 | "+25 vs your mandate" en "Friction" zeggen niet wat het kost. | S §3.1 | ontwerp | getest |
| T15 | Talk en Sack staan in de kop op elke tab; het coachgesprek staat twee keer. | S §3.5 | dubbel | getest |

## Ronde 3 — Rollen en eigenaarschap

| Id | Probleem | Bron | Type | Status |
|---|---|---|---|---|
| O1 | De Chief Scout zit half tussen eigen afdeling en DoF-staf in (eigen mandaat en gesprek, geen bevoegdheid, KPI of inbox). | A §3, §4.3 · S §3.6 | ontwerp | getest |
| O2 | Medical bestaat alleen als push zonder eigenaar. | A §3 | ontwerp | getest |
| O3 | Proefdag: de briefing belooft dat de CEO kinderen kiest, het scherm laat dat niet toe. Mag de CEO dat überhaupt (P1)? | A §4.4 · S §3.3 | ontwerp | getest |
| O4 | "Give him minutes" negeert de wil van de coach (P7). | A §4.2 | ontwerp | getest |
| O5 | Zes routes voor jeugdminuten, verspreid over vijf schermen. | A §5 · S §3.6 | ontwerp | getest |
| O6 | Bij "blocked by rule" is niet zichtbaar welke regel van de DoF is en welke van Finance. | A §4.1 · S §4.3 | ontwerp | getest |
| O7 | Het academiemandaat bevat eerste-elftalzaken (beschermde spelers, mentoren). | S §3.6 | ontwerp | getest |
| O8 | Hoeveel academiediepte hoort op de telefoon (jeugdtabellen, jeugdstaf, Youth Cup)? | S §7 | ontwerp | getest |

## Ronde 4 — Doorwerking en balans

| Id | Probleem | Bron | Type | Status |
|---|---|---|---|---|
| D1 | Het DoF-schuifje Scout's eye ↔ Data doet niets in de live pipeline; de persoonlijkheid (LEAN) van de DoF hangt eraan. | A §4.1 | balans | open |
| D2 | De scout-schuifjes Proven ↔ Potential en Data zijn dood; zijn LEAN hangt eraan. Rapporten negeren boost, grip en staf. Na O1 heeft de scout geen eigen mandaatsheet meer: "Proven ↔ Potential" moet hier naar het Recruitment-mandaat verhuizen én gaan werken. | A §4.3, O1 | balans | open |
| D3 | De DoF-attributen Judgement en Network doen (bijna) niets. | A §4.1 | balans | open |
| D4 | Geen van de vier coachschuifjes verandert punten; "your way" is gratis relatie. | A §4.2 | balans | open |
| D5 | Grip beloont klikken en bestraft delegeren. | A §5 | balans | open |
| D6 | Academy credibility heeft geen gevolg. | A §4.4 | balans | open |
| D7 | Hits en misses gaan altijd naar de DoF, ook als de scout misleest. | A §4.3 | ontwerp | open |
| D8 | Clash-uitkomsten zijn alleen relatie ±. | A §5 | ontwerp | open |
| D9 | De scout heeft geen moment in het seizoen; de DoF is stil tussen de windows. | A §4.1, §4.3 | ontwerp | open |
| D10 | De DoF-waarschuwing in de debrief (`dofStrikes`) wordt nergens gebruikt. | A §4.1 | ontwerp | open |
| D11 | "Question the misses: data focus up" verschuift een dood schuifje. | A §4.1 | misleidend | open |
| D12 | Lage trainingsintensiteit lijkt dominant (minder blessures, gelijke punten). | A §4.2 | balans | open |
| D13 | `test/audit.js` laadt loop, dossiers, pathway en matchday niet; de stijl "active" kiest wat de staf kiest. De audit meet zo geen CEO-oordeel. | A §5 | opschonen | open |

## Ronde 5 — Hoofden verantwoordelijk, gesprekken in plaats van een lijst

Huidige stand (code): de CEO neemt staf onder elk hoofd zelf aan (`depts.js` `hireStaff`, People-tab, "0 of 2 staff" in `vDepts`), betaalt vier weken loon als tekengeld en ontslaat via "Let go". De aandachtslijst komt uit `depts.js` `attention()`. Gesprekken bestaan als coach-scènes (`firstteam.js`), een algemeen talk-sheet met vijf tonen (`engine/09` `talk`), briefings (`defineBrief`), de pathway- en zomervergadering.

| Id | Probleem / keuze | Type | Status |
|---|---|---|---|
| H1 | De CEO huurt staf onder elk hoofd zelf in; dat hoort bij het hoofd. | ontwerp | getest |
| H2 | Hoe kiest een hoofd zijn staf (kwaliteit, persoonlijkheid, budget)? | ontwerp | getest |
| H3 | "Needs you" is een lijst van de game, niet een stem van het hoofd (herziet een deel van B12). | ontwerp | getest |
| H4 | Status-chip, "N need attention" en "0 of 2 staff" in de afdelingslijst. | ontwerp | getest |
| H5 | Wat kost een gesprek, en hoe blijft een week kort (B3)? | ontwerp | getest |
| H6 | Eén gespreksmotor voor alle hoofden, met de coach-scènes als model? | ontwerp | getest |
| H7 | Oude saves met door de CEO aangenomen staf. | migratie | getest |

## Buiten deze rondes (fase 2, opschonen)

| Id | Probleem | Bron | Status |
|---|---|---|---|
| X4 | Dode code na ronde 5: het talk-sheet met vijf tonen (`vSheet` 'talk', acties `talk-who`/`talk-do`, `F.talk`), de acties `dcand`, `dletgo`, `ysack` en de kandidatensheet voor staf. | ronde 5 | open |
| X1 | Dode delen van `summer.js` (`sumRound`, `sumPending`, `sumAnswer`, `sumStep`, de oude `sumAuto`, `sumMigrate`). | A §3 | open |
| X2 | Onbereikbare `resBuy`-UI van het eerste elftal (`ft-buy`). | A §4.2 | open |
| X3 | `vAcademy` wordt dode code zodra T4 gebouwd is. | S §4.4 | gedaan in ronde 2 (`vAcademy`, `vAcademy2` en `vRecruit2` vervangen) |

## Ontwerpnotities

### Ronde 1 (besloten 15-11-2026)
Alleen reparaties, geen nieuwe state behalve twee veilige velden: `p.loanCEO` (academiespeler) en `deal.s` (seizoen van een coach-afspraak).
- R2: het budget krijgt de toestand "Cut" onder Lean (`business.js` `lvOf`); geen knop licht dan op en de rij zegt "Cut below Lean".
- R5: targets worden uiterlijk in week 34 afgerekend; opties die niet meer kunnen, verschijnen niet; buiten het seizoen geen targets; oude afspraken met een deadline na week 34 of uit een vorig seizoen worden bij het laden opgeruimd (`firstteam.js` `ft()`).
- R8/R9: teksten aangepast aan wat er gebeurt; echte gevolgen van clashes volgen in ronde 4 (D8).
- Getest: build, alle `node test/*.js` (incl. `mig.js` en een kleine `audit.js`), een scriptcheck van de afspraken (top two, youth laat, top half, unbeaten, oude save), screenshots op 390 px licht en donker.


### Ronde 2 (besloten 15-11-2026; B12–B14)
Doel: elke afdeling beantwoordt dezelfde vier vragen, elk gegeven staat op één plek (P4, P5, B3). Geen nieuwe meters.
- **Tabs** Now / Plan / People / Record voor alle zes afdelingen (`ui/08-departments.js` `vDept`). Oude tab-sleutels in een save worden omgezet (`DTAB_OLD`).
- **Now:** volledige kop met alleen Talk, een oordeel in woorden (`F.deptVerdict`), maximaal drie aandachtspunten met oorzaak en knop (`F.deptAttention`, in `depts.js`), "Waiting for you", vier tegels met woorden, en voor First team de vorm.
- **Plan:** mandaat (First team: "your mandate vs what he does", met een prijs per rij), knop "Change mandate · 1 action", afspraken, Recruitment-regels en één regiokaart (focus en trip per regio), proefdag, bevoegdheid, budget, faciliteiten, projecten.
- **People:** hoofd met Sack, Chief Scout (met Talk; zijn mandaat staat op Plan), staf, open rollen, jeugdstaf (Academy), stafwissels.
- **Record:** First team (positielijn, selectie door zijn ogen, fitness); Recruitment (één pijplijnlijst, "Signed this season" met oordeel en fee, scouts); Academy (vier vragen, jeugdcompetities ingeklapt); voor elk hoofd "What he decided for you".
- **Chip** in de kop: "N to look at" of het oordeel; tikken opent Now. De afdelingslijst gebruikt dezelfde status.
- **Woord plus getal:** relatie (close/good/cool/cold), mandaat volgen (closely/mostly/loosely), netwerk (Strong/Workable/Thin/Barely there), nauwkeurigheid (Sharp/Fair/Rough), afwijking van het mandaat ("His own way (+25) · costs trust").
- **Kosten:** het mandaatsheet toont geen budget en geen regio's meer; die staan gratis op Plan. Opslaan van het mandaat kost 1 actie en laat budget en regio's ongemoeid.
- **Inbox:** elk bericht en elke briefing van een hoofd heeft "Open {afdeling}". De desk bewaart per hoofd de laatste 8 zelf genomen besluiten (`G.desk.by[h].hist`, veilige default); triviale "Noted"-briefings tellen niet mee.
- Opgeruimd: "All numbers", "Full academy report", `vAcademy`, `vAcademy2`, `vRecruit2`, de oude netwerkkaart en de dubbele regiochips.
- Getest: build, alle `node test/*.js` (incl. `mig.js`), screenshots van alle tabs van de drie sportieve afdelingen op 390 px in licht en donker, en de link uit een bericht gerenderd. Niet gedraaid: `test/browser/playtest.py` (de Python-module van Playwright ontbreekt hier).

### Ronde 3 (besloten 15-11-2026; B15–B17)
- **O1 Chief Scout = tweede stem binnen Recruitment.** Geen apart mandaatsheet meer; op People Talk én Sack. Regio's en budget staan op Plan. Het verhuizen van "Proven ↔ Potential" naar het Recruitment-mandaat gebeurt in ronde 4 samen met het laten werken (D2), zodat er geen dode knop verhuist.
- **O2 Medical:** dezelfde push, nu als knop op First team Plan ("Medical push · 1 action"); in het push-sheet heet hij "First team: medical".
- **O3 Proefdag:** de CEO kiest het criterium (Trust the recruiters / Local lads first / Ready soonest), de recruiters kiezen de kinderen (`academy3.js` `pickBy`). De briefing gaat altijd naar de CEO (`desk.js` `CEO_B`). Zonder antwoord gaan de recruiters na twee weken voor de hoogste potentie. Plan toont de keuze en het verslag van de vorige proefdag.
- **O4 "Give him minutes"** is een verzoek: de coach doet het met kans gelijk aan zijn mandaatvolgzaamheid (gemeten: 25 ja, 15 nee bij gemiddeld 0,73). Een weigering verschijnt in het gesprek en vier weken op Now (`G.ft.refused`, veilige default).
- **O5 Jeugdminuten:** op First team Plan één blok "Youth minutes" met de actieve bronnen (mandaat en hoe hij het speelt, pathway-afspraak, target, verzoeken) en het resultaat (U21-starts per wedstrijd).
- **O6/O7 Eigenaar van regels:** "Blocked by the wage cap (Finance)" of "… the age limit (DoF mandate)"; de aandachtspunten verwijzen naar het juiste mandaat. De twee academieregels blijven in het academiemandaat en staan ook op First team Plan.
- **O8:** academiediepte blijft zoals na ronde 2.
- Getest: build, alle `node test/*.js`, scriptcheck van de drie proefdagcriteria en van de weigerkans, screenshots op 390 px licht en donker (week 28–30).

### Ronde 5 (besloten 15-11-2026; B18–B19, herziet B12)
- **H1/H2 Hoofd beheert zijn staf** (`depts.js` `staffWant`, `headHire`, om de week): het aantal volgt het budgetniveau (Cut 0, Lean 1, Normal 2, Invest alle plekken), +1 bij grote ambitie, −1 bij een voorzichtig hoofd. Hij kiest de rol die zijn zwakste attribuut versterkt (First team: fitnesscoach bij veel blessures); een sterk hoofd kiest de betere kandidaat. Boven zijn bedragslimiet (`F.deskLimit`) vraagt hij het in een gesprek; niet als de kas krap is. Te veel staf voor het budget: hij laat de zwakste gaan. Alles komt als regel in People → Recently. De CEO kan geen staf meer aannemen of ontslaan; "Replace" bij de jeugdstaf is weg.
- **H3/H5/H6 Gesprekken** (`talks.js`, nieuw): verzoeken uit de echte staat (mandaatafwijking, koude relatie, selectie onder niveau, regels van de DoF, de wage cap van Finance, een dun netwerk voor de scout, academiebudget, welzijn, minuten voor jeugdspelers, stafaanvraag). Max. één verzoek per hoofd, drie weken rust na afloop, verloopt na twee weken ("he decides himself", in Record). Gesprekken zijn gratis; grip alleen bij een fris gesprek. De coach houdt zijn eigen scènes; de motor opent ze. Het talk-sheet met tonen is vervangen.
- **H4 Afdelingslijst:** per afdeling het oordeel en "Wants a word"; de kop telt wie je wil spreken; "His staff: n" in plaats van "0 of 2 staff".
- **H7 Oude saves:** bestaande staf blijft en valt onder het hoofd. Nieuwe state met veilige defaults: `G.convo`, `G.staffAsk`.
- Gemeten (16 runs × 3 seizoenen, gematchte seeds, actieve auditstijl), nu tegenover de vorige commit: staf per club in week 30 5,9 tegenover 0; punten per wedstrijd 1,78 tegenover 1,73 (ruis); eindkas £149k tegenover £133k; negatieve kas 10 tegenover 9 runs; verzoeken 4,4 per seizoen per club.
- Getest: build, alle `node test/*.js` (incl. `mig.js`; `talks.js` toegevoegd aan `test/audit.js` en `tools/auditlib.js`), screenshots op 390 px licht en donker (afdelingslijst, Now met verzoek, People, een gesprek). Tijdens de test gevonden en gerepareerd: de gesprekstray werd alleen bij First team getoond.

### Inbox: versturen en second opinion (besloten 16-11-2026; B20)
- Antwoorden: tik een antwoord aan (het wordt gemarkeerd), dan Send; direct verstuurd, geen opstelscherm, geen 3 seconden "Sending…", geen Undo. Big decisions houden "Hold to send". (`ui/13-redbox-render.js` `replyDock`, `mailSend`; opstelscherm en wachttijd verwijderd.)
- Second opinion: wordt gratis meegegeven als het bericht binnenkomt (`engine/08` `addMsg`, één keer berekend voor de determinisme) en staat bovenaan het antwoordblok met gezicht, naam en rol. Oudere berichten: een gratis knop "Ask … for a second opinion".
- Getest: build, syntaxcheck van de gebouwde pagina, alle `node test/*.js`, browser op 390 px licht en donker (bericht openen, kiezen, versturen: 2 tikken, verstuurd in ±0,6 s).
- Gevonden tijdens het bouwen: een commentaar in `addMsg` schakelde de rest van de regel uit; gerepareerd. Voortaan controleer ik ook de syntax van `dist/index.html`.
