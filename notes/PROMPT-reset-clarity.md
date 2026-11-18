# Prompt: overzicht terug, en het bureau tiles-first

*Voor Claude op `claude-game`. Aanleiding: de eigenaar is de weg kwijt. "Ik weet niet eens meer wat nu echt ons spel is." Het homescherm is te druk. In twee dagen kwamen er veel systemen bij (B51–B59), en elk systeem kreeg een eigen blok op het bureau.*

---

Je werkt als game designer en UX-designer. Nederlands in het gesprek, Engels in het spel. Volg `CLAUDE.md`.

## Featurestop
Tot deze opdracht klaar is, komen er **geen nieuwe features of systemen** bij. Je verplaatst, voegt samen en vereenvoudigt. Je haalt geen gameplay weg zonder akkoord van de eigenaar.

## Stap 1: "Dit is ons spel" (oplevering: `notes/game-map.md`, hooguit 2 pagina's)
Schrijf het voor de eigenaar, niet voor een programmeur.
1. **Het spel in vijf zinnen:** wie je bent, wat je doet, waarom je doorspeelt.
2. **De week in één regel per stap,** van bureau tot krant.
3. **De schermkaart:** per tab (Inbox/bureau, Club, Squad, League, Depts) en per volledig scherm (wedstrijd, Gazette, zomer/winter, portal):
   - wat staat er en waarvoor dient het, in één zin;
   - hoe vaak zie je het (elke week, soms, zelden).
4. **Alle systemen in één tabel.** Per systeem: wat het voor de speler doet, waar je het ziet, sinds wanneer (B-nummer), en of het **zichtbaar en begrijpelijk** is (ja / half / nee). Neem expliciet de recente op:
   - stemmingen van de achterban (B51/B52);
   - het nieuwe wedstrijdscherm (B53);
   - geen Grip meer (B54);
   - het bureau (B55/B56);
   - Raise it yourself en afspraken (B57);
   - de initiatief-loop (CEO-2);
   - de eerlijke financiën bij transfers;
   - CEO met eigenaarsbevoegdheden en het trainingscomplex met de gemeente (B58/B59).
5. **Overlap en ruis:** wat staat dubbel, wat spreekt elkaar tegen, wat begrijpt een nieuwe speler niet. Voorbeelden van het huidige bureau:
   - te veel blokken onder elkaar: week, achterbannen, team, Raise it yourself, red box, wedstrijd, Gazette, Still running, links;
   - de coachregel "2.6 against 0.7. Not good enough" na een 1–3-nederlaag is zonder uitleg onbegrijpelijk;
   - een blessure als "Milestone".
6. **Wat is af, wat is half, wat zou weg mogen.** Doe een aanbeveling, maar besluit niet zelf.

Zeg bij elke bewering of je het **gelezen** (code) of **gezien** (screenshot) hebt. Maak screenshots van alle hoofdschermen op 390 px. Stop daarna en laat de kaart aan de eigenaar zien.

## Stap 2: het bureau tiles-first (oplevering: een prototype als artifact)
**Principes:**
- **Tiles, geen lappen tekst.** Elke tile beantwoordt één vraag, met een kop, één regel of één getal of status, en een tikdoel naar het detail.
- **Hooguit zes tiles** boven de vouw, plus **één** hoofdactie: *Next match*.
- **Geen paragrafen op het bureau.** De uitleg zit achter de tik, in het bestaande detailscherm.
- **Een vast raster:** 2 kolommen op 390 px; brede tiles alleen voor de red box en de wedstrijd. Vaste hoogtes, geen verspringen.
- Een rustige week ziet er rustig uit: minder tiles, niet lege tiles.
- De stijl van het spel: krantenroze, Oswald en Source Serif, licht en donker, tikdoelen ≥ 44 px, WCAG AA.

**Voorstel om te toetsen** (geen dwang):

| Tile | Vraag | Inhoud op de tile | Tik opent |
|---|---|---|---|
| **This week** (breed) | Wat voor week is het? | Kop + stand/doel | Weekdetail |
| **Red box** (breed) | Wat moet ik beslissen? | Aantal + de belangrijkste in één regel | Red box |
| **Next match** (breed, hoofdactie) | Wat staat er zaterdag op het spel? | Tegenstander, thuis/uit, de inzet | Voorbeschouwing |
| **Team** | Wat deden mijn mensen? | Het belangrijkste in één regel | De lijst |
| **Mood** | Hoe staan bestuur, fans, pers en spelers ervoor? | Vier stemmingen als iconen | Detailsheet |
| **Money** | Hoe staan we er financieel voor? | Kas + trend | Business |
| **Running** | Wat loopt er? | Aantal afspraken en projecten + de eerstvolgende datum | Still running |

*Raise it yourself* wordt geen eigen blok, maar een klein label op de tile waar het bij hoort: "1 thing you could raise" op Team, Running of Money.

**Lever op:**
- het prototype als artifact, gebouwd met de echte CSS-tokens en echte voorbeelddata van drie weken (rustig, crisis, grote wedstrijd);
- screenshots op 390 px in licht en donker;
- per huidig blok waar het naartoe gaat. Er verdwijnt niets zonder vervangende plek.

Stop daarna voor akkoord.

## Stap 3: bouwen, daarna de rest
- Na akkoord bouw je het bureau in `src/ui/10-inbox.js` en de CSS. Bestaande tests blijven groen.
- Doe een browsercheck op 390 px in licht en donker. Push en geef de previewlink.
- Daarna, **één tab tegelijk** en elke keer met akkoord, hetzelfde voor Club, Depts, Squad en League: één zin per scherm over waar het voor is, en tiles waar dat helpt.

## Regels
- Kort en concreet. Geen nieuwe meters, geen nieuwe schermen.
- Een tekst die alleen een programmeur begrijpt (xG zonder uitleg, technische labels) gaat eruit of krijgt gewone taal.
- Elke stap eindigt met iets wat de eigenaar kan **zien**: een kaart, een prototype of een preview.
