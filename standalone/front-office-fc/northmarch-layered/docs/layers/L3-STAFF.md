# L3 — Staff, mandaten en autonomie
**Status:** IN PROGRESS (ontwerp vastgelegd 2026-11-22, gecorrigeerd door D-L3-2; S3.1 en S3.2 optionele modules, engine-regressie op f40b092 groen; mobiele browserrevalidatie open; S3.3–S3.6 uitgesteld tot Basisspel V1). Besluit eigenaar: **mandaten zijn een deel van L3** (D-L3-1). Aangevuld op 2026-11-25 door D-L3-2b (twee escalaties) en D-G6 (speelbare transfermarkt).

## Doel
Nu zijn de directeur (TD) en de trainer één cijfer plus een specialiteit, en doen ze alles binnen het kader dat de voorzitter via beleid zet. L3 maakt van hen mensen die **zelf beslissen binnen een mandaat** en **zelf iets voorstellen als het buiten dat mandaat valt**. De voorzitter kiest nog steeds nooit spelers of opstellingen; hij bepaalt hoeveel vrijheid de staf krijgt en beoordeelt wat ze ermee doen.

## Spelkern (één regel)
**Mandaat = hoeveel de staf zelf mag beslissen, en niets daarbuiten.** De voorzitter keurt **nooit een individuele transfer, opstelling of verlenging goed** (besluit D-L3-2). Binnen het mandaat beslist de directeur alles zelf; daarbuiten doet hij niets. Jij ziet achteraf wat je grens liet liggen en bepaalt of je hem verruimt. Het mandaat is dus een beleidskeuze: ruim = geen controle maar ook geen rem, krap = veiliger en goedkoper maar kansen blijven liggen. Welke staf je kiest bepaalt hoe goed hij met die vrijheid omgaat.

## Wat L3 wel en niet is
- **Wel:** mandaten (omvang van transfers, verkoop, verlengingen, jeugd), rapportage over wat de grens liet liggen, verantwoording (rapport na elk window), stafmensen met een eigen profiel, scouts als personen, weggaan/overgenomen worden van staf.
- **Niet:** goedkeuren of afwijzen van losse spelers, gesprekken met een boek aan keuzes, verhalen en conflicten (L4), meerjarige dynastie (L5). Geen verplichte beslissingen: de club draait door zonder dat jij iets doet.
- **Geen micromanagement:** de enige knop is het niveau van het mandaat.

## Ontwerp
### Mandaten (alleen de speler; AI-clubs behouden hun regels)
| Mandaat | Niveaus | Wat het regelt |
|---|---|---|
| Deals (transfers) | Small · Medium · Large | Maximale koopsom per speler als aandeel van het transferbudget (40% · 75% · 100%). Duurdere deals laat de directeur liggen. |
| Sales (verkoop) | Surplus only · Anyone but core · Anyone | Wie de directeur zelf mag verkopen. *(slice S3.3)* |
| Contracts (verlengen) | Within frame · Key players too | Verlengen van basisspelers binnen het loonkader. *(slice S3.3)* |
| Coach: youth minutes | Merit · Some chances · Many chances | Speeltijd voor jonge spelers (geen opstelling). *(slice S3.4)* |
Standaard voor een nieuwe club: Deals Medium. Een oude save zonder mandaat behoudt het huidige gedrag (Large).

### Wat de directeur laat liggen (rapportage, geen goedkeuring)
- Op het moment dat het window opent (pre-season, week 14) zoekt de directeur zonder te tekenen de beste kandidaat voor zijn belangrijkste behoeften. Valt de koopsom boven het mandaat, dan wordt dat genoteerd (`S.ops.missed`): speler, positie, leeftijd, koopsom, zijn inschatting (± marge uit de scouting) en de behoefte.
- Je ziet dit als informatie ("Above your limit") met één knop om zijn grens te verruimen. Na het window staat het als "Left alone last window". Er is niets te beantwoorden en niets dat vervalt.
- De directeur tekent zelf alles binnen de grens, via de bestaande `squadManager`/`shopFor`.

### Staf als mensen (volgende slices)
- Directeur en trainer: bestaand profiel (kwaliteit, specialiteit) krijgt een **stijl** (gewaagd/voorzichtig) die bepaalt hoe vaak en hoe groot hij voorstellen doet, en een **tevredenheid** (ruim mandaat en vertrouwen → blijft; geketend → vertrekt of wordt weggekocht).
- Scouts: individuele scouts (oordeel, focus op divisie of transfervrij) vervangen de afdelingsruis (`scoutNoise`); `S.ops.shortlist` blijft de bron.
- Verantwoording: rapport per window (wat gedaan, binnen of buiten mandaat, hit rate van aankopen: schatting toen v. kwaliteit nu).

## Slices en volgorde
| Slice | Inhoud | Status |
|---|---|---|
| S3.1 | Deals-mandaat + rapportage over wat de grens liet liggen + test | TESTED |
| S3.2 | Windowverslag, retrospectieve aankoopbeoordeling, op echte optredens gebaseerde betrouwbaarheid per directeur; regressietest toegevoegd | CI ENGINE PASS / BROWSER OPEN |
| S3.3 | Sales- en Contracts-mandaat; voorstellen voor verlengen | PLANNED |
| S3.4 | Trainer: stijl en youth-minutes-mandaat | PLANNED |
| S3.5 | Scouts als personen; staf die vertrekt of wordt overgenomen | PLANNED |
| S3.6 | Validatie: gepaarde scenario's (krap v. ruim mandaat, 5 seizoenen), 10-seizoenen-gate, mobiel | PLANNED |

## State en migratie
`F(id).policy.mandate={deals}` (ontbreekt in oude saves = Large). `S.ops.missed` (alleen speler, max 12 bewaard). Geen verplichte schemaverhoging: veilige defaults bij laden via optionele `onFeature('saveLoaded')`; een eerder opgeslagen `S.ops.proposals` wordt verwijderd.

## Acceptatie
- Bij Small mandaat noteert de directeur wat boven de grens valt; bij Large niets.
- De directeur tekent nooit boven de grens; er bestaat geen commando om een individuele transfer goed te keuren.
- Wat hij laat liggen is zichtbaar (Week, Club → Football) en het wijzigen van de grens staat in het besluitenlog; niets wordt verzonnen.
- Fast suite en 20-seizoenensim blijven groen; oude saves laden.

## Bevindingen slice S3.1 (gemeten, 4 gepaarde werelden × 5 seizoenen)
- **Eerste opzet (Small 25% · Medium 50%) draaide een gekozen koers om:** met Medium als standaard was de ervaringsploeg 1,9 jaar *jonger* dan de jeugdploeg (eerder 2,3 jaar ouder). Jonge spelers zijn duurder en vielen vaker boven de dealgrens. Een onbeantwoord mandaat mag een koers niet ondermijnen. Daarom 40% · 75% · 100%: jeugd v. ervaring geeft weer +1,7 ± 0,7 jaar leeftijdsverschil.
- **Krap mandaat, nooit beantwoord (Small v. Large):** €0,57M minder transferuitgaven, £3,75k per week lagere loonrekening, sterkte −2,2 ± 4,2 en punten −0,3 ± 0,6 (niet te onderscheiden van ruis). Een krap mandaat kost dus vooral kansen die er nog niet meetbaar toe doen; dat past bij de bekende beperking dat geld weinig koopt op het veld.
- De directeur kiest zelf binnen de grens; boven de grens laat hij liggen.
- **Ontwerpfout, hersteld:** de eerste versie liet de voorzitter losse spelers goedkeuren (voorstellen). Dat is individueel transfermanagement en botst met de rol van voorzitter en met het Slimline-contract. Vervangen door rapportage.

## Beperkingen
- Alleen het Deals-mandaat bestaat; Sales, Contracts en de trainer volgen (S3.3, S3.4).
- De directeur heeft nog geen stijl of tevredenheid: een krap mandaat heeft geen gevolgen voor zijn blijven (S3.5).

## S3.2 — windowverantwoording en onderbouwd vertrouwen (ChatGPT, PR #6)

**Modulegrens:** `src/layers/autonomy/director-accountability.js` (engine) en `src/layers/autonomy/director-accountability-ui.js` (weergave). De gameklok verspreidt alleen het generieke `weekClosed`-event; `club/recruitment.js` verspreidt `transferWindowClosed`. De optionele module registreert zich via `core/layers.js`. Een ontbrekende module wordt door de basissimulatie genegeerd; controle via `tests/layer-isolation-test.js`. Zie `docs/LAYER_CONTRACT.md`.

**S3.1-modulegrens (nieuw):** `src/layers/autonomy/director-deals.js` en `director-deals-ui.js` dragen de mandaatlogica, UI en command. De normale `node build.js` sluit beide uit. `NORTHMARCH_BUILD_MODE=autonomy node build.js` is een expliciete ontwikkelmodus. **Niet claimen dat L3 productmatig voltooid is:** vóór nieuwe autonomieslices moet Basisspel V1 zelf aantoonbaar speelbaar én leuk zijn.

- `tdClose()` bewaart een begrensd vensterverslag in `S.ops.reports` (maximaal acht vensters): echte aankopen, gemiste kandidaten en geregistreerde transfergebeurtenissen. De verantwoordelijke directeur wordt via persoon-ID vastgelegd.
- `directorSigningApps()` leest cluboptredens uit de actuele spelersstatistieken én historische clubstints: een seizoenswissel wist bewijs niet. Optredens bij de vorige club of op huurbasis tellen niet voor het huidige aankoopresultaat.
- Een aankoop met minder dan acht optredens na een volledig seizoen krijgt zichtbaar *Limited involvement*. Dat is een aparte waarschuwing, geen verzonnen oordeel in de scouting-hit-rate.
- `directorAuditWeek()` bevriest de evaluatie nadat een aankoop acht cluboptredens heeft gemaakt. Oordeel: de werkelijke spelerskwaliteit op het moment van tekenen lag ten minste binnen één punt van de oorspronkelijke scoutinginschatting, of niet. Later doorgroeien of vertrekken verandert dat oordeel niet achteraf.
- `directorTrust()` berekent de betrouwbaarheid per **feitelijke directeur** uit beoordeelde aankopen. Onder drie beoordeelde aankopen: *te vroeg om te oordelen*. Geen verzonnen score op basis van een transferwindow of één uitslag. Nieuwe directeur krijgt geen automatisch geërfde reputatie.
- Club → Football toont de historische vensters en betrouwbaarheid naast de bestaande mandaatkeuzes. Dit is **informatieve verantwoording**: het mandaat, de stafbaan en wedstrijden worden niet automatisch door deze score gewijzigd; vergaande stafautonomie en tevredenheid blijven S3.5.
- `tests/l3-s32-test.js` test vensters, bewijsdrempel, identiteitswisseling, seizoensreset en save/load; opgenomen in `tests/run-fast.sh`.

**Grenzen en controlepunten:** De metriek meet scoutingbetrouwbaarheid bij daadwerkelijk gebruikte spelers, niet direct winstpunten, transferwinst of het totale niveau van de technisch directeur. Spelers met te weinig optredens blijven zonder oordeel. Werkelijke end-to-end browserreview is niet uitgevoerd. CI en testuitslag moeten op de PR vastgelegd worden voordat S3.2 als getest geldt.

## Besproken en besloten, 24–25 november (D-G1, D-L3-2b, D-G6)
- **Autonomie is het antwoord op het goedkeuringsprobleem** (D-G1): de staf beslist binnen zijn bevoegdheid; de voorzitter krijgt alleen escalaties en verantwoording.
- **Twee escalaties** (D-L3-2b): een bod op een van de drie beste spelers (accepteren · meer vragen · niet te koop) en een aankoop boven het clubrecord. Computerclubs kunnen je top-3 niet kopen zonder jou.
- **De transfermarkt is een verhaal over weken** (D-G6), met de directeur als persoon die verantwoording aflegt:
  1. zomervergadering (selectie, geld, behoeften; de directeur doet een voorstel naar zijn eigen neiging);
  2. zomerbrief met maximaal drie doelen, getekend;
  3. ticker per pre-season-week (bod, tegenbod, akkoord, kaping, geruchten, deals van rivalen; ook zonder budget gebeurt er iets);
  4. deadline day;
  5. zomereditie van de krant;
  6. debrief na week 4 waarin de directeur wordt afgerekend op de brief;
  7. winterstop op dezelfde machinerie, korter.
- **Gebouwd in M1 (2026-11-25, `club/window.js`):** zomervergadering (selectie per linie, geld, behoeften, voorstel naar de stijl van de directeur: bold/steady/careful uit zijn eigenschappen), zomerbrief (max. 3 doelen uit: een positie tekenen, top-3 houden, ≤23 jaar, £X uit verkoop, uitgaveplafond; budgetniveau Cautious/Normal/All-in; profiel), ticker per pre-season-week met dagen (eigen biedingen, tegenbod, kaping, verkopen, echte deals van rivalen doordat 20% van de clubs per week shopt), deadline day, zomereditie van de Echo, debrief in week 4 met namen per doel en de keuze steunen/waarschuwen (loyaliteit van de directeur; twee waarschuwingen = vervangen kan). Zonder budget meldt de directeur dat en verkoopt hij een overbodige speler. Winterstop nog niet (M4).
- **De week van de voorzitter** (D-S1) raakt L3: aanbevolen spelers komen op de shortlist van de directeur met extra gewicht; hij beslist en zegt waarom niet.

## Gebouwd: de winterstop (M4, 2026-11-25)
- Dezelfde machinerie als de zomer (`club/window.js` kiest zelf zomer of winter op basis van de week; `S.win` naast `S.pre`): wintervergadering in week 12–13 met **één doel** en een budgetniveau; wie niet tekent, krijgt het eigen plan van de directeur. Window-week 14 en deadline day 15 spelen zich af ná de wedstrijden, met dezelfde ticker, kapingen, verkopen, rivalen (15% van de clubs per week) en escalaties. Wintereditie van de Echo in week 16–18; debrief in week 19.
- De oude winterronde van alle clubs in week 15 draait nog en vult noodgaten.

## Analyse en verbetering van de transferzomer (2026-11-25)
**Analyse (6 werelden, vóór):** de voorzitter had tijdens de markt bijna niets te doen (0,7 beslissing per zomer); geen alternatieven of kwaliteitsvergelijking zichtbaar; 46% van de aankopen speelde na 10 weken nog geen minuut (5 van 13 in de basis); briefdoelen 89% gehaald; geen verkoopkant behalve noodverkoop; directeur zonder onderhandelingskarakter; deadline day alleen een hogere kans; geen voetbal in de pre-season.

**Verbeteringen:**
- **Targetsbord:** per behoefte drie kandidaten met een profiel (*Ready now*, *For the future* met geschat plafond, *Bargain*), schatting ± twijfel, vraagprijs, loon en wat hij betekent ("would start" tegenover de zwakste basisspeler). Mislukt een deal, dan zichtbaar **Plan B**. De voorzitter kan één kandidaat **"Rate him"** geven (aanbeveling, D-S1). De brief bepaalt welk profiel eerst gaat (jong → toekomst; plafond/verkoop → koopje).
- **Onderhandelingsstijl:** bold opent op 95% en verhoogt 20% tot drie keer; steady 85%/15%/twee keer; careful 78%/10%/één keer. Een waarschuwing in de debrief maakt hem voorzichtig; steun maakt een ambitieuze directeur gedurfd.
- **Strengere doelen:** "Sign a starting …" is pas gehaald als de nieuwe speler beter is dan de zwakste basisspeler op die plek bij het tekenen van de brief; het verkoopdoel is een serieus bedrag.
- **Transferlijst:** de voorzitter stelt spelers beschikbaar (niet de top-3); de directeur verkoopt bij een bod van minstens 85% van de waarde. Interesse van andere clubs verschijnt met een knop "Make him available".
- **Geldpaneel:** uitgegeven, opgehaald, over, loonruimte; extra kas vrijmaken; op deadline day **deadline money** (een lening van 15% van het seizoensinkomen).
- **Deadline day** in drie rondes (09:00, 15:00, 22:00).
- **Oefenwedstrijden** in de ticker, waarin nieuwe spelers zich laten zien.

**Gemeten (zelfde 6 werelden, ná):** 9 van 12 aankopen in de basis en geen enkele zonder minuten (zonder steun voor jongeren); 67% van de doelen gehaald; ongeveer 3,7 beslissingen per zomer; Plan B 10–12 keer; 7–9 verkopen via de lijst. Kandidaten per profiel: 16 nu, 13 toekomst, 14 koopje.
**Open (balans):** de directeur kiest standaard vaak 32–33-jarigen (oud is goedkoop en goed); dat hoort ChatGPT te wegen tegen de bedoeling (talent en doorverkoop).
