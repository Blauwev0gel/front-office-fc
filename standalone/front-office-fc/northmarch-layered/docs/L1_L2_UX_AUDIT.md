# L1/L2 UX Completion — eerste broncode-audit

Status: **in uitvoering; geen UX-release**. Scope: alleen L1 en L2. Branch: `claude/loving-goodall-uv00vn`.

## Vastgestelde architectuur
- Eén savebare wereldstate `S`, acties via `cmd(name,clubId,args,actor)`, week via `advanceWeek()`.
- UI gebruikt vijf tabs: Week, Tables, Squad, Club, Money.
- Layer index noemt L1 gevalideerd en L2 speelbaar maar pakket 6 (validatie) nog open.
- `src/ui/act.js` koppelt de UI-acties aan bestaande commando's; broncode wordt via `build.js` samengevoegd tot één HTML.

## Bevindingen op basis van gelezen code (nog niet browser-getest)

| Gebied | Vindplaats | Bevinding | Prioriteit |
|---|---|---|---|
| Weekflow | Week | `reportView + signalsPanel + previewView + targetsPanel + hubCards` op één pagina; `play` roept meteen `advanceWeek()` aan. Geen aparte match-/weekafsluitingsnavigatie. | P1 |
| Selectiebeleid | Squad en Money > Budget | Squad verwijst door naar Money voor loonlimiet en transferkader; de actie is functioneel maar verdeeld over twee plekken. | P1 |
| Trainer/TD | Club > staff overlay | Kandidaten tonen geschatte sterren, specialisme, salaris, contract en kosten; geen expliciete vergelijking met huidige medewerker. | P1 |
| Afdelingen | Club > department overlay | KPI, personeelsniveau, budget, werkwijze en faciliteiten zijn beschikbaar; alternatieven tonen kosten maar niet integraal de gevolgen voor kasprognose en verwacht afdelingsresultaat. | P0 |
| Sponsoring | Money > Sponsors | Aanbiedingen tonen betaling, duur en kwalitatief risico; geen volledige vergelijkende kasprojectie. | P1 |
| Leden | Club > Members; Week > targets | Vertrouwen en stemprognose zijn zichtbaar, maar ledenbeheer en bestuurlijk risico zijn gescheiden. | P1 |
| Projecten | Club > Ground | Kosten en doorlooptijden bestaan; effect en risico zijn niet altijd als één investeringsbesluit gepresenteerd. | P1 |
| Historie | Club history en Tables > History | Twee verschillende routes met verschillende perspectieven; labels moeten explicieter. | P2 |

## Verplichte ontwerpregels
1. Behoud alle bestaande L1/L2-commando's en functies.
2. Geen nieuwe L3–L5-systemen.
3. Iedere strategische beslissing toont huidige situatie, kosten, tijdshorizon, risico en verwachte richting van gevolgen, voor zover betrouwbaar uit de echte spelstate afleidbaar.
4. Geen verzonnen effectvoorspellingen of schijncausaliteit.
5. Geen releaseclaim zonder echte build, regressietests, browsercontrole en meerjarige speeltest.

## Eerstvolgende implementatievolgorde
1. Volledige actie- en scherminventaris afronden (inclusief `src/ui/club.js`, `src/ui/ground`-gerelateerde schermen en alle subviews).
2. Eén consistente besliscontext voor afdelingen, personeel en financiën ontwerpen, gevoed door bestaande enginefuncties.
3. Club-overzicht en kruisnavigatie verbeteren zonder functies te verbergen.
4. Weekflow en consequentiefeedback verbeteren.
5. Build, tests, mobiel browseronderzoek en meerjarige playtests uitvoeren.

## Bewijsstatus
Dit document is een **eerste code-audit**, geen bewijs van functionele of UX-voltooiing. Er zijn in deze stap geen tests of browserplaytests uitgevoerd.
