# THE FRONT OFFICE — UX-FIRST GAME DESIGN AUDIT
## De CEO-fantasie als dagelijkse spelervaring

**Datum:** 17 november 2026  
**Onderzochte branch:** `claude-game`  
**HEAD vóór de auditcommit:** `a2e3c0b4dfd4812e9c4655bcdf55051e0215b226`  
**Methode:** gerichte, statische inspectie van de actuele UI-code, route-/navigatielogica, spelteksten, documentatie en bestaande audits. **Geen browserplaytest, geen seizoenssimulatie, geen gebruikersinterviews, geen codewijzigingen.**  
**Bewijscodes:** **CODE** = rechtstreeks zichtbaar in broncode, **DESIGN** = expertevaluatie, **PROPOSAL** = nieuw voorgesteld gedrag, **UNTESTED** = vraagt interactie-/gebruikersonderzoek.

## 1. Executive verdict

**Het centrale probleem is niet een gebrek aan systemen, maar een gebrek aan een consequent georkestreerde CEO-ervaring.** The Front Office hééft oprichting, stafkeuze, mandaten, afdelingen, gesprekken, een rode beslismap, volledige wedstrijddagschermen, een krant, transferperiodes, evaluaties en clubgeschiedenis. Toch worden veel van deze onderdelen afzonderlijk gepresenteerd. De speler moet regelmatig zelf de samenhang leggen tussen *de mensen die hij heeft aangesteld*, *wat zij van plan waren*, *wat er deze week werkelijk gebeurde* en *wat de club er volgende week van merkt*.

De game heeft een sterke eigen vorm: **`You run the club. Not the team.`** (`src/ui/02-setup.js:2–6`). De beste richting is geen grote redesign, maar een betere redactionele en bestuurlijke ordening van wat al bestaat.

**De primaire vraag voor de volgende sprint:** wat ziet de CEO aan het begin van de week, wie heeft wat voor hem afgehandeld, welk echt besluit ligt er bij hem, en waarom is de komende wedstrijd anders dan de vorige?

### Vijf essentiële ervaringen

| Ervaring | Waarom essentieel | V2-beoordeling |
|---|---|---|
| **Eigenaarschap** — mijn club, mijn keuzes | Club-DNA, plaats, staf en doelen maken een unieke carrière | **Sterke basis**, maar het begint als relatief lange setup (CODE/DESIGN) |
| **Vertrouwen en verantwoordelijkheid** — deze mensen runnen mijn club | Hoofden, mandaten, records en gesprekken bestaan | **Aanwezig maar gefragmenteerd**; verslag en relatie zijn niet consequent één verhaal |
| **Voetbalspanning** — zaterdag betekent iets | Voorbeschouwing, live scherm en Gazette zijn aparte, doorlopende fases | **Sterkste UX-basis**; persoonlijke gevolgen kunnen prominenter |
| **Bestuurlijke spanning** — ik moet afwegen, niet klikken | Red box, escalatieverklaring, deadlines, belangen | **Veel fundament**, maar briefings, meetings en escalaties delen een postvakmetafoor |
| **Geschiedenis** — mijn club verandert door de seizoenen heen | Gazette-archief, contracten, prestaties, historie, seizoenreview | **Aanwezig**, maar oude beslissingen krijgen nog te weinig structurele terugkoppeling in het eerste scherm |

### Indicatieve UX-scorekaart (0–10, géén playtest)

| Dimensie | Score | Korte onderbouwing |
|---|---:|---|
| CEO-fantasie | **7** | Mandaten/zelfstandige medewerkers, maar setup en interface schakelen geregeld naar parameters |
| Voetbalbeleving | **7** | Voorbeschouwing met derby, vorm, coach, spelers en aparte wedstrijd/Gazette |
| Dagelijkse gameplay | **6** | Rode map en weekthema bestaan; tempo en inhoud blijven sterk afhankelijk van losse items |
| Navigatie en overzicht | **6** | Vijf consistente hoofdtabs, maar meerdere ingangen, folders, sheets en subtabniveaus |
| Gesprekken en relaties | **6** | Portretten, instinct, vertrouwen, Talk en verzoeken; tijdlijn van afspraken is verspreid |
| Wedstrijddag | **8** | Eigen preview → wedstrijd → krant, duidelijke grote CTA en controls |
| Seizoensverloop | **7** | Transferzomer, winterwindow, pers, doelen, season review; overgang kan sterker als verhaal |
| Emotionele betrokkenheid | **6** | Heldere clubidentiteit en spelersverhalen; verbinding tussen mensen, keuzes en afloop verdient prioriteit |

**Geen algemeen gemiddelde als harde kwaliteitsclaim:** deze scores zijn hypotheses op basis van de implementatie. Werkelijke tempo-, contrast- en frustratiesignalen zijn **UNTESTED**.

## 2. Huidige spelersreis — scherm voor scherm

### 2.1 Oprichting: een clubdroom, gevolgd door veel configuratie

**CODE:** `src/ui/02-setup.js:8–42` vraagt clubnaam, plaats, afkorting en kleuren en doorloopt zeven DNA-keuzes; daarna bevestigt het spel de clubidentiteit. `vSetupStaff` (`:43–63`) laat op één budget zeven rollen doorlopen, waarvan TD/DoF en trainer verplicht zijn. `vSetupMandates` (`:84–99`) presenteert presets, sliders en regels. `src/ui/03-summer-preseason-press.js` vervolgt met zomeroverleg, voorseizoen en persconferentie.

**Sterk:** de speler kiest waarden en persoonlijkheden voordat hij sportieve resultaten ziet. Dit is een afwijkende spelerfantasie van Football Manager.

**Tension point:** na het emotionele moment 'Found your club' volgen veel managementinstellingen vóór een eerste echt bestuurlijk moment. Het aanstellen van een TD is interessant; zeven rollen vergelijken en vele schuifjes afwerken kan aanvoelen als configuratie. De rol van *waarom dit vanavond belangrijk is* ontbreekt geregeld. Bovendien zegt de mandaattekst nog dat veranderen 'costs an action', terwijl besluit B21 actiepunten heeft afgeschaft (`src/ui/02-setup.js:84–99`); dat is verouderde copy, geen UX-intentie.

**PROPOSAL:** behoud alle huidige keuzes, maar presenteer ze als drie hoofdstukken: **De club die je wilt bouwen → Je eerste twee sleutelpersonen → Hun opdracht**. Optionele afdelingen en fijne mandaatinstellingen mogen later op het bureau terugkomen als adviseursvoorstellen. Niet minder diepte, wel minder initiële beslisdruk. De eerste werkdag moet een samenvatting geven: *dit erfde je; dit heb je afgesproken; dit wordt jouw eerste test*.

### 2.2 Eerste werkdag: informatie is er, ceremonie en context ontbreken

**CODE:** `src/ui/10-inbox.js:106–127` combineert weekthema, compacte stand-/cash-/wedstrijdstrip, achterbannen, rode map, 'On your desk', krant, afgehandelde zaken, aankomende momenten en folders. Een eerste-scherm-tour bestaat (`src/ui/13-redbox-render.js:99–107`).

**DESIGN:** de bezoeker ziet vrijwel onmiddellijk een functioneel postvak, niet een georkestreerde kennismaking met de club en het kantoor. Hij moet zelf afleiden wie essentieel is, waarom hij de TD of trainer zou spreken en wat de eerste afspraak is.

**PROPOSAL:** een eenmalige **Your first briefing** boven het bestaande bureau, opgebouwd uit echte state en bestaande staf: seizoenverwachting, kernafspraak met TD/trainer, eerstvolgende wedstrijd, één uitnodiging om hun profiel te openen. Laat daarna het gewone bureau spreken. Geen apart onboarding-scherm nodig.

### 2.3 Een week: reeds sterke indeling, maar te veel parallelle categorieën

**CODE:** `src/ui/10-inbox.js:7–35` vertaalt open messages, meetingvoorstellen, briefs, mijlpalen, dossiers, overeenkomsten, verslag en krant naar `inboxItems()`; `vInbox` sorteert rode-map-items op `pri`. Het hoofdscherm toont achtereenvolgens `weekTopic`, `rstrip`, backers, `redbox`, `desk`, Gazette, afgehandeld, `comingHtml()`, foldernavigatie (`:106–127`).

**Sterk:** onderscheid tussen 'Needs you', updates en afgehandeld; een rustige rode map is mogelijk, en de CTA laat de speler doorgaan. **Zwak:** de domeinen 'message', 'brief', 'digest', 'meeting', 'dossier', 'newspaper', 'milestone' zijn voor de code logisch, maar op de interface te vaak gelijkwaardige items. Het relevante *verhaal van deze week* is daardoor afhankelijk van de selectie en volgorde van losse rijen. 'Main issue' is een prioriteitslabel, niet noodzakelijk één causale narratieve hoofdlijn.

**PROPOSAL:** maak van `vInbox` een **wekelijkse CEO-briefing** met drie stabiele lagen:
1. **This week at the club** — hoogstens twee relevante ontwikkelingen; wat is er veranderd sinds de vorige match?
2. **Your red box** — echte beslissingen met een eigenaar, reden en consequentie bij nietsdoen.
3. **Handled by your team / Coming up** — wat medewerkers deden en wat eraan komt.

Laat het bestaande postvak/folders als archief- en verdiepingstoegang bestaan. Vermijd verplicht nieuws lezen of extra bevestigingen.

### 2.4 Wedstrijd: het beste uitgewerkte rituele moment

**CODE:** `src/ui/14-matchday-gazette.js:17–39` toont stadionbeeld, thuis/uit, weersverwachting, aanwezigen, vorm, de stand, inzet, belangrijke spelers en een coachquote. `:41–94` heeft een apart live scherm met score, tijd, ticker, balbezit, key events/stats/report en 2×/Full time. `:139–168` sluit af met een volledige Gazette en knop **Start week N**.

**Sterk:** de wedstrijd is daadwerkelijk een andere plaats dan de inbox, geen popup. De speler beweegt in duidelijke volgorde preview → match → krant → bureau. Ook belangrijke spelers kunnen doorgeklikt worden.

**DESIGN:** de coachquote en 'At stake' worden uit een beperkte set contextuele formuleringen gekozen; de structurele link naar **de afspraak met je trainer, de aankoop van de TD, een blessurebesluit of een jeugdbeleid** kan prominenter. Tijdens de wedstrijd is het niet nodig de CEO plots tactisch te laten sturen; dat zou de centrale fantasie ondermijnen.

**PROPOSAL:** één **story thread** per match: in de preview welke club-/personeelsbeslissing zichtbaar op de proef staat, tijdens de match welke echte speler-/teamgebeurtenis die spanning raakt, en na afloop in Gazette wat dit betekent voor de afspraak. Vertel alleen wat de bestaande state werkelijk ondersteunt. Maak **Go in** bij halftime (`src/ui/14-matchday-gazette.js:90`) expliciet een bestuurlijk/vertrouwensmoment, niet een verborgen tactiekcommando.

### 2.5 Zomer/winter: duidelijke vorm, maar sommige keuzes zijn te transactioneel

**CODE:** `src/ui/03-summer-preseason-press.js:41–102` kent zomermeeting, ticker, draft, debreif; winter heeft eigen stappen. De TD communiceert voorstellen en budgetten met keuzes en adviesmarkeringen.

**Sterk:** overstap van gewone week naar belangrijke transferperiode is zichtbaar en eigen. **Tension:** de gebruiker loopt meerdere review-/next-/skip-acties door en budget/squad/advies zijn niet altijd expliciet één conflict op één kaart. **PROPOSAL:** ieder transferwindow krijgt één leesbare hoofdagenda: **DoF's plan → Wat trainer/Finance anders zien → Wat jij beslist → Wat er werkelijk gelukt is**. Bestaande ticker behouden, maar alle nieuwsregels blijven gerelateerd aan de geaccordeerde prioriteiten. Geen nieuw transfermechaniek.

### 2.6 Einde seizoen: mooi rapport, nog niet het volledige bestuurlijke terugblikgesprek

**CODE:** `src/ui/09-firstteam-review.js:45–60` toont krantenkop, promotie/degradatie, punten, doelen, beloften, beoordeelde transfers, doorgestroomde jeugd en eindstand. Daarna **Start the summer**.

**Sterk:** sportieve afronding en overgang. **Zwak:** het rapport benoemt *wat* gebeurde, maar de relatie met **wie verantwoordelijk was**, **welke afspraken je maakte**, **wat je dit seizoen hebt geleerd** wordt relatief weinig geënsceneerd. De overstap naar de volgende zomer kan aanvoelen als naar een volgende wizard gaan.

**PROPOSAL:** **Season review as board conversation** met drie compacte onderdelen boven/naast het bestaande rapport: wat is bereikt, de belangrijkste bestuurlijke consequentie, en één vraag die het volgende seizoen opent. De feiten blijven in de Gazette en het rapport; de board meeting interpreteert ze. Geen extra niet-gegronde ontslagdreiging genereren.

## 3. Informatiearchitectuur en mobiele UX

### 3.1 Wat er daadwerkelijk op het scherm staat

**CODE:** `src/ui/13-redbox-render.js:108–125` heeft vaste navigatie **Inbox / Club / Squad / League / Depts** en één prominente **Next match / Play week**-CTA. `render()` routeert setups, zomer, voorseizoen, pers, review, matchday en standaard tabs. `src/ui/08-departments.js:106–160` gebruikt **Now / Plan / Record** per afdeling; een gesprek kan de afdelingweergave vervangen. `src/ui/04-masthead-news.js:2` definieert ook een alternatieve `tabs()` met **Desk / News / Club / Staff / Squad / League**, maar `render()` gebruikt `vBar()`. Dit is een aanwijzing voor een oude of secundaire interface-route, geen bewezen zichtbare dubbele navigatie.

### 3.2 Concreet UX-oordeel

- **Sterkte:** vijf hoofdtabs zijn overzichtelijk; wedstrijddag en seizoensfases mogen daarvan afwijken.
- **Knelpunt:** de speler navigeert via de inbox, tab, afdeling, `Now/Plan/Record`, accordions, sheets en soms een vervangen gespreksweergave. De informatiehiërarchie is gelaagd en niet altijd gebaseerd op een concreet CEO-doel.
- **Knelpunt:** `src/ui/07-club-league.js:17–33` is inhoudelijk rijk (DNA-fit, achterbannen, doelen, beloften, geld, projecten, historie), maar presenteert vooral categorieën en indicatoren. 'Club' is nu een goed archief, minder een bestuurlijk overzicht dat één heldere ontwikkeling laat zien.
- **Knelpunt:** `src/ui/13-redbox-render.js:33–60` gebruikt de mailmetafoor sterk; informatie en beslissingen krijgen beide uitvoerbare antwoordopties. Er is soms het label `Update` naast een knopkeuze, wat het onderscheid tussen lezen en beslissen vervaagt.
- **Knelpunt:** `src/ui/10-inbox.js:116` toont een cash-statusknop die naar tab `staff` gaat (`data-t="staff"`), ondanks dat detailfinanciën in Business te vinden zijn. Dit is een aantoonbaar verrassende navigatiebestemming.
- **Knelpunt:** `src/ui/02-setup.js:84` noemt nog actiekosten voor mandaatwijziging, strijdig met B21.

### 3.3 Verbeterde informatiesoorten — géén nieuwe tabs

| Soort | Waar primair thuishoort | Interactie |
|---|---|---|
| **Escalatie** | Rode map | Eén keuze met duidelijke besliseigenaar en gevolg |
| **Gespreksverzoek** | Rode map / verantwoordelijke afdeling | Open gesprek met vooraf beschreven aanleiding |
| **Operationeel besluit door head** | Weekbriefing + Record | Alleen lezen; optioneel verdiepen |
| **Voortgang van afspraak** | Afdeling / weekbriefing bij relevante verandering | Doorklik naar dezelfde afspraak |
| **Sportief feit** | Gazette / Squad / League | Feitelijk, optioneel verdiepen |
| **Strategische rapportage** | Club / afdeling | Bekijken, niet onnodig bevestigen |
| **Deadline/volgend moment** | Coming up | Tijd en consequentie zichtbaar |

Dit scheidt **aandacht** van **verplichting** en maakt stille, competente weken wenselijk in plaats van leeg.

## 4. Mensen, relaties en verantwoordelijkheid

**CODE:** `src/ui/02-setup.js:43–63` toont kandidaten inclusief karaktertrekken, vaardigheden, ervaring en salaris. `src/ui/08-departments.js:8–30` toont afdelingen als personen; `:31–43` heeft bevoegdheid en bijbehorende mandateigenschappen; `:106–160` combineert Now, Plan, Record, mensen, personeel, budget, projecten en direct **Talk**. `src/ui/09-firstteam-review.js:2–45` toont de trainer met relatie, mandaatvolging, vorm, gesprekken, doelstellingen en spelersbeelden.

**Wat goed is:** afdelingen worden geleid door personen en krijgen portretten, niet alleen abstracte cijfers. **Wat mist in de presentatie:** de relatie is vaak een actuele `rel`-score, karakterbadge of KPI en niet een expliciete serie *je sprak af → hij deed → dit resultaat → nu moet je beoordelen*.

### CEO-interactie per rol

| Rol | Aanwezige contactmomenten | Voorgestelde UX-verbetering |
|---|---|---|
| TD / DoF | Transferplan, scouting, squad planning, gesprek, Record | Eén altijd vindbare **our agreement** met prioriteit, mandaat, recente uitvoering |
| Trainer | Form, coachvoice, speelstijl, doelen, matchquote | De laatst afgesproken sportieve koers op preview én coach-Record |
| Hoofd scouting | Regio, rapporten, scoutwerk, Talk | Wat is onderzocht, welke observatie veranderde het TD-plan |
| Jeugdopleiding | Instroom, talenten, ontwikkeling, traject | Volg 1–2 echte talenten over meerdere clubmomenten |
| Finance | Budget, kas, mandaten, board/projectmomenten | Advies koppelen aan echte strategische keuze, niet extra cijfers |
| Commercieel | Sponsoring, kaartverkoop, budget, Talk | Geef sponsoraanbiedingen context van clubwaarden en supporters |
| Marketing | Groei, campagnes, supportersreacties | Toon relatie tussen genomen positionering en zichtbare achterban |
| Bestuur | Doelen, reviews, druk | Momenten van verantwoording; onderscheid bestuur van de dagelijkse inbox |
| Supporters | Backer-mood, nieuws, reacties | Laat reactie vooral op echte clubgebeurtenissen volgen |

**DESIGN-principe:** een gesprek is pas interessant als er context, een verschil van inzicht en een toekomstige afspraak in zit. Laat **Talk** geen universele relatieknop worden. Behoud korte teksten, maar laat 'vorige afspraak' of 'laatste ontwikkeling' terugkomen op het profiel.

## 5. Voetbal als dagelijkse beleving

De game kent al voetbalinhoud: spelerprofielen, vorm, ranglijst, derbylabel, competitiedruk, academie, transferwindow, blessures, coachuitspraken, board/stafreacties en statistieken (`src/ui/05-pitches-squad-money.js`, `07-club-league.js`, `09-firstteam-review.js`, `14-matchday-gazette.js`).

**De vraag is niet hoeveel voetbaldata zichtbaar zijn.** Het verschil is of de speler zich herinnert *waarom deze voetballer van belang is*. `mdPreview()` noemt al 'Our story this week' en speciale spelers: benut dit als narratieve verbinding. Een 17-jarige die door de trainer voor het eerst wordt opgesteld is groter nieuws na een jeugdafspraak; een nieuweling die scoort is groter nieuws als de TD voor hem zijn budget verdedigde.

Dat moet **feitelijk** ondersteund zijn: geen verzonnen quotes van al bestaande personen of causale verbanden die niet bestaan. De Gazette kan kiezen uit opgeslagen gebeurtenissen en echte feiten.

### Wat nadrukkelijk níét hoeft

- CEO selecteert geen XI of wissels.
- Geen extra spelersmeters of nieuwe overkoepelende loyaliteitsmeter.
- Geen verplichte cutscenes en geen krantenpagina die je elke keer volledig moet lezen.
- Geen systematische dramaproductie in rustige weken.
- Geen dynamische verhaalgenerator die oncontroleerbare gebeurtenissen verzint.

## 6. Vijf UX-first gameplayscenario's (PROPOSAL, geen bewering over huidige werking)

### Scenario A — De eerste werkdag

**Situatie:** speler richt `Harwick Athletic` op, kiest lokale identiteit, stelt TD en trainer aan en geeft eerste mandaten.

**Nieuw eerste bureau, tekstwireframe:**

```text
HARWICK ATHLETIC                            WEEK 1
YOUR FIRST BRIEFING
The board expects a respectable first season.

YOU APPOINTED
DoF: Eva Rossi — young players, cautious fees
Coach: Jack Doyle — direct football, wants experience

WHAT THEY AGREED
Rossi: review the centre-backs before the window
Doyle: give two academy players a first-team chance

YOUR FIRST CALL
Finance: "Can we afford both plans?"
[Discuss funding] [Keep within existing budget]

NEXT MATCH
Harwick Athletic v Brookmere Town
[Go to match preview]
```

**CEO-besluit:** alleen waar Finance en TD werkelijk botsen; als er geen conflict is, een informatieve eerste briefing met optie om staf te bezoeken. **Delegatie:** scouting en selectie blijven bij TD/coach. **Waarom interessant:** de speler voelt onmiddellijk dat *zijn* keuze voor twee mensen een clubrichting oplevert.

### Scenario B — Een rustige week

**Situatie:** twee overwinningen achtereen; staf functioneert zonder escalatie.

```text
WEEK 8 — THE CLUB IS SETTLING
No decisions need your signature.

YOUR TEAM THIS WEEK
Rossi's scouts completed their centre-back report.
The academy promoted a promising midfielder.

SATURDAY
Away to Redchester — a difficult test.

[Meet the DoF]      [Next match]
```

**Geen kunstmatige keuze.** Een vrijwillig gesprek is zinvol als het rapport informatie heeft die de CEO wil bespreken. **Waarom interessant:** de speler ziet vooruitgang en bouwt verwachting op naar zaterdag. De club voelt autonoom.

### Scenario C — Vier nederlagen

**Situatie:** resultaten vallen tegen; coach heeft een andere verklaring dan de TD. Bestuur is bezorgd; supporters worden onrustig.

```text
WEEK 14 — FOUR DEFEATS IN A ROW
Board: "We need a credible response."

COACH DOYLE
"My squad is thin; we need experienced cover."

DOF ROSSI
"The problem is development time, not recruitment."

THE DECISION
[Back the coach's short-term approach]
[Stick with the longer squad plan]
[Ask them for a joint proposal]
```

**Bestuurlijke keuze:** geen tactisch menu, wel beleid en consequenties. **Opvolging:** over echte volgende matchen/journaal wordt één gezamenlijk verhaal bijgehouden; geen vijf losse crisisberichten. **Waarom interessant:** verschillende meningen bestaan binnen de club, en de CEO bepaalt de koers.

### Scenario D — De transferzomer

```text
SUMMER MEETING
Rossi, DoF: "Our priority is a young centre-back."
Doyle, coach: "We need someone ready for Saturday."
Finance: "We can fund one major signing, not two."

YOUR RESPONSE
[Back the DoF's long-term recruitment plan]
[Prioritise the coach's immediate need]
[Require a revised plan within budget]
```

**Gevolg:** bestaande transferbrief, ticker en debrief verwijzen naar dit gekozen beleid. **Delegeren:** TD benadert spelers, coach selecteert. **Waarom interessant:** 'beleid' is een gezamenlijk besluit onder spanning, niet een slider zonder verhaal.

### Scenario E — Een wedstrijd om promotie

```text
MATCHDAY 33 — ONE WIN FROM PROMOTION

COACH
"The youngsters got us here. I'm sticking with them."

THE STORY
Academy player Amir Malik makes his 20th start.
DoF signing Luca Moretti returns from injury.

[KICK OFF]

[Full-screen match: scores, ticker, real match events]

THE HARWICK GAZETTE
"Malik's late winner sends Harwick up!"
Coach Doyle: "We kept our promise."

WHAT THIS CHANGES
Promoted to the next division.
Board objective met.
Rossi's two-year squad plan will be reviewed in summer.

[Start week 34]
```

**Kritische regel:** een winnende Malik-goal en eerder jeugdbesluit mogen alleen worden verbonden als de save en matchstate dat daadwerkelijk ondersteunen. Als Malik niet speelt of de club niet promoveert, moet het verhaal anders zijn. **Waarom interessant:** het sportresultaat is verbonden aan gemaakte keuzes, niet alleen aan een scoreboard.

## 7. Drie onafhankelijke expertverdicts

### Expert 1 — Lead Game Designer

**Sterk:** indirecte leiding, club-DNA, echte weekritmes, aparte wedstrijddag, seizoenscyclus en journalistieke vorm. **Zwak:** teveel *game-objecten* (bericht, brief, meeting, tab, verslag) nemen de rol van een consistent verhaal over. Een speler kan veel beslissen zonder op een later moment de betekenis van die beslissingen te voelen.

**Verdict:** vertel niet meer verhalen; **koppel dezelfde verhalen beter door bestaande momenten heen**. Het hoofdprobleem is compositorisch.

### Expert 2 — Senior UX / Interaction Designer

**Sterk:** vaste navigatie met vijf tabs, prominente week-CTA, aparte matchflow, telefoonvriendelijke kaartbediening en duidelijk verschil tussen red box en staff-updates.

**Zwak:** het home/bureau heeft veel verticale lagen; het ontstaan van een gesprek, de rol van een brief en de functie van een dossier zijn niet altijd direct verschillend. Subnavigatie via sheets, afdelingen en accordions maakt de weg naar een volgende actie minder vanzelfsprekend. Concrete copy-/routingissues: action-cost-copy (`ui/02`) en cashstrip naar Staff (`ui/10`).

**Verdict:** richt iedere primaire pagina rond **één dominante vraag**: wat speelt hier, waarom nu, en welke actie heb ik? Bewaak voorspelbare terugkeer naar het bureau.

### Expert 3 — Football CEO / Sporting Director

**Sterk:** TD en trainer zijn verschillende rollen; autonomie is inhoudelijk leidend; staf bouwt eigen mensen op; transferoverleggen, seizoensreview, boarddoelen en personeelsrisico's zijn geloofwaardige verantwoordelijkheden.

**Zwak:** een echte clubbestuurder wordt niet de hele dag gevraagd elk klein feit te bevestigen. De interessantste interacties zijn verschillen in visie, inzet van middelen, het beoordelen van mensen en het afleggen van verantwoording. Deze zijn geïmplementeerd, maar in de presentatie onvoldoende onderscheiden van updates en routine.

**Verdict:** laat een CEO vooral **mensen en afspraken managen**, niet zijn postvak. Succes moet ook zichtbaar zijn als zijn personeel zonder hem goed werkt.

## 8. Confrontatie — waar zit de echte prioriteit?

| Ontwerpvraag | Game designer | UX designer | Football CEO | Gezamenlijke richting |
|---|---|---|---|---|
| Wat moet de speler elke week zien? | Ontwikkeling van één hoofdverhaal | Herkenbare infohiërarchie | Resultaat van staf en open uitzonderingen | **Weekbriefing vóór berichtencatalogus** |
| Meer dialoog? | Alleen als verhaallijn vooruitgaat | Kort en scanbaar | Alleen bij beleidsvraag of evaluatie | **Afspraak → uitvoering → gesprek** |
| Wedstrijd opnieuw ontwerpen? | Nee, grootste structurele winst al geboekt | Verbeter scharniermomenten | Verbind match aan technische koers | **Matchflow behouden** |
| Meer navigatie? | Nee | Minder contextwisselingen | CEO hoeft niet alles te doorgronden | **Bestaande vijf tabs behouden** |
| Wat maakt seizoenen memorabel? | Doorlopende personages | Herkenbare geschiedenis | Opvolging van beleidsbesluiten | **Clubgeheugen zichtbaar maken** |

### Tien expliciete kritische antwoorden

1. **Sterkste deel:** de heldere fantasie 'run the club, not the team', uitgewerkt met mandaten en matchritueel.
2. **Minst voetbal:** sommige management- en budgetkaarten kunnen evengoed bij een willekeurige organisatie passen.
3. **Minst CEO:** de interface blijft geregeld vragen om kleine antwoordopties zonder echte strategische afweging.
4. **Onnodig ingewikkeld:** meerdere bericht-/brief-/foldertypen en diep afdelingsnavigatie.
5. **Te oppervlakkig:** betekenis van personeelsafspraken in latere weken.
6. **Belangrijkste te herzien scherm:** het primaire bureau (`vInbox`), niet de matchengine.
7. **Goed systeem, matige presentatie:** stafautonomie en het afdelings-Record, doordat ze zelden als doorlopend werkverslag samenkomen.
8. **Emotionele band:** terugkerende personen, jeugdspelers en herinnerde besluiten verdienen een prominente rol.
9. **Waarom iemand na een uur kan afhaken (DESIGN-hypothese):** te veel setup en het gevoel willekeurige items af te werken.
10. **Waarom iemand tien uur kan blijven (DESIGN-hypothese):** groei van de club, herkenbare mensen, beslissingen met gevolg, promotie en eigen clubgeschiedenis.

## 9. Voorstel: één samenhangende spelstructuur

**A. Oprichting — The club you want to build.** De droom en identiteit, gevolgd door sleutelpersoneel; optionele details gefaseerd.

**B. Bureau — This week at your club.** Een duidelijk weekthema, concrete ontwikkelingen, rode map en werk van de staf. Hergebruik `vInbox`; maak het een briefing, geen nieuw scherm.

**C. Medewerkers — Our agreement.** Elk hoofd heeft een zichtbare laatste afspraak/plan, recente prestaties en een dialoog die daarop kan reageren. Bestaande Now/Plan/Record behouden, maar met herkenbare status- en vervolgtekst.

**D. Week — Review → Decide → Match.** Kijk wat personeel deed; behandel zo nodig escalaties; speel vervolgens. Geen verplichte besluitquota.

**E. Wedstrijd — Football's main event.** Behoud eigen full-screen flow; laat coach, spelersverhalen en beleidskeuzes in preview en Gazette terugkomen.

**F. Gazette — What really happened.** Echte feiten, duidelijke kop, coachreactie, gevolgen, staffbesluiten en clubgeheugen. Vermijd het automatisch tonen van alles als even belangrijk.

**G. Zomer/winter — Plan → Conflict → Decision → Execution → Review.** Laat de TD-persoonlijkheid en coachbelangen zichtbaar door de bestaande flow lopen.

**H. Seizoen — Legacy and accountability.** Review de boarddoelen én 2–3 kernbesluiten van de speler; verbind met de eerste bestuursagenda voor het komende seizoen.

## 10. Top tien UX-first verbeteringen

Scores **1–5**: **plezier**, **voetbal**, **CEO**, **frequentie**; kosten: **L** = laag, **M** = middel, **H** = hoog. Dit zijn prioriteitsinschattingen, geen gebruiksmetingen.

| # | Verbetering | Plezier | Voetbal | CEO | Frequentie | Kosten |
|---|---|---:|---:|---:|---:|---|
| 1 | Bureau als één duidelijke wekelijkse CEO-briefing | 5 | 4 | 5 | 5 | M |
| 2 | Duidelijk onderscheid: beslissing, gesprek, update, verslag | 5 | 3 | 5 | 5 | M |
| 3 | Afspraken en uitvoering zichtbaar samenbrengen op staffpagina | 5 | 4 | 5 | 4 | M |
| 4 | Matchstory koppelen aan echt personeels-/clubverhaal | 5 | 5 | 4 | 5 | M |
| 5 | Eerste werkdag met samenhangende staf- en clubbriefing | 4 | 4 | 5 | 1 | M |
| 6 | Seizoensreview met verantwoording en volgende dilemma | 4 | 5 | 5 | 2 | M |
| 7 | Transferbrief als gesprek tussen TD/coach/Finance | 4 | 5 | 5 | 2 | M/H |
| 8 | Eén zichtbaar terugkerend jeugd-/spelersverhaal | 4 | 5 | 3 | 3 | M |
| 9 | Clubpagina eerder interpretatie dan metercatalogus | 3 | 3 | 4 | 3 | L/M |
| 10 | Copy-/navigatieconsistentie: cashroute, action-copy, prioriteitslabels | 3 | 2 | 4 | 5 | L |

### Wat níét als UX-verbetering telt

Een extra scherm, langere teksten, meer events of een nieuwe meter zijn zonder beter begrip van keuzes niet automatisch verbetering. Een retro/tekstgerichte presentatie past goed bij deze game, mits de interactie helder blijft.

## 11. Drie concrete ontwikkelsprints

### Sprint UX-1 — The CEO's Weekly Desk (**AANBEVOLEN**)

**Probleem:** dagelijks bureau heeft veel correct gerubriceerde inhoud, maar mist één geprioriteerde, doorlopende bestuurlijke blik.

**Bestaande bestanden/schermen:** `src/ui/10-inbox.js`, `src/ui/12-scenes-cards.js`, `src/ui/13-redbox-render.js`, relevante stijlbestanden; alleen waar nodig bestaande views/datafeeds.

**Nieuw gedrag:**

```text
WEEK 12 / THIS WEEK AT THE CLUB
A difficult run; the board wants a response.

WHAT YOUR PEOPLE DID
DoF — shortlisted two defenders.
Academy — one player moved closer to the first team.

YOUR RED BOX
1 decision · Why it is yours · What happens if ignored
[Open]

NEXT: AWAY TO BRACKEN FC
[Match preview]
```

**Ontwerpregels:** één dominante ontwikkeling bovenaan; maximaal twee sterke secundaire wijzigingen; red box is echt alleen voor decisions; updates mogen worden overgeslagen; gesloten zaken blijven bereikbaar; bij geen updates geen vulling toevoegen.

**Acceptatiecriteria:** iedere week zijn onderwerp, autonomie, verplichte keuzes en volgende wedstrijd visueel te onderscheiden; elke hoofdactie heeft één logische plek; geen verplichte berichten; navigatie op 390px licht/donker blijft werken; oude saves werken; grote focus op scanbaarheid en één-tik-interacties.

**Tests:** kleine gerichte testfixtures voor week 1, rustige week, zware crisisweek, volledig lege red box en een vervolgbrief; handmatige/automatische UI-check van variabele tekstlengtes; bestaande regressies. **Buiten scope:** nieuwe events, grotere engine, nieuwe menutabs.

### Sprint UX-2 — Managing People, Not Departments

**Probleem:** personen, Records en gesprekken bestaan maar vormen niet één duidelijke managementrelatie.

**Bestaande bestanden/schermen:** `src/ui/08-departments.js`, `src/ui/08a-dept-parts.js`, `src/ui/09-firstteam-review.js`; bestaande gesprekken en data, alleen kleine gerichte aanvullingen indien noodzakelijk.

**Nieuw gedrag:**

```text
EVA ROSSI / DIRECTOR OF FOOTBALL
What you agreed: build for youth, under wage cap
Her plan: centre-back succession before summer
This week: two scouts returned; no signing yet
Assessment: on track, one contract risk
[Talk about the plan]  [Review record]
```

**Acceptatie:** coach/DoF/Finance/Academy etc. hebben een consistente, korte status van plan→uitvoering→gevolg; gesprek verwijst naar echte recente context; geen tweede trustmeter; record blijft feitenbron; geen extra klikken per week verplicht. **Buiten scope:** volledige AI-persoonlijkheden of staff-engineherbouw.

### Sprint UX-3 — Matchday to Club History

**Probleem:** wedstrijdschermen zijn visueel sterk, maar kunnen sterker verbinden met de ervaring van het leiden van een club.

**Bestaande bestanden/schermen:** `src/ui/14-matchday-gazette.js`, `src/ui/09-firstteam-review.js`, bestaande preview/news-data en Gazette.

**Nieuw gedrag:**

```text
PREVIEW — A TEST OF OUR YOUTH POLICY
Coach promised minutes to academy players.
[Kick off]

FULL TIME — 2–1
Academy midfielder scored; coach kept his word.

THE GAZETTE
"One of our own wins it"
What this means for the promotion race and coach review
[Start next week]
```

**Acceptatie:** minimaal drie echt door state ondersteunde matchstorytypen (coachafspraak, TD-signing, eigen jeugdspeler); preview, match en krant maken een herkenbaar geheel; nul verzonnen matchgebeurtenissen; duidelijk vervolg naar volgende week; geen handmatige CEO-tactiek; bestaande fast-forward behouden. **Buiten scope:** wedstrijdengine herschrijven, realtime 3D/animaties, nieuwe spelerstatistieken.

## 12. Definitieve keuze

**Kies UX Sprint 1: The CEO's Weekly Desk.** Dat is het scherm dat iedere gewone speelweek de ervaring bepaalt. Hier komt het spelconcept óf samen óf valt het uiteen in losse functies.

Wat moet de speler anders voelen? Niet: 'ik heb drie berichten en moet volgende week klikken'. Wel: **'Mijn hoofd scouting heeft iets ontdekt; mijn TD heeft er een plan voor; het bestuur wil dat ik een keuze maak; zaterdag zie ik wat voor club ik aan het bouwen ben.'**

**Volgorde:** UX-1 → UX-2 → UX-3. Test het bureau eerst met representatieve weken alvorens het veelgebruikte patroon uit te rollen. Bescherm wat al goed is: autonome medewerkers, vijf hoofdtabs, de full-screen wedstrijddag en de Gazette.

**Bewijsgrens:** de statische code laat zien dat structuren en tekstvarianten bestaan; ze kan niet bewijzen dat gebruikers deze flow soepel, plezierig of toegankelijk vinden. Dat vereist een gerichte browser- en gebruikerscheck in de latere implementatiesprint.

---

## Bijlage — bronindex

- `src/ui/02-setup.js:2–99` — titel, DNA, staf, mandaten
- `src/ui/03-summer-preseason-press.js:41–156` — zomeroverleg, winterwindow, voorseizoen, pers
- `src/ui/07-club-league.js:17–47` — cluboverzicht, doelen, geld, historie en competitie
- `src/ui/08-departments.js:8–31,106–160` — afdelingen, bevoegdheden, drie subtabs, gesprekken
- `src/ui/09-firstteam-review.js:2–70` — trainer, review en ontslag
- `src/ui/10-inbox.js:7–35,98–127` — inkomende typen, rubrieken, weekbureau, volgorde
- `src/ui/12-scenes-cards.js:32–63,101–116` — gespreksscènes, inbox-detail, verslag, preview
- `src/ui/13-redbox-render.js:33–60,99–133` — mail-interactie, tour, navigatie en render
- `src/ui/14-matchday-gazette.js:17–94,139–168` — preview, wedstrijd, Gazette en terugkeer
- `BIBLE.md`, `OVERZICHT.md`, `CODEMAP.md`, `CLAUDE.md`, `docs/audits/2026-11-17-dual-expert-codebase-audit.md`, `docs/audits/2026-11-17-dual-expert-codebase-audit-v2.md` — bestaand concept, intenties en eerdere technische analyses

**Geen spelcode gewijzigd. Geen build/tests/playtest uitgevoerd.**
