# Slimline — contract voor opbouw in lagen

**Besluit eigenaar, 22 november 2026.** De bouwvolgorde is bindend: **eerst een compleet, simpel speelbaar spel**; daarboven, en pas daarna, autonomie, vervolgens verhalen en dynastie. Dit document verandert de bestaande nummering niet maar maakt onderscheid tussen een *spelbare fase* en technische lagen.

## Productfasen (de werkelijke ontwikkelvolgorde)

| Fase | Wat werkt zelfstandig | Modules | Gate |
| --- | --- | --- | --- |
| **A — Basisspel (L1 + L2)** | Eén club starten, seizoen/week spelen, competitie/beker/Europa, wedstrijden en spelersloopbanen, transfers, salarissen, jeugd, gebouwen, sponsor/financiën, promotie/degradatie; eenvoudige beleidskeuzes leiden tot echte gevolgen | `src/core/`, `src/world/`, `src/football/`, `src/club/`, `src/sim/`, basis-`src/ui/` | 10–20 seizoenen stabiel, save/load, mobile end-to-end, betekenisvolle oorzaak-gevolg; **zonder hogere lagen** |
| **B — Autonomie (L3)** | Dezelfde wereld, maar managers/afdelingen zijn zelfstandige actoren met mandaten, rapportages, competenties en verantwoording. Zij beslissen binnen beleid; de voorzitter keurt geen losse spelers of opstellingen goed | `src/layers/autonomy/` | Autonomie **aan/uit** zonder dat seizoenen, saves of basisregels breken; beleidskeuzes veranderen gedrag van staf en resultaten |
| **C — Verhalen en relaties (L4)** | Situaties en persoonlijke relaties komen *voort uit* de uitkomsten van de bestaande wereld. Geen verhaalgebeurtenissen die de wereld buiten de normale spelregels om aanpassen | `src/layers/story/` (toekomstig) | Zonder L4 blijft hetzelfde spel speelbaar |
| **D — Dynasty en nalatenschap (L5)** | Meerdere clubs, generaties, institutionele identiteit, nalatenschap en langetermijnbesluiten bovenop werkende basis en autonomie | `src/layers/dynasty/` (toekomstig) | Bij uitschakelen blijven eerdere savegames en kernwereld werken |

**Gevaar voor verwarring:** L3 bevat in de huidige bron al S3.1 (mandaten) en S3.2 (verantwoording), maar dat betekent *niet* dat fase A is afgerond. Een groene CI is niet hetzelfde als een bewezen goed basisspel. Voltooi eerst de fase-A-gates voordat nieuwe autonome systemen worden uitgebreid.

## Technische scheiding (afspraak voor elke PR)

1. **Eén bron van waarheid.** Een domein bezit zijn eigen toestand; `football/` bezit spelers, `world/` competities, `club/` beleid en geld, `sim/clock.js` de tijd. Hogere lagen bewaren hun eigen aanvullende data, niet een tweede selectie/transferbudget/stand.
2. **Richting van afhankelijkheden.** Basisspel mag geen rechtstreeks beroep doen op functies uit `layers/autonomy/`, `layers/story/` of `layers/dynasty/`. Een hogere laag mag feiten lezen en via de bestaande gecontroleerde `cmd()`-route regels laten uitvoeren.
3. **Generieke uitbreidingspunten.** `src/core/layers.js` bevat `onFeature()`, `fireFeatureEvent()`, `registerFeaturePanel()` en `featurePanel()`. De kern zendt feitelijke lifecycle-events uit; de feature abonneert zich. Een ontbrekende feature is een no-op en mag de kern nooit blokkeren.
4. **Eén centrale klok.** `advanceWeek()` en `closeSeason()` zijn de enige tijdbepalers. Hogere lagen mogen geen verborgen weken toevoegen of vanuit een hook de klok opnieuw aanroepen.
5. **Geen tweede UI-spel.** Uitbreidingsschermen worden in benoemde slots van de bestaande UI ingevoegd, niet als een duplicaat van de Club- of Week-flow.
6. **Determinisme en opslag.** Een optionele rapportage mag uitkomsten en random state niet beïnvloeden. Aanvullende feature-state heeft veilige defaults in oudere saves en waar nodig een expliciete migratie.
7. **Gates zijn verplicht.** Elke PR die een hogere laag raakt, moet zowel de featuretests als `tests/layer-isolation-test.js` halen. Dit bewijst voorlopig specifiek onafhankelijkheid van S3.2; breid de test uit zodra S3.1 verder wordt losgetrokken.

## Huidige code na isolatie van S3.2 (werkbranch, nog niet gemerged)

- `src/layers/autonomy/director-accountability.js` bezit rapporten, acht-optredens-evaluaties en de directeurgebonden betrouwbaarheid; `src/layers/autonomy/director-accountability-ui.js` bezit hun weergave.
- De basis roept geen `directorAuditWeek()` of `directorReviewPanel()` rechtstreeks meer aan. De klok zendt `weekClosed` en het basisspel zendt `transferWindowClosed`; save-load zendt `saveLoaded`. Dat zijn algemene integratiepunten.
- `build.js` houdt een expliciete lijst bij van optionele S3.2-modules. De isolatietest bouwt de kern **zonder deze modules** in een VM en vergelijkt sportieve en financiële uitkomsten met een engine **met** de modules.

## Openstaand structureel werk (niet verbergen)

- **S3.1 is nog verweven met de basis.** `club/recruitment.js` bevat `MANDATE_DEALS`, `tdScan`, `tdClose` en `SetMandate`; `football/market.js` vraagt `dealCap()`, `world/world.js` initialiseert een mandaat en `ui/recruit.js` bevat mandaatpanelen. Dit moet vóór nieuwe L3-S3.3/S3.4-uitbreiding worden losgekoppeld via dezelfde generieke feature- en commandinterfaces.
- `club/staff.js` bevat de eenvoudige basisregels voor trainer/TD. Die mogen in fase A blijven; *persoonlijkheid*, *tevredenheid*, *gesprekken* en *autonome initiatieven* horen in fase B en niet in `sim/clock.js`.
- De huidige build concateneert klassiek JavaScript op vaste volgorde. De fysieke modules bestaan al, maar ES-importgrenzen en strikte toegang tot private state zijn niet afgedwongen. Noem dit **modulair in opbouw**, niet reeds een volledig geïsoleerde pluginarchitectuur.
- Voor fase A blijft de langetermijnkwaliteit van spelers/clubfinanciën en de volledige browser- en mobiele speltest open. Start niet aan complexere L3-logica om deze basisproblemen te maskeren.

## Reviewchecklist voor iedere volgende PR

- Verandert de code basisspelregels, of alleen een laag erboven? Zijn die functies in het juiste mapje?
- Kan de basissim dezelfde seizoenen draaien wanneer de nieuwe module ontbreekt?
- Is het event een vastgesteld spelresultaat en schrijft de feature alleen haar eigen state?
- Heeft de wijziging nieuwe savevelden? Wat gebeurt er bij oude saves?
- Welke test is daadwerkelijk uitgevoerd op welke SHA? Welke validatie ontbreekt nog?
- Is `DEV_STATE.md` bijgewerkt? Is de PR gebaseerd op de actuele `slimline-main`?

**Nieuwe autonoomheidsfeatures pas uitbreiden nadat bovenstaande scheiding voor S3.1 is aangepakt én de fase-A-gameplay is gevalideerd.**
