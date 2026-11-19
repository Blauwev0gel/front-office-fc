# Prompt: van systeem naar voetbalspel (De Voorzitter, v3)

*Branch `voorzitter-fundering`. Bouwt voort op `standalone/front-office-fc/voorzitter-fundering/`, het concept (`standalone-research/CONCEPT-VOORZITTER-2026-11-18.md`, keuzes 1–51) en de ontwerpnotities in `standalone-research/`.*
*v3 is herschreven na een kritische review van de eigenaar en de game developer (20-11-2026).*

---

## De kern in één zin
**Je bent eigenaar van een ledenclub. Elke week zie je je club leven, reageer je als eigenaar op wat er gebeurt, neem je beslissingen die de staf voor je uitvoert, en zie je zaterdag wat het opleverde. Elk jaar oordelen de leden.**

Elke feature moet deze zin versterken. Doet hij dat niet, dan bouw je hem niet.

## Wie je bent
Je bent lead game designer en developer van **De Voorzitter**. Je werkt samen met de eigenaar (game director) en spreekt hem tegen als iets het spel slechter maakt.
Communicatie in het Nederlands; alle tekst in het spel is Engels.

## Het probleem
De eigenaar: *"Het is niet echt een voetbalspel momenteel."* De systemen werken, maar:
1. **De wedstrijd is geen hoogtepunt:** een uitslag met twee regels.
2. **Het seizoen heeft geen boog:** geen race die je ziet aankomen, geen beker, geen deadline day, geen slotdag.
3. **Het voelt als formulieren:** geen kleuren, wapen, stadion, publiek of trofee.
4. **Er staat te weinig op het spel:** een bewuste speler wint 39 van de 40 ALV's.
5. **Er zijn geen beloningsmomenten** die je onthoudt.
6. **Je beslissingen zie je niet terug op het veld.**
7. **De week is vooral lezen.** Het bureau voelde al als "zwaar lezen".

## Keuzes van de eigenaar voor dit werk (bindend)
1. **Een feed met kaarten.** Elke week 4–6 updates over je spelers, je staf, de regio en de stad en fans. **Op sommige kaarten kun je als eigenaar reageren:** optioneel, één tik, met een klein gevolg bij die persoon. Zo wordt lezen een beetje spelen.
2. **Geen wedstrijdpremies, geen weekdoelen, geen voorspellingen.**
3. **De wedstrijd is altijd een samenvatting, nooit live.** Wel rijk: de uitslag, momenten, mensen, en jouw invloed erin.
4. **Een upgradeboom voor de club als plek** (stadion, academie, trainingscomplex, scouting, gemeenschap), verdiend met **punten** uit de ALV, gehouden beloftes en sportieve mijlpalen.
   - **Elke upgrade heeft naast het voordeel een nadeel.** Dat is de rem op een spel dat te makkelijk wordt.
   - Dit herziet het verbod op upgrades uit de oorspronkelijke opdracht, op verzoek van de eigenaar.
5. **Alle pijlers worden in volgorde gebouwd**, maar **elke pijler eindigt met een speeltest door de eigenaar.** Pas na zijn "ja" begint de volgende.

## Wat blijft (bewezen)
- **Het spel is de afspraak:** actie → consequentie → uitkomst → nieuwe situatie.
- **De fundering draait zelf.** De voorzitter zet het mandaat in de zomervergadering met de staf.
- **Situaties uit echte staat**, met de kosten van niets doen zichtbaar.
- **Een ALV** met moties, de gang en de telling. **Een regio** met geheugen en loopbanen.
- **Geen opstelling, tactiek, wissels of training.** Ook niet een beetje.
- **Woorden tijdens het spelen; geld als bedrag.** Mobiel 390 px, licht en donker.
- **Fictieve wereld**, seeded RNG, geen gegenereerde AI-tekst in het spel.

## Harde ontwerpgrenzen
- **Tempo:**
  - een gewone week duurt 30–60 seconden, een stille week één tik;
  - een seizoen van 30 weken duurt ±20–30 minuten, ALV inbegrepen.
- **Lezen:**
  - per kaart één kop van maximaal acht woorden en één zin;
  - per scherm hooguit één tekstblok van twee zinnen;
  - meer staat achter een tik.
- **De eerste vijf minuten:** een nieuwe speler moet binnen vijf minuten zijn eerste wedstrijd zien. Uitleg gebeurt in het spel zelf, met een staflid dat het zegt, niet in een handleiding.
- **Punten zijn een munt met een reden:** je verdient ze met je woord en met resultaat, niet met klikken. Er komt geen andere nieuwe munt bij.

## De vijf pijlers (in deze volgorde, elk met een speeltest)

### Pijler 1 — De week en de zaterdag
**De feed (4–6 kaarten per week)**
- **Vier bronnen, minstens drie per week:**
  1. **je spelers:** debuut, eerste goal, vormdip, terugkeer, verjaardag, vader worden, ruzie, een jongen die bij het eerste meetraint;
  2. **je staf aan het werk:** de TD bij een wedstrijd elders, een uitslag van de jeugd;
  3. **de regio:** ontslagen, transfers, schulden, een wonderjongen bij de rivaal, mensen die je kent die van club wisselen;
  4. **de stad en de fans:** een uitverkocht uitvak, een sponsor, de gemeente.
- **De belangrijkste kaart staat bovenaan**: iets van je eigen club, iemand die je kent, of je rivaal.
- **Reageren als eigenaar.** Op hooguit twee kaarten per week een knop, bijvoorbeeld "Send a note", "Call him", "Say something in the Echo" of "Stay out of it".
  - Het effect is klein en zichtbaar bij die persoon: zijn moraal of loyaliteit, met een korte reactie in zijn eigen woorden.
  - Het heeft soms een bijeffect via relaties: een speler die je feliciteert, maakt een rivaal in de kleedkamer jaloers.
  - Nooit verplicht. Reacties zijn begrensd, zodat ze de balans niet breken.
- **Vervolgverhalen.** Een kaart kan een vervolg krijgen ("Reyes trained with the first team" → "Reyes makes his debut"). Minstens acht vervolgverhalen per seizoen.
- **Tekst zonder AI, en toch niet herhalend.**
  - Kaarten bestaan uit **combinaties**: een echte gebeurtenis uit de simulatie, plus sjablonen met variabele delen (naam, aantal, plaats, eerdere gebeurtenis), plus een kleine bibliotheek met gewone voetbalgebeurtenissen.
  - Reken het tekstbudget uit (±150 kaarten per seizoen) en ontwerp zo dat er binnen twee seizoenen geen identieke zin terugkomt.

**De zaterdag: een samenvatting die je wilt lezen**
- **Vooraf** een wedstrijdkaart: beide wapens, de vorm, de inzet (derby, top tegen onder, beker), de verwachte opkomst en het weer.
- **Daarna** het verslag:
  - de uitslag met doelpuntenmakers;
  - **2–4 momenten met namen**: de winnende goal, een redding, een fout, een debuut, een mijlpaal;
  - een regel waarom;
  - de stand die meebeweegt.
- **Jouw invloed zichtbaar:** momenten verwijzen naar wat jij deed. Bijvoorbeeld: *"Whitlock, signed under your mandate, clears off the line"*, *"Reyes, who you backed in his slump, scores"*, *"The stand you built was full"*. Minstens tien zulke momenten per seizoen.

**Speeltest 1:** drie weken (een gewone week, een derby, een slotwedstrijd met inzet). Vraag de eigenaar:
- voelde het als voetbal;
- was het jouw club;
- zag je je eigen beslissingen terug;
- wilde je de volgende week zien?

### Pijler 2 — Je club zien
- Clubkleuren, een **wapen** en een **tenue**, procedureel uit een seed, in SVG.
- Een **stadion** met een naam en een tribunekaart. Het **publiek** als getal en als beeld, en de opkomst heeft invloed op het thuisvoordeel.
- Dezelfde visuele taal in alle schermen: weekscherm, wedstrijdkaart, stand, selectie.

**Speeltest 2:** herken je je club in één oogopslag?

### Pijler 3 — Het seizoen als boog
- **Een regionale beker:** rondes verspreid over het seizoen, uitwedstrijden bij kleinere clubs, en een finale.
- **De stand met zones:** promotie, play-offs, degradatie. In de slotweken staat erbij "wat moet er gebeuren".
- **Deadline day in de winter:** een kort scherm waarin de TD binnen jouw mandaat werkt.
- **De laatste speeldag** met de uitslagen van andere velden die jouw plek bepalen.

**Speeltest 3:** voelde je de race aankomen?

### Pijler 4 — Inzet: falen en herstel
- **Moeilijkheid:** een actieve speler wint ±60–75% van de ALV's; passief en willekeurig duidelijk minder.
- **Geld kan echt misgaan:** puntenaftrek, administratie, gedwongen verkoop.
- **Herstel verdien je zelf:** een crisisvergadering met de staf, een investeerder met voorwaarden (statuut!), of de leden die je een laatste kans geven.
- **Minstens één echte crisis per vijf seizoenen** bij gewoon spel.

**Speeltest 4:** was er een moment waarop je echt bang was het te verliezen?

### Pijler 5 — Beloningen en de upgradeboom
- **Hoogtepuntschermen** voor promotie, een prijs, een record, een doorbraak of een afscheid. Daarbij een **prijzenkast**, een **clubhistorie** per seizoen, en een **eregalerij** van spelers die jij haalde of liet doorbreken.
- **De upgradeboom.** Vijf takken (stadion, academie, trainingscomplex, scouting, gemeenschap), elk 3–4 niveaus.
  - **Elke upgrade:** een voordeel dat je ziet, een nadeel dat je voelt, en meestal geld.
  - **Voorbeelden:**
    - een nieuwe tribune: meer plaatsen, maar de Ultras verliezen hun staanplaats;
    - een tweede jeugdteam: meer debuten, maar een hogere loonsom;
    - een beter trainingscomplex: minder blessures, maar de gemeente wil gemeenschapsuren.
  - **Grote upgrades** kunnen een **motie op de ALV** vragen.
  - **Een geopende upgrade** verschijnt als kaart in de feed.
- **Punten:** uit de ALV (meer bij een ruime herverkiezing), gehouden beloftes en mijlpalen. Een gebroken belofte kost een punt.
  - *Voorstel van de game developer:* beloftes tellen naar grootte (klein 1, groot 3), zodat veel kleine beloftes niet lonen. Leg dit voor aan de eigenaar.
  - Richtlijn: ±3–8 punten per seizoen, genoeg voor één à twee upgrades.

**Speeltest 5:** voelde een geopende upgrade als iets wat je verdiend had, en woog het nadeel mee?

## Werkwijze
1. **Fase A — spelen en diagnose (kort).** Speel twee seizoenen van `dist/index.html` met Playwright. Noteer per week de tijd, het aantal tikken en wat je ziet. Toets de zeven punten van het probleem.
2. **Fase B — alleen wat nog open is,** interactief, hooguit **twee rondes** van vier vragen, met previews en je aanbeveling als eerste optie. Bijvoorbeeld:
   - de toon van de feed;
   - welke reacties er zijn;
   - de beker ja of nee;
   - de faalvormen;
   - de eerste upgrades;
   - de puntentelling, inclusief het voorstel "beloftes naar grootte".
3. **Fase C — ontwerpnotities** van maximaal één A4 elk in `standalone-research/`. Neem keuzes op in het concept (§13).
   - `FEED-VOORZITTER.md`
   - `WEDSTRIJD-VOORZITTER.md`
   - `IDENTITEIT-VOORZITTER.md`
   - `SEIZOENSBOOG-VOORZITTER.md`
   - `INZET-VOORZITTER.md`
   - `UPGRADES-VOORZITTER.md`

   Elke notitie eindigt met: welk gevoel dit oplevert, en waar het vandaan komt in de rol van de voorzitter.
4. **Fase D — bouwen, pijler voor pijler.** Elke pijler is een eigen commit met een speelbare versie, een gepubliceerd artifact en een speeltest door de eigenaar.

## Technische regels
- **De lagen blijven:** `core`, `world`, `club`, `chairman`, `ui`, `style`. De build maakt één offline HTML-bestand.
  - Feedgebeurtenissen en wedstrijdmomenten worden gegenereerd in `club/`; reacties en de boom horen in `chairman/`.
  - `club/` weet niets van de voorzitter.
- **De wedstrijd** wordt gesimuleerd met echte spelers aan beide kanten. De uitslagen blijven gekalibreerd (goals per duel, aandeel 0-0, thuisvoordeel). De presentatie verandert de uitkomst nooit.
- **SVG of canvas**, geen externe afbeeldingen. Animatie zuinig, met respect voor `prefers-reduced-motion`.
- **Een week reageert binnen een seconde** op een middenklasse telefoon. Saves krijgen een versienummer.

## Testen (eerlijk melden wat faalt)
1. **Bestaande tests blijven groen:** de fundering zonder voorzitter, de audit en de browserdoorloop.
2. **Kalibratie over 1.000 wedstrijden:** goals per duel, aandeel 0-0 en thuisvoordeel realistisch.
3. **Feed:**
   - 4–6 kaarten per week uit minstens drie bronnen;
   - geen identieke zin binnen twee seizoenen;
   - minstens acht vervolgverhalen per seizoen;
   - reacties begrensd en meetbaar.
4. **Zichtbaarheid:** minstens tien wedstrijdmomenten per seizoen verwijzen naar beslissingen van de voorzitter.
5. **Tempo:** een gemiddelde week duurt 30–60 seconden, en tikken per week worden gemeten in de browsertest.
6. **Balans:** actief ±60–75% gewonnen ALV's over twintig seeds, en minstens één crisis per vijf seizoenen.
7. **Boom:** elke upgrade heeft een meetbaar voordeel en nadeel, en ±3–8 punten per seizoen.
8. **Playwright:** twee seizoenen in licht en donker op 390 px, zonder fouten of horizontaal scrollen. Screenshots van de feed met een reactie, het wedstrijdverslag, de stand met zones, een bekerronde, deadline day, een hoogtepunt en de boom.

## Wat je níét doet
- Geen opstelling, tactiek, wissels of training.
- Geen wedstrijdpremies, weekdoelen of voorspellingen.
- Geen schermen, meters of munten zonder een gevoel dat aantoonbaar uit de voorzittersrol komt.
- Geen kopie van een bestaand spel, en geen echte clubs, spelers of merken.
- Geen volgende pijler voordat de eigenaar de vorige heeft getest.
- Niets op `main`, `claude-game` of `chatgpt`.
