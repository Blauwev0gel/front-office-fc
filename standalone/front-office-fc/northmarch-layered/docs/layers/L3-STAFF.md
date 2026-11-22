# L3 — Staff, mandaten en autonomie
**Status:** IN PROGRESS (ontwerp vastgelegd 2026-11-22; slice S3.1 getest, S3.2–S3.6 gepland). Besluit eigenaar: **mandaten zijn een deel van L3** (D-L3-1).

## Doel
Nu zijn de directeur (TD) en de trainer één cijfer plus een specialiteit, en doen ze alles binnen het kader dat de voorzitter via beleid zet. L3 maakt van hen mensen die **zelf beslissen binnen een mandaat** en **zelf iets voorstellen als het buiten dat mandaat valt**. De voorzitter kiest nog steeds nooit spelers of opstellingen; hij bepaalt hoeveel vrijheid de staf krijgt en beoordeelt wat ze ermee doen.

## Spelkern (één regel)
**Mandaat = hoeveel de staf zelf mag beslissen.** Een ruim mandaat betekent geen onderbrekingen maar ook geen controle; een krap mandaat betekent dat de beste kansen bij jou langskomen als voorstel (goedkeuren of afwijzen), en dat kost soms de kans. Welke staf je kiest bepaalt hoe goed en hoe gewaagd ze met die vrijheid omgaan.

## Wat L3 wel en niet is
- **Wel:** mandaten (omvang van transfers, verkoop, verlengingen, jeugd), voorstellen van de directeur boven zijn mandaat, verantwoording (rapport na elk window), stafmensen die zich gedragen volgens hun profiel, scouts als personen, weggaan/overgenomen worden van staf.
- **Niet:** gesprekken met een boek aan keuzes, verhalen en conflicten (L4), meerjarige dynastie (L5). Geen verplichte beslissingen: een voorstel dat je negeert vervalt aan het eind van het window, de club draait door.
- **Geen micromanagement:** je ziet maximaal drie voorstellen per window, alleen als ze boven het mandaat vallen.

## Ontwerp
### Mandaten (alleen de speler; AI-clubs behouden hun regels)
| Mandaat | Niveaus | Wat het regelt |
|---|---|---|
| Deals (transfers) | Small · Medium · Large | Maximale koopsom per speler als aandeel van het transferbudget (40% · 75% · 100%). Duurdere deals komen als voorstel. |
| Sales (verkoop) | Surplus only · Anyone but core · Anyone | Wie de directeur zelf mag verkopen. *(slice S3.3)* |
| Contracts (verlengen) | Within frame · Ask for key players | Verlengingen van basisspelers eerst bij jou. *(slice S3.3)* |
| Coach: youth minutes | Merit · Some chances · Many chances | Speeltijd voor jonge spelers (geen opstelling). *(slice S3.4)* |
Standaard voor een nieuwe club: Deals Medium. Een oude save zonder mandaat behoudt het huidige gedrag (Large).

### Voorstellen van de directeur
- Op het moment dat het window opent (pre-season, week 14) zoekt de directeur zonder te tekenen de beste kandidaat voor zijn belangrijkste behoeften. Valt de koopsom boven het mandaat, dan wordt het een voorstel: speler, positie, leeftijd, inschatting (± marge uit de scouting), koopsom, loon, reden (de behoefte).
- Jij keurt goed of wijst af voordat het window sluit. Goedgekeurde voorstellen worden bij het sluiten van het window uitgevoerd (als de speler nog te koop is en het geld er nog is); onbeantwoorde vervallen.
- Alles loopt via `cmd()` met actor `player` (goedkeuren/afwijzen) en `td` (uitvoeren), dus de bestaande klok, events, saves en het besluitenlog.

### Staf als mensen (volgende slices)
- Directeur en trainer: bestaand profiel (kwaliteit, specialiteit) krijgt een **stijl** (gewaagd/voorzichtig) die bepaalt hoe vaak en hoe groot hij voorstellen doet, en een **tevredenheid** (ruim mandaat en vertrouwen → blijft; geketend → vertrekt of wordt weggekocht).
- Scouts: individuele scouts (oordeel, focus op divisie of transfervrij) vervangen de afdelingsruis (`scoutNoise`); `S.ops.shortlist` blijft de bron.
- Verantwoording: rapport per window (wat gedaan, binnen of buiten mandaat, hit rate van aankopen: schatting toen v. kwaliteit nu).

## Slices en volgorde
| Slice | Inhoud | Status |
|---|---|---|
| S3.1 | Deals-mandaat + voorstellen van de directeur + goedkeuren/afwijzen + uitvoeren bij sluiten van het window + test | TESTED |
| S3.2 | Rapport per window en hit rate; vertrouwen in de directeur | PLANNED |
| S3.3 | Sales- en Contracts-mandaat; voorstellen voor verlengen | PLANNED |
| S3.4 | Trainer: stijl en youth-minutes-mandaat | PLANNED |
| S3.5 | Scouts als personen; staf die vertrekt of wordt overgenomen | PLANNED |
| S3.6 | Validatie: gepaarde scenario's (krap v. ruim mandaat, 5 seizoenen), 10-seizoenen-gate, mobiel | PLANNED |

## State en migratie
`F(id).policy.mandate={deals}` (ontbreekt in oude saves = Large). `S.ops.proposals` (alleen speler, max 12 bewaard). Geen verplichte schemaverhoging: veilige defaults bij laden (`opsAfterLoad`).

## Acceptatie
- Bij Small mandaat verschijnen voorstellen voor deals boven de grens; bij Large geen.
- Goedkeuren voert de aankoop uit; afwijzen doet niets; niet beantwoorden laat het voorstel vervallen.
- Elk voorstel en elke uitvoering is zichtbaar (Week, Club → Football, besluitenlog); niets wordt verzonnen.
- Fast suite en 20-seizoenensim blijven groen; oude saves laden.

## Bevindingen slice S3.1 (gemeten, 4 gepaarde werelden × 5 seizoenen, onbeantwoorde voorstellen)
- **Eerste opzet (Small 25% · Medium 50%) draaide een gekozen koers om:** met Medium als standaard was de ervaringsploeg 1,9 jaar *jonger* dan de jeugdploeg (eerder 2,3 jaar ouder). Jonge spelers zijn duurder en vielen vaker boven de dealgrens. Een onbeantwoord mandaat mag een koers niet ondermijnen. Daarom 40% · 75% · 100%: jeugd v. ervaring geeft weer +1,7 ± 0,7 jaar leeftijdsverschil.
- **Krap mandaat, nooit beantwoord (Small v. Large):** €0,57M minder transferuitgaven, £3,75k per week lagere loonrekening, sterkte −2,2 ± 4,2 en punten −0,3 ± 0,6 (niet te onderscheiden van ruis). Een krap mandaat kost dus vooral kansen die er nog niet meetbaar toe doen; dat past bij de bekende beperking dat geld weinig koopt op het veld.
- Voorstellen verschijnen alleen als de beste kandidaat boven de grens valt; de directeur kiest zelf binnen de grens.

## Beperkingen
- Alleen het Deals-mandaat bestaat; Sales, Contracts en de trainer volgen (S3.3, S3.4).
- De directeur heeft nog geen stijl of tevredenheid: een krap mandaat heeft geen gevolgen voor zijn blijven (S3.5).
