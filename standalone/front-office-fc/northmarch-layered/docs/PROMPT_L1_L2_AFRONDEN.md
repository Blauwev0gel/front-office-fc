# NORTHMARCH — UITVOERPROMPT: LAAG 1 EN 2 AFRONDEN ("het Football Manager-deel")

Je bent lead game developer, simulation architect en systems designer van Northmarch. Je zet een **bestaande,
werkende en geteste** build voort. Begin niet opnieuw en stel geen brede onderzoeksronde in. Dit is uitvoerend werk:
zes pakketten, op volgorde, elk afgesloten met een gevalideerde speelbare build.

## 0. Eerst lezen (in deze volgorde, alleen deze bestanden)
Repository `Blauwev0gel/front-office-fc`, branch **`claude/loving-goodall-uv00vn`**, map
`standalone/front-office-fc/northmarch-layered/`:
1. `docs/DECISIONS.md`: besluiten D1–D7 (bindend) en technische besluiten T1–T7.
2. `docs/ARCHITECTURE.md`: klok, commando's, events, saves, buildvolgorde.
3. `docs/layers/L1-SIMULATION.md` en `docs/layers/L2-CLUB-MANAGEMENT.md`: laagcontracten en huidige status.
4. `docs/LAYER_INDEX.md`, `docs/WORK_LOG.md` (laatste sectie), `docs/TEST_EVIDENCE.md`.
5. Achtergrond, alleen bij twijfel over de werkwijze: branch `chatgpt`, `design/northmarch-rebuild/NORTHMARCH_LAGEN_PROTOCOL_EN_UITVOERPROMPT_V1.md`.

Controleer daarna met `git log --oneline -5` dat je op de laatste commit zit, en draai `sh tests/run-all.sh`.
Alles moet groen zijn voordat je iets verandert. Is dat niet zo, meld het dan eerst.

## 1. Vaste uitgangspunten (niet heronderhandelen)
- De speler is **gekozen voorzitter van een ledenvereniging**: geen eigenaar, geen opstelling, geen tactiek,
  geen individuele transfers (D5: alleen kader).
- Het spel moet zonder verhalen, staff-autonomie en dynastie volwaardig speelbaar zijn. Dit document gaat uitsluitend
  over laag 1 (de wereld) en laag 2 (clubbestuur). Personen krijgen hier wél kwaliteit, salaris en contract,
  maar **geen eigen wil**: mandaten, initiatief en karakter horen bij laag 3.
- Elke week wordt verplicht gespeeld (D4). Wereld: 3×16 clubs plus beker (D3). Alle clubs volledig gesimuleerd (D1).
- Wegstemmen leidt tot het kiezen van een nieuwe club in dezelfde wereld (D7).
- De referentiegame `standalone/front-office-fc/voorzitter/northmarch.html` blijft onaangeroerd. Geen merges naar
  `main`, geen wijziging aan `.github/workflows/pages.yml`, geen publieke deployment.
- Interfacetekst Engels; communicatie met de eigenaar Nederlands.

## 2. Technische regels (zoals de code nu werkt)
- Bron in `src/`; `node build.js` levert `dist/northmarch-layered.html` (standalone) en `dist/artifact.html`
  (de privé claude.ai-pagina). Bewerk nooit `dist/` met de hand. Een nieuw bestand voeg je toe aan `ENGINE` of `UI`
  in `build.js`.
- **Eén eigenaar per toestand.** Kas verandert uitsluitend via `book(id,line,amt)` (nieuwe posten in `LINE`).
  Tijd verandert uitsluitend via `advanceWeek()`/`closeSeason()` in `sim/clock.js`.
- Elke actie van speler of AI is een commando: `defCommand(name,{check,run})` en `cmd(name,club,args,actor)`.
  De UI muteert nooit direct.
- Feiten gaan als event naar buiten: `emit(type,club,text,data)`. Hogere lagen haken later in via `onWeek`/`onSeason`.
- Alle toeval via `rnd()`/`ri()`/`chance()`/`pick()`, nooit `Math.random`.
- Nieuwe toestand vraagt om `VERSION` ophogen (nu 2), een migratie in `core/save.js` en een test in
  `tests/save-test.js` (voorbeeld: migratie 1→2).
- Elke AI-club gebruikt dezelfde mechaniek als de speler, via regels in `sim/ai.js`. Er komt geen tweede economie en
  geen tweede wedstrijduitkomst.
- UI: 390 px, licht en donker via de bestaande tokens, tikdoelen ≥ 44 px, WCAG AA, maximaal twee zinnen per tekstblok,
  Northmarch-huisstijl (`src/style/main.css`). Geen echte spelers, clubs of merken.
- Houd elk bronbestand onder ±40 KB; splits op een functiegrens.

## 3. Werkwijze per pakket (verplicht, kort)
1. **Ontwerpnotitie** (±10 regels) in `docs/layers/L2-CLUB-MANAGEMENT.md` of `L1-SIMULATION.md`: doel, wat de speler
   ziet en doet, nieuwe toestand plus migratie, bestanden, en hoe je het effect bewijst.
2. **Ontwerpvragen:** de drie L2-vragen zijn al gebruikt (D5–D7). Neem productkeuzes technisch en verdedigbaar,
   leg ze vast als T-besluit, en leg ze aan het eind van het pakket in één alinea aan de eigenaar voor.
   Vraag alleen vooraf (één vraag, met opties en aanbeveling) als een keuze de spelervaring fundamenteel verandert
   en niet later terug te draaien is.
3. **Bouwen** in verticale stukken: engine plus AI plus UI plus test samen, geen lege schermen.
4. **Bewijzen:** isolatietest, contrafeitelijke A/B-test (zelfde seed, één andere keuze, minimaal 16 seeds),
   een 20-seizoenssimulatie op 4 seeds (de balans moet blijven sluiten), save- en migratietest, en browser-playtest
   (`tests/playtest.js` uitbreiden).
5. **Opleveren:** `sh tests/run-all.sh` groen, documenten bijgewerkt (zie §6), commit en push naar
   `claude/loving-goodall-uv00vn`, en de privélink bijwerken door `dist/artifact.html` te publiceren via de
   Artifact-tool op dezelfde URL: https://claude.ai/artifact/MsN96ouEWMVwn76jvKr3Qw.
   Meld per pakket wat er gebouwd is, het testbewijs in cijfers, en wat bewust buiten scope bleef.

Werk zelfstandig door van pakket naar pakket. Vraag niet bij elke stap om toestemming.
Stop en meld het als een test structureel faalt en je de oorzaak niet binnen het pakket kunt oplossen.

## 4. De zes pakketten

### Pakket 1 — Leden, ledenvertrouwen, seizoensdoelen en ALV (D6, D7)
**Doel:** een echte verliesconditie en elk seizoen een maatstaf.
- Leden als getal per club (afgeleid van aanhang), plus een **contributie** die de voorzitter instelt
  (commando `SetDues`). Contributie bepaalt de post `dues` en beïnvloedt de ledengroei.
- **Seizoensdoelen** aan het begin van elk seizoen, afgeleid uit verwachting (sterkte-rang), financiën en jeugd:
  bijvoorbeeld "finish in the top 8", "no operating loss", "two academy players get 10+ appearances".
  Zichtbaar in de Week- en Club-tab, met de voortgang.
- **Ledenvertrouwen** 0–100, wekelijks en per seizoen gevoed door: prestaties tegen de verwachting, de doelen,
  ticketprijzen tegen de norm, schuld en administration, faciliteiten, eigen jeugd, en derby's.
  Elke verandering heeft een zichtbare oorzaak (log met reden), net als in Northmarch.
- **ALV na week 30**, vóór het sluiten van het seizoen: een stemming waarvan de uitslag deterministisch volgt uit het
  vertrouwen en de spreiding. Een verloren stemming betekent wegstemmen: drie open stoelen, zoals `makeSeats()`,
  en de oude club gaat verder met een AI-bestuur. Carrièrehistorie van de voorzitter (`S.career`) bijhouden.
- AI-clubs krijgen hetzelfde vertrouwen; een AI-voorzitter kan worden weggestemd (event), en de nieuwe voorzitter
  heeft een andere waarde (`chairValue`), dus ander beleid.
- **Bewijs:** A/B (hoge prijzen of schuld → lager vertrouwen); simulatie (in 20 seizoenen worden 3–15 voorzitters
  weggestemd); playtest (ALV-scherm, wegstemmen, nieuwe club kiezen, doorspelen).

### Pakket 2 — Hoofdtrainer en technisch directeur benoemen
**Doel:** de grootste voetbalknop van de voorzitter.
- Elke club krijgt een **hoofdtrainer** en een **technisch directeur** als persoon in `S.P` (gebruik `mkPerson`),
  met kwaliteit (1–20, verborgen precisie: de voorzitter ziet een schatting die beter wordt met scouting/ervaring),
  specialisme (trainer: ontwikkeling/resultaat/defensief/aanvallend; TD: oog, onderhandelen, jeugd), salaris en contract.
- **Effecten:** trainerskwaliteit telt mee in de wedstrijdsterkte (bescheiden, ±3 punten) en in de spelersgroei.
  De TD-kwaliteit bepaalt in `squadManager` hoe goed hij koopt (prijs, inschatting van kwaliteit, aantal fouten).
- **Speleracties:** kandidatenlijst (vrije trainers en TD's plus mensen bij andere clubs, met afkoopsom), benoemen,
  ontslaan (afkoop van het contract via `book`), contract verlengen. Commando's `HireCoach`, `SackCoach`, `HireDirector`, `SackDirector`.
- **AI:** besturen ontslaan bij een verliesreeks of falen ten opzichte van de verwachting; personeel wisselt van club.
- Hergebruik waar mogelijk de TD-vaardigheden uit `voorzitter-fundering src/club/td.js` (eye/deal/plan); de
  mandaatlogica blijft voor laag 3.
- **Bewijs:** A/B (betere trainer → meer punten en meer groei; betere TD → betere aankopen voor hetzelfde geld);
  simulatie (trainers worden ontslagen en verhuizen; de balans sluit).

### Pakket 3 — Seizoensbegroting en commercie
**Doel:** besturen met een plan in plaats van losse knoppen.
- **Begroting** in de voorbereiding (week 0): verdeling over lonen, transfers, afdelingen, bouw en reserve.
  Daarna gedurende het seizoen begroting tegen realisatie, met waarschuwingen bij overschrijding.
  De begroting vervangt of voedt `policy` (loonplafond, transferruimte), zonder dubbele bron.
- **Sponsorcontracten:** elke zomer 2–3 aanbiedingen (vast tegen prestatiegebonden, looptijd 1–3 jaar),
  shirtdeal en naamrecht van het stadion (levert geld op, kost ledenvertrouwen). De hoogte volgt uit divisie, aanhang,
  de commerciële afdeling en media. Commando `SignSponsor`.
- **Geld passend bij een ledenvereniging:** clubobligaties of een ledenlening (lagere rente dan de bank,
  afhankelijk van het ledenvertrouwen), een actie voor fondsenwerving (eenmalig, kost goodwill bij herhaling),
  en de grond verkopen en terughuren (veel geld nu, huur voor altijd). Statuutregels uit `CL(id).statute`
  begrenzen wat mag (bijvoorbeeld "No outside owner above 25%").
- **Bewijs:** A/B (vast tegen prestatiegebonden over seizoenen met wisselend succes; obligatie tegen banklening);
  de reconciliatie van het grootboek blijft exact.

### Pakket 4 — Voetbaldiepte in de wereld
**Doel:** een levende markt en meer betekenis per week.
- **Moraal en vorm** per speler, beïnvloed door speeltijd, resultaten en contractsituatie; telt mee in `pickXI`/sterkte.
- **Kaarten en schorsingen**, en vermoeidheid bij een week met beker plus competitie.
- **Contractgesprekken:** spelers hebben looneisen (via een makelaar) en kunnen een verlenging weigeren of weg willen.
  De TD voert de gesprekken binnen het kader.
- **Verhuur** van jonge spelers (speeltijd → groei) tussen clubs.
- **Zichtbare markt:** geruchten, een transferoverzicht per window, deadline day in het weekverslag.
- **Reputatie** per club (naast aanhang), langzaam bewegend met prestaties; ze beïnvloedt sponsors en
  spelers die willen komen.
- **Bewijs:** A/B (verhuur → snellere groei); simulatie (de verdeling van leeftijd en kwaliteit blijft stabiel over
  20 seizoenen, geen inflatie: zie T1/T2).

### Pakket 5 — Grote projecten, historie en signalen
- **Nieuw stadion of verhuizing:** een project over meerdere seizoenen met grondaankoop, vergunning, financiering
  en tijdelijk uitwijken. Extra kavels kopen voor het complex.
- **Historie:** financiën over meerdere seizoenen (grafiek), clubrecords, topscorers, eregalerij, de carrière van de
  voorzitter, en divisie-archieven per seizoen.
- **Signalen** in de Week-tab: aflopende contracten, tribunes onder 40%, een dip in de kasprognose, aflopende sponsors,
  daling van het ledenvertrouwen. Elk signaal linkt naar het scherm waar je handelt (geen verplichte pop-up).
- **Bewijs:** playtest van elk signaal naar de juiste actie; het stadionproject verandert capaciteit en financiën
  aantoonbaar over meerdere seizoenen.

### Pakket 6 — Validatie van laag 1–2
- **Strategietest** (`tests/strategy-test.js`): drie automatische voorzitters via uitsluitend spelerscommando's
  (voorzichtig, faciliteiten en jeugd eerst, ambitie met schuld), elk 10 seizoenen × 8 seeds.
  Eis: elke strategie is levensvatbaar in een deel van de seeds, geen enkele domineert altijd,
  en maximaal investeren is aantoonbaar niet altijd optimaal.
- **Prestatie en opslag:** 30 seizoenen simuleren onder ±60 s; een save onder 2 MB.
- **Menselijke speeltest:** vraag de eigenaar om 2–3 seizoenen te spelen via de privélink. Verwerk de feedback
  en markeer laag 1–2 pas daarna in `LAYER_INDEX.md` als "Gevalideerd".

## 5. Wat NIET in deze opdracht hoort
Verhaalkaarten, gesprekken, oppositiepersonages, persgesprekken (laag 4); personeel met eigen initiatief of mandaten
(laag 3); familie of opvolging (laag 5); opstelling, tactiek of wedstrijdbesturing door de speler.
Bouw hooks en events zó dat die lagen later kunnen aansluiten.

## 6. Documenten die je per pakket bijwerkt
`docs/DECISIONS.md` (T-besluiten), `docs/layers/L1-SIMULATION.md` en/of `docs/layers/L2-CLUB-MANAGEMENT.md`
(12-puntencontract: mechaniek, commando's, events, toestand, tests, status), `docs/ARCHITECTURE.md` (nieuwe
commando's, events, schemaversie), `docs/CODE_REUSE_LEDGER.md` (wat je uit andere branches haalde), `docs/TEST_EVIDENCE.md`
(commando, seeds, uitkomst in cijfers), `docs/WORK_LOG.md` (wat, gevonden fouten, volgende stap), `docs/LAYER_INDEX.md`.

## 7. Definitie van klaar (per pakket)
- `sh tests/run-all.sh` slaagt, inclusief nieuwe tests; alles wat eerst groen was, is nog groen.
- Saves van de vorige versie laden en spelen door (migratietest).
- Elke nieuwe knop heeft een aantoonbaar effect op de simulatie (A/B-bewijs), niet alleen een getal op het scherm.
- Werkt op 390 px in licht en donker, zonder horizontaal scrollen en zonder scriptfouten.
- Documenten kloppen met de code; commit gepusht; privélink bijgewerkt.

**Begin met pakket 1.**
