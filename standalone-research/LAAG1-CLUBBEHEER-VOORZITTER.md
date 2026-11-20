# Laag 1: clubbeheer

*21-11-2026, concept v2. Volgens het sjabloon uit `LAGENMODEL-VOORZITTER.md`. Gaat alleen over het terrein, de gebouwen en de afdelingen.*

## 1. Bezit (alleen deze laag verandert dit)
- **Het terrein:** 6 kavels. Een kavel is leeg, bebouwd of in aanbouw.
- **Gebouwen:** het type, een niveau (1–5), een staat (0–100%) en de jaarlijkse onderhoudsbehoefte.
- **Afdelingen** (6): wedstrijddag, training en medisch, academie, scouting, commercie, gemeenschap. Elke afdeling heeft:
  - een **budgetniveau** (krap / normaal / ruim);
  - een **koers**, één identiteitskeuze, bijvoorbeeld academie *eigen regio* of *breed*, of wedstrijddag *sfeer* of *comfort*.
- **Bouwprojecten:** fase (vergunning → bouw → oplevering), voortgang, en de gebeurtenissen onderweg.

## 2. Níét van deze laag
| Onderwerp | Hoort bij |
|---|---|
| Kaartprijzen, sponsors, merchandise-opbrengst, lenen | Laag 2, financiën |
| Wie een afdeling leidt (eigenschappen, ambitie, loyaliteit) | Laag 3, mensen. Laag 1 kent alleen de **rol**. |
| Hoe goed de selectie wordt door training en academie | Laag 4, voetbal. Laag 1 levert alleen het **niveau**. |
| Wat ledengroepen ervan vinden | Laag 5, leden. Laag 1 stuurt alleen een **voorkeurssignaal**. |
| Grond, vergunning, de buurt | Laag 6, wereld. Laag 1 vraagt erom en ontvangt het antwoord. |

## 3. Mechanieken
1. **Beperkte kavels:** je kunt nooit alles bouwen. Wat er staat, bepaalt het profiel van je club. Een extra kavel komt alleen via laag 6 (de gemeente of een grondaankoop).
2. **Gebouwen en wat ze opleveren** (het niveau bepaalt hoeveel):

   | Gebouw | Levert het signaal | Afdeling |
   |---|---|---|
   | Staantribune / zittribune / hoofdtribune | `capaciteit`, `sfeer` / `comfort`, `business-seats` | Wedstrijddag |
   | Trainingsveld | `trainingsniveau` | Training en medisch |
   | Medisch centrum | `medisch niveau` | Training en medisch |
   | Academiegebouw | `academieniveau` | Academie |
   | Scoutingkantoor | `scoutingbereik` | Scouting |
   | Fanshop | `commerciële ruimte` | Commercie |
   | Clubhuis | `gemeenschapsruimte` | Gemeenschap |
   | Parkeerplaats | `bereikbaarheid` (+capaciteit), `hinder` | Wedstrijddag |

3. **Combinaties binnen deze laag:** gebouwen die samen meer opleveren dan los.
   - **Jeugdcomplex:** academiegebouw + trainingsveld geeft +1 `academieniveau`.
   - **Wedstrijddag:** tribune + fanshop + clubhuis geeft een bonus op `sfeer`.
   - **Topsportcentrum:** trainingsveld + medisch centrum verlaagt het `blessurerisico`.
4. **Bouwen in fasen met risico:**
   - **vergunning:** de aanvraag gaat naar laag 6;
   - **bouw:** kans op vertraging of een overschrijding van 10–30%;
   - **oplevering.**
   Hoe goed het hoofd van de afdeling is (signaal van laag 3), verkleint die kansen.
5. **Staat en verval:**
   - zonder onderhoud zakt de staat per seizoen, en het signaal zakt mee;
   - een staat onder 30% leidt tot een keuring, met kans op sluiting.
6. **Afdelingsbudget:** het niveau bepaalt de lopende kosten (aangevraagd bij laag 2) en hoe snel de staat herstelt.
7. **Koers per afdeling:** verandert *welk* signaal de afdeling sterker maakt. Een koerswissel kost een seizoen om in te werken.

## 4. Acties van de speler (altijd, via de agenda)
- **Bouwen** op een lege kavel.
- **Ombouwen of slopen** (duur; laat een spoor na).
- **Onderhoud plegen** aan een gebouw.
- **Het budgetniveau** van een afdeling wijzigen.
- **De koers** van een afdeling wijzigen.
- **Een afdeling bezoeken**: een kans op een verbeteridee, en een motivatiesignaal naar laag 3.

## 5. Signalen uit (naar andere lagen)
| Signaal | Naar |
|---|---|
| Kosten: bouw, onderhoud, afdelingsbudget | 2 Financiën |
| `capaciteit`, `commerciële ruimte`, `business-seats` | 2 Financiën (inkomsten) |
| Rol en vacature per afdeling | 3 Mensen |
| `trainingsniveau`, `academieniveau`, `medisch niveau`, `scoutingbereik`, `thuisvoordeel` | 4 Voetbal |
| Voorkeurssignaal per gebouw, bijvoorbeeld *staantribune* of *business-seats* | 5 Leden |
| `hinder` (lawaai, parkeren) | 6 Wereld |

## 6. Signalen in (van andere lagen)
| Signaal | Van |
|---|---|
| Budget goedgekeurd of geweigerd | 2 Financiën |
| Kwaliteit van het hoofd per afdeling | 3 Mensen |
| Ledenbesluit voor grote bouw | 5 Leden |
| Grond, vergunning, buurtbezwaar | 6 Wereld |

## 7. Inspiratie
| Spel | Wat we overnemen | Wat níét |
|---|---|---|
| **Motorsport Manager** | Gebouwen met een niveau, bouwtijd en onderhoud, die een vermogen ontgrendelen | Een grote techboom |
| **Two Point Hospital** | Ruimtes die samen meer opleveren | Inrichting tot op de vierkante meter |
| **Football Manager** | Faciliteiten duren seizoenen en zijn merkbaar in de club | Menu's vol getallen |
| **Anno** | Beperkte ruimte dwingt een profiel af | Productieketens |
| **Hometown FC** | Investeren dat de omgeving verandert | Bezit en fortuin (keuze 77) |

## 8. Voorbeelden (binnen de laag; signalen naar buiten tussen haakjes)
1. **De staantribune.** Kavel 3 wordt een staantribune: £45k (→ financiën), 14 weken. Bij de vergunning (→ wereld) komt er buurtbezwaar. Na de oplevering: `capaciteit` +900, `sfeer` +2 (→ financiën, voetbal), en een voorkeurssignaal *staantribune* (→ leden).
2. **Het jeugdcomplex.** Het academiegebouw staat naast het trainingsveld, dus combinatiebonus: `academieniveau` +1 (→ voetbal). De koers *eigen regio* maakt het signaal sterker voor talent uit de buurt.
3. **Het verval.** Drie seizoenen geen onderhoud aan de hoofdtribune: de staat daalt naar 28% en er volgt een keuring. Je kiest tussen dringend onderhoud (£20k, → financiën) of een gesloten vak voor 6 weken, waardoor `capaciteit` −1.200 (→ financiën, leden).

## 9. Open vragen voor de eigenaar
1. Zes kavels en zes afdelingen: goed voor mobiel, of minder?
2. Een budgetniveau per afdeling (krap / normaal / ruim): akkoord?
3. Koerswissel na een seizoen inwerken: akkoord?
