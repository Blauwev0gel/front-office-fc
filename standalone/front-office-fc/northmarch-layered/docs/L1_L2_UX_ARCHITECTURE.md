# L1/L2 UX-architectuur

Status: **geïmplementeerd en getest** (zie `L1_L2_PLAYTEST_REPORT.md`). Scope: alleen L1 en L2; alle acties via `cmd()`.
Bouwt voort op het parallelle werk (commits `590c93b`, `16ad05e`, `001e224`: overzichtstegels, stafvergelijking), dat is samengevoegd in `5cadb5e`.

## Navigatie (hoofdtabs, op volgorde van bestuurlijke prioriteit)
| Tab | Inhoud | Waarom |
|---|---|---|
| **Week** | verslag (uitslag, verwachte goals, positie ▲▼, gebeurtenissen) → *Needs attention now* (urgent) → volgende wedstrijd(en) met kansen → *Worth a look* → seizoensdoelen | de wekelijkse lus; urgent en informatief gescheiden |
| **Club** | subnavigatie **Overview · Football · Departments · Ground · Members** | de bestuurskamer: eerst overzicht, dan per verantwoordelijkheid |
| **Squad** | sterkte, loonsom, gaten, kader (link naar begroting), verhuurd, spelers | wat de directeur met jouw kader doet |
| **Money** | **Overview · Budget · Income · Funding** (grootboek via Overview) | geld in vier vragen: hoe staan we, wat is het plan, waar komt het vandaan, hoe financieren we |
| **League** | 3 divisies, Cup, Market, History | de wereld |

Vaste **actiebalk** onderaan op elk hoofdscherm: volgende tegenstander + *Play week N* of *Close the season*. Nooit meer scrollen om te spelen.

## Club → Overview (bestuurlijk overzicht)
Tegels: competitie (positie + doel), kas (prognose, resultaat), ledenvertrouwen (ALV-prognose), voetbal (trainer/directeur in sterren). Daaronder:
*Board watch* (urgente signalen, met link), afdelingsraster (8, groen/rood t.o.v. divisie, personeelsniveau), grond en projecten (met voortgangsbalk),
*Your decisions* (besluitenlog), vergelijking met de divisie, clubidentiteit en historie. Voor een nieuwe voorzitter: een oriëntatiekaart *Your job as chairman* met vijf links.

## Beslisblok (overal hetzelfde)
`Now · Each week · Takes effect · Can bring · Risk · Check it` — alleen getallen die de simulatie echt gebruikt; onzekerheid in woorden.
Toegepast bij: afdelingspersoneel (fee, weekkosten, 3 weken), afdelingsbudget (direct), werkwijze (30 weken), bouwprojecten (weekbedrag),
leningen (weekbedrag + totale rente), obligatie (weekbedrag vs bankrente), sponsors (seizoens- en looptijdwaarde, prestatiebandbreedte),
ticketprijzen (verwachte opkomst, recette per thuisduel, ledenreactie), contributie (leden nu, richting, inkomen), loonlimiet (ruimte, wanneer),
nieuw stadion (aanbetaling, weekbedrag, duur, extra plaatsen, of de vraag er is), trainer/directeur (vergelijking met huidige, kosten vooraf, loonverschil).

## Gevolgen terugzien
- **Besluitenlog** (`S.journal`, engine `src/club/journal.js`): elk spelerscommando met één meetwaarde op dat moment; later *toen → nu* met de zin
  "Other things change too: read the measures as pointers, not proof." Geen causaliteit geclaimd.
- Afdelingen tonen hun prestatie tegen de divisie; projecten hun voortgang; historie per seizoen; seizoensreview per doel gehaald/gemist.

## Seizoensafsluiting
ALV (stemming, oorzaken) → doelen per doel → stand en geld → wereld → zomer (instroom, transfers) → **vooruitblik** (nieuwe doelen, begroting, lopende bouw, wachtende keuzes).

## Ontwerpregels
1. Geen nieuwe L3–L5-systemen, geen actiepunten, geen verplichte weekhandelingen.
2. Elk scherm volgt: situatie → beoordeling → opties → gevolgen → besluit → feedback.
3. Geen verzonnen voorspellingen; onzekerheid benoemen.
4. 390 px eerst: rasters in plaats van overlopende rijen, tikdoelen ≥ 44 px, overlays sluiten met Close of Escape.
