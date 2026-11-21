# Laag 1: clubbeheer (v3, FM-diepte)

*22-11-2026, v3, concept na keuze 80 (maatstaf Football Manager, stadion zo diep als FM, diep systeem met samenvatting en doorklik). Vervangt v2 (keuze 78). Punten met ❓ zijn open. Gaat alleen over het terrein, het stadion, de gebouwen en de afdelingen. Geld komt uit laag 2.*

## 0. Schaal van de startclub (❓ voorstel)
- Een ledenvereniging in de **derde van vier fictieve divisies**: 6.800 plaatsen, omzet ±£2,4m per seizoen.
- Alle bedragen hieronder gaan uit van die schaal en groeien mee met de divisie.

## 1. Bezit (alleen deze laag verandert dit)
1. **Het stadion:**
   - vier zijden (N, O, Z, W), elk met een tribune en eigen onderdelen;
   - het veld;
   - de stadionvoorzieningen.
2. **Het clubterrein:** 6 kavels voor het complex (training, academie, commercie, gemeenschap).
3. **Onderdelen:** elk onderdeel heeft:
   - een **niveau** 1–8;
   - een **staat** 0–100%;
   - **onderhoudskosten** per seizoen;
   - een **afschrijving**, de levensduur in seizoenen.
4. **Afdelingen** (6), elk met:
   - een budgetniveau (krap / normaal / ruim);
   - een koers;
   - een rol voor het hoofd (wie dat is, beslist laag 3).
5. **Bouwprojecten:**
   - fase en voortgang;
   - de gekozen aannemer;
   - de gebeurtenissen onderweg;
   - de tijdelijke sluitingen.
6. **De stadionvergunning:** de veiligheidscertificering, met een maximale capaciteit.

**Niveaunamen** (eigen ladder):

| Niveau | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| Naam | Bare | Basic | Fair | Solid | Good | Strong | Elite | Landmark |

## 2. Níét van deze laag
| Onderwerp | Hoort bij |
|---|---|
| Prijzen, omzet uit horeca, skyboxen en de fanshop, leningen | 2 Financiën. Laag 1 levert de **ruimte**, laag 2 de **opbrengst**. |
| Wie een afdeling leidt, de staf en hun kwaliteit | 3 Mensen |
| Hoe spelers beter worden | 4 Voetbal. Laag 1 levert **niveaus**. |
| Wat leden ervan vinden | 5 Leden. Laag 1 stuurt **voorkeurssignalen**. |
| Grond, vergunning, buurt, licentie-eisen van de bond | 6 Wereld. Laag 1 meldt of hij **aan de eisen voldoet**. |

## 3. Het stadion

### 3.1 Tribunes, per zijde
| Onderdeel | Opties en niveaus | Effect |
|---|---|---|
| **Type** | Staan · zit · gemengd · hoofdtribune (alleen W of O) | Staan: 1 m² ≈ 1,8 plaats en `sfeer` hoger. Zit: 1 plaats en `comfort` hoger. |
| **Omvang** | Rijen; elke uitbreiding met één ring is een bouwproject | `capaciteit` van de zijde |
| **Overkapping** | Geen · deels · volledig | `comfort` +; opkomst bij regen −0%/−6%/−12% minder hard; `sfeer` + (geluid blijft hangen) |
| **Uitvak** | Een vak op deze zijde aanwijzen, met segregatie 1–8 | Verplicht voor licentie; risico op incidenten omlaag |
| **Toegang** | Draaihekken 1–8 | Instroom; onder de eis daalt de vergunde capaciteit |

### 3.2 Het veld
| Onderdeel | Niveau | Effect |
|---|---|---|
| **Grasmat** | 1–8 | `veldkwaliteit` (naar voetbal); slijt per thuisduel, sneller bij regen |
| **Drainage** | 1–8 | Kans op afgelasting bij zware regen: 12% bij niveau 1, 0% bij niveau 8 |
| **Veldverwarming** | Ja/nee | Geen afgelasting door vorst |
| **Kunstgras** | ❓ Optie, onomkeerbaar | Geen slijtage; `veldkwaliteit` vast op 5; sommige divisies verbieden het; de Old Guard is tegen |

### 3.3 Stadionvoorzieningen
| Onderdeel | Niveau | Levert het signaal | Opmerking |
|---|---|---|---|
| **Verlichting** (lux) | 1–8 | `tv-geschikt`, avondduels | Divisie 2 vraagt minstens niveau 4 |
| **Horeca** (kiosken) | Aantal × niveau | `horecaruimte` | Wachtrijen kosten omzet als het aantal te laag is voor de opkomst |
| **Business club** | 1–8 | `business-seats` | Alleen op de hoofdtribune |
| **Skyboxen** | 0–20 stuks | `skyboxen` | Alleen op de hoofdtribune; grote verbouwing |
| **Persruimte en media** | 1–8 | `media` | Licentie-eis; beter niveau geeft meer tv-aandacht |
| **Veiligheid** (CCTV, EHBO, controlekamer) | 1–8 | `veiligheid` | Bepaalt samen met de toegang de **vergunde capaciteit** |
| **Toegankelijkheid** | 1–8 | `toegankelijk` | Licentie-eis; voorkeur van de Families |
| **Scorebord en schermen** | 1–8 | `beleving` | Kleine bonus op `comfort` en op de reclame-inkomsten |

### 3.4 De vergunde capaciteit
> vergunde capaciteit = min( Σ capaciteit van de zijden, toegangslimiet, veiligheidslimiet )

- Een slechte staat (<30%) van een zijde: dat vak gaat dicht na een keuring.
- **Jaarlijkse keuring** in week 1. Een onderdeel onder de eis verlaagt de vergunning tot het is opgelost.

## 4. Het clubterrein (6 kavels)
Elke kavel krijgt één complex. Elk complex heeft eigen onderdelen.

| Complex | Onderdelen (elk 1–8) | Signalen | Afdeling |
|---|---|---|---|
| **Trainingscomplex** | Velden (1–4 stuks) · gym · overdekte hal · analyse-ruimte | `trainingsniveau` | Training en medisch |
| **Medisch centrum** | Behandelkamers · hydro · revalidatie · sportwetenschap | `medisch niveau`, `blessurerisico` ↓, `hersteltijd` ↓ | Training en medisch |
| **Academie** | Jeugdvelden · onderwijs en internaat · jeugdstaf-ruimte | `academieniveau` (faciliteiten) | Academie |
| **Scoutingkantoor** | Video en data · reisbudget-ruimte | `scoutingbereik` (aantal regio's), `scoutingdiepte` | Scouting |
| **Commercieel centrum** | Fanshop · webshop-magazijn · evenementenzaal | `winkelruimte`, `evenementenruimte` | Commercie |
| **Clubhuis** | Ledenbar · vergaderzaal · jeugdhonk | `gemeenschapsruimte`, `ledenbinding` | Gemeenschap |
| **Parkeerterrein** | Plaatsen · busbaan | `bereikbaarheid` (opkomst +), `hinder` | Wedstrijddag |

**Jeugd, zoals in FM in drie delen:**
- **faciliteiten:** het academiecomplex;
- **jeugdwerving:** het netwerk, via het budget en de koers van de academie;
- **jeugdtraining:** het budget en de staf (laag 3).

Het signaal `academieniveau` bestaat uit alle drie samen.

**Combinaties:**
- **Jeugdcomplex:** academie + trainingscomplex naast elkaar geeft +1 `academieniveau`.
- **Topsportcentrum:** trainingscomplex + medisch centrum geeft −15% `blessurerisico`.
- **Thuisgevoel:** clubhuis + commercieel centrum + een staantribune geeft `sfeer` +1.

## 5. Formules (de diepte onder de motorkap)
- **Effectief niveau** van een onderdeel:
  > niveau × (0,5 + 0,5 × staat) × budgetfactor × koersfactor

  met budgetfactor krap 0,85 / normaal 1,0 / ruim 1,1, en koersfactor 1,15 op het signaal waar de koers op stuurt.
- **Een signaal** is het gewogen gemiddelde van de effectieve niveaus van de onderdelen die het leveren, plus de combinatiebonussen.
- **Verval per seizoen:**
  > −(8% tot 20% volgens het gebruik) + herstel

  met herstel = onderhoudsbudget ÷ onderhoudsbehoefte × 15%. Een grasmat slijt per wedstrijd.
- **Onderhoudsbehoefte:** ±4% van de bouwwaarde per seizoen.
- **Afschrijving:** de bouwwaarde ÷ levensduur (tribune 30, velden 10, techniek 8 seizoenen). Die waarde gaat naar de balans van laag 2.

## 6. Bouwen en verbouwen
1. **Haalbaarheid:** de speler ziet de kosten, de bouwtijd, de effecten, de onderhoudskosten en de sluitingen.
2. **Vergunning** (laag 6), 2–12 weken. Kans op buurtbezwaar bij `hinder`.
3. **Aannemer kiezen** uit drie offertes:

   | Offerte | Prijs | Overschrijding | Vertraging |
   |---|---|---|---|
   | Goedkoop | −15% | 35% kans op +10–30% | 30% kans |
   | Standaard | — | 15% kans | 15% kans |
   | Premium | +20% | 5% kans | 5% kans |

   Een goed afdelingshoofd (laag 3) verlaagt die kansen.
4. **Bouw:** de voortgang loopt per week. Gebeurtenissen onderweg zijn bijvoorbeeld een vondst in de grond, een staking of een aannemer die failliet gaat.
5. **Sluitingen:** een tribune in verbouwing kost capaciteit. Bouwen in de zomerstop sluit niets, maar kan maar 8 weken duren.
6. **Oplevering:** nieuwe onderdelen beginnen op staat 100%.
7. **Ombouwen en slopen:** ombouwen kost 60% van nieuwbouw; slopen 10%, en dat laat een spoor na bij de leden.
8. **Grote bouw** (>15% van de omzet) vraagt een ledenbesluit (laag 5).

**Kosten** (schaal derde divisie, ❓ af te stemmen in stap 5):

| Project | Kosten | Bouwtijd |
|---|---|---|
| Een ring staantribune (+900) | £180k | 14 wkn |
| Een ring zittribune (+600) | £240k | 16 wkn |
| Overkapping van een zijde | £120k | 10 wkn |
| Verlichting +1 | £40k | 3 wkn |
| Skybox | £35k per stuk | 6 wkn |
| Trainingsveld | £60k | 8 wkn |
| Medisch centrum, niveau 1 | £150k | 20 wkn |
| Academie, niveau 1 | £200k | 26 wkn |

Elk volgend niveau kost ×1,6.

## 7. Afdelingen
| Afdeling | Koersen (❓) | Wat het budget doet |
|---|---|---|
| Wedstrijddag | *Sfeer* · *comfort* | Stewards, schoonmaak, horeca-personeel; staat stadion |
| Training en medisch | *Fitheid* · *ontwikkeling* | Materiaal, herstel; staat van het complex |
| Academie | *Eigen regio* · *breed* | Jeugdwerving en jeugdtraining (zoals in FM) |
| Scouting | *Binnenland* · *buitenland* | Reizen, data; aantal regio's dat je echt dekt |
| Commercie | *Lokaal* · *premium* | Marketing; winkel en evenementen |
| Gemeenschap | *Leden* · *evenementen* | Clubhuis, maatschappelijke projecten |

- **Budget:** krap 70% / normaal 100% / ruim 130% van de basis, aangevraagd bij laag 2.
- **Koerswissel:** werkt na een seizoen inwerken (keuze 78).

## 8. Acties van de speler
Bouwen · uitbreiden · ombouwen · slopen · onderhoud plegen (los, of als een onderhoudsplan per seizoen) · een aannemer kiezen · het budgetniveau zetten · de koers zetten · een afdeling bezoeken · een uitvak aanwijzen · een vak sluiten of openen.

## 9. Signalen
**Uit:**
- naar 2: kosten (bouw, onderhoud, afdelingen, afschrijving), `capaciteit` per vaktype, `horecaruimte`, `business-seats`, `skyboxen`, `winkelruimte`, `evenementenruimte`, `tv-geschikt`;
- naar 4: `trainingsniveau`, `medisch niveau`, `blessurerisico`, `academieniveau`, `scoutingbereik`, `veldkwaliteit`, `thuisvoordeel` (sfeer × capaciteit);
- naar 5: voorkeurssignalen per onderdeel;
- naar 6: `hinder` en licentie-eisen voldaan (ja/nee per eis);
- naar 3: rol en vacature per afdeling.

**In:**
- van 2: budget goedgekeurd of geweigerd, blokkades;
- van 3: de kwaliteit van het hoofd;
- van 5: ledenbesluiten;
- van 6: vergunning, bezwaar, licentie-eisen per divisie, het weer.

## 10. Wat de speler ziet (mobiel, keuze 80)
- **Hub-kaart "Ground":** capaciteit, het slechtste onderdeel met een waarschuwing, en lopende projecten.
- **Doorklik 1:** een stadionplattegrond met vier zijden en het veld, plus de terreinkaart met de 6 kavels. Elke zijde of kavel toont niveau en staat als kleurbalk.
- **Doorklik 2:** het volledige overzicht van een onderdeel: niveau, staat, onderhoud, afschrijving en historie.
- Elke actie toont een voorspelling, zoals: *"+900 places · £180k · 14 wks · +£2.1k per home game · Ultras +"*.

## 11. Open vragen ❓
1. **Stadion apart van de 6 kavels:** het stadion heeft vier zijden en het veld, de kavels zijn voor het complex. Dat wijzigt keuze 78 licht.
2. **Startschaal:** derde divisie, 6.800 plaatsen, omzet ±£2,4m?
3. **Kunstgras** als onomkeerbare optie?
4. **Licentie-eisen:** de bond (laag 6) stelt die, en laag 1 meldt alleen of eraan voldaan is. Akkoord?
