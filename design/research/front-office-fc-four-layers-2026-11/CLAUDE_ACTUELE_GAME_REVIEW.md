# Claude — CORRECTE ingang tot de actuele game en alle lagen

**Belangrijk:** De oude leeswijzer in deze chatgpt-onderzoeksmap was onvolledig en mocht niet worden gebruikt om de actuele spelversie te beoordelen. Begin bij de **werkelijke game op voorzitter-fundering**, niet bij de oudere chatgpt- of claude-game-build.

## Repository / bron
- Repository: Blauwev0gel/front-office-fc
- **Branch voor actuele game:** voorzitter-fundering
- Gecontroleerde head SHA: b8ae2efec93c2070992ed8a246917d463f5b3d41
- Speelbare zelfstandige game: standalone/front-office-fc/voorzitter-fundering/dist/artifact.html
- Broncode: standalone/front-office-fc/voorzitter-fundering/src/
- Tests: standalone/front-office-fc/voorzitter-fundering/tests/
- Ontwerp: standalone-research/

## Stap 1 — lees de actuele architectuur, volledig
1. standalone-research/LEESWIJZER-VOORZITTER.md
2. standalone-research/CONCEPT-VOORZITTER-2026-11-18.md, in het bijzonder de meest recente besluiten in §13 (80–82).
3. standalone-research/LAGENMODEL-VOORZITTER.md
4. standalone-research/LAGEN-INVENTARIS-VOORZITTER.md
5. standalone-research/ENGINE-VOORZITTER.md
6. standalone-research/LAAG1-CLUBBEHEER-VOORZITTER.md
7. standalone-research/LAAG2-FINANCIEN-VOORZITTER.md
8. standalone-research/LAAG3-MENSEN-VOORZITTER.md
9. standalone-research/LAAG4-VOETBAL-VOORZITTER.md
10. standalone-research/LAAG5-LEDEN-VOORZITTER.md
11. standalone-research/SPELLOOP-VOORZITTER.md
12. standalone-research/LOOP-DYNASTIE-VOORZITTER.md

## Stap 2 — bevestig uit de CODE wat echt werkt
Lees:
- src/club/ground.js en src/club/finance.js
- src/club/club.js, src/club/summer.js, src/club/td.js
- src/world/world.js en src/world/football.js
- src/chairman/flow.js en src/chairman/meeting.js
- src/ui/system.js
- tests/ground-test.js, foundation-test.js, mandate-causality-test.js, ui-season.js
- build.js, dist/artifact.html

**Dwing geen oude vierlagenstructuur op deze broncode.** Benoem afzonderlijk: (a) zeven speellagen, (b) drie engine-niveaus, (c) vijf tijdslagen, (d) vier product-/ontwikkelpijlers als grovere roadmap.

Bewijs dat een invoer een **werkelijk causaliteitseffect** heeft, niet alleen een groter getal in de UI. Voorbeeld van al aangetoond probleem: een medical level 8 gaf op vijf seeds injuryRisk 0,95 → 0,48, maar geen enkele verandering in blessure-events of punten.

Let op de mismatch: vier divisies (keuze 82) versus twee divisies in newWorld(). Controleer actuele SHA opnieuw; deze inventaris beschrijft de hier genoemde commit en veroudert zodra de branch verandert.

## Stap 3 — geef een kritische, onafhankelijke bevinding
Lever:
1. Een matrix voor **alle zeven** speellagen: ontwerp / code / verbonden / speelbaar / bewijs.
2. De werkelijke week-/seizoensloop van de actuele build in concrete spelershandelingen.
3. Een diagram in woorden van Player → Agents → Systems, plus de vijf tijdslagen.
4. Een volledige review van **Clubbeheer + Financiën** als het EERSTE zelfstandige clubsysteem. Ga uit van bestaande code, geen rewrite.
5. Ten minste 8 codegegronde P0/P1-gaten: oorzaak, zichtbare consequentie, concrete reparatie en reproduceerbare test.
6. Een afzonderlijk overzicht van toekomstige signalen naar Mensen, Voetbal, Leden, Wereld en Dynastie.
7. Een ontwikkelpad dat Clubmanagement op zichzelf leuk en volledig maakt alvorens andere macroproductpijlers te verdiepen.

**Niet nu bouwen:** de volledige people/board/family-engine of een geïntegreerde vierpijlerketen. Een functionele koppeling van een **bestaand** clubgebouw naar de **bestaande** voetbalengine is wel nodig voor goede zelfstandige clubgameplay.

## Stap 4 — omgang met oudere chatgpt-onderzoeken
Lees pas daarna, voor vergelijking, de documenten in:
- branch chatgpt
- design/research/front-office-fc-four-layers-2026-11/

Daar staat een oude v1/v2-blauwdruk die de zeven speellagen en de recentste code onvoldoende betrok. Zie in die map eerst ACTUELE_GAME_ENGINE_EN_SPELLAGEN_AUDIT.md. Noteer expliciet wat bruikbaar blijft en wat verouderd of feitelijk onjuist is.

**Geen onbewezen claims over code, geen algemene lof, geen GitHub-wijzigingen of PR's zonder nieuwe opdracht.**