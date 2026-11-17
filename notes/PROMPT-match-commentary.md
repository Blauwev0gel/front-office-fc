# Prompt: het commentaarpaneel, spannend in plaats van een logregel

*Voor Claude op `claude-game`. Vervolg op `notes/match-engine-design.md` en het prototype `notes/prototypes/match/matchday-wire.html` (artifact https://claude.ai/artifact/DQCDSUEMLZrnwwV7azATrY).*

---

Je werkt als **game developer** van *The Front Office* volgens `CLAUDE.md`, met de blik van een **schrijver van wedstrijdcommentaar** en een **interactiedesigner**. Nederlands in het gesprek, Engels in het spel.

## Wat er nu mis is (screenshot van de eigenaar)
Het commentaarpaneel toont twee losse regels: een gedimde vorige en een grotere nieuwe. Dat is een logboek, geen wedstrijd.
- **Geen spanning:** een kans staat er in één keer, met de afloop erbij ("Ellery shoots, Tanner is there"). Je hoeft nergens op te wachten.
- **Geen opbouw:** de engine weet wie opbouwt, wie het maakt en wie schiet, maar de tekst gooit dat weg.
- **Geen context:** wat betekent dit moment (de stand, de minuut, wat er op het spel staat, wie al twee keer miste)?
- **Veel lege ruimte:** het paneel is een groot vak met één regel; bij de aftrap staat er bijna niets.
- **Een fout:** na "Watch again" bleef de vorige regel van de vorige wedstrijd staan (68') naast de aftrap van de nieuwe (0').

## Het doel
Het paneel moet aanvoelen als het moment dat je de adem inhoudt: een aanval bouwt op in twee of drie korte regels, er valt een stilte, en dan de afloop. Rustige stukken gaan snel en zeggen kort wat er speelt. De tekst kent de spelers, de stand en de verhalen van deze week. **Panelen blijven op hun plek en houden hun hoogte**: alleen de inhoud verandert.

## Lees eerst
1. `BIBLE.md`: P1 (geen ingrijpen), P4 (druk voel je), P5 (kort en leesbaar, hooguit twee zinnen per blok), P7 (mensen hebben een eigen wil), P8 (de club is een verhaal); B26 (waarom), B27 (rust), B51–B52 (stemmingen).
2. `notes/match-engine-design.md` (deel 2 en 3) en `notes/match-example.txt`.
3. De prototypes: `notes/prototypes/match/match-proto.js` (welke gegevens elke gebeurtenis al heeft: opbouwer, maker, stopper, schutter, soort schot, flank, xG, stand), `text-proto.js` en `matchday-wire.html`.
4. In het spel: `src/matchtalk.js` (`HOOK.say`, de gevaarlijke man), `src/matchday.js` (`mdStories`, kantelpunt), `src/ui/14-matchday-gazette.js`.

## Wat je ontwerpt

### 1. De grammatica van een moment (beats)
Een gebeurtenis wordt een korte reeks **beats** met een eigen timing:
- **Aanloop** (alleen bij kansen die ertoe doen): wie heeft de bal, waar ("Ingham picks it up on the right…").
- **Spanning**: de pass of de voorzet, de schutter ("…whips it in, Garside is waiting…").
- **Pauze**: een korte stilte, langer naarmate de kans groter is.
- **Afloop**: goal, redding, paal, mis, blok, met een reactie ("…saved! Dunmore at full stretch.").
- **Naklank** (soms): het publiek, de bank, wat het betekent ("The away end goes quiet." / "That is his third chance tonight.").

Leg vast welke gebeurtenissen alle beats krijgen (goal, grote kans, rode kaart, penalty, late gelijkmaker) en welke één regel (kleine kans, wissel, gele kaart). De engine levert de gegevens; de tekst verdeelt ze over de beats. **De afloop staat nooit in de aanloop.**

### 2. Het paneel (opnieuw ingedeeld, vaste maten)
Ontwerp een vaste indeling in plaats van "vorige regel / nieuwe regel". Bijvoorbeeld:
- een **kopregel** met de minuut en wie aanvalt (kleur van de ploeg);
- het **hoofdvak** waarin de beats van één moment elkaar opvolgen (de nieuwste beat het grootst, de vorige beats van hetzelfde moment erboven klein);
- een **contextregel** onderaan die rustig wisselt: de stand van het duel ("Kingford pressing: 4 shots in 10 minutes"), een verhaal ("Garside: first start since his injury"), het weer of het publiek.
Bij de aftrap staat er een sterk begin (de opstellingen in één regel, de gevaarlijke man, wat er op het spel staat), geen half leeg vak. Lijn met de rest van het scherm uit, en houd 390 px, licht en donker, `prefers-reduced-motion` (beats zonder animatie, alleen de tekst) en WCAG AA aan. Reset alles bij "Watch again".

### 3. Engaging tekst
- **Context in elke regel die ertoe doet:** de stand, de minuut, wie eerder miste of scoorde, de gevaarlijke man, de verhalen van de preview, een debutant, een oud-speler.
- **Een eigen stem:** Brits voetbalcommentaar, droog en concreet, zonder clichés te stapelen; licht ironisch zoals de rest van het spel (de Gazette, de stemmen in `loop.js`).
- **Tempo:** rustige stukken in één korte regel samengevat; de klok versnelt. Grote momenten krijgen de tijd.
- **Afwisseling:** tekstbanken per beat en per situatie (vroeg en laat, voor en achter, derby, regen, vol stadion), met een geheugen per wedstrijd en per week.
- **Het spoor van de CEO:** hooguit twee regels per wedstrijd, alleen als het uit de engine volgt.
- **Echt materiaal:** fictieve namen, geen echte spelers, clubs, merken of letterlijk commentaar uit andere spellen.

### 4. Wat de engine moet leveren
Controleer of elke gebeurtenis genoeg heeft voor de beats (wie, waar, hoe, hoe groot, de stand ervoor en erna, eerdere pogingen van dezelfde speler). Vul aan wat ontbreekt in `match-proto.js`, zonder de ijkdoelen te raken.

## Oplevering, in deze volgorde
1. **Notitie** `notes/match-commentary.md`: de beatgrammatica (per gebeurtenistype welke beats en hoe lang), de nieuwe indeling van het paneel met maten, de regels voor context en stem, en tien voorbeeldmomenten (goal, grote kans, redding, paal, rood, wissel, rustig stuk, aftrap, rust, eindsignaal).
2. **Een volledige voorbeeldwedstrijd** als beatlijst, gegenereerd door de tekstengine op een echte save (niet met de hand).
3. **Het prototype bijgewerkt** (zelfde artifact-URL) met de beats, het nieuwe paneel en de reset-fout opgelost. Meet dat geen paneel verschuift (zoals in de vorige check) en hoe lang de wedstrijd duurt.
4. **Hooguit vier vragen** aan de eigenaar, met jouw aanbeveling bovenaan (in tekst als de vraagtool niet werkt). Bijvoorbeeld: hoeveel beats per groot moment, hoe lang een wedstrijd mag duren nu momenten langer duren, of er een tweede stem (co-commentator) komt.

## Regels
- Zeg bij elke bewering of je het **gelezen**, **gemeten** of **vermoed** hebt.
- Geen seizoensruns; het ijkharnas alleen na toestemming.
- Bouw niets in het spel zelf voordat de eigenaar het prototype heeft goedgekeurd.
