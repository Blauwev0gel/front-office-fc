# NORTHMARCH — VASTE SPELSTRUCTUUR EN BOUWAANPAK

**Versie:** 1.0 · **Datum:** 21 november 2026  
**Status:** afgesproken spelvisie + voorgestelde technische vertaling; nog niet geïmplementeerd of in GitHub gecommit.  
**Repository:** `Blauwev0gel/front-office-fc`  
**Canonieke bestaande spelbasis:** branch `claude/loving-goodall-uv00vn`, bestand `standalone/front-office-fc/voorzitter/northmarch.html` (geïnspecteerd op SHA `7a2d5d3a8efb58ea05759e8d3b86d305bb3d8673`).

## 1. De onveranderlijke opdracht

**Bouw een echte voetbalmanagementgame die zonder verhaallijnen, dialoogkaarten, rijke personeelsautonomie of dynastiesysteem jarenlang zelfstandig functioneert.** De speler kan de club onderzoeken, een koers bepalen, investeringen starten, exploitatie beheren, sportieve ambities ontwikkelen en seizoenen lang de gevolgen ondervinden. Dit is de FM/FC Pro 2-achtige zelfstandige gameplaylaag.

Daarboven komen, in een technisch afhankelijke maar voor de speler naadloze opbouw, (a) staff en autonomie, (b) verhalen/politiek/gevolgen, en (c) dynastie/generaties. **De verhaalengine is een waardevolle bestaande bovenlaag, niet de simulatielus.** Een verhaalloze testmodus is verplicht.

De speler is **gekozen voorzitter van een ledenvoetbalclub**: club en lidmaatschap zijn niet zijn privébezit; geen automatische erfopvolging. Geen zelfgekozen wedstrijdopstelling of individuele tactische microsturing.

## 2. Drie soorten 'lagen' die NIET door elkaar mogen lopen

### A. Productarchitectuur — vijf horizontale niveaus

| Niveau | Betekenis | Afhankelijkheden | Bouwuitgangspunt |
|---|---|---|---|
| **1. Zelfstandige spelwereld** | Wereld, kalender, clubs, competities, wedstrijden, spelers, contracten, transfers, economie en infrastructurele toestand **simuleren elkaar** | Alleen eigen core en andere domeinengines via heldere contracten | Moet zonder alles erboven draaien |
| **2. Management-gameplay** | Cluboverzicht, inspectie, planningen, investeringen, beheer en eigen initiatief; zelf kiezen, iets uitvoeren en gevolgen volgen | Onderliggende domeinengines | Moet zonder verhalen of autonome karakters speelbaar zijn |
| **3. Staff & autonomie** | Medewerkers, talent, doelen, mandaten, bevoegdheden, voortgang en autonoom uitvoeren | Gebruikt dezelfde commando's en simulatie als speler | Bovenop niveau 1–2, geen parallelle realiteit |
| **4. Verhaal & bestuur** | Northmarch-personages, situaties, relaties, beloften, conflicten, leden, oppositie, ALV, pers | Luistert naar echte simulatieresultaten; wijzigt wereld alleen via geldige commando's | Bestaande sterke engine bewaren, later causaler aansluiten |
| **5. Dynastie** | Familie, opvolging, nalatenschap, generaties en geschiedenis | Leest langetermijngeschiedenis uit eerdere niveaus | Later; nooit noodzakelijke voorwaarde voor clubsimulatie |

Niveau 1 en 2 zijn **het eerstvolgende grote bouwdoel**. De hogere niveaus bestaan in de bestaande game deels al; die worden tijdens de bouw behouden, niet preventief gewist en ook niet allemaal tegelijk uitgediept.

### B. Domeinengines — verticale systemen binnen niveau 1–2

Eén wereld, met duidelijk eigenaarschap per domein:

1. **Core/Time/Save:** seeded RNG, week-/seizoenstick, command bus, events, log, persistente IDs en migraties.
2. **World:** clubs, divisies, schema, andere clubs, instituties, omgeving en markttoestanden.
3. **Football:** spelers, kwaliteiten, selecties, wedstrijden, resultaten, ontwikkeling, jeugd, scouting, transfers en contracten.
4. **Club/Facilities:** stadion, terrein, tribunes, afdelingen, bezittingen, bouw en onderhoud.
5. **Finance/Economy:** kas, grootboek, inkomsten/kosten, kapitaal, rente, schuld, contractuele verplichtingen en begroting.
6. **People/Agents:** rollen, eigenschappen, doelen, relaties, stafhandelingen en delegatie.
7. **Narrative/Governance:** gebeurtenissen, politieke machtspositie, leden, dossiers, beloftes, ALV, verkiezingen.
8. **Dynasty:** familie en generatielange voortgang.
9. **UI:** toont toestand, laat inspecteren en geeft gevalideerde commando's door; geen aparte business logic.

Dit is géén opdracht om alle negen domeinen ineens op FM-diepte te bouwen. Het bepaalt *wie wat bezit*, zodat ze afzonderlijk gebouwd en aangesloten kunnen worden. Ook is dit niet gelijk aan de zeven **speellagen** uit eerdere onderzoeksdocumenten op `voorzitter-fundering`. Deze nomenclatuur moet expliciet gemapt worden, niet klakkeloos vervangen.

### C. Tijdslagen — één centrale scheduler

Moment/actie → week/wedstrijd → maand/grotere projecten → seizoen/competitie/ALV → carrière/generatie. Het systeem bepaalt een vaste tick-volgorde; een verhaalkaart mag niet zelf stiekem de tijd of kas vooruitzetten. Het spel ondersteunt spontane inspectie en eigen initiatieven, los van de inbox.

## 3. De bestaande game — bewezen versus ontbrekend

**Geïnspecteerd in `northmarch.html` op de Loving Goodall-branch:**

| In bestaande game aanwezig | Huidige beperking voor een FM-achtig spel |
|---|---|
| `newWorld`, `mkClub`, 32 clubs, twee divisies van 16, `makeFixtures`, `standings`, `promoteRelegate` | Smalle wereldsimulatie; verdere divisies en institutionele economie nog niet bewezen |
| `simRound`, `myStr`, verwachte goals / Poisson-achtige scoreverdeling | Sterkte wordt grotendeels als één waarde per club behandeld; geen echte spelersselectie-engine in deze HTML |
| Club `cash`, `debt`, `cash(d,why)` | Geen volledig grootboek, cashflow, budgetten, schuldschema of projectadministratie in deze game |
| `mkPerson`, `loy`, `memo`, `addRel`, `meet`, personeelswissels | Sterke personagegeheugenbasis; nog geen volledige staff-agenten met uitvoerende taken |
| `SIT`, `genDesk`, `applyCard`, `startMoment`, `runBlock`, `startALV` | Verhaal- en beslismomenten zijn te veel de hoofdmanier van spelen; simuleert in blokken van wedstrijden |
| Browser `save`/`load`, mobiele interface | Schema v1; migraties en modulair gamebeheer nog niet aanwezig |

**Andere relevante code bestaat óók:**
- `voorzitter-fundering`: `standalone/front-office-fc/voorzitter-fundering/src/club/ground.js`, `finance.js`, `players.js`, `td.js`, `summer.js`, `world/football.js`, `ui/system.js`, tests. Deze branch bevat o.a. gebouwen, projectkosten, faciliteitensignalen, grootboek, selectie/TD-systemen; **hergebruik kandidaat, geen automatische vervanging van Northmarch**.
- `claude-game`: projecten, afspraken, personen, world, weekflow en andere systemen; let op eventueel geparkeerde implementaties achter featureflags.
- `main`, `chatgpt`, relevante `feature/*`-branches: modules en tests die kandidaat zijn voor gericht hergebruik.

**Bewijsniveaus verplicht:** `[SOURCE-READ]`, `[TESTED]`, `[UI-PLAYED]`, `[DESIGN-ONLY]`. Een bestaande functie is nog niet gelijk aan speelbare, geïntegreerde gameplay. Een veranderde UI-variabele is nog niet gelijk aan een daadwerkelijk sportief/financieel effect.

## 4. Systeemcontracten — hoe alles later samenwerkt

- Eén gedeelde, versieerbare save-state; **exact één eigenaar van elke toestand**.
- Een actie is een domeincommando, bijvoorbeeld `StartProject`, `SetTicketPrice`, `AdvanceWeek`, `ApplyTransfer`, `AssignMandate`.
- Een commando valideert rechten/voorwaarden, muteert uitsluitend de eigen engine, en produceert traceerbare gebeurtenissen en eventuele transacties.
- Geldstromen lopen altijd via `Finance`, ook wanneer een verhaal, spelertransfer of aannemer er aanleiding toe geeft.
- Elke betaling, belofte, projectfase, blessure en seizoensovergang kan worden teruggeleid tot oorzaak en tijdstip.
- Andere engines consumeren feiten (`FacilityCompleted`, `PlayerInjured`, `LoanPaid`, `ClubPromoted`, `MemberVotePassed`) en kunnen via toegestane commando's handelen.
- Afzonderlijke systemen moeten een **standaarduitvoerder/fallback** hebben wanneer de latere staff- of verhalenlaag uitstaat. Geen blokkade omdat een personage-agent nog niet gebouwd is.
- Geen nieuwe save-versie zonder migratietest en een onveranderde laatst-speelbare referentie.

**Voorbeeld van echte causaliteit:** stadionrenovatie → projectduur/kasuitgave → gewijzigde capaciteit of onderhoud → gewijzigde opkomst/inkomsten → (optioneel) reactie van leden/medewerker/verhaal. De eerste vier stappen werken zonder verhaalengine.

## 5. Ontwikkelvolgorde — geen grote herschrijving

**0. Bevries het referentiespel.** Houd `northmarch.html` op `claude/loving-goodall-uv00vn` intact. Start ontwikkeling op een nieuwe branch en behoud bij elke release een geldig speelbaar HTML-bestand. Verifieer uitgangs-SHA's.

**1. Korte gerichte codeinventaris.** Per essentieel domein maximaal één tabel: welke bronfile/branch, werkende API, afhankelijkheden, tests, besluit `REUSE/ADAPT/REWRITE/DEFER`. Geen eindeloze full-repo-audit. Vermeld tegenstrijdige branches of ontwerpbesluiten.

**2. Maximaal zes wezenlijke vragen.** Alleen nog open keuzes over agency, niveau voetbal-/wedstrijdsimulatie, aantal divisies en startschaal, tempo, economische complexiteit, eerste complete release/UI. Stel bij voorkeur één vraag per beurt; verwerk antwoord in `docs/DECISIONS.md`. Geen schijnkeuzes.

**3. Maak core en simulatie zelfstandig.** Eén tijdscheduler en save-model; wedstrijd/club/financieel systeem draaien zonder verhalen. Hergebruik bestaande werkende modules, niet zomaar complete branches samenvoegen.

**4. Voltooi de clubmanagementgame.** Verken, vergelijk, bouw, financier, onderhoud, herstel en ontwikkel; meerdere jaren en meerdere strategieën. Financiële en sportieve effecten zijn aantoonbaar, niet alleen gerapporteerd.

**5. Verdiep football waar nodig.** Minimaal genoeg echte selectie-/contract-/jeugd-/transfermechaniek voor werkelijke sportieve feedback op managementbesluiten; opstelling en tactiek blijven trainerverantwoordelijkheid.

**6. Sluit staff-autonomie, Northmarch-verhalen, politiek en later dynastie verder aan.** Hun beslissingen gebruiken dezelfde kernsimulatie; geen tweede verborgen economie of tweede wedstrijduitkomst.

**7. Bouw de standalone HTML, test, en lever pas na release-gates.** Elke voltooide release een downloadbaar/klikbaar speelbaar HTML plus source, tests, status en bekende beperkingen. Geen gebroken kandidaat als voltooid opleveren.

De fasen zijn **werkpakketten**, geen opdracht om de bestaande verhaalengine tijdelijk uit het product te verwijderen. Die blijft zoveel mogelijk werken terwijl de kern op de achtergrond wordt verdiept.

## 6. Niet-onderhandelbare kwaliteitscriteria

- **Story-off:** minimaal tien seizoenen, met echte keuzes, risico, groei en sportieve competitie; geen verhaalkaarten vereist.
- **Causale test:** zelfde seed en state, één andere investeringskeuze → werkelijk verschillend downstream gedrag. Niet alleen het getal `injuryRisk` op de UI veranderen.
- **Economie:** mutaties en projectbetalingen worden precies één keer geboekt; cash en journaal zijn reconcilieerbaar.
- **Strategieën:** financiële voorzichtigheid, infrastructuur/jeugd en ambitie/schuld geven verschillende, verdedigbare routes. Geen verborgen verplichte upgrades.
- **Seizoenen:** promotie, degradatie, competitie en contracten gaan door; save/reload, 20-seizoenssim en migraties worden getest.
- **Speler-agency:** altijd zelf kunnen inspecteren en initiëren. Inbox, verhaal of personeelsinterventie mag niet de enige doorgang naar een relevante clubhandeling zijn.
- **UI:** mobiel leesbare, navigeerbare managementschermen; een speelbare wedstrijdflow; ook rustige weken blijven interessant.
- **Story-on:** bestaande Northmarch-personen, verkiezingen, leden en gebeurtenissen blijven coherent en triggeren geen dubbele updates.
- **Bewijs:** code gelezen, tests echt uitgevoerd en menselijke gameplay afzonderlijk gemarkeerd.

## 7. Status van dit document

**Vastgelegd als ontwerp richting:** het spel zonder verhalen als zelfstandig product; bestaande Loving Goodall-baseline behouden; in lagen ontwerpen; staff/verhaal/dynastie bovenop een consistente simulatie; gericht hergebruik uit andere branches.  
**Nog te kiezen:** de zes ontwerpdimensies hierboven, precieze V1-scope en technische details op basis van de echte hergebruiksinventaris.  
**Nog niet gedaan:** nieuwe game bouwen, bestaande GitHub-branchen aanpassen, volledige browserplaytest, releases publiceren.

**Bijbehorende uitvoerprompt:** `NORTHMARCH_MASTERPROMPT_GELAAGDE_FOOTBALMANAGER_V1.md`.
