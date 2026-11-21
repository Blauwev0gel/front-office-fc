# L2 — Volwaardig clubmanagement

**Status:** Speelbaar (pakket 1 van 2: afdelingen). Ontwerpvragen beantwoord: D5, D6, D7. Nog te bouwen: ledenvertrouwen en ALV (D6/D7).

## 1. Spelbelofte
De voorzitter bestuurt de club proactief: onderzoeken, vergelijken, bouwen, financieren, onderhouden en bijsturen,
zonder verhaalkaart of inbox als doorgang.

## 2. Bestaande code
Ground- en Money-schermen uit `voorzitter-fundering ui/system.js`, aangepast naar commando's. Zie ledger.

## 3. Eigen gegevens
Geen eigen spelstaat: L2 is UI plus speleracties op L1-commando's (`src/ui/*.js`, UI-toestand in `UI`).

## 4–5. Mechanieken en speleracties (nu speelbaar)
| Werkwoord | Waar | Commando | Echt gevolg (getest) |
|---|---|---|---|
| Stadion uitbreiden, overkappen, ombouwen | Club → Ground → Build | `StartProject` | capaciteit, sfeer (thuisvoordeel), comfort |
| Complex bouwen/upgraden (training, medisch, academie, scouting, winkel, clubhuis) | idem | `StartProject` | groei spelers, blessures, jeugd, scoutingbereik, inkomsten, aanhang |
| Repareren | Ground → Repairs | `Repair` | voorkomt sluiting halve tribune |
| **Acht afdelingen** (training, medisch, academie, scouting, commercie, leden & gemeenschap, wedstrijdorganisatie, terreinen & onderhoud) | Club-tab → afdeling | `SetDeptStaff`, `SetDeptBudget`, `SetDeptCourse` | personeel 1–5 (werven 3 weken + fee, ontslag 4 weken), budget en koers vermenigvuldigen het signaal van de afdeling; prestatie zichtbaar tegen het divisiegemiddelde |
| Faciliteit van een afdeling bouwen/upgraden | Club-tab → afdeling | `StartProject` | idem, direct vanuit de afdeling |
| Ticketprijzen | Money-tab → Prices | `SetPrice` | opkomst ↔ recette (getest: +£4 → −9% publiek, +7% recette) |
| Lenen en aflossen | Money-tab → Loans | `TakeLoan`, `RepayLoan` | kas nu, rente en aflossing later |
| Kader voor de directeur | Squad | `SetSquadPolicy` | loonplafond en transferruimte van de directeur |
| Speler laten gaan | Squad → speler | `ReleasePlayer` | afkoopsom, lagere loonsom |
| Inspecteren en vergelijken | Tables → club, Club-tab | — | stand, sterkte, aanhang, faciliteiten van elke club |
| Prognose | Money-tab → Overview | — | 26-wekenprognose met bandbreedte |

## 6. Input/Output
Leest L1-toestand en events; schrijft uitsluitend via `cmd(...,'player')`.

## 7–9. Consequenties, autonomie, variatie
Zie L1. Strategieën die nu al uiteenlopen: sparen (veel kas, achterstand in faciliteiten), faciliteiten eerst
(duur, betaalt zich via jeugd en sterkte terug), ambitie met lening en hoog loonkader (risico op administration).

## 10. Besluiten
D5 alleen kader voor transfers · D6 ledenvertrouwen + jaarlijkse ALV · D7 na wegstemmen een nieuwe club kiezen.

### Afdelingsmodel (pakket 1)
Signaal = faciliteit × (budget × (0,55 + 0,15 × personeel)) + 0,3 × personeel × budget, × koers (1,15).
Kosten per week = divisiebasis × [0,5 · 0,75 · 1 · 1,4 · 1,9][personeel] × budget. AI-clubs nemen aan of snijden per kwartaal naar hun geld.

## 11. Acceptatietests
Browser-playtest (`tests/playtest.js`) dekt alle schermen en de commando's bouwen, prijs, lening, kader, personeel en koers. A/B: elite medisch team −24% blessureweken, sterk verkoopteam +13% sponsors, +£14k kosten per seizoen.
Ontbreekt nog: meerseizoens-strategietest met menselijk speeloordeel.

## 12. Bouwstatus
Ontwerp ◐ · Code ◐ · Geïntegreerd ✓ (wat er is) · Speelbaar ✓ · Gevalideerd ✗
