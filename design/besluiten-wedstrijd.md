# Besluiten wedstrijd

Werklijst bij `design/analyse-wedstrijd.md`. Besloten door de eigenaar op 16-11-2026.

| Id | Besluit | Status |
|---|---|---|
| W1 | Weergave: hetzelfde veld, levendiger (stippen schuiven mee, een echt goalmoment), ±40 s. | getest |
| W2 | De CEO bij rust: soms de keuze om de kleedkamer in te gaan of de coach te laten; af en toe een gast in de bestuurskamer. Nooit opstelling, wissels of tactiek (B1). | getest (gast: zie hieronder) |
| W3 | Engine: één gekalibreerd niveau voor goals en uitslagen, en coachschuifjes met een echte prijs (sluit D4/D12 uit ronde 4). | getest |
| W4 | Een korte "why" bij full time uit de echte factoren. | getest |
| W5 | Sfeer per wedstrijd: avond of middag, regen, tribunevulling; licht doorwerkend. | getest |
| W6 | Animatie aan, geluid uit tot je het aanzet; reduced motion: alleen tekst en stand. | getest |

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

## Ronde B — wat je ziet (16-11-2026)
- **Tempo:** de wedstrijd duurt ±46 seconden op normale snelheid (was 63), met wissels en gele kaarten korter in beeld; 2× sneller en overslaan blijven.
- **Weer en avond vooraf:** het weer is een vaste functie van seizoen, week en tegenstander (`wxFor`), dus de preview kan het aankondigen ("Evening kick-off, rain forecast. Expected crowd 45% of capacity."). De stadionkop toont avond, regen en een tribune zo vol als de verwachte opkomst; het veld toont regen en avondlicht.
- **Keuze bij rust** (`weekflow.js` `htOffer`, `htChoice`): bij een achterstand, een big game of soms bij gelijkspel ("Go into the dressing room? It is about the players, not the tactics."). Naar binnen: moraal +3, de coach voelt zich gepasseerd (−2, of −5 bij een groot ego). Laten: de coach +2. De uitslag staat al vast; de keuze gaat over mensen (B1). Gemeten: in ±de helft van de wedstrijden.
- **Gast in de bestuurskamer:** niet apart gebouwd; de sponsor in de box zit al in de keuze vóór big games (B23). Open voor later.
- **Why bij full time:** 2–3 regels uit `whyLines` (altijd minstens één, op basis van de kansenverhouding). Na een nederlaag heet het "Our best player" in plaats van "Player of the match".
- **Minder herhaling:** meerdere "quiet days" in de verhalen worden één regel.
- **Animatie:** de veldanimatie gebruikt een eigen seeded generator in plaats van `Math.random` (CLAUDE.md). Geluid blijft uit tot je het aanzet; reduced motion: geen regenanimatie, korte stappen.
- **Gerepareerd:** de rondleidingstekst sprak nog over actiepunten.
- Getest: build, syntaxcheck, de pagina geladen, alle `node test/*.js`, vijf volledige wedstrijden in de browser op 390 px (licht en donker), waarvan één met de keuze bij rust.
