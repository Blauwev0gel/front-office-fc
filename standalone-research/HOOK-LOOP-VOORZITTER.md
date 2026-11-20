# De hook en de loop van De Voorzitter

*21-11-2026. Op basis van een kritische blik op de huidige flow, een vergelijking met andere spellen en keuze 71 van de eigenaar. Ter goedkeuring; eerst templates.*

## Het probleem (de eigenaar)
> "Het beantwoorden van vragen is een beetje saai, en veel van de vragen lijken geen consequenties te hebben. Het leuke, het virale, is vaak dat je meteen weet hoe je er voor staat, zoals 34-0, 38-0 of 82-0."

**Wat we in het spel zien:**
- Je beslist en ziet geen gevolg: de loyaliteit en stemming veranderen onzichtbaar.
- Er is geen getal om bij te houden. Of je het goed doet, blijkt pas bij de ALV.
- Een actieve speler wint altijd (de actieve bot wint 40 van de 40 ALV's).

## Wat andere spellen ons leren
| Spel | Les |
|---|---|
| **38-0 / 82-0** | Eén getal is de hook. Je weet meteen hoe je ervoor staat, en dat deel je. |
| **Reigns** | Je swipet en *ziet meteen* welke meters bewegen. Falen hoort erbij en je begint opnieuw. Een sessie duurt minuten. |
| **The Chairman** (Steam, EA 2026) | Een seed die je deelt: een vriend speelt dezelfde wereld. Na elke wedstrijd één regel uitleg. |
| **Football Boardroom** (Steam, EA 2026) | Bijna ons concept, maar breed: stadionwijk, eigen bezit. Elke week "the club needs a decision". Breedte zonder hook. |
| **Club Soccer Director** | Recensenten vinden het saai: geld bepaalt de moeilijkheid en je voelt weinig invloed. |

**Wat alleen wij hebben:** de leden, met de vraag *"hoeveel procent zou je nú herkiezen?"* Dat getal bestaat al in de code (de gewogen steun op de ALV), maar de speler ziet het niet.

## Keuze 71 (bindend)
1. **Het getal is de ledensteun in %.** Altijd in beeld, met een pijl tegenover vorige week.
2. **Beslissen gebeurt met snelle kaarten met een direct gevolg.** Twee tot vier korte kaarten per week, elk met twee keuzes. Je ziet meteen wat het doet.
3. **Een open carrière.** Er is geen eindscore. Weggestemd of failliet bij een club betekent nieuwe dossiers bij een andere club. Je carrièrekaart groeit.

## De hook in één zin
**"Elke week weet je precies hoeveel leden je nog steunen, en elke keuze laat dat getal bewegen."**

## De drie wijzers (bestaande state, nu zichtbaar)
Er komt geen nieuwe meter. We maken zichtbaar wat er al is.

| Wijzer | Wat het is | Bron in de code |
|---|---|---|
| **Steun** (groot, de hoofdscore) | Het % leden dat je nu zou herkiezen | `weighted()` over de stemmingen en het aandeel van de ledengroepen |
| **Kas** | Geld in £k, met een pijl | `C().cash` |
| **Kleedkamer** | Een gezichtje op basis van de moraal van de selectie en de trainer | gemiddelde `morale` plus de loyaliteit van de trainer |

**Onder de steun** staan de ledengroepen als gezichtjes. Die bewegen mee, zodat je ziet *wie* er boos wordt.

## De loop

### De week (30–45 seconden)
1. **Opening:** de steun groot (bijvoorbeeld **58% ↑2**), de kas, de kleedkamer, de volgende wedstrijd en "ALV over 14 weken".
2. **Twee tot vier kaarten.** Elke kaart heeft een persoon uit onze wereld (met geheugen), een situatie in één zin en twee keuzes.
   - **Vooraf** zie je met iconen wélke wijzers en groepen een keuze raakt (zoals Reigns), maar niet precies hoeveel.
   - **Na de keuze** tikt het getal mee: **58 → 61**, gezichtjes bewegen, een chip voor geld of kleedkamer.
   - **Geen gratis keuzes:** elke optie laat iets stijgen en iets anders dalen.
3. **Zaterdag:** de uitslag beweegt de steun ook. Een derbyzege geeft +3, een thuisnederlaag −2. Voetbal telt, maar jouw keuzes tellen zwaarder.
4. **Weekregel:** "58% → 61%: de derbyzege en je woorden voor Kershaw." Dit is de korte uitleg, zoals in The Chairman.

### Het seizoen
- **De speech in de zomer** zet je beloftes. Elke belofte heeft een zichtbare voortgangsbalk door het jaar. Een gebroken belofte kost steun op het moment dat ze breekt, niet pas bij de ALV.
- **De transferzomer** blijft kijken (keuze 68 en 70). Het cijfer van de krant beweegt wél de steun: A +4 … E −4.
- **Mijlpalen in het seizoen:** de derby, het winterwindow, de beker en het eindklassement. Ze verschijnen als grote kaart met een groot gevolg.
- **De ALV is het eindbaasgevecht:** onder 50% ben je weggestemd. Moties en je verdediging kunnen een paar procent schuiven, maar geen wonder doen.

### De carrière (open, keuze 71)
- **Weggestemd of failliet** levert een scherm *"Voted out after 4 seasons · 47%"* op. Daarna kun je verder naar nieuwe dossiers. Clubs bieden zich aan op basis van je **reputatie** (bestaande `S.rep`).
- **De carrièrekaart** groeit mee: clubs, seizoenen, promoties, trofeeën, beste ALV, langste periode. Te delen als tekst, met de seed van de wereld.
- **Records** zoals "Longest reign" en "Highest AGM" geven een doel zonder eindscore.

## Wat er verandert aan wat er al is
| Nu | Straks |
|---|---|
| Feed met reacties (briefje of krant) | De feed blijft om te lezen. Reacties gaan op in de kaarten. |
| *In the post*: situaties met lange afspraakkaarten | Snelle kaarten van één zin met twee keuzes. Grote situaties blijven als grote kaart op een mijlpaal. |
| Loyaliteit en stemming onzichtbaar | Elke keuze laat direct +/− zien op de steun, de groepen, de kas of de kleedkamer. |
| Alleen de ALV oordeelt | De steun beweegt elke week. De ALV is de toets. |
| Weggestemd = einde | Weggestemd = een nieuwe club, een carrièrekaart en records. |

## Balans
- **Doel:** de actieve bot haalt 60–75% gewonnen ALV's, de willekeurige 25–40%, de passieve onder 15%.
- **Elke kaart is een afweging.** Er is geen optie die alleen omhoog gaat.
- **Uitslagen:** hooguit een derde van de wekelijkse beweging in steun komt uit de wedstrijd.

## Wat vaststaat
- Geen opstelling, tactiek of spelerskeuze voor de voorzitter.
- De zomer blijft kijken.
- Een week duurt 30–60 s.
- Seeded RNG, oude saves blijven laden, mobiel 390 px, UI in het Engels.

## Volgende stappen
1. **Templates:** het weekscherm met de drie wijzers en de steun groot, drie kaarten met de voorvertoning en de animatie na de keuze, de weekregel, het scherm *voted out*, en de carrièrekaart.
2. **Papieren proef:** vier weken spelen met kaarten. Voelt elke keuze als iets?
3. **Bouwen** na akkoord, met een nieuwe `loop-test.js` voor de balansdoelen en de beweging per week.

## Bronnen
- [Football Boardroom (Steam)](https://store.steampowered.com/app/4881970/Football_Boardroom/)
- [The Chairman (Steam)](https://store.steampowered.com/app/4468880/The_Chairman/)
- [GoombaStomp: Club Soccer Director review](https://goombastomp.com/club-soccer-director-pro-2020-review/)
- [Cubed3: Club Soccer Director PRO](https://www.cubed3.com/games/reviews/pc/club-soccer-director-pro-2020)
- [Football Chairman (gamebrain)](https://gamebrain.co/game/football-chairman-soccer)
- [38-0 challenge](https://82-0-challenge.com/38-0)
- [PC Gamer: how Reigns makes its Tinderocracy work](https://pcgamer.com/how-reigns-and-its-forthcoming-sequel-make-their-tinderocracy-work)
- [GamesRadar: how Reigns convinced two million people](https://gamesradar.com/how-reigns-convinced-two-million-people-to-swipe-right-to-rule-their-kingdom-and-captured-the-game-of-thrones-license)
