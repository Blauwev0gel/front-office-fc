# Northmarch — de spellus (ontwerpdocument)

*Status: voorstel van Claude als game developer, 2026-11-25. Ter goedkeuring door de eigenaar. Punten met ❓ beslist de eigenaar.*
*Bronnen: `BIBLE.md` en `summer2.js` (The Front Office, branch `claude-game`), `standalone-research/CONCEPT-VOORZITTER` + `FAMILIE-VOORZITTER`, `docs/layers/*`, de huidige code op `slimline-main`.*

## 1. De fantasie in één zin
Je bent de gekozen voorzitter van een ledenclub in een wereld die zonder jou doordraait. Je mensen runnen de club; jij kiest richting, vindt talent, sluit afspraken en draagt de gevolgen, seizoen na seizoen en generatie na generatie.

## 2. Pijlers (toets voor elke feature)
1. **Indirecte invloed.** Je stelt nooit op en onderhandelt niet. Je zet kaders, kiest mensen, vindt spelers, belooft en beslist bij escalaties (D5, D-L3-2b, D-S1).
2. **De wereld leeft.** Rivalen kopen, verkopen, ontslaan en stijgen, ook zonder jou. Elke week is er nieuws dat niet over jou gaat.
3. **Spelers zijn het hart.** Talent vinden, opleiden, zien groeien en (duur) verkopen is de motor van plezier en van geld.
4. **Elke keuze heeft een prijs en een terugkoppeling.** Geen optie die alles beter maakt. Wat je besloot, komt terug in cijfers en in de krant.
5. **Weinig herhaling.** Variatie komt uit de wereld en de mensen, niet uit meer knoppen.
6. **Kort per week, diep wie wil.** Een week is 30–90 seconden; verdieping is vrijwillig.

Het spel is **niet**: een goedkeuringsspel, een spreadsheet, een stamboomscherm, of een kopie van FM.

## 3. Drie tijdschalen
| Schaal | Duur | Wat de speler doet | Beloning |
|---|---|---|---|
| **Week** | 30–90 s | Ziet wat er speelt, kiest waar hij zijn week aan besteedt, beslist hooguit één escalatie, beleeft de wedstrijd | Een uitslag, een vondst, een gevolg van een eerdere keuze |
| **Seizoen** | 30 weken + zomer + winter | Zomer met brief en ticker, manifest, winterstop, ALV | Een eindpositie, beloftes gehouden of gebroken, spelers die doorbraken |
| **Carrière / dynastie** | Tientallen seizoenen | Reputatie, clubboek, familie, opvolging, legendes uit eigen academie | Een eigen geschiedenis: "Grandfather built the academy; Morgan sold its best boy for a record" |

## 3b. De rode draad en de lagen
**De rode draad is de jaarlijkse stemming.** Je bent gekozen; elk seizoen eindigt met een ALV waar de leden over je stemmen (D6). Verlies je, dan ben je weg bij deze club en neem je je reputatie mee naar een volgende (D7). Alles in de lus voedt die stemming via het bestaande ledenvertrouwen, niet via nieuwe meters:
- prestaties tegenover de verwachting, promotie en degradatie;
- je manifest: gehouden en gebroken beloftes (bold weegt zwaarder);
- prijzen, schuld, grondverkoop, naamrecht;
- eigen jeugd in het eerste, een ster verkocht of behouden;
- familiezaken: favoritisme, nepotisme, de opvolger die zich kandidaat stelt.

**De lagen blijven de bouwvolgorde en de architectuur.** Elke laag is een module die op de laag eronder bouwt en zonder de laag erboven werkt (`docs/LAYER_CONTRACT.md`).
| Laag | Wat het in de lus doet | Staat nu |
|---|---|---|
| **L1 Wereld** | De wereld draait vanzelf: wedstrijden, rivalen, transfers, buitenland | Gevalideerd |
| **L2 Clubmanagement** | Afdelingen, stadion, geld, sponsors, leden en ALV als stemming | Speelbaar; economie nog niet in balans |
| **L2.5 Cluborganisatie** | Werving, jeugdcyclus, staf die het dagelijkse zelf doet | Getest |
| **L3 Autonomie** | Mandaten, escalaties (D-L3-2b), de directeur als persoon met verantwoording: zomerbrief, ticker, debrief | Deels; M1 bouwt de kern |
| **L4 Bestuur en politiek** | Ledengroepen, oppositie, moties, tegenkandidaat; de ALV als gespeeld moment met toespraak en telling per groep | Ontwerp (referentie: `voorzitter/northmarch.html`) |
| **L5 Dynastie** | Familie, erfgenaam die zelf gekozen moet worden, reputatie, clubboek, legendes | Eerste slice staat |

## 4. Het seizoensritme
| Fase | Weken | Inhoud |
|---|---|---|
| **Zomer** | 4 pre-season-weken | Zomervergadering → zomerbrief → ticker (de markt live) → deadline day → zomereditie van de krant |
| **Seizoensstart** | — | Manifest (Safe/Steady/Bold) en debrief van de zomer |
| **Opening** | 1–7 | Eerste indruk; nieuwe spelers vallen in of niet |
| **Herfst** | 8–14 | Vorm, blessures, eerste momenten |
| **Winterstop** | 15–16 | Korte window op dezelfde machinerie als de zomer (2 weken ticker) |
| **Run-in** | 17–26 | Titelstrijd of degradatie, contracten die aflopen |
| **Finale** | 27–30 | Elke wedstrijd telt; tegenkandidaat dient zich aan bij onvrede |
| **ALV** | na 30 | Jaarverslag, beloftes, stemming; familie-opvolging; zomer begint opnieuw |

## 5. De week (de kern)
Eén scherm, van boven naar beneden, in deze volgorde:
1. **Het onderwerp van de week** (één regel): derby, deadline, blessurecrisis, titelduel. Komt uit de wereld.
2. **Escalatie of moment** (hooguit één, niet elke week): alleen wat van de voorzitter is. Bod op een top-3-speler, recordaankoop, familiemoment, iemand van je staf die iets wil, de oppositie die zich roert. Altijd met een standaard als je zwijgt.
3. **Jouw week**: waar besteed je je tijd? Eén keuze: scoutingreis, jeugdtoernooi, data-dag, bezoek aan een partnerclub, sponsor ontvangen, een gesprek met een stafhoofd, of op de club. Elke keuze levert iets concreets op dat je later terugziet.
4. **De wedstrijd**: inzet vooraf ("win en je staat vierde"), uitslag, wat het betekent.
5. **Weekafsluiting** (achter één tik): wat de staf deed, transfers, "Looking back" (een besluit van weken geleden en wat het opleverde), wereldnieuws.

Ontwerpregels: maximaal één beslissing die je moet nemen per week; nooit een lege week zonder nieuws; elk getal dat je ziet heeft een woord erbij.

## 6. De transferzomer (eerste mijlpaal) — naar `summer2`, voor een voorzitter
1. **Zomervergadering** (één scherm, drie onderwerpen): de staat van de selectie (sterkste/zwakste linies, aflopende contracten), het geld (budget, loonruimte, wat verkoop oplevert), de behoeften. De directeur stelt een plan voor en heeft een eigen neiging (gewaagd/voorzichtig) uit zijn profiel.
2. **De zomerbrief**: jij kiest maximaal **drie doelen** (bv. "een spits onder £60k", "geen top-3-speler verkopen", "twee jongens uit eigen jeugd in de selectie"), het profiel (Youth/Experience/Value/Balanced) en het budget. Hij tekent. De brief bevriest doelnamen voor de afrekening.
3. **De ticker** (4 pre-season-weken + deadline day): elke week een reeks regels in tijdsvolgorde, zoals een nieuwsfeed: bod, tegenbod, akkoord, kaping, geruchten over jouw spelers, deals van rivalen, vrije spelers die tekenen. Ook zonder budget gebeurt er iets: de directeur verkoopt overbodige spelers, zoekt transfervrije opties, of meldt dat hij niets kan ("Without money I can only look at free agents").
4. **Jouw rol tijdens de ticker**: geld vrijmaken (lening, verkoop toestaan), prioriteit verleggen, aanbevelen uit je dossier, op reis, en de twee escalaties (bod op top-3, recordfee).
5. **Zomereditie van de Echo**: de kop van de zomer, in- en uitgaand, wat rivalen deden.
6. **Debrief** (na week 4 van het seizoen): per doel uit de brief gehaald of niet, met de spelers erbij; vertrouwen in de directeur stijgt of daalt; bij herhaald falen kun je hem vervangen.
7. **Winterstop**: dezelfde machinerie in 2 weken, met een kortere brief (één doel).

## 7. Spelers, scouting en Moneyball (de motor)
- **Je dossier** vult zich door je weekkeuzes (reizen, toernooien, data). Elke vondst heeft een schatting met twijfel; betere scouts = minder twijfel.
- **Aanbevelen** zet een speler bovenaan bij de directeur (+gewicht); hij beslist en zegt waarom niet.
- **Volgen**: elke vondst en elke eigen jeugdspeler heeft een lijn: kwaliteit, waarde, club. Rivalen kapen je parels; dat komt in de krant.
- **Moneyball-bord**: gekocht/verkocht, winst per speler, hit rate, beste vondst. Een clubfilosofie (Kweekvijver / Doorverkoop / Data / Ambitie) ❓ bepaalt waar de leden je op beoordelen.
- **Regio's en partnerclubs** gaan open met reputatie en netwerk; een regio raakt leeggevist.
- **Academie**: toernooi → uitnodiging → instroom → doorbraak → legende of recordverkoop. De familie kan hier een eigen kind in hebben.

## 8. Mensen, momenten en de familie
- **Stafhoofden** (directeur, trainer, hoofdscout, academie, commercie) zijn personen met twee eigenschappen en een neiging. Ze voeren uit binnen mandaat en komen met escalaties.
- **Momenten** (±5 per seizoen): uit de wereld getriggerd (trainer wankelt, ster wil weg, oppositie verzamelt handtekeningen, investeerder, familiezaak). Elk moment eindigt in een **afspraak** of een zichtbare "geen afspraak": *You give · They give · Tested · If it fails*.
- **Familie** (L5): jij, partner, kinderen die opgroeien en eigenschappen erven; opvolging via de ALV; het dynastieboek.
- **Bestuurslaag** (L4, later): ledengroepen, moties, tegenkandidaat.

## 9. De economie moet de keuzes dragen
Zonder deze voorwaarden werkt geen enkele lus; dit is geen bijzaak.
- Een gemiddelde club heeft elke zomer **ruimte voor 2–4 deals** (budget > 0 bij normaal beleid). Nu kan het budget op £0 staan doordat de reserve alles opeet: dat maakt de zomer leeg.
- **Geld moet sport kopen, met verval**: een betere selectie geeft merkbaar meer punten; investeren in een afdeling verdient zich terug binnen 1–3 seizoenen of niet, zichtbaar.
- **Verkopen is een echte inkomstenbron**: een opgeleide speler die doorbreekt, levert een fee die een seizoen verschil maakt.
- **De onderste divisies overleven** met verstandig beleid; roekeloos investeren gaat mis; stilzitten stagneert.
- Metingen hiervoor doet ChatGPT (bestaande scripts `tests/balance-*.js`); Claude past alleen knoppen aan en legt ze vast.

## 10. Wat we overnemen, aanpassen en weggooien
| Onderdeel | Herkomst | Besluit |
|---|---|---|
| Zomervergadering, brief, ticker, debrief | `summer2.js` (claude-game) | **Overnemen**, herschreven op de Northmarch-engine en voor een voorzitter |
| Rode map / escalaties, second opinion | BIBLE §5.2 | **Overnemen** als "één escalatie per week" |
| "Looking back" in de krant | BIBLE B24 | **Overnemen** |
| Manifest, afspraken, momenten | Voorzitter-concept | Manifest staat; afspraken en momenten **bouwen** |
| Familie, opvolging | FAMILIE-VOORZITTER | Eerste slice staat; uitbreiden met momenten |
| Scouting-week, dossier, Moneyball | huidige code | **Houden**, uitbreiden (partnerclubs, filosofie) |
| Pre-season transferbord (huidige `club/window.js`) | huidige code | **Vervangen** door de ticker uit §6 |
| V17–V18.7 UI-lagen (`ui/ext-*.js`) | V19 | **Opruimen** zodra de nieuwe schermen alles dekken |
| Persconferentie (beloftes) | BIBLE §5.1 | ❓ samenvoegen met het manifest of apart |

## 11. Mijlpalen en toetsing
| # | Mijlpaal | Klaar als |
|---|---|---|
| M1 ✅ (2026-11-25) | **Transferzomer** (§6) + economie zodat er 2–4 deals mogelijk zijn | Een speler beleeft de zomer als verhaal; elke pre-season-week heeft minstens 4 tickerregels; debrief rekent af op de brief |
| M2 ✅ (2026-11-25) | **Weekstructuur** (§5): onderwerp, één escalatie, jouw week, inzet, afsluiting met Looking back | Geen lege week in 10 gespeelde weken; elke week één echte keuze |
| M3 ✅ (2026-11-25) | **Momenten en afspraken** (§8) incl. familiemomenten in hetzelfde systeem | ±5 momenten per seizoen, elk met zichtbaar gevolg |
| M3b ✅ (2026-11-25) | **De ALV als gespeeld moment** (begin L4): jaarverslag, je beloftes, een korte toespraak met keuzes, telling per ledengroep, opvolging van de familie | De stemming voelt als de climax van elk seizoen |
| M4 | **Winterstop** op de zomermachinerie | — |
| M5 | **Partnerclubs, filosofie, rivaliteit om spelers** | — |
| M6 | **Bestuurslaag**: ledengroepen, moties, tegenkandidaat | — |

Elke mijlpaal: Claude speelt hem zelf als speler door (390 px, licht/donker) en toetst aan deze pagina; ChatGPT test balans en regressie; de eigenaar speelt en zegt of hij "de volgende week wil spelen".

## 12. Open punten voor de eigenaar ❓
1. Clubfilosofie: ja/nee, en welke vier?
2. Persconferentie: apart moment of opgaan in het manifest?
3. Mag de voorzitter de directeur ontslaan na een slechte debrief (bestaat al als `SackStaff`), of alleen na twee slechte zomers?
4. Seizoenslengte: blijft 30 weken + 4 pre-season-weken, of naar 34 zoals The Front Office?
