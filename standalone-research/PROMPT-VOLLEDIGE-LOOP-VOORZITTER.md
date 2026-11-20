# Prompt: de volledige loop van De Voorzitter als een echt spel

*Voor Claude als game developer en voetbalexpert. Branch `voorzitter-fundering`, standalone-spoor. Opgesteld 21-11-2026.*

**Bouwt op:** `HOOK-LOOP-VOORZITTER.md` (keuze 71 en 72). Lees ook `CONCEPT-VOORZITTER-2026-11-18.md` §13 en `LEESWIJZER-VOORZITTER.md`.

---

## De opdracht
Ontwerp en bouw één samenhangende loop waarin elke minuut spelen een beslissing, een gevolg en een reden om door te gaan heeft. Van de eerste kaart tot de vijfde club.

**Het spel moet de toets doorstaan:** *"Na tien minuten weet ik wat ik probeer te bereiken, zie ik bij elke keuze wat die doet, en wil ik nog één week spelen."*

## Wat het onderzoek ons leert

| Bron | Wat het doet | Les voor ons |
|---|---|---|
| **38-0 / 82-0** | Eén onmogelijk getal, een korte run, een uitslag | **Eén getal is de hook.** Bij ons: de ledensteun in %. |
| **Reigns** | Swipen, vier meters zichtbaar, een regeerperiode duurt minuten, falen is de inhoud | **Elk antwoord laat meteen iets bewegen.** Voorvertoning met iconen, falen als hoogtepunt. |
| **Retro Bowl** (New Star Games, #1 in de VS) | Snel, simpele bediening, management onder de oppervlakte, elk seizoen anders, geen microtransacties | **Korte sessies, diepte eronder**, je eigen verhaal over seizoenen heen. |
| **New Star Manager** | "Een vrolijke, losse benadering in plaats van een simulatie". Tussen wedstrijden voelt het als een kaartspel. | **Kaarten in plaats van menu's.** Plezier boven realisme. |
| **Football Manager** (touchline shouts) | Shouts hooguit om de 10 minuten, simpele commando's. Ratings meestal 6–8. | **Ingrijpen moet schaars en simpel zijn**, en stats moeten leesbaar zijn. |
| **Motorsport Manager** | De nadruk ligt op de race zelf. Coureurs geven feedback en stellen eisen die je kunt negeren. | **De wedstrijd is het spannende moment.** De trainer antwoordt en kan eisen stellen. |
| **The Chairman** (Steam 2026) | Next of Auto, na elke wedstrijd één regel waarom, staf-rapporten halverwege en aan het eind | **Tempo in handen van de speler**, en een uitleg na elke uitslag. |
| **Football Boardroom** (Steam 2026) | Elke week een beslissing, een achtergrond bij de start, twee ingrepen per wedstrijd | Bevestigt ons concept. **Breedte zonder hook is de valkuil.** |
| **Club Soccer Director** | Recensenten vinden het saai: geld bepaalt alles, en je voelt weinig invloed | **Invloed moet voelbaar zijn**, en geld mag niet alles oplossen. |
| **Hades** | Elke mislukte run laat iets achter, en je kijkt uit naar de volgende poging | **Falen moet iets opleveren.** Bij ons: reputatie, records en mensen die je meenemen. |
| **Balatro** | Weinig systemen, maximaal uitgediept. Een vaste opbouw per run. | **Minder systemen, dieper.** Schrappen hoort bij het ontwerp. |
| **Loop-theorie** (Game Developer, GameAnalytics, Roblox) | Drie lussen tegelijk: kort, middellang en lang. Kortetermijnbeloning houdt alleen niet vast. | **Drie tijdslagen** die elkaar voeden: de week, het seizoen, de carrière. |

## Ontwerpprincipes (bindend voor dit werk)
1. **Eén getal.** De ledensteun in % is de score én je leven. Altijd in beeld, met een pijl.
2. **Elke handeling beweegt iets zichtbaar.** Er bestaat geen keuze zonder direct gevolg op steun, groep, kas, kleedkamer of een persoon.
3. **Geen gratis keuzes.** Elke optie laat iets stijgen en iets anders dalen. Een kaart negeren is ook een keuze, en die escaleert.
4. **Schaarste zonder nieuwe valuta.** De schaarste zit in wat er al is:
   - het aantal kaarten per week (2–4);
   - de sms'jes per wedstrijd (2);
   - **het geduld van de trainer** (zijn loyaliteit, die daalt bij te veel bemoeienis);
   - geld.
5. **Drie tijdslagen** voeden elkaar:
   - de **week** (45–75 s): de korte kick;
   - het **seizoen** (±25 min): beloftes en de ALV als eindbaas;
   - de **carrière** (open): reputatie, records en mensen die je kennen.
6. **De wedstrijd is het piekmoment.** Live, met stats en twee schaarse ingrepen via de trainer.
7. **Falen is inhoud.** Weggestemd of failliet geeft een sterk scherm met je periode in cijfers, en daarna meteen verder. Er gaat altijd iets mee: reputatie, records, mensen.
8. **Minder systemen, dieper** (Balatro). Wat niet bijdraagt aan het getal of aan de loop, gaat eruit of wordt samengevoegd.
9. **Tempo bij de speler** (The Chairman). Play week, Skip match, en *To next decision* voor een rustige periode.
10. **Plezier boven realisme** (New Star Manager). Geloofwaardig voetbal, maar snel, leesbaar en met humor.

## De volledige loop

### Laag 0: het moment (3–5 seconden)
- **Een snelle kaart:**
  - een persoon met gezicht en naam (met geheugen);
  - één zin;
  - twee keuzes, elk met iconen van wat het raakt (steun, een groep, kas, kleedkamer, een persoon);
  - na de keuze: het getal tikt mee, gezichtjes bewegen, een chip voor het effect, en hooguit één zin reactie.
- **Een sms aan de trainer tijdens de wedstrijd:**
  - de opties komen uit de live stats;
  - de trainer antwoordt binnen een seconde;
  - het effect is zichtbaar in de wedstrijd en in de steun.

### Laag 1: de week (45–75 seconden)
1. **Opening:** steun (groot) · kas · kleedkamer · stand · volgende tegenstander · "ALV over N weken" · de beloftes als balkjes.
2. **2–4 kaarten.**
   - Bronnen: leden, spelers, staf, de stad, de krant, rivalen.
   - Vervolgkaarten: een eerdere keuze komt terug (geheugen).
   - Een genegeerde kaart escaleert de week erna.
3. **De wedstrijd live (±20 s):**
   - klok, stand, momentkaarten;
   - spelersratings (meest 6–8, uitschieters zichtbaar), goals en assists, conditie;
   - **twee sms-momenten** (rust en ±70') met opties uit de stats, bijvoorbeeld "Take off X (5.1, tired)", "Get the ball to Y (8.2)", "Give the kid a chance", "Keep it tight" of "Say nothing";
   - de trainer beslist, op basis van loyaliteit, eigenschappen en eerdere bemoeienis.
4. **Uitslag:** één regel waarom, plus de beweging van de steun (de uitslag levert hooguit een derde van de wekelijkse beweging).
5. **Weekregel:** "58% → 61%: the derby win and your words for Kershaw."

### Laag 2: de maand en de mijlpalen (elke 4–6 weken)
- **Het staf-rapport** (The Chairman): TD, trainer en financieel directeur, elk in één zin met hun stand. De maandmeeting met de TD (TD-stap 3) valt hierin.
- **Grote kaarten met groot effect:**
  - de **derby**;
  - **"Sack the coach?"** na een slechte reeks;
  - het **winterwindow** (op de achtergrond, het cijfer van de Echo telt mee);
  - de **beker**;
  - een **geldcrisis**;
  - een **ultimatum** van een ledengroep.
- **Een tussenstand van de beloftes:** "On track / Behind". Een gebroken belofte kost steun op het moment dat ze breekt.

### Laag 3: het seizoen (±25 minuten)
1. **De zomer:**
   - de speech met beloftes (die zichtbare doelen worden);
   - de zomervergadering met het mandaat (❓ vraag 1: compacter?);
   - de TD aannemen of beoordelen;
   - de transferzomer (kijken; het cijfer van de krant beweegt de steun).
2. **30 weken** (laag 1 en 2).
3. **De ALV als eindbaasgevecht:**
   - rapport, beloftes afgerekend;
   - moties en je verdediging (enkele procenten);
   - de stemming: onder 50% ben je weggestemd.
4. **De seizoenskaart:** eindstand, beste en slechtste moment, de steun als grafiek door het jaar, en wie je vrienden en vijanden werden.

### Laag 4: de carrière (open)
- **Start:** een van drie achtergronden (*Local lad made good*, *City money*, *Former player*) en de opening (keuze 69).
- **Einde bij een club:** weggestemd, failliet, of de staf loopt weg (de vier faalvormen, keuze 56). Daarna volgt het scherm *"Voted out after 4 seasons · 47%"*.
- **Wat er meegaat** (de les van Hades):
  - **reputatie**, die bepaalt welke clubs je benaderen (zwaardere clubs bij een goede naam);
  - **records**: langste periode, hoogste ALV, promoties, trofeeën;
  - **mensen**: een trainer, TD of supportersleider die je vertrouwde, kan je bij een volgende club volgen of tegenwerken.
- **De carrièrekaart** groeit met elke club. Geen seeds en geen delen (keuze 72).

## Faalvormen en spanning (de vier wijzers)
| Wijzer | Te laag | Gevolg |
|---|---|---|
| **Steun** | Onder 50% bij de ALV | Weggestemd |
| **Kas** | Onder nul en de bank zegt nee | Failliet, overname, einde |
| **Kleedkamer** | Lange tijd laag | De trainer stapt op, spelers willen weg |
| **Resultaten** | Laatste drie | Degradatie: een grote klap in de steun |

**Doel voor de spanning:** in elk seizoen staat minstens één wijzer een keer in de gevarenzone.

## Balans (meetbaar)
- **De actieve bot** wint 60–75% van de ALV's, **de willekeurige** 25–40%, **de passieve** minder dan 15%.
- **Steunbeweging per week:** gemiddeld 0–6 procentpunt, met af en toe een piek van 8–12 bij een groot moment.
- **Sms'jes:** een trainer met hoge loyaliteit volgt je ongeveer 75% van de tijd, met lage loyaliteit ongeveer 30%. Een opgevolgde sms helpt, maar niet altijd.
- **Geld lost niet alles op** (de les van Club Soccer Director). Een rijke club heeft hogere verwachtingen van de leden.
- **Tijd:** een week duurt 45–75 s, een seizoen 20–30 min, de opening 3–5 min.

## Inhoud (wat er nodig is)
- **Kaarten:**
  - minstens 80 sjablonen in 8 bronnen;
  - elk met variabele delen (namen, bedragen, tegenstander);
  - 30% met een vervolgkaart;
  - geen herhaling binnen twee seizoenen (de bestaande `feedUsed`-logica).
- **Sms-opties:** 10–12 types, afgeleid van stats (vermoeid, uitblinker, jeugdspeler, voorsprong, achterstand, rode kaart).
- **Weekregels en uitslagregels:** minstens 40 varianten.
- **Mijlpalen:** derby, ontslag, crisis, beker, ultimatum, transferkrant, ALV.

## Wat er verandert aan het bestaande spel
| Bestaand | Straks |
|---|---|
| Feed met reacties | De feed blijft om te lezen. Reacties gaan op in de kaarten. |
| *In the post*: lange situaties | Snelle kaarten. Grote situaties worden mijlpalen. |
| Uitslag met momenten | Een live wedstrijd met stats en twee sms'jes. |
| Loyaliteit en stemming onzichtbaar | Altijd zichtbaar via de wijzers en gezichtjes, met +/− na elke keuze. |
| Weggestemd = einde van de club | Seizoenskaart, carrièrekaart en meteen verder met nieuwe dossiers. |
| Upgradeboom (keuze 57) | Blijft geparkeerd. Pas toevoegen als de loop staat. |

**Bestaande systemen die we hergebruiken:**
- `weighted()` voor de steun;
- de groepen en `grp()`;
- `loy()` en het geheugen;
- `simRound` en de `matchMoments` voor de wedstrijd;
- de beloftes en `evalP`;
- de ALV;
- de transferzomer;
- de opening.

## Werkwijze in fasen (sla geen fase over)
1. **Fase A, papieren proef:** de eigenaar speelt vier weken en één mijlpaal interactief; Claude speelt de wereld.
   - Meet: voelt elke keuze als iets? Wordt de wedstrijd spannend? Hoe lang duurt een week?
2. **Fase B, templates:**
   - het weekscherm met de vier wijzers;
   - drie kaarten (voorvertoning en effect);
   - de live wedstrijd met stats en sms'jes;
   - "Sack the coach?";
   - het staf-rapport;
   - de seizoenskaart;
   - *Voted out* met de carrièrekaart;
   - de keuze van de achtergrond.
   - Leg dit voor aan de eigenaar.
3. **Fase C, een verticale plak:** één volledig seizoen met de nieuwe loop, plus het einde bij een club en een tweede club.
4. **Fase D, balans:** de bots (actief, passief, willekeurig) en de nieuwe `loop-test.js` met de doelen hierboven.
5. **Fase E, speeltest door de eigenaar,** met de toets bovenaan.
6. **Vastleggen:** het besluitenlog en de leeswijzer bijwerken, committen en pushen naar `voorzitter-fundering`.

## Testen (meld eerlijk wat faalt)
- **Bestaand:** `foundation-test`, `chairman-audit`, `td-test`, `opening-test`, `mandate-*`, `identity-test`, `mobile-audit` en `ui-season` blijven groen.
- **Nieuw: `loop-test.js`,** over 20 seeds:
  - balans per bot;
  - beweging van de steun per week;
  - het aandeel van de uitslag in die beweging;
  - geen kaart zonder zichtbaar effect;
  - herhaling van kaarten;
  - hoe vaak de trainer een sms opvolgt, per loyaliteit;
  - elk seizoen minstens één wijzer in de gevarenzone;
  - de carrière loopt door na weggestemd en failliet, zonder fouten.
- **Mobiele audit** op elk nieuw scherm, plus een geschatte tijd per week.

## Open vragen voor de eigenaar (❓, vóór fase A)
1. **De zomervergadering:** zeven mandaatkeuzes, of compacter (vier)? Dat bepaalt of de opening onder de 5 minuten komt.
2. **Kaarten per week:** vast op 3, of 2–4 afhankelijk van de week?
3. **De wedstrijd:** standaard live (20 s, overslaan mag), of standaard alleen de uitslag, met live als keuze?
4. **Wat er meegaat naar de volgende club:** alleen reputatie en records, of ook mensen die je volgen?

## Wat je níét doet
- Geen nieuwe valuta of meters. De vier wijzers bestaan al.
- De voorzitter kiest geen opstelling, tactiek of transfers zelf. Hij vraagt het de trainer per sms; de trainer beslist.
- Geen premies, weekdoelen of microtransacties.
- Geen seeds en geen delen.
- Niet bouwen voordat fase A en B akkoord zijn.

## Bronnen
- [38-0 challenge](https://82-0-challenge.com/38-0)
- [PC Gamer: Reigns' Tinderocracy](https://pcgamer.com/how-reigns-and-its-forthcoming-sequel-make-their-tinderocracy-work)
- [GamesRadar: Reigns](https://gamesradar.com/how-reigns-convinced-two-million-people-to-swipe-right-to-rule-their-kingdom-and-captured-the-game-of-thrones-license)
- [GamesRadar: Retro Bowl's addictive simplicity](https://www.gamesradar.com/au/retro-bowls-addictive-simplicity-makes-it-one-of-the-best-sports-games-in-recent-years/)
- [PocketGamer.biz: the making of Retro Bowl](https://www.pocketgamer.biz/interview/77507/new-star-games-simon-read-retro-bowl-making-of/)
- [Nintendo Life: New Star Manager](https://www.nintendolife.com/reviews/switch-eshop/new_star_manager)
- [Pocket Gamer: New Star Manager](https://www.pocketgamer.com/new-star-manager/review)
- [Operation Sports: shouts in FM26](https://www.operationsports.com/understanding-shouts-in-fm26-and-how-they-affect-your-team)
- [inkl: match ratings in FM26](https://www.inkl.com/news/how-do-match-ratings-in-football-manager-26-work)
- [PC Gamer: Motorsport Manager](https://www.pcgamer.com/au/motorsport-manager-captures-f1-drama-while-emulating-genre-leaders)
- [GamingTrend: Motorsport Manager](https://gamingtrend.com/reviews/take-road-watching-to-the-next-level-motorsport-manager-review)
- [The Chairman (Steam)](https://store.steampowered.com/app/4468880/The_Chairman/)
- [Football Boardroom (Steam)](https://store.steampowered.com/app/4881970/Football_Boardroom/)
- [GoombaStomp: Club Soccer Director](https://goombastomp.com/club-soccer-director-pro-2020-review/)
- [AV Club: Hades and failure](https://www.avclub.com/hades-and-failure)
- [itch.io: loops and arcs in Hades](https://itch.io/blog/774695/to-hell-and-back-again-a-look-at-loops-and-arcs-in-hades)
- [Game Wisdom: Balatro](https://game-wisdom.com/analysis/balatro)
- [Game Developer: compulsion loops short, medium and long term](https://gamedeveloper.com/design/opinion-compulsion-loops-in-the-short-medium-and-long-term)
- [GameAnalytics: the compulsion loop explained](https://www.gameanalytics.com/blog/the-compulsion-loop-explained)
- [Roblox: core loops](https://create.roblox.com/docs/production/game-design/core-loops)
