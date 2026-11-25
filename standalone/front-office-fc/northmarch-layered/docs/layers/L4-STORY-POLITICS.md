# L4 — Bestuur, politiek en verhalen
**Status:** In aanbouw: momenten en afspraken (M3) en de ALV als gespeeld moment (M3b) staan; oppositiekandidaat en meerdere moties volgen (M6). Referentiespel: `voorzitter/northmarch.html` (ALV, verkiezingen, momenten). In de gelaagde build bestaan al personen (`S.P`), ledengroepen, statuten en rivaliteiten.

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

## Gebouwd: de ALV als gespeeld moment (M3b, 2026-11-25, `club/agm.js`)
- Na week 30 vier stappen: **jaarverslag** (positie, geld, beloftes, gehouden/gebroken afspraken, wat de leden meewegen, en een voorspelling van de stemming) → **de zaal** (elke ledengroep met aandeel, verwachte steun en wens; de ongelukkigste groep dient haar motie in: steunen of bestrijden) → **je toespraak** (vier thema's: fouten erkennen, een gedurfde visie, de leden bedanken, de trainer de schuld geven; elk met winst en verlies per groep) → **de stemming**, met de telling per groep in het seizoensrapport.
- Alles beweegt de stemming van groepen en, gewogen naar hun aandeel, het bestaande ledenvertrouwen dat de stemming bepaalt. De houding in de zaal en de telling gebruiken dezelfde berekening.
- **Een aangenomen motie bindt:** een statuut waar dat bestaat (zoals "Ticket prices are set by the members"), anders een vastgelegde verplichting, met eventuele kosten. De **termijnlimiet** van de Old Guard werkt echt: na twee seizoenen moet je aftreden; een volwassen erfgenaam mag zich kandidaat stellen (L5), anders zoek je een andere club.
- **De gedurfde visie** legt de competitiebelofte van het volgende seizoen vast op Bold.
