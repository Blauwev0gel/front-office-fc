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
