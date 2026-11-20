# Leeswijzer De Voorzitter: wat een LLM moet lezen om bij te zijn

*Bijgewerkt 21-11-2026.*

**Waar het staat**
- Repo: `blauwev0gel/front-office-fc`
- Branch: **`voorzitter-fundering`**
- Spel: `standalone/front-office-fc/voorzitter-fundering/`
- Ontwerp: `standalone-research/`

**Wat het is:** *De Voorzitter*, een nieuw concept naast The Front Office.
- Je bent gekozen voorzitter van een fictieve ledenclub in de Northmarch.
- Je kiest geen spelers en geen opstelling. Je zet kaders (het mandaat), kiest je mensen en oordeelt.
- Single-file HTML, vanilla JS, offline. Communicatie in het Nederlands, de UI van het spel in het Engels.

Basis voor de links: `https://github.com/blauwev0gel/front-office-fc/blob/voorzitter-fundering/`

---

## 1. Altijd eerst (± 15 minuten lezen)
| # | Bestand | Waarom |
|---|---|---|
| 1 | [`standalone-research/LEESWIJZER-VOORZITTER.md`](https://github.com/blauwev0gel/front-office-fc/blob/voorzitter-fundering/standalone-research/LEESWIJZER-VOORZITTER.md) | Dit bestand |
| 2 | [`standalone-research/CONCEPT-VOORZITTER-2026-11-18.md`](https://github.com/blauwev0gel/front-office-fc/blob/voorzitter-fundering/standalone-research/CONCEPT-VOORZITTER-2026-11-18.md) | **Bron van waarheid.** §13 bevat de bindende keuzes van de eigenaar (1–70); hoe hoger het nummer, hoe recenter. Bij een conflict wint de laatste keuze. |
| 3 | [`standalone-research/PROMPT-ECHT-SPEL-VOORZITTER.md`](https://github.com/blauwev0gel/front-office-fc/blob/voorzitter-fundering/standalone-research/PROMPT-ECHT-SPEL-VOORZITTER.md) | De kernzin, de vijf pijlers met speeltests, en de harde grenzen (een week duurt 30–60 s, een seizoen 20–30 min) |
| 4 | [`CLAUDE.md`](https://github.com/blauwev0gel/front-office-fc/blob/voorzitter-fundering/CLAUDE.md) | De werkwijze: de loop per feature, de definition of done, de houding. Let op: de branchregels daarin gelden voor `claude-game`. Dit spoor werkt alleen op `voorzitter-fundering`. |

## 2. Per systeem (lees wat je taak raakt)
| Systeem | Ontwerp | Code (`voorzitter-fundering/src/`) |
|---|---|---|
| **De opening** (nieuwkomer, dossiers, geheim, handtekening, speech, eerste crisis) | [`PROMPT-OPENING-VOORZITTER.md`](https://github.com/blauwev0gel/front-office-fc/blob/voorzitter-fundering/standalone-research/PROMPT-OPENING-VOORZITTER.md) · template [`templates/opening-templates.html`](https://github.com/blauwev0gel/front-office-fc/blob/voorzitter-fundering/standalone-research/templates/opening-templates.html) | `chairman/opening.js`, `ui/opening.js` |
| **De TD** (profiel, filosofie, verborgen vakmanschap, aannemen) | [`TD-VOORZITTER.md`](https://github.com/blauwev0gel/front-office-fc/blob/voorzitter-fundering/standalone-research/TD-VOORZITTER.md) (v0.5) · [`ONDERZOEK-TD-VOORZITTER.md`](https://github.com/blauwev0gel/front-office-fc/blob/voorzitter-fundering/standalone-research/ONDERZOEK-TD-VOORZITTER.md) · [`PAPIER-TRANSFERZOMER.md`](https://github.com/blauwev0gel/front-office-fc/blob/voorzitter-fundering/standalone-research/PAPIER-TRANSFERZOMER.md) | `club/td.js`, `ui/transfer.js` (`tdHireView`, `staffBody`) |
| **De transferzomer** (vergadering, brief, transfer centre, editie, debrief, winter) | [`PROMPT-TRANSFERZOMER-VOORZITTER.md`](https://github.com/blauwev0gel/front-office-fc/blob/voorzitter-fundering/standalone-research/PROMPT-TRANSFERZOMER-VOORZITTER.md) · template [`templates/zomer-templates.html`](https://github.com/blauwev0gel/front-office-fc/blob/voorzitter-fundering/standalone-research/templates/zomer-templates.html) | `club/summer.js` (clublaag), `chairman/transfer.js`, `chairman/meeting.js` (mandaat, `tdAssessment`), `ui/transfer.js` |
| **De fundering** (de club zonder voorzitter: selectie, week, financiën, markt) | [`FUNDERING-VOORZITTER.md`](https://github.com/blauwev0gel/front-office-fc/blob/voorzitter-fundering/standalone-research/FUNDERING-VOORZITTER.md) · [`TD-SELECTIE-VOORZITTER.md`](https://github.com/blauwev0gel/front-office-fc/blob/voorzitter-fundering/standalone-research/TD-SELECTIE-VOORZITTER.md) | `club/players.js`, `club/club.js`, `club/market.js`, `club/finance.js`, `club/stories.js` |
| **De wereld en de identiteit** (32 clubs, wapens, kleuren, portretten) | [`WERELD-VOORZITTER.md`](https://github.com/blauwev0gel/front-office-fc/blob/voorzitter-fundering/standalone-research/WERELD-VOORZITTER.md) · [`IDENTITEIT-VOORZITTER.md`](https://github.com/blauwev0gel/front-office-fc/blob/voorzitter-fundering/standalone-research/IDENTITEIT-VOORZITTER.md) | `world/world.js`, `world/identity.js`, `world/football.js`, `world/news.js`, `core/content.js` |
| **De week en de feed** (nieuwskaarten, reacties) | [`FEED-VOORZITTER.md`](https://github.com/blauwev0gel/front-office-fc/blob/voorzitter-fundering/standalone-research/FEED-VOORZITTER.md) · [`WEDSTRIJD-VOORZITTER.md`](https://github.com/blauwev0gel/front-office-fc/blob/voorzitter-fundering/standalone-research/WEDSTRIJD-VOORZITTER.md) | `club/feed.js`, `chairman/reactions.js`, `chairman/flow.js` |
| **Situaties en afspraken** (*In the post*) | [`AFSPRAAK-VOORZITTER.md`](https://github.com/blauwev0gel/front-office-fc/blob/voorzitter-fundering/standalone-research/AFSPRAAK-VOORZITTER.md) · [`PERSONEN-VOORZITTER.md`](https://github.com/blauwev0gel/front-office-fc/blob/voorzitter-fundering/standalone-research/PERSONEN-VOORZITTER.md) | `chairman/situations.js`, `chairman/cards.js`, `chairman/state.js` (loyaliteit) |
| **Beloftes en de ALV** | [`ALV-VOORZITTER.md`](https://github.com/blauwev0gel/front-office-fc/blob/voorzitter-fundering/standalone-research/ALV-VOORZITTER.md) · [`OPPOSITIE-VOORZITTER.md`](https://github.com/blauwev0gel/front-office-fc/blob/voorzitter-fundering/standalone-research/OPPOSITIE-VOORZITTER.md) | `chairman/promises.js`, `chairman/flow.js` (ALV) |
| **Look en feel** (programmalook, mobiel, speels) | [`PROMPT-WARMTE-VOORZITTER.md`](https://github.com/blauwev0gel/front-office-fc/blob/voorzitter-fundering/standalone-research/PROMPT-WARMTE-VOORZITTER.md) · [`PROMPT-SPEELS-VOORZITTER.md`](https://github.com/blauwev0gel/front-office-fc/blob/voorzitter-fundering/standalone-research/PROMPT-SPEELS-VOORZITTER.md) (geparkeerd; het doelbeeld staat in [`templates/speels-templates.html`](https://github.com/blauwev0gel/front-office-fc/blob/voorzitter-fundering/standalone-research/templates/speels-templates.html)) | `style/main.css`, `ui/render.js` |
| **Later** (seizoensboog, inzet, upgradeboom) | [`SEIZOENSBOOG-VOORZITTER.md`](https://github.com/blauwev0gel/front-office-fc/blob/voorzitter-fundering/standalone-research/SEIZOENSBOOG-VOORZITTER.md) · [`INZET-VOORZITTER.md`](https://github.com/blauwev0gel/front-office-fc/blob/voorzitter-fundering/standalone-research/INZET-VOORZITTER.md) · [`UPGRADES-VOORZITTER.md`](https://github.com/blauwev0gel/front-office-fc/blob/voorzitter-fundering/standalone-research/UPGRADES-VOORZITTER.md) | nog niet gebouwd |

De overige `.md`-bestanden in `standalone-research/` zijn eerdere stappen (gesprek, moment, regelset, clubs, roadmap, de handover van 18-11). Lees ze alleen als een keuze in §13 ernaar verwijst.

## 3. Bouwen en testen
- **Build:** `cd standalone/front-office-fc/voorzitter-fundering && node build.js`. Dat maakt `dist/index.html` (volledig) en `dist/artifact.html` (fragment).
- **Volgorde van de modules:** de lijst in [`build.js`](https://github.com/blauwev0gel/front-office-fc/blob/voorzitter-fundering/standalone/front-office-fc/voorzitter-fundering/build.js). Alles wordt één script met één scope.
- **Lagen:**
  - `core` → `world` → `club` (weet niets van de voorzitter) → `chairman` → `ui`.
  - De clublaag draait zonder voorzitter.
  - Alle toeval loopt via de seeded `rnd()`, nooit `Math.random`.
- **Tests** in `tests/`:

| Test | Wat hij doet |
|---|---|
| `foundation-test.js` | Drie seizoenen zonder voorzitter; deterministisch |
| `chairman-audit.js` | Bots (actief, passief, willekeurig) over 20 seeds |
| `td-test.js` | Filosofie, vakmanschap, zomer, oordeel, winter |
| `opening-test.js` | Van titelscherm tot vergadering, de geheimen, de leestijd |
| `identity-test.js` | Contrast en unieke wapens |
| `mobile-audit.js` | Playwright op 390 px: tikdoelen, tekstgrootte, screenshots |
| `ui-season.js` | Een heel seizoen in de browser, licht en donker |

- **Bekend open punt:** `opening-test` meldt een geschatte duur van ±5,3 minuten tegen het doel van 3–5. De zomervergadering compacter maken is een keuze van de eigenaar.

## 4. Stand van zaken en volgende stappen
- **Gebouwd:**
  - de opening als avontuur (keuze 69);
  - de TD met aannemen en profiel (keuze 65–67);
  - de transferzomer met brief, transfer centre, editie en debrief (keuze 68 en 70);
  - de Staff-tab.
- **Volgende stap:** het oordeel over de TD in juni (Keep/Warn/Sack, ontslaan alleen in de zomer, drie kandidaten), op basis van strikes en Hit/Miss. Daarna de maandmeeting met de TD.
- **Geparkeerd:** de speelse UI uit `PROMPT-SPEELS` (keuze 64), en pijlers 3–5 (seizoensboog en beker, inzet en balans, upgradeboom).
- **Niet aanraken:** `main`, `claude-game` en `chatgpt`. Dit spoor staat op zichzelf.
