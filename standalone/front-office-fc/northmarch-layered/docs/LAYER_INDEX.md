# Lagenindex

De lagen zijn de bouwvolgorde én de architectuur: elke laag is een module die op de laag eronder bouwt en zonder de laag erboven werkt (`LAYER_CONTRACT.md`).
De spellus die de lagen samen vormen staat in `CORE_LOOP.md`. Besluiten van de eigenaar staan in `DECISIONS.md` (D-G1 t/m D-G6, D-S1, D-L3-2b en P-1 zijn van 24–25 november).

**De rode draad (D-G5):** elk seizoen een stemming op de ALV. Alles wat de speler doet, voedt het ledenvertrouwen.

| Laag | Wat de laag voor de speler is | Status | Bestanden |
|---|---|---|---|
| **L1 Wereld** | Een wereld die zonder jou draait: 80 clubs, buitenland, transfers, wereldnieuws op het weekscherm | Gevalideerd | `world/`, `football/`, `sim/` |
| **L2 Basislaag: clubmanagement** (D-G2: af) | Acht afdelingen, stadion, geld, sponsors, leden; het manifest (Safe/Steady/Bold); de staf doet het dagelijkse zelf (D-G1); het clubboek | Speelbaar; economie niet in balans (budget kan £0 zijn) | `club/*.js`, `club/staffops.js`, `club/legacy.js` |
| **L2.5 Cluborganisatie** | Werving en jeugdcyclus; de week van de voorzitter: scouting over de wereld, toernooien, data-dag, dossier, Moneyball-bord (D-S1, D-G4) | Gebouwd, niet gebalanceerd | `club/recruitment.js`, `club/youth.js`, `club/chairtrips.js` |
| **L3 Autonomie** | De staf beslist binnen mandaat; bij jou komen alleen escalaties (bod op een top-3-speler, recordfee: D-L3-2b); de directeur legt verantwoording af via zomerbrief, ticker en debrief (D-G6) | Deels: deals-mandaat en windowverslag (optioneel), speelbare pre-season als tussenstap; de transferzomer volgens D-G6 is mijlpaal M1 | `club/window.js`, `layers/autonomy/` |
| **L4 Bestuur en politiek** | De ALV als gespeeld moment (jaarverslag, beloftes, toespraak, telling per ledengroep), oppositie, moties, tegenkandidaat | Ontwerp; mijlpaal M3b | — |
| **L5 Dynastie** (D-G3) | Familie naar Crusader Kings: kinderen die opgroeien en erven, familiemomenten, opvolging via de ALV, dynastieboek, reputatie | Eerste slice gebouwd | `club/family.js` |

Speelbare build: https://blauwev0gel.github.io/front-office-fc/northmarch/ (volgt `slimline-main`).
