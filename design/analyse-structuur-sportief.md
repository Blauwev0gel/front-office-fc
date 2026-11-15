# Analyse structuur sportieve afdelingen

> Branch `claude-game`, stand na commit `30cd703`. Aanvulling op `design/analyse-sportief.md`, die over de simulatie gaat.
> Deze analyse gaat over de opbouw: wat de speler per afdeling ziet, waarom, en of hij er een beslissing mee kan nemen.
> Bronnen: de UI-code en 17 screenshots op 390 px (licht), gemaakt met de basisclub ("Straight to week 1"), doorgespeeld tot week 30 van seizoen 1.
> Labels: **[code]** vastgesteld in de code · **[beeld]** gezien op een screenshot · **[playtest]** nog te toetsen.

---

## 1. Oordeel

De drie afdelingen hebben dezelfde ruggengraat: een kop, vier tabs (Overview, People, Data, Decisions) en KPI-tegels. Dat is een goede basis. Maar de tabs zijn bakken voor soorten inhoud, niet antwoorden op vragen van de speler.
Daardoor staat hetzelfde gegeven op twee tot vier plekken. Een voorbeeld: de academiepijplijn staat er vier keer, met drie verschillende vormen.
Signalen zeggen wel dát er iets mis is, maar niet wát. Neem de chip "2 to fix", rode tegels en "Friction". De speler moet zelf zoeken welke tegel of rij bedoeld is, en soms is die rij niet eens zichtbaar.
Er zijn twee alle-informatie-blokken: "All numbers" op elke Data-tab en "Full academy report". Ze herhalen wat erboven staat. Uitgeklapt maakt het academierapport de Data-tab ruim zes schermen lang.
Een paar dingen misleiden. De budgetknop staat op "Lean" terwijl er minder wordt uitgegeven dan Lean kost. "Wrong calls: frequent" staat naast "0 against your mandate". De proefdag verwijst naar een keuze die op het scherm niet bestaat.
Op drie van de vier tabs breekt de kop op 390 px: het bevoegdheidsblok wordt in de mini-kop geperst.
Goed werkt het blok "Your mandate vs what he does", het scoutingnetwerk als kaart, de piramide met legenda en de diagnose met een knop naar het mandaat. Die zijn het voorbeeld voor de rest.
Het voorstel: één vast patroon per afdeling. Een kop met een oordeel in woorden, een lijst van hooguit drie aandachtspunten (elk met oorzaak en knop), één plek per gegeven, en diepte onder vragen in plaats van onder "alles".

---

## 2. Kaart per afdeling

**Gemeenschappelijk** **[code]** (`ui/08-departments.js`, `vDept`):
- *Ingang:* tab **Depts** → afdelingstegel (2 tikken). Vanuit de inbox is er geen link naar een afdeling (`ui/10-inbox.js:99`, `deskRow` opent alleen het bericht).
- *Lagen:* afdelingslijst → afdeling → 4 tabs → secties → sheets (Mandate, Talk, Sack, kandidaten) → in Academy nog een uitklapper met een tweede academiescherm.
- *De kop:* op Overview de volledige head-card (gezicht, relatie, form, quote, Authority, Talk/Mandate/Sack). Op de andere tabs een mini-kop met dezelfde knoppen **en** het hele bevoegdheidsblok (`:157` voegt `headBtns` in, en dat bevat `authHtml`, `:40`).

Elk element valt in één van vier bakken: **B** = nodig voor een beslissing deze week, **C** = context, **D** = dubbel (elders ook), **O** = onduidelijk (geen eenheid, referentie of handelingsperspectief).

### 2.1 First team (Head Coach)

| Laag | Element | Wat staat er | Bak | Opmerking |
|---|---|---|---|---|
| Kop | Status-chip | "Good" / "2 to fix" | **O** | Zegt niet welke rij. "Good" bij 1,21 punt per wedstrijd en de 11e plek **[beeld]**. |
| Kop | Relationship | "44" | **O** | Getal zonder schaal of betekenis. |
| Kop | Follows mandate | "71%" | **O** | Zegt niet wat de speler eraan kan doen. |
| Kop | Quote | "About the attacking football: I am doing it my way" | B | Goed: wijst naar het probleem in gewone taal. |
| Kop | Authority | segment + "16 staff calls, 0 against your mandate" + "Wrong calls: frequent" | **O** | De twee zinnen spreken elkaar tegen (§3.3). |
| Overview | 4 KPI-tegels | squad quality, punten per wedstrijd, xG-verschil, injured | C / **D** | Dezelfde rijen staan in Data → "All numbers". |
| Overview | Form | 6 uitslagen + xG-balken + positielijn | C | De positielijn heeft geen as, alleen "expected 11th". |
| Overview | Your mandate vs what he does | 4 rijen: jouw stip, zijn stip, feit, quote | **B** | Het beste blok van alle afdelingen. |
| People | Staf + open rollen | 5 rolkaarten | B | Helder. |
| Data | The squad, through his eyes | picks, left out, injured, unhappy | C | Goed. Wel een overlap met het Squad-scherm. |
| Data | Fitness | "Injury risk Normal", tekst | C | |
| Data | All numbers | 5 rijen | **D** | 4 van de 5 staan al als tegel op Overview. |
| Decisions | Target, Budget, Facilities | | B | Budgetknop klopt niet met het bedrag (§3.3). Het coachgesprek zelf zit niet in Decisions maar in de kop. |

### 2.2 Recruitment (DoF + Chief Scout)

| Laag | Element | Wat staat er | Bak | Opmerking |
|---|---|---|---|---|
| Kop | Status-chip | "2 to fix" | **O** | Het gaat om twee rode tegels. Te vinden, maar niet benoemd. |
| Kop | Form | "Poor" | B | Oordeel in woorden: goed (P4). |
| Overview | 4 tegels | transfer budget, signings vs squad, network focus "21 / 100", scouting accuracy "±1.7★" | C / **O** | "21 / 100" heeft geen referentie. "±1.7★" is rood met als reden "no data department". |
| Overview | Scouting network | kaart van regio's, grootte = netwerk | C | Goed beeld. Dezelfde regio's staan ook twee keer in Decisions. |
| Overview | The DoF's record | ✓/✗ per signing | B | Goed. Geeft de DoF de schuld voor wat de scout misleest. |
| Overview | Direction | Scout's eye ↔ Data, "Aligned" | **O** | Dit schuifje doet in de simulatie niets (eerste rapport, §4.1). |
| People | Chief scout-kaart | Mandate, Talk | B | De scout staat tussen de DoF en de staf in: wie is hier de baas? |
| Data | 4 tegels | budget, window, "You approve over £3.3k", wage limit | B | Nuttig, maar een andere set dan op Overview. |
| Data | Plan | prioriteiten-chips + "Edit plan" | B | |
| Data | The list | funnel + kaarten met grade-badge | B / **O** | Badge en tekst geven een andere grade (§3.3). |
| Data | Recent outcomes, This season's signings, Signed by the department | | **D** | Dezelfde drie spelers staan in twee opeenvolgende lijsten **[beeld]**. Het record staat ook op Overview. |
| Data | Scouts | kaarten per scout met opdracht en nauwkeurigheid | C | Hier wordt de scout pas zichtbaar. |
| Data | Grade-legenda + All numbers | | **D** | "All numbers" herhaalt de tegels. De pagina is ongeveer 3.000 px (3,6 schermen). |
| Decisions | Where the scouts look | 7 regiochips | B | Gratis, terwijl hetzelfde via het mandaat 1 AP kost. |
| Decisions | Scouting trip | 7 regiochips met netwerkgetal | B / **D** | Tweede rij met dezelfde regio's, direct eronder. |
| Decisions | Budget | segment | B | Staat op "Lean" bij £90/wk, terwijl Lean £195 kost **[beeld]**. |

### 2.3 Academy (Academy Director)

| Laag | Element | Wat staat er | Bak | Opmerking |
|---|---|---|---|---|
| Kop | Status-chip | "1 to fix" | **O** | Het gaat om Category (rood). |
| Overview | 4 tegels | Category 4, facilities, coaching level 3.5, pipeline "10 / 5 / 1 / 0" | C | |
| Overview | The pathway | piramide met legenda, beste prospect | C / **D** | Goed beeld. De pijplijn staat hier voor de tweede keer. |
| Overview | Direction | Patient ↔ Fast-track, "Friction" | **O** | "Friction" zonder uitleg wat het kost. |
| Data | Category ring + "Holding it back" (3 regels + Fix) | | **B** | Het beste aandachtsblok: oorzaak plus knop. Staat alleen niet op Overview. |
| Data | Pipeline, Players, Return on investment | | **D** | Drie keer herhaald in het rapport eronder. |
| Data | **Full academy report** (uitklapper) | een tweede academiescherm met een eigen kop | **D** | Bevat opnieuw de category, "Why the academy is held back", ROI, Pipeline en Players, plus U18/U21-tabellen, Youth Cup, jeugdstaf, Last season en Graduates. De pagina wordt ongeveer 5.300 px **[beeld]**. |
| Decisions | Trial day | "Next trial day in week 28. The academy picks who joins." | **O** | Getoond in week 30. Op de proefdag zelf zijn de kaarten niet aanklikbaar (§3.3). |
| Decisions | Budget, Facilities | | B | Budgetknop op "Lean" bij £114/wk, terwijl Lean £247 kost **[beeld]**. |

**Kosten van handelingen** **[code]**:
- Mandaat opslaan kost 1 AP.
- Gratis zijn: bevoegdheid, regiofocus via de chips, budgetsegment, staf aannemen (alleen geld) en ontslaan via de staflijst.
- Talk en Sack kosten 1 AP en staan als enige in de kop, ook op de tabs die er niets mee te maken hebben.
- Dezelfde waarde heeft twee bedieningen: het budget is een schuif van 0–100 in het mandaatsheet (`acad.budget`, `scout.budget`) en een knop met drie standen in Decisions en de afdelingslijst (`business.js:11,30`).

---

## 3. Vondsten per patroon

### 3.1 Probleem zonder inhoud
- **[code] [beeld]** De status-chip ("2 to fix", `depts.js` `status()`) telt rode scorecard-rijen, maar zegt niet welke. Op Overview staan alleen de eerste vier rijen als tegel (`ui/08-departments.js:129`, `slice(0, 4)`). Een rode vijfde rij telt dus mee in "to fix", maar is alleen te vinden onder Data → All numbers.
- **[code]** In de afdelingslijst staat "5 need attention" (`vDepts`), zonder te zeggen waarom of wat eerst moet.
- **[beeld]** "Friction" en "+25 vs your mandate" zeggen niet wat het kost. Gemeten: 0,3 relatie per week en geen punten (eerste rapport). De speler kan niet wegen.
- **[code]** "at risk" bij jeugdspelers (`vAcademy2`) noemt niet of het om school of welzijn gaat.
- **Positief** **[beeld]**: "Holding it back" heeft per regel een oorzaak, een getal ("budget is lean (0/100)") en een knop **Fix** naar het mandaat. Dat is het model. Het staat alleen weggestopt op de Data-tab.

### 3.2 Alle-informatie-blokken
- **[code]** "All numbers" (`:148`) staat op de Data-tab van First team en Recruitment. Het herhaalt de KPI-tegels van Overview en beantwoordt geen vraag.
- **[code] [beeld]** "Full academy report" (`ui/09-firstteam-review.js`, `vAcademy2` voegt `vAcademy()` in een `<details>` in). Dit is een oudere academieweergave in een nieuwere: een tweede kop, een tweede diagnose ("Why the academy is held back", met dezelfde zinnen als "Holding it back") en een andere visuele stijl. Bijna alles staat er twee keer.
- **[beeld]** De Data-tab van Recruitment (ongeveer 3.000 px) is één lange stapel lijsten: plan, funnel, kandidaten, uitkomsten, signings (2×), scouts, legenda en all numbers.

### 3.3 Misleidende of tegenstrijdige weergave
- **Budgetknop** **[code] [beeld]**: de drie standen zijn 25/50/80. `lvOf` rondt alles tot 37 af naar "Lean" (`business.js:11`). Een budget dat door een bezuiniging op 0 of 10 staat, toont dus "Lean" met een bedrag ver onder de Lean-prijs (Recruitment £90 tegenover £195, Academy £114 tegenover £247). Zie je "Lean", dan denk je dat je al het minimum hebt.
- **"Wrong calls: frequent" naast "0 against your mandate"** **[code] [beeld]**: de eerste is een voorspelde kans (`errChance`, rond 20% bij normale bevoegdheid op laag niveau), de tweede de werkelijke telling. In de praktijk gaat ongeveer 1–2% van de gedelegeerde zaken mis (eerste rapport). Alle hoofden tonen "frequent".
- **De proefdag** **[code]**: de briefing "I will choose myself" stuurt de speler naar "the academy page, under Decisions" (`academy3.js`). Daar zijn de kandidaten `<div>`'s zonder actie (`ui/08-departments.js:110`), en er bestaat geen bijbehorende actie in `ui/15-actions.js`. De tekst eronder zegt "The academy chooses the intake". Na week 28 staat er "Next trial day in week 28" (`:109`).
- **Grade-badge tegenover tekst** **[beeld]**: Oscar Yardley heeft badge **D** met de zin "recommends him (grade B)". De badge is de huidige grade (`dofPipeline` herberekent die elke week), de zin is een log van toen.
- **"Good" bij een slechte koers** **[beeld]**: First team "Good" bij 1,21 punt per wedstrijd en de 11e plek, omdat de selectiekwaliteit en het xG-verschil groen zijn. Het oordeel weegt de rijen niet.
- **Kop breekt op 390 px** **[beeld] [code]**: op People, Data en Decisions zit het bevoegdheidsblok in de flex-rij van `.hmini`. De naam wordt "H C", de knoppen "Sho leas" en "No", en de tekst valt over "Authority". Dit gebeurt in alle drie de afdelingen.

### 3.4 Kale getallen
- **[beeld]** Relationship 44, Follows mandate 71%, network "21 / 100", accuracy "±1.7★", coaching level 3.5, category score 45 met grenzen 55/75/95, pipeline "10 / 5 / 1 / 0".
- Goed of slecht is meestal niet af te lezen, en P4 vraagt om signalen en stemmen. Gunstige uitzonderingen: Form "Poor/Strong", de quotes van de hoofden, de piramide met legenda en "division average 5.2" bij squad quality.

### 3.5 Dezelfde vraag op meerdere plekken
| Gegeven of instelling | Plekken |
|---|---|
| Academiepijplijn | Overview-tegel, piramide, Data → Pipeline, Full report → Pipeline (4×) |
| Academiediagnose | Data → Holding it back, Full report → Why the academy is held back |
| ROI academie | Data, Full report, scorecard-rij (3×) |
| Signings van dit seizoen | Overview → DoF's record, Data → This season's signings, Data → Signed by the department (3×) |
| KPI-rijen | Overview-tegels, Data → All numbers |
| Regio's | Overview-kaart, Decisions-focuschips, Decisions-tripchips, scoutmandaat (4×, met verschillende AP-kosten) |
| Afdelingsbudget | mandaatschuif 0–100, segment in Decisions, segment in de afdelingslijst, budgetvoorstel van Finance |
| Coachgesprek | knop in de kop, "Raise it with …" onder het mandaatblok |

### 3.6 Onduidelijke eigenaar
- **[beeld]** Recruitment: kop en record horen bij de DoF. Direction gaat over "Neil's instinct" (DoF), maar over dezelfde knop die ook in het scoutmandaat staat. Regio's horen bij de scout, die alleen onder People staat. Budget heet "Recruitment", maar het is het scoutbudget.
- **[code]** Academy: het mandaat bevat "Academy players protected in squad" en "First-team mentors". Dat zijn zaken van het eerste elftal, en ze staan niet op het First team-scherm.
- Coach ↔ academie: de zes routes voor jeugdminuten (eerste rapport, §5) staan op vijf verschillende schermen. Er is geen plek die zegt waar de minuten vandaan komen.

### 3.7 Inbox ↔ afdeling
- **Goed** **[code]**: Decisions toont "Waiting for you" met openstaande zaken van dat hoofd (`:152`).
- **[code]** Andersom ontbreekt het: een inboxbericht linkt niet naar de afdeling.
- **[code]** Wat het hoofd zelf besliste (de gedelegeerde zaken) is alleen een telling ("16 staff calls"). "Recently" toont alleen de stafwissels (`X.log`). De speler kan niet terugzien wát de afdeling namens hem besliste. Juist dat is de controle die bij bevoegdheid hoort (P1).

---

## 4. Voorgestelde structuur

### 4.1 Het gemeenschappelijke patroon (alle zes afdelingen)

Vier tabs, elk een vraag. Er komen geen nieuwe meters bij; bestaande gegevens krijgen één vaste plek.

| Tab (nu) | Tab (voorstel) | Vraag | Inhoud |
|---|---|---|---|
| Overview | **Now** | Hoe gaat het en wat vraagt aandacht? | Een compacte kop met een oordeel in woorden ("Under pressure", "On course"), maximaal 3 aandachtspunten (elk met oorzaak, prijs en knop), en "Waiting for you" (nu verstopt in Decisions). |
| Decisions | **Plan** | Wat heb ik deze man opgedragen? | Mandaat (Direction, "your mandate vs what he does"), budget, bevoegdheid, afspraken en targets, en afdelingsknoppen (regio's, trips). Elke knop staat hier één keer, met dezelfde AP-prijs als in het sheet. |
| People | **People** | Wie werkt hier? | Hoofd (relatie in woorden, contract), sub-hoofd (scout), staf en open rollen. Talk en Sack staan hier. |
| Data | **Record** | Wat heeft hij gedaan? | Geschiedenis onder vragen, elk gegeven één keer: "What did he decide for you?" (een nieuwe lijst van gedelegeerde zaken, bron `desk`), resultaten en trends. Geen "All numbers". |

Regels voor elk element:
1. Label, eenheid, referentie en een woordoordeel ("21 of 100 — thin; 40 is workable"). Geen kaal getal.
2. Een rood signaal is altijd ook een aandachtspunt op **Now**, met de oorzaak in één zin en een knop. De status-chip opent die lijst.
3. Een knop toont zijn prijs (AP, geld, relatie) en heeft overal dezelfde prijs.
4. De kop is op alle tabs dezelfde compacte kop: gezicht, naam, oordeel en één knop "Talk". Bevoegdheid verhuist naar Plan. Dat lost ook de kapotte mini-kop op.

### 4.2 First team
Maakt het minst kapot en is het voorbeeld.
1. **"Your mandate vs what he does" naar Plan, met een prijs per rij** *(klein)*.
   - *Probleem:* "+25 vs your mandate" zegt niet wat het kost.
   - *Verandering:* per rij één zin met het gevolg ("Costs his trust each week. Results unaffected so far."). Op Now komt alleen de grootste afwijking als aandachtspunt.
   - *Speler:* ziet of hij moet ingrijpen of het kan laten gaan.
   - *Nadeel:* zolang de schuifjes geen echte afweging zijn (eerste rapport §4.2), wordt die zin eerlijk saai.
2. **"All numbers" en de dubbele tegels weg; Fitness en "through his eyes" naar Record** *(klein)*.
3. **Één oordeel dat de rijen weegt** *(klein)*: het statuswoord volgt eerst de positie tegenover de verwachting en dan pas de onderliggende cijfers. Zo verdwijnt "Good" op de 11e plek.

### 4.3 Recruitment
1. **Eén lijst in plaats van zes** *(middel)*.
   - *Probleem:* 3.000 px aan lijsten, met spelers die twee of drie keer voorkomen.
   - *Verandering:* Record krijgt drie blokken. "In the pipeline" is de funnel met kandidaten. "Signed this season" combineert verdict, fee en scoutschatting in één rij. "The scouts" toont per scout de nauwkeurigheid. De grade-badge toont alleen de huidige grade, de zin vermeldt een eventuele wijziging ("was B in week 12").
   - *Speler:* vindt een speler één keer en ziet wie hem aanraadde.
   - *Nadeel:* raakt `vRecruit2`, dat ook vanuit Squad wordt gebruikt.
2. **De scout als tweede persoon zichtbaar maken** *(klein)*: op Plan een eigen blok "Chief scout: where we look", met regio's en trip samen in één kaart (focus = tik, trip = tweede knop per regio). Direction alleen voor knoppen die werken (zie ontwerpvraag 2 in het eerste rapport).
3. **Regels en drempels als één kaart op Plan** *(klein)*: budget, "you approve over £3.3k", loonlimiet, maximale fee en leeftijd, met per regel wie hem zette (DoF-mandaat of Finance). Zo verdwijnt de vraag "welke regel blokkeert hem?".

### 4.4 Academy
1. **"Full academy report" opheffen en verdelen** *(middel; het grootste overzichtswinstpunt)*.
   - *Probleem:* een tweede scherm in de Data-tab dat alles herhaalt.
   - *Verandering:* Record krijgt vier vragen. "Is the intake good?" (category, score, intake). "Are the kids growing?" (piramide en spelers per groep). "Do they reach the first team?" (graduates, minuten). "Is it worth the money?" (ROI). U18/U21-tabellen, Youth Cup en jeugdstaf gaan onder een kleine uitklapper per vraag, niet in één groot rapport.
   - *Speler:* ongeveer 2 schermen in plaats van ruim 6.
   - *Nadeel:* `vAcademy` (de oude weergave) wordt dode code. Opruimen hoort bij fase 2.
2. **"Holding it back" naar Now als aandachtslijst** *(klein)*. Die bestaat al met oorzaak en knop. Het is de directe vervanging van de chip "1 to fix".
3. **De proefdag eerlijk maken** *(klein)*: tot er een besluit is (§7), de briefing-optie "I will choose myself" en de verwijzing weghalen of omzetten naar "Tell me who they picked". "Next trial day" wordt na week 28 "next season, week 28".

---

## 5. Geprioriteerde lijst

**Eerst: wat misleidt of verstopt is**
1. Mini-kop breekt op 390 px op 3 van de 4 tabs: bevoegdheid uit `headBtns` halen in de mini-kop (`ui/08-departments.js:40,157`). *Klein.*
2. Budgetsegment toont "Lean" bij een budget onder Lean: een vierde toestand "Cut" tonen, of het werkelijke niveau (`business.js:11`). *Klein.*
3. "Wrong calls: frequent" tegenover de echte telling: één regel, gebaseerd op het werkelijke record ("0 of 16 went against you"). *Klein.*
4. Proefdag: een dode verwijzing en een verkeerde week (`academy3.js`, `ui/08-departments.js:109-110`). *Klein.*
5. Status-chip zonder reden: tik opent de lijst van rode rijen, en alle rode rijen zijn op Overview zichtbaar. *Klein.*
6. Grade-badge en tekst in tegenspraak (`vRecruit2`). *Klein.*

**Dan: wat dubbel is**
7. "Full academy report" opheffen (4.4.1). *Middel.*
8. "All numbers" weg, signings één keer, regio's één keer (4.2.2, 4.3.1, 4.3.2). *Klein tot middel.*
9. Budget één bediening: het mandaatsheet toont het segment, niet een tweede schuif van 0–100. *Klein.*

**Dan: wat beter kan**
10. Het gemeenschappelijke patroon Now / Plan / People / Record (4.1) voor alle afdelingen. *Middel.* Raakt ook run 2 (commercie).
11. Kale getallen een woordoordeel en een referentie geven. *Klein per getal.*
12. "What did he decide for you?" op Record: gedelegeerde zaken als lijst (de data staat al in `G.inbox` met `del`). *Klein.*
13. Een link van inboxbericht naar afdeling ("Open Recruitment"). *Klein.*

## 6. Playtest (30 minuten)

Gebruik een nieuwe basisclub, speel tot ongeveer week 10, dan week 20 en dan week 30. Stopwatch aan, eerst zonder uitleg.

1. **Week 10, afdelingslijst.** "Welke afdeling moet je deze week als eerste aandacht geven, en waarom?" Doel: binnen 20 seconden een antwoord met een reden.
2. **Recruitment, "2 to fix".** "Wat zijn die twee dingen, en wat doe je eraan?" Noteer hoeveel tikken het kost en of de speler All numbers opent.
3. **First team.** "Is de coach goed bezig?" Vergelijk het antwoord met "Good" en met de positie. Vraag wat "Follows mandate 71%" betekent.
4. **Wissel van tab** (People, Data, Decisions). "Is dit scherm in orde?" Kijk of de speler de kapotte kop opmerkt.
5. **Academy, week 20.** "Hoeveel jongens kunnen het eerste halen?" Noteer waar de speler het zoekt (piramide, tegel, Data of rapport) en hoe lang hij scrolt.
6. **Budget.** "Kun je op het academiebudget nog bezuinigen?" (bij een budget onder Lean). Komt "Lean" over als minimum?
7. **Bevoegdheid.** "Maakt deze DoF veel fouten?" Kijk welke regel de speler gelooft: "frequent" of "0 against".
8. **Week 28, proefdag.** Kies "I will choose myself" en probeer kinderen te kiezen.
9. **Delegatie.** "Wat heeft de DoF de afgelopen weken zelf beslist?" Kan de speler het vinden?
10. **Afsluiting.** "Welk scherm sloeg je het liefst over, en welk wil je elke week zien?"

## 7. Ontwerpvragen voor de eigenaar

1. **Één vast patroon voor alle afdelingen (Now / Plan / People / Record)?** Het raakt ook Commercial, Marketing en Business, die nu eigen varianten hebben.
   *Aanbeveling:* ja, en eerst bouwen op de drie sportieve afdelingen. Run 2 toetst of het ook voor commercie past.
2. **Hoeveel academiediepte hoort op de telefoon?** Jeugdcompetitietabellen, jeugdstaf met attributen en Youth Cup zijn nu volledig zichtbaar.
   *Aanbeveling:* behouden als diepte (B3), maar elk onder de vraag waar het bij hoort, ingeklapt, en nooit als tweede rapport.
3. **De proefdag: zelf kinderen kiezen of niet?** De speler krijgt nu de belofte, maar niet de knoppen. Dit sluit aan op ontwerpvraag 1 van het eerste rapport.
   *Aanbeveling:* geen kinderen kiezen (P1). De CEO kiest het criterium van de recruiters, of krijgt alleen het verslag. Pas de briefing daarop aan.

---

### Wat ik niet heb bekeken
- Alleen de lichte modus en één moment: seizoen 1, week 30, basisclub met DNA "academy". Donkere modus, de zomerschermen, het begin van een seizoen, de proefdag in week 28 zelf en hogere divisies zijn niet in beeld gebracht.
- Het inboxscherm heb ik niet vastgelegd; de koppeling met de inbox komt uit de code.
- Screenshots zijn full-page met de vaste onderbalk verborgen. Op de telefoon staan de dock en de tabbalk over de onderkant van elke pagina.
- Een screenshot laat zien wat er staat, niet wat de speler begrijpt. Dat toetst de playtest in §6.
