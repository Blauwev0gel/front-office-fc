# Transfer summer v3: audit en besluiten (17-11-2026)

Basis: `claude-game` @ `4686362`. Besloten door de eigenaar (4 vragen na de audit). Aanpak: kleinste samenhangende verbeteringen op de bestaande zomer-v2; geen nieuw scherm of systeem.

## Audit (kort)
| Onderdeel | Bevinding | Status |
|---|---|---|
| Vergadering, plan, brief, Plan A/B | `responses`/`applyChange`/`stance`, `buildPlan`, `makeBrief`/`applyBrief`; plan A/B wordt echt uitgevoerd (`planA`/`planB` in `recruit.js`) | BESTAAT EN WERKT |
| Ticker | Pipeline-regels komen uit `explain`; rustige weken gaven een willekeurige vulzin (3× bijna dezelfde) | ZWAK → gebouwd |
| Edition/debrief | KPI's + teamsterkte; geen onderscheid plan/uitvoering/marktpech; telt TD alleen op uitkomst | ZWAK → gebouwd |
| `dofStrikes` | wordt gezet in `sum2Talk('warn')`, nergens gelezen | DEFECT → gebouwd |
| `dof.data` | schuifje zonder effect in `dofPipeline`; "Question the misses" verschoof het | DEFECT → gebouwd |
| Netto-uitgaven-KPI | Leek het hele vorige seizoen mee te tellen. **Dat bleek een artefact van mijn eerste reproductie** (ik sloeg `startSeason` over); in de echte flow reset `startSeason` de totalen. Een veiligheids-snapshot (`s.ssB`) is toch toegevoegd en getest | geen defect; harmless vangnet |
| Deadline day | `ddClose` rondt open onderhandelingen af binnen de mandaten (`recForceSign`); niet verder onderzocht | BESTAAT, niet verder gevalideerd |
| Save/load | `G.sum` (inclusief `tk`, `dd`, `ssB`) wordt mee opgeslagen; getest midden in de ticker | BESTAAT EN WERKT |

## Besluiten en bouw
- **B28 Vijf oordelen in het debrief** (`summer2.js` `five()`, UI `ui/03`): plan gevolgd, uitvoering (grade A/B bij keuze), marktpech (doelwit elders/niet beschikbaar tegenover eigen regels), teamsterkte, geld (zomer-eigen netto tegenover afgesproken). Een waarschuwing telt niet als strike als het alleen marktpech was (de DoF zegt dat).
- **B29 Waarschuwingen worden een gesprek** (`talks.js`): bij twee strikes vraagt de DoF om een woord ("Back me or sack me"): steunen (strikes weg), laatste waarschuwing (één strike), of afscheid. Strikes vervallen met één per zomer (`init2`).
- **B30 Data-schuifje is een afweging** (`recruit.js` `dofPipeline`): data ≥ 70 beveelt geen laagvertrouwen-rapport aan; data ≤ 35 doet het ook zonder gat; ertussen alleen bij nood tijdens het window. Sluit D11 en een deel van D1.
- **Ticker:** een rustige week toont de stand van het plan (`planStatus`, uit `recPlanBoard`), alleen als die veranderd is; geen vulzinnen.
- **Gevonden regressie (eigen werk van de weekloop-sprint):** `weekloop.js` `heat()` riep `myPos()` aan in tussenfases (tabellen ongeldig) en kon de week laten crashen. Nu beschermd (alleen in het seizoen, `try/catch`).
- Test: `test/summer3.js` (baseline, geen herhaalregels of vulzinnen, save/load midden in de zomer, vijf oordelen, ultimatum-gesprek, data-gedreven DoF, twee zomers) en een echte klik-flow in de browser (390 px licht en 390 × 700 donker; meeting → ticker → deadline day → debrief).
- Niet gedaan: de vergadering inhoudelijk herschreven (geen aangetoond defect), D3 (Judgement/Network), D9, deadline day verder onderzocht.
