# De fundering (De Voorzitter, ontwerp v0.1)

*19-11-2026, branch `voorzitter-fundering`. Keuzes van de eigenaar staan in §13 van het concept (37–43).*

## Twee lagen
- **De fundering (`club/`):** de club draait vanzelf, week na week. De selectie veroudert, raakt geblesseerd en verliest vorm. Contracten lopen af. De TD doet zijn werk en de coach kiest de beste elf. De fundering weet niets van de voorzitter.
- **De laag (`chairman/`):** het bureau met situaties, afspraken, manifest, ALV, verkiezing en de regio met geheugen. Die laag leest de fundering via een klein koppelvlak: `needs()`, `tdPlan()`, `events(week)` en `setFrame(k,v)`.

## Een week (30 per seizoen, plus een zomer)
**Eén weekscherm:**
1. **De kop van de Echo.**
2. **This week at the club:** drie regels uit de events van de fundering, bijvoorbeeld *"Ward renewed the keeper"*, *"Okafor injured, three weeks"*, *"Ward passed on Agyeman: over your wage cap"*.
3. **On your desk:** 0–2 situaties, alleen als er echt iets speelt.
4. **De wedstrijdkaart** met één knop, daarna de uitslag met twee regels waarom.

Een stille week kost één tik. De ALV sluit het seizoen af.

## Transferwindows
- **Zomer:** voor week 1, één samenvattend scherm met wat de TD deed.
- **Winter:** weken 15–17.
- **Daartussen** alleen contracten, vrije spelers en uitleenbeurten.

## Wat de voorzitter ziet
- **The squad:** spelers per positie in woorden, de gaten, het plan van de TD en de kaders. Dit scherm is om te kijken; je stuurt geen spelers.
- Situaties op het bureau, zoals in `northmarch.html`, aangevuld met **coach tegen TD** (keuze van de eigenaar).

## Wat dit oplevert voor de voorzitter
- **Binding:** elke week je eigen club, je spelers, een uitslag met een oorzaak.
- **Zichtbaar werk:** de TD doet wat hij doet, en jij ziet het en kunt het terugvoeren op je kaders.
- **Nieuwe situaties uit echte staat:** een conflict tussen coach en TD over een gat; een bod op een speler die je kaders raakt.
