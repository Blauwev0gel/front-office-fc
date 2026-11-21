# Architectuur — technische bron van waarheid

## Bouw
- Broncode in `src/`, samengevoegd door `build.js` in vaste volgorde tot **`dist/northmarch-layered.html`**
  (één standalone bestand, offline speelbaar; webfonts optioneel).
- `tests/load.js` laadt dezelfde engine-modules zonder UI in een Node-VM: elke test draait de echte code.
- Volgorde (`build.js`): `core/content` → `core/rng` → `core/bus` → `world/world` → `world/league` →
  `football/players` → `football/match` → `football/market` → `club/ground` → `club/finance` → `sim/ai` →
  `sim/clock` → `core/save` → `ui/render` → `ui/club` → `ui/act`.

## Toestand
Eén object `S` (JSON, savebaar). Eigenaarschap per domein: zie `docs/layers/L1-SIMULATION.md` §3.
Alleen `book(id,line,amount)` wijzigt kas; alleen `advanceWeek()`/`closeSeason()` verzetten de tijd.

## Tijd (één klok)
```
advanceWeek():  week++ → playWeekMatches (competitie 3×16 + beker)
                → playersWeek(id) voor alle clubs (blessures ← medisch, groei ← training)
                → financeWeek(id) voor alle clubs (opkomst, regels, bouw ← groundWeek, leningen, solvabiliteit)
                → membersWeek(id) voor alle clubs (leden, vertrouwen)
                → aiBoardWeek(id) voor AI-clubs (personeel, budgetten, prijzen, reparaties, projecten, loonbeleid)
                → week 15: squadManager(winter) · week 24: renewals · membersOnEvents (reactie op events van de week)
                → event WeekClosed → HOOKS.weekClosed
closeSeason():  ALV's (holdAGMs/afterAGMs) → prijzengeld + archief → sponsors (commercialSeasonEnd) → begroting volgend seizoen (setBudgetsAll) → aanhang → promotie/degradatie → spelers (leeftijd, contracten,
                pensioen, academie) → qref → vrije spelers → zomerwindow (2 rondes, rijkste clubs eerst)
                → veiligheidsinspectie → staffSeasonEnd (contracten, AI-ontslagen, vrije markt) → event SeasonClosed → HOOKS.seasonClosed → nieuw seizoen
```

## Commando's
`cmd(name, clubId, args, actor)` met actor `player | ai | td | story`. Validatie (`check`) vóór uitvoering (`run`);
de speler kan alleen de eigen club aansturen. Gedefinieerd: `StartProject`, `Repair`, `SetDeptBudget`,
`SetDeptCourse` (ground.js) · `SetPrice`, `TakeLoan`, `RepayLoan`, `SetSquadPolicy` (finance.js) · `ReleasePlayer` (market.js) · `SetDeptStaff` (ground.js) · `SetDues` (members.js) · `HireStaff`, `SackStaff`, `RenewStaff` (staff.js) · `SignSponsor`, `IssueBond`, `Fundraise`, `SellGround`, `BuyBackGround` (commercial.js).
Hogere lagen (staff, verhalen) krijgen géén eigen mutatiepad: zij roepen dezelfde commando's aan.

## Events
`emit(type, club, text, data)` → `S.ev` (laatste 2500, volgnummer `n`). `eventsSince(n)`, `eventsFor(club, {s,w,types})`.
Lijst: `docs/layers/L1-SIMULATION.md` §6.

## Saves
`SAVE_KEY='northmarch-layered-v1'`, schemaversie `S.v` (= `VERSION` 5; migraties 1→2 afdelingen, 2→3 leden, 3→4 trainers/directeuren, 4→5 begroting/sponsors/financiering). `migrate()` loopt `MIGRATIONS[v+1]` in volgorde;
een nieuwere of vreemde save wordt geweigerd. Regel: geen `VERSION`-ophoging zonder migratie én test.
Het referentiespel (`northmarch-chairman-v1`) gebruikt een andere sleutel en blijft onaangetast.

## Determinisme
Alle toeval via `rnd()` op `S.rs`. Zelfde seed + zelfde commando's = identieke wereld (getest, ook via save/load).
Alleen de seed van een nieuw spel komt uit de klok van de browser.

## Lagen-schakelaars
`S.layers={story:false,staff:false,dynasty:false}`; `S.auto=true` laat de AI ook de spelersclub besturen (tests).
