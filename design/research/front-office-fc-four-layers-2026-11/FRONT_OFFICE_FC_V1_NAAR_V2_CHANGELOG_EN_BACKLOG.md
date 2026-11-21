# FRONT OFFICE FC — V1 → V2 CHANGELOG EN GAMEPLAY-BACKLOG

**Datum:** 20 november 2026  
**Doel:** een technische en creatieve brug van de oorspronkelijke vierlagenblueprint naar een daadwerkelijk speelbare Front Office FC.  
**Scope:** ontwerp- en implementatieplanning; **geen gamecode gewijzigd**.  
**Bindend uitgangspunt:** een gekozen voorzitter bestuurt een ledenclub; de vier lagen club, personen, bestuur/besluiten en familie zijn alle vier volwaardige gameplay; familie erft nooit automatisch clubmacht.

## 1. Wat v2 fundamenteel verandert

| V1-sectie | Wat er in v1 stond | Probleem / reden voor verandering | V2-oplossing | Status |
|---|---|---|---|---|
| §0 Spelbelofte | Vier lagen met gedeelde wereld | Nog geen spelerhandeling die alle vier verbindt | V2 §§1–2: acht kernwerkwoorden + vier zelfstandige loops + gedeeld causaliteitscontract | `[VOORSTEL]` |
| §1.1 Ledenclub | Bevoegdheidsladder en jaarlijkse ALV | Wie rechtsgeldig een project mag blokkeren bleef te abstract | V2 §§2.3, 4: `Statute`, quorum, motie, verkiezing, verplichte goedkeuringsroute | `[VOORSTEL]` |
| §1.2 Spelerdoelen | Vijf tijdhorizonten | Doelen zijn vooral observaties | V2 §§1.1, 3: zichtbare motivatie en werkwoorden op elke horizon | `[VOORSTEL]` |
| §2 Club | Domeinen en automatische uitvoering | Club bleef decor als er geen dossier was | V2 §2.1: zelfstandige selectie-, voetbal-, kas-, jeugd- en projectloop | `[VOORSTEL]` |
| §2.2 Economie | Stromen en verplichtingen | Geen contract voor reserves, commitments en betalingen | V2 §§2.1, 5: financiële lifecycle, één betalingsbron, debt/runway, recovery | `[VOORSTEL]` |
| §3 Personen | Traits, doelen, geheugen, relaties | Gedrag/relaties te makkelijk terug te brengen tot verborgen meter | V2 §2.2: bevoegdheid, kennis, eigen doelen, alternatieve werkgevers en concrete afwijkende handelingen | `[VOORSTEL]` |
| §4.1 Besluiten | Context → keuze → uitvoering | Kon met mandaat, afspraak en project worden verward | V2 §§2.3, 5: vier aparte domeinobjecten, één transactionele decision gateway | `[VOORSTEL]` |
| §4.3 Afspraak | Loving Goodall-formule | Gevaar dat ieder clubproject een kaart wordt | V2 §2.3: afspraken alleen met echte wederpartijen en toetsbare concessie | `[VOORSTEL]` |
| §4.4 Politiek | ALV en kandidaatverkiezingen | Stemmodel kon een algemene supportmeter blijven | V2 §4: motie ≠ persoon, kiesgerechtigden, quorum, oppositie, blijvende verplichtingen | `[VOORSTEL]` |
| §5.1 Familie | Band, werk, vermogen, erfenis | Familie was geen diep eigen spel in jaar 1 | V2 §2.4: zelfstandige loopbanen en privéprojecten van volwassen familieleden | `[VOORSTEL]` |
| §5.2 Nepotisme | Gevaar van familievoordeel | Procedureel conflict onvoldoende gespecificeerd | V2 §§2.4, 6D: recusal, tender, private boekhouding, verifieerbare consequenties | `[VOORSTEL]` |
| §5.3 Protagonistwissel | Kies volwassene / speel korte overgangsfase | 'Korte overgang' was geen daadwerkelijk spel | V2 §§2.4, 4.3, 6F: speelbare kandidaat-/leden-/familiecarrière met bevoegdheidswisseling | `[VOORSTEL]` |
| §§6–7 Loops/scenario | Vier loops en één twaalfjarig voorbeeld | Risico van voorgekookte verhaaluitkomst | V2 §§3, 6: normale/drukke week, eerste 10 weken en **zes** falsifieerbare ketens | `[VOORSTEL]` |
| §8 UI | Vier tabs, één home | Nog te weinig nadruk op herkenbare uitvoering en spelercontrole | V2 §8: HQ + crosslinks + afzonderlijke matchday, actor en termijn in context | `[VOORSTEL]` |
| §9 Data/tick | Lijst van objecten en globale tick | Kan dubbele uitvoering/saves niet voorkomen | V2 §5: datacontract, exclusieve mutaties, 10-stappentick, ID's, RNG-streams | `[VOORSTEL]` |
| §10 Ritme | Zonder kaartenquota | Goed, maar drukke week niet opgelost | V2 §3.2: urgentiedossiers bundelen op bevoegdheid en deadline | `[VOORSTEL]` |
| §11 Branches | `chatgpt` als gebruikelijke productbasis | Onderschat `claude-game`-functies én feature-PARK; onterechte vanzelfsprekendheid | V2 §9: **voorwaardelijke** voorkeurskandidaat `claude-game`, fallback `chatgpt` na echte tests | `[VOORSTEL]` |
| §12 Milestones | Vier lagen al in milestone 1 | Te vaag wat precies werkende gameplay is | V2 §9.3: M0–M4 met per milestone een volledige speelbare gate | `[VOORSTEL]` |
| §13 Risico's | Algemene risicolijst | Geen echte breektests | V2 §7: tien negatieve scenario's, bot-/mensenproeven, afbreekcriteria | `[VOORSTEL]` |

### Behouden uit v1 — en dus géén koerswijziging

- **[BESLOTEN]** De club is van de leden, niet van de protagonist of zijn familie.
- **[BESLOTEN]** De voorzitter bestuurt mensen/mandaten, niet voetbalopstellingen of individuele transferonderhandelingen.
- **[BESLOTEN]** Club-, persoons-, besluit- en familielaag zijn gelijkwaardig qua ontwerpstatus; geen cosmetic-only familietab.
- **[BESLOTEN]** Voetbal is een eigen week-/wedstrijdervaring, geen verzameling bestuurlijke sms'jes.
- **[BESLOTEN]** Geen verplichte besliskaarten of onrealistische actietokens.
- **[BESLOTEN]** Historische gevolgen, zelfstandige medewerkers en betekenisvolle beslissingen blijven de kern.

## 2. Afstemming met de feitelijke branches

| Bron | Wat in bestaande code is aangetroffen | Hergebruikstrategie | Risico dat eerst getest moet worden |
|---|---|---|---|
| `chatgpt`, bron/README/BIBLE | 34 speelweken, seeded match-engine, `desk`, `ceocore`, `specialist-cases`, matchday, `VERSION=3` | Baseline/testfallback, voetbal- en afdelingsmechanieken | `ownerOn`/investeerdersstart, `sack()` is game-over, geen bewezen familiaire state |
| `claude-game` | `modules.json`, `agreements`, `parties`, `projects`, `world`, `talks`, `weekflow`, save `VERSION=5` | **Provisionele integratiekandidaat**; behoud bestaande sportengine | `PARK={base:true,ini:true,agr:true,dos:true,auth:true}` schakelt zichtbare delen van de code uit; eerst normale speelbaarheid testen |
| `claude/loving-goodall-uv00vn` | `northmarch.html`, ALV, afspraken, personages, oppositie, testbron | Port regels, UX-ideeën en seizoenspolitiek **op objectniveau** | Aparte HTML-state, kleinere voetbal-/afdelingsgame, geen automatische merge |
| `voorzitter-fundering` | Modulaire standalone club-, chairman- en TD-systemen | Referentie voor modulegrenzen en regressies | Eigen save en wedstrijden, niet zonder migratie compatibel |

**Wat niet bewezen is:** welke van `chatgpt` of `claude-game` de betere *actuele speelbare* basis is. De beslissing is conditioneel. Eerder in de conversatie uitgevoerde headless tests waren niet gelijk aan een actuele complete Playwright-test van beide branches.

**Beslisregel `[VOORSTEL]`:** `claude-game` krijgt eerste integratieproef wegens al gebouwde sociale/projectmatige systemen. Als zijn standaardgame `PARK`-gebonden kernmechanieken niet toegankelijk maakt of regressies levert, behoud `chatgpt` als productbasis. Documenteer exacte SHA en bewijs, niet een gevoelsmatig winnaarsoordeel. De keuze mag niet worden afgedwongen door deze ontwerpnotitie.

## 3. Prioriteringsmethode

Score kwalitatief: **spelimpact × hergebruik × risicoverlaging**. P0 betekent **blokkeert een coherente geïntegreerde game**; P1 betekent sterke verbreding van bestaande game; P2 is meerjarige verdieping nadat de vier lagen werken. Een P2-onderdeel mag wel in het schema worden voorzien maar niet als schijnfunctionaliteit in de UI worden aangezet.

Een backlog-item is pas **Done** als het in de standaard, speelbare HTML kan worden uitgevoerd, het gevolg in de echte wereld-state voorkomt, passende unit/integratie-tests slagen en het niet slechts in een debugfunctie kan worden aangezet.

## 4. P0 — fundament en eerste speelbare vierlagenslice

| ID | Gameplayresultaat (de speler merkt dit) | Bron/module bij voorkeur | Definition of Done | Afhankelijk van |
|---|---|---|---|---|
| **P0-01** | Bestaande game blijft volledig speelbaar: setup → 34 wedstrijden → review; winter, matchday en saves werken | Branchspecifieke build/test, `engine`, `matchday`, `ui`, save | Exact SHA, complete build, browser 390px, headless seizoen, oude save reload, rapport met failures | Geen |
| **P0-02** | Voorzitter ziet waar hij bevoegd is en waar leden/commissies blokkeren | `Statute`, `Office`, `Mandate`; adapter op `engine/13`, `desk`, UI | 1 geldig zelfbesluit, 1 besluit via bestuur, 1 geblokkeerd familie-/ALV-besluit zonder illegale state | P0-01 |
| **P0-03** | Eén actie heeft een zichtbaar uitvoerder, plan, mijlpaal en echt resultaat | `DecisionGateway`, `EventLedger`, `Agreement`/`Project` adapters | Drie ketens over ≥4 weken, exact-once betaling, double-click/reload stable, geen fake feedback | P0-01, P0-02 |
| **P0-04** | TD/coach reageren verschillend op mandaten en doelen; club verandert sportief waar terecht | `agreements`, `firstteam`, `recruitx`, `engine/05`, `engine/12`, `desk` | Zelfde save: mandaat A/B leidt tot aantoonbaar andere agentacties; coach maakt zélf XI; match speelt normaal | P0-03 |
| **P0-05** | Twee volwassen familiepersonen hebben een eigen beslissing/loopbaan die onafhankelijk doorgaat | `Person`, `Family`, `PrivateAssets`, minimaal context-UI | Eigen keuze/alternatief, eigen geld/werk, een doorlopend gevolg na 4 weken en seizoensgrens, geen clubbonus zonder procedure | P0-02, P0-03 |
| **P0-06** | Familiebelangen kunnen legaal botsen met clubbesluiten zonder gratis nepotisme | `Family`, `Statute`, `Conflict`, `Project` | Familietender via commissie, recusal aantoonbaar, clubkas en privékas strikt gescheiden | P0-05 |
| **P0-07** | Voorzitter neemt initiatief in een rustige week; niks doen kan goed zijn | `weekflow`, `talks`, eigen agenda UI | Zelf agenda-start, geen gedwongen kaart, normale voetbalweek, staff werkt, geen gratis straf voor 10 weken passief | P0-02, P0-04 |
| **P0-08** | Alle vier lagen bestaan in dezelfde 10-weekse speelbare save | HQ, Club/People/Board/Family, matchday/Gazette, game-state | 10-week handmatige mobiele test, min. 1 volledige causale keten per laag, geen placeholders | P0-03–07 |
| **P0-09** | Save van oudere build raakt niet kwijt of dubbel geboekt; nieuw schema is deterministisch | `engine/14-save-api`, migraties, ledger, RNG streams | Fixture-save import, 2x load gelijk, 40x sim replay gelijk, geen nieuwe wereldstatus na alleen bladeren | P0-03 |

**Waarom dit P0 is:** een familiesysteem toevoegen zonder bestuurlijke bevoegdheden of echte uitvoeringsledger geeft schijnkeuzes; een clubproject zonder clubkas-integriteit geeft een tycoon zonder risico; bestaande game-engine beschadigen om familie toe te voegen is regressie, geen verbetering.

### P0-acceptatie: drie verplichte geïntegreerde ketens

1. **TD–trainer–jeugd:** de voorzitter geeft een mandaat, de TD scout/werkt zelfstandig, de trainer beslist minuten, de clubwedstrijden verwerken dit en de review toont de echte uitvoering. De familieagent heeft in deze save een eigen voortgang, geen lege tab.
2. **Project–ALV–familie:** de club onderzoekt een investering, de commissie besluit over de route, familierelatie veroorzaakt een belangenconflict, geld wordt precies één keer geboekt, ledenbesluit blijft bindend.
3. **Familie–carrière–wereld:** het familielid kiest een eigen opleiding/baan, de protagonist steunt of weigert, er volgt echte persoonlijke verandering, en een mogelijke latere publieke consequentie kan alleen via formele regels lopen.

**Afbreekcriterium P0:** ontbreekt één van deze drie na de 10-weekse slice, dan is M1 niet klaar. Geen nieuw cosmetic design of extra kaartgenerators toevoegen om de gaten te maskeren.

## 5. P1 — volledig seizoen, politieke verdieping, bestaande clubmodules sterker

| ID | Speelbare verbetering | Waarom nu | Definition of Done |
|---|---|---|---|
| **P1-01** | Een volledige sportieve strategie met meerdere valide paden en zelfstandige clubprogressie | Zonder dossier moet voetbal interessant blijven | 34 weken, meerdere clubstrategieën, voetbalbinding in menselijke playtest; geen dominante gratis route |
| **P1-02** | Echte leden-/commissie- en verkiezingsprocedure | ALV is een besluitvormer, geen steunmeter | Motie, begroting, stemrecht/quorum, politieke oppositie, gevolgen bij meerdere clubs |
| **P1-03** | Trainer, TD, staf, mensen buiten eigen club hebben carrièregeheugen | Personen moeten meer zijn dan huidig loyaltylabel | Rivaal neemt ex-TD aan; speler ziet oud conflict terug in nieuwe gelegenheid |
| **P1-04** | Projecten en investeringen groeien door echte fasen en kasverplichtingen | Nodig voor clubmanagement en toekomstige familietrigger | Start, financiering, goedkeuring, tender, uitvoering, vertraging, evaluatie en recoverable failure |
| **P1-05** | Familieloopbanen, privévermogen en relaties ontwikkelen zich bij seizoensovergang | Familie mag niet één incident per jaar zijn | Twee seizoenen, autonome carrièremutaties, eigen privebudget, bewust niet-voetbalpad |
| **P1-06** | Verloren verkiezing wordt een actieve kandidaten-/ledenfase | Zonder ambt is wereld nog steeds speelbaar | Twee seizoenen na verlies, voldoende directe acties, oude club voert AI-beleid uit, geen verboden CEO-acties |
| **P1-07** | Uitlegbaar dossier, project en persoonsgeschiedenis in één interface | Anders mist de speler oorzakelijkheid | In test max 2 contextnavigaties om actor/besluit/status/feit terug te vinden; 80% taakdoel (voorlopige gate) |
| **P1-08** | Sportief sterke maar financieel zwakke club kan herstelplan volgen | Geen onvermijdelijke faillissementsspiraal | Cash/contracten kloppen; verschillende reddingsroutes, onzekerheid in prognose |
| **P1-09** | Familielid kan legitiem functies zoeken maar ook nee zeggen | Zonder vrije wil wordt dynastie een exploit | Familie-agents kiezen soms een andere carrière; overheid/club keurt nepotisme onbevoegd af |

**Volgorde:** P1-02, P1-04 en P1-05 zijn samen nodig voor een geloofwaardige eerste ALV. P1-06 volgt zodra een echte verkiezing bestaat; voor die tijd geen schijn-doorstart. P1-07 wordt continu meegeleverd, niet opgespaard tot een aparte visuele sprint.

## 6. P2 — lange-termijn-dynastie zonder over-engineering

| ID | Verdieping | Preconditie | Definition of Done |
|---|---|---|---|
| **P2-01** | 40+ seizoenen met verouderende, migrerende personen en clubs | P1-03 + stabiele saves | Geen dubbele identiteiten, consistente loopbanen, prestatiebudget op 390px device |
| **P2-02** | Onmiddellijk speelbare generatiewissel tussen verschillende familieprofielen | P1-05 + P1-06 | Nieuwe protagonist krijgt eigen kwalificaties, privébezit en kansen; geen stoel/clubrechten geërfd |
| **P2-03** | Complexere familierelaties, erfenissen, loopbaannetten | P2-02 | Meerjarige familietrajecten zonder verplicht partnerschap/biologische kinderen |
| **P2-04** | AI-voorzitters en oppositiecarrières bij andere clubs | P1-02 + P1-03 | Andere clubs voeren eigen geldige besluiten en verkiezingen, herontmoetingen met voormalige medewerkers |
| **P2-05** | Meer economische stromen en faciliteiten/leningvormen | P1-04 + finance integrity | Alternatieven ontstaan uit constraints, geen vrij te kopen +2-upgrade |
| **P2-06** | Wereldnieuws, lokale politiek en historische rivalen over generaties | P2-01–04 | Historisch nieuws verwijst naar echte eerdere agenten en causale gebeurtenissen |

**Bewuste niet-prioriteiten:** tientallen varianten familiegesprekken, realistische 3D-stadions, volledige wereldcompetitie tot spelerstatistiek in elk land, automatisch gegenereerde onbeheersbare drama's en realtime transferonderhandeling door de voorzitter.

## 7. Testmatrix en stopregels

| Testcategorie | Minimum vóór integratie | M1 / M2 gate | M3 / M4 gate |
|---|---|---|---|
| Build/JS | Branch-eigen build en alle relevante unittests | Geen regressie; UI-transacties blijven geldig | Replay na schema-/world-update |
| Seizoenssim | 34 weken + winter + review | Nog steeds groen mét 4-lagenobjecten | 40-seizoenen run, internationale/regionale verbanden alleen waar geïmplementeerd |
| Saves | Save van huidige release, import op kandidaat | Migratie + reload halverwege project/match | Na verkiezingsverlies/erfenis en 30 seizoenen |
| Causaliteit | 1 bestaande TD/coach-keten registreren | 3 nieuwe ketens + 1 legale weigering + 1 familietrace | Meerdere generaties/met conflicten; geen dubbele events |
| Governance | Bevoegdheid/ALV-mock getest | Werkelijke stemprocedure voor relevant project | Reguliere/tussentijdse verkiezing + actieve doorstart |
| UI | 320/375/390/430 px, taps, contrast, matchflow | Eerste 10 weken met één-tik-besluiten en begrijpelijke uitleg | Mobile lange save en clubwissel |
| Menselijke gameplay | Eerst korte interne playtest | 45–60 minuten; begrijpt rol, ziet oorzaak en wil volgende wedstrijd | 3 verschillende spelersroutes, minstens 2 clubs/1 generatiewissel |

**Niet Done wanneer:** een nieuwe categorie alleen een scherm heeft; het besluit enkel tekst of een hidden-score oplevert; een bot een branch speelt die standaard uitgeschakelde mechanics stiekem activeert; oude savegames verdwijnen; of de werkende wedstrijdflow wordt vervangen door een popup.

**Releaseplan:** laatste geaccepteerde werkende HTML is de fallback; kandidaten mogen niet als 'af' worden geleverd zonder releasegates. GitHub is read-only totdat implementatie expliciet wordt toegestaan.

## 8. Specifieke integratievalkuilen

1. `claude-game` gebruikt `PARK`-flags; test altijd **normale UI-bereikbaarheid** en niet alleen `for (const k in F.PARK) F.PARK[k] = false` uit testharnassen.
2. `chatgpt` `VERSION=3`, `claude-game` `VERSION=5`; geen ruwe save-merge. Maak adapter/migratie met gevalideerde fixtures.
3. `chatgpt` en `claude-game` bevatten owner-/investor-DNA en definitief `sack()`. Een gekozen voorzitter vraagt meer dan tekstwijzigingen; de rechtmatige mandaten en carrièrefase moeten in de state worden ingevoerd.
4. Loving Goodall's ALV is sterk als **mechaniek**, maar `northmarch.html` is geen directe plugin voor `src/engine`. Hergebruik regelbegrippen en tests, niet scriptblokken zonder stateconversie.
5. Met meerdere `HOOK.seasonAfterMatch` wrappers kan hetzelfde gevolg via verschillende routes ontstaan; maak één execution-gateway en dwing één event-ID per mutatie af.
6. Matchinteracties en bestuursbesluiten blijven **apart gemeten**; een verbetering in klikvolume mag geen promotie van een goede weekloop rechtvaardigen.
7. Een familie- of verkiezingsactie die de `Club` zonder bevoegd besluit muteert, is P0-ontwerpfout.

## 9. Open hypotheses (geen geclaimde besluiten)

- Is de `claude-game` standaardbuild zonder PARK-unlocks de beste integratiebasis, of levert `chatgpt` in praktijk meer bruikbare eindgebruikersgameplay? **Beslis met code- en browsertest**, niet op documentatievolume.
- Is de kandidaat-/ledenfase na verkiezingsverlies boeiend genoeg voor 5–10 weken zonder mandaat, of heeft ze een andere eigen loop nodig?
- Hoeveel familiale ontwikkelingen zijn nodig om na een drukke seizoensweek interesse te wekken zonder de voetbalflow te onderbreken?
- Welke statutaire verschillen tussen clubs geven echte keuzes zonder onnodige regels?
- Hoe maak je informeren/luisteren interessant zonder dat iedereen bij maximaal onderzoek altijd de optimale uitkomst vindt?
- Hoeveel historische relaties kan de wereld bewaren zonder onleesbare incidentarchieven of performanceverlies?

## 10. De eerste daadwerkelijke ontwikkelsprint (wanneer codewerk wordt geautoriseerd)

**Doel:** geen nieuw prototype, maar één speelbare verticale verbetering van de bestaande game.

**Eerst:** branchcheck en baseline-acceptatie (M0). Dan één testsave met:
- ledenclub met eenvoudig maar bindend statuut;
- TD en trainer met botsende, legitieme voorkeuren;
- reëel budget en jeugdprioriteit;
- twee volwassen familiepersonen met onafhankelijke loopbaan;
- één eigen voorzitterinitiatief met uitvoerder/review;
- één wedstrijdscenario met herkenbare spelers;
- één familiebelangenconflict dat een clubbesluit **niet automatisch overneemt**.

**Gedurende de 10 weken:** de engine toont keuzes, legale weigeringen, relevante staffacties en minstens één besluit dat niet het gewenste effect heeft. De meeste weken blijven volledig normaal voetbal; dat is prima.

**Opleveren:** een werkende standalone HTML-release van de **gekozen bestaande engine**, testresultaten, tracebestanden voor de drie ketens, kort changelog en aantoonbaar werkende saves. Zonder dat is de sprint niet af. **Dit document zelf is geen opdracht om die release nu al te bouwen of te pushen.**

---

## 11. Relatie tot de drie opgeleverde documenten

- `FRONT_OFFICE_FC_KRITISCHE_GAME_DESIGN_AUDIT.md`: waarom 20 concrete fouten/gaten worden geprioriteerd.
- `FRONT_OFFICE_FC_VIERLAGEN_BLUEPRINT_V2.md`: volledig nieuw ontwerpcontract, gameplayloops, engine, zes spelketens en tests.
- **Dit bestand:** mapping, eerste implementatieketens, P0/P1/P2 en formele Done-/releasecriteria.

**Bronnen en beperkingen:** de eerder geleverde v1-blauwdruk is volledig gelezen; GitHub-branches zijn alleen bekeken via connector. Er zijn **geen bestanden in GitHub gewijzigd, geen PR's aangemaakt en geen actuele browser-/releasegates geslaagd verklaard**.
