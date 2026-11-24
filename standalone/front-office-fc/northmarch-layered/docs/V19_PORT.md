# V19 terug in de modulaire bron (slimline-main)

Status: IMPLEMENTED en lokaal geverifieerd (zie "Bewijs"). Niet gepubliceerd.

## Waarom
Northmarch V19 (`main/northmarch/build.py`) bevatte een HTML waarin de economiewijzigingen en de nieuwe schermen rechtstreeks waren aangebracht; de modulaire bron `northmarch/src` liep achter. Eén centrale ontwikkelbron is `slimline-main`. V19 is daarom in die modules teruggebracht, zonder functionaliteit te verliezen.

## Uitgangspunt
V19 bleek een **superset** van `slimline-main`: alle 584 bovenste-niveau-onderdelen van `slimline-main` zitten er in, 559 letterlijk gelijk. Het verschil was 25 gewijzigde onderdelen, 48 nieuwe, extra CSS (476 regels, achteraan) en een testbalk in de pagina.

## Wat waar terechtkwam
| V19-onderdeel | Plaats in `src/` |
|---|---|
| 24 gewijzigde engineonderdelen (kosten, slijtage, herstel, loonplafond, `budgetFor`, medisch risico, trainingsgroei, academie, vijf divisies bij plot- en stadionprijzen, AI-projectgrenzen, `weekLines`, `renewals`, `shopFor`, `squadManager`, `summerWindow`) | op hun bestaande plek in `club/ground.js`, `club/finance.js`, `club/projects.js`, `football/*.js`, `sim/*.js`, `ui/*.js` |
| `PRO_COST`, `facilityAnnual`, `facilityRun`, `operatingLevel` (kosten per niveau, fysiek v. operating level) | `club/ground.js` |
| `recruitValue`, `upgradeAttempts` | `club/recruitment.js` |
| Upgrades-tab (`BUILD_FOCUS`, `BUILD_GROUPS`, `buildView`) en drie `case`-regels in `act` | `ui/upgrades.js`, `ui/act.js` |
| UI-lagen V17, V18, V18.1, V18.2, V18.3, test- en exportgereedschap, V18.5 home, V18.6/V18.7 afdelings- en geldschermen | `ui/ext-*.js` (letterlijk overgenomen; het luisterblok onderaan het oude `act.js` is verdwenen, zoals in V19) |
| 476 extra CSS-regels | `style/extensions.css` (achter `main.css`, volgorde = cascade) |
| Testbalk (download, apart openen, save exporteren/importeren) | `test-tools.html`, door `build.js` in de pagina gezet |
De UI-lagen in `ui/ext-*.js` zetten functies om (`render`, `act`, `cmd`, `advanceWeek`, `chooseClub`, `deserialize`, …) in plaats van de hooks uit `core/layers.js` te gebruiken. Dat is bewust ongewijzigd gelaten (anders verandert gedrag); het is technische schuld, module voor module om te zetten naar hooks.

## Bewijs (lokaal, op 22–24 november)
- **Alle regels gelijk:** na het weglaten van commentaar en witruimte bevat het script van de build precies dezelfde 4.554 regels als het V19-script (0 regels méér aan beide kanten); alleen de plaats van enkele functies per module verschilt. De CSS is gelijk (60.332 tekens).
- **Dezelfde wereld, dezelfde uitkomst:** dezelfde seed, twee seizoenen doorgespeeld in V19 en in de port, daarna de volledige opgeslagen staat vergeleken: identiek (zelfde SHA over 4,58 miljoen tekens, zelfde sleutels, zelfde seizoenscijfers).
- **Tests:** `node build.js` (49 basismodules), `base-briefing-`, `base-isolation-`, `layer-isolation-`, `smoke-`, `save-`, `ux-`, `l25-`, `youth-`, `story-`, `l3-`, `pyramid-`, `foreign-world-test` en de overgenomen `department-ownership-test`: groen. De overgenomen `v19-smoke-test` (20 seizoenen, een upgrade in seizoen 1, 1 min 45 s): groen. Browser op 390 px, licht en donker: nieuwe `playtest.js` groen.

## Gewijzigde tests
- `tests/playtest.js` is opnieuw geschreven voor de V19-flow (de oude zocht de Slimline-actiebalk en het club-hub die V19 vervangt): home met 13 tegels, elke tegel open en terug, een heel seizoen via de knoppen (speel, uitslag, ga door), de wedstrijdkrant, seizoenseinde en overzicht, seizoen twee, herladen en doorgaan, geen horizontale scroll, geen scriptfouten. Wat **niet** meer wordt getoetst: het Slimline-clubhub en de oude navigatie, omdat die in V19 niet meer bestaan.
- Nieuw: `tests/department-ownership-test.js` (snel, in de snelle suite) en `tests/v19-smoke-test.js` (langzaam, met de hand).

## Bekende beperkingen (V19-gedrag, ongewijzigd)
- Veel knoppen op de home zijn lager dan 44 px (11 gemeten); de hoofdknop haalt 44 px. De playtest meldt dit, het is geen mislukking.
- Een save die direct na "start season" wordt gemaakt, wordt pas bij de volgende actie weggeschreven; herladen toont dan nog het slot van het vorige seizoen.
- De wikkels om kernfuncties (zie boven) zijn technische schuld.
- De titel van de pagina blijft "Northmarch".

## Nog te doen
- De bestaande Pages-route (`main/northmarch/build.py`) publiceert nog de ingebedde HTML van `main`. Pas als deze port is gemerged en een preview vanaf `slimline-main` is gepubliceerd, kan die route verdwijnen.
- `northmarch/src` op `main` is verouderd en moet worden opgegeven of herleid tot een kopie van deze bron.
