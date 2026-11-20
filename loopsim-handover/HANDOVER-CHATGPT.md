# Handover: loop-simulatie De Voorzitter (van Claude naar ChatGPT)

## Doel
Bepalen welke vorm van gameplay de sterkste basis is voor *De Voorzitter*. Het plezier moet komen uit het clubverhaal, uit bestuurlijke invloed die ertoe doet, en uit medewerkers die zelfstandig handelen.

Achtergrond in de repository `Blauwev0gel/front-office-fc`, branch `voorzitter-fundering`: `standalone-research/SPELLOOP-VOORZITTER.md` (het huidige plan, M1 hieronder). Verander niets aan de repository.

## Bestanden (in dit pakket)
| Bestand | Inhoud |
|---|---|
| `PREREG.md` | De vooraf vastgelegde opzet, modellen, meetpunten en hypothesen H1–H5 |
| `sim.py` | Eén gedeelde voetbalwereld en acht interactiemodellen (M0–M7). Common random numbers, zodat counterfactuals exact vergelijkbaar zijn. |
| `test_sim.py` | Controle van de meetketen: determinisme, een gedwongen gelijke keuze geeft een identieke run, de placebo is neutraal |
| `run_experiments.py` | Hoofdraster, gevoeligheidsvarianten en counterfactuals (multiprocessing) |
| `analyze.py` | De meetpunten, een robuustheidsanalyse over 10.000 willekeurige wegingen, impact per soort beslissing, en `results/metrics.md` |
| `stories.py` | Eén seizoen per model als leesbaar logboek |
| `results/metrics.md` | **Oude** resultaten, van vóór de laatste reparatie (zie hieronder) |

**Draaien:** `python3 test_sim.py && python3 run_experiments.py && python3 analyze.py && python3 stories.py > results/stories.md`
Dat duurt ±4 minuten op 4 kernen. `--quick` doet een kleine run.

## De modellen
| Id | Wat |
|---|---|
| M0 | Placebo: keuzes doen niets. Controle van de meetketen. |
| M1 | Kaartloop (SPELLOOP v1.0): 2–4 kaarten per week, negeren escaleert, 2 sms'jes per wedstrijd |
| M2 | Mandaat en delegatie: de staf lost alles op, 3 munten om te overrulen, een maandrapport (de trainer ontslaan alleen daar) |
| M3 | Crisisgedreven: alleen beslissen bij crisisdrempels; de rest doet de staf |
| M4 | Projecten en aandacht: 2 projecten per seizoen, elke week één aandachtspunt |
| M5 | Wedstrijdgericht: standpunt vooraf, sms in de rust, pers achteraf |
| M6 | Escalatie (hybride, vooraf ontworpen): de staf escaleert issues waar ze onzeker of verdeeld is, plus sms'jes bij grote wedstrijden |
| M7 | **Achteraf ontworpen, niet vooraf vastgelegd:** delegatie, crisismomenten zonder vermenigvuldiger, maandrapport, munten. Geen kaarten, geen sms'jes. |

## Status
- **Gedaan:**
  - opzet vooraf vastgelegd;
  - simulator en tests (alles groen);
  - een volledige run (37.760 runs, 9.991 counterfactuals) en de analyse, op de code van vóór de laatste reparatie.
- **Laatste reparaties, nog níét meegenomen in de resultaten:**
  1. Wachttijden voor terugkerende issues: "Sack the coach?" 6 weken, ledengroep 3 weken, ontevreden speler 4 weken. Daarvoor kwam de ontslagkaart elke week terug tijdens een slechte reeks (vier ontslagen in vier weken). Dat blies vooral de impact van M3 en M7 op.
  2. Een randgeval met een lege spelerslijst in `gen_issues` is opgelost.
- **Afgebroken:** de herhaalrun na deze reparaties. **Dit is de eerste stap.**

## Voorlopige resultaten (oude run, met voorbehoud)
- **M1 (het huidige plan):** de hoogste speelvaardigheid (alwetende speler 0,88 overleving tegen willekeurig 0,17), maar via massa: ±18 kaarten en ±58 sms'jes per seizoen.
  - Een sms heeft vrijwel geen effect (0,14 punt steun per keuze).
  - Een kaart wel (1,54).
  - De staf lost maar 3% zelf op.
  - Het zichtbare effect voorspelt het echte effect slecht (Spearman 0,18).
- **M5 (alleen rond de wedstrijd):** bijna geen speelvaardigheid (0,08). Een vaste regel is bijna even goed als slim spelen.
- **M3:** de hoogste impact per keuze (2,54), ook zonder vermenigvuldiger (2,11 bij ×1,0). **Timing weegt zwaarder dan omvang**, maar met maar ±6 beslissingen per seizoen.
- **M7 (achteraf):** won 57% van de willekeurige wegingen en stond in 91% bij de beste twee. Pas op: achteraf ontworpen en mogelijk door de ontslagfout opgeblazen.
- **Zonder M7** wint geen enkel model in meer dan 60% van de wegingen (H5 houdt stand): M3 44%, M2 26%, M1 20%.

## Wat er nog moet gebeuren
1. De run opnieuw draaien met de reparaties. Vergelijk dan vooral M3 en M7 met de oude cijfers.
2. Een kort kritisch rapport:
   - wat is aantoonbaar binnen dit model;
   - wat blijft speculatief (het plezier, het leesgemak voor een echte speler, de inhoud van kaarten);
   - de hypothesen H1–H5 beoordelen.
3. **Bekende beperkingen**, noem ze in het rapport:
   - **De wereld, de waarden van de opties en de wenselijkheidsdrempels in `analyze.py` zijn door Claude gekozen.** De winnaar kan afhangen van die drempels.
   - **De sms-effecten zijn klein gemodelleerd** (de variant `texts_x2` test dat alleen gedeeltelijk).
   - **Er komen in de wereld organisch maar ±0,6–1 issue per week op.** De 2–4 kaarten van SPELLOOP vragen dus 3–5 keer meer inhoud. Dat risico op opvulkaarten is een echte bevinding.
   - **De tijdschatting per seizoen is een aanname** (zie `TIME` in `sim.py`).
4. Optioneel: de originele ChatGPT-simulatie (1.260 runs) ernaast leggen. Die heeft Claude nooit ontvangen.

## Werkwijze
Houd het klein: één herhaalrun en één rapport van maximaal twee pagina's. Check eerst bij de eigenaar voordat je extra varianten draait.
