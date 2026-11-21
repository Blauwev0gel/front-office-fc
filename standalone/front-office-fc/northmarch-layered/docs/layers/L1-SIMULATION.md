# L1 — Zelfstandige voetbalwereld en simulatie

**Status:** Gevalideerd (M1, 2026-11-21). Bewijs: `docs/TEST_EVIDENCE.md`.

## 1. Spelbelofte
Een wereld van 48 ledenclubs in drie divisies en een beker die zonder speler, verhalen of staff jarenlang
doorloopt. Clubs worden rijker of armer, spelers groeien, verouderen en verhuizen, stadions slijten of worden
uitgebouwd, en sportief succes volgt uit echte toestand (selectie, faciliteiten, geld).

## 2. Bestaande code (hergebruik)
Zie `docs/CODE_REUSE_LEDGER.md`. Kern: wereld/personen/wedstrijdmotor uit Northmarch (`northmarch.html @7a2d5d3`),
spelers, stadion en financiën uit `voorzitter-fundering @b8ae2ef`, omgezet van één club naar alle clubs.

## 3. Eigen gegevens (één eigenaar per toestand)
| Toestand | Eigenaar (module) |
|---|---|
| `S.clubs` (identiteit, divisie, aanhang, rivaal), `S.P` (personen) | `world/world.js` |
| `S.fx`, `S.tbl`, `S.cup`, `S.matches`, `S.hist` | `world/league.js`, `sim/clock.js` |
| `S.squads[id]`, `S.fa`, `S.qref` | `football/players.js`, `football/market.js` |
| `S.grounds[id]` | `club/ground.js` |
| `S.fin[id]` (kas, regels, leningen, prijzen, beleid) | `club/finance.js` — alleen `book()` wijzigt kas |
| `S.ev` (feiten), `S.season`, `S.week` | `core/bus.js`, `sim/clock.js` |

## 4. Belangrijkste mechanieken
- **Klok** (`advanceWeek`): wedstrijden → spelersweek (blessures, groei) → financiën en bouw per club →
  clubbesturen (AI) → winterwindow (week 15) / verlengingen (week 24). Seizoen: 30 weken, daarna `closeSeason`.
- **Competitie:** 3×16, dubbele competitie, 2 promoveren/2 degraderen per grens; beker in 6 rondes
  (week 4, 9, 14, 19, 24, 28; Premier stroomt in ronde 2 in; finale neutraal, strafschoppen bij gelijkspel).
- **Wedstrijd:** Poisson (Northmarch) op sterkte uit de beste fitte elf (positie, vorm) + thuisvoordeel uit sfeer en veld.
- **Spelers:** groei naar potentieel met snelheid uit training; achteruitgang vanaf 31 (trager met goede training);
  blessurekans en -duur uit medische zorg; jeugdinstroom (aantal, kwaliteit, potentieel) uit de academie.
- **Markt:** vrije spelers (nieuwe instroom op lager niveau), transfers tussen clubs met prijs en akkoord van de
  verkoper, verlengingen, gedwongen verkoop bij geldnood. Scoutingbereik bepaalt hoeveel spelers een club ziet.
- **Leven van een selectie (pakket 4):** moraal per speler (speeltijd, resultaten, contract; telt ±6% mee in prestaties), gele en rode kaarten
  met schorsingen, vermoeidheid in bekerweken (rotatie), groei afhankelijk van speeltijd (×1,4 gespeeld, ×0,7 niet, t/m 23 jaar), verhuur van jonge
  reserves aan clubs in lagere divisies (terug in de zomer), contractgesprekken met looneisen (weigeren → vertrek), transferverzoeken bij langdurige
  onvrede (verkocht tegen 90% van de waarde), clubreputatie (volgt divisie en prestaties; sponsors en spelers die willen komen).
- **Lonen** volgen het marktniveau (`S.qref`): kwaliteit relatief aan de wereld, zodat de economie niet inflateert.
- **Financiën:** wekelijkse regels (wedstrijddag, commercie, TV, lonen, afdelingen, onderhoud, bouw, rente, aflossing),
  prijzengeld, bekerinkomsten, transfersommen, leningen (annuïteit), rekening-courant met limiet;
  3 weken boven de limiet = **administration**: −6 punten en een reddingslening tegen 9%.
- **Aanhang** groeit met prestaties boven verwachting, promotie en het clubhuis; krimpt bij falen en degradatie.

## 5. Speleracties
L1 zelf heeft geen speleracties. Het levert de commando's (`StartProject`, `Repair`, `SetDeptBudget`,
`SetDeptCourse`, `SetPrice`, `TakeLoan`, `RepayLoan`, `SetSquadPolicy`, `ReleasePlayer`) die L2, AI-clubs en later staff en verhalen gebruiken.

## 6. Input/Output
- **Commando's in:** zie §5; validatie in `check`, uitvoering alleen in de eigenaarmodule.
- **Events uit:** `Match`, `Injury`, `Return`, `Suspended`, `WantsOut`, `RefusedContract`, `Loan`, `LoanBack`, `Transfer`, `Signing`, `Renewed`, `Released`, `Retired`, `PlayerLeft`,
  `YouthIntake`, `ProjectStarted`, `ProjectCompleted`, `SafetyClosure`, `LoanTaken`, `LoanRepaid`, `CashCrisis`,
  `ForcedSale`, `Administration`, `Promoted`, `Relegated`, `CupWon`, `WeekClosed`, `SeasonClosed`.
- **Hooks:** `onWeek(f)`, `onSeason(f)` voor hogere lagen; zij verzetten nooit zelf de tijd.

## 7. Consequenties
Kort: blessures, uitslagen, kasstroom per week. Lang: faciliteiten → spelersontwikkeling → sterkte → promotie →
inkomsten → lonen → betere spelers. Verlies en herstel: degradatie, gedwongen verkoop, administration; herstel via
lagere lonen, jeugd en sparen.

## 8. Autonome werking
Met verhalen, staff en dynastie uit draait alles door. AI-besturen beslissen via regels (kleur naar de waarde van de
voorzitter: geld = voorzichtig, glorie = gedurfd). De club van de speler houdt een directeur (selectie) en de
staande budgetten; zonder spelersactie spaart hij geld maar raakt achter in faciliteiten (`tests/idle-test.js`).

## 9. Spelvariatie
Zichtbaar in de 20-seizoenssimulatie: voorzichtige clubs met reserves, investeerders die groeien of omvallen,
jojoclubs (27–31 clubs wisselen ≥3 keer van divisie in 20 jaar), klimmers van Two naar Premier.

## 10. Open keuzes
Geen voor L1. Technische besluiten T1–T4 in `docs/DECISIONS.md`.

## 11. Acceptatietests
`tests/sim-test.js` (20 seizoenen, 4 seeds), `tests/ab-test.js` (contrafeitelijk), `tests/save-test.js`,
`tests/idle-test.js`, `tests/playtest.js` (browser 390 px, licht en donker).

## 12. Bouwstatus
Ontwerp ✓ · Code ✓ · Geïntegreerd ✓ · Speelbaar ✓ · Gevalideerd ✓ (geautomatiseerd; menselijk speeloordeel nog niet).
