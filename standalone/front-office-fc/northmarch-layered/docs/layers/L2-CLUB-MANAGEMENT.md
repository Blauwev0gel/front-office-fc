# L2 — Volwaardig clubmanagement

**Status:** Speelbaar; UX afgerond voor L1/L2 (zie `docs/L1_L2_UX_ARCHITECTURE.md`, `docs/L1_L2_PLAYTEST_REPORT.md`). Uitvoering volgens `docs/PROMPT_L1_L2_AFRONDEN.md`: afdelingen ✓, pakket 1 (leden, ALV) ✓, pakket 2 (trainer en directeur) ✓, pakket 3 (begroting, commercie, financiering) ✓, pakket 4 (voetbaldiepte) ✓, pakket 5 (projecten, historie, signalen) ✓; pakket 6 (validatie) open.

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
| Seizoensbegroting en kader voor de directeur | Money → Budget | `SetSquadPolicy` (loonlimiet in stappen, transferdeel) | plan tegenover koers, waarschuwingen; loonlimiet 88% vs 50% → loonsom £11,8k vs £8,9k per week, zwakkere selectie |
| Hoofdsponsor kiezen, naamrecht | Money → Sponsors | `SignSponsor` | vast lang/kort of prestatiegebonden (goed seizoen +£4,8k, slecht −£2,0k t.o.v. vast); naamrecht kost vertrouwen; lokale partners volgen de commerciële afdeling |
| Ledenobligatie, inzameling, grond verkopen/terugkopen | Money → Funding | `IssueBond`, `Fundraise`, `SellGround`, `BuyBackGround` | goedkoper dan de bank; tweede inzameling £9k i.p.v. £18k en minder vertrouwen; grondverkoop: geld nu, huur altijd, −15 vertrouwen; statuten kunnen blokkeren |
| Speler laten gaan | Squad → speler | `ReleasePlayer` | afkoopsom, lagere loonsom |
| Contributie instellen | Club-tab → Members | `SetDues` | ledental ↔ contributie-inkomsten ↔ vertrouwen (getest: +£25 → −16% leden, +48% contributie, −15 vertrouwen) |
| Seizoensdoelen volgen | Week-tab | — | drie doelen (positie, financiën, academie) met voortgang; beoordeeld op de ALV |
| ALV overleven | na week 30 | — (`holdAGMs`) | stemming uit vertrouwen; verloren = weggestemd, drie nieuwe stoelen (D7) |
| Hoofdtrainer en directeur benoemen, ontslaan, verlengen | Club-tab → Coach and director | `HireStaff`, `SackStaff`, `RenewStaff` | trainer: wedstrijdsterkte, spelstijl, groei (getest: topcoach +6,9 punten, ontwikkeltrainer +27% groei); directeur: miskopen 2% vs 27%, scoutingbereik, onderhandelen |
| Verhuurbeleid in het kader | Money → Budget | `SetSquadPolicy` (loans) | verhuurde reserves 21 vs 4 wedstrijden, groei +0,93 vs +0,70 |
| Moraal, schorsingen, verzoeken volgen | Squad, speler | — | badges en moraal per speler; transfermarkt per window onder Tables → Market |
| Grond kopen, nieuw stadion bouwen | Club → Ground → Build → Major projects | `BuyPlot`, `StartStadium` | extra kavel; stadion standaard: capaciteit 2.350 → 5.067, kaartinkomsten +£66k/seizoen, schuld +£254k; oude grond verkocht of huur beëindigd; statuut kan blokkeren |
| Clubhistorie, records, loopbaan | Club → Club history; Tables → History | — | seizoenen met topscorer en bekerloop, records, financiële grafiek, erelijst wereld |
| Signalen | Week → Needs attention | — | gesorteerd op urgentie, elk met link naar het scherm om te handelen |
| Inspecteren en vergelijken | Tables → club, Club-tab | — | stand, sterkte, aanhang, faciliteiten van elke club |
| Prognose | Money-tab → Overview | — | 26-wekenprognose met bandbreedte |

## 6. Input/Output
Leest L1-toestand en events; schrijft uitsluitend via `cmd(...,'player')`.

## 7–9. Consequenties, autonomie, variatie
Zie L1. Strategieën die nu al uiteenlopen: sparen (veel kas, achterstand in faciliteiten), faciliteiten eerst
(duur, betaalt zich via jeugd en sterkte terug), ambitie met lening en hoog loonkader (risico op administration).

## 10. Besluiten
D5 alleen kader voor transfers · D6 ledenvertrouwen + jaarlijkse ALV · D7 na wegstemmen een nieuwe club kiezen.

### Pakket 1 — leden, vertrouwen, doelen en ALV (ontwerpnotitie)
Doel: verliesconditie en seizoensmaatstaf (D6/D7). Toestand `S.members[id]` {count, dues, conf, log, goals, agm}, `S.career`, `S.rep`; schema v3 met migratie.
Vertrouwen (0–100) beweegt met oorzaak: uitslagen tegen verwachting (derby ×1,6), bekerloop, prijzen en contributie boven de norm,
administration (−20), geldnood, sluiting van een tribune, nieuwe faciliteiten, beker (+8); op de ALV: doelen (±0,8×gewicht), promotie (+12),
degradatie (−15); daarna 15% terug naar 55. Stemming: voor = 20 + 0,75 × vertrouwen ± 5; onder 50% = weggestemd.
AI-clubs: zelfde meter; een weggestemde AI-voorzitter wordt vervangen door de oppositiekandidaat (andere waarde → ander beleid); bij laag vertrouwen verlaagt een AI-bestuur prijzen.

### Pakket 2 — trainer en directeur (ontwerpnotitie)
Personen in `S.P` met `pro` {q 1–20, spec, wage, contract, record, off (schattingsfout)}; vrije markt `S.staffPool`; schema v4.
Trainer: sterkte +0,45×(q−10) (×1,35 bij 'results'); 'attacking' ×1,07 eigen/×1,03 tegen goals; 'defensive' ×0,97/×0,91; groei ×(1+0,025×(q−10)), +0,18 bij 'development'.
Directeur: inschattingsruis (20−oog)/7, bereik +(q−10)/2, prijs ×(1,18−0,018×onderhandelen), 'youth' voorkeur voor ≤21.
Salaris 120 (trainer) / 95 (directeur) × 1,27^(q−8) per week. Wil niet onder zijn niveau werken (q ≤ divisieplafond + 3).
Ontslag: halve restwaarde contract, interim (q 4–7). Wegkopen: halve restwaarde als vergoeding. AI: ontslag bij achterstand ≥4 plaatsen (week 10/20, 30%) of ≥3 in de zomer (45%); vervangers primair uit de vrije markt.
De speler ziet een schatting in sterren; bij de eigen club halveert de fout. Eigen wil (mandaten, initiatief) volgt in laag 3.

### Pakket 3 — begroting, commercie en financiering (ontwerpnotitie)
Eén bron voor het kader: `F.policy` (loonverhouding `wageR` 0,4–1,05 van de verwachte inkomsten, transferdeel `spend`). De begroting `F.budget`
is een plan dat elke zomer wordt vastgelegd (inkomsten, lonen, trainer/directeur, afdelingen, bouw, transfers, aflossingen) en dat de lopende
koers volgt; eenmalige inkomsten tellen één keer. Sponsors: elke zomer bij einde contract drie aanbiedingen (vast 3 jaar 0,95×, vast 1 jaar 1,08×,
prestatie 0,42× + per punt, gelijke verwachte waarde), soms naamrecht (0,45× basis, −0,12 vertrouwen per week); lokale partners 0,35× basis met
vorm en afdeling commercie. Financiering: ledenobligatie (cap = leden × £150 × vertrouwen, rente 3% ± vertrouwen, 5 jaar, één per seizoen),
inzameling (leden × £25 × vertrouwen; binnen 2 seizoenen 45% en −3 vertrouwen), grond verkopen (capaciteit × £110 × divisie, huur 7,5% per jaar,
−15 vertrouwen; terugkopen 110%, +10). Statuten: 'Members approve any sale above £50k' (verkoop/naamrecht alleen bij voldoende vertrouwen),
'Ticket prices are set by the members' (max. 15% boven de norm). AI: sponsorkeuze naar waarde voorzitter; bij geldnood eerst obligatie, dan inzameling.
Ook: inkomstenschatting telde seizoenkaarthouders dubbel (hersteld, loonverhoudingen evenredig herschaald); speelschema had reeksen van 15 uitwedstrijden (hersteld: max. 3).

### Pakket 5 — grote projecten, historie en signalen (ontwerpnotitie)
Extra kavels (max. 9, prijs ×1,3 per extra kavel). Nieuw stadion compact/standaard/groots (capaciteit ×1,4/×2/×3, minimaal +1.500/+2.500/+4.000;
£160/120/90 per plaats naar divisie; 40/55/70 weken na een vergunning van 8–16 weken; 15% aanbetaling, rest wekelijks via 'build'). Oplevering: nieuwe
tribunes (55% zit), toegang/veiligheid op de nieuwe capaciteit, voorzieningen +2, oude grond verkocht (of huur beëindigd), aanhang +10%, vertrouwen +8.
AI: een structureel uitverkochte club in de bovenste twee divisies bouwt soms. Historie: club-`hist` met topscorer en bekerloop, `S.records` (grootste
zege, recordpubliek), `S.career`. Signalen: contracten, transferverzoeken, interim, staat van de grond, kasdip, begroting, sponsors, vertrouwen, opening stadion.

### Afdelingsmodel
Signaal = faciliteit × (budget × (0,55 + 0,15 × personeel)) + 0,3 × personeel × budget, × koers (1,15).
Kosten per week = divisiebasis × [0,5 · 0,75 · 1 · 1,4 · 1,9][personeel] × budget. AI-clubs nemen aan of snijden per kwartaal naar hun geld.

## 11. Acceptatietests
Browser-playtest (`tests/playtest.js`) dekt alle schermen en de commando's bouwen, prijs, lening, kader, personeel en koers. A/B: elite medisch team −24% blessureweken, sterk verkoopteam +13% sponsors, +£14k kosten per seizoen.
Ontbreekt nog: meerseizoens-strategietest met menselijk speeloordeel.

## 12. Bouwstatus
Ontwerp ◐ · Code ◐ · Geïntegreerd ✓ (wat er is) · Speelbaar ✓ · Gevalideerd ✗
