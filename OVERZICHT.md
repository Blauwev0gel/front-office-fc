# The Front Office: overzicht van het hele spel

Dit document legt uit hoe het spel in elkaar zit en hoe de onderdelen samenwerken, zodat we gericht kunnen verbeteren.
Het is geschreven op 16-11-2026, op `claude-game`, en gecontroleerd tegen de code. Voor *welk bestand bij welk systeem hoort*
blijft `CODEMAP.md` de snelste bron; voor *wat het spel is en niet is* de bijbel (`BIBLE.md`). Dit document verbindt die twee:
het laat zien **hoe een week, een seizoen en een beslissing door de lagen lopen**.

De gegenereerde blokken (hooks, state, bestanden) ververs je met:

```bash
node tools/codemap.js && python3 tools/overview.py
```

Er is ook een interactieve versie (zoeken, hooks, weekloop): https://claude.ai/artifact/MWBV8CsDbqssriUofkBbXw

## 1. Het spel in één alinea

Een mobiele voetbal-CEO-game in één HTML-bestand (ongeveer 1,2 MB, vanilla JavaScript, offline). Je kiest nooit het elftal. Je
neemt hoofden van afdelingen aan, geeft ze een mandaat en bevoegdheid, en beantwoordt wat in je rode map belandt. Elke week
speelt je club een wedstrijd, loopt het geld door, bewegen de achterbannen (bestuur, supporters, pers, kleedkamer) en komen er
nieuwe berichten. Elk seizoen eindigt met een bestuursreview, promotie of degradatie en een transferzomer. Er is geen
winconditie: het loopt door tot ontslag.

| | |
|---|---|
| Vorm | `build.py` plakt de modules in vaste volgorde in `dist/index.html` |
| Omvang | engine (14 delen) + 30 modules + UI (18 delen) + stijlen (8 delen) |
| State | één object `G` (`FO.G`), als JSON in `localStorage` |
| Willekeur | één geseed `rnd()` in de engine; de seeded wereld heeft een eigen generator |
| Tests | 20 Node-testbestanden (`test/src.js` is een hulp), 9 Python-browsertests (Playwright) in `test/browser/`, vijf tools |

## 2. De lagen

```
 telefoon / browser
   │
   ▼
 UI  (src/ui/*, 18 genummerde delen, één scope)          UI-state `U` (niet bewaard)
   render() kiest een scherm op G.phase / U.tab / U.dept   act(a, d) = één switch op data-a
   │  leest F.* en G, schrijft alleen via F.* (en saveGame)
   ▼
 F = FO   de publieke API (hire, respond, endWeek, worldLeague, ...)
   │
   ▼
 Engine-kern (src/engine/*, 14 delen)       spelers, match, geld, week, seizoen, opslaan
   │  roept HOOK.x(...) aan op vaste punten
   ▲
   │  modules zetten die hooks (meestal door de vorige te wrappen)
 30 modules (src/*.js): events, depts, recruit, academy, summer, season, loop, dossiers, desk, talks, world, turnaround, ...
   │
   ▼  alles leest en schrijft hetzelfde object
 G  ──JSON──►  localStorage (saveGame na bijna elke actie)
```

Drie regels die alles bepalen:

1. **Logica zonder DOM.** Engine en modules draaien in Node; de UI is een dunne laag erboven. Daarom kunnen de tests het spel headless spelen.
2. **Hooks in plaats van afhankelijkheden.** De engine weet niets van de modules. Ze roept `HOOK.naam()` aan op vaste plekken; een module zet die hook, meestal door de vorige te wrappen (`const prev = H.x; H.x = () => prev() + ...`). Eén gedrag kan dus over meerdere modules verspreid zitten. **Kijk in de hookstabel (hoofdstuk 7) voordat je een hook verandert.**
3. **Eén state, veilige defaults.** Alles staat in `G`. Nieuwe state krijgt een veilige default (`G.x = G.x || ...`) of een migratie in `engine/14-save-api.js` (`VERSION`). Zo laden oude saves.

## 3. Bouwvolgorde (en waarom die ertoe doet)

`build.py` laadt: `engine`, `events`, `events2`, `events3`, `briefs`, `academy`, `academy2`, `recruit`, `summer`, `season`, `summer2`, `faces`, `firstteam`, `depts`, `levers`, `commercial`, `marketing`, `business`, `academy3`, `recruitx`, `world`, `turnaround`, `matchtalk`, `desk`, `talks`, `weekflow`, `weekloop`, `loop`, `dossiers`, `pathway`, `matchday`, `ui`.

Waarom de volgorde telt:

- Een module die een hook **wrapt** moet na de module komen die hem eerst zet. `turnaround.js` zet `seasonWeekly` en moet dus **na** `season.js`.
- `weekflow.js` omhult **alle** opties van alle gebeurtenissen om je eigen keuzes te onthouden (`G.mem`). Een bestand met gebeurtenissen moet dus **vóór** `weekflow.js` staan (daarom `events3.js` en `turnaround.js` vroeg).
- De stijlen en UI-delen zijn fragmenten van één bestand; ze zijn pas geldig na samenvoegen.

De modulelijst staat op één plek: `src/modules.json`. `build.py`, `tools/codemap.js` en de tests (via `require('./src.js').mods(laatste, [overslaan])`) lezen daaruit. Een nieuw bestand voeg je dus alleen daar toe.

## 4. De fases van een spel

```
dna ─► staff ─► mandates ─► summer ─► preseason ─► press ─► season (34 weken) ─► review ─► summer ─► ...
 setup (UI 02-setup)           │  (summer2: vergadering, brief,      │  (doel met het bestuur,            │ (bestuursreview, rapport)
                               │   ticker, debrief)                  │   focusdoelen)                     └─► sacked (definitief, eindscherm)
```

| Fase (`G.phase`) | Wat gebeurt er | Engine/module | Scherm |
|---|---|---|---|
| `dna` | zeven keuzes die startpositie, doelen en identiteit bepalen | `engine/13` setDNA | `vSetupDNA` |
| `staff` | zeven rollen aannemen binnen een stafbudget | `engine/04` hire, genStaff | `vSetupStaff` |
| `mandates` | per rol schuifjes en regels | `engine/09` setMandate | `vSetupMandates` |
| `summer` | transferzomer in vijf stappen (v2: vergadering → brief → ticker → debrief) | `summer.js`, `summer2.js` | `vSummer2` |
| `preseason` | doel met het bestuur (veilig/accepteren/bold) en max. twee focusdoelen | `engine/13` | `vPreseason` |
| `press` | persconferentie; antwoorden worden beloftes | `engine/09` | `vPress` |
| `season` | 34 speelweken, ritme van blokken, beker, reviews | `engine/12` endWeek | `vInbox`, `vFirst`, afdelingen, ... |
| `review` | seizoensrapport, promotie of degradatie | `engine/10` endSeason | `vReview2` |
| `sacked` | einde; niets kan meer | `engine/12` sack | `vSacked` |

## 5. De week: wat `endWeek()` doet

De UI roept `F.endWeek()` aan na de wedstrijddag (`mdKick` in `ui/15-actions.js`, `ui/14-matchday-gazette.js`). De volgorde, uit `engine/12-week.js`:

| # | Stap | Waar |
|---|---|---|
| 1 | nieuwe Gazette-pagina en een momentopname van cash, vertrouwen, fans, positie (`G.prev`) | `endWeek` |
| 2 | onbeantwoorde berichten worden met het advies van de staf afgehandeld (`autoIndex`) | `endWeek`, `desk.js` |
| 3 | `over()`-controle, vergadering laten verlopen, kaderplan voorbereiden | `lapseMeeting`, `squadPlanPrepare` |
| 4 | scouting en DoF-werk | `dofWork` + `HOOK.recWeekly` |
| 5 | **wedstrijden**: alle divisies; onze wedstrijd via `simOurMatch`, de rest via teamsterkte (`G.clubs[id].str`); beker | `engine/06-match.js` |
| 6 | uitslag verwerken: vorm, xG, opkomst, laatste wedstrijd | `endWeek` |
| 7 | **financiën** (inkomsten, kosten, projecten) | `weeklyFinance`, `projectsWeekly` |
| 8 | spelers: ontwikkeling, blessures, moraal; academie (`HOOK.acadWeekly`); instroom in week 28 | `develop`, `HOOK.acadWeekly` |
| 9 | KPI's, stafwerk, **bestuur en achterbannen** | `kpiWeekly`, `staffWeekly`, `boardWeekly` |
| 10 | `HOOK.seasonAfterMatch`: elke module die op een uitslag reageert | 13 modules |
| 11 | ontslagcontrole, geldcrisis, insolventie | `endWeek` |
| 12 | Gazette bouwen (`buildPaper`, `buildReports`, `HOOK.edition`) | `engine/12`, `matchday.js` |
| 13 | bestuursvertrouwen ≤ 0 → ontslag; vier weken insolvent → administration | `sack`, `administration` |
| 14 | `G.week++`; na week 34 `endSeason()` | `endWeek` |
| 15 | uitgestelde gevolgen (`G.later`) worden berichten; **`HOOK.seasonWeekly`** | `endWeek`, `turnaround.js`, `season.js` |
| 16 | **nieuwe berichten en briefings**: eerst de geforceerde wachtrij, dan gewogen trekken (`HOOK.evWeight`) | `genMessages`, `genBriefs` |

Daarna toont de UI de nieuwe week en slaat `saveGame()` op. Alles wat je toevoegt aan de week hang je aan één van de hooks
in stap 4, 10, 12 of 15.

## 6. Het seizoen, de zomer en de wereld eromheen

**Seizoenseinde (`endSeason`)**: rapport en prijsgeld; bestuursdoelen (`objMet`); beloftes (kept/broken); **promotie van de top drie en degradatie van de onderste drie**; rivalen
evolueren (`str` trekt naar het divisiegemiddelde plus hun coach, B37); spelers worden ouder en contracten lopen af; daarna
`HOOK.acadSeason` en `HOOK.recSeason`; `phase = 'review'`.

**Zomer (`HOOK.summerStart`-ketting)**: `season.js` (ambities, uitgeleende spelers terug) → `summer.js` (de stappen) → `summer2.js` (vergadering met de DoF, getekende zomerbrief, ticker waarin de DoF uitvoert, debrief) → `recruitx.js`. Daarna voorseizoen en persconferentie.

**De wereld**: `G.clubs` (alle clubs met `str` en een coach), `G.divs` (acht divisies met competitie en stand), `G.rec.pool` (de scoutingpool van ongeveer 300 tot 500 spelers die de DoF kent) en, nieuw, `world.js`: een **seeded wereld van 14 competities en ruim 5000 spelers** die op aanvraag wordt berekend en alleen jouw wijzigingen opslaat (`G.world`).

## 7. Hooks: wie zet wat, wie roept wat aan

<!-- generated:hooks:start -->
| Hook | Wat het doet | Gezet door (modules) | Aangeroepen door (engine) |
|---|---|---|---|
| `seasonAfterMatch` | na elke eigen wedstrijd (veel modules: tevredenheid, doelen, gesprekken, verhaallijnen) | `season.js`, `firstteam.js`, `depts.js`, `levers.js`, `commercial.js`, `academy3.js`, `recruitx.js`, `desk.js`, `talks.js`, `weekflow.js`, `loop.js`, `dossiers.js`, `pathway.js` | `engine/12-week.js` |
| `ftExtra` | extra teamsterkte in punten (pushes, analist, voorseizoen, step-up straf, turnaround) | `firstteam.js`, `depts.js`, `levers.js`, `turnaround.js` | `engine/05-world-selection.js` |
| `summerStart` | start van de zomer (ketting: season, summer, summer2) | `summer.js`, `season.js`, `summer2.js`, `recruitx.js` | `engine/10-season.js`, `engine/13-newgame-preseason.js` |
| `deptCost` | wekelijkse kosten per afdeling | `depts.js`, `commercial.js`, `marketing.js` | `engine/07-finance-transfers.js`, `levers.js`, `ui/07-club-league.js` |
| `effBonus` | extra effectiviteit van een staflid (afdelingsperks, desk) | `depts.js`, `levers.js`, `desk.js` | `engine/04-staff-dna.js` |
| `seasonWeekly` | eenmaal per week aan het einde van de weeklus, voor de nieuwe berichten | `season.js`, `recruitx.js`, `turnaround.js` | `engine/12-week.js` |
| `acadIntake` | jaarlijkse instroom van de academie (week 28) | `academy.js`, `academy3.js` | `engine/12-week.js` |
| `acadSeason` | academie aan het seizoenseinde | `academy.js`, `academy2.js` | `engine/10-season.js` |
| `acadWeekly` | wekelijkse academie (ontwikkeling, welzijn, competitie) | `academy.js`, `academy2.js` | `engine/12-week.js` |
| `deskBriefs` | het bureau voegt korte briefings toe | `desk.js`, `weekflow.js` | `engine/11-staffwork-analysis-briefs.js` |
| `ftDev` | extra bij de ontwikkeling van spelers | `firstteam.js`, `depts.js` | `engine/08-weekly-inbox.js` |
| `ftInj` | factor op de blessurekans | `firstteam.js`, `depts.js` | `engine/06-match.js` |
| `merchMult` | factor op merchandise-inkomsten | `depts.js`, `commercial.js` | `engine/07-finance-transfers.js` |
| `recSeason` | recruitment aan het seizoenseinde | `recruit.js`, `season.js` | `engine/10-season.js` |
| `recWeekly` | wekelijkse scouting en DoF-pipeline | `recruit.js`, `recruitx.js` | `engine/12-week.js`, `summer.js`, `summer2.js` |
| `selBonus` | extra score in de elftalselectie (voorkeuren van de coach, pathway) | `firstteam.js`, `pathway.js` | `engine/05-world-selection.js` |
| `acadCost` | kosten van de academie | `academy.js` | `engine/07-finance-transfers.js` |
| `acadIncome` | inkomsten van de academie | `academy2.js` | `engine/07-finance-transfers.js` |
| `acadInit` | start de academie bij een nieuw spel | `academy.js` | `engine/13-newgame-preseason.js` |
| `acadMigrate` | migratie van academiestate bij een oude save | `academy.js` | `engine/14-save-api.js` |
| `acadSale` | verkoop van een academiespeler | `academy2.js` | `engine/07-finance-transfers.js` |
| `attendance` | opkomst per thuiswedstrijd (commercial) | `commercial.js` | `engine/07-finance-transfers.js` |
| `coachAct` | wat de coach echt doet (kan afwijken van je mandaat) | `firstteam.js` | `engine/05-world-selection.js` |
| `costDisc` | korting of toeslag op kosten (finance) | `business.js` | `engine/07-finance-transfers.js` |
| `desk` | de afdeling beslist routinezaken zelf binnen de bevoegdheid | `desk.js` | `engine/08-weekly-inbox.js` |
| `edition` | bouwt de Gazette-editie van de week | `matchday.js` | `engine/12-week.js` |
| `evWeight` | gewicht van een gebeurtenis bij het trekken van berichten (situatie) | `weekloop.js` | `engine/08-weekly-inbox.js` |
| `fanWeekly` | wekelijkse update van de fanbase (marketingtrechter) | `marketing.js` | `engine/08-weekly-inbox.js` |
| `ftCost` | wekelijkse kosten van het eerste elftal (afdeling) | `firstteam.js` | `engine/07-finance-transfers.js` |
| `gate` | recette per thuiswedstrijd | `commercial.js` | `engine/07-finance-transfers.js` |
| `homeEdge` | thuisvoordeel in de wedstrijd (stadion, sfeer) | `commercial.js` | `engine/06-match.js` |
| `lastChance` | laatste kans bij een vertrouwensstemming | `loop.js` | – |
| `objMet` | beoordeelt extra bestuursdoelen aan het seizoenseinde | `academy2.js` | `engine/10-season.js` |
| `oppStyle` | stijl van de tegenstander (volume en kwaliteit van kansen) | `matchtalk.js` | `engine/06-match.js` |
| `recCost` | scoutingkosten | `recruit.js` | `engine/07-finance-transfers.js` |
| `recMigrate` | migratie van recruitment-state | `recruit.js` | `engine/14-save-api.js`, `recruitx.js` |
| `say` | commentaartekst tijdens de wedstrijd | `matchtalk.js` | `engine/06-match.js` |
| `seasonReprieve` | één laatste kans als het bestuursvertrouwen op nul staat | `loop.js` | `engine/10-season.js` |
| `storyW` | gewicht van verhalen over eigen spelers in de wedstrijd | `matchday.js` | `engine/06-match.js` |
| `sumMigrate` | migratie van de zomerstate | `summer.js` | – |
<!-- generated:hooks:end -->

## 8. Hoe het samenwerkt: zes ketens die je moet kennen

**a. Hoe de kwaliteit van je mensen doorwerkt.** Een staflid heeft drie attributen (`at`), een `boost` (tijdelijk) en een relatie (`rel`). `eff(rol, i)` combineert die tot één effectiviteit (`engine/04-staff-dna.js`), en `HOOK.effBonus` laat afdelingen en het bureau er iets bij of af doen. Die waarde werkt overal door: de coach in teamsterkte en ontwikkeling, de DoF in transferprijzen en scoutrapporten, finance in kostenkorting. Sinds B37 telt de coach relatief aan het divisieniveau (`(eff − tierAvg) × 0,18`).

**b. Hoe teamsterkte ontstaat.** `strengthParts` (`engine/05-world-selection.js`) telt op: selectie (gemiddelde CA van het gekozen XI, met positie-fit en een kleine straf voor nieuwkomers) + coach + stijl + moraal + extra (`HOOK.ftExtra`: pushes, analist, voorseizoen, step-up-straf na promotie, turnaround-effect). Rivalen hebben hetzelfde in één getal: `G.clubs[id].str` (divisiegemiddelde + de kwaliteit van hun eigen coach + ruis). Een wedstrijd wordt gespeeld op het verschil.

**c. Hoe een gebeurtenis het spel in en uit gaat.** `defineEvent` (`events*.js`, `turnaround.js`) registreert een gebeurtenis met `from`, `cond`, `cd`, `w`, `setup`, opties met `f(ctx)` en `auto`. `genMessages` trekt wekelijks uit alles wat mag (`cond`, cooldown), gewogen met `HOOK.evWeight` (situatie: een afdeling onder druk krijgt vaker aandacht). Je antwoord draait `f(ctx)`, die state verandert. Daarna: `weekflow.js` onthoudt jouw keuze (`G.mem`), plant echo's voor de Gazette (`G.echo`, kort en seizoenen later) en `F.later(id, ctx, a, b)` plant een vervolg. Gevolgen van oudere keuzes komen terug als nieuwe gebeurtenissen (`events3.js`, `F.recall`).

**d. Hoe geld stroomt.** `weeklyFinance` (`engine/07-finance-transfers.js`): inkomsten (recette via `HOOK.gate`, sponsors, merchandise via `HOOK.merchMult`, prijsgeld, academie) minus kosten (lonen, staf, afdelingen via `HOOK.deptCost`, faciliteiten, rente) geeft `G.club.cash`. Kas onder nul geeft een geldcrisis; vier weken diep insolvent geeft administration. `business.js` zet het seizoensbudget per afdeling tegen wat de omzet toelaat.

**e. Hoe de achterbannen werken.** `boardWeekly` en `loop.js`: vier achterbannen (bestuur, supporters, pers, kleedkamer) met elk een stem en een waarde. Onder 5 volgt een vertrouwensstemming. Bestuursvertrouwen (`G.board.conf`) bepaalt het ontslag; aan het seizoenseinde drijft het 12% terug naar 60 zodat je geen goodwill kunt oppotten (B37).

**f. Hoe de wereld buiten jouw club doorloopt.** Rivalen evolueren per seizoen (`engine/10-season.js`); coaches worden vervangen (16% per club) en komen als nieuws in de Gazette (`G.coachNews`). De seeded wereld (`world.js`) is een *venster*: ze gebruikt de echte clubs en hun sterkte, maar verandert er niets aan.

## 9. Systemen: waar je kijkt

| Systeem | Logica | Scherm | Belangrijkste state |
|---|---|---|---|
| Start (DNA, staf, mandaten) | `engine/04`, `engine/13` | `ui/02-setup` | `club`, `staff`, `mand` |
| Afdelingen (zes) | `depts.js`, `desk.js`, `levers.js` | `ui/08-departments` | `dept`, `auth`, `desk`, `grip` |
| Eerste elftal | `firstteam.js`, `engine/05` | `ui/09-firstteam-review` | `ft` |
| Recruitment, DoF, scouts | `recruit.js`, `recruitx.js`, `engine/07` | `ui/08-departments` (rx*) | `rec`, `recX`, `shortlist` |
| Scouting-portaal (nieuw) | `world.js` | `ui/08b-portal` | `world` |
| Academie | `academy*.js` | `ui/08-departments` (ac*) | `acad`, `academy` |
| Commercial, Marketing, Business | `commercial.js`, `marketing.js`, `business.js` | `ui/08-departments` | `com`, `mk`, `biz`, `deptB` |
| Transferzomer | `summer.js`, `summer2.js` | `ui/03-summer-preseason-press` | `sum`, `lastSummer` |
| Seizoensritme | `season.js`, `engine/10` | `ui/09-firstteam-review` | `rival`, `stake`, `recovery` |
| Berichten, gebeurtenissen | `engine/08`, `events*.js`, `briefs.js`, `weekflow.js` | `ui/10-inbox`, `ui/13-redbox-render` | `inbox`, `queue`, `later`, `mem`, `echo` |
| Dossiers en druk | `dossiers.js`, `loop.js` | `ui/10-inbox` | `dos`, `pressure`, `votes` |
| Gesprekken | `talks.js`, `firstteam.js` | afdelingen | `convo`, `talks` |
| Turnaround (nieuw) | `turnaround.js` | inbox | `turn`, `turnLast` |
| Pathway-verhaallijn | `pathway.js` | `ui/10-inbox` | `pw`, `cred` |
| Wedstrijd en Gazette | `engine/06`, `matchday.js`, `matchtalk.js` | `ui/14-matchday-gazette` | `paper`, `eds`, `mdS` |
| Portretten, geluid | `faces.js` | overal | – |

### State per bestand

<!-- generated:state:start -->
| Bestand | Schrijft in `G` |
|---|---|
| `engine/01-core.js` | `rs`, `nid` |
| `engine/05-world-selection.js` | `clubs`, `divs` |
| `engine/06-match.js` | `msNew` |
| `engine/07-finance-transfers.js` | `signLog`, `shortlist`, `dofSigned`, `squad`, `dofNote` |
| `engine/09-meetings-actions-press.js` | `propCd`, `meeting`, `projects`, `projDone`, `projLog`, `resBy`, `resOf` |
| `engine/10-season.js` | `coachNews`, `squad`, `academy`, `lastReport`, `phase`, `week`, `ap`, `form`, `inbox`, `queue`, `ss`, `paper`, `pressDone` |
| `engine/11-staffwork-analysis-briefs.js` | `later`, `shortlist`, `scoutNote`, `reports`, `bcd`, `briefs` |
| `engine/12-week.js` | `phase`, `sackReason`, `queue`, `briefs`, `over`, `paper`, `msNew`, `prev`, `prevFan`, `lastMatch`, `lastCup`, `ap`, `later`, `inbox` |
| `engine/13-newgame-preseason.js` | `club`, `mand`, `cup`, `phase`, `pre`, `meeting`, `press`, `pressDone`, `paper` |
| `engine/14-save-api.js` | `ap`, `later`, `v` |
| `events.js` | `academy`, `freezePrev` |
| `briefs.js` | `dofPrio`, `dofPrioAt`, `wageFreezePrev` |
| `academy.js` | `acad`, `academy` |
| `academy2.js` | `academy`, `squad` |
| `recruit.js` | `shortlist`, `rec` |
| `summer.js` | `phase`, `sum`, `inbox`, `lastSummer`, `squad`, `preEdge` |
| `season.js` | `rival`, `stake`, `openTarget`, `matchEdge`, `blockDone`, `winterPrev`, `winBonus`, `recovery`, `loanedOut`, `squad` |
| `summer2.js` | `dofStrikes` |
| `firstteam.js` | `ft` |
| `depts.js` | `dept`, `deptB`, `deptSeason`, `staffAsk` |
| `levers.js` | `grip`, `gripW`, `gripLog` |
| `commercial.js` | `com` |
| `marketing.js` | `mk` |
| `business.js` | `biz`, `deptB` |
| `academy3.js` | `acadX`, `academy` |
| `recruitx.js` | `recX` |
| `world.js` | `world` |
| `turnaround.js` | `turn`, `turnLast`, `turnAsk` |
| `desk.js` | `auth`, `desk` |
| `talks.js` | `convo`, `talks`, `dofPrio`, `dofStrikes` |
| `weekflow.js` | `bigDone`, `echo`, `coachNews`, `mem` |
| `loop.js` | `votes`, `vote`, `bgoal`, `bgLog`, `wkDelta`, `wkPrev`, `wkLog` |
| `dossiers.js` | `pressure`, `dos` |
| `pathway.js` | `cred`, `pw`, `academy`, `pwLog` |
| `matchday.js` | `mdS`, `eds` |
<!-- generated:state:end -->

## 10. Willekeur, opslaan en migratie

- **Willekeur:** alles loopt via `rnd()` (`engine/01-core.js`), een geseede generator waarvan de toestand in `G.rs` staat. Daardoor is een spel reproduceerbaar met dezelfde seed en dezelfde keuzes. Nooit `Math.random`. `world.js` heeft een **eigen** generator (`mk(seed)`): het portaal bekijken verandert geen spel.
- **Opslaan:** `F.save()` is `JSON.stringify(G)`; de UI schrijft naar `localStorage` (`saveGame`) na bijna elke actie. `U` (UI-state) wordt niet bewaard.
- **Migratie:** `engine/14-save-api.js` `load()` kijkt naar `G.v` en roept migratiehooks (`acadMigrate`, `recMigrate`, `sumMigrate`). Voor **nieuwe velden** volstaat meestal een veilige default (`|| 0`, `|| {}`) op de leesplek; dat is wat de nieuwe statistieken (`sh`, `sot`, ...) en `G.world` doen.
- **Eén valkuil:** `st.rat` is de **som** van de wedstrijdcijfers. Een gemiddelde is `st.rat / st.apps`.

## 11. De wedstrijd

`simOurMatch` (`engine/06-match.js`) trekt een aantal kansen, kent ze toe aan spelers, en bepaalt xG, doelpunten, wissels, kaarten en blessures. Daarna worden per speler de afgeleide tellers bepaald (progressieve acties, duels, en sinds B42 schoten, key passes, tackles, onderscheppingen, clearances, reddingen, clean sheets). De afgeleide tellers zijn **Poisson-trekkingen op basis van attributen en het wedstrijdbeeld**, geen eigen simulatie. De overige divisies worden niet gespeeld maar uit teamsterkte afgeleid. `matchtalk.js` geeft tegenstanders een stijl en commentaar, `matchday.js` de verhalen voor en na de wedstrijd.

## 12. Tests en tools

| Bestand | Wat het bewaakt |
|---|---|
| `test/src.js` | laadt een module zoals `build.py` (hulp voor alle tests) |
| `test/sim.js` | speelt N seizoenen met een willekeurige CEO en controleert invarianten (geen NaN, geen kapotte staat) |
| `test/weekloop.js` | reproduceerbare en situatiegedreven selectie, vervolgen, seizoenswissel, opslaan |
| `test/mig.js`, `test/preview-save.js` | oude saves laden; opslaan over de drie previews |
| `test/sack.js` | ontslag is definitief (zeer seed-gevoelig) |
| `test/memory.js` | geheugen, echo's, callback- en top-flightgebeurtenissen |
| `test/rivals.js` | rivaalcoaches, oude saves, Gazette-bericht bij een wissel |
| `test/stats.js` | positie-tellers per 90 en oude saves |
| `test/world.js` | seeded wereld: deterministisch, echte clubs, eigen RNG, snelheid, statistieken |
| `test/turnaround.js` | trigger, strategieën, controle na zes weken |
| `test/budget.js` | de seizoensbudgetregel is eerlijk |
| `test/rec.js`, `test/acad.js`, `test/squad-plan.js`, `test/pathway.js`, `test/summer3.js`, `test/gazette.js`, `test/matchday.js` | de bijbehorende systemen |
| `test/audit.js` | speelstijlen, tegenfeitelijke hendels, tekstherhaling (zwaar) |
| `test/browser/*.py` | echte schermen via Playwright (Python-variant draait niet overal; Node-Playwright staat in `/opt/node-tools`) |

| Tool | Doel |
|---|---|
| `tools/codemap.js` | ververst de gegenereerde delen van `CODEMAP.md` |
| `tools/overview.py` | ververst de gegenereerde delen van dit document |
| `tools/longrun.js`, `tools/longrun-analyze.js` | meet carrières van meerdere seizoenen (herhaling, tempo, ontslag, CEO-stijlen); **duur**, gebruik zuinig |
| `tools/contrast.js` | meet WCAG-contrast op de afdelingsschermen, licht en donker |
| `tools/auditlib.js` | hulp voor `test/audit.js` |

Draaien: `python3 build.py`, daarna `node test/<naam>.js`. Een bouw zonder test is geen bouw.

## 13. Besluiten die dit vormen

De bijbel heeft 44 besluiten (B1 tot B44). De groepen die bepalen hoe je werkt:

- **Wat het spel is:** de CEO kiest nooit het elftal en onderhandelt nooit zelf (B1), geen winconditie, ontslag is definitief (B2), Engels in het spel (B7).
- **Hoe schermen werken (B12 tot B35):** afdelingen met Overview, Setup en Record; één taal voor oordelen; drie oppervlakteniveaus; vlakke achtergrond; berichten beantwoord met één tik (B33).
- **Moeilijkheid (B36 tot B37, B44):** het spel moet moeilijker en fouten blijven kosten; 15 tot 20 seizoenen naar de top; de turnaround als crisis-verhaallijn.
- **Het portaal (B38 tot B43):** de academie als opt-in mentorlaag; een Moneyball-model van vier lagen; het portaal toont data en nooit een oordeel; alleen echte spelvelden; seeded wereld; plak 1 tot 3a gebouwd.

## 14. Waar verander je wat

| Wil je ... | Ga naar ... |
|---|---|
| een **nieuwe gebeurtenis** | een bestand met `E('id', {...})` dat **vóór** `weekflow.js` laadt (bijv. `events3.js`); echo's in `ECHO` van `weekflow.js`; terugkeer-events met `F.recall` |
| een **verhaallijn in delen** | `defineDossier` in `dossiers.js` |
| een **nieuwe statistiek per speler** | `newStats` (`engine/03`), afleiding in `engine/06-match.js`, tarief in `world.js` (`B` en `season`), kolommen in `ui/08b-portal.js` (`PL_SD`, `PL_LAY`, `PL_TCOLS`); test `test/stats.js` en `test/world.js` |
| **moeilijker of makkelijker** | rivaalcoach: `ORG_MEAN`, `newCoach` (`engine/02`) en de evolutie in `engine/10`; step-up: `levers.js`; groei van spelers: `develop` (`engine/08`); bestuursdoelen en goodwill: `setObjectives` en `endSeason` (`engine/10`); staf: `genStaff` (`engine/04`), `strengthParts` (`engine/05`); crisis: `turnaround.js` |
| een **nieuw scherm** | een deel in `src/ui/` (nieuw nummer of letter), een route in `render()` (`ui/13`) of in `vDept` (`ui/08`), een `case` in `act` (`ui/15`) met een `data-a`, stijlen in een eigen deel met een prefix; browsertest |
| een **nieuw systeem met state** | een module `(function (F) { ... })(FO)`; **toevoegen aan `build.py` én aan alle testlijsten**; veilige defaults; `node tools/codemap.js` |
| een **hook toevoegen of wrappen** | `const prev = H.x; H.x = () => prev() + ...`; let op de bouwvolgorde |
| de **geldstroom** | `weeklyFinance` (`engine/07`) en de hooks `gate`, `deptCost`, `merchMult`, `costDisc` |
| de **wedstrijd** | `simOurMatch` (`engine/06`); commentaar in `matchtalk.js`; Gazette in `engine/12` (`buildPaper`) en `matchday.js` |
| de **wereld buiten je club** | `G.clubs` en evolutie in `engine/10`; de seeded wereld in `world.js` (`LGS`, `clubsOf`, `build`, `season`) |
| een **toon of tekst** | de tekst staat bij de gebeurtenis of in `matchtalk.js`; de stem is droog Brits (bijbel sectie 7) |

**Symptoom naar plek**

| Je ziet ... | Kijk eerst naar ... |
|---|---|
| het team is te sterk of te zwak | `strengthParts`, `HOOK.ftExtra`, rivaalcoaches in `G.clubs` |
| een nieuw spel crasht op een veld | een veld zonder default in een oude save: de leesplek (`|| 0`) en `engine/14-save-api.js` |
| een bericht komt te vaak of nooit | `cond`, `cd`, `w` van de gebeurtenis, `evWeight` in `weekloop.js`, de cooldown `G.cd` |
| een test faalt na een kleine wijziging | seed-gevoeligheid (vooral `test/sack.js`) of een bestand dat niet in de testlijsten staat |
| een screen is zwak of wazig | `src/style/02-game-ui-system.css` (drie oppervlakteniveaus), `.dflat` voor afdelingen, `.portal` voor het portaal |

## 15. Wat nu schuurt (eerlijk)

Dit zijn dingen die ik tijdens het werk tegenkwam; ze staan hier zodat we ze gericht kunnen aanpakken.

1. ~~De modulelijst stond op elf plekken~~ — opgelost: één lijst in `src/modules.json`.
2. **Seed-gevoelige tests.** `test/sack.js` ging driemaal stuk door een kleine wijziging in de loop. Scenario's moeten de toestand zelf zetten, niet op een bepaalde uitslag vertrouwen.
3. **Twee spelerswerelden.** `G.rec.pool` (de pool van de DoF met scoutrapporten `G.rec.know`) en `world.js` (seeded, met `G.world.know`). Plak 3b moet ze verbinden: een target uit het portaal moet in de bestaande pipeline komen.
4. **De wedstrijdafleiding staat op twee plekken.** `engine/06-match.js` (per wedstrijd) en `world.js` (per seizoen) hebben elk eigen tarieven voor dezelfde statistieken. `test/stats.js` meet de engine; `test/world.js` toetst de wereld daartegen. Ze delen geen code.
5. **Zomer v1 en v2 bestaan naast elkaar** (`summer.js` levert nog stappen aan `summer2.js`). Dit hoort bij de opruimfase die in `CLAUDE.md` staat.
6. **Eén scope voor alle UI-delen.** Functies in `src/ui/` botsen op naam (daarom prefixen `pl*`, `rx*`, `ac*`). Een nieuw scherm moet een voorvoegsel kiezen.
7. **Balans meten is duur.** `tools/longrun.js` kost veel; er is geen snelle ijkloop voor één systeem. Voor balansvragen is een kleinere harnas (één seizoen, één kenmerk) nuttig.
8. **Grote bestanden:** `events.js` (70 KB), `recruit.js` (38 KB), `summer2.js` (32 KB), `events2.js` (31 KB). Splitsen op een functiegrens is de regel in `CLAUDE.md` (±40 KB), maar `events.js` zit er ver boven.
9. **Bekende open balans:** het seizoensbudget heeft vaak geen ruimte (B36a), de turnaround is niet gemeten.

## 16. Woordenlijst

- **CEO**: jij. **DoF**: Director of Football (aanneemt, scout, onderhandelt). **Head**: hoofd van een afdeling.
- **Mandaat**: de schuifjes en regels die je een hoofd meegeeft. **Bevoegdheid (authority)**: hoeveel hij zelf mag beslissen (short leash, normal, free hand).
- **Grip**: hoe sterk je het club stuurt; zakt als je niet zelf beslist.
- **Achterbannen (backers)**: bestuur, supporters, pers, kleedkamer.
- **CA, PA**: huidige ability en potentieel (1 tot 20). **Pool**: de spelers die de DoF kent.
- **Hook**: een aanroeppunt in de engine dat modules kunnen overnemen.
- **Dossier**: een verhaallijn in drie delen die weken uit elkaar op je bureau landt.
- **Echo**: een gevolg van een eerdere keuze dat in de Gazette terugkomt.
- **Seeded wereld**: een wereld die uit een seed wordt berekend; alleen wijzigingen worden opgeslagen.

## Bijlage: alle bronbestanden

<!-- generated:files:start -->
62 bronbestanden, samen ongeveer 997 KB.

| Bestand | KB | Doel |
|---|---|---|
| `engine/01-core.js` | 2 | rng & utils |
| `engine/02-world-constants.js` | 5 | world constants |
| `engine/03-players.js` | 4 | players |
| `engine/04-staff-dna.js` | 14 | staff; DNA |
| `engine/05-world-selection.js` | 4 | world; squad & selection |
| `engine/06-match.js` | 15 | match simulation |
| `engine/07-finance-transfers.js` | 14 | finance; transfers; academy |
| `engine/08-weekly-inbox.js` | 9 | weekly systems; events & inbox |
| `engine/09-meetings-actions-press.js` | 17 | management meeting & projects (1.2); player actions; press |
| `engine/10-season.js` | 9 | season |
| `engine/11-staffwork-analysis-briefs.js` | 21 | staff work, records & chains (1.1); analysis & scorecards (1.3); weekly briefings (1.5) |
| `engine/12-week.js` | 8 | the week |
| `engine/13-newgame-preseason.js` | 7 | new game; pre-season planning (1.4) |
| `engine/14-save-api.js` | 2 | save |
| `events.js` | 70 | event library (module 1) Each event: from (role/board/fans/press), dept, cd (cooldown weeks), cond, w (weight) |
| `events2.js` | 31 | desk 2.0 configuration, proposals and storylines (1.2) |
| `events3.js` | 13 | event library (module 1, part 3) Two kinds of event that make a long career feel different from a short one: - |
| `briefs.js` | 20 | weekly briefings (1.5) Short, state-driven updates and conversations |
| `academy.js` | 14 | youth academy, module 2 part 1 Age groups, academy staff, development model, education and welfare, pathway |
| `academy2.js` | 28 | youth academy, module 2 part 2 Category & audit, poaching and tribunals, youth competitions, ROI, academy desk |
| `recruit.js` | 38 | recruitment, module 3 part 1 Player world, scouting department, reports with uncertainty, recruitment pipeline |
| `summer.js` | 18 | the transfer summer, module 4 part 1 Five steps between seasons: clear-out, board and budget, market, pre-seas |
| `season.js` | 18 | season rhythm, module 4 part 2 Season blocks with a decision each, board reviews, high-stakes matches, a small |
| `summer2.js` | 32 | the transfer summer, version 2 A summer meeting with the DoF and staff that ends in a signed summer brief, a t |
| `faces.js` | 27 | visual layer, part 1 Procedural ink-style portraits for every person in the game, the CEO's office scene, repu |
| `firstteam.js` | 22 | First team department The coach's own instincts vs your mandate, support staff you can fund, talks as short sc |
| `depts.js` | 21 | departments Every department is a real unit: a head, staff underneath, a budget share, facilities, KPI history |
| `levers.js` | 7 | levers Grip: a club drifts without a CEO steering it |
| `commercial.js` | 10 | Commercial department The stadium as a system (three stands, demand, price, matchday experience), sponsor offe |
| `marketing.js` | 7 | Marketing department A supporter funnel (reach, fans, season-ticket holders), loyalty that cushions bad result |
| `business.js` | 7 | Business department A season budget per department (lean, normal, invest) against what the club can afford, a |
| `academy3.js` | 5 | Academy as a department you run A trial day where you pick the intake, the "is he ready?" call, and a pyramid |
| `recruitx.js` | 25 | Recruitment as a department you run The scouting network per region (focus and investment), the DoF's track re |
| `world.js` | 14 | the seeded world (B38, B39, B42) Every league of the world is computed on demand from a seed: nothing is store |
| `turnaround.js` | 7 | the turnaround (B37, B44) When it goes properly wrong, the board asks what the CEO intends to do |
| `matchtalk.js` | 8 | match identity and commentary Opponents get a style, a form line and a dangerous player; commentary is drawn f |
| `desk.js` | 18 | the CEO's desk Departments decide routine matters themselves, inside the authority the CEO gives each head |
| `talks.js` | 19 | talks with the heads One conversation engine for every head (B19) |
| `weekflow.js` | 25 | the CEO's week Every week has a subject (B22): a derby, a window, a board review, or a quiet week |
| `weekloop.js` | 2 | situation-driven week Chance serves the club's situation: an event is likelier when its department is under pr |
| `loop.js` | 15 | the weekly loop, phase 1 Four backers (board, supporters, press, dressing room), each with its own voice |
| `dossiers.js` | 28 | phase 2: dossiers and pressure A dossier is a storyline in three parts that lands on the CEO's desk weeks apar |
| `pathway.js` | 27 | the pathway question One governance storyline, built to show the core loop: you notice a problem, talk to the |
| `matchday.js` | 10 | match day Before kick-off: three stories about our own players |
| `ui/01-core.js` | 5 | atoms; base club: skip the founding |
| `ui/02-setup.js` | 19 | views: title & setup; mandates as a tactics board |
| `ui/03-summer-preseason-press.js` | 26 | the summer (M4); the summer, version 2 |
| `ui/04-masthead-news.js` | 1 |  |
| `ui/05-pitches-squad-money.js` | 15 | project pitches: one at a time, swipe or tap |
| `ui/06-sheets-ticker.js` | 21 | sheets; ticker |
| `ui/07-club-league.js` | 9 | review & sacked; club, league, staff, academy, review: game screens |
| `ui/08-departments.js` | 25 | departments |
| `ui/08a-dept-parts.js` | 21 | department parts: words for numbers, attention, plan, record; recruitment; academy: the record as four questio |
| `ui/08b-portal.js` | 26 | navigation; leagues: a table whose columns follow the position filter; the player; drill-downs |
| `ui/09-firstteam-review.js` | 12 | first team department |
| `ui/10-inbox.js` | 18 | render; inbox home (1.6) |
| `ui/11-players.js` | 9 | players: cards, profiles, stories |
| `ui/12-scenes-cards.js` | 15 | game UI helpers |
| `ui/13-redbox-render.js` | 14 | the red box: an email you answer on one screen |
| `ui/14-matchday-gazette.js` | 25 | match day: preview, match, gazette (full screens); the Gazette: one design, opened after the match and from th |
| `ui/15-actions.js` | 19 | actions |
| `ui/16-boot.js` | 0 | boot |
<!-- generated:files:end -->
