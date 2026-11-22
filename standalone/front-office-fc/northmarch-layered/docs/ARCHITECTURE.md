# Slimline — Architectuur en bron van waarheid

Bijgewerkt: **22 november 2026** · Branch: `claude/loving-goodall-uv00vn`

**Bewijsstatus:** Dit document beschrijft de actuele broncode. De nieuwe wijzigingen aan de vijf-divisiewereld, internationale markt en alle zes blokken zijn **niet** via een build, tests of browser-playtest gevalideerd. Oudere testclaims gelden niet automatisch voor deze wijzigingen.

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
| Opslag | `core/save.js` | versie 9, migraties 1→9, legacy-piramideherstel |
| UI | `ui/render.js`, `ui/club.js`, `ui/history.js` | week, selecties, wereldarchief en seizoensreview |

`build.js` bundelt in vaste volgorde `core` → `world` (inclusief foreign, awards, rivalry) → `football` → `club` → `sim` → `save` → `ui`. De outputlocatie blijft `dist/northmarch-layered.html`.

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
- Schema `VERSION=9`, save-key `northmarch-layered-v1`.
- Migratie 8→9 voegt wereldarchieven toe. `expandLegacyPyramid()` vult oude drie-divisiesaves aan tot vijf zonder de bestaande club of lopende tijd te resetten. Reeds gespeelde lagere-divisiewedstrijden worden als synthetische historische stand opgebouwd, **zonder retroactieve inkomsten of blessures**.
- `foreignRestoreCalendar()` reconstrueert ontbrekende buitenlandse weekkalenders bij legacy saves; retroactieve Europese wedstrijden betalen geen inkomsten en verwonden geen Northmarch-spelers.
- `enrichLegacyWorld()` kent ID-deterministische defaults toe voor nieuwe spelersvelden en reconstrueert historische clubtitels waar mogelijk.
- Historische buitenlandse resultaten van vóór de invoering van die wereld bestaan niet. Dit is een daadwerkelijke beperking, geen impliciete migratie.

## Ontwikkelregels en releasegate
Alle nieuwe mechanieken moeten gevolgen hebben voor bestaande simulatiegegevens. Wijzig nooit alleen UI-copy voor een niet-bestaand systeem. Geen merge/deploy zonder expliciete goedkeuring. Statussen staan in `docs/SLIMLINE_WORLD_ROADMAP.md`. Voor deze code zijn **nog geen build, regressietests, 20-seizoenstests of browser-playtests uitgevoerd**.
