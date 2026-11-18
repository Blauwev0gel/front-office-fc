# The Front Office — Spelbijbel

> Status: **concept v0.2** (eerste besluiten genomen 15-11-2026), opgesteld uit een analyse van de code op `main` (commit `798ba01`).
> Alles hieronder beschrijft wat de code *nu doet*. Punten met **❓** zijn open vragen die we samen
> beslissen. Pas als een punt besloten is, gaat het naar het besluitenlog onderaan en wordt het bindend.

---

## 1. De pitch (één zin)

Een mobiele voetbal-CEO-game: je runt de club vanuit de bestuurskamer — je kiest wie er leidt,
geeft ze een mandaat en beantwoordt wat er in je rode map belandt. **Je kiest nooit het elftal.**

## 2. De fantasie

Je bent niet de trainer en niet de scout. Je bent de baas van mensen die dat zijn. Het spel gaat over
*indirecte invloed*: goede mensen aannemen, ze de juiste opdracht en vrijheid geven, en leven met de
gevolgen van hun keuzes én de jouwe. Een club met 2.500 man in de County League naar de Premiership
brengen zonder ooit zelf een opstelling te maken.

## 3. Pijlers (afgeleid uit de code)

Elke nieuwe feature moet minstens één pijler versterken en mag er geen breken.

| # | Pijler | Waar het in de code zit |
|---|---|---|
| P1 | **Je stuurt mensen, geen spelers.** Invloed loopt via aannemen, mandaten (schuifjes + regels), bevoegdheid en gesprekken. | `engine/` ROLES/MAND, `desk.js` AUTH, `firstteam.js` talks |
| P2 | **Elke beslissing laat een spoor na.** Gevolgen komen later, worden gelogd met hun oorzaak, en je ziet hoe je achterban bewoog. | `pathway.js` (credibility met oorzaak), `loop.js` (backer-diff), `dossiers.js` (heat) |
| P3 | **De club heeft een identiteit.** Zeven DNA-keuzes bepalen startpositie, doelen van het bestuur en wat "goed" is. Afwijken kost alignment. | `engine/` DNA, setObjectives, alignment |
| P4 | **Druk voel je, je leest hem niet af.** Druk verschijnt als signalen en stemmen ("The chairman has stopped returning calls"), niet als kale getallen. | `dossiers.js` header, `loop.js` VOICE |
| P5 | **Kort, mobiel, leesbaar.** 390 px, licht/donker, tikdoelen ≥ 44 px, WCAG AA, max. twee zinnen per blok. | README ground rules, `style/` |
| P6 | **Een fictieve, consistente wereld.** Geen echte spelers, clubs of merken. Eén krant (The Gazette), één piramide van 8 niveaus. | README, `engine/` TIERS/TOWN_* |
| P7 | **Mensen hebben een eigen wil.** Staf en spelers zijn personages met ambities, ego's en loyaliteit. Ze kunnen je tegenspreken, eigen instincten volgen of vertrekken. | `engine/` LEAN/pers, `firstteam.js` coach-instinct, `summer2.js` DoF-houding |
| P8 | **De club is een verhaal.** Elke carrière levert een eigen clubgeschiedenis op (archief, Gazette, legacy). Dat is de beloning voor eindeloos doorspelen. | `G.history`, Gazette-archief, `dossiers.js` |
| P9 | **Er is geen perfecte keuze.** Elke beslissing is een afweging. Een optie die alles beter maakt is een ontwerpfout. | events/dossiers: opties met kosten en baten |

P1 t/m P6 zijn bevestigd (B5) en P7 t/m P9 zijn toegevoegd (B9).

## 4. Wat het spel IS / IS NIET

| Het IS | Het IS NIET |
|---|---|
| Een management-game over mensen, mandaten en gevolgen | Een tactiek-/opstellingsgame (geen formaties, geen wissels) |
| Week-voor-week, beurtgebaseerd (34 speelweken + zomer) | Real-time of een live-wedstrijdsimulator waarin jij ingrijpt |
| Verhalend: dossiers, de Gazette, gesprekken, verhaallijnen | Een spreadsheet-sim waar je optimaliseert op getallen |
| Eén HTML-bestand, vanilla JS, speelt offline in de browser | Een app met backend, accounts of server |
| Fictieve wereld met eigen competities en beker | Gelicenseerd (geen echte namen, clubs, merken) |
| Speelbaar op een telefoon met één duim | Een desktop-first dashboard |
| Vergevingsloos waar het moet: ontslag is definitief | Een sandbox zonder verliesconditie |

Vastgelegd:
- De CEO kiest **nooit** het elftal en onderhandelt **nooit** zelf; ook niet als uitzondering (B1).
- **Eindeloos tot ontslag**: geen win-conditie; historie en legacy zijn de beloning (B2).
- **Engels-only**, geen lokalisatie (B7).
- Monetisatie is nog open: we maken geen ontwerpkeuzes die het later blokkeren, en geen pay-to-win (B4).

## 5. De kernloop

### 5.1 Start van een carrière
1. **DNA** — zeven vragen: ontstaan, speelstijl, talentbron, financiering, identiteit, ambitie, stadion.
   Dit zet kas, fans, schulden, capaciteit, mandaat-defaults en bestuursdoelen.
2. **Staf** — zeven rollen aannemen binnen een stafbudget (DoF, Head Coach, Chief Scout, Academy
   Director, Commercial Director, Head of Marketing, Finance Director). Zes afdelingen: de Chief Scout werkt binnen Recruitment (B15). Elk met 3 attributen, een
   bio en een eigen neiging (LEAN) die kan botsen met je mandaat.
3. **Mandaten** — per rol schuifjes (bv. Youth↔Experience) en regels (bv. max transfersom).
4. **Zomer** — vergadering met DoF en staf → getekende zomerbrief → ticker waarin de DoF uitvoert →
   zomereditie van de krant → debrief waarin je de DoF afrekent → seizoensdoelen.
5. **Voorseizoen** — doel met het bestuur onderhandelen (veilig / accepteren / hoger mikken) en
   max. twee focusdoelen kiezen.
6. **Persconferentie** — antwoorden worden beloftes (promotie, jeugd, ticketprijzen…).

### 5.2 De week (34× per seizoen)
1. **Coming up** — wat staat er deze week.
2. **Inbox / rode map** — antwoorden met één tik (B33, herziet B20); een second opinion staat erbij. Routinezaken beslissen afdelingen zelf binnen hun bevoegdheid; alleen
   escalaties komen bij jou (boven het limiet, topspeler, clubnaam, zwakke/koude head, kort lijntje)
   plus wat altijd van de CEO is: conflicten tussen afdelingen, bestuur, supporters, pers, en
   gesprekken met de heads zelf.
3. **Geen actiepunten** (B21). De afweging zit in de keuzes zelf: kansen die elkaar uitsluiten, verzoeken die verlopen, en besluiten die het ene hoofd blij maken en het andere niet. Steun aan een afdeling (push) geldt voor één afdeling tegelijk. Elke week heeft een **onderwerp** (B22): derby, transferwindow, bestuursreview, beker, crisis of een stille week. In stille weken komt er **één kans** op je af (B23): een speler, de pers, een rivaal, een lokaal bedrijf, supporters, de gemeente. Hoofden vragen om een gesprek als ze iets nodig hebben of als het slecht gaat (B19).
4. **Wedstrijddag** — de preview noemt weer, aftrap en verwachte opkomst; soms bij rust de keuze om de kleedkamer in te gaan (B27); bij full time waarom we wonnen of verloren (B26); bij big games vóór de aftrap één CEO-keuze (winbonus, kleedkamer, sponsor in de box) en erna een reactie naar de pers (B23); vooraf drie verhalen over eigen spelers; tijdens: commentaar; na: hoe elk
   verhaal afliep en het keerpunt.
5. **Weekafsluiting** — onbeantwoorde berichten worden door de staf zelf afgehandeld; besluiten van weken geleden komen soms terug in de Gazette ("Looking back", B24); financiën,
   ontwikkeling, blessures, bestuur, de Gazette en "wat veranderde er".

### 5.3 Het seizoen
Vijf blokken met elk een doel: Opening (1–6), Autumn (7–15), Winter (16–19, korte transferwindow),
Run-in (20–29), Finale (30–34). Beker in week 5/11/17/23/29/33. Na week 34: promotie/degradatie
(top 3 / onderste 3), contracten, pensioenen, licentie-eisen, beoordeling van doelen en beloftes.

### 5.4 Verliescondities
- Bestuursvertrouwen 0 → ontslag.
- Een backer (bestuur, supporters, pers, kleedkamer) onder 5 → **vote of confidence**, één laatste kans per seizoen.
- 4 weken diep insolvent → administration; tweede keer binnen 3 seizoenen → ontslag.
- Ontslag is **definitief** (getest in `test/sack.js`).

## 6. Systemen-inventaris

| Systeem | Wat de speler ziet/doet | Bestand(en) |
|---|---|---|
| Wereld & competitie | 8 divisies, 18 clubs, beker, rivalen die mee-evolueren | `engine/` |
| Spelers | 14 attributen, CA/PA, leeftijd, contract, moraal, persoonlijkheid | `engine/` |
| Wedstrijdsim | xG-gebaseerd, teamsterkte uit XI + coach-fit | `engine/`, `matchtalk.js`, `matchday.js` |
| Afdelingen | drie weergaven Overview / Setup / Record (B12, B34): oordeel en verzoeken van het hoofd (B19), mandaat en middelen, mensen (het hoofd beheert zijn staf, B18), record met wat het hoofd namens jou besliste | `depts.js`, `ui/08-departments.js`, `ui/08a-dept-parts.js` |
| Week en gebeurtenissen | onderwerp van de week, kansen in stille weken, big-game-momenten, terugblikken (B22–B24); gebeurtenissen gewogen op de clubsituatie en vervolgen met herkomst (B31) | `weekflow.js`, `weekloop.js`, `engine/08-weekly-inbox.js` |
| Gesprekken | het hoofd vraagt om een gesprek of de CEO opent er een; korte scènes met gevolg, gratis | `talks.js`, `firstteam.js` |
| Bevoegdheid (desk) | short leash / normal / free hand per head; escalaties met een reden; het hoofd voert uit vanuit zijn profiel (kwaliteit, risico, bevoegdheid), B54 | `desk.js` |
| Backers | 4 achterbannen met eigen stem, vote of confidence | `loop.js` |
| Events & briefings | ±80 events, korte state-gedreven updates | `events*.js`, `briefs.js` |
| Dossiers | 8 verhaallijnen in 3 delen, heat bepaalt het einde | `dossiers.js` |
| Pathway | governance-verhaallijn (jeugd vs. veteraan) met evaluatie door 4 lenzen | `pathway.js` |
| Eerste elftal | coach-instinct vs. mandaat, ondersteunende staf, afspraken met deadline, ontslag met prijs | `firstteam.js` |
| Scouting & transfers | regio's, rapporten met onzekerheid, pipeline, DoF-trackrecord | `recruit.js`, `recruitx.js` |
| Academie | leeftijdsgroepen, jeugdstaf, categorie/audit, proefdag, "is hij klaar?" | `academy*.js` |
| Commercieel | drie tribunes, prijs, beleving, sponsoraanbiedingen, merch | `commercial.js` |
| Marketing | funnel (bereik → fans → seizoenkaarten), campagnes, community, edgy-risico | `marketing.js` |
| Business | seizoensbudget per afdeling, forecast, herfinanciering | `business.js` |
| Zomer | transferzomer v1 (5 stappen) en v2 (vergadering → brief → ticker → debrief) | `summer.js`, `summer2.js` |
| Seizoensritme | blokken, bestuursreviews, high-stakes wedstrijden, winterwindow, huur | `season.js` |
| Presentatie | inkt-portretten, kantoorscène, geluid, Gazette, inbox-mappen | `faces.js`, `ui/`, `style/` |

## 7. Toon & stijl
- Droog, licht ironisch Brits voetbalproza ("Your name is sung. Occasionally in tune.").
- Interface in het Engels, maximaal twee zinnen per blok.
- Visueel: inkt-stijl procedurele portretten, krant-esthetiek (The Gazette), clubkleuren.

Vastgelegd (B10): droge Britse ironie is de vaste stem van het spel. ❓ Referenties die het gevoel vangen zijn welkom.

## 8. Technische fundamenten (bindend)
- **Eén HTML-bestand.** `build.py` plakt de modules in `src/` in vaste volgorde in `src/index.html` → `dist/index.html`. Grote modules (`engine/`, `ui/`, `style/`) zijn mappen met genummerde delen. `CODEMAP.md` is de wegwijzer.
- **Engine zonder DOM.** `engine/` en de modules draaien in Node; uitbreiding via `FO.HOOK.*`.
- **Deterministisch.** Eigen seeded RNG (`G.rs`); zelfde seed + zelfde acties = zelfde uitkomst.
- **Saves blijven werken.** Nieuwe state via migratie (`VERSION`, nu 3) of een veilige default.
- **Publicatie** via GitHub Actions: elke push naar `main`, `claude-game` of `chatgpt` bouwt alle drie de versies. Claude werkt op `claude-game` (preview `/claude/`); release = merge naar `main` op verzoek. `docs/index.html` is een verouderde snapshot.

## 9. Huidige staat van de code (analyse 15-11-2026; beslissingen sindsdien: B12–B31, zie het logboek en `design/besluiten-*.md`)

Werkt:
- Build slaagt (~1,0 MB).
- Alle Node-tests slagen, ook `audit` en een nieuwe regressietest in `sack` (ontslag bij de seizoensbeoordeling).

Aandachtspunten:
1. ~~`test/audit.js` crasht~~ — was een echte spelbug: ontslag door het bestuur bij de seizoensbeoordeling liet het
   spel crashen, omdat de clubs al van divisie gewisseld waren. Opgelost (15-11-2026).
2. ~~Dubbele generaties~~ — opgeruimd (15-11-2026): ongeveer 45 KB dode code weg, waaronder de oude zomer-v1-schermen,
   oude club-, staf-, competitie- en reviewschermen en 17 knopacties zonder knop. `academy*`, `events*`, `recruit*`
   zijn geen dubbelingen maar aanvullende delen. `summer.js` levert nog de stappen waarop `summer2.js` draait.
   De tests draaien de zomer via de v2-flow: `sumAuto` is sinds `summer2.js` gelijk aan `sum2Auto` (gecorrigeerd 15-11-2026).
3. ~~`ui.js` is 1.849 regels in één blok~~ — opgeknipt in delen (15-11-2026), build byte-identiek.
4. **Veel meters tegelijk:** bestuursvertrouwen, 4 backers, verborgen druk, credibility (pathway),
   DNA-alignment, plus KPI's per afdeling (actiepunten zijn afgeschaft, B21). Sterk voor P2, maar mogelijk in strijd met P4/P5.
5. Tab `money` bestaat in de render, maar staat niet in de tabbalk.
6. Eerste audit-signaal (20 runs × 5 seizoenen, nog te toetsen): een *actieve* CEO wordt even vaak ontslagen
   als een passieve (35%), een willekeurig klikkende CEO nooit. Coach-mandaten (aanvallend/verdedigend, jeugd)
   veranderen punten per wedstrijd nauwelijks.

Besloten: voor (2) is de nieuwste versie leidend (B8); over (4) beslissen we na een playtest (B6).

## 10. Open vragen
1. Toon-referenties (optioneel).
2. Meters: welke zijn kern? Beslissen we na een playtest (B6).
3. Monetisatie: blijft open (B4).

---

## Besluitenlog

| # | Datum | Besluit | Reden |
|---|---|---|---|
| B1 | 15-11-2026 | De CEO kiest nooit het elftal en onderhandelt nooit zelf. Ook niet als uitzondering. | Indirecte invloed is de kern van het spel. |
| B2 | 15-11-2026 | Eindeloos tot ontslag; geen win-conditie. | Historie en legacy zijn de beloning. |
| B3 | 15-11-2026 | Doelgroep: beide. Een week moet in korte sessies op mobiel af te handelen zijn, met diepte voor wie wil graven. | Korte sessies en verdieping naast elkaar. |
| B4 | 15-11-2026 | Monetisatie nog niet besloten. Geen keuzes die het blokkeren, geen pay-to-win. | Houdt opties open. |
| B5 | 15-11-2026 | De zes pijlers P1 t/m P6 zijn bevestigd. | Het toetsingskader voor elke feature. |
| B6 | 15-11-2026 | Over de meters beslissen we pas na een playtest, niet op papier. | Eerst voelen welke overbodig zijn. |
| B7 | 15-11-2026 | Engels-only. | Geen lokalisatie-architectuur nodig. |
| B8 | 15-11-2026 | Bij dubbele versies is de nieuwste leidend (zomer v2, academie 3, enz.); ongebruikte oude code wordt opgeruimd. | Minder regressierisico, één waarheid. |
| B9 | 15-11-2026 | Pijlers toegevoegd: P7 Mensen hebben een eigen wil, P8 De club is een verhaal, P9 Er is geen perfecte keuze. | Aanvulling op het toetsingskader. |
| B10 | 15-11-2026 | De toon is droge, licht ironische Britse voetbalproza. | De vaste stem van het spel en de Gazette. |
| B11 | 15-11-2026 | Deze stand (opgeknipte code, dode code weg, seizoenseinde-crash opgelost) is **V1** (tag `v1.0`): het gemeenschappelijke vertrekpunt voor `main`, `chatgpt` en `claude-game`. | Beide AI-branches werken vanaf dezelfde basis. |
| B12 | 15-11-2026 | Elke afdeling heeft dezelfde vier tabs: **Now** (oordeel, max. drie aandachtspunten met oorzaak en knop, wat op jou wacht), **Plan** (mandaat, middelen, bevoegdheid), **People** en **Record** (wat hij deed). Elk gegeven staat op één plek; geen "alle informatie"-blokken. | Overzicht op mobiel; diepte onder een vraag, niet onder "alles" (P4, P5, B3). |
| B13 | 15-11-2026 | Richting kost een actie, middelen niet: een mandaat wijzigen kost 1 AP; budget, regio's, trips en staf zijn gratis en staan alleen op Plan. | Eén prijs per instelling, ongeacht de route. |
| B14 | 15-11-2026 | Getallen over mensen en afdelingen tonen eerst een woord, het getal klein erachter ("cool (44)"). Een afwijking van het mandaat noemt wat het kost. | Druk voel je, je leest hem niet af (P4). |
| B15 | 15-11-2026 | De Chief Scout is de tweede stem binnen Recruitment: geen eigen afdeling of mandaatsheet, wel een eigen persoon (Talk, Sack). Medical hoort bij First team. | Duidelijke eigenaar per knop, geen extra scherm (B3). |
| B16 | 15-11-2026 | De CEO kiest geen individuele jeugdspelers: op de proefdag kiest hij waar de recruiters op letten, zij kiezen de kinderen. | Je stuurt mensen, geen spelers (P1). |
| B17 | 15-11-2026 | Een verzoek aan de coach over een speler ("Give him minutes") kan hij weigeren, naar de mate waarin hij je mandaat volgt. | Mensen hebben een eigen wil (P7); de CEO kiest nooit het elftal (B1). |
| B18 | 15-11-2026 | Elk hoofd neemt zijn eigen staf aan en laat ze gaan, binnen het budgetniveau dat de CEO zet. Hij kiest naar zijn kwaliteit en karakter. Boven zijn bedragslimiet vraagt hij het de CEO in een gesprek. | De CEO stuurt mensen, niet hun personeel (P1); het hoofd kiezen weegt zwaarder (P7). |
| B19 | 15-11-2026 | Wat de CEO nodig heeft, komt als gesprek van het hoofd ("wants a word"), niet als lijst. Eén gespreksmotor voor alle hoofden (de coach-scènes zijn het model). Gesprekken zijn gratis; alleen het eerste gesprek met een hoofd binnen drie weken geeft grip en volle werking. **Herziet B12:** Now toont geen aandachtslijst meer maar het oordeel en de verzoeken van het hoofd. | Druk voel je via mensen (P4), mensen hebben een eigen wil (P7). |
| B20 | 16-11-2026 | Een bericht beantwoorden kost twee tikken: kies een antwoord, dan Send; het is direct verstuurd, zonder wachttijd of undo. Big decisions blijven 'houd ingedrukt'. Een second opinion komt gratis met het bericht mee en staat boven de antwoorden. | Snel op mobiel (B3); twee stemmen afwegen voor je beslist (P7, P9). |
| B21 | 16-11-2026 | **Geen actiepunten meer.** De eigenaar overrulet hiervoor bewust B6 (meters pas na een playtest). De afweging komt uit de keuzes zelf (uitsluitende kansen, verlopende verzoeken, hoofden die je tegen elkaar afweegt); een push geldt voor één afdeling tegelijk; grip groeit alleen nog door wat op je bureau landt, niet door vrij sleutelen aan mandaten, budgetten of staf. | De week moet als CEO voelen, niet als het uitgeven van stipjes. |
| B22 | 16-11-2026 | Elke week heeft een onderwerp dat volgt uit de echte stand: crisis, big game, transferwindow, bestuursreview, beker, seizoensblok, academiemomenten, of een stille week. | De week vertelt wat voor week het is (P4). |
| B23 | 16-11-2026 | In stille weken komt er één kans op de CEO af, uit een wisselende reeks (speler, pers, rivaal, lokaal bedrijf, supporters, agent, gemeente, legende, goed doel, uitreis, twee uitnodigingen tegelijk). Big games krijgen een CEO-moment vóór de aftrap en een reactie erna. Nooit opstelling of wissels (B1). | Stille weken worden initiatief in plaats van leegte (P1, P9). |
| B24 | 16-11-2026 | Ongeveer twintig besluiten van de CEO komen 3–8 weken later terug in de Gazette ("Looking back"). | Het seizoen vertelt het verhaal van jouw besluiten (P2, P8). |
| B25 | 16-11-2026 | De wedstrijdengine is gekalibreerd op realistische uitslagen (±2,7 goals, ±8% 0-0), en elk coachschuifje heeft een prijs: aanvallend helpt de favoriet en kost de underdog, jeugd kost nu punten en levert groei, een vaste elf geeft ritme en meer blessures, intensief trainen geeft groei en blessures. Weer en tribunevulling werken licht door. | Mandaten moeten ertoe doen (P1, P9); sluit D4/D12. |
| B26 | 16-11-2026 | Na elke wedstrijd staat in 2–3 regels waarom we wonnen of verloren, uit de echte factoren (afwerking tegenover xG, kwaliteit, kaarten, publiek, moraal, jeugd, speelwijze). | Je ziet wat je besluiten deden (P2). |
| B27 | 16-11-2026 | De CEO kan soms bij rust de kleedkamer in. Het gaat om mensen (moraal, het vertrouwen van de coach), nooit om de uitslag of de tactiek (B1). De wedstrijd duurt ±45 seconden; weer, avond en opkomst zijn vooraf zichtbaar. | Een eigen moment voor de CEO tijdens de wedstrijd, binnen B1 en B3. |
| B28 | 17-11-2026 | Het zomerdebrief beoordeelt de DoF op vijf vragen: plan gevolgd, uitvoering, marktpech, teamsterkte, geld. Marktpech telt niet als eigen fout. | De TD wordt niet alleen op aantallen beoordeeld (P7, P9). |
| B29 | 17-11-2026 | Twee waarschuwingen aan de DoF leiden tot een gesprek ("Back me or sack me"); waarschuwingen vervallen met één per zomer. | Beslissingen laten een spoor na (P2); mensen met een eigen wil (P7). |
| B30 | 17-11-2026 | Het data-schuifje van de DoF is een afweging tussen snelheid en zekerheid: data-gedreven beveelt geen onzekere rapporten aan, oog-gedreven wel. | Geen betekenisloze instellingen (P9). |
| B31 | 17-11-2026 | Gebeurtenissen volgen de clubsituatie: een afdeling onder druk krijgt vaker aandacht, een rustige wordt met rust gelaten, een verwant bericht van de afgelopen weken dempt een nieuw; een week met al drie openstaande berichten krijgt er geen bij. Vervolgberichten onthouden welk besluit ze volgen ("Follow-up", "After: …"); de rode map toont het belangrijkste als "Main issue". Rustige weken blijven mogelijk. | Continuïteit boven volume; gevolgen zijn herkenbaar (P2, P8). |
| B32 | 17-11-2026 | De DoF houdt het hele seizoen een doorlopend kaderplan bij: winter = acute gaten, zomer = opvolging en aflopende contracten. Scouts werken daaraan, hij verlengt betaalbare contracten zelf en de CEO beslist alleen als een financiële grens in het mandaat in de weg zit. Het plan staat op het Now-tabblad van Recruitment en logt waarom prioriteiten wijzigen. | Je stuurt de DoF, niet de spelers (P1, B1); beslissingen laten een spoor na (P2); de DoF handelt zelf (P7). Idee van de chatgpt-branch, aangepast aan de Now/Plan-indeling. |
| B33 | 17-11-2026 | **Herziet B20.** Een bericht beantwoorden kost één tik: het antwoord staat als regel in de mail zelf (met zijn effecten) en tikken verstuurt het direct, zonder Send-knop, wachttijd of undo. Big decisions blijven 'houd ingedrukt' op het antwoord. Een second opinion staat boven de antwoorden; het resultaat verschijnt in dezelfde mail met één knop 'Next email'. | De mail leest als een mail, geen vast paneel met dode ruimte (B3, P5); effecten zijn vooraf zichtbaar, dus je beslist geïnformeerd. |
| B34 | 16-11-2026 | Afdelingsschermen krijgen één taal: vier gezondheidswoorden (On track / Mixed / In trouble / Too early) als stip, pillen alleen voor wat actie van de CEO vraagt. Detail: één kopregel met het hoofd, *Now* = oordeel → Needs you → cijfers, *Plan* = beslissingen → hoe hij werkt (mandaat + bevoegdheid) → geld. Verfijnt B12. | Het scherm moet in één blik zeggen wat er speelt en wat de CEO moet doen. |
| B35 | 16-11-2026 | **Verfijnt B34.** Afdelingsschermen volgen strikt het bestaande UI-systeem (drie oppervlakteniveaus): niveau 1 alleen voor het oordeel en wat de CEO moet beslissen, niveau 2 voor gegroepeerde inhoud, niveau 3 voor rijen. Drie weergaven: Overview (oordeel, Needs you, optionele acties zoals Medical push met prijs, cijfers), Setup (beslissingen, mandaat en bevoegdheid, mensen, geld) en Record. Vlakke achtergrond op afdelingsschermen; leestekst ≥ 14px. | Eén ontwerptaal en één duidelijke ingang per scherm. |
| B36 | 16-11-2026 | Setup heeft op elke afdeling dezelfde vier inklapbare secties (Decisions, How he works, People, Money and buildings) met een samenvatting op de kopregel; alleen Decisions staat standaard open. Het seizoensbudget meldt eerlijk wanneer vaste kosten de omzet al overstijgen ("No room yet") en toont de schatting als vroege schatting tot er vier weken zijn gespeeld. De lijst gebruikt voor "Wants a word" alleen de pil, geen zware rand. | Eén vaste plek per instelling; geen bedrag tonen dat de speler niet kan vertrouwen. |
| ❓ B36a | 16-11-2026 | **Open voor de eigenaar:** het budget heeft vaak geen ruimte (26 van 48 gemeten weken in seizoen 1 tot 2 over 4 testclubs) en de omzetschatting springt in week 5 van schatting (×1,3) naar het echte gemiddelde. Is dat bedoelde druk, of moet de schatting zachter landen? | Balansvraag; niet zelf beslist. |
| B37 | 16-11-2026 | **Moeilijkheid en tempo.** Een gewone speler doet **15 tot 20 seizoenen** over de weg naar de top (nu ±9). Elke carrière kent **1 of 2 herstelbare crisisseizoenen** in de eerste acht seizoenen. Een willekeurige CEO wordt in ongeveer **20%** van de carrières ontslagen vóór seizoen 10; een zorgvuldige speler zelden. Fouten blijven kosten: een verkeerde DoF of een mislukte zomer wordt niet vanzelf weggepoetst, en succes verhoogt de verwachtingen. Opties A (mensen tellen echt) en D (winnen kost iets) eerst; B (kater van een zomer) en C (herstelboog) daarna. | Het kan geen exponentiële rit omhoog zijn: de speler moet iets te herstellen hebben (P1, P2, P9). Metingen: zwakste staf haalde seizoen 10 op divisie 1,8 tegen 1,0 en niemand werd ontslagen. |
| B38 | 16-11-2026 | **Academie en selectiepuzzel, richting.** (1) *Herziet "Het IS NIET: ingrijpen in een wedstrijd", alleen voor de academie:* de CEO mag bij jeugdwedstrijden als **mentor** ingrijpen met keuzes die iets kosten (ontwikkeling, welzijn, risico), geen tactiek; nooit voor het eerste elftal. (2) De academie is **opt-in diepte**: je kunt er elke week naar kijken en mee spelen, maar het draait ook zonder jou goed door. (3) Een **Moneyball-portaal** wordt bediend door de DoF en scouts én door de CEO zelf in de ruwe data; een **flag is een briefing aan de DoF en scouts**, geen koop (B1 blijft). (4) Een **seeded wereld** (spelers berekend uit seed, alleen wijzigingen opgeslagen) mag, maar eerst na een klein prototype dat save-omvang en snelheid op een telefoon bewijst. (5) **Volgorde:** eerst route 2 (selectiepuzzel via het kaderplan, dan het portaal), daarna route 1 (academie, variant C: ontwikkeltraject). Alles in ontwerpronde; er is nog niets besloten over de uitwerking. | De academie en het scouten moeten iets zijn om elke week naar te kijken (P8, longevity), zonder B1 en P1 te breken. Prompt: `PROMPT-academie-en-moneyball.md` (scratchpad). |
| B39 | 16-11-2026 | **Moneyball-model, ontwerpkeuzes** (werkversie in `notes/moneyball-model.md`, nog niet gebouwd). Vier lagen: prijs, profiel en fit, karakter, context. De markt prijst een speler op de *waargenomen* kwaliteit, die deels uit kernstatistiek (met toeval) komt: marktfout **middel** (≈ 1 op 5 spitsen ≥20% te goedkoop). Fit met het stijlsysteem van de coach geeft de teamsterkte **±0,6**. Alle vier de soorten vondsten (statistiek tegenover reputatie, fit, karakter en potentieel, markt en timing), gefaseerd: eerst statistiek en fit. Portaal: **volledige tabel als opt-in** diepte (profielkaart is de standaard). Cijfers zijn vrij en ruisig; **scouts bevestigen geluk tegenover vaardigheid en karakter**. De DoF reageert op een flag met **mening en eigen alternatief**. Selectiepuzzel: vorm en stijl. | De selectie moet een puzzel zijn (P9) en scouten een datagame zonder spreadsheet-sim te worden (P5). Uitwerking van B38. |
| B40 | 16-11-2026 | **Het portaal oordeelt niet.** De portal toont data en feiten; de speler ontdekt zelf wat goedkoop of goed is. Geen waarde- of fit-tags, geen "worth". De speler flagt met een eigen hypothese, de scouts testen die achteraf met een getal, en de DoF reageert vanuit zijn eigen voorkeur en vooroordelen (geen orakel). Uitwerking van B38 en B39. | Een data-spel waarin jij de vondst uitvindt, geen filter dat het denkwerk doet (P9, P7). |
| B41 | 16-11-2026 | **De terminal gebruikt alleen echte spelvelden en is eenvoudig.** Een speler toont de 14 attributen (FM-lijst) en daaronder de seizoensstatistieken (FotMob-stijl, percentielbalken tegen dezelfde positie in dezelfde competitie). De terminal is een statistiektabel per competitie met alleen competitie, leeftijd en Totals/Per 90 als filter; geen filter op waarden. Zie `notes/moneyball-model.md` (v4). | Echte data en een rustige weergave (P5); uitwerking van B39 en B40. |
| B42 | 16-11-2026 | **Stats per positie en doorklikken.** In de terminal volgen profiel en tabelkolommen de positie van de speler; positie is een filter naast competitie en leeftijd. Je kunt doorklikken: een statistiek (verdeling, ranglijst, zijn seizoenen), een club (selectie) en een speler. Alleen velden die het spel heeft; meer positiespecifieke tellers (reddingen, tackles, onderschepping, schoten) zijn een open keuze voor de engine. | Uitwerking van B41; een data-spel waar je dieper kunt graven (P9). |
| B43 | 16-11-2026 | **Het portaal is gebouwd (plak 1 tot 3a).** De wedstrijdsim houdt negen extra tellers bij, de wereld is een seeded wereld van 14 competities (de echte clubs van het spel), en Recruitment heeft een scouting-portaal volgens B38 tot B42. Nog open: targets naar de bestaande pipeline en het tabblad Bets (plak 3b). | Uitvoering van B38 tot B42; de eigenaar koos "toevoegen en dan implementeren". |
| B44 | 16-11-2026 | **De turnaround.** Als het echt misgaat (vier zwakke weken en ruim onder de verwachte plek, of bestuursvertrouwen onder 45) vraagt het bestuur wat je gaat doen. Vijf strategieën met elk een prijs: steun de coach, vervang hem, investeer, ga jong, wacht af. Na ±zes weken kijkt het bestuur of het werkt; je kunt volhouden, van koers veranderen of om tijd vragen. Nooit in de reviewweken 10, 19 en 29 (daar blijft de bestaande "recovery plan"-belofte). Eén tegelijk, met minimaal 40 weken tussen twee crises. Je keuze komt later terug als echo. Balans niet gemeten. | Een crisis wordt een verhaallijn met een keuze in plaats van een lagere stand (B37, P1, P2, P9). |
| B45 | 17-11-2026 | **Een geflagde speler wordt een echt target (portaal plak 3b, route B).** Uit het portaal kan de CEO een geflagde speler als target aan de DoF geven. Hij krijgt een poolspeler met dezelfde naam, 14 attributen, persoonlijkheid en vraagprijs als in het portaal, en loopt door de bestaande pipeline (recommended, approach, negotiating, signed). De DoF krijgt één scoutrapport; de scoutbevestiging in het portaal voegt er nog een toe. Een CEO-target omzeilt de behoefte-poort en het squadplan en de leeftijdsgrens, maar niet de fee-, loon- en loonplafondgrens: die zijn de eigen mandaten van de CEO en worden in het portaal getoond als reden waarom hij vastzit. Bij tekenen verdwijnt hij uit het portaal en wordt zijn weddenschap bewaard. De DoF-pool blijft naast de wereld bestaan (route A, de wereld als bron, is uitgesteld). De tab Bets (achteraf zien of je gelijk had) is nog niet gebouwd. | Het scouten wordt een keten van data tot handtekening, zonder dat het portaal oordeelt (B40, P1, P6). |
| B46 | 17-11-2026 | **Het portaal heeft een tab Bets.** Een flag bewaart een momentopname van de speler (vermogen, vraagprijs, cijfers vorig seizoen, contract). Een seizoen later laat de tab Bets zien hoe hij erbij staat (als jouw speler als je hem tekende), met voor vier redenen een test: *Unlucky finisher* en *Lucky season* (de cijfers bewegen zoals je zei), *Late bloomer* (vermogen +0,5 of meer) en *Contract run-down* (je tekende hem of de prijs zakte). Voor andere redenen is er geen test; de speler vergelijkt zelf. Het portaal zegt dan of je lezing standhield, niet of de speler goed of goedkoop is (B40). Een bet is pas na het seizoen waarin je vlagde te beoordelen. | Een reden om terug te komen: je ziet of je ogen kloppen (B40, P1, P6). |
| B47 | 17-11-2026 | **Het portaal praat terug: drie scoutingmomenten.** (1) *Een voorgevoel* (`pl_hunch`): een scout ziet in de cijfers een speler die je nog niet geflagd hebt (cijfers ver onder wat zijn kansen zeggen, of jong met een plafond boven de prijs) en stelt een reden voor; je flagt hem, laat de scouts het controleren of laat het. Niet bij vijf flags of meer. (2) *Een makelaar belt* (`pl_agent`): over een speler die je geflagd hebt maar nog geen target is; je maakt hem target, laat de makelaar wachten of laat de flag vallen. (3) *Een bet is beslist* (`pl_bet_settled`): in week 3 van het seizoen na je flag meldt de scout één afgeronde bet, met als opties de speler alsnog target maken (als je gelijk had), de scouts de eer geven of ze vragen wat ze misten. Alle drie zijn de eigen beslissing van de CEO (het bureau handelt ze niet af), geen enkele oordeelt over de speler (B40). | Het portaal wordt een gesprek met je scouts in plaats van een scherm (P1, P6). |
| B49 | 17-11-2026 | **Spelers vertrekken alleen binnen een transferwindow.** Een bod accepteren, een transferverzoek inwilligen of een noodverkoop kiezen buiten het window regelt een *afspraak*: de speler blijft van jou tot het volgende window opent (winter: week 17, zomer: het zomerwindow) en vertrekt dan met het afgesproken bedrag. Binnen het window is het direct. Een speler met een afgesproken verkoop krijgt geen nieuw bod. Alleen de gedwongen verkoop bij administration en het vrijgeven van een speler (geen bedrag) blijven altijd mogelijk. | Het transfermoment is een moment en geen knop (P1, P4). |
| B50 | 17-11-2026 | **Het winterwindow is een eigen fase, zoals de zomer.** Na de wedstrijd van week 16 opent het winterwindow: een winter meeting met DoF, financiën, coach en scout (de stand halverwege, het geld, wat we nodig hebben, de winterbrief om te tekenen), een ticker van drie weken met oproepen waarbij jij beslist, deadline day, een winterkrant met cijfer A–E en een debrief met de DoF; dan terug naar het seizoen op week 17. Er zijn geen contractverlengingen, vriendschappelijke wedstrijden of seizoensdoelen. Het window is de enige plek waar de DoF in de winter koopt en verkoopt (B49); de oude vaste weken 17–18 gelden alleen nog voor headless runs die de fase nooit openen. Een save midden in het window laadt weer als het winterwindow. **Budget (besluit eigenaar):** Finance houdt bij het vullen van de kitty een kwart achter voor de winter (`winKitty`); het komt vrij als het winterwindow opent (en in week 17 bij headless runs). De bestuursafspraak (veilig/ambitieus) schaalt ook het winterdeel. Een afgesproken verkoop staat vast tot het window opent. De wintermeeting houdt alle vier agendapunten; er komt geen winter-eigen inhoud bij. | Het winterwindow is een moment met een plan, een uitvoering en verantwoording, niet een paar stille weken (P1, P4, P6). |
| B51 | 17-11-2026 | **De achterbannen voel je, je leest ze niet af (P4).** Op het homescherm, in de berichten en in de wedstrijdkrant tonen Board, Fans, Press en Room een **stemming** (Revolt, Angry, Wary, Content, Thrilled; dezelfde banden als de stemmen in `loop.js`) met een pijl voor de richting van de week, geen getal of balk. De getallen staan alleen nog in het detailscherm *Your backers*. **Grip** is geen pil meer: alleen als hij laag staat (onder 35) verschijnt *Drifting* in de onderbalk, met uitleg. De stemmingen bij ≤ 5 blijven zoals ze waren. **Press krijgt een echt gevolg**: vriendelijke of vijandige pers verschuift elke week de sponsorbelangstelling en het merk, en maakt nieuwe sponsoraanbiedingen tot ±9% hoger of lager. De sterkte van dat effect is niet gemeten. | Druk is een signaal, geen dashboard; Press is nu een afweging in plaats van alleen een ontslagroute (P4, P9). Analyse: `notes/home-meters.md`. |
| B52 | 17-11-2026 | **De achterbannen, afgemaakt (na de audit in `notes/backers-audit.md`).** (1) **Namen:** overal Board, Fans, Press en Squad (oude saves en krantedities met de oude namen worden vertaald). (2) **Nergens meer getallen** behalve klein in het detailscherm *Your backers*: clubscherm, weekoverzicht, reactie na een beslissing (pijlen, een dubbele pijl bij een grote verschuiving), ontslagscherm en optiehints tonen een stemming en een richting. Het detailscherm zet de stem voorop, dan wat de achterban raakt, en het getal klein ("61 of 100"); balken in een toestandskleur (groen, grijs, rood) in plaats van de clubkleur. Grip heet op het clubscherm *Your staff*: Drifting, Steady of Following your lead. (3) **Niet meer vastlopen:** elke week trekt een achterban boven 80 of onder 20 een tiende terug naar het midden (na de stemmingen), en aan het seizoenseinde gaan fans, pers en de moraal van de spelers een kwart terug naar het midden, zoals het bestuur al deed. (4) Dossiers, pathway en stemmingen tellen bij een achterban op via één functie (`F.backerAdd`) op de getoonde schaal; events blijven op de ruwe schaal. Ze gelijktrekken zou de balans veranderen en is niet gedaan. **Niet gemeten** (op verzoek van de eigenaar): hoe vaak meters nu nog tegen een rand staan en of het aantal stemmingen en ontslagen verschuift. | Druk voel je overal op dezelfde manier, en een goede of slechte reeks blijft zichtbaar in plaats van tegen 0 of 100 te verdwijnen (P2, P4). |
| B53 | 17-11-2026 | **Het wedstrijdscherm en de engine, vernieuwd.** De wedstrijd wordt in blokken van vijf minuten gesimuleerd met echte spelers aan beide kanten (fictieve tegenstanders en scheidsrechter), balbezit, vermoeidheid en wissels; uitslagen blijven binnen ±0,1 punt per wedstrijd van de oude engine. Het scherm volgt het genre in de stijl van het spel: scorebalken met doelpuntenmakers, één tickerregel voor de huidige actie, balbezit laatste 5 minuten, tabs Key events / Stats / Report, vaste hoogtes, ±40 seconden per wedstrijd. Key events verschijnen pas als de ticker ze vertelt. |
| B54 | 17-11-2026 | **Grip verdwijnt.** De eigenaar kiest na de audit (`docs/audits/2026-11-17-dual-expert-codebase-audit.md`) om Grip helemaal te verwijderen; dit vervangt het deel van B51 waarin Grip als signaal bleef. De invloed van de CEO zit in wie hij aanneemt, welk mandaat hij geeft, hoe hij beoordeelt en wanneer hij ingrijpt; rust wordt niet bestraft, klikken niet beloond. Uitwerking volgens `notes/PROMPT-ceo-autonomy.md`. |
| B55 | 17-11-2026 | **Het bureau toont je mensen aan het werk (UX-1).** Bovenaan het bureau: deze week (onderwerp, reeks uit de uitslagen, vorige week), dan *Your team at work*: hooguit drie dingen die heads echt deden, in hun eigen stem (risico, ego, ambitie), met het gevolg dat de game berekende en alleen wat deze week veranderde. Een citaat parafraseert, het voegt geen feiten toe. Daarna de red box met per dossier wat er zondag gebeurt, en een wedstrijdkaart. De kans in stille weken (B23) mag variëren; het is geen vaste regel meer. |
| B56 | 17-11-2026 | **De week van een CEO, niet van een postvak.** (1) **Een crisis is één bestuurskwestie:** als het bestuur een plan vraagt, staan coach, DoF en financiën elk met hun standpunt in hetzelfde besluit (uit hun karakter en de echte cijfers), losse briefs over dezelfde uitslagen blijven weg, en het antwoord raakt de betrokken afdelingen. (2) **Niet reageren heeft per zaak een eerlijke afloop:** berichten krijgen zondag de keuze van de eigenaar, voorstellen en zaken buiten de bevoegdheid van een head vervallen; de red box zegt het vooraf. (3) **Continuïteit:** *Still running* toont je plan, de belofte van de coach en de academieafspraak met de week waarin ze beoordeeld worden. (4) Een grote wedstrijd is één verhaal van bureau tot voorbeschouwing en Gazette. |
| B57 | 17-11-2026 | **De CEO brengt zelf iets ter sprake (CEO-1).** Op het bureau staat *Raise it yourself* als er een echte aanleiding is: de DoF vragen waar de selectie tekortschiet, of de coach spreken na een slechte reeks. De head geeft zijn standpunt (karakter, geld, window) en mag weigeren. Een afspraak heeft een eigenaar en een toetsweek (`G.agr`), staat onder *Still running* en wordt beoordeeld op wat er echt gebeurde: gehaald, gemist, of buiten zijn schuld. Eén lopende afspraak per onderwerp, dus geen gesprekken farmen. Een prioriteit voor de DoF stuurt nu echt de recruitment (was dode state). |
| B58 | 18-11-2026 | **CEO met eigenaarsbevoegdheden.** De speler blijft CEO met een bestuur dat oordeelt (ontslag blijft mogelijk, B2), maar mag zelf initiatief nemen tot en onderhandelen over zaken op eigenaarsniveau: financiering, partnerships, grond en stadion, samenwerking met andere clubs, langlopende commerciële afspraken. Veel daarvan hoort gewoon bij een CEO. Grote stappen gaan langs het bestuur. Nooit spelers, elftal of tactiek (B1). Aandelen, fusies en overnames vallen voorlopig buiten scope. Uitwerking: `notes/PROMPT-ceo-builder.md`. |
| B59 | 18-11-2026 | **Een eigen trainingscomplex als traject (eerste doorsnede van B58).** De gemeente (eigen doelen, vertrouwen, geheugen, verkiezing elke twee seizoenen) zet zelf grond op de markt of de CEO vraagt erom; een andere partij (ontwikkelaar of rivaal) loopt ondertussen door. Finance onderzoekt een week; de CEO kiest kopen, huren met gemeenschapsuren of samen met een investeerder (die krijgt de naam en één echte bestuurszetel); onderhandelen in hooguit drie rondes (één belang, één kaart); schuld of een zetel gaat langs het bestuur; Finance bouwt, tegenslag volgt uit zijn karakter. Het resultaat is een bezit met verplichtingen (huur via de clubkosten, gemeenschapsuren, de zetel) dat de bestaande spelersontwikkeling stuurt. Het oude project `train_ground` en de stapsgewijze groei van het trainingsniveau zijn vervangen; oude saves krijgen een eigen complex op hun niveau. |
| B60 | 18-11-2026 | **Het bureau wordt tiles-first (besluiten van de eigenaar, interactief).** (1) Bovenaan staat altijd **de week** (onderwerp, stand en doel). (2) Zonder scrollen hooguit **zes tiles**: Week, Red box, Next match, Your people, Mood, Running (en Money). (3) **Mood** wordt één kleine tile met vier stemmingen en een pijl; de volledige versie blijft in Club. (4) **Your people** is één tile met het belangrijkste in één regel in gewone taal (geen xG); tik voor de lijst. (5) **Running** is één tile met een aantal en de eerstvolgende datum. (6) De wedstrijd: een **tile én de knop** *Next match* (de enige actie om door te gaan). (7) Onderaan alleen **All messages**; de Gazette komt na de wedstrijd vanzelf. (8) **Raise it yourself verdwijnt**: de speler wordt niet gedwongen een voorgekauwde zin te zeggen. In plaats daarvan **komt een head zelf naar de CEO** ("wants a word") als hij een echt probleem ziet; de CEO kiest wat hij ermee doet. |
