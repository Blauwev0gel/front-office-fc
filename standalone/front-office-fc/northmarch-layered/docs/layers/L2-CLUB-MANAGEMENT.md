# L2 — Volwaardig clubmanagement

**Status:** Speelbaar (eerste deel, M1). Nog niet gevalideerd als volledige laag. Ontwerpvragen L2 nog niet gesteld.

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
| Afdelingsbudget en koers | Ground → Departments | `SetDeptBudget`, `SetDeptCourse` | slijtage/herstel, signaalsterkte |
| Ticketprijzen | Money → Prices | `SetPrice` | opkomst ↔ recette (getest: +£4 → −9% publiek, +7% recette) |
| Lenen en aflossen | Money → Loans | `TakeLoan`, `RepayLoan` | kas nu, rente en aflossing later |
| Kader voor de directeur | Squad | `SetSquadPolicy` | loonplafond en transferruimte van de directeur |
| Speler laten gaan | Squad → speler | `ReleasePlayer` | afkoopsom, lagere loonsom |
| Inspecteren en vergelijken | Tables → club, Club-tab | — | stand, sterkte, aanhang, faciliteiten van elke club |
| Prognose | Money → Overview | — | 26-wekenprognose met bandbreedte |

## 6. Input/Output
Leest L1-toestand en events; schrijft uitsluitend via `cmd(...,'player')`.

## 7–9. Consequenties, autonomie, variatie
Zie L1. Strategieën die nu al uiteenlopen: sparen (veel kas, achterstand in faciliteiten), faciliteiten eerst
(duur, betaalt zich via jeugd en sterkte terug), ambitie met lening en hoog loonkader (risico op administration).

## 10. Open keuzes (L2-ontwerpvragen, nog te stellen)
Maximaal drie, bijvoorbeeld: mag de voorzitter individuele transfers goedkeuren/afwijzen; ledenbegroting en
investeringsplafond (verenigingsregels); seizoensdoelen en evaluatie.

## 11. Acceptatietests
Browser-playtest (`tests/playtest.js`) dekt alle schermen en de commando's bouwen, prijs, lening, kader.
Ontbreekt nog: meerseizoens-strategietest met menselijk speeloordeel.

## 12. Bouwstatus
Ontwerp ◐ · Code ◐ · Geïntegreerd ✓ (wat er is) · Speelbaar ✓ · Gevalideerd ✗
