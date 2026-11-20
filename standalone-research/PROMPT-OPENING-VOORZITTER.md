# Prompt: de opening van De Voorzitter als begin van een avontuur

*Voor Claude als game developer met voetbalkennis. Branch `voorzitter-fundering`, standalone-spoor. Opgesteld 20-11-2026.*

**Werkwijze:** eerst statische templates van de openingsschermen (zoals `templates/speels-templates.html`). Pas na akkoord van de eigenaar wordt er gebouwd.

---

## De vraag van de eigenaar
> "De oprichting moet anders, visueel strakker en vooral leuker. Het voelt droog aan. Selectie van de club die ik over wil nemen moet spannend en leuk voelen; de eerste paar keuzes die ik krijg ook. Het moet voelen alsof ik aan een nieuw spannend avontuur begin, niet gewoon doorklik om ergens te komen."

## Analyse van de huidige opening (screenshots 20-11-2026, 390 px)

| Scherm | Wat er staat | Waarom het droog voelt |
|---|---|---|
| **Titel** | Een klein wapen, een kop, vier regels uitleg en één knop | Geen beeld en geen belofte van avontuur. Het leest als een handleiding. |
| **Proloog** | Een krantje over Pell en "Last season you were chairman of Pell United…" | Je begint als verliezer van andermans verhaal. Er is geen keuze en je bent niet nieuwsgierig. |
| **Three clubs want you** | Drie tekstblokken met vijf regels elk (ledenpercentages, schuld, rivaal) en een rijtje stippen | Spreadsheet-tekst. De clubs hebben geen gezicht, geen kleur, geen wapen en geen inzet. Kiezen voelt als een formulier invullen. |
| **Your first day** | Een geldstrip, een tabel met ledengroepen, het statuut en één tekstballon | Een datadump zonder moment. Je komt aan, maar er gebeurt niets. |
| **Manifest 1–3** | Lijsten met beloftes en een kanslabel | Drie keer hetzelfde scherm. Je keuzes hebben geen publiek en geen directe reactie. |

**Kern van het probleem:** de opening *informeert*, maar laat je niets *beleven*. Er is geen fantasie (wie ben ik?), geen inzet (wat kan ik verliezen?), geen onzekerheid (wat weet ik niet?) en geen feedback (wat deed mijn keuze?).

## Bindende keuzes van de eigenaar (20-11-2026, keuze 69)
1. **Startverhaal: een nieuwkomer met een kans.** Je bent nog niemand in het voetbal. Drie clubs in nood bellen je, omdat niemand anders het wil. Het is een underdogfantasie: je moet je bewijzen. De proloog over Pell verdwijnt.
2. **De clubkeuze is een set dossiers om doorheen te bladeren.** Drie of vier grote clubkaarten met wapen, shirt, stadion, stand, kas en het verhaal, met een kop als "The most dangerous job". Je swipet ertussen.
3. **De spanning komt uit een geheim per club.** Elk dossier heeft een dichtgeplakte envelop ("What they're not telling you"). Die gaat pas open als je getekend hebt: een schuld, een talent, een vete, een clausule. Het geheim heeft echte gevolgen in het spel.
4. **Het beeldmoment is de handtekening.** Je zet je naam onder het contract, met een stempel. Dan valt het clubwapen op zijn plek en kleurt het scherm in de clubkleuren.
5. **De eerste dag bestaat uit drie momenten:**
   - een speech voor de leden op de tribune (je beloftes);
   - een eerste crisis op je bureau;
   - kennismaken met je staf.

   Elke keuze krijgt meteen een zichtbare reactie.
6. **Lengte: 3–5 minuten** van het titelscherm tot de eerste week, inclusief het aannemen van de TD en de zomervergadering.

## Ontwerpprincipes (game design, bindend voor dit werk)
1. **Binnen 30 seconden een echte keuze.** De eerste tik na "Begin" is al een beslissing (je naam, of welk dossier je openslaat), geen "verder".
2. **Fantasie eerst, cijfers later.** Elke club opent met een gezicht: wapen, shirt, stadion, één zin en een label. Cijfers staan als chips eronder. Details zie je pas als je doortikt.
3. **Een nieuwsgierigheidsgat.** De envelop, de deadline ("They want an answer tonight") en de vraag "wat kan ik hier bereiken?" (de droom van de club) trekken je door.
4. **Elke keuze krijgt meteen een reactie.** Een stempel, een juichende of fluitende tribune, een gezichtje dat verandert, een kop in de krant. Laat nooit een keuze zonder zichtbaar gevolg.
5. **Variatie in ritme.** Geen drie identieke lijstschermen achter elkaar. De afwisseling wordt: bladeren → tekenen (fysiek, vasthouden) → speech (publiek) → crisis (spanning) → staf (mensen).
6. **Maximaal twee zinnen per tekstblok.** Iconen en chips dragen de rest (de templates van keuze 64).
7. **Het eindgevoel:** "dit is míjn club en ik heb iets te bewijzen." Het eerste scherm daarna (de club als beginscherm, keuze 60) moet dat bevestigen.

## De gewenste opening (richting, te concretiseren in de templates)

| # | Moment | Wat de speler ziet en doet | Reactie of juice | Tijd |
|---|---|---|---|---|
| 0 | **Titel** | Een sterk beeld: de skyline van het graafschap of stadionlichten, met de titel groot. Eén regel: *"Thirty-two clubs. One of them is about to become yours."* Knop **Begin**. | Licht animerende lichten, of een wapen dat oplicht | 5 s |
| 1 | **The call** | Je bent een buitenstaander: geld verdiend buiten het voetbal, niemand kent je. Je typt je naam (vooringevuld, wijzigbaar). Dan komen er drie berichten binnen, één per club. | Telefoon of brieven die binnenkomen, met een badge "3" | 20 s |
| 2 | **The dossiers** | Drie of vier swipebare kaarten. Elke kaart heeft: wapen, shirt, stadion, clubnaam, een **label** (*Rescue job*, *Sleeping giant*, *Poisoned chalice*, *The quiet one*), sterren voor de moeilijkheid, één zin pitch, chips (stand, kas, stemming van de leden als gezichtje, rivaal) en **de droom** ("Bring them back to the Premier"). Onderaan een **dichtgeplakte envelop**. Tik → het volledige dossier met de gezichten van aanvoerder, supportersleider en trainer. | Swipe met snap, een kaartteller, de envelop wiebelt even | 60–90 s |
| 3 | **The signature** | Een contractblad met je naam en de club. **Houd vast om te tekenen** (±1 s, een pen die schrijft). | Stempel *SIGNED*, het wapen valt op zijn plek, het scherm kleurt in de clubkleuren, dan een krantenkop "NEW CHAIRMAN AT …" in klein | 15 s |
| 4 | **The envelope** | De envelop gaat open: het geheim, in één of twee zinnen, met een icoon en een chip voor het gevolg ("−£40k debt nobody told you about", "A 16-year-old the big clubs are circling", "The groundsman and the captain haven't spoken in a year"). | Envelop-animatie. Het gevolg verschijnt als chip. | 10 s |
| 5 | **Day one, moment 1: the speech** | Je loopt de tribune op. Drie zinnen voor je speech (= je beloftes uit het manifest). Per zin kies je uit 3–4 kaarten met de kans en wie het raakt. | Na elke zin reageert de tribune: gezichtjes per ledengroep veranderen, een spandoek, juichen of fluiten (tekst plus icoon) | 60 s |
| 6 | **Day one, moment 2: the first crisis** | Eén situatiekaart op je bureau, liefst gekoppeld aan het geheim. Een ruilkaart volgens de templates: *You give* / *You get*. | Stempel *AGREED* of *NO DEAL*, plus een zichtbaar gevolg (loyaliteit, stemming, geld) | 30 s |
| 7 | **Day one, moment 3: meet your staff** | Het bestaande aannemen van de TD (stap 1), gevolgd door de zomervergadering met de staf. | Bestaand, wel visueel gelijkgetrokken | 60–90 s |

**Totaal: ±4–5 minuten.** De zomervergadering (zeven mandaatkeuzes) is het langste stuk. Onderzoek of die in de opening compacter of visueler kan. Verander de inhoud niet zonder de eigenaar.

## Het geheim per club (nieuw systeem, klein houden)
- **Een vaste set van 8–12 geheimen**, verdeeld over vier soorten:
  - *geld*: verborgen schuld, of een sponsor die dreigt te vertrekken;
  - *talent*: een wonderkind, of een ster die weg wil;
  - *mensen*: een vete, een trainer met een verleden;
  - *regels*: een statuutclausule, of een stadionhuur.
- **Het geheim wordt getrokken bij het maken van de dossiers**, met de seeded RNG en passend bij de club. Bijvoorbeeld een schuld bij een club die er al krap voor staat.
- **Elk geheim heeft één concreet gevolg** in bestaande systemen (kas, schuld, een speler met een hoge pa, een loyaliteitsmemory, een binding in het statuut), en waar mogelijk een vervolgsituatie in de eerste weken.
- **Balans:** de helft van de geheimen is goed nieuws en de helft slecht, en geen enkel geheim maakt het spel kapot. Dat test je over 20 seeds.
- **State:** `S.secret = {id, club, revealed}` met een veilige default, zodat oude saves zonder geheim gewoon doorgaan.

## Wat er vaststaat (niet heronderhandelen)
- De voorzitter kiest nooit spelers, opstelling of tactiek.
- Fictieve wereld: geen echte clubs, spelers of merken. Stadions, wapens en shirts komen uit de bestaande generators (`world/identity.js`).
- De UI is Engels, de communicatie Nederlands. Alle toeval loopt via de seeded RNG.
- Visuele stijl volgens keuze 59–64: matchday-programme, clubkleur als identiteit, iconen, semantische kleuren, maximaal twee zinnen.
- Mobiel (keuze 63): 390 px, tikdoelen van minstens 44 px, tekst van minstens 16 px (labels minstens 13 px), animaties van ±200 ms, en `prefers-reduced-motion` zet de animaties uit.
- De bestaande systemen blijven: `makeSeats` (de clubs), het manifest (de beloftes, nu als speech), `sitBuild` (de crisis), het aannemen van de TD en het mandaat.
- Geen nieuwe meters of valuta. Het geheim is een gebeurtenis, geen meter.

## Werkwijze
1. **Fase A, templates (eerst, goedkoop).** Eén statische pagina `templates/opening-templates.html` met de momenten 0–6 als telefoonschermen, met voorbeelddata (drie fictieve clubs met elk een label, droom en geheim).
   - Waar het iets toevoegt, schakelaars voor varianten: swipe of verticaal; tekenen door vasthouden of door tikken; de speech per zin of in één keer.
   - Leg dit voor aan de eigenaar.
2. **Fase B, bouwen** (pas na akkoord), in deze volgorde:
   - titel en de call;
   - de dossiers;
   - handtekening en envelop, met het geheimensysteem;
   - de speech;
   - de eerste crisis;
   - de visuele gelijktrekking van de staf-momenten.
3. **Fase C, testen** (zie hieronder) en een speeltest door de eigenaar.
4. **Vastleggen:** werk het besluitenlog en het concept (§13) bij en commit naar `voorzitter-fundering`.

## Testen (meld eerlijk wat faalt)
- `node build.js`, daarna de bestaande tests: `foundation-test`, `chairman-audit`, `identity-test`, `td-test`, `mobile-audit` en `ui-season`. De audit-bots krijgen de nieuwe schermen erbij.
- **Een nieuwe `opening-test.js`:**
  - van het titelscherm tot week 1 zonder fouten, over 20 seeds;
  - de dossiers hebben altijd 3–4 verschillende labels en drie verschillende geheimen;
  - de geheimen zijn ongeveer half goed en half slecht nieuws;
  - elk geheim heeft een meetbaar gevolg in de state;
  - een geschatte leestijd (woorden ÷ 3,5 per seconde, plus 1,5 s per keuze) van 3–5 minuten.
- **De mobiele audit** op elk openingsscherm: geen kleine tikdoelen, geen tekst onder 13 px, geen horizontaal scrollen, en de hoofdknop binnen bereik.
- **Screenshots op 390 px**, gebundeld in één strip, zodat de eigenaar goedkoop kan beoordelen.
- **Speeltest door de eigenaar:** "Voelde het als het begin van een avontuur, en wilde ik weten wat er in de envelop zat?"

## Wat je níét doet
- Geen lange introductietekst of tutorial vooraf. Uitleg komt in de handeling, in één zin.
- Geen verkiezing bij de start (keuze 50). Je bent gevraagd, niet gekozen.
- Geen geheim dat de speler zonder kans laat, en geen geheim dat alleen tekst is zonder gevolg.
- Niet bouwen voordat de templates zijn goedgekeurd.
