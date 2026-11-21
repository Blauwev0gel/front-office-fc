# De Voorzitter per laag: wat bestaat er echt?

*22-11-2026. Een eerlijke inventaris van de code op `voorzitter-fundering` (`standalone/front-office-fc/voorzitter-fundering/src`), naast de ontwerpdocumenten. Per laag: wat het is, wat er in de code zit, wat de speler ziet en doet, wat alleen op papier staat, en wat ontbreekt.*

## De statusschaal
| Status | Betekenis |
|---|---|
| **0 Idee** | Genoemd, niet uitgewerkt |
| **1 Ontwerp** | Een `LAAGn`-document of concept |
| **2 Code** | De laag draait in de simulatie |
| **3 Gekoppeld** | Andere lagen lezen zijn signalen, zodat keuzes doorwerken |
| **4 Speelbaar** | De speler ziet het, kan handelen, en voelt het gevolg |

## Overzicht
| # | Laag | Ontwerp | Code | Gekoppeld | Speelbaar | Kort oordeel |
|---|---|---|---|---|---|---|
| 1 | Clubbeheer | v3 | Grotendeels (vandaag) | **Nee**, alleen naar geld | Deels | Breed, maar zonder gevolgen buiten geld |
| 2 | Financiën | v3 | Deels | Ja (grond, lonen, transfers) | Deels | Grootboek staat; sponsors, bank en licentie ontbreken |
| 3 | Mensen | Nee (alleen in de systeemideeën) | Ja, goed | Ja | Ja | Sterk, maar nooit als laag beschreven |
| 4 | Voetbal | Nee | Ja, het rijpst | Ja | Ja (via de TD) | Het fundament van het spel |
| 5 | Leden en politiek | Nee | Ja | Ja | Ja | Sterk; het hart van het verhaal |
| 6 | Wereld | Nee | Ja, basis | Deels | Deels | 32 clubs; geen bond, gemeente, sponsors of rente |
| 7 | Dynastie | Concept (keuzes 76–77) | **Niets** | — | — | Alleen papier |
| — | **De verhaalstructuur** (de flow) | Keuzes 71–75 | Ja | Ja | Ja | Dit is het spel zoals het nu speelt |

**De kern van het probleem:**
- We hebben de lagen **ontworpen in de volgorde 1, 2, 3**, maar de code is gegroeid **als verhaal**: opening, mandaat, zomer, weken, ALV.
- Lagen 3, 4 en 5 bestaan al en werken goed, maar hebben **geen laagdocument**.
- Laag 1 en 2 hebben een groot document, maar zijn het minst gekoppeld.
- We hebben dus diep ontworpen waar het spel het dunst is, en niet vastgelegd waar het spel al sterk is.

---

## De verhaalstructuur (de flow): hoe het spel nu speelt
Dit is geen laag, maar de **lijm** die de lagen tot een spel maakt (`chairman/flow.js`, `chairman/opening.js`, `ui/opening.js`).

1. **De opening:**
   - een telefoontje;
   - drie dossiers (clubs), waarvan je er één tekent door de knop vast te houden;
   - een verzegelde envelop met een geheim;
   - soms direct een crisis.
2. **Het manifest:** drie keuzes (sport, club, persoon) worden **beloftes** aan de leden.
3. **De zomervergadering:** drie stemmen (TD, trainer, financieel directeur) en jouw **mandaat** in zeven pijlers.
4. **De transferzomer:** zes weken met een ticker, een krant en een debriefing; de TD handelt binnen jouw kaders.
5. **Het seizoen, 30 weken.** Per week:
   - de feed met kaarten;
   - **de post**: situaties (19 soorten) met afspraakkaarten;
   - reacties, twee per week;
   - jouw toets op de wedstrijddag;
   - de wedstrijd.
6. **De ALV in week 30:** jaarverslag, moties, lobby, verdediging en stemming. Daarna een nieuw seizoen.

**Oordeel:** dit werkt en heeft een eigen gezicht. Alles wat we nu bouwen moet hier **in** passen, niet ernaast.

---

## Laag 1: clubbeheer
**Wat het is:** het terrein, het stadion, de gebouwen en de afdelingen. Het runnen van de club, dat altijd kan.

**In de code** (`club/ground.js`, `ui/system.js`, vandaag gebouwd):
- **Het stadion:**
  - vier zijden, elk met een type, ringen, overkapping en staat;
  - het veld: grasmat, drainage en verwarming;
  - zeven voorzieningen op niveau 1–8;
  - een vergunde capaciteit die begrensd wordt door de draaihekken en de veiligheid.
- **6 kavels** met zeven soorten complex.
- **Zes afdelingen,** elk met een budget en een koers; een koerswissel kost een seizoen.
- **Bouwprojecten:** vergunning, drie aannemers met elk hun eigen risico, overschrijding, vertraging en oplevering. Dan nog verval, reparaties en een keuring.

**De speler:** de hub-kaart *Ground*, met de tabbladen Stadium, Complex, Departments, Build en Repairs.

**Wat ontbreekt:**
1. **Geen gevolg buiten geld.**
   - `trainingsniveau`, `medisch niveau`, `academieniveau`, `scoutingbereik`, `veldkwaliteit` en `sfeer` worden berekend, maar **niemand leest ze**.
   - Blessures, jeugd, scouting en thuisvoordeel in laag 4 merken niets van je gebouwen.
   - Daardoor voelt het als een losse spreadsheet: precies het gevoel van de eigenaar.
2. **Geen voorkeurssignalen naar de leden:** een staantribune maakt niemand blij of boos.
3. **Licentie-eisen en vergunningen van laag 6** zijn nu een dobbelsteen.
4. **Schaal klopt niet:** keuze 81 zegt *vierde divisie*, maar de wereld in de code heeft **twee divisies van 16 clubs**.

**Status:** 2 Code, bijna 3; speelbaar zonder voelbaar gevolg.

---

## Laag 2: financiën
**Wat het is:** geld. Wat binnenkomt, wat eruit gaat, en wat je ermee mag.

**In de code** (`club/finance.js`, vandaag uitgebreid):
- **Een wekelijks grootboek met 17 posten:**
  - inkomsten: kaarten, business, horeca, seizoenkaarten, sponsors, merchandise, evenementen, contributie, tv;
  - kosten: lonen, afdelingen, onderhoud, beveiliging, reizen, bouw, reparaties, rente.
- **Prijzen per vaktype,** met een opkomst die per groep anders op de prijs reageert.
- **Een voorspelling van 26 weken met een bandbreedte, en een gezondheidsstatus.**
- **Al eerder aanwezig:**
  - kas en schuld;
  - automatische roodstand bij de bank;
  - het transferbudget en het loonplafond als kaders van het mandaat;
  - de financieel directeur als persoon die in de vergadering spreekt.

**De speler:** de hub-kaart *Money*, met de tabbladen Overview, Ledger en Prices. Daarnaast het mandaat in de zomer en de belofte *"de boeken op orde"*.

**Wat ontbreekt** (ontworpen in v3):
- sponsors per slot (aannemen of weigeren);
- leningen en ledenobligaties;
- de bank met voorwaarden die acties blokkeren;
- een investeerder;
- de licentie van de bond;
- de balans;
- de vier potjes als echte begroting. Nu bestaan alleen het transferbudget en het loonplafond.

**Bekende fout:** hogere prijzen leveren altijd meer op, omdat de leden (laag 5) nog niet reageren op prijzen.

**Status:** 3 Gekoppeld voor inkomsten en lonen; de helft van het ontwerp is nog niet gebouwd.

---

## Laag 3: mensen
**Wat het is:** alle personen, met eigenschappen, loyaliteit, geheugen en relaties.

**In de code:**
- **Personen** (`world/world.js` `mkPerson`, `chairman/state.js`):
  - rollen: trainer, TD, financieel directeur, ledenleiders, journalist, spelers;
  - eigenschappen en waarden;
  - **loyaliteit** (`loy`) en een **geheugen** (`memo`/`meet`);
  - **relaties**: mentor, protégé, vrienden, rivalen, familie.
- **De TD** (`club/td.js`) als vakman: een filosofie, een driejarenplan, twee eigenschappen, een gerucht, en vaardigheden waaronder een "oog" voor spelers.
- **Spelers als personen** (`club/stories.js`): een thuisstad, een verhaal, wat ze willen, en verhaallijnen.
- **Aannemen en ontslaan** van trainer en TD (`cards.js` `hireCoach`, `flow.js` `hireTd`). Het *Staff*-tabblad.

**De speler:** portretten, "People you know", relaties, en de reacties van personen op jouw keuzes.

**Wat ontbreekt:**
- ambities en gunsten als systeem;
- afdelingshoofden voor de zes afdelingen van laag 1 (nu heeft alleen de TD een vak);
- staflonen in het grootboek.

**Status:** 4 Speelbaar, maar **zonder laagdocument**.

---

## Laag 4: voetbal
**Wat het is:** de selectie, de wedstrijden, de stand en de transfers. Jij stelt kaders en kiest nooit de opstelling.

**In de code** (het rijpst):
- **Spelers** (`club/players.js`):
  - eigenschappen: kwaliteit, potentieel, leeftijd, loon, contract, vorm en blessures;
  - een automatische basiself;
  - de kwaliteit van de selectie en de gaten erin.
- **De wedstrijd** (`world/football.js`): een simulatie op basis van verwachte goals, de stand, en promotie en degradatie tussen twee divisies van 16.
- **Transfers:**
  - de TD in de winter (`club/club.js`);
  - **de transferzomer** van zes weken (`club/summer.js`);
  - vrije spelers (`club/market.js`);
  - verlengingen;
  - de jeugd: twee spelers per zomer uit de academie.
- **Het mandaat** in zeven pijlers (`chairman/meeting.js`): budget, loonplafond, profiel, huisregels en meer. Getest met `mandate-*`.

**De speler:** het *Squad*-tabblad, spelersprofielen, de transferzomer en de wedstrijddag.

**Wat ontbreekt:**
- de signalen uit laag 1: training, medisch, academie, veld en thuisvoordeel;
- een speelstijl of clubfilosofie die over seizoenen groeit.

**Status:** 4 Speelbaar, **zonder laagdocument**.

---

## Laag 5: leden en politiek
**Wat het is:** de vereniging als parlement: ledengroepen, steun, beloftes, statuten en de ALV.

**In de code:**
- **Ledengroepen** per club, met een aandeel en een stemming (`ARCH` in `core/content.js`).
- **Beloftes** uit het manifest, met voortgang en breuk (`chairman/promises.js`).
- **Statuten** en bindende besluiten (`binding`).
- **De ALV** (`flow.js` `startALV`): moties van de drie ontevredenste groepen, lobbyen, je verdedigen en stemmen, ook met een tweederdemeerderheid.
- **Situaties en kaarten** in de post, die groepen raken (`chairman/situations.js`, `cards.js`).

**De speler:** het *Members*-tabblad, de stemming per groep met een pijl, de notities van de voorzitter en de ALV.

**Wat ontbreekt:**
- reacties op prijzen, sponsors en gebouwen (laag 1 en 2);
- coalities;
- ledenwerving;
- ledenbesluiten voor grote bouw of leningen;
- het aantal leden (nodig voor de contributie).

**Status:** 4 Speelbaar, **zonder laagdocument**.

---

## Laag 6: wereld
**Wat het is:** alles buiten de club: competitie, rivalen, de stad, de markt.

**In de code:**
- **32 clubs** met een eigen identiteit: kleuren, wapen, shirt, stadion (`world/world.js`, `identity.js`).
- **Rivalen,** waarbij elke club een rivaal heeft met een reden.
- **De concurrentie** die zetten doet (`news.js` `oppMove`), AI-clubs die trainers ontslaan, en een AI-zomer en -winter.
- **De krant** *The Northmarch Echo*.

**Wat ontbreekt:**
- de bond (licentie, regels, tv-geld);
- de gemeente en de buurt (vergunningen, grond);
- een sponsormarkt;
- de rente;
- het weer;
- de wereld als laag met eigen signalen.

**Status:** 2–3. Er is een basis, maar geen laagdocument en geen instituties.

---

## Laag 7: dynastie
**Wat het is:** je familie, je erfgenaam, vetes en verbonden, en de opvolging via de ALV.

**In de code:** **niets.**

**Op papier:** `FAMILIE-VOORZITTER.md` en `LOOP-DYNASTIE-VOORZITTER.md` (keuzes 76–77).

**Status:** 1 Ontwerp.

---

## Wat er structureel misging, en hoe we het rechtzetten
1. **De volgorde van ontwerpen sloot niet aan op de code.** De sterke lagen (3, 4, 5) waren nooit beschreven, en de zwakke (1, 2) werden het eerst uitgediept.
2. **Laag 1 werd breed in plaats van verbonden.** Een systeem zonder gevolgen is een spreadsheet. Eerst **koppelen**, dan pas verder **verdiepen**.
3. **Het ontwerp sprong vóór de wereld uit.** De keuze voor een vierde divisie botst met de twee divisies in de code.

**Voorstel voor de werkwijze vanaf nu:**
- **Per laag een vaste definitie van klaar:** ontwerp → code → gekoppeld → speelbaar.
- **Een laag gaat pas naar de volgende stap als hij in de verhaalstructuur zichtbaar doorwerkt.**
- **Eerst** de ontbrekende laagdocumenten voor 3, 4 en 5, als beschrijving van wat er is (half werk, weinig nieuw ontwerp).
- **Dan** laag 1 koppelen aan laag 4 en 5:
  - gebouwen merkbaar in blessures, jeugd, scouting en thuisvoordeel;
  - gebouwen en prijzen merkbaar in de stemming van de leden.
- **Pas daarna** laag 2 afmaken: sponsors, bank en licentie.
