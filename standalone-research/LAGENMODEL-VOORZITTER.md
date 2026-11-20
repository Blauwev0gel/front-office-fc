# Het lagenmodel van De Voorzitter

*21-11-2026. De bouwtekening: welke lagen er zijn, wat elke laag bezit, en hoe ze met elkaar praten. Elke laag wordt apart uitgewerkt in een `LAAGn-…`-document.*

## Drie dingen die we gescheiden houden
| Begrip | Wat het is | Waar |
|---|---|---|
| **Speellagen** | De inhoud die de speler speelt. Wordt laag voor laag ontworpen. | Dit document en `LAAGn-…` |
| **Tijdslagen** | Het ritme: moment, sessie, week, seizoen, generatie | `LOOP-DYNASTIE-VOORZITTER.md` |
| **Engine-opbouw** | Hoe het technisch draait: systemen, agenten, speler | `ENGINE-VOORZITTER.md` |

In dit document gaat het **alleen over de speellagen.**

## De zeven speellagen
| # | Laag | Bezit (alleen deze laag verandert dit) | De speler doet hier |
|---|---|---|---|
| **1** | **Clubbeheer** | Het terrein en de kavels, de gebouwen (niveau, staat), de afdelingen (budgetniveau, koers), bouwprojecten | Bouwen, ombouwen, onderhouden, afdelingen inrichten |
| **2** | **Financiën** | Kas, schuld, inkomstenstromen (kaarten, sponsors, merchandise, tv), kostenposten, de bank en investeerders | Prijzen zetten, deals sluiten, lenen, de begroting verdelen |
| **3** | **Mensen** | Alle personen: eigenschappen, ambitie, loyaliteit, relaties, gunsten. Aanstellingen. | Aannemen, ontslaan, gesprekken, beloftes aan personen |
| **4** | **Voetbal** | Selectie, wedstrijden, stand, speelstijl, transfers (via de TD) | Kaders aan trainer en TD, de stijlwens; nooit de opstelling |
| **5** | **Leden en politiek** | Ledengroepen (aandeel, stemming, eisen), steun %, statuten, moties, de ALV, beloftes aan de leden | Groepen bezoeken, coalities, moties, de verkiezing |
| **6** | **Wereld** | Competitie, rivaliserende clubs, de stad (gemeente, buurt, pers), de markt | Reageren op kansen; de wereld simuleert zichzelf |
| **7** | **Dynastie** | De familie (leeftijd, pad, eigenschappen), familiereputatie, vetes en verbonden, de opvolging | Familieleden een plek geven, je erfgenaam klaarstomen, verbonden |

**Regel 1:** een laag verandert alleen zijn eigen bezit. Wil laag 1 iets met geld, dan *vraagt* hij dat aan laag 2.

**Regel 2:** lagen praten **alleen via signalen**, zie hieronder. Zo kan elke laag apart worden ontworpen, getest en vervangen.

## Signalen tussen de lagen
**Een signaal** is een benoemde uitvoer van één laag die andere lagen lezen. Bijvoorbeeld:
- `facility.capacity` = de stadioncapaciteit, uit laag 1;
- `money.paid` = betaald of geweigerd, uit laag 2;
- `fans.mood[groep]` = de stemming van een ledengroep, uit laag 5.

| Van ↓ / naar → | 1 Clubbeheer | 2 Financiën | 3 Mensen | 4 Voetbal | 5 Leden | 6 Wereld | 7 Dynastie |
|---|---|---|---|---|---|---|---|
| **1 Clubbeheer** | — | kosten (bouw, onderhoud), capaciteit, commerciële ruimte | rol en vacature per afdeling | trainingsniveau, academieniveau, medisch niveau, thuisvoordeel | voorkeurssignaal per gebouw (wat een groep wel of niet wil) | hinder voor de buurt | — |
| **2 Financiën** | goedgekeurd budget per project en afdeling | — | lonen beschikbaar | transferbudget, loonplafond | prijzen en deals als voorkeurssignaal | sponsors | — |
| **3 Mensen** | kwaliteit van het hoofd per afdeling | — | — | kwaliteit en stijl van trainer en TD | invloed van leiders | — | familieleden als personen |
| **4 Voetbal** | — | resultaten (gate, prijzengeld), transfersaldo | prestaties en moraal van personen | — | resultaten, derby's | stand | — |
| **5 Leden** | goedkeuring van grote bouw (ledenbesluit) | goedkeuring van grote uitgaven en lenen | eisen aan personen | verwachtingen | — | — | stem bij de opvolging |
| **6 Wereld** | grond, vergunning, buurtbezwaar | sponsoraanbod, rente | kandidaten (staf), rivalen | tegenstanders, markt | pers | — | rivaliserende families |
| **7 Dynastie** | — | — | familieleden als kandidaat | een kind in de academie | familiereputatie | verbonden | — |

## Hoe we elke laag uitwerken (een vast sjabloon)
1. **Bezit:** wat alleen deze laag bijhoudt.
2. **Níét van deze laag:** wat bewust in een andere laag zit.
3. **Mechanieken:** de regels binnen de laag.
4. **Acties van de speler** in deze laag.
5. **Signalen uit:** wat deze laag andere lagen geeft.
6. **Signalen in:** wat deze laag van andere lagen leest.
7. **Inspiratie:** spellen, met wat we overnemen en wat níét.
8. **Voorbeelden** binnen de laag, met signalen naar buiten aangegeven.
9. **Open vragen.**

## Volgorde van uitwerking
1. **Clubbeheer** → 2. **Financiën** → 3. **Mensen** → 4. **Leden en politiek** → 5. **Dynastie** → 6. **Wereld** → 7. **Voetbal**.

Voetbal komt als laatste: die laag bestaat al grotendeels in de code. De volgorde volgt de vraag van de eigenaar: eerst het runnen van de club, dat altijd kan.
