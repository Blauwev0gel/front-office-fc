# NORTHMARCH — centrale documentatie voor de nieuwe game

**Status:** vastgelegde spelvisie, aanpak en uitvoerende masterprompt. **Nog geen gerealiseerde nieuwe spelbuild.**
**Datum:** 21 november 2026.

## Begin hier

1. `NORTHMARCH_ARCHITECTUUR_EN_BOUWAANPAK_V1.md` — de vaste spelvisie: een echte simulatie met daarboven clubmanagement, staff, verhalen en dynastie.
2. **`NORTHMARCH_LAGEN_PROTOCOL_EN_UITVOERPROMPT_V1.md` — de actuele leidende werkwijzeprompt.** Verplicht per laag: inventarisatie → gerichte ontwerpvragen → laagcontract → implementatie → bewijs → speelbare release.
3. `NORTHMARCH_MASTERPROMPT_GELAAGDE_FOOTBALMANAGER_V1.md` — oudere brede uitvoerprompt, historisch/aanvullend. Gebruik het nieuwe lagenprotocol voor de werkvolgorde.

**LET OP:** vijf product-/gameplaylagen, zeven gescheiden domein-speellagen en tijdslagen zijn verschillende classificaties. Het nieuwe lagenprotocol legt het onderscheid uit en voorkomt een nieuwe rewrite of vrijblijvende audit.

De kern: **een zelfstandig functionerende voetbal- en clubmanagementgame (ook met verhalen uitgeschakeld), met daarboven staff/autonomie, de bestaande Northmarch-verhaalengine en later dynastieën**. De bestaande spelcode is de basis; geen herstart of weggooien van werkende onderdelen.

## Repository, branches en exacte bestanden

Repository: `Blauwev0gel/front-office-fc`.

**Primaire bestaande game waar de nieuwe versie op voortbouwt**
- Branch: `claude/loving-goodall-uv00vn`
- Bestand: `standalone/front-office-fc/voorzitter/northmarch.html`
- Gecontroleerde SHA: `7a2d5d3a8efb58ea05759e8d3b86d305bb3d8673`

**Andere belangrijke bron van functionerende modules**
- Branch: `voorzitter-fundering`
- Code: `standalone/front-office-fc/voorzitter-fundering/src/`
- Build: `standalone/front-office-fc/voorzitter-fundering/dist/index.html`
- Tests: `standalone/front-office-fc/voorzitter-fundering/tests/`
- Onderzoek: `standalone-research/`

**Historisch vierlagenonderzoek (niet verwarren met nieuwste gameversie)**
- Branch: `chatgpt`
- Map: `design/research/front-office-fc-four-layers-2026-11/`
- Begin daar met `ACTUELE_GAME_ENGINE_EN_SPELLAGEN_AUDIT.md`; oude vierlagen-blauwdrukken zijn niet leidend voor de actuele broncode.

Overige branches `claude-game`, `main`, `feature/situation-driven-weekloop`, `feature/transfer-summer-v3` en `fix/redbox-decisions-no-action-points` kunnen relevante herbruikbare systemen bevatten. Zie masterprompt voor de gerichte code-inventarisatie.

## Instructie aan een opvolgende LLM

1. **Lees de twee documenten in deze map volledig.**
2. Inspecteer eerst de genoemde Loving Goodall-game en behoud haar bestaande verhaal-, personen- en bestuursfundering.
3. Kijk vervolgens gericht welke werkende modules uit de andere branches kunnen worden hergebruikt; onderscheid code, testbewijs en ontwerphypothesen.
4. Stel de gebruiker uitsluitend wezenlijke ontwerpvragen en leg de antwoorden vast voordat je de nieuwe game construeert.
5. Bouw een zelfstandige voetbal-/clubengine met echte managementkeuzes; staff-, verhalen- en dynastiesystemen zijn daarop aansluitende lagen, geen vereiste om de basiswereld te laten draaien.
6. Gebruik een aparte nieuwe ontwikkelbranch. Wijzig of merge geen bestaande spelbranches zonder expliciete toestemming. Lever geen ongeteste of onafgemaakte game als eindproduct.

**Deze map is bewust documentatie op de `chatgpt`-branch.** Het publiceren van deze bestanden betekent niet dat de huidige Loving Goodall-game is gewijzigd, gedraaid of opnieuw gedeployed.
