# Besluiten wedstrijd

Werklijst bij `design/analyse-wedstrijd.md`. Besloten door de eigenaar op 16-11-2026.

| Id | Besluit | Status |
|---|---|---|
| W1 | Weergave: hetzelfde veld, levendiger (stippen schuiven mee, een echt goalmoment), ±40 s. | open |
| W2 | De CEO bij rust: soms de keuze om de kleedkamer in te gaan of de coach te laten; af en toe een gast in de bestuurskamer. Nooit opstelling, wissels of tactiek (B1). | open |
| W3 | Engine: één gekalibreerd niveau voor goals en uitslagen, en coachschuifjes met een echte prijs (sluit D4/D12 uit ronde 4). | getest |
| W4 | Een korte "why" bij full time uit de echte factoren. | engine getest, UI open |
| W5 | Sfeer per wedstrijd: avond of middag, regen, tribunevulling; licht doorwerkend. | engine getest, UI open |
| W6 | Animatie aan, geluid uit tot je het aanzet; reduced motion: alleen tekst en stand. | open |

## Ronde A — engine (16-11-2026)
- **Kalibratie** (`engine/06-match.js`): 27 kansen × volume in plaats van 22,5; rode kaart 6,5% per kaart.
  Gemeten (16 runs × 3 seizoenen): 2,75 goals per wedstrijd (rest wereld 2,74), 0-0 8,3%, 1-0 en 0-1 samen 17%, gelijkspel 25%, thuiswinst 55%, verrassingen 20%, rode kaarten 0,11, goals na de 85e 11%.
- **Coachschuifjes met een prijs** (20 runs × 2 seizoenen, coach volgt volledig):

| Schuifje | Effect |
|---|---|
| Aanvallend ↔ verdedigend | Meer kansen voor beide ploegen. Helpt de favoriet (2,14 → 2,21 punten per wedstrijd), kost de underdog (0,80 → 0,74), goals 2,6 → 3,5. Verdedigend beschermt een underdog. |
| Jeugd | Een U21-speler telt voor 95% (onervarenheid) en groeit sneller door minuten. Jeugd 90 tegenover 10: −0,04 punten per wedstrijd, +0,2 CA voor de U21-spelers na een seizoen. |
| Rotatie | Een vaste elf heeft ritme (+0,06), rotatie geeft minder blessures (×1,2 → ×0,8). Vast 10 tegenover 90: 1,84 tegenover 1,76 punten, 4,2 tegenover 3,5 blessures per seizoen. |
| Intensiteit | Iets fitter (+0,05 × afwijking), meer ontwikkeling, meer blessures. 10 tegenover 90: gelijke punten (1,77), U21 CA 6,38 tegenover 6,49, blessures 2,4 tegenover 4,5. |

- **Sfeer:** 25% regen (iets minder en slechtere kansen), 30% avond (alleen beeld); tribunevulling telde al in het thuisvoordeel (`commercial.js` `homeEdge`) en gaat nu mee in het resultaat (`fill`).
- **Why:** `whyLines()` levert 2–3 regels uit afwerking tegenover xG, tegengoals tegenover xG, kwaliteit, rode kaarten, vol stadion, moraal, jeugd en aanvallend spel.
- **Bugs:** xG in de Gazette volgt nu de volgorde van de uitslag; een blessure valt in een minuut waarin de speler echt op het veld stond.
- Getest: build, syntaxcheck, alle `node test/*.js` (incl. `mig.js`, `matchday.js`, `gazette.js`).
