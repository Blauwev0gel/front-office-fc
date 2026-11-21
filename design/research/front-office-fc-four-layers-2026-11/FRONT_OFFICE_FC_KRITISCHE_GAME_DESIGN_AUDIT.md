# FRONT OFFICE FC — KRITISCHE GAME-DESIGN-AUDIT

**Versie:** 2.0 · **Datum:** 20 november 2026  
**Status:** afgeronde *ontwerp- en code-inspectie*, geen claim van een complete actuele browserplaytest.  
**Besloten richting:** gekozen voorzitter van een ledenclub; vier volwaardige geïntegreerde lagen: **club, personen, beslissingen/bestuur, familie/dynastie**.  
**Input:** `FRONT_OFFICE_FC_VIERLAGEN_BLUEPRINT_V1.md` (439 regels), bestaande GitHub-code op meerdere branches en reeds gedocumenteerde testresultaten. De v1 is niet gewijzigd.

## 1. Executive verdict

De v1 is een **goede ontwerpinventaris, maar nog geen voldoende scherp game-design**. Het document specificeert *wat* moet bestaan, maar te weinig *welke handeling een speler uitvoert, welke bevoegdheid die handeling mogelijk maakt, welke onafhankelijke agent vervolgens iets doet en hoe een interessante volgende keuze ontstaat*. De familie is bijzonder kwetsbaar: als een gekozen voorzitter wordt weggestemd, mag de volgende generatie niet automatisch een club erven, maar v1 biedt in die situatie slechts een vaag, potentieel saai overgangsspel.

De belangrijkste correctie is **niet méér content of besliskaarten**. V2 maakt vier sterke, eigen loops die hetzelfde tijdsverloop, dezelfde personen, dezelfde middelen en hetzelfde causale feitenlog delen: (1) voetbal- en clubontwikkeling, (2) personeelsleiding, (3) politieke besluitvorming en (4) familiaire levensloop. Onder de UI komt één vaste keten van bevoegdheid → opdracht/afspraak → autonome uitvoering → meetbare wereldverandering → gevolg/reactie. De voetballoop blijft los van het tellen van bestuurlijke beslissingen.

Het tweede grote probleem is de implementatie-aanname. `chatgpt` heeft al een grote productgame maar kent een owner/investor-start en definitief ontslag; `claude-game` bevat rijkere overeenkomst-, project- en externe-partijenmodules maar sommige staan expliciet *geparkeerd*; Loving Goodall heeft een sterkere leden-/afspraakfantasie maar is een afzonderlijke HTML-engine. **Niet blind mergen en geen winnaar aanwijzen op hoeveelheid code.** Eerst baselineproeven, dan één gekozen integratiebasis en verticale doorsnede.

## 2. Bewijskaart — wat is daadwerkelijk gezien?

| Bron | Feit | Bewijsstatus | Grenzen |
|---|---|---|---|
| v1-blauwdruk, §§0–14 | Vier lagen, ledenclub, rolbeperkingen, seizoensflow en opzet generatiewissel expliciet beschreven | `[DOC]` | Ontwerp, niet geïmplementeerd |
| `chatgpt/src/engine/01-core.js` | `VERSION = 3`, `SEASON_WEEKS = 34`, seeded RNG | `[CODE]` | Niet alle extensies onafhankelijk getest |
| `chatgpt/src/engine/13-newgame-preseason.js` | `ownerOn`, DNA-varianten `investor`/`owner` en startbudgetten | `[CODE]` | Past niet zonder meer bij uitsluitend gekozen ledenvoorzitter |
| `chatgpt/src/engine/12-week.js` | `sack()` zet `phase='sacked'`; weekflow simuleert voetbal en staff | `[CODE]` | Nog geen veilige politieke doorstart |
| `chatgpt/src/engine/08-weekly-inbox.js` | Rustige weken toegestaan; optionele gebeurtenissen week 1 onderdrukt en week 2–3 beperkt | `[CODE]` | Integrale belasting uit andere modules niet meegeteld |
| `chatgpt/src/desk.js`, `src/ceocore.js`, `src/stories.js`, `src/specialist-cases.js` | Bevoegdheden/delegatie, drie-weken-rapportage, verhaallijnen en specialistische uitvoeringscontracten bestaan | `[CODE]` | Een rapport is niet automatisch een gedragswijziging of geloofwaardige vervolgbeslissing |
| `claude-game/src/modules.json`, `agreements.js`, `parties.js`, `projects.js`, `world.js`, `weekflow.js` | Expliciete overeenkomsten, autonoom gemeente-/investeerdersgedrag, projecttrajecten, een aparte wereld en weekflow bestaan in bron | `[CODE]` | Aanwezig is niet gelijk aan in de standaard-game geactiveerd |
| `claude-game/src/engine/01-core.js` | `PARK = { base:true, ini:true, agr:true, dos:true, auth:true }` | `[CODE]` | Kritiek: belangrijke modules of flows worden in normale toestand deels uitgeschakeld |
| `claude-game/src/engine/14-save-api.js` | Saveversie 5, migraties t/m 5 en aanvullende migratiehook | `[CODE]` | Verschil met `chatgpt` v3 vereist compatibiliteitsplan |
| `claude/loving-goodall-uv00vn` | `northmarch.html` en `season1.html`, wereldtest en Playwright-testscripts; eigen ALV-/afspraakontwerp | `[CODE][DOC]` | Testscripts aanwezig ≠ de actuele browsertests zijn nu uitgevoerd |
| `voorzitter-fundering` | Modulair `src/`, TD-/club-/chairmanflow en tests in een aparte standalone | `[CODE]` | Geen compatibele drop-in-vervanger voor hoofdengine bewezen |
| Eerder in dit gesprek uitgevoerde exploratie | Simulaties van een gedeeltelijke `chatgpt`-engine en de Loving Goodall standalone bereikten seizoenovergangen zonder zichtbare runtimefouten | `[TEST]` (eerder) | Geen volledige actuele release-/browserregressie, geen bewijs van spelplezier |

**Projectbronnen:**
- https://github.com/Blauwev0gel/front-office-fc/tree/chatgpt
- https://github.com/Blauwev0gel/front-office-fc/tree/claude-game
- https://github.com/Blauwev0gel/front-office-fc/tree/claude/loving-goodall-uv00vn
- https://github.com/Blauwev0gel/front-office-fc/tree/voorzitter-fundering

## 3. Kritische bevindingen — gefalsifieerbaar

Prioriteit **P0** = blokkeert een geloofwaardige vierlagengame of aantoonbare causaliteit; **P1** = sterke gameplay-/productiekwaliteit; **P2** = verdieping. De genoemde inspectie is bewijs van *code/documentinhoud*, niet van effectiviteit bij echte spelers.

| Prio | Concrete locatie | Probleem | Waarom dit gameplay schaadt | Falsifieerbare hypothese | Concrete ingreep | Acceptatiebewijs |
|---|---|---|---|---|---|---|
| **P0** | v1 §§6, 9; `chatgpt/ceocore.js` `[DOC][CODE]` | Causaal overzicht verwart correlatie met uitvoering | Een xG-rapport na drie weken bewijst niet dat de TD anders handelde | De speler kan bij ≥2 van 3 dossiers de **besluit→uitvoerder→handeling→uitkomst**-keten niet aanwijzen | Eén `Decision/Execution/Effect`-ledger en zichtbare uitvoeringstijdlijn | 3 complete herleidbare ketens, 0 ongefundeerde oorzaakclaims |
| **P0** | v1 §5.3; `chatgpt/engine/12-week.js` `[DOC][CODE]` | Verlies van ambt leidt tot design- of code-einde | Generatiespelen strandt zodra je niet gekozen bent | Bij eerste verloren ALV ontstaat geen interessante volgende speelbeurt | Speelbare oppositie-/lokale kandidaat-/familiecarrièrefase, niet automatisch herverkiezen | Twee seizoenen doorspelen na verlies zonder auto-overname |
| **P0** | v1 §§1, 11; `chatgpt/engine/13-newgame-preseason.js` `[DOC][CODE]` | `ownerOn` en investor-DNA botsen met ledenclub | Formeel gezag en geld worden onterecht één mechaniek | Een investeerder koopt zonder ledenstemming direct controle | Leg statuut en eigendom bij de club, donatie/lening als getoetste procedure | Zero gevallen waarin privébetaling stem-/benoemingsrecht automatisch creëert |
| **P0** | v1 §§3–4; `chatgpt/desk.js`, `specialist-cases.js` `[DOC][CODE]` | Mandaat, opdracht, politieke afspraak en project kunnen dubbel werk triggeren | Speler kan dezelfde deal meerdere keren uitvoeren of de actor omzeilen | Eén besluit wijzigt het salarisbudget twee keer | Eén transactioneel besluitcontract, unieke command/effect IDs | Dubbelklik, reload of parallelle hook boekt exact eenmaal |
| **P0** | v1 §5; huidige hoofdgamebron `[DOC][CODE]` | Familie bestaat hoofdzakelijk als gespecificeerd idee | Stamboom heeft geen eigen ritme of agency | Eerste seizoen biedt geen familiekeuze met blijvend onafhankelijk gevolg | Minimaal twee volwassen familieagents met loopbaan-/privébelang in gameplay | Familiepad blijft interessant zonder band met de club |
| **P0** | v1 §8 + §12; verschillende reposaves `[DOC][CODE]` | Branchintegratie behandelt verschillende statevormen te licht | Savecorruptie kan een reeds werkende game kapotmaken | Een v3-save kan zonder migratie niet veilig een v5-wereld met nieuwe personen krijgen | Schema/versioning, isolerende adapter, fixture-saves en replaychecks | Load oudere saves; nieuwe velden met idempotente migratie |
| **P0** | v1 §6.5; `claude-game/engine/01-core.js` `[DOC][CODE]` | Nieuwe plannen kunnen op geparkeerde systemen steunen | Ontwerp noemt gameplay die in standaardinstelling niet kan starten | AI-/projectflow uit bron is onbereikbaar voor speler met `PARK=true` | Per module bereikbaarheid testen, PARK-map publiceren, activering expliciet beslissen | UI-driven smoke-test van iedere overgenomen mechanic |
| **P0** | v1 §4.4; `loving-goodall/ALV-VOORZITTER.md` `[DOC]` | Verkiezingen riskeren één makkelijk steun-optimum | Politiek wordt stemmen kopen in plaats van club besturen | Meest populaire optie wint ≥90% van scenario's | Gescheiden stem voor ambt, begroting en moties; werkelijke belangen/conflicten en toekomstige concessies | Beste korte-termijnstemroute verliest soms op langere termijn, verklaarbaar |
| **P1** | v1 §2.2 `[DOC]` | Clubmanagement noemt domeinen maar geen terugkerende keuzecyclus | Voetbal is decor voor afspraken in plaats van zelfstandig spel | Passieve speler ziet tussen wedstrijden geen interessante ontwikkelingen | Rolling sport-/financieel plan, kwartaalforecast, impact op selectie | Tester wil volgende speelweek zien zonder nieuw bestuurlijk dossier |
| **P1** | v1 §§3.1, 9.3 `[DOC]` | Persoonlijkheden zijn nog te veel losse traits | Spelers gaan verborgen loyaliteitsformule optimaliseren | Drie verschillende personen accepteren identieke aanbiedingen zonder andere uitvoering | Competentie × belang × bevoegdheid × informatie × relaties × alternatief | Counterfactual dezelfde opdracht met andere TD verandert uitvoering, niet enkel meters |
| **P1** | v1 §4.1; Loving Goodall max. vier momenten `[DOC]` | Te lage, rigide actieve handelingsruimte | Besturen voelt reactief en incidenteel | Speler kan in een rustige oktobermaand geen zinvol eigen initiatief beginnen | Doorlopende agenda, open vergader-/opdrachtacties; echte voorbereiding/deadlines | 10 weken zonder verplichte kaarten en met relevante vrijwillige initiatieven |
| **P1** | v1 §5.3 `[DOC]` | Opvolging zonder geschikt familielid blijft vaag | De speler moet kinderen krijgen of via onduidelijke cheat door | Kinderloos, vervreemd of niet-voetbalgezin levert geen voortzetting | Expliciet legatenspoor en optioneel protégéperspectief, zonder juridisch erfrecht | Test met geen geschikte verwanten blijft speelbaar of eindigt transparant op spelerskeuze |
| **P1** | v1 §§1.1, 4.4 `[DOC]` | ALV en verkiezing hebben geen volledig procesmodel | Onduidelijk of bestuur, leden en oppositie dezelfde beslissing kunnen nemen | Speler kan een referendum gebruiken om het huidige statuut te omzeilen | Statute→jurisdiction→quorum→procedure→binding→term en beroepsmogelijkheid | 100% voorstellen respecteren formele regels en veto's |
| **P1** | v1 §§2.2, 9.2 `[DOC]` | Financiële liquiditeit, schulden en projectbetalingen zijn onvoldoende gecontracteerd | Gratis projectgeld of cash-timing misvormt keuzes | Project kan starten ondanks ontbrekende financiering | Boeken op commitment en settlement, runway, insolventie, herstelpaden | Integriteitstest kas, verplichtingen, termijnen, rente en faillissementsroute |
| **P1** | v1 §§6, 10 `[DOC]` | Weekafhandeling kan gebeurtenissen dubbel veroorzaken | Volgorde personeel/project/wedstrijd/politiek beïnvloedt fairness | Reload vóór uitslag geeft andere transfer of twee Gazettes | Eén chronologische tick, snapshot, idempotentie en apart RNG-stroom voor UI | Zelfde seed+acties+reload=zelfde uitvoeringslog |
| **P1** | v1 §8 `[DOC]` | Vier tabs riskeren vier aparte administratieve spellen | Contextwissels maken causale relaties onzichtbaar | Tester moet 4 schermen bezoeken om één plan te begrijpen | Eén HQ met kruislinks; afspraak en uitvoering op betrokken club-/persoonpagina | 80% van geteste oorzaken in maximaal 2 contextstappen teruggevonden (**testdoel**, niet feit) |
| **P1** | v1 §7 `[DOC]` | Het twaalfjarig verhaal is één voorgekookte voorbeeldroute | We kennen geen tegenstrijdige of mislukte uitkomsten | Tegenovergestelde keuzes leveren dezelfde vertelling op | Counterfactual families, coach- en ALV-branches; expliciete agent-tegenacties | Verschillende club-, persoon-, stem- en familiegeschiedenis bij verschillende besluiten |
| **P1** | v1 §9.1 `[DOC]` | Wereldschaal en persistentie zijn niet begrensd | Honderden relaties over decennia kunnen traag/rommelig worden | 30 seizoenen verdubbelen save of ticktijd onbegrensd | Relevantiegedreven agents, aggregatie, historisch archief en deterministische promotie naar detailniveau | Performancebudget op mobiel en 40-seizoenen-save/replay |
| **P2** | v1 §5.1 `[DOC]` | Privéleven lijkt te veel op gestapelde familie-events | Geen eigen doelen of interessante afweging | Familielid zegt telkens slechts "relatie +/-" | Persoonlijke projecten, grenzen en alternatieve loopbanen | Familieboog verandert carrière/vermogen/relaties, ook zonder voetbalbetrokkenheid |
| **P2** | v1 §§11–12 `[DOC]` | Releaseplan noemt alles vanaf v1, maar niet precies wat speelbaar is | Grote scope nodigt uit tot half afgeleverde builds | Eerste release bevat 4 tabs maar slechts 1 werkende laag | Vertical slices met minimale werkende actie+uitvoerder+follow-up per laag | Geen plekhouder; alle vier testbaar zonder speciaal debugmenu |

### Drie conflicten die een game developer niet mag negeren

1. **Bestaande carrière versus nieuwe gekozen voorzitter.** `chatgpt`/`claude-game` zijn ontworpen als CEO met direct ontslag bij verlies. Een verkiezings- en oppositiecarrière is dus een kernarchitectuurwijziging, niet een ALV-overlay. `[CODE]`
2. **Rijkere `claude-game`-code versus bereikbare gameplay.** Daar zijn `agreements`, `parties`, `projects` en `world` al, maar `PARK` zet meerdere kernpaden standaard uit; tests kunnen geparkeerde modules expliciet activeren. Featurelijst ≠ live gameplay. `[CODE]`
3. **Democratische clubmacht versus familiesysteem.** De familie mag eigendom en naam verwerven, maar nooit benoemingsrecht. Als een familielid verkozen wordt, is dat een onafhankelijke kandidaat met eigen relaties en eigen kiezers. `[DOC]`

## 4. Wat behouden, vervangen en verdiept wordt

| V1-voorstel | Verdict | V2-behandeling |
|---|---|---|
| Vier autonome maar verweven lagen | **BEHOUDEN** | Iedere laag krijgt een eigen spelerloop, eigen risico's en één gedeelde engine |
| Gekozen voorzitter / club van leden | **BEHOUDEN, HARDER GEMAAKT** | Formele rechtsketen, statuut, quorums, onafhankelijke ALV en verkiezingen |
| Geen tactisch micromanagement | **BEHOUDEN** | Volwaardige voetbalpreview/match/Gazette, maar nul voorzitter-match-SMS |
| Loving Goodall `You give / They give / Tested / If it fails` | **BEHOUDEN, AFGEBAKEND** | Alleen voor echte interpersoonlijke/politieke overeenkomsten, niet ieder project |
| Vier vaste bestuursmomenten | **GESCHRAPT ALS CAP** | Gebeurtenissen door toestand + vrij agenderen met echte tijd/uitvoering |
| Standaard driejarige voorzitterstermijn | **VOORSTEL** | Statuut bepaalt termijn (default voorstellen en testen), ALV ieder jaar |
| Kleine familielaag vanaf jaar 1 | **VERDIEPT** | Volwassen agents met eigen geld, netwerk, carrièreprojecten en conflictsituaties |
| Generatiewissel na overlijden | **VERDIEPT** | Altijd duidelijk speelbaar perspectief; niet zonder macht wachten of mandaat erven |
| Eén ledger met causale historie | **VERDIEPT** | Besluit- en uitvoeringsstatus, actor, delta's en herleidbare bronnen |
| Eén primaire codebasis kiezen vóór merge | **BEHOUDEN, VOORWAARDELIJK** | Vergelijk normaal actieve featurepaden, browserflow, saves en performance |

## 5. Wat nog níét bewezen is

- **Geen actuele end-to-end browser-run van beide ontwikkelbranches in deze audit.** De geïnspecteerde repository is read-only en de container kan GitHub niet klonen via het netwerk. Broninspectie is geen UI-playtest. `[ONBEKEND]`
- **Geen onafhankelijke 40-jarige familiesimulatie.** Die moet nog worden gemaakt. `[ONBEKEND]`
- **Geen bewijs dat zes beschreven spelketens daadwerkelijk in bestaande code werken.** Het zijn falsifieerbare implementatiecontracten voor v2. `[HYPOTHESE]`
- **Geen geldig fun- of retentieoordeel op basis van bots.** Eerdere synthetische seizoensruns bewezen technische voortgang, niet betrokkenheid. `[HYPOTHESE]`
- **Benchmark Hometown FC** is hier conceptueel gebruikt, niet opnieuw onafhankelijk op actuele release geverifieerd; geen conclusies over actuele prijs, installaties of exacte featurebalans. `[HYPOTHESE]`

## 6. Besluitpunten

**[BESLOTEN]** Gekozen ledenvoorzitter; vier volwaardige lagen; geen eigen tactiek/transferdeal; geen familie-overdracht van clubmacht; afzonderlijke voetballoop; geen feature-only ontwikkeling.

**[VOORSTEL]** Vier UI-hoofdbestemmingen onder één HQ; default driejarige zitting; één actor-/ledgerarchitectuur; familiecarrière als tweede voortdurende drijfveer; de AI respecteert formele veto's; alternatieve speelbare fase na verlies; gekozen primaire branch pas na release-gates.

**[NOG TE TESTEN]** Hoe lang de speler zonder bestuurszetel boeiend blijft; hoe vaak vrijwillige gesprekken betekenis hebben; of familie vanaf week 1 voldoende autonomie toont; hoeveel politieke informatie de UI zonder numeriek grind moet geven; of het meerjarenspel nog verrassend is; welke codebranch daadwerkelijk het beste productfundament levert.

**Vervolg:** de zelfstandig leesbare v2-ontwerpbijbel en het implementatiebacklog bevatten concrete systemen, scenario's en testprotocollen. Geen code, branches, PR's of releases zijn gewijzigd.
