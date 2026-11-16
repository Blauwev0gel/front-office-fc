# Analyse wedstrijd: engine, beleving en visuals

> 16-11-2026, branch `claude-game`. Bronnen: `engine/06-match.js`, `engine/05-world-selection.js`, `matchtalk.js`, `matchday.js`, `ui/14-matchday-gazette.js`, `engine/12-week.js` (`buildPaper`).
> Metingen: 16 runs × 3 seizoenen (1.584 eigen wedstrijden, willekeurige speelstijl) en een volledige wedstrijd in de browser op 390 px.
> Labels: **[code]** · **[meting]** · **[beeld]** · **[playtest]**.

## 1. Oordeel
De wedstrijddag heeft een sterke vorm: een preview met verhalen over eigen spelers, een veld met momentum en commentaar, een uitslag met "hoe de verhalen afliepen", en een eigen Gazette. Dat is eigen en past bij de krantenstijl.
Er zijn wel drie problemen:
1. **Twee verschillende rekenmodellen.** Onze wedstrijden worden kans voor kans gesimuleerd, de rest van de competitie met een simpele formule. Daardoor vallen bij ons minder goals (2,3–2,5 tegen 2,7 per wedstrijd) en wat meer 0-0's. *Correctie 16-11:* de 1-0's waren in mijn telling 1-0 én 0-1 samen; in een grotere steekproef 18%, wat realistisch is.
2. **Wat de CEO deed, zie je niet terug in de wedstrijd.** De coachschuifjes veranderen vooral het spektakel, niet de uitslag (eerste rapport). Na afloop zegt niets *waarom* we wonnen of verloren.
3. **Herhaling.** Wissels en standaardkansen herhalen zich ongeveer 20 keer per seizoen per zin; de verhalen eindigen vaak in drie keer "a quiet day".
De wedstrijd duurt ±63 seconden, iets boven het doel van 30–60 (B3); 2× sneller en overslaan bestaan al.

## 2. Engine
**Hoe het werkt** **[code]**
- `simOurMatch`: ±22 kansen per wedstrijd (×0,8–1,25 door het aanvalsschuifje, beide kanten), wie de kans krijgt volgt uit het sterkteverschil, xG per kans uit afwerking tegen niveau; reacties op de stand en vermoeidheid na minuut 60–70; wissels, kaarten, blessures.
- Sterkte = selectie (CA × positie-fit) + coach (tactiek, stijl) + moraal + extra (steun, analist, voorbereiding, big game, stap omhoog).
- De rest van de wereld: `quickSim` (Poisson met 1,48 thuis en 1,17 uit, geschaald met het sterkteverschil).

**Gemeten tegenover gangbare bandbreedtes in het echte voetbal** **[meting]**

| | Ons spel | Reëel (ruwe bandbreedte) |
|---|---|---|
| Goals per wedstrijd (eigen) | 2,32 | 2,5–2,9 |
| Goals per wedstrijd (rest wereld) | 2,74 | 2,5–2,9 |
| 0-0 | 10,8% | ±7–9% |
| 1-0 en 0-1 samen | 23% (in een andere steekproef 18%) | ±17–19% |
| Gelijkspel | 25% | 24–28% |
| Zwakkere ploeg wint | 23% | ±20–30% |
| Rode kaarten per wedstrijd | 0,08 | ±0,1–0,2 |
| Goals na de 85e minuut | 12,5% van de goals | ±10–13% |

**Wat klopt:** gelijkspel, verrassingen, late goals en (gecorrigeerd) het aandeel 1-0. **Wat niet:** te weinig goals in onze wedstrijden en te weinig rode kaarten.

**Schijndiepte en fouten** **[code]**
- Coachschuifjes: aanvallend vergroot vooral het aantal kansen voor beide ploegen (2,1–1,3 xG tegenover 1,4–0,9) zonder punten te veranderen; jeugdminuten en rotatie kosten niets (eerste rapport §4.2; open als D4/D12).
- **Bug:** in de Gazette staat de xG altijd als "wij–zij" achter een uitslag die "thuis–uit" is. Bij een uitwedstrijd staat er "Brackmouth 2–1 Harwick. xG 0.7–1.3", terwijl wij 0,7 hadden (`engine/12-week.js` `buildPaper`).
- "Player of the match" komt altijd uit onze selectie, ook na een duidelijke nederlaag (een 6,2 als beste) **[beeld]**.
- Een blessure krijgt een willekeurige minuut, los van wanneer de speler echt op het veld stond; hij kan "geblesseerd uitvallen" nadat hij al gewisseld is **[code]**.
- De veldanimatie gebruikt `Math.random` (alleen visueel, maar tegen de afspraak in CLAUDE.md) **[code]**.

## 3. Beleving
**Flow** **[beeld]**: Next match → preview (stadion, tegenstander, "at stake", 3 verhalen, kick-off) → wedstrijd (veld met stippen, momentumgrafiek, één kaart met het laatste moment, rust met een zin van de coach) → full time (uitslag, player of the match, hoe de verhalen afliepen) → Gazette → Start week 2. Dat zijn 4–5 tikken en ±63 seconden op normale snelheid.
- **Sterk:** de verhalen vooraf geven de wedstrijd een persoonlijke inzet; het momentum maakt de wedstrijd leesbaar zonder echte spelers te tonen; de Gazette sluit mooi af.
- **Zwak:**
  - de stippen op het veld staan stil in formatie, alleen de bal beweegt;
  - de wedstrijd voelt voor elke week hetzelfde (geen weer, geen avondwedstrijd, geen volle of lege tribune), behalve een derby-tekst;
  - "how the stories ended" eindigt vaak in "a quiet day" voor alle drie;
  - de coach zegt bij rust één van drie zinnen.
- **Rol van de CEO:** nu alleen vóór big games (B23). Tijdens de wedstrijd kijkt hij. Binnen B1 kan hij wel iets met de *club* rond de wedstrijd: gasten in de bestuurskamer, de kleedkamer in bij rust, reageren op het publiek.

## 4. Na de wedstrijd
- Uitslag, moraal, achterban, de Gazette en terugblikken werken (B24).
- Wat ontbreekt: **waarom** we wonnen of verloren. De bouwstenen bestaan (`strengthParts`, `analysis()`, xG en geluk in de pathway-lens "How much was luck?"), maar de speler ziet ze nergens na de wedstrijd.

## 5. Visuals **[beeld]**
- Stijl: inktportretten, clubkleuren, een stadion boven de preview, een krant als slot. Eigen en consequent; behouden.
- Op 390 px: leesbaar. De wedstrijd gebruikt een donker veld in beide modi. Het momentum en de kaart zijn goed te volgen.
- Wat beter kan: stippen die bewegen bij kansen en goals, een duidelijker goalmoment (nu een kaart en een korte flits), en sfeer per wedstrijd (avond, regen, volle of halflege tribune, derby-kleuren).

## 6. Ook gevonden (buiten de wedstrijd)
- De rondleidingstekst van de inbox zegt nog "Decisions cost an action" (vergeten na B21). Gerepareerd in de eerste bouwronde.

## 7. Wat ik niet heb getest
- Echte telefoons en een vertraagde CPU, alleen de headless browser. Geluid niet beluisterd. Of de wedstrijd spannend voelt, is aan de playtest.
