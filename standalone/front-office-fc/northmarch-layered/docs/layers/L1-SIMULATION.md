# L1 — Slimline: zelfstandig levende voetbalwereld

Bijgewerkt: **2026-11-22** · **Status:** broncode uitgebreid, nieuwe versie nog niet gevalideerd.

## Spelbelofte
Slimline moet over tien tot twintig seizoenen een veranderende voetbalwereld bieden zonder extra scripts of verplicht managementspel. Clubs stijgen en vallen, jeugdspelers breken door, carrières veranderen door transfers, trainers beïnvloeden wedstrijden en sportieve prestaties veranderen de mogelijkheden van een club.

De gebruiker bestuurt één club via bestaande algemene keuzes: beleid, budgetten, personeel en investeringen. Geen tactische opstellingen, individuele transfergoedkeuringen of willekeurige verhaalmomenten in L1.

## Wereldpiramide en kalender
- **Northmarch:** 5 × 16 clubs, 30 speelweken, promotie/degradatie 2 per grens.
- **Nationale beker:** 80 deelnemers, 7 rondes. Lagere divisies spelen eerst; top drie divisies sluiten aan na de voorronde.
- **Europa:** zes landen met elk 12 clubs en 22 speelrondes, plus 16-teamtoernooi in weken 6/11/17/25. Kwalificatie gebruikt de vorige afgeronde competitie.
- Alle wedstrijden verlopen via `advanceWeek()` en `closeSeason()`, niet via onzichtbare seizoenseindgeneratie.
- Buitenlandse clubs houden hun eigen lichte budgetten en selecties; Northmarch-financiën blijven gescheiden en gecentraliseerd in `book()`.

## Functionele lussen
| Lus | Werkelijk oorzaak-gevolg |
|---|---|
| Wedstrijd | Beschikbare elf + niveau + trainer + spelersstijl + recente vorm + thuisvoordeel → kansen/doelpunten → moraal, vorm, tucht, stand |
| Europa | Kwalificatie → tegenstanders → continentale spelersstatistieken en blessures → vermoeidheid volgende week → resultaten en Europese inkomsten |
| Transfers | Positietekort en budget → scouting in meerdere landen → bereidheid speler + akkoord club → fee/salaris → gewijzigde selectie en clubsterkte |
| Spelerscarrière | Speeltijd + academie + leeftijd + karakter + individueel ontwikkelpad → kwaliteit → waardering/contract/carrière/doorbraak |
| Jeugd | Intake → eigen opleiding + minuten/verhuur → groei → eerste elftal, verkoop, prijzen en ontwikkelingscultuur |
| Club | Prestaties + clubhistorie + eigen jeugd + promotie/degradatie + financiën → reputatie en aanhang → toekomstige mogelijkheden |
| Rivaliteit | Echte competitiewedstrijden en bekerspanning → rivaliteitssterkte → derby-attendance en moraal |
| Wereldgeschiedenis | Feiten uit de simulatie → news wire, clubhistorie, spelersprijzen, Europa, seizoenrecap, stijgende en dalende clubs |

## Modules
`src/world/world.js`, `league.js`, `foreign.js`, `awards.js`, `rivalry.js`; `src/football/players.js`, `match.js`, `market.js`, `life.js`; `src/club/finance.js`, `recruitment.js`, `youth.js`; `src/sim/clock.js`; `src/core/save.js`; `src/ui/render.js`, `club.js`, `history.js`.

Zie **`docs/ARCHITECTURE.md`** voor gegevens-eigenaarschap en levenscyclus.

## Savegames en records
- Schema versie 9.
- Bestaande drie-divisiesaves kunnen worden aangevuld met twee lagere divisies zonder bestaande clubdata te resetten. De gereconstrueerde resultaten van vóór migratie zijn niet historisch exact.
- Oude spelers krijgen deterministische identiteitdefaults zonder willekeurige hertekening van bestaande namen/kwaliteiten.
- Contractvertrek, transfers en verhuur worden als afzonderlijke carrièreperiodes bewaard.
- Wereldnieuws en prijzen hebben een aparte geschiedenis naast de kortere eventbus.

## Wat nog niet aangetoond is
1. **Geen nieuwe build en geen tests uitgevoerd** op deze uitbreidingen; eerdere M1-validatie van de drie-divisiewereld is geen bewijs voor deze toestand.
2. Doelverdelingen van resultaten, internationaal transferverkeer en langetermijneconomie over meerdere seeds zijn niet opnieuw gemeten.
3. De buitenlandse clubs hebben een lichte begroting en transfers, geen volledige buitenlandse wage- en stadionboeken.
4. De Europese wedstrijdweergave toont echte resultaten en spelersinformatie maar is nog geen volledige eigen live-commentary-ervaring.
5. Migratie van een lopende oude save kan niet de exacte historische wedstrijden van pas toegevoegde divisies terughalen.
6. De 10–20-seizoenstest en mobiele interfacecontrole moeten nog plaatsvinden voordat zes blokken `COMPLETE` mogen heten.

## Uitdrukkelijke afbakening
L3 staff-agentautonomie, L4 verhaallagen en L5 dynasty zijn geen onderdeel van deze ontwikkelopdracht. Bestaande clubmanagement- en ALV-schermen blijven bruikbaar, maar sturen geen nieuwe geforceerde verhaallus.
