# Audit: de achterbannen (Board, Fans, Press, Room) en grip

*17-11-2026, volgens `notes/PROMPT-backers-full.md`. Labels: **gelezen** (in de code), **gemeten**, **vermoed**. De meting van punt 4 is nog niet gedraaid (wacht op toestemming).*

## 1. Inventaris

### Schrijfplekken met een vaste grootte (gelezen; script over `src/*.js` en `src/engine/*.js`)
| Waarde | Plekken | Omhoog (aantal, som, mediaan) | Omlaag (aantal, som, mediaan) | Grootste bronnen |
|---|---|---|---|---|
| Board | 109 | 47, +157, +3 | 62, −236, −3 | events.js 31, dossiers.js 23, season.js 15, turnaround.js 7 |
| Fans | 134 | 84, +270, +3 | 50, −201, −3 | events.js 47, dossiers.js 30, weekflow.js 15, events3.js 7 |
| Press | 83 | 40, +115, +3 | 43, −157, −3 | events.js 34, dossiers.js 23, events2.js 6, weekflow.js 6 |
| Room (moraal) | 63 | 33, +237, +5 | 30, −223, −5 | events.js 20, dossiers.js 11, events3.js 10, briefs.js 7 |

Daarnaast schrijfplekken met een berekende grootte (wekelijkse drift, uitslagen, transfers, ontslag van de coach) die het script niet telt.

**Er zijn twee schalen.** 94 plekken schrijven via `bk()`/`bump()` (dossiers, pathway, de stemmingen in `loop.js`) op de *getoonde* schaal; de andere ±295 schrijven op de *ruwe* schaal. Een `bk('fans', 4)` is daardoor ruw +3, een `fx({ fans: 4 })` ruw +4 (gelezen).

**Er zijn acht eigen `fx`-hulpjes** met verschillende signaturen (`events.js`, `events2.js`, `events3.js`, `briefs.js`, `season.js`, `academy2.js`, `turnaround.js`, `weekflow.js`), plus `adj`, `bk` en `bump` (gelezen).

### Wekelijkse beweging (gelezen)
| Waarde | Trekt naar | Snelheid | Per uitslag (W / G / V) | Seizoenseinde |
|---|---|---|---|---|
| Board | 55 | 4% per week | +0,8 / 0 / −1,1 tot −1,6 | seizoensoordeel, dan 12% terug naar 60; promotie +6, degradatie −15 |
| Fans | 55 | 7% per week | +1,8 / −0,3 / −2,4 | **geen** terugzetting; promotie +8, degradatie −10 |
| Press | 50 | 5% per week | +0,6 / 0 / −0,6 | **geen** terugzetting |
| Room | moraal 65 per speler | 5% per week | +3 / 0 / −3 | geen; alleen onwennige spelers op 60 |

### Leesplekken (gelezen)
- **Board:** ontslag op 0 aan het seizoenseinde (één reprieve), `board_warning` ≤ 22, turnaround < 45, stemming ≤ 5, event-weging.
- **Fans:** opkomst (`commercial demand`), thuisvoordeel (`homeEdge`), bestuur −0,5 per week onder 30, stemming, event-weging.
- **Press:** sponsorbelangstelling, merk en de prijs van sponsoraanbiedingen (sinds B51), event-weging, één optie bij de supporters-stemming, stemming.
- **Room:** teamsterkte (`strengthParts`, ±0,35 plus coach), stemming.
- **Grip:** ±3,6 op de eigenschappen van alle hoofden; onder 25 zakken bestuur en relaties wekelijks.

### Schalen en drempels (gelezen)
Getoond = `(ruw − a) × b`, afgerond en tussen 0 en 100: Fans `(st.fans − 25) × 1,33`, Press `(st.press − 30) × 1,43`, Room `(moraal − 35) × 1,54`. Stemming bij getoond ≤ 5, gevaar ≤ 20, stemmingswoorden in banden < 8, < 25, < 55, < 78. Een getoonde 100 betekent ruw ≥ 100 bij fans, ≥ 100 bij pers en een gemiddelde moraal ≥ 100 bij room: het is het plafond van de ruwe schaal.

## 2. Bevindingen

**Ontwerp**
1. **De meters lopen vast in een goed seizoen** (gelezen + screenshot eigenaar). Room: bij 60% winst, 20% gelijk en 20% verlies is het evenwicht van de moraal ±89, getoond ±83; met events erbij ±90–100. Fans: de wekelijkse drift alleen geeft getoond ±50, maar events duwen netto omhoog (+270 tegen −201) en fans, pers en room worden **nooit** teruggezet aan het seizoenseinde. Over seizoenen stapelt het (vermoed; de meting moet het bevestigen).
2. **Op het plafond verdwijnt elke informatie.** "Supporters 100, +6 this week" (screenshot): de 100 kan niet hoger en de +6 is het verschil met 94 van vorige week. Goed en heel goed zijn niet meer te onderscheiden, en een event dat fans "+3" geeft doet niets.
3. **Events trekken niet gelijk.** Fans krijgt meer omhoog dan omlaag, Board en Press meer omlaag dan omhoog (tabel). Board wordt daardoor vooral door uitslagen en doelen gedragen, Fans drijft vanzelf naar boven (gelezen; effect vermoed).
4. **Twee schrijfschalen** (gelezen). Hetzelfde getal in een dossier en in een event betekent een ander effect. Geen fout in een enkel event, wel een bron van onbedoelde balans.

**B51 is niet af**
5. **Vijf schermen tonen nog getallen** (gelezen + screenshots in de scratchpad):
   - *Your backers* (detail): getal-eerst, de uitleg in getallen ("below 5"); bedoeld als detailscherm, maar leest als dashboard.
   - **Clubscherm "Who backs you"**: alle vier als balk met getal, **plus grip met getal** (77), terwijl B51 grip verbergt; en nog een meter "DNA fit".
   - **Weekoverzicht "This week"**: getal en delta per achterban.
   - **Reactie na een beslissing** (`fdHtml`): "Board +3 · Supporters −4".
   - **Ontslagscherm**: de vier getallen bij de feiten.
6. **Optiehints**: 10 opties tonen een getal ("Board +3 now"), 122 een pijl (gelezen). Klein, maar het botst met P4.

**Fouten die geen ontwerpkeuze zijn**
7. **De balken hebben de clubkleur** (`var(--acc)`), niet een toestandskleur: bij een rode club leest elke balk als alarm, ook op 100 (screenshot eigenaar; gelezen in `05-departments-…css`).
8. **Namen verschillen per scherm**: tegel "Fans/Room", elders "Supporters/Dressing room", de reactierij "Supporters", de tegel-aria "Supporters".
9. **"+N this week" op een meter die op 100 staat** of op 0: het getal klopt, maar zegt niets.

**Grip**
10. Grip wordt alleen nog als *Drifting* (< 35) getoond, maar het clubscherm laat het getal zien (punt 5). Hoe vaak grip onder 35 of 25 komt, is niet gemeten.

## 3. Voorstel: één samenhangend systeem

**Wat elke waarde betekent.** Board = je baan. Fans = de sfeer rond de wedstrijd (opkomst, thuisvoordeel). Press = je reputatie (sponsors, merk). Room = of de spelers voor je lopen (teamsterkte). Grip = of je staf richting voelt (alle hoofden).

**Hoe ze bewegen, zonder vast te lopen.**
- **Zachte randen.** Eén centrale wekelijkse correctie in `loop.js`: boven 80 en onder 20 trekt elke waarde harder naar het midden. 100 en 0 blijven bereikbaar, maar je blijft er niet vanzelf staan. Dat raakt geen van de 389 schrijfplekken.
- **Seizoenseinde voor alle vier.** Fans, Press en Room gaan, net als Board, een deel terug naar het midden (bijvoorbeeld 25%). Een nieuw seizoen begint met een nieuwe stemming.
- **Eén schrijfschaal.** `bk()` en `bump()` gaan voortaan op de ruwe schaal, zodat een getal in een dossier hetzelfde betekent als in een event (de effecten in dossiers worden ±25–35% kleiner; vermoed, meten).

**Hoe ze verschijnen, overal hetzelfde.**
- Eén naam per achterban op elk scherm (vraag 4).
- Overal stemming en pijl, nooit een getal: homescherm (al), clubscherm, weekoverzicht, reactie na een beslissing ("Board ↑ · Supporters ↓"), ontslagscherm, wedstrijdkrant (al).
- Het detailscherm *Your backers* wordt stem-eerst: de stem, de stemming, wat het raakt, en de richting. Getal ja of nee: vraag 2.
- Balken (waar ze blijven) in een toestandskleur: groen, grijs of rood, niet de clubkleur.
- Grip ook op het clubscherm alleen als signaal (*Steady* of *Drifting*).
- Optiehints met een getal krijgen een pijl, zoals de andere 122.

**Wat het kost.** `loop.js` (correctie en seizoenseinde), `engine/10-season.js`, `dossiers.js`/`pathway.js` (schaal), de UI-schermen uit punt 5, CSS. Geen nieuwe state, geen migratie (de ruwe waarden blijven geldig). Tests: `sack.js`, `backers.js`, `turnaround.js` moeten groen blijven, plus nieuwe voor de zachte randen en de schermteksten. De balans van ontslag (B37) verschuift misschien: meten.

## 4. Meting (wacht op toestemming)
Een kleine run: 3 seeds × 4 seizoenen, met een goede en een slechte CEO-stijl (willekeurige antwoorden tegenover de beste optie volgens de staf), voor en na het voorstel. Ik meet per week de vier waarden en grip: hoe vaak ze boven 90 of onder 10 staan, hoe vaak een stemming valt, waar grip gemiddeld staat. Kosten: ±2–4 minuten rekentijd per variant, twee varianten.
