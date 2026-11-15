# Analyse sportieve organisatie (run 1 van 2)

> Branch `claude-game`, stand na commit `2f5cd5e` (V1, B11). Getoetst aan BIBLE.md (B1–B11).
> Alleen code gelezen, geen gedrag veranderd. Bewijs komt uit code (met bestand en regel) en uit headless metingen.
> Labels: **[code]** vastgesteld in de code · **[impact]** waarschijnlijke ontwerpimpact · **[playtest]** nog te toetsen.

---

## 1. Oordeel

De sportieve organisatie heeft sterke bouwstenen. Denk aan de coach die je mandaat half volgt, scoutingrapporten met onzekerheid, de zomervergadering met DoF-brief en debrief, en de pathway-evaluatie door vier lenzen.
Maar wat de CEO zichtbaar kan instellen, verandert de uitslagen nauwelijks. Geen van de vier coachschuifjes verschuift de punten per wedstrijd meetbaar, en twee DoF/scout-schuifjes doen in de simulatie niets.
Wat wel telt, is **wie** je aanneemt (kwaliteit van de coach en de DoF) en **hoe vaak** je iets aantikt (grip). Daarmee wint de CEO met activiteit, niet met oordeel. Dat schuurt met P1 en P9.
De persoonlijkheid van DoF en Chief Scout hangt aan juist die dode schuifjes. Hun "eigen wil" (P7) gaat dus over niets.
De vier hoofden vormen drie losse systemen, verbonden door relatie-plusjes en -minnetjes. Voor één vraag ("krijgen jongeren minuten?") zijn er zes routes.
De Chief Scout is voor de speler bijna onzichtbaar: nul inboxberichten en 2,4 briefings per seizoen.
Er zijn een paar echte fouten: afspraken met de coach die nooit aflopen, hints die iets anders beloven dan er gebeurt, en grip die delegeren bestraft.
Het advies is eerst repareren: dode schuifjes aansluiten, de afspraakbug oplossen en grip laten rijmen met delegeren. Daarna de bestaande schuifjes echte afwegingen geven. Nieuwe systemen zijn niet nodig.

## 2. Overzicht per afdeling

| Afdeling | Doel in de fantasie | Huidige werking | Sterkste punt | Grootste probleem |
|---|---|---|---|---|
| **Director of Football** (Recruitment) | De architect van de selectie: jij geeft regels en geld, hij koopt en verkoopt. | Een eigen pipeline (`recruit.js`): rapport → aanbeveling → goedkeuring boven drempel → onderhandeling in rondes. Zomervergadering met getekende brief, ticker en debrief (`summer2.js`). | De zomer-v2-cyclus: afspraak → uitvoering → afrekenen op KPI's. Voelt als besturen. | Zijn attributen Judgement en Network doen in de live pipeline (bijna) niets. Zijn LEAN hangt aan het dode schuifje `data`. Buiten de transferwindows heeft hij weinig te doen. |
| **Head Coach** (First team) | De man op het veld met een eigen wil. Jij geeft richting, geen opstelling. | `act(k)` mengt jouw mandaat met zijn voorkeur (volgzaamheid 0,35–1). Wrijving kost relatie. Gesprekken als korte scènes, afspraken met een deadline, ontslag met prijskaartje. | Het scherm "Your mandate vs what he does": jouw stip, zijn stip, een feit en een quote. Precies de CEO-fantasie. | De vier schuifjes veranderen de punten nauwelijks. Daardoor is de wrijving schijndiepte en is "geef hem zijn zin" gratis relatie. |
| **Chief Scout** (onder Recruitment) | De ogen van de club: waar we zoeken en hoe goed we kijken. | Regio's en budget sturen het aantal scouts en de groei van het netwerk. Rapporten hebben een onzekerheidsband. | Onzekerheid over spelers is echt en zichtbaar (sterrenband, vertrouwen, plan B). Goede nuttige onzekerheid. | Geen eigen bevoegdheid, KPI of inbox. Talk, boost en grip raken zijn rapporten niet, omdat `report()` de ruwe attributen leest. Twee van zijn drie schuifjes zijn dood. |
| **Academy Director** (Academy) | De lange termijn: talent kweken, identiteit, verkoop. | Een rijke sim: vier leeftijdsgroepen, jeugdstaf, categorie-audit in week 30, proefdag in week 28, jeugdcompetities, ROI. | Budget, kwaliteit van het hoofd en het pace-mandaat werken aantoonbaar door (potentie, aantal doorstromers). | De opbrengst bereikt het eerste elftal nauwelijks binnen een paar seizoenen. "Academy credibility" is een meter zonder gevolg. De CEO kiest zelf kinderen op de proefdag (spanning met P1). |

Medical bestaat alleen als push-doel. Het is geen afdeling (zie §3).

---

## 3. De werkelijke indeling

**[code]** Er zijn zeven rollen (`engine/04-staff-dna.js:2-10`), maar voor de speler bestaan er **drie sportieve afdelingen met vier mensen**:

| Waar | First team | Recruitment | Academy | Medical |
|---|---|---|---|---|
| Afdeling (`depts.js:9-16`) | ja, hoofd `coach` | ja, hoofd `dof`, `also: 'scout'` | ja, hoofd `acad` | nee |
| Budgetschuif (`depts.js` BUD) | eigen `deptB.first` | **= het budget-schuifje in het scout-mandaat** (`bud: 'scout'`) | = het budget in het academiemandaat | nee |
| KPI / scorecard | competitiepositie | gemiddelde selectierating (DoF), met een netwerkregel voor de scout | gemiddelde academiepotentie en categorie | nee |
| Bevoegdheid (`desk.js:15,18`) | eigen | eigen; de scout valt eronder (`headOf`) | eigen | nee |
| Inbox (gemeten, 36 seizoenen) | 5,7 berichten + 22,6 briefings per seizoen | DoF 2,9 + 8,9; **scout 0,0 + 2,4** | 3,9 + 18,3 | nee |
| Schermen | afdelingsscherm met coach-hero | afdelingsscherm. Scout onder People met Mandate en Talk, maar zonder Sack-knop (`ui/08-departments.js:135`) | afdelingsscherm met academierapport | alleen een kaart in het push-sheet (`ui/06-sheets-ticker.js:75`) |

Gevolgen:
- **[code]** De scout is een sub-hoofd. Zijn berichten lopen via de bevoegdheid en de foutkans van de DoF (`desk.js:39 errChance` gebruikt `lvl('dof')`). De recruitmentbegroting is technisch het scoutbudget.
- **[code]** Medical is een push zonder eigenaar: `PUSH.medical = ['Medical', 'coach', null]` (`engine/09-meetings-actions-press.js:91`). Blessures horen in de praktijk bij First team: intensiteit, fitnesscoach en budget (`depts.js:66-68`, `engine/06-match.js:20`).
- In de rest van dit rapport: **DoF (Recruitment)**, **Head Coach (First team)**, **Scouting (onder Recruitment)** en **Academie**.

**Zomer (B8)** **[code]**: `summer2.js` laadt na `summer.js`, wikkelt `H.summerStart` in (`summer2.js:19-20`) en vervangt `F.sumAuto` (`summer2.js:322`).
- **Uit `summer.js` nog actief:** de basisstart (`H.summerStart`: contractadvies, `sellSuggest`), het contractpakket (`advise`, `demand`, `decide` via `sumContract`), `sumPlanner`, `sumView`, `snap`/`diff` (`sumDiff`), `sumFriendlies` (zet `preEdge`), de hele deadline day (`ddStart`, `ddTick`, `ddCase`, `ddDecision`, `ddDecide`, `ddSkip`, `ddClose`, `drainQueue`) en `finishSummer` (`sumFinish`).
- **Dood in `summer.js`:** `ROUNDS`, `sumRound`, `sumPending`, `sumAnswer`, `sumStep`, de oude `sumAuto` (overschreven) en `H.sumMigrate` (wordt nergens aangeroepen). Samen ongeveer regels 86–98 en 185–198. Kandidaat voor fase 2.
- **[code] Correctie op de bijbel §9.2:** de tests draaien de zomer al via v2. `F.sumAuto` is `F.sum2Auto` zodra `summer2.js` geladen is, en `test/audit.js` en `tools/auditlib.js` laden het.

---

## 4. Analyse per afdeling

### 4.1 Director of Football (Recruitment)

**A. Doel.** De DoF is de architect van de selectie. De CEO beslist over geld (het budget van Finance plus de kitty), regels (maximale fee, leeftijd en salaris, wanneer goedkeuring nodig is, clausules), prioriteiten (zomerbrief) en afrekening (debrief, signing review). Het hoofd beslist over doelwitten, timing en onderhandeling. Het spelritme is twee pieken (zomer, winterwindow week 17–18) en daartussen verkoopbiedingen en reviews in week 19 en 33.

**B. Werking.**
- *Informatie:* pipeline-stadia, rapporten met een sterrenband, "blocked by rule", het DoF-trackrecord (hits en misses), een scorecard en de zomer-edition met cijfer.
- *Keuzes:* mandaat (5 schuifjes, 5 regels, 1 AP), goedkeuring (`rec_approve` boven `threshold()`, `recruit.js:88`), uitzonderingen (`rec_exception`, alleen bij een DoF met risk ≥ 11 of ego ≥ 13), cap verhogen (`rec_raise`), rivaliserend bod (`rec_rival`) en de zomervergadering (pakket, geld, plan, brief).
- *Wat werkt door* **[code]**:
  - `hard` (eerste bod) en `clauses` werken in `negRound`.
  - `depth` werkt in `dofPipeline`.
  - `youth` weegt potentie mee in `grade()` (`recruit.js:76`). Gemeten: youth 10→90 geeft 2,0→3,7 eigen jeugdspelers in de selectie, bij gelijke punten.
  - `sell` werkt in de verkoopbiedingen van `dofWork`.
  - Negotiation (`eff('dof',1)`) verlaagt de vraagprijs (`recruit.js:97`).
- *Wat niet doorwerkt* **[code]**:
  - Het schuifje **`data` (Scout's eye ↔ Data)** voedt alleen `genTarget`/`scoreTarget` (`engine/07-finance-transfers.js:56-66`). Die draaien alleen in het oude signeerpad van `dofWork`, dat stopt bij `if (HOOK.recWeekly) return;` (`:126`), en in de nood-aanvulling met free agents bij de zomerstart.
  - **Judgement** (`at[0]`) wordt live nergens gelezen, behalve via het gemiddelde in `lvl()` voor de foutkans. **Network** (`at[2]`) telt alleen in "Sell him the project" (`recruit.js:289`).
- *Automatisch en escalatie:* routine via de desk. De DoF escaleert boven het bedragslimiet, bij een top-3-speler of bij reputatierisico. Signing boven de goedkeuringsdrempel komt altijd bij jou.
- *Gemeten* (gematchte seeds, 24 runs × 3 seizoenen, actieve stijl): DoF-attributen 6→16 geven 1,75→1,86 punten per wedstrijd, selectie-CA 5,88→6,27, desk-fouten 86→36 en ontslagen 3→1. De keuze van de DoF doet er dus echt toe.

**Concrete keten (werkt goed):** CEO tekent in de zomerbrief "Go bigger: one player" → `applyBrief` zet `maxFee` op 100% en de KPI "Land a clear upgrade (grade A)" → de DoF gaat voor plan A, dat in de ticker verloren gaat ("Plan A for CB is off. Plan B: …") → de zomer-edition geeft cijfer C ("A summer of half measures") → in de debrief kiest de CEO tussen praise, probe, warn, tighten (elke deal via jou) en loosen. **Breuk in de keten:** `warn` verhoogt `G.dofStrikes`, maar dat wordt nergens gelezen (`summer2.js:294`) **[code]**. De "officiële waarschuwing" heeft dus geen later gevolg (P2).

**C. Problemen.**
- *Technisch:*
  - **[code]** Een dood schuifje met een levende persoonlijkheid: de LEAN van de DoF is `data` (`04-staff-dna.js:29`). `staffWeekly` trekt relatie af als jouw schuifje meer dan 40 van zijn neiging afligt (`engine/08-weekly-inbox.js:23`). Je betaalt dus relatie voor een instelling die niets doet.
  - **[code]** De signing review biedt "Question the misses: data focus up" (`season.js:154`). Dat zet `dof.data` op +10 en doet dus niets.
  - **[code]** De hint bij `coach_dof_clash` "Back the coach: recruitment more conservative" (`events.js:56`) belooft een effect dat niet bestaat. Alleen de relaties veranderen.
- *Ontwerp:*
  - **[impact]** Tussen de windows (week 5–16 en 20–34) heeft de DoF weinig te kiezen; hij leeft in de zomer.
  - **[impact]** Twee routes naar dezelfde instelling met verschillende kosten: `approve` via het mandaatsheet kost 1 AP, via de debrief of `rec-appr` niets.
- *Onduidelijkheid:* **[playtest]** Er zijn vijf regels plus de wage cap van Finance. Bij "blocked by rule" moet de speler snappen welke regel van wie is. `ruleIssues` mengt DoF- en Finance-regels in één zin.
- *Schijndiepte:* `data`, Judgement en Network. Drie van de acht zichtbare DoF-knoppen en -attributen hebben geen of verwaarloosbaar effect.

**D. Verbeteringen.**
1. **`data` en Judgement aansluiten op de live pipeline** *(klein)*.
   - *Probleem:* de knop en het attribuut zijn betekenisloos, en de LEAN-wrijving gaat over niets.
   - *Verandering:* in `report()`/`grade()` vertaalt `data` naar een afweging. Data geeft een smallere CA-band maar mist potentie en karakter (meer `p.settle = false` en persoonlijkheidsmissers). Het oog geeft een bredere CA-band maar een betere schatting van potentie en karakter. Judgement verkleint de afwijking van `grade()` tegenover de werkelijkheid.
   - *Wat de speler ziet:* het trackrecord verandert van patroon. Data geeft minder flops op rating maar meer "never settled".
   - *Afweging:* zekerheid nu tegenover potentie en karakter. Er is geen dominante stand.
   - *Fantasie:* je kiest een recruitmentfilosofie, geen speler.
   - *Nadeel:* balanstest nodig. Hangt samen met scout-verbetering 4.3.1 (één `data`-knop).
2. **Strikes en debrief laten doorwerken** *(klein)*.
   - *Probleem:* afrekenen heeft geen geheugen.
   - *Verandering:* lees `dofStrikes` uit. Na twee strikes krijgt de DoF een ultimatum-brief ("Back me or sack me"), bij een DoF met lage loyaliteit dreigt `staff_poach`. Toon strikes in de head-card.
   - *Afweging:* wie een strike geeft, kan sneller ontslaan, maar riskeert dat een goede DoF vertrekt.
   - *Fantasie:* P2 en P7.
   - *Nadeel:* nog een veld in de UI. Valt binnen "relatie", dus geen nieuwe meter.
3. **Eén winterbeslissing met inhoud** *(middel)*.
   - *Probleem:* de DoF is stil in het hart van het seizoen.
   - *Verandering:* breid de bestaande `block_winter` uit met een DoF-voorstel uit de pipeline: "Sell X now (top-3, contract ends) or keep him for the run-in".
   - *Afweging:* geld en prijs nu tegenover punten in de run-in.
   - *Nadeel:* overlapt met `bid_star`. Hergebruik dat event in plaats van een nieuw event.

### 4.2 Head Coach (First team)

**A. Doel.** De coach heeft een eigen wil en eigen voetbal. De CEO beslist over richting (mandaat), ondersteuning (staf, budget), afspraken (targets), vertrouwen (backing, push) en zijn baan. De coach kiest het elftal, de stijl binnen de clubregel en de dosering. Het ritme is wekelijks (wedstrijd en vorm), met blokken in week 1 (opening) en 30 (finale), stake matches, clashes en style drift.

**B. Werking.**
- *Informatie:* vorm met xG-balken, positie tegenover verwachting, per schuifje "jij ↔ hij" met een feit ("6,9 under-21s start per match") en een quote, de selectie door zijn ogen, het target en de blessurekans.
- *Keuzes:* mandaat (4 schuifjes plus de stijlregel), een gesprek (1 AP, 5 onderwerpen), ondersteunende staf en budget, ontslag.
- *Doorwerking* **[code]**: `act(k) = mandaat × c + voorkeur × (1−c)` met `c = 0,72 + (rel−50)/200 − (ego−10)·0,025 …` (`firstteam.js:32-42`). Bij een gat van 15 of meer kost dat 0,3 relatie per week. "Do it my way" geeft acht weken extra volgzaamheid.
- *Gemeten* (24 × 3 seizoenen, baseline 1,77 punten per wedstrijd; verschillen onder ±0,06 zijn ruis):

| Instelling (coach volgt volledig) | Punten per wedstrijd | Wat wel verandert |
|---|---|---|
| attack 10 / 90 | 1,74 / 1,76 | xG voor–tegen 1,44–0,87 → 2,12–1,28; goals 1,33–0,89 → 1,93–1,27 |
| youthMins 10 / 90 | 1,71 / 1,71 | U21-basisspelers per wedstrijd 5,9 → 7,4 |
| intensity 10 / 90 | 1,70 / 1,72 | blessures per seizoen 2,8 → 5,0 |
| rotation 10 / 90 | 1,73 / 1,73 | alleen ruis in de selectie |
| coach-attributen 6 / 16 | **1,75 / 1,93** | promotie 51% → 70%, ontslagen 4 → 1 (van 24) |

**Verklaring van het audit-signaal (1,70–1,77 bij basislijn 1,72)** **[code]**:
- *Attack* schaalt het **aantal** kansen voor beide ploegen (`vol = 0,8 + 0,45·att`, `engine/06-match.js:6`). Wie de kans krijgt, hangt af van het sterkteverschil `d`, niet van `att`. Alleen in de slotfase speelt `att` een kleine rol. Meer spektakel, nauwelijks andere punten.
- *Youth* geeft U21-spelers −0,4 tot +1,2 CA-bonus bij de selectie (`engine/05-world-selection.js:42`). Op lage niveaus ligt de CA van jong en oud dicht bij elkaar, dus het kost geen punten.
- *Rotation* voegt alleen ruis toe aan de selectie. Er is geen vermoeidheidsmodel, dus er is ook geen winst.
- De audit verdunt het schuifje bovendien via `act()`: een mandaat van 90 wordt in de praktijk ongeveer 75.

**Concrete keten:** CEO zet youthMins op 80 → een coach met ego 16 en voorkeur 35 speelt er ongeveer 60 en de rij toont "−20 vs your mandate" met "I get judged on Saturdays, not on potential." → de relatie zakt elke week → de CEO kiest in een gesprek tussen "Do it the way we agreed" (relatie −7, acht weken volgzaam), "Meet me halfway" en "Your way" (relatie +6) → het resultaat is **gelijk** in punten, het verschil zit alleen in minuten voor jongeren. Daardoor is "Your way" bijna altijd de beste keuze.

**C. Problemen.**
- *Technisch* **[code]**:
  - **Afspraken die nooit aflopen.** De targets "Top two by the end of the season" (`by: 38`), "Start more youngsters" vanaf week 25 (`week+10` wordt meer dan 34) en "Top half by the winter break" vanaf week 31 (`week+4` wordt meer dan 34) liggen voorbij `SEASON_WEEKS = 34` (`engine/01-core.js:8`, `firstteam.js:234,249`). Geverifieerd: `G.ft.deal` blijft na het seizoenseinde staan. Het onderwerp "Let us agree a target" verdwijnt daarna voor altijd (`topics()` vereist `!S.deal`) en de UI toont "Deadline: week 38".
  - **Het ontslagsheet liegt licht.** Het toont board en press uit `sackQuote()` (board +3 als je meer dan 2 plaatsen onder de verwachting staat, press 0 of −4). `fire()` past andere regels toe: board +3 al bij één plek onder de verwachting, press altijd −2 extra, en alle hoofden −2 relatie, wat niet getoond wordt (`firstteam.js:263-266` tegenover `engine/09:107-109`).
  - **De "Talk about a player"-push negeert zijn wil.** "Give him minutes" zet altijd `pushP` (+1,1 bij de selectie, zes weken). Het ego van de coach bepaalt alleen de relatie, niet of hij het doet ("I will look at it. No promises." en toch doet hij het) (`firstteam.js:241`). Dat botst met P7.
  - Het oude `resBuy`-pad (`ft-buy`) is onbereikbaar omdat `vFirst` alleen in delen wordt gebruikt. Dode UI-code voor fase 2.
- *Ontwerp:*
  - **[impact]** Geen schuifje is een afweging (P9). "Your way" is gratis relatie, en de wrijving gaat over een cosmetische knop.
  - **[impact]** Intensiteit voelt dominant laag (minder blessures, vrijwel gelijke punten en ontwikkeling) **[playtest]**.
- *Onduidelijkheid:* **[playtest]** "Follows mandate 72%" is een getal zonder handelingsperspectief. Als volgzaamheid uitslagen niet raakt, merkt de speler dat na een paar weken.
- *Schijndiepte:* de vier schuifjes. Het feit per rij is eerlijk (xG, U21-starts, blessures), maar het verband met punten ontbreekt, en dat is ook terecht, want er is er geen.

**D. Verbeteringen.**
1. **Elk coachschuifje een echte afweging geven** *(middel; de belangrijkste verbetering in dit rapport)*.
   - *Probleem:* de mandaten zijn betekenisloos en de wrijving is schijn.
   - *Verandering:* binnen de bestaande matchsim, zonder nieuwe meters.
     - *Attack:* verschuift het kansenaandeel naar ons (+) maar verhoogt de xG per kans van de tegenstander (−). Sterke ploegen winnen erbij, zwakke verliezen.
     - *YouthMins:* een reëel puntenverlies nu (geen CA-bonus, maar een vaste voorkeur), gecompenseerd door ontwikkeling via `minsF`: zet het gewicht van 0,4 op ongeveer 0,9, gemeten via `develop()`.
     - *Rotation:* een licht vermoeidheidsmodel via het bestaande `sta`-attribuut en het blessurerisico (veel rotatie: minder blessures en een scherpere slotfase, maar minder ritme).
     - *Intensity:* sterker ontwikkelingseffect en een kleine sterktebonus in de eerste 60 minuten (bestaat al: `intn` in `simOurMatch`).
   - *Wat de speler ziet:* dezelfde rijen, maar het feit wordt een prijs ("+0,3 xG per match, −0,2 against").
   - *Afweging:* elke stand helpt het ene en kost het andere, afhankelijk van de selectie.
   - *Fantasie:* je mandaat doet ertoe, dus de wil van de coach ook.
   - *Nadeel:* raakt de balans van alle niveaus. Daarna is een audit met CEO-stijlen nodig (fase 5).
2. **De afspraakbug repareren en afspraken laten doorwerken** *(klein)*: clamp `by` op 34, of laat "top two" evalueren bij de seizoensevaluatie. Ruim `deal` op bij `S.season !== G.season`. Toon bij een gemiste afspraak een optie in de board review.
3. **De wil van de coach ook bij spelersverzoeken** *(klein)*: `pp_push` kan worden geweigerd met dezelfde volgzaamheid als bij het mandaat. Een weigering wordt een zichtbare regel ("He did not play him. 'I pick the team.'") en voedt `coach_authority`. Zo wordt P7 echt en blijft B1 ongeschonden.

### 4.3 Scouting (Chief Scout, onder Recruitment)

**A. Doel.** De ogen van de club. De CEO beslist waar gezocht wordt (regio's), hoeveel het mag kosten (budget, trips) en welk soort speler (proven of potential). De scout beslist wie hij bekijkt en wat hij rapporteert. Er is nu geen eigen spelritme; hij is een radertje onder de DoF.

**B. Werking** **[code]**.
- Het budget bepaalt het aantal scouts (`2 + floor(budget/35)`, `recruit.js:52`), de kwaliteit van ingehuurde scouts en de groei van het netwerk (`engine/08-weekly-inbox.js:48`).
- Regio's sturen opdrachten en netwerkgroei. Trips kosten geld en geven +12 netwerk (`recruitx.js`).
- Rapporten: `sd` hangt af van de **ruwe** `sc.at[0]`, het netwerk, een data-perk en het data-schuifje (maximaal −0,2) (`recruit.js:60`).
- Gemeten: scout-attributen 6→16 geven 1,69→1,75 punten per wedstrijd en selectie-CA 5,75→5,87 (een klein effect). Budget 10→90 geeft geen verschil in selectiekwaliteit (5,84 tegenover 5,81).
- Terugkoppeling: hits en misses worden aan de **DoF** toegeschreven ("The DoF's record"). De signing review biedt "Praise the scouts" (relatie van de scout +4).

**Keten:** CEO zet main focus op South America (gratis via het afdelingsscherm, 1 AP via het mandaat) → scouts sweepen daar en het netwerk groeit → rapporten worden scherper en de grades stijgen → de DoF beveelt aan en koopt → week 30: "Signings this season: 3 hits, 1 miss" gaat naar de relatie van de **DoF**. De scout krijgt geen krediet, tenzij je hem expliciet prijst.

**C. Problemen.**
- *Technisch* **[code]**:
  - Het schuifje **`potential` (Proven ↔ Potential)** wordt alleen in `genTarget` gelezen, en dat pad is dood (`engine/07:58`). Zijn LEAN is `potential` (`04-staff-dna.js:29`), dus hier speelt hetzelfde LEAN-probleem als bij de DoF.
  - `data` bestaat twee keer, bij de DoF en bij de scout, en werkt bij geen van beiden wezenlijk.
  - `report()` en de vindkans gebruiken `sc.at[...]` in plaats van `eff('scout', …)`. Boost uit gesprekken, grip, relatie en de afdelingsrol "Scout" (die wel scout-attributen optilt in `depts.js:20`) raken de rapportkwaliteit daardoor **niet**.
- *Ontwerp:*
  - **[impact]** De scout heeft geen beslissing die alleen van hem is. Regio's kun je zonder hem instellen, en het budget heet "Recruitment".
  - **[impact]** Er zijn drie routes naar regio's (mandaat, regiochips, zomer) met verschillende AP-kosten.
- *Onduidelijkheid:* **[playtest]** Het netwerkgetal (0–100) en de sterrenband: snapt de speler dat een smallere band dankzij het netwerk komt? Dat is nuttige onzekerheid, als het verband zichtbaar is.
- *Schijndiepte:* een eigen mandaatscherm met drie schuifjes en twee regels, waarvan alleen budget en regio's werken. Gesprekken met de scout doen vrijwel niets.

**D. Verbeteringen.**
1. **Het mandaat van de scout terugbrengen tot wat werkt en het laten werken** *(klein)*.
   - *Probleem:* betekenisloze knoppen en een LEAN op een dode knop.
   - *Verandering:* `potential` stuurt de leeftijds- en potentiefilter in `scoutWeek` (live pipeline). `data` komt één keer voor, bij de scout. De DoF krijgt het als "vertrouwt op de scout ↔ op data" via verbetering 4.1.1. `report()` gebruikt `eff()`.
   - *Wat de speler ziet:* de aanbevelingen verschuiven zichtbaar naar jonge of kant-en-klare spelers. Een gesprek met de scout helpt een paar weken.
   - *Afweging:* potentie (goedkoop, later, onzeker) tegenover proven (duur, nu).
   - *Fantasie:* je stuurt de ogen van de club.
   - *Nadeel:* raakt de grade-balans.
2. **Krediet en schuld eerlijk verdelen** *(klein)*.
   - *Probleem:* de scout bestaat in de terugkoppeling niet.
   - *Verandering:* `recEval` kent een miss toe aan de scout die rapporteerde (`k.byId` bestaat al, `recruit.js:65`) als de schatting meer dan een ster afweek. Anders gaat de miss naar de DoF (verkeerde keuze). Toon dat in "The DoF's record" als "scout misread" of "DoF's call".
   - *Afweging:* wie straf je, wie houd je?
   - *Fantasie:* je beoordeelt mensen, niet uitkomsten (zoals de pathway-lens "Judge the people, not the policy").
3. **Eén scout-dilemma per seizoen** *(klein)*: zet de bestaande brief `scout_dry` in als keuze: "Our network in X is thin. Send the team (cash, 8 weeks of other regions slow) or trust the DoF's contacts." Dit hergebruikt `rxInvest` en geeft de scout een stem.

### 4.4 Academie

**A. Doel.** De lange termijn en de identiteit. De CEO beslist over budget, filosofie (pace, technisch, lokaal, welzijn, winnen of ontwikkelen), regels (beschermde jeugdspelers, opspelen, verhuur, mentoren) en strategische momenten (verkopen, wonderkind, audit-plan). De Academy Director en zijn staf doen de uitvoering. Het ritme: intake en proefdag in week 28, audit in week 30, jeugdcompetitie, `ac_ready`, poach- en tribunaal-events, en het blok "Back the academy" in de herfst.

**B. Werking** **[code]**.
- Het budget stuurt het niveau per leeftijdsgroep, de kwaliteit van de foundation, de reputatie, de kwaliteit van ingehuurde jeugdstaf en de categorie (`academy.js:69-72`, `academy2.js:17`).
- De director tilt de jeugdstaf op via `ybonus` (`academy.js:19`).
- `pace` verlaagt de promotiedrempel en verruimt de beurzen (`academy.js:107,124`).
- Gemeten:
  - Academy Director 6→16: gemiddelde academiepotentie 8,39→9,38.
  - Budget 10→90: potentie 8,27→9,24.
  - Pace 10→90: eigen jeugdspelers in de selectie 2,4→4,4.
  - Punten in het eerste elftal blijven in alle gevallen gelijk binnen 3 seizoenen.
- *Escalaties:* audit, poach, tribunaal en sell-on zijn altijd voor de CEO (`forced`). `grad_minutes` is een clash.
- *Terugkoppeling:* categorie, ROI, "Holding it back" (diagnose met een knop naar het mandaat) en "Academy credibility".

**Keten:** CEO kiest het jaarplan "Reach Category 2" → zet het academiebudget op 75 (gratis via de afdelingsbegroting) → niveaus en welzijn stijgen → week 30: audit "Score 77, next category at 75" → de categorie stijgt: meer subsidie, betere intake, minder kans op poaching → de volgende keuze is het `wonderkid`-event of verkopen in `clash_prospect`. Dit is de best sluitende keten van de vier.

**C. Problemen.**
- *Technisch* **[code]**:
  - **"Academy credibility"** (`G.cred`, `pathway.js:28`) wordt opgebouwd en getoond (`ui/10-inbox.js:74`), maar **niets leest het**. Het is een meter zonder gevolg (input voor B6).
  - De keuze "Loan him out" in `ac_ready` zet `p.loanOut`, maar `acadSeason` zet `loanOut` voor iedereen terug en verdeelt opnieuw volgens het mandaat (`academy.js:130`). Je beslissing houdt dus maar tot het seizoenseinde.
  - `minGrads` (beschermde jeugdspelers) werkt alleen tegen verkoop en administration (`engine/07:88`), niet bij de selectie. Het label "protected in squad" suggereert meer.
- *Ontwerp:*
  - **[impact]** P1: op de proefdag (`academy3.js`) kiest de CEO zelf welke kinderen erin komen, en via "Promote him now" wie naar het eerste elftal gaat. Dat is geen elftal kiezen (B1), maar het is wel selectie van individuele spelers. Zie ontwerpvraag 1.
  - **[impact]** De opbrengst landt pas na veel seizoenen in het eerste elftal. Voor de speler voelt de academie als een eigen spel naast de club (zes schuifjes en vier regels, het meeste van alle afdelingen) **[playtest]**.
- *Onduidelijkheid:* **[playtest]** De categoriescore heeft zes delen, en `philosophy` en `welfare` werken via formules die de speler niet ziet. De diagnose "Holding it back" helpt wel. Dat is behoudenswaardig.
- *Schijndiepte:* `credibility`, en `mentors`/`playUp`, die met kleine factoren werken (+0,08 en +0,15 op de groei) **[code]** maar zeer zichtbaar zijn.

**D. Verbeteringen.**
1. **Credibility laten doorwerken waar het hoort** *(klein)*.
   - *Probleem:* een meter zonder gevolg.
   - *Verandering:* gebruik `cred.youth` als factor in de bestaande ouderkeuze bij de intake (`found.q` en `found.n`) en in de kans dat poach-pogingen slagen. "Ouders sturen hun kind naar een club die doet wat ze belooft."
   - *Wat de speler ziet:* "Two families chose us over a bigger club: they believe in our pathway" bij de intake.
   - *Afweging:* een pathway breken kost later talent.
   - *Fantasie:* P2 en P8.
   - *Nadeel:* B6. De meter blijft, hij krijgt alleen een functie. Te beslissen na de playtest.
2. **Van de proefdag een beleidskeuze maken in plaats van een kinderkeuze** *(klein)*: laat de CEO het criterium kiezen ("Highest ceiling", "Local lads", "Ready soonest") in plaats van individuele kinderen. De bestaande `staffPick` sorteert dan op dat criterium. Zie ontwerpvraag 1.
3. **De CEO-beslissing respecteren** *(klein)*: `ac_ready` "Loan him out" en "One more season" krijgen een vlag die `acadSeason` respecteert.

---

## 5. Samenhang binnen de sportieve organisatie

**Eén organisatie of losse systemen?** Losse systemen met dunne draden.
- **[code]** De verbindingen zijn: de coach-wens in het zomerplan (`coachWish`), `grad_minutes`, `clash_prospect`, `coach_dof_clash`, de pathway-verhaallijn en de gedeelde push (`PUSH.academy` heeft de DoF als rivaal).
- Bijna alle clash-effecten zijn **relatie ±** (`desk.js` clash-events, `events.js:52-58`). Er verandert geen bevoegdheid, geen budget en geen beleid, met twee uitzonderingen: `clash_budget` zet `fin.transfer`/`maxFee` en `grad_minutes` zet `youthMins` +20.
- **[impact]** Daardoor voelen de clashes als "wie maak ik boos". Ze kunnen een echt bestuurlijk dilemma worden als de winnaar ook iets krijgt dat later doorwerkt, bijvoorbeeld een veto op aankopen voor de coach (de hint belooft dat al).

**Overlap en onduidelijke grenzen.**
- *DoF ↔ scout:*
  - Hetzelfde `data`-schuifje twee keer (dood).
  - Het recruitmentbudget is het scoutbudget.
  - Regio's via mandaat, chips en zomer.
  - Krediet voor het trackrecord gaat naar de DoF.
  - De scout escaleert via de bevoegdheid van de DoF, maar heeft wel een eigen mandaat (1 AP).
  - **[impact]** De speler kan niet uitleggen wie waarvoor verantwoordelijk is.
- *Coach ↔ academie:* zes routes voor "jongeren krijgen minuten":
  1. `coach.youthMins`
  2. `acad.philosophy` (bepaalt wat credibility "belooft")
  3. `acad.minGrads`
  4. de pathway-afspraak (`selBonus`)
  5. `grad_minutes` (+20 youthMins)
  6. het coach-gesprek ("Start more youngsters" als target, "Give him minutes" per speler)

  **[code]** Ze stapelen in `pickXI` via `selBonus` en `youthMins`. **[impact]** Dat is ondoorzichtig, en omdat jeugdminuten geen punten kosten (§4.2) is er ook geen echt dilemma. Het pathway-verhaal gaat precies over dat dilemma ("the coach fears dropped points"), maar de simulatie levert de pijn niet.

**De pathway-verhaallijn.** Ontwerp-technisch het sterkste stuk: signaal → vergadering met drie standpunten uit de echte staat → afspraak met eigenaar en indicatoren → autonome uitvoering met een weeklog → evaluatie door vier lenzen (beleid, uitvoering, omstandigheden, geluk) → houden, openlijk bijsturen of laten vallen. Dat is P1, P2, P7 en P9 in één.
- Zwak 1: "Points per game stay within half a point" is bijna altijd gehaald (jeugd kost geen punten), dus de lens "was the policy right" heeft weinig spanning **[impact]**.
- Zwak 2: de uitkomst (`cred`) heeft geen gevolg **[code]**.
- Behouden en als sjabloon gebruiken voor andere dilemma's.

**Krijgt elk van de vier aandacht gedurende het seizoen?**

| Blok | Coach | DoF | Scout | Academie |
|---|---|---|---|---|
| Zomer | wensen in de vergadering | **hoofdrol** | noemt kandidaten in de vergadering | contractpakket (indirect) |
| Opening (1–6) | `block_opening` | weinig | — | — |
| Herfst (7–15) | stake matches, talks | weinig | — | "Back the academy" (keuze) |
| Winter (16–19) | — | `block_winter`, window, review week 19 | — | — |
| Run-in (20–29) | stake matches | contracten (`block_runin`) | — | intake en proefdag week 28 |
| Finale (30–34) | `block_finale` | review week 33 | — | audit week 30 |

**[impact]** De coach is altijd aanwezig, de DoF piekt, de academie heeft een vaste late piek. **De scout heeft geen moment** (gemeten: 0 inboxberichten, 2,4 briefings per seizoen).

**Komt de moeilijkheid uit afwegingen of uit handelingen?**
- **[code]** Grip (`levers.js`): elke eigen CEO-actie geeft grip (respond +6, talk +5, enzovoort, maximaal +16 per week). Grip zakt 5 per week. Bij grip 100 krijgt **elk hoofd +3,6** op zijn attributen, bij grip 0 −3,6 (`levers.js:20-25`).
- Gemeten: actief zonder inbox (grip 19 tegenover 94) geeft 1,57 tegenover 1,77 punten per wedstrijd en 32% tegenover 53% promotie. **Dat is het grootste sportieve effect dat ik vond, groter dan elk mandaat** en vergelijkbaar met een coach van 6 tegenover 16.
- Grip beloont het aantal handelingen, niet de kwaliteit ervan.
- **[code] Tegenstrijdig:** de desk belooft dat delegeren (free hand) minder vragen geeft, terwijl grip minder vragen bestraft. Free hand geeft +0,4 als de relatie ≥ 50 is (`desk.js`). Een zelf beantwoord bericht levert +6 grip op, een correct gedelegeerde zaak maar +1 (`desk.js:83`).
- Bevoegdheid zelf: short leash tegenover free hand geeft 3.450 tegenover 5.080 gedelegeerde zaken en 41 tegenover 124 fouten, maar vrijwel gelijke punten (1,71 tegenover 1,69). Bevoegdheid is vooral een inbox-volumeknop.

**Verklaring van "actieve CEO even vaak ontslagen als passieve, willekeurige nooit"** **[code]**:
- *Andere modules:* `test/audit.js` laadt `loop.js`, `dossiers.js`, `pathway.js` en `matchday.js` niet. Dus zonder backers, votes en dossiers. Met alle modules (`tools/auditlib.js`, 20 runs × 5 seizoenen) ontsloeg het bestuur 13 van 20 passieve, 9 van 20 actieve, 3 van 20 willekeurige en 12 van 20 risky CEO's.
- *Wat "actief" betekent:* de stijl "active" kiest in elk inboxbericht `v.auto` (`auditlib.js:36`). Dat is **precies de optie die de staf zelf zou kiezen**. Bij briefings kiest hij altijd optie 0. Een actieve CEO neemt dus dezelfde beslissingen als de staf en verschilt vooral in grip.
- *Waarom actief ontslagen wordt:* 6 van de 9 ontslagen waren de tweede administration. Optie 0 van briefings is vaak de dure keuze (extra wintergeld, winbonus, medische staf).
- *Waarom willekeurig zelden ontslagen wordt:* de willekeurige CEO spreidt zijn keuzes en houdt toch hoge grip.
- **[impact]** De audit meet dus klikvolume en kostenpatroon, niet CEO-oordeel. Het signaal "CEO-keuzes doen er niet toe" is daarmee niet bewezen. Wel bewezen: mandaten doen er nauwelijks toe, aannemen en grip wel.

**Wat goed werkt en behouden moet blijven.**
- Het scherm "Your mandate vs what he does" (`ui/09-firstteam-review.js`), inclusief het feit per rij.
- De onzekerheidsbanden en plan B in de rapporten (`recruit.js` `report`, `bandTxt`). Dit is nuttige onzekerheid.
- De zomer-v2-cyclus: vergadering met tegenspraak (`stance`: de DoF kan "hold" zeggen), brief met KPI's, ticker, edition, debrief.
- De vier lenzen van de pathway en de regel "Judge the people, not the policy".
- De diagnose "Holding it back" met een directe knop naar het mandaat.
- Het verschil dat de keuze van het hoofd maakt (coach en DoF). Dat is de CEO-fantasie op zijn best: kies de juiste mensen.

---

## 6. Geprioriteerde verbeterlijst

**Eerst repareren (fouten en tegenstrijdigheden)**
1. **Dode schuifjes aansluiten**: `dof.data`, `scout.potential` en `scout.data` in de live pipeline; `report()` via `eff()`. Ook de signing-review-optie "data focus up" krijgt zo betekenis. *Klein.* (4.1.1, 4.3.1)
2. **Coach-afspraken met deadline na week 34** (`firstteam.js:234,249`): clampen en opruimen bij een nieuw seizoen. *Klein.* (4.2.2)
3. **Grip en delegeren laten rijmen**: correct gedelegeerde zaken en een bewust gekozen free hand houden grip op peil, zodat activiteit geen voorwaarde is voor kwaliteit. Dit verandert de bron van een meter, niet het bestaan ervan (B6). *Klein tot middel.* Hangt samen met ontwerpvraag 3.
4. **Hints in lijn brengen met effecten**: het ontslagsheet (`firstteam.js:263` tegenover `engine/09:107`), "recruitment more conservative" (`events.js:56`), push sporting "Squad morale up" (`ui/06-sheets-ticker.js:75`, maar er is geen morale-effect in `engine/05:60`), en "protected in squad" (`minGrads`). *Klein.*
5. **Beslissingen die worden teruggedraaid**: `ac_ready`-loan (`academy.js:130`) en `dofStrikes` die niemand leest (`summer2.js:294`). *Klein.*

**Dan verduidelijken**
6. **Eén eigenaar per knop**: dezelfde AP-kosten voor dezelfde instelling (mandaat tegenover afdelingsbegroting, regiochips en debrief), en de scout expliciet als tweede stem binnen Recruitment, zonder dubbele `data`-knop. *Klein.* (ontwerpvraag 2)
7. **Krediet en schuld verdelen** tussen scout en DoF in het trackrecord (4.3.2). *Klein.*
8. **De zes jeugdroutes zichtbaar maken**: één regel op het coachscherm, "Youth minutes come from: your mandate · pathway agreement · 1 promise", in plaats van een nieuw scherm. *Klein.*

**Dan verdiepen**
9. **Coachschuifjes als echte afwegingen** (4.2.1). *Middel.* Het grootste effect op de CEO-fantasie, en voorwaarde voor een zinvolle pathway en clashes.
10. **De wil van de coach bij spelersverzoeken** (4.2.3). *Klein.*
11. **Clash-uitkomsten met structureel gevolg**: de winnaar krijgt een tijdelijke bevoegdheid (een veto of shortlist-recht voor de coach, een vrije kitty voor de DoF), zodat het een bestuursbesluit wordt. *Middel.*
12. **Credibility laten doorwerken** in intake en poaching (4.4.1). *Klein.* Na de playtest (B6).
13. **Een scout-moment per seizoen** en **een DoF-keuze in de winter** (4.3.3, 4.1.3). *Klein tot middel.*

## 7. Playtestplan (ongeveer een uur, lokaal)

Speel één club in een lage divisie (DNA: academy, self-sustaining, steady). Noteer per punt je eerste indruk vóórdat je de uitleg leest.

1. **Hiring (5 min).** Kies bewust de sterkste coach en DoF, ook als dat duur is. *Let op:* zie je bij het aannemen wat attributen betekenen? Voel je dat dit je belangrijkste keuze is?
2. **Coachmandaat (10 min).** Zet attack op 85 en youthMins op 80 tegen de voorkeur van de coach in. Speel vier weken. *Let op:* zie je het verschil in xG en U21-starts? Merk je iets in de uitslagen? Kies daarna in een gesprek "Fair enough, your way" en speel vier weken: mis je iets?
3. **Afspraak (5 min).** Spreek rond week 26 "Start more youngsters" af. *Let op:* wordt hij ooit beoordeeld? Kun je in het volgende seizoen een nieuw target afspreken? (Verwachting: nee, door de bug.)
4. **Grip tegenover delegeren (10 min).** Zet alle hoofden op free hand en beantwoord drie weken niets zelf. Doe daarna drie weken alles zelf. *Let op:* zie je grip zakken? Begrijp je waarom de prestaties veranderen? Voelt delegeren als een strategie of als een fout?
5. **DoF en scout (10 min).** Open Recruitment. Zet het data-schuifje van de DoF op het uiterste tegen zijn neiging in. Verander de regio's via de chips en via het mandaat. *Let op:* weet je wie waarvoor verantwoordelijk is? Merk je dat het ene AP kost en het andere niet? Zie je de scout ooit in je inbox?
6. **Zomer (10 min).** Speel de zomervergadering volledig: één keer "insist", één keer "accept". Geef in de debrief een warning. *Let op:* voelt de DoF als iemand met een eigen wil? Komt de warning later terug?
7. **Academie (5 min).** Kies op de proefdag tegen de recruiters in. Kies bij "Is he ready?" voor loan. *Let op:* voelt kinderen kiezen als CEO-werk of als micromanagement? Staat de loan er na het seizoen nog?
8. **Pathway (5 min, als hij start).** Kies "Youth first" en lees de evaluatie. *Let op:* begrijp je de vier lenzen? Kostte het punten? Zie je wat credibility doet?

Meet daarnaast per week: tijd per week (B3: kort mobiel?), het aantal tikken per week, en of je de week kon afronden zonder het afdelingsscherm te openen.

## 8. Ontwerpvragen voor de eigenaar

1. **Mag de CEO individuele jeugdspelers kiezen?** (de proefdag, "Promote him now", "Give him minutes"). B1 verbiedt het elftal kiezen, niet dit, maar P1 zegt "je stuurt mensen, geen spelers".
   *Aanbeveling:* doorstromen ("Promote") laten staan, want dat is een selectie- en contractbesluit. Op de proefdag kies je het criterium, niet de kinderen. "Give him minutes" wordt een verzoek dat de coach kan weigeren.
2. **Is de Chief Scout een eigen afdeling of de tweede stem binnen Recruitment?** Nu zit hij er half tussenin: een eigen mandaat en gesprek, maar geen eigen bevoegdheid, KPI of inbox.
   *Aanbeveling:* binnen Recruitment, met een eigen kleine, werkende knoppenset (regio's, budget, potential ↔ proven, data) en een eigen stem in de terugkoppeling (hits en misses toegeschreven), zonder eigen bevoegdheid. Medical blijft onderdeel van First team.
3. **Moet delegeren een volwaardige strategie zijn?** Nu bestraft grip een CEO die zijn hoofden vrij laat, terwijl de desk dat juist aanmoedigt.
   *Aanbeveling:* ja. Grip groeit ook door goed gedelegeerde zaken en door de bewuste keuze voor free hand bij een sterk hoofd, en zakt bij fouten van wie je die vrijheid gaf. Dan is "wie vertrouw ik" de afweging, niet "hoe vaak tik ik".

---

### Wat ik niet heb getest
- Geen browser, geen UI-weergave, geen screenshots. Leesbaarheid, 390 px en of iets leuk is, zijn niet beoordeeld.
- Metingen: 24 runs × 3 seizoenen per instelling (styles: 20 × 5) met gematchte seeds en de actieve auditstijl. Verschillen onder ongeveer ±0,06 punten per wedstrijd en ontslagaantallen per 24 runs behandel ik als ruis. Langere carrières (de opbrengst van de academie na 5+ seizoenen), andere DNA-combinaties en hogere divisies zijn niet apart gemeten.
- De meetscripts staan buiten de repo (scratchpad): een aangepaste kopie van `tools/auditlib.js` met een extra mandaat-hook, plus een verificatie van de afspraakbug.
- Een geslaagde meting zegt dat een knop doorwerkt, niet dat de speler het begrijpt of waardeert. Dat is het werk van de playtest in §7.
