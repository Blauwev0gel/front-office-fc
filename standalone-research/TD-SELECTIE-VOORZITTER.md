# De TD en de selectie (ontwerp v0.1)

## De speler (simpel profiel, keuze 37)
- **Wat het model bijhoudt:** positie (GK, CB, FB, DM, CM, AM, W, ST), leeftijd, kwaliteit en potentieel, contract (jaren), loon per week, vorm en moraal, blessure, en één trek (leader, professional, temperamental, injury-prone, local hero).
- **Wat de speler ziet:** woorden. Kwaliteit wordt *poor / squad player / solid / key player / star*, de fase wordt *rising / at his peak / fading*.
- **Overgenomen uit `claude-game`:** de posities, de naburige posities (`NEAR`), de minimale bezetting (`REQ`) en het kiezen van de beste elf (`pickXI`). Een speler op een verkeerde positie speelt op ±0,6–0,85 van zijn kwaliteit.

## Teamsterkte
De gemiddelde kwaliteit van de beste elf, maal de fit per positie, plus moraal. **Een gat telt dus echt:** zonder fitte linksback speelt een centrale verdediger of middenvelder daar op 85%.

## Wat de TD elke week doet (alle vier, keuze 38)
1. **Gaten bijhouden.** Een plan met drie prioriteiten (positie, leeftijd, aflopend contract), herberekend elke week.
2. **Contracten verlengen.** Wie hij wil houden en wie onder het loonplafond past, verlengt hij in het voorjaar. De rest vertrekt in de zomer.
3. **Kopen en verkopen** in de windows, van zijn shortlist (de markt: spelers bij AI-clubs en vrije spelers), binnen budget, plafond, profiel en huisregel.
4. **Huren en uitlenen.** Jongeren met weinig speeltijd leent hij uit, en een acuut gat lost hij op met een huurling.

**Zijn persoonlijkheid kleurt zijn keuzes:**
- *koppig:* koopt geen huurlingen;
- *waarde geld:* verkoopt sneller;
- *voorzichtig:* koopt oudere, zekere spelers;
- *ambitieus:* gaat tot de rand van het budget.

## De kaders van de voorzitter (vier, keuze 39)
| Kader | Wat het doet |
|---|---|
| Transferbudget | Hij geeft niet meer uit dan dit; boven het budget laat hij een doelwit lopen (zichtbaar in de week) |
| Loonplafond | Bepaalt wie hij kan halen en houden; een ster boven het plafond vertrekt in de zomer |
| Profiel (youth / experience / value) | Bepaalt leeftijd en prijs van wie hij zoekt, en wie hij verkoopt |
| Huisregel | Bijvoorbeeld "never sell to our rival" of "five academy players in the squad"; hij weigert een hoger bod of houdt jongeren |

**Test:** elk kader moet meetbaar ander gedrag geven in leeftijd, prijs of aantal transfers. Lukt dat niet, dan wordt het kader geschrapt.

## Situaties voor de voorzitter
- **Coach tegen TD (keuze 40):** de coach klaagt over een gat dat de TD niet vult, of over een speler die hij niet wil. Afspraakkaarten:
  - de kant van de coach (het kader wijkt, de TD voelt zich gepasseerd);
  - de kant van de TD;
  - een compromis (een huurling, of een jongere die doorschuift).
- **Bestaande situaties** (een bod, een coach die wordt weggekocht) lezen nu de echte selectie.
- **Geen situatie, wel zichtbaar:** "boven budget" en "boven plafond" ziet de speler in de week als werk van de TD, niet als beslissing. Voelt dat in de playtest te passief, dan maken we er een situatie van.
