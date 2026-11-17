# UX-1: het CEO-bureau. Inventaris en ontwerp (Gate 1 en 2)

*Bij de sprintprompt "The CEO's Weekly Desk" en `docs/audits/2026-11-17-ux-first-game-design-audit.md`. Gelezen in `ui/10-inbox.js` en `weekflow.js`. Gezien op screenshots van 390 px van het huidige bureau.*

## 1. Wat er nu op het bureau staat
| # | Onderdeel | Probleem | Wat ermee gebeurt |
|---|---|---|---|
| 1 | Onderwerp van de week (`weekTopic`, B22) | Goed, maar kent geen slechte of goede reeks | **Blijft** als "This week", plus een reeks van uitslagen en de regel "Last week: …" |
| 2 | Strook: positie/doel, kas, volgende tegenstander | De tegenstander staat drie keer op het scherm | Positie en kas gaan als één regel **naar This week**; de tegenstander gaat naar de wedstrijdkaart |
| 3 | Achterbannen (B51) | Prima | **Blijft**, direct onder This week |
| 4 | Red box | Besluiten die nu nodig zijn en vrijblijvende briefs staan door elkaar; niet zichtbaar wat er gebeurt als je niets doet | **Wordt anders:** "to decide this week" en "When you are ready", met per dossier wat er zondag gebeurt |
| 5 | "On your desk" (mijlpalen, preview, uitslag, weekrapport) | Een lijst van losse soorten | **Verdwijnt.** Mijlpalen gaan naar Your team, de preview naar de wedstrijdkaart, de uitslag naar This week en het rapport naar een link onderaan |
| 6 | "1 handled this week" | Het werk van je staf zit verstopt achter een kleine link | **Vervangen door Your team at work** (maximaal 3 regels, plus "All N calls") |
| 7 | Gazette-pin | Prima | **Blijft** |
| 8 | Coming up | Herhaalt de wedstrijd | **Blijft, zonder de wedstrijd** |
| 9 | Mappenbalk (9 mappen) | Concurreert met de tabs onderaan | **Wordt een rij links** (Weekly report, Matches, Dossiers, All messages). Elke map houdt zijn eigen lijst met een terugknop; er verdwijnt niets |

## 2. Nieuwe volgorde (van boven naar beneden)
```
Week 7 · 13th, target 14th · £56k          ← hoe staan we ervoor
A difficult run                             ← This week (bestaand onderwerp of reeks)
4 defeats in four. The board is wary…       ← alleen feiten uit de stand en de stemmingen
Last week: lost 0–1 at … Form: L L W L
[Board Wary↓] [Fans Angry↓] [Press] [Squad]
Your team at work               All 3 calls ›
 (face) Director of Football · Rossi
        <wat hij besloot + waarom>          ← uit wat de game vastlegde, nooit verzonnen
THE RED BOX              1 to decide this week
 (face) Rossi · DoF
        Squad plan: the wage policy…
        Sunday: Rossi picks "Keep the limits"   ← wat er gebeurt als je niets doet
 When you are ready
        <vrijblijvende briefs en kansen>
NEXT MATCH · Derby
 vs Draymoor Wanderers
 Them 16th LLWDL   Us 13th WLLLL
 Favourites · watch Doherty · target 14th    Preview ›
[Gazette]  [Coming up]  Weekly report · Matches · Dossiers · All messages
```

## 3. Regels
- Er staat niets op het bureau dat de game niet heeft vastgelegd. Een reeks is een telling van uitslagen; de stemming komt uit de achterbannen.
- Een rustige week toont "Nothing needs your signature. The club runs on what you set up." Er worden geen berichten verzonnen. De kansen uit B23 mogen variëren.
- Er komt één hoofdactie bij: de wedstrijdkaart opent dezelfde voorbeschouwing als de knop "Next match". Er komen geen nieuwe tabs of schermen bij.

## 4. Stap 3 als motor onder de red box
Elk dossier zegt wat er zondag gebeurt. Op het prototype is dat nu al waar:
- **Berichten:** de eigenaar kiest zijn standaard.
- **Voorstellen:** die vervallen.
- **Briefs:** die vervallen stil. Hier verandert iets: een **staf-brief** die je laat liggen, beslist de head volgens zijn profiel en het komt in "Your team at work". Alleen CEO-briefs vervallen.
- **Wachten:** gespreksverzoeken wachten al 2 weken. Berichten die kunnen wachten (een `wait`-markering) blijven één week langer open in plaats van zondag te worden afgehandeld.

## 5. Nog te doen na akkoord
- Betere zinnen in "Your team at work". Weekrapporten zoals "15 in the academy." zijn te kaal. In een slechte reeks komt de coach eerst.
- De tekst "It went against your mandate" in het open bericht wordt de reden van de fout.
- Een test met vaste fixtures voor de vijf weken (`test/desk.js`).
- Regressie: inbox, mappen, open, advance, playtest.
- De bijbel bijwerken met B55 (bureau) en de versoepeling van B23.
