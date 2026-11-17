# Wat betekenen Board, Fans, Press, Room en Grip?

*Analyse 17-11-2026, volgens `notes/PROMPT-home-meters.md`. Alles hieronder is **gelezen** in de code tenzij er **vermoed** staat. Er is niets gemeten en niets gebouwd.*

## 1. De feiten per waarde

De vier tegels komen uit `src/loop.js` (`BK`). Ze tonen niet de ruwe state, maar een omgerekende schaal 0–100. Bij **≤ 5** volgt een stemming met één laatste kans per seizoen (`lastChance`); mislukt die, dan ontslag. **≤ 20** kleurt de tegel als gevaar.

| Tegel | Formule (getoond) | Ruwe state | Stemming bij tegel ≤ 5 betekent |
|---|---|---|---|
| Board | `board.conf` | 0–100 | `board.conf ≤ 5` |
| Fans | `(st.fans − 25) × 1,33` | `G.st.fans` | `st.fans ≤ 28,8` |
| Press | `(st.press − 30) × 1,43` | `G.st.press` | `st.press ≤ 33,5` |
| Room | `(gem. moraal top-18 − 35) × 1,54` | `p.morale` | moraal ≤ 38,2 |

**Board** (`boardWeekly`, engine/08; seizoenseinde in engine/10)
- *Beweegt door:* uitslag (+0,8 winst, −1,1 tot −1,6 verlies), terugtrekken naar 55 (4% per week), de competitiedoelstelling na week 8 (−0,7 tot +0,35), geld onder nul (−0,6 of −1,4), fans onder 30 (−0,5), alignment onder 50 (−0,4), DNA-factoren, beloftes, events (51 plekken in de code). Seizoenseinde: een seizoensoordeel plus 12% terug naar 60 (B37); degradatie −15, promotie +6.
- *Doet:* het is de echte ontslagmeter. Op 0 aan het seizoenseinde volgt ontslag (één reprieve). ≤ 22 geeft het event `board_warning`, < 45 kan de turnaround starten (B44), ≤ 5 de stemming.

**Fans** (`kpiWeekly`, engine/08)
- *Beweegt door:* terugtrekken naar 55 (7% per week), winst +1,8 / verlies −2,4 / gelijk −0,3, hoge ticketprijzen, lage alignment, events (50 plekken), beker, promotie en degradatie.
- *Doet:* opkomst (commercial `demand`), thuisvoordeel (`homeEdge`), bestuur −0,5 per week als het onder 30 zakt, de stemming. **Let op:** dit is de *stemming*; het *aantal* fans is `club.fanbase` (marketing), en loyaliteit is nog een derde getal (`G.mk.loyalty`). De speler ziet "Fans" maar er zijn drie fan-dingen.

**Press** (`kpiWeekly`)
- *Beweegt door:* terugtrekken naar 50 (5% per week), ±0,6 per uitslag, persvragen, events (14 plekken).
- *Doet:* bijna niets. Gelezen door: de event-weging (`weekloop.js`: meer persberichten als het laag is), één optie bij de supporters-stemming, en zijn eigen stemming. Er is **geen** effect op sponsors, merk, fans of bestuur gevonden.

**Room** (`room()` in loop.js, moraal per speler)
- *Beweegt door:* elke moraalwijziging (73 plekken), psycholoog, gesprekken, transfers, events.
- *Doet:* telt mee in teamsterkte (`strengthParts`: ±0,35 plus coach), en de kleedkamer-stemming.

**Grip** (`levers.js`)
- *Beweegt door:* je eigen beslissingen: bericht +6, briefing +3, gesprek +5, voorstel +3, bureau-afhandeling +1; maximaal +16 per week; elke week −5. Start 60.
- *Doet:* ±3,6 op de eigenschappen van **alle** hoofden (gewogen: coach/DoF/academie 1, marketing 0,6, commercieel 0,4, financiën 0,3). Onder 25: bestuur en relaties zakken elke week, en een Gazette-bericht.
- *Te zien als:* een pil met getal en balk in de onderbalk, met een uitleg in de help.

Niet gevonden: of een speler de uitleg van grip ooit opent; hoe vaak elke stemming valt; waar grip gemiddeld staat (**niet gemeten**).

## 2. Wat het voor de speler betekent

| Waarde | Welke vraag beantwoordt het? | Welke beslissing neemt hij er anders door? |
|---|---|---|
| Board | "Hoe veilig is mijn baan?" | Ja: risico nemen of op zeker spelen, een belofte doen, de turnaround. |
| Fans | "Zijn de supporters blij?" | Weinig: ticketprijzen, soms een event-keuze. Het verband met opkomst en thuisvoordeel ziet hij niet. |
| Press | "Wat schrijft de krant over mij?" | **Geen.** Het heeft geen gevolg behalve een stemming die je kan ontslaan. |
| Room | "Staat de kleedkamer achter me?" | Weinig: het verband met teamsterkte ziet hij niet. |
| Grip | "Stuur ik genoeg?" | Onduidelijk: het getal zakt elke week vanzelf, zonder dat hij weet wat hem dat kost. |

## 3. Wat er schuurt

1. **P4 wordt gebroken.** De bijbel zegt "druk voel je, je leest hem niet af… niet als kale getallen". Het homescherm toont vier getallen met balken plus een vijfde (grip). De stemmen (`VOICE`) bestaan wel, maar staan achter het getal. B6 zei bovendien: over meters beslissen na een playtest.
2. **Press doet niets, maar kan je ontslaan.** Een meter zonder gevolg behalve een ontslagroute is een val zonder les (P9: geen echte afweging).
3. **Vier ontslagroutes, één logisch.** Het bestuur ontslaat; dat snapt iedereen. Dat de pers of de supporters je via een "stemming" kunnen wegsturen is spannend, maar de drempels liggen op heel verschillende ruwe waarden (28,8 / 33,5 / 38,2) en de speler ziet niet waarom de ene tegel bij 5 gevaarlijker is dan de andere.
4. **Drie keer fans.** Fans-stemming (tegel), fanbase (aantal, marketing) en loyaliteit (marketing) heten allemaal "fans" maar zijn drie systemen.
5. **Grip is een belasting zonder gezicht.** Het straft stilte (−5 per week) en beloont klikken, maar vertelt niet wat het kost. Een week met weinig berichten (gemiddeld 0,9 per week, hoofdstuk 18) kan grip laten zakken zonder dat de speler iets fout deed (**vermoed**, niet gemeten).
6. **Dubbel:** één verlies raakt bestuur, fans, pers en (via moraal) room tegelijk. De vier tegels bewegen daardoor vaak samen en vertellen minder dan vier dingen (**vermoed**).

## 4. Drie richtingen

**A. Stemmen in plaats van getallen** *(minder meters zichtbaar, zelfde mechaniek)*
- De speler ziet op het homescherm vier achterbannen als een **stem met een richting** ("The chairman has stopped returning calls" ↓), een kleur (rustig / onrustig / gevaar), geen getal. De getallen staan alleen nog in een detailscherm.
- Grip verdwijnt uit de onderbalk; het wordt een signaal ("Staff are making the calls without direction") als het laag staat.
- Lost op: P4. Versterkt: P4, P2 (je voelt het spoor). Kost: alleen UI (`ui/10`, `ui/13`, `loop.js` heeft de stemmen al); geen state, geen migratie, geen balanswijziging. Verdwijnt: de directe afleesbaarheid (dat is de bedoeling).

**B. Eén meter die telt: het bestuur** *(systeem herzien)*
- Alleen **Board** blijft een meter: je baan. Fans, Press en Room worden **stemmen die het bestuur voeden**: een slechte week bij de supporters of in de kleedkamer duwt het bestuursvertrouwen omlaag. Geen aparte stemmingen meer; elke crisis loopt via het bestuur (en de turnaround).
- Press krijgt een echt gevolg (sponsors en merk), of gaat op in de toon van de Gazette.
- Grip wordt zichtbaar als "Control" bij de staf, met wat het doet per hoofd, of verdwijnt.
- Lost op: punten 2–6. Kost: `boardWeekly`, `loop.js` (stemmingen), `levers.js`, `test/sack.js` en de balans van B37 (ontslag ±20%) moet opnieuw gemeten worden. Verdwijnt: de spanning van een supporters- of kleedkamer-opstand.

**C. Alles houden, betekenis geven** *(bestaand systeem, duidelijker)*
- De vijf blijven, maar elke tegel zegt wat hij doet: "Fans: fuller stands, a louder home crowd", "Room: how hard the team plays for you". Press krijgt een echt effect (sponsors of merk). Grip krijgt een doel ("one decision a week keeps it steady") en een tik-uitleg.
- Lost op: punten 2 en 5 deels. Kost: UI plus een kleine logica voor Press. Botst nog steeds met P4.

## 5. Aanbeveling

**A eerst, B als volgende stap na een korte meting.** A lost de botsing met P4 op zonder iets aan de balans te veranderen, en past bij B6 (meters pas na voelen): je speelt een paar seizoenen met stemmen en merkt of je de getallen mist. Daarna is B de echte opruiming (Press zonder gevolg, vier ontslagroutes, drie keer fans), maar die raakt B37 en moet met één kleine meting (hoe vaak valt welke stemming, waar staat grip) worden onderbouwd.

Klein en af om te beginnen: de vier tegels op het homescherm vervangen door stemmen met richting en kleur, de grip-pil vervangen door een signaal bij laag. Geen nieuwe state.

## 6. Vragen aan de eigenaar
Zie de vraagtool in de sessie: richting, grip, ontslagroutes en Press.
