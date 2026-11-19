# Prompt: een levende club als fundering (De Voorzitter)

*Te gebruiken in een nieuwe sessie. Werkbranch: `voorzitter-fundering`.*
*Bouwt voort op het concept (`standalone-research/CONCEPT-VOORZITTER-2026-11-18.md`) en op `standalone/front-office-fc/voorzitter/northmarch.html`.*

---

## Wie je bent

Je bent lead game designer en developer van **De Voorzitter**. De speler is gekozen voorzitter van een ledenclub in een fictieve regio (The Northmarch).
Je werkt samen met de eigenaar (game director). Hij beslist *wat* het spel is, jij *hoe* het gebouwd wordt, en je spreekt hem tegen als iets het spel slechter maakt.
Communicatie in het Nederlands; alle tekst in het spel is Engels.

## Het probleem dat de eigenaar zag

`northmarch.html` heeft een sterke voorzitterslaag: situaties op je bureau, afspraakkaarten, de ALV, en een wereld met geheugen. Maar:
1. **Het spel loopt in blokken van acht wedstrijden.** Daardoor is er geen binding met de club, geen week-tot-week-gevoel en geen wedstrijd die je meebeleeft.
2. **De club zelf bestaat niet.** Er is geen selectie, geen technisch directeur met een puzzel, geen academie en geen scouting. Medewerkers voeren geen taken uit, dus de voorzitter heeft niemand wiens werk hij kan zien, beoordelen of bijsturen.

## De opdracht

Bouw **een levende club als fundering**, met de **bestaande voorzitterslaag als laag erbovenop**.

> **Fundering:** de club draait vanzelf, week na week. Mensen doen hun werk.
> **Laag:** de voorzitter ziet dat werk, zet kaders en krijgt situaties op zijn bureau wanneer het werk iets van hem vraagt.

Begin **heel simpel**. Liever één afdeling die echt leeft dan vier halve.

## Keuzes van de eigenaar (bindend, 19-11-2026)

1. **Selectief overnemen uit `claude-game`.** Je bouwt een nieuwe, simpele fundering. Bewezen stukken neem je opgeschoond over waar ze passen: het spelersmodel, de wedstrijdsim, de leeftijdsgroepen van de academie. Geen oude schermen, inbox, rode map of haken die elkaar overschrijven.
2. **Elke week is een wedstrijd plus wat er speelt.** Een week bestaat uit:
   - de krant;
   - kort wat de afdelingen deden;
   - **0–2 situaties** op je bureau, en alleen als er echt iets speelt;
   - de wedstrijd.

   Stille weken duren seconden. De ALV blijft het slot van het seizoen.
3. **De eerste versie heeft één afdeling: de technisch directeur (TD) met de selectie.** Academie, scouting en commercie/financiën volgen later, één per bouwronde.
4. **De voorzitter kan kijken en kaders zetten.** Je kunt de afdeling bekijken en per afdeling een paar kaders zetten. De mensen voeren zelf uit, en wat van jou een beslissing vraagt, komt als situatie op je bureau.

## Wat al bewezen is (behouden)

- **Het spel is de afspraak.** Kaarten met *You give · They give · Tested · If it fails*, en altijd een zichtbare "no deal" met het gevolg erbij.
- **Actie → consequentie → uitkomst → nieuwe situatie.** Een keuze die alleen een verborgen score verandert, is een ontwerpfout.
- **Woorden tijdens het spelen, oorzaken achteraf.**
- **Situaties komen uit generatoren die de echte staat lezen**, met meerdere partijen en de kosten van niets doen zichtbaar.
- **Jaarlijkse ALV** met bindende moties, deals in de gang en een telling per groep. Een tegenkandidaat komt alleen bij onvrede.
- **Een wereld met geheugen en loopbanen.** Verlies je de ALV, dan word je kandidaat bij een andere club.
- **Nooit opstellen, scouten of zelf onderhandelen.** Dat doen je mensen.

## Fase A — Lezen en diagnose (kort, in chat)

1. Lees het concept, de ontwerpnotities in `standalone-research/` en `northmarch.html`. Speel één seizoen met Playwright.
2. Lees in `claude-game` alleen wat je nodig hebt, via `CODEMAP.md` (lees nooit de hele bron): het spelersmodel, de wedstrijdsim, de academiegroepen en de weekflow.
   - Maak een lijst: **overnemen**, **vereenvoudigen** of **niet overnemen**, met één reden per regel.
3. Benoem de drie grootste risico's. Denk aan:
   - een fundering die zo rijk wordt dat de voorzitter alsnog operationeel werk doet;
   - weken die leeg voelen;
   - een TD wiens werk je niet merkt.

## Fase B — Interactieve ontwerpvragen (alleen wat nog open is)

Stel deze vragen **interactief**:
- hooguit vier per ronde;
- elk met concrete opties en een klein speelvoorbeeld;
- je aanbeveling als eerste optie, gemarkeerd "(Recommended)".

Na elke ronde analyseer je kort wat de keuze betekent voor spelplezier, invloed, complexiteit en scope.

1. **Spelersmodel.** Hoe simpel beginnen we?
   - **Optie a:** positie, leeftijd, kwaliteit, potentieel, contract, salaris, moraal en één persoonlijkheidstrek.
   - **Optie b:** de 14 attributen uit `claude-game`.
   - **Optie c:** iets ertussenin.
2. **Wat de TD elke week doet.** Welke taken zijn zichtbaar?
   - gaten in de selectie bijhouden;
   - aflopende contracten verlengen;
   - een shortlist bijhouden;
   - binnen de kaders kopen en verkopen in de transferperiodes;
   - spelers verhuren.
3. **Welke kaders de voorzitter zet.** Bijvoorbeeld:
   - transferbudget;
   - salarisplafond;
   - het profiel (jeugd, ervaring of waarde);
   - "verkoop nooit aan de rivaal".

   Hooguit drie, en elk moet de TD **zichtbaar anders laten werken**.
4. **Transferperiodes.**
   - **Optie a:** zomer en winter als eigen weken met meer activiteit.
   - **Optie b:** het hele seizoen open.
5. **Hoe het werk van de TD situaties wordt.** Bijvoorbeeld:
   - hij wil boven het budget voor een speler;
   - een ster wil een nieuw contract;
   - een bod komt binnen;
   - de coach klaagt dat er een positie leeg is;
   - het gat is na de deadline nog niet gevuld.
6. **Hoe een week eruitziet op mobiel.** De krant, "This week at the club", het bureau en de wedstrijd: één scherm of een reeks?
7. **De wedstrijd.** Een tekstwedstrijd in de stijl van `claude-game`, verkort tot ±20 seconden, of alleen een uitslag met de reden waarom?

## Fase C — Ontwerpnotities (vóór code)

Schrijf korte notities (maximaal één A4 per onderwerp) in `standalone-research/`. Neem de keuzes van de eigenaar op in het concept (§13).
- **`FUNDERING-VOORZITTER.md`:** de week, de lagen, wat de club vanzelf doet en wat de voorzitter ziet.
- **`TD-SELECTIE-VOORZITTER.md`:**
  - het spelersmodel;
  - hoe de selectie de teamsterkte bepaalt: de coach kiest de beste elf per positie, dus gaten en diepte doen ertoe;
  - de taken van de TD;
  - de kaders;
  - hoe de persoonlijkheid en de waarde van de TD zijn keuzes kleuren. Een koppige TD koopt geen huurlingen; een TD die geld belangrijk vindt, verkoopt sneller.
  - **Sluit af met:** welke situaties en afspraken dit oplevert voor de voorzitter. Kun je dat niet concreet maken, dan bouw je het niet.
- **`ROADMAP-FUNDERING.md`:** de volgorde van de volgende afdelingen. Elke afdeling moet een eigen werkritme hebben, zichtbaar werk, en situaties voor de voorzitter.
  1. **Jeugdacademie:** een hoofd met teams van O11 tot O18; kinderen groeien, haken af of breken door.
  2. **Scouting:** scouts leveren rapporten aan de TD.
  3. **Commercie en financiën.**

## Fase D — Papieren proef

- Genereer met een seed (via een script, eerlijk gedobbeld) **één club met een selectie van ±24 spelers** en een TD met trekken en een waarde.
- Speel **vier weken op papier**, interactief, met daarin één transferweek.
- Vraag de eigenaar daarna:
  - voelde je binding met de club;
  - zag je de TD werken;
  - voelden de weken vol genoeg, maar niet te vol.

## Fase E — Bouwen (pas na akkoord op fase D)

### Codestructuur: duidelijk opgesplitst in lagen
```
standalone/front-office-fc/voorzitter-fundering/
  src/
    core/        rng, helpers, words (geen DOM)
    world/       regio, clubs, mensen, geheugen, loopbanen (uit northmarch)
    club/        selectie, spelers, TD-taken, wedstrijdsim, de week   ← de fundering
    chairman/    situaties, afspraken, ALV, manifest, verkiezing      ← de laag (uit northmarch)
    ui/          schermen per onderdeel
    style/       css-tokens
  build.js       plakt src/ in vaste volgorde tot één HTML-bestand in dist/
  tests/         node-tests per laag + audit + playwright
```

**Regels voor de lagen:**
- **`club/` weet niets van `chairman/`.** De club draait ook zonder voorzitter. Dat is een test: een seizoen zonder voorzittersacties moet zonder fouten draaien.
- **`chairman/` leest de club via een klein, vast koppelvlak.** Bijvoorbeeld:
  - `club.needs()`
  - `club.tdPlan()`
  - `club.events(week)`
  - `club.setFrame(k, v)`
- **Situatiegeneratoren** lezen events van de fundering, zoals *"TD wants £35k above budget for a left-back"*.
- **Het spel blijft één offline HTML-bestand** na de build.

### De eerste speelbare versie
- **Een seizoen van 30 weken**, per week: krant → "This week at the club" → 0–2 situaties → wedstrijd → uitslag en stand.
- **De selectie leeft:**
  - spelers worden ouder, raken geblesseerd of uit vorm, en hun contracten lopen af;
  - de TD verlengt, koopt en verkoopt zelf binnen jouw kaders, in de transferweken.
- **Een scherm "The squad"** (kijken): spelers per positie, de gaten, het plan van de TD, en de kaders die je kunt zetten.
- **De bestaande voorzitterslaag blijft werken:**
  - de situaties lezen nu ook de fundering;
  - de ALV sluit het seizoen af;
  - de regio en de andere clubs blijven bestaan.
- **Opslaan** in `localStorage`, met try/catch en een versienummer.

## Technische regels
- Vanilla JS, offline. Alle toeval loopt via de seeded RNG, nooit `Math.random`. Dezelfde seed met dezelfde keuzes geeft dezelfde uitkomst.
- Gebruik geen globale namen die met `window` botsen (zoals `top`, `name`, `status`).
- **Mobiel eerst:**
  - 390 px, licht en donker;
  - tikdoelen van minstens 44 px, WCAG AA;
  - hooguit twee zinnen per tekstblok.
- Fictieve wereld: geen echte clubs, spelers of merken.
- Geen gegenereerde AI-tekst in het spel; fragmenten zijn geschreven en worden gecombineerd.

## Testen (eerlijk melden wat faalt)
1. **Node per laag.** De fundering draait drie seizoenen zonder voorzitter, en:
   - de selectie blijft tussen 20 en 28 spelers;
   - contracten lopen af en worden verlengd;
   - de TD doet transfers;
   - de uitkomst is deterministisch.
2. **Audit:** een actieve, passieve en willekeurige voorzitter over twintig seeds. De actieve moet aantoonbaar andere uitkomsten halen, maar hoort niet alles te winnen. Rapporteer de verdeling.
3. **Kaders tellen:** de TD gedraagt zich meetbaar anders bij andere kaders. Laat het verschil zien in leeftijd, prijs en aantal transfers.
4. **Playwright:** een volledig seizoen in licht en donker op 390 px, zonder fouten in de console en zonder horizontaal scrollen. Screenshots van een week, het selectiescherm en een situatie.

## Wat je níét doet
- Geen code vóór fase D akkoord is.
- Geen tweede afdeling in deze bouwronde.
- De voorzitter kiest geen opstelling, scout geen spelers en onderhandelt niet zelf.
- Geen nieuwe meters, valuta of schermen zonder een concrete functie voor de voorzitter.
- Geen kopie van een bestaand spel.
- Niets op `main`, `claude-game` of `chatgpt`. Werk op `voorzitter-fundering`.

## Vastleggen
- Keuzes van de eigenaar komen in het concept (§13); lessen in §11.
- Commit met duidelijke boodschappen en push naar `voorzitter-fundering`.
- Publiceer de speelbare versie als privé-artifact en geef de link.
- Sluit elke fase af met **één** gerichte vraag aan de eigenaar.
