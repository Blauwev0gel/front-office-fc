# Vooraf vastgelegd: opzet, modellen, meetpunten, hypothesen

*Geschreven vóór de eerste run (21-11-2026). Wijzigingen na de eerste run staan onderaan, met reden.*

## Vraag
Welke vorm van gameplay is de sterkste basis voor De Voorzitter? Het spel is een voetbalclubspel waarin het plezier komt uit het clubverhaal, uit bestuurlijke invloed die ertoe doet, en uit medewerkers die zelfstandig handelen.

## Principes tegen een ingebouwde winnaar
1. **Eén wereld voor alle modellen.** Dezelfde club, competitie, wedstrijden, financiën, ledengroepen, staf, spelers en dezelfde gebeurtenissen, met dezelfde toevalsgetallen per (seed, seizoen, week, doel): *common random numbers*. Modellen verschillen alléén in **interactiestructuur**: wat de speler ziet, wanneer hij beslist, en wat er gebeurt als hij niet beslist.
2. **Dezelfde gesimuleerde spelers in elk model:** passief, willekeurig, fan, optimalisator op zichtbare info, en optimalisator die de verborgen gevolgen kent.
3. **Meetpunten vooraf vastgelegd**, per beslissing én per seizoen gerapporteerd. Er is geen vooraf gewogen eindscore. De winnaar wordt bepaald met een robuustheidsanalyse over 10.000 willekeurige wegingen en over variaties van de parameters.
4. **Een placebomodel (M0)** waarin keuzes niets doen. De meetketen moet daar ±0 invloed meten; zo niet, dan meet de keten zichzelf.
5. **Mijn eigen hybride model (M6)** is vóór de eerste run ontworpen en krijgt geen voorkeursbehandeling.

## Modellen
| Id | Naam | Interactiestructuur |
|---|---|---|
| M0 | Placebo | Als M1, maar de keuze wordt genegeerd: de staf beslist altijd |
| M1 | Kaartloop (SPELLOOP v1.0) | 2–4 kaarten per week moet je beantwoorden (negeren escaleert), 2 sms'jes per wedstrijd, de steun altijd zichtbaar met directe deltas |
| M2 | Mandaat en delegatie | Mandaat bij de start van het seizoen, de staf lost alles zelf op volgens het mandaat, maandrapport, 3 "politieke munten" per seizoen om de staf te overrulen, de trainer ontslaan alleen in het maandrapport |
| M3 | Crisisgedreven | Geen routine. Je beslist alleen bij crises (drempels overschreden), met grotere gevolgen; de rest lost de staf op |
| M4 | Projecten en aandacht | Je kiest 2 projecten per seizoen; elke week één aandachtspunt (project A, project B of "mensen": het belangrijkste issue zelf beslissen). Overige issues lost de staf op. |
| M5 | Wedstrijdgericht | Rond elke wedstrijd: een boodschap vooraf, een sms in de rust, een persstandpunt achteraf. Issues buiten het veld lost de staf op. |
| M6 | Escalatie (hybride) | Mandaat en staf lossen routine op. Alleen issues waar de staf onzeker is of het oneens is, of die buiten het mandaat vallen, komen bij jou (±2–3 per maand). Maandrapport met ontslagkeuze, sms'jes alleen bij grote wedstrijden. |

## Meetpunten (M = meting)
- **M-agency (speelvaardigheid):** het verschil in overleving en steun tussen de optimalisator en de willekeurige en passieve speler. Gewenst: duidelijk aanwezig, maar niet opgelost (de optimalisator overleeft minder dan 95%).
- **M-impact (doet een keuze ertoe):** counterfactual. Dezelfde run, één beslissing anders, dezelfde toevalsgetallen. Het verschil in steun aan het eind van het seizoen, en de kans dat de overleving omslaat.
- **M-lange termijn:** dezelfde counterfactual op +4 weken, aan het eind van het seizoen, en aan het eind van de horizon van drie seizoenen. Draagt een keuze door?
- **M-leesbaarheid:** de correlatie tussen het zichtbare directe effect van een keuze en het echte effect op de lange termijn (via de counterfactual). Eerlijke feedback betekent een positieve correlatie.
- **M-diepte:** het verschil tussen de optimalisator op zichtbare info en de optimalisator die alles weet. Nul is oppervlakkig; heel groot is onleesbaar.
- **M-dominante strategie:** komt een triviale vaste regel (altijd optie 0, altijd de beste zichtbare delta) binnen 95% van de beste optimalisator? Dan zijn de keuzes triviaal.
- **M-spanning:** het aandeel seizoenen met een bijna-mislukking (de steun ooit onder 52, de kas onder nul, of een ALV binnen ±6 van 50).
- **M-variatie:** de entropie van de soorten beslissingen, en het aantal verschillende verlopen van de steun per seizoen.
- **M-voetbalbinding:** het aandeel beslissingen dat over voetbal gaat (spelers, trainer, wedstrijd, jeugd, transfers), en het counterfactual-effect op punten.
- **M-autonomie van de staf:** het aandeel issues dat de staf zelf oplost, het verband tussen de kwaliteit van de staf en het seizoensresultaat, en de impact van stafbeslissingen van de voorzitter (ontslaan, overrulen).
- **M-tijd:** het geschatte aantal minuten per seizoen (beslissingen, lezen, kijken).

## Hypothesen (vóór de run)
- **H1:** M1 (kaarten) heeft de hoogste impact per seizoen, maar lage lange-termijnimpact per beslissing en een hoge tijdsbelasting.
- **H2:** M2 (delegatie) heeft de hoogste autonomie en lange-termijnimpact, maar ook de laagste spanning en voetbalbinding.
- **H3:** M5 (wedstrijdgericht) heeft de hoogste voetbalbinding, maar weinig speelvaardigheid, omdat sms'jes de uitslag maar een beetje beïnvloeden.
- **H4:** M0 (placebo) meet ±0 impact. Zo niet, dan is de meetketen fout.
- **H5:** Geen enkel model wint in meer dan 60% van de willekeurige wegingen. Wint er één wel, dan moet dat ook gelden bij variaties van de parameters.
