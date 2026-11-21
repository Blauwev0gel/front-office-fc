# Hergebruikregister

Bewijsniveaus: [SOURCE-READ] [TESTED] [UI-PLAYED] [DESIGN-ONLY]. LG = `claude/loving-goodall-uv00vn@7a2d5d3`, VF = `voorzitter-fundering@b8ae2ef`.

| Onderdeel | Bron | Bewijs | Besluit | Aanpassing |
|---|---|---|---|---|
| Wereld: 32 clubs, 2×16, schema, stand, promotie/degradatie | LG `northmarch.html`, VF `world/world.js` | SOURCE-READ | REUSE | `str` vervangen door selectie-afgeleide sterkte (D1) |
| Wedstrijdmotor (Poisson, xPts) | VF `world/football.js` | SOURCE-READ | REUSE | sterkte voor elke club uit selectie |
| Seeded RNG en helpers | VF `core/rng.js` | SOURCE-READ | REUSE | — |
| Spelers, posities, contract, loon, waarde, XI, kwaliteit→sterkte | VF `club/players.js` | SOURCE-READ | ADAPT | per club i.p.v. alleen `S.cf` |
| Seizoensovergang spelers | VF `club/club.js` `clubSeasonEnd` | SOURCE-READ | ADAPT | groei uit training, instroom uit academie |
| Vrije spelers, TD, transferzomer, winterwindow | VF `club/market.js`, `td.js`, `summer.js` | TESTED (td-test, mandate-rules 20 seeds, mandate-causality 20/20) | REUSE | wordt standaarduitvoerder; transfers tussen AI-clubs ontbreken |
| Stadion, kavels, afdelingen, projecten, slijtage | VF `club/ground.js` | TESTED (ground-test) | REUSE | signalen moeten sport beïnvloeden |
| Weekgrootboek, prijzen, opkomst, prognose | VF `club/finance.js` | TESTED (ground-test) | ADAPT | standaardclub −£131k/seizoen; geen leningen/schuldschema |
| Ground- en Money-schermen | VF `ui/system.js` | SOURCE-READ | REUSE | — |
| Personen, geheugen, bureau, ALV, verkiezing | LG `northmarch.html`, VF `chairman/*` | SOURCE-READ, chairman-audit draait | KEEP (L4) | mutaties via commando's/Finance |
| Build tot één HTML | VF `build.js` | TESTED (30 modules, 352 KB) | REUSE | — |
| Teamsterkte uit XI/staf/moraal | `claude-game` `engine/05-world-selection.js` | SOURCE-READ | REFERENCE | ook daar alleen eigen club |

Bekend rood vóór wijzigingen: VF `tests/opening-test.js` ("opening past in 3–5 minuten").
