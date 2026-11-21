# Claude — reviewopdracht: Front Office FC vier lagen, club eerst

Je krijgt toegang tot het onderzoeksdossier op de `chatgpt`-branch. **Lees eerst `README.md` en het volledige Clubmanagement-onderzoek**, daarna de eerdere v1/v2-blueprints, audit en backlog. De actuele afspraak van 21 november heeft voorrang boven de oudere geïntegreerde ontwikkelvolgorde.

## Wat wordt van je verwacht?

**Eerst analyseren, niet implementeren of mergen.** Behandel het onderzoek kritisch als lead game designer én engineer van een bestaande werkende voetbalgame.

1. **Begrijp de spelvisie exact:** vier volwaardige, op zichzelf speelbare systemen, een voor een gebouwd, met integratiecontracten vanaf het begin. Gekozen voorzitter; ledenbezit, geen automatische familie-opvolging.
2. **Toets de voorgestelde Club-onderdelen op echte gameplay:** stadion, grond, trainings- en jeugdfaciliteiten, exploitatielasten, inkomsten, capaciteiten, onderhoud, bouwprojecten, investeringen, leningen, financiële herstelroutes en strategische trade-offs. Wat ontbreekt? Wat is onnodige bureaucratie? Wat wordt een spreadsheet zonder spel?
3. **Vergelijk de werkelijke bestaande code** op `claude-game`, `chatgpt` en relevante standalone-branches. Besteed extra aandacht aan `claude-game/src/projects.js`, `parties.js`, `agreements.js`, `src/engine/07-finance-transfers.js`, `src/engine/12-week.js`, `src/engine/14-save-api.js` en `src/engine/01-core.js`. Observeer `PARK`-flags en benoem code die aanwezig maar uitgeschakeld is. Lees de relevante tests; verwar broninspectie niet met browserplaytest.
4. **Daag het ontwerp uit:** welke keuzes kan een voorzitter zelfstandig werkelijk nemen? Wat is een goed speelsysteem in rustige en turbulente seizoenen? Is er een niet-lineaire duurzame economie? Hoe wint of verliest de speler zonder kunstmatige levels?
5. **Bewijsbaar geheel:** definieer ten minste drie verschillende clubstrategieën die onder dezelfde wereldregels levensvatbaar kunnen zijn (bv. gemeenschap/jeugd; financiële stabiliteit; sportief ambitieuze groei), en hoe dit getest kan worden.
6. **Compatibiliteit:** ontwerp minimale `ClubState`, `Facility`, `Asset`, `Project`, `Financing`, `Cashflow`, `ClubEvent` API's die later People/Board/Family toelaten, **zonder nu die systemen te ontwikkelen**.
7. **Risico's:** financieel dubbeltellen, fake execution, save/load-vastlopers, projectafwikkeling die twee keer triggert, verlies van oude saves, performance na 20–40 seizoenen en mobiele UX.
8. **Vermijd branch-bias:** kies op basis van daadwerkelijk actieve systemen en tests wat behouden, gerepareerd, hergebruikt of geschrapt wordt. Geen reset om een schoon prototype te kunnen maken.

## Lever je review op in deze structuur

- **De 10 belangrijkste gameplayproblemen** (ernst, code-/docbewijs, gevolgen, concrete oplossing).
- **Definitie van volwaardig Clubsysteem** (welke complete loop speelt een mens?).
- **Drie speelbare testsituaties** (tien weken, twee seizoenen, tien seizoenen).
- **Bestaande-code-hergebruikmatrix** met bewijsstatus.
- **Voorstel voor incrementele ontwikkeling** waarin iedere release zelfstandig speelbaar is.
- **Welke aannames uit het dossier je expliciet zou veranderen**, met onderbouwing.
- **Vragen die echt ontwerpkeuzes van de speler vereisen**, maximaal vijf; markeer de rest als beredeneerd voorstel.

**Geen cosmetisch overleg of algemene bevestiging.** Onderscheid code, test, historische claim en nieuw voorstel. Als je een test niet hebt uitgevoerd, zeg dat.

**Wijzig geen GitHub-branches of spelcode** totdat de gebruiker daar apart opdracht voor geeft.
