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
| `seasonWeekly` | eenmaal per week aan het einde van de weeklus, voor de nieuwe berichten | `season.js`, `recruitx.js`, `world.js`, `turnaround.js` | `engine/12-week.js` |
| `summerStart` | start van de zomer (ketting: season, summer, summer2) | `summer.js`, `season.js`, `summer2.js`, `recruitx.js` | `engine/10-season.js`, `engine/13-newgame-preseason.js` |
| `deptCost` | wekelijkse kosten per afdeling | `depts.js`, `commercial.js`, `marketing.js` | `engine/07-finance-transfers.js`, `levers.js`, `ui/07-club-league.js` |
| `effBonus` | extra effectiviteit van een staflid (afdelingsperks, desk) | `depts.js`, `levers.js`, `desk.js` | `engine/04-staff-dna.js` |
| `acadIntake` | jaarlijkse instroom van de academie (week 28) | `academy.js`, `academy3.js` | `engine/12-week.js` |
| `acadSeason` | academie aan het seizoenseinde | `academy.js`, `academy2.js` | `engine/10-season.js` |
| `acadWeekly` | wekelijkse academie (ontwikkeling, welzijn, competitie) | `academy.js`, `academy2.js` | `engine/12-week.js` |
| `deskBriefs` | het bureau voegt korte briefings toe | `desk.js`, `weekflow.js` | `engine/11-staffwork-analysis-briefs.js` |
| `ftDev` | extra bij de ontwikkeling van spelers | `firstteam.js`, `depts.js` | `engine/08-weekly-inbox.js` |
| `ftInj` | factor op de blessurekans | `firstteam.js`, `depts.js` | `engine/06-match.js` |
| `merchMult` | factor op merchandise-inkomsten | `depts.js`, `commercial.js` | `engine/07-finance-transfers.js` |
| `recSeason` | recruitment aan het seizoenseinde | `recruit.js`, `season.js` | `engine/10-season.js` |
| `recWeekly` | wekelijkse scouting en DoF-pipeline | `recruit.js`, `recruitx.js` | `engine/12-week.js`, `summer2.js` |
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
| `engine/11-staffwork-analysis-briefs.js` | `later`, `reports`, `bcd`, `briefs` |
| `engine/12-week.js` | `phase`, `sackReason`, `queue`, `briefs`, `over`, `paper`, `msNew`, `prev`, `prevFan`, `lastMatch`, `lastCup`, `ap`, `later`, `inbox` |
| `engine/13-newgame-preseason.js` | `club`, `mand`, `cup`, `phase`, `pre`, `meeting`, `press`, `pressDone`, `paper` |
| `engine/14-save-api.js` | `ap`, `later`, `v` |
| `events.js` | `academy`, `freezePrev` |
| `briefs.js` | `dofPrio`, `dofPrioAt`, `wageFreezePrev` |
| `academy.js` | `acad`, `academy` |
| `academy2.js` | `academy`, `squad` |
| `recruit.js` | `shortlist`, `rec` |
| `summer.js` | `phase`, `sum`, `inbox`, `lastSummer`, `squad`, `preEdge`, `winDone`, `lastWinter` |
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
4. **De wedstrijdafleiding staat op twee plekken** (`engine/06-match.js` per wedstrijd, `world.js` per seizoen). De verhoudingen tussen schoten, sleutelpassen en xG staan nu op één plek (`F.STATK`); de tarieven per positie blijven twee tabellen die `test/stats.js` op elkaar afstemt.
5. **Zomer v1 en v2** zijn opgeruimd tot een basis (`summer.js`: contracten, planner, deadline day, afsluiting) en de huidige zomer (`summer2.js`: vergadering, ticker, editie, debrief). De dode oude marktrondes zijn weg. Ze samenvoegen tot één bestand zou ±50 KB geven; dat is niet gedaan.
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

## 17. Hoe het speelt: recruitment en zomer

Gelezen op 2026-11-16: `recruit.js`, `recruitx.js` (kop en structuur), `summer.js` en `summer2.js` (structuur, de brief, de ticker, het debrief), `dofWork` in engine/07. **Niet gemeten**: geen enkel getal hieronder is in een run getoetst. Dit is wat de code doet, niet hoe het voelt.

### Recruitment (`recruit.js`, state `G.rec`)

**Wat de speler ziet en beslist.** Hij stelt prioriteiten per positie (`plan.prios`, soort: jong, bewezen, waarde) en mandaten voor de DoF (`approve`, `maxFee`, `maxWage`, `maxAge`, `hard`, `clauses`, `youth`, `data`, `depth`). Daarbuiten grijpt hij in bij vier events: `rec_approve` (boven de goedkeuringslijn), `rec_exception` (de DoF breekt een regel), `rec_raise` (de verkoper wil meer) en `rec_rival` (een rivaal biedt mee).

**De keten, elke week (`H.recWeekly`).**
1. `topUpPool`: de pool wordt aangevuld tot 34 spelers in het eigen land en 22 per andere regio, plus minstens `14 + 1,5 × niveau` vrije spelers per positie. Boven 520 spelers worden verre niveaus weggegooid.
2. Scouts: de chef-scout plus `nScouts()-1` extra scouts (2 + budget/35, +1 met het perk). `assignScouts` geeft elke scout een opdracht: een speler kijken (als er twijfelgevallen zijn, 50%) of een profiel/regio doorzoeken (2–4 weken).
3. `scoutWeek`: een scout vindt per opdracht met kans `0,45 + vaardigheid/50 (+0,2 met een push)` een kandidaat, die voor 85% de regels van de DoF moet halen. Dan schrijft `report()` een rapport.
4. `dofPipeline`: bepaalt fasen (identified → scouted → recommended → approach → negotiating → agreed → signed/lost), ten hoogste 2 gelijktijdige onderhandelingen, en alleen als het venster open is.
5. `negRound`: maximaal 3 rondes, bod per ronde, clausules (sell-on 15%, termijnen), 7% (14% bij een A-grade) kans op een rivaal. Daarna `wagePhase` en `complete`.
6. `worldWeek`: 1,2% per speler per week dat hij naar een andere club gaat, en dat kost je een target.

**De onzekerheid.** Een rapport (`report`) schat de CA als `echt + bias van de scout + ruis`, met een ruis die kleiner wordt door scoutvaardigheid, netwerk, het data-perk en elk volgend rapport (`sd/√(n+1)`). De speler ziet een sterrenband en een betrouwbaarheid (low/medium/high), nooit het echte getal. De **grade A–D** is een score van de DoF (`grade()`): geschatte CA tegen de selectie, +0,5 bij een passend profiel, +0,6 bij een behoefte, −1,5 als hij het budget ver overstijgt. Dit is dus al een oordeel, en het is wat het portaal juist níet mag doen (B40). De grade zit nu alleen in deze oude pipeline.

**Wat ik opmerk.**
- De DoF beslist in `dofPipeline` zelf over bijna alles. De speler ziet vooral uitkomsten en vier events. Hoe vaak die events komen is niet gemeten.
- Onderhandelen is bijna deterministisch: de speler kan alleen de mandaten instellen, en daar zit de speelruimte. Dat past bij de pijler "leiden zonder alles zelf te doen", maar het is ook de plek waar het spel weinig te beslissen geeft.
- **Twee spelerswerelden:** deze pool (`G.rec.pool`, een paar honderd spelers rond je niveau) en de 14-competitie-wereld van het portaal (`world.js`) delen niets. Een speler uit het portaal kun je niet naar deze pipeline sturen. Dat is slice 3b.

### Recruitx (`recruitx.js`) en de squadplan-helft

Twee losse stukken in één bestand. Het eerste (`rx*`): per regio focus en investeren in je netwerk, plus het trackrecord van de DoF (hits/misses). Het tweede (`squadPlan`, state `G.rec.squadPlan`): een **rollend plan** per positie, met twee horizons (winter en zomer-opvolging), dat de scouts een opdracht geeft (`squadPlanScoutJob`) en de aankoop in de winter kan tegenhouden (`squadPlanAllows`). Dat tweede deel is het deel dat het slechtst zichtbaar is in het spel zelf, en `test/squad-plan.js` faalt al.

### De zomer (`summer.js`, `summer2.js`, state `G.sum`)

**Volgorde.** `summerStart` maakt `G.sum` en zet daar de eindigende contracten in (met advies en eis). `summer2.js` wikkelt dat in `H.summerStart` en zet er `mt` (de vergadering) en `tk` (de ticker) bij. Stappen: **Summer meeting → The summer → Summer edition → Debrief → Season goals**.

**1. De vergadering (`summer2`).** Vier punten: de staat van de club, het geld, wat we nodig hebben, en de zomerbrief. De DoF "reageert" met een eigen karakter (`ego`, `risk`, `loy`, relatie) op wat jij vraagt; `stance(cost)` bepaalt hoe vaak hij tegenstribbelt. Eindproduct: een **brief met KPI's**: tekenen voor twee posities, netto uitgaven onder 90% van het budget, plus "minstens drie transfers" of "een duidelijke A-upgrade". `applyBrief` zet de prioriteiten, `approve`, `maxFee` (100% bij "ster", 50% anders), verkoop- en behoud-vlaggen en plaatst de lijsten in de pipeline als plan A/B.

**2. De ticker.** Zes weken waarin `recWeekly` + `dofWork` draaien. Per week een paar regels (`explain`): onderhandelingen, plan A dat valt en plan B, regels die breken. Een oproep van de DoF (events) onderbreekt, anders beslist hij zelf. Week 4–5: een oefenwedstrijd. Daarna **deadline day** (`F.ddStart`, `summer.js`): een dag met uurmomenten.

**3. De uitgave en het debrief.** `evalBrief` toetst de KPI's; `sum2Edition` geeft een **zomercijfer A–E** (`score = KPI's × 1,2 + clamp(ΔXI × 3) + 0,5 voor ≥1 transfer`). Het debrief (`five()`) beantwoordt vijf vragen: plan gevolgd, uitvoering, pech op de markt, team beter, kosten. Als de zomer slecht liep, kun je de DoF ter verantwoording roepen (`dofStrikes`).

**Wat ik opmerk.**
- De zomer is de best uitgewerkte verhaallijn van het spel: plan → uitvoering → verantwoording. Het is ook de plek waar de DoF-relatie het meeste doet.
- **v1 en v2 zijn niet gescheiden.** `summer.js` levert contracten, deadline day, de opruiming en `finishSummer`. `summer2.js` legt de vergadering en ticker eroverheen. Opruimen vergt dus een samenvoeging, geen verwijdering.
- `dofWork` (engine/07) heeft nog een eigen oude aankooplogica (`if (HOOK.recWeekly) return;`). Met `recruit.js` geladen is die dood code; zonder wordt hij gebruikt. Dat is de enige plek waar v0-gedrag nog in de engine zit.
- Het zomercijfer weegt de KPI's zwaarder dan de echte teamverbetering. Niet gemeten of dat goed uitpakt.

### Wat dit betekent voor verbeteringen
| Idee | Eerst bekijken |
|---|---|
| Portaal-target in de DoF-pipeline (3b) | `F.recAddPipe`, `RC().pool` en hoe `know` per speler wordt gevuld; een gedeeld `G.rec.know` voor beide werelden |
| Meer beslissingen bij onderhandelen | `negRound`, `rec_raise`, de mandaatinstellingen; de kans per ronde meten |
| Zomercijfer eerlijker | `sum2Edition` (de weging), `five()` |
| Opruimen v1/v2 | `summer.js` + `summer2.js` samenvoegen; `dofWork`-fallback verwijderen |
| Squadplan zichtbaar of weg | `recruitx.js` tweede helft, `test/squad-plan.js` repareren |

## 18. Hoe het speelt: events en briefings

Gelezen op 2026-11-16: `genMessages`/`defineEvent` (engine/08), `weekloop.js` (kop en gewichten), de kop van `briefs.js`, plus een telling (hieronder). **Niet gelezen**: de teksten en keuzes van de ±120 events zelf, `dossiers.js` en `loop.js` in detail.

### Het mechanisme
- **Een event** (`defineEvent(id, {from, dept, cd, w, cond, opts, second, forced, mode})`) heeft 2–3 keuzes (118 van de 123 hebben er 2 of 3). `from` is wie het meldt, `cd` het aantal weken tot hij weer mag, `cond` wanneer hij kan komen, `w` een gewicht.
- **Per week** (`genMessages`): eerst de **geforceerde wachtrij** (maximaal 4; dit zijn events die andere systemen aanzetten, zoals `rec_approve` en `turn_call`). Dan **1 of 2 gewone slots** (55% één, anders twee), maar **geen extra als er al 3 open berichten staan**. Dan 1–2 **auto-events** (`mode: 'auto'`), die de staf zelf afhandelt en alleen in de Gazette komen.
- **Gewichten**: `w × evWeight`. `weekloop.js` maakt een event 2× waarschijnlijker als zijn afdeling onder druk staat (`heat` 0–2: slechte reeks, tekort in de selectie, geld krap, bestuursvertrouwen laag), 0,8× als ze rustig is, en ×0,6 als er net een bericht van dezelfde afdeling was.
- **Telling van het aanbod**: 123 events, waarvan **49 geforceerd** (alleen via een ander systeem bereikbaar), **24 auto**, 50 gewoon. 61 hebben een `cond`, 17 een eigen gewicht, 9 een "tweede mening". Wie meldt: DoF 20, bestuur 18, coach 17, academie 15, commercieel 14, financiën 14, supporters 9, marketing 9, pers 5, scout 2. Cooldowns: 41 events ≤4 weken, 40 meer dan 20.
- **Briefings** (`briefs.js`, 12 `defineBrief` plus die in `academy*.js`): korte, door de toestand gedreven updates met gratis antwoorden. Ze blijven staan tot ze beantwoord zijn.

### Wat een run laat zien
Eén korte telling (3 seeds, 12 seizoenen samen, 408 weken, antwoorden willekeurig, alle staf aangenomen). **Dit is een aanwijzing, geen meting van een echte speler.**
- **0,9 nieuw bericht per week, ±31 per seizoen.** Dat past bij de bedoeling ("één of twee subjecten per week").
- **59 van de 123 events kwamen langs.** De rest is niet gezien: voorwaarden die zelden waar zijn, of geforceerde events die een situatie nodig hebben.
- **Herhaling**: de top-3 (`board_review` 29, `press_interview` 25, `staff_raise` 22) is 21% van alle berichten, de top-10 41%. `board_review` en `press_interview` zijn bewust vast (bestuursreview, persgesprek), maar `staff_raise` is willekeurig en komt het vaakst. Over 12 seizoenen is dat zichtbaar herhaling.
- **Briefings**: `genBriefs` stelt elke week een **nieuwe** lijst samen (maximaal 3, één per rol, zwaarste score eerst); wat je niet beantwoordt, verdwijnt aan het einde van de week. De telling in de run (2,5 per week) telt dus presentie per week, geen ophoping. De vaakst voorkomende zijn `rec_report` 110, `coach_debrief` 102, `squad_plan_update` 86, `u18_report` 63 en `stake_match` 54 van 408 weken. *(Een eerdere versie van dit hoofdstuk beweerde ten onrechte dat ze zich opstapelen.)*

### Wat ik opmerk
- **De gewichten sturen goed, maar de inhoud is breed en dun**: 123 events voor 10 afdelingen is ±12 per afdeling, en met cooldowns van tot 20+ weken ziet iemand over 15 seizoenen veel hetzelfde. Dat is het langetermijnprobleem dat B34 (geheugen en echo's) deels oploste: oude keuzes komen terug, maar alleen als de keuze er was.
- **Scouting heeft maar 2 events** (`from: scout`) en de DoF-events zijn vooral procesvragen (goedkeuren, uitzondering, prijsverhoging). Daar valt winst te halen, met name rond het portaal.
- **49 geforceerde events** betekent dat de helft van het aanbod alleen bestaat doordat een systeem hem aanzet. Als dat systeem faalt, valt het event stil zonder dat iemand het ziet.
- **Een tegenvoorbeeld is `turn_call`/`turn_check`**: nieuw, 9 en 10 keer gezien in 12 seizoenen. Dat lijkt veel voor een crisis die één keer per 40 weken mag komen (`turnLast`). Ik heb niet nagekeken of de seeds echt zo vaak in de problemen zaten of dat de drempel te laag ligt. Dit is wel een kandidaat om te meten, omdat ik dat nooit heb gedaan.

### Wat dit betekent voor verbeteringen
| Idee | Eerst bekijken |
|---|---|
| Minder herhaling | `staff_raise` (`cd` en `cond`), `cond`s van de top-10; dan een volgende telling |
| Meer variatie in een afdeling | de ±12 events per afdeling in `events*.js`; `defineDossier` voor ketens |
| Scouting- en portaalevents | nieuwe events in `events3.js` (`from: 'scout'`/`'dof'`), met `F.recall` voor terugkeer |
| Turnaround-frequentie | `trouble()` in `turnaround.js`; telling van `turn_call` per seizoen op meer seeds |
| Te veel van dezelfde briefing | `briefs.js` (`genBriefs`: één per rol, `cd`, score); een briefing die elke week wint, heeft een te hoge score of een te korte `cd` |
## 19. Hoe het speelt: de academie

Gelezen op 2026-11-16: `academy.js` (vrijwel geheel), `academy3.js` (geheel), `academy2.js` (categorie, jeugdcompetities, weekhook, seizoenshook; de events en het diagnoseblok alleen als lijst). **Niet gelezen**: de teksten van de 7 academie-events en de UI in `ui/` (het scherm met Overview/Setup/Record). Hieronder staat ook één kleine telling (3 seeds, ≤6 seizoenen, willekeurige antwoorden), een aanwijzing en geen meting van een echte speler.

### Structuur
- **State** `G.acad` (staf, niveau per groep `lv`, reputatie `rep`, `found` = kwaliteit/aantal van de aanwas, cohorten, log, uitvallers), `G.academy` (de spelers), `G.acadX` (proefdag), plus `a.cat`, `a.lg` (jeugdcompetities) en `a.cup`.
- **Vier groepen** (U14 U16 U18 U21), plafond 10/10/10/6 spelers. **Drie jeugdstafleden** (`ycoach`, `yrec`, `ycare`), gekoppeld aan je academiedirecteur en aan afdelings-perks (`ybonus`).
- **Spelers** hebben `ca` (nu), `pa` (plafond), `edu` en `wel` (onderwijs en welzijn) en `band`: een **sterrenband** met onzekerheid die kleiner wordt met de leeftijd en het niveau van scouting en coaching. Je ziet dus nooit het echte plafond, alleen een schatting (zelfde idee als bij de scoutrapporten).

### De ketens
**Instroom (week 28, `acadIntake`).** 3–9 jongens van 12–13, afhankelijk van `yrec`, reputatie, faciliteiten en categorie, plus 0–2 late instromers van 14–15. `academy3` maakt daar de **proefdag** van: de recruiters tonen een lijst (instroom + 3 extra), jij kiest een criterium (hoogste plafond, lokale jongens, het snelst klaar), na 2 weken wordt het automatisch bevestigd. Je kiest dus nooit een kind, alleen wat de recruiters zoeken (pijler P1). Een talent met band ≥4★ geeft het event `wonderkid`.

**Elke week (`acadWeekly`).** Niveau per groep schuift 2% richting een doel (budget, faciliteiten, coach). Elke speler groeit met `(pa−ca)×0,0033×mult` met `mult` uit de groep, coach, faciliteiten, mentors, persoonlijkheid, welzijn en pushes. Technische of fysieke accenten volgen de mandaatschuif. Onderwijs en welzijn trekken naar een doel dat van `ycare`, budget en filosofie afhangt; moraal volgt welzijn. Daarnaast spelen **U18 en U21 een competitie van 12 teams** (`playRound`, poisson, sterkte uit je 11 beste jongens) en er is een **jeugdbeker**. Poaching door andere clubs komt als `acad_poach`. Week 30 geeft de **jaarlijkse audit** (categorie 1–4, score uit faciliteiten, coaching, staf, onderwijs, welzijn, budget).

**Seizoenseinde (`acadSeason`).** Iedereen een jaar ouder. Kans op groeispurt (15% tot 17 jaar), laat bloeien (8%, 16–18) of een knik in het plafond (6%, vanaf 15). **Uitval** per speler van 7% plus extra bij laag welzijn, laag onderwijs of een band onder het niveau. **17 jaar:** scholarship of niet (op band ≥ niveau −0,5). **Vanaf 19:** doorstromen naar de selectie als `ca` ≥ niveau −0,7 −pace×0,7 (of, vanaf 20, het plafond hoog genoeg is) en er plek is (<27 spelers), anders U21 behouden, anders vrijlaten. Daarna spelen-omhoog-, uitleenregels en vervanging van jeugdstaf.

**Terug in het eerste elftal.** `promote` zet de speler in `G.squad` met contract 3 en 60% van het marktsalaris. De coach beslist over speeltijd (jeugdmandaat). `ac_ready` is een briefing: "Is X ready?" (promoveren, nog een seizoen, uitlenen).

### Wat een kleine run laat zien
Seizoenstelling in tier 6–8 (niveau 5–8 CA):
- **Doorstroom is zeldzaam**: 0–2 spelers per seizoen naar de selectie, in de meeste seizoenen 0. 8 van 14 seizoenen hadden **geen enkele promotie**.
- **Wie doorkomt, zit rond het niveau van de divisie** (CA 6,1–8,4 tegen een divisiegemiddelde van 5–7,8) en soms er net boven. Dat is wat B37 vroeg: geen wonderkinderen die het spel kapotmaken.
- **De academie zelf blijft ±13–18 spelers groot**, 0–3 uitvallers en 0–2 vrijgelaten per seizoen.
- **Categorie 4 → 3** in een van de drie runs, de twee andere bleven op 4.
- Eén kanttekening: de eerste spelers die als "eigen jeugd" meetellen zijn de startgeneratie van 17–18-jarigen (`acadInit`). Die zijn niet representatief voor wat de academie later zelf voortbrengt.

### Wat ik opmerk
- **De wekelijkse "kijk er naar"-laag is dun.** De spelers groeien in een lus waar jij niets van ziet; wat er gebeurt komt op het seizoenseinde en in 7 events en 12 briefings. De wens dat de academie "iets is waar je wekelijks naar zou kijken" (de mentor-/wedstrijdroute) staat nog open; het mechanisme (`playRound`) bestaat wel al en schrijft zelfs een "ster van de wedstrijd" per ronde.
- **Een verhaallijn per kind ontbreekt.** Alle spelers delen één groeiformule en er is geen terugkerende band tussen jou en een speler, anders dan `wonderkid` en `ac_ready`.
- **Aanbod en doorstroom zijn ver uit balans**: 3–9 jongens per jaar in, 0–2 eruit. De meeste jaren zie je dus alleen uitvallers en vrijgelaten spelers. Dat is realistisch maar zorgt voor weinig beloning; het is een keuze die bij de bijbel moet passen (pijler langetermijn).
- **Drie bestanden, drie generaties**: `academy.js` (kern), `academy2.js` (categorie, competities, events), `academy3.js` (proefdag, briefings). Ze wikkelen elkaar via hooks (`acadIntake`, `acadWeekly`, `acadSeason`); samenvoegen is niet nodig maar de volgorde moet blijven.

### Wat dit betekent voor verbeteringen
| Idee | Eerst bekijken |
|---|---|
| Wekelijkse reden om te kijken | `playRound` en `ac_*`-briefings; de U18/U21-wedstrijd zichtbaar maken (mentorroute) |
| Meer doorstroom of een ander ritme | de drempel in `acadSeason` (`thr`, `pace`), `genYouth` (`pa`) en een meting op meer seizoenen |
| Verhaal per jeugdspeler | `G.mem`/`F.recall` uit `weekflow.js`; een `wonderkid`-achtige keten in `dossiers.js` |
| Academie en portaal | `world.js` kent geen eigen jeugd; koppel `G.world` aan de aanwas of aan de poaching |
## 20. Hoe het speelt: first team, grip en de afdelingsstructuur

Gelezen op 2026-11-17: `firstteam.js` (grotendeels; de gesprekken zelf, `talkAnswer`, alleen de structuur), `levers.js` (kern), `depts.js` (rollen, kosten, hooks), `desk.js` (kop, de vier lijsten, `H.desk`), `talks.js` (`weekly`). **Niet gemeten**: hier is niets gedraaid, dit is wat de code doet.

### De afdelingsstructuur (`depts.js`)
- Zes afdelingen: **first team, recruitment, academie, commercieel, marketing, business**. Elke afdeling heeft een **hoofd** (coach, DoF, academiedirecteur, commercieel, marketing, financieel), 2–4 plekken voor **ondersteunend personeel** (afhankelijk van de divisie: 2 op niveau 7–8, 4 op 4 en hoger) en een **budgetniveau** (lean/normaal/invest).
- Personeel heeft een **rol** (bijv. Assistant coach, Match analyst, Scout, Sponsorship manager, Accountant) en een **karaktertrek** (Experienced 1,25×, Steady, Hard-working, Well-connected, Young talent 0,8× maar groeit, Ambitious 1,2× maar kan vertrekken). Een rol geeft het hoofd een **bonus op een eigenschap** (`effBonus`, bijv. `['coach', 0, 1.2]`), plus afdelingsperks die elders opgezocht worden met `F.deptHas('first', 'ana')`.
- Het budget werkt via `deptB` en `deptCost`: first en commercieel hebben een eigen budget, de andere gebruiken een mandaatschuif (`scout`, `acad`, `mkt`). First-budget geeft ±0,17 sterkte, ontwikkeling en blessurekans.

### First team (`firstteam.js`, state `G.ft`)
**Het kernidee**: de coach heeft **eigen voorkeuren** (`pref`: aanvallend, jeugdminuten, rotatie, intensiteit, afgeleid van zijn karakter) en jij zet een **mandaat**. Wat hij werkelijk doet is `act(k) = mandaat × naleving + voorkeur × (1 − naleving)`. De **naleving** (0,35–1) hangt af van zijn relatie met jou (`rel`), zijn ego en loyaliteit, een lopende afspraak en een tijdelijke bonus na een gesprek. Als het verschil ≥15 punten is, daalt zijn relatie wekelijks en vraagt hij om een gesprek.

**Wat het doet in de wedstrijd.** Rotatie en intensiteit tellen mee in blessurekans en teamsterkte (±0,06 en ±0,025 per honderd punten, `ftInj` en `ftExtra`). Een fitnesscoach geeft −35% blessures, de analist +0,12 sterkte, de assistent +0,05 en +0,1 ontwikkeling, de psycholoog trekt moraal 6% per week richting 70.

**Gesprekken en afspraken.** `talkStart` opent een korte scène (gratis, B19). Een **afspraak** (`deal`: top 6, bovenste helft, top 2, onverslagen in 5, jeugd ≥1,5 U21 per wedstrijd) wordt aan een deadline getoetst: gehaald geeft relatie +8, een tijdelijke boost en bestuur +3; gemist relatie −4, bestuur −4 en prestatie −6. **Ontslag** (`sack`) kost 8–20 weken salaris plus effecten op fans, pers en kleedkamer; "onder verwachting" is minder erg dan "boven".

**Wat ik opmerk.** Dit is het meest uitgewerkte "leiden zonder zelf te doen": het mandaat is een voorstel, geen opdracht. Het is ook de plek waar de moeilijkheid van B37 woont (coach-kwaliteit in teamsterkte en de step-up straf). Hoe vaak de coach mandaten naast zich neerlegt in een echt spel is niet gemeten.

### Grip (`levers.js`, `G.grip`)
Een tweede, onzichtbaar systeem: **grip** (0–100, start 60) meet hoeveel je zelf stuurt. Eigen beslissingen (antwoord op een bericht +6, briefing +3, gesprek +5, voorstel +3) bouwen grip, **maximaal 16 per week**; elke week zakt hij **5**. Grip 100 geeft +3,6 en grip 0 geeft −3,6 op de eigenschappen van **alle hoofden** (met een gewicht: coach/DoF/academie 1, marketing 0,6, commercieel 0,4, financiën 0,3). Onder 25 daalt bestuur en relaties wekelijks en komt een Gazette-bericht ("Who runs this club?"). Mandaten, budgetten en personeel bouwen sinds B21 géén grip meer.

De module bevat ook het **finance-alarm** (`fin_alarm` als het geld binnen ~6 weken op is, met vier keuzes), de **loonplafond-trim** (Finance verkoopt een hoogverdiener als het loonaandeel >12 punten boven het plafond komt) en de **step-up straf** (−1,2 teamsterkte in het eerste seizoen in een nieuwe divisie, vervaagt na ~50 weken).

**Wat ik opmerk.** Grip is de drijfveer achter "je moet er elke week bij zijn". Het is niet zichtbaar behalve onder 25. Of 5 per week zakken en 16 per week winst goed staat voor de speeltempo (één of twee berichten per week, zie hoofdstuk 18) is niet gemeten. Ik vermoed dat een speler die weinig te beslissen krijgt, grip verliest zonder iets fout te doen; dat is te toetsen met één telling.

### Het bureau en de gesprekken (`desk.js`, `talks.js`)
- **Autoriteit per hoofd** (kort touw / normaal / vrije hand): bepaalt welke routinezaken een hoofd zelf afhandelt (`H.desk`) en hoeveel hij fout doet (`errChance`, lager bij een goede, hogere bij vrije hand). Een fout geeft `slip`: club-drift +2 (+3 bij vrije hand) en bestuur −. Vaste lijsten bepalen wat **altijd** bij jou ligt (`CORE`, `CLASH` tussen afdelingen), wat bij een sterk hoofd mag (`SOFT`) en wat de reputatie raakt (`REP`).
- **`talks.js`** is één gesprekssysteem voor alle hoofden: een hoofd vraagt om een woord als er iets is (mandaatverschil, koude relatie, regelbreuk, slecht verdict). Laat je het twee weken liggen, dan beslist hij zelf binnen zijn mandaat.

### Wat dit betekent voor verbeteringen
| Idee | Eerst bekijken |
|---|---|
| Coach-gedrag zichtbaarder maken | `mandateRows` en `view()` (al in het scherm); hoe vaak `gap.d ≥ 15` voorkomt (telling) |
| Grip afstemmen op het tempo | `levers.js` (`MAXW`, `DECAY`, `GW`), een telling van grip over 10 seizoenen |
| Nieuwe afdelingsrol of perk | `ROLES` in `depts.js` (rol, effect, lijst); `deptHas` aan de gebruikskant |
| Fouten van een vrije hand voelbaarder | `errChance` en `slip` in `desk.js` |
| Nieuw gesprek met een hoofd | `reqText`, `reqOpts` in `talks.js` |

## 21. Hoe het speelt: commercieel, marketing en business

Gelezen op 2026-11-17: `commercial.js` (vrijwel geheel), `marketing.js` (geheel op de drie briefs na), `business.js` (kern: kosten, envelop, voorstel). **Niet gelezen**: de resterende briefs van business, de UI. **Niet gemeten**: geen run voor dit hoofdstuk.

### Commercieel (`G.com`)
- **Stadion als systeem**: drie tribunes (thuisvak 35%, hoofdtribune 40%, familietribune 25%) met elk een eigen **prijselasticiteit** (0,5 / 0,8 / 1,2), een kern- en toevalsaandeel en een standaardprijs. De vraag (`demand`) is `kern × opkomst + toevallig publiek`, gecorrigeerd voor prijs (`1 − elasticiteit × (prijs − 1)`), vorm van de laatste vijf wedstrijden, matchday-beleving (niveau 1–5, kost meer per week), en promo's. De opkomst bepaalt de recette (`H.gate`), het thuisvoordeel (`H.homeEdge`: `0,15 + vulling × 0,4 + (fans − 50)/250`) en `merchMult`.
- **Sponsors**: om de 6–9 weken komt een aanbod (kort 34 weken of lang 102 weken, sector bepaalt het bedrag; wedden betaalt 35% meer maar kost fans bij een gemeenschapsclub). Je kunt **accepteren**, **harder onderhandelen** (kans `0,35 + commercieel/40`, +20%, anders loopt hij weg) of **weigeren**. Maximaal 5 deals tegelijk.
- **Beslissingen die je neemt**: prijs per tribune, matchday-niveau, een promo (familiedag, halve prijs op de familietribune), sponsorreacties; afdelingsrollen (ticketing, retail, sponsoring) verschuiven de vraag.

### Marketing (`G.mk`)
Een **trechter**: bereik (`reach`) → fans (`fanbase`) → seizoenskaarthouders, plus **loyaliteit**.
- Bereik schuift 3% per week richting `fan-doel × 3,2 × (head-vaardigheid)`. Een **campagne** (gezinnen, studenten, regionaal, online; 900–2600 kosten, 5–8 weken) duwt het bereik extra en kan het merk laten groeien.
- Loyaliteit trekt naar `38 + 12 × gemeenschapsprogramma + vaardigheid` en dempt **dalende fans na een slechte reeks** (0,6% per week bij ≤ −3, gedempt door loyaliteit).
- De **fanbase** schuift 4% per week naar `bereik × aandeel` (aandeel uit vorm, loyaliteit en matchday-niveau). Seizoenskaarten worden elk seizoen in week 1–2 verkocht (`fanbase × 6–45%`, afhankelijk van loyaliteit en de hoofdtribuneprijs).
- Een **toon** (stoer/saai) geeft een kleine kans op een pers-incident bij online campagnes (25% bij toon > 60).

**Hoe commercieel en marketing in elkaar grijpen**: marketing maakt fans en bereik; commercieel zet die om in recette en sponsorwaarde. De familietribune en de campagne "Local families" werken samen (+20% vraag), `G.com.exp` verhoogt zowel merch als de fan-conversie, en seizoenskaarten hangen aan de prijs van de hoofdtribune. Er is een eigen **conflict-event** (`com_mkt_clash`) als de twee elkaar tegenwerken (valt onder `CLASH` in `desk.js`).

### Business (`G.biz`)
- **Budgetniveau per afdeling** (cut/lean/normaal/invest = < 25 / 25 / 50 / 80) tegen een **envelop** (`rev × 0,97 − overige kosten`). `plan()` rekent per afdeling wat elk niveau kost (`deptCostAt`) en toont de totale uitgave tegen de envelop. De **voorspelling** van de omzet is onnauwkeurig afhankelijk van de financieel directeur: fout `(1 − (fin − 4)/14) × 25%`, kleiner met een accountant.
- **Voorstel** (`propose`): de financieel directeur begint op normaal en zet afdelingen op lean (eerst de niet-beschermde) tot het past; het DNA beschermt first team, en academie als de club daar om bekend staat. Heeft hij ruimte, dan zet hij first, commercieel en marketing op invest. Het voorstel zit in een briefing (`biz_budget`) die jij goedkeurt of aanpast.
- **Kleinere hefbomen**: contractvoorwaarden (`fin`-vaardigheid en een advocaat drukken het loon bij een aanname met tot 15%), een kostenbeheerser (−8%) en een **herfinanciering** (`biz_refi`).

### Wat ik opmerk
- **De drie afdelingen zijn klein en afgerond** (24 KB samen), maar ze delen veel state (`G.com.exp`, `G.com.pf`, `G.mk.camp`, `seasonTix`). Wijzigingen hebben snel een tweede-orde-effect op de fanbase of de recette.
- **De financiële keten is serieus doorgetrokken** (budget → envelop → alarm → trim → noodmaatregelen), maar de eigenlijke inkomsten zijn voor een niet-spelende speler afleesbaar. Dat is eerder gerepareerd (de "£0-regel").
- **Open balans**: het seizoensbudget heeft vaak geen ruimte (B36a, gemeten in de budgettest: 25–29 van 48 weken). Ik heb niet nagegaan of dat komt door te lage inkomsten of te hoge afdelingskosten.
- **Marketing is traag**: 3–4% per week betekent dat een campagne van 6 weken ±20% van haar effect laat zien, en loyaliteit is de enige echte buffer. Of dat voelbaar genoeg is voor een speler is niet gemeten.

### Wat dit betekent voor verbeteringen
| Idee | Eerst bekijken |
|---|---|
| Budget heeft geen ruimte (B36a) | `plan()`/`deptCostAt` in `business.js` tegenover `weeklyFinance` (engine/07); eerst meten welke post domineert |
| Sponsors levendiger maken | `newOffer` (bedragen, sectoren), `offerWeekly`; een sponsorverhaal via `dossiers.js` bestaat al (`sponsor`, `kits`) |
| Marketing voelbaarder maken | `H.fanWeekly` (0,03 en 0,04), de campagnekosten en de weergave in `mkView` |
| Seizoenskaarten zichtbaar maken | `seasonTix` (marketing) en `demand` (commercieel); ik heb niet nagekeken of er een eigen weergave is |
| Een fout van de financieel directeur laten tellen | `err` in `plan()`; nu alleen een voorspellingsmarge |

## 22. Hoe het speelt: achterbannen, verhaallijnen en wedstrijddag

Gelezen op 2026-11-17: `loop.js` (backers, stemmingen, weeklus), `dossiers.js` (mechanisme en de lijst; de teksten van de acht dossiers niet), `pathway.js` (kop en structuur), `matchday.js` en `matchtalk.js` (structuur). **Niet gemeten.**

### De vier achterbannen (`loop.js`)
Bestuur, supporters, pers en kleedkamer zijn elk een **waarde 0–100** (omgerekend uit `board.conf`, `st.fans`, `st.press` en de gemiddelde moraal) met een eigen **stem** in vijf toestanden (zoals "The chairman has stopped returning calls"). Na elk antwoord toont het spel hoe ze bewogen (`fd`), en de week opent met "Coming up" (`comingUp`) en sluit met een **verschil** (`wkDelta`).
- **Stemming bij ≤5**: eenmalig per seizoen een laatste kans per achterban (bestuur, supporters, pers, kleedkamer elk met drie opties, de kans op slagen staat in woorden: "Likely to work" tot "A long shot"). Mislukt dat of is er al een gebruikt, dan ontslag (`F.sack`).
- Laatste week van het seizoen: geen tijd voor een stemming; de zomer beslist, en er is **één** reprieve per seizoen.
- Daarnaast sturen **blokken** (`block_opening` tot `block_finale`) een doel per seizoensdeel.

**Wat ik opmerk.** Dit is het ontslagsysteem van het spel en dus de plek waar B37 ("20% ontslag") landt: het bestuursvertrouwen (`board.conf`, hoofdstuk 5) is de enige route naar `F.sack` behalve de vote. De andere drie achterbannen kunnen je alleen via een stemming wegsturen. Hoe vaak welke stemming echt valt, is niet gemeten.

### Verhaallijnen (`dossiers.js`, `pathway.js`)
- Een **dossier** is een verhaallijn in drie delen die weken uit elkaar op je bureau valt. Elk antwoord koelt de **hitte** (−2…4) af of warmt hem op; het einde is `good` (≤ −1), `mixed` (≤1) of `bad`. Een **druk**-getal (`pressure`, nooit als getal getoond) maakt starten waarschijnlijker en een slecht einde zwaarder (tot +50%). Maximaal 2 open dossiers, 60 weken tussen herhaling, en sommige beginnen vanuit een eerder bericht (`SEEDS`). Er zijn **8** dossiers: parkeeroorlog, sponsor onder vuur, de agent van het wonderkind, een avondje uit, de kit die nooit kwam, het veiligheidscertificaat, de column van de coach en supporters aan tafel.
- De **pathway-vraag** is één bestuurlijke verhaallijn om de kernlus te tonen: een signaal (academie: "de jongen is dichtbij", DoF: "ik heb een routinier"), een vergadering met drie standpunten uit echte persoonlijkheden en toestand, een route kiezen (jeugd, ervaring, fasering), de staf voert het uit, en na ~6 weken een evaluatie langs vier lenzen (was het beleid goed, was het uitgevoerd, veranderde de situatie, hoeveel was geluk). Alle effecten op je **geloofwaardigheid** (`G.cred`) staan in een logboek met reden.

**Wat ik opmerk.** Dit is waar het spel het meest op een verhaal lijkt, maar er zijn maar 8 + 1 lijnen. Over 15 seizoenen komt elke lijn dus meerdere keren terug (een dossier mag na 60 weken opnieuw, ruim anderhalf seizoen). Dit is het geschikte spoor voor nieuwe content (portaal, academie, turnaround).

### Wedstrijddag (`matchday.js`, `matchtalk.js`, engine/06)
- Voor de aftrap drie **verhalen** over eigen spelers (`mdStories`, bv. mijlpalen, blessure-terugkeer, vorm), na afloop hoe elk afliep en het **kantelpunt**; deze feiten voeden het voorbeeld, het wedstrijdscherm en de Gazette (`edition`).
- Tegenstanders hebben een **stijl** (volume en kwaliteit van kansen), een vormregel en een gevaarlijke speler; het commentaar komt uit banken per minuut, stand, grootte van de kans en publiek (`matchtalk.js`).

**Wat ik opmerk.** De wedstrijd zelf is de engine (hoofdstuk 11); deze twee modules geven er een **verhaal** aan. Dat is dun, juist daar zou de "wedstrijden bekijken"-wens van de eigenaar landen.

### Wat dit betekent voor verbeteringen
| Idee | Eerst bekijken |
|---|---|
| Ontslagkansen meten | `H.lastChance` en `F.sack` in `loop.js`; één telling van `vote:*`-redenen over meer seeds |
| Meer verhaallijnen | `defineDossier` in `dossiers.js`; een korter herhalingsvenster of meer lijnen (nu 8) |
| De wedstrijd levend maken | `mdStories`/`matchtalk` + engine/06 (kansen); de academie-U18 en het portaal als bron |
| Druk zichtbaar maken | `pv()` en `PSIG` in `dossiers.js` (nu alleen tekstsignalen) |

## Bijlage: alle bronbestanden

<!-- generated:files:start -->
62 bronbestanden, samen ongeveer 1013 KB.

| Bestand | KB | Doel |
|---|---|---|
| `engine/01-core.js` | 2 | rng & utils |
| `engine/02-world-constants.js` | 5 | world constants |
| `engine/03-players.js` | 4 | players |
| `engine/04-staff-dna.js` | 14 | staff; DNA |
| `engine/05-world-selection.js` | 4 | world; squad & selection |
| `engine/06-match.js` | 15 | match simulation |
| `engine/07-finance-transfers.js` | 12 | finance; transfers |
| `engine/08-weekly-inbox.js` | 9 | weekly systems; events & inbox |
| `engine/09-meetings-actions-press.js` | 17 | management meeting & projects (1.2); player actions; press |
| `engine/10-season.js` | 9 | season |
| `engine/11-staffwork-analysis-briefs.js` | 20 | staff work, records & chains (1.1); analysis & scorecards (1.3); weekly briefings (1.5) |
| `engine/12-week.js` | 8 | the week |
| `engine/13-newgame-preseason.js` | 7 | new game; pre-season planning (1.4) |
| `engine/14-save-api.js` | 2 | save |
| `events.js` | 70 | event library (module 1) Each event: from (role/board/fans/press), dept, cd (cooldown weeks), cond, w (weight) |
| `events2.js` | 31 | desk 2.0 configuration, proposals and storylines (1.2) |
| `events3.js` | 18 | event library (module 1, part 3) Two kinds of event that make a long career feel different from a short one: - |
| `briefs.js` | 20 | weekly briefings (1.5) Short, state-driven updates and conversations |
| `academy.js` | 14 | youth academy, module 2 part 1 Age groups, academy staff, development model, education and welfare, pathway |
| `academy2.js` | 28 | youth academy, module 2 part 2 Category & audit, poaching and tribunals, youth competitions, ROI, academy desk |
| `recruit.js` | 40 | recruitment, module 3 part 1 Player world, scouting department, reports with uncertainty, recruitment pipeline |
| `summer.js` | 18 | the transfer summer, shared parts What summer2.js builds on: expiring contracts and the squad planner, what th |
| `season.js` | 18 | season rhythm, module 4 part 2 Season blocks with a decision each, board reviews, high-stakes matches, a small |
| `summer2.js` | 34 | the transfer summer, version 2 A summer meeting with the DoF and staff that ends in a signed summer brief, a t |
| `faces.js` | 27 | visual layer, part 1 Procedural ink-style portraits for every person in the game, the CEO's office scene, repu |
| `firstteam.js` | 22 | First team department The coach's own instincts vs your mandate, support staff you can fund, talks as short sc |
| `depts.js` | 21 | departments Every department is a real unit: a head, staff underneath, a budget share, facilities, KPI history |
| `levers.js` | 7 | levers Grip: a club drifts without a CEO steering it |
| `commercial.js` | 10 | Commercial department The stadium as a system (three stands, demand, price, matchday experience), sponsor offe |
| `marketing.js` | 7 | Marketing department A supporter funnel (reach, fans, season-ticket holders), loyalty that cushions bad result |
| `business.js` | 7 | Business department A season budget per department (lean, normal, invest) against what the club can afford, a |
| `academy3.js` | 5 | Academy as a department you run A trial day where you pick the intake, the "is he ready?" call, and a pyramid |
| `recruitx.js` | 25 | Recruitment as a department you run The scouting network per region (focus and investment), the DoF's track re |
| `world.js` | 18 | the seeded world (B38, B39, B42) Every league of the world is computed on demand from a seed: nothing is store |
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
| `ui/03-summer-preseason-press.js` | 27 | the summer (M4); the summer, version 2 |
| `ui/04-masthead-news.js` | 1 |  |
| `ui/05-pitches-squad-money.js` | 15 | project pitches: one at a time, swipe or tap |
| `ui/06-sheets-ticker.js` | 21 | sheets; ticker |
| `ui/07-club-league.js` | 9 | review & sacked; club, league, staff, academy, review: game screens |
| `ui/08-departments.js` | 25 | departments |
| `ui/08a-dept-parts.js` | 21 | department parts: words for numbers, attention, plan, record; recruitment; academy: the record as four questio |
| `ui/08b-portal.js` | 30 | navigation; leagues: a table whose columns follow the position filter; the player; drill-downs |
| `ui/09-firstteam-review.js` | 12 | first team department |
| `ui/10-inbox.js` | 18 | render; inbox home (1.6) |
| `ui/11-players.js` | 9 | players: cards, profiles, stories |
| `ui/12-scenes-cards.js` | 15 | game UI helpers |
| `ui/13-redbox-render.js` | 14 | the red box: an email you answer on one screen |
| `ui/14-matchday-gazette.js` | 26 | match day: preview, match, gazette (full screens); the Gazette: one design, opened after the match and from th |
| `ui/15-actions.js` | 19 | actions |
| `ui/16-boot.js` | 0 | boot |
<!-- generated:files:end -->
