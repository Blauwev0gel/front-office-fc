# Prompt: speels en duidelijk, niet als een dik boek (De Voorzitter — visuele taal v2)

*Branch `voorzitter-fundering`. Bouwt voort op `PROMPT-WARMTE-VOORZITTER.md` (de programmalook, de balk onderaan, clubkleuren) en de huidige build in `standalone/front-office-fc/voorzitter-fundering/`.*
*Aanleiding: de speeltest van de eigenaar op een iPhone (20-11-2026), met drie screenshots. Geldt voor **alle** schermen.*

---

> **Status (19-11-2026): geparkeerd, doelbeeld goedgekeurd.** De templates in `templates/speels-templates.html` zijn het eindbeeld. Implementeer deze prompt pas als de eigenaar dat vraagt; begin dan met de drie variantkeuzes (iconen, stemmingen, speelsheid) en de spacer- en "X → X"-bug.

## De vraag van de eigenaar
> *"De dialoog en informatie zijn niet duidelijk genoeg. Ik wil kleur en duidelijkheid, iconen waar mogelijk. Ik wil iets dat leuk en speels voelt, niet als een dik boek. Geldt voor alle facetten."*

De richting blijft **het eigen clubprogramma**: clubkleuren, wapen, papier. Maar het moet een **spelprogramma** worden, niet een roman. Denk aan het verschil tussen een stickeralbum en een krant.

## Analyse van de screenshots

### Screenshot 1 — Afspraakkaarten ("On the table")
| Wat je ziet | Waarom het niet werkt |
|---|---|
| Elke kaart is een blok schreeftekst met "YOU GIVE / YOU GET" in kleine kapitalen | Het leest als een contract. Je moet elke kaart helemaal lezen om te zien wat hij doet |
| Geven en krijgen zien er hetzelfde uit | Het belangrijkste (de ruil) heeft geen vorm. Er is geen kleur voor verlies of winst, en geen icoon voor *wat* je geeft: geld, je naam, macht of tijd |
| Risico's zijn grijze pillen met een hele zin | Een risico is niet te scannen. "Points may suffer" en "The paper will quote you back" wegen visueel even zwaar |
| Alle kaarten zijn even groot en even zwart-wit | Er is geen hiërarchie. De speler ziet niet welke keuze gewaagd is, welke veilig, en welke iets breekt |
| Je ziet niet wie erbij betrokken is | Er staat geen gezicht op de kaart, terwijl de afspraak over een mens gaat |

### Screenshot 2 — "What changed this week"
| Wat je ziet | Waarom het niet werkt |
|---|---|
| *"Ultras: Content → Content +1"* | **Een bug in de taal:** als de stemming niet van band wisselt, staat er "X → X". Dat zegt niets. Het getal +1 krijgt geen betekenis |
| Een lange opsomming met bullets en schreeftekst | Het leest als notulen. Er is geen groepering per persoon of groep, en geen gezicht |
| Plus en min in dezelfde grijze tekst | Winst en verlies zijn niet te onderscheiden zonder te lezen |
| Gevolgen via relaties staan als losse regels | Het mooie mechanisme (de mentor die meekijkt, de jaloerse concurrent) gaat verloren in tekst |

### Screenshot 3 — De feed (Club)
| Wat je ziet | Waarom het niet werkt |
|---|---|
| Grote kaarten met koppen van twee regels in 40 px en een portret dat erboven zweeft | Eén kaart vult het hele scherm. Je scrolt door drie kaarten om één week te zien |
| Elke kaart heeft dezelfde oranje bovenband | Clubkleur overal betekent clubkleur nergens. Er is geen onderscheid tussen bronnen |
| **Bug in de layout:** de vaste knop *Play Saturday* valt over de laatste kaart | Inhoud verdwijnt achter de knop en de balk. Er is geen ruimte onderaan voor wat vast staat |
| Een reactie staat als een cursieve zin met een emoji-envelop | Het antwoord van de speler is het leukste moment van de kaart, maar het oogt als een voetnoot |
| De bronlabels ("YOUR PLAYERS") zijn groot en grijs | Herhaling zonder informatie. Een icoon of kleur zegt hetzelfde in minder ruimte |

### Wat overal speelt (alle facetten)
1. **Te veel schreeftekst.** De body-schreefletter maakt alles tot een boek. Een spel heeft korte, stevige tekst nodig, met schreef alleen voor citaten.
2. **Geen iconen.** Geld, moraal, loyaliteit, fans, blessure, contract, tijd, risico, doelpunt: allemaal woorden, nergens een beeld.
3. **Kleur heeft geen betekenis.** Clubkleur is decoratie. Er is geen vaste kleurcodering voor goed, slecht, waarschuwing en neutraal.
4. **Getallen en stemmingen zijn tekst.** "Content", "Warm", "+0.5" moeten meters, gezichtjes, chips en pijlen worden.
5. **Er is geen beloning in de vorm.** Een keuze maken, een week afronden of een speler laten opleven voelt niet als iets: er gebeurt visueel niets leuks.

## Het doel
**Elk scherm is in twee seconden te scannen** zonder de tekst te lezen: wie, wat, goed of slecht, wat moet ik doen. De tekst is er voor wie wil lezen.

**Toetsen per scherm:**
- *Zou een twaalfjarige begrijpen wat hier gebeurt aan de kleuren en iconen alleen?*
- *Voelt dit als een spel of als een formulier?*

## Ontwerpregels (bindend, voor alle schermen)

### 1. Een iconenset
- **Eén eigen set van ±30 SVG-iconen** in dezelfde stijl: 2 px lijn, afgeronde hoeken, gevuld op één kleur, passend bij de programmalook.
- **Minimaal deze iconen:**

  | Groep | Iconen |
  |---|---|
  | Geld en macht | geld, macht |
  | Gevoel | moraal, loyaliteit, stemming, fans/leden, hart (warm) |
  | Woord en publiek | je naam (spreekballon), krant, briefje |
  | Speler | blessure, contract, tijd/toets, doelpunt, redding, debuut (ster), trofee |
  | Club | stadion, academie, scout |
  | Afspraken | risico (waarschuwing), gebroken belofte, gehouden belofte (vinkje) |
  | Seizoen | derby (vuurtje), bank, weer |

- **Elk effect, risico, label en elke knop met een betekenis krijgt een icoon.** Iconen staan altijd naast een woord, nooit alleen (toegankelijkheid).

### 2. Kleur met betekenis
- **Vier semantische kleuren:**
  - goed/winst (groen);
  - slecht/verlies (rood);
  - waarschuwing/risico (amber);
  - neutraal/info (inkt).

  Ze staan los van de clubkleur en halen allemaal AA op papier.
- **Clubkleur is voor identiteit:** kop, wapen, actieve tab, hoofdknop, de eigen club in de stand. Niet voor elke kaart.
- **Bronnen** krijgen een eigen kleine kleur en een icoon:
  - spelers: tenue-icoon;
  - staf: klembord;
  - regio: wapen van de andere club;
  - stad en fans: sjaal.

### 3. Typografie: korter en steviger
- **Lopende tekst in een schreefloze letter** die goed leest op mobiel, bijvoorbeeld Barlow 16–17 px.
- **Schreef alleen voor citaten van personages**, in tekstballonnen.
- **Koppen** blijven in de smalle displayletter, maar kleiner in de feed (20–24 px, één regel waar het kan).
- **Hooguit één zin per kaart zichtbaar.** Meer staat achter een tik.

### 4. Componenten opnieuw ontworpen

**De afspraakkaart als ruil**
- Boven: een titel met het gezicht van de betrokken persoon.
- In het midden: **twee kolommen**, links *You give* (icoon en kort label, rode tint), rechts *You get* (icoon en kort label, groene tint).
- Onder: **risico's als icoonchips** (amber), met een woord of twee ("Points", "Press"). De volledige zin staat achter een tik op de chip.
- **Een toon-label in de hoek:** *Safe*, *Bold*, *Breaks a promise*, als gekleurde badge.
- "No deal" is compact: één regel met het gevolg, gestippeld.

**Gevolgen ("What changed")**
- **Gegroepeerd per persoon of groep:** een gezicht of icoon, de naam, en een of meer chips (moraal +6, loyaliteit +2, stemming ↑), groen of rood.
- **Nooit "X → X":** als de band niet wisselt, toon je alleen de richting (↑ of ↓) met de oorzaak.
- **Relatie-effecten als kleine lijn met icoon**, bijvoorbeeld "Marsh (mentor) is pleased", met een klein verbindingsicoon.
- **Bovenaan een samenvatting in één regel met tellers:** "3 happier · 1 upset · fans ↑ · £−2k".

**Stemmingen en loyaliteit als beeld**
- **Ledengroepen:** een **meter** of gezichtje met vijf standen (furious tot thrilled) in kleur, plus een pijl voor de richting.
- **Personen:** loyaliteit als een kleine **hartjesmeter** of balk, naast het woord.

**Feedkaarten**
- **Compact:** het portret of icoon links (40 px), de kop in één of twee regels (20–24 px), één zin, en de reactieknoppen klein rechtsonder.
- **Hooguit één grote kaart per week** voor het grootste moment (debuut, winnende goal). Die krijgt een sticker ("FIRST GOAL ★") en clubkleur.
- **Een reactie wordt een tekstballon** van die persoon onder de kaart, met het gezicht, en een kleine animatie (de ballon "pop't" in).
- **Bronnen als icoon en kleurstreep**, niet als woordlabel.

**De uitslag**
- Het scorebord blijft.
- **Momenten worden een tijdlijn met iconen:** ⚽ minuut en naam, 🧤 redding, ✕ fout, ★ debuut.
- "Your hand in it" wordt een **gemarkeerde sticker** in clubkleur.
- De stand in mini-vorm met jouw rij gemarkeerd en een pijl (↑2).

**Overige schermen** (dezelfde taal)
- **Selectie:** rijen met portret, positie-badge, kwaliteit als sterren of balk, en icoontjes voor blessure, contract en vorm.
- **Spelersprofiel:** als een **stickerkaart** of verzamelkaart: groot portret, positie, sterren, vormlijn, en drie icoonfeitjes.
- **Geld:** chips met icoon. Plus en min in groen of rood, en de kas als grote bedrag met een minigrafiek.
- **De zomervergadering:** elke optie als kaart met icoon. De staf reageert met gezichtjes (😊 of 😠-achtige tekeningen in de eigen stijl), niet met tekst.
- **De ALV:** de telling als animatie van een staafje per groep met kleur. Moties als kaarten met een voor- of tegen-icoon.
- **Regio en vrije spelers:** een lijst met wapens en positie-badges.

### 5. Speels: beweging en beloning (zuinig)
- Een keuze maken: de kaart **stempelt** (al aanwezig) en de effectchips springen kort op.
- Een week afronden: de chips tellen op naar de samenvatting.
- Een reactie: de tekstballon verschijnt met een kleine sprong.
- Winst: het scorebord gloeit kort op, en een sticker "WIN" schuift erop.
- Alles binnen 150–300 ms, met respect voor `prefers-reduced-motion`.

### 6. Layout-fouten oplossen
- **De vaste knop en de balk mogen nooit inhoud bedekken.** Er komt een spacer onderaan elk scherm, ter hoogte van de knop plus de balk plus de safe area. Meet dit in de mobiele controle: het laatste element is volledig zichtbaar als je helemaal naar beneden scrolt.
- **Geen witte ruimte zonder functie** boven kaarten, zoals het zwevende portret.

## Werkwijze
1. **Fase A:** maak screenshots op 390 px van alle schermen, en zet bij elk de drie grootste problemen volgens de analyse hierboven.
2. **Fase B — interactieve vragen, één ronde van hooguit vier, met previews.** Bijvoorbeeld:
   - de stijl van de iconen (lijn, gevuld, of met de hand getekend als in een programmaboekje);
   - de hoeveelheid speelsheid (rustig, stickeralbum, of uitbundig);
   - stemmingen als gezichtjes of als meters;
   - de letter voor lopende tekst.
3. **Fase C:** werk de stijlpagina (`#style`) bij met de iconenset, de kleurcodes, alle nieuwe componenten, en een voor-en-na van de drie screenshots.
4. **Fase D — de proef:** de afspraakkaart, *What changed*, de feed en de uitslag in de nieuwe taal. De eigenaar speelt drie weken en beantwoordt:
   - is het in twee seconden te scannen;
   - voelt het speels;
   - is het nog een boek?
5. **Fase E:** pas daarna alle andere schermen.

## Testen (eerlijk melden wat faalt)
- Alle bestaande tests blijven groen: fundering, audit, identiteit, mobiele controle, browserdoorloop.
- **Mobiele controle, uitgebreid:**
  - het laatste element van elk scherm is volledig zichtbaar boven de knop en de balk;
  - lopende tekst is minstens 16 px;
  - niets is kleiner dan 13 px;
  - tikdoelen zijn minstens 44 px.
- **Taal-check:** nergens staat "X → X" (dezelfde band links en rechts).
- **Iconen:** elk effect- en risicotype heeft een icoon. Elk icoon staat naast een woord of heeft een `aria-label`.
- **Contrast:** alle semantische kleuren en tinten halen WCAG AA.
- **Leeslast:** het gemiddelde aantal woorden op het weekscherm en een situatiescherm daalt meetbaar ten opzichte van nu. Meet en rapporteer voor en na.

## Wat je níét doet
- Geen nieuwe systemen. Dit gaat over vorm en duidelijkheid.
- Geen echte merken, logo's of emoji-sets als hoofdiconen (eigen SVG). Een emoji mag hooguit als knipoog in tekst.
- Geen afscheid van de clubidentiteit: speels binnen de programmalook, geen generieke game-UI.
- Niets op `main`, `claude-game` of `chatgpt`.
