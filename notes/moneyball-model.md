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
