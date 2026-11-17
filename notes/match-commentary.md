# Het commentaarpaneel: beats, context en een vaste indeling

*17-11-2026, volgens `notes/PROMPT-match-commentary.md`. Prototype: https://claude.ai/artifact/DQCDSUEMLZrnwwV7azATrY (bron `notes/prototypes/match/matchday-wire.html`, tekstengine `notes/prototypes/match/beats-proto.js`). Volledige voorbeeldwedstrijd, gegenereerd op een echte save: `notes/match-commentary-example.txt`. Labels: **gelezen**, **gemeten**, **vermoed**.*

## 1. De grammatica van een moment
Een gebeurtenis wordt een korte reeks beats. De afloop staat nooit in de aanloop.

| Beat | Wat het zegt | Duur (gemeten in het prototype) |
|---|---|---|
| Aanloop | wie heeft de bal, waar ("Lowther wins it back and looks up.") | 0,55 s |
| Spanning | de pass of de voorzet, de schutter ("Marsden whips it in from the right…") | 0,6–0,7 s |
| Pauze | drie puntjes achter de spanningsregel; langer naarmate de kans groter is | 0,25 s + xG × 1,3 s |
| Afloop | goal, redding, mis, paal, blok ("Saved! Tanner at full stretch.") | goal 1,8 s, grote kans 0,9 s, anders 0,6 s |
| Naklank | wat het betekent ("0–2. The home end goes quiet." / "That is his third chance today.") | 0,75–1 s |

**Welke gebeurtenis welke beats krijgt:**
- **Goal:** aanloop (als de opbouwer een ander is dan maker en schutter), spanning, pauze, afloop, naklank.
- **Grote kans** (xG > 0,25): aanloop, spanning, pauze, afloop, en soms een naklank (altijd bij de derde kans van dezelfde speler).
- **Redding of kans van gemiddeld belang:** spanning en afloop.
- **Kleine poging:** één zin. Drie of meer van één ploeg binnen zes minuten worden samengevat in één regel.
- **Rode kaart:** afloop en naklank ("We play the last 22 minutes with ten").
- **Wissel, gele kaart, blessure, rustig stuk:** één zin.
- **Aftrap, rust en eindsignaal:** twee beats (de stand, dan wie beter was en het aantal schoten).

## 2. Het paneel (vaste maten)
- **Kopregel (30 px):** de minuut als gouden chip, en wie aanvalt in de kleur van de ploeg ("Kingford attack" / "Harwick on the ball").
- **Hoofdvak:** de beats van één moment, onderaan uitgelijnd. De nieuwste beat staat groot (19 px; een goal 24 px Oswald in de clubkleur, een naklank cursief); de vorige twee beats van hetzelfde moment staan klein erboven. Een nieuw moment begint met een leeg vak.
- **Contextregel (30 px):** één regel die het moment plaatst, in deze volgorde:
  1. druk ("Kingford pressing: 4 shots in ten minutes");
  2. een verhaal van de preview als die speler meedoet ("Cole: new signing");
  3. de laatste tien minuten ("7 minutes left");
  4. anders de verwachte goals tot nu toe.
- **Totale hoogte 196 px.** Gemeten: geen enkel paneel verschuift tijdens de wedstrijd of na het eindsignaal (390 px, licht).
- **De fout bij "Watch again" is opgelost:** het paneel, de context, de lijst en de cijfers worden helemaal leeggemaakt (gemeten: na de herstart staat alleen de aftrap).

## 3. Context en stem
- **Context:** de tekst gebruikt de stand voor en na, het aantal pogingen en goals van dezelfde speler, de gevaarlijke man (met een eigen naklank als hij scoort), de verhalen van de preview (`mdStories`: debuut, topscorer, terug van blessure, nieuwe aanwinst, onder druk), het publiek bij een vol stadion en de regen.
- **Stem:** Brits, droog en concreet ("Heads in hands on the bench.", "We got away with that.").
- **Geen verzonnen feiten:** in een eerste versie stond "he has scored more than anyone at Kingford"; dat stond niet in de gegevens en is eruit.
- **Afwisseling:** banken per beat en per kant, met een geheugen per wedstrijd. Nog niet gebouwd: een geheugen per week, en toon per derby of late winnaar.

## 4. Tien voorbeeldmomenten (uit de gegenereerde wedstrijd)
1. **Aftrap.** *Harwick Athletic v Kingford Borough. Kick-off.* · *Watch Jonas Doherty, their dangerous man.* ⟨Nobody expects anything from us⟩
2. **Goal van de tegenstander, van afstand.** *Quill carries it forward for Kingford.* · *Ellery rolls it to Marsden, twenty-five yards out…* · (pauze) · **Felix Marsden scores. Kingford lead.** · *0–1.*
3. **Goal van de tegenstander, kopbal.** *Lowther wins it back and looks up.* · *Marsden whips it in from the right…* · (pauze) · **Lewis Dunmore finishes. That hurts.** · *0–2. The home end goes quiet.*
4. **Onze goal, met een verhaal.** *Eccles wins it back and looks up.* · *It falls to Cole…* · (pauze) · **GOAL! Callum Cole buries it.** · *1–2.* ⟨Cole: new signing⟩
5. **Grote kans, gered.** *Through the middle for Kingford.* · *It falls to Dunmore…* · (pauze) · *Saved! Josh Tanner at full stretch.*
6. **Grote kans van ons, gemist.** *Pike carries it forward.* · *A cross from Meijer… Garside is waiting…* · (pauze) · *Wide!* · *He knows he should have scored.*
7. **Redding.** *Oakes lines one up from distance…* · *Saved! Dylan Dunmore gathers it.* ⟨Oakes: under pressure⟩
8. **Kleine poging.** *Marsden snatches at it. Wide.*
9. **Wissel.** *Jessop on, Oakes off, out on his feet.*
10. **Rust.** *Half-time. 0–1.* · *Kingford have had the better of it: 3 shots to 11.* ⟨Expected goals: 0.2 – 1.1⟩

## 5. Wat nog niet goed is
- **Duur:** met beats duurt de voorbeeldwedstrijd **55 seconden** (gemeten), tegen 35 zonder beats. Korter kan door minder kleine momenten te tonen of de beats nog strakker te maken; dat is een keuze voor de eigenaar.
- **De engine is nog niet geijkt:** de voorbeeldwedstrijd had 6 tegen 21 schoten. Het harnas `tools/matchlab.js` wacht op toestemming.
- **De donkere versie** heb ik in deze ronde niet op een screenshot bekeken (vermoed in orde: dezelfde tokens als de vorige versie, die in donker zonder fouten draaide).
- **Namen:** spelers van de tegenstander kunnen dezelfde achternaam hebben (kleine lijst).
