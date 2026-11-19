# Prompt: van koude app naar jouw club (De Voorzitter — UX en visuele identiteit)

*Branch `voorzitter-fundering`. Bouwt voort op `standalone/front-office-fc/voorzitter-fundering/` (de build), `standalone-research/PROMPT-ECHT-SPEL-VOORZITTER.md` (de vijf pijlers) en het concept (`CONCEPT-VOORZITTER-2026-11-18.md`).*
*Deze prompt vervangt en verdiept **pijler 2 (je club zien)** uit de spelprompt. Hij wordt uitgevoerd vóór pijler 3.*

---

## Wie je bent
Je bent **art director en UX-designer** van De Voorzitter, en je bouwt het ook zelf.
- Je werkt samen met de eigenaar (game director) en spreekt hem tegen als iets het spel slechter maakt.
- Communicatie in het Nederlands; alle tekst in het spel is Engels.

## Het probleem
De eigenaar: *"De UX en de menu's voelen heel koud aan. Ik denk dat daar zit waarom het niet als voetbal en niet als mijn club voelt."*

**Eerste diagnose** (toets en vul aan in fase A, met screenshots van de huidige build):
1. **Het ziet eruit als een zakelijke app.** Grijze ondergrond, witte kaarten met dezelfde afronding en rand overal, knoppen als pillen. Niets in de vorm zegt "voetbal".
2. **Je club is onzichtbaar.** Er zijn geen clubkleuren, geen wapen, geen tenue en geen stadion. Pell en Ravensby zien er precies hetzelfde uit.
3. **Mensen zijn letters in een rondje.** Initialen in een cirkel maken van spelers en staf systeemobjecten, geen mensen.
4. **Er is geen plek.** Je zit nergens: niet in een kantoor, niet in een bestuurskamer, niet op de tribune. Elk scherm is dezelfde lijst.
5. **Alles weegt even zwaar.** Een debuut, een blessure en het weer krijgen dezelfde kaart. De zaterdag oogt als elk ander scherm.
6. **De bediening is administratief:** "On your desk", "Your options", "Table", "Region". Het taalgebruik van de interface is kantoortaal, terwijl de verhalen warm zijn.
7. **Er zijn geen rituelen.** Geen aftrap, geen eindsignaal, geen moment waarop je uitslag binnenkomt, geen viering.

## Het doel
Wie het spel opent, moet binnen drie seconden voelen: **dit is mijn club, en dit is voetbal.** Met eigen kleuren, een wapen, een stadion, mensen met een gezicht, en een week die naar de zaterdag toe leeft.

**Toets bij elk scherm:** *Kan dit scherm bij een boekhoudapp horen?* Zo ja, dan is het niet af.

## Keuzes van de eigenaar (bindend, 20-11-2026)
1. **Richting: "Matchday programme".** Het spel oogt als het wedstrijdprogramma van je eigen club:
   - papier en drukwerk;
   - clubkleuren in brede balken;
   - stoere koppen;
   - het wapen groot op de cover;
   - kaarten als pagina's met een gewicht.
2. **Veel clubkleur, als identiteit:** in de kop, in balken en strepen, op de wedstrijdkaart en op knoppen. Elke club voelt meteen anders, en tekst haalt altijd WCAG AA.
3. **De sfeer volgt de richting:** licht papier als basis. Een donker thema alleen als het echt past bij de programma-look, bijvoorbeeld als een "avondeditie"; het hoeft niet.
4. **Bij het openen zie je eerst je club:**
   - het wapen groot, met naam, niveau en oprichtingsjaar;
   - het stadion met capaciteit;
   - de stand en de vorm;
   - de volgende wedstrijd.

   Daaronder de feed van deze week.
5. **Portretten zijn getekende koppen in drukwerkstijl,** zoals portretjes in een programmaboekje: procedureel per persoon (huidtint, haar, leeftijd, uitdrukking), met een shirtkraag in clubkleuren. Vast en herkenbaar, zonder echte personen na te bootsen.
6. **De zaterdag als programma plus uitslagbord:**
   - vooraf een programmapagina met beide wapens, de opstelling als teamsheet en de inzet;
   - achteraf komt de uitslag binnen als op een ouderwets scorebord, met een korte, ingetogen viering bij winst.
7. **De interface spreekt programmataal.** Bijvoorbeeld:
   - *Club news* (de feed);
   - *In the post* (het bureau en de situaties);
   - *Saturday 3pm* (de wedstrijd);
   - *Chairman's notes* (je afspraken, beloftes en geld);
   - *Members' corner* (leden en ALV);
   - *The dressing room* (de selectie).
8. **Geluid komt later.**

## Grenzen
- **Fictieve wereld:** geen echte clubs, wapens, tenues, sponsors of spelers. Geen kopie van de look van een bestaand spel.
- **Geen externe afbeeldingen.** Alles is SVG of canvas, procedureel uit een seed: wapen, tenue, stadion, portretten.
- **Mobiel eerst:** 390 px, tikdoelen van minstens 44 px, WCAG AA. Het werkt in licht en donker, of in één bewust gekozen look (zie de vragen).
- **Rustig blijven.** Warmte komt uit materiaal, kleur en ritme, niet uit drukte. Hooguit twee zinnen per tekstblok.
- **De lagen in de code blijven.** Visuele componenten horen in `ui/` en `style/`. Procedurele generators (wapen, tenue, portret) mogen in `world/`, omdat ze bij de wereld horen.

## Werkwijze

### Fase A — Diagnose met beeld (kort)
1. **Maak screenshots op 390 px** van: week, feed, bureau, situatie, wedstrijdkaart, uitslag, selectie, spelersprofiel, vergadering, ALV, regio.
2. **Noteer per scherm** wat koud is: vorm, kleur, taal, hiërarchie, ontbrekende plek.
3. **Verzamel de beeldtaal van de voetbalcultuur**, als bronmateriaal, niet om te kopiëren:
   - wedstrijdprogramma's;
   - de opstelling op een teamsheet;
   - sjaals met strepen;
   - toegangskaartjes;
   - het scorebord;
   - lijnen en krijt op het veld;
   - lichtmasten;
   - een lokale krant;
   - een clubbar met wimpels;
   - het krijtbord in de kleedkamer;
   - de bestuurskamer met lambrisering.

   Benoem welke elementen een kleine ledenclub in een Britse regio typeren.

### Fase B — Keuzes zijn gemaakt
De richting, kleur, sfeer, het beginscherm, de portretten, de zaterdag, de taal en het geluid staan hierboven. Stel alleen nog interactief vragen over details die het ontwerp echt bepalen, met previews. Bijvoorbeeld:
- het lettertype voor de koppen;
- de vorm van de programmacover;
- hoe het tenue op het beginscherm staat.

Hooguit één ronde.

### Fase C — Ontwerpsysteem (één A4 + een levende pagina)
Schrijf `standalone-research/IDENTITEIT-VOORZITTER.md` opnieuw. Maak ook een **levende stijlpagina** als artifact met:
- **tokens:** kleur, typografie, ruimte, rand, schaduw. Clubkleuren worden afgeleid uit de twee kleuren van elke club, met contrast dat altijd AA haalt;
- **een wapengenerator:** vorm (schild, rond, ruit), symbool (anker, wiel, toren, vogel, schip, koe, kroon, mijnlamp: passend bij het stadstype), banden of strepen, het oprichtingsjaar. Deterministisch uit de seed;
- **een tenuegenerator:** shirt en patroon (effen, strepen, banen, sjerp, kwartieren) in de clubkleuren;
- **een stadion:** tribunes als eenvoudige vormen met capaciteit en vulling (voor de opkomst), en een naam;
- **portretten** in de gekozen stijl, deterministisch per persoon (huidtint, haar, leeftijd, uitdrukking), zonder echte personen na te bootsen;
- **componenten:**
  - een feedkaart in drie gewichten (groot moment, gewoon, klein);
  - een situatiekaart;
  - een afspraakkaart;
  - een wedstrijdkaart;
  - een uitslag en scorebord;
  - een stand met zones;
  - een spelersprofiel;
  - geld;
  - knoppen;
  - navigatie.

### Fase D — Proef: het weekscherm en de zaterdag
Bouw **eerst alleen** deze schermen in de nieuwe stijl, met de echte data uit de build:
- het beginscherm (je club: wapen, stadion, stand, vorm, volgende wedstrijd);
- het weekscherm met de feed (*Club news*) en *In the post*;
- de wedstrijdkaart;
- de uitslag.

**Speeltest:** laat de eigenaar drie weken spelen bij twee verschillende clubs. Vraag daarna:
- voelt dit als jouw club;
- voelt dit als voetbal;
- herken je de twee clubs als verschillend;
- wat voelt nog koud?

Ga pas verder na een "ja".

### Fase E — Alle schermen
Werk daarna de rest af, in deze volgorde:
1. selectie en spelersprofiel;
2. situaties en afspraken;
3. de zomervergadering;
4. de ALV (gang, telling);
5. regio en vrije spelers;
6. de eerste dag bij een club;
7. de titel en het begin van een carrière.

Elk scherm krijgt een screenshot in licht en donker, of in de gekozen look.

## Ontwerpregels (gelden overal)
- **Hiërarchie van gevoel:**
  - een debuut, een winnende goal of een promotie krijgt ruimte en kleur;
  - een blessure krijgt ernst;
  - het weer is klein.
- **Je club is altijd zichtbaar:** het wapen en de kleuren op elk scherm (kop, strepen, wedstrijdkaart).
- **Mensen hebben een gezicht en een tenue,** geen initialen.
- **Plaatsen hebben een sfeer:** de bestuurskamer bij de vergadering, de sporthal bij de ALV, de clubbar bij een fanavond.
- **Getallen zoals in voetbal:** scorebordcijfers voor de uitslag, een stand zoals in de krant, geld zoals op een kasbon.
- **Beweging is betekenisvol:** de uitslag die binnenkomt, een tribune die voller wordt, een wapen dat even oplicht bij promotie. Altijd met respect voor `prefers-reduced-motion`.
- **De interface spreekt clubtaal,** consequent en kort.

## Testen (eerlijk melden wat faalt)
1. **Alle bestaande tests blijven groen:** de fundering, de audit en de browserdoorloop.
2. **Contrast:** elke combinatie van clubkleur en tekst haalt WCAG AA. Test dit automatisch voor alle 32 clubs.
3. **Determinisme:** dezelfde seed geeft hetzelfde wapen, tenue en portret.
4. **Onderscheid:** de wapens en tenues van de 32 clubs zijn onderling te onderscheiden. Test dat geen twee clubs dezelfde combinatie van vorm, symbool en kleuren hebben.
5. **Playwright** op 390 px, zonder fouten in de console en zonder horizontaal scrollen. Screenshots van elk scherm, bij twee verschillende clubs.
6. **Prestatie:** een week opent binnen een seconde op een middenklasse telefoon. De generators worden gecachet.

## Wat je níét doet
- Geen echte clublogo's, tenues, sponsors of herkenbare stijlen van bestaande spellen.
- Geen externe afbeeldingen of lettertypen buiten Google Fonts.
- Geen extra schermen of systemen. Dit gaat over hoe het voelt, niet over wat het kan.
- Niet alles tegelijk: eerst de proef (fase D) en de speeltest.
- Niets op `main`, `claude-game` of `chatgpt`.
