# De CEO als bouwer: diagnose, ontwerp en eerste doorsnede

*Bij `notes/PROMPT-ceo-builder.md` en B58 (CEO met eigenaarsbevoegdheden). Labels: **[gelezen]** = in de code nagekeken, **[vermoed]** = mijn inschatting, **[voorstel]** = nieuw en nog niet gebouwd. Er is nog geen code gewijzigd.*

---

## 1. Diagnose

### Wat de speler nu doet als bouwer
| Onderdeel | Hoe het werkt | Oordeel |
|---|---|---|
| **Projecten in de vergadering** (`engine/09`, `events2.js`: 21 voorstellen zoals `train_ground`, `new_stand`, `megastore`, `solar`) | Een head pitcht → jij keurt goed (geld eraf) → na `dur` weken een kansworp (`p`) → `fac.train +2` of een perk **[gelezen]** | **Fundamenteel anders nodig.** Dit is precies "betaal → wacht → upgrade". Er zijn geen partijen, geen route, geen onderhandeling, geen tegenslag, en de uitkomst is één worp |
| **Faciliteiten** (`club.fac.train`, `fac.youth`: niveaus 1–10) | Niveaus die omhoog gaan via projecten, events of `facProg` **[gelezen]** | Een tycoon-ladder. Het effect zelf (ontwikkeling via `devF`) is wel echt |
| **Sponsors** (`commercial.js`) | Elke 6–9 weken één aanbod: accepteren, onderhandelen of weigeren. Maximaal vijf `club.deals` **[gelezen]** | **Bestaat half.** Er is een echte kans met een keuze, maar sponsors hebben geen strategie of geheugen, en je kunt er niet zelf een gaan zoeken |
| **Grond en stadion** (`council_land`, `stadium_expansion`) | Losse events, die in `events2.js:16` op **uit** staan **[gelezen]** | **Ontbreekt.** De gemeente bestaat niet als partij |
| **Financiering** (`club.debt`, `refinance`, DNA `money`: self/owner/debt) | Schuld bestaat, herfinanciering is een project, de eigenaar is alleen een DNA-keuze **[gelezen]** | **Ontbreekt** als iets waar je zelf naartoe werkt (een investeerder, een lening als keuze met voorwaarden) |
| **Wereldclubs** (`G.clubs`: naam, niveau, coach, sterkte) | Geen geld, geen problemen, geen ambitie buiten het voetbal **[gelezen]** | Een rivaal kan nu niet in de problemen raken |
| **Mensen** | Karakter (ego, risico, ambitie, loyaliteit), mandaten, initiatief-loop, afspraken **[gelezen]** | **Werkt**, maar heads hebben **geen netwerk**. Een vertrek kost nu niets aan relaties |
| **Initiatief-loop** (`agreements.js`) | Zien → overleggen → afspreken → uitvoeren → beoordelen, met eerlijk geld **[gelezen]** | **Werkt**, en is de juiste basis |

### De kern van het probleem
De speler bouwt nu door **voorstellen van anderen goed te keuren**. Dat zijn upgrades met een kansworp. Er bestaat geen wereld buiten het voetbal die eigen belangen heeft. Hij kan dus niets zélf opzoeken, er concurreert niemand om dezelfde kans, en er is niemand die later zijn belofte terugvraagt. Als je alle voetbal delegeert, blijft er volgens mij weinig over dan de vergadering en het sponsoraanbod **[vermoed]**.

---

## 2. De kernfantasie
**Je bouwt een instituut in een stad die ook iets van je wil.** Grond, geld en goodwill liggen bij anderen: de gemeente, een ondernemer, je hoofdsponsor, de club verderop. Je haalt ze binnen met wat je kunt bieden: tijd, beloftes, zeggenschap, naam en publiek. Elk ding dat je bouwt, maakt de club sterker én afhankelijker.

**Waarin dit verschilt van andere spellen:**
- **Football Manager:** jouw kansen liggen buiten het veld, en de sportieve staf blijft autonoom.
- **Een tycoon-spel:** je koopt geen niveaus. Elk bezit komt met een **tegenpartij en een afspraak** die blijft doorwerken.

---

## 3. De gameplayloop
**Elke week (de bestaande loop blijft):** het bureau, de red box en de wedstrijd. Nieuw onder *Raise it yourself*: **een trajectkaart** zodra er een kans of een lopend traject is, bijvoorbeeld *"The council is selling the old playing fields. Two other bidders."* Er is nooit verplicht werk.

**Een traject (de enige nieuwe motor):**
```
KANS ──► ONDERZOEK ──► ROUTE KIEZEN ──► ONDERHANDELEN ──► (BESTUUR) ──► UITVOERING ──► BEZIT + AFSPRAAK
 uit de     Finance /     2–4 routes,     2–3 rondes met      bij schuld    de head werkt;   een concreet ding
 wereld     Commercial    elk met een     de tegenpartij      of            tegenslag kan    met verplichtingen;
            zoeken het    andere partij                       zeggenschap   komen            opent nieuwe kansen
            uit (1–2 wk)
```
- **De CEO doet zelf:** de kans oppakken, onderzoek vragen, een route kiezen, onderhandelen (kaarten spelen), langs het bestuur gaan, en later beoordelen of opnieuw onderhandelen.
- **De staf doet zelf:** onderzoeken, adviseren en het oneens zijn (Finance voorzichtig of gedurfd), uitvoeren, tegenslag melden met de reden, en het bezit beheren.
- **Niets doen:** de kans loopt af. Een andere partij pakt hem, of de grond gaat naar een ontwikkelaar. Er komt geen straf, maar de wereld onthoudt het. Lopende afspraken voert de staf gewoon uit.

**Waarom dit interessant blijft:** elke route heeft een andere tegenpartij met een eigen prijs (geld, zeggenschap, verplichtingen of goodwill). Concurrenten zorgen voor druk zonder een vaste deadline. Wat je afspreekt, komt later terug.

---

## 4. De spelmotoren
### 4.1 Partijen (`src/parties.js`) [voorstel]
Maximaal vier partijen, elk met **doelen, een alternatief, vertrouwen en geheugen**. Ze handelen elke week op basis van de wereld.

| Partij | Wat ze willen | Hun alternatief | Wat ze zelf doen |
|---|---|---|---|
| **Gemeente** | Gemeenschapsgebruik, banen, rust in de wijk; een budget | Een woningontwikkelaar | Biedt grond aan uit een lijstje locaties; houdt een verkiezing elke 2 seizoenen (een andere wethouder geeft andere doelen) |
| **Lokale investeerder** (uit DNA of de wereld gegenereerd) | Rendement of status: een naam aan iets, een bestuurszetel | Een andere club of een ander project | Biedt geld voor zeggenschap; trekt zich terug als de club wegzakt; kan een veto eisen |
| **Hoofdsponsor** (de grootste `club.deals`-deal) | Zichtbaarheid; een strategie (lokaal, groei, imago) die per seizoen kan wisselen | Een andere club | Verlengt, eist exclusiviteit of vertrekt bij een strategiewissel. Hoe afhankelijk je bent, is te zien in het aandeel in de inkomsten |
| **Rivaliserende club** (uit `G.clubs`, met een simpele financiële staat **[voorstel]**) | Overleven of groeien | Een andere koper of partner | Raakt in de problemen (`str` daalt, er wordt verkocht), biedt mee op dezelfde kans, of zoekt een opleidingspartner |

### 4.2 Trajecten (`src/projects.js`, gebouwd op `G.agr`) [voorstel]
Een traject is een afspraak met `k: 'traj'` en de velden `type`, `stage`, `route`, `party`, `terms`, `owner`, `log`, `by` en `res`. Het gebruikt dezelfde uitvoering, beoordeling, bureau-regels en Record als de initiatief-loop. **Eén motor**, met per type een kleine definitie: welke kans, welke routes, welke kaarten en wat het oplevert.

### 4.3 Onderhandelen in rondes [voorstel]
Elke ronde laat de tegenpartij **één belang** zien en jij speelt **één kaart**:
- geld;
- tijd;
- gemeenschapsgebruik;
- een naam (naming);
- zeggenschap (een zetel);
- exclusiviteit;
- of: weglopen.

Het vertrouwen van de partij en de kracht van haar alternatief (bijvoorbeeld hoe ver de ontwikkelaar is) bepalen of een kaart werkt. Na 2–3 rondes is er een deal, een tegenbod of een breuk. **Finance of Commercial** adviseert per kaart, vanuit hun karakter.

### 4.4 Bezit met verplichtingen [voorstel]
Een resultaat is **een ding met een afspraak**, geen niveau. Bijvoorbeeld:

`club.assets.base = { site, quality, held: 'own'|'lease', lease, community, namedBy, investorSeat }`

- `quality` bepaalt wat nu `fac.train` doet, zodat het bestaande effect op ontwikkeling blijft werken.
- De verplichtingen werken elke week door:
  - huur kost geld;
  - gemeenschapsuren kosten trainingstijd en leveren goodwill bij fans en gemeente op;
  - een investeerderszetel geeft hem een stem bij latere grote besluiten.

### 4.5 Netwerk van heads [voorstel, tweede doorsnede]
Commercial en Finance krijgen een `net`: een paar relaties, bijvoorbeeld *"knows Bridgeway Cars"* of *"trusted at the council"*. Een deal die via iemands netwerk loopt, is aan die persoon gebonden. Vertrekt hij, dan verzwakt die deal. Dit staat bewust **niet** in de eerste doorsnede.

---

## 5. Scenario's (kort; één motor, andere partijen)

**1. Minder afhankelijk van één sponsor.** Bridgeway Cars levert 41% van de commerciële inkomsten; de sponsor kondigt een strategiewissel aan.
- **CEO:** laat Commercial alternatieven zoeken (onderzoek), praat zelf met Bridgeway over verlengen tegen exclusiviteit, of zoekt de investeerder op voor een tweede pijler.
- **Staf:** Commercial vindt twee kleinere partners; Finance rekent wat er gebeurt als Bridgeway vertrekt.
- **Uitkomsten:**
  - **A:** verlengen met exclusiviteit. Het geld blijft, maar je zit langer vast; bij de volgende wissel is de klap groter.
  - **B:** spreiden over drie kleinere deals. Minder geld, minder risico; Commercial heeft meer werk en vraagt om staf.
  - **C:** de investeerder koopt zich in als partner. Er komt stabiel geld bij, maar hij krijgt een zetel.
- **Blijvend:** de inkomstenmix verandert, en Bridgeway onthoudt wie er wegliep.
- **Waarom leuk:** het risico zie je pas als het misgaat, en je kunt het zelf voorkomen.

**2. Een trainingscomplex zonder geld of grond.** Dit is de **doorsnede**; zie §8.

**3. Een rivaal in de problemen.** De club verderop zakt weg en verkoopt (een financiële staat in `G.clubs`).
- **CEO:** een opleidingspartnerschap aanbieden (hun jeugd naar jou), hun grond of tribune kopen, of niets doen.
- **Staf:** de DoF ziet spelers die vrijkomen (de bestaande recruitment); Finance waarschuwt dat je er hun schulden bij koopt.
- **Uitkomsten:** een partnerschap (instroom van talent; hun fans zijn wantrouwig), hun grond voor je complex (sneller, maar de wijk is boos), of een andere koper pakt het (een sterkere concurrent).
- **Waarom leuk:** de wereld biedt een kans die niet om jou draait, en je hebt maar korte tijd.

**4. Een directeur vertrekt met zijn netwerk** (vraagt §4.5). Je Commercial-head gaat naar een grotere club; twee deals liepen via zijn relaties.
- **CEO:** zelf naar die partners om ze te behouden, een opvolger zoeken die een netwerk meebrengt, of accepteren dat ze weggaan.
- **Uitkomsten:**
  - **A:** je behoudt een deal, maar betaalt meer;
  - **B:** de nieuwe head brengt eigen partners mee, met een andere stijl;
  - **C:** de deals vervallen en het gat zit in de begroting.
- **Waarom leuk:** het laat zien hoe je organisatie in elkaar zit; een sterke persoon kan een zwakke plek verbergen.

**5. Een onverwachte promotie.** De capaciteit is 2.500 en de nieuwe divisie verwacht meer (`stepUp` bestaat al).
- **CEO:** een tijdelijke tribune via een lening (bestuur), een gedeeld stadion met de rivaal, of met de gemeente onderhandelen over uitbreiding.
- **Uitkomsten:** snel en duur, goedkoop met een afhankelijkheid, of traag met goodwill.
- **Waarom leuk:** succes brengt een nieuw probleem, en je keuze kleurt de komende seizoenen.

**6. Eigen scenario: de academie als ruilmiddel** (uit het pathway-verhaal en de academie). De gemeente wil jeugdvoetbal voor de wijk; je academie is goed.
- **CEO:** gemeenschapsuren aanbieden als kaart in de onderhandeling over het complex.
- **Effect:** de academie-head moet capaciteit afstaan (een conflict), maar de grond wordt goedkoper.
- **Waarom leuk:** twee systemen raken elkaar en het bestaande verhaal krijgt een prijs.

**7. Eigen scenario: de scouting-bet als argument.** Een speler die je via het portaal flagde, wordt verkocht voor veel geld (`worldBets`).
- **Waarom het telt:** een investeerder ziet in je club een model. Zijn bod komt met de eis dat de data-afdeling blijft.
- **Waarom leuk:** je eigen succes wordt een onderhandelingspositie.

---

## 6. Drie paden over tien seizoenen (oorzaak en gevolg)
- **Ambitieuze profclub:** een investeerder met een zetel → snel een complex en een tribune → promoties → de investeerder eist een toptrainer en wil dat je minder op jeugd stuurt → conflict met het DNA en de academie. **Kwetsbaar:** valt de investeerder weg, dan blijven er schulden en een tribune over die je niet vult.
- **Financieel onafhankelijke lokale club:** gemeenschapsuren, huur van de gemeente, kleine sponsors → langzaam, stabiel en geliefd → het plafond is lager en talent vertrekt. **Kwetsbaar:** een verkiezing levert een wethouder op die de huur verhoogt.
- **Opleidingsclub:** een partnerschap met de grotere club, investeren in jeugd → verkopen financieren alles → afhankelijk van één afnemer en van de markt. **Kwetsbaar:** de partner stapt over naar een andere club.

**Waarom geen pad altijd wint:** elk pad maakt je afhankelijk van een andere partij, en elke partij heeft een eigen alternatief en een eigen tijdlijn.

---

## 7. Kritisch: wat we níet bouwen
- **Geen onderhandelingsboom met tientallen opties.** Eén belang per ronde, één kaart, maximaal drie rondes. Meer wordt op de telefoon een puzzel en gaat herhalen.
- **Geen economie voor alle 140 clubs.** Alleen een financiële staat voor de rivaal en een paar clubs in de buurt.
- **Geen afdelingen of functies zelf ontwerpen.** De vaste structuur draagt alles. Groei komt via **staf binnen afdelingen** (bestaat) en **bezit met afspraken**.
- **Geen aandelen, fusies of overnames** (B58).
- **Geen kansenstroom om rustige weken te vullen.** Een partij doet alleen iets als haar eigen situatie verandert.
- **Wat leuker lijkt dan het is:**
  - een "netwerk-graaf" van alle relaties: onzichtbaar en niet te beheersen. Alleen een paar relaties per head, die je ziet;
  - verkiezingen met programma's: één kenmerk per wethouder is genoeg.
- **Waar het misgaat:**
  - **micromanagement** als elk traject wekelijks iets vraagt. Na de afspraak voert de staf uit;
  - **passiviteit** als kansen alleen komen. Daarom kan de CEO ook zelf een partij **opzoeken** ("Meet the council") wanneer die een belang heeft.

---

## 8. Aanbevolen eerste doorsnede: **"A base of our own"**
**Doel:** bewijzen dat één traject met echte partijen leuker is dan het huidige project *Build a proper training ground*, en dat ook een speler die alle voetbal delegeert iets te doen heeft.

**Wat de speler doet:**
1. **Kans:** de gemeente zet *de oude sportvelden* op de markt. Of de CEO zoekt zelf de gemeente op ("Meet the council": *"Do you have land for a training base?"*). Een ontwikkelaar heeft interesse, en die interesse groeit elke week (een concurrent zonder vaste deadline).
2. **Onderzoek (1 week):** Finance en Commercial laten zien wat de grond kost, wat bouwen kost en wat de gemeente wil (gemeenschapsuren, jeugd, banen). De coach zegt wat het hem waard is.
3. **Route kiezen:**
   - **zelf kopen**: kas, en schuld als het niet past (dan langs het bestuur);
   - **huren met gemeenschapsgebruik**: goedkoop, een langlopende verplichting, goodwill;
   - **met de investeerder**: hij betaalt de helft, krijgt de naam en een zetel;
   - **wachten**: de ontwikkelaar kan winnen.
4. **Onderhandelen (2–3 rondes) met de gemeente.** Kaarten: prijs, gemeenschapsuren (de academie geeft capaciteit af), tijd, of weglopen. Wat werkt, hangt af van het vertrouwen van de gemeente en van hoe ver de ontwikkelaar is.
5. **Bestuur:** bij schuld of een zetel volgt een bestuursbesluit (de bestaande red box), met Finance erbij.
6. **Uitvoering door Finance** (`G.agr`):
   - vergunning, bouw, oplevering;
   - tegenslag naar karakter en kwaliteit van Finance: een gedurfde Finance gaat sneller, met meer kans op een kostenoverschrijding;
   - bij een verkiezing kan de gemeente haar voorwaarden herzien;
   - de investeerder kan zich terugtrekken als de club wegzakt.
7. **Resultaat:** `club.assets.base`, met `quality` die het bestaande `fac.train`-effect stuurt, plus de verplichtingen: huur, gemeenschapsuren en een zetel. **Nieuwe kansen:** een academie op hetzelfde terrein, en vertrouwen bij de gemeente voor later (het stadion).

**Wat er verdwijnt:**
- het project `train_ground` (`events2.js:130`) en het al uitgezette `council_land`;
- de stapsgewijze groei via `facProg`, alleen voor het trainingscomplex.

Bestaande saves met `fac.train` krijgen een eenvoudig `base`-bezit (`held: 'own'`, quality = het oude niveau). Daarvoor komt er een migratie.

**Nieuwe state** (met veilige defaults):
- `G.parties = { council, investor }`;
- `G.agr` met `k: 'traj'`;
- `club.assets.base`.

**Bestanden:**
- nieuw: `src/parties.js` en `src/projects.js` (de trajectmotor plus het type `base`);
- de gespreksrondes via `talks.js`, met de gemeente als spreker;
- UI: bureau (`Raise it yourself` en Still running), afdeling Business, Record, Gazette;
- weg: `train_ground` en de `facProg`-weg voor het trainingscomplex.

**Tests** (`test/projects.js`, vaste seeds):
1. De kans ontstaat uit de toestand van de gemeente, niet uit toeval in de inbox.
2. Elke route levert een andere state op (kas, schuld, huur, zetel, gemeenschapsuren).
3. Onderhandelen: dezelfde kaart werkt anders bij een ander vertrouwen of een andere concurrent.
4. **De CEO doet niets:** de ontwikkelaar koopt, de kans is weg, er komt geen straf, en de gemeente onthoudt het.
5. **Een andere partij pakt de kans:** de ontwikkelaar of de rivaal wint als jij te laag biedt of te lang wacht.
6. Een bestuursbesluit bij schuld of een zetel; weigert het bestuur, dan valt die route weg.
7. Uitvoering: tegenslag die verklaard wordt uit Finance; de verplichtingen werken elke week door.
8. Het bezit stuurt de bestaande spelersontwikkeling (`fac.train`-effect).
9. Opslaan en laden, oude saves (migratie), en dezelfde uitkomst bij dezelfde seed.

Daarnaast `initiative`, `agreements`, `weekloop`, `budget` en `mig`, en een browsercheck op 390 px in licht en donker.

**Omvang [vermoed]:** zoals CEO-2 plus de onderhandelingsrondes, dus één flinke sprint.

---

## Vragen aan de eigenaar
1. **Is "A base of our own" de juiste eerste doorsnede?** Advies: **ja**. Hij raakt de gemeente, financiering, het bestuur, de academie en spelersontwikkeling, en vervangt het duidelijkste tycoon-element.
2. **Mag de investeerder een bestuurszetel krijgen met een echte stem bij latere grote besluiten?** Advies: **ja, één stem**. Zo voel je de zeggenschap die je weggeeft, zonder dat hij de club overneemt.
3. **Mogen de oude projecten `train_ground` en de `facProg`-weg voor het trainingscomplex verdwijnen**, met een migratie voor bestaande saves? Advies: **ja**. Anders bestaan er twee systemen naast elkaar.
