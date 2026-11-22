# L3 — Staff, mandaten en autonomie
**Status:** IN PROGRESS (ontwerp vastgelegd 2026-11-22, gecorrigeerd door D-L3-2; slice S3.1 getest, S3.2–S3.6 gepland). Besluit eigenaar: **mandaten zijn een deel van L3** (D-L3-1).

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
| S3.2 | Rapport per window en hit rate; vertrouwen in de directeur | PLANNED |
| S3.3 | Sales- en Contracts-mandaat; voorstellen voor verlengen | PLANNED |
| S3.4 | Trainer: stijl en youth-minutes-mandaat | PLANNED |
| S3.5 | Scouts als personen; staf die vertrekt of wordt overgenomen | PLANNED |
| S3.6 | Validatie: gepaarde scenario's (krap v. ruim mandaat, 5 seizoenen), 10-seizoenen-gate, mobiel | PLANNED |

## State en migratie
`F(id).policy.mandate={deals}` (ontbreekt in oude saves = Large). `S.ops.missed` (alleen speler, max 12 bewaard). Geen verplichte schemaverhoging: veilige defaults bij laden (`opsAfterLoad`; een eerder opgeslagen `S.ops.proposals` wordt verwijderd).

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
