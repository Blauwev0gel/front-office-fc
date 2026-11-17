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
   Director, Commercial Director, Head of Marketing, Finance Director). Elk met 3 attributen, een
   bio en een eigen neiging (LEAN) die kan botsen met je mandaat.
3. **Mandaten** — per rol schuifjes (bv. Youth↔Experience) en regels (bv. max transfersom).
4. **Zomer** — vergadering met DoF en staf → getekende zomerbrief → ticker waarin de DoF uitvoert →
   zomereditie van de krant → debrief waarin je de DoF afrekent → seizoensdoelen.
5. **Voorseizoen** — doel met het bestuur onderhandelen (veilig / accepteren / hoger mikken) en
   max. twee focusdoelen kiezen.
6. **Persconferentie** — antwoorden worden beloftes (promotie, jeugd, ticketprijzen…).

### 5.2 De week (34× per seizoen)
1. **Coming up** — wat staat er deze week.
2. **Inbox / rode map** — routinezaken beslissen afdelingen zelf binnen hun bevoegdheid; alleen
   escalaties komen bij jou (boven het limiet, topspeler, clubnaam, zwakke/koude head, kort lijntje)
   plus wat altijd van de CEO is: conflicten tussen afdelingen, bestuur, supporters, pers, en
   gesprekken met de heads zelf.
3. **Geen actiepunten** — second opinions, gesprekken, wijzigingen van mandaten en afdelingsopdrachten zijn beschikbaar zonder wekelijkse kliklimiet. Werkelijke uitvoeringskosten, relaties, verantwoordelijkheden en latere gevolgen blijven bepalend (B16).
4. **Wedstrijddag** — vooraf drie verhalen over eigen spelers; tijdens: commentaar; na: hoe elk
   verhaal afliep en het keerpunt.
5. **Weekafsluiting** — onbeantwoorde berichten worden door de staf zelf afgehandeld, financiën,
   ontwikkeling, blessures, bestuur, de Gazette en "wat veranderde er".

Antwoorden staan direct onder de ontvangen mail: **één tik op een optie voert het besluit meteen uit en slaat het op**, met direct zichtbare terugkoppeling. Geen aparte selectie, Send-knop, actiepuntkosten of tweede bevestiging, ook niet bij een zwaar besluit. Dit vervangt de oude B12-flow (B16).

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
| Afdelingen | head + staf, budgetaandeel, KPI-historie, log | `depts.js` |
| Bevoegdheid (desk) | short leash / normal / free hand per head, foutkans | `desk.js` |
| Grip | zakt als je niet zelf beslist; tilt of drukt alle heads | `levers.js` |
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
- **Ontwikkel- en publicatiediscipline (B13):** valideer wijzigingen **vóór** de push met de relevante lokale build, syntax-, unit- en regressietests, inclusief eventuele nieuwe testasserties. Bundel samenhangende wijzigingen in één gecontroleerde commit/push in plaats van iedere kleine tussenstap apart te publiceren. Controleer vervolgens de daadwerkelijke GitHub Actions-run en de foutlog; **bij een failure eerst de oorzaak herstellen en de workflow groen krijgen voordat je verder ontwikkelt of opnieuw publiceert**. Een broncodeparse of handmatige inspectie is niet hetzelfde als het uitvoeren van de build/testset. Omdat één push alle drie de preview-/releaseversies opnieuw bouwt, kan een foutieve test op één branch de publicatie van alle drie blokkeren. Onderscheid code-/testfouten van tijdelijke GitHub Pages-deployfouten; voer een rerun alleen uit als dat past bij de gevonden oorzaak.

## 9. Huidige staat van de code (analyse 15-11-2026)

Werkt:
- Build slaagt (~1,0 MB).
- Alle Node-tests slagen, ook `audit` en een nieuwe regressietest in `sack` (ontslag bij de seizoensbeoordeling).

Aandachtspunten:
1. ~~`test/audit.js` crasht~~ — was een echte spelbug: ontslag door het bestuur bij de seizoensbeoordeling liet het
   spel crashen, omdat de clubs al van divisie gewisseld waren. Opgelost (15-11-2026).
2. ~~Dubbele generaties~~ — opgeruimd (15-11-2026): ongeveer 45 KB dode code weg, waaronder de oude zomer-v1-schermen,
   oude club-, staf-, competitie- en reviewschermen en 17 knopacties zonder knop. `academy*`, `events*`, `recruit*`
   zijn geen dubbelingen maar aanvullende delen. `summer.js` levert nog de stappen waarop `summer2.js` draait.
   Let op: de tests simuleren de zomer nog via de v1-route (`sumAuto`), niet via de v2-flow die de speler ziet.
3. ~~`ui.js` is 1.849 regels in één blok~~ — opgeknipt in delen (15-11-2026), build byte-identiek.
4. **Veel meters tegelijk:** bestuursvertrouwen, 4 backers, grip, verborgen druk, credibility (pathway),
   DNA-alignment en KPI's per afdeling. Het verouderde actiepuntensysteem is op `chatgpt` verwijderd (B16); test of de overige meters P2 versterken zonder P4/P5 te schaden.
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
| B12 | 15-11-2026 | Inbox: keuzes en antwoord op één scherm, zonder aparte Reply-stap. Send verwerkt en bewaart direct; grote beslissingen behouden een expliciete bevestiging. | Minder herhaling en wachten in korte mobiele sessies; de beslissing blijft bewust. |
| B13 | 16-11-2026 | **Test vóór push; bundel samenhangende wijzigingen; controleer Actions en los failures op vóór nieuwe pushes.** Geen groen vinkje claimen zonder de relevante tests echt uit te voeren. | Herhaalde commits naar `chatgpt` veroorzaakten onnodig veel workflow-runs; een foutieve CSS-testassertie liet publicaties falen, hoewel de code kon bouwen. Eén push bouwt alle drie de versies. |
| B14 | 16-11-2026 | **Clubverhalen ontstaan uit echte clubtoestand, lopen 8–15 weken door en laten staf zelfstandig handelen.** Begin met trainer–TD, talentontwikkeling en financiële druk. CEO stelt richting, kiest geen elftal of transfers; stille weken zijn toegestaan. | Losse mails vormen geen carrièreverhaal. Bestaande events, dossiers, pathway, stafmandaten, financiën en Gazette blijven de enige uitvoerende engines. Maximaal twee gelijktijdige verhaallijnen, expliciete afhandeling in savegames en geen gegarandeerd gescript resultaat. |
| B15 | 16-11-2026 | **Uitsluitend de `chatgpt`-preview heeft een blijvende retro tekst-/wireframemodus.** Alle schermen (oprichting, zomer, inbox, gesprekken, afdelingen, tabellen, wedstrijddag en Gazette) gebruiken één monospace-designsysteem met rechte kaders, rustige tinten en duidelijke mobiele bediening. Geen illustraties, effecten of decoratieve animaties; wel alle bestaande tekstinformatie en acties. | Minder visuele ruis en eenvoudiger engine-testing op telefoons. De CSS vervangt zijn vorige versie in plaats van extra overlappende lagen toe te voegen. Geen wijzigingen op `main` of `claude-game`; geen engine-, save- of spelregels gewijzigd. |
| B16 | 16-11-2026 | **`chatgpt` heeft geen actiepunten meer; alle Red Box- en briefingkeuzes zijn één tik = direct besluiten en bewaren.** Ook gesprekken, second opinions, mandaten, ontslag en afdelingsopdrachten zijn niet AP-gated. Geen Send/draft/extra bevestiging, zelfs niet voor votes. | CEO-aandacht wordt gestuurd door reële gevolgen en stafautonomie, niet door een kunstmatige weeklimiet. Oude saves migreren zonder `G.ap`. Geen exploit bij identieke mandaten/herhaald steunen of dezelfde week hetzelfde gesprek. Retro-schermen moeten aantoonbaar leesbare kleuren en bruikbare knoppen hebben. **Vervangt het interactieontwerp in B12 op `chatgpt`.** |


## ChatGPT mobile navigation and CEO metrics decision (17 November 2026)

- Message navigation uses explicit Back / Next labels, no vertical word wrapping, and omits Next when no next message exists. Mobile widths 320–390 px are covered by the retro stylesheet; owner performs browser QA.
- Board, supporters, press and dressing room remain distinct backer systems, with a vote-of-confidence threshold and explanations in the Backers sheet. Do not remove or merge these without separate counterfactual gameplay evidence.
- Grip was an activity counter rather than a distinct club outcome: it lost five points every week and penalised trust and staff even when delegation was appropriate. Automatic decay, low-Grip penalties and the universal staff-skill modifier are disabled. The legacy saved field is retained for compatibility; its persistent footer chip is removed. CEO decisions remain meaningful through mandates, relationships, board, backers, costs and recorded consequences.
- Browser-only visual QA is owner-run, not a publishing gate. Engine, one-tap, save, stories and text-mode CI checks remain mandatory. These changes are limited to the `chatgpt` branch.


## B17 — Simplified CEO stakeholder model (Model B; chatgpt only)

- The persistent CEO accountability model has **three** stakeholder scores: Board (employment/targets), Supporters (fan trust and club identity), and Dressing room (squad morale). These are backed by existing state and vote-of-confidence rules, not invented new currencies.
- **Press is contextual, not a fourth firing meter.** Existing press sentiment, questions, Gazette and narrative reactions remain, but new weekly low-press confidence votes are not generated. A legacy `vote_press` event remains defined so pending old saves can resolve safely.
- **Grip is retired as a gameplay incentive.** No passive decay, no low-Grip relationship penalty, no universal staff skill bonus; the old value remains in saves for compatibility and is not shown as a permanent status. Mandates, delegation outcomes, staffing and actual stakeholder consequences determine CEO quality.
- The inbox shows only the three accountable constituencies, with plain-language bands (supportive, stable, uneasy, at risk, crisis). The Backers sheet explains the causes and crisis threshold; news and press remain contextual.
- Regression gate: `node test/stakeholders.js` checks visible stakeholder keys, Press isolation, Grip neutrality and old-save compatibility. Browser layout testing is performed by the owner.


## B18 — Model B stakeholder engine integration (chatgpt)

- Grip action wrappers and weekly maintenance are retired, not just hidden. Legacy save fields may still exist; they have no gameplay effect.
- Stakeholder changes from inbox responses, brief answers, block-goal results and weekly simulation are recorded in a bounded `stakeLog` with season, week, source, reason and per-stakeholder deltas. The Backers sheet exposes recent changes. The weekly aggregate is explicitly labelled as such; it must not falsely attribute autonomous effects to the CEO.
- Board, supporters and dressing room remain three mechanically distinct sources (board confidence, supporter sentiment, aggregate player morale). Press is narrative/contextual and not a new confidence-vote trigger.
- Future improvement: source-level tracing for each autonomous weekly mutation, paired multi-season balance tests and finer differentiation of short-term reactions vs long-term confidence. Do not claim those are complete until tested.


## B19 — CEO UX information hierarchy V1 (chatgpt)

- The Inbox is the play surface: current decisions, next match, meaningful updates and Gazette precede optional archive browsing. Nine existing message folders are preserved under a collapsed Browse all messages control.
- Five persistent destinations remain Inbox, Club, Squad, League and Departments. Do not merge Football views without demonstrating fewer navigation steps; matchday and conversations are contextual flows.
- One owning page per concern: cash/board on Club, squad and players on Squad, standings on League, mandates and staff on Departments. The Inbox cash shortcut now opens Club.
- Retired Grip must not appear in Club or trigger warning badges. Board, Fans and Room remain the primary accountable constituencies.
- See `docs/CEO_UX_ARCHITECTURE_V1.md` for page contracts, wireframes, data tiers, scenario gates and deferred work. UI contract: `test/ux-architecture.cjs`. Browser visual QA is owner-run.


## B20 — The Front Office unified UI rebuild (chatgpt)

- The old five/six-item competing menus are replaced by **four stable destinations**: Desk (inbox), Football (Squad + League local views), Club (financial and board health), People (departments, mandates and employees). The existing route keys, decision handlers and engine stay intact for old saves.
- Match progression is a primary action on the Desk only. Staff and football detail views no longer display a misleading universal Play button; it remains possible to return to Desk with one tap.
- Pages use one dark retro club header, current Season/Week identity, contextual page title, clearly selected four-way navigation, and accessible local football/department controls.
- Football's squad has three mutually exclusive views: likely XI, all players and advanced statistics, without nested duplicated tabs. Player dossiers include ability/potential, key season numbers and simple Overview/Statistics/Career tabs.
- Club's first screen prioritizes cash trajectory, board objectives, three stakeholders and actual projects. Identity, promises and history remain available on demand.
- People lists problems first and links genuine pending departmental decisions to the sole owning Red Box action. Department details separate briefing, staff, evidence, and mandates/work.
- Match preview is a self-contained football screen displaying fixture context, league positions, form, real narratives and a clear kick-off action. The live match retains generated event commentary and Gazette progression.
- The UX change must not alter match outcomes, staff autonomy, transfers, financial state or save keys. Do not resurrect Grip or AP.
- This is an implemented interface redesign, **not** evidence of full device/browser accessibility QA. Only CI/build checks and owner visual review can establish those separately.

## B21 — Desk V2: football club headquarters (chatgpt, November 2026)

- The old Desk status strip, backer bars, Red Box, separate story/decision/history panels, and prominent folders are replaced by football-week context, real pressure, decisions, next match, staff updates, club matters, Gazette and club records.
- True CEO decisions (`kind: need`) are prominent; additional items beyond two are expandable. Optional briefings (`kind: upd`, except coach debrief) are explicitly optional and initially collapsed.
- The fixture card contains the sole Desk progression action, including fixture-free week continuation. The floating duplicate Play control is removed. The existing engine handles open requests and delegation.
- Negative cash and materially low stakeholder scores produce actual context alerts; ordinary weeks remain quiet. Board/Fans/Room continue to use the existing stakeholder engine.
- Club matters combines ongoing dossiers, pathways, staff delegation and decision-history references without duplicating game state. Original detail routes are preserved.
- Club records replaces nine prominent folders with five broad filters and optional specialist archives. The Desk tab resets to the live home view, while archived record navigation remains usable.
- Main implementation: `src/ui/10-inbox.js`, `src/ui/12-scenes-cards.js`, `src/ui/13-redbox-render.js`, `src/ui/15-actions.js` and `src/style/zz-text-only.css`. No changes to game engine or save format.
