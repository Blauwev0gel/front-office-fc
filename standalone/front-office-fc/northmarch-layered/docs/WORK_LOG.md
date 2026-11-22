## 2026-11-22 — consolidatie: kritische code-review en integrale reparaties

**Aanleiding:** bij review van laatste commit `2f8f417` bleek dat de zes blokken vooral waren uitgebreid, maar onvoldoende integraal verbonden. De gebruiker gaf expliciet opdracht de gevonden fouten daadwerkelijk te herstellen en eerdere instructie om niet op builds/tests te blokkeren blijft gelden.

**Gecommit in deze sessie:**
- Betrouwbare scheiding van beker, competitie en Europese spelersoptredens en -goals; neutral-ground Poissonbias gecorrigeerd. Nieuwe schema versie 10 markeert onherstelbaar gecombineerde historische seizoenstatistieken als voorlopig, in plaats van ze als exacte topscorersdata te presenteren.
- Buitenlandse clubs ontvangen en betalen wekelijks cash; `foreignLedger` registreert beginstand, media/commerce, salarissen, kosten, transfers, Europese inkomsten, lening/dossier en academy-herinvestering. Administration veroorzaakt echt puntenverlies en reputatieschade.
- Het automatische buitenlandse koopprogramma voor Northmarch-clubs is verwijderd wegens omzeilen van de bestaande TD-mandaten. Normale scouting/shortlist/shopFor regelt inkomende internationale deals. Financieel gedwongen AI-verkopen kunnen een vervangingsketen starten, maar menselijk verkoopbeleid is beschermd.
- Buitenlandse spelers hebben wekelijkse belastbaarheid, blessureherstel en ontwikkeling die uit echte wedstrijden voortkomt, plus wedstrijdgebonden moraal en spelerhonours voor landstitels en Europa.
- Clubcultuur beïnvloedt talentinstroom en scouting; identificatie van stijgende/gevallen clubs kijkt naar echte divisieverplaatsingen.
- Wereldarchief biedt inspectie van buitenlandse clubs, kaspositie, selecties, carrièrehistorie en transfernieuws zonder exacte verborgen scoutingsratings bloot te leggen. Voetbalnieuws wordt op belangrijke gebeurtenissen gefilterd.
- Regressiesuite `tests/world-repair-regressions.js` is aangemaakt om deze contracten later te valideren. **Niet uitgevoerd.**

**Bewijsniveau:** 15 gewijzigde bronbestanden afzonderlijk op JavaScript-syntax gecontroleerd, zonder geconstateerde parsefouten. Er is geen build, volledige samengevoegde code-evaluatie, regressietest, 20-seizoenstest of mobiele playtest uitgevoerd. Geen main merge/deploy. Alle zes blokken blijven IMPLEMENTING. Zie `docs/SLIMLINE_WORLD_ROADMAP.md` voor open releasepoorten.

---

## 2026-11-22 — SLIMLINE: integrale ontwikkeling zes blokken (broncode, nog niet gevalideerd)

**Context.** De eerste implementatierondes waren te beperkt en er ontbrak een gekoppelde voetbalsimulatie. Deze sessie voert de zes architectuurblokken integraal uit op `claude/loving-goodall-uv00vn` zonder extra verhalen, chairman dilemma's, staff agents of dynasty. Het verzoek is **code ontwikkelen; geen build of tests uitvoeren**. Alle wijzigingen staan op de ontwikkelbranch; er is niets gemerged of gedeployed.

### Blok 1 — Competities en savegames
- Northmarch heeft vijf divisies met 16 clubs en een nationale beker met 80 teams. De externe zes landen hebben elk een werkelijk wekelijks schema en gespeelde uitslagen, Europa heeft een 16-team knockout op weken 6, 11, 17, 25 (niet dezelfde week als de nationale beker).
- Europese resultaten beïnvloeden Northmarch-spelers met aparte Europese apps/goals, blessurekans, moraal, belasting naar de volgende week en geldontvangsten via de wekelijkse kasboekhouding. Buitenlandse clubs krijgen eigen gespeelde XI-statistieken, doelpuntenmakers en standen.
- Save-schema naar versie 9; migratie 48→80 clubs, reconstructie van lopende wedstrijden in nieuwe lagere divisies, legacy nationale beker, herstellen ontbrekende buitenlandse kalenders en deterministische defaults voor historische spelers en clubrecords. Exacte ontbrekende historische buitenlandscores kunnen niet worden teruggehaald.

### Blok 2 — Verbonden transfermarkt
- 72 buitenlandse clubs bezitten persistente selecties met spelers-ID, contract, nationaliteit, eigenschappen, blessures en kwaliteit.
- Eén `foreignMove`-mutatie verwerkt transfers in beide richtingen en tussen buitenlandse clubs; validatie van eigenaarschap, beschikbare posities, transfersommen en salarisgrenzen, spelerambitie en loyaliteit.
- Normale technisch directeur vindt buitenlandse spelers via de bestaande scoutPool/shopFor-flow; buitenlandse transfers verschijnen in scoutingrapporten, marktnieuws en financieel grootboek.
- Buitenlandse clubs verlengen contracten, produceren vrijgevallen spelers en tekenen spelers via dezelfde free-agentpool. Recruitment demands volgen daadwerkelijk surplus en tekorten; clubs reageren op verkochte dekking.

### Blok 3 — Herkenbare individuele carrières
- Individuele ontwikkelpaden, piekleeftijden, speelstijlen, loyaliteit, ambitie, afkomst, vorm en clubaanpassing.
- `playerCloseStint` legt een tussentijdse periode per club vast bij transfers en verhuur; doelen en assists worden niet zonder meer naar het nieuwe team overgedragen; buitenlandse carrière telt apart van domestic.
- Echte titels/bekers, ontwikkelings-doorbraken, contract-/verlengingshistorie en Europese prestaties worden bijgehouden en getoond.

### Blok 4 — Veranderende clubs
- Clubheritage met titels, bekers, promoties, degradaties en hoogste divisie; rep groeit door daadwerkelijke prestaties over meerdere seizoenen.
- De echte wedstrijden voeden rivaliteitssterkte; die slijt zonder wedstrijden en kan organisch overschaduwd worden door nieuwe rivalen.
- Aandeel van eigen-opleiding-spelers in de gespeelde minuten beïnvloedt de clubcultuur, en die cultuur beïnvloedt jeugdontwikkeling. Afgeleide clubidentiteiten tonen verhaallijnen die uit data voortkomen.

### Blok 5 — Wedstrijddynamiek
- Trainer-specifieke matchups, spelersstijlen in het basiselftal, aanvals- en verdedigingssynergie, vorm en scorers beïnvloeden daadwerkelijke xG en uitslagen, begrensd zodat elftalkwaliteit leidend blijft.
- Uitslagen, persoonlijke doelpunten en derby's beïnvloeden moraal en vorm. Europese en nationale belasting geven prestaties in volgende wedstrijden consequenties.

### Blok 6 — De levende voetbalwereld zichtbaar
- `world/awards.js` maakt een bounded persistent feitenarchief, seizoenprijzen en trends van groeiende/dalende clubs, jeugdontwikkelaars en doorbrekende spelers.
- `ui/history.js` biedt Europa/landen, transfers, clubtrends, wereldnieuws en spelersprijzen; `ui/render.js` geeft Europees voorbeschouwings- en resultaatenscherm en voetbalnieuws in de wekelijkse loop.
- `ui/club.js` toont geschiedenis/identiteit/jeugd, individuele rollen/levensloop/statistieken en seizoensprijzen.
- Speelkeuze en na wegstemmen beschikbaarheid omvat nu alle vijf divisies; starten in de onderste divisie is dus mogelijk.

### Integratie/structuur
- Nieuw: `src/world/awards.js`, `src/world/rivalry.js`; in `build.js` opgenomen.
- Bijgewerkt: `docs/ARCHITECTURE.md`, `docs/layers/L1-SIMULATION.md`, `docs/SLIMLINE_WORLD_ROADMAP.md` (alle zes status IMPLEMENTING). Historische drie-divisiedocumenten zijn niet langer geldige bron van waarheid.
- Er is **geen build, geautomatiseerde test, 10-20-seizoenstest of browserplaytest** uitgevoerd op deze wijzigingen. Nieuwe code is syntactisch geïnspecteerd, maar dat bewijst geen functionele integratie of balans. Releasegate en bewijs blijven open.

**Open aandachtspunten:** 20-seizoenen-balans van financiën/transferstromen, historisch correcte save-integratie, prijs- en salarisbalans van buitenland, kwaliteit van wedstrijden en echte mobiele bruikbaarheid. Geen van de zes blokken is op grond van deze sessie als COMPLETE gemarkeerd.

---

# Werklog

## 2026-11-21 — Fase 0 / Poort A laag 1
- LG-branch gecontroleerd: nog op `7a2d5d3`. Documenten in `design/northmarch-rebuild/` gelezen.
- VF gebouwd en getest: alles groen behalve `opening-test`.
- Bevinding: VF bevat 109 van de 122 Northmarch-functies (weekritme i.p.v. blokken).
- Vijf gaten: geen levende wereld; faciliteitsignalen zonder sporteffect; geen klok/commando's/events; economie sluit niet (−£131k); geen saveversies of langetermijntests.
- Besluiten D1, D2 vastgelegd. Volgende: ontwerpvraag 2 (competitiestructuur).

## 2026-11-21 — Laag 1 gebouwd en gevalideerd (M1)
- Nieuwe modulaire bron `src/` + `build.js` → `dist/northmarch-layered.html`.
- Engine: wereld van 48 clubs (3×16 + beker), selectie/stadion/grootboek per club, één klok, events, commando's, saves v1.
- Balans in drie rondes gevonden met de 20-seizoenstest: ineenstorting door looninflatie (T1), kwaliteitsinflatie
  door gratis instroom (T2), lek in noodaankopen (T3). Medisch effect versterkt (T4). Fout gevonden: eventlog-inkorting
  brak indexmarkeringen → volgnummers op events.
- UI in Northmarch-huisstijl: Week (Echo-verslag, voorbeschouwing met kansen), Tables (3 divisies + beker, club inspecteren),
  Squad (kader voor de directeur, spelers), Club (Ground, Money, vergelijking, historie, lagen).
- Browserfouten gevonden en hersteld: clubnaam verticaal (CSS-klasse-botsing `.grow`), teamnamen braken midden in een woord.
- **Volgende:** L2-ontwerpvragen (max. 3), daarna L2 verdiepen; daarna L3 (TD als agent op dezelfde commando's).

## 2026-11-21 — L2-ontwerpvragen
- D5 (alleen kader) en D6 (ledenvertrouwen + jaarlijkse ALV) vastgelegd. D7 (na wegstemmen een nieuwe club kiezen) vastgelegd; L2-vragen compleet.
- **Volgende:** L2 specificeren en bouwen (ledenvertrouwen/ALV, seizoensdoelen, verdieping clubschermen).

## 2026-11-21 — L2 pakket 1: afdelingen (na feedback eigenaar)
- Feedback: "clubmanagement dun, geen afdelingen, niets om in te investeren". Oorzaak: deels verstopt (achter de Ground-kaart), deels echt dun.
- Acht afdelingen met personeel, budget, koers, faciliteit en prestatie vs. divisie; Club-tab opent daarop; Money is een eigen tab.
- Medisch en training gesplitst; terreinen & onderhoud stuurt herstel van stadion en veld; commercie stuurt sponsors; wedstrijdorganisatie stuurt kosten.
- Opslag v2 met migratie (getest). Personeelsgewicht verhoogd na A/B-test (eerst −7%, ruis).
- **Volgende:** L2 pakket 2: ledenvertrouwen, jaarlijkse ALV, wegstemmen en nieuwe club (D6/D7).

## 2026-11-21 — Pakket 1: leden, vertrouwen, seizoensdoelen en ALV
- Nieuw: `src/club/members.js`, `src/ui/members.js`; schema v3 (migratie getest). Contributie als speleractie; doelen in de Week-tab; ALV in de seizoensreview; wegstemmen → drie nieuwe stoelen.
- Gevonden: tests bleven hangen zodra de speler werd weggestemd (oneindige weeklus) → `playSeason()` en `seasonOver()` per fase; review moet vóór het keuzescherm renderen.
- Afgestemd: weggestemde AI-voorzitters van 75 naar ±50 per 20 seizoenen.
- **Volgende:** pakket 2, hoofdtrainer en technisch directeur benoemen.

## 2026-11-21 — Pakket 2: hoofdtrainer en technisch directeur
- Nieuw: `src/club/staff.js`, `src/ui/staff.js`, `tests/staff-test.js`; schema v4 (migratie getest).
- Trainer telt mee in wedstrijden (sterkte, stijl) en groei; directeur in inschatting, bereik en prijs. Salarispost in het grootboek.
- Bijgesteld na tests: trainereffect ×1,5; wegkoopketens gestopt (vrije markt eerst); minder ontslagen; ambitieplafond en steilere salarissen.
- Meting toegevoegd: miskopen per club (`S.stats.buys/misbuys/spent`).
- **Volgende:** pakket 3, seizoensbegroting en commercie.

## 2026-11-21 — Pakket 3: begroting, commercie en financiering
- Nieuw: `src/club/commercial.js`, `src/ui/commercial.js`, `tests/commercial-test.js`; schema v5 (migratie getest). Money-tab: Budget, Sponsors, Funding.
- Gevonden en hersteld: inkomstenschatting telde seizoenkaarthouders dubbel (+15%); speelschema gaf reeksen van 15 uit/thuis (fout uit Northmarch-origineel); prognose schaalde eenmalige inkomsten op.
- Prestatiesponsor eerst altijd beter dan vast; verwachte waarde gelijkgetrokken.
- **Volgende:** pakket 4, voetbaldiepte.
- Na de schemafix bleek AI-financieel risico bijna nul; ambitieuze AI-leningen toegevoegd, verdere afstemming vastgelegd voor pakket 6. Wegkopen van trainers midden in het seizoen bleek te agressief (9/20 seizoenen) → alleen nog in de zomer.

## 2026-11-21 — Pakket 4: voetbaldiepte
- Nieuw: `src/football/life.js`, `tests/life-test.js`; schema v6 (migratie). Squad: moraal en badges; Tables → Market; verhuurkeuze in het kader.
- Gevonden: vermoeidheid markeerde de verkeerde spelers; testmeting van verhuur selecteerde al verhuurde spelers; weigeraars werden door dezelfde club teruggehaald; een `//`-commentaar midden in een regel brak de build.
- **Volgende:** pakket 5, grote projecten, historie en signalen.

## 2026-11-21 — Pakket 5: grote projecten, historie en signalen
- Nieuw: `src/club/projects.js`, `src/ui/history.js`, `tests/projects-test.js`; schema v7 (migratie). Major projects in Build; clubhistorie; Tables → History; Needs attention in Week.
- Gevonden: playtest kon toevallig in een weggestemde voorzitter eindigen (willekeurige wereld); doelen en posities toonden in week 0 al een stand.
- **Volgende:** pakket 6, validatie (strategietest, balans AI-risico en leeftijd, prestatie, jouw speeltest).

## 2026-11-21 — L1/L2 UX completion
- Audit (schermen, acties, loops) → plan in vijf sprints. Parallel werk van ChatGPT (overzichtstegels, stafvergelijking) samengevoegd en uitgebouwd.
- Sprint 1: navigatie Week·Club·Squad·Money·League, Club-subnavigatie, bestuurlijk overzicht, actiebalk, oriëntatiekaart, Money in 4 tabs.
- Sprint 2: beslisblok bij afdelingen, staf, bouw, prijzen, contributie, leningen, obligatie, sponsors, loonlimiet, stadion.
- Sprint 3: besluitenlog met meetwaarde toen/nu; projectvoortgang; afdelingsraster.
- Sprint 4: weekflow (verslag met positie en verwachte goals, urgent apart), seizoensreview met doelen en vooruitblik; vroege begrotingsprognose als "So far".
- Sprint 5: strategietest (6 voorzitters), balans (leeftijd, ALV, markt, AI-risico), save-grootte, ux-test, playtest mobiel + desktop.
- Gevonden: besluitenlog gebruikte UI-opmaak in de engine (hersteld); academies hielden alle jongeren (leeftijdsdaling); wegstemmen te frequent; markt sloot spelers van grotere clubs uit.

## 2026-11-21 — Recruitment and academy visibility (ChatGPT)
- 60b1f460: log actual director recruitment searches, with candidate snapshots and source clubs; capped at 12 searches for save size. No new scout NPCs or fabricated assignments.
- 8f68df64: log summer academy cohorts with player identifiers; capped at 12 intakes.
- 6683cdf1: scouting desk now shows recorded searches, signings, staff lead and reach; academy shows current graduates, loans, player growth and historical cohort status.
- Earlier UI visibility: bf6a2051, 5ab48d2d.
- Existing savegames: history begins only after the next recruitment search / summer intake; old history is not reconstructed.
- Scope: existing autonomous TD and player development engines retained; no separate youth squad or individual scout entities yet.
- Validation: source commits only; standalone HTML build and browser playtest not run in this session. Do not mark as release-ready.

## 2026-11-21 — L2.5 implementation session
- 2b790a878df4d7bcbd2e1213d3eb20ccf77b58b7 — fixed a critical malformed comment that swallowed the free-agent loop in scoutPool; added TD candidate evaluation and decision evidence in shopFor. Source updated, not built/tested.
- c8191a103a7e24f663aa6bfe38e43c6ca811fea2 — scouting department now displays screening reasons, target, budget and TD decision. Source updated, not browser-tested.
- f6e74dc6157a91095428273b005755220e1a59d7 — added docs/layers/L2_5_OPERATIONAL_CLUB.md with initial 11-domain gap audit, architecture and validation gates.
- Current status: IMPLEMENTED (partial vertical slice); NOT TESTED, NOT PLAYABLE/RELEASED. Pending: standalone build, save/load, simulation, browser/mobile tests; persistent positional planning and cross-window shortlist.

## 2026-11-21 — L2.5 pakket A1: wervingscyclus (Claude)
Register (SHA · doel · systemen · gameplay · tests · grenzen · status):
- c8d1526 · economie-ineenstorting na sync herstellen · market.js (vast niveau nieuwe vrije spelers, noodaankoop binnen loonplafond) · loonplafond weer bindend · 20-seizoenensim groen · — · TESTED
- 883667d · wervingscyclus selectiebehoefte → scouting → beoordeling → TD-besluit → terugblik · nieuw `club/recruitment.js`, `ui/recruit.js`, `tests/l25-test.js`; aangepast market.js (shortlist in shopFor, recordDecision), clock.js (wekelijks scouten, plan voor vensters), finance.js (`SetSquadPolicy{recruit}`), journal.js, save.js (`opsAfterLoad`), world.js, board.js, act.js · voorzitter kiest wervingsstrategie; selectieplan met open/vervulde behoeften; scouts volgen echte spelers en schattingen worden scherper; directeur weegt gescoute spelers eerlijker; terugblik "toen gezien, nu" · build, save-test, smoke-test, l25-test, 20-seizoenensim, browsercheck 390 px licht/donker groen · shortlist bepaalt ≈17% van de aankopen; computerclubs zonder plan; `tests/playtest.js` verouderd door hub fdfb8a9 · TESTED (niet PLAYABLE: eigenaar heeft nog niet gespeeld)
- Geen VERSION-ophoging: `S.ops` en `policy.recruit` zijn optioneel met veilige defaults; oude saves krijgen een plan bij laden.
- Volgende: playtest.js bijwerken; pakket A2 jeugd- en ontwikkelingscyclus.

## 2026-11-21 — L2.5 pakket A2: jeugd- en ontwikkelingscyclus (Claude)
- e5da80f · instroom → ontwikkeling → pad → uitkomst → opbrengst academie · nieuw `club/youth.js`, `ui/youth.js`, `tests/youth-test.js`; haken in players.js (ontwikkelregel, vertrek, instroom), market.js (verkoop/ontslag), life.js (huurclub onthouden), clock.js (afstemmen na wintervenster en seizoenseinde), save.js (`youthAfterLoad`), world.js; academy-blok in depts.js vervangen; ontwikkelregels op het spelersblad · voorzitter ziet per jongere kwaliteit, ingeschat potentieel (scherper met betere academiestaf), speelminuten en pad (Ready to step up uit het A1-plan, Needs games); elke lichting blijft gevolgd ná vertrek (verkocht aan wie, voor hoeveel; vrijgelaten, nu bij wie); huurbeleid in context · fast suite groen (incl. youth-test), browsercheck 390 px licht/donker · kleine clubs leveren 1 jeugdspeler per zomer (balansvraag fase 5); geen aparte jeugdcompetitie · TESTED
- Oude saves: lichtingen herbouwd uit `academyHistory`; geen VERSION-ophoging.

## 2026-11-21 — Transfervensters en weekverslag zichtbaar (Claude)
- 596967f · na vraag eigenaar "koopt mijn club überhaupt spelers? er moet een weekupdate en een transfer-/winterwindow zijn" · `windowInfo()` in `club/recruitment.js`; `ops.looks` (blikken van de week); `windowPanel()` en `clubWeekPanel()` in `ui/recruit.js`, getoond op het weekscherm (`render.js`) · de club kocht al wel (3–10 binnenkomers per seizoen), maar de vensters waren onzichtbare momenten. Nu: aftelling naar het winterwindow (week 15), plan van de directeur de week ervoor, na afloop wie er kwam en ging (of "geen zaken gedaan"), en een zomerverwijzing na het seizoen; "Behind the scenes": scoutblikken van de week en de belangrijkste open behoefte · build, smoke-test en één paginacheck 390 px licht/donker (bewust geen volledige suite, op verzoek) · vensters blijven één moment (week 15 en zomer), geen meerweekse vensters of eigen bod van de voorzitter; het zomerverslag staat tot week 5 zichtbaar · IMPLEMENTED (licht getest)

## 2026-11-22 — Wedstrijd live bekijken: tekstcommentaar in FM-stijl (Claude)
- 0a1aeda · de gespeelde wedstrijd minuut voor minuut vertellen en visueel laten leven · nieuw `sim/commentary.js` (`matchStory`, zonder DOM, eigen generator uit `hashStr` van de wedstrijd, raakt `rnd()` niet) en `ui/live.js` (overlay); knop in het Echo-verslag, `act.js`, `club.js`, CSS, `tests/story-test.js` · scorebord en klok, veldje met bewegende bal, "Who is on top"-strook per minuut met doelpuntmarkeringen, statistieken (schoten, op doel, expected goals, balbezit), commentaar met echte doelpuntenmakers en assists, rust en eindsignaal, strafschoppenreeks bij bekerduels, echte blessures van die week; pauze, tempo 1×/2×/4×, overslaan; optie "Open my match live after Play" (alleen in de browser onthouden, standaard uit) · uitslag, doelpuntenmakers en expected goals komen exact uit de engine; geen state, geen migratie, de seizoenssim verandert niet · build, story-test (208 wedstrijden), smoke-test, browsercheck 390 px licht/donker · de assist, de minuten en de niet-gescoorde kansen zijn verteld en niet berekend door de engine (dit staat zo op het scherm); geen kaarten (die zijn er niet in de engine); geen tactische ingrepen (bewust: de voorzitter coacht niet) · IMPLEMENTED (licht getest)

## 2026-11-22 — Het seizoen begint in het zomerwindow (Claude)
- 077f971 · feedback eigenaar: "je begint in week 1, maar eigenlijk begin je in de transferzomer" · `summerWindow()` in `sim/clock.js`: de zomerronde van alle directeuren (twee passes, uitlenen, jeugdadministratie) verhuist van het eind van `closeSeason` naar de eerste `advanceWeek` (week 0 → 1), ook in seizoen 1; verwachte positie en seizoensdoelen worden daarna opnieuw bepaald; vier pre-season-rondes scouten voor de speler; `windowInfo()` kent nu "open" (pre-season) en "gesloten met verslag" (weken 1–5); actieknop "Close the window · start the season"; seizoensreview verwijst naar het window · de voorzitter begint elk seizoen in de pre-season met open window, ziet het plan en zet zijn kader voor de directeur tekent · selectiegrootte-checks in `smoke-test` meten nu ná het sluiten van het window (week 1) · geen nieuwe state, geen migratie · **economie:** de 20-seizoenensim faalde al vóór deze wijziging op de vorige commit (359 checks, de economie sloot niet) door `462a806` (ChatGPT: noodspelers alleen binnen het loonplafond; een club op het plafond kon dan geen noodspeler meer tekenen, selecties krompen tot 11–14). Herstel: noodspeler binnen het plafond óf met een goedkoop basiscontract (`market.js`, `coverOk` en de proefspeler). Daarna: 0 administraties, mediane cash 291, alle checks groen · build, smoke-test, story-test, l25-test, sim-test 20 seizoenen, browsercheck pre-season · de window is nog steeds één beslismoment (geen meerweekse vensters; de voorzitter kiest geen individuele spelers) · IMPLEMENTED (licht getest)

## 2026-11-22 — Slimline afmaken, deel 1: de selectie klopt, scouting werkt, doorspelen (Claude)
- 1aa9f5c · gates uit `docs/SLIMLINE_COMPLETENESS_AUDIT.md` (G2, G3/G4) meetbaar maken en wat faalt repareren · nieuw `tests/slimline-test.js` (G2: 10 seizoenen × 3 seeds autonoom: geldige selecties, geen dubbele spelers, geen NaN, grootboek sluit, elke positie gedekt) en `tests/policy-test.js` (G3/G4: gepaarde werelden, één keuze verschilt, verschil ± standaardfout); `market.js`: `canSpare()` (verkopen, ontslaan, uitlenen, gedwongen verkoop en verkoop door noodlijdende clubs laten nooit een positie leeg) en `coverAll()` als laatste stap van elke directeursronde; `recruitment.js`: scouts proberen tot vier clubs per blik (kijkmomenten +35%), behoeften die verdwijnen zijn "solved" of "lapsed" (speler vertrok), `reportNoise()` (scoutingafdeling maakt het oordeel over élke kandidaat scherper); `clock.js`: `playWeeks()`; UI: "Play 4 weeks" en "To the next stop" (stopt vóór winterwindow, verlengingen, seizoenseinde en bij geldproblemen), resultatenstrook, transfermarkt-groepering voor het zomerwindow op week 0, uitslagregel breekt namen niet meer midden in een woord · **vóór:** 62 lege posities (keeper, spits, …) in 3×10 seizoenen; scoutingniveau 5 gaf geen betere aankopen (+1,30 tegen +1,35 sterkte in het tweede window, 40 werelden). **na:** 0 lege posities; niveau 5 geeft +0,50 ± 0,21 sterkte extra per window, schatfout 1,36 tegen 1,79 · fast suite (incl. slimline-test) groen in 54 s; 20-seizoenensim 0 administraties · bekend: geld heeft zwakke sportieve opbrengst (transfergeld 10%→90%: +1,0M uitgaven, −1 sterkte, ruis; loonkader tight→ambitious: +18% loonrekening, +4,9 ± 4,8 sterkte) · IMPLEMENTED (getest)

## 2026-11-22 — Slimline afmaken, deel 2: koersen en clubontwikkeling zichtbaar (Claude)
- 3b6c0a0 · punt 5 (eenvoudig een koers kiezen) en "mijn club zien veranderen" · `finance.js`: `COURSE` (Balanced, Youth first, Win now, Sustainable) bundelt bestaande instellingen (`SetSquadPolicy {course}`: loonkader, transfergeld, uitlenen, wervingsstrategie; elke losse wijziging maakt de koers weer "Custom"); `journal.js`: `devSnap()`/`devRecord()` (S.dev, 12 seizoenen, vastgelegd als het seizoen voorbij is); UI: koersenkaart bovenaan Club → Football en als hubtegel, "How the club changed" (vorig seizoen → dit seizoen met pijlen: positie, sterkte, leeftijd, loonrekening, leden, stadion, reputatie, cash, blessureweken, jeugdgroei) in de seizoensreview en de clubgeschiedenis, seizoen-voor-seizoen-tabel · beschrijvingen van de koersen volgen de metingen (Sustainable v Win now: sterkte +5,0 ± 0,9, punten +2,3 ± 0,5, loonrekening +£4,7k/wk, cash −£640k; Youth first v Win now: geen significant verschil, en dat staat zo in de tekst) · `docs/SLIMLINE_COMPLETENESS_AUDIT.md` kreeg een gate-status met alle cijfers en beperkingen · fast suite groen (54 s), slimline-test 10 seizoenen × 3 seeds groen, volledige playtest licht + donker groen, browsercontrole koersscherm en ontwikkelpanelen 390 px · geen nieuwe saveversie (`S.dev` en `policy.course` zijn optioneel) · TESTED

## 2026-11-22 — L3 gestart: staf en mandaten, slice S3.1 (Claude)
- e34063d · besluit eigenaar "mandaten zijn een deel van L3" (D-L3-1 in `docs/DECISIONS.md`); ontwerp in `docs/layers/L3-STAFF.md` (spelkern, mandaten, voorstellen, slices S3.1–S3.6), `docs/LAYER_INDEX.md` bijgewerkt · slice S3.1: `recruitment.js`: `MANDATE_DEALS` (Small 40% · Medium 75% · Large 100% van het transferbudget per deal), `dealCap()`, `tdPropose()` (bij het openen van een window zoekt de directeur zonder te tekenen de beste kandidaat per hoofdbehoefte; boven de grens wordt het een voorstel, max 3), `tdExecute()` (goedgekeurde voorstellen worden bij het sluiten uitgevoerd, mits de speler nog te koop is en het geld er is), `tdExpire()` (onbeantwoord vervalt), `openWindow()` (scoutrondes, plan en voorstellen bij nieuwe club, nieuw seizoen en de week vóór het winterwindow); commando's `SetMandate`, `ApproveProposal`, `DeclineProposal` (besluitenlog); `market.js`: `shopFor` kent `dry` en `ignoreMandate` en de reden "Above my mandate"; UI: "… asks"-kaart met Goedkeuren/Afwijzen op het weekscherm en in Club → Football, mandaatkeuze, actiebalk meldt wachtende voorstellen · nieuwe club start op Medium; een save zonder mandaat blijft zonder grens (gedrag als voorheen) · eerste opzet (Small 25% · Medium 50%) draaide de koers "Youth first" om (de ervaringsploeg was 1,9 jaar jonger); met 40/75/100 is het verschil jeugd v. ervaring +1,7 ± 0,7 jaar · `tests/l3-test.js` (3 werelden: voorstellen boven de grens, goedkeuren/afwijzen/vervallen, journal, opslaan/laden, oude save) in de fast suite; l25-test gemeten ná het volgende window (de zomerronde loopt in week 1) · fast suite groen · browsercheck pre-season 390 px · TESTED

## 2026-11-22 — L3 slice S3.1 gecorrigeerd: geen goedkeuring van losse transfers (Claude)
- f1914d4 · eigenaar: "ik ben de voorzitter, ik hoor geen individuele transfers goed te keuren" · de voorstel-/goedkeuringsflow van de vorige commit is een ontwerpfout (botst met de rol van voorzitter en met het Slimline-contract: geen individuele transfergoedkeuringen) en is verwijderd: commando's `ApproveProposal`/`DeclineProposal`, `tdExecute`, de knoppen en de wachtmelding in de actiebalk · vervangen door rapportage: `tdScan()` noteert wat de directeur boven zijn grens liet liggen (`S.ops.missed`), `tdClose()` zet het na het window op "left alone"; UI-kaart "… above your limit" met één beleidsknop ("Widen his limit to Medium/Large"); de directeur tekent binnen de grens zelf alles en nooit erboven · `docs/layers/L3-STAFF.md` herschreven, besluit D-L3-2 in `docs/DECISIONS.md` · `tests/l3-test.js` herschreven (46 checks: geen goedkeurcommando, nooit een aankoop boven de grens, lijst klopt met de wereld, opslaan/laden, oude save met `proposals` laadt) · browsercheck 390 px: geen goedkeurknoppen, wel de verruimknop · let op: de gedeelde branch heeft na ChatGPT's vijf-divisiewerk falende tests (save-, smoke-, l25-, sim-test en zijn pyramid-test) die niet aan deze slice liggen · TESTED (alleen l3-test, story-, youth-, slimline-test hier getest)

## 2026-11-22 — Breuk door de vijf-divisiewereld hersteld (Claude)
- e8b6b6d · na ChatGPT's uitbreiding naar vijf divisies (80 clubs, saveversie 8, buitenlandse wereld) faalden save-, smoke-, l25-, sim- en zijn eigen pyramid-test, en de economie stortte in (loon 237% van inkomen in seizoen 10, 72 administraties) · **hoofdoorzaak:** `worldQuality()` (de referentie `S.qref` voor de loonformule `150·1,65^(q−qref+2,2)`) middelde over álle clubs; de 32 extra lage clubs trokken `qref` van 11,71 naar 10,17, waardoor elk nieuw of verlengd contract 2,2× duurder werd dan de bestaande lonen (lonenspiraal) · **herstel:** `worldQuality()` meet alleen de bovenste drie divisies (de kalibratie van de loonschaal); `qref` mag omhoog meebewegen (geen loon-inflatie) maar zakt niet onder 11,7 (`clock.js`); `wageFor` gebruikt dezelfde ondergrens (ook voor saves die met de lage referentie zijn gemaakt) · **bijvangst:** ook in de oude 3-divisiewereld zakte de kwaliteit langzaam (T0 13,7 → 11,3 in 14 seizoenen) en volgde de loonschaal naar beneden; met divisie 3 en 4 die niet meezakken werd dat een probleem (T4 loon 162% van inkomen in seizoen 14); de ondergrens lost beide op: alle vijf divisies loon 64–80% van inkomen in seizoen 14, geen administraties in de top, nog steeds langzame kwaliteitsdaling (niet aangepakt) · `seatsAfterOut` biedt weer drie stoelen (bovenste drie divisies) in plaats van vijf · testfouten: `pyramid-test` verwachtte 16 clubs na de voorronde terwijl de loting van ronde 1 de 48 clubs uit divisie 0–2 al toevoegt (64); `save-test` had 48 clubs hard in de verwachting; `l25-test` eiste een "filled" behoefte terwijl ChatGPT's nieuwe regel alleen echte gaten (`hole`) als filled markeert en anders `lastSigning` bijhoudt · vóór: 5 van 14 tests gefaald; na: fast suite (met pyramid- en foreign-world-test) groen; 10 seizoenen × 3 seeds op 80 clubs groen (slimline-test); 20-seizoenensim: 17 administraties bij 80 clubs (12 clubs), mediane cash 31 (dunne onderlaag, divisie 4 heeft nauwelijks buffer) · bekend: het sim-overzicht (`sim-test`) toont alleen divisie 0–2; aankopen kunnen meerdere vrije spelers op dezelfde positie tegelijk opleveren (upgradelus) · TESTED

## 2026-11-22 — Samengevoegde stand gecontroleerd en gepubliceerd (Claude)
- ffd9a9e · na ChatGPT's weekgestuurde Europa (fc161e7) vielen twee tests om die aan één trekking en aan de wereldgrootte hingen, niet aan het spel: `l25-test` eiste aankopen in het eerste window van één testwereld (de nieuwe Europa-week verbruikt toevalsgetallen, dus de directeur vond daar toevallig niets); de test telt nu twee windows. `sim-test` had grenzen voor 48 clubs (≤80 weggestemd, ≤1 administratie per seizoen); met 80 clubs schalen ze mee (×80/48). Gemeten over 3 seeds × 20 seizoenen: 14–21 administraties (≈1,0% per clubseizoen, was ≈2,1% in de wereld van 48), 73–86 weggestemde voorzitters · fast suite groen · artifact bijgewerkt · TESTED

## 2026-11-22 — Crash bij seizoenseinde hersteld (Claude)
- 931b3aa · `src/world/awards.js` (ChatGPT's wereldnieuws): `const old=S.worldLog.filter(x=>x.s===old)` verwees naar zichzelf (TDZ) en liet `closeSeason` crashen zodra het logboek 1400 regels bereikte; moet `x.s===oldest` zijn · gevonden door `sim-test`, hersteld, fast suite groen (incl. 20-seizoenensim) · TESTED

## 2026-11-22 — Buitenlandse kandidaten braken het scherm (Claude)
- 2bd2327 · ChatGPT's internationale transfermarkt (`foreign.js`, `scoutPool`) laat de directeur ook spelers van buitenlandse clubs (`f_esp_7`, …) bekijken; `nm(id)` en mijn "above your limit"-/scoutkaart riepen `CL(id).name` aan en crashten daardoor in de browser bij de eerste "Play" (Node-tests zagen het niet: geen DOM) · `nm()` gebruikt nu `marketClubName()` (kent ook buitenlandse clubs); `l3-test` accepteert spelers bij buitenlandse clubs (`S.foreign.squads`) · fast suite groen, browser loopt weer een heel seizoen door · TESTED

## 2026-11-22 — Save en nieuwe wereld gelijkgetrokken; zetels in vijf divisies (Claude)
- 6771a72 · na saveversie 9 faalde `save-test` ("a loaded save continues exactly like the original") ook op ChatGPT's commit alleen · oorzaak: `enrichLegacyWorld()` (bij het laden) vult velden aan (clubs: `heritage`, `devCulture`, `identity`; spelers: `eApps`, `eGoals`, `europeLoad`, …) die een nieuwe wereld niet had, dus een geladen wereld liep anders dan de originele · herstel: `newWorld` roept `enrichLegacyWorld()` ook aan en `newPlayer` zet `eApps/eGoals/europeLoad` op 0; controle met een heen-en-weer-vergelijking van de hele wereldstaat per week (eerste afwijking weg; alleen `S.journal` blijft `undefined` tegenover `[]`, zonder gevolgen) · `smoke-test`: een verloren ALV-stemming biedt nu zetels in elke divisie aan (ChatGPT, vijf divisies speelbaar), de test eist niet meer exact drie · fast suite groen · TESTED
