# L5 — Dynastie en generaties
**Status:** Eerste slice gebouwd (2026-11-25). Ontwerp: `standalone-research/FAMILIE-VOORZITTER.md` (keuze 76, Crusader Kings als bron, alleen wat beslismomenten oplevert).

## Gebouwd
- `club/family.js` (`S.family`): jij als personage (leeftijd, 2 eigenschappen), partner, 1–3 kinderen die elk seizoen ouder worden en een eigenschap erven.
- Familiemomenten (hoogstens één open, minstens 6 weken ertussen, elk soort hoogstens eens per seizoen; na 2 weken stilte geldt de standaardkeuze):
  kind kiest pad (academie → echte jeugdspeler in de selectie · business · eigen weg), "is je kind goed genoeg?" (coach beslist · meer speeltijd vragen = favoritisme · verhuren), familielid wil een functie (nepotisme kost vertrouwen), wie volgt je op, gezondheid (vanaf 65), nog een seizoen (vanaf 68).
- Opvolging na de ALV: de erfgenaam (of anders het oudste volwassen kind) moet zelf gekozen worden; stemaandeel uit ledenvertrouwen, reputatie en eigenschappen. Gekozen = generatie +1 bij dezelfde club; afgewezen = de familie zoekt een andere club.
- Club → Family & legacy: familiekaarten, erfgenaam, dynastieboek per generatie, recente familiegebeurtenissen; daaronder het clubboek (`club/legacy.js`).

## Nog niet
- Oude clubfamilies bij ledengroepen, vetes en verbonden die overgaan op de volgende generatie (L4/L5).
- Familieschandaal, huwelijk/verbond, kind dat breekt met de club.
- Overlijden; meerdere generaties tegelijk aan het werk.
