# Audit: de wedstrijd (logica en beeld)

*17-11-2026, fase 1 en 2 van `notes/PROMPT-match-engine.md`. Labels: **gelezen** (code), **gezien** (browser, 390 px), **gemeten**, **vermoed**. Het ijkharnas is nog niet gedraaid (wacht op toestemming).*

## 1. De logica, van opstelling tot uitslag (gelezen)

**Opstelling** (`pickXI`, engine/05). Per vaste plek (`SLOTS`) de beste beschikbare speler op `ca × positie-fit`, met een duw voor jongeren (jeugdminuten), ruis voor rotatie, −0,8 voor onwennige spelers en de `selBonus`-hook. Bank: de vijf beste overgebleven spelers.

**Teamsterkte** (`strengthParts`). Gemiddelde `ca × fit` van de elf (onwennig ×0,94, U21 ×0,95) + coach (relatief aan het divisieniveau, B37) + speelstijl (+0,3 tot −0,2) + moraal (±0,35) + extra (pushes, analist, voorseizoen, `ftExtra`). Eén getal.

**De wedstrijd** (`simOurMatch`, engine/06). Alleen onze wedstrijd wordt zo gespeeld:
1. `d` = onze sterkte − die van de tegenstander (+ruis 0,3) + thuisvoordeel (`homeEdge`: 0,15 + vulling × 0,4 + fans).
2. **Aantal kansen** voor beide teams samen: Poisson(27 × volume × stijl tegenstander × regen). Volume = 0,85 + 0,3 × aanvallend schuifje.
3. Elke kans krijgt een **minuut** (willekeurig) en een **eigenaar**: wij met kans `logistiek(0,6 × (d + bijsturing))`. De bijsturing: achterstand (+0,25 tot +0,55), voorsprong (−0,25 tot −0,5), rode kaarten (±1,0), intensiteit vroeg en laat, aanvallend in blessuretijd.
4. **Onze kans:** een schutter gewogen op linie en afwerking, xG = `expRand(0,112)` gecorrigeerd voor afwerking tegenover tegenstander, voorsprong, schuifje, regen; goal met kans xG × composure; 72% kans op een aangever.
5. **Hun kans:** xG op dezelfde manier tegen onze gemiddelde verdediging; goal met kans xG × (keeperreflexen). **Alleen als het een goal is of xG > 0,25 komt het in het verslag.**
6. **Wissels:** drie op willekeurige minuten (55–82), de zwakste veldspeler eruit. **Kaarten:** 0–3, 50% bij ons; 6,5% rood (en heethoofden vaker).
7. **Na afloop** (los van het verloop): minuten, blessures, cijfers, en de tellers van B42 (schoten, sleutelpasses, tackles, intercepties, ontruimingen, reddingen) — **achteraf afgeleid** uit xG en attributen, niet uit gebeurtenissen.
8. **Waarom** (`whyLines`, B26): afwerking tegenover xG, kwaliteit, kaarten, publiek, moraal, jeugd, speelwijze.

**Alle andere wedstrijden** (`quickSim`): Poisson met λ 1,48 en 1,17, geschaald met `exp(0,22 × sterkteverschil)` en 0,3 thuisvoordeel. Een andere motor dan de onze.

**Het hele duel wordt vooraf berekend** in `endWeek`; het scherm speelt de uitkomst daarna af.

## 2. Wat het beeld doet (gelezen + gezien)

- **Preview:** stadion, weer, opkomst, stand en vorm, wat er op het spel staat, drie verhalen over eigen spelers, een gevaarlijke man bij de tegenstander, een quote van de coach.
- **Live** (`MDP`, ±40 seconden, **gemeten 39,5 s**): bovenin de stand en klok, een veld met 22 stippen en een bal, een momentumgrafiek, één kaart met de laatste gebeurtenis en een lijst eronder; knoppen 2× sneller en overslaan.
  - De stippen staan in een vaste opstelling (1-4-4-2) en schuiven mee met de bal; de bal springt elke twee minuten naar een willekeurige plek met een lichte neiging naar de volgende gebeurtenis. Bij een kans gaat de bal richting het doel, bij een goal verschijnt een grote tekst over het veld.
  - Bij rust soms de keuze om de kleedkamer in te gaan (B27).
- **Einde:** het eindresultaat, beste speler met cijfer, "Why" (B26), hoe de verhalen afliepen, door naar de krant.

## 3. Bevindingen

**Logica**
1. **De spelers op het veld zijn niet de spelers in de simulatie.** Een stip is nooit de echte schutter, aangever of keeper; de beelden zijn geseed maar willekeurig (gelezen).
2. **Het momentum kijkt vooruit.** De grafiek duwt elke minuut naar het team van de *volgende* gebeurtenis (`lean` en `momAll`). Wie oplet, ziet een goal aankomen (gelezen).
3. **De wedstrijd heeft geen verloop.** Kansen krijgen een willekeurige minuut; er is geen druk die opbouwt, geen fase na een goal anders dan een kleine bijsturing, en geen vermoeidheid. Wissels en blessures veranderen de sterkte niet (gelezen).
4. **Een geblesseerde speler speelt door.** Blessures worden na het duel getrokken en krijgen een minuut; een speler kan na zijn "blessureminuut" nog scoren, en er is geen gedwongen wissel (gelezen).
5. **De tellers van B42 kloppen niet met wat je zag.** Een spits met 1 schot in het verslag kan 4 schoten in zijn statistiek krijgen, omdat die achteraf uit xG worden getrokken (gelezen).
6. **De tegenstander is gezichtloos.** Hun kansen verschijnen alleen bij een goal of xG > 0,25; de gevaarlijke man uit de preview scoort in 40% van hun goals bij naam, de rest is "Goal X. A stunning strike" (gelezen + gezien).
7. **Twee motoren.** Onze wedstrijden en die van rivalen worden anders berekend (andere vorm van thuisvoordeel en sterkte). Of de uitslagen gelijk verdeeld zijn, is niet gemeten.
8. **De schuifjes van de coach doen iets, maar je ziet het niet.** Aanvallend verandert volume en xG voor beide teams; intensiteit verschuift kansen vroeg en laat; rotatie en jeugdminuten werken via de opstelling. Het verslag zegt dat alleen achteraf in "Why" (gelezen).
9. **De avond doet niets.** `night` is alleen beeld; regen kost 8% kansen en 5% xG (gelezen).

**Beeld (gezien op 390 px, licht en donker)**
10. **Lange lege stukken.** In een gespeelde wedstrijd kwamen in ±40 seconden vijf regels voorbij (0', 19', 48', 58', 59'); daartussen wiebelen de stippen zonder betekenis.
11. **De onderste helft van het scherm is leeg** tijdens het live deel: het veld neemt een derde, de feed een paar regels, dan de knoppen.
12. **De stippen hebben geen identiteit**: geen nummer, geen naam, geen gezicht; alleen de keeper is anders gekleurd. Je kunt geen held volgen.
13. **De goalanimatie bedekt het veld** met een grote tekst ("KIN score") en geeft weinig: geen wie, geen hoe, voor hun goals ook geen gezicht.
14. **Aan het eind verdwijnen de stippen** en blijft de bal in het midden staan; de momentumgrafiek is het enige spoor van het verloop.
15. **De uitleg spreekt zich soms tegen**: bij 0–2 verlies stond "Our keeper and defence kept them out: 3.2 expected, 2 conceded" naast "They simply had better players" (gezien; de regel is correct maar voelt verkeerd na een nederlaag).

**Wat goed is (en moet blijven)**
- De ritmiek van ±40 seconden met versnellen en overslaan; de preview (stadion, weer, verhalen, gevaarlijke man); de rustkeuze; "Why" na afloop; de koppeling met de krant en de verhalen van spelers.
- De kalibratie van B25 en de tellers voor het portaal (B42, `F.STATK`).

## 4. IJkharnas (voorstel, wacht op toestemming)
`tools/matchlab.js`: draait alleen `simOurMatch` (en `quickSim`) tussen vaste teams, zonder seizoen, bijvoorbeeld 5.000 wedstrijden in een paar seconden. Meet: gemiddelde goals, % 0-0, thuiswinst, uitslagverdeling, xG per team, effect van elk coachschuifje en van een rode kaart, en het verschil tussen onze motor en `quickSim`. Kosten: seconden rekentijd per run; geen seizoensruns.

## 5. Het genre (zonder iets te kopiëren)
Managementspellen tonen een wedstrijd zonder tactiek meestal op drie manieren: **tekst** (een ticker met momenten), **2D-hoogtepunten** (alleen de beslissende aanvallen, met echte spelers) of **een spelbord** (balbezit en zones als blokken). Wat bij *dit* spel past is de **blik van de CEO**: je kijkt vanaf de tribune naar mensen die jij hebt aangenomen, je ziet de gevolgen van je keuzes, en je kunt niets doen behalve voelen (P1, P4).

## 6. Richtingen

**A. Klein en af: het beeld vertelt de waarheid** *(alleen UI, de engine maakt iets meer gegevens)*
- De engine schrijft bij elke kans een korte **aanvalsschets** (wie begint, wie geeft de pass, wie schiet, van welke kant), uit de spelers die al gekozen worden.
- Het veld speelt die schets na met **echte spelers**: nummers op de stippen, de schutter en aangever lichten op, de keeper reageert; hun goals met de gevaarlijke man als hij het was.
- Het momentum volgt wat er **gebeurde**, niet wat komt.
- Lege stukken worden korter (de klok versnelt als er niets gebeurt); de lege onderkant krijgt de stemming op de tribune (B51-stijl) en de score van het andere duel in de divisie.
- Kosten: `engine/06` (schets per kans), `ui/14`, CSS; geen state, geen migratie; B25 en B42 onveranderd. Pijlers: P2, P4.

**B. Ambitieus: een wedstrijd in momenten** *(nieuwe logica, oude ijking)*
- De engine speelt **10–14 momenten** per wedstrijd (een aanvalsgolf, een spelhervatting, een counter), met spelers die meedoen op basis van attributen en vermoeidheid; fasen (start, druk, na een goal, slotfase); wissels en blessures die de sterkte echt veranderen; de **tellers van B42 uit de momenten** in plaats van achteraf.
- De beslissingen van de CEO worden herkenbaar: een aanvallende coach geeft meer en open momenten, een intensieve een sterke start en een zware slotfase, een slechte moraal laat de kop zakken na een tegengoal.
- Het beeld uit A speelt die momenten na; één moment per 2–4 seconden.
- Kosten: `engine/06` herschrijven (±15 KB), `test/stats.js`, `world.js`-tarieven (de rate van het portaal komt uit onze wedstrijden), `whyLines`, nieuw ijkharnas verplicht; rivalen houden `quickSim` of krijgen een lichte versie. Pijlers: P2, P7, P8.

**C. Tussenweg: echte spelers, zelfde kansen**
- De kansenmotor blijft, maar elke kans krijgt een **ketting** (wie had de bal, wie verloor hem) en blessures, wissels en rode kaarten gebeuren **tijdens** het duel en veranderen de sterkte voor de rest van de wedstrijd. De tellers van B42 komen uit de kettingen.
- Het beeld zoals in A.
- Kosten: `engine/06` uitbreiden, `test/stats.js` en het portaal opnieuw ijken. Pijlers: P2, P7.

## 7. Aanbeveling
**A eerst, daarna C.** A lost de grootste ergernissen op (lege stukken, stippen zonder betekenis, een momentum dat vooruitkijkt, een gezichtloze tegenstander) zonder de ijking of het portaal te raken. C maakt daarna de logica eerlijk (blessures en wissels tijdens het duel, tellers die kloppen) met het harnas als vangnet. B is mooi maar groot; pas als A en C bevallen.
