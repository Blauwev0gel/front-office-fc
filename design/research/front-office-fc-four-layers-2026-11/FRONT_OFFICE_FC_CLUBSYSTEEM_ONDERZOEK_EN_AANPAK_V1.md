# FRONT OFFICE FC — CLUBSYSTEEM
## Onderzoekskader, ontwerpprincipes en zelfstandige ontwikkelaanpak v1.0

**Vastgelegd:** 21 november 2026  
**Status:** ontwikkelafspraak en ontwerp-/onderzoeksagenda; geen geclaimde implementatie  
**Spel:** Front Office FC  
**Rol van de speler:** gekozen voorzitter van een ledenvoetbalclub — geen eigenaar  
**Scope van de eerste bouwronde:** alleen **Systeem 1: Clubmanagement**  
**GitHub:** read-only voor deze vastlegging; geen commits, merges of branches aangepast.

---

## 1. De genomen beslissing

Front Office FC krijgt uiteindelijk vier **volwaardige, zelfstandige maar integreerbare spelsystemen**:

1. **Clubmanagement** — financiën, eigendommen, infrastructuur, exploitatie, ontwikkeling en strategische clubbesluiten.
2. **Personenmanagement** — medewerkers en anderen met competenties, carrières, ambities en autonomie.
3. **Beslissingen en bestuur** — processen, onderhandelingen, afspraken, moties, commissies en politieke consequenties.
4. **Familie en dynastie** — familieleden als zelfstandige personen, privévermogen, loopbanen, reputatie en generatiewisselingen.

**Besloten volgorde:** eerst het **clubsysteem** zelfstandig uitwerken, bouwen, spelen, testen en verbeteren. Pas na een overtuigende zelfstandige release gaan we verder met het volgende systeem. De afzonderlijke systemen worden **niet** nu al in één geïntegreerde gameplayketen gebouwd.

**Essentieel onderscheid:** *zelfstandig ontwikkelen betekent niet geïsoleerd ontwerpen*. We ontwerpen vanaf de eerste bouwronde stabiele gegevensmodellen, interfaces en gebeurtenissen waarmee de andere drie systemen later kunnen samenwerken. Hun interne simulaties hoeven nu niet te bestaan.

**Niet opnieuw te interpreteren als:** een klein, oppervlakkig prototype; een enkele stadionupgrade; vier losstaande menu's; een verplichte inboxloop; of een herbouw van het hele bestaande spel vanuit nul.

---

## 2. Wat betekent 'volwaardig'?

Het clubsysteem moet een zelfstandig boeiende managementgame kunnen dragen — ook als personen-, bestuurs- en familiesimulatie niet zijn aangesloten. De speler kan tientallen seizoenen de financiële en fysieke ontwikkeling van een ledenclub meemaken, met groei, mislukkingen, crises, herstel en verschillende succesvolle strategieën.

**Volwaardig betekent samenhang en diepgang, niet maximaal veel features.** Elk belangrijk domein krijgt een complete cyclus van diagnose → onderzoek → alternatieven → bevoegd besluit → uitvoering → daadwerkelijk resultaat → feedback → volgende mogelijkheid. Infrastructuur en economie beïnvloeden elkaar. Een besluit kan verstandig zijn zonder direct iets te bouwen.

**Verschillende speelbare clubstrategieën** moeten levensvatbaar zijn, zoals:
- voorzichtig onderhouden, schulden vermijden en de plaatselijke clubcultuur behouden;
- investeren in jeugd en faciliteiten met vertraagde opbrengsten;
- wedstrijddag- en stadioninkomsten vergroten;
- commerciële groei prioriteren, met risico voor toegankelijkheid en supportersbinding;
- een club uit financiële problemen herstellen;
- groei opofferen voor de lange termijn, betaalbaarheid of maatschappelijke voorzieningen.

Een 'upgrade alles naar niveau 10'-economie is **geen** volwaardig clubsysteem.

---

## 3. Spelersrol en bevoegdheid

De speler is gekozen voorzitter. De club heeft eigen rechtspersoonlijkheid, kas, bezittingen, verplichtingen en leden. Het privévermogen van de voorzitter is geen clubkas. Grote projecten mogen niet automatisch doorgaan alleen omdat de speler op **Goedkeuren** tikt.

In **Systeem 1 standalone** bestaat een **beperkte, transparante institutionele regel-adapter** die statuten, begrotingslimieten, formele toestemming en vereiste goedkeuringen controleert. Die adapter simuleert *geen* uitgewerkte verkiezingscampagnes, personenrelaties, familiebelangen of volledige politieke coalities; dat komt later. De speler ziet bijvoorbeeld: 'Dit plan vereist een ledenbesluit; onder de huidige voorwaarden is het toegestaan/geweigerd/voorwaardelijk'. Besluiten hebben echte consequenties, ook zonder volledige politieke laag.

Geen trainerstaken: de voorzitter kiest geen opstelling, wissels, tactiek of individuele spelertransfer. Het bestaande voetbalspel en zijn wedstrijddag blijven functioneren; clubinvesteringen mogen op de lange termijn via gedocumenteerde interfaces invloed hebben op clubprestaties.

---

## 4. Afbakening van Systeem 1

### 4.1 Kernmodules die tot het clubsysteem behoren

| Domein | Minimale zelfstandige gameplay | Te vermijden simplificatie |
|---|---|---|
| Stadion & wedstrijddag-infrastructuur | Capaciteit, tribunes, veiligheid, toegankelijkheid, onderhoud, vergunning-/ruimtebeperkingen, benutting, exploitatie, fasering | Alleen 'stadionniveau +1' |
| Trainingscomplex | Kwaliteit, capaciteit, veldconditie, onderhoud, slijtage, realistische renovatie/nieuwbouw, ruimtegebruik | Direct +1 teamsterkte kopen |
| Jeugdinfrastructuur | Velden, faciliteiten, opleidingscapaciteit, bedrijfs-/personeelskosten, vertraagde effecten, alternatieve investeringen | Gratis jeugdpotentie per aankoop |
| Commerciële voorzieningen | Clubshop, horeca, hospitality, verhuur, prijsstelling, operationele kosten en afzet | Eindeloze passieve inkomstenboost |
| Financiën | Kasstroom, vaste/variabele inkomsten en kosten, reserves, liquiditeit, schulden, rente, leningvoorwaarden, stressscenario's | Eén saldo zonder toekomstige verplichtingen |
| Onderhoud & risico | Inspecties, preventief onderhoud, slijtage, reparatie, uitval, levensduur en eventuele verzekering | Willekeurig kapotte upgrade zonder voortekenen |
| Projecten | Initiatief, haalbaarheid, alternatieven, formele goedkeuring, aanbesteding/contractvorm, planning, uitvoering, vertraging, oplevering, nazorg | Een eenmalige koopknop |
| Grond & clubbezit | Eigendom versus huur, uitbreiding, gebruiksrechten, beperkingen, exploitatie en restwaarde | Alle grond automatisch van de club |
| Clubstrategie | Begrotingskoers, meerjarenplanning, prioriteiten en succescriteria die meerdere oplossingen toelaten | Eén optimale route naar rijkdom |

**Nog niet actief uitbouwen:** uitgewerkt personeelsbeleid, karakter- of relatiesystemen, verkiezingsspel, diepgaande familie/privéleven, coachdialogen en complexe politieke coalities. Zij krijgen alleen integratiepunten; geen nepversies in Systeem 1.

### 4.2 Scopegrens met de bestaande voetbalgame

De bestaande competitie, spelers en wedstrijdsimulatie worden **niet verwijderd**. Het clubsysteem moet daarop aansluiten via expliciete parameters, bijvoorbeeld faciliteitskwaliteit, capaciteit, beschikbaarheid en structurele kosten. De voorzitter blijft op clubniveau beslissen.

Wijzigingen aan bestaande engines zijn minimaal en bewezen; een clubupgrade mag de voetbaluitkomst niet ongemerkt dubbel beïnvloeden. Altijd een baseline tegen dezelfde game-seed.

---

## 5. De zelfstandige hoofdloop

1. **Cluboverzicht:** wat bezit/huurt de club, wat kost het, wat levert het op, wat veroudert, welke financiële ruimte is er?
2. **Aanleiding of initiatief:** de speler ziet een probleem of kan zelf een plan starten (onderhoud, renovatie, grond, uitbreiding, financieel herstel).
3. **Onderzoek:** ten minste twee geloofwaardige alternatieven, waaronder uitstellen/niets doen wanneer passend; vergelijking van kapitaal, exploitatie, ruimte, tijd, risico en gemiste kansen.
4. **Besluit binnen bevoegdheid:** eigen beslisruimte, benodigde statutaire toestemming, financierings- en afhankelijkheidscheck.
5. **Uitvoering:** middelen worden op de juiste momenten aangewend; voortgang, vertragingen, aannames, kwaliteit en verplichtingen beïnvloeden de toestand.
6. **Voetbal en tijd gaan verder:** wedstrijden, begrotingen, slijtage, inkomsten en kosten lopen iedere week door; het project heeft betekenis tijdens de uitvoering.
7. **Controle en bijsturing:** bij vertraging, verkeerde inschatting of veranderende omstandigheden kan de speler herzien, gefaseerd doorgaan of stoppen — met sunk costs en contractuele gevolgen.
8. **Oplevering en exploitatie:** een gebouw is niet het einde van de gameplay; het verandert capaciteit, opbrengsten, kosten, onderhoud en toekomstige beslissingen.

**Speeltempo:** de game forceert niet elke week een nieuw bouwbesluit. Er zijn rustige weken en jaren met weinig investeringen. De speler kan altijd informatie bekijken en relevante initiatieven starten. Het voetbal biedt onafhankelijk ritme: briefing → afzonderlijke preview → wedstrijd → krant/afsluiting → volgende week.

---

## 6. Waarom de keuzes interessant zijn

Elk groot initiatief heeft **schaarste en concurrerende voordelen**: liquiditeit, leencapaciteit, ruimte, timing, onderhoudsdruk, inkomstenzekerheid, clubkarakter en toekomstige opties. Er is geen magische willekeurige 'actiepunten'-valuta nodig.

Voorbeeld: een lekkende hoofdtribune.

- **Repareren:** lagere investering, sneller resultaat, lagere capaciteit tijdens werkzaamheden, risico dat oudere constructieproblemen blijven bestaan.
- **Gefaseerd renoveren:** hogere totale kosten of tijdelijke capaciteitsbeperkingen, maar beheersbare liquiditeit en minder bouwoverlast.
- **Vervangen/uitbreiden:** grotere kans op toekomstige inkomsten, afhankelijk van vraag, lening, grond en bouwtijd; zwaar risico bij degradatie.
- **Uitstellen:** vandaag meer kasruimte voor het trainingsveld, maar extra uitvalrisico, mogelijk lagere exploitatie en een grotere toekomstige rekening.

Geen van deze vier is altijd optimaal. Het verschil volgt uit **de huidige clubtoestand**, niet uit een verborgen generieke bonus.

---

## 7. Onderliggende simulatie: ontwerpcontract

### 7.1 Wereldtoestand

Het clubsysteem bezit en muteert:

- `ClubBalanceSheet`: clubkas, schuld, reserves, activa, onderhoudsverplichtingen en financiële voorwaarden;
- `IncomeExpenseLedger`: wekelijkse exploitatie, ontvangsten, kosten, verplichtingen, opeisbare bedragen en auditspoor;
- `ClubAsset`: type, fysieke ligging, eigenaar/huurder, capaciteit, kwaliteit, toestand, levensduur, gebruik, onderhoudsplan en contracten;
- `FacilityEffect`: expliciete, meetbare input naar bestaande voetbal-/clubengines met eenmalige toepassing per week;
- `InfrastructureProject`: voorstel, geselecteerd alternatief, onderzoek, voorwaarden, financiering, status, planning, voortgang, voortgangsrisico, kosten, opgeleverde activa, beëindiging;
- `ClubPlan`: meerjarige prioriteiten, haalbaarheid, financiële bandbreedte, doelstellingen en evaluatiemomenten;
- `ApprovalRequirement`: welke formele autorisatie nodig is en waarom;
- `ClubEventLedger`: append-only gebeurtenissen met oorzaak, uitvoerder/bron, week, oorspronkelijke toestand, wijziging en verwijzing naar project/besluit;
- `ClubSnapshot`: leesmodel voor schermen, rapporten, AI en later andere lagen.

### 7.2 Standalone adapters

Definieer expliciete adapters met **bekend tijdelijk standaardgedrag**:

- `AuthorisationAdapter`: bevoegdheids- en statutencontrole; later vervangbaar door uitgebreid beslissingen-/bestuursysteem.
- `ExecutionAdapter`: betrouwbare standaarduitvoering binnen contract met transparante risico's; later beïnvloedbaar door competenties en autonomie uit personenmanagement.
- `NarrativeAdapter`: zakelijk uitlegbare voortgang en consequenties; later verrijkt met personages en familie.
- `ClubImpactAdapter`: gecontroleerde impact op bestaande competitie/jeugd/financiën; geen tweede wedstrijdengine.

Deze adapters mogen geen verborgen gesimuleerde familierelaties of AI-persoonlijkheden bevatten. **Laat externe systemen later hun input leveren; geef de clubengine geen kennis van die systemen.**

### 7.3 Voorbeeld gebeurtenissen voor latere integratie

`ProjectProposed`, `FeasibilityCompleted`, `ApprovalRequested`, `ApprovalGranted`, `ApprovalDenied`, `LoanApproved`, `ConstructionStarted`, `ConstructionDelayed`, `MaintenanceDue`, `FacilityUnavailable`, `ProjectCompleted`, `OperatingLossReported`, `DebtCovenantBreached`.

Alle events bevatten stabiel `eventId`, `clubId`, `occurredAt` (season/week), `entityId`, `causedBy`, `before/after` (of referentie naar een diff) en `schemaVersion`. Events worden pas gepubliceerd na een geldige, voltooide state-transactie en mogen bij herladen niet dubbel worden uitgevoerd.

**Belangrijke regel:** een event is **geen** vervanging voor echte financiële of fysieke toestandsverandering. Een Gazette-verhaal zonder gewijzigde toestand bewijst niets.

### 7.4 Wekelijkse tick — nu reeds vastleggen

1. Valideer de fase, de projectafspraken en pending besluiten.
2. Verwerk due betalingen en projectverplichtingen (exact eenmaal).
3. Werk projecten en onderhoud bij (met herleidbare risico's).
4. Bepaal werkelijk beschikbare faciliteiten en stuur gestandaardiseerde effecten naar de bestaande voetbalengine.
5. Laat de bestaande wedstrijdsimulatie draaien binnen haar eigen gezag.
6. Verwerk bezoekers-/inkomsten-/exploitatie-effecten van die week (niet dubbel).
7. Genereer financieel en infrastructureel verslag, inclusief causaliteit.
8. Schrijf `ClubEventLedger`, maak save en ga naar volgende week.

De precieze volgorde wordt tegen actuele code geverifieerd vóór integratie; niet dubbel naast de bestaande `endWeek()` bouwen. Bewaak correct gedrag bij bekerwedstrijden, winterwindow, seizoenseinde, ontslag van de voorzitter en save/load.

### 7.5 Schaalbaarheid en balans

- Gebruik seeded deterministische toevalsstromen. UI-bezoeken mogen de speltoestand/toevalsvolgorde niet beïnvloeden.
- Laat asset-slijtage uit daadwerkelijk gebruik, onderhoud, leeftijd en gebeurtenissen volgen.
- Minstens één strategie kan een stabiele kleine club opleveren, zonder verplichte stadionexpansie.
- Leg plafonds niet alleen aan inkomsten, maar aan marktpotentieel en vraag; geen gegarandeerde winst per extra tribune.
- Verwachte baten zijn prognoses, nooit gegarandeerde cash.
- Financiële schulden zijn verplichtingen die blijven bestaan na de termijnwisseling van de voorzitter.
- Een slecht project kan worden beëindigd; gemaakte kosten verdwijnen niet.

---

## 8. Productflow (mobiel)

**Hoofdscherm Club:** clubstatus met faciliteiten, bezittingen, risicowaarschuwingen, kasprognose, lopende plannen en een duidelijke actie **Bekijk mogelijkheden**.

**Vervolgschermen** (als afzonderlijke, aanraakbare interfaces, geen onbegrijpelijke pop-ups):

1. **Clubbezit** — stadion, velden, gebouwen, commerciële ruimtes, grond; conditie, gebruik, kosten en historie per asset.
2. **Financieel overzicht** — kas, verplichtingen, structureel resultaat, geprognosticeerde liquiditeit en financieringsruimte.
3. **Projectverkenner** — wat kunnen we verbeteren, met welk probleem/voordeel en welke voorwaarden?
4. **Projectdossier** — nulvariant, twee of meer haalbare opties, kosten, impact, looptijd, risico, machtiging en duidelijke keuze.
5. **Lopende projecten** — voortgang, betalingen, afwijkingen, mogelijke interventies en oplevering.
6. **Seizoens-/meerjarenrapport** — investering versus opbrengst; effect op exploitatie, clubwaarde en voetbal; wat moet nu worden onderhouden?

De afzonderlijke wedstrijddag blijft behouden. Geen kunstmatige 'één keuze per week'-regel, geen eindeloze kaartenscroll, leesbaar op 320/375/390/430 CSS-pixels, geen onzichtbare opties of dubbelklikbesluiten.

---

## 9. Onderzoeksstrategie vóór bouwen

**Eerst de werkelijke bestaande game-audit, branch voor branch:**

- `chatgpt`: controleer welke clubfinanciën, bouwacties, faciliteiten, begrotingen, projecten, effecten en saves al bestaan. Kijk in de bestaande `src/engine/`, `src/business.js`, `src/commercial.js`, `src/depts.js`, `src/ceocore.js`, `src/specialist-cases.js`, UI, en tests.
- `claude-game`: controleer `src/projects.js`, `src/parties.js`, `src/agreements.js`, `src/world.js`, `src/weekflow.js`, park/feature-flagged systemen, buildlijst, tests en huidige saveversie. **Module aanwezig betekent niet dat gameplay actief is.**
- `claude/loving-goodall-uv00vn`: onderzoek de ledenclub- en afsprakenlogica als toekomstige bevoegdheidsinterface, maar voeg geen volledig politiek spel toe aan het clubsysteem.
- `voorzitter-fundering`: controleer relevante modulaire architectuur en tests. Neem geen onafhankelijke standalone-game automatisch als actuele hoofdcode.

Geef ieder onderdeel een label: `ACTIEF EN GETEST`, `IN CODE MAAR UIT`, `DEELS WERKEND`, `ALLEEN DOCUMENTATIE`, `NOG NIET AANWEZIG`. Bewijs door actuele bestanden/commits en werkelijk uitgevoerde tests.

**Basisbranch niet vooraf blind kiezen.** Selecteer de technische uitgangsbasis na inspectie op compatibiliteit, tests, gameplay-impact, onderhoudbaarheid en de mogelijkheid om bestaande saves veilig te behouden. Een port uit een andere branch is een gerichte implementatie, geen merge van alles.

---

## 10. Ontwikkelmijlpalen: alle releases speelbaar

### M0 — Bestaande clublaag in kaart + bevroren speelbare baseline
- Breng de complete huidige infrastructuur-, financiën-, bouw-, match- en saveketen in kaart.
- Kies onderbouwd de branch en bewaar een verifieerbare *last playable* standalone HTML-build.
- Leg bestaande economische grenzen, voorbeeldsaves, seeds en tests vast.
- **Gate:** huidige game bouwt, 34 weken, winter/zomer, seizoensovergang, save/load en mobiele basismenu's blijven werken.

### M1 — Werkelijke clubbezittingen en exploitatie
- Assetregister, fysieke/contractuele staat, condition-based onderhoud, begroting, duurzame kosten en zichtbaar cluboverzicht.
- De speler kan beheerkeuzes maken waarvan hij volgende weken effect ziet.
- **Gate:** verschillende clubsituaties leveren verschillende rationele onderhoudsstrategieën op; geen dubbele financiële boekingen.

### M2 — Projectcyclus met echte alternatieven
- Project van eerste initiatief via haalbaarheid, financiering en voorwaarden naar realisatie, exploitatie of stopzetting.
- Minstens stadionrenovatie en trainingsveld als **verschillende** projectfamilies; geen gekopieerde effecten.
- **Gate:** beslissingen veranderen werkelijk cash, contracten, assets en toekomstige opties; project kan vertragen, mislukken of worden gestopt.

### M3 — Meerjarenfinanciën en concurrerende clubstrategieën
- Liquiditeit, realistische financieringsgrenzen, schuldenlast, vraag/benutting, financiële crises en herstel.
- Meerdere strategieën hebben verschillende maar levensvatbare succesroutes.
- **Gate:** 10/25/40-seizoenenstests zonder gegarandeerde exponentiële groei, onverklaarbaar geld of onvermijdelijk faillissement; moeilijke situaties zijn herstelbaar als er nog een plausibel pad bestaat.

### M4 — Volledige zelfstandige clubmanagement-release
- Alle bovengenoemde domeinen zijn coherent, begrijpelijk en speelbaar door een menselijke tester.
- Integratie-API's, eventcontracten, autorisatie-/uitvoeringsadapters en migratiecontract bevroren.
- **Gate:** realistische first-hour playtest, mobiele UI, 34-weekcyclus, tussenjaren, saves, projecten, onderhoud, financiën en meerdere zinvolle clubstrategieën slagen. **Pas daarna** Systeem 2 als zelfstandig ontwikkelproject starten.

Deze milestones zijn geen excuus om M1 of M2 als 'volledig clubsysteem' te presenteren. De volwaardige release is **M4**. Laat bestaande functionaliteit altijd bruikbaar.

---

## 11. Tests en acceptatiecriteria

### Functionele/invariante tests

- Clubkas, lening, uitbetaling, kosten en assetwaarde worden elk precies eenmaal gewijzigd.
- Negatieve kas, insolvabiliteit en vreemd vermogen zijn expliciet gereguleerd; geen NaN, gratis lening of onmogelijke negatieve schuld.
- Bouwprojecten kunnen niet starten zonder geldige voorwaarden, begroting en toestemming.
- Aankoop versus huur heeft zichtbaar verschillende kosten, rechten en beëindigingseffecten.
- Dezelfde seed + dezelfde beslissingen produceert dezelfde uitkomsten; informatie raadplegen wijzigt RNG niet.
- Save/load tijdens onderzoeken, bouw, schuldherstructurering en seizoensovergang behoudt volledig dezelfde toestand zonder dubbele gebeurtenissen.
- Een langdurige projectverplichting blijft bestaan als de voorzitter aftreedt of wordt weggestemd.
- Een project is niet automatisch succesvol, maar falen heeft zichtbare oorzaken en een herstelpad waar geloofwaardig.
- Faciliteiten veranderen voetbalparameters *eenmaal* en in een gedocumenteerde richting; geen permanente onbegrensde buff.
- Beker-/thuis-/uitwedstrijd, winter-/zomerperiodes en 34-wekencompetitie worden correct verwerkt.
- UI werkt met één tik, correcte contrasten en scrollbare overzichten op 320/375/390/430 px.

### Negatieve gameplaytests

1. **10 weken niets doen:** het spel blijft functioneren; noodzakelijke kosten lopen door, risico's groeien alleen waar logisch; geen verplichte kaartspam.
2. **Alles direct bouwen:** het spel voorkomt ongedekte uitgaven of laat echte liquiditeits-/financieringsconsequenties volgen.
3. **Altijd goedkoop onderhoud:** er moeten situaties bestaan waarin onderhoud op lange termijn duurder is dan renovatie, maar niet altijd.
4. **Altijd groot bouwen:** een overschot aan stadioncapaciteit kan verliesgevend zijn bij onvoldoende vraag of degradatie.
5. **Lage competitiepositie, grote schuld:** er zijn plausibele crisisbesluiten, contractuele gevolgen en mogelijke herstelroutes.
6. **Onderhoud uitstellen:** risico volgt uit conditie en gebruik, niet uitsluitend uit random dramakaarten.
7. **Twee grote projecten tegelijk:** financiering, toegang tot ruimte en arbeid/capaciteit worden consistent belast.
8. **Tussen twee voorzitters:** assets, schulden, projecten en clubgeschiedenis blijven eigendom van de club.
9. **25–40 seizoenen:** assetveroudering, inflatie/financiële aannames en kosten blijven in verhouding; geen onbegrensd gratis compoundeffect.
10. **'Niets doen' als strategische keuze:** ten minste één testcase waarin reserveren/aftasten beter is dan de aangeboden investeringen.

### Menselijke speelbaarheid: stopcriteria

Stop de release, ook als alle geautomatiseerde tests groen zijn, wanneer een speler na 45–60 minuten:
- niet kan uitleggen waarom hij een project koos;
- de effecten alleen als verborgen bonussen ervaart;
- alleen maar op 'Volgende week' klikt zonder heldere plannen of afwegingen;
- nooit een zinvol alternatief ziet voor de goedkoopste of duurste optie;
- niet kan vertellen wat er met zijn stadion/velden/kas veranderde;
- of meer tijd besteedt aan menunavigatie dan aan de betekenisvolle keuzes.

---

## 12. Beveiliging tegen scope-creep en voorbarige integratie

**Niet doen in deze fase:** uitgebreide dialoogsystemen voor TD's, familiequests, kinderen of erfgenamen, ALV-campagnes, ingewikkelde coalitiemodellen, meerdere simultane bestuurscarrières, een nieuwe matchengine, verborgen actiepunten of een apart tweede economisch systeem. Al deze andere lagen komen later als **eigen volwaardige ontwikkelstappen**.

**Wel direct doen:** stabiele IDs, clubbezit versus privébezit, bestaande savecompatibiliteit, statutaire goedkeuringsinterface, uitvoeringinterface, causale projectgebeurtenissen, financieel auditspoor, hooks voor voetbalinvloed en betekenisvolle UI-rapportage.

**Integratieproof zonder andere lagen te bouwen:** een minimale test-adapter kan toestemming weigeren, de uitvoeringsduur aanpassen of een externe entiteit laten reageren. Daarmee bewijs je de **technische aansluiting**, niet een geïntegreerde game. De zelfstandige clubsysteem-release mag geen ontbrekende personen-/familie-engine nodig hebben om te spelen.

---

## 13. Definition of Done van Systeem 1

We noemen het clubsysteem pas **volwaardig en integratieklaar** als:

1. De club financieel, fysiek en operationeel als één samenhangende toestand bestaat.
2. Stadion, trainingscomplex, jeugdvoorzieningen, commerciële infrastructuur, onderhoud, grond/bezit en schulden echte speelbare besluitcycli hebben.
3. De speler zelf betekenisvolle initiatieven kan nemen, niet alleen meldingen afhandelt.
4. Minstens drie verschillende clubstrategieën in identieke uitgangssituaties aantoonbaar tot verschillende consequenties leiden en niet één triviale dominante route kennen.
5. De systemen minstens 10/25/40 seizoenen technisch stabiel blijven, zonder realistisch onmogelijk gegarandeerd succes.
6. De afzonderlijke voetbalervaring en bestaande loop bruikbaar blijven.
7. Bestaande saves en eerdere speelbare builds behouden blijven met expliciet geteste migratie.
8. Een speler projecten kan begrijpen, uitvoeren, herzien of stopzetten, en ziet waar kosten en effecten vandaan kwamen.
9. Een latere personeels-/beslissings-/familie-engine via bestaande contracten kan koppelen, zonder de clubengine te herschrijven.
10. Tests en een echte mobiele browserplaytest geslaagd zijn; resultaten, beperkingen en gebruikte build zijn gedocumenteerd.

**Vervolgens:** ontwerp/bouw Systeem 2 (Personenmanagement) met dezelfde discipline. Geen gecombineerde vierlagen-sprint vóór elk individueel systeem voldoende spelkwaliteit bezit.

---

## 14. Relatie met eerder onderzoek

Dit document **vervangt niet** `FRONT_OFFICE_FC_VIERLAGEN_BLUEPRINT_V2.md` als beschrijving van de vier eindlagen; het **corrigeert wel de ontwikkelvolgorde**. De daar voorgestelde eerste *geïntegreerde* vierlagenketen is **niet langer het eerste bouwdoel**. Het nieuwe eerste bouwdoel is een zelfstandig **compleet clubsysteem**, met integratiecontracten, voordat Systeem 2 begint.

**Besloten:** gekozen voorzitter, vier volwaardige lagen, zelfstandige ontwikkeling per systeem, eerst clubmanagement, integratiegereed vanaf dag één.  
**Nog te onderbouwen vóór bouwen:** keuze van de primaire codebranch, herbruikbaarheid van geparkeerde modules, precieze economische balans, eerste assetschaal, technische migratie en resultaten van echte mobiele speeltests.
