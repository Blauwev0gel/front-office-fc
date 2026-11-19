# Prompt: de technisch directeur als echt personage en echt systeem

*Voor: Claude als voetbalexpert én game developer van De Voorzitter. Branch `voorzitter-fundering`, standalone-spoor.*
*Status: concept, 19-11-2026. Eerst de vragen aan de eigenaar (fase 1), dan pas ontwerp en code.*

---

## Je rol
Je bent tegelijk twee mensen:
- **Een voetbalexpert** die weet hoe een technisch directeur bij een kleine profclub echt werkt. Denk aan scouting en netwerk, selectieplanning, contracten en makelaars, verhuren, de academie, deadline day, en de spanning met de trainer en de penningmeester.
- **Een game developer** die alleen bouwt wat het spel beter maakt. Elke TD-functie moet een beslissing of een verhaal opleveren voor de voorzitter, anders bouw je hem niet.

Lees eerst:
- `CONCEPT-VOORZITTER-2026-11-18.md` §13: keuzes 37–51 gaan over de TD, de kaders, het mandaat en de spelerspool; keuzes 52–58 over de spellaag.
- `TD-SELECTIE-VOORZITTER.md`.
- `PROMPT-ECHT-SPEL-VOORZITTER.md`: de pijlers en de harde grenzen.
- In de code: `src/club/club.js` (`tdWindow`, de vrije spelers buiten de windows, verlengingen, `cfNeeds`/`cfPlan`), `src/club/market.js`, `src/chairman/meeting.js` (mandaat, `judgeDirector`), `src/chairman/cards.js` (de TD-afspraken) en `src/club/feed.js` (`tdBuy`, `tdWork`, `scouting`).

## Het probleem
Nu is de TD vooral een **automaat met een naam**:
- Hij koopt, verkoopt en verlengt binnen de kaders, en de speler leest daar een regel over.
- Je voelt niet wie hij is, waar hij op jaagt, of hij goed is in zijn vak, of wat jouw mandaat met hem doet.
- Een window voelt niet als een gebeurtenis.
- Een slechte TD herken je pas aan de stand, niet aan zijn werk.

**De vraag:** hoe wordt de TD de interessantste collega van de voorzitter, zonder dat de voorzitter zelf spelers kiest?

## Wat vaststaat (niet heronderhandelen)
- **De voorzitter kiest nooit een speler, opstelling, tactiek of wissel.** Hij zet kaders, geeft een mandaat, maakt afspraken en beoordeelt.
- **De clublaag weet niets van de voorzitterslaag.** De TD werkt zonder voorzitter door (`foundation-test.js` blijft groen). De voorzitter grijpt alleen in via `setFrame`, de afspraken en het mandaat.
- Geen premies, weekdoelen of voorspellingen.
- Een week duurt 30–60 seconden.
- Geen nieuwe meter, valuta of scherm zonder expliciete reden in de ontwerpnotitie.
- Fictieve wereld: geen echte spelers, clubs, makelaars of merken.
- De UI is Engels en volgt de goedgekeurde templates (keuze 64): kaarten, chips, iconen, maximaal twee zinnen per tekstblok.
- Seeded RNG, geen `Math.random`. Oude saves blijven laden.

## Hoe het echt werkt: kies hieruit
Een lijst met wat een echte TD doet. Per item: wat het voetbalkundig is, en wat het voor de voorzitter kan opleveren. **Niet alles wordt gebouwd.** Fase 2 kiest er hooguit drie tot vier.

| # | Echt TD-werk | Wat het de voorzitter kan geven |
|---|---|---|
| 1 | **Een recruitmentfilosofie**: data, netwerk of oog; eigen regio of buitenland | Wie je aanneemt, bepaalt hoe de club eruitziet. Een karakterkeuze bij het aannemen. |
| 2 | **Shortlist en scouting**: een lijst per positie, verslagen van scouts | Wekelijks zichtbaar wie hij volgt, als verhaal in de feed: "Watched X on a wet Tuesday". |
| 3 | **Het voorstel**: een grote transfer gaat naar het bestuur | Een afspraakkaart: geld en principes tegenover één speler. De voorzitter keurt de *prijs* goed, niet de keuze. Grens met "nooit een speler kiezen": vraag 3. |
| 4 | **Deadline day**: biedingen op het laatste moment, een speler die weg wil | Eén spannende week per window met twee of drie snelle beslissingen. |
| 5 | **Makelaars** als terugkerende personages | Een relatie met een geheugen. Een makelaar die je eerder afwees, komt niet meer met zijn beste speler. |
| 6 | **Doorverkoopclausules, huur met optie, bonussen** | Gevolgen die seizoenen later terugkomen ("Saltmere sold Doyle; we get 20%"). |
| 7 | **De selectieplanning**: leeftijdsopbouw en wie er over twee jaar staat | De TD laat een plan van drie jaar zien. De voorzitter beoordeelt of hij het nakomt. |
| 8 | **De lijn naar de academie**: uitlenen, terughalen, debuut | Verhalen over spelers die je ziet opgroeien. Sluit aan op de belofte "a club for our own". |
| 9 | **Track record**: zijn trefkans (aankopen die slagen of flopten) | Bij de ALV en in de zomer een rapport met woorden, geen percentage. De basis voor *houden of ontslaan*. |
| 10 | **Ontslag en aanstelling**: kandidaten met een eigen filosofie | Een grote keuze die de club seizoenen kleurt (faalvorm "de staf"). |
| 11 | **TD tegen trainer**: wie bepaalt het profiel | Bestaat al als situatie; kan dieper als de TD een eigen agenda heeft. |
| 12 | **Concurrentie op de markt**: een rivaal biedt op jouw doelwit | Derbyspanning buiten het veld. Verbindt met de dynamische wereld. |

## Fase 1: vragen aan de eigenaar (interactief, vóór alles)
Stel deze vragen als meerkeuze met een aanbeveling. Hooguit vier per ronde. Leg niets vast zonder antwoord.

1. **Hoe dicht staat de voorzitter op de TD?**
   - (a) Op afstand: alleen kaders en een oordeel achteraf.
   - (b) Afstand plus één keer per window een groot voorstel ter goedkeuring.
   - (c) Wekelijks overleg.

   *Aanbeveling: b.*
2. **Wat maakt een TD goed of slecht?**
   - Een verborgen vaardigheid die je pas na een seizoen leert kennen.
   - Zichtbare eigenschappen bij het aannemen.
   - Allebei: zichtbaar karakter, verborgen kwaliteit.

   *Aanbeveling: allebei.*
3. **De grens van het kiezen.** Mag de voorzitter een voorstel afwijzen als hij de speler niet ziet zitten, of alleen op geld en principes?
   - Op principes: hij ziet de speler, maar beslist over prijs, loon en huisregels.
   - Ook op de speler zelf.

   *Aanbeveling: op principes; anders kies je toch spelers.*
4. **Deadline day:** een eigen spannende week per window, of gewoon een drukke feed?
5. **Makelaars:** terugkerende personages met een geheugen, of alleen een naam op een kaart?
6. **De TD vervangen:** mag dat midden in het seizoen, en wat kost het (afkoopsom, onrust bij de spelers)?
7. **Track record:** zichtbaar per aankoop ("Hit / Miss / Too early"), of alleen als oordeel in de zomer?
8. **Hoeveel van de week kost de TD?**
   - Bijna niets buiten de windows: alleen de feed.
   - Af en toe een kaart in *In the post*.

   *Let op de grens van 30–60 s per week.*

## Fase 2: ontwerp (na de antwoorden)
- **Keuze:** kies drie tot vier items uit de tabel.
  - Per item: welke pijler het dient (binding, levende club, seizoensboog, inzet, beloning) en de ontwerpregel ACTIE → CONSEQUENTIE → UITKOMST → nieuwe situatie, met een concreet voorbeeld uit Ravensby.
- **Wat je níét bouwt:** benoem welke items je bewust laat liggen, en waarom.
- **Een TD-profiel:** naam, filosofie (één van drie of vier), twee eigenschappen, een verborgen vakmanschap, een netwerk (regio's of clubs) en een track record.
  - Laat zien hoe elk veld meetbaar ander gedrag geeft. Lukt dat niet, dan schrap je het veld (dezelfde test als bij de kaders, keuze 39).
- **Het window als gebeurtenis:**
  - wat de speler per week ziet in de aanloop, op deadline day en erna;
  - welke kaarten er in *In the post* komen;
  - hoe het in de feed en op de clubpagina staat.
- **Het oordeel:** hoe `judgeDirector` uitgroeit tot een zomerrapport dat de keuze *houden, waarschuwen of ontslaan* betekenisvol maakt.
- **De state:**
  - nieuwe velden met een veilige default en een migratie;
  - alles in de clublaag waar het bij hoort; de voorzitterslaag leest via de cfApi.
- **Een ontwerpnotitie** `TD-VOORZITTER.md` van maximaal ±40 regels. Leg die eerst voor aan de eigenaar.

## Fase 3: bouwen (pas na akkoord op de notitie)
- Klein en af: eerst het TD-profiel met meetbaar gedrag, dan het window als gebeurtenis, dan het oordeel.
- Volg de patronen:
  - `cfEv` voor zichtbaar werk;
  - feed-templates in `club/feed.js`, met variabele delen zodat `feedUsed` ze niet blokkeert;
  - afspraakkaarten via `D(...)`;
  - `loy(...)` voor relaties.
- UI volgens de templates: een voorstel als ruilkaart (*You give* / *You get*), het track record als chips (Hit/Miss), deadline day als tijdlijn.

## Testen (meld eerlijk wat faalt)
- `node build.js`, daarna `foundation-test.js`, `chairman-audit.js`, `identity-test.js` en `mobile-audit.js`.
- **Een nieuwe `td-test.js`, over 20 seeds en drie seizoenen zonder voorzitter:**
  - Elke filosofie en elk netwerk geeft meetbaar andere aankopen (leeftijd, herkomst, prijs, aantal).
  - Een goede TD scoort na drie seizoenen aantoonbaar beter dan een slechte (teamsterkte, waarde van de selectie), maar niet altijd. Het geluk blijft zichtbaar.
  - Hooguit één sleutelverkoop per window (keuze 44); een jong toptalent alleen bij een extreem bod.
  - Geen window zonder zichtbaar werk in de feed.
- **De audit:** hoeveel TD-kaarten de voorzitter per seizoen krijgt, en de tijd per week (moet 30–60 s blijven).
- **Een speeltest door de eigenaar:** "Weet ik na één seizoen wie mijn TD is, en of ik hem wil houden?"

## Wat je níét doet
- Geen scoutingscherm, database, zoekfilter of spelerslijst om uit te kiezen. Dat is een ander spel.
- Geen getallen voor de vaardigheid van de TD in de UI; alleen woorden en zijn werk.
- Geen onderhandelingsminigame over bedragen.
- Niets bouwen voordat fase 1 en de ontwerpnotitie akkoord zijn.
