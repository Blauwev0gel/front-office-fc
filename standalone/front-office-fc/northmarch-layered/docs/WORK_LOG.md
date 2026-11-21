# Werklog

## 2026-11-21 — Fase 0 / Poort A laag 1
- LG-branch gecontroleerd: nog op `7a2d5d3`. Documenten in `design/northmarch-rebuild/` gelezen.
- VF gebouwd en getest: alles groen behalve `opening-test`.
- Bevinding: VF bevat 109 van de 122 Northmarch-functies (weekritme i.p.v. blokken).
- Vijf gaten: geen levende wereld; faciliteitsignalen zonder sporteffect; geen klok/commando's/events; economie sluit niet (−£131k); geen saveversies of langetermijntests.
- Besluiten D1, D2 vastgelegd. Volgende: ontwerpvraag 2 (competitiestructuur).

## 2026-11-21 — Laag 1 gebouwd en gevalideerd (M1)
- Nieuwe modulaire bron `src/` + `build.js` → `dist/northmarch-layered.html`.
- Engine: wereld van 48 clubs (3×16 + beker), selectie/stadion/grootboek per club, één klok, events, commando's, saves v1.
- Balans in drie rondes gevonden met de 20-seizoenstest: ineenstorting door looninflatie (T1), kwaliteitsinflatie
  door gratis instroom (T2), lek in noodaankopen (T3). Medisch effect versterkt (T4). Fout gevonden: eventlog-inkorting
  brak indexmarkeringen → volgnummers op events.
- UI in Northmarch-huisstijl: Week (Echo-verslag, voorbeschouwing met kansen), Tables (3 divisies + beker, club inspecteren),
  Squad (kader voor de directeur, spelers), Club (Ground, Money, vergelijking, historie, lagen).
- Browserfouten gevonden en hersteld: clubnaam verticaal (CSS-klasse-botsing `.grow`), teamnamen braken midden in een woord.
- **Volgende:** L2-ontwerpvragen (max. 3), daarna L2 verdiepen; daarna L3 (TD als agent op dezelfde commando's).

## 2026-11-21 — L2-ontwerpvragen
- D5 (alleen kader) en D6 (ledenvertrouwen + jaarlijkse ALV) vastgelegd. Nog maximaal één L2-vraag open.
- **Volgende:** L2-vraag 3, daarna L2 specificeren en bouwen (ledenvertrouwen/ALV, seizoensdoelen, verdieping clubschermen).
