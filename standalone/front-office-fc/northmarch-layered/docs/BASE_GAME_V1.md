# Basisspel V1 — speelbaarheid en plezier zijn de releasegate

Status: in ontwikkeling · 22 november 2026 · werkbranch `chatgpt-basisspel-v1` · issue #7.

## Productbelofte
Het **basisspel (L1 + L2)** is op zichzelf een complete voetbalmanagementgame. Je begint met een bestaande club, kiest een koers, ziet voetbal en geld doorlopen, vergroot of verliest je mogelijkheden, bouwt door na een seizoen en speelt opnieuw. **L3-autonomie, L4-verhalen en L5-dynasty zijn niet nodig om deze game te kunnen spelen of interessant te vinden.**

### Wat is de speler?
Voorzitter van de club. Hij stuurt geld, clubrichting, stafaanstellingen, faciliteiten en financieel risico. Hij kiest **niet** de opstelling, een individuele transfer of tactische instructies. Er is geen verplichte inbox, verhaal of aandachtspunt; de speler bepaalt zijn eigen tempo.

## Plezier = beslissingen met consequenties, niet schermen met getallen

Het spel moet de volgende vier dingen samen leveren:

1. **Een begrijpelijk doel.** Een club heeft vanaf het begin een herkenbare sportieve en financiële uitgangssituatie en een redelijke uitdaging; de speler ziet waarom winnen, promoveren, sparen of investeren aantrekkelijk is.
2. **Echte keuze en opoffering.** Iedere relevante bestuurskeuze kost iets (geld, toekomstig risico, capaciteit, vertrouwen of gemiste kansen) en heeft een plausibele sportieve of financiële uitwerking. Geen gratis, altijd-juiste upgrade.
3. **Snelle feedback zonder magie.** Na iedere speelweek ziet de speler uitslag, verschuivingen, gevolgen en precies één optionele relevante route naar bestaand beleid. Niet alle causaliteit is zeker: onderscheid een rechtstreeks boekhoudkundig effect van een samenhang tussen keuzes en resultaten.
4. **Een reden om door te spelen.** Aan het einde van week 30 verandert de situatie wezenlijk (promotie/degradatie, selectie en contracten, nieuwe budgetten, clubresultaten, toekomstplannen). De volgende seizoenstart mag niet als een herhaling zonder nieuwe afweging voelen.

## Huidige basisloop (geen nieuwe engine)
`Inspecteer de club → stel eventueel beleid in → speel één week → lees echte gevolgen → speel verder → seizoensafsluiting → volgende seizoensfase`.

Systeemgrens: de UI **leest** bestaande `S` en roept bestaande commands aan. `src/ui/week-brief.js` is een projectie van feiten; geen state-eigenaar en geen nieuwe simulatielogica. `advanceWeek()` en `closeSeason()` blijven bij `src/sim/clock.js`.

## Acceptatie per categorie

| Gate | Methode | Vereist voor Basisspel V1 |
| --- | --- | --- |
| V1.1 Functioneel volledig | Spel vanaf clubkeuze tot minimaal drie seizoenen, inclusief competitie, beker, transferwindows, jeugd, financiën, promotie/degradatie en save/load | Geen blokkades, defecte knoppen, dubbele spelers of kapotte kasboeken |
| V1.2 Spelgevoel | Eén menselijke sessie van ten minste 30 minuten, met observatie van spontane keuzes en momenten van verwarring | Speler kan benoemen welke doelstelling hij nastreeft en waarom hij concrete keuzes maakte; plezier niet afleiden uit succes van tests |
| V1.3 Aantoonbare keuzes | Gepaarde scenario's over 5 seizoenen met vaste seeds: conservatief/ambitieus, jeugd/korte termijn, investeren/sparen | Effecten op kracht, resultaten, kas, schuld, staf en jong talent gerapporteerd met spreiding. Bij effectloze knoppen: repareren of verwijderen |
| V1.4 Weekfeedback | Mobile 390px, licht/donker; één duidelijke wekelijkse samenvatting met echte resultaten en één optionele vervolgstap | Geen horizontaal scrollen, alle knoppen werken, geen afgedwongen wekelijkse keuze |
| V1.5 Herhaalbaarheid | Meerdere seeds × 10–20 seizoenen, save/load roundtrips, legacy migraties | Geen onrealistische ontvolking, massale faillissementen, kapotte standen, NaNs of stille save-corruptie |
| V1.6 Schone architectuur | Basisspel kan draaien zonder hogere lagen, domeinlogica niet in UI | Verwijderen van optionele L3 modules breekt het spel niet; S3.1-verwevenheid is een bekende blocker en wordt afzonderlijk verwijderd |
| V1.7 Publicatie | Green CI, browserplaytest, exact officiële SHA, `scripts/sync-check.sh --publish` | Eén werkende standalone HTML uitsluitend vanaf `slimline-main` |

## Uitvoering in beheersbare slices

**V1-A — Weekcyclus (PR #8):** feitelijk compact Week-overzicht, prioriteit uit bestaande signalen, één tap naar bestaande actie, laatste besluit gekoppeld aan observatie, regressie op seizoen en save/load. **Dit is een UX-slice, niet de release.**

**V1-B — Beslissingskwaliteit:** meet bestaande keuzes op werkelijke invloed en kosten; richt je eerst op budget→selectie/sterkte, faciliteiten→jeugd/groei, sponsor/prijs→kas/aanhang. Reparaties alleen bij aangetoonde zwakke schakels.

**V1-C — Voetbal- en economiecontinuïteit:** stop dubbele aanwinsten op dezelfde positie, onderzoek de lage divisie-4 buffer en de langetermijnkwaliteit van spelers. Voorkom schadelijke grote herbouw door per bug een gerichte testcase te maken.

**V1-D — Volledige menselijke speeltest en release:** speel 30–60 minuten op mobiel, noteer concrete momenten van verveling/verwarring en ontbrekende agency, werk ze weg, voer alle gates uit en lever de officiële artifact.

## Onafhankelijkheid

- PR #8 is afgetakt van `slimline-main@a2422c6`. Hij raakt uitsluitend de L1/L2-interface, het buildmanifest, tests en `DEV_STATE.md`.
- De bestaande optionele S3.2-feature en de scheidingsafspraken staan in **aparte** PR #6. Deze niet als een afhankelijkheid voor V1-A gebruiken.
- Geen nieuwe agentstijl, staftevredenheid, verhaalkaart of individuele transfergoedkeuring in deze fase.
- **CI groen ≠ game leuk.** Zowel geautomatiseerde bewijsstukken als menselijke speelsessies zijn nodig.
