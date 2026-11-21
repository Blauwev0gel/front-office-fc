# Laag 4: voetbal

*22-11-2026. Beschrijft wat er **in de code bestaat** (`voorzitter-fundering`), volgens het sjabloon uit `LAGENMODEL-VOORZITTER.md`. Jij bent voorzitter: je stelt kaders, en je kiest nooit de opstelling.*

## 1. Bezit (alleen deze laag verandert dit)
- **De selectie** (`club/players.js` `newPlayer`), per speler:
  - positie;
  - leeftijd;
  - **kwaliteit** (`q`) en **potentieel** (`pa`);
  - loon;
  - contract van 1–3 seizoenen;
  - vorm;
  - moraal;
  - blessure;
  - één eigenschap (leader, professional, temperamental, injury-prone, local hero, quiet);
  - academiespeler of niet;
  - huur;
  - wedstrijden, goals en mijlpalen.
- **De competitie** (`world/football.js`, `world/world.js`):
  - **twee divisies van 16 clubs** (Northmarch Premier en Northmarch One);
  - 30 speelrondes;
  - de stand;
  - promotie en degradatie.

  Keuze 82: dit worden vier divisies (zie §8).
- **Transfers:**
  - de **transferzomer** als eigen seizoen van zes weken (`club/summer.js`): plan, doelen, onderhandelingsfasen, verkopen, geruchten, deadline, debriefing en een cijfer;
  - de **winterperiode** (`tdWindow('winter')`, week 15);
  - **vrije spelers** in een vaste pool in de regio (`club/market.js`);
  - **verlengingen** in weken 20–26;
  - **de academie:** elke zomer twee spelers van 17.
- **Het mandaat,** de kaders van de TD (`chairman/meeting.js` `PILLARS`):

  | Pijler | Vraag |
  |---|---|
  | Ambitie | Wat wil je van dit seizoen? |
  | Risico | Hoeveel geld zet je op het spel? |
  | Identiteit | Wat voor club zijn we? |
  | Loonhuis | Hoe betalen we mensen? |
  | Verkopen | Wanneer verkopen we? |
  | KPI | Waarop beoordeel je de TD volgend jaar? |

  Daarnaast een transferbudget, een loonplafond per speler, een profiel en **huisregels**. Voorbeelden van huisregels: nooit aan de rivaal verkopen, de aanvoerder blijft, eigen jongens worden niet verkocht, altijd vijf academiespelers.

## 2. Níét van deze laag
| Onderwerp | Hoort bij |
|---|---|
| Wie de TD en de trainer zijn, hun loyaliteit | 3 Mensen |
| Geld, de kas, wat een transfer kost aan rente | 2 Financiën. Laag 4 meldt alleen transfersaldo en loonsom. |
| Trainingsveld, academiegebouw, medisch centrum | 1 Clubbeheer. Laag 4 zou de niveaus moeten lezen (nog niet). |
| Wat de leden van een verkoop vinden | 5 Leden |

## 3. Mechanieken (zoals gebouwd)
1. **De basiself kiest zichzelf** (`pickXI`): de beste speler per plek, met positievervangers en een eventuele jeugdvoorkeur. Spelers uit positie worden bijgehouden (`oopWeeks`).
2. **Teamsterkte** (`squadQuality` → `qualityToStr`) bepaalt de verwachte goals (`lambdas`). De uitslag volgt uit een Poisson-verdeling (`simRound`). Thuisvoordeel, vorm en effecten (`addMod`) tellen mee.
3. **Per week:** blessures (*injury-prone* ×2), herstel en een vormschommeling (`clubWeek`).
4. **Per seizoen:** jonge spelers groeien naar hun potentieel, spelers vanaf 31 gaan achteruit, contracten lopen af en spelers vanaf 35 stoppen (`clubSeasonEnd`).
5. **De TD handelt zelf binnen het mandaat:**
   - kopen en verkopen volgens zijn filosofie, zijn vaardigheden en jouw kaders;
   - zijn **oog** bepaalt of zijn *A-cijfer* voor een aanwinst klopt (getest in `td-test`).
6. **De gaten in de selectie** (`squadGaps`): te kort, uit positie en aflopende contracten. Daaruit maakt de TD zijn plan (`cfPlan`).

## 4. Acties van de speler
- **Het mandaat** in de zomervergadering, en het bijstellen van kaders (`setFrame`).
- **Een TD of trainer aannemen,** via laag 3.
- **Een vrije speler laten tekenen** (`signFreeAgent`).
- **De toets op de wedstrijddag** en reacties (`chairman/reactions.js`): een paar momenten per wedstrijd die aan jouw keuzes gekoppeld zijn.
- **De transferzomer volgen:** de ticker, de krant en het tussentijds ingrijpen dat het mandaat toestaat.

## 5. Signalen uit
| Signaal | Naar |
|---|---|
| Loonsom, transfersaldo | 2 Financiën |
| Resultaten, stand, derby's | 2 (inkomsten), 5 (stemming, beloftes) |
| Verkopen van sleutelspelers, debuten, speeltijd van talent | 3 (verhalen), 5 (beloftes) |
| Stand, promotie en degradatie | 6 Wereld |

## 6. Signalen in
| Signaal | Van |
|---|---|
| Transferbudget, loonplafond, verkoopopdracht | 2 Financiën en het mandaat |
| De kwaliteit en vaardigheden van de TD en trainer | 3 Mensen |
| *Nog niet:* trainingsniveau, medisch niveau, academieniveau, scoutingbereik, veldkwaliteit, thuisvoordeel | 1 Clubbeheer |
| Tegenstanders, markt, zetten van rivalen | 6 Wereld |

## 7. Wat de speler ziet
- Het *Squad*-tabblad: de basiself, posities en vorm.
- Spelersprofielen met een verhaal en een sparkline van de vorm.
- De transferzomer: brief, ticker, krant en debriefing met een analyse van wat er gewonnen en verloren is.
- De wedstrijdkaart en de uitslag.

## 8. Wat ontbreekt
1. **Gebouwen merkbaar maken:** training op de groei van spelers, medisch op blessures, academie op de kwaliteit van jeugdspelers, scouting op het oog van de TD, veld en sfeer op het thuisvoordeel. Dit is de belangrijkste koppeling.
2. **Vier divisies** (keuze 82) in plaats van twee, met de start in de vierde.
3. **Een speelstijl of clubfilosofie** die over seizoenen groeit en die leden verwachten.

## 9. Status
**4 Speelbaar.** De rijpste laag; het mandaat is getest (`mandate-*`, `foundation-test`, `td-test`).
