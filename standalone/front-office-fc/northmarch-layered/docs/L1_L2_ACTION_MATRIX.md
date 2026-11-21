# L1/L2 — Action Matrix (audit, vóór herontwerp)

Alle speleracties lopen via `cmd(name, club, args, 'player')`. Status: ✓ helder · ◐ werkt, info ontbreekt · ✗ defect/onvindbaar.

| Actie (cmd) | Vindplaats | Voorwaarden | Kosten | Verwachte gevolgen | Feedback | Status |
|---|---|---|---|---|---|---|
| `StartProject` | Ground → Build; afdeling → faciliteit | vrij doel, kas ≥ −kredietlimiet | bouwprijs × aannemer, wekelijks | capaciteit/signaal na weken | melding, projectlijst | ◐ geen weekbedrag, geen extra onderhoud, effect pas na oplevering niet benoemd |
| `Repair` | Ground → Repairs | conditie < 90 | eenmalig | conditie 100 | melding | ✓ |
| `SetDeptStaff` | afdeling | niet al aan het werven | fee 2 wk / ontslag 4 wk | signaal na 3 wk | melding, "recruiting" | ◐ fee niet vooraf getoond |
| `SetDeptBudget` | afdeling | — | per week | direct | — | ◐ effect niet benoemd |
| `SetDeptCourse` | afdeling | — | geen | na 30 weken | "switching" | ◐ geen waarschuwing dat lopende koers vervalt |
| `SetPrice` | Money → Prices | statuut kan begrenzen | — | publiek ↔ recette, vertrouwen | verwachte opkomst | ◐ geen effect op recette/leden vóór de keuze |
| `SetDues` | Club → Members | ±1 stap | — | leden ↔ inkomen ↔ vertrouwen | — | ◐ geen voorspelling |
| `TakeLoan` / `RepayLoan` | Money → Funding | ruimte bij de bank | rente | kas nu, aflossing later | melding | ◐ weekbedrag en totale rente niet vooraf |
| `IssueBond` | Money → Funding | 1×/seizoen, cap vertrouwen | 3%± | kas, +vertrouwen | melding | ◐ idem |
| `Fundraise` | Money → Funding | 1×/seizoen | — | kas, herhaling −vertrouwen | melding met bedrag | ✓ |
| `SellGround` / `BuyBackGround` | Money → Funding | statuut | — | kas, huur, −15/+10 vertrouwen | bevestiging | ✓ |
| `SignSponsor` | Money → Sponsors | aanbod geldig | — | inkomsten per week/punt | melding | ◐ waarde over looptijd ontbreekt |
| `SetSquadPolicy` | Money → Budget | — | — | loonlimiet, transferruimte, verhuur | stepper | ◐ effect pas in transferperiodes; niet terug te volgen |
| `HireStaff` / `SackStaff` / `RenewStaff` | Club → coach/director | kandidaat beschikbaar | vergoeding, afkoop, loon | sterkte/groei/miskopen | bevestiging met kosten | ◐ geen vergelijking met de huidige man |
| `ReleasePlayer` | speler | ≥ 20 spelers | afkoop | loonsom omlaag | bevestiging | ✓ |
| `BuyPlot` | Ground → Build → Major | < 9 kavels | eenmalig | bouwplek | bevestiging | ✓ |
| `StartStadium` | Ground → Build → Major | aanbetaling, statuut | 15% + wekelijks | capaciteit na ±2 seizoenen | bevestiging | ◐ weekbedrag en kasprognose niet vooraf |

**Dubbele routes:** Ground via Week-hub en Club-knop; faciliteit bouwen via afdeling en via Build (bewust, beide houden).
**Onbereikbare acties:** geen. **Moeilijk terug te vinden gevolgen:** alle beleidsknoppen (kader, prijs, contributie, personeel, trainer): er is geen overzicht van genomen besluiten en wat er sindsdien veranderde.
