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
2. **Inbox / rode map** — antwoorden in twee tikken: kies, dan Send (B20); een second opinion staat erbij. Routinezaken beslissen afdelingen zelf binnen hun bevoegdheid; alleen
   escalaties komen bij jou (boven het limiet, topspeler, clubnaam, zwakke/koude head, kort lijntje)
   plus wat altijd van de CEO is: conflicten tussen afdelingen, bestuur, supporters, pers, en
   gesprekken met de heads zelf.
3. **3 actiepunten per week** — voor second opinions, mandaten en pushes van een afdeling. Gesprekken met de hoofden zijn gratis (B19): een hoofd vraagt om een gesprek als hij iets van de CEO nodig heeft ("wants a word"), en de CEO kan altijd zelf een gesprek openen. Laat je een verzoek twee weken liggen, dan beslist hij zelf.
4. **Wedstrijddag** — vooraf drie verhalen over eigen spelers; tijdens: commentaar; na: hoe elk
   verhaal afliep en het keerpunt.
5. **Weekafsluiting** — onbeantwoorde berichten worden door de staf zelf afgehandeld, financiën,
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
| Afdelingen | vier tabs Now / Plan / People / Record (B12): oordeel en verzoeken van het hoofd (B19), mandaat en middelen, mensen (het hoofd beheert zijn staf, B18), record met wat het hoofd namens jou besliste | `depts.js`, `ui/08-departments.js`, `ui/08a-dept-parts.js` |
| Gesprekken | het hoofd vraagt om een gesprek of de CEO opent er een; korte scènes met gevolg, gratis | `talks.js`, `firstteam.js` |
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
   De tests draaien de zomer via de v2-flow: `sumAuto` is sinds `summer2.js` gelijk aan `sum2Auto` (gecorrigeerd 15-11-2026).
3. ~~`ui.js` is 1.849 regels in één blok~~ — opgeknipt in delen (15-11-2026), build byte-identiek.
4. **Veel meters tegelijk:** bestuursvertrouwen, 4 backers, grip, verborgen druk, credibility (pathway),
   DNA-alignment, actiepunten, plus KPI's per afdeling. Sterk voor P2, maar mogelijk in strijd met P4/P5.
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
