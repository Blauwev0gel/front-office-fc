# Slimline — Architectuur en bron van waarheid

Bijgewerkt: **22 november 2026** · Branch: `claude/loving-goodall-uv00vn`

**Bewijsstatus:** Dit document beschrijft de actuele broncode. De nieuwe wijzigingen aan de vijf-divisiewereld, internationale markt en alle zes blokken zijn **niet** via een build, tests of browser-playtest gevalideerd. Oudere testclaims gelden niet automatisch voor deze wijzigingen.

## Verplichte bouwvolgorde en modulegrenzen (22 november 2026)

**Lees `docs/LAYER_CONTRACT.md` vóór iedere nieuwe feature.** De eerste speelbare fase is **het basisspel (L1 wereld + L2 eenvoudige clubbediening)**. Pas nadat dat zelfstandig goed werkt, volgen **L3 autonomie**, **L4 verhalen/relaties** en **L5 dynasty**. Uitgebreide autonomie mag geen voorwaarde worden voor het draaien van het basisspel.

`src/core/layers.js` biedt generieke lifecycle-events, optionele regel-/actieproviders en UI-slots. **Beide L3-slices** wonen in `src/layers/autonomy/`: `director-deals*.js` (mandaten) en `director-accountability*.js` (verantwoording). De standaard-build bevat geen van deze modules; een afzonderlijke ontwikkelbuild kan ze allebei optioneel meenemen.

**Build-time scheiding aangetoond:** `tests/base-isolation-test.js` doorloopt drie basis-seizoenen zonder L3; `tests/layer-isolation-test.js` bewijst dat S3.2-reporting geen uitslagen of kas verandert. Dit is **nog geen** bewijs van speelplezier of dynamische runtime-hotplug. CI zonder browser op f40b092 groen; mobiele browsertest loopt apart.

## Productcontract
Slimline is de autonome voetbalwereld die onder latere management-, staff-, verhaal- en dynasty-lagen ligt. De speler stuurt een club via bestaande brede beleidskeuzes. Geen verplichte gesprekken, scripts, transfergoedkeuringen of tactische micromanagementsystemen toevoegen.

## Modules en eigenaarschap
| Domein | Code | Toestand |
|---|---|---|
| Kern en events | `core/rng.js`, `core/bus.js` | `S.rs`, `S.ev`, `S.worldLog` |
| Northmarch-wereld | `world/world.js` | `S.clubs`, `S.P`, clubidentiteit |
| Competitie en beker | `world/league.js` | `S.fx`, `S.tbl`, `S.cup` |
| Buitenland en Europa | `world/foreign.js` | `S.foreign`: landen, clubs, selecties, tabellen, transfers, Europese loting |
| Echte wereldgeschiedenis | `world/awards.js` | `S.worldAwards`, `S.worldLog`, `worldTrends()` |
| Rivaliteiten en jeugdidentiteit | `world/rivalry.js` | `c.rivalries`, `c.devCulture`, `c.identity` |
| Spelers en selecties | `football/players.js` | `S.squads`, ontwikkelpaden, carrièrehistorie, kwaliteiten |
| Wedstrijden | `football/match.js`, `football/life.js` | uitslagen, speelstijlen, vorm, schorsingen, vermoeidheid |
| Markt | `football/market.js` | `S.fa`, scouting, clubtransfers, contracten |
| Financiën | `club/finance.js`, `club/commercial.js` | `S.fin`; uitsluitend `book()` wijzigt Northmarch-kas |
| Opleiding en scouting | `club/youth.js`, `club/recruitment.js` | jeugdtrajecten, directeurbesluiten |
| Centrale tijd | `sim/clock.js` | `S.week`, `S.season`, seizoensovergangen |
| Opslag | `core/save.js` | versie 10, migraties 1→9, legacy-piramideherstel |
| UI | `ui/render.js`, `ui/club.js`, `ui/history.js` | week, selecties, wereldarchief en seizoensreview |

`build.js` bundelt standaard `ENGINE_BASE + UI_BASE`: `core` → `world` → `football` → `club` → `sim` → `save` → `ui` zonder L3. Alleen met `NORTHMARCH_BUILD_MODE=autonomy node build.js` wordt de optionele L3-engine en -UI toegevoegd. Output blijft `dist/northmarch-layered.html`.

## Nationale voetbalwereld
- Vijf divisies van zestien Northmarch-clubs (80 clubs), elk dertig competitiewedstrijden.
- Twee clubs promoveren en degraderen per divisiegrens.
- Beker: 32 clubs in de voorronde, daarna 48 toegevoegde clubs: 80 deelnemers, 79 knock-outduels, zeven rondes.
- Bekerweken: 2, 4, 9, 14, 19, 24, 28.
- Deels geconverteerde oude bekertoernooien behouden een `legacy`-vlag; de winnaar beëindigt het toernooi zodra één club resteert.

## Buitenlandse voetbalwereld
- Engeland, Schotland, Nederland, Duitsland, Frankrijk, Spanje: elk twaalf fictieve clubs en tweeëntwintig speeldagen.
- Buitenlandse clubs staan **niet** in `S.clubs` of `S.fin`. Ze hebben een lichte eigen budget- en selectieadministratie, geen volledige Northmarch-boekhouding.
- Persisterende spelers met ID, nationaliteit, club, leeftijd, kwaliteit, stijl, contract, ontwikkeling en carrière.
- Internationale transfers gebruiken één mutatieroute `foreignMove()`: controle van eigendom, dekking, spelerbereidheid, budget en salaris; aanpassing van beide selecties en financiële rekeningen.
- De normale directeurzoektocht `scoutPool()` kan buitenlandse spelers vinden; noodzaken en buitenlandse contractafloop voeden een gedeelde markt.
- Europa: 16 deelnemers (12 uit buitenlandse toplijsten, vier uit Northmarch), vier knock-outrondes in week 6, 11, 17 en 25. Geen overlap met bekerweken.
- Europese wedstrijden beïnvloeden afzonderlijke spelersstatistieken, echte doelpuntenmakers, moraal, blessurerisico, volgende-weekvermoeidheid en clubinkomsten.

## Eén centrale klok
`advanceWeek()`:
1. Week 0: zomertransferperiode (clubs stellen selecties samen, inclusief internationale markt).
2. Vorige Europese belasting op fitte/selectieaanwezige spelers toepassen.
3. Week verhogen; vijf divisies + eventuele nationale bekerwedstrijden.
4. Ontwikkeling van rivaliteit op basis van echte wedstrijden.
5. Buitenlandse competitiewedstrijden en de geplande Europese knock-outronde.
6. Spelers: blessureherstel, training, persoonlijke ontwikkeling; daarna moraal/discipline.
7. `financeWeek`: inkomsten, Europese ontvangsten, lonen, gebouwen, rente en solvabiliteit via dezelfde ledger.
8. Leden, besturen, staf/scouting; winterwindow in week 15 en verlengingen in week 24.
9. `WeekClosed` en hooks.

`closeSeason()`:
1. Buitenlandse competitie en Europa archiveren; buitenlandse spelers verouderen en contracten verstrijken.
2. Feitelijke seizoensprijzen vaststellen voordat spelersstatistieken worden gereset.
3. Algemene ledenvergaderingen, seizoensprijzen, historie en financiën afronden.
4. Support, reputatie, promotie/degradatie en nieuwe rivaliteiten bepalen.
5. Clubidentiteit en opleidingstraditie berekenen uit werkelijk gespeelde minuten van eigen jeugd.
6. Lenen terug, spelers verouderen, jeugdinstroom, vrije spelers, nieuwe budgetten en trainerscontracten.
7. Volgend seizoen beginnen via `startSeason()`.

## Bewaarde individuele geschiedenis
- De waarde `p.history` bevat afgebakende clubperiodes, seizoenen en transfers. `playerCloseStint()` voorkomt dat goals bij de volgende club terechtkomen.
- `p.honours` bevat daadwerkelijk gewonnen bekers en titels; `p.devPath`, `p.style`, `p.ambition`, `p.loyalty` hebben sportieve of economische gevolgen.
- `S.worldAwards` houdt onder andere Golden Boot en doorbraakspeler bij; `S.worldLog` is een begrensd feitenarchief naast de korte eventbus.
- `worldTrends()` berekent stijgende/dalende clubs en jeugdontwikkelaars uit historische resultaten, niet uit scripts.

## Save-schema en historie
- Schema `VERSION=10`, save-key `northmarch-layered-v1`.
- Migratie 8→9 voegt wereldarchieven toe. `expandLegacyPyramid()` vult oude drie-divisiesaves aan tot vijf zonder de bestaande club of lopende tijd te resetten. Reeds gespeelde lagere-divisiewedstrijden worden als synthetische historische stand opgebouwd, **zonder retroactieve inkomsten of blessures**.
- `foreignRestoreCalendar()` reconstrueert ontbrekende buitenlandse weekkalenders bij legacy saves; retroactieve Europese wedstrijden betalen geen inkomsten en verwonden geen Northmarch-spelers.
- `enrichLegacyWorld()` kent ID-deterministische defaults toe voor nieuwe spelersvelden en reconstrueert historische clubtitels waar mogelijk.
- Historische buitenlandse resultaten van vóór de invoering van die wereld bestaan niet. Dit is een daadwerkelijke beperking, geen impliciete migratie.

## Ontwikkelregels en releasegate
Alle nieuwe mechanieken moeten gevolgen hebben voor bestaande simulatiegegevens. Wijzig nooit alleen UI-copy voor een niet-bestaand systeem. Geen merge/deploy zonder expliciete goedkeuring. Statussen staan in `docs/SLIMLINE_WORLD_ROADMAP.md`. Voor deze code zijn **nog geen build, regressietests, 20-seizoenstests of browser-playtests uitgevoerd**.

## Defect repair (2026-11-22, unverified)
- `football/match.js` treats `comp:'cup'` as separate `cupApps/cupGoals`; all new league records and player awards exclude cup goals.
- `world/foreign.js` owns `foreignLedger()` and `foreignBook()`; foreign clubs now pay wages and fixed costs each week, earn media, matchday and Europe revenue and can enter debt-financed administration. Their cash/ledger are separate from domestic `book()`.
- **Single recruitment path:** Northmarch imports are selected by the same director/scout/mandate route as domestic buys. `foreignTransferWindow` is limited to foreign-owned signings/sales and AI domestic departures subject to coverage rules.
- A foreign player can have `sApps/sGoals` in league, `eApps/eGoals` in Europe and persistent partial stints on moving, like a domestic player.
- Foreign league champions and European champions grant true `p.honours`. Foreign academies and domestic youth cultures affect generated talent.
- `foreignClubSheet()` and `worldPlayerSheet()` expose read-only foreign club/player views via the world archive without revealing unscouted exact ability.
- **v10 migration:** if v9 season stats mixed cup/league appearances, the remaining legacy-season Golden Boot is marked provisional. No exact retroactive split exists.
- **Evidence:** no build, runtime tests or browser game review performed for these repairs.
