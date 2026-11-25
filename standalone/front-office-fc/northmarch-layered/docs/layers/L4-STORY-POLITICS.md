# L4 — Bestuur, politiek en verhalen
**Status:** Ontwerp; eerste mijlpaal M3b (de ALV als gespeeld moment). Referentiespel: `voorzitter/northmarch.html` (ALV, verkiezingen, momenten). In de gelaagde build bestaan al personen (`S.P`), ledengroepen, statuten en rivaliteiten.

## Wat we besproken hebben (D-G1, D-G5)
- **Elk seizoen een stemming** is de rode draad van het spel. Nu is de ALV een berekening met een balk in het seizoensrapport; in L4 wordt het het hoogtepunt van het seizoen.
- **De ALV als gespeeld moment (M3b):** jaarverslag, je beloftes uit het manifest (gehouden of gebroken), een korte toespraak met keuzes, de telling per ledengroep, en bij een stoppende voorzitter de kandidatuur van de erfgenaam (L5).
- **Oppositie en moties:** bij onvrede verzamelt een tegenkandidaat steun; ledengroepen dienen moties in die bindend zijn.
- **Momenten en afspraken:** ±5 per seizoen, uit de wereld getriggerd (trainer wankelt, ster wil weg, oppositie, investeerder); elk eindigt in een afspraak of een zichtbare "geen afspraak". Familiemomenten (L5) gebruiken hetzelfde systeem.
- **Geen nieuwe meters:** alles loopt via het bestaande ledenvertrouwen, de loyaliteit van personen en reputatie (D6).

## Gebouwd: momenten en afspraken (M3, 2026-11-25, `club/moments.js`)
- Zeven soorten clubmomenten, elk uit de echte staat van de club: **trainer onder druk** (slechte reeks of ver onder verwachting), **ster wil weg**, **contract van een ster loopt af**, **oppositie verzamelt handtekeningen** (vertrouwen < 58), **investeerder** (weinig kas of veel schuld), **aanvoerder** (na verkopen in de zomer), **sponsor met prestatieclausule**.
- Elke keuze is een **afspraak** met vier vaste regels: *You give · They give · Tested · If it fails*, of een zichtbare keuze zonder afspraak. Na twee weken stilte geldt de standaard.
- Afspraken liggen **op tafel** (weekscherm, met voortgang) en worden getoetst aan het echte seizoen: punten of zeges in N wedstrijden, vertrouwen boven een grens, de volgende thuiswedstrijd, een speler houden of verkopen in de winterwindow, wedstrijden voor een nieuw contract, eindpositie voor de sponsorbonus, geen verliesmaanden na een investering. Een beloofde verkoop wordt in de volgende zomer gehonoreerd of gebroken via de transferzomer.
- Gevolgen alleen via bestaande hefbomen: ledenvertrouwen, loyaliteit van de persoon, wil-weg, loon, reputatie, ontslag van de trainer, sponsorgeld.
- Eén moment tegelijk, gedeeld met familiemomenten; minstens 5 weken ertussen. Gemeten over 5 werelden: 2–5 momenten per seizoen.
- Gesloten afspraken komen terug in *Looking back* (gehouden of gebroken, met de reden).
