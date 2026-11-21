# L1/L2 — Test- en playtestrapport (UX completion)

Onderscheid: **[auto]** geautomatiseerd getest · **[gezien]** door de developer op screenshots beoordeeld · **[mens]** menselijke speeltest.
Een menselijke speeltest door de eigenaar is **nog niet** gedaan; plezier en intuïtiviteit zijn daarom niet bewezen.

## Testreeksen
| Reeks | Duur | Inhoud |
|---|---|---|
| `sh tests/run-fast.sh` | **38 s** | build · save/load + migraties 1→7 · ux-test · smoke-test (elk commando, 2 seizoenen, ALV, wegstemmen) · 20-seizoenssimulatie · browsertest 390 px licht |
| `sh tests/run-all.sh` | 30–45 min | alles hierboven + statistische A/B-tests (16–32 seeds), strategietest, 4 × 20 seizoenen, browser licht + donker. Alleen bij mijlpalen. |

De eerdere werkwijze draaide na elke wijziging de volledige reeks (45 minuten). Ook maskeerde `| tail` in de scripts een falende exitcode; beide hersteld.

## Uitkomsten op de opgeleverde code
- **Snelle reeks [auto]: alles groen** (38 s), inclusief 20 seizoenen: grootboek sluit voor alle 48 clubs, 3 × 16, selecties 18–30, 34 clubs wisselen van divisie, 21 AI-voorzitters weggestemd.
- **Diepe reeks [auto]:** save, A/B (training, medisch, academie, prijzen, personeel), idle, leden en staf groen op deze code (de run werd daarna door de omgeving afgebroken).
  Commercial, life en projects zijn groen op de code van vóór de laatste balansronde (`9fed92a`) en niet opnieuw gedraaid om tijd te besparen.
- **Browser [auto + gezien], 390×844 licht en donker, plus 1280×900:** alle hoofdtabs, Club-subnavigatie, overlays, afdeling (personeel, werkwijze, bouw),
  trainer benoemen, grond kopen, bouwproject, prijzen, loonlimiet, verhuur, inzameling, lening, 30 weken via de actiebalk, ALV (gehaald én weggestemd),
  nieuwe club, herladen + doorgaan. Geen horizontale overflow, alle knoppen ≥ 44 px, geen scriptfouten, overlays sluiten. Screenshots: `tests/shots/`
  (o.a. `light-club.png` oriëntatie, `desktop-club.png` overzicht, `light-dept.png` beslisblok, `light-budget.png`, `light-income.png`, `light-week.png`, `light-review.png`, `light-agm-out.png`, `dark-*.png`).

## Strategietest [auto] — 5 seeds × 5 seizoenen, start Pell United (Northmarch One)
Niveau: 48 = top Premier, 17 = top One, 1 = bodem Two. Laatst gedraaid op `9fed92a`+ALV-wijziging (vóór save-optimalisaties, die de simulatie niet raken).

| Voorzitter | Niveau | Pt/duel | Kas | Schuld | Vertrouwen | Weggestemd | Kastekorten |
|---|---|---|---|---|---|---|---|
| Voorzichtig | 22,6 | 1,30 | £916k | £17k | 65 | 0,0 | 0,0 |
| Jeugd en faciliteiten | 36,2 | 1,31 | £883k | £66k | 68 | 0,6 | 0,0 |
| Ambitieus (lenen, stadion) | 31,2 | 1,37 | £619k | £472k | 71 | 0,4 | 0,6 |
| Doet weinig | 22,6 | 1,33 | £777k | £11k | 74 | 0,2 | 0,0 |
| Leeft boven zijn stand | 32,2 | 1,34 | £1.202k* | £359k | 70 | 0,6 | 1,2 |
| Weggestemd, gaat verder | 36,6 | 1,23 | £1.021k* | £68k | 48 | 1,8 | 0,0 |

*na wegstemmen soms verder bij een rijkere club. **Beoordeling:** strategieën werken verschillend; jeugd/faciliteiten wint sportief, voorzichtig wint
financieel, weinig doen houdt leden tevreden; geen strategie wint op alle fronten; te ver gaan geeft kastekorten; wegstemmen en doorgaan werkt altijd.

## Gameplayvragen
| Vraag | Oordeel |
|---|---|
| Verschillende strategieën werkbaar? | Ja (tabel). |
| Echte afwegingen? | Ja: kas vs investeren, prijzen vs leden, lening vs risico, stadion vs schuld (A/B-tests). |
| Heeft geld betekenis? | **Deels.** Geld koopt kwaliteit (+0,3–0,4 selectiekwaliteit voor ±£250k) en faciliteiten, maar zuinige clubs stapelen veel kas op (40% marge). |
| Voldoende bestuurlijke invloed? | Ja, via kader, staf, afdelingen, grond, prijzen, financiering; bewust geen transfers of opstelling (D5). |
| Risico's zichtbaar? | Ja: signalen, prognose, ALV-voorspelling, beslisblokken. |
| Geloofwaardige ontwikkeling? | Ja over 20–30 seizoenen; gemiddelde leeftijd 24–25 (was 22). |
| Zonder L3/L4/L5 de moeite waard? | Op basis van automatische tests plausibel; **nog niet door een mens bevestigd.** |

## Prestatie
30 seizoenen in 29 s; save 2,1 MB na 30 seizoenen (doel 2 MB; browseropslag ±5 MB).

## Resterende problemen
1. **Geldbalans:** voorzichtige voorzitters bouwen grote reserves op; geld vertaalt zich maar matig in sportief succes. Kandidaten: looneisen die meegroeien met clubrijkdom, kosten die met inkomen schalen.
2. **AI-financieel risico:** kastekorten komen voor (≈4 per 20 seizoenen), administrations zelden (0–2).
3. **Leeftijd** daalt nog licht op de lange termijn (24,2–24,7 na 20 seizoenen).
4. **Menselijke speeltest** ontbreekt.
5. Begrotingsprognose is pas vanaf week 6 zinvol (scherm toont daarvoor "So far").
