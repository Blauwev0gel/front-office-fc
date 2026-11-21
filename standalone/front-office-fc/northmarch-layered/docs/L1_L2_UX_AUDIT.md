# L1/L2 — UX- en functionaliteitsaudit

Commit `d94fcf3`. Bronnen: code (`src/`), alle tests (`tests/`), gemeten browserronde 390 px, schermen in `L1_L2_SCREEN_INVENTORY.md`, acties in `L1_L2_ACTION_MATRIX.md`.

## Gameplay-loops (beslissing → systeem → tijd → gevolg → zichtbaar)
| Loop | Werkt in simulatie (bewijs) | Zichtbaar voor de speler | Klasse |
|---|---|---|---|
| Scouting → bereik → keuzes directeur | ✓ (reach, ab-test) | spelers gezien per zoektocht in afdeling | 2 werkend, beperkt zichtbaar |
| Academie → jeugdinstroom → selectie | ✓ (ab-test) | beste potentieel laatste lichting | 2 |
| Medisch → blessures → beschikbaarheid | ✓ (−32%) | blessureweken vs divisie | 1 werkend en zichtbaar |
| Trainer → prestaties | ✓ (+4,5 pt) | sterren, specialisme; geen terugblik | 2 |
| Stadion → capaciteit → inkomsten → kas | ✓ (projects-test) | capaciteit, recette per week; geen voor/na | 2 |
| Prijzen → publiek → recette → leden | ✓ (ab, members-test) | verwachte opkomst; geen recette/leden-voorspelling | 2 |
| Sponsor → inkomsten → (naamrecht) vertrouwen | ✓ (commercial-test) | weekbedrag; geen looptijdwaarde | 2 |
| Loonbeleid → kwaliteit → risico | ✓ (commercial-test) | loonlimiet, loonsom; effect pas in transferperiode | 2 |
| Afdelingsbudget → prestaties → kosten | ✓ (deptF) | kosten per week | 2 |
| Resultaten → vertrouwen → ALV | ✓ (members-test) | oorzaken per seizoen, ALV-prognose | 1 |
| Personeel afdeling → signaal | ✓ (staff ab-test) | kosten, wervingstijd | 2 |
| Kaarten/moraal/verhuur | ✓ (life-test) | badges, moraal | 1 |

Geen defecte loops gevonden. Vrijwel alle loops zijn **werkend maar onvoldoende zichtbaar**: de speler kan kiezen, maar niet terugzien wat zijn keuze deed.

## Problemen (geprioriteerd)
1. **Geen bestuurlijk overzicht.** Er is geen plek die in één blik sport, geld, leden, staf, afdelingen, grond en risico's toont.
2. **Club-tab is een lange stapel** (3,9 schermen) met leden, staf, acht afdelingen, grond, vergelijking, historie, lagen.
3. **Play-knop onder de vouw** op de Week-tab; Week mengt urgente signalen met informatie.
4. **Beslissingen missen consistente informatie**: wat kost het nu, per week, wanneer werkt het, wat kan het opleveren, wat is het risico, hoe meet ik het.
5. **Geen terugkoppeling van besluiten**: geen besluitenlog met toestand toen versus nu.
6. **Seizoensreview** toont doelen niet per doel en niets over het volgende seizoen.
7. **Money (6) en Tables (6) subtabs**; namen dekken de inhoud niet volledig.
8. **Nieuwe speler krijgt geen oriëntatie** op zijn verantwoordelijkheden.
9. Uitslag: verwachte goals (al berekend) niet getoond; positieverandering niet getoond.

## Open validatiepunten uit eerdere pakketten
- AI-clubs komen bijna nooit in financiële nood (0–1 administrations per 20 seizoenen).
- Gemiddelde spelersleeftijd zakt naar ±22.
- Strategietest met verschillende voorzitters ontbreekt.

## Implementatieplan
| Sprint | Inhoud |
|---|---|
| 1 Navigatie & overzicht | Tabs Week · Club · Squad · Money · League; Club met subnavigatie Overview · Football · Departments · Ground · Members; bestuurlijk overzicht; vaste actiebalk onderin (Play/Close); oriëntatiekaart voor nieuwe voorzitters; Money naar 4 subtabs |
| 2 Beslishelderheid | één beslisblok (nu · per week · wanneer · verwacht · risico · meten) bij afdelingen, staf, bouw, prijzen, contributie, leningen, obligatie, sponsor, kader, stadion; kandidaat vs huidige trainer |
| 3 Gevolgen & feedback | besluitenlog met meetwaarde toen/nu en voorbehoud; projectvoortgang; afdelingstrend vorig seizoen |
| 4 Weekflow | Week: verslag (met positieverandering, verwachte goals) → urgent → kansen → volgende wedstrijd → doelen; seizoensreview met doelen per doel en vooruitblik |
| 5 Validatie | strategietest 6 scenario's, balans leeftijd en AI-risico, browsertest mobiel + desktop, save/load, documentatie |
