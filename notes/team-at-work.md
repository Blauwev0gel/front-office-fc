# "Your team at work": inventaris, stemmen en voorbeelden (stap 1 en 2)

*Bij `notes/PROMPT-team-at-work.md`. Gelezen: `ui/10-inbox.js`, `desk.js`, `engine/11:5` (`buildReports`), `engine/07:111` (`dofNote`). Gemeten: een gespeelde run op seed 401, weken 2–9.*

## 1. Wat de game nu vastlegt
| Soort | Bron | Velden | Probleem nu |
|---|---|---|---|
| **Besluit door een head** | `G.inbox` met `del` (desk.js) | event, gekozen optie, `outcome`, reden uit `carry()` (fout of gok) | De optie en de uitkomst worden letterlijk geplakt: "Stick to the mandate. He grumbles but stays on task." |
| **Brief die de head afhandelde** | `G.briefs` met `del`, `by`, `out` | titel, uitkomst | Kale uitkomsten: "Dropped.", "Prices stay.", "On to the next one." |
| **Weekrapport per rol** | `G.reports` (`buildReports`) | één zin per rol, met cijfers | **Elke week bijna hetzelfde.** "Window closed. 8 contracts expire this summer." stond 6 weken achter elkaar; de academie 8 weken |
| **DoF-werk** | `G.dofNote` | opties gewogen, getekend, geblokkeerd | Alleen in het rapport en alleen in het window |
| **Scoutwerk** | `G.scoutNote` | wedstrijden bekeken, toegevoegd | Idem |
| **Mijlpalen** | `G.msNew` | speler en tekst | In week 2 **13 debuten** tegelijk |
| **Karakter** | `staff[r].p` | `ego`, `risk`, `amb`, `loy` (3–19), plus `lean`, `bio` en de coachstijl | Wordt nergens in de tekst gebruikt |

**Conclusie:** het materiaal is er wel, maar het wordt gedumpt in plaats van verteld. Wat ontbreekt:
- **verandering:** alleen tonen wat deze week anders is;
- **een stem:** het karakter van de head;
- **een keuze:** wat het meest betekent.

## 2. Hoe de module kiest (`F.teamWork()`, zonder DOM)
1. **Alleen wat veranderde.** Een rapport telt alleen als het verschilt van vorige week, bijvoorbeeld:
   - sponsorinkomsten omhoog;
   - wages over of onder de cap;
   - een nieuwe uitblinker in de academie;
   - een getekende speler.

   Dezelfde rapportzin twee weken achter elkaar valt weg.
2. **Gewicht:**
   1. een fout of een gok van een head;
   2. iets met geld of een speler;
   3. de coach na een nederlaag of in een slechte reeks;
   4. mijlpalen, samengevoegd;
   5. de rest.

   Maximaal drie regels, één per head.
3. **Stem uit het karakter.** Per rol 3–5 zinsvormen per soort, gekozen op temperament:
   - **voorzichtig** (risk ≤ 8) / **gedurfd** (risk ≥ 14);
   - **kortaf** (ego ≥ 14) / **bescheiden** (ego ≤ 8);
   - **ambitieus** (amb ≥ 14).

   De variant volgt uit een vaste hash van week, head en soort. Een herlaad toont dus hetzelfde, en binnen vier weken komt dezelfde vorm niet terug.
4. **Een gevolg alleen als de game het berekende:** "£390/wk", "Over cap", "Went wrong", "Signed".

## 3. Stemmentabel (zinsvormen, Engels in het spel)
| Rol | Voorzichtig of bescheiden | Gedurfd of kortaf |
|---|---|---|
| **Coach** na de wedstrijd | *"We'll take it. {N} kept us in it."* | *"{xg} against {xga}. That's how we play," says {Name}.* |
| **DoF** besluit | *{Name} played it safe: {action}.* | *{Name} didn't wait for you: {action}.* |
| **Scout** | *{Name} came back from {n} games with nothing worth your time.* | *{Name} wants to go further afield. {Outcome}* |
| **Academie** | *{Name} keeps {player} close: "{age} is young."* | *{Name} pushes {player} up: "He's ready."* |
| **Commercial** | *{Name} took the safe deal: {sponsor}, {£}/wk.* | *{Name} closed {sponsor} himself. "The first of many."* |
| **Marketing** | *{Name}: {fans} supporters, {±n} this week. Steady.* | *{Name} wants louder: brand at {b}.* |
| **Finance** | *{Name} flags it early: {fact}.* | *{Name} acted first: {action}. "Better now than in March."* |
| **Rust** (geen werk dat telt) | *"Quiet week," says {Name}. "That's how I like it."* | *"Nothing to report. I'd rather have something to report," says {Name}.* |

Een citaat **parafraseert** alleen wat er gebeurde of wat de uitkomst zei. Het voegt geen feiten toe: geen nieuwe spelers, geen bedragen, geen gevolgen die de game niet heeft.

## 4. Zes voorbeeldregels uit seed 401 (weken 4–6, met wat de game echt vastlegde)
| Week | Wat de game vastlegde | Nieuwe regel | Label |
|---|---|---|---|
| 4 | DoF Dalton (risk 14): `agent_fee`, "Quietly decline", *misjudged* | **Dalton** sent an agent with "a little arrangement" away, but handled it clumsily. | Went wrong |
| 4 | Scout Nash (amb 16, loy 4): `scout_gem`, "Stick to the mandate", "He grumbles but stays on task." | **Nash** wanted a trip to West Africa. Told no, he stays on task, grumbling. | — |
| 4 | Coach Ashby (ego 19): rapport, 1.4 xG tegen 0.7, Cropper blonk uit | "1.4 against 0.7. That's how we play," says **Ashby**. Cropper was his man. | — |
| 5 | Commercial Achterberg (amb 19): `com_offer`, Bridgeway Cars, £390/wk | **Achterberg** closed Bridgeway Cars himself. "The first of many." | £390/wk |
| 5 | Finance Lyle (risk 16): rapport, wages 52% tegen een cap van 50% (vorige week 31%) | **Lyle** flags it: wages jumped to 52% of revenue, over your cap. | Over cap |
| 6 | Finance Lyle: `fin_wage`, "The DoF is told: no new high earners." | **Lyle** acted first: no new high earners. "Better now than in March." | 47% |

**Ter vergelijking, hoe het nu op het bureau staat:**
- "Director of Football · Carlos Dalton: Quietly decline. The agent shrugs and moves on. Carlos misjudged it."
- "Director of Football: Window closed."

**Wat niet meer verschijnt:**
- het DoF-rapport "Window closed…" in weken 5–9, omdat het niet veranderde;
- het academierapport, dat 8 weken gelijk bleef.

Het debuut van Dan Rowntree in week 7 komt er wel in, als regel van de academie: *Okoro sent Rowntree up to the first team. The coach decides his minutes.*

## Vragen aan de eigenaar
1. Zijn de toon en de lengte goed? Zo ja, dan bouw ik de module met deze stemmentabel.
2. Mag een citaat de uitkomst parafraseren, zoals "Better now than in March." of "The first of many."? Het voegt geen feiten toe, maar het is wel tekst die de game niet zelf berekent. **Aanbeveling: ja**, zolang het geen nieuwe feiten zijn.
