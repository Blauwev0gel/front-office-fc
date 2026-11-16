# Moneyball-model (werkversie, 16-11-2026) — ontwerp, nog niet gebouwd

Besluiten van de eigenaar staan in `BIBLE.md` (B38, B39). Dit is een voorstel voor het model, in fases te bouwen.

## Het probleem dat het oplost
Nu zit alle kwaliteit van een speler in één getal (CA, uit 14 attributen per positie) en de prijs is een functie van CA, leeftijd en PA (`upd()` in `src/engine/03-players.js`). Voor de teamsterkte telt alleen CA, een beetje positie-fit en de coach op teamniveau. Daardoor valt er in een wereld vol spelers niets te ontdekken: de beste zijn ook de duurste.

## De vier lagen
- **A. Prijs (zichtbaar):** CA, leeftijd, contract, zoals nu. Nieuw: de prijs volgt de *waargenomen* CA, niet de echte.
- **B. Profiel en fit (met data te zien):** zes profieltekens afgeleid uit de attributen (geen nieuwe opgeslagen state): aerial, engine/druk, spelopbouw, dragen/1-tegen-1, doelbedreiging, defensieve stevigheid. De vier stijlen (`possession`, `counter`, `pressing`, `direct`) waarderen elk een deel daarvan. Fit van de selectie met de stijl van je coach geeft de teamsterkte maximaal ±0,6 (ter vergelijking: coach zwak tot sterk ≈ 1,1; voordeel van de speler ≈ +0,6). De prijs negeert fit.
- **C. Karakter (met tijd en scouts te zien):** persoonlijkheid (professionaliteit, loyaliteit, temperament, ambitie, al aanwezig) en blessuregevoeligheid (nieuw, verborgen) bepalen ontwikkeling, discipline en kleedkamer. Onzeker tot scouts hem kennen.
- **D. Context (markt en tijd):** aflopend contract, verkopende club in geldnood, tijdelijke vormdip. Het verschil tussen prijs en waarde voor jou is de "aha".

## Het mechanisme: statistiek tegenover reputatie
- Elke speler heeft per seizoen een **kernstatistiek per positie** (spitsen: doelpunten; vleugel en nummer 10: doelpunten + assists; middenvelders: assists en rating; verdedigers: rating en clean sheets; keepers: clean sheets) die uit onderliggende kwaliteit (xG, xA, duels) plus **toeval** bestaat. Toeval neemt af met meer minuten (spreiding ∝ 1/√minuten).
- De markt leest die kernstatistiek mee: `waargenomen CA = CA + k × (kernstatistiek − verwachting)`, met **k = 0,35 CA per standaardeenheid** (keuze: "middel").
- Rekensom (5000 spitsen, geen spelcode): bij k = 0,35 is ±21% van de spitsen ≥20% te goedkoop en ±20% ≥25% te duur; de mediane misprijzing is 18%. Bij maar 12 wedstrijden vallen die cijfers terug naar 6% en 10%: een steekproefgrootte-les komt vanzelf. De sterkte van k is een ontwerpkeuze, geen meting.

## Wat de speler ziet en doet
- **Portaal:** profielkaart per speler met een paar kernwaarden en percentielen; met één tik de **volledige tabel** (alle attributen en statistieken, sorteerbaar, vaste naamkolom, kolomsets). Opt-in diepte, past bij P5 en "geen spreadsheet-sim" doordat de standaard een kaart is.
- **Flaggen:** een flag is een briefing aan de DoF en scouts, geen koop (B1).
- **DoF-reactie (P7):** hij geeft een mening, soms een eigen alternatief, en kan overtuigen of tegenspreken; afhankelijk van zijn eigenschappen (ego, risico, stijl).
- **Scouts bevestigen:** cijfers zijn vrij en ruisig. Scouts onthullen (1) hoeveel van de cijfers geluk is (geluk tegenover vaardigheid) en (2) karakter en potentieel. Dat kost scoutcapaciteit en tijd.
- **Selectiepuzzel:** vorm en stijl. De selectie mist altijd een soort speler; fit met het systeem is het sturende getal. Het kaderplan (winter = acute gaten, zomer = opvolging) is de eerste plek waar de puzzel zichtbaar wordt.

## Wereld en schaal
- Een seeded wereld (speler = f(wereldseed, id), alleen wijzigingen opgeslagen) mag, na een klein prototype (B38). Een opgeslagen wereld past niet: ±770 bytes per speler, dus 10.000 spelers ≈ 7,5 MB en een save is nu ±330 KB.
- Seizoensstatistieken worden deterministisch gegenereerd uit (seed, id, seizoen), met toeval, en niet bewaard.

## Bouwvolgorde (elke plak afgerond en testbaar)
1. Model en statistiekgeneratie in de engine, zonder UI, met tests (kernstatistiek, toeval, waargenomen CA, fit).
2. Portaal, alleen lezen, op de bestaande ±314 spelers: profielkaart en volledige tabel.
3. Flaggen en DoF-reactie.
4. Scouts bevestigen (geluk tegenover vaardigheid, karakter).
5. Seeded wereld: opschalen, met meting van generatietijd en save-omvang op een telefoonbudget.
6. De selectiepuzzel zichtbaar in het kaderplan.
Fasering van de vier soorten vondsten: statistiek tegenover reputatie en fit eerst; karakter via scouts; markt en timing via het bestaande kalenderwerk.

## Open
- Kernstatistiek en verwachting per positie vastleggen (vooral verdedigers en keepers).
- Hoe fit eruitziet voor spelers zonder duidelijk profiel.
- Hoe sterk de prijs op leeftijd en contract reageert naast de waargenomen CA.
- Prototype van de portaalweergave (390 px, licht en donker) voordat we engine werk beginnen.

## Prototype (16-11-2026)
`notes/prototypes/scouting-portal.html`: klikbaar, 390 px, licht en donker, 48 nepspelers uit dit model. Privé artifact: https://claude.ai/artifact/LhhXBnHrCPJb4WjrQpaT63
Geleerd bij het bouwen:
- De fit van één speler mag maar een klein deel van het ±0,6 teameffect zijn (≈ fit × 0,055 per speler), anders ontstaan absurde waardes (+150%). In het prototype: fitscore −100..+100, waarde = prijs(CA + 0,4 × fit).
- Marktfout in de prototypeverdeling: 0,7 CA per standaardeenheid van de kernstatistiek (lager dan de eerste rekensom, omdat contract, geldnood en schattingsruis er bovenop komen). Dan lijken ±31% van de spelers ≥20% goedkoop (onbevestigd), 2 van 48 ≥50%.
- Aflopend contract is een kleine korting (×0,8), geen ×0,6: de speler vertrekt in juni gratis, dus zijn "te goedkoop" is geen vondst.
- Het prototype bevat geen keepers en nog geen persoonlijkheid, blessurehistorie of potentieel in de verdeling.

## Principe (eigenaar, 16-11-2026): de portal geeft nooit een oordeel
Prototype v1 zei zelf "Looks +79% cheap", "Worth £600k to us" en liet de DoF zeggen dat de prijs in ons voordeel klopte. Dat is een aanbevelingsfilter, geen data-spel. Regel: **de portal toont data en feiten; wat goedkoop is, ontdekt de speler zelf.**
- Geen waarde- of fit-tags, geen "worth", geen sortering op waarde. Wel neutrale metrics als kolom of sortering (output, verwacht, verschil, per £100k, minuten).
- De speler flagt met een eigen **hypothese** ("onfortuinlijke afmaker", "geluksjaar", "past bij onze druk", "late bloeier", "aflopend contract").
- **Scouts testen de hypothese** achteraf: ze geven een getal (verwacht, karakter, potentieel) en de speler ziet of hij gelijk had. Geen voordeel vooraf.
- **De DoF is geen orakel:** hij reageert vanuit zijn eigen voorkeur (voorzichtig, wil minuten en betrouwbaarheid), met eigen vooroordelen, en kan ernaast zitten. Zijn eigen alternatief is "wat hij zou kiezen", niet "wat beter is".
- De gratis cijfers zijn ruisig: de speler kan zich vergissen, en dat is het spel.

## Prototype v3 (16-11-2026): de lus sluit
Toegevoegd na "dit is leuk, een soort terminal": **langetermijnterugkoppeling**.
- Flag met hypothese, maak een speler target, open het **zomerraam** (de DoF tekent wat je budget toelaat), speel een **seizoen** (de wereld loopt door, de ontwikkeling en de statistiek worden opnieuw gegenereerd, en je signings spelen).
- Tabblad **Bets**: per signing wat je betaalde, wat de markt nu vraagt, hoe zijn seizoen liep (output tegenover wat de scouts verwachtten), en of je lezing wordt ondersteund door de uitkomst. Alleen feiten; of je gelijk had volgt uit de cijfers.
- Geleerd: een verkeerde lezing kan toch winst opleveren door geluk (of juist niet). Dat verschil tussen *goed gelezen* en *goed uitgepakt* is de kern van het spel.
- Bug onderweg: de helpers `fitS` en `teamFx` waren bij de herbouw naar v2 weggevallen; de test met de volledige lus vond het.
Nog niet in het prototype: opgeslagen filters, spelers vergelijken, een zoekregel (de eigenaar koos alleen de langetermijnterugkoppeling), keepers, persoonlijkheid in de prijs.

## Prototype v4 (16-11-2026): echte velden, simpele terminal
Eigenaar: de gegevens moeten gelijk zijn aan wat het spel heeft; een speler moet een FM-lijst van statistieken tonen en daaronder Moneyball-statistieken in FotMob-stijl; de terminal moet simpeler: gewoon statistieken per competitie, geen filter op waarden, wel op competitie en leeftijd.
- **Velden zijn die van het spel** (`src/engine/03-players.js`): 14 attributen (fin, pas, dri, cro, tac, mar, hea, pac, sta, str, vis, com, han, ref), 12 seizoensstatistieken (`apps, mins, g, a, xg, xa, prg, dw, dt, rat, yc, rc`), vier persoonlijkheidsscores (prof, loy, temp, amb), leeftijd, contract, loon, CA en PA. Verzonnen velden uit v1 tot v3 (profieltekens als "Build-up", "Injury risk") zijn weg. Geen blessuregevoeligheid: het spel heeft die niet.
- **Profiel:** bovenaan de FM-lijst (attributen per groep, scoutschatting ±1 tot de scouts bevestigen, persoonlijkheid onbekend tot bevestigd), daaronder FotMob-stijl seizoensstatistieken met percentielbalken tegen spelers op dezelfde positie in dezelfde competitie. Balken zijn neutraal (geen groen of rood): een percentiel is een feit, geen oordeel.
- **Terminal:** tabblad Leagues met een competitiekeuze (acht divisies + zes regio's), leeftijdschips en Totals/Per 90. Geen filter op waarden; sorteren op een kolomkop mag. Verder alleen Flags en Bets.
- **Seeded wereld, bewezen in klein:** elke competitie (18 clubs, 360 spelers) wordt op aanvraag uit zijn naam gegenereerd in ±35 ms in de browser; er wordt niets opgeslagen. Dit is een eerste aanwijzing voor B38 (seeded wereld), nog geen meting op een telefoon.
- Lus (hypothese, scouts, zomerraam, seizoen, Bets) ongewijzigd uit v3.

## Prototype v5 (16-11-2026): stats per positie, positiefilter, doorklikken
- **Stats volgen de positie.** Profiel en tabelkolommen kiezen volgorde en groepen per positie: aanvallers Scoring eerst, vleugels en middenvelders Creating eerst, verdedigers en DM Defending (duels) eerst, keepers alleen wat het spel bijhoudt. Zelfde 12 velden; alleen de weergave verschilt.
- **Positie is een filter** naast competitie en leeftijd; de kolommen veranderen mee (bijv. CB: duels, duelpercentage, progressieve acties, kaarten).
- **Doorklikken:** tik op een statistiek voor de verdeling (histogram, hij in rood), de top van de competitie op die positie, zijn rang en zijn eerdere seizoenen; tik op de club voor de selectie; tik op een speler in een lijst om hem te openen. Een loopbaantabel toont eerdere seizoenen (twee worden mee gegenereerd, elk gespeeld seizoen komt erbij). Terug-knop door meerdere niveaus.
- **Beperking, voor de eerste engine-plak:** het spel houdt maar 12 statistieken bij. Voor keepers en verdedigers is dat dun (geen reddingen, clean sheets, tackles, onderscheppingen, clearances; voor aanvallers geen schoten of schoten op doel; voor middenvelders geen key passes). Meer diepte per positie vraagt dat de wedstrijdsim deze tellers gaat bijhouden. Beslissing voor de eigenaar, niet gedaan.

## Implementatiestand (16-11-2026)
- **Plak 1 (af):** negen nieuwe tellers per speler in de wedstrijdsim (`src/engine/06-match.js`, `newStats` in `03-players.js`): schoten, schoten op doel, key passes, tackles, onderscheppingen, clearances, reddingen, clean sheets, tegengoals. Afgeleid zoals de bestaande progressieve acties en duels. Oude saves blijven werken (`|| 0`). `test/stats.js` meet per-90-waarden per positie (bijv. keeper ±3,5 reddingen, spits ±2,9 schoten, CB ±3,6 clearances).
- **Plak 2 (af):** `src/world.js`, de seeded wereld. 14 competities (8 divisies met de echte clubs van het spel, 6 regio's), ±5000 spelers in ±1,2 s, 21 statistieken, geschiedenis, een eigen RNG (het spel-RNG blijft onaangeroerd), alleen `G.world` wordt opgeslagen (weggehaalde spelers, flags, scoutkennis). Onze eigen selectie toont de echte spelers. `test/world.js`.
- **Plak 3a (af):** het scherm, `src/ui/08b-portal.js` en `src/style/08-portal.css`: ingang op Recruitment Overview, tabel per competitie (competitie, positie, leeftijd, Totals/Per 90, vorig en dit seizoen), profiel met FM-attributen en positie-bewuste statistieken, doorklikken (statistiek, club), flaggen met een reden, scoutbevestiging (3 slots per week met een Chief Scout, anders 1), DoF-reactie. Opgeslagen in `G.world`.
- **Plak 3b (nog te doen):** een target maken zet de speler in de bestaande pool en pipeline (DoF, onderhandelingen, mandaat, transferregels); `worldRemove` bij tekenen; en het tabblad **Bets** (terugkoppeling per getekende speler na een seizoen).
- Bekende vereenvoudigingen: scoutbevestiging staat nog los van de bestaande scoutrapporten (`G.rec.know`); de marktfout zit in `ask` (waargenomen kwaliteit, B39) en is nog niet gekalibreerd tegen het echte transfermodel; wedstrijdsim en wereld delen per-90-tarieven maar niet dezelfde code.
