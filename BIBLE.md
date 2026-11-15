# The Front Office — Spelbijbel

> Status: **concept v0.1**, opgesteld uit een analyse van de code op `main` (commit `798ba01`).
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
| P1 | **Je stuurt mensen, geen spelers.** Invloed loopt via aannemen, mandaten (schuifjes + regels), bevoegdheid en gesprekken. | `engine.js` ROLES/MAND, `desk.js` AUTH, `firstteam.js` talks |
| P2 | **Elke beslissing laat een spoor na.** Gevolgen komen later, worden gelogd met hun oorzaak, en je ziet hoe je achterban bewoog. | `pathway.js` (credibility met oorzaak), `loop.js` (backer-diff), `dossiers.js` (heat) |
| P3 | **De club heeft een identiteit.** Zeven DNA-keuzes bepalen startpositie, doelen van het bestuur en wat "goed" is. Afwijken kost alignment. | `engine.js` DNA, setObjectives, alignment |
| P4 | **Druk voel je, je leest hem niet af.** Druk verschijnt als signalen en stemmen ("The chairman has stopped returning calls"), niet als kale getallen. | `dossiers.js` header, `loop.js` VOICE |
| P5 | **Kort, mobiel, leesbaar.** 390 px, licht/donker, tikdoelen ≥ 44 px, WCAG AA, max. twee zinnen per blok. | README ground rules, `style.css` |
| P6 | **Een fictieve, consistente wereld.** Geen echte spelers, clubs of merken. Eén krant (The Gazette), één piramide van 8 niveaus. | README, `engine.js` TIERS/TOWN_* |

❓ **Klopt dit rijtje? Mist er een pijler, of is er één die je eigenlijk niet wilt?**

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

❓ Nog niet vastgelegd in de code en dus open:
- Is er een **einddoel** (Premiership winnen? een X aantal seizoenen?) of is het eindeloos tot ontslag?
- **Monetisatie**: geen, of later iets? (bepaalt veel ontwerpkeuzes)
- Mag de CEO **ooit zelf onderhandelen** over een transfer? Nu doet de DoF dat automatisch (`recruit.js` negRound).
- Is **Engels-only** definitief, of komt er later lokalisatie (bijv. Nederlands)?

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
3. **3 actiepunten per week** — voor second opinions, gesprekken, pushes van een afdeling.
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
| Wereld & competitie | 8 divisies, 18 clubs, beker, rivalen die mee-evolueren | `engine.js` |
| Spelers | 14 attributen, CA/PA, leeftijd, contract, moraal, persoonlijkheid | `engine.js` |
| Wedstrijdsim | xG-gebaseerd, teamsterkte uit XI + coach-fit | `engine.js`, `matchtalk.js`, `matchday.js` |
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
| Presentatie | inkt-portretten, kantoorscène, geluid, Gazette, inbox-mappen | `faces.js`, `ui.js`, `style.css` |

## 7. Toon & stijl
- Droog, licht ironisch Brits voetbalproza ("Your name is sung. Occasionally in tune.").
- Interface in het Engels, maximaal twee zinnen per blok.
- Visueel: inkt-stijl procedurele portretten, krant-esthetiek (The Gazette), clubkleuren.

❓ Is deze toon wat je wilt vasthouden? Zijn er referenties (games, series, boeken) die het gevoel goed vangen?

## 8. Technische fundamenten (bindend)
- **Eén HTML-bestand.** `build.py` plakt `src/*.js` in vaste volgorde + `style.css` in `src/index.html` → `dist/index.html`.
- **Engine zonder DOM.** `engine.js` en de modules draaien in Node; uitbreiding via `FO.HOOK.*`.
- **Deterministisch.** Eigen seeded RNG (`G.rs`); zelfde seed + zelfde acties = zelfde uitkomst.
- **Saves blijven werken.** Nieuwe state via migratie (`VERSION`, nu 3) of een veilige default.
- **Release** = build → tests → `dist/index.html` naar `docs/index.html` → push naar `main` (GitHub Pages).

## 9. Huidige staat van de code (analyse 15-11-2026)

Werkt:
- Build slaagt (~1,0 MB). `docs/index.html` is gelijk aan een verse build.
- Tests `sim`, `matchday`, `gazette`, `sack`, `pathway`, `acad`, `rec`, `mig` draaien zonder fout.

Aandachtspunten:
1. **`test/audit.js` crasht** (`Cannot read properties of undefined (reading 'pts')`).
2. **Dubbele generaties naast elkaar:** `summer.js` + `summer2.js`, `academy.js`/`2`/`3`, `events.js` + `events2.js`,
   `recruit.js` + `recruitx.js`, en in `ui.js` o.a. `vClub`/`vClub2`, `vReview`/`vReview2`, `vRecruit`/`vRecruit2`.
   Onduidelijk welke versie leidend is en wat dood is.
3. **`ui.js` is 1.849 regels** in één blok; het is de grootste risicozone voor regressies.
4. **Veel meters tegelijk:** bestuursvertrouwen, 4 backers, grip, verborgen druk, credibility (pathway),
   DNA-alignment, actiepunten, plus KPI's per afdeling. Sterk voor P2, maar mogelijk in strijd met P4/P5.
5. Tab `money` bestaat in de render, maar staat niet in de tabbalk.

❓ Wil je dat we (2) en (4) als eerste ontwerpvragen oppakken voordat er nieuwe content bij komt?

## 10. Open vragen voor jou (samengevat)
1. Kloppen de zes pijlers? Wat voeg je toe of schrap je?
2. Einddoel of eindeloos?
3. Monetisatie: ja/nee/later?
4. Doelgroep: wie speelt dit, hoe lang per sessie, hoe vaak?
5. Mag de CEO ooit zelf onderhandelen of een speler aanwijzen — of is "nooit" heilig?
6. Taal: Engels-only definitief?
7. Hoeveel meters is te veel? Welke zijn kern, welke kunnen samen?
8. Welke van de dubbele generaties is leidend (zomer v1/v2, academie 1/2/3)?

---

## Besluitenlog

| # | Datum | Besluit | Reden |
|---|---|---|---|
| — | — | *(nog leeg — vullen we samen)* | — |
